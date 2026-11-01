# OLD → NEW 符号映射报告（由 `port/tools/symmap.mjs` 自动生成，勿手改）

产物：`port/out/symbol_map.json`（改写用）、本报告（人工核对用）。

## 1. 方法与置信度定义

| confidence | 判定依据（全部可机械核对） |
|---|---|
| **high** | ① **alpha-exact canon**：函数/对象/数组/表达式体在「局部绑定按声明顺序重编号 + 已映射全局名替换后」逐字符相同且两版唯一；② **clone fingerprint**：不变量 token 的 IDF 加权相似度：OLD token 覆盖率 ≥ 阈值、互为最佳匹配、与次优差距 ≥ 阈值；③ 唯一的同值字符串常量 |
| **medium** | ① 重复 canon 用**声明顺序锚点窗口**唯一消歧；② 指纹相似度达 medium 阈值且互为最佳；③ **引用投票**（骨架相同的函数对里按位置对齐自由引用）≥3 一致且一致率 ≥90%；④ medium 条目若随后被 ≥3 处对齐引用佐证则升级 high |
| low | 本次**不输出** low 条目：证据不足的名字一律进 `unresolved`，避免被当成猜测值误用 |

关键归一化说明：

- **alpha 归一化**：局部绑定（参数 / var·let·const / 内层函数名 / catch 参数）按**声明出现顺序**编号为 `$深度_序号`；IIFE 顶层（全局）引用保留名字 `@name`，只有**已被映射**的全局名才会被替换后再比较。属性名、字符串/数字字面量、运算符原样保留。
- **不变量 token 指纹**：属性访问名、对象字面量键、字符串/数字字面量在两版压缩中是逐字保留的；用 IDF 加权后 `p:x`、`n:0` 这类 token 权重接近 0，`k:chillAmt`、`s:"abyss"` 这类稀有 token 权重高，因此相似度由**独特语义痕迹**驱动。

## 2. 统计

| 项 | 值 |
|---|---|
| OLD 顶层绑定 / NEW 顶层绑定 | 1875 / 1895 |
| OLD 函数 / NEW 函数 | 1280 / 1293 |
| OLD 对象 / NEW 对象 | 292 / 294 |
| OLD 数组 / NEW 数组 | 90 / 91 |
| **已映射总数** | **1611** |
| high / medium | 1518 / 93 |
| **api_need.md 的 76 个必需名覆盖** | **0/0 = 0.0%** |
| 全部必需名（api_need ∪ harness∩OLD ∪ wrap）覆盖 | 67/72（high 65 / medium 2） |
| **要包装的基础函数覆盖** | **19/23**（high 18 / medium 1） |
| 引用一致性校验发现的可疑映射 | 2 |
| OLD 其余未映射绑定 | 257 |

分阶段命中：exact-canon/expression 见 fixpoint；fingerprint 函数与对象/数组见 `symbol_map.json.stats.phaseStats`；声明序消歧 8；别名 0；fixpoint 轮数 2。

## 3. api_need.md 的 76 个名字（核心验收表）

`used` 是 api_need.md 里该名字在 delta 段中出现的段数。**NEW 对应**为空 = 未解析。

| OLD | kind | used | NEW | conf | 证据 |
|---|---|--:|---|---|---|

## 4. 要包装/劫持的基础函数（wrap_targets）


| OLD | kind | NEW | conf | 证据 |
|---|---|---|---|---|
| `hn` | function | `Yo` | high | alpha-exact function body match (268 char canon; locals renumbered only); literals: " checked","\""," " |
| `Ee` | object | `je` | high | alpha-exact object body match (224 char canon; locals renumbered only); literals: none |
| `fe` | number | — | **UNRESOLVED** | 见 §8 |
| `Tt` | function | `$t` | high | ref-vote-r0: 25/25 aligned free references across matched functions point to $t; corroborated: 25/25 aligned references agree |
| `ro` | function | `po` | high | ref-vote-r0: 12/12 aligned free references across matched functions point to po; corroborated: 12/12 aligned references agree |
| `ih` | number | `mh` | medium | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to mh |
| `Fc` | array | `Nc` | high | alpha-exact array body match (755 char canon; locals renumbered only); literals: "skillLvl","lifeInc","critInc" |
| `Jb` | function | `Uy` | high | clone fingerprint: OLD-token coverage 0.98 / dice 0.979 (runner-up 0.78); shared invariant tokens: p:push,p:fx,k:k,s:tele,k:x,k:y,k:r,k:t; literals: "tele" |
| `Ay` | object | — | **UNRESOLVED** | 见 §8 |
| `fi` | object | `ui` | high | alpha-exact object body match (170 char canon; locals renumbered only); literals: "tri" |
| `Qv` | object | — | **UNRESOLVED** | 见 §8 |
| `Vs` | function | `Vs` | high | alpha-exact function body match (225 char canon; locals renumbered only); literals: " {v}","{v}" |
| `qv` | object | — | **UNRESOLVED** | 见 §8 |
| `br` | function | `vr` | high | clone fingerprint: OLD-token coverage 0.97 / dice 0.971 (runner-up 0.55); shared invariant tokens: n:1,p:pl,p:jshMax,p:cls,p:S,s:jianke,p:jsh,n:0; literals: "jianke","gold" |
| `Ro` | null | `Eo` | high | ref-vote-r0: 11/11 aligned free references across matched functions point to Eo; corroborated: 11/11 aligned references agree |
| `R2` | function | `D2` | high | clone fingerprint: OLD-token coverage 0.98 / dice 0.983 (runner-up 0.44); shared invariant tokens: p:length,p:sparks,p:globalCompositeOperation,s:lighter,p:lineCap,s:round,p:t,p:max; literals: "lighter","round" |
| `x1` | function | `Xm` | high | clone fingerprint: OLD-token coverage 0.97 / dice 0.971 (runner-up 0.55); shared invariant tokens: p:k,n:0,p:pl,null,k:x,p:x,p:face,n:6; literals: none |
| `Cx` | function | `J5` | high | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.70); shared invariant tokens: p:joy,p:hypot,p:x,p:y,p:id,null,p:walk,n:0.15; literals: none |
| `ji` | function | `wi` | high | alpha-exact function body match (228 char canon; locals renumbered only); literals: none |
| `ui` | array | `gi` | high | alpha-exact array body match (10021 char canon; locals renumbered only); literals: "奥术","#b07ae8","spellInc" |
| `xt` | function | `xt` | high | alpha-exact function body match (724 char canon; locals renumbered only); literals: "#120e14" |
| `We` | object | `We` | high | alpha-exact object body match (205 char canon; locals renumbered only); literals: none |
| `ka` | function | `xa` | high | ref-vote-r0: 13/13 aligned free references across matched functions point to xa; corroborated: 13/13 aligned references agree |

## 5. 必需名里仍未解析的（改写时必须人工处理 / 运行时验证）

| OLD 名 | kind | OLD 行 | 说明 |
|---|---|---:|---|
| `ct` | function | 31711 | no unique evidence |
| `Ay` | object | 18318 | no unique evidence |
| `fe` | number | 24474 | no unique evidence |
| `qv` | object | 55296 | no unique evidence |
| `Qv` | object | 56202 | no unique evidence |

## 6. high 置信度映射（可直接用于自动改写）

| OLD | NEW | kind | 证据（可核对） |
|---|---|---|---|
| `_` | `K` | function | alpha-exact function body match (1565 char canon; locals renumbered only); literals: none |
| `_$` | `uA` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.990 (runner-up 0.61); shared invariant tokens: s:hit:base,p:pl,p:cstaffT,n:0,p:isAtk,p:c,p:by,p:light; literals: "hit:base","light" |
| `_0` | `X0` | function | alpha-exact function body match (139 char canon; locals renumbered only); literals: none |
| `_2` | `Lu` | function | alpha-exact function body match (860 char canon; locals renumbered only); literals: "0" |
| `_3` | `lS` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.986 (runner-up 0.59); shared invariant tokens: p:atan2,p:y,p:pl,p:x,p:r,s:slam,n:0.5,n:0.1; literals: "slam","spike" |
| `_8` | `hM` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.993 (runner-up 0.65); shared invariant tokens: p:pl,n:0,n:7,p:getElementById,s:msk,p:skills,p:lifeCost,p:hp; literals: "msk",".am" |
| `_b` | `Gy` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.996 (runner-up 0.45); shared invariant tokens: p:moving,n:1,p:flash,n:0,p:shT,p:sqT,p:stunT,p:dummy; literals: "#ff8a30","#ffd060" |
| `_c` | `Yc` | object | alpha-exact object body match (832 char canon; locals renumbered only); literals: "之咬","之牙","之刃" |
| `_d` | `Xd` | function | clone fingerprint: OLD-token coverage 0.93 / dice 0.928 (runner-up 0.24); shared invariant tokens: p:menu,n:0,p:join,p:map,p:redeemed,p:n,p:reward,t:<div class="rdgot">✓ ; literals: "<div class=\"rdgot\">✓ "," <small>" |
| `_e` | `_e` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.994 (runner-up 0.23); shared invariant tokens: p:pow,p:hpGrowth,p:mon,n:1,p:dmgGrowth,p:Z,p:ms,p:mods; literals: "chase","·" |
| `_f` | `Bf` | number | ref-vote-r0: 5/5 aligned free references across matched functions point to Bf; corroborated: 5/5 aligned references agree |
| `_h` | `tm` | object | alpha-exact object body match (1339 char canon; locals renumbered only); literals: "small","剑心","meleeInc" |
| `_i` | `Xi` | object | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.41); shared invariant tokens: k:bishop,k:slam,k:prison,k:w,n:2.5,k:cast,n:0.3,k:go; literals: "phys","#d8d0b8" |
| `_k` | `sx` | function | alpha-exact function body match (3822 char canon; locals renumbered only); literals: none |
| `_l` | `ql` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.41); shared invariant tokens: p:kind,s:item,s:soul,s:只能用于装备或兽魂,p:rarity,n:2,s:需要稀有装备,p:corrupted; literals: "item","soul" |
| `_m` | `zg` | function | clone fingerprint: OLD-token coverage 0.79 / dice 0.788 (runner-up 0.18); shared invariant tokens: p:join,p:map,s: primary,t:<button class="btn small,t:" data-act="mw" data-k="set" data-f=",t:" data-v=",t:">,t:</button>; literals: " primary","<button class=\"btn small" |
| `_M` | `wT` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.30); shared invariant tokens: p:map,p:filter,p:debug,p:rift,p:cls,p:some,p:join,p:keys; literals: "on","★" |
| `_n` | `Yn` | function | ref-vote-r0: 6/6 aligned free references across matched functions point to Yn; corroborated: 6/6 aligned references agree |
| `_o` | `Qo` | function | alpha-exact function body match (440 char canon; locals renumbered only); literals: none |
| `_p` | `mu` | function | alpha-exact function body match (980 char canon; locals renumbered only); literals: none |
| `_r` | `Qr` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.987 (runner-up 0.70); shared invariant tokens: n:0.16,p:push,p:fx,k:k,s:bolt,k:pts,k:x,k:y; literals: "bolt","#b8c4ff" |
| `_s` | `_s` | function | alpha-exact function body match (129 char canon; locals renumbered only); literals: none |
| `_S` | `RM` | function | clone fingerprint: OLD-token coverage 0.96 / dice 0.936 (runner-up 0.29); shared invariant tokens: p:map,p:seg,s:dev,p:sort,p:filter,p:inv,p:kind,s:map; literals: "dev","map" |
| `_t` | `Zt` | object | alpha-exact object body match (545 char canon; locals renumbered only); literals: "烬灵","每位余烬行者都有的小火灵 · 进图后自动帮你捡东西","千烬游龙" |
| `_u` | `th` | function | alpha-exact function body match (2457 char canon; locals renumbered only); literals: none |
| `_w` | `x4` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.990 (runner-up 0.28); shared invariant tokens: p:dead,p:pl,n:0,p:hp,p:state,s:dead,s:slam,p:slowT; literals: "dead","slam" |
| `_x` | `Gx` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.985 (runner-up 0.45); shared invariant tokens: p:t,p:length,n:0,n:4,p:x,p:y,n:10,s:255,100,40; literals: "255,100,40","255,150,60" |
| `_y` | `fg` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.993 (runner-up 0.50); shared invariant tokens: p:grenades,p:x,p:y,n:10,p:fillStyle,s:rgba(0,0,0,0.45),p:beginPath,p:ellipse; literals: "rgba(0,0,0,0.45)","#c84a20" |
| `$$` | `Z$` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.892 (runner-up 0.29); shared invariant tokens: s:tick,k:dt,s:kill,k:m,p:Z,p:tower,p:guard,p:prop; literals: "tick","kill" |
| `$0` | `b0` | function | alpha-exact function body match (3214 char canon; locals renumbered only); literals: "map","alt","trans" |
| `$1` | `o1` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.992 (runner-up 0.37); shared invariant tokens: p:e,null,p:id,s:dragon,k:x,p:x,k:y,p:y; literals: "dragon","#ff8a3a" |
| `$2` | `O2` | function | alpha-exact function body match (3279 char canon; locals renumbered only); literals: "rgba(0,0,0,0.35)","#3a2416","#5a3a20" |
| `$3` | `G3` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.987 (runner-up 0.56); shared invariant tokens: p:x,p:y,p:sin,p:T,n:5,n:0.15,n:1,p:hits; literals: "rgba(0,0,0,0.4)","#5a4420" |
| `$4` | `e3` | array | alpha-exact array body match (284 char canon; locals renumbered only); literals: "qun500","称号「开服元老」· 余烬金光","qun1000" |
| `$5` | `k5` | function | alpha-exact function body match (460 char canon; locals renumbered only); literals: none |
| `$6` | `WS` | array | alpha-exact array body match (66 char canon; locals renumbered only); literals: "弓","弩","剑" |
| `$8` | `O8` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.995 (runner-up 0.38); shared invariant tokens: p:r,n:2,p:x,p:y,p:push,k:x,k:y,k:z; literals: "torch","pl" |
| `$a` | `Aa` | function | alpha-exact function body match (6180 char canon; locals renumbered only); literals: "suspended","lowpass" |
| `$c` | `Lc` | number | ref-vote-r0: 5/5 aligned free references across matched functions point to Lc; corroborated: 5/5 aligned references agree |
| `$d` | `yp` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.982 (runner-up 0.47); shared invariant tokens: p:delete,p:press,p:id,p:timer,p:remove,p:classList,p:b,s:on; literals: "on","fail" |
| `$e` | `Ce` | object | alpha-exact object body match (1130 char canon; locals renumbered only); literals: none |
| `$f` | `If` | array | alpha-exact array body match (84 char canon; locals renumbered only); literals: "ess_life","ess_fire","ess_crit" |
| `$i` | `Bi` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.989 (runner-up 0.34); shared invariant tokens: p:groups,p:map,p:filter,p:grp,p:pick,n:0,p:ck,s: no; literals: " no"," msel" |
| `$k` | `Ok` | object | alpha-exact object body match (1905 char canon; locals renumbered only); literals: "#5a3a1a","#a07a40","#e8e8e8" |
| `$l` | `Kl` | function | ref-vote-r0: 4/4 aligned free references across matched functions point to Kl; corroborated: 4/4 aligned references agree |
| `$m` | `qm` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.993 (runner-up 0.51); shared invariant tokens: n:0,p:pl,p:t,p:c,p:on,n:1,p:tick,p:rev; literals: "mace","slam" |
| `$M` | `lT` | function | alpha-exact function body match (603 char canon; locals renumbered only); literals: "it:" |
| `$n` | `An` | function | alpha-exact function body match (306 char canon; locals renumbered only); literals: "start" |
| `$o` | `Ao` | function | alpha-exact function body match (491 char canon; locals renumbered only); literals: none |
| `$p` | `Fp` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.992 (runner-up 0.59); shared invariant tokens: p:tabs,n:0,s:ember-rift-stash-debug,s:ember-rift-stash,k:tabs,k:gen,k:map,k:gem; literals: "ember-rift-stash-debug","ember-rift-stash" |
| `$r` | `Cr` | function | alpha-exact function body match (588 char canon; locals renumbered only); literals: "%","1/" |
| `$s` | `Rs` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.80); shared invariant tokens: s:<div class="cell e"></div>,p:kind,s:soul,p:rarity,s: soul,p:cls,p:beast,s:boss; literals: "<div class=\"cell e\"></div>","soul" |
| `$t` | `At` | function | alpha-exact function body match (613 char canon; locals renumbered only); literals: none |
| `$T` | `l$` | function | clone fingerprint: OLD-token coverage 0.81 / dice 0.812 (runner-up 0.23); shared invariant tokens: p:length,s: no,p:join,p:map,n:1,t:<button class="btn small" data-act="mapUp" data-t=",t:">,t: 张 T; literals: " no","\">" |
| `$v` | `Ov` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.55); shared invariant tokens: p:slice,p:sticks,p:host,p:x,n:2,p:y,n:484,n:1.5; literals: none |
| `$w` | `t4` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.958 (runner-up 0.40); shared invariant tokens: p:mons,p:projs,p:eprojs,p:parts,p:fx,p:texts,p:loots,p:decals; literals: none |
| `$x` | `V5` | object | alpha-exact object body match (265 char canon; locals renumbered only); literals: none |
| `$y` | `m2` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.990 (runner-up 0.45); shared invariant tokens: p:round,p:x,p:y,p:T,p:fillStyle,s:rgba(0,0,0,0.42),p:beginPath,p:ellipse; literals: "rgba(0,0,0,0.42)","#2a2428" |
| `A` | `A` | function | alpha-exact function body match (106 char canon; locals renumbered only); literals: none |
| `a$` | `LT` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.993 (runner-up 0.32); shared invariant tokens: p:fillStyle,s:#0d0a0b,p:fillRect,n:0,n:160,n:96,p:createRadialGradient,n:2; literals: "#0d0a0b","rgba(255,170,90,0.16)" |
| `a0` | `w0` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.74); shared invariant tokens: p:oils,p:lit,p:x,n:2,p:y,p:r; literals: none |
| `A0` | `I0` | function | alpha-exact function body match (690 char canon; locals renumbered only); literals: none |
| `A1` | `n1` | function | alpha-exact function body match (531 char canon; locals renumbered only); literals: "rgba(0,0,0,0.3)" |
| `a2` | `vg` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.993 (runner-up 0.45); shared invariant tokens: p:jk,p:pl,p:dark,n:0.01,p:save,p:setTransform,n:1,n:0; literals: "rgba(8,4,20,",")" |
| `a3` | `h3` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.44); shared invariant tokens: p:kind,s:sup,p:gid,p:mech,s: mechc,p:uid,p:lvl,s: <small>Lv; literals: "sup"," mechc" |
| `A3` | `W3` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.983 (runner-up 0.58); shared invariant tokens: p:find,p:k,p:type,p:x,p:y,p:fillStyle,s:#3a3440,p:fillRect; literals: "#3a3440","#5a5460" |
| `a4` | `E4` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.996 (runner-up 0.39); shared invariant tokens: p:pl,p:Z,p:S,p:list,p:souls,p:filter,p:includes,p:soul; literals: "idle" |
| `A4` | `t3` | array | alpha-exact array body match (70 char canon; locals renumbered only); literals: "#e8fbff","#bfefff","#9fe8ff" |
| `A5` | `x5` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.986 (runner-up 0.35); shared invariant tokens: s:先选一件装备,p:cur,n:0,s:vaal,p:pity,s:怨念已满 · 必出腐化词缀,s:赌一把 · 怨念 ,s:必定带有对应词缀; literals: "先选一件装备","vaal" |
| `a6` | `bS` | array | alpha-exact array body match (70 char canon; locals renumbered only); literals: "atkSpd","meleeInc","physInc" |
| `A6` | `NS` | object | alpha-exact object body match (424 char canon; locals renumbered only); literals: "，",", ","。" |
| `a8` | `y6` | function | alpha-exact function body match (1865 char canon; locals renumbered only); literals: none |
| `A8` | `Z8` | function | alpha-exact function body match (122 char canon; locals renumbered only); literals: none |
| `aa` | `ea` | function | alpha-exact function body match (1399 char canon; locals renumbered only); literals: "提高","降低","{" |
| `Aa` | `Ca` | array | alpha-exact array body match (16145 char canon; locals renumbered only); literals: "短弓","W","bow" |
| `ab` | `Qb` | function | alpha-exact function body match (1665 char canon; locals renumbered only); literals: "次级珠宝匠石","高级珠宝匠石","完美珠宝匠石" |
| `Ab` | `ky` | function | alpha-exact function body match (1156 char canon; locals renumbered only); literals: "hotg","rise","getsuga" |
| `ac` | `cc` | object | alpha-exact object body match (102 char canon; locals renumbered only); literals: none |
| `Ac` | `jc` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.996 (runner-up 0.29); shared invariant tokens: p:skills,p:SKC,p:channel,n:1,p:wtOK,s:需要,p:wtNeed,p:cd; literals: "需要","冷却中" |
| `ad` | `ld` | array | alpha-exact array body match (239 char canon; locals renumbered only); literals: none |
| `Ad` | `vp` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.971 (runner-up 0.58); shared invariant tokens: p:pl,p:aim,p:aimHold,p:T,p:t,p:move,n:0,n:1; literals: none |
| `ae` | `ae` | function | alpha-exact function body match (2111 char canon; locals renumbered only); literals: none |
| `Ae` | `Re` | object | ref-vote-r0: 16/16 aligned free references across matched functions point to Re; corroborated: 17/17 aligned references agree |
| `af` | `lf` | function | alpha-exact function body match (1557 char canon; locals renumbered only); literals: "ember-rift-slot","ERS1:","ERS2:" |
| `Af` | `Pf` | function | ref-vote-r0: 3/3 aligned free references across matched functions point to Pf; corroborated: 3/3 aligned references agree |
| `ag` | `P1` | function | alpha-exact function body match (869 char canon; locals renumbered only); literals: "lock","altar" |
| `Ag` | `Ni` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.931 (runner-up 0.18); shared invariant tokens: s:#mrotate,n:1.05,p:rotGate,p:on,p:hidden,p:rotPause; literals: "#mrotate" |
| `ah` | `fh` | array | alpha-exact array body match (80 char canon; locals renumbered only); literals: "腐朽","嗜血","永夜" |
| `Ah` | `zh` | function | alpha-exact function body match (1346 char canon; locals renumbered only); literals: "boss","dead" |
| `Ai` | `Fi` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.993 (runner-up 0.52); shared invariant tokens: p:pick,n:0,p:ck,p:hint,s:点一种通货看它会做什么 · 再点一次就用上,t:<div class="mcurbar e"><span>,t:</span></div>,s:先选一件装备; literals: "点一种通货看它会做什么 · 再点一次就用上","<div class=\"mcurbar e\"><span>" |
| `Ak` | `Bk` | function | alpha-exact function body match (681 char canon; locals renumbered only); literals: none |
| `al` | `rl` | expression | ref-vote-r0: 5/5 aligned free references across matched functions point to rl; corroborated: 5/5 aligned references agree |
| `Al` | `Vl` | array | alpha-exact array body match (621 char canon; locals renumbered only); literals: "title","riftwalker","aura" |
| `am` | `fm` | expression | ref-vote-r0: 3/3 aligned free references across matched functions point to fm; corroborated: 3/3 aligned references agree |
| `Am` | `Gm` | function | clone fingerprint: OLD-token coverage 0.95 / dice 0.951 (runner-up 0.35); shared invariant tokens: p:pl,p:channel,n:0,p:SKC,p:on,p:ringT; literals: none |
| `AM` | `cT` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.32); shared invariant tokens: p:push,s:sell,s:出售,s:warn,p:kind,s:map,s:go,s:放入装置; literals: "sell","出售" |
| `an` | `tn` | function | clone fingerprint: OLD-token coverage 0.95 / dice 0.951 (runner-up 0.80); shared invariant tokens: p:indexOf,p:inv,n:0,p:splice,n:1,p:cur,p:join,p:map; literals: "×"," " |
| `ao` | `cs` | string | ref-vote-r0: 5/5 aligned free references across matched functions point to cs; corroborated: 5/5 aligned references agree |
| `Ao` | `Co` | array | clone fingerprint: OLD-token coverage 0.94 / dice 0.940 (runner-up 0.06); shared invariant tokens: k:key,s:box,k:n,s:宝藏,k:col,s:#e8c048,k:vr,s:低方差; literals: "box","宝藏" |
| `Ap` | `Dp` | function | clone fingerprint: OLD-token coverage 0.96 / dice 0.959 (runner-up 0.39); shared invariant tokens: p:state,s:play,s:dead,p:id,n:1,s:调试角色 · ,p:n,n:0; literals: "play","dead" |
| `ar` | `or` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.989 (runner-up 0.72); shared invariant tokens: p:push,p:fx,k:k,s:ring,k:x,k:y,k:r0,n:3; literals: "ring","#ff8a3a" |
| `Ar` | `Rr` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.986 (runner-up 0.36); shared invariant tokens: p:cr,n:0,n:1,k:adds,k:lost,p:mods,p:includes,p:has; literals: "ess" |
| `as` | `ss` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.994 (runner-up 0.27); shared invariant tokens: p:kind,s:gem,p:gid,p:S,p:lvl,k:b,s:#2ec4a0,k:h; literals: "gem","#2ec4a0" |
| `aS` | `Y6` | function | clone fingerprint: OLD-token coverage 0.96 / dice 0.956 (runner-up 0.50); shared invariant tokens: p:fly,p:globalAlpha,n:1,p:t,p:x,p:y,n:5,s:255,210,130; literals: "255,210,130" |
| `As` | `Os` | function | alpha-exact function body match (86 char canon; locals renumbered only); literals: none |
| `AS` | `S8` | object | alpha-exact object body match (319 char canon; locals renumbered only); literals: "无事发生","物品已腐化, 不能再改造","none" |
| `aT` | `DT` | function | clone fingerprint: OLD-token coverage 0.96 / dice 0.963 (runner-up 0.40); shared invariant tokens: p:length,p:orbs,n:1,n:0,p:t,p:tick,p:spin,n:0.55; literals: "#dfe6ff","#8a70ff" |
| `At` | `Ct` | object | alpha-exact object body match (465 char canon; locals renumbered only); literals: none |
| `AT` | `c$` | object | alpha-exact object body match (1491 char canon; locals renumbered only); literals: "物品数量 +","%","物品稀有度 +" |
| `au` | `Sl` | function | clone fingerprint: OLD-token coverage 0.95 / dice 0.945 (runner-up 0.82); shared invariant tokens: n:0,p:mods,p:ur,p:id,p:ti,p:length,p:ranges,n:1; literals: none |
| `Au` | `zu` | expression | ref-vote-r0: 4/4 aligned free references across matched functions point to zu; corroborated: 4/4 aligned references agree |
| `Av` | `Bv` | function | alpha-exact function body match (450 char canon; locals renumbered only); literals: "sniper","hound" |
| `aw` | `Ew` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.967 (runner-up 0.68); shared invariant tokens: p:has,p:pointerId,n:1,p:stopPropagation,p:delete,p:size,n:0,null; literals: "pointerup" |
| `Aw` | `a4` | function | alpha-exact function body match (2840 char canon; locals renumbered only); literals: none |
| `ax` | `px` | function | alpha-exact function body match (205 char canon; locals renumbered only); literals: none |
| `Ax` | `Q5` | function | alpha-exact function body match (45 char canon; locals renumbered only); literals: none |
| `ay` | `Nb` | function | clone fingerprint: OLD-token coverage 0.95 / dice 0.954 (runner-up 0.44); shared invariant tokens: p:indexOf,p:inv,n:0,n:1,p:findIndex,p:splice,p:push,s:summon; literals: "summon"," 未生效: " |
| `B` | `B` | function | alpha-exact function body match (309 char canon; locals renumbered only); literals: "&","&amp;","<" |
| `b$` | `B$` | function | alpha-exact function body match (589 char canon; locals renumbered only); literals: none |
| `B$` | `sA` | function | alpha-exact function body match (154 char canon; locals renumbered only); literals: none |
| `b0` | `j0` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.966 (runner-up 0.69); shared invariant tokens: n:3,s:#6a6070,n:0,p:push,p:frags,k:x,n:2,k:y; literals: "#6a6070" |
| `B0` | `N0` | string | ref-vote-r0: 5/5 aligned free references across matched functions point to N0; corroborated: 5/5 aligned references agree |
| `b1` | `Vm` | array | alpha-exact array body match (190 char canon; locals renumbered only); literals: none |
| `B1` | `m1` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.985 (runner-up 0.48); shared invariant tokens: null,p:pl,p:dead,p:kind,s:sun,k:img,p:img,k:x; literals: "sun" |
| `b3` | `j3` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.981 (runner-up 0.54); shared invariant tokens: p:dbg,s:D-,p:mod,s:M-,p:slice,p:join,p:best,p:round; literals: "D-","M-" |
| `B3` | `Y3` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.988 (runner-up 0.46); shared invariant tokens: p:M,p:Z,p:touchMode,p:miniBox,p:min,n:1.6,p:w,p:W; literals: "rgba(0,0,0,0.35)","#6a6a6a" |
| `b4` | `U4` | object | alpha-exact object body match (195 char canon; locals renumbered only); literals: "kggwgwwwwgwggk","kgwgwgwgwgwgwk","kggwgwppwgwggk" |
| `B4` | `d3` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.970 (runner-up 0.47); shared invariant tokens: p:M,p:Z,p:W,p:floor,p:x,p:pl,p:y,p:getContext; literals: "2d","rgba(190,180,160,0.45)" |
| `b5` | `d5` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.21); shared invariant tokens: p:now,k:err,s:先进入游戏再兑换,p:find,p:keys,p:h,s:兑换码无效,p:parse; literals: "先进入游戏再兑换","兑换码无效" |
| `B5` | `pw` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.968 (runner-up 0.64); shared invariant tokens: p:tab,p:sel,null,p:cur,n:1,p:ck,p:bulk,p:flash; literals: "inv","gem" |
| `B6` | `XS` | object | alpha-exact object body match (3873 char canon; locals renumbered only); literals: none |
| `b8` | `F6` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.987 (runner-up 0.56); shared invariant tokens: p:pl,p:el,k:c,k:slot,k:cyc,s:beat,s:cut,n:1; literals: "beat","cut" |
| `B8` | `aM` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.978 (runner-up 0.43); shared invariant tokens: p:hypot,p:x,p:y,p:lock,n:40,n:0,n:1000000000,p:t; literals: none |
| `ba` | `ma` | function | ref-vote-r0: 10/10 aligned free references across matched functions point to ma; corroborated: 10/10 aligned references agree |
| `Ba` | `Da` | function | ref-vote-r0: 9/9 aligned free references across matched functions point to Da; corroborated: 9/9 aligned references agree |
| `bb` | `dy` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.994 (runner-up 0.32); shared invariant tokens: p:kind,p:pl,s:xbow,p:ammo,p:gid,null,p:clip,n:0; literals: "xbow","reload" |
| `Bb` | `Ly` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.992 (runner-up 0.39); shared invariant tokens: p:x,p:y,p:mult,n:1,p:encBox,n:8,n:40,s:crypt; literals: "crypt","it" |
| `bc` | `Mc` | object | alpha-exact object body match (699 char canon; locals renumbered only); literals: "上上签","#ffd27a","#3a2a10" |
| `Bc` | `Wc` | object | alpha-exact object body match (1454 char canon; locals renumbered only); literals: "addFire","resF","addCold" |
| `bd` | `Sd` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.925 (runner-up 0.41); shared invariant tokens: p:pl,p:dist,p:d,n:150,p:range,p:atan2,p:y,p:x; literals: none |
| `Bd` | `Nd` | null | ref-vote-r0: 4/4 aligned free references across matched functions point to Nd; corroborated: 4/4 aligned references agree |
| `Be` | `Te` | object | clone fingerprint: OLD-token coverage 1.00 / dice 0.964 (runner-up 0.18); shared invariant tokens: k:mode,s:auto,k:btn,n:1,k:alpha,n:0.85,k:left,k:joy; literals: "auto","float" |
| `bf` | `Mf` | object | alpha-exact object body match (144 char canon; locals renumbered only); literals: "通货","地图","宝石" |
| `Bf` | `kf` | number | ref-vote-r0: 3/3 aligned free references across matched functions point to kf; corroborated: 3/3 aligned references agree |
| `Bg` | `vb` | function | clone fingerprint: OLD-token coverage 0.93 / dice 0.913 (runner-up 0.21); shared invariant tokens: p:round,n:100,t:<label>,t: <input type="range" data-mset=",t:" min=",t:" max=",t:" step=",t:" value="; literals: "<label>"," <input type=\"range\" data-mset=\"" |
| `bh` | `Th` | function | alpha-exact function body match (543 char canon; locals renumbered only); literals: none |
| `Bh` | `Uh` | function | alpha-exact function body match (260 char canon; locals renumbered only); literals: none |
| `bi` | `zi` | function | alpha-exact function body match (581 char canon; locals renumbered only); literals: none |
| `Bi` | `Pi` | function | ref-vote-r0: 5/5 aligned free references across matched functions point to Pi; corroborated: 5/5 aligned references agree |
| `Bk` | `_k` | function | alpha-exact function body match (2699 char canon; locals renumbered only); literals: "drum","k","lead" |
| `bl` | `kl` | function | alpha-exact function body match (2022 char canon; locals renumbered only); literals: none |
| `Bl` | `El` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.982 (runner-up 0.30); shared invariant tokens: n:1.3,p:getContext,s:2d,p:setTransform,p:createRadialGradient,p:width,n:48,n:1; literals: "2d","dragon" |
| `bm` | `Em` | object | alpha-exact object body match (517 char canon; locals renumbered only); literals: "#ffffff","#e2ccff","#8a4aff" |
| `bM` | `XM` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.70); shared invariant tokens: p:closest,p:target,s:.ovbox.mbench, .ovbox.mstash, .ovbox.mshop,s:.reveal,s:[data-m], [data-altar],p:contains,p:stopPropagation,p:classList; literals: ".reveal","[data-m], [data-altar]" |
| `Bn` | `_n` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.976 (runner-up 0.54); shared invariant tokens: p:rarity,n:3,p:uniq,p:codex,n:0,n:1,s:图鉴新发现: ,p:n; literals: "图鉴新发现: " |
| `bo` | `vo` | string | ref-vote-r0: 6/6 aligned free references across matched functions point to vo; corroborated: 6/6 aligned references agree |
| `Bo` | `Ro` | function | alpha-exact function body match (872 char canon; locals renumbered only); literals: "gem","sup" |
| `bp` | `jd` | function | clone fingerprint: OLD-token coverage 0.90 / dice 0.898 (runner-up 0.51); shared invariant tokens: n:1,n:0,p:min,p:floor,p:cur,s:pick; literals: "pick" |
| `Bp` | `cu` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.977 (runner-up 0.51); shared invariant tokens: p:areaMul,n:1,p:src,k:boostMul,p:boostMul,p:boosted,n:0,p:pl; literals: "ring","#ffd080" |
| `br` | `vr` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.971 (runner-up 0.55); shared invariant tokens: n:1,p:pl,p:jshMax,p:cls,p:S,s:jianke,p:jsh,n:0; literals: "jianke","gold" |
| `Br` | `wr` | function | clone fingerprint: OLD-token coverage 0.92 / dice 0.917 (runner-up 0.65); shared invariant tokens: p:includes,p:w,n:0,p:v; literals: none |
| `bs` | `vs` | number | ref-vote-r0: 8/8 aligned free references across matched functions point to vs; corroborated: 8/8 aligned references agree |
| `bS` | `u8` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.986 (runner-up 0.63); shared invariant tokens: p:getContext,s:2d,p:createRadialGradient,p:clearRect,n:0,p:width,p:height,p:imageSmoothingEnabled; literals: "2d","lighter" |
| `Bs` | `Ws` | expression | ref-vote-r0: 8/8 aligned free references across matched functions point to Ws; corroborated: 13/13 aligned references agree |
| `BS` | `vM` | function | alpha-exact function body match (288 char canon; locals renumbered only); literals: "mob" |
| `bT` | `e$` | function | clone fingerprint: OLD-token coverage 0.94 / dice 0.936 (runner-up 0.80); shared invariant tokens: p:x,p:y,p:hypot,n:1,p:r,k:x,k:y; literals: none |
| `Bt` | `Ft` | object | ref-vote-r0: 23/23 aligned free references across matched functions point to Ft; corroborated: 23/23 aligned references agree |
| `bu` | `Su` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.984 (runner-up 0.73); shared invariant tokens: p:frags,p:x,p:y,n:10,p:fade,p:min,n:1,p:life; literals: "lighter","source-over" |
| `Bu` | `Uu` | function | alpha-exact function body match (368 char canon; locals renumbered only); literals: none |
| `bw` | `Hw` | array | alpha-exact array body match (473 char canon; locals renumbered only); literals: "gmShake","shake","屏幕震动" |
| `Bw` | `d4` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.993 (runner-up 0.46); shared invariant tokens: p:st,s:active,s:portal,n:0.15,p:type,s:crypt,p:t,n:14; literals: "active","portal" |
| `bx` | `q5` | array | alpha-exact array body match (379 char canon; locals renumbered only); literals: "正常","魔法怪 ×2","稀有怪 ×3" |
| `Bx` | `Lx` | function | alpha-exact function body match (2099 char canon; locals renumbered only); literals: none |
| `by` | `Ub` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.997 (runner-up 0.46); shared invariant tokens: p:S,p:pl,p:height,p:style,s:#flife,p:hp,p:maxLife,n:0; literals: "#flife","%" |
| `By` | `M2` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.987 (runner-up 0.46); shared invariant tokens: p:length,p:eprojs,n:1,n:0,p:life,p:x,p:vx,p:y; literals: "mid","#ffffff" |
| `c$` | `R$` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.32); shared invariant tokens: s:char:bind,k:fresh,k:id,n:99,s:save:fail,p:T,n:30,s:浏览器存储空间不足 · 进度没能保存 —— 请导出存档码, 或删掉不用的角色; literals: "char:bind","save:fail" |
| `c0` | `xc` | function | alpha-exact function body match (1302 char canon; locals renumbered only); literals: none |
| `C0` | `P0` | function | alpha-exact function body match (902 char canon; locals renumbered only); literals: none |
| `c1` | `Vg` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.72); shared invariant tokens: p:L,s:#mjoy,p:id,p:joy,null,p:joyR,p:assign,p:style; literals: "#mjoy","px" |
| `c2` | `Db` | function | alpha-exact function body match (398 char canon; locals renumbered only); literals: none |
| `C2` | `F2` | object | ref-vote-r0: 3/3 aligned free references across matched functions point to F2; corroborated: 3/3 aligned references agree |
| `C3` | `N3` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.986 (runner-up 0.56); shared invariant tokens: p:offhand,p:equip,p:roll,p:pl,n:0,p:base,p:face,p:x; literals: "S","#4a3a2a" |
| `c4` | `B4` | function | clone fingerprint: OLD-token coverage 0.96 / dice 0.956 (runner-up 0.50); shared invariant tokens: p:equip,p:weapon,p:wt,p:base,s:none,k:quiver,s:箭袋,k:shield; literals: "none","箭袋" |
| `C4` | `a3` | object | alpha-exact object body match (2649 char canon; locals renumbered only); literals: "#a8a090","#8a8478","#ff8a30" |
| `c5` | `s5` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.982 (runner-up 0.60); shared invariant tokens: p:save,p:globalCompositeOperation,s:lighter,n:15,n:3,n:5.4,n:1,p:createRadialGradient; literals: "lighter","#ff6a50" |
| `C5` | `sw` | function | clone fingerprint: OLD-token coverage 0.96 / dice 0.961 (runner-up 0.39); shared invariant tokens: p:kind,s:item,p:S,n:1,p:s,p:clear,p:m,p:get; literals: "item","R" |
| `c6` | `TS` | function | alpha-exact function body match (261 char canon; locals renumbered only); literals: none |
| `C6` | `HS` | function | alpha-exact function body match (999 char canon; locals renumbered only); literals: " " |
| `c8` | `E6` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.990 (runner-up 0.43); shared invariant tokens: p:c,p:pl,p:tgt,p:lastM,p:m,p:x,p:y,p:face; literals: "jk:flicker","heavy" |
| `C8` | `_8` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.46); shared invariant tokens: p:id,p:t,s:<span class="tg">传奇</span>,p:length,p:ranges,p:join,p:map,p:ti; literals: "U","<span class=\"tg\">传奇</span>" |
| `ca` | `ca` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.967 (runner-up 0.57); shared invariant tokens: p:state,s:title,p:tab,p:scrollTop,s:#pbody,n:0,p:hidden,s:#panel; literals: "title","#pbody" |
| `Ca` | `Ra` | expression | ref-vote-r0: 11/11 aligned free references across matched functions point to Ra; corroborated: 11/11 aligned references agree |
| `cb` | `sy` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.16); shared invariant tokens: p:dbgView,s:main,p:join,p:map,s:常用调试,s:forge,s:万能工匠台,s:maps; literals: "main","常用调试" |
| `Cb` | `xy` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.994 (runner-up 0.58); shared invariant tokens: p:c,p:src,p:kind,s:clone,p:clone,p:pl,k:x,p:x; literals: "clone","sheathe" |
| `cc` | `bc` | function | alpha-exact function body match (439 char canon; locals renumbered only); literals: "pin","#c080ff","#8a8494" |
| `Cc` | `Ic` | object | alpha-exact object body match (213 char canon; locals renumbered only); literals: "katana","spear","staff" |
| `cd` | `md` | string | ref-vote-r0: 3/3 aligned free references across matched functions point to md; corroborated: 3/3 aligned references agree |
| `Cd` | `Pd` | null | ref-vote-r0: 4/4 aligned free references across matched functions point to Pd; corroborated: 4/4 aligned references agree |
| `Ce` | `Ee` | object | alpha-exact object body match (1590 char canon; locals renumbered only); literals: "灰烬之捷","#ff7a30","冰霜之捷" |
| `cf` | `Wf` | array | alpha-exact array body match (330 char canon; locals renumbered only); literals: "标准","大型","巨型" |
| `Cf` | `zf` | function | clone fingerprint: OLD-token coverage 0.96 / dice 0.962 (runner-up 0.39); shared invariant tokens: p:cur,n:0,s:没有,p:n,p:UID,null,p:dry,p:parse; literals: "没有" |
| `cg` | `G1` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.995 (runner-up 0.30); shared invariant tokens: s:lockP,s:先选一件装备,p:entries,p:cur,n:0,p:n,s:不足 (需要 ,p:join; literals: "lockP","P" |
| `Cg` | `fb` | function | clone fingerprint: OLD-token coverage 0.94 / dice 0.945 (runner-up 0.48); shared invariant tokens: p:exec,p:search,n:1,p:mode,s:on,n:0,s:off; literals: "1","on" |
| `Ch` | `Oh` | function | alpha-exact function body match (120 char canon; locals renumbered only); literals: none |
| `ci` | `pi` | function | alpha-exact function body match (1549 char canon; locals renumbered only); literals: "canvas","2d","." |
| `Ci` | `Di` | function | ref-vote-r0: 6/6 aligned free references across matched functions point to Di; corroborated: 6/6 aligned references agree |
| `ck` | `vk` | function | alpha-exact function body match (94 char canon; locals renumbered only); literals: none |
| `Ck` | `Fk` | object | alpha-exact object body match (543 char canon; locals renumbered only); literals: none |
| `cl` | `di` | function | alpha-exact function body match (1107 char canon; locals renumbered only); literals: "bright","uiB","uiZ" |
| `Cl` | `Ql` | array | alpha-exact array body match (176 char canon; locals renumbered only); literals: "swift","swift2" |
| `cM` | `UM` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.992 (runner-up 0.42); shared invariant tokens: s:仓库,p:it,p:loc,s:inv,s:stashinv,n:0,s:stash,s:取出; literals: "仓库","inv" |
| `CM` | `fT` | function | alpha-exact function body match (850 char canon; locals renumbered only); literals: "mouse","contextmenu" |
| `cn` | `pn` | object | alpha-exact object body match (235 char canon; locals renumbered only); literals: none |
| `Cn` | `Rn` | function | alpha-exact function body match (592 char canon; locals renumbered only); literals: none |
| `co` | `to` | function | ref-vote-r0: 5/5 aligned free references across matched functions point to to; corroborated: 5/5 aligned references agree |
| `Co` | `Bo` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.49); shared invariant tokens: p:mods,p:map,p:filter,p:fr,p:id,p:length,p:parse,p:stringify; literals: "破溃词缀无法被改变" |
| `cp` | `Ap` | function | clone fingerprint: OLD-token coverage 0.89 / dice 0.890 (runner-up 0.18); shared invariant tokens: p:device,p:sort,p:filter,p:inv,p:kind,s:map,p:hist,p:lastRun; literals: "map","<span class=\"neg\">· 死亡</span>" |
| `cr` | `fr` | function | alpha-exact function body match (807 char canon; locals renumbered only); literals: none |
| `Cr` | `Er` | number | ref-vote-r0: 5/5 aligned free references across matched functions point to Er; corroborated: 5/5 aligned references agree |
| `cs` | `ps` | object | alpha-exact object body match (126 char canon; locals renumbered only); literals: none |
| `cS` | `n8` | function | alpha-exact function body match (3145 char canon; locals renumbered only); literals: none |
| `Cs` | `Bs` | object | ref-vote-r0: 11/11 aligned free references across matched functions point to Bs; corroborated: 11/11 aligned references agree |
| `cT` | `ZT` | function | alpha-exact function body match (4228 char canon; locals renumbered only); literals: "hit:ailment","ignite","hit:ailed" |
| `Ct` | `Rt` | object | alpha-exact object body match (5461 char canon; locals renumbered only); literals: "....aaaa....","...abbbba...","..abbbbbba.." |
| `Cu` | `Ou` | function | alpha-exact function body match (10536 char canon; locals renumbered only); literals: "dash","line","circle" |
| `cv` | `vv` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.994 (runner-up 0.52); shared invariant tokens: p:cos,p:ang,p:sin,p:lineCap,s:round,p:wt,p:S,p:strokeStyle; literals: "round","katana" |
| `Cv` | `Fv` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.992 (runner-up 0.55); shared invariant tokens: p:mark,p:c,p:type,p:x,p:y,s:sniper,p:gid,s:snipe; literals: "sniper","snipe" |
| `cw` | `Fw` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.48); shared invariant tokens: null,p:abort,n:4000,p:replace,p:url,s:/version.json?t=,p:now,k:signal; literals: "u","/version.json?t=" |
| `Cw` | `s4` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.991 (runner-up 0.47); shared invariant tokens: p:M,p:Z,p:mods,p:ms,p:dens,n:1,p:sqrt,p:packSize; literals: "boss","box1" |
| `Cx` | `J5` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.70); shared invariant tokens: p:joy,p:hypot,p:x,p:y,p:id,null,p:walk,n:0.15; literals: none |
| `cy` | `t2` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.991 (runner-up 0.51); shared invariant tokens: p:spr,p:face,n:0,p:moving,p:abs,p:sin,p:T,n:11; literals: "rgba(0,0,0,0.42)","lighter" |
| `Cy` | `b2` | object | ref-vote-r0: 3/3 aligned free references across matched functions point to b2; corroborated: 3/3 aligned references agree |
| `d$` | `L$` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.79); shared invariant tokens: s:title,p:includes,p:titles,s:pet,p:pets,p:cos; literals: "title","pet" |
| `D$` | `nA` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.998 (runner-up 0.42); shared invariant tokens: s:stats:pre,p:has,p:sp,s:cofDouble,p:metaDiscount,n:30,s:stats:post,k:S; literals: "stats:pre","cofDouble" |
| `d0` | `E0` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.981 (runner-up 0.61); shared invariant tokens: s:slam,n:0.9,n:0.22,n:0,n:3,n:34,n:130,n:0.6; literals: "slam","scorch" |
| `D0` | `U0` | number | ref-vote-r0: 3/3 aligned free references across matched functions point to U0; corroborated: 3/3 aligned references agree |
| `d1` | `Qg` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.978 (runner-up 0.29); shared invariant tokens: s:#mctl,s:#overlay,p:state,s:play,s:dead,p:contains,p:classList,p:body; literals: "#mctl","#overlay" |
| `D1` | `b1` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.994 (runner-up 0.58); shared invariant tokens: null,p:getContext,p:b,s:2d,k:willReadFrequently,n:0,p:e,p:clearRect; literals: "2d","#050206" |
| `d2` | `Gb` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.929 (runner-up 0.29); shared invariant tokens: p:min,n:0.05,n:1000,n:0,p:Z,p:pl,p:state,s:play; literals: "play","dead" |
| `D2` | `V2` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.993 (runner-up 0.51); shared invariant tokens: p:cyc,p:pl,p:on,p:el,s:none,p:c,p:r,p:meleeArea; literals: "none","#000" |
| `d3` | `$3` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.984 (runner-up 0.40); shared invariant tokens: k:n,p:n,k:t,p:min,p:t,p:time,k:walk,p:walk; literals: none |
| `D3` | `eS` | function | alpha-exact function body match (933 char canon; locals renumbered only); literals: "melee" |
| `d4` | `D4` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.999 (runner-up 0.47); shared invariant tokens: k:B,k:s,k:why,k:dps,k:spirit,p:cls,s:boss,p:rarity; literals: "boss","首领兽魂" |
| `d5` | `n5` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.23); shared invariant tokens: p:join,p:map,p:filter,p:keys,s:title,p:cls,null,s: on; literals: "title"," on" |
| `D5` | `hw` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.982 (runner-up 0.50); shared invariant tokens: p:it,p:loc,s:stash,n:0,n:1,p:side,p:kind,s:item; literals: "stash","item" |
| `D6` | `t6` | function | alpha-exact function body match (1447 char canon; locals renumbered only); literals: none |
| `d8` | `j6` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.982 (runner-up 0.44); shared invariant tokens: p:c,p:pl,p:jsh,n:0,n:1,n:0.1,p:marks,p:x; literals: "ground","stuck" |
| `D8` | `oM` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.801 (runner-up 0.46); shared invariant tokens: s:#mjz,s:#mjoy,p:querySelector,p:joy,p:L,p:joyR,p:bx,p:by; literals: "#mjz","#mjoy" |
| `da` | `da` | object | alpha-exact object body match (93 char canon; locals renumbered only); literals: none |
| `Da` | `qa` | function | clone fingerprint: OLD-token coverage 0.88 / dice 0.875 (runner-up 0.61); shared invariant tokens: p:max,n:1,p:round,p:sqrt,n:0,p:fillRect,n:2; literals: none |
| `Db` | `Iy` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.984 (runner-up 0.40); shared invariant tokens: p:key,p:th,p:Z,s:crypt,p:rift,p:prop,p:t,p:revived; literals: "crypt","wraith" |
| `dc` | `vc` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.992 (runner-up 0.64); shared invariant tokens: n:5,p:r,n:34,p:delay,p:d,n:0.55,p:push,p:fx; literals: "tele","#8a70ff" |
| `Dc` | `Hc` | null | ref-vote-r0: 4/4 aligned free references across matched functions point to Hc; corroborated: 4/4 aligned references agree |
| `dd` | `bd` | function | alpha-exact function body match (322 char canon; locals renumbered only); literals: none |
| `Dd` | `Ud` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.989 (runner-up 0.55); shared invariant tokens: p:pl,p:dead,null,p:kind,s:sun,k:x,p:x,k:y; literals: "sun" |
| `de` | `de` | object | alpha-exact object body match (121 char canon; locals renumbered only); literals: "eq","craft" |
| `df` | `Hf` | function | clone fingerprint: OLD-token coverage 0.96 / dice 0.959 (runner-up 0.37); shared invariant tokens: p:pow,p:dmg,n:1,p:ramp,p:max,n:0,p:rampFrom; literals: none |
| `Df` | `e0` | object | alpha-exact object body match (135 char canon; locals renumbered only); literals: none |
| `dg` | `N1` | function | alpha-exact function body match (8000 char canon; locals renumbered only); literals: "rgba(0,0,0,0.38)","#3a3640","#2a2630" |
| `di` | `hi` | object | alpha-exact object body match (143 char canon; locals renumbered only); literals: "phys","fire","cold" |
| `Di` | `Ui` | function | clone fingerprint: OLD-token coverage 0.94 / dice 0.945 (runner-up 0.69); shared invariant tokens: p:includes,p:atlas,p:atlasPts,p:length,n:1,p:i,n:0,p:nodes; literals: none |
| `dk` | `xk` | function | alpha-exact function body match (1358 char canon; locals renumbered only); literals: "SCRIPT","STYLE" |
| `dl` | `hl` | object | alpha-exact object body match (167 char canon; locals renumbered only); literals: "pad" |
| `Dl` | `jl` | object | clone fingerprint: OLD-token coverage 0.90 / dice 0.905 (runner-up 0.31); shared invariant tokens: k:up,s:升华,s:再加 1 条腐化词缀, 全部词缀数值 +10%(至少 +1), 可以超越 T1,k:none,s:无事发生,s:祭坛沉默了,k:down,s:失衡; literals: "升华","再加 1 条腐化词缀, 全部词缀数值 +10%(至少 +1), 可以超越 T1" |
| `dm` | `vm` | function | alpha-exact function body match (1256 char canon; locals renumbered only); literals: none |
| `dM` | `_M` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.995 (runner-up 0.46); shared invariant tokens: p:tab,p:v,s:tab,p:seg,s:side,p:side,s:seg,p:bulk; literals: "tab","side" |
| `Dm` | `Ag` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.965 (runner-up 0.72); shared invariant tokens: p:rarity,n:0,p:name,p:base,n:1,n:2,p:includes; literals: none |
| `DM` | `xT` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.987 (runner-up 0.76); shared invariant tokens: p:has,p:pointerId,n:1,p:stopPropagation,p:set,k:x,p:clientX,k:y; literals: "#treecv" |
| `dn` | `hn` | function | alpha-exact function body match (642 char canon; locals renumbered only); literals: "hideout" |
| `Dn` | `Vn` | function | ref-vote-r0: 5/5 aligned free references across matched functions point to Vn; corroborated: 6/6 aligned references agree |
| `Do` | `Wo` | number | ref-vote-r0: 11/11 aligned free references across matched functions point to Wo; corroborated: 11/11 aligned references agree |
| `dp` | `Rp` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.871 (runner-up 0.29); shared invariant tokens: p:cls,p:asc,p:ascPts,n:0,p:join,p:map,p:col,p:n; literals: "\">","</b><small>" |
| `Dp` | `fu` | function | alpha-exact function body match (265 char canon; locals renumbered only); literals: none |
| `dr` | `pr` | null | ref-vote-r0: 8/8 aligned free references across matched functions point to pr; corroborated: 8/8 aligned references agree |
| `Dr` | `v3` | function | clone fingerprint: OLD-token coverage 0.87 / dice 0.891 (runner-up 0.30); shared invariant tokens: p:tab,p:tabs,s:gem,p:join,p:map,t:data-wd=",s:<p class="dim">空</p>,t:<div class="gchips">; literals: "gem","data-wd=\"" |
| `ds` | `hs` | array | alpha-exact array body match (60 char canon; locals renumbered only); literals: "左键","右键","Q" |
| `Ds` | `$s` | function | alpha-exact function body match (434 char canon; locals renumbered only); literals: "gem" |
| `DS` | `xM` | array | alpha-exact array body match (60 char canon; locals renumbered only); literals: "#f0f0f0","#8a8cff","#ecd85a" |
| `dt` | `dt` | object | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.11); shared invariant tokens: k:x,s:<path d="M6 6l12 12M18 6L6 18"/>,n:2.4,k:sort,s:<path d="M4 6h16M7 12h10M10 18h4"/>,k:sell,k:craft,s:<path d="M14 4l6 6-9 9H5v-6z"/><path d="M12 6l6 6"/>; literals: "<path d=\"M6 6l12 12M18 6L6 18\"/>","<path d=\"M4 6h16M7 12h10M10 18h4\"/>" |
| `dT` | `KT` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.975 (runner-up 0.58); shared invariant tokens: s:player:avoid,p:avoided,p:dot,p:o,p:roll,p:pl,n:0,p:T; literals: "player:avoid" |
| `Dt` | `Dt` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.979 (runner-up 0.45); shared invariant tokens: p:state,s:play,p:Z,p:type,s:map,p:dead,p:pl,p:god; literals: "play","map" |
| `DT` | `x$` | function | clone fingerprint: OLD-token coverage 0.95 / dice 0.946 (runner-up 0.51); shared invariant tokens: p:rows,n:0,p:length,n:2,null,p:pal,p:push,k:x; literals: "." |
| `du` | `ou` | function | clone fingerprint: OLD-token coverage 0.85 / dice 0.856 (runner-up 0.43); shared invariant tokens: p:getBoundingClientRect,s:#stage,p:max,n:200,p:width,p:height,p:min,n:2; literals: "#stage" |
| `dv` | `xv` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.996 (runner-up 0.48); shared invariant tokens: p:LIGHTS,n:0.85,p:sin,p:T,n:9,n:0.08,n:0.05,p:push; literals: "hideout","wings" |
| `Dw` | `u4` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.993 (runner-up 0.56); shared invariant tokens: p:x,p:pl,n:2,p:y,n:57600,p:t,p:st,s:idle; literals: "idle","tele" |
| `dx` | `$5` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.966 (runner-up 0.56); shared invariant tokens: n:0,p:fx,p:i,p:min,n:1,p:r,n:120,p:fxSum; literals: none |
| `Dx` | `Ix` | function | alpha-exact function body match (1125 char canon; locals renumbered only); literals: "cur","map","gem" |
| `dy` | `s2` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.48); shared invariant tokens: p:beast,p:S,p:soulOff,p:uid,k:B,k:s,k:why,k:dps; literals: none |
| `Dy` | `$2` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.972 (runner-up 0.58); shared invariant tokens: p:length,p:grounds,n:1,n:0,p:t,p:tick,n:0.3,p:mons; literals: "fire","#ff6a1a" |
| `e$` | `RT` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.989 (runner-up 0.36); shared invariant tokens: p:globalAlpha,n:0.35,n:26,n:2,n:17,s:#000,n:56,n:1; literals: "#000","#e9eef2" |
| `e0` | `k0` | function | alpha-exact function body match (801 char canon; locals renumbered only); literals: none |
| `E0` | `O0` | function | alpha-exact function body match (230 char canon; locals renumbered only); literals: none |
| `e1` | `ig` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.992 (runner-up 0.40); shared invariant tokens: p:width,p:height,p:type,p:Z,s:hideout,p:th,p:key,p:crypt; literals: "hideout","high" |
| `E1` | `l1` | object | ref-vote-r0: 3/3 aligned free references across matched functions point to l1; corroborated: 3/3 aligned references agree |
| `e2` | `bg` | function | alpha-exact function body match (1412 char canon; locals renumbered only); literals: "#cfd8e4","#c8a040","#c8384a" |
| `E2` | `q2` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.981 (runner-up 0.64); shared invariant tokens: p:ambA,p:length,p:amb,p:glow,p:globalCompositeOperation,s:lighter,n:0.6,n:0.4; literals: "lighter","source-over" |
| `E3` | `U3` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.986 (runner-up 0.52); shared invariant tokens: p:box,p:round,p:x,p:w,n:2,p:y,p:h,p:fillStyle; literals: "rgba(0,0,0,0.4)","#b080ff" |
| `E4` | `o3` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.987 (runner-up 0.34); shared invariant tokens: p:rarity,p:S,p:rar,p:ms,p:Z,n:100,p:th,p:key; literals: "swamp","world" |
| `e6` | `mS` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.986 (runner-up 0.45); shared invariant tokens: p:length,p:minions,n:1,n:0,p:t,p:cd,p:moving,p:x; literals: "#d8d0b8","#8a8070" |
| `E6` | `ZS` | object | alpha-exact object body match (858 char canon; locals renumbered only); literals: "Transmute","Aug","Alteration" |
| `ea` | `ta` | number | ref-vote-r0: 9/9 aligned free references across matched functions point to ta; corroborated: 10/10 aligned references agree |
| `Ea` | `La` | object | alpha-exact object body match (208 char canon; locals renumbered only); literals: none |
| `Eb` | `My` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.976 (runner-up 0.32); shared invariant tokens: n:1,s:lspear,p:fw,p:fch,p:pl,p:x,p:y,n:26; literals: "lspear","gold" |
| `ec` | `rc` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.988 (runner-up 0.68); shared invariant tokens: p:filter,p:inv,p:kind,s:map,p:splice,n:0,p:length,p:sort; literals: "map" |
| `Ec` | `zc` | array | ref-vote-r0: 6/6 aligned free references across matched functions point to zc; corroborated: 6/6 aligned references agree |
| `ed` | `rd` | object | ref-vote-r0: 3/3 aligned free references across matched functions point to rd; corroborated: 3/3 aligned references agree |
| `Ed` | `Od` | array | alpha-exact array body match (39 char canon; locals renumbered only); literals: none |
| `ee` | `ee` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.995 (runner-up 0.46); shared invariant tokens: n:1,p:dead,p:inv,n:0,p:fixed,null,k:m,k:c; literals: "phys","hit:base" |
| `Ee` | `je` | object | alpha-exact object body match (224 char canon; locals renumbered only); literals: none |
| `ef` | `nf` | function | alpha-exact function body match (423 char canon; locals renumbered only); literals: none |
| `Ef` | `Qf` | function | alpha-exact function body match (559 char canon; locals renumbered only); literals: "[data-sc]" |
| `eg` | `j1` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.998 (runner-up 0.49); shared invariant tokens: s:item,s:ruin,p:createElement,s:canvas,p:getContext,s:2d,p:font,t:15px ; literals: "item","ruin" |
| `Eg` | `pb` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.856 (runner-up 0.24); shared invariant tokens: p:on,n:0,p:touchMode,p:add,p:classList,p:body,s:mob,p:left; literals: "mob","mobl" |
| `Eh` | `Fh` | array | alpha-exact array body match (237 char canon; locals renumbered only); literals: none |
| `ei` | `si` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.998 (runner-up 0.45); shared invariant tokens: p:c,p:src,p:kind,p:ang,p:PI,p:x,p:pl,p:y; literals: "heavy","#e0c080" |
| `Ei` | `Gi` | object | alpha-exact object body match (54 char canon; locals renumbered only); literals: none |
| `Ek` | `qk` | object | alpha-exact object body match (146 char canon; locals renumbered only); literals: none |
| `el` | `ol` | function | ref-vote-r0: 5/5 aligned free references across matched functions point to ol; corroborated: 5/5 aligned references agree |
| `El` | `Yl` | function | clone fingerprint: OLD-token coverage 0.95 / dice 0.957 (runner-up 0.75); shared invariant tokens: null,n:1000000000,p:objs,p:kind,s:box,p:open,p:has,p:x; literals: "box","tgate" |
| `em` | `lm` | function | alpha-exact function body match (589 char canon; locals renumbered only); literals: none |
| `eM` | `OM` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.996 (runner-up 0.45); shared invariant tokens: p:it,null,p:uid,n:0,s:sel,p:sel,k:cur,p:k; literals: "sel","selcur" |
| `Em` | `J1` | expression | ref-vote-r0: 3/3 aligned free references across matched functions point to J1; corroborated: 3/3 aligned references agree |
| `EM` | `pT` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.986 (runner-up 0.46); shared invariant tokens: p:touchMode,p:pointerType,s:mouse,p:t,p:closest,p:target,s:[data-tt],s:#tip; literals: "mouse","[data-tt]" |
| `en` | `rn` | function | alpha-exact function body match (240 char canon; locals renumbered only); literals: "</svg>" |
| `En` | `Ln` | number | ref-vote-r0: 5/5 aligned free references across matched functions point to Ln; corroborated: 5/5 aligned references agree |
| `eo` | `ao` | function | ref-vote-r0: 5/5 aligned free references across matched functions point to ao; corroborated: 6/6 aligned references agree |
| `Eo` | `Lo` | number | ref-vote-r0: 11/11 aligned free references across matched functions point to Lo; corroborated: 11/11 aligned references agree |
| `ep` | `rp` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.988 (runner-up 0.33); shared invariant tokens: n:1,p:rarity,p:meta,null,p:kind,s:soul,n:0,p:last; literals: "soul","lockP" |
| `Ep` | `Wp` | function | clone fingerprint: OLD-token coverage 0.96 / dice 0.958 (runner-up 0.16); shared invariant tokens: p:debug,s:该栏位没有可导出的数据,p:cur,p:sbase,p:reduce,p:values,p:tabs,p:length; literals: "该栏位没有可导出的数据","<p class=\"dim\">共享仓库 (" |
| `er` | `sr` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.988 (runner-up 0.39); shared invariant tokens: p:bh,p:d,s:proj,p:atan2,p:y,p:pl,p:x,s:skill:proj; literals: "proj","skill:proj" |
| `Er` | `Br` | object | alpha-exact object body match (54 char canon; locals renumbered only); literals: none |
| `es` | `es` | array | alpha-exact array body match (24736 char canon; locals renumbered only); literals: "witch","冰封连锁","冻结时施放 + 彗星 / 冰霜炸弹(编织者 CoF)" |
| `eS` | `Q6` | array | alpha-exact array body match (183 char canon; locals renumbered only); literals: "..w..w........","...w.w........",".y.owooo......" |
| `Es` | `Cs` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.91); shared invariant tokens: p:sel,null,k:eq,k:inv,p:find,p:uid; literals: none; corroborated: 11/11 aligned references agree |
| `ES` | `$8` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.996 (runner-up 0.45); shared invariant tokens: p:kind,s:item,p:impl,p:push,k:t,p:id,p:v,k:c; literals: "item","#c8c0b0" |
| `et` | `tt` | object | alpha-exact object body match (1221 char canon; locals renumbered only); literals: "bishop","亡魂复苏","封印棺椁" |
| `eT` | `BT` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.972 (runner-up 0.50); shared invariant tokens: p:length,p:oils,n:1,n:0,p:t,p:splice,p:mons,p:dead; literals: none |
| `Et` | `Lt` | object | alpha-exact object body match (6576 char canon; locals renumbered only); literals: "fireball","icespear","arc" |
| `Eu` | `Fu` | function | alpha-exact function body match (595 char canon; locals renumbered only); literals: none |
| `Ev` | `qv` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.979 (runner-up 0.52); shared invariant tokens: s:block,p:x,p:pl,p:y,n:22,n:0,n:1,s:info; literals: "block","info" |
| `ew` | `zp` | function | clone fingerprint: OLD-token coverage 0.87 / dice 0.821 (runner-up 0.21); shared invariant tokens: p:matchMedia,p:matches,s:(pointer: coarse),n:0,p:test,p:userAgent,p:maxTouchPoints,n:1; literals: "(pointer: coarse)","(any-pointer: fine)" |
| `Ew` | `n4` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.973 (runner-up 0.67); shared invariant tokens: p:r,p:c,n:70,p:x,p:y,n:1,n:0,n:12; literals: "light","zap" |
| `ex` | `fx` | function | alpha-exact function body match (1498 char canon; locals renumbered only); literals: none |
| `Ex` | `X5` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.993 (runner-up 0.38); shared invariant tokens: s:#mskills,p:L,p:join,p:map,p:skills,p:gid,p:W,p:H; literals: "#mskills","-" |
| `Ey` | `v2` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.983 (runner-up 0.48); shared invariant tokens: p:Z,p:type,s:hideout,p:th,p:key,null,p:length,p:amb; literals: "hideout" |
| `F` | `F` | object | clone fingerprint: OLD-token coverage 0.89 / dice 0.893 (runner-up 0.15); shared invariant tokens: k:trans,k:n,s:蜕变石,k:v,n:0.02,k:w,n:300,k:col; literals: "蜕变石","#8ab4dc" |
| `f$` | `E$` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.994 (runner-up 0.50); shared invariant tokens: k:x,k:y,k:h,k:ang,k:col,n:0.5,p:lineCap,s:round; literals: "round","thunder" |
| `F$` | `oA` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.993 (runner-up 0.41); shared invariant tokens: s:stats:post,k:S,k:ks,p:has,s:spirit,p:maxLife,n:0.5,p:maxES; literals: "stats:post","spirit" |
| `f0` | `R0` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.985 (runner-up 0.61); shared invariant tokens: p:ang,p:filter,p:x,p:y,p:hypot,p:r,n:1,p:atan2; literals: none |
| `F0` | `H0` | function | ref-vote-r0: 3/3 aligned free references across matched functions point to H0; corroborated: 3/3 aligned references agree |
| `f1` | `tw` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.976 (runner-up 0.58); shared invariant tokens: n:1,p:mLabelAt,p:t,p:assign,k:id,p:pointerId,k:l,k:e; literals: "tap" |
| `F1` | `g1` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.988 (runner-up 0.53); shared invariant tokens: n:0,p:kind,s:sun,p:getContext,s:2d,p:clearRect,p:width,p:height; literals: "sun","2d" |
| `F2` | `K2` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.979 (runner-up 0.56); shared invariant tokens: n:1,p:pl,p:cyc,p:el,n:0.15,p:globalAlpha,n:0.18,n:0.08; literals: "#8a8090","round" |
| `F3` | `X3` | function | clone fingerprint: OLD-token coverage 0.95 / dice 0.953 (runner-up 0.70); shared invariant tokens: p:act,p:pl,null,p:rep,n:0,p:dead,p:roll,p:i; literals: none |
| `f4` | `F4` | function | clone fingerprint: OLD-token coverage 0.86 / dice 0.860 (runner-up 0.31); shared invariant tokens: p:q,p:length,p:nodes,p:join,p:map,p:ks,p:S,p:find; literals: "<div class=\"row\"><span style=\"color:","\">" |
| `F4` | `gx` | array | alpha-exact array body match (84 char canon; locals renumbered only); literals: "trans","aug","alt" |
| `f5` | `o5` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.31); shared invariant tokens: s:先进入游戏,null,p:n,s: · ,p:lim,s:未获得,p:tower,p:hall; literals: "先进入游戏"," · " |
| `F5` | `uw` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.58); shared invariant tokens: s:tap,p:querySelector,s:#overlay .mblastw .blast,p:add,p:classList,s:pop,p:last,p:vaal; literals: "tap","#overlay .mblastw .blast" |
| `f6` | `$S` | function | alpha-exact function body match (311 char canon; locals renumbered only); literals: none |
| `F6` | `e6` | function | alpha-exact function body match (1419 char canon; locals renumbered only); literals: none |
| `f8` | `L6` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.992 (runner-up 0.45); shared invariant tokens: p:pl,p:chain,p:chainId,n:0,p:lastM,null,p:filter,p:marks; literals: "jk:finish","rise" |
| `F8` | `sM` | function | alpha-exact function body match (1444 char canon; locals renumbered only); literals: "#msafe","#stage" |
| `fa` | `fa` | object | alpha-exact object body match (147 char canon; locals renumbered only); literals: "bag" |
| `Fa` | `Ha` | function | ref-vote-r0: 6/6 aligned free references across matched functions point to Ha; corroborated: 8/8 aligned references agree |
| `fb` | `oy` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.28); shared invariant tokens: p:col,p:n,p:boss,p:bossKills,s: · <span style="color:#ffd27a">首杀必得专属传奇(T4+)</span>,p:env,p:envD,p:enc; literals: "<div class=\"tinfo\" style=\"--uc:","\"><div><b>首领</b> " |
| `Fb` | `jy` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.990 (runner-up 0.57); shared invariant tokens: p:x,p:y,n:24,p:gib,p:t,n:90,n:0.6,k:vz; literals: "crystal","ice" |
| `fc` | `yc` | array | alpha-exact array body match (106 char canon; locals renumbered only); literals: "xbow","grenade","orbstorm" |
| `Fc` | `Nc` | array | alpha-exact array body match (755 char canon; locals renumbered only); literals: "skillLvl","lifeInc","critInc" |
| `fd` | `gd` | function | alpha-exact function body match (742 char canon; locals renumbered only); literals: none |
| `Fd` | `Hd` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.985 (runner-up 0.43); shared invariant tokens: p:id,k:a,k:big,k:L,k:pose,p:span,n:1,p:save; literals: "lighter","#ffffff" |
| `Fe` | `Fe` | object | alpha-exact object body match (237 char canon; locals renumbered only); literals: none |
| `ff` | `Nf` | function | alpha-exact function body match (259 char canon; locals renumbered only); literals: none |
| `Ff` | `xf` | array | alpha-exact array body match (88 char canon; locals renumbered only); literals: "chaos","annul","vaal" |
| `fg` | `W1` | function | alpha-exact function body match (2328 char canon; locals renumbered only); literals: "rm","add","ch" |
| `Fg` | `kb` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.969 (runner-up 0.44); shared invariant tokens: p:forEach,p:querySelectorAll,s:#overlay [data-mset],p:oninput,p:mset,p:dataset,p:value,p:target; literals: "#overlay [data-mset]","%" |
| `fh` | `yh` | array | alpha-exact array body match (333 char canon; locals renumbered only); literals: "cdAdd","ricochet","overcharge" |
| `fi` | `ui` | object | alpha-exact object body match (170 char canon; locals renumbered only); literals: "tri" |
| `Fi` | `Hi` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.997 (runner-up 0.09); shared invariant tokens: s:witch,k:v,k:cls,k:fsalt,p:now,k:debug,k:level,n:1; literals: "witch","staff" |
| `fk` | `kk` | function | alpha-exact function body match (118 char canon; locals renumbered only); literals: "\\$&" |
| `Fk` | `Kk` | function | alpha-exact function body match (361 char canon; locals renumbered only); literals: none |
| `fl` | `ul` | null | ref-vote-r0: 5/5 aligned free references across matched functions point to ul; corroborated: 5/5 aligned references agree |
| `Fl` | `Ll` | number | ref-vote-r0: 3/3 aligned free references across matched functions point to Ll; corroborated: 6/6 aligned references agree |
| `fm` | `ym` | function | alpha-exact function body match (1129 char canon; locals renumbered only); literals: none |
| `Fm` | `$g` | function | alpha-exact function body match (491 char canon; locals renumbered only); literals: "U" |
| `FM` | `kT` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.986 (runner-up 0.60); shared invariant tokens: p:touchMode,p:pointerType,s:mouse,p:id,p:target,s:treecv,n:1,p:stopPropagation; literals: "mouse","treecv" |
| `fn` | `un` | function | alpha-exact function body match (357 char canon; locals renumbered only); literals: "ring" |
| `Fn` | `Un` | expression | ref-vote-r0: 6/6 aligned free references across matched functions point to Un; corroborated: 6/6 aligned references agree |
| `fo` | `eo` | array | ref-vote-r0: 6/6 aligned free references across matched functions point to eo; corroborated: 9/9 aligned references agree |
| `Fo` | `Fo` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.975 (runner-up 0.20); shared invariant tokens: n:0.999,p:set,p:defineProperty,s:globalAlpha,k:configurable,n:0,k:get,p:call; literals: "globalAlpha" |
| `fp` | `Cp` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.973 (runner-up 0.30); shared invariant tokens: p:S,p:a,n:0,t:<div class="row"><span>,t:</span><b>,t:</b></div>,p:Z,p:ms; literals: "<div class=\"row\"><span>","</span><b>" |
| `fr` | `dr` | function | alpha-exact function body match (596 char canon; locals renumbered only); literals: none |
| `Fr` | `Ir` | function | clone fingerprint: OLD-token coverage 0.94 / dice 0.943 (runner-up 0.71); shared invariant tokens: p:length,p:tabs,s:该仓库页已满,n:1,p:kind,s:item,s:map,s:soul; literals: "该仓库页已满","item" |
| `fs` | `us` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.27); shared invariant tokens: k:title,k:body,k:acts,k:border,s:#5c4a36,k:foot,k:key,k:hint; literals: "#5c4a36","<small class=\"mvdhh\">" |
| `fS` | `r8` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.987 (runner-up 0.36); shared invariant tokens: p:max,n:0,p:min,n:0.1,p:T,p:lastT,p:flare,n:1.4; literals: none |
| `Fs` | `Is` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.63); shared invariant tokens: p:tree,p:has,null,p:length,p:shift,p:adj,p:add,p:set; literals: none |
| `FS` | `kM` | function | alpha-exact function body match (419 char canon; locals renumbered only); literals: none |
| `ft` | `ft` | function | clone fingerprint: OLD-token coverage 0.91 / dice 0.912 (runner-up 0.65); shared invariant tokens: n:1,p:max,p:ceil,p:abs,n:6,n:0,p:x,p:y; literals: none |
| `fT` | `_T` | function | alpha-exact function body match (870 char canon; locals renumbered only); literals: none |
| `Ft` | `Bt` | object | alpha-exact object body match (1841 char canon; locals renumbered only); literals: "开服元老","#ffd27a","裂隙行者" |
| `fu` | `Kp` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.992 (runner-up 0.39); shared invariant tokens: p:state,s:play,p:button,n:0,null,n:1,p:length,p:labelRects; literals: "play","loot" |
| `fv` | `kv` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.981 (runner-up 0.64); shared invariant tokens: p:fillStyle,s:#3a2a1a,p:fillRect,p:x,n:6,p:y,n:1,n:12; literals: "#3a2a1a","#ff6a1a" |
| `Fw` | `p4` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.986 (runner-up 0.44); shared invariant tokens: p:st,s:idle,p:type,s:ice,p:x,p:pl,n:2,p:y; literals: "idle","ice" |
| `Fx` | `jx` | object | alpha-exact object body match (385 char canon; locals renumbered only); literals: none |
| `fy` | `a2` | function | alpha-exact function body match (1641 char canon; locals renumbered only); literals: "#7ab040","#c0f080" |
| `Fy` | `T2` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.969 (runner-up 0.28); shared invariant tokens: p:dead,p:pl,s:tick,k:dt,n:0,p:w,p:arrowup,p:s; literals: "tick","rollCd" |
| `g$` | `O$` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.988 (runner-up 0.50); shared invariant tokens: p:filter,p:slice,p:rooms,p:M,p:Z,n:1,p:hypot,p:cx; literals: "tele","裂隙涌出了新的怪物" |
| `G$` | `iA` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.987 (runner-up 0.41); shared invariant tokens: s:hit:after,k:m,k:c,k:src,k:fixed,k:crit,p:prop,p:t; literals: "hit:after","crit" |
| `g0` | `L0` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.988 (runner-up 0.47); shared invariant tokens: n:1,p:spr,p:length,p:frags,n:0,p:ceil,p:face,p:x; literals: "ash","ice" |
| `G0` | `_0` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.990 (runner-up 0.67); shared invariant tokens: p:c,s:crack,n:50,p:hits,n:4,p:push,p:fx,k:k; literals: "crack","ring" |
| `g1` | `Km` | number | ref-vote-r0: 3/3 aligned free references across matched functions point to Km; corroborated: 3/3 aligned references agree |
| `g2` | `Hm` | function | alpha-exact function body match (6095 char canon; locals renumbered only); literals: "rgba(0,0,0,0.35)","#4a3424","#6a4a30" |
| `g3` | `L3` | function | clone fingerprint: OLD-token coverage 0.92 / dice 0.918 (runner-up 0.26); shared invariant tokens: p:join,p:map,p:slice,p:floors,n:8,p:ok,s:fail,p:n; literals: "fail","guard" |
| `G3` | `aS` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.993 (runner-up 0.47); shared invariant tokens: p:c,p:gid,p:src,p:includes,s:escape,s:blink,s:mark,s:noutou; literals: "escape","blink" |
| `g4` | `H4` | object | alpha-exact object body match (273 char canon; locals renumbered only); literals: "#1b1416","#f5f1ea","#d4cdc4" |
| `g5` | `f5` | function | alpha-exact function body match (2373 char canon; locals renumbered only); literals: "ember-rift:" |
| `G5` | `gw` | array | alpha-exact array body match (55 char canon; locals renumbered only); literals: "lockP","lockS","unlock" |
| `G6` | `s6` | function | alpha-exact function body match (807 char canon; locals renumbered only); literals: none |
| `g8` | `B6` | object | alpha-exact object body match (207 char canon; locals renumbered only); literals: none |
| `G8` | `iM` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.68); shared invariant tokens: p:id,p:pointerId,p:fired,p:hypot,p:clientX,p:x,p:clientY,p:y; literals: none |
| `ga` | `ya` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.67); shared invariant tokens: p:isArray,p:bsup,p:length,p:push; literals: none |
| `Ga` | `Wa` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.973 (runner-up 0.73); shared invariant tokens: null,s:title,p:title,p:showTitle,n:1,s:pet,s:mount,p:look; literals: "title","pet" |
| `gb` | `fy` | function | alpha-exact function body match (550 char canon; locals renumbered only); literals: none |
| `Gb` | `zy` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.994 (runner-up 0.42); shared invariant tokens: p:metaCd,p:pl,n:0,p:chT,p:pch,p:fch,n:2,p:rageT; literals: "freeze","hideout" |
| `gc` | `Sc` | number | ref-vote-r0: 3/3 aligned free references across matched functions point to Sc; corroborated: 3/3 aligned references agree |
| `Gc` | `Zc` | object | alpha-exact object body match (147 char canon; locals renumbered only); literals: "sig_crypt","sig_lava","sig_ice" |
| `gd` | `wd` | function | alpha-exact function body match (994 char canon; locals renumbered only); literals: none |
| `Gd` | `_d` | array | alpha-exact array body match (278 char canon; locals renumbered only); literals: "wings","翅膀","back" |
| `ge` | `pe` | object | alpha-exact object body match (454 char canon; locals renumbered only); literals: "gen" |
| `Ge` | `Ge` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.980 (runner-up 0.63); shared invariant tokens: n:5,n:0,n:20,k:x,k:y,n:6,n:160,p:max; literals: none |
| `gf` | `Sf` | function | clone fingerprint: OLD-token coverage 0.96 / dice 0.962 (runner-up 0.39); shared invariant tokens: n:1,n:0.12,n:2.6,n:5,n:3.2,p:pow,n:0.88,n:0.8; literals: none |
| `Gg` | `Sb` | function | alpha-exact function body match (341 char canon; locals renumbered only); literals: "." |
| `gh` | `Mh` | function | alpha-exact function body match (1625 char canon; locals renumbered only); literals: "\|",":","." |
| `gi` | `ji` | null | ref-vote-r0: 7/7 aligned free references across matched functions point to ji; corroborated: 7/7 aligned references agree |
| `Gi` | `_i` | function | alpha-exact function body match (25696 char canon; locals renumbered only); literals: "attack","spell","melee" |
| `gk` | `$k` | array | alpha-exact array body match (73 char canon; locals renumbered only); literals: "title","placeholder","label" |
| `Gk` | `Jk` | array | alpha-exact array body match (47 char canon; locals renumbered only); literals: none |
| `gl` | `vl` | function | alpha-exact function body match (372 char canon; locals renumbered only); literals: none |
| `Gl` | `Pl` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.993 (runner-up 0.24); shared invariant tokens: p:querySelector,s:#overlay .ovbox,s:.reveal,p:remove,p:createElement,s:div,p:className,s:reveal rv-; literals: "#overlay .ovbox",".reveal" |
| `gM` | `YM` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.990 (runner-up 0.38); shared invariant tokens: p:tab,p:v,p:sel,null,s:tab,p:k,s:pick,n:0.35; literals: "tab","pick" |
| `Gm` | `Rg` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.974 (runner-up 0.55); shared invariant tokens: p:r,p:size,n:0,n:1,n:2,p:min,p:cap,p:spawn; literals: none |
| `GM` | `q8` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.981 (runner-up 0.61); shared invariant tokens: p:cls,p:asc,p:find,p:includes,p:ref,p:n,n:0,p:filter; literals: none |
| `gn` | `bn` | expression | ref-vote-r0: 9/9 aligned free references across matched functions point to bn; corroborated: 9/9 aligned references agree |
| `Gn` | `Dn` | function | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to Dn; corroborated: 3/3 aligned references agree |
| `go` | `yo` | function | alpha-exact function body match (911 char canon; locals renumbered only); literals: none |
| `Gp` | `du` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.978 (runner-up 0.84); shared invariant tokens: p:kind,s:gasarrow,p:gassed,n:1,p:x,p:y,p:c,p:src; literals: "gasarrow" |
| `gr` | `br` | function | alpha-exact function body match (309 char canon; locals renumbered only); literals: none |
| `gs` | `ys` | number | ref-vote-r0: 8/8 aligned free references across matched functions point to ys; corroborated: 8/8 aligned references agree |
| `gS` | `p8` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.990 (runner-up 0.52); shared invariant tokens: k:c,k:sc,k:L,p:save,p:globalAlpha,p:globalCompositeOperation,s:lighter,p:drawImage; literals: "lighter","source-over" |
| `Gs` | `Hs` | expression | ref-vote-r0: 11/11 aligned free references across matched functions point to Hs; corroborated: 12/12 aligned references agree |
| `GS` | `SM` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.996 (runner-up 0.43); shared invariant tokens: p:inv,p:seg,s:items,p:filter,p:kind,s:map,s:mveq,p:stats; literals: "items","map" |
| `gu` | `wu` | function | clone fingerprint: OLD-token coverage 0.96 / dice 0.957 (runner-up 0.62); shared invariant tokens: p:flip,p:img,p:createElement,s:canvas,p:width,p:w,n:2,p:height; literals: "f","canvas" |
| `Gu` | `Vu` | function | alpha-exact function body match (1533 char canon; locals renumbered only); literals: none |
| `gv` | `$v` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.986 (runner-up 0.69); shared invariant tokens: p:r,p:c,n:16,p:bigR,n:1,p:push,p:fx,k:k; literals: "ring","#ffb050" |
| `Gw` | `m4` | function | alpha-exact function body match (3356 char canon; locals renumbered only); literals: none |
| `gx` | `D5` | array | alpha-exact array body match (422 char canon; locals renumbered only); literals: "正常","弱化 -40%","脆皮 -70%" |
| `Gx` | `zx` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.990 (runner-up 0.38); shared invariant tokens: p:pl,p:Z,p:state,s:play,p:e,null,p:length,p:fly; literals: "play","dragon" |
| `Gy` | `Tm` | function | alpha-exact function body match (1021 char canon; locals renumbered only); literals: "early" |
| `H` | `H` | function | alpha-exact function body match (554 char canon; locals renumbered only); literals: none |
| `h$` | `P$` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.68); shared invariant tokens: p:cur,k:n0,p:n0,k:floors,p:floors,k:deaths,p:deaths,k:sig; literals: none |
| `H$` | `fA` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.988 (runner-up 0.38); shared invariant tokens: s:kill:corpse,k:m,k:corpse,s:prop:death,s:hit:after,k:dom,k:by,p:length; literals: "kill:corpse","prop:death" |
| `h0` | `p0` | function | clone fingerprint: OLD-token coverage 0.90 / dice 0.901 (runner-up 0.21); shared invariant tokens: p:menu,n:0,n:1,p:onclick,s:#fClose,p:querySelector,s:#overlay .fdog,p:happyT; literals: "#fClose","#overlay .fdog" |
| `H0` | `Q0` | object | alpha-exact object body match (114 char canon; locals renumbered only); literals: none |
| `h1` | `Zm` | array | alpha-exact array body match (732 char canon; locals renumbered only); literals: "........................k.k.........","........................kkk.........",".......................kbBbk........" |
| `h2` | `Kb` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.41); shared invariant tokens: p:querySelector,s:#overlay .ovbox.stash,p:closest,p:target,s:[data-wd],s:[data-dp],s:[data-dg],s:wd; literals: "#overlay .ovbox.stash","[data-wd]" |
| `H2` | `tv` | function | clone fingerprint: OLD-token coverage 0.95 / dice 0.950 (runner-up 0.66); shared invariant tokens: n:1,s:title,p:titles,p:title,p:showTitle,n:0,s:pet,p:pets; literals: "title","pet" |
| `h3` | `R3` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.990 (runner-up 0.42); shared invariant tokens: p:filter,p:floors,p:ok,p:length,p:max,p:map,p:n,n:0; literals: none |
| `H3` | `nS` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.980 (runner-up 0.67); shared invariant tokens: null,n:1000000000,p:mons,p:dead,p:hypot,p:x,p:pl,p:y; literals: "zap","bolt" |
| `h4` | `W4` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.980 (runner-up 0.29); shared invariant tokens: s:box,s:rift,s:boss,s:sust,s:enc,s:pin,p:filter,p:hist; literals: "box","rift" |
| `H4` | `E5` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.67); shared invariant tokens: p:lineJoin,s:round,p:globalAlpha,n:0.3,p:strokeStyle,p:halo,p:lineWidth,n:2.4; literals: "round","#ffffff" |
| `h6` | `ES` | function | alpha-exact function body match (723 char canon; locals renumbered only); literals: none |
| `H6` | `r6` | function | alpha-exact function body match (2175 char canon; locals renumbered only); literals: none |
| `h8` | `z6` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.990 (runner-up 0.50); shared invariant tokens: p:c,p:pl,p:filter,p:swords,p:st,s:fly,s:stuck,s:ground; literals: "fly","stuck" |
| `H8` | `fM` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.990 (runner-up 0.26); shared invariant tokens: null,p:getItem,n:0,s:#mcoach,p:L,s:#mctl,s:div,s:mcoach; literals: "#mcoach","#mctl" |
| `ha` | `ga` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.979 (runner-up 0.33); shared invariant tokens: p:rarity,n:3,p:kind,s:soul,p:n,p:beast,s:之魂,p:base; literals: "soul","之魂" |
| `Ha` | `Ua` | function | ref-vote-r0: 5/5 aligned free references across matched functions point to Ua; corroborated: 5/5 aligned references agree |
| `hc` | `wc` | function | alpha-exact function body match (232 char canon; locals renumbered only); literals: none |
| `Hc` | `Vc` | object | alpha-exact object body match (16050 char canon; locals renumbered only); literals: "余烬","piano","bell" |
| `hd` | `kd` | function | alpha-exact function body match (548 char canon; locals renumbered only); literals: none |
| `Hd` | `Qd` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.984 (runner-up 0.52); shared invariant tokens: n:1,p:x,p:y,n:0.5,p:save,p:fillStyle,s:rgba(10,2,20,0.35),p:beginPath; literals: "rgba(10,2,20,0.35)","lighter" |
| `he` | `me` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.59); shared invariant tokens: p:S,p:equip,p:tree,p:level,p:cls,p:ascNodes,p:buffs,p:SKC; literals: "meta" |
| `hf` | `_f` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.41); shared invariant tokens: p:held,null,s:#tip,p:hidden,p:tab,p:mv,p:back,p:menu; literals: "#tip","#overlay .ovbox.gmenu" |
| `Hf` | `n0` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.31); shared invariant tokens: p:w,p:col,k:small,s:普通天赋,k:notable,s:核心天赋,k:key,s:基石天赋; literals: "普通天赋","核心天赋" |
| `hg` | `Z1` | function | alpha-exact function body match (384 char canon; locals renumbered only); literals: "没有锁定" |
| `Hg` | `Cb` | function | clone fingerprint: OLD-token coverage 0.92 / dice 0.953 (runner-up 0.28); shared invariant tokens: p:moveIn,n:0,null,p:hash,p:startsWith,s:#move=,p:replaceState,p:pathname; literals: "#move=","\n\t\t" |
| `hi` | `bi` | function | alpha-exact function body match (444 char canon; locals renumbered only); literals: "c" |
| `Hi` | `Qi` | function | alpha-exact function body match (1485 char canon; locals renumbered only); literals: none |
| `Hk` | `ex` | object | alpha-exact object body match (1722 char canon; locals renumbered only); literals: "火焰伤害提高 {v}%","冰霜伤害提高 {v}%","闪电伤害提高 {v}%" |
| `hl` | `bl` | object | alpha-exact object body match (716 char canon; locals renumbered only); literals: "法术","投射物","火焰" |
| `Hl` | `Bl` | array | alpha-exact array body match (50 char canon; locals renumbered only); literals: "普通","魔法","稀有" |
| `hM` | `QM` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.994 (runner-up 0.39); shared invariant tokens: p:tab,s:gem,p:join,p:map,p:filter,p:pool,p:cls,s:gem:; literals: "gem","gem:" |
| `Hm` | `jg` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.989 (runner-up 0.35); shared invariant tokens: p:fg,p:dataset,p:value,p:free,p:checked,n:0,s:free,p:anySlot; literals: "free","anySlot" |
| `HM` | `N8` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.985 (runner-up 0.47); shared invariant tokens: p:tree,p:cls,p:bonusPts,n:0,p:find,p:nodes,p:ks,p:sort; literals: "key","start" |
| `hn` | `Yo` | function | alpha-exact function body match (268 char canon; locals renumbered only); literals: " checked","\""," " |
| `Hn` | `Qn` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.37); shared invariant tokens: k:b,s:#666,k:h,p:h,p:kind,s:item,s:inv,p:replace; literals: "#666","item" |
| `ho` | `go` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.76); shared invariant tokens: p:mons,p:dead,p:r,p:x,n:2,p:y,k:weight,s:mid; literals: "mid" |
| `Ho` | `_o` | function | alpha-exact function body match (1865 char canon; locals renumbered only); literals: "channel","swordfly","ele" |
| `hp` | `Rd` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.968 (runner-up 0.58); shared invariant tokens: n:1,p:kind,p:it,s:item,s:map,s:soul,s:地图袋已满,s:背包已满; literals: "item","map" |
| `Hp` | `Vp` | function | alpha-exact function body match (496 char canon; locals renumbered only); literals: none |
| `hr` | `mr` | object | alpha-exact object body match (19224 char canon; locals renumbered only); literals: "bandpass","triangle","highpass" |
| `Hr` | `_r` | function | alpha-exact function body match (197 char canon; locals renumbered only); literals: "buff" |
| `hs` | `ls` | function | alpha-exact function body match (196 char canon; locals renumbered only); literals: "sup" |
| `hS` | `f8` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.65); shared invariant tokens: p:createElement,s:canvas,null,p:width,p:height,p:getContext,k:b,k:e; literals: "u","canvas" |
| `Hs` | `js` | function | ref-vote-r0: 13/13 aligned free references across matched functions point to js; corroborated: 13/13 aligned references agree |
| `HS` | `$M` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.998 (runner-up 0.40); shared invariant tokens: p:selSoul,null,p:gid,p:sel,p:uid,p:join,p:map,p:skills; literals: " on"," bad" |
| `ht` | `ht` | function | alpha-exact function body match (1072 char canon; locals renumbered only); literals: none |
| `hT` | `JT` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.967 (runner-up 0.86); shared invariant tokens: p:hypot,n:1,p:filter,p:x,p:y,p:r,p:abs; literals: none |
| `Ht` | `Kt` | object | ref-vote-r0: 10/10 aligned free references across matched functions point to Kt; corroborated: 12/12 aligned references agree |
| `hu` | `ku` | function | alpha-exact function body match (395 char canon; locals renumbered only); literals: none |
| `Hu` | `Yu` | object | alpha-exact object body match (122 char canon; locals renumbered only); literals: "物理","火焰","冰霜" |
| `hv` | `Mv` | function | alpha-exact function body match (991 char canon; locals renumbered only); literals: none |
| `Hv` | `ek` | number | ref-vote-r0: 3/3 aligned free references across matched functions point to ek; corroborated: 3/3 aligned references agree |
| `hw` | `I5` | object | alpha-exact object body match (143 char canon; locals renumbered only); literals: "addPhys","addFire","addCold" |
| `Hw` | `y4` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.986 (runner-up 0.39); shared invariant tokens: p:level,p:lvl,p:Z,n:4,p:max,n:0.1,n:1,n:0.12; literals: " 升至 "," 级" |
| `Hx` | `Fx` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.980 (runner-up 0.49); shared invariant tokens: p:t,p:x,p:y,p:z,n:14,s:255,150,60,n:0.34,p:sin; literals: "255,150,60","rgba(255,120,40,0.55)" |
| `Hy` | `uf` | function | clone fingerprint: OLD-token coverage 0.93 / dice 0.925 (runner-up 0.36); shared invariant tokens: p:menu,n:0,p:onclick,s:#ffDone,n:1,p:preset,p:filter,s:custom; literals: "#ffDone","custom" |
| `i$` | `$$` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.979 (runner-up 0.81); shared invariant tokens: p:cos,p:titles,p:pets,p:title,p:length,n:0,p:pet,n:1; literals: none |
| `I$` | `X$` | function | alpha-exact function body match (214 char canon; locals renumbered only); literals: none |
| `i0` | `A0` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.980 (runner-up 0.49); shared invariant tokens: p:c,p:bh,p:d,p:cos,p:ang,p:sin,n:1,n:42; literals: "meteor","comet" |
| `i1` | `_g` | number | ref-vote-r0: 3/3 aligned free references across matched functions point to _g; corroborated: 3/3 aligned references agree |
| `I1` | `d1` | function | ref-vote-r0: 3/3 aligned free references across matched functions point to d1; corroborated: 3/3 aligned references agree |
| `i3` | `x3` | function | alpha-exact function body match (238 char canon; locals renumbered only); literals: none |
| `i4` | `z4` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.994 (runner-up 0.28); shared invariant tokens: p:pl,p:S,p:cls,s:samurai,p:push,p:sheReady,s:纳刀 ✓,s:纳刀 ; literals: "samurai","纳刀 ✓" |
| `I4` | `i3` | function | clone fingerprint: OLD-token coverage 0.96 / dice 0.960 (runner-up 0.48); shared invariant tokens: p:pl,p:dead,p:objs,p:kind,s:box,p:open,p:x,n:2; literals: "box","cur" |
| `i5` | `t5` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.974 (runner-up 0.51); shared invariant tokens: p:T,p:length,p:tips,n:2,n:0,p:map,p:slice,p:x; literals: "#ffffff" |
| `I5` | `lw` | object | alpha-exact object body match (187 char canon; locals renumbered only); literals: "地图","背包","宝石" |
| `i6` | `wS` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.38); shared invariant tokens: p:fs,null,p:fsalt,p:uid,p:base,p:ilvl; literals: "\|" |
| `I6` | `VS` | object | alpha-exact object body match (142 char canon; locals renumbered only); literals: "通货","插槽","符文" |
| `i8` | `A6` | object | alpha-exact object body match (566 char canon; locals renumbered only); literals: none |
| `ia` | `la` | function | clone fingerprint: OLD-token coverage 0.96 / dice 0.963 (runner-up 0.72); shared invariant tokens: k:uid,k:kind,s:item,k:base,p:n,k:slot,p:slot,k:ilvl; literals: "item" |
| `ib` | `ty` | function | clone fingerprint: OLD-token coverage 0.96 / dice 0.958 (runner-up 0.33); shared invariant tokens: p:atlasPts,p:length,p:atlas,p:keys,p:done,p:join,p:map,p:filter; literals: "<div class=\"alink"," on" |
| `Ib` | `Ay` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.985 (runner-up 0.56); shared invariant tokens: p:split,n:1,p:pierce,n:0,p:ang,n:4,n:0.9,n:1.5; literals: "tsec","#e8e8e8" |
| `ic` | `mc` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.981 (runner-up 0.53); shared invariant tokens: p:slot,p:ring1,p:equip,p:ring2,s:ring2,s:ring1,s:offhand,p:find; literals: "R","ring2" |
| `id` | `ud` | expression | ref-vote-r0: 3/3 aligned free references across matched functions point to ud; corroborated: 3/3 aligned references agree |
| `Id` | `Dd` | number | ref-vote-r0: 3/3 aligned free references across matched functions point to Dd; corroborated: 4/4 aligned references agree |
| `Ie` | `ze` | object | alpha-exact object body match (988 char canon; locals renumbered only); literals: "暴击时施放","#ffd27a","crit" |
| `If` | `Xf` | function | clone fingerprint: OLD-token coverage 0.92 / dice 0.920 (runner-up 0.23); shared invariant tokens: p:join,p:map,p:cur,n:0,s: on,p:col,t:<span class="sig,t:" style="--uc:; literals: " on","<span class=\"sig" |
| `ig` | `D1` | function | alpha-exact function body match (9074 char canon; locals renumbered only); literals: "rgba(0,0,0,0.4)","#2a2228","#4a3c42" |
| `Ig` | `mb` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.993 (runner-up 0.43); shared invariant tokens: p:addEventListener,s:pointerdown,n:0,s:pointermove,s:pointerup,s:pointercancel,p:t,null; literals: "pointerdown","pointermove" |
| `ii` | `ci` | function | alpha-exact function body match (1728 char canon; locals renumbered only); literals: "en","string" |
| `Ii` | `Si` | function | alpha-exact function body match (560 char canon; locals renumbered only); literals: none |
| `ik` | `bk` | function | alpha-exact function body match (4208 char canon; locals renumbered only); literals: "perf","#ff7070","#ffd060" |
| `Ik` | `Nk` | object | alpha-exact object body match (1738 char canon; locals renumbered only); literals: "x...............","..x...x...x...x.","x.......x......." |
| `il` | `dl` | array | alpha-exact array body match (266 char canon; locals renumbered only); literals: none |
| `Il` | `$l` | number | ref-vote-r0: 6/6 aligned free references across matched functions point to $l; corroborated: 6/6 aligned references agree |
| `iM` | `NM` | function | alpha-exact function body match (497 char canon; locals renumbered only); literals: "gem","meta","buff" |
| `IM` | `mT` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.932 (runner-up 0.42); shared invariant tokens: p:touchMode,p:lastPtr,s:mouse,p:key,p:closest,p:target,s:#tip,s:[data-mt]; literals: "mouse","#tip" |
| `In` | `Pn` | function | alpha-exact function body match (932 char canon; locals renumbered only); literals: "gas" |
| `io` | `uo` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.29); shared invariant tokens: s:对伙伴无效,p:beast,p:melee,p:reach,n:30,s:只对近战伙伴生效,p:phys,p:el; literals: "对伙伴无效","只对近战伙伴生效" |
| `Io` | `zo` | number | ref-vote-r0: 10/10 aligned free references across matched functions point to zo; corroborated: 11/11 aligned references agree |
| `ip` | `Mp` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.991 (runner-up 0.50); shared invariant tokens: p:equip,s:weapon,p:offhand,p:wt,p:base,p:includes,p:slot,null; literals: "weapon","+" |
| `Ip` | `Up` | function | clone fingerprint: OLD-token coverage 0.96 / dice 0.961 (runner-up 0.66); shared invariant tokens: null,p:cur,n:1,p:G,p:cid,p:UID,p:max,s:char:bind; literals: "char:bind" |
| `ir` | `lr` | function | alpha-exact function body match (105 char canon; locals renumbered only); literals: none |
| `Ir` | `Dr` | function | alpha-exact function body match (349 char canon; locals renumbered only); literals: "spell" |
| `is` | `is` | array | alpha-exact array body match (39 char canon; locals renumbered only); literals: none |
| `iS` | `s8` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.972 (runner-up 0.26); shared invariant tokens: n:1,p:forEach,p:fan,n:14,n:6,n:0,p:sin,n:2.3; literals: "p","s" |
| `Is` | `Ps` | function | ref-vote-r0: 9/9 aligned free references across matched functions point to Ps; corroborated: 9/9 aligned references agree |
| `it` | `it` | object | alpha-exact object body match (7081 char canon; locals renumbered only); literals: "腐尸","melee","phys" |
| `It` | `jt` | function | alpha-exact function body match (325 char canon; locals renumbered only); literals: "map","soul" |
| `IT` | `m$` | function | clone fingerprint: OLD-token coverage 0.96 / dice 0.957 (runner-up 0.82); shared invariant tokens: null,p:createElement,s:canvas,p:width,n:14,p:height,p:length,p:getContext; literals: "u","canvas" |
| `iu` | `hp` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.989 (runner-up 0.38); shared invariant tokens: p:S,p:cls,s:jianke,p:pl,p:face,p:max,n:0,p:min; literals: "jianke","#9a2838" |
| `Iu` | `Gu` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.986 (runner-up 0.57); shared invariant tokens: p:includes,p:sticks,p:filter,p:host,p:dead,p:x,p:y,p:r; literals: "ring","#ffb050" |
| `Iv` | `Nv` | function | clone fingerprint: OLD-token coverage 0.96 / dice 0.964 (runner-up 0.60); shared invariant tokens: p:mods,p:length,null,p:w,n:0,p:ranges,p:lv,p:ilvl; literals: none |
| `Iw` | `i4` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.987 (runner-up 0.45); shared invariant tokens: k:c,k:trig,n:1,k:slot,p:bh,p:d,p:push,p:fx; literals: "ring","#ffe8a0" |
| `ix` | `Mx` | function | alpha-exact function body match (1376 char canon; locals renumbered only); literals: none |
| `Ix` | `Ax` | object | alpha-exact object body match (249 char canon; locals renumbered only); literals: "#140c10","#3e2f36","#5e4a54" |
| `iy` | `Xy` | function | ref-vote-r0: 3/3 aligned free references across matched functions point to Xy; corroborated: 3/3 aligned references agree |
| `Iy` | `Zb` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.983 (runner-up 0.36); shared invariant tokens: p:T,p:type,p:Z,s:map,p:flowT,n:0,n:0.3,p:revT; literals: "map" |
| `j` | `j` | function | alpha-exact function body match (71 char canon; locals renumbered only); literals: none |
| `J` | `J` | object | alpha-exact object body match (146 char canon; locals renumbered only); literals: none |
| `j0` | `F0` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.983 (runner-up 0.67); shared invariant tokens: p:wt,p:now,p:setItem,p:stringify,k:v,n:1,k:cur,p:cur; literals: none |
| `J0` | `sd` | function | alpha-exact function body match (3932 char canon; locals renumbered only); literals: "$1 ·","· $1"," · " |
| `j1` | `f1` | function | alpha-exact function body match (599 char canon; locals renumbered only); literals: "u","canvas" |
| `j2` | `W2` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.987 (runner-up 0.60); shared invariant tokens: p:k,s:pop,p:spr,n:0,n:1,n:0.45,p:globalAlpha,n:0.9; literals: "pop","lighter" |
| `J2` | `iv` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.989 (runner-up 0.47); shared invariant tokens: p:kind,s:texit,k:env,n:1,k:x,p:x,k:y,p:y; literals: "texit","#ffc060" |
| `j3` | `_3` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.993 (runner-up 0.50); shared invariant tokens: p:kind,s:fireball,s:#ff8a30,s:larrow,s:#a8b4ff,s:iceshot,s:icespear,s:#9fe8ff; literals: "fireball","#ff8a30" |
| `j4` | `r3` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.985 (runner-up 0.39); shared invariant tokens: p:snd,p:hid,p:cur,s:divine,p:slowT,n:0,p:desat,n:0.4; literals: "divine","神圣石" |
| `J4` | `Jw` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.978 (runner-up 0.75); shared invariant tokens: p:length,p:labelRects,n:1,n:0,p:sx,p:x,p:w,p:sy; literals: none |
| `j5` | `iw` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.26); shared invariant tokens: p:seen,p:keys,p:some,p:forEach,p:querySelectorAll,t:#tabs [data-tab=",t:"], #menu .mbtn[data-tab=",t:"]; literals: "#tabs [data-tab=\"","\"], #menu .mbtn[data-tab=\"" |
| `j6` | `KS` | function | alpha-exact function body match (102 char canon; locals renumbered only); literals: none |
| `J8` | `_6` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.886 (runner-up 0.62); shared invariant tokens: p:pl,null,p:loots,p:landed,p:petNo,p:hid,p:x,n:2; literals: none |
| `ja` | `Pa` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.57); shared invariant tokens: p:touchMode,p:font,s:600 5.5px ,p:textAlign,s:center,p:width,p:measureText,n:9; literals: "600 5.5px ","center" |
| `jb` | `$y` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.985 (runner-up 0.62); shared invariant tokens: p:y,p:x,p:vx,p:vy,p:ang,p:atan2,p:ric,p:ricSup; literals: "spark","#ffffff" |
| `Jb` | `Uy` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.979 (runner-up 0.78); shared invariant tokens: p:push,p:fx,k:k,s:tele,k:x,k:y,k:r,k:t; literals: "tele" |
| `Jc` | `af` | number | ref-vote-r0: 3/3 aligned free references across matched functions point to af; corroborated: 3/3 aligned references agree |
| `jd` | `Fd` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.57); shared invariant tokens: p:e,p:save,p:globalCompositeOperation,s:lighter,p:id,s:dragon,s:eye,p:restore; literals: "lighter","dragon" |
| `Jd` | `sp` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.991 (runner-up 0.66); shared invariant tokens: p:map,p:mods,k:id,p:id,k:t,p:t,k:txt,p:v; literals: none |
| `je` | `Pe` | function | alpha-exact function body match (702 char canon; locals renumbered only); literals: "M","k" |
| `jf` | `Yf` | function | alpha-exact function body match (1970 char canon; locals renumbered only); literals: " 生命"," · 投射物 <b>","</b>" |
| `Jf` | `l0` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.997 (runner-up 0.57); shared invariant tokens: p:createElement,s:canvas,p:width,n:28,p:height,p:getContext,s:2d,p:imageSmoothingEnabled; literals: "canvas","2d" |
| `Jg` | `jb` | expression | ref-vote-r0: 3/3 aligned free references across matched functions point to jb; corroborated: 3/3 aligned references agree |
| `ji` | `wi` | function | alpha-exact function body match (228 char canon; locals renumbered only); literals: none |
| `Ji` | `al` | function | ref-vote-r0: 3/3 aligned free references across matched functions point to al; corroborated: 3/3 aligned references agree |
| `jk` | `Wk` | function | alpha-exact function body match (1059 char canon; locals renumbered only); literals: "bad chord ","#","b" |
| `jl` | `Xl` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.986 (runner-up 0.44); shared invariant tokens: p:flask,p:ch,n:1,p:pl,p:dead,p:eff,s:flask:pre,k:i; literals: "flask:pre","#ff5a6a" |
| `Jl` | `sc` | function | ref-vote-r0: 6/6 aligned free references across matched functions point to sc; corroborated: 6/6 aligned references agree |
| `jm` | `X1` | object | alpha-exact object body match (1634 char canon; locals renumbered only); literals: "#2c2648","torch","#fff6d0" |
| `jM` | `hT` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.87); shared invariant tokens: p:fired,p:hypot,p:clientX,p:x,p:clientY,p:y,n:10,p:t; literals: none |
| `JM` | `PT` | object | alpha-exact object body match (156 char canon; locals renumbered only); literals: "bolt","frag","galv" |
| `jn` | `In` | function | ref-vote-r0: 8/8 aligned free references across matched functions point to In; corroborated: 9/9 aligned references agree |
| `Jn` | `tr` | function | ref-vote-r0: 4/4 aligned free references across matched functions point to tr; corroborated: 4/4 aligned references agree |
| `jo` | `Po` | number | ref-vote-r0: 10/10 aligned free references across matched functions point to Po; corroborated: 11/11 aligned references agree |
| `Jo` | `an` | function | ref-vote-r0: 3/3 aligned free references across matched functions point to an; corroborated: 3/3 aligned references agree |
| `jp` | `Hp` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.59); shared invariant tokens: p:v,s:number,null,p:length,p:skills,n:7,p:push,p:isArray; literals: "number","soul" |
| `Jp` | `yu` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.989 (runner-up 0.58); shared invariant tokens: p:spr,p:round,p:y,p:h,n:6,p:jz,n:0,p:sin; literals: "boss","#ffd27a" |
| `jr` | `zr` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.992 (runner-up 0.23); shared invariant tokens: k:b,s:#b4a070,k:h,p:n,p:cur,n:0,p:d,p:v; literals: "#b4a070","<div class=\"th\" style=\"color:#e8d8a8\">" |
| `Jr` | `ei` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.972 (runner-up 0.56); shared invariant tokens: s:power,p:pch,p:pl,p:x,p:y,n:26,n:0,n:1; literals: "power","gold" |
| `js` | `Ds` | function | ref-vote-r0: 8/8 aligned free references across matched functions point to Ds; corroborated: 8/8 aligned references agree |
| `jS` | `C8` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.983 (runner-up 0.61); shared invariant tokens: s:kill,k:m,p:Z,p:tier,n:0,p:ub,n:0.2,p:rar; literals: "kill","map" |
| `Js` | `Ys` | object | alpha-exact object body match (813 char canon; locals renumbered only); literals: "#8a8090","#a89c8c","#5a5060" |
| `JS` | `IM` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.988 (runner-up 0.69); shared invariant tokens: p:sel,p:uid,p:it,p:cur,k:uid,n:1,p:flash,null; literals: "pick" |
| `jt` | `Mt` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.18); shared invariant tokens: p:on,p:vib,p:vibrate,p:now,s:boss,s:level,p:lastVib,n:90; literals: "boss","level" |
| `jT` | `h$` | object | alpha-exact object body match (136 char canon; locals renumbered only); literals: "kgkEkwwwwkEkgk","kgkkkwwwwkkkgk","kgwkkwwwwkkwgk" |
| `Jt` | `Yt` | object | ref-vote-r0: 15/15 aligned free references across matched functions point to Yt; corroborated: 16/16 aligned references agree |
| `ju` | `qu` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.980 (runner-up 0.49); shared invariant tokens: p:push,p:sticks,k:x,p:x,k:y,p:y,k:host,k:t; literals: none |
| `Ju` | `nh` | function | alpha-exact function body match (1378 char canon; locals renumbered only); literals: "INPUT","button","submit" |
| `jv` | `Wv` | function | alpha-exact function body match (944 char canon; locals renumbered only); literals: "map","soul","P" |
| `jw` | `r4` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.989 (runner-up 0.40); shared invariant tokens: p:dead,null,n:48400,p:mons,p:dummy,p:type,p:Z,s:hideout; literals: "hideout","ring" |
| `Jw` | `T4` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.988 (runner-up 0.63); shared invariant tokens: p:x,p:pl,p:face,n:14,p:y,n:4,p:tgt,null; literals: "#ffffff" |
| `jx` | `aw` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.48); shared invariant tokens: p:pl,null,n:1000000000,p:objs,p:kind,s:box,p:open,n:36; literals: "box","#ffd060" |
| `Jy` | `hg` | function | alpha-exact function body match (2093 char canon; locals renumbered only); literals: "crossbow","#6a4a2a","#9aa0a8" |
| `K` | `V` | function | alpha-exact function body match (252 char canon; locals renumbered only); literals: none |
| `k$` | `q$` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.992 (runner-up 0.30); shared invariant tokens: p:Z,p:tower,p:phase,s:guard,s:done,p:mod,p:sig,p:push; literals: "guard","done" |
| `K$` | `hA` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.999 (runner-up 0.44); shared invariant tokens: s:stats:pre,k:cls,k:add,s:sorceress,s:spellInc,n:10,s:stats:post,k:S; literals: "stats:pre","sorceress" |
| `K0` | `ed` | expression | ref-vote-r0: 4/4 aligned free references across matched functions point to ed; corroborated: 4/4 aligned references agree |
| `k1` | `Ym` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.976 (runner-up 0.43); shared invariant tokens: p:fr,p:save,p:globalAlpha,p:min,n:1,p:k,n:1.4,p:drawImage; literals: none |
| `K2` | `ov` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.992 (runner-up 0.23); shared invariant tokens: p:tower,p:length,p:floors,p:n,n:1,p:n0,p:theme,s:void; literals: "void","map" |
| `k3` | `z3` | function | alpha-exact function body match (863 char canon; locals renumbered only); literals: none |
| `K3` | `cS` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.994 (runner-up 0.58); shared invariant tokens: p:c,p:kind,s:fireball,p:x,p:y,s:iceshot,p:r,n:13; literals: "fireball","iceshot" |
| `k8` | `G6` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.988 (runner-up 0.38); shared invariant tokens: p:length,p:devils,n:1,n:0,p:t,p:life,p:splice,p:a; literals: "light","none" |
| `K8` | `mM` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.992 (runner-up 0.49); shared invariant tokens: p:pl,p:state,s:play,p:dead,p:T,p:lock,p:dummy,p:hypot; literals: "play","#ffd060" |
| `ka` | `xa` | function | ref-vote-r0: 13/13 aligned free references across matched functions point to xa; corroborated: 13/13 aligned references agree |
| `kb` | `hy` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.983 (runner-up 0.53); shared invariant tokens: p:kind,s:balllight,p:zt,n:0,n:0.22,p:r,p:c,n:30; literals: "balllight","light" |
| `kc` | `Tc` | function | ref-vote-r0: 3/3 aligned free references across matched functions point to Tc; corroborated: 4/4 aligned references agree |
| `Kc` | `Xc` | function | alpha-exact function body match (758 char canon; locals renumbered only); literals: none |
| `kd` | `$d` | function | alpha-exact function body match (710 char canon; locals renumbered only); literals: "none" |
| `Kd` | `ep` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.993 (runner-up 0.26); shared invariant tokens: p:cr,p:join,p:map,p:slice,n:0,n:6,s: · ,p:length; literals: " · "," …" |
| `ke` | `ke` | object | alpha-exact object body match (311 char canon; locals renumbered only); literals: none |
| `kf` | `Af` | number | ref-vote-r0: 5/5 aligned free references across matched functions point to Af; corroborated: 5/5 aligned references agree |
| `Kf` | `Ff` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.984 (runner-up 0.53); shared invariant tokens: p:level,p:xp,n:0,p:equip,p:rarity,n:3,p:assign,p:pl; literals: "满配测试: "," · 60 级 · " |
| `kg` | `sb` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.916 (runner-up 0.35); shared invariant tokens: p:mv,p:panel,p:keep,p:restore,p:back,p:includes,p:tab,n:1; literals: "#panel","click" |
| `Kg` | `Sg` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.980 (runner-up 0.66); shared invariant tokens: p:sort,p:filter,p:slot,p:lv,p:wt,n:0; literals: none |
| `kh` | `Ch` | function | alpha-exact function body match (668 char canon; locals renumbered only); literals: "ember-rift-music" |
| `Kh` | `am` | object | alpha-exact object body match (2250 char canon; locals renumbered only); literals: "n2","small","战意" |
| `ki` | `$i` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.26); shared invariant tokens: p:pal,s: p-,p:glow,s: glow,p:n,t:<div class="wdttl,t:"><span>,t:</span></div>; literals: " p-"," glow" |
| `Ki` | `el` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.981 (runner-up 0.40); shared invariant tokens: p:type,p:Z,s:map,n:1,p:quant,p:ms,p:S,s:sust3; literals: "map","sust3" |
| `kk` | `Ek` | function | alpha-exact function body match (657 char canon; locals renumbered only); literals: "u","--uib","--uiz" |
| `Kk` | `ox` | function | alpha-exact function body match (9972 char canon; locals renumbered only); literals: none |
| `kl` | `Ml` | function | ref-vote-r0: 4/4 aligned free references across matched functions point to Ml; corroborated: 4/4 aligned references agree |
| `Kl` | `ec` | function | alpha-exact function body match (907 char canon; locals renumbered only); literals: " · ","<div class=\"hint\">","</div>" |
| `km` | `Pm` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.76); shared invariant tokens: p:kind,s:flicker,s:swordfly,s:swordcall,s:yinlei; literals: "flicker","swordfly" |
| `kM` | `aT` | function | alpha-exact function body match (1973 char canon; locals renumbered only); literals: "meta[name=viewport]","meta","viewport" |
| `Km` | `Og` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.977 (runner-up 0.27); shared invariant tokens: p:k,p:dataset,s:set,p:f,s:theme,p:v,n:0,s:preset; literals: "set","theme" |
| `KM` | `ST` | function | clone fingerprint: OLD-token coverage 0.95 / dice 0.947 (runner-up 0.22); shared invariant tokens: p:length,p:filter,p:bad,p:dup,s: off,p:col,p:cls,s:#ccc; literals: " off","#ccc" |
| `Kn` | `Xn` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.991 (runner-up 0.21); shared invariant tokens: p:isArray,p:beasts,p:indexOf,n:1,p:beast,p:S,k:asc,k:sp; literals: "rage","ruthless" |
| `Ko` | `Jo` | function | alpha-exact function body match (798 char canon; locals renumbered only); literals: "null" |
| `kp` | `jp` | function | clone fingerprint: OLD-token coverage 0.95 / dice 0.954 (runner-up 0.75); shared invariant tokens: p:tabs,n:1,p:kind,s:item,s:map,s:soul,s:地图袋已满,s:背包已满; literals: "item","map" |
| `Kp` | `gu` | function | clone fingerprint: OLD-token coverage 0.94 / dice 0.944 (runner-up 0.44); shared invariant tokens: p:beast,p:ang,p:atan2,p:y,p:x,p:face,p:cos,n:0; literals: none |
| `kr` | `Or` | function | ref-vote-r0: 4/4 aligned free references across matched functions point to Or; corroborated: 4/4 aligned references agree |
| `Kr` | `Jr` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.984 (runner-up 0.58); shared invariant tokens: p:x,p:y,p:shatterMul,p:S,p:shatterShards,p:push,p:pend,k:t; literals: "ring","#e8fbff" |
| `ks` | `xs` | array | alpha-exact array body match (442 char canon; locals renumbered only); literals: "weapon","W","offhand" |
| `kS` | `g8` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.22); shared invariant tokens: null,p:free,s:mount,s:人人都有,s:默认,p:r,s: · No.,s: / 11; literals: "mount","人人都有" |
| `Ks` | `Ks` | object | alpha-exact object body match (75 char canon; locals renumbered only); literals: "zh" |
| `KS` | `EM` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.59); shared invariant tokens: s:地图,p:it,p:loc,s:dev,s:装置里的地图,s:地图袋,p:cur,k:title; literals: "地图","dev" |
| `kT` | `s$` | function | clone fingerprint: OLD-token coverage 0.96 / dice 0.960 (runner-up 0.40); shared invariant tokens: p:cpools,p:length,n:1,n:0,p:t,p:tick,n:0.5,p:s; literals: "light" |
| `Kt` | `Vt` | object | alpha-exact object body match (53 char canon; locals renumbered only); literals: none |
| `KT` | `B8` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.990 (runner-up 0.51); shared invariant tokens: p:ghosts,p:t,n:0,p:min,n:1,p:max,p:bolt,p:thin; literals: "jkpillar","jkx" |
| `Ku` | `ah` | function | alpha-exact function body match (872 char canon; locals renumbered only); literals: "1","perf" |
| `kv` | `Ev` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.969 (runner-up 0.44); shared invariant tokens: p:chargeT,p:aim,p:ang,p:atan2,p:y,p:pl,n:4,p:x; literals: "sheathe" |
| `Kv` | `ok` | function | alpha-exact function body match (285 char canon; locals renumbered only); literals: "light" |
| `kw` | `Zw` | function | alpha-exact function body match (1293 char canon; locals renumbered only); literals: "text/plain;charset=utf-8","a","none" |
| `Kw` | `w4` | object | alpha-exact object body match (111 char canon; locals renumbered only); literals: none |
| `Kx` | `Wx` | function | alpha-exact function body match (2462 char canon; locals renumbered only); literals: none |
| `ky` | `c2` | function | alpha-exact function body match (1086 char canon; locals renumbered only); literals: "W","附加 "," - " |
| `Ky` | `dg` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.988 (runner-up 0.50); shared invariant tokens: p:kind,s:bolt,n:9,s:#8a7050,n:1.1,n:3,s:#f0e8d8,n:1.6; literals: "bolt","#8a7050" |
| `L` | `L` | function | alpha-exact function body match (3011 char canon; locals renumbered only); literals: none |
| `L$` | `J$` | object | alpha-exact object body match (146 char canon; locals renumbered only); literals: "#120806","#4a0c10","#cfeaff" |
| `l0` | `C0` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.988 (runner-up 0.64); shared invariant tokens: p:r,p:x,p:pl,p:y,p:push,p:fx,k:k,s:ring; literals: "ring","#bfefff" |
| `L0` | `B0` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.991 (runner-up 0.75); shared invariant tokens: p:cos,n:0,p:titles,p:title,p:pets,p:rd,p:redeemed; literals: none |
| `l1` | `Kg` | function | clone fingerprint: OLD-token coverage 0.99 / dice 1.028 (runner-up 0.36); shared invariant tokens: s:#stage,s:#mctl,s:div,s:mctl,p:innerHTML,p:roll,p:hand,p:x; literals: "#stage","#mctl" |
| `L1` | `c1` | array | alpha-exact array body match (324 char canon; locals renumbered only); literals: none |
| `l2` | `Fb` | object | alpha-exact object body match (149 char canon; locals renumbered only); literals: "keEk","kkkk","keek" |
| `L2` | `G2` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.980 (runner-up 0.54); shared invariant tokens: p:tr,p:push,p:x,p:y,p:length,n:14,p:splice,n:0; literals: "lighter","source-over" |
| `l3` | `w3` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.992 (runner-up 0.39); shared invariant tokens: p:forEach,s:解锁,s:已经穿上 · Esc 菜单的「外观」里随时可以换,s:unique,p:pl,p:x,p:y,n:10; literals: "解锁","「" |
| `L3` | `Z3` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.987 (runner-up 0.58); shared invariant tokens: p:device,p:torch,p:theme,s:#8a7a9a,p:fillStyle,s:#2a2430,p:beginPath,p:ellipse; literals: "#8a7a9a","#2a2430" |
| `l4` | `O4` | function | clone fingerprint: OLD-token coverage 0.90 / dice 0.903 (runner-up 0.36); shared invariant tokens: s:#f0f0f0,s:#8a8cff,s:#ecd85a,p:rarity,p:tier,p:name,p:quant,p:rar; literals: "#f0f0f0","#8a8cff" |
| `L4` | `n3` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.997 (runner-up 0.22); shared invariant tokens: p:kind,s:cur,p:cur,p:txt,p:n,p:fg,s:#c8b890,p:bg; literals: "cur","#c8b890" |
| `l5` | `a5` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.971 (runner-up 0.62); shared invariant tokens: p:random,n:6.283,n:0,n:7,n:0.5,n:1,n:9,n:2; literals: none |
| `L5` | `rw` | function | alpha-exact function body match (1134 char canon; locals renumbered only); literals: "<i class=\"lk\"></i>"," mech"," bad" |
| `l6` | `SS` | function | alpha-exact function body match (544 char canon; locals renumbered only); literals: none |
| `L6` | `_S` | function | alpha-exact function body match (3322 char canon; locals renumbered only); literals: "u","en","zh-CN" |
| `l8` | `R6` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.990 (runner-up 0.71); shared invariant tokens: p:atan2,p:y,p:x,p:r,n:8,n:0,p:PI,n:2; literals: none |
| `L8` | `Q8` | object | alpha-exact object body match (136 char canon; locals renumbered only); literals: "bishop","forge","queen" |
| `la` | `ia` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.987 (runner-up 0.44); shared invariant tokens: p:favor,n:0.5,p:names,k:uid,k:kind,s:map,k:slot,k:tier; literals: "map","M" |
| `La` | `Ia` | string | ref-vote-r0: 17/17 aligned free references across matched functions point to Ia; corroborated: 17/17 aligned references agree |
| `lb` | `ay` | function | clone fingerprint: OLD-token coverage 0.94 / dice 0.943 (runner-up 0.29); shared invariant tokens: p:length,p:filter,p:codex,p:id,p:keys,p:done,p:join,p:map; literals: "<div class=\"ugroup\"><h3 style=\"color:","\">" |
| `Lb` | `Ty` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.988 (runner-up 0.71); shared invariant tokens: p:kind,s:twister,s:spark,p:wob,n:9,n:4,p:ang,p:sin; literals: "twister","spark" |
| `lc` | `gc` | function | ref-vote-r0: 3/3 aligned free references across matched functions point to gc; corroborated: 3/3 aligned references agree |
| `Lc` | `Oc` | function | alpha-exact function body match (323 char canon; locals renumbered only); literals: "jian" |
| `ld` | `hd` | function | alpha-exact function body match (760 char canon; locals renumbered only); literals: none |
| `Ld` | `Bd` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.989 (runner-up 0.55); shared invariant tokens: k:X,k:oy,k:hooves,k:k,p:T,p:min,n:1,n:1.4; literals: "lighter","#ff4a14" |
| `le` | `re` | object | clone fingerprint: OLD-token coverage 1.00 / dice 0.960 (runner-up 0.18); shared invariant tokens: k:shake,n:1,k:stop,n:0,k:bright,k:fx,k:slowmo,k:flash; literals: none |
| `Le` | `Ie` | expression | ref-vote-r0: 33/33 aligned free references across matched functions point to Ie; corroborated: 34/34 aligned references agree |
| `lf` | `Gf` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.35); shared invariant tokens: p:tier,p:theme,s:random,p:base,p:names,p:elite,p:dbg,k:dens; literals: "random","alch" |
| `Lf` | `Jf` | function | alpha-exact function body match (1072 char canon; locals renumbered only); literals: "[data-sc]","DETAILS" |
| `lh` | `gh` | function | alpha-exact function body match (3904 char canon; locals renumbered only); literals: "light","highpass","bandpass" |
| `li` | `fi` | function | alpha-exact function body match (611 char canon; locals renumbered only); literals: "number" |
| `Li` | `xi` | function | alpha-exact function body match (87 char canon; locals renumbered only); literals: none |
| `lk` | `yk` | object | clone fingerprint: OLD-token coverage 1.00 / dice 0.990 (runner-up 0.01); shared invariant tokens: k:% · 物品稀有度 +,s:% · Item Rarity +,k:(主动),s:(Active),k:(之后每次翻倍),s: (doubles each time after),k:(元技能),s:(Meta); literals: "% · 物品稀有度 +","% · Item Rarity +" |
| `Lk` | `Gk` | function | alpha-exact function body match (949 char canon; locals renumbered only); literals: "bad note ","#","b" |
| `ll` | `pl` | number | ref-vote-r0: 5/5 aligned free references across matched functions point to pl; corroborated: 5/5 aligned references agree |
| `lm` | `gm` | function | alpha-exact function body match (187 char canon; locals renumbered only); literals: none |
| `lM` | `HM` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.999 (runner-up 0.32); shared invariant tokens: p:tab,p:tabs,p:sel,p:join,p:map,s:on,p:length,t:<button class="; literals: "on","<button class=\"" |
| `Lm` | `Y1` | expression | ref-vote-r0: 3/3 aligned free references across matched functions point to Y1; corroborated: 3/3 aligned references agree |
| `ln` | `nn` | function | alpha-exact function body match (2878 char canon; locals renumbered only); literals: "circle","line" |
| `Ln` | `jn` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.991 (runner-up 0.55); shared invariant tokens: n:1,p:push,p:fx,k:k,s:jkpillar,k:x,k:y,k:t; literals: "jkpillar","flash" |
| `lo` | `ho` | function | ref-vote-r0: 5/5 aligned free references across matched functions point to ho; corroborated: 5/5 aligned references agree |
| `Lo` | `jo` | function | ref-vote-r0: 4/4 aligned free references across matched functions point to jo; corroborated: 4/4 aligned references agree |
| `lp` | `Tp` | object | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.25); shared invariant tokens: k:inv,p:filter,p:inv,p:kind,s:map,k:map,k:gem,p:gems; literals: "map" |
| `Lp` | `Np` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.991 (runner-up 0.33); shared invariant tokens: p:err,p:parse,p:stringify,p:G,p:data,k:err,s:存档版本不兼容,p:cid; literals: "存档版本不兼容","same" |
| `lr` | `cr` | function | ref-vote-r0: 9/9 aligned free references across matched functions point to cr; corroborated: 9/9 aligned references agree |
| `Lr` | `Fr` | function | alpha-exact function body match (213 char canon; locals renumbered only); literals: "</div></aside>" |
| `ls` | `ds` | function | alpha-exact function body match (685 char canon; locals renumbered only); literals: "#ffe6c8" |
| `lS` | `o8` | function | alpha-exact function body match (2821 char canon; locals renumbered only); literals: none |
| `Ls` | `Fs` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.998 (runner-up 0.71); shared invariant tokens: t:<span class="slotlbl">,t:</span>,t:<div class="cell e mc">,t:</div>,p:kind,s:soul,p:rarity,s: soul; literals: "<span class=\"slotlbl\">","</span>" |
| `LS` | `A8` | function | alpha-exact function body match (1144 char canon; locals renumbered only); literals: " · " |
| `lt` | `lt` | array | alpha-exact array body match (28167 char canon; locals renumbered only); literals: "greedcrown","贪婪者之冠","术士头冠" |
| `lT` | `UT` | object | alpha-exact object body match (298 char canon; locals renumbered only); literals: "#ff9a48","#ffd060","#bfefff" |
| `Lt` | `It` | object | alpha-exact object body match (235 char canon; locals renumbered only); literals: "high" |
| `LT` | `u$` | array | alpha-exact array body match (336 char canon; locals renumbered only); literals: "kk..........kk","kGk........kGk","kgwk......kwgk" |
| `lu` | `Zp` | number | ref-vote-r0: 4/4 aligned free references across matched functions point to Zp; corroborated: 4/4 aligned references agree |
| `Lu` | `Du` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.966 (runner-up 0.53); shared invariant tokens: p:l,n:0,p:r,n:1,p:q,n:2,p:e,n:3; literals: none |
| `lv` | `yv` | object | alpha-exact object body match (443 char canon; locals renumbered only); literals: "F 开启宝箱","开启宝箱","F / 点击 打开地图装置" |
| `Lw` | `w5` | function | alpha-exact function body match (94 char canon; locals renumbered only); literals: none |
| `Lx` | `ew` | function | alpha-exact function body match (436 char canon; locals renumbered only); literals: "#mcancel","hot" |
| `ly` | `e2` | object | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.52); shared invariant tokens: k:ape,k:combo,k:w,n:34,n:3,n:0.2,k:wind,n:0.22; literals: "mace","slash" |
| `Ly` | `k2` | function | alpha-exact function body match (4572 char canon; locals renumbered only); literals: none |
| `M` | `M` | function | alpha-exact function body match (962 char canon; locals renumbered only); literals: none |
| `m$` | `z$` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.970 (runner-up 0.48); shared invariant tokens: p:M,p:Z,p:n,p:tower,p:forEach,p:rooms,n:0,p:boss; literals: "enc" |
| `M$` | `H$` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.988 (runner-up 0.42); shared invariant tokens: p:join,p:map,p:filter,s:walk,p:walk,s:#6a6070,s:赶路,s:clear; literals: "walk","#6a6070" |
| `m0` | `u0` | function | clone fingerprint: OLD-token coverage 0.74 / dice 0.741 (runner-up 0.18); shared invariant tokens: p:menu,n:0,p:join,p:map,s:have,s:✓ 已拥有,s:未获得,t:<li class="; literals: "have","✓ 已拥有" |
| `M0` | `pf` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.996 (runner-up 0.51); shared invariant tokens: p:filter,p:v,n:2,p:hideN,p:normal,p:hideM,p:magic,p:hideR; literals: "custom","early" |
| `m1` | `_m` | number | ref-vote-r0: 3/3 aligned free references across matched functions point to _m; corroborated: 3/3 aligned references agree |
| `m2` | `Vb` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.998 (runner-up 0.31); shared invariant tokens: p:setTransform,n:1,n:0,p:globalCompositeOperation,s:source-over,p:globalAlpha,p:fillStyle,s:#000; literals: "source-over","#000" |
| `m3` | `E3` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.994 (runner-up 0.21); shared invariant tokens: p:floors,p:length,n:1,p:why,s:top,k:k,k:t,s:到达深渊之底; literals: "top","到达深渊之底" |
| `M3` | `D3` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.990 (runner-up 0.66); shared invariant tokens: p:walls,p:min,n:1,p:t,n:0.7,p:sin,p:T,n:14; literals: "round","#7a1a08" |
| `m4` | `N4` | function | alpha-exact function body match (1102 char canon; locals renumbered only); literals: none |
| `M4` | `Y4` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.981 (runner-up 0.18); shared invariant tokens: n:3.7,n:0.14,s:happy,s:shut,s:open,n:9,n:7.6,p:slice; literals: "happy","shut" |
| `M5` | `y5` | object | alpha-exact object body match (82 char canon; locals renumbered only); literals: "工艺锁定","余烬祭坛" |
| `m8` | `O6` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.995 (runner-up 0.43); shared invariant tokens: p:pl,p:orbA,n:3.6,p:filter,p:swords,p:st,s:orbit,n:0; literals: "orbit","fly" |
| `ma` | `ha` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.69); shared invariant tokens: p:isArray,p:beasts,null,p:length,p:push; literals: none |
| `Ma` | `Ta` | object | ref-vote-r0: 12/12 aligned free references across matched functions point to Ta; corroborated: 12/12 aligned references agree |
| `mb` | `cy` | function | alpha-exact function body match (360 char canon; locals renumbered only); literals: none |
| `Mb` | `yy` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.984 (runner-up 0.44); shared invariant tokens: p:pl,p:grenades,p:ammo,p:reloadT,p:recoilT,n:0,p:find,p:SKC; literals: "leap" |
| `mc` | `Gl` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.978 (runner-up 0.18); shared invariant tokens: p:ascSwaps,n:0,n:1,k:t,p:length,t:完成全部 ,t: 次升华试炼 (击败 T,t: 地图首领); literals: "完成全部 "," 次升华试炼 (击败 T" |
| `Mc` | `Rc` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.954 (runner-up 0.38); shared invariant tokens: n:1,p:tower,p:ended,n:0,p:key,null,p:Z,p:mod; literals: "done","tower:end" |
| `md` | `xd` | array | alpha-exact array body match (72 char canon; locals renumbered only); literals: "flicker","swordfly","swordcall" |
| `Md` | `gp` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.988 (runner-up 0.29); shared invariant tokens: n:1,p:floor,n:10,k:theme,s:void,k:guard,s:boss,k:tag; literals: "void","boss" |
| `me` | `ge` | function | alpha-exact function body match (184 char canon; locals renumbered only); literals: "<button class=\"mb ","\" data-m=\"","\" " |
| `Me` | `$e` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.39); shared invariant tokens: p:textContent,s:#bant,s:#bans,s:#banner,p:add,p:classList,s:on,p:remove; literals: "#bant","#bans" |
| `mf` | `Kf` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.982 (runner-up 0.49); shared invariant tokens: p:pl,p:dead,p:rollCd,n:0,p:state,s:play,p:stagT,p:roll; literals: "play","roll" |
| `Mf` | `Lf` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.38); shared invariant tokens: p:looks,p:rd,p:redeemed,s:nether,null,p:find,p:test,p:slice; literals: "nether" |
| `mg` | `Yg` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.70); shared invariant tokens: p:inv,p:gems,p:values,p:equip,p:device,p:skills,p:buffs,p:sup; literals: none |
| `Mg` | `ib` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.60); shared invariant tokens: p:sel,null,p:includes,s:stash,s:inv,s:gems,p:loc; literals: "stash","inv" |
| `mh` | `Sh` | function | alpha-exact function body match (236 char canon; locals renumbered only); literals: none |
| `Mh` | `jh` | array | alpha-exact array body match (380 char canon; locals renumbered only); literals: "arp","lead","A" |
| `mi` | `vi` | function | alpha-exact function body match (882 char canon; locals renumbered only); literals: none |
| `Mi` | `Ei` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.977 (runner-up 0.46); shared invariant tokens: p:state,s:play,p:Z,p:type,s:hideout,p:menu,n:0,p:mode; literals: "play","hideout" |
| `mk` | `Tk` | function | alpha-exact function body match (8018 char canon; locals renumbered only); literals: "string","\\s+","(.*?)" |
| `Mk` | `Pk` | function | alpha-exact function body match (884 char canon; locals renumbered only); literals: "canvas","2d","source-in" |
| `ml` | `yl` | function | alpha-exact function body match (189 char canon; locals renumbered only); literals: none |
| `Ml` | `_l` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.996 (runner-up 0.67); shared invariant tokens: s:offhand,p:weapon,p:equip,p:wt,p:base,s:none,p:includes,p:slot; literals: "offhand","none" |
| `mM` | `JM` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.998 (runner-up 0.30); shared invariant tokens: p:sel,s:商人,p:ex,p:min,n:10,p:max,p:why,s:换 1; literals: "商人","换 1" |
| `Mm` | `Fm` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.991 (runner-up 0.41); shared invariant tokens: p:pl,p:on,p:lifeCost,s:生命不足,s:魔力不足,n:1,n:0,p:slot; literals: "生命不足","魔力不足" |
| `mn` | `gn` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.977 (runner-up 0.32); shared invariant tokens: p:tower,k:best,n:0,k:bestT,k:runs,p:isArray,p:runs; literals: none |
| `Mn` | `Tn` | null | ref-vote-r0: 7/7 aligned free references across matched functions point to Tn; corroborated: 7/7 aligned references agree |
| `mo` | `bo` | function | alpha-exact function body match (2037 char canon; locals renumbered only); literals: none |
| `Mo` | `To` | function | alpha-exact function body match (592 char canon; locals renumbered only); literals: none |
| `mp` | `Ed` | function | clone fingerprint: OLD-token coverage 0.96 / dice 0.955 (runner-up 0.59); shared invariant tokens: s:gem,p:includes,p:pool,p:cls,n:1,p:push,p:gems,n:2; literals: "gem","sup" |
| `Mr` | `$r` | array | ref-vote-r0: 8/8 aligned free references across matched functions point to $r; corroborated: 8/8 aligned references agree |
| `ms` | `bs` | function | clone fingerprint: OLD-token coverage 0.91 / dice 0.906 (runner-up 0.19); shared invariant tokens: p:state,s:title,p:menu,n:1,s:web,s:preview,null,p:length; literals: "title","web" |
| `mS` | `d8` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.991 (runner-up 0.43); shared invariant tokens: p:pl,p:max,n:0,p:min,n:0.1,p:T,p:lastT,p:flare; literals: "#ffcf6a","#f0a040" |
| `mt` | `mt` | function | alpha-exact function body match (395 char canon; locals renumbered only); literals: "#overlay" |
| `mT` | `YT` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.79); shared invariant tokens: p:length,p:filter,p:x,n:2,p:y; literals: none |
| `Mt` | `Tt` | null | ref-vote-r0: 11/11 aligned free references across matched functions point to Tt; corroborated: 17/17 aligned references agree |
| `MT` | `i$` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.996 (runner-up 0.25); shared invariant tokens: s:ape,k:b,s:#4a4246,k:c,s:#6e6266,k:d,s:#d8501a,k:e; literals: "ape","#4a4246" |
| `mu` | `xu` | function | alpha-exact function body match (468 char canon; locals renumbered only); literals: "zh" |
| `Mu` | `ju` | function | clone fingerprint: OLD-token coverage 0.96 / dice 0.961 (runner-up 0.42); shared invariant tokens: s:#fade,p:sync,p:tower,p:busy,n:0,p:opacity,p:style,n:1; literals: "#fade" |
| `mv` | `Tv` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.985 (runner-up 0.43); shared invariant tokens: p:mods,p:ms,p:Z,p:hp,p:pl,p:min,p:maxLife,p:S; literals: "regen","fire" |
| `Mv` | `Pv` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.985 (runner-up 0.38); shared invariant tokens: p:cds,p:pl,n:0,s:parryT,s:noutouT,s:drT,s:disT,s:waveT; literals: "parryT","noutouT" |
| `mw` | `P5` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.990 (runner-up 0.36); shared invariant tokens: p:findIndex,p:skills,p:includes,s:clone,s:noutou,s:mark,p:bh,n:0; literals: "clone","noutou" |
| `Mw` | `Xw` | function | alpha-exact function body match (1527 char canon; locals renumbered only); literals: none |
| `mx` | `F5` | function | alpha-exact function body match (1092 char canon; locals renumbered only); literals: "-"," / " |
| `My` | `u2` | function | alpha-exact function body match (396 char canon; locals renumbered only); literals: none |
| `n` | `o` | object | clone fingerprint: OLD-token coverage 1.00 / dice 0.992 (runner-up 0.06); shared invariant tokens: k:camFocus,null,k:UID,n:1,k:muted,k:Z,k:pl,k:S; literals: "title" |
| `n$` | `N6` | function | clone fingerprint: OLD-token coverage 0.96 / dice 0.962 (runner-up 0.41); shared invariant tokens: p:exTo,p:join,p:map,s: on,p:col,p:n,p:cur,n:0; literals: " on","<button class=\"exto" |
| `N$` | `cA` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.998 (runner-up 0.46); shared invariant tokens: s:kill:loot,p:m,p:rift,s:rift3,p:dm,n:1.4,s:rift7,n:1.6; literals: "kill:loot","rift3" |
| `n0` | `T0` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.975 (runner-up 0.54); shared invariant tokens: p:lvl,p:Z,s:enc7,p:hp,p:maxhp,n:1.5,p:dmg,p:aggro; literals: "enc7" |
| `N0` | `V0` | function | alpha-exact function body match (219 char canon; locals renumbered only); literals: "slam" |
| `N1` | `x1` | expression | ref-vote-r0: 3/3 aligned free references across matched functions point to x1; corroborated: 3/3 aligned references agree |
| `N2` | `X2` | expression | ref-vote-r0: 3/3 aligned free references across matched functions point to X2; corroborated: 3/3 aligned references agree |
| `n3` | `y3` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.980 (runner-up 0.47); shared invariant tokens: p:debug,p:key,p:cur,p:chars,p:_w,p:id,p:G,p:looks; literals: "浏览器存储空间不足 · 通货暂未合并","_w" |
| `N3` | `oS` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.990 (runner-up 0.55); shared invariant tokens: p:dom,p:c,s:#e8e0d0,s:light,p:x,p:y,p:h,n:10; literals: "#e8e0d0","light" |
| `n4` | `I4` | function | alpha-exact function body match (526 char canon; locals renumbered only); literals: "swamp" |
| `N4` | `xx` | function | clone fingerprint: OLD-token coverage 0.88 / dice 0.882 (runner-up 0.19); shared invariant tokens: p:join,p:map,p:entries,p:preset,s: on,t:<button class="ffpre,t:" data-fp=",t:"><b>; literals: " on","<button class=\"ffpre" |
| `N5` | `yw` | object | alpha-exact object body match (151 char canon; locals renumbered only); literals: "之后的通货只改变后缀 · 占用 1 个后缀位","之后的通货只改变前缀 · 占用 1 个前缀位","腾出被锁定占用的位置" |
| `n6` | `kS` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.987 (runner-up 0.86); shared invariant tokens: p:filter,p:t,p:lv,n:0,p:ilvl,p:slots,p:includes,p:slot; literals: none |
| `N6` | `n6` | function | alpha-exact function body match (1900 char canon; locals renumbered only); literals: none |
| `n8` | `x6` | function | alpha-exact function body match (630 char canon; locals renumbered only); literals: none |
| `N8` | `cM` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.981 (runner-up 0.37); shared invariant tokens: p:walk,p:pl,p:id,p:joy,null,p:l,p:includes,p:loots; literals: none |
| `na` | `na` | function | clone fingerprint: OLD-token coverage 0.91 / dice 0.906 (runner-up 0.69); shared invariant tokens: p:x,p:y,p:hypot,p:ceil,n:6,n:1,n:0; literals: none |
| `Na` | `Ma` | object | clone fingerprint: OLD-token coverage 1.00 / dice 0.904 (runner-up 0.40); shared invariant tokens: k:on,n:1,k:rotGate,k:fsTried,k:lastVib,n:0; literals: none |
| `nb` | `Xb` | function | alpha-exact function body match (4117 char canon; locals renumbered only); literals: "暴击充能 ","狂怒充能 ","蓄雷 ×" |
| `Nb` | `By` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.992 (runner-up 0.70); shared invariant tokens: n:170,p:x,p:y,p:delay,n:0.9,p:push,p:fx,k:k; literals: "tele","#7fd0ff" |
| `nc` | `dc` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.978 (runner-up 0.27); shared invariant tokens: p:menu,n:1,p:tab,null,p:hidden,s:#panel,n:0,p:selSlot; literals: "#panel","通货现在全角色共用 · 其他角色的通货已合并进来(共 " |
| `Nc` | `Kc` | object | alpha-exact object body match (177 char canon; locals renumbered only); literals: "pulse12" |
| `Nd` | `Vd` | function | clone fingerprint: OLD-token coverage 0.77 / dice 0.771 (runner-up 0.24); shared invariant tokens: p:menu,n:0,p:touchMode,s:宠物拾取哪些东西: 地图页的「拾取与宠物」,s:宠物拾取哪些东西: 地图页(M) 底部的"宠物拾取",t:<div class="ovbox wide wardrobe"><h2>外观</h2><p class="sub">拥有的外观永久保留, 全部角色共享(以后新建的角色也有), 每一栏选一个显示。限定外观的兑换码在玩家群 ,p:onclick,s:#wdBack; literals: "宠物拾取哪些东西: 地图页的「拾取与宠物」","宠物拾取哪些东西: 地图页(M) 底部的\"宠物拾取\"" |
| `Ne` | `Ne` | function | alpha-exact function body match (548 char canon; locals renumbered only); literals: "f" |
| `nf` | `gf` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.983 (runner-up 0.54); shared invariant tokens: p:lit,n:0,p:t,p:push,p:grounds,k:x,p:x,k:y; literals: "flash","#ff7a20" |
| `Nf` | `o0` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.988 (runner-up 0.61); shared invariant tokens: p:cls,p:includes,p:tree,n:1,p:delete,p:length,p:shift,p:adj; literals: none |
| `ng` | `B1` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.966 (runner-up 0.30); shared invariant tokens: s:找不到这件装备,p:ember,p:cur,s:altar,null,n:0,s:up,s:none; literals: "找不到这件装备","altar" |
| `Ng` | `Ab` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.981 (runner-up 0.16); shared invariant tokens: s:file,p:getElementById,s:bMove,p:onclick,s:没有可以搬家的角色,p:open,s:_blank,s:noopener; literals: "file","bMove" |
| `nh` | `uh` | array | alpha-exact array body match (138 char canon; locals renumbered only); literals: "a.......a","ab.aaa.ba",".abbbbba." |
| `ni` | `ii` | string | ref-vote-r0: 6/6 aligned free references across matched functions point to ii; corroborated: 6/6 aligned references agree |
| `Ni` | `Vi` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.984 (runner-up 0.28); shared invariant tokens: p:Z,k:type,k:M,k:th,k:img,p:c,k:lights,p:lights; literals: "canvas" |
| `Nk` | `Xk` | array | alpha-exact array body match (44 char canon; locals renumbered only); literals: none |
| `nl` | `cl` | function | alpha-exact function body match (259 char canon; locals renumbered only); literals: none |
| `Nl` | `Ol` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.974 (runner-up 0.69); shared invariant tokens: p:slot,p:kind,s:map,n:0,p:base,p:wt,p:includes,p:id; literals: "W","map" |
| `nm` | `um` | function | alpha-exact function body match (626 char canon; locals renumbered only); literals: none |
| `nM` | `GM` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.988 (runner-up 0.44); shared invariant tokens: k:eq,k:inv,p:from,s:eq,p:mode,s:altar,s:mbpick,s:bfrom; literals: "eq","altar" |
| `Nm` | `Lg` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.993 (runner-up 0.41); shared invariant tokens: p:k,p:dataset,s:mkBase,s:mkUniq,s:背包已满,p:newBase,p:ilvl,n:0; literals: "mkBase","mkUniq" |
| `NM` | `W8` | function | alpha-exact function body match (384 char canon; locals renumbered only); literals: none |
| `nn` | `dn` | function | alpha-exact function body match (738 char canon; locals renumbered only); literals: none |
| `Nn` | `Gn` | function | alpha-exact function body match (427 char canon; locals renumbered only); literals: none |
| `no` | `fo` | function | alpha-exact function body match (141 char canon; locals renumbered only); literals: "<div class=\"mvcard\" style=\"--tb:","\">","</div>" |
| `No` | `Zo` | regexp | ref-vote-r0: 10/10 aligned free references across matched functions point to Zo; corroborated: 10/10 aligned references agree |
| `np` | `wp` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.980 (runner-up 0.59); shared invariant tokens: p:cur,n:0,s:没有,p:n,n:1,p:mods,null,p:last; literals: "没有","nomana" |
| `Np` | `pu` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.981 (runner-up 0.36); shared invariant tokens: n:0.025,p:keys,n:0.07,n:0.68,p:pool,p:cls,n:0.7,n:1; literals: none |
| `nr` | `rr` | number | ref-vote-r0: 7/7 aligned free references across matched functions point to rr; corroborated: 7/7 aligned references agree |
| `Nr` | `Zr` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.992 (runner-up 0.42); shared invariant tokens: s:hideout,p:hideout,k:lvl,n:1,p:x,p:pl,n:15,n:8; literals: "hideout","device" |
| `nS` | `t8` | array | alpha-exact array body match (248 char canon; locals renumbered only); literals: none |
| `Ns` | `Ls` | function | ref-vote-r0: 13/13 aligned free references across matched functions point to Ls; corroborated: 13/13 aligned references agree |
| `NS` | `TM` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.46); shared invariant tokens: p:lvl,n:20,n:100,p:min,p:xp,t:<span class="mxp"><i style="width:,t:%"></i></span>; literals: "<span class=\"mxp\"><i style=\"width:","%\"></i></span>" |
| `nt` | `nt` | object | alpha-exact object body match (117 char canon; locals renumbered only); literals: none |
| `nT` | `WT` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.988 (runner-up 0.58); shared invariant tokens: p:c,p:pl,p:r,n:60,p:cry,p:d,s:seismic,n:4; literals: "seismic","ring" |
| `Nt` | `_t` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.989 (runner-up 0.65); shared invariant tokens: p:base,k:uid,k:kind,s:item,k:base,k:slot,p:slot,k:ilvl; literals: "item","U" |
| `NT` | `T$` | object | alpha-exact object body match (93 char canon; locals renumbered only); literals: none |
| `nu` | `yi` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.994 (runner-up 0.35); shared invariant tokens: p:kind,s:cur,p:has,p:cur,s:通货,p:it,s:map,p:mapMin; literals: "cur","通货" |
| `Nu` | `Ju` | function | alpha-exact function body match (158 char canon; locals renumbered only); literals: none |
| `nv` | `mv` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.988 (runner-up 0.42); shared invariant tokens: k:x,p:x,k:y,p:y,n:40,k:r,n:64,n:46; literals: "#ffd27a","#a050ff" |
| `Nv` | `Xv` | object | alpha-exact object body match (142 char canon; locals renumbered only); literals: "#5a5464","#3a2a26","#d8ecff" |
| `nw` | `Pw` | function | alpha-exact function body match (424 char canon; locals renumbered only); literals: "." |
| `Nw` | `b4` | function | alpha-exact function body match (418 char canon; locals renumbered only); literals: none |
| `nx` | `mx` | function | alpha-exact function body match (1146 char canon; locals renumbered only); literals: none |
| `Nx` | `Bx` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.979 (runner-up 0.43); shared invariant tokens: p:t,p:x,p:y,p:z,n:3.5,n:4,n:1,p:sin; literals: "#a83414","#e8702a" |
| `O` | `O` | function | alpha-exact function body match (236 char canon; locals renumbered only); literals: none |
| `o$` | `W6` | function | alpha-exact function body match (916 char canon; locals renumbered only); literals: none |
| `O$` | `aA` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.996 (runner-up 0.23); shared invariant tokens: s:无效目标,s:ember,s:ash,s:在藏身处的余烬祭坛使用,p:grp,s:sig,s:首领印记用于在地图装置开启裂隙之心,p:kind; literals: "无效目标","ember" |
| `o0` | `M0` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.992 (runner-up 0.41); shared invariant tokens: p:st,s:done,s:fail,p:enc,p:type,s: · 失败,s: · 完成,s:奖励已出现; literals: "done","fail" |
| `O0` | `W0` | function | alpha-exact function body match (185 char canon; locals renumbered only); literals: "调试角色 · 不计入纪录","途中改配装 · 不计入纪录" |
| `o1` | `Hg` | object | alpha-exact object body match (133 char canon; locals renumbered only); literals: none |
| `O1` | `h1` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.996 (runner-up 0.45); shared invariant tokens: null,k:ow,k:oh,k:ox,k:oy,p:span,n:1,p:getContext; literals: "2d","c" |
| `o2` | `xg` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.986 (runner-up 0.46); shared invariant tokens: p:jk,p:fx,p:k,s:jkpillar,p:push,k:x,p:x,k:y; literals: "jkpillar","fly" |
| `O2` | `Z2` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.989 (runner-up 0.61); shared invariant tokens: p:kind,s:spark,p:globalCompositeOperation,s:lighter,p:fillStyle,s:#a8b4ff,p:fillRect,p:round; literals: "spark","lighter" |
| `o3` | `b3` | function | alpha-exact function body match (255 char canon; locals renumbered only); literals: none |
| `O3` | `J3` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.991 (runner-up 0.45); shared invariant tokens: p:labelRects,p:hoverLoot,null,p:sx,p:s,p:sy,p:sort,p:filter; literals: "900 ","600 " |
| `o4` | `j4` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.993 (runner-up 0.58); shared invariant tokens: k:combo,k:w,n:40,n:3,n:0.3,k:cast,n:0.4,k:start; literals: "tele","#ff5030" |
| `O4` | `f3` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.981 (runner-up 0.34); shared invariant tokens: p:length,n:1,n:0,p:r,n:2,p:cells,p:clear,n:65536; literals: none |
| `o5` | `Yx` | array | alpha-exact array body match (126 char canon; locals renumbered only); literals: "010111010","101010101","111100111" |
| `o6` | `vS` | object | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.57); shared invariant tokens: k:bow,s:meleeInc,k:crossbow,k:spear,k:katana,k:jian,k:qstaff,s:projAdd; literals: "meleeInc","projAdd" |
| `O6` | `YS` | function | alpha-exact function body match (49680 char canon; locals renumbered only); literals: "....a............a....","...ab............ba...","...abb..aaaaaa..bba..." |
| `o8` | `k6` | function | alpha-exact function body match (3452 char canon; locals renumbered only); literals: none |
| `O8` | `tM` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.51); shared invariant tokens: p:has,p:bh,p:d,s:area,s:self,s:dir; literals: "area","self" |
| `Oa` | `Fa` | object | alpha-exact object body match (584 char canon; locals renumbered only); literals: "quiver","shield","wakizashi" |
| `ob` | `Yb` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.985 (runner-up 0.39); shared invariant tokens: p:forEach,p:buffs,p:getElementById,s:mte,p:height,p:style,p:min,n:100; literals: "mte","%" |
| `Ob` | `Ey` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.75); shared invariant tokens: p:slice,p:gases,p:x,n:2,p:y,p:r; literals: none |
| `oc` | `Ul` | function | ref-vote-r0: 4/4 aligned free references across matched functions point to Ul; corroborated: 4/4 aligned references agree |
| `Oc` | `Gc` | function | alpha-exact function body match (161 char canon; locals renumbered only); literals: " " |
| `Od` | `Wd` | function | clone fingerprint: OLD-token coverage 0.95 / dice 0.953 (runner-up 0.35); shared invariant tokens: p:sin,n:1,p:max,n:0,n:110,n:0.04,p:fan,n:40; literals: none |
| `oe` | `oe` | function | alpha-exact function body match (425 char canon; locals renumbered only); literals: none |
| `Oe` | `Be` | function | alpha-exact function body match (1658 char canon; locals renumbered only); literals: "scorch" |
| `of` | `mf` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.981 (runner-up 0.70); shared invariant tokens: p:areaMul,n:1,p:c,p:src,s:skill:slam,k:a,k:c,k:x; literals: "skill:slam" |
| `Of` | `yf` | function | ref-vote-r0: 3/3 aligned free references across matched functions point to yf; corroborated: 3/3 aligned references agree |
| `og` | `O1` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.991 (runner-up 0.22); shared invariant tokens: p:kind,s:item,s:只能献祭装备,p:corrupted,p:dc,s:这件装备已经献祭过了,p:ember,p:cur; literals: "item","只能献祭装备" |
| `Og` | `yb` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.986 (runner-up 0.48); shared invariant tokens: p:closest,s:[data-wd],k:act,s:st-out,k:gate,n:0,s:[data-dp],s:[data-dg]; literals: "[data-wd]","st-out" |
| `Oh` | `Hh` | function | alpha-exact function body match (506 char canon; locals renumbered only); literals: none |
| `oi` | `ri` | function | ref-vote-r0: 8/8 aligned free references across matched functions point to ri; corroborated: 8/8 aligned references agree |
| `Oi` | `Ii` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.994 (runner-up 0.58); shared invariant tokens: p:concat,p:map,p:filter,p:skills,p:gid,p:gems,p:kind,s:gem; literals: "gem","sup" |
| `ok` | `hk` | object | clone fingerprint: OLD-token coverage 0.99 / dice 0.983 (runner-up 0.03); shared invariant tokens: k:hit:res,k:hit:base,k:hit:crit,s:{m, c, src, cc, force} — crit chance; multiply cc or set force=true,k:hit:sheathe,s:{m, c, src, mult} — damage multiplier of a sheathed (纳刀) attack; add to mult,k:hit:mods,k:hit:land; literals: "hit:res","hit:base" |
| `Ok` | `Zk` | function | alpha-exact function body match (3026 char canon; locals renumbered only); literals: "lead","lead2","bass" |
| `ol` | `ll` | array | alpha-exact array body match (51 char canon; locals renumbered only); literals: "spellInc","castSpd" |
| `oM` | `qM` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.43); shared invariant tokens: p:kind,s:soul,p:rarity,n:2,p:meta,p:join,p:map,s: no; literals: "soul"," no" |
| `Om` | `sg` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.995 (runner-up 0.24); shared invariant tokens: n:1,p:now,p:zone,p:Z,p:floor,p:ceil,n:2,p:width; literals: "hideout","torch" |
| `OM` | `yT` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.993 (runner-up 0.45); shared invariant tokens: p:clientX,p:clientY,n:0,p:treeHover,n:1,p:treePath,p:contains,p:classList; literals: "#tip","treepin" |
| `on` | `fn` | function | alpha-exact function body match (273 char canon; locals renumbered only); literals: "meta" |
| `On` | `Zn` | function | alpha-exact function body match (14946 char canon; locals renumbered only); literals: "," |
| `oo` | `io` | function | clone fingerprint: OLD-token coverage 0.92 / dice 0.926 (runner-up 0.41); shared invariant tokens: p:mv,p:bench,k:eq,k:inv,p:join,p:map,p:from,s:eq; literals: "eq","bench" |
| `Oo` | `Go` | object | alpha-exact object body match (1949 char canon; locals renumbered only); literals: "sDmg","伤害总增 10%","sCrit" |
| `Op` | `lu` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.995 (runner-up 0.46); shared invariant tokens: p:c,p:x,p:y,p:S,p:mini,n:0.65,n:1,p:grenadeArea; literals: "expl","flash" |
| `or` | `nr` | function | alpha-exact function body match (385 char canon; locals renumbered only); literals: "string" |
| `Or` | `Gr` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.886 (runner-up 0.51); shared invariant tokens: null,s:wd,p:tab,p:tabs,n:1,p:splice,s:dp,p:inv; literals: "wd","dp" |
| `os` | `os` | function | duplicate canonical signature disambiguated by declaration order: only candidate in anchor window (16..17); canon 189 chars; corroborated: 8/8 aligned references agree |
| `oS` | `e8` | array | alpha-exact array body match (293 char canon; locals renumbered only); literals: none |
| `Os` | `Gs` | null | ref-vote-r0: 10/10 aligned free references across matched functions point to Gs; corroborated: 13/13 aligned references agree |
| `OS` | `yM` | array | alpha-exact array body match (234 char canon; locals renumbered only); literals: "basic","通货","sock" |
| `ot` | `st` | object | alpha-exact object body match (3340 char canon; locals renumbered only); literals: "焚天烬翼","群破 1500 限定","#1c0806" |
| `oT` | `GT` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.988 (runner-up 0.68); shared invariant tokens: p:c,p:pl,p:jz,n:0,p:r,p:meleeArea,p:push,p:fx; literals: "ring","#e8d8c0" |
| `Ot` | `Ot` | function | alpha-exact function body match (570 char canon; locals renumbered only); literals: none |
| `OT` | `y$` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.980 (runner-up 0.27); shared invariant tokens: s:map:stats,k:m,k:o,p:dbg,p:entries,p:fx,s:quant,s:rar; literals: "map:stats","quant" |
| `ou` | `Jp` | function | clone fingerprint: OLD-token coverage 0.96 / dice 0.964 (runner-up 0.45); shared invariant tokens: p:Z,p:type,s:map,p:state,s:play,p:cancel,s:portal,k:cancel; literals: "map","play" |
| `Ou` | `Hu` | number | ref-vote-r0: 4/4 aligned free references across matched functions point to Hu; corroborated: 4/4 aligned references agree |
| `ow` | `jw` | object | alpha-exact object body match (51 char canon; locals renumbered only); literals: none |
| `Ow` | `f4` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.986 (runner-up 0.34); shared invariant tokens: n:1,p:length,p:haz,n:0,p:t,p:vx,p:x,p:y; literals: "ring","bliz" |
| `ox` | `hx` | function | alpha-exact function body match (4828 char canon; locals renumbered only); literals: none |
| `Ox` | `Ex` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.979 (runner-up 0.39); shared invariant tokens: p:pl,p:zone,p:Z,p:k,n:0,p:cd,p:min,n:0.4; literals: "play","hideout" |
| `oy` | `Qy` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.985 (runner-up 0.26); shared invariant tokens: k:critInc,n:0,k:critMulti,k:dmgInc,k:extraFire,k:areaInc,k:haste,k:cdr; literals: none |
| `Oy` | `S2` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.993 (runner-up 0.43); shared invariant tokens: p:length,p:projs,n:1,n:0,p:life,p:home,null,n:25600; literals: "icespear","fireball" |
| `P` | `P` | function | alpha-exact function body match (967 char canon; locals renumbered only); literals: "div","toast","#toasts" |
| `p$` | `j$` | function | clone fingerprint: OLD-token coverage 0.96 / dice 0.956 (runner-up 0.23); shared invariant tokens: p:min,p:best,n:0,p:cap,p:t150,n:100,p:find,p:n; literals: " ok"," cap" |
| `P$` | `eA` | array | alpha-exact array body match (80 char canon; locals renumbered only); literals: "狂怒","嗜血","灰烬" |
| `P1` | `p1` | number | ref-vote-r0: 3/3 aligned free references across matched functions point to p1; corroborated: 3/3 aligned references agree |
| `P2` | `H2` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.996 (runner-up 0.51); shared invariant tokens: p:haz,p:kind,s:ring,n:0.35,p:sin,p:T,n:4,n:0.1; literals: "ring","bliz" |
| `p3` | `A3` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.948 (runner-up 0.43); shared invariant tokens: n:1,s:击败一次 T,p:unlockTier,s: 地图首领后开启,p:tower,k:n0,k:floors,k:deaths; literals: "击败一次 T"," 地图首领后开启" |
| `P3` | `V3` | function | clone fingerprint: OLD-token coverage 0.84 / dice 0.941 (runner-up 0.47); shared invariant tokens: p:fx,p:has,p:k,p:t,p:max,n:0,n:1,s:ring; literals: "ring","bolt" |
| `p4` | `q4` | object | alpha-exact object body match (184 char canon; locals renumbered only); literals: "宝藏","裂隙","首领" |
| `P4` | `l3` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.986 (runner-up 0.72); shared invariant tokens: null,n:2116,p:loots,p:landed,p:x,p:pl,n:2,p:y; literals: none |
| `P5` | `cw` | function | alpha-exact function body match (149 char canon; locals renumbered only); literals: "hideout" |
| `P6` | `QS` | function | alpha-exact function body match (33681 char canon; locals renumbered only); literals: "hero_","zombie","....aaaa...." |
| `p8` | `I6` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.983 (runner-up 0.46); shared invariant tokens: k:id,p:sid,k:x,n:0,k:y,k:z,n:7,k:ang; literals: "fly","ret" |
| `pa` | `pa` | object | alpha-exact object body match (98 char canon; locals renumbered only); literals: none |
| `Pa` | `Oa` | function | alpha-exact function body match (250 char canon; locals renumbered only); literals: none |
| `pb` | `ry` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.993 (runner-up 0.70); shared invariant tokens: p:length,p:filter,p:keys,p:codex,k:allboss,p:bossKills,n:0,s:/4; literals: "/4","/" |
| `Pb` | `Cy` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.981 (runner-up 0.50); shared invariant tokens: p:forked,n:1,n:0.45,p:c,p:src,p:x,p:y,p:ang; literals: "tornado","tsec" |
| `pc` | `kc` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.987 (runner-up 0.67); shared invariant tokens: n:0.35,p:push,p:fx,k:k,s:tele,k:x,k:y,k:r; literals: "tele","#c8a070" |
| `Pc` | `Dc` | function | alpha-exact function body match (754 char canon; locals renumbered only); literals: none |
| `pd` | `yd` | function | alpha-exact function body match (766 char canon; locals renumbered only); literals: none |
| `Pd` | `qd` | number | ref-vote-r0: 3/3 aligned free references across matched functions point to qd; corroborated: 4/4 aligned references agree |
| `pe` | `ue` | function | ref-vote-r0: 46/46 aligned free references across matched functions point to ue; corroborated: 46/46 aligned references agree |
| `Pe` | `Oe` | object | alpha-exact object body match (399 char canon; locals renumbered only); literals: none |
| `pf` | `Uf` | null | ref-vote-r0: 5/5 aligned free references across matched functions point to Uf; corroborated: 5/5 aligned references agree |
| `Ph` | `Wh` | function | alpha-exact function body match (224 char canon; locals renumbered only); literals: none |
| `pi` | `mi` | function | alpha-exact function body match (367 char canon; locals renumbered only); literals: "W","B","HGFSXK" |
| `Pi` | `Hr` | function | ref-vote-r0: 4/4 aligned free references across matched functions point to Hr; corroborated: 4/4 aligned references agree |
| `pk` | `wk` | function | alpha-exact function body match (1280 char canon; locals renumbered only); literals: "fillText","strokeText","measureText" |
| `Pk` | `Hk` | function | alpha-exact function body match (11853 char canon; locals renumbered only); literals: "bell","piano","triangle" |
| `pl` | `ml` | array | ref-vote-r0: 3/3 aligned free references across matched functions point to ml; corroborated: 3/3 aligned references agree |
| `Pl` | `Al` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.966 (runner-up 0.64); shared invariant tokens: n:1.6,p:cd,p:max,p:k,n:0.3,p:pl,n:0.8,n:0; literals: none |
| `pm` | `km` | function | alpha-exact function body match (1093 char canon; locals renumbered only); literals: none |
| `pM` | `KM` | array | alpha-exact array body match (277 char canon; locals renumbered only); literals: "gem","技能宝石","sup" |
| `Pm` | `tg` | null | ref-vote-r0: 3/3 aligned free references across matched functions point to tg; corroborated: 3/3 aligned references agree |
| `PM` | `gT` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.974 (runner-up 0.29); shared invariant tokens: s:#mheld,p:hidden,n:0,p:innerHTML,p:n,p:cur,p:on,s:on; literals: "#mheld","on" |
| `pn` | `mn` | object | alpha-exact object body match (72 char canon; locals renumbered only); literals: none |
| `Pn` | `zn` | function | alpha-exact function body match (185 char canon; locals renumbered only); literals: "speed" |
| `po` | `Xs` | function | clone fingerprint: OLD-token coverage 0.96 / dice 0.962 (runner-up 0.35); shared invariant tokens: p:mv,p:shop,p:tab,s:gem,s:技能宝石,s:sup,s:辅助宝石,s:map; literals: "gem","技能宝石" |
| `Po` | `Oo` | object | clone fingerprint: OLD-token coverage 0.94 / dice 0.942 (runner-up 0.07); shared invariant tokens: k:qun500,k:h,s:1eg4sswgh9h,k:until,k:n,s:群破 500 · 开服元老,k:reward,k:title; literals: "1eg4sswgh9h","3026-10-24T23:59:59+08:00" |
| `pp` | `$p` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.984 (runner-up 0.29); shared invariant tokens: p:k,p:dataset,p:cur,p:held,null,n:1,s:没有,p:n; literals: "没有","cur" |
| `Pp` | `ru` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.988 (runner-up 0.27); shared invariant tokens: p:length,p:join,p:map,p:k,p:n,p:m,p:med,p:sd; literals: "—","<tr><td style=\"color:" |
| `pr` | `ur` | null | ref-vote-r0: 7/7 aligned free references across matched functions point to ur; corroborated: 7/7 aligned references agree |
| `Pr` | `xr` | function | clone fingerprint: OLD-token coverage 0.96 / dice 0.958 (runner-up 0.70); shared invariant tokens: p:indexOf,p:gems,n:0,n:1,p:splice,p:sup,p:length,p:forEach; literals: "pick" |
| `ps` | `ms` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.969 (runner-up 0.26); shared invariant tokens: p:tab,p:forEach,p:querySelectorAll,s:#tabs button,p:toggle,p:classList,s:on,p:dataset; literals: "#tabs button","on" |
| `pS` | `l8` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.986 (runner-up 0.50); shared invariant tokens: p:life,n:1,n:60,p:length,n:0,p:shift,p:moving,n:4; literals: "u","2d" |
| `Ps` | `qs` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.980 (runner-up 0.39); shared invariant tokens: k:quant,n:0,k:rar,k:mods,p:atlas,p:includes,s:sust7,n:1.3; literals: "sust7","map:stats" |
| `PS` | `gM` | function | alpha-exact function body match (833 char canon; locals renumbered only); literals: "\|",":","," |
| `pt` | `pt` | object | alpha-exact object body match (200 char canon; locals renumbered only); literals: none |
| `pT` | `VT` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.989 (runner-up 0.27); shared invariant tokens: p:beast,p:mon,p:x,p:pl,n:20,p:y,n:14,n:16; literals: "#ffffff","idle" |
| `Pt` | `Pt` | object | alpha-exact object body match (142 char canon; locals renumbered only); literals: "#ece6da","#ff9a48","#94dcff" |
| `PT` | `g$` | object | alpha-exact object body match (292 char canon; locals renumbered only); literals: "title","elder","pet" |
| `pu` | `nu` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.55); shared invariant tokens: p:wx,p:l,p:sx,p:s,p:wy,p:t,p:sy; literals: none |
| `Pu` | `Wu` | number | ref-vote-r0: 3/3 aligned free references across matched functions point to Wu; corroborated: 3/3 aligned references agree |
| `pv` | `wv` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.985 (runner-up 0.87); shared invariant tokens: p:hidden,p:spr,p:face,n:0,p:moving,p:frozen,p:abs,p:sin; literals: "#6a70ff","#f0d040" |
| `Pv` | `Hv` | function | alpha-exact function body match (499 char canon; locals renumbered only); literals: none |
| `Pw` | `l4` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.987 (runner-up 0.64); shared invariant tokens: n:3,p:src,p:fw,n:0,p:x,p:y,p:c,p:push; literals: "sky","#a8b4ff" |
| `px` | `z5` | object | alpha-exact object body match (122 char canon; locals renumbered only); literals: "墓穴","熔岩","冰原" |
| `Px` | `Cx` | function | alpha-exact function body match (1400 char canon; locals renumbered only); literals: "hideout" |
| `Py` | `_b` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.975 (runner-up 0.60); shared invariant tokens: p:device,null,s:portal,s:#fade,p:opacity,p:style,n:1,n:0; literals: "portal","#fade" |
| `q` | `q` | object | alpha-exact object body match (378 char canon; locals renumbered only); literals: none |
| `Q` | `Z` | object | clone fingerprint: OLD-token coverage 1.00 / dice 0.978 (runner-up 0.24); shared invariant tokens: k:joy,k:id,null,k:bx,n:0,k:by,k:x,k:y; literals: none |
| `q$` | `rA` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.994 (runner-up 0.46); shared invariant tokens: s:skill:start,k:a,k:c,k:rep,p:chargeBurst,null,p:pch,p:pl; literals: "skill:start","gold" |
| `Q$` | `gA` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.998 (runner-up 0.37); shared invariant tokens: s:stats:pre,k:asc,k:add,p:has,s:jlZidian,s:lightInc,n:30,s:stats:post; literals: "stats:pre","jlZidian" |
| `q0` | `Z0` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.988 (runner-up 0.54); shared invariant tokens: p:parryT,p:pl,n:0,p:parryBuffT,n:2,s:parry,p:slowT,p:max; literals: "parry","gold" |
| `Q0` | `ad` | null | ref-vote-r0: 4/4 aligned free references across matched functions point to ad; corroborated: 4/4 aligned references agree |
| `Q1` | `C1` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.996 (runner-up 0.41); shared invariant tokens: p:pl,p:dead,p:state,s:play,p:title,p:pal,p:gold,p:T; literals: "play","back" |
| `q2` | `Q2` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.996 (runner-up 0.53); shared invariant tokens: p:cyc,p:devils,p:el,s:none,p:push,k:x,p:x,k:y; literals: "none","pxfin" |
| `Q2` | `rv` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.70); shared invariant tokens: s:#share,p:remove,p:createElement,s:div,p:id,s:share,p:innerHTML,p:best; literals: "#share","div" |
| `q3` | `tS` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.988 (runner-up 0.39); shared invariant tokens: p:act,p:pl,p:charging,p:t,p:dur,p:fired,p:rel,p:kind; literals: "melee","#ffffff" |
| `Q3` | `dS` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.976 (runner-up 0.53); shared invariant tokens: p:pl,p:atan2,p:y,p:x,p:face,p:cos,n:0,n:1; literals: "#ff6a1a","#ffb040" |
| `q4` | `yx` | array | alpha-exact array body match (372 char canon; locals renumbered only); literals: "W","武器","O" |
| `Q4` | `Qw` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.991 (runner-up 0.27); shared invariant tokens: p:Z,p:type,s:map,p:state,s:play,n:0,s:请先进入地图,n:1; literals: "map","play" |
| `q5` | `mw` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.993 (runner-up 0.45); shared invariant tokens: p:sel,p:split,s:gem,s:sup,s:map,p:n,s: 地图,s:已购买 ; literals: ":","gem" |
| `q6` | `a6` | function | alpha-exact function body match (838 char canon; locals renumbered only); literals: none |
| `q8` | `rM` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.992 (runner-up 0.37); shared invariant tokens: p:addEventListener,s:pointerdown,p:preventDefault,p:stopPropagation,p:skills,n:0,s:gem,p:setPointerCapture; literals: "pointerdown","gem" |
| `Q8` | `Z6` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.978 (runner-up 0.37); shared invariant tokens: p:pl,p:e,k:kind,s:pet,k:id,k:x,p:x,n:14; literals: "pet" |
| `qa` | `Ga` | function | alpha-exact function body match (694 char canon; locals renumbered only); literals: "rgba(",",",")" |
| `qb` | `Py` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.991 (runner-up 0.37); shared invariant tokens: p:Z,p:type,s:map,p:pin,p:pinLv,p:pinKills,n:0,n:1; literals: "map","cur" |
| `Qb` | `Hy` | object | alpha-exact object body match (72 char canon; locals renumbered only); literals: none |
| `qc` | `Uc` | null | ref-vote-r0: 4/4 aligned free references across matched functions point to Uc; corroborated: 4/4 aligned references agree |
| `qf` | `t0` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.965 (runner-up 0.22); shared invariant tokens: p:on,n:1,p:min,n:500,n:1.15,n:700,n:1.08,p:zoom; literals: none |
| `Qf` | `qf` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.966 (runner-up 0.76); shared invariant tokens: k:uid,k:kind,s:soul,k:slot,k:beast,k:base,k:ilvl,k:rarity; literals: "soul","Z" |
| `qh` | `Kh` | array | alpha-exact array body match (110 char canon; locals renumbered only); literals: "厄运","血腥","幽魂" |
| `Qh` | `om` | array | alpha-exact array body match (371 char canon; locals renumbered only); literals: "life","resAll","mana" |
| `qi` | `Zi` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.966 (runner-up 0.38); shared invariant tokens: p:mods,p:ms,p:Z,p:mon,p:th,p:keys,n:0.14,n:1; literals: "swamp","sust4" |
| `Qi` | `Li` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.988 (runner-up 0.76); shared invariant tokens: p:push,p:pend,k:t,n:0.08,k:fn,p:fx,k:k,s:sky; literals: "sky","#a8b4ff" |
| `qk` | `Qk` | function | alpha-exact function body match (1444 char canon; locals renumbered only); literals: "title","hideout","void" |
| `Qk` | `rx` | function | alpha-exact function body match (1366 char canon; locals renumbered only); literals: none |
| `ql` | `Il` | function | clone fingerprint: OLD-token coverage 0.87 / dice 0.873 (runner-up 0.21); shared invariant tokens: p:join,p:map,n:0,p:round,n:100,n:1,t:<div class="aout ao-,t:"><b>; literals: "<div class=\"aout ao-","\"><b>" |
| `Ql` | `ac` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.987 (runner-up 0.39); shared invariant tokens: p:t,p:col,p:n,p:join,p:map,n:0,s: · ,t:<span class="signtag" style="--fc:; literals: " · ","<span class=\"signtag\" style=\"--fc:" |
| `qm` | `Cg` | function | ref-vote-r0: 3/3 aligned free references across matched functions point to Cg; corroborated: 3/3 aligned references agree |
| `qM` | `D8` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.995 (runner-up 0.73); shared invariant tokens: p:cls,p:wt,p:weapon,p:equip,s:helm,s:body,s:gloves,s:boots; literals: "W","helm" |
| `Qm` | `Fg` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.990 (runner-up 0.40); shared invariant tokens: s:crypt,s:这个浏览器无法启用 WebGL 光影: ,p:err,n:6,n:7,n:0,n:20,p:length; literals: "crypt","这个浏览器无法启用 WebGL 光影: " |
| `QM` | `IT` | function | clone fingerprint: OLD-token coverage 0.91 / dice 0.908 (runner-up 0.32); shared invariant tokens: t:<button class="btn small" data-act="dbg" data-k=",t:" title=",t:">,t:</button>,p:Z,p:type,s:map,s:grant; literals: "\" title=\"","\">" |
| `qn` | `Fn` | function | alpha-exact function body match (904 char canon; locals renumbered only); literals: "rgba(",",",")" |
| `Qn` | `On` | function | alpha-exact function body match (414 char canon; locals renumbered only); literals: "<span class=\"pc\" style=\"color:","\">"," ×" |
| `Qo` | `Io` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.984 (runner-up 0.31); shared invariant tokens: p:kind,s:cur,p:cur,n:0,n:1,p:run,p:value,p:v; literals: "cur","pick" |
| `qp` | `Yp` | function | alpha-exact function body match (106 char canon; locals renumbered only); literals: none |
| `Qp` | `eu` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.987 (runner-up 0.49); shared invariant tokens: s:ape,n:2,p:maxhp,n:2.6,p:hp,p:dmg,n:1.15,p:ub; literals: "ape","焚拳猿王" |
| `qr` | `qo` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.37); shared invariant tokens: p:setItem,p:stringify,p:on,s:zoom,s:btn,s:left,s:joy,s:alpha; literals: "zoom","btn" |
| `Qr` | `Xr` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.993 (runner-up 0.48); shared invariant tokens: p:bossMoveHook,p:hp,p:maxhp,n:0.5,p:en,p:pt,null,n:1.4; literals: "chase","function" |
| `qs` | `Ns` | string | ref-vote-r0: 11/11 aligned free references across matched functions point to Ns; corroborated: 11/11 aligned references agree |
| `qS` | `wM` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.994 (runner-up 0.72); shared invariant tokens: p:equip,p:weapon,p:wt,p:base,s:none,k:quiver,s:箭袋,k:shield; literals: "none","箭袋" |
| `Qs` | `Qs` | function | alpha-exact function body match (1907 char canon; locals renumbered only); literals: "null" |
| `QS` | `jM` | array | alpha-exact array body match (55 char canon; locals renumbered only); literals: "inv","gem","map" |
| `qt` | `qt` | function | duplicate canonical signature disambiguated by declaration order: only candidate in anchor window (1869..1872); canon 106 chars; corroborated: 23/23 aligned references agree |
| `Qt` | `Jt` | function | alpha-exact function body match (125 char canon; locals renumbered only); literals: none |
| `QT` | `TT` | object | alpha-exact object body match (321 char canon; locals renumbered only); literals: "#1b1416","#f5f1ea","#d4cdc4" |
| `Qu` | `oh` | function | alpha-exact function body match (1760 char canon; locals renumbered only); literals: "SCRIPT","STYLE","TEXTAREA" |
| `qw` | `h4` | function | clone fingerprint: OLD-token coverage 0.95 / dice 0.951 (runner-up 0.23); shared invariant tokens: null,p:bossMoveHook,k:state,k:hp,n:1,k:maxhp,k:pt,n:9; literals: "x" |
| `Qw` | `M4` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.976 (runner-up 0.59); shared invariant tokens: p:hypot,p:x,p:y,n:1,p:Z,p:M,p:g,p:forceNav; literals: "map" |
| `qx` | `Px` | object | alpha-exact object body match (97 char canon; locals renumbered only); literals: none |
| `Qx` | `Hx` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.990 (runner-up 0.47); shared invariant tokens: p:t,p:x,p:y,p:z,p:sin,n:2.4,n:0.6,n:15; literals: "180,80,255","255,200,90" |
| `qy` | `A2` | function | alpha-exact function body match (1307 char canon; locals renumbered only); literals: "meta","gem","sup" |
| `Qy` | `ug` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.986 (runner-up 0.46); shared invariant tokens: p:pl,n:0,p:act,p:reload,p:t,p:dur,p:reloadT,p:find; literals: "rgba(0,0,0,0.6)","#ffd27a" |
| `R` | `R` | function | alpha-exact function body match (1106 char canon; locals renumbered only); literals: "unknown event: " |
| `R$` | `V$` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.992 (runner-up 0.51); shared invariant tokens: p:T,p:fillStyle,s:rgba(0,0,0,0.45),p:beginPath,p:ellipse,n:0,n:3,n:17; literals: "rgba(0,0,0,0.45)","#1a1420" |
| `r0` | `$0` | function | alpha-exact function body match (109 char canon; locals renumbered only); literals: none |
| `R0` | `z0` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.988 (runner-up 0.51); shared invariant tokens: p:parse,p:getItem,s:null,p:cur,s:object,null,p:looks,p:cos; literals: "null","object" |
| `r2` | `qg` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.990 (runner-up 0.49); shared invariant tokens: s:#gtip,p:state,s:play,p:tab,p:hoverLoot,null,p:shift,p:hidden; literals: "#gtip","play" |
| `R2` | `D2` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.983 (runner-up 0.44); shared invariant tokens: p:length,p:sparks,p:globalCompositeOperation,s:lighter,p:lineCap,s:round,p:t,p:max; literals: "lighter","round" |
| `r3` | `k3` | object | alpha-exact object body match (468 char canon; locals renumbered only); literals: none |
| `R3` | `H3` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.985 (runner-up 0.52); shared invariant tokens: p:gone,p:spr,p:t,p:life,n:0.65,n:1,n:0.35,p:globalAlpha; literals: "#140a06","lighter" |
| `r4` | `P4` | function | alpha-exact function body match (306 char canon; locals renumbered only); literals: none |
| `R4` | `s3` | function | alpha-exact function body match (241 char canon; locals renumbered only); literals: none |
| `r5` | `e5` | function | clone fingerprint: OLD-token coverage 0.65 / dice 0.646 (runner-up 0.49); shared invariant tokens: p:length,n:1,p:min,p:floor,n:0; literals: none |
| `r6` | `xS` | function | alpha-exact function body match (608 char canon; locals renumbered only); literals: "P","S" |
| `R6` | `US` | function | alpha-exact function body match (1407 char canon; locals renumbered only); literals: none |
| `r8` | `w6` | function | alpha-exact function body match (572 char canon; locals renumbered only); literals: none |
| `R8` | `K8` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.73); shared invariant tokens: p:filter,p:anySlot,p:slots,p:includes,p:slot,p:free,p:some,p:mods; literals: none |
| `Ra` | `Ea` | array | alpha-exact array body match (543 char canon; locals renumbered only); literals: "fury","狂怒神龛","伤害 +50%" |
| `rb` | `ey` | function | clone fingerprint: OLD-token coverage 0.95 / dice 0.955 (runner-up 0.38); shared invariant tokens: p:gid,null,p:join,p:map,p:skills,p:selMeta,p:selSlot,s: on; literals: " on","<div class=\"gslot" |
| `Rb` | `wy` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.973 (runner-up 0.72); shared invariant tokens: p:clone,p:pl,p:t,n:0,p:isClone,p:push,p:pend,k:t; literals: "#6a5a8a","#e8eef4" |
| `rc` | `pc` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.978 (runner-up 0.51); shared invariant tokens: p:Z,p:type,s:map,p:state,s:play,p:debug,p:menu,n:0; literals: "map","play" |
| `Rc` | `Pc` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.987 (runner-up 0.60); shared invariant tokens: p:includes,p:bombs,p:filter,p:r,n:1,n:1.3,p:push,p:fx; literals: "ring","#bfefff" |
| `rd` | `pd` | expression | ref-vote-r0: 3/3 aligned free references across matched functions point to pd; corroborated: 3/3 aligned references agree |
| `Rd` | `zd` | array | alpha-exact array body match (369 char canon; locals renumbered only); literals: none |
| `re` | `ie` | function | alpha-exact function body match (351 char canon; locals renumbered only); literals: none |
| `Re` | `Le` | function | alpha-exact function body match (921 char canon; locals renumbered only); literals: none |
| `rf` | `bf` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.987 (runner-up 0.63); shared invariant tokens: p:includes,p:gases,p:filter,p:r,n:1.35,p:avg,p:c,n:4; literals: "ring","#ffb040" |
| `Rf` | `Vf` | object | alpha-exact object body match (107 char canon; locals renumbered only); literals: none |
| `rg` | `F1` | function | clone fingerprint: OLD-token coverage 0.96 / dice 0.958 (runner-up 0.61); shared invariant tokens: p:ash,p:cur,n:0,s:余烬残片不足 (需要 ,p:ember,n:1,null; literals: "余烬残片不足 (需要 ",")" |
| `Rg` | `db` | function | alpha-exact function body match (333 char canon; locals renumbered only); literals: none |
| `rh` | `hh` | object | alpha-exact object body match (2857 char canon; locals renumbered only); literals: "...aa.....","..ab.c....",".ab..c...." |
| `rk` | `gk` | function | alpha-exact function body match (1800 char canon; locals renumbered only); literals: "projs","eprojs","parts" |
| `Rk` | `Dk` | object | alpha-exact object body match (2236 char canon; locals renumbered only); literals: none |
| `Rl` | `Jl` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.986 (runner-up 0.27); shared invariant tokens: s:#stage,s:#mctl,p:clientWidth,p:clientHeight,p:min,n:390,n:0.85,n:1.45; literals: "#stage","#mctl" |
| `rM` | `WM` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.48); shared invariant tokens: p:mode,p:v,p:last,null,s:pick,n:0.5,s:mode,p:seg; literals: "pick","mode" |
| `Rm` | `Q1` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.19); shared invariant tokens: p:createTexture,p:bindTexture,p:TEXTURE_2D,p:TEXTURE_WRAP_S,p:CLAMP_TO_EDGE,p:TEXTURE_WRAP_T,p:TEXTURE_MIN_FILTER,p:NEAREST; literals: none |
| `RM` | `dT` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.35); shared invariant tokens: s:pick,p:l,p:includes,p:loots,p:mTap,s:loot,p:act,s:tap; literals: "pick","loot" |
| `Rn` | `En` | object | ref-vote-r1: 3/3 aligned free references across matched functions point to En; corroborated: 3/3 aligned references agree |
| `ro` | `po` | function | ref-vote-r0: 12/12 aligned free references across matched functions point to po; corroborated: 12/12 aligned references agree |
| `Ro` | `Eo` | null | ref-vote-r0: 11/11 aligned free references across matched functions point to Eo; corroborated: 11/11 aligned references agree |
| `rp` | `Sp` | function | alpha-exact function body match (1064 char canon; locals renumbered only); literals: "map","soul","soul_" |
| `Rp` | `Gp` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.29); shared invariant tokens: p:join,p:map,p:cls,p:debug,s: on,s:读取该职业的调试角色 Lv ,p:level,s:新建该职业的调试角色; literals: " on","读取该职业的调试角色 Lv " |
| `rr` | `ir` | object | alpha-exact object body match (52 char canon; locals renumbered only); literals: none |
| `Rr` | `Lr` | object | alpha-exact object body match (71 char canon; locals renumbered only); literals: "前缀","后缀" |
| `rs` | `rs` | object | alpha-exact object body match (261 char canon; locals renumbered only); literals: "武器","头盔","胸甲" |
| `rS` | `a8` | array | alpha-exact array body match (250 char canon; locals renumbered only); literals: none |
| `Rs` | `As` | string | ref-vote-r0: 13/13 aligned free references across matched functions point to As; corroborated: 13/13 aligned references agree |
| `RS` | `T8` | object | alpha-exact object body match (268 char canon; locals renumbered only); literals: "perfect","unique","craft" |
| `rT` | `NT` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.987 (runner-up 0.59); shared invariant tokens: p:c,p:pl,p:min,n:1,p:chargeT,n:0.8,n:0.5,n:0.7; literals: "cone","#ffd080" |
| `Rt` | `Et` | object | alpha-exact object body match (237 char canon; locals renumbered only); literals: "弓","长矛","长棍" |
| `ru` | `up` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.987 (runner-up 0.55); shared invariant tokens: n:0,p:cos,p:sin,p:globalAlpha,n:0.4,p:strokeStyle,p:halo,p:lineWidth; literals: "round","#3a2a20" |
| `Ru` | `Bu` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.968 (runner-up 0.44); shared invariant tokens: p:kind,s:expspear,p:stuck,n:1,null,p:ret,s:shadow,s:wave; literals: "expspear","shadow" |
| `Rv` | `Dv` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.994 (runner-up 0.54); shared invariant tokens: p:size,p:buffs,p:S,p:x,p:y,p:has,s:ashHerald,n:0.12; literals: "ashHerald","#ff7a30" |
| `Rw` | `o4` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.984 (runner-up 0.38); shared invariant tokens: p:length,p:grenades,n:1,n:0,p:t,p:fuse,p:spin,n:18; literals: "clink","#5a5060" |
| `rx` | `Sx` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.969 (runner-up 0.49); shared invariant tokens: p:st,s:ground,p:z,n:0,p:t,p:vx,p:vy,p:x; literals: "ground","#8a8090" |
| `Rx` | `Y5` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.991 (runner-up 0.44); shared invariant tokens: p:pl,p:mons,null,p:manual,p:dead,p:hypot,p:x,p:y; literals: none |
| `ry` | `Yy` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.994 (runner-up 0.33); shared invariant tokens: p:dead,n:0,p:s,p:X,p:unit,n:0.9,n:1.1,p:weight; literals: "mid","heavy" |
| `Ry` | `y2` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.977 (runner-up 0.47); shared invariant tokens: n:1,n:6,p:length,p:sparks,p:min,n:2,n:0,n:0.75; literals: none |
| `s$` | `jT` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.998 (runner-up 0.18); shared invariant tokens: p:addEventListener,s:#panel,s:click,p:held,p:closest,p:target,s:[data-act="cur"],s:[data-craft]; literals: "#panel","click" |
| `S$` | `N$` | function | alpha-exact function body match (731 char canon; locals renumbered only); literals: "top","到达深渊之底 · ","timeout" |
| `s0` | `S0` | function | alpha-exact function body match (1731 char canon; locals renumbered only); literals: "spark","tornado","twister" |
| `S0` | `df` | object | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.12); shared invariant tokens: k:early,s:开荒,s:什么都显示 · T1–T5,k:mid,s:中期,s:隐藏白装、低阶地图、重复宝石 · T6–T12,k:hideN,n:0; literals: "开荒","什么都显示 · T1–T5" |
| `s2` | `kg` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.987 (runner-up 0.49); shared invariant tokens: p:kind,s:shuangqi,n:1,n:12,p:sqrt,p:aoe,p:c,p:lineCap; literals: "shuangqi","round" |
| `S2` | `I2` | function | alpha-exact function body match (349 char canon; locals renumbered only); literals: none |
| `S3` | `F3` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.993 (runner-up 0.58); shared invariant tokens: p:hidden,p:mode,n:2,p:spr,p:face,n:0,p:flip,p:img; literals: "rgba(0,0,0,0.42)","#6a70ff" |
| `s4` | `L4` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.985 (runner-up 0.49); shared invariant tokens: p:length,p:list,n:1,p:s,p:soul,p:sig,p:B,s:roarRage; literals: "roarRage","idle" |
| `S4` | `J4` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.985 (runner-up 0.50); shared invariant tokens: p:now,p:day,p:id,p:salt,p:slice,p:toString,p:random,n:36; literals: none |
| `S5` | `b5` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.978 (runner-up 0.60); shared invariant tokens: p:t,null,p:filter,p:lv,n:0,p:ilvl,p:slots,p:includes; literals: "P","S" |
| `s6` | `yS` | object | alpha-exact object body match (158 char canon; locals renumbered only); literals: none |
| `S6` | `DS` | function | alpha-exact function body match (511 char canon; locals renumbered only); literals: "1" |
| `Sa` | `wa` | object | alpha-exact object body match (80 char canon; locals renumbered only); literals: "gem","exalt" |
| `sb` | `Jb` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.998 (runner-up 0.27); shared invariant tokens: s:#hrow,p:S,p:join,p:map,p:flask,n:1,s:#2b4fbf,s:#a81d2c; literals: "#hrow","#2b4fbf" |
| `Sb` | `by` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.987 (runner-up 0.53); shared invariant tokens: p:pl,p:ang,n:1,p:x,p:cos,n:14,n:18,p:y; literals: "ring","#d8c8b0" |
| `sc` | `fc` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.996 (runner-up 0.30); shared invariant tokens: p:split,s:it,p:it,p:loc,null,s:cur,s:kit,k:b; literals: ":","it" |
| `Sc` | `Cc` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.964 (runner-up 0.28); shared invariant tokens: s:#twhud,s:#stage,p:Z,p:tower,p:hidden,n:0,p:remove,p:classList; literals: "#twhud","#stage" |
| `Sd` | `pp` | expression | ref-vote-r0: 3/3 aligned free references across matched functions point to pp; corroborated: 3/3 aligned references agree |
| `se` | `se` | function | alpha-exact function body match (220 char canon; locals renumbered only); literals: none |
| `Se` | `Se` | object | alpha-exact object body match (3030 char canon; locals renumbered only); literals: "焚拳猿王","ape","boss" |
| `sf` | `cf` | function | alpha-exact function body match (3872 char canon; locals renumbered only); literals: "内容为空","存档码不完整: 只收到 ","ERS1:" |
| `Sf` | `Ef` | function | ref-vote-r0: 3/3 aligned free references across matched functions point to Ef; corroborated: 3/3 aligned references agree |
| `Sg` | `rb` | function | ref-vote-r0: 3/3 aligned free references across matched functions point to rb; corroborated: 3/3 aligned references agree |
| `sh` | `dh` | array | alpha-exact array body match (74 char canon; locals renumbered only); literals: "屠夫","行者","魔像" |
| `si` | `ni` | function | alpha-exact function body match (557 char canon; locals renumbered only); literals: none |
| `Si` | `Ri` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.989 (runner-up 0.38); shared invariant tokens: p:out,n:1,s:impl,p:cimpl,p:k,p:v,s:reroll,p:rarity; literals: "impl","reroll" |
| `sk` | `uk` | function | alpha-exact function body match (354 char canon; locals renumbered only); literals: none |
| `Sk` | `Ik` | function | alpha-exact function body match (814 char canon; locals renumbered only); literals: "canvas","2d" |
| `sl` | `il` | function | alpha-exact function body match (298 char canon; locals renumbered only); literals: none |
| `Sl` | `Zl` | function | alpha-exact function body match (296 char canon; locals renumbered only); literals: none |
| `sM` | `DM` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.51); shared invariant tokens: p:pick,p:includes,s:unlock,s:解除,s:锁定,s: no,p:divine,s:免费; literals: "unlock","解除" |
| `sn` | `en` | number | ref-vote-r0: 5/5 aligned free references across matched functions point to en; corroborated: 5/5 aligned references agree |
| `Sn` | `Mn` | expression | ref-vote-r0: 8/8 aligned free references across matched functions point to Mn; corroborated: 8/8 aligned references agree |
| `so` | `ro` | function | ref-vote-r0: 8/8 aligned free references across matched functions point to ro; corroborated: 8/8 aligned references agree |
| `So` | `Mo` | object | ref-vote-r0: 6/6 aligned free references across matched functions point to Mo; corroborated: 7/7 aligned references agree |
| `sp` | `cp` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.985 (runner-up 0.18); shared invariant tokens: p:last,p:r0,p:r1,p:push,t:<div class="bd rar">,t: → <b style="color:,t:">,t:</b></div>; literals: "<p class=\"dim bhint\">此处显示上次通货操作造成的变化</p>","<div class=\"bd rar\">" |
| `Sp` | `a0` | function | alpha-exact function body match (1635 char canon; locals renumbered only); literals: "hide","landscape" |
| `sr` | `er` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.992 (runner-up 0.42); shared invariant tokens: p:dead,p:prop,p:t,n:0,p:hp,s:prop:death,k:m,p:rar; literals: "prop:death","light" |
| `ss` | `as` | function | alpha-exact function body match (1938 char canon; locals renumbered only); literals: "fireball","wave","javelin" |
| `Ss` | `Js` | function | ref-vote-r0: 10/10 aligned free references across matched functions point to Js; corroborated: 10/10 aligned references agree |
| `st` | `ot` | expression | ref-vote-r0: 9/9 aligned free references across matched functions point to ot; corroborated: 10/10 aligned references agree |
| `sT` | `qT` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.992 (runner-up 0.59); shared invariant tokens: p:c,p:pl,p:ang,p:r,n:110,n:0,p:mons,p:dead; literals: "cone","sky" |
| `St` | `St` | function | clone fingerprint: OLD-token coverage 0.93 / dice 0.933 (runner-up 0.67); shared invariant tokens: p:meta,p:push,p:mods,n:0,n:1; literals: "P","S" |
| `ST` | `r$` | function | alpha-exact function body match (4358 char canon; locals renumbered only); literals: "canvas","2d","#0d0b10" |
| `su` | `su` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.989 (runner-up 0.44); shared invariant tokens: p:length,p:parts,n:1,n:0,p:life,p:splice,p:vz,p:g; literals: "#3a3028","#5a4a3a" |
| `Su` | `Ru` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.990 (runner-up 0.37); shared invariant tokens: p:find,p:n,k:left,p:t,k:n,p:cap,k:slot,s:title; literals: "title" |
| `sv` | `uv` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.62); shared invariant tokens: p:save,p:translate,p:round,p:x,p:y,p:scale,n:1.25,p:restore; literals: none |
| `Sv` | `Iv` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.986 (runner-up 0.48); shared invariant tokens: p:walled,p:length,p:walls,p:x,p:y,p:x1,p:y1,p:x2; literals: "fireball","#ff6a1a" |
| `sw` | `Lw` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.995 (runner-up 0.54); shared invariant tokens: p:key,p:act,p:innerHTML,t:<button class="mtx" data-mt="x">,t:</button>,p:h,p:length,p:join; literals: "<button class=\"mtx\" data-mt=\"x\">","</button>" |
| `Sw` | `Yw` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.989 (runner-up 0.19); shared invariant tokens: p:codex,p:id,n:0,p:base,p:col,p:src,p:icon,p:n; literals: "<p class=\"sp\">","</p>" |
| `sx` | `ux` | function | alpha-exact function body match (304 char canon; locals renumbered only); literals: none |
| `Sx` | `U5` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.64); shared invariant tokens: p:id,p:pointerId,p:t,p:fired,p:e,p:timeStamp,n:380,null; literals: "pointerup" |
| `sy` | `Hb` | function | clone fingerprint: OLD-token coverage 0.93 / dice 0.929 (runner-up 0.66); shared invariant tokens: p:length,p:filter,p:inv,p:kind,s:map,s:背包已满,n:1,p:push; literals: "map","背包已满" |
| `t$` | `ET` | function | clone fingerprint: OLD-token coverage 0.94 / dice 0.943 (runner-up 0.51); shared invariant tokens: p:globalAlpha,n:0.22,n:0,n:3,n:0.6,n:1,n:12,n:9; literals: "#f4f0ea" |
| `T$` | `U$` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.988 (runner-up 0.64); shared invariant tokens: p:round,p:x,p:y,p:T,p:min,n:1,p:t,n:0.6; literals: "lighter","rgba(192,80,255," |
| `t0` | `x0` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.991 (runner-up 0.66); shared invariant tokens: p:kind,s:xbow,p:reload,p:gid,p:c,s:grenade,s:orbstorm,s:conduit; literals: "xbow","grenade" |
| `T1` | `s1` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.985 (runner-up 0.59); shared invariant tokens: n:14,s:#ffd27a,s:#ff9a40,s:#fff0c0,n:44,n:0.6,k:glow,n:0; literals: "#ffd27a","#ff9a40" |
| `t2` | `yg` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.991 (runner-up 0.57); shared invariant tokens: p:jk,p:frosts,p:x,p:y,n:20,p:t,p:max,n:0.08; literals: "#cfefff","#9fe0ff" |
| `t3` | `u3` | object | alpha-exact object body match (107 char canon; locals renumbered only); literals: none |
| `T3` | `q3` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.973 (runner-up 0.62); shared invariant tokens: p:kind,s:skel,p:face,n:0,p:moving,p:abs,p:sin,p:T; literals: "skel","rgba(0,0,0,0.4)" |
| `T5` | `v5` | array | clone fingerprint: OLD-token coverage 0.84 / dice 0.806 (runner-up 0.39); shared invariant tokens: s:up,n:0.3,s:none,s:down,s:ruin; literals: "up","none" |
| `t6` | `gS` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.984 (runner-up 0.60); shared invariant tokens: p:findIndex,p:skills,p:gid,s:parry,n:0,p:SKC,k:c,k:i; literals: "parry" |
| `T6` | `GS` | function | alpha-exact function body match (1031 char canon; locals renumbered only); literals: "zh","en","u" |
| `t8` | `b6` | function | alpha-exact function body match (13281 char canon; locals renumbered only); literals: none |
| `T8` | `z8` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.978 (runner-up 0.74); shared invariant tokens: p:Z,p:M,p:activeTexture,p:TEXTURE1,p:bindTexture,p:TEXTURE_2D,p:texImage2D,n:0; literals: none |
| `ta` | `aa` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.992 (runner-up 0.60); shared invariant tokens: n:0,k:it,k:loc,s:stash,null,p:inv,p:uid,s:inv; literals: "stash","inv" |
| `Tc` | `Eu` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.42); shared invariant tokens: p:join,p:map,p:id,p:v,p:k,p:uid,p:mods,p:impl; literals: "/","," |
| `td` | `id` | expression | ref-vote-r0: 4/4 aligned free references across matched functions point to id; corroborated: 4/4 aligned references agree |
| `Td` | `bp` | object | alpha-exact object body match (848 char canon; locals renumbered only); literals: none |
| `te` | `te` | object | alpha-exact object body match (6168 char canon; locals renumbered only); literals: "女巫","staff","#b07ae8" |
| `Te` | `Ae` | object | alpha-exact object body match (162 char canon; locals renumbered only); literals: none |
| `tf` | `rf` | function | alpha-exact function body match (807 char canon; locals renumbered only); literals: none |
| `Tf` | `jf` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.996 (runner-up 0.52); shared invariant tokens: s:vaal,p:last,p:k,s:腐化 · ,p:title,p:sub,p:cls,s:none; literals: "vaal","腐化 · " |
| `tg` | `I1` | function | alpha-exact function body match (249 char canon; locals renumbered only); literals: "#share" |
| `Tg` | `lb` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.979 (runner-up 0.33); shared invariant tokens: p:mv,p:bench,p:stash,p:shop,p:backOv,p:querySelector,s:#overlay .ovbox,p:contains; literals: "#overlay .ovbox","mstash" |
| `Th` | `Ih` | object | alpha-exact object body match (189 char canon; locals renumbered only); literals: "crypt","lava","ice" |
| `ti` | `oi` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.68); shared invariant tokens: p:filter,p:r,p:x,n:2,p:y,n:0.78,p:atan2; literals: none |
| `Ti` | `Oi` | function | ref-vote-r0: 3/3 aligned free references across matched functions point to Oi; corroborated: 3/3 aligned references agree |
| `Tk` | `zk` | array | alpha-exact array body match (252 char canon; locals renumbered only); literals: "...ai..ia...","...jj..jj...","..ai....ia.." |
| `tl` | `nl` | number | ref-vote-r0: 6/6 aligned free references across matched functions point to nl; corroborated: 6/6 aligned references agree |
| `Tl` | `Hl` | expression | ref-vote-r0: 5/5 aligned free references across matched functions point to Hl; corroborated: 5/5 aligned references agree |
| `tm` | `cm` | function | alpha-exact function body match (6983 char canon; locals renumbered only); literals: none |
| `tM` | `BM` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.995 (runner-up 0.52); shared invariant tokens: p:closest,p:target,s:[data-m],s:#pbody .mv,p:preventDefault,p:stopPropagation,p:contains,p:classList; literals: "[data-m]","#pbody .mv" |
| `Tm` | `Dm` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.983 (runner-up 0.52); shared invariant tokens: p:el,p:avg,s:fire,k:fixed,k:el,null,n:1,k:weight; literals: "fire","light" |
| `TM` | `iT` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.984 (runner-up 0.56); shared invariant tokens: p:key,null,p:querySelectorAll,t:[data-tt=",t:"],p:act,n:0; literals: "[data-tt=\"","\"]" |
| `tn` | `ln` | function | alpha-exact function body match (86 char canon; locals renumbered only); literals: none |
| `to` | `co` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.972 (runner-up 0.58); shared invariant tokens: p:state,s:play,p:pl,p:dead,p:act,p:roll,n:0,p:stagT; literals: "play" |
| `To` | `$o` | array | alpha-exact array body match (118 char canon; locals renumbered only); literals: "ranger","huntress","monk" |
| `tp` | `ip` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.979 (runner-up 0.50); shared invariant tokens: s:forge,s:nomana,n:0.5,n:1,s:exalt,n:0.7,n:0,s:string; literals: "forge","nomana" |
| `Tp` | `Bp` | function | ref-vote-r0: 3/3 aligned free references across matched functions point to Bp; corroborated: 3/3 aligned references agree |
| `tr` | `Nn` | function | alpha-exact function body match (293 char canon; locals renumbered only); literals: "hit:res" |
| `Tr` | `Ar` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.983 (runner-up 0.64); shared invariant tokens: n:1,s:title,p:includes,p:titles,p:title,s:pet,s:mount,p:free; literals: "title","pet" |
| `tS` | `J6` | object | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.20); shared invariant tokens: k:o,p:out,k:r,p:body,k:m,p:mid,k:h,p:hi; literals: "#3a0606" |
| `Ts` | `zs` | object | alpha-exact object body match (228 char canon; locals renumbered only); literals: "random" |
| `tt` | `Ye` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.975 (runner-up 0.41); shared invariant tokens: p:state,s:title,n:1,p:cur,null,p:cid,p:svt,p:now; literals: "title","wallet:save" |
| `tT` | `FT` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.978 (runner-up 0.54); shared invariant tokens: p:c,p:aim,n:130,n:1,p:orbCapAdd,p:S,n:0,p:orbs; literals: "ring","#b8c4ff" |
| `Tt` | `$t` | function | ref-vote-r0: 25/25 aligned free references across matched functions point to $t; corroborated: 25/25 aligned references agree |
| `TT` | `E8` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.998 (runner-up 0.39); shared invariant tokens: s:stats:pre,k:asc,k:add,p:has,s:precision,s:critInc,n:50,s:critMulti; literals: "stats:pre","precision" |
| `tu` | `au` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.42); shared invariant tokens: p:getBoundingClientRect,n:16,p:width,n:8,n:12,p:height,p:max,p:left; literals: "px" |
| `Tu` | `Iu` | function | clone fingerprint: OLD-token coverage 0.91 / dice 0.911 (runner-up 0.27); shared invariant tokens: p:debug,p:cap,p:best,p:includes,p:length,n:1,p:t150,n:0; literals: "第 "," 层" |
| `tv` | `dv` | function | alpha-exact function body match (292 char canon; locals renumbered only); literals: none |
| `tw` | `Rw` | function | alpha-exact function body match (655 char canon; locals renumbered only); literals: "(display-mode: standalone)","(display-mode: fullscreen)" |
| `Tw` | `e4` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.992 (runner-up 0.35); shared invariant tokens: p:createElement,s:canvas,p:width,p:W,p:height,p:H,p:getContext,s:2d; literals: "canvas","2d" |
| `ty` | `Vy` | function | alpha-exact function body match (1053 char canon; locals renumbered only); literals: "packBond","apeHeart","boss" |
| `Ty` | `h2` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.985 (runner-up 0.46); shared invariant tokens: p:T,p:round,p:x,p:y,p:happyT,p:fillStyle,s:rgba(0,0,0,0.38),p:beginPath; literals: "rgba(0,0,0,0.38)","#1b1416" |
| `U` | `U` | function | alpha-exact function body match (2100 char canon; locals renumbered only); literals: "#ece6da","#ff9a48","#94dcff" |
| `u$` | `I$` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.991 (runner-up 0.46); shared invariant tokens: p:best,n:0,p:t150,p:slot,p:id,s:wings,p:t,s:第 ; literals: "wings","第 " |
| `U$` | `dA` | object | alpha-exact object body match (112 char canon; locals renumbered only); literals: none |
| `u0` | `c0` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.978 (runner-up 0.77); shared invariant tokens: p:innerHTML,p:h,p:setProperty,p:style,s:--tb,p:b,p:hidden,n:1; literals: "--tb" |
| `u1` | `kp` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.996 (runner-up 0.57); shared invariant tokens: p:kind,s:cur,p:cur,p:it,s:ground,s:item,k:h,p:replace; literals: "cur","ground" |
| `u2` | `Nm` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.965 (runner-up 0.38); shared invariant tokens: n:1,s:最高换到 T,s: (击败更高阶首领后解锁),p:sort,p:rarity,p:length,s:需要 ,s: 张 T; literals: "最高换到 T"," (击败更高阶首领后解锁)" |
| `U2` | `av` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.998 (runner-up 0.40); shared invariant tokens: p:createElement,s:canvas,p:width,n:600,n:2,p:height,n:836,p:getContext; literals: "canvas","2d" |
| `u3` | `C3` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.50); shared invariant tokens: p:tower,p:busy,p:sig,p:mod,s:portal,p:objs,p:filter,p:next; literals: "portal" |
| `U3` | `rS` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.992 (runner-up 0.67); shared invariant tokens: n:170,p:x,p:y,p:push,p:fx,k:k,s:tele,k:x; literals: "tele","#ff8a3a" |
| `U4` | `L5` | function | alpha-exact function body match (2166 char canon; locals renumbered only); literals: none |
| `u5` | `i5` | object | alpha-exact object body match (3276 char canon; locals renumbered only); literals: "255,170,60","rgba(70,40,12,0.95)","rgba(20,10,6,0.95)" |
| `U5` | `kw` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.987 (runner-up 0.51); shared invariant tokens: s:先选一件装备,s:unlock,p:meta,null,s:没有锁定,s:lockP,p:entries,p:cur; literals: "先选一件装备","unlock" |
| `U6` | `i6` | function | alpha-exact function body match (3040 char canon; locals renumbered only); literals: none |
| `u8` | `P6` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.987 (runner-up 0.37); shared invariant tokens: p:c,p:pl,p:max,n:1,p:proj,n:3,p:swordAdd,n:210; literals: "orbit","fly" |
| `U8` | `dM` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.987 (runner-up 0.26); shared invariant tokens: p:getElementById,s:msk0,p:pl,p:skills,n:0,p:b,p:x,p:y; literals: "msk0","--kx" |
| `Ua` | `Za` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.988 (runner-up 0.42); shared invariant tokens: p:held,s:#held,p:innerHTML,p:n,p:cur,t:<img src=",t:" alt=""><span>,t: × ; literals: "#held","<img src=\"" |
| `ub` | `iy` | function | clone fingerprint: OLD-token coverage 0.94 / dice 0.939 (runner-up 0.57); shared invariant tokens: p:M,p:Z,p:W,p:H,p:flow,p:q,p:fill,n:1; literals: none |
| `Ub` | `Dy` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.994 (runner-up 0.41); shared invariant tokens: p:guard,p:stunImm,p:T,n:0,p:min,n:1,p:stun,k:light; literals: "chase","gold" |
| `uc` | `hc` | function | ref-vote-r0: 4/4 aligned free references across matched functions point to hc; corroborated: 4/4 aligned references agree |
| `Uc` | `Qc` | array | alpha-exact array body match (240 char canon; locals renumbered only); literals: none |
| `ud` | `vd` | function | alpha-exact function body match (299 char canon; locals renumbered only); literals: none |
| `Ud` | `Jd` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.32); shared invariant tokens: p:join,p:filter,p:title,s:称号「,p:n,p:cos,p:back,s:背饰「; literals: "称号「","」" |
| `ue` | `he` | expression | ref-vote-r0: 36/36 aligned free references across matched functions point to he; corroborated: 36/36 aligned references agree |
| `Ue` | `Ue` | function | alpha-exact function body match (365 char canon; locals renumbered only); literals: "#overlay" |
| `uf` | `Zf` | function | alpha-exact function body match (322 char canon; locals renumbered only); literals: "play" |
| `Uf` | `r0` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.991 (runner-up 0.40); shared invariant tokens: n:0,p:includes,p:tree,p:filter,s:craft,s:需先退还外侧节点,p:length,s:天赋点不足 · 需要 ; literals: "craft","需先退还外侧节点" |
| `Ug` | `Rb` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.993 (runner-up 0.46); shared invariant tokens: p:map,p:err,k:code,k:bad,p:G,p:data,k:name,p:name; literals: none |
| `Uh` | `Xh` | object | alpha-exact object body match (1795 char canon; locals renumbered only); literals: "奥术弹幕","projAdd","spellInc" |
| `ui` | `gi` | array | alpha-exact array body match (10021 char canon; locals renumbered only); literals: "奥术","#b07ae8","spellInc" |
| `Ui` | `Ji` | object | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.63); shared invariant tokens: k:w,n:70,n:4,n:1,k:cast,n:0.9,k:start,p:push; literals: "tele","#ff5030" |
| `Uk` | `tx` | function | alpha-exact function body match (29224 char canon; locals renumbered only); literals: "small","start"," 起点" |
| `ul` | `gl` | function | alpha-exact function body match (97 char canon; locals renumbered only); literals: "QSXK" |
| `Ul` | `Fl` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.997 (runner-up 0.32); shared invariant tokens: p:filter,p:mods,p:t,p:last,p:d,p:map,p:k,s:add; literals: "add","ch" |
| `um` | `xm` | function | alpha-exact function body match (448 char canon; locals renumbered only); literals: none |
| `uM` | `VM` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.995 (runner-up 0.45); shared invariant tokens: p:exTo,p:join,p:map,s:on,p:col,p:n,p:cur,n:0; literals: "on","<button class=\"" |
| `Um` | `Ig` | array | clone fingerprint: OLD-token coverage 0.98 / dice 0.975 (runner-up 0.58); shared invariant tokens: k:n,s:割草场,k:d,s:低阶满屏小怪, 测清屏手感,k:theme,s:crypt,k:tier,n:5; literals: "割草场","低阶满屏小怪, 测清屏手感" |
| `UM` | `H8` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.976 (runner-up 0.41); shared invariant tokens: p:souls,p:beasts,p:push,p:inv,p:bsup,p:gems,null,p:forEach; literals: "@" |
| `un` | `so` | function | ref-vote-r0: 5/5 aligned free references across matched functions point to so; corroborated: 5/5 aligned references agree |
| `Un` | `Jn` | function | alpha-exact function body match (745 char canon; locals renumbered only); literals: "on","<small>","</small>" |
| `uo` | `mo` | null | ref-vote-r0: 10/10 aligned free references across matched functions point to mo; corroborated: 12/12 aligned references agree |
| `Uo` | `Ko` | function | alpha-exact function body match (610 char canon; locals renumbered only); literals: none |
| `up` | `Ep` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.27); shared invariant tokens: s: no,p:sel,s: msel,t:<small>,t:</small>,s:<span class="pc">免费</span>,t:<button class="mware,t:" data-m="sel" data-k="; literals: " no"," msel" |
| `Up` | `uu` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.986 (runner-up 0.43); shared invariant tokens: p:pdCd,p:pl,n:0,n:0.6,s:player:perfectDodge,k:slow,n:0.42,k:desat; literals: "player:perfectDodge","perfect" |
| `ur` | `hr` | object | ref-vote-r0: 3/3 aligned free references across matched functions point to hr; corroborated: 3/3 aligned references agree |
| `Ur` | `Kr` | function | clone fingerprint: OLD-token coverage 0.95 / dice 0.952 (runner-up 0.69); shared invariant tokens: p:x,p:pl,p:y,p:hypot,n:1,n:40,p:type,p:Z; literals: "map" |
| `us` | `gs` | function | clone fingerprint: OLD-token coverage 0.92 / dice 0.887 (runner-up 0.21); shared invariant tokens: p:state,s:play,s:dead,p:menu,n:0,p:cur,null,p:cls; literals: "play","dead" |
| `uS` | `c8` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.979 (runner-up 0.55); shared invariant tokens: p:globalCompositeOperation,s:lighter,p:globalAlpha,p:max,n:0,p:life,n:0.36,n:0.38; literals: "lighter","source-over" |
| `US` | `AM` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.62); shared invariant tokens: p:cls,p:map,p:filter,p:skills,p:gid,p:gems,p:kind,s:gem; literals: "gem","\">调试: 一键套用</button>" |
| `ut` | `ut` | function | alpha-exact function body match (438 char canon; locals renumbered only); literals: none |
| `uT` | `QT` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.54); shared invariant tokens: p:feed,p:M,p:s,p:pl,p:hp,p:min,p:maxLife,p:S; literals: "shieldBond" |
| `Ut` | `Ht` | object | alpha-exact object body match (357 char canon; locals renumbered only); literals: "#1e0404","#a8161a","#cf2a22" |
| `Uv` | `tk` | number | ref-vote-r0: 3/3 aligned free references across matched functions point to tk; corroborated: 3/3 aligned references agree |
| `Uw` | `v4` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.993 (runner-up 0.44); shared invariant tokens: p:x,p:pl,p:y,p:hypot,p:mods,p:ms,p:Z,p:atk; literals: "ranged","slash" |
| `ux` | `O5` | function | alpha-exact function body match (1517 char canon; locals renumbered only); literals: "<span class=\"neg\">未知词缀 ","</span>","{" |
| `Ux` | `Dx` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.965 (runner-up 0.46); shared invariant tokens: p:t,p:map,p:max,n:0,n:1,p:min,p:x,p:y; literals: none |
| `uy` | `K1` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.988 (runner-up 0.32); shared invariant tokens: p:asc,s:还没有选择升华,s:这个职业只有一种升华,p:find,p:ok,s:还不能更换: ,p:t,p:n; literals: "还没有选择升华","这个职业只有一种升华" |
| `V` | `Q` | object | alpha-exact object body match (435 char canon; locals renumbered only); literals: none |
| `v$` | `D$` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.988 (runner-up 0.45); shared invariant tokens: p:guard,p:plan,p:gx,p:gy,p:guardLvl,n:3,p:awake,n:1; literals: "守层者 · ","guard" |
| `V$` | `mA` | function | alpha-exact function body match (20220 char canon; locals renumbered only); literals: "canvas","2d","#0d0b10" |
| `v0` | `m0` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.990 (runner-up 0.29); shared invariant tokens: p:open,n:0,s:craft,s:boom,n:0.6,n:0.2,p:x,p:y; literals: "craft","boom" |
| `V0` | `td` | null | ref-vote-r0: 4/4 aligned free references across matched functions point to td; corroborated: 4/4 aligned references agree |
| `v1` | `Jm` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.980 (runner-up 0.38); shared invariant tokens: null,p:pl,p:r,p:k,n:0,p:face,n:1,p:moving; literals: "rgba(0,0,0,0.42)","#1e161a" |
| `V1` | `A1` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.984 (runner-up 0.52); shared invariant tokens: p:pl,p:dead,s:aura,s:ripple,p:T,s:ember,p:save,p:globalCompositeOperation; literals: "aura","ripple" |
| `v2` | `R2` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.86); shared invariant tokens: p:uid,p:next,p:sup,p:forEach,p:inner; literals: none |
| `v3` | `P3` | function | clone fingerprint: OLD-token coverage 0.84 / dice 0.839 (runner-up 0.24); shared invariant tokens: p:tower,p:best,n:0,p:name,t:<span translate="no">,t:</span>,p:cls,p:n; literals: "<span translate=\"no\">","</span>" |
| `V3` | `fS` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.983 (runner-up 0.67); shared invariant tokens: p:c,p:push,p:fx,k:k,s:flash,k:x,p:x,k:y; literals: "flash","#a8b4ff" |
| `V4` | `Vw` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.990 (runner-up 0.26); shared invariant tokens: p:__testSeed,null,p:webdriver,p:__splash,p:createElement,s:div,p:id,s:splash; literals: "u","div" |
| `V5` | `Mw` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.996 (runner-up 0.19); shared invariant tokens: null,p:split,s:gem,k:kind,k:gid,k:lvl,n:1,k:sock; literals: ":","gem" |
| `v8` | `q6` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.984 (runner-up 0.32); shared invariant tokens: p:pl,p:random,n:6.283,p:push,p:devils,k:x,p:x,p:cos; literals: "whiff" |
| `va` | `ka` | object | alpha-exact object body match (127 char canon; locals renumbered only); literals: "quiver","shield","focus" |
| `vb` | `uy` | function | alpha-exact function body match (501 char canon; locals renumbered only); literals: none |
| `Vb` | `Ny` | function | alpha-exact function body match (1200 char canon; locals renumbered only); literals: "var(--up)","var(--down)","\">" |
| `Vc` | `ef` | function | alpha-exact function body match (420 char canon; locals renumbered only); literals: none |
| `vd` | `Td` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.976 (runner-up 0.14); shared invariant tokens: p:S,p:cyc,k:absorb,p:juandi,n:2,n:1,k:elLife,n:10; literals: none |
| `Vd` | `tp` | function | alpha-exact function body match (285 char canon; locals renumbered only); literals: "map","soul" |
| `ve` | `ve` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.976 (runner-up 0.34); shared invariant tokens: n:6.283,n:14,n:44,k:x,k:y,k:z,n:4,k:vz; literals: none |
| `Ve` | `Ve` | function | alpha-exact function body match (582 char canon; locals renumbered only); literals: ":","0" |
| `vf` | `$f` | number | ref-vote-r0: 5/5 aligned free references across matched functions point to $f; corroborated: 5/5 aligned references agree |
| `Vf` | `Df` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.988 (runner-up 0.50); shared invariant tokens: p:level,p:max,n:50,p:xp,n:0,p:find,p:gems,p:kind; literals: "gem","meta" |
| `Vg` | `Mg` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.992 (runner-up 0.36); shared invariant tokens: k:uid,k:kind,s:item,k:base,p:n,k:slot,p:slot,k:ilvl; literals: "item","phys" |
| `vh` | `Ah` | function | alpha-exact function body match (2793 char canon; locals renumbered only); literals: "lowpass" |
| `Vh` | `sm` | object | alpha-exact object body match (743 char canon; locals renumbered only); literals: "n3","small","坚壁" |
| `Vi` | `tl` | object | clone fingerprint: OLD-token coverage 0.92 / dice 0.918 (runner-up 0.47); shared invariant tokens: k:mods,k:monLife,n:120,k:monDmg,n:60,k:monSpd,n:20,k:rarePacks; literals: none |
| `vk` | `Rk` | function | alpha-exact function body match (705 char canon; locals renumbered only); literals: "u","cv","brightness(" |
| `vl` | `ki` | function | alpha-exact function body match (141 char canon; locals renumbered only); literals: "cyclone" |
| `Vl` | `tc` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.72); shared invariant tokens: p:selMeta,p:buffs,p:i,p:kind,s:meta,p:inner,p:j,null; literals: "meta" |
| `vm` | `Im` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.985 (runner-up 0.35); shared invariant tokens: p:kind,p:pl,s:flicker,p:speed,p:d,p:dur,p:max,n:0.14; literals: "flicker","arc" |
| `Vm` | `Bg` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.966 (runner-up 0.41); shared invariant tokens: p:fg,p:dataset,s:mwTier,p:tier,p:value,n:0,s:mwRare,p:rare; literals: "mwTier","mwRare" |
| `VM` | `MT` | object | alpha-exact object body match (426 char canon; locals renumbered only); literals: "已经是同一份进度","两边一样, 不需要同步。","这份存档更新" |
| `Vn` | `Bn` | function | ref-vote-r0: 3/3 aligned free references across matched functions point to Bn; corroborated: 4/4 aligned references agree |
| `vo` | `lo` | function | ref-vote-r0: 12/12 aligned free references across matched functions point to lo; corroborated: 12/12 aligned references agree |
| `Vo` | `Xo` | function | clone fingerprint: OLD-token coverage 0.96 / dice 0.956 (runner-up 0.37); shared invariant tokens: p:nmT,p:pl,n:0,n:0.8,s:nomana,p:x,p:y,n:22; literals: "nomana","info" |
| `Vp` | `bu` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.23); shared invariant tokens: s:<span>对伙伴无效</span>,p:map,p:fill,s:<b class="cfill">,p:replace,p:text,s:{0},s:</b>; literals: "<span>对伙伴无效</span>","<b class=\"cfill\">" |
| `vr` | `Pr` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.988 (runner-up 0.50); shared invariant tokens: p:theme,p:dbg,null,s:monLife,s:magicPacks,s:rarePacks,p:mods,n:0; literals: "monLife","magicPacks" |
| `Vr` | `Yr` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.988 (runner-up 0.50); shared invariant tokens: p:push,p:fx,k:k,s:tele,k:x,k:y,k:r,k:t; literals: "tele","#ff5030" |
| `vs` | `ks` | function | ref-vote-r0: 14/14 aligned free references across matched functions point to ks; corroborated: 14/14 aligned references agree |
| `Vs` | `Vs` | function | alpha-exact function body match (225 char canon; locals renumbered only); literals: " {v}","{v}" |
| `VS` | `LM` | function | clone fingerprint: OLD-token coverage 0.83 / dice 0.828 (runner-up 0.19); shared invariant tokens: p:tree,p:seg,s:tree,p:asc,p:ascPts,p:length,p:ascNodes,n:2; literals: "tree","天赋树" |
| `vt` | `vt` | object | alpha-exact object body match (338 char canon; locals renumbered only); literals: "1128064138","531013885" |
| `vT` | `a$` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.996 (runner-up 0.27); shared invariant tokens: p:s,p:soul,p:speed,p:rageT,n:0,n:1.4,n:1,p:possess; literals: "frenzy","roarRage" |
| `Vt` | `Qt` | function | ref-vote-r0: 22/22 aligned free references across matched functions point to Qt; corroborated: 22/22 aligned references agree |
| `VT` | `F8` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.982 (runner-up 0.49); shared invariant tokens: p:jsh,n:0,p:jshMax,p:min,n:15,n:2.4,p:round,p:x; literals: "#ffffff","700 " |
| `vu` | `Tu` | object | alpha-exact object body match (122 char canon; locals renumbered only); literals: "称号","光环","宠物" |
| `vv` | `Rv` | function | alpha-exact function body match (564 char canon; locals renumbered only); literals: "salvo","没有积蓄的冰箭","hyakka" |
| `vw` | `Uw` | function | alpha-exact function body match (1155 char canon; locals renumbered only); literals: "余烬裂隙存档-","角色","_" |
| `Vw` | `S4` | function | clone fingerprint: OLD-token coverage 0.94 / dice 0.945 (runner-up 0.67); shared invariant tokens: p:x,n:2,p:y,n:0,n:0.6,p:rar,n:1600,n:8100; literals: none |
| `vx` | `C5` | object | alpha-exact object body match (361 char canon; locals renumbered only); literals: "#4a5a8a","#ff7030","#7ab8ff" |
| `Vx` | `Nx` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.984 (runner-up 0.36); shared invariant tokens: p:t,p:x,p:y,p:z,p:sin,n:2.4,n:0.6,n:3.5; literals: "#3a1470","#2a0e50" |
| `Vy` | `pg` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.992 (runner-up 0.57); shared invariant tokens: p:cos,p:ang,p:sin,s:crossbow,p:recoilT,p:pl,n:0,n:18; literals: "crossbow","#6a4a2a" |
| `w$` | `W$` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.987 (runner-up 0.36); shared invariant tokens: p:tower,p:busy,p:ended,p:Z,s:quit,n:0,n:1,p:objs; literals: "quit","texit" |
| `W$` | `lA` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.981 (runner-up 0.40); shared invariant tokens: s:stats:pre,k:cls,k:add,s:monk,s:es,n:20,s:witch,s:manaRegen; literals: "stats:pre","monk" |
| `w0` | `ff` | function | alpha-exact function body match (628 char canon; locals renumbered only); literals: " selected","<option value=\"","\"" |
| `W0` | `K0` | function | alpha-exact function body match (198 char canon; locals renumbered only); literals: none |
| `w1` | `e1` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.988 (runner-up 0.54); shared invariant tokens: p:getContext,s:2d,p:drawImage,p:r,p:clearRect,n:0,p:width,p:height; literals: "2d","rgba(255,120,40,0.22)" |
| `w2` | `j2` | function | alpha-exact function body match (123 char canon; locals renumbered only); literals: "ember-rift-wallet-debug","ember-rift-wallet" |
| `W2` | `Y2` | string | ref-vote-r0: 3/3 aligned free references across matched functions point to Y2; corroborated: 3/3 aligned references agree |
| `w3` | `B3` | function | alpha-exact function body match (1739 char canon; locals renumbered only); literals: "ring","f","canvas" |
| `W3` | `sS` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.970 (runner-up 0.51); shared invariant tokens: p:dist,p:d,p:meleeArea,p:c,n:1,p:mubyo,n:1.5,n:0.12; literals: "#3a3448","#e8eef4" |
| `w4` | `Q4` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.985 (runner-up 0.49); shared invariant tokens: p:reduce,p:values,p:w,n:0,p:entries,p:filter,p:keys,p:t; literals: "\|","b" |
| `W4` | `kx` | function | alpha-exact function body match (315 char canon; locals renumbered only); literals: none |
| `W5` | `bw` | object | alpha-exact object body match (109 char canon; locals renumbered only); literals: "锁定前缀","锁定后缀","解除锁定" |
| `w6` | `FS` | function | alpha-exact function body match (148 char canon; locals renumbered only); literals: none |
| `W6` | `o6` | function | alpha-exact function body match (294 char canon; locals renumbered only); literals: none |
| `W8` | `lM` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.975 (runner-up 0.26); shared invariant tokens: n:1,s:mon,p:manual,p:lock,s:tap,n:0,p:walk,k:x; literals: "mon","tap" |
| `wa` | `Sa` | object | alpha-exact object body match (124 char canon; locals renumbered only); literals: none |
| `Wa` | `Na` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.970 (runner-up 0.52); shared invariant tokens: n:1,p:crit,n:100,p:multi,p:rage,p:X,n:1.2,p:ruthless; literals: none |
| `wb` | `gy` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.60); shared invariant tokens: p:orbs,p:x,p:pl,n:2,p:y,n:22500,n:0.8; literals: none |
| `Wb` | `Oy` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.966 (runner-up 0.56); shared invariant tokens: k:fixed,k:el,s:cold,k:dom,k:d,k:life,n:0.6,k:spd; literals: "cold","shard" |
| `wc` | `Ac` | function | ref-vote-r0: 6/6 aligned free references across matched functions point to Ac; corroborated: 6/6 aligned references agree |
| `Wc` | `_c` | object | alpha-exact object body match (177 char canon; locals renumbered only); literals: "pulse25" |
| `wd` | `mp` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.73); shared invariant tokens: p:forgeSel,null,p:kind,p:it,s:item,p:loc,s:inv,s:eq; literals: "item","inv" |
| `Wd` | `Kd` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.993 (runner-up 0.23); shared invariant tokens: s:wings,p:span,n:1,s:back,s:mount,p:round,n:208,n:96; literals: "wings","back" |
| `we` | `we` | function | alpha-exact function body match (267 char canon; locals renumbered only); literals: none |
| `We` | `We` | object | alpha-exact object body match (205 char canon; locals renumbered only); literals: none |
| `wf` | `Rf` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.989 (runner-up 0.59); shared invariant tokens: p:cos,n:0,p:look,p:slot,s:wings,p:zone,null,s:back; literals: "wings","back" |
| `Wf` | `s0` | string | ref-vote-r0: 5/5 aligned free references across matched functions point to s0; corroborated: 5/5 aligned references agree |
| `wg` | `nb` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.54); shared invariant tokens: p:uid,t:data-m="sel" data-uid=",s: msel,p:kind,s:sup,p:gid,p:mech,s: mech; literals: "data-m=\"sel\" data-uid=\"","\"" |
| `Wg` | `$b` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.18); shared invariant tokens: p:url,t:<a href=",t:" target="_blank" rel="noopener">,t:</a>,s:web,s:<div class="site web"><b>官方网站</b><span>刷新即是最新版 · 进度保存在这个浏览器里</span></div>,s:file,s:<button class="btn small primary" id="bMove">一键搬家到官网</button>; literals: "<a href=\"","\" target=\"_blank\" rel=\"noopener\">" |
| `wh` | `Eh` | function | alpha-exact function body match (2646 char canon; locals renumbered only); literals: none |
| `wi` | `Ci` | function | alpha-exact function body match (96 char canon; locals renumbered only); literals: none |
| `Wi` | `Ki` | function | alpha-exact function body match (86 char canon; locals renumbered only); literals: none |
| `wk` | `jk` | function | alpha-exact function body match (496 char canon; locals renumbered only); literals: "u","cv" |
| `Wk` | `Yk` | array | alpha-exact array body match (37 char canon; locals renumbered only); literals: none |
| `wl` | `Nl` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.991 (runner-up 0.05); shared invariant tokens: p:ok,null,p:createElement,s:canvas,p:getContext,s:webgl,k:preserveDrawingBuffer,n:0; literals: "canvas","webgl" |
| `Wl` | `zl` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.67); shared invariant tokens: p:createElement,s:div,p:id,s:share,p:innerHTML,s:ruin,s:遗照,s:晒图卡; literals: "div","share" |
| `wm` | `Om` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.994 (runner-up 0.31); shared invariant tokens: p:pl,p:jsh,null,n:0,p:jshT,p:jshD,p:jkFreeT,n:2.5; literals: "flicker","shuangqi" |
| `wM` | `oT` | object | alpha-exact object body match (283 char canon; locals renumbered only); literals: none |
| `Wm` | `Eg` | function | clone fingerprint: OLD-token coverage 0.84 / dice 0.840 (runner-up 0.30); shared invariant tokens: p:filter,p:map,p:equip,p:inv,p:kind,s:item,p:length,p:join; literals: "item","fsel" |
| `WM` | `G8` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.999 (runner-up 0.22); shared invariant tokens: k:life,n:0.05,k:lifeInc,n:0.7,k:resAll,n:0.45,k:resF,n:0.25; literals: "jianke","phys" |
| `wn` | `Sn` | expression | ref-vote-r0: 8/8 aligned free references across matched functions point to Sn; corroborated: 9/9 aligned references agree |
| `Wn` | `qn` | object | alpha-exact object body match (1367 char canon; locals renumbered only); literals: "aura","余烬金光","群破 500 限定" |
| `wo` | `So` | object | ref-vote-r0: 7/7 aligned free references across matched functions point to So; corroborated: 7/7 aligned references agree |
| `Wo` | `Uo` | array | alpha-exact array body match (59 char canon; locals renumbered only); literals: "phys","fire","cold" |
| `Wp` | `Xp` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.989 (runner-up 0.43); shared invariant tokens: p:every,p:cur,n:0,s:需要四种首领印记各 1 个,p:forEach,s:portal,s:#fade,p:opacity; literals: "需要四种首领印记各 1 个","portal" |
| `wr` | `Mr` | object | alpha-exact object body match (318 char canon; locals renumbered only); literals: "烬鬃战驹","人人都有","#ff8a3a" |
| `Wr` | `Nr` | object | alpha-exact object body match (180 char canon; locals renumbered only); literals: "https://ember-rift.pages.dev","ember-rift.pages.dev","ember-rift-mobile.pages.dev" |
| `ws` | `Ss` | alias | ref-vote-r0: 12/12 aligned free references across matched functions point to Ss; corroborated: 12/12 aligned references agree |
| `wS` | `y8` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.988 (runner-up 0.58); shared invariant tokens: p:getContext,s:2d,p:createRadialGradient,p:clearRect,n:0,p:width,p:height,p:imageSmoothingEnabled; literals: "2d","ripple" |
| `Ws` | `Es` | object | alpha-exact object body match (119 char canon; locals renumbered only); literals: none |
| `WS` | `MM` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.38); shared invariant tokens: p:sel,t:<div class="stats mstats">,t:</div>,p:stats,k:title,s:角色 · Lv ,p:level,k:body; literals: "<div class=\"stats mstats\">","</div>" |
| `wT` | `n$` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.986 (runner-up 0.55); shared invariant tokens: p:spr,p:mon,p:createElement,s:canvas,p:width,n:32,p:height,p:getContext; literals: "canvas","2d" |
| `Wt` | `Wt` | object | alpha-exact object body match (3207 char canon; locals renumbered only); literals: "crypt","地下墓室","骸骨回廊" |
| `wu` | `Cu` | object | alpha-exact object body match (104 char canon; locals renumbered only); literals: none |
| `Wu` | `Qu` | function | alpha-exact function body match (1566 char canon; locals renumbered only); literals: none |
| `wv` | `jv` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.985 (runner-up 0.65); shared invariant tokens: p:bells,p:hypot,p:x,p:pl,p:y,n:10,p:st,p:shape; literals: "circle","thunder" |
| `ww` | `Kw` | function | clone fingerprint: OLD-token coverage 0.92 / dice 0.917 (runner-up 0.21); shared invariant tokens: p:rel,p:level,p:asc,p:n,s: · ,p:best,n:0,p:svt; literals: " · ","<div class=\"syside\"><small>" |
| `Ww` | `g4` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.987 (runner-up 0.74); shared invariant tokens: p:length,p:filter,p:keys,p:codex,p:done,k:firstmap,p:maps,p:stats; literals: none |
| `Wx` | `Ox` | function | alpha-exact function body match (667 char canon; locals renumbered only); literals: none |
| `wy` | `d2` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.969 (runner-up 0.62); shared invariant tokens: n:0,p:getContext,s:2d,p:drawImage,p:clearRect,p:width,p:height,p:imageSmoothingEnabled; literals: "2d" |
| `X` | `X` | object | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.21); shared invariant tokens: k:fireball,k:n,s:火球术,k:tags,s:spell,s:proj,s:fire,s:aoe; literals: "火球术","spell" |
| `x$` | `G$` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.971 (runner-up 0.30); shared invariant tokens: p:tower,p:Z,p:deaths,p:t,p:fall,p:x,p:pl,p:y; literals: "#a81d2c","#5a1018" |
| `X$` | `vA` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.995 (runner-up 0.36); shared invariant tokens: p:pl,p:x,p:y,p:h,p:pxCineT,p:T,n:1.2,p:stop; literals: "gold","pxfin" |
| `X0` | `nd` | array | alpha-exact array body match (406 char canon; locals renumbered only); literals: "fast","迅捷","tough" |
| `x1` | `Xm` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.971 (runner-up 0.55); shared invariant tokens: p:k,n:0,p:pl,null,k:x,p:x,p:face,n:6; literals: none |
| `x2` | `L2` | function | alpha-exact function body match (1843 char canon; locals renumbered only); literals: "null" |
| `x3` | `O3` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.996 (runner-up 0.44); shared invariant tokens: p:dead,p:pl,p:kishinT,n:0,n:1.25,n:1,p:crouch,p:moving; literals: "rgba(0,0,0,0.45)","back" |
| `X3` | `hS` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.971 (runner-up 0.45); shared invariant tokens: p:some,p:skills,p:gid,s:salvo,p:salvoT,p:pl,n:0,n:0.5; literals: "salvo" |
| `X4` | `$x` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.82); shared invariant tokens: p:filter,p:inv,p:kind,s:map,p:tier,p:rarity,n:2,p:invest; literals: "map" |
| `X5` | `Cw` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.975 (runner-up 0.39); shared invariant tokens: p:parse,p:getItem,s:{},p:includes,s:auto,s:on,s:off,p:mode; literals: "{}","auto" |
| `X6` | `m6` | function | alpha-exact function body match (16417 char canon; locals renumbered only); literals: none |
| `X8` | `V6` | function | alpha-exact function body match (3161 char canon; locals renumbered only); literals: none |
| `xa` | `ba` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.74); shared invariant tokens: p:contains,p:classList,s:mpin,p:key,p:act,null,p:remove,s:mpl; literals: "mpin","mpl" |
| `Xa` | `Xa` | array | alpha-exact array body match (75 char canon; locals renumbered only); literals: "sig_crypt","sig_lava","sig_ice" |
| `xb` | `my` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.989 (runner-up 0.48); shared invariant tokens: p:c,p:kind,s:frag,p:frozen,n:0,p:dead,p:dummy,n:0.12; literals: "frag","galv" |
| `Xb` | `_y` | array | ref-vote-r0: 3/3 aligned free references across matched functions point to _y; corroborated: 3/3 aligned references agree |
| `xc` | `$c` | function | ref-vote-r0: 6/6 aligned free references across matched functions point to $c; corroborated: 6/6 aligned references agree |
| `Xc` | `of` | function | alpha-exact function body match (620 char canon; locals renumbered only); literals: none |
| `xd` | `Ad` | function | ref-vote-r0: 4/4 aligned free references across matched functions point to Ad; corroborated: 4/4 aligned references agree |
| `Xd` | `np` | object | alpha-exact object body match (366 char canon; locals renumbered only); literals: "普通 → 魔法","魔法加 1 条","重洗魔法词缀" |
| `Xf` | `v0` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.997 (runner-up 0.20); shared invariant tokens: n:0,k:phys,k:fire,k:cold,k:light,k:min,n:2,k:max; literals: "none","offhand" |
| `Xg` | `Pb` | function | alpha-exact function body match (1964 char canon; locals renumbered only); literals: "旧版存档","刚刚"," 分钟前" |
| `xh` | `Rh` | function | alpha-exact function body match (122 char canon; locals renumbered only); literals: none |
| `Xh` | `im` | function | alpha-exact function body match (475 char canon; locals renumbered only); literals: none |
| `xi` | `Ai` | number | ref-vote-r0: 6/6 aligned free references across matched functions point to Ai; corroborated: 6/6 aligned references agree |
| `Xi` | `sl` | function | ref-vote-r0: 5/5 aligned free references across matched functions point to sl; corroborated: 5/5 aligned references agree |
| `xk` | `Lk` | function | alpha-exact function body match (1293 char canon; locals renumbered only); literals: "crosshair","\" height=\"","url(\"data:image/svg+xml," |
| `Xl` | `nc` | function | alpha-exact function body match (891 char canon; locals renumbered only); literals: "map","soul","gem" |
| `xm` | `zm` | function | alpha-exact function body match (486 char canon; locals renumbered only); literals: "stuck" |
| `xM` | `sT` | function | alpha-exact function body match (154 char canon; locals renumbered only); literals: none |
| `XM` | `OT` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.979 (runner-up 0.39); shared invariant tokens: p:c,p:pl,p:aim,n:150,p:x,p:y,n:0.55,p:push; literals: "grenade" |
| `Xn` | `Wn` | function | ref-vote-r0: 4/4 aligned free references across matched functions point to Wn; corroborated: 4/4 aligned references agree |
| `xo` | `wo` | object | alpha-exact object body match (255 char canon; locals renumbered only); literals: none |
| `Xo` | `on` | object | alpha-exact object body match (54 char canon; locals renumbered only); literals: none |
| `xp` | `Ip` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.991 (runner-up 0.68); shared invariant tokens: s:soul,p:filter,p:inv,p:kind,s:map,s:uniq,s:item,p:rarity; literals: "soul","map" |
| `Xp` | `tu` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.989 (runner-up 0.30); shared invariant tokens: s:#treecv,p:parentElement,p:touchMode,p:contains,p:classList,p:body,s:mob,p:max; literals: "#treecv","mob" |
| `xr` | `Sr` | number | ref-vote-r0: 8/8 aligned free references across matched functions point to Sr; corroborated: 8/8 aligned references agree |
| `Xr` | `ai` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.997 (runner-up 0.49); shared invariant tokens: p:c,p:st,p:r,p:len,p:meleeArea,p:includes,p:tags,s:aoe; literals: "aoe","#9aa8c8" |
| `xs` | `ws` | object | alpha-exact object body match (919 char canon; locals renumbered only); literals: "世界掉落","#d2803a","任何地图中随机掉落" |
| `xS` | `b8` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.970 (runner-up 0.55); shared invariant tokens: null,p:querySelectorAll,s:#overlay canvas[data-wd],p:length,n:0,n:1000,p:split,p:wd; literals: "u","#overlay canvas[data-wd]" |
| `Xs` | `oo` | array | alpha-exact array body match (70 char canon; locals renumbered only); literals: "#d8d4cc","#8a8cff","#ecd85a" |
| `xt` | `xt` | function | alpha-exact function body match (724 char canon; locals renumbered only); literals: "#120e14" |
| `xT` | `o$` | array | alpha-exact array body match (610 char canon; locals renumbered only); literals: ".........aaaaaaaa.........","........abhhhhhhba........",".......abhhhhhhhhba......." |
| `Xt` | `Nt` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.52); shared invariant tokens: p:touchMode,p:aimFn,null,n:48400,p:mons,p:dead,p:x,p:pl; literals: none |
| `XT` | `CT` | function | clone fingerprint: OLD-token coverage 0.78 / dice 0.780 (runner-up 0.65); shared invariant tokens: n:0,p:length,p:fillStyle,p:fillRect,n:1; literals: "."," " |
| `xu` | `Au` | function | alpha-exact function body match (509 char canon; locals renumbered only); literals: none |
| `xv` | `Lv` | function | clone fingerprint: OLD-token coverage 0.96 / dice 0.963 (runner-up 0.53); shared invariant tokens: p:max,n:1,p:salvo,p:pl,n:0,p:atan2,p:y,p:x; literals: "salvo","ice" |
| `xw` | `_w` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.969 (runner-up 0.18); shared invariant tokens: p:value,s:#scode,p:onkeydown,p:stopPropagation,p:length,p:replace,p:textContent,s:#scLen; literals: "#scode","#scLen" |
| `Xw` | `A4` | function | alpha-exact function body match (237 char canon; locals renumbered only); literals: none |
| `xx` | `N5` | object | alpha-exact object body match (300 char canon; locals renumbered only); literals: "地图装置","商人","仓库" |
| `Xx` | `_x` | function | clone fingerprint: OLD-token coverage 0.96 / dice 0.959 (runner-up 0.84); shared invariant tokens: n:0.38,p:getImageData,n:0,p:data,n:3,p:length,n:4,n:255; literals: none |
| `xy` | `f2` | object | ref-vote-r0: 3/3 aligned free references across matched functions point to f2; corroborated: 3/3 aligned references agree |
| `Xy` | `gg` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.979 (runner-up 0.51); shared invariant tokens: s:jian,n:1,p:jk,p:ang,p:point,n:0,p:act,p:pl; literals: "jian","flicker" |
| `Y` | `Y` | object | alpha-exact object body match (9584 char canon; locals renumbered only); literals: "多重投射","proj","投射物 +2 · 伤害总降 25%" |
| `y$` | `F$` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.996 (runner-up 0.41); shared invariant tokens: p:phase,s:tear,n:6.283,p:x,p:pl,p:cos,n:64,p:y; literals: "tear","tele" |
| `Y$` | `yA` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.996 (runner-up 0.35); shared invariant tokens: s:skill:calc,p:isMelee,p:more,n:1,p:meleeMore,p:a,p:S,n:0; literals: "skill:calc","stats:post" |
| `y0` | `h0` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.959 (runner-up 0.54); shared invariant tokens: p:Z,p:th,p:key,s:lava,p:tier,n:0,s:frac,p:w; literals: "lava","frac" |
| `Y0` | `od` | object | alpha-exact object body match (387 char canon; locals renumbered only); literals: "life","lifeInc","addFire" |
| `y1` | `Qm` | function | clone fingerprint: OLD-token coverage 0.96 / dice 0.955 (runner-up 0.52); shared invariant tokens: n:0,p:createElement,s:canvas,p:width,p:height,p:length,p:getContext,s:2d; literals: "u","canvas" |
| `y2` | `C2` | function | ref-vote-r0: 3/3 aligned free references across matched functions point to C2; corroborated: 3/3 aligned references agree |
| `Y2` | `lv` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.994 (runner-up 0.41); shared invariant tokens: p:kind,s:texit,p:round,p:x,p:y,p:T,p:tower,p:best; literals: "texit","rgba(0,0,0,0.45)" |
| `Y3` | `uS` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.983 (runner-up 0.49); shared invariant tokens: p:c,p:min,n:1,p:chargeT,n:0.8,n:0.35,n:0.65,n:1.5; literals: "snipe","super" |
| `y4` | `Z4` | function | clone fingerprint: OLD-token coverage 0.73 / dice 0.730 (runner-up 0.19); shared invariant tokens: p:t,s: fresh,p:col,p:bg,p:n,p:v,n:0,n:1; literals: " fresh","g" |
| `y5` | `p5` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.980 (runner-up 0.52); shared invariant tokens: p:err,p:reward,p:id,p:redeemed,p:title,p:titles,p:cos,p:pet; literals: none |
| `Y6` | `h6` | array | alpha-exact array body match (302 char canon; locals renumbered only); literals: "unexpected EOF","invalid block type","invalid length/literal" |
| `y8` | `D6` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.988 (runner-up 0.39); shared invariant tokens: p:pl,p:absorb,n:0,p:x,n:2,p:y,null,p:some; literals: "fire","cold" |
| `ya` | `va` | function | alpha-exact function body match (82 char canon; locals renumbered only); literals: none |
| `yb` | `py` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.972 (runner-up 0.59); shared invariant tokens: p:ammo,p:pl,p:clip,s:reload,n:1.2,p:x,p:y,n:24; literals: "reload","info" |
| `Yb` | `Zy` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.43); shared invariant tokens: null,n:1000000000000,p:x,p:pl,p:y,n:70,n:240,n:2; literals: none |
| `yc` | `uc` | object | alpha-exact object body match (126 char canon; locals renumbered only); literals: none |
| `Yc` | `sf` | function | alpha-exact function body match (242 char canon; locals renumbered only); literals: "-s" |
| `yd` | `Md` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.974 (runner-up 0.81); shared invariant tokens: n:0,n:0.5,n:1,p:find,p:x,n:2,p:y,n:225; literals: none |
| `Yd` | `op` | array | alpha-exact array body match (120 char canon; locals renumbered only); literals: "trans","aug","alt" |
| `Ye` | `Xe` | object | alpha-exact object body match (407 char canon; locals renumbered only); literals: none |
| `yf` | `Tf` | null | ref-vote-r0: 5/5 aligned free references across matched functions point to Tf; corroborated: 5/5 aligned references agree |
| `Yf` | `y0` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.990 (runner-up 0.52); shared invariant tokens: p:key,p:th,p:Z,p:filter,p:rooms,p:M,n:0,p:boss; literals: "lava","vent" |
| `yg` | `tb` | function | alpha-exact function body match (1210 char canon; locals renumbered only); literals: ".mvdb .mnew",".mvdb" |
| `Yg` | `Ib` | function | clone fingerprint: OLD-token coverage 0.96 / dice 0.964 (runner-up 0.30); shared invariant tokens: p:debug,s: hidden,s: checked,p:join,p:map,p:col,p:n,p:wts; literals: " hidden"," checked" |
| `yh` | `$h` | function | alpha-exact function body match (6212 char canon; locals renumbered only); literals: "lead","lead2","-" |
| `yi` | `Mi` | function | ref-vote-r0: 3/3 aligned free references across matched functions point to Mi; corroborated: 3/3 aligned references agree |
| `yk` | `Ck` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.914 (runner-up 0.30); shared invariant tokens: p:parse,p:getItem,s:{},s:shake,n:0,n:1,p:stop,s:boolean; literals: "{}","shake" |
| `yl` | `xl` | array | alpha-exact array body match (2938 char canon; locals renumbered only); literals: "firstmap","初入裂隙","完成第一张地图" |
| `Yl` | `oc` | array | alpha-exact array body match (232 char canon; locals renumbered only); literals: "gen","装备","map" |
| `ym` | `jm` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.975 (runner-up 0.44); shared invariant tokens: p:bh,p:d,p:pl,s:flicker,p:jkFreeT,n:0,p:jsh,n:1; literals: "flicker","剑势不足 · 冷却中" |
| `Ym` | `ng` | expression | ref-vote-r0: 3/3 aligned free references across matched functions point to ng; corroborated: 3/3 aligned references agree |
| `YM` | `zT` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.991 (runner-up 0.46); shared invariant tokens: p:c,p:pl,p:ammo,p:d,p:gid,p:Z,p:dead,p:atan2; literals: "skill:proj","frag" |
| `Yn` | `ar` | function | clone fingerprint: OLD-token coverage 0.95 / dice 0.953 (runner-up 0.67); shared invariant tokens: n:0,n:30,p:x,n:1,p:w,n:2,p:y,p:h; literals: none |
| `yo` | `ko` | object | alpha-exact object body match (2958 char canon; locals renumbered only); literals: "s","肉香四溢","一碗拌面香千里" |
| `Yo` | `sn` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.39); shared invariant tokens: s:wings,p:fromEntries,p:filter,p:entries,p:kind,s:sun,s:back,s:mount; literals: "wings","sun" |
| `yr` | `kr` | function | alpha-exact function body match (2011 char canon; locals renumbered only); literals: none |
| `Yr` | `ti` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.986 (runner-up 0.42); shared invariant tokens: p:pl,p:dead,p:forEach,p:buffs,p:kind,s:meta,p:has,p:S; literals: "meta","freeze" |
| `ys` | `fs` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.80); shared invariant tokens: p:mons,p:dead,p:dummy,p:r,p:x,n:2,p:y,k:fixed; literals: none |
| `yS` | `h8` | function | clone fingerprint: OLD-token coverage 0.94 / dice 0.943 (runner-up 0.41); shared invariant tokens: s:kill,k:m,p:rar,n:2,p:flare,n:1,p:kill,n:0; literals: "kill" |
| `Ys` | `no` | function | alpha-exact function body match (466 char canon; locals renumbered only); literals: none |
| `YS` | `PM` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.63); shared invariant tokens: p:it,p:loc,s:inv,p:kind,s:soul,s:map,p:slot,p:ring1; literals: "inv","soul" |
| `yt` | `yt` | object | alpha-exact object body match (71 char canon; locals renumbered only); literals: none |
| `yT` | `t$` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.968 (runner-up 0.27); shared invariant tokens: p:M,p:Z,p:W,p:H,p:nav,p:gi,p:z,p:T; literals: none |
| `Yt` | `Xt` | function | ref-vote-r0: 13/13 aligned free references across matched functions point to Xt; corroborated: 13/13 aligned references agree |
| `yu` | `Mu` | string | ref-vote-r0: 4/4 aligned free references across matched functions point to Mu; corroborated: 4/4 aligned references agree |
| `Yu` | `rh` | function | alpha-exact function body match (249 char canon; locals renumbered only); literals: none |
| `yv` | `Cv` | function | alpha-exact function body match (4169 char canon; locals renumbered only); literals: "charge","bowDraw","escape" |
| `Yv` | `lk` | object | alpha-exact object body match (763 char canon; locals renumbered only); literals: "雷殛","#e2ccff","thunder" |
| `Yw` | `$4` | object | alpha-exact object body match (141 char canon; locals renumbered only); literals: "bishop","forge","queen" |
| `Yx` | `Zx` | array | alpha-exact array body match (38 char canon; locals renumbered only); literals: none |
| `Z` | `_` | function | alpha-exact function body match (334 char canon; locals renumbered only); literals: none |
| `z$` | `tA` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.970 (runner-up 0.50); shared invariant tokens: p:corrupted,n:0,n:0.45,n:0.3,s:none,n:0.6,p:cimpl,k:k; literals: "none","impl" |
| `Z$` | `pA` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.997 (runner-up 0.44); shared invariant tokens: s:hit:land,k:m,k:o,k:crit,k:dom,p:hidden,p:T,n:0; literals: "hit:land","light" |
| `z0` | `G0` | function | alpha-exact function body match (236 char canon; locals renumbered only); literals: none |
| `z1` | `u1` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.991 (runner-up 0.52); shared invariant tokens: p:span,n:1,p:round,n:72,n:2,n:52,k:b,k:e; literals: "x" |
| `z2` | `U2` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.986 (runner-up 0.52); shared invariant tokens: p:clone,p:pl,p:fr,p:cls,p:S,n:0,p:round,p:x; literals: "#6a5a9a","#8fb4ff" |
| `Z2` | `sv` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.63); shared invariant tokens: p:n,p:slot,p:id,p:push,p:t,s:title; literals: "title" |
| `z3` | `Q3` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.976 (runner-up 0.52); shared invariant tokens: p:width,p:height,p:setTransform,n:1,n:0,p:globalCompositeOperation,s:source-over,p:clearRect; literals: "source-over","rgba(3,2,6," |
| `Z3` | `iS` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.987 (runner-up 0.52); shared invariant tokens: n:160,p:r,p:push,p:fx,k:k,s:tele,k:x,p:x; literals: "tele","#d8c8a0" |
| `z4` | `c3` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.987 (runner-up 0.42); shared invariant tokens: p:objs,p:kind,s:rift,p:st,s:idle,p:x,p:pl,n:2; literals: "rift","idle" |
| `Z4` | `j5` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.77); shared invariant tokens: p:beginPath,p:forEach,p:lineTo,p:x,p:y,p:moveTo; literals: none |
| `Z5` | `xw` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.973 (runner-up 0.75); shared invariant tokens: s:vaal,p:pity,n:0,s:怨念已满 · 必出腐化词缀,s:赌一把 · 怨念 ,p:includes,s:必定带有对应词缀,null; literals: "vaal","怨念已满 · 必出腐化词缀" |
| `z6` | `JS` | function | alpha-exact function body match (31781 char canon; locals renumbered only); literals: "..aa......","..abba....","..abcba..." |
| `Z6` | `l6` | object | alpha-exact object body match (131 char canon; locals renumbered only); literals: "箭袋","盾牌","法器" |
| `za` | `Ba` | function | alpha-exact function body match (761 char canon; locals renumbered only); literals: none |
| `Za` | `ja` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.995 (runner-up 0.35); shared invariant tokens: s:#treecv,p:size,p:hgt,p:min,n:2,n:1,p:width,p:style; literals: "#treecv","px" |
| `zb` | `Ry` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.992 (runner-up 0.46); shared invariant tokens: p:kind,s:tornado,p:split,s:gasarrow,p:gassed,n:1,p:x,p:y; literals: "tornado","gasarrow" |
| `Zb` | `qy` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.826 (runner-up 0.36); shared invariant tokens: p:frameHS,n:0,p:T,p:lastHsT,n:0.35,p:hsChain,p:max,n:0.55; literals: none |
| `zc` | `qc` | object | alpha-exact object body match (53 char canon; locals renumbered only); literals: none |
| `zd` | `Gd` | function | alpha-exact function body match (144 char canon; locals renumbered only); literals: none |
| `Zd` | `Yd` | function | clone fingerprint: OLD-token coverage 0.93 / dice 0.931 (runner-up 0.65); shared invariant tokens: p:key,p:_w,n:1,p:includes,p:codes,n:0,p:push; literals: none |
| `ze` | `Me` | object | alpha-exact object body match (16780 char canon; locals renumbered only); literals: "锐眼","ranger","#a8e070" |
| `Ze` | `Ze` | function | alpha-exact function body match (540 char canon; locals renumbered only); literals: "rgba(",",",")" |
| `Zf` | `i0` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.988 (runner-up 0.78); shared invariant tokens: s:ember-rift-stash-debug,s:ember-rift-stash,p:cur,null,p:looks,p:length,p:keys,p:cos; literals: "ember-rift-stash-debug","ember-rift-stash" |
| `zg` | `bb` | function | clone fingerprint: OLD-token coverage 0.97 / dice 0.966 (runner-up 0.29); shared invariant tokens: n:0,p:getBoundingClientRect,p:dispatchEvent,s:click,k:bubbles,k:cancelable,k:shiftKey,k:clientX; literals: "click" |
| `Zg` | `Eb` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.985 (runner-up 0.24); shared invariant tokens: n:0,null,p:bad,p:dup,p:code,k:move,p:conflict,p:rel; literals: "newer" |
| `zh` | `Nh` | function | alpha-exact function body match (487 char canon; locals renumbered only); literals: none |
| `Zh` | `em` | object | alpha-exact object body match (1749 char canon; locals renumbered only); literals: "small","统御","minionInc" |
| `zi` | `Ur` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.15); shared invariant tokens: null,s:preview,p:protocol,s:file:,s:file,p:toLowerCase,p:hostname,s:localhost; literals: "u","preview" |
| `Zi` | `Yi` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.995 (runner-up 0.58); shared invariant tokens: p:includes,p:ach,p:k,p:push,p:rw,p:cur,n:0,p:at; literals: "×"," " |
| `zk` | `Uk` | function | alpha-exact function body match (8705 char canon; locals renumbered only); literals: "k","t","r" |
| `zl` | `Cl` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.24); shared invariant tokens: null,p:look,p:mount,p:find,p:keys,p:free; literals: none |
| `Zl` | `Dl` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.58); shared invariant tokens: p:filter,p:map,p:equip,p:inv,p:kind,s:item,s:soul,k:eq; literals: "item","soul" |
| `zm` | `ag` | null | ref-vote-r0: 3/3 aligned free references across matched functions point to ag; corroborated: 3/3 aligned references agree |
| `Zm` | `Pg` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.985 (runner-up 0.25); shared invariant tokens: p:dbg,p:find,p:r,n:0,p:rooms,p:dens,p:n,p:join; literals: "-"," 房间" |
| `ZM` | `U8` | function | alpha-exact function body match (176 char canon; locals renumbered only); literals: none |
| `zn` | `Hn` | null | ref-vote-r0: 9/9 aligned free references across matched functions point to Hn; corroborated: 9/9 aligned references agree |
| `Zn` | `Kn` | function | clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.26); shared invariant tokens: k:slot,k:rows,p:shift,p:equip,p:name,s:空位,p:join,p:map; literals: "空位","up" |
| `zo` | `Do` | function | ref-vote-r0: 11/11 aligned free references across matched functions point to Do; corroborated: 11/11 aligned references agree |
| `Zo` | `Vo` | function | alpha-exact function body match (3430 char canon; locals renumbered only); literals: none |
| `zp` | `iu` | function | alpha-exact function body match (759 char canon; locals renumbered only); literals: none |
| `Zp` | `hu` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.990 (runner-up 0.40); shared invariant tokens: p:run,p:pin,p:route,s:pin,p:value,p:invest,p:t,n:1; literals: "pin","—" |
| `zr` | `qr` | function | ref-vote-r0: 8/8 aligned free references across matched functions point to qr; corroborated: 8/8 aligned references agree |
| `Zr` | `Vr` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.979 (runner-up 0.16); shared invariant tokens: p:Z,p:hidden,s:#btnPortal,p:type,s:map,s:hideout,p:textContent,s:#zname; literals: "#btnPortal","map" |
| `zs` | `Ts` | function | ref-vote-r0: 11/11 aligned free references across matched functions point to Ts; corroborated: 11/11 aligned references agree |
| `ZS` | `CM` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.998 (runner-up 0.31); shared invariant tokens: s:技能宝石,p:it,p:loc,p:n,p:gid,null,s:gems,p:kind; literals: "技能宝石","gems" |
| `zT` | `b$` | object | alpha-exact object body match (179 char canon; locals renumbered only); literals: "111","001","100" |
| `Zt` | `Ut` | object | alpha-exact object body match (96 char canon; locals renumbered only); literals: none |
| `zu` | `Nu` | object | alpha-exact object body match (338 char canon; locals renumbered only); literals: "#ffffff","#f0e6d0","#c8b8a0" |
| `zw` | `c4` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.987 (runner-up 0.66); shared invariant tokens: p:cos,p:sin,p:push,p:fx,k:k,s:line,k:x1,k:y1; literals: "line","#9fe8ff" |
| `Zw` | `k4` | function | clone fingerprint: OLD-token coverage 1.00 / dice 0.996 (runner-up 0.50); shared invariant tokens: p:ai,p:t,p:hp,p:maxhp,n:0.35,p:pt,null,n:1.5; literals: "chase","slam" |
| `zx` | `Rx` | function | clone fingerprint: OLD-token coverage 0.99 / dice 0.989 (runner-up 0.45); shared invariant tokens: p:pl,p:x,p:y,p:round,n:14,s:#ff7a24,s:#ffd27a,s:#3a2a30; literals: "#ff7a24","#ffd27a" |
| `Zx` | `qx` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.985 (runner-up 0.42); shared invariant tokens: p:t,p:length,p:trail,p:min,n:1,n:14,p:x,p:y; literals: none |
| `Zy` | `cg` | function | clone fingerprint: OLD-token coverage 0.98 / dice 0.984 (runner-up 0.56); shared invariant tokens: p:oils,p:lit,p:x,p:y,p:r,p:min,n:1,p:t; literals: "#16120a","#4a3a6a" |

## 7. medium 置信度映射（改写后必须跑引导 + 玩法断言）

| OLD | NEW | kind | 证据 |
|---|---|---|---|
| `_4` | `G5` | null | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to G5 |
| `_5` | `ww` | function | duplicate canonical signature disambiguated by declaration order: only candidate in anchor window (987..988); canon 809 chars |
| `$u` | `Pu` | array | ref-vote-relaxed1: 2/2 aligned free references across matched functions point to Pu |
| `a5` | `Qx` | null | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to Qx |
| `ai` | `jr` | string | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to jr |
| `ap` | `lp` | function | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to lp |
| `av` | `pv` | function | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to pv |
| `c3` | `S3` | function | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to S3 |
| `cm` | `bm` | string | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to bm |
| `cx` | `M5` | function | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to M5 |
| `d6` | `AS` | number | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to AS |
| `Dk` | `Vk` | expression | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to Vk |
| `e5` | `Kx` | function | duplicate canonical signature disambiguated by declaration order: only candidate in anchor window (585..586); canon 189 chars |
| `eb` | `zb` | function | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to zb |
| `ey` | `Ky` | number | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to Ky |
| `f3` | `M3` | function | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to M3 |
| `Fp` | `fp` | function | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to fp |
| `fx` | `T5` | null | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to T5 |
| `Gf` | `ic` | function | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to ic |
| `gp` | `Ld` | function | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to Ld |
| `Gr` | `Wr` | function | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to Wr |
| `gy` | `r2` | null | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to r2 |
| `H1` | `w1` | function | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to w1 |
| `H5` | `vw` | function | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to vw |
| `hk` | `Mk` | null | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to Mk |
| `hx` | `B5` | function | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to B5 |
| `ih` | `mh` | number | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to mh |
| `im` | `mm` | alias | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to mm |
| `Im` | `eg` | number | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to eg |
| `J$` | `bA` | function | duplicate canonical signature disambiguated by declaration order: only candidate in anchor window (1887..1888); canon 105 chars |
| `J5` | `$w` | string | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to $w |
| `Jx` | `Ux` | function | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to Ux |
| `k0` | `wf` | function | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to wf |
| `k2` | `E2` | function | ref-vote-relaxed1: 2/2 aligned free references across matched functions point to E2 |
| `K4` | `W5` | expression | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to W5 |
| `k5` | `h5` | number | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to h5 |
| `K5` | `Sw` | function | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to Sw |
| `l$` | `A$` | function | duplicate canonical signature disambiguated by declaration order: only candidate in anchor window (1539..1541); canon 809 chars |
| `Ll` | `wl` | function | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to wl |
| `mr` | `gr` | expression | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to gr |
| `Mx` | `Z5` | string | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to Z5 |
| `my` | `n2` | string | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to n2 |
| `n5` | `Xx` | expression | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to Xx |
| `nk` | `mk` | string | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to mk |
| `ny` | `Jy` | function | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to Jy |
| `od` | `fd` | array | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to fd |
| `om` | `pm` | expression | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to pm |
| `p0` | `Of` | function | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to Of |
| `P0` | `q0` | function | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to q0 |
| `p5` | `r5` | function | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to r5 |
| `p6` | `CS` | number | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to CS |
| `Pg` | `gb` | expression | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to gb |
| `Q5` | `Tw` | function | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to Tw |
| `Qc` | `tf` | expression | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to tf |
| `Qd` | `ap` | function | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to ap |
| `Ri` | `qi` | expression | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to qi |
| `rm` | `hm` | expression | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to hm |
| `rn` | `cn` | object | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to cn |
| `rw` | `zw` | function | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to zw |
| `s5` | `Jx` | function | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to Jx |
| `sd` | `cd` | array | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to cd |
| `sg` | `z1` | function | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to z1 |
| `sm` | `dm` | expression | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to dm |
| `Sy` | `p2` | function | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to p2 |
| `T0` | `f0` | function | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to f0 |
| `t5` | `Vx` | null | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to Vx |
| `tc` | `lc` | function | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to lc |
| `Tx` | `K5` | string | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to K5 |
| `u6` | `RS` | function | duplicate canonical signature disambiguated by declaration order: only candidate in anchor window (1869..1872); canon 105 chars |
| `uk` | `Sk` | string | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to Sk |
| `uu` | `Cd` | function | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to Cd |
| `uw` | `Ww` | function | ref-vote-relaxed1: 2/2 aligned free references across matched functions point to Ww |
| `V2` | `nv` | function | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to nv |
| `vc` | `Tl` | function | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to Tl |
| `vi` | `Ti` | function | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to Ti |
| `Vk` | `nx` | expression | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to nx |
| `w5` | `g5` | string | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to g5 |
| `wx` | `H5` | function | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to H5 |
| `Wy` | `$m` | expression | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to $m |
| `x0` | `g0` | function | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to g0 |
| `x4` | `V4` | function | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to V4 |
| `x5` | `m5` | function | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to m5 |
| `y3` | `I3` | string | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to I3 |
| `Y4` | `Tx` | function | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to Tx |
| `Y5` | `Aw` | string | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to Aw |
| `Yi` | `yr` | function | ref-vote-relaxed1: 2/2 aligned free references across matched functions point to yr |
| `yp` | `Id` | function | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to Id |
| `yx` | `A5` | string | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to A5 |
| `Z0` | `Y0` | array | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to Y0 |
| `Z1` | `M1` | function | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to M1 |
| `z5` | `fw` | function | duplicate canonical signature disambiguated by declaration order: only candidate in anchor window (942..943); canon 98 chars |
| `Zc` | `Jc` | expression | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to Jc |
| `Zk` | `ax` | expression | ref-vote-relaxed0: 2/2 aligned free references across matched functions point to ax |

## 8. 引用一致性冲突（若非空，对应映射可疑，请勿直接使用）

| OLD | NEW | detail |
|---|---|---|
| `Dr` | `v3` | 3/3 aligned refs disagree |
| `Tc` | `Eu` | 2/2 aligned refs disagree |

## 9. 抽查 15 条：NEW 侧语义佐证（真实源码片段）

**证据**列可直接人工核对：`k:`/`p:` 是 NEW 侧真实存在的对象键 / 属性访问名，`S"..."` 是真实字符串字面量，`refs: a->b` 表示对齐引用；**NEW 侧源码**给出对应绑定的真实代码截断。

### `lk` → `yk`（object, high, fingerprint）

**证据**：clone fingerprint: OLD-token coverage 1.00 / dice 0.990 (runner-up 0.01); shared invariant tokens: k:% · 物品稀有度 +,s:% · Item Rarity +,k:(主动),s:(Active),k:(之后每次翻倍),s: (doubles each time after),k:(元技能),s:(Meta); literals: "% · 物品稀有度 +","% · Item Rarity +"

**NEW 侧源码（截断）**：

```js
{"% · 物品稀有度 +":"% · Item Rarity +","(主动)":"(Active)","(之后每次翻倍)":" (doubles each time after)","(元技能)":"(Meta)","(共享仓库也在里面)":" (shared stash included)","(其他部位)":"(other slots)","(兽魂已有更高的不叠加)":"(a better roll on the soul doesn't stack)","(击败更高阶首领后解锁)":"(beat a higher-tier boss to unlock more)","(导入)":"(imported)","(当前":"(currently","(每个主题 × 每个阶级的首领首杀 +1) 与征程奖励, 重复刷同一张图不再给点。同分支点亮 3 个节点即视为该路线。":"(+1 for each first boss kill per theme × tier) and quest rewards; farming the same map again gives no more points. 3 allocated nodes in one branch counts as that route.","(第":" (change #","(第 {0}{1} 次, 每次翻倍)":" (change #{0}{1}, doubles each time)","(精魄)":"(Spirit)","(辅助)":"(Support)","(途中改过配装, 这次不计纪录)":" (build changed mid-run, so no record this time)","(非引导)":"(non-channelling)",") · 在地图页批量出售, 或 3 张换 1 张高阶":") · sell in bulk on the Map tab, or trade 3 for 1 of a higher tier",") · 地图页(M)里右键出售, 或 3 张换 1 张高阶":") · right-click to sell in the Maps tab (M), or trade 3 for 1 of a higher tier",") · 请先在主界面删除旧角色":") · delete an old character on the title screen first","+2% 生命偷取":"+2% Life Leech","+3% 生命偷取, 生命低于 50% 时偷取翻倍":"+3% Life Leech, doubled while below 50% Life","+50% 暴击伤害加成":"+50% to Critical Dama
```

### `lt` → `lt`（array, high, exact-canon）

**证据**：alpha-exact array body match (28167 char canon; locals renumbered only); literals: "greedcrown","贪婪者之冠","术士头冠"

**NEW 侧源码（截断）**：

```js
[{id:"greedcrown",n:"贪婪者之冠",base:"术士头冠",lv:10,mods:[["rarity",[50,70]],["es",[30,50]],["lifeInc",[-20,-20]]],sp:[],st:[],fl:"它看得见每一枚掉在地上的金币。",src:"world"},{id:"stormgrip",n:"风暴之握",base:"丝绸手套",lv:12,mods:[["addLight",[[2,4],[30,48]]],["castSpd",[8,12]]],sp:["chain3"],st:["会连锁的技能额外连锁 3 次"],fl:"雷霆从不走直线。",src:"world"},{id:"permafrost",n:"永冻之心",base:"学徒长袍",lv:16,mods:[["es",[60,90]],["resC",[30,40]],["coldInc",[30,45]]],sp:["freezeAll"],st:["冰霜伤害击中时有 25% 几率冻结敌人"],fl:"心跳一次, 冬天就长一寸。",src:"world"},{id:"embertread",n:"余烬步履",base:"旅者之靴",lv:8,mods:[["move",[25,30]],["resF",[20,30]]],sp:["emberTrail"],st:["移动时在身后留下燃烧地面"],fl:"走过的路, 都在燃烧。",src:"world"},{id:"fleshforge",n:"血肉熔炉",base:"鸦羽长矛",lv:20,mods:[["physInc",[150,200]],["leech",[20,30]],["atkSpd",[8,12]]],sp:["meleeArea"],st:["近战范围扩大 40%"],fl:"转得越快, 喂得越饱。",src:"world"},{id:"madring",n:"疯狂之戒",base:"红玉戒指",lv:18,mods:[["eleInc",[20,30]],["life",[20,30]]],sp:["explodeAll"],st:["你击败的敌人会爆炸, 造成其最大生命 8% 的火焰伤害"],fl:"一个倒下, 一片倒下。",src:"world"},{id:"stareye",n:"星辰之眼",base:"琥珀项链",lv:25,mods:[["skillLvl",[1,1]],["castSpd",[10,15]],["resAll",[8,12]]],sp:["projAdd"],st:["投射物数量 +1"],fl:"群星从不只看一个方向。",src:"world"},{id:"voidwhisper",n:"虚空低语",base:"符文法杖",lv:30,m
```

### `Wf` → `s0`（string, high, ref-vote）

**证据**：ref-vote-r0: 5/5 aligned free references across matched functions point to s0; corroborated: 5/5 aligned references agree

**NEW 侧源码（截断）**：

```js
'<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>'
```

### `O6` → `YS`（function, high, exact-canon）

**证据**：alpha-exact function body match (49680 char canon; locals renumbered only); literals: "....a............a....","...ab............ba...","...abb..aaaaaa..bba..."

**NEW 侧源码（截断）**：

```js
function YS(){(function(){let e=["....a............a....","...ab............ba...","...abb..aaaaaa..bba...","....abbabbbbbbabba....",".....abbbbbbbbbba.....","....abbcbbbbbbcbba....","....abbbbbbbbbbbba....",".....abbddddddbba.....","...aaabbbbbbbbbbaaa...","..abbbeeeeeeeeeebbba..",".abbbeeeeffffeeeebbba.",".abbaeeeffggffeeeabba.",".abba.eeffggffee.abba.",".abba.eeeffffeee.abba.","..hh..eeeeeeeeee..hh..","..hh...eeeeeeee...hh..",".......aeeeeeea.......","......abbb..bbba......","......abb....bba......",".....abbb....bbba.....",".....aaaa....aaaa....."],t=["..........aa..........",".........abba.........","........abccba........","........abccba........"].concat(e.slice(2));xt("bishop",t,{b:"#d8d0b8",c:"#8060a0",d:"#ffffff",e:"#5a4a70",f:"#e8e0c8",g:"#c0a0ff",h:"#3a3048"}),xt("forgeking",e,{b:"#2a2220",c:"#ff6020",d:"#ffb040",e:"#4a3a30",f:"#7a2a10",g:"#ffe060",h:"#8a8a90"});let a=["...a....aa....a.......","...ab..abba..ba.......","...abbabccbabba.......","....abbbbbbbbba......."].concat(e.slice(3));xt("queen",a.map(g=>g.padEnd(22,".")),{b:"#bcdcf0",c:"#5fb4e8",d:"#ffffff",e:"#3f5a70",f:"#7d9fb8",g:"#e8fbff",h:"#9fe8ff"}),xt("mother",["......................","........aaaaaa........
```

### `m2` → `Vb`（function, high, fingerprint）

**证据**：clone fingerprint: OLD-token coverage 1.00 / dice 0.998 (runner-up 0.31); shared invariant tokens: p:setTransform,n:1,n:0,p:globalCompositeOperation,s:source-over,p:globalAlpha,p:fillStyle,s:#000; literals: "source-over","#000"

**NEW 侧源码（截断）**：

```js
function Vb(){if(f.setTransform(1,0,0,1,0,0),f.globalCompositeOperation="source-over",f.globalAlpha=1,f.fillStyle="#000",f.fillRect(0,0,ot.width,ot.height),!o.Z||!o.pl)return;let e=1+o.zoomP*re.shake,t=o.trauma*o.trauma*re.shake,a=(j()*2-1)*t*7+cn.x*re.shake,s=(j()*2-1)*t*7+cn.y*re.shake,n=ys/e,r=vs/e,i=Ta.x+ys/2+a,l=Ta.y+vs/2+s,c=U0*e;nt.l=i-n/2,nt.t=l-r/2,nt.w=n,nt.h=r,nt.s=c;let d=c*rr,p=Math.round(nt.l*d)/d,m=Math.round(nt.t*d)/d,u=()=>f.setTransform(d,0,0,d,-p*d,-m*d),y=Xe.on&&Nl();u(),f.imageSmoothingEnabled=!1;let k=Math.max(0,Math.floor(p)),g=Math.max(0,Math.floor(m)),v=Math.min(o.Z.img.width-k,Math.ceil(n)+2),S=Math.min(o.Z.img.height-g,Math.ceil(r)+2);v>0&&S>0&&f.drawImage(o.Z.img,k,g,v,S,k,g,v,S);let T=(b,C,E)=>b>p-E&&b<p+n+E&&C>m-E&&C<m+r+E;for(let b of o.decals){if(!T(b.x,b.y,20))continue;let C=b.t>b.max*.7?1-(b.t-b.max*.7)/(b.max*.3):1;f.globalAlpha=C*.85,f.fillStyle=J$[b.kind]||"#4a0c10",b.kind==="frost"&&(f.globalAlpha=C*.5);for(let[E,z,G]of b.pts)f.fillRect(Math.round(b.x+E),Math.round(b.y+z),G,G)}f.globalAlpha=1;for(let b of o.grounds)T(b.x,b.y,20)&&(f.globalAlpha=Math.min(1,b.t)*.5,f.fillStyle="#ff5a1a",f.fillRect(b.x-b.r*.6,b.y-1,b.r*1.2,2),f.fillRect(b.x-b.r*.3
```

### `TT` → `E8`（function, high, fingerprint）

**证据**：clone fingerprint: OLD-token coverage 1.00 / dice 0.998 (runner-up 0.39); shared invariant tokens: s:stats:pre,k:asc,k:add,p:has,s:precision,s:critInc,n:50,s:critMulti; literals: "stats:pre","precision"

**NEW 侧源码（截断）**：

```js
function E8(){R("stats:pre",({asc:t,add:a})=>{t.has("precision")&&(a("critInc",50),a("critMulti",25)),t.has("deadly")&&a("critMulti",50),t.has("meikyo")&&a("critMulti",60),t.has("innerForce")&&(a("eleInc",30),a("atkSpd",10)),t.has("hellfire")&&(a("fireInc",40),a("ailment",20)),t.has("bloodMagic")&&a("spellInc",40),t.has("iAmThunder")&&a("ailEff",50),t.has("gale")&&a("moveInc",15)}),R("stats:post",({S:t,asc:a})=>{a.has("bloodSurge")&&(t.maxLife*=1.25),a.has("meditate")&&(t.maxES*=1.3),a.has("emberShield")&&(t.maxES*=1.4),a.has("predatorBlood")&&(t.leech+=.02),a.has("bloodthirst")&&(t.leech+=.03),a.has("dodgeMaster")&&(t.rollCd*=.6,t.rollSpd*=1.3),a.has("gale")&&(t.rollCd*=.7)}),R("skill:conv",t=>{t.S.asc.has("oneness")&&(t.fr={light:1})}),R("skill:spell",({d:t,S:a,dmg:s})=>{if(a.asc.has("crimsonPact")&&t.base[1]>0){let n=a.maxLife*.06;s.phys[0]+=n*.8,s.phys[1]+=n*1.2}}),R("skill:calc",t=>{let a=t.S.asc;t.isAtk&&a.has("youtou")&&(t.more*=1.3,t.lifeCost=!0),t.isSpell&&a.has("bloodMagic")&&(t.lifeCost=!0),t.isProj&&(a.has("cloudPierce")&&(t.pierce+=2,t.chain+=1),a.has("amazonMight")&&(t.pierce+=1),a.has("arrowStorm")&&(t.proj+=1,t.spdMul*=1.3)),t.meleeLike&&a.has("amazonMight")&&(t.mel
```

### `K$` → `hA`（function, high, fingerprint）

**证据**：clone fingerprint: OLD-token coverage 1.00 / dice 0.999 (runner-up 0.44); shared invariant tokens: s:stats:pre,k:cls,k:add,s:sorceress,s:spellInc,n:10,s:stats:post,k:S; literals: "stats:pre","sorceress"

**NEW 侧源码（截断）**：

```js
function hA(){R("stats:pre",({cls:e,add:t})=>{e==="sorceress"&&t("spellInc",10)}),R("stats:post",({S:e,cls:t,asc:a,sp:s})=>{t==="sorceress"&&(e.maxMana*=1.2),t==="warrior"&&(e.armour*=1.3),a.has("swOverload")&&(e.maxMana*=1.3),a.has("tiStone")&&(e.armour*=2,e.maxLife*=1.1),a.has("tiLineage")&&(e.maxLife*=1.2),a.has("tiUnstop")&&(e.noStagger=!0),a.has("whRituals")&&(e.clipAdd+=3,e.grenadeCdMul*=.65),s.has("clipPlus")&&(e.clipAdd+=4,e.reloadMul*=.7),s.has("grenadeCD")&&(e.grenadeCdMul*=.6,e.grenadeArea*=1.2),s.has("orbPlus")&&(e.orbCapAdd+=1,e.orbRate*=1.5),s.has("archmagePlus")&&(e.maxMana*=1.25),s.has("cryPlus")&&(e.cryAdd+=3)}),R("stats:pre",({asc:e,add:t})=>{e.has("swOverload")&&t("lightInc",40)}),R("hit:land",e=>{if(e.fixed)return;let t=1;o.S.cls==="warrior"&&(t*=1.25),qt("tiHulk")&&e.o.melee&&(t*=1.5),RS("quakeTwice")&&V0(e.c)&&(t*=1.3),t!==1&&(e.o={...e.o,stunMul:(e.o.stunMul||1)*t})},20),R("roll",()=>{if(o.S.cls!=="mercenary"||!o.pl)return;let e=!1;for(let t=0;t<7;t++){let a=o.SKC[t];a&&a.clip&&o.pl.ammo&&o.pl.ammo[a.gid]<a.clip&&(e=!0)}uy();for(let t in o.pl.reloadT)o.pl.reloadT[t]=0;e&&(M("reload",1),U(o.pl.x,o.pl.y-24,0,!1,"info","战术装填"))}),R("skill:calc",e=>{let t=e.S;e.c
```

### `P6` → `QS`（function, high, exact-canon）

**证据**：alpha-exact function body match (33681 char canon; locals renumbered only); literals: "hero_","zombie","....aaaa...."

**NEW 侧源码（截断）**：

```js
function QS(){for(let e in Rt)Rt[e].fr=zk.map((t,a)=>xt("hero_"+e+a,Rt[e].rows.concat(Rt[e].legs?Rt[e].legs[a]:t),{...Rt[e].pal}));xt("zombie",["....aaaa....","...abbbba...","...acbbca...","...abbbba...","...abddba...","..aaabbaaa..",".abeeeeeeba.","ab.eeffee.ba","b..eeeeee..b","...eeeeee...","...aeeeea...","...ah..ha...","...ah..ha...","..aah..haa.."],{b:"#6f8a5a",c:"#d8f070",d:"#3a1414",e:"#4a4038",f:"#7a2020",h:"#3a3a2a"}),xt("skel",["...aaaa....","..abbbba...","..acbbca...","..abbbba..e","...addda.e.","..aabba..e.",".ab.abba.e.","ab.abbbabe.","...abbba.e.","...a.b.a..e","....b.b....","...ab.ba...","...b...b...","..bb...bb.."],{b:"#d8d0b8",c:"#ff4030",d:"#8a8070",e:"#9a6a32"}),xt("imp",uh,{b:"#c8401a",c:"#ffe060",d:"#401008",e:"#ff9a40"}),xt("riftling",uh,{b:"#6a3aa8",c:"#ff70ff",d:"#200838",e:"#b080ff"}),xt("cultist",["....aa....","...abba...","..abbbba..","..abccba..","..acddca..","..abccba..","...abba...","..aeeeea..",".aeeffeea.","gaeeffeeag",".aeeffeea.",".aeeeeeea.",".aeeeeeea.","aeeeeeeeea","aaaaaaaaaa"],{b:"#2a4a6a",c:"#0c141c",d:"#80e8ff",e:"#3a5a7a",f:"#a8d0e8",g:"#c8f4ff"}),xt("brute",["......aaaa......",".....abbbba.....","....abcbbcba....","....abbbbbba....","..aaab
```

### `s$` → `jT`（function, high, fingerprint）

**证据**：clone fingerprint: OLD-token coverage 1.00 / dice 0.998 (runner-up 0.18); shared invariant tokens: p:addEventListener,s:#panel,s:click,p:held,p:closest,p:target,s:[data-act="cur"],s:[data-craft]; literals: "#panel","click"

**NEW 侧源码（截断）**：

```js
function jT(){A("#panel").addEventListener("click",n=>{let r=o.held&&!n.target.closest('[data-act="cur"]')&&n.target.closest("[data-craft]");if(r){let l=aa(r.dataset.craft);if(l){let c=l.it,d=c.mods?Ci(c):null;Sa.last=null;let p=Bo(o.held,c);if(p){P(p);return}h.cur[o.held]--,(c.kind==="item"||c.kind==="soul")&&jf(o.held,c,Rr(o.held,c,d)),c.kind==="map"&&(c.invest=(c.invest||0)+F[o.held].v),M("craft"),(o.held==="divine"||o.held==="exalt")&&M(o.held==="divine"?"chaos":"exalt",.6),(l.loc==="eq"||l.loc==="skill"||l.loc==="gems"||l.loc==="minner"||l.loc==="beast")&&me();let m=o.held;(!n.shiftKey||!h.cur[m])&&Za(null),ms();let u=document.querySelector(`[data-craft="${c.uid}"]`);u&&u.classList.add("pop"),o.tipKey=null,c0(fc("it:"+c.uid),n.clientX,n.clientY),o.held&&Za(o.held);return}}let i=n.target.closest("[data-act]");i&&$p(i.dataset.act,i,n)!==!1&&(ms(),o.tipKey=null)}),A("#panel").addEventListener("contextmenu",n=>{if(n.preventDefault(),o.touchMode&&o.lastPtr!=="mouse"){P('触屏上长按不会出售 · 请在商人处的"出售"页卖东西');return}if(o.held){Za(null);return}let r=n.target.closest('[data-act="gact"],[data-act="gsup"],[data-act="bact"]');if(r){let c=aa(r.dataset.uid);if(c&&c.loc==="gems"&&d0(c.it)){let d=Ro(c
```

### `ei` → `si`（function, high, fingerprint）

**证据**：clone fingerprint: OLD-token coverage 1.00 / dice 0.998 (runner-up 0.45); shared invariant tokens: p:c,p:src,p:kind,p:ang,p:PI,p:x,p:pl,p:y; literals: "heavy","#e0c080"

**NEW 侧源码（截断）**：

```js
function si(e){let t=e.c,a=e.src;switch(e.kind){case"escape":{let n=e.ang+Math.PI,r=o.pl.x,i=o.pl.y;if(t.d.disengage){let l=(t.d.r||28)*t.meleeArea;for(let c of o.mons)c.dead||(c.x-r)**2+(c.y-i)**2<(l+c.r)**2&&(ee(c,t,a,1,{weight:"heavy",dir:Math.atan2(c.y-i,c.x-r),melee:!0}),c.kbx+=Math.cos(Math.atan2(c.y-i,c.x-r))*120,c.kby+=Math.sin(Math.atan2(c.y-i,c.x-r))*120);o.pl.smears.push({x:r,y:i-6,a0:0,a1:6.28,r:l,col:"#e0c080",t:0,max:.15}),o.pl.disT=3,M("spear",1.2)}else o.pend.push({t:.05,fn:()=>{o.fx.push({k:"ring",x:r,y:i,r0:4,r1:t.r,t:0,max:.3,col:"#bfefff",w:2.5}),L(r,i,30,["#e8fbff","#9fe8ff","#5fb4e8"],110,.5,{glow:!0,vz:70}),M("ice",1.2);for(let l of o.mons)l.dead||(l.x-r)**2+(l.y-i)**2<(t.r+l.r)**2&&(ee(l,t,a,1,{weight:"mid",el:"cold"}),!l.dead&&l.rar<=1&&(l.frozen=Math.max(l.frozen,.9)))}}),M("bowRel");o.pl.roll=.2,o.pl.rollT0=-9,o.pl.rvx=Math.cos(n)*270,o.pl.rvy=Math.sin(n)*270,o.pl.iframe=Math.max(o.pl.iframe,.28),o.pl.rollHit.clear(),e.dur=e.t+.05;return}case"mark":{let n=e.aim,r=null,i=3600;for(let l of o.mons){if(l.dead||l.dummy&&!1||Math.hypot(l.x-o.pl.x,l.y-o.pl.y)>220)continue;let c=(l.x-n.x)**2+(l.y-n.y)**2;c<i&&(i=c,r=l)}if(!r)for(let l of o.mons){if(l.dead)continu
```

### `z6` → `JS`（function, high, exact-canon）

**证据**：alpha-exact function body match (31781 char canon; locals renumbered only); literals: "..aa......","..abba....","..abcba..."

**NEW 侧源码（截断）**：

```js
function JS(){(function(){let e={quiver:["..aa......","..abba....","..abcba...","...abcba..","...abbbba.","....abbba.","....abbba.",".....abba.",".....aaa..",".........."],shield:["..aaaaaa..",".abbbbbba.",".abccccba.",".abcddcba.",".abcddcba.",".abccccba.","..abbbba..","...abba...","....aa....",".........."],focus:["....aa....","...abba...","..abccba..",".abcddcba.",".abcddcba.","..abccba..","...abba...","....aa....","..........",".........."],waki:["........c.",".......cb.","......cb..",".....cb...","....cb....","...ee.....","..hh......",".hh.......","..........",".........."],belt:["..........","..........","aaaaaaaaaa","abbbccbbba","abbbcdcbba","abbbccbbba","aaaaaaaaaa","..........","..........",".........."],wand:[".......dd.","......dccd","......dccd",".......dd.","......b...",".....b....","....b.....","...b......","..........",".........."],buff:["....aa....","...abba...","..abccba..",".abccccba.","abccddccba",".abccccba.","..abccba..","...abba...","....aa....",".........."]},t={quiver:{b:"#7a5a32",c:"#c8b890"},shield:{b:"#7a6a5a",c:"#a89070",d:"#c8a040"},focus:{b:"#5a3a7a",c:"#9a70d0",d:"#e0c8ff"},waki:{b:"#9aa4b0",c:"#e8eef4",e:"#c8a040",h:"#2a2a40"},belt:{b:"#6a4a2a",c:"#
```

### `HS` → `$M`（function, high, fingerprint）

**证据**：clone fingerprint: OLD-token coverage 1.00 / dice 0.998 (runner-up 0.40); shared invariant tokens: p:selSoul,null,p:gid,p:sel,p:uid,p:join,p:map,p:skills; literals: " on"," bad"

**NEW 侧源码（截断）**：

```js
function $M(){let e=o.selSoul!=null,t=ha(),a=e?null:tc(),s=a?X[a.gid]:null,n=w=>q.sel&&q.sel.uid===w,r=h.skills.map((w,$)=>{let I=!e&&!o.selMeta&&$===o.selSlot,b=o.SKC[$];return w?`<button class="mgsl${I?" on":""}${b&&!b.wtOK?" bad":""}" data-m="slot" data-i="${$}"><span class="mk">${hs[$]}</span><span class="mic"><img src="${D[w.gid]}" alt=""></span><span class="mn"><b>${X[w.gid].n}<em>Lv ${w.lvl}</em></b><small>${b?b.wtOK?"DPS "+Pe(b.dps):'<i class="neg">需要'+b.wtNeed+"</i>":""}</small>${rw(w,b)}${TM(w)}</span></button>`:`<button class="mgsl e${I?" on":""}" data-m="slot" data-i="${$}"><span class="mk">${hs[$]}</span><span class="mic"></span><span class="mn"><b>空技能槽</b><small>点这里, 再从「主动」里选</small></span></button>`}).join(""),i=h.buffs.map((w,$)=>{if(!w)return'<div class="mgsl e sm"><span class="mn"><small>空精魂槽 · 从「精魂」里装备</small></span></div>';let I=o.S.buffs.has(w.gid);if(w.kind==="buff")return`<button class="mgsl sm${n(w.uid)?" on":""}${I?"":" off"}" data-m="sel" data-uid="${w.uid}"><span class="mic"><img src="${D["buff_"+w.gid]}" alt=""></span><span class="mn"><b style="color:${Ee[w.gid].col}">${Ee[w.gid].n}</b><small>${Ee[w.gid].spirit} 精魂${I?"":' · <i class="neg">精魂不足</i>'}</sm
```

### `X` → `X`（object, high, fingerprint）

**证据**：clone fingerprint: OLD-token coverage 1.00 / dice 1.000 (runner-up 0.21); shared invariant tokens: k:fireball,k:n,s:火球术,k:tags,s:spell,s:proj,s:fire,s:aoe; literals: "火球术","spell"

**NEW 侧源码（截断）**：

```js
{fireball:{n:"火球术",tags:["spell","proj","fire","aoe"],base:[7,11],cast:.75,crit:6,cost:6,el:"fire",spd:210,r:16,bh:"proj",d:"发射一枚火球, 命中或撞墙时爆炸, 波及周围敌人。"},icespear:{n:"冰矛",tags:["spell","proj","cold"],base:[6,10],cast:.6,crit:9,cost:6,el:"cold",spd:320,pierce:2,bh:"proj",d:"高速冰矛, 自带穿透 2, 高暴击。"},arc:{n:"电弧",tags:["spell","chain","light"],base:[2,17],cast:.7,crit:5,cost:7,el:"light",chain:4,bh:"arc",d:"释放闪电, 在敌人之间连锁弹跳 4 次。"},nova:{n:"冰霜新星",tags:["spell","aoe","cold"],base:[8,13],cast:.65,crit:6,cost:9,el:"cold",r:52,bh:"nova",d:"以自身为中心爆发寒气, 必定冰缓。"},meteor:{n:"陨石术",tags:["spell","aoe","fire"],base:[22,34],cast:1.1,crit:7,cost:14,el:"fire",r:38,delay:.55,bh:"meteor",d:"召唤陨石砸向目标区域, 延迟后造成巨额范围伤害。"},larrow:{n:"闪电箭",tags:["attack","proj","light","bow"],eff:1,conv:{light:.5},wt:["bow"],cost:5,spd:360,el:"light",bh:"proj",bolts:2,d:"射出闪电箭, 命中时向附近 2 个敌人放出电弧(40% 伤害)。50% 物理转为闪电。"},iceshot:{n:"冰霜射击",tags:["attack","proj","cold","aoe","bow"],eff:1.15,conv:{cold:.6},wt:["bow"],cost:6,spd:300,pierce:2,r:13,el:"cold",bh:"proj",d:"穿透 2 个敌人, 每次命中迸发冰晶(50% 范围伤害)。60% 物理转为冰霜。"},rain:{n:"箭雨",tags:["attack","aoe","bow","phys"],eff:1,wt:["bow"],cost:8,r:30,el:"phys",bh:"rain",arrows:7,dpsMul:2.4,d:"向目标区域倾泻 7 支箭
```

### `ze` → `Me`（object, high, exact-canon）

**证据**：alpha-exact object body match (16780 char canon; locals renumbered only); literals: "锐眼","ranger","#a8e070"

**NEW 侧源码（截断）**：

```js
{deadeye:{n:"锐眼",cls:"ranger",col:"#a8e070",src:"POE2",d:"风与远射: 越远越痛, 翻滚即是进攻。",nodes:[{k:"tailwind",n:"顺风",d:"翻滚后 2 秒内攻击与施法速度 +30%, 移动速度 +20%"},{k:"dodgeMaster",n:"闪避大师",d:"翻滚冷却 -40%, 翻滚距离 +30%"},{k:"farShot",n:"远射",d:"投射物伤害随飞行距离提高, 最高 +50%"},{k:"cloudPierce",n:"穿云",d:"投射物额外穿透 2 个敌人, 连锁 +1"},{k:"arrowStorm",n:"箭矢风暴",d:"投射物 +1, 投射物速度 +30%"},{k:"markPrey",n:"标记猎物",d:"击中稀有/首领敌人时将其标记: 受到你的伤害 +30%。击杀被标记者后 4 秒内移动速度 +20%"}]},falcon:{n:"隼瞳",cls:"ranger",col:"#d8c070",src:"原创",d:"站桩狙击: 静止积蓄凝神, 一箭定乾坤。",nodes:[{k:"focus",n:"凝神",d:"静止时每 0.4 秒获得 1 层凝神(上限 5): 每层伤害 +10%, 暴击率提高 25%。移动 0.6 秒后清空"},{k:"execute",n:"处决",d:"对生命低于 25% 的敌人伤害 +60%"},{k:"deadly",n:"致命一击",d:"+50% 暴击伤害加成"},{k:"soulHarvest",n:"灵魂收割",d:"击杀敌人回复 2% 生命与 3% 魔力"},{k:"shadowArrow",n:"幽影箭",d:"暴击时 35% 几率额外射出 2 支追踪幽影箭(50% 伤害)"},{k:"thousand",n:"万箭归宗",d:"凝神满 5 层时, 下一次攻击投射物数量翻倍并消耗凝神"}]},amazon:{n:"亚马逊",cls:"huntress",col:"#e8a050",src:"POE2",d:"猎杀者: 第一击决定一切。",nodes:[{k:"hunter",n:"狩猎本能",d:"对满血敌人伤害 +60%"},{k:"precision",n:"精准打击",d:"暴击率提高 50%, +25% 暴击伤害加成"},{k:"predatorBlood",n:"掠食者之血",d:"+2% 生命偷取"},{k:"amazonMight",n:"亚马逊之力",d:"近战范围扩大 25%, 投射物额外穿透 1"},{k:"infusion",n:"元素灌注",d:"攻击额外附加 25% 伤害, 平均分为火焰、冰霜和闪电"},{k:"overlord",n:"战场霸主",d:"击败稀有或首领
```

### `es` → `es`（array, high, exact-canon）

**证据**：alpha-exact array body match (24736 char canon; locals renumbered only); literals: "witch","冰封连锁","冻结时施放 + 彗星 / 冰霜炸弹(编织者 CoF)"

**NEW 侧源码（截断）**：

```js
[{cls:"witch",n:"冰封连锁",ref:"冻结时施放 + 彗星 / 冰霜炸弹(编织者 CoF)",d:"冰矛与冰霜新星负责冻结, 冻结时施放自动砸彗星与冰霜炸弹; 冰缚提高冻结率, 霜冠与冰棱镜是毕业件。",skills:[["icespear",["icebite","gmp","pierce","critsup","unleash"]],["nova",["icebite","incaoe","conc","speed"]],["frostbomb",["incaoe","icebite","conc"]],["flamewall",[]]],metas:[["meta_cof",["comet","frostbomb"]]],buff:"iceHerald",uniq:["frostcrown","iceprism","wintergrip"]},{cls:"witch",n:"焚化地狱",ref:"焚化地狱术士(Incinerate Infernalist · 0.5 地狱术士主流)",d:"站定喷火: 焚化引导越久越猛(最多 ×3), 元素异常把点燃推高, 熔心让点燃蔓延; 引爆辅助让火球击杀连环爆炸, 受伤时施放自动砸陨石保命。",skills:[["incinerate",["ailsup","conc","incaoe","critsup"]],["flamewall",[]],["fireball",["detonate","gmp","incaoe"]],["detonate",["incaoe","conc"]]],metas:[["meta_cwdt",["meteor","nova"]]],buff:"ashHerald",uniq:["moltenheart","madring","embertread"]},{cls:"witch",n:"电光弹幕",ref:"电光火花风暴编织者(Spark Stormweaver)",d:"火花在走廊里反弹, 过载把感电推到 80%, 电弧补连锁; 暴击时施放挂陨石处理精英。",skills:[["spark",["ricochet","overcharge","gmp","critsup","unleash"]],["arc",["chain","overcharge","critsup","efocus"]],["flamewall",[]]],metas:[["meta_coc",["meteor","frostbomb"]]],buff:"thunderHerald",uniq:["overcore","echoring"]},{cls:"ranger",n:"弹射闪电箭",ref:"闪电箭锐眼(Lightning Arrow Deadeye)",d:"闪电箭带弹射与分叉
```

## 10. unresolved 完整名单

### 10.1 必需名里的 unresolved（优先处理）

`ct`、`Ay`、`fe`、`qv`、`Qv`

### 10.2 OLD 里存在但未映射的顶层绑定（按体积排序，前 60）

`M8`(expression,4103B)、`JT`(expression,1425B)、`g6`(array,700B)、`eu`(function,498B)、`zM`(function,486B)、`_T`(function,478B)、`Mp`(string,462B)、`gw`(string,425B)、`aM`(expression,385B)、`s3`(function,382B)、`yw`(function,366B)、`Z8`(function,361B)、`tA`(array,333B)、`M2`(expression,302B)、`j8`(expression,298B)、`ug`(function,296B)、`eA`(array,263B)、`YT`(expression,241B)、`I8`(expression,239B)、`E5`(function,235B)、`dw`(function,234B)、`Nh`(expression,231B)、`lw`(function,230B)、`fw`(function,227B)、`G4`(function,226B)、`RT`(function,211B)、`MM`(expression,206B)、`t4`(function,202B)、`vy`(function,201B)、`WT`(expression,191B)、`Pf`(function,182B)、`V8`(function,180B)、`CS`(function,169B)、`u4`(function,166B)、`R5`(function,165B)、`Tv`(expression,165B)、`T4`(function,163B)、`I0`(function,160B)、`q1`(function,154B)、`TS`(expression,152B)、`T2`(expression,149B)、`vp`(function,137B)、`LM`(function,136B)、`zf`(function,133B)、`a1`(function,131B)、`C1`(function,131B)、`ET`(function,130B)、`E$`(function,122B)、`j$`(function,122B)、`vS`(function,121B)、`ZT`(function,120B)、`vM`(function,116B)、`GT`(function,116B)、`e8`(expression,114B)、`Xm`(function,114B)、`Cp`(function,108B)、`gg`(function,103B)、`Us`(function,102B)、`Ol`(function,99B)、`ov`(function,99B)

## 11. 我们自己的名字（不是基础 API，不要查本表）

`api_surface.txt` 里出现、但 OLD/NEW 顶层都没有的标识符：我们自己的函数/局部名或 JS 内建。它们随移植块原样带入，只需注意 README §7 的遮蔽问题。

## 12. 安全使用建议

1. **只用 `confidence=high`** 做自动改写；`medium` 的改写后必须跑 `er-check` 语法检查 + jsdom 引导 + 对应玩法断言。
2. 改写必须用 AST 两步法（README §7）：先对我们的代码做 alpha 重命名，再把自由引用按本表翻译；**禁止文本替换** —— 表里 OLD 名常是 `o`/`u`/`n`/`e` 这类短名，文本替换会造成遮蔽 bug。
3. `unresolved` 里的名字不要凭语义直觉硬填；改为在移植块里新增兼容访问器，或用运行时探测（在 NEW 里按属性键/字面量定位）。
4. NEW 自带的新玩法可能改写过同一函数：映射只保证「OLD 名字 ≈ NEW 名字」的对应关系，**不保证 NEW 侧函数体与 OLD 相同**。改写前先用 `node symmap.mjs probe <OLD名>` 看 NEW 侧源码确认语义。
5. wrap 目标（§4）语义上都是「我们的钩子必须插进去」的函数；劫持方式见 README §4 的第 3 节：先存旧引用，再重新赋值包装，**不要**原地改函数体。

