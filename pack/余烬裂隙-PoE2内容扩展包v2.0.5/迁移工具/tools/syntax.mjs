import fs from "node:fs";
import vm from "node:vm";
const file = process.argv[2];
const src = fs.readFileSync(file, "utf8");
const re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
let m, n = 0, bad = 0;
while ((m = re.exec(src))) {
  n++;
  const before = src.slice(0, m.index);
  const open = m[0].match(/^<script[^>]*>/i)[0];
  const startNL = (before.match(/\n/g) || []).length + (open.match(/\n/g) || []).length;
  const code = m[1];
  try {
    new vm.Script("\n".repeat(startNL) + code, { filename: file });
    console.log(`script #${n}: OK (${code.length} chars, starts near line ${startNL + 1})`);
  } catch (e) {
    bad++;
    console.log(`script #${n}: SYNTAX ERROR -> ${e.message}`);
    const mm = /:(\d+)/.exec(e.stack || "");
    if (mm) console.log("  near HTML line " + mm[1]);
  }
}
console.log(bad ? `FAILED (${bad}/${n})` : `ALL OK (${n} inline script blocks)`);
process.exit(bad ? 1 : 0);
