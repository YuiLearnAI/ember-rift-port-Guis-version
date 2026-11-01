import fs from "node:fs";
import * as acorn from "./jstools/node_modules/acorn/dist/acorn.mjs";
const file=process.argv[2];
const h=fs.readFileSync(file,"utf8");
const re=/<script\b([^>]*)>/gi;let m,i=0,bad=0;
while((m=re.exec(h))){
  if(/\bsrc\s*=/i.test(m[1]))continue;
  const ci=h.slice(m.index).search(/<\/script\s*>/i);
  if(ci<0)break;
  const code=h.slice(m.index+m[0].length,m.index+ci);
  try{ acorn.parse(code,{ecmaVersion:"latest",sourceType:"script"}); console.log(`block[${i}] OK (${code.length} chars)`); }
  catch(e){ bad++; console.log(`block[${i}] SYNTAX ERROR: ${e.message} @${e.pos}`); 
    const p=e.pos||0; console.log("  ...",JSON.stringify(code.slice(Math.max(0,p-120),p+120))); }
  i++; re.lastIndex=m.index+ci+9;
}
console.log(bad? `RESULT: ${bad} BLOCK(S) FAILED`:"RESULT: ALL OK");
process.exit(bad?1:0);
