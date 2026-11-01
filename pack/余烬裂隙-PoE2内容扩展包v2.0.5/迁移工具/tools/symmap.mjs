#!/usr/bin/env node
/**
 * symmap.mjs — OLD(v1.04 base) ↔ NEW(new base) internal identifier mapper.
 *
 * Pure offline static analysis of the two extracted main IIFEs.
 * Uses acorn (installed under tools/jstools/node_modules).
 *
 * Usage (from anywhere):
 *   node symmap.mjs stats            # parse + binding/canon statistics only
 *   node symmap.mjs probe <OLDNAME>  # top candidates for one OLD binding (with sources)
 *   node symmap.mjs run              # full pipeline -> out/symbol_map.json + out/symbol_map_report.md
 *
 * Method (each phase only emits evidence it actually verified):
 *   1. parse both main IIFEs, collect IIFE-scope bindings (functions/objects/arrays/literals)
 *   2. canonicalise every function: bound locals renumbered deterministically by declaration
 *      order ($<scopeDepth>_<i>), free references kept by name (@name), property keys /
 *      literals / operators preserved verbatim
 *   3. exact canonical match (also re-run as a fixpoint after names get mapped)      -> high
 *   4. clone fingerprint match: IDF-weighted Jaccard over *invariant* tokens
 *      (property names, object-literal keys, string/number literals — none of these are
 *      renamed between builds), mutual-best + runner-up margin                       -> high/medium
 *   5. declaration-order anchors disambiguate duplicate canonical signatures         -> medium
 *   6. aligned-reference voting in matched function pairs (corroboration / promotion)
 *   Anything not proven stays unresolved; no low-confidence guesses are emitted.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const acorn = require("./jstools/node_modules/acorn");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(PORT, "out");
const FILES = {
  old: path.join(OUT_DIR, "old.js"),
  new: path.join(OUT_DIR, "new.js"),
  cur: path.join(OUT_DIR, "cur.js"),
};
const DELTA_JSON = path.join(OUT_DIR, "delta_OLD_CUR.json");
const HARNESS = "C:/Users/33266/AppData/Local/Temp/dsh-e951uk/er-dom/harness.cjs";
const OUT_JSON = path.join(OUT_DIR, "symbol_map.json");
const OUT_MD = path.join(OUT_DIR, "symbol_map_report.md");

const SKIP_KEYS = new Set(["type", "start", "end", "loc", "range", "raw"]);

// --------------------------------------------------------------------------- utils

const readText = (p) => fs.readFileSync(p, "utf8");

function lineIndex(code) {
  const starts = [0];
  for (let i = 0; i < code.length; i++) if (code.charCodeAt(i) === 10) starts.push(i + 1);
  return starts;
}

function lineAt(starts, offset) {
  let lo = 0;
  let hi = starts.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (starts[mid] <= offset) lo = mid;
    else hi = mid - 1;
  }
  return lo + 1;
}

function keyName(k) {
  if (!k) return "<none>";
  if (k.type === "Identifier") return k.name;
  if (k.type === "PrivateIdentifier") return "#" + k.name;
  if (k.type === "Literal") return String(k.value);
  if (k.type === "TemplateLiteral" && k.quasis.length === 1) return String(k.quasis[0].value.cooked);
  return "?";
}

function patternNames(p, acc = []) {
  if (!p) return acc;
  switch (p.type) {
    case "Identifier":
      acc.push(p.name);
      break;
    case "ObjectPattern":
      for (const prop of p.properties) {
        if (prop.type === "RestElement") patternNames(prop.argument, acc);
        else patternNames(prop.value, acc);
      }
      break;
    case "ArrayPattern":
      for (const el of p.elements) patternNames(el, acc);
      break;
    case "AssignmentPattern":
      patternNames(p.left, acc);
      break;
    case "RestElement":
      patternNames(p.argument, acc);
      break;
  }
  return acc;
}

// --------------------------------------------------------------------------- parse

function parseIife(code, label) {
  const t0 = Date.now();
  const ast = acorn.parse(code, {
    ecmaVersion: "latest",
    allowHashBang: true,
    allowReturnOutsideFunction: true,
  });
  let best = null;
  for (const st of ast.body) {
    if (st.type !== "ExpressionStatement") continue;
    const e = st.expression;
    if (e.type !== "CallExpression") continue;
    const c = e.callee;
    if (!c || (c.type !== "ArrowFunctionExpression" && c.type !== "FunctionExpression")) continue;
    if (!c.body || c.body.type !== "BlockStatement") continue;
    if (!best || c.body.body.length > best.fn.body.body.length) best = { st, fn: c };
  }
  if (!best) throw new Error(label + ": main IIFE not found");
  return { ast, iife: best.fn, body: best.fn.body.body, code, lineStarts: lineIndex(code), parseMs: Date.now() - t0 };
}

// --------------------------------------------------------------------------- binding collection

/** IIFE-function-scope bindings, in declaration order. Stops at nested function boundaries. */
function collectGlobals(bodyStmts) {
  const out = [];
  const seen = new Set();
  const add = (b) => {
    if (seen.has(b.name)) return;
    seen.add(b.name);
    b.idx = out.length;
    out.push(b);
  };
  const kindOf = (init, declType) => {
    if (declType === "FunctionDeclaration") return "function";
    if (declType === "ClassDeclaration") return "class";
    if (!init) return "undefined";
    switch (init.type) {
      case "ObjectExpression":
        return "object";
      case "ArrayExpression":
        return "array";
      case "FunctionExpression":
      case "ArrowFunctionExpression":
        return "function";
      case "Literal":
        if (init.regex) return "regexp";
        if (typeof init.value === "number") return "number";
        if (typeof init.value === "string") return "string";
        if (typeof init.value === "boolean") return "boolean";
        if (init.value === null) return "null";
        return "literal";
      case "UnaryExpression":
        if (init.operator === "-" && init.argument.type === "Literal" && typeof init.argument.value === "number") return "number";
        return "expression";
      case "Identifier":
        return "alias";
      default:
        return "expression";
    }
  };
  function walk(node) {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      for (const x of node) walk(x);
      return;
    }
    if (!node.type) return;
    const t = node.type;
    if (t === "FunctionDeclaration") {
      if (node.id && node.id.type === "Identifier") add({ name: node.id.name, kind: "function", node, init: null, line: node.id.start });
      return;
    }
    if (t === "FunctionExpression" || t === "ArrowFunctionExpression") return;
    if (t === "ClassDeclaration") {
      if (node.id && node.id.type === "Identifier") add({ name: node.id.name, kind: "class", node, init: null, line: node.id.start });
      return;
    }
    if (t === "ClassExpression") return;
    if (t === "VariableDeclaration") {
      for (const d of node.declarations) {
        if (d.id.type === "Identifier") add({ name: d.id.name, kind: kindOf(d.init, null), node: d, init: d.init, line: d.id.start });
        else for (const nm of patternNames(d.id)) add({ name: nm, kind: "destructured", node: d, init: d.init, line: d.id.start });
      }
      return;
    }
    for (const k of Object.keys(node)) {
      if (SKIP_KEYS.has(k)) continue;
      const v = node[k];
      if (v && typeof v === "object") walk(v);
    }
  }
  for (const st of bodyStmts) walk(st);
  return out;
}

// --------------------------------------------------------------------------- canonicalisation

function createCanon() {
  function bindPattern(p, add) {
    if (!p) return;
    switch (p.type) {
      case "Identifier":
        add(p.name);
        break;
      case "ObjectPattern":
        for (const prop of p.properties) {
          if (prop.type === "RestElement") bindPattern(prop.argument, add);
          else bindPattern(prop.value, add);
        }
        break;
      case "ArrayPattern":
        for (const el of p.elements) bindPattern(el, add);
        break;
      case "AssignmentPattern":
        bindPattern(p.left, add);
        break;
      case "RestElement":
        bindPattern(p.argument, add);
        break;
    }
  }

  function collectDecls(node, add) {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      for (const x of node) collectDecls(x, add);
      return;
    }
    if (!node.type) return;
    switch (node.type) {
      case "VariableDeclaration":
        for (const d of node.declarations) bindPattern(d.id, add);
        for (const d of node.declarations) if (d.init) collectDecls(d.init, add);
        return;
      case "FunctionDeclaration":
        if (node.id) add(node.id.name);
        return;
      case "FunctionExpression":
      case "ArrowFunctionExpression":
      case "ClassExpression":
        return;
      case "ClassDeclaration":
        if (node.id) add(node.id.name);
        return;
      case "CatchClause":
        if (node.param) bindPattern(node.param, add);
        collectDecls(node.body, add);
        return;
      default:
        for (const k of Object.keys(node)) {
          if (SKIP_KEYS.has(k)) continue;
          const v = node[k];
          if (v && typeof v === "object") collectDecls(v, add);
        }
    }
  }

  function makeScope(fnNode, parent) {
    const map = new Map();
    const add = (name) => {
      if (map.has(name)) return;
      map.set(name, map.size + 1);
    };
    if (fnNode.params) for (const p of fnNode.params) bindPattern(p, add);
    if ((fnNode.type === "FunctionExpression" || fnNode.type === "ClassExpression") && fnNode.id) add(fnNode.id.name);
    if (fnNode.body && fnNode.body.type === "BlockStatement") for (const st of fnNode.body.body) collectDecls(st, add);
    return { parent, depth: parent ? parent.depth + 1 : 0, map };
  }

  function resolve(scope, name) {
    let s = scope;
    while (s) {
      if (s.map.has(name)) return "$" + s.depth + "_" + s.map.get(name);
      s = s.parent;
    }
    return "@" + name;
  }

  function litToken(node) {
    if (node.type === "Literal") {
      if (node.regex) return "R:" + node.regex.pattern + "/" + node.regex.flags;
      if (node.value === null) return "null";
      if (typeof node.value === "string") return "S" + JSON.stringify(node.value);
      if (typeof node.value === "number") return "N" + node.value;
      if (typeof node.value === "boolean") return "B" + node.value;
      if (node.bigint !== undefined) return "BI" + node.bigint;
      return "L?" + String(node.value);
    }
    if (node.type === "StringLiteral") return "S" + JSON.stringify(node.value);
    if (node.type === "NumericLiteral") return "N" + node.value;
    if (node.type === "BooleanLiteral") return "B" + node.value;
    if (node.type === "NullLiteral") return "null";
    if (node.type === "RegExpLiteral") return "R:" + node.pattern + "/" + node.flags;
    return "L?" + node.type;
  }

  function canonPattern(p, scope, out) {
    if (!p) {
      out.push("<none>");
      return;
    }
    switch (p.type) {
      case "Identifier":
        out.push("B(" + resolve(scope, p.name) + ")");
        return;
      case "ObjectPattern":
        out.push("OP(");
        for (const prop of p.properties) {
          if (prop.type === "RestElement") {
            out.push("rest");
            canonPattern(prop.argument, scope, out);
            continue;
          }
          if (prop.computed) {
            out.push("[");
            canonNode(prop.key, scope, out, null);
            out.push("]");
          } else out.push("k:" + keyName(prop.key));
          canonPattern(prop.value, scope, out);
        }
        out.push(")");
        return;
      case "ArrayPattern":
        out.push("AP(");
        for (const el of p.elements) canonPattern(el, scope, out);
        out.push(")");
        return;
      case "AssignmentPattern":
        out.push("DP(");
        canonPattern(p.left, scope, out);
        canonNode(p.right, scope, out, null);
        out.push(")");
        return;
      case "RestElement":
        out.push("RE(");
        canonPattern(p.argument, scope, out);
        out.push(")");
        return;
      default:
        out.push("P?(" + p.type + ")");
    }
  }

  function canonFunctionLike(node, scope, out) {
    const child = makeScope(node, scope);
    out.push(node.type === "ArrowFunctionExpression" ? "AF" : "FN");
    out.push(node.async ? "a" : "");
    out.push(node.generator ? "g" : "");
    out.push(node.expression ? "e" : "d");
    out.push("(");
    for (const p of node.params) canonPattern(p, child, out);
    out.push(")=>(");
    if (node.body.type === "BlockStatement") {
      for (const st of node.body.body) canonNode(st, child, out, null);
    } else {
      out.push("rt:");
      canonNode(node.body, child, out, null);
    }
    out.push(")");
  }

  function canonNode(node, scope, out, role) {
    if (node === null || node === undefined) {
      out.push("<none>");
      return;
    }
    if (Array.isArray(node)) {
      out.push("[");
      for (const x of node) canonNode(x, scope, out, null);
      out.push("]");
      return;
    }
    if (typeof node !== "object") {
      out.push(JSON.stringify(node));
      return;
    }
    const t = node.type;
    if (!t) return;
    switch (t) {
      case "Identifier":
        if (role === "key") out.push("K:" + node.name);
        else if (role === "label") out.push("Lbl:" + node.name);
        else out.push("R:" + resolve(scope, node.name));
        return;
      case "PrivateIdentifier":
        out.push("K:#" + node.name);
        return;
      case "Literal":
      case "StringLiteral":
      case "NumericLiteral":
      case "BooleanLiteral":
      case "NullLiteral":
      case "RegExpLiteral":
        out.push(litToken(node));
        return;
      case "TemplateElement":
        out.push("TE" + JSON.stringify(node.value.cooked) + (node.value.tail ? "t" : ""));
        return;
      case "FunctionDeclaration":
      case "FunctionExpression":
      case "ArrowFunctionExpression":
        canonFunctionLike(node, scope, out);
        return;
      case "ClassDeclaration":
      case "ClassExpression": {
        const child = makeScope(node, scope);
        out.push("CL(");
        if (node.id) out.push("name:" + resolve(child, node.id.name));
        out.push("extends:");
        canonNode(node.superClass, scope, out, null);
        for (const b of node.body.body) canonNode(b, child, out, null);
        out.push(")");
        return;
      }
      case "VariableDeclaration":
        out.push("Var(" + node.kind + ":");
        for (const d of node.declarations) {
          canonPattern(d.id, scope, out);
          out.push("=");
          canonNode(d.init, scope, out, null);
          out.push(",");
        }
        out.push(")");
        return;
      case "Property":
        out.push("Prop(");
        out.push(node.computed ? "c" : "s");
        out.push(node.kind || "init");
        out.push(":");
        if (node.computed) canonNode(node.key, scope, out, null);
        else out.push(keyName(node.key));
        out.push("=");
        canonNode(node.value, scope, out, null);
        out.push(")");
        return;
      case "MethodDefinition":
      case "PropertyDefinition":
        out.push("Mem(" + (node.computed ? "c" : "s") + ":");
        if (node.computed) canonNode(node.key, scope, out, null);
        else out.push(keyName(node.key));
        out.push("=");
        canonNode(node.value, scope, out, null);
        out.push(")");
        return;
      case "MemberExpression":
      case "OptionalMemberExpression":
        out.push("ME(");
        canonNode(node.object, scope, out, null);
        out.push(node.computed ? "[" : ".");
        if (node.computed) canonNode(node.property, scope, out, null);
        else out.push(keyName(node.property));
        out.push(")");
        return;
      case "LabeledStatement":
        out.push("Lab(" + node.label.name + ":");
        canonNode(node.body, scope, out, null);
        out.push(")");
        return;
      case "BreakStatement":
      case "ContinueStatement":
        out.push(t + "(" + (node.label ? node.label.name : "") + ")");
        return;
      case "CatchClause": {
        const blockScope = { parent: scope, depth: scope.depth, map: new Map() };
        if (node.param) {
          const add = (n) => {
            if (!blockScope.map.has(n)) blockScope.map.set(n, blockScope.map.size + 1);
          };
          bindPattern(node.param, add);
        }
        out.push("Catch(");
        canonPattern(node.param, blockScope, out);
        out.push(":");
        canonNode(node.body, blockScope, out, null);
        out.push(")");
        return;
      }
      default: {
        out.push(t + "{");
        const keys = Object.keys(node).filter((k) => !SKIP_KEYS.has(k)).sort();
        for (const k of keys) {
          const v = node[k];
          if (v === undefined) continue;
          out.push(k + ":");
          if (Array.isArray(v)) {
            out.push("[");
            for (const x of v) canonNode(x, scope, out, null);
            out.push("]");
          } else if (v && typeof v === "object" && v.type) {
            canonNode(v, scope, out, null);
          } else {
            out.push(JSON.stringify(v));
          }
          out.push(";");
        }
        out.push("}");
      }
    }
  }

  return {
    functionSignature(fnNode, parentScope) {
      const out = [];
      canonFunctionLike(fnNode, parentScope, out);
      return out.join("");
    },
    expressionSignature(expr, parentScope, tag) {
      const out = [tag || "E"];
      canonNode(expr, parentScope, out, null);
      return out.join("");
    },
    makeRootScope(globals) {
      const map = new Map();
      for (const g of globals) if (!map.has(g.name)) map.set(g.name, map.size + 1);
      return { parent: null, depth: -1, map };
    },
  };
}

// --------------------------------------------------------------------------- invariant tokens

/**
 * Tokens that survive re-minification untouched: member property names, object-literal keys,
 * string literals, numeric literals.  Used for IDF-weighted clone similarity.
 */
function invariantTokens(rootNode) {
  const toks = [];
  function walk(n) {
    if (!n || typeof n !== "object") return;
    if (Array.isArray(n)) {
      for (const x of n) walk(x);
      return;
    }
    if (!n.type) return;
    switch (n.type) {
      case "MemberExpression":
      case "OptionalMemberExpression": {
        if (!n.computed && n.property) toks.push("p:" + keyName(n.property));
        walk(n.object);
        if (n.computed) walk(n.property);
        return;
      }
      case "Property": {
        if (!n.computed) toks.push("k:" + keyName(n.key));
        else walk(n.key);
        walk(n.value);
        return;
      }
      case "MethodDefinition":
      case "PropertyDefinition": {
        if (!n.computed) toks.push("k:" + keyName(n.key));
        else walk(n.key);
        walk(n.value);
        return;
      }
      case "Literal":
        if (typeof n.value === "string") {
          if (n.value.length >= 2 && n.value.length <= 80) toks.push("s:" + n.value);
        } else if (typeof n.value === "number") toks.push("n:" + n.value);
        else if (n.value === null) toks.push("null");
        return;
      case "TemplateElement":
        if (typeof n.value.cooked === "string" && n.value.cooked.length >= 2) toks.push("t:" + n.value.cooked);
        return;
    }
    for (const k of Object.keys(n)) {
      if (SKIP_KEYS.has(k)) continue;
      const v = n[k];
      if (v && typeof v === "object") walk(v);
    }
  }
  walk(rootNode);
  return toks;
}

/** free global references inside one function (ordered), plus call-position flag */
function collectFreeRefs(fnNode, rootNames) {
  const refs = [];
  function walk(n) {
    if (!n || typeof n !== "object") return;
    if (Array.isArray(n)) {
      for (const x of n) walk(x);
      return;
    }
    if (!n.type) return;
    switch (n.type) {
      case "Identifier":
        if (rootNames.has(n.name)) refs.push(n.name);
        return;
      case "MemberExpression":
      case "OptionalMemberExpression":
        walk(n.object);
        if (n.computed) walk(n.property);
        return;
      case "Property":
        if (n.computed) walk(n.key);
        walk(n.value);
        return;
      case "MethodDefinition":
      case "PropertyDefinition":
        if (n.computed) walk(n.key);
        walk(n.value);
        return;
      case "LabeledStatement":
        walk(n.body);
        return;
      case "BreakStatement":
      case "ContinueStatement":
        return;
    }
    for (const k of Object.keys(n)) {
      if (SKIP_KEYS.has(k)) continue;
      const v = n[k];
      if (v && typeof v === "object") walk(v);
    }
  }
  walk(fnNode.body);
  return refs;
}

// --------------------------------------------------------------------------- root-reference resolution (scope aware)

/**
 * Resolve identifier references in a parsed IIFE: returns a Map name -> array of offsets
 * for references that resolve to the IIFE (root) scope.  Correct shadowing is essential for
 * deciding which names the v1.04 delta code actually pulls from the base.
 */
function collectRootRefs(iife, rootNames) {
  const hits = new Map();
  function declNamesInFunction(fnNode) {
    const set = new Set();
    const add = (n) => set.add(n);
    if (fnNode.params) for (const p of fnNode.params) patternNames(p).forEach(add);
    if ((fnNode.type === "FunctionExpression" || fnNode.type === "ClassExpression") && fnNode.id) add(fnNode.id.name);
    const walkDecl = (n) => {
      if (!n || typeof n !== "object") return;
      if (Array.isArray(n)) {
        for (const x of n) walkDecl(x);
        return;
      }
      if (!n.type) return;
      if (n.type === "VariableDeclaration") {
        for (const d of n.declarations) patternNames(d.id).forEach(add);
        for (const d of n.declarations) if (d.init) walkDecl(d.init);
        return;
      }
      if (n.type === "FunctionDeclaration") {
        if (n.id) add(n.id.name);
        return;
      }
      if (n.type === "ClassDeclaration") {
        if (n.id) add(n.id.name);
        return;
      }
      if (n.type === "FunctionExpression" || n.type === "ArrowFunctionExpression" || n.type === "ClassExpression") return;
      if (n.type === "CatchClause") {
        if (n.param) patternNames(n.param).forEach(add);
        walkDecl(n.body);
        return;
      }
      for (const k of Object.keys(n)) {
        if (SKIP_KEYS.has(k)) continue;
        const v = n[k];
        if (v && typeof v === "object") walkDecl(v);
      }
    };
    if (fnNode.body && fnNode.body.type === "BlockStatement") for (const st of fnNode.body.body) walkDecl(st);
    return set;
  }

  function isLocal(stack, name) {
    for (let i = stack.length - 1; i >= 0; i--) if (stack[i].has(name)) return true;
    return false;
  }

  function visit(node, stack, role) {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      for (const x of node) visit(x, stack, null);
      return;
    }
    if (!node.type) return;
    switch (node.type) {
      case "Identifier":
        if (role === "key" || role === "label") return;
        if (!isLocal(stack, node.name) && rootNames.has(node.name)) {
          if (!hits.has(node.name)) hits.set(node.name, []);
          hits.get(node.name).push(node.start);
        }
        return;
      case "MemberExpression":
      case "OptionalMemberExpression":
        visit(node.object, stack, null);
        if (node.computed) visit(node.property, stack, null);
        else if (node.property && node.property.type === "PrivateIdentifier") void 0;
        return;
      case "Property":
        if (node.computed) visit(node.key, stack, null);
        visit(node.value, stack, null);
        return;
      case "MethodDefinition":
      case "PropertyDefinition":
        if (node.computed) visit(node.key, stack, null);
        visit(node.value, stack, null);
        return;
      case "LabeledStatement":
        visit(node.body, stack, null);
        return;
      case "BreakStatement":
      case "ContinueStatement":
        return;
      case "VariableDeclaration":
        for (const d of node.declarations) {
          visitPatternDefaults(d.id, stack);
          if (d.init) visit(d.init, stack, null);
        }
        return;
      case "FunctionDeclaration":
      case "FunctionExpression":
      case "ArrowFunctionExpression": {
        const s = declNamesInFunction(node);
        const st = stack.concat([s]);
        for (const p of node.params) visitPatternDefaults(p, st);
        if (node.body.type === "BlockStatement") for (const b of node.body.body) visit(b, st, null);
        else visit(node.body, st, null);
        return;
      }
      case "ClassDeclaration":
      case "ClassExpression": {
        const s = new Set();
        if (node.id) s.add(node.id.name);
        const st = stack.concat([s]);
        visit(node.superClass, stack, null);
        for (const b of node.body.body) visit(b, st, null);
        return;
      }
      case "CatchClause": {
        const s = new Set(patternNames(node.param));
        const st = stack.concat([s]);
        visitPatternDefaults(node.param, st);
        visit(node.body, st, null);
        return;
      }
    }
    for (const k of Object.keys(node)) {
      if (SKIP_KEYS.has(k)) continue;
      const v = node[k];
      if (v && typeof v === "object") visit(v, stack, null);
    }
  }

  function visitPatternDefaults(p, stack) {
    if (!p || typeof p !== "object") return;
    switch (p.type) {
      case "AssignmentPattern":
        visitPatternDefaults(p.left, stack);
        visit(p.right, stack, null);
        return;
      case "ObjectPattern":
        for (const prop of p.properties) {
          if (prop.type === "RestElement") visitPatternDefaults(prop.argument, stack);
          else {
            if (prop.computed) visit(prop.key, stack, null);
            visitPatternDefaults(prop.value, stack);
          }
        }
        return;
      case "ArrayPattern":
        for (const el of p.elements) visitPatternDefaults(el, stack);
        return;
      case "RestElement":
        visitPatternDefaults(p.argument, stack);
        return;
    }
  }

  for (const st of iife.body.body) visit(st, [], null);
  return hits;
}

// --------------------------------------------------------------------------- descriptors

function collectStringLiterals(node, acc) {
  if (!node || typeof node !== "object") return acc;
  if (Array.isArray(node)) {
    for (const x of node) collectStringLiterals(x, acc);
    return acc;
  }
  if (node.type === "Literal" && typeof node.value === "string") acc.push(node.value);
  else if (node.type === "TemplateElement" && typeof node.value.cooked === "string") acc.push(node.value.cooked);
  for (const k of Object.keys(node)) {
    if (SKIP_KEYS.has(k)) continue;
    const v = node[k];
    if (v && typeof v === "object") collectStringLiterals(v, acc);
  }
  return acc;
}

function objectDeepKeys(init) {
  const top = [];
  const deep = new Set();
  if (!init || init.type !== "ObjectExpression") return { top, deep };
  function walkObj(obj, prefix, depth) {
    for (const prop of obj.properties) {
      if (prop.type !== "Property" || prop.computed) continue;
      const kn = prop.key.type === "Identifier" ? prop.key.name : prop.key.type === "Literal" ? String(prop.key.value) : null;
      if (kn == null) continue;
      const full = prefix ? prefix + "." + kn : kn;
      if (depth === 0) top.push(kn);
      deep.add(full);
      if (prop.value && prop.value.type === "ObjectExpression" && depth < 1) walkObj(prop.value, full, depth + 1);
    }
  }
  walkObj(init, "", 0);
  return { top, deep };
}

function arrayLiterals(init) {
  const strings = [];
  const nums = [];
  if (!init || init.type !== "ArrayExpression") return { strings, nums };
  for (const el of init.elements) {
    if (!el) continue;
    if (el.type === "Literal" && typeof el.value === "string") strings.push(el.value);
    else if (el.type === "Literal" && typeof el.value === "number") nums.push(el.value);
  }
  return { strings, nums };
}

function buildDescriptors(parsed, label) {
  const canon = createCanon();
  const globals = collectGlobals(parsed.body);
  const rootScope = canon.makeRootScope(globals);
  const rootNames = new Set(globals.map((g) => g.name));
  const byName = new Map();
  const list = [];
  for (const g of globals) {
    const d = {
      name: g.name,
      kind: g.kind,
      idx: g.idx,
      label,
      node: g.node,
      init: g.init,
      line: lineAt(parsed.lineStarts, g.line),
    };
    const rootNode = g.init || g.node;
    d.tokens = invariantTokens(rootNode);
    d.strings = collectStringLiterals(rootNode, []);
    d.size = rootNode ? rootNode.end - rootNode.start : 0;
    d.refs = [];
    if (g.kind === "function") {
      d.fn = rootNode;
      d.sig = canon.functionSignature(rootNode, rootScope);
      d.refs = collectFreeRefs(rootNode, rootNames);
    } else if (g.kind === "object") {
      d.sig = canon.expressionSignature(g.init, rootScope, "O");
      const ok = objectDeepKeys(g.init);
      d.keys = ok.top;
      d.deepKeys = [...ok.deep];
    } else if (g.kind === "array") {
      d.sig = canon.expressionSignature(g.init, rootScope, "A");
      const al = arrayLiterals(g.init);
      d.arrayStrings = al.strings;
      d.arrayNums = al.nums;
    } else if (g.init) {
      d.sig = canon.expressionSignature(g.init, rootScope, "E");
      if (g.kind === "string" || g.kind === "number") d.value = g.init.value;
      if (g.kind === "alias") d.aliasOf = g.init.name;
    } else {
      d.sig = "U";
    }
    byName.set(g.name, d);
    list.push(d);
  }
  return { parsed, globals, rootScope, rootNames, byName, list, canon };
}

// --------------------------------------------------------------------------- similarity

function idfWeights(docs) {
  const df = new Map();
  for (const toks of docs) {
    for (const t of new Set(toks)) df.set(t, (df.get(t) || 0) + 1);
  }
  const N = docs.length;
  const w = new Map();
  for (const [t, c] of df) w.set(t, Math.log((N + 1) / (c + 1)) + 0.05);
  return w;
}

function weightedSim(tokensA, tokensB) {
  // A,B: Map token->weight? here pass token arrays; weights global
  throw new Error("use closure");
}

/** Build matcher over two descriptor lists that share an invariant-token vocabulary. */
function makeTokenizerMatcher(oldList, newList) {
  const docs = [...oldList, ...newList].map((d) => d.tokens);
  const w = idfWeights(docs);
  const prep = (d) => {
    const counts = new Map();
    for (const t of d.tokens) counts.set(t, (counts.get(t) || 0) + 1);
    let total = 0;
    for (const [t, c] of counts) total += (w.get(t) || 0.05) * Math.min(c, 3);
    return { counts, total };
  };
  const oldPrep = new Map();
  const newPrep = new Map();
  for (const d of oldList) oldPrep.set(d.name, prep(d));
  for (const d of newList) newPrep.set(d.name, prep(d));
  // inverted index over new docs (only distinctive tokens)
  const index = new Map();
  for (const d of newList) {
    for (const t of new Set(d.tokens)) {
      const wt = w.get(t) || 0.05;
      if (wt < 0.8) continue;
      if (!index.has(t)) index.set(t, []);
      index.get(t).push(d.name);
    }
  }
  function candidates(oldD) {
    const op = oldPrep.get(oldD.name);
    if (!op) return [];
    const shared = new Map();
    for (const [t, c] of op.counts) {
      const wt = w.get(t) || 0.05;
      if (wt < 0.8) continue;
      const arr = index.get(t);
      if (!arr) continue;
      for (const nm of arr) shared.set(nm, (shared.get(nm) || 0) + wt * Math.min(c, 3));
    }
    const scored = [];
    for (const [nm, sw] of shared) {
      const np = newPrep.get(nm);
      if (!np) continue;
      const contOld = sw / Math.max(0.001, op.total); // how much of OLD's distinctive tokens the NEW candidate covers
      const contNew = sw / Math.max(0.001, np.total);
      const dice = (2 * sw) / Math.max(0.001, op.total + np.total);
      // asymmetric clone score: OLD coverage matters most (NEW is usually the grown version)
      const score = 0.7 * contOld + 0.3 * dice;
      scored.push({ name: nm, score, sim: dice, shared: sw, contOld, contNew, oldTotal: op.total, newTotal: np.total });
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 30);
  }
  return { candidates, weight: w };
}

function diceStr(a, b) {
  const A = new Set(a);
  const B = new Set(b);
  if (!A.size && !B.size) return 1;
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  return (2 * inter) / (A.size + B.size);
}

function jaccard(a, b) {
  const A = new Set(a);
  const B = new Set(b);
  if (!A.size && !B.size) return 1;
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  return inter / (A.size + B.size - inter);
}

// --------------------------------------------------------------------------- pipeline bits

function evStrings(strings, max = 4) {
  const uniq = [...new Set(strings || [])].filter((s) => s && s.length <= 40);
  return uniq.slice(0, max).map((s) => JSON.stringify(s)).join(",") || "none";
}

function evKeys(d) {
  const keys = d.deepKeys || d.keys || [];
  const uniq = [...new Set(keys.map((k) => k.split(".").pop()))];
  const pick = uniq.filter((k) => k.length >= 3).slice(0, 8);
  return pick.join(",") || "none";
}

function substituteSig(sig, mapping, toNew) {
  return sig.replace(/@([A-Za-z_$][\w$]*)/g, (m0, nm) => {
    if (toNew) {
      if (!mapping.has(nm)) return m0;
      return "@" + mapping.get(nm).new;
    }
    return m0;
  });
}

function collectAtNames(sig) {
  const names = [];
  const re = /@([A-Za-z_$][\w$]*)/g;
  let m;
  while ((m = re.exec(sig))) names.push(m[1]);
  return names;
}

function countKinds(list) {
  const out = {};
  for (const d of list) out[d.kind] = (out[d.kind] || 0) + 1;
  return out;
}

// --------------------------------------------------------------------------- pipeline

const WRAP_TARGETS = [
  "hn", "Ee", "fe", "Tt", "ro", "ih", "Fc", "Jb", "Ay", "fi",
  "Qv", "Vs", "qv", "br", "Ro", "R2", "x1", "Cx", "ji", "ui", "xt", "We", "ka",
];

function runPipeline() {
  const stats = {};
  const parsedOld = parseIife(readText(FILES.old), "old");
  const parsedNew = parseIife(readText(FILES.new), "new");
  const parsedCur = parseIife(readText(FILES.cur), "cur");
  stats.parse = { oldMs: parsedOld.parseMs, newMs: parsedNew.parseMs, curMs: parsedCur.parseMs };

  const oldD = buildDescriptors(parsedOld, "old");
  const newD = buildDescriptors(parsedNew, "new");
  const curD = buildDescriptors(parsedCur, "cur");
  stats.bindings = { old: oldD.list.length, new: newD.list.length, cur: curD.list.length };
  stats.kinds = { old: countKinds(oldD.list), new: countKinds(newD.list) };

  const mapping = new Map();
  const usedNew = new Set();
  const notes = [];
  const conflicts = [];
  const phaseStats = {};

  function addMap(oldName, newName, opts) {
    if (mapping.has(oldName)) return false;
    if (usedNew.has(newName)) {
      notes.push(`skip ${oldName}->${newName}: NEW name already mapped`);
      return false;
    }
    mapping.set(oldName, { new: newName, ...opts });
    usedNew.add(newName);
    return true;
  }

  const fnOld = oldD.list.filter((d) => d.kind === "function");
  const fnNew = newD.list.filter((d) => d.kind === "function");
  const objOld = oldD.list.filter((d) => d.kind === "object" || d.kind === "array");
  const objNew = newD.list.filter((d) => d.kind === "object" || d.kind === "array");
  const fnMatcher = makeTokenizerMatcher(fnOld, fnNew);
  const objMatcher = makeTokenizerMatcher(objOld, objNew);

  const exactStrong = () =>
    matchExact(oldD, newD, mapping, addMap, { kinds: ["function", "object", "array"], minLen: 24 });
  const exactWeak = () =>
    matchExact(oldD, newD, mapping, addMap, { kinds: ["expression", "alias"], minLen: 6, requireMappedRef: true });
  const fpFn = (allowMedium) =>
    matchFingerprint(fnOld, fnNew, fnMatcher, mapping, addMap, {
      high: 0.62,
      highMargin: 0.1,
      medium: 0.48,
      mediumMargin: 0.08,
      minShared: 3.5,
      minTokens: 8,
      allowMedium,
    });
  const fpObj = (allowMedium) =>
    matchFingerprint(objOld, objNew, objMatcher, mapping, addMap, {
      high: 0.66,
      highMargin: 0.12,
      medium: 0.5,
      mediumMargin: 0.08,
      minShared: 3.0,
      minTokens: 4,
      allowMedium,
    });

  /** merge skeleton-reference votes and matched-pair reference votes, then add medium mappings */
  function votePhase(minCount, minShare, label) {
    const skV = skeletonVotes(oldD, newD);
    const rvV = referenceVotes(oldD, newD, mapping);
    const merged = new Map();
    const bump = (on, nn, c) => {
      if (mapping.has(on)) return;
      if (on === nn) return;
      if (usedNew.has(nn)) return;
      if (!merged.has(on)) merged.set(on, new Map());
      const m = merged.get(on);
      m.set(nn, (m.get(nn) || 0) + (c || 1));
    };
    for (const [on, m] of skV) for (const [nn, c] of m) bump(on, nn, c);
    for (const [on, cand] of rvV) if (cand.best) bump(on, cand.best.name, cand.best.count);
    let added = 0;
    const details = [];
    for (const [on, m] of merged) {
      if (mapping.has(on)) continue;
      let total = 0;
      let best = null;
      for (const [nn, c] of m) {
        total += c;
        if (!best || c > best.count) best = { name: nn, count: c };
      }
      if (!best) continue;
      const share = best.count / total;
      if (best.count >= minCount && share >= minShare) {
        const d = oldD.byName.get(on);
        if (!d) continue;
        const ok = addMap(on, best.name, {
          kind: d.kind,
          evidence: `${label}: ${best.count}/${total} aligned free references across matched functions point to ${best.name}`,
          confidence: "medium",
          method: "ref-vote",
          size: d.size,
        });
        if (ok) {
          added++;
          details.push(`${on}->${best.name}(${best.count}/${total})`);
        }
      }
    }
    phaseStats[label] = { added, details: details.slice(0, 40) };
    return added;
  }

  exactStrong();
  fpFn(true);
  fpObj(true);

  let round = 0;
  for (; round < 14; round++) {
    const before = mapping.size;
    exactStrong();
    exactWeak();
    fpFn(false);
    fpObj(false);
    votePhase(3, 0.9, "ref-vote-r" + round);
    if (mapping.size === before) break;
  }
  stats.fixpointRounds = round;

  // positional disambiguation of duplicate canonical signatures
  stats.position = matchByPosition(oldD, newD, mapping, addMap);
  // aliases (var X = <mapped global>)
  stats.alias = matchAliases(oldD, newD, mapping, addMap);
  exactStrong();
  exactWeak();

  // relaxed vote pass for stragglers (still reported as medium)
  let relaxed = 0;
  for (let i = 0; i < 3; i++) {
    const added = votePhase(2, 1.0, "ref-vote-relaxed" + i);
    if (!added) break;
    relaxed += added;
    exactStrong();
    exactWeak();
  }
  stats.relaxedVotes = relaxed;

  // ---------- verification: ref-alignment consistency per mapping (aggregate)
  const verify = verifyMappings(oldD, newD, mapping);
  const refSupport = new Map(); // oldName -> {known, consistent, inconsistent}
  for (const [oldName, v] of verify) {
    const e = mapping.get(oldName);
    if (!e) continue;
    e.support = v;
  }
  // aggregate support of a *name* across all matched pairs
  for (const [oName, v] of mapping) {
    const od = oldD.byName.get(oName);
    const nd = newD.byName.get(v.new);
    if (!od || !nd || od.kind !== "function" || nd.kind !== "function") continue;
    const or = od.refs || [];
    const nr = nd.refs || [];
    if (!or.length || or.length !== nr.length) continue;
    for (let i = 0; i < or.length; i++) {
      let expected = null;
      if (mapping.has(or[i])) expected = mapping.get(or[i]).new;
      else if (or[i] === nr[i]) expected = nr[i];
      if (!expected) continue;
      const tgt = or[i];
      if (!refSupport.has(tgt)) refSupport.set(tgt, { known: 0, consistent: 0, inconsistent: 0 });
      const st = refSupport.get(tgt);
      st.known++;
      if (expected === nr[i]) st.consistent++;
      else st.inconsistent++;
    }
  }
  for (const [name, v] of mapping) {
    const st = refSupport.get(name);
    if (!st) continue;
    v.refSupport = st;
    if (v.confidence === "medium" && st.known >= 3 && st.inconsistent === 0) {
      v.confidence = "high";
      v.evidence += `; corroborated: ${st.consistent}/${st.known} aligned references agree`;
    }
    if (st.inconsistent > 0 && st.inconsistent / Math.max(1, st.known) > 0.2) {
      conflicts.push({ old: name, new: v.new, detail: `${st.inconsistent}/${st.known} aligned refs disagree` });
    }
  }
  stats.verify = { checked: verify.size, conflicts: conflicts.length, refSupportNames: refSupport.size };

  // ---------- required coverage (lead's api_need.md is authoritative)
  const harness = requiredFromHarness();
  const apiNeed = requiredFromApiNeed();
  const apiSurface = requiredFromApiSurface();
  const oldNames = oldD.rootNames;
  const required = new Set();
  const needMissing = [];
  for (const n of apiNeed.names) {
    if (oldNames.has(n)) required.add(n);
    else needMissing.push(n);
  }
  for (const n of harness.names) if (oldNames.has(n)) required.add(n);
  const wrap = [];
  const wrapMissing = [];
  for (const n of WRAP_TARGETS) {
    if (oldNames.has(n)) wrap.push(n);
    else wrapMissing.push(n);
  }
  for (const n of wrap) required.add(n);
  const ownNames = apiSurface.names.filter((n) => !oldNames.has(n));

  const requiredList = [...required].sort();
  const covered = requiredList.filter((n) => mapping.has(n));
  const uncovered = requiredList.filter((n) => !mapping.has(n));
  const apiNeedCovered = apiNeed.names.filter((n) => mapping.has(n));

  const counts = { high: 0, medium: 0 };
  for (const v of mapping.values()) counts[v.confidence]++;
  const reqCounts = { high: 0, medium: 0 };
  for (const n of covered) reqCounts[mapping.get(n).confidence]++;
  const wrapCounts = { covered: 0, total: wrap.length, high: 0, medium: 0 };
  for (const n of wrap) {
    const m = mapping.get(n);
    if (m) {
      wrapCounts.covered++;
      wrapCounts[m.confidence]++;
    }
  }

  const unresolved = oldD.list
    .filter((d) => !mapping.has(d.name) && d.kind !== "undefined")
    .map((d) => ({
      name: d.name,
      kind: d.kind,
      size: d.size,
      line: d.line,
      required: required.has(d.name),
      reason: "no unique evidence",
    }))
    .sort((a, b) => b.required - a.required || b.size - a.size);

  return {
    parsed: { old: parsedOld, new: parsedNew, cur: parsedCur },
    oldD,
    newD,
    curD,
    mapping,
    stats: {
      ...stats,
      phaseStats,
      required: {
        total: requiredList.length,
        covered: covered.length,
        uncovered: uncovered.length,
        names: requiredList,
        missing: uncovered,
        apiNeed: { total: apiNeed.names.length, covered: apiNeedCovered.length, missing: apiNeed.names.filter((n) => !mapping.has(n)) },
        needMissing,
      },
      wrap: { targets: wrap, missing: wrapMissing, ...wrapCounts },
      harness: { total: harness.names.length, inOld: harness.names.filter((n) => oldNames.has(n)).length, own: harness.names.filter((n) => !oldNames.has(n)).sort() },
      apiSurface: { total: apiSurface.names.length, own: ownNames },
      confidence: counts,
      requiredConfidence: reqCounts,
    },
    unresolved,
    required,
    wrap,
    conflicts,
    notes,
    verify,
    harness,
    apiNeed,
  };
}

function requiredFromApiNeed() {
  const p = path.join(OUT_DIR, "api_need.md");
  try {
    const txt = readText(p);
    const detail = [];
    for (const line of txt.split("\n")) {
      const m = line.match(/^\|\s*`([^`]+)`\s*\|\s*([a-z]+)\s*\|\s*(\d+)\s*\|/);
      if (m) detail.push({ name: m[1], kind: m[2], used: +m[3] });
    }
    return { names: detail.map((d) => d.name), detail, error: null };
  } catch (e) {
    return { names: [], detail: [], error: String(e.message || e) };
  }
}

function requiredFromApiSurface() {
  const p = path.join(OUT_DIR, "api_surface.txt");
  try {
    const txt = readText(p);
    const names = [];
    for (const line of txt.split("\n")) {
      const m = line.match(/^([A-Za-z_$][\w$]*)\s+\d+\s*$/);
      if (m) names.push(m[1]);
    }
    return { names, error: null };
  } catch (e) {
    return { names: [], error: String(e.message || e) };
  }
}

function matchExact(oldD, newD, mapping, addMap, opts) {
  const kinds = new Set(opts.kinds || ["function"]);
  const minLen = opts.minLen ?? 24;
  const needRef = !!opts.requireMappedRef;
  const oldGroups = new Map();
  const newGroups = new Map();
  for (const d of oldD.list) {
    if (!kinds.has(d.kind) || !d.sig) continue;
    if (mapping.has(d.name)) continue;
    if (d.sig.length < minLen) continue;
    const key = substituteSig(d.sig, mapping, true);
    if (key === d.sig && needRef) continue; // nothing was substituted -> too weak
    if (!oldGroups.has(key)) oldGroups.set(key, []);
    oldGroups.get(key).push(d);
  }
  for (const d of newD.list) {
    if (!kinds.has(d.kind) || !d.sig) continue;
    if (d.sig.length < minLen) continue;
    if (!newGroups.has(d.sig)) newGroups.set(d.sig, []);
    newGroups.get(d.sig).push(d);
  }
  let added = 0;
  for (const [key, olds] of oldGroups) {
    const news = newGroups.get(key);
    if (!news) continue;
    if (olds.length !== 1 || news.length !== 1) continue;
    const o = olds[0];
    const n = news[0];
    const refs = collectAtNames(key);
    const evRefs = refs.filter((r) => mapping.has(r)).map((r) => `${r}->${mapping.get(r).new}`);
    if (
      addMap(o.name, n.name, {
        kind: o.kind,
        evidence:
          `alpha-exact ${o.kind} body match (${key.length} char canon; locals renumbered only)` +
          (evRefs.length ? `; refs: ${evRefs.slice(0, 6).join(",")}` : "") +
          `; literals: ${evStrings(o.strings, 3)}`,
        confidence: "high",
        method: "exact-canon",
        size: o.size,
      })
    )
      added++;
  }
  return added;
}

/**
 * Skeleton-reference votes: for function pairs whose canonical form is identical after
 * replacing every free reference with a placeholder (i.e. same code shape), align the
 * ordered free-reference lists and vote oldRef -> newRef position by position.
 */
function skeletonVotes(oldD, newD) {
  const newBySkel = new Map();
  for (const d of newD.list) {
    if (d.kind !== "function" || !d.sig) continue;
    if (d.sig.length < 120) continue;
    const sk = d.sig.replace(/@[A-Za-z_$][\w$]*/g, "@");
    if (!newBySkel.has(sk)) newBySkel.set(sk, []);
    newBySkel.get(sk).push(d);
  }
  const votes = new Map();
  let pairs = 0;
  for (const o of oldD.list) {
    if (o.kind !== "function" || !o.sig) continue;
    if (o.sig.length < 120) continue;
    const sk = o.sig.replace(/@[A-Za-z_$][\w$]*/g, "@");
    const cands = newBySkel.get(sk);
    if (!cands || cands.length !== 1) continue;
    const n = cands[0];
    const orefs = collectAtNames(o.sig);
    const nrefs = collectAtNames(n.sig);
    if (orefs.length !== nrefs.length) continue;
    pairs++;
    for (let i = 0; i < orefs.length; i++) {
      const on = orefs[i];
      const nn = nrefs[i];
      if (on === nn) continue;
      if (!votes.has(on)) votes.set(on, new Map());
      const m = votes.get(on);
      m.set(nn, (m.get(nn) || 0) + 1);
    }
  }
  votes.pairs = pairs;
  return votes;
}

function matchFingerprint(oldList, newList, matcher, mapping, addMap, cfg) {
  const oldBest = new Map();
  const newBest = new Map();
  const scoreOf = new Map(); // "old\0new" -> {score, contNew}
  for (const o of oldList) {
    if (mapping.has(o.name)) continue;
    if (o.tokens.length < cfg.minTokens) continue;
    const cands = matcher.candidates(o);
    for (const c of cands) scoreOf.set(o.name + "\u0000" + c.name, c);
    if (!cands.length) continue;
    oldBest.set(o.name, cands[0]);
  }
  const mappedNew = new Set([...mapping.values()].map((v) => v.new));
  for (const n of newList) {
    if (mappedNew.has(n.name)) continue;
    if (n.tokens.length < cfg.minTokens) continue;
    let best = null;
    for (const o of oldList) {
      if (mapping.has(o.name)) continue;
      const c = scoreOf.get(o.name + "\u0000" + n.name);
      if (!c) continue;
      if (!best || c.contNew > best.contNew) best = { name: o.name, contNew: c.contNew };
    }
    if (best && best.contNew >= 0.5) newBest.set(n.name, best);
  }
  let added = 0;
  for (const o of oldList) {
    if (mapping.has(o.name)) continue;
    const b = oldBest.get(o.name);
    if (!b) continue;
    const rev = newBest.get(b.name);
    if (!rev || rev.name !== o.name) continue; // require mutual best
    const cands = matcher.candidates(o);
    const second = cands.find((c) => c.name !== b.name);
    const margin = second ? b.score - second.score : 1;
    if (b.shared < cfg.minShared) continue;
    let conf = null;
    if (b.score >= cfg.high && margin >= cfg.highMargin) conf = "high";
    else if (b.score >= cfg.medium && margin >= cfg.mediumMargin && cfg.allowMedium !== false) conf = "medium";
    if (!conf) continue;
    const nd = newList.find((x) => x.name === b.name);
    const shared = sharedTokens(o, nd);
    if (
      addMap(o.name, b.name, {
        kind: o.kind,
        evidence:
          `clone fingerprint: OLD-token coverage ${b.contOld.toFixed(2)} / dice ${b.sim.toFixed(3)} ` +
          `(runner-up ${second ? second.score.toFixed(2) : "none"}); shared invariant tokens: ${shared.slice(0, 8).join(",") || "none"}; literals: ${evStrings(o.strings, 2)}`,
        confidence: conf,
        method: "fingerprint",
        size: o.size,
      })
    )
      added++;
  }
  return added;
}

function sharedTokens(o, n) {
  const A = new Set(o.tokens);
  const B = new Set(n.tokens);
  const out = [];
  for (const t of A) if (B.has(t)) out.push(t);
  return out;
}

function matchByPosition(oldD, newD, mapping, addMap) {
  const pairs = [];
  for (const [o, v] of mapping) {
    const od = oldD.byName.get(o);
    const nd = newD.byName.get(v.new);
    if (!od || !nd) continue;
    pairs.push([od.idx, nd.idx]);
  }
  pairs.sort((a, b) => a[0] - b[0]);
  if (pairs.length < 10) return 0;
  const anchors = lisBySecond(pairs);
  const newBySig = new Map();
  for (const d of newD.list) {
    if (d.kind !== "function" || !d.sig) continue;
    if (!newBySig.has(d.sig)) newBySig.set(d.sig, []);
    newBySig.get(d.sig).push(d);
  }
  const usedNew = new Set([...mapping.values()].map((v) => v.new));
  let added = 0;
  for (const o of oldD.list) {
    if (o.kind !== "function" || mapping.has(o.name)) continue;
    if (!o.sig || o.sig.length < 40) continue;
    const cands = (newBySig.get(o.sig) || []).filter((n) => !usedNew.has(n.name));
    if (!cands.length) continue;
    const lo = lastAnchorBelow(anchors, o.idx);
    const hi = firstAnchorAbove(anchors, o.idx);
    const winLo = lo ? lo[1] : -1;
    const winHi = hi ? hi[1] : Infinity;
    const inWin = cands.filter((n) => n.idx > winLo && n.idx < winHi);
    if (inWin.length === 1 && winHi - winLo < 500) {
      if (
        addMap(o.name, inWin[0].name, {
          kind: "function",
          evidence: `duplicate canonical signature disambiguated by declaration order: only candidate in anchor window (${winLo + 1}..${winHi === Infinity ? "end" : winHi}); canon ${o.sig.length} chars`,
          confidence: "medium",
          method: "position",
          size: o.size,
        })
      ) {
        usedNew.add(inWin[0].name);
        added++;
      }
    }
  }
  return added;
}

function matchAliases(oldD, newD, mapping, addMap) {
  let added = 0;
  const newAliases = new Map();
  for (const d of newD.list) {
    if (d.kind === "alias" && d.aliasOf) newAliases.set(d.aliasOf, d);
  }
  for (const d of oldD.list) {
    if (d.kind !== "alias" || !d.aliasOf || mapping.has(d.name)) continue;
    if (!mapping.has(d.aliasOf)) continue;
    const target = mapping.get(d.aliasOf).new;
    const cand = newAliases.get(target);
    if (cand && ![...mapping.values()].some((v) => v.new === cand.name)) {
      if (
        addMap(d.name, cand.name, {
          kind: "alias",
          evidence: `alias of mapped ${d.aliasOf}->${target}; NEW has var ${cand.name} = ${target}`,
          confidence: "high",
          method: "alias",
          size: 0,
        })
      )
        added++;
    }
  }
  return added;
}

function lisBySecond(pairs) {
  const tails = [];
  const prev = new Array(pairs.length).fill(-1);
  const idxs = [];
  for (let i = 0; i < pairs.length; i++) {
    const v = pairs[i][1];
    let lo = 0;
    let hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < v) lo = mid + 1;
      else hi = mid;
    }
    tails[lo] = v;
    idxs[lo] = i;
    if (lo > 0) prev[i] = idxs[lo - 1];
  }
  const res = [];
  let k = idxs[tails.length - 1];
  while (k >= 0) {
    res.push(pairs[k]);
    k = prev[k];
  }
  return res.reverse();
}

function lastAnchorBelow(anchors, oldIdx) {
  let best = null;
  for (const a of anchors) {
    if (a[0] < oldIdx) best = a;
    else break;
  }
  return best;
}

function firstAnchorAbove(anchors, oldIdx) {
  for (const a of anchors) if (a[0] > oldIdx) return a;
  return null;
}

function referenceVotes(oldD, newD, mapping) {
  const votes = new Map();
  for (const [oldName, v] of mapping) {
    const od = oldD.byName.get(oldName);
    const nd = newD.byName.get(v.new);
    if (!od || !nd || od.kind !== "function" || nd.kind !== "function") continue;
    const or = od.refs || [];
    const nr = nd.refs || [];
    if (or.length !== nr.length || or.length < 2) continue;
    for (let i = 0; i < or.length; i++) {
      const on = or[i];
      const nn = nr[i];
      if (mapping.has(on)) continue;
      if (on === nn) continue;
      if (!votes.has(on)) votes.set(on, new Map());
      const m = votes.get(on);
      m.set(nn, (m.get(nn) || 0) + 1);
    }
  }
  const out = new Map();
  for (const [on, m] of votes) {
    let total = 0;
    let best = null;
    for (const [nn, c] of m) {
      total += c;
      if (!best || c > best.count) best = { name: nn, count: c };
    }
    out.set(on, { best, total, share: best ? best.count / total : 0 });
  }
  return out;
}

function verifyMappings(oldD, newD, mapping) {
  const out = new Map();
  for (const [oldName, v] of mapping) {
    const od = oldD.byName.get(oldName);
    const nd = newD.byName.get(v.new);
    if (!od || !nd) continue;
    if (od.kind !== "function" || nd.kind !== "function") continue;
    const or = od.refs || [];
    const nr = nd.refs || [];
    if (!or.length || or.length !== nr.length) continue;
    let known = 0;
    let consistent = 0;
    let inconsistent = 0;
    for (let i = 0; i < or.length; i++) {
      let expected = null;
      if (mapping.has(or[i])) expected = mapping.get(or[i]).new;
      else if (or[i] === nr[i]) expected = nr[i];
      if (!expected) continue;
      known++;
      if (expected === nr[i]) consistent++;
      else inconsistent++;
    }
    out.set(oldName, { known, consistent, inconsistent, consistency: known ? consistent / known : 0 });
  }
  return out;
}

// --------------------------------------------------------------------------- required names

function requiredFromHarness() {
  let txt;
  try {
    txt = readText(HARNESS);
  } catch {
    return { names: [], error: "harness.cjs not readable" };
  }
  const m = txt.match(/window\.__erTest = \{([\s\S]*?)\n\s*\};/);
  if (!m) return { names: [], error: "expose block not found" };
  const body = m[1];
  const names = new Set();
  const re = /\b([A-Za-z_$][\w$]*)\s*(?=[,:])/g;
  let x;
  while ((x = re.exec(body))) {
    if (x[1] === "get" || x[1] === "set") continue;
    names.add(x[1]);
  }
  const re2 = /\b(?:get|set)\s+([A-Za-z_$][\w$]*)\s*\(/g;
  while ((x = re2.exec(body))) names.add(x[1]);
  return { names: [...names].sort(), error: null };
}

function requiredFromDelta(curParsed, curDescriptors, oldNames) {
  let gaps;
  try {
    gaps = JSON.parse(readText(DELTA_JSON)).gaps;
  } catch {
    return { names: [], ranges: 0, error: "delta json unreadable/unparsable" };
  }
  const ranges = [];
  for (const [o1, o2, c1, c2] of gaps) if (c2 >= c1) ranges.push([c1, c2]);
  ranges.sort((a, b) => a[0] - b[0]);
  const hits = collectRootRefs(curParsed.iife, curDescriptors.rootNames);
  const names = new Set();
  for (const [name, offsets] of hits) {
    for (const off of offsets) {
      const ln = lineAt(curParsed.lineStarts, off);
      if (inRanges(ranges, ln)) {
        names.add(name);
        break;
      }
    }
  }
  return { names: [...names].sort(), ranges: ranges.length, error: null };
}

function inRanges(ranges, ln) {
  let lo = 0;
  let hi = ranges.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const [a, b] = ranges[mid];
    if (ln < a) hi = mid - 1;
    else if (ln > b) lo = mid + 1;
    else return true;
  }
  return false;
}

// --------------------------------------------------------------------------- json / report

function buildJson(result) {
  const globals = {};
  for (const [o, v] of [...result.mapping.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    globals[o] = {
      new: v.new,
      kind: v.kind,
      evidence: v.evidence,
      confidence: v.confidence,
      method: v.method,
    };
    if (result.required.has(o)) globals[o].required = true;
  }
  const wrap_targets = {};
  for (const n of result.wrap) {
    const v = result.mapping.get(n);
    wrap_targets[n] = v
      ? { new: v.new, kind: v.kind, evidence: v.evidence, confidence: v.confidence, method: v.method }
      : { new: null, kind: null, evidence: "not mapped (see unresolved)", confidence: null };
  }
  return {
    version: 1,
    generatedBy: "port/tools/symmap.mjs",
    inputs: {
      old: "out/old.js",
      new: "out/new.js",
      required: "out/api_need.md (76 names our ported code references)",
      surface: "out/api_surface.txt",
      harness: "er-dom/harness.cjs (__erTest list)",
    },
    method:
      "acorn AST. Per-function alpha-normalised canonical signatures (locals renumbered by declaration order; " +
      "global refs by name), IDF-weighted clone fingerprints over invariant tokens (property names, object keys, " +
      "string/number literals - none of which are renamed between builds), declaration-order anchor disambiguation, " +
      "and aligned free-reference voting. Only high/medium are emitted; unproven names stay in unresolved.",
    globals,
    wrap_targets,
    api_need: {
      total: result.stats.required.apiNeed.total,
      covered: result.stats.required.apiNeed.covered,
      missing: result.stats.required.apiNeed.missing,
    },
    unresolved: result.unresolved.map((u) => u.name),
    unresolvedDetail: result.unresolved,
    ownCode: result.stats.apiSurface.own,
    conflicts: result.conflicts.map((c) => ({ old: c.old, new: c.new, detail: c.detail })),
    stats: result.stats,
  };
}

function mdReport(result, json) {
  const s = result.stats;
  const byConf = { high: [], medium: [] };
  for (const [o, v] of [...result.mapping.entries()].sort((a, b) => a[0].localeCompare(b[0]))) byConf[v.confidence].push([o, v]);
  const req = result.required;
  const unReq = result.unresolved.filter((u) => u.required);
  const unOther = result.unresolved.filter((u) => !u.required);
  const needDetail = new Map((result.apiNeed.detail || []).map((d) => [d.name, d]));
  const L = [];
  L.push("# OLD → NEW 符号映射报告（由 `port/tools/symmap.mjs` 自动生成，勿手改）");
  L.push("");
  L.push("产物：`port/out/symbol_map.json`（改写用）、本报告（人工核对用）。");
  L.push("");
  L.push("## 1. 方法与置信度定义");
  L.push("");
  L.push("| confidence | 判定依据（全部可机械核对） |");
  L.push("|---|---|");
  L.push("| **high** | ① **alpha-exact canon**：函数/对象/数组/表达式体在「局部绑定按声明顺序重编号 + 已映射全局名替换后」逐字符相同且两版唯一；② **clone fingerprint**：不变量 token 的 IDF 加权相似度：OLD token 覆盖率 ≥ 阈值、互为最佳匹配、与次优差距 ≥ 阈值；③ 唯一的同值字符串常量 |");
  L.push("| **medium** | ① 重复 canon 用**声明顺序锚点窗口**唯一消歧；② 指纹相似度达 medium 阈值且互为最佳；③ **引用投票**（骨架相同的函数对里按位置对齐自由引用）≥3 一致且一致率 ≥90%；④ medium 条目若随后被 ≥3 处对齐引用佐证则升级 high |");
  L.push("| low | 本次**不输出** low 条目：证据不足的名字一律进 `unresolved`，避免被当成猜测值误用 |");
  L.push("");
  L.push("关键归一化说明：");
  L.push("");
  L.push("- **alpha 归一化**：局部绑定（参数 / var·let·const / 内层函数名 / catch 参数）按**声明出现顺序**编号为 `$深度_序号`；IIFE 顶层（全局）引用保留名字 `@name`，只有**已被映射**的全局名才会被替换后再比较。属性名、字符串/数字字面量、运算符原样保留。");
  L.push("- **不变量 token 指纹**：属性访问名、对象字面量键、字符串/数字字面量在两版压缩中是逐字保留的；用 IDF 加权后 `p:x`、`n:0` 这类 token 权重接近 0，`k:chillAmt`、`s:\"abyss\"` 这类稀有 token 权重高，因此相似度由**独特语义痕迹**驱动。");
  L.push("");
  L.push("## 2. 统计");
  L.push("");
  L.push("| 项 | 值 |");
  L.push("|---|---|");
  L.push(`| OLD 顶层绑定 / NEW 顶层绑定 | ${s.bindings.old} / ${s.bindings.new} |`);
  L.push(`| OLD 函数 / NEW 函数 | ${s.kinds.old.function || 0} / ${s.kinds.new.function || 0} |`);
  L.push(`| OLD 对象 / NEW 对象 | ${s.kinds.old.object || 0} / ${s.kinds.new.object || 0} |`);
  L.push(`| OLD 数组 / NEW 数组 | ${s.kinds.old.array || 0} / ${s.kinds.new.array || 0} |`);
  L.push(`| **已映射总数** | **${result.mapping.size}** |`);
  L.push(`| high / medium | ${s.confidence.high} / ${s.confidence.medium} |`);
  L.push(`| **api_need.md 的 76 个必需名覆盖** | **${s.required.apiNeed.covered}/${s.required.apiNeed.total} = ${((s.required.apiNeed.covered / Math.max(1, s.required.apiNeed.total)) * 100).toFixed(1)}%** |`);
  L.push(`| 全部必需名（api_need ∪ harness∩OLD ∪ wrap）覆盖 | ${s.required.covered}/${s.required.total}（high ${s.requiredConfidence.high} / medium ${s.requiredConfidence.medium}） |`);
  L.push(`| **要包装的基础函数覆盖** | **${s.wrap.covered}/${s.wrap.total}**（high ${s.wrap.high} / medium ${s.wrap.medium}） |`);
  L.push(`| 引用一致性校验发现的可疑映射 | ${s.verify.conflicts} |`);
  L.push(`| OLD 其余未映射绑定 | ${unOther.length} |`);
  L.push("");
  L.push(
    "分阶段命中：exact-canon/expression 见 fixpoint；fingerprint 函数与对象/数组见 `symbol_map.json.stats.phaseStats`；声明序消歧 " +
      s.position +
      "；别名 " +
      s.alias +
      "；fixpoint 轮数 " +
      s.fixpointRounds +
      "。"
  );
  L.push("");
  L.push("## 3. api_need.md 的 76 个名字（核心验收表）");
  L.push("");
  L.push("`used` 是 api_need.md 里该名字在 delta 段中出现的段数。**NEW 对应**为空 = 未解析。");
  L.push("");
  L.push("| OLD | kind | used | NEW | conf | 证据 |");
  L.push("|---|---|--:|---|---|---|");
  for (const { name, kind, used } of result.apiNeed.detail || []) {
    const v = result.mapping.get(name);
    if (!v) L.push(`| \`${name}\` | ${kind} | ${used} | — | **UNRESOLVED** | 见 §8 |`);
    else L.push(`| \`${name}\` | ${kind} | ${used} | \`${v.new}\` | ${v.confidence} | ${mdEsc(v.evidence)} |`);
  }
  L.push("");
  L.push("## 4. 要包装/劫持的基础函数（wrap_targets）");
  L.push("");
  if (!result.wrap.length) L.push("（api_need 里没有命中这些名字，见 §4.1）");
  L.push("");
  L.push("| OLD | kind | NEW | conf | 证据 |");
  L.push("|---|---|---|---|---|");
  for (const name of result.wrap) {
    const v = result.mapping.get(name);
    const d = result.oldD.byName.get(name);
    if (!v) L.push(`| \`${name}\` | ${d ? d.kind : "?"} | — | **UNRESOLVED** | 见 §8 |`);
    else L.push(`| \`${name}\` | ${d ? d.kind : "?"} | \`${v.new}\` | ${v.confidence} | ${mdEsc(v.evidence)} |`);
  }
  L.push("");
  if (s.wrap.missing.length) {
    L.push("以下请求的 wrap 目标名在 OLD 顶层声明中不存在（可能是局部名或我们自己的名字，需 lead 核对）：");
    L.push("");
    L.push(s.wrap.missing.map((n) => "`" + n + "`").join("、"));
    L.push("");
  }
  L.push("## 5. 必需名里仍未解析的（改写时必须人工处理 / 运行时验证）");
  L.push("");
  if (!unReq.length) L.push("无。");
  else {
    L.push("| OLD 名 | kind | OLD 行 | 说明 |");
    L.push("|---|---|---:|---|");
    for (const u of unReq) L.push(`| \`${u.name}\` | ${u.kind} | ${u.line} | ${u.reason} |`);
  }
  L.push("");
  L.push("## 6. high 置信度映射（可直接用于自动改写）");
  L.push("");
  if (!byConf.high.length) L.push("无。");
  else {
    L.push("| OLD | NEW | kind | 证据（可核对） |");
    L.push("|---|---|---|---|");
    for (const [o, v] of byConf.high) L.push(`| \`${o}\` | \`${v.new}\` | ${v.kind} | ${mdEsc(v.evidence)} |`);
  }
  L.push("");
  L.push("## 7. medium 置信度映射（改写后必须跑引导 + 玩法断言）");
  L.push("");
  if (!byConf.medium.length) L.push("无。");
  else {
    L.push("| OLD | NEW | kind | 证据 |");
    L.push("|---|---|---|---|");
    for (const [o, v] of byConf.medium) L.push(`| \`${o}\` | \`${v.new}\` | ${v.kind} | ${mdEsc(v.evidence)} |`);
  }
  L.push("");
  L.push("## 8. 引用一致性冲突（若非空，对应映射可疑，请勿直接使用）");
  L.push("");
  if (!result.conflicts.length) L.push("无。所有已映射函数在「被调用全局名的对齐位置」上一致。");
  else {
    L.push("| OLD | NEW | detail |");
    L.push("|---|---|---|");
    for (const c of result.conflicts) L.push(`| \`${c.old}\` | \`${c.new}\` | ${mdEsc(c.detail)} |`);
  }
  L.push("");
  L.push("## 9. 抽查 15 条：NEW 侧语义佐证（真实源码片段）");
  L.push("");
  L.push("**证据**列可直接人工核对：`k:`/`p:` 是 NEW 侧真实存在的对象键 / 属性访问名，`S\"...\"` 是真实字符串字面量，`refs: a->b` 表示对齐引用；**NEW 侧源码**给出对应绑定的真实代码截断。");
  L.push("");
  const picks = pickSamples(result, 15);
  for (const p of picks) {
    L.push(`### \`${p.old}\` → \`${p.new}\`（${p.kind}, ${p.confidence}, ${p.method}）`);
    L.push("");
    L.push(`**证据**：${mdEsc(p.evidence)}`);
    L.push("");
    L.push("**NEW 侧源码（截断）**：");
    L.push("");
    L.push("```js");
    L.push(p.newSource);
    L.push("```");
    L.push("");
  }
  L.push("## 10. unresolved 完整名单");
  L.push("");
  L.push("### 10.1 必需名里的 unresolved（优先处理）");
  L.push("");
  L.push(unReq.length ? unReq.map((u) => "`" + u.name + "`").join("、") : "无。");
  L.push("");
  L.push("### 10.2 OLD 里存在但未映射的顶层绑定（按体积排序，前 60）");
  L.push("");
  L.push(unOther.slice(0, 60).map((u) => `\`${u.name}\`(${u.kind},${u.size}B)`).join("、") || "无。");
  L.push("");
  L.push("## 11. 我们自己的名字（不是基础 API，不要查本表）");
  L.push("");
  L.push("`api_surface.txt` 里出现、但 OLD/NEW 顶层都没有的标识符：我们自己的函数/局部名或 JS 内建。它们随移植块原样带入，只需注意 README §7 的遮蔽问题。");
  L.push("");
  L.push("## 12. 安全使用建议");
  L.push("");
  L.push("1. **只用 `confidence=high`** 做自动改写；`medium` 的改写后必须跑 `er-check` 语法检查 + jsdom 引导 + 对应玩法断言。");
  L.push("2. 改写必须用 AST 两步法（README §7）：先对我们的代码做 alpha 重命名，再把自由引用按本表翻译；**禁止文本替换** —— 表里 OLD 名常是 `o`/`u`/`n`/`e` 这类短名，文本替换会造成遮蔽 bug。");
  L.push("3. `unresolved` 里的名字不要凭语义直觉硬填；改为在移植块里新增兼容访问器，或用运行时探测（在 NEW 里按属性键/字面量定位）。");
  L.push("4. NEW 自带的新玩法可能改写过同一函数：映射只保证「OLD 名字 ≈ NEW 名字」的对应关系，**不保证 NEW 侧函数体与 OLD 相同**。改写前先用 `node symmap.mjs probe <OLD名>` 看 NEW 侧源码确认语义。");
  L.push("5. wrap 目标（§4）语义上都是「我们的钩子必须插进去」的函数；劫持方式见 README §4 的第 3 节：先存旧引用，再重新赋值包装，**不要**原地改函数体。");
  L.push("");
  return L.join("\n");
}

function mdEsc(s) {
  return String(s || "").replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function pickSamples(result, n) {
  const entries = [...result.mapping.entries()].filter(([, v]) => v.confidence === "high");
  // prefer: one per kind (object/array/function/string), then largest functions, then mixed methods
  const picks = [];
  const has = new Set();
  const wantKinds = ["object", "array", "string", "function"];
  for (const k of wantKinds) {
    const hit = entries.filter(([, v]) => v.kind === k).sort((a, b) => (b[1].size || 0) - (a[1].size || 0))[0];
    if (hit) {
      picks.push(hit);
      has.add(hit[0]);
    }
  }
  // ensure at least 6 function samples (the useful ones for rewriting)
  const fns = entries.filter(([o, v]) => v.kind === "function" && !has.has(o)).sort((a, b) => (b[1].size || 0) - (a[1].size || 0));
  for (const f of fns) {
    if (picks.length >= n - 3) break;
    picks.push(f);
    has.add(f[0]);
  }
  for (const e of entries.sort((a, b) => (b[1].size || 0) - (a[1].size || 0))) {
    if (picks.length >= n) break;
    if (has.has(e[0])) continue;
    picks.push(e);
    has.add(e[0]);
  }
  return picks.slice(0, n).map(([o, v]) => {
    const nd = result.newD.byName.get(v.new);
    const od = result.oldD.byName.get(o);
    const code = result.parsed;
    const cut = (d, max) => {
      if (!d) return "";
      const node = d.init || d.node;
      return code[d.label].code.slice(node.start, Math.min(node.end, node.start + max)).trim();
    };
    return {
      old: o,
      new: v.new,
      kind: v.kind,
      confidence: v.confidence,
      method: v.method,
      evidence: v.evidence,
      newSource: cut(nd, 1200),
      oldSource: cut(od, 900),
    };
  });
}

// --------------------------------------------------------------------------- commands

function cmdStats() {
  const parsedOld = parseIife(readText(FILES.old), "old");
  const parsedNew = parseIife(readText(FILES.new), "new");
  const parsedCur = parseIife(readText(FILES.cur), "cur");
  const oldD = buildDescriptors(parsedOld, "old");
  const newD = buildDescriptors(parsedNew, "new");
  const curD = buildDescriptors(parsedCur, "cur");
  console.log("parse ms:", { old: parsedOld.parseMs, new: parsedNew.parseMs, cur: parsedCur.parseMs });
  console.log("OLD bindings:", oldD.list.length, countKinds(oldD.list));
  console.log("NEW bindings:", newD.list.length, countKinds(newD.list));
  console.log("CUR bindings:", curD.list.length, countKinds(curD.list));
  const sigGroups = new Map();
  for (const d of oldD.list) {
    if (d.kind !== "function") continue;
    if (!sigGroups.has(d.sig)) sigGroups.set(d.sig, []);
    sigGroups.get(d.sig).push(d.name);
  }
  const sizes = [...sigGroups.values()].map((a) => a.length);
  console.log("OLD fn sigs:", sigGroups.size, "dup groups:", sizes.filter((x) => x > 1).length, "max:", Math.max(...sizes));
  const newSigs = new Set(newD.list.filter((d) => d.kind === "function").map((d) => d.sig));
  console.log("OLD fn sigs with exact NEW counterpart:", [...sigGroups.keys()].filter((k) => newSigs.has(k)).length);
  const harness = requiredFromHarness();
  console.log("harness names:", harness.names.length, harness.error || "");
  console.log("harness in OLD:", harness.names.filter((n) => oldD.rootNames.has(n)).length);
  const delta = requiredFromDelta(parsedCur, curD, oldD.rootNames);
  console.log("delta root refs (scope-resolved):", delta.names.length, delta.error || "");
  console.log(delta.names.join(" "));
}

function cmdProbe(name, limit = 8) {
  const parsedOld = parseIife(readText(FILES.old), "old");
  const parsedNew = parseIife(readText(FILES.new), "new");
  const oldD = buildDescriptors(parsedOld, "old");
  const newD = buildDescriptors(parsedNew, "new");
  const fnOld = oldD.list.filter((d) => d.kind === "function");
  const fnNew = newD.list.filter((d) => d.kind === "function");
  const objOld = oldD.list.filter((d) => d.kind === "object" || d.kind === "array");
  const objNew = newD.list.filter((d) => d.kind === "object" || d.kind === "array");
  const fnMatcher = makeTokenizerMatcher(fnOld, fnNew);
  const objMatcher = makeTokenizerMatcher(objOld, objNew);
  const o = oldD.byName.get(name);
  if (!o) {
    console.log("OLD has no binding", name);
    return;
  }
  console.log(`=== OLD ${name} (${o.kind}, ${o.size}B, line ${o.line}) ===`);
  const node = o.init || o.node;
  console.log(parsedOld.code.slice(node.start, Math.min(node.end, node.start + 700)));
  const isFn = o.kind === "function";
  const matcher = isFn ? fnMatcher : objMatcher;
  const hits = o.tokens.length >= (isFn ? 8 : 4) ? matcher.candidates(o) : [];
  console.log(`\ntokens=${o.tokens.length} sigLen=${(o.sig || "").length} candidates=${hits.length}`);
  console.log(`\n=== top ${limit} NEW candidates (${isFn ? "function" : "object/array"}) ===`);
  for (const c of hits.slice(0, limit)) {
    const nd = newD.byName.get(c.name);
    console.log(
      `\n--- ${c.name} score=${c.score.toFixed(3)} contOld=${c.contOld.toFixed(2)} dice=${c.sim.toFixed(3)} ${nd.kind} ${nd.size}B line ${nd.line} ---`
    );
    const nnode = nd.init || nd.node;
    console.log(parsedNew.code.slice(nnode.start, Math.min(nnode.end, nnode.start + 420)));
  }
}

function cmdNeeds() {
  const needPath = path.join(OUT_DIR, "api_need.md");
  let txt;
  try {
    txt = readText(needPath);
  } catch {
    console.error("api_need.md not found");
    process.exit(1);
  }
  const names = [];
  for (const line of txt.split("\n")) {
    const m = line.match(/^\|\s*`([^`]+)`\s*\|\s*([a-z]+)\s*\|/);
    if (m) names.push({ name: m[1], kind: m[2] });
  }
  const parsedOld = parseIife(readText(FILES.old), "old");
  const parsedNew = parseIife(readText(FILES.new), "new");
  const oldD = buildDescriptors(parsedOld, "old");
  const newD = buildDescriptors(parsedNew, "new");
  const fnOld = oldD.list.filter((d) => d.kind === "function");
  const fnNew = newD.list.filter((d) => d.kind === "function");
  const objOld = oldD.list.filter((d) => d.kind === "object" || d.kind === "array");
  const objNew = newD.list.filter((d) => d.kind === "object" || d.kind === "array");
  const fnMatcher = makeTokenizerMatcher(fnOld, fnNew);
  const objMatcher = makeTokenizerMatcher(objOld, objNew);
  for (const { name, kind } of names) {
    const o = oldD.byName.get(name);
    if (!o) {
      console.log(`\n## ${name} (${kind})  *** NOT IN OLD TOP LEVEL ***`);
      continue;
    }
    const isFn = o.kind === "function";
    const matcher = isFn ? fnMatcher : objMatcher;
    const hits = o.tokens.length >= (isFn ? 8 : 4) ? matcher.candidates(o) : [];
    console.log(`\n## ${name} (${o.kind}, ${o.size}B, line ${o.line}, tokens=${o.tokens.length})`);
    const nd0 = o.init || o.node;
    const src = parsedOld.code.slice(nd0.start, Math.min(nd0.end, nd0.start + 160)).replace(/\n\s*/g, " ");
    console.log(`   OLD: ${src}`);
    for (const c of hits.slice(0, 4)) {
      const nd = newD.byName.get(c.name);
      console.log(`   -> ${c.name} score=${c.score.toFixed(3)} contOld=${c.contOld.toFixed(2)} dice=${c.sim.toFixed(2)} ${nd.kind} ${nd.size}B line ${nd.line}`);
    }
    if (!hits.length) console.log("   -> (no fingerprint candidates)");
  }
}

function cmdRun() {
  const result = runPipeline();
  const json = buildJson(result);
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(json, null, 2) + "\n", "utf8");
  fs.writeFileSync(OUT_MD, mdReport(result, json) + "\n", "utf8");
  console.log("wrote", OUT_JSON);
  console.log("wrote", OUT_MD);
  console.log("mapped:", result.mapping.size, "confidence:", result.stats.confidence);
  console.log("required:", result.stats.required.covered + "/" + result.stats.required.total, "missing:", result.stats.required.missing.join(" "));
  console.log("conflicts:", result.conflicts.length, "notes:", result.notes.length);
  for (const n of result.notes.slice(0, 10)) console.log(" note:", n);
}

const cmd = process.argv[2] || "run";
if (cmd === "stats") cmdStats();
else if (cmd === "query" || cmd === "probe") cmdProbe(process.argv[3], process.argv[4] ? +process.argv[4] : 8);
else if (cmd === "needs") cmdNeeds();
else if (cmd === "run") cmdRun();
else {
  console.error("unknown command", cmd, "- use stats|probe <name>|needs|run");
  process.exit(1);
}
