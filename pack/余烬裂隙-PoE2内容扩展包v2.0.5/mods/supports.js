/* ============================================================
 * 新辅助宝石（余烬裂隙扩展包）
 * ------------------------------------------------------------
 * 用法：往下复制一段 push({...})，保存后重新构建：
 *     node 迁移工具/build/build.mjs
 * 辅助宝石会出现在商店/调试“全部宝石”里，可插到技能上。
 *
 * 字段说明（必填：id / n / req / d）：
 *   id     唯一英文 id（建议 mods_ 开头）
 *   n      显示名
 *   req    可辅助的技能标签限制，如 "proj" / "aoe" / "spell"；
 *          空字符串 "" = 任何技能都能插
 *   d      说明文本
 *   more   伤害总增倍率：1.1 = 总增 10%，0.9 = 总降 10%（可选）
 *   proj   额外投射物数量（可选）
 *   pierce 额外穿透数量（可选）
 *   chain  额外连锁次数（可选）
 *   aoe    范围倍率：1.5 = 范围 +50%（可选）
 *   critInc 暴击率提高（百分点，可选）
 *   critMulti 暴击伤害加成（百分点，可选）
 *   spd    施法/攻击速度倍率（可选）
 *   enabled:false  可选；写 false 会跳过这条
 * ============================================================ */
window.RIFT_EXTRA_SUPPORTS = window.RIFT_EXTRA_SUPPORTS || [];



window.RIFT_EXTRA_SUPPORTS.push({
  id: "mods_atu_bloodletting",
  n: "阿图鲁伊的放血术",
  req: "",
  d: "被辅助技能消耗等同其魔力消耗的生命；每消耗 1 点生命，元素伤害总增 5%，最多 100%。"
});

/* 再来一个示例（默认关闭）：
window.RIFT_EXTRA_SUPPORTS.push({
  id: "mods_wide_shot",
  n: "示例 · 散射",
  req: "proj",
  proj: 2,
  more: 0.85,
  d: "工程示例：投射物 +2，总降 15% 伤害。",
  enabled: false
});
*/

