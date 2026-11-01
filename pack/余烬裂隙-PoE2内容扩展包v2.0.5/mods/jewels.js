/* ============================================================
 * 天赋树珠宝（余烬裂隙扩展包）
 * ------------------------------------------------------------
 * 珠宝会掉落到背包，可镶嵌到高级天赋树的珠宝栏位（点亮珠宝栏位后）。
 * 往数组里 push 一条，保存后重新构建：
 *     node 迁移工具/build/build.mjs
 *
 * 字段：
 *   id     唯一英文 id
 *   n      显示名
 *   tier   1/2/3（影响掉落权重/颜色）
 *   stats  [属性键, 数值] 数组（用游戏已有属性键，如 life/es/resAll/coldInc/critInc 等）
 *   w      掉落权重（可选，默认 10）
 *   d      说明
 * ============================================================ */
window.RIFT_EXTRA_JEWELS = window.RIFT_EXTRA_JEWELS || [];

window.RIFT_EXTRA_JEWELS.push(
  {
    id: "jewel_cold_1",
    n: "寒冰珠宝",
    tier: 1,
    w: 14,
    stats: [["coldInc", 8], ["esPct", 4]],
    d: "冰霜伤害 +8% · 能量护盾 +4%"
  },
  {
    id: "jewel_life_1",
    n: "生命珠宝",
    tier: 1,
    w: 14,
    stats: [["life", 25], ["resAll", 4]],
    d: "生命上限 +25 · 全抗 +4%"
  },
  {
    id: "jewel_crit_1",
    n: "锐利珠宝",
    tier: 2,
    w: 8,
    stats: [["critInc", 12], ["critMulti", 10]],
    d: "暴击率 +12% · 暴击伤害 +10%"
  },
  {
    id: "jewel_phys_1",
    n: "沉重珠宝",
    tier: 2,
    w: 8,
    stats: [["physInc", 12], ["atkSpd", 3]],
    d: "物理伤害 +12% · 攻击速度 +3%"
  },
  {
    id: "jewel_star_1",
    n: "星辉珠宝",
    tier: 3,
    w: 3,
    stats: [["lightInc", 10], ["castSpd", 5], ["mana", 20]],
    d: "闪电伤害 +10% · 施法速度 +5% · 魔力 +20"
  },
  // ---- 基础珠宝（tier 1 · 前期也能掉落） ----
  {
    id: "jewel_fire_1",
    n: "余烬珠宝",
    tier: 1,
    w: 16,
    stats: [["fireInc", 8], ["life", 15]],
    d: "火焰伤害 +8% · 生命上限 +15"
  },
  {
    id: "jewel_light_1",
    n: "雷光珠宝",
    tier: 1,
    w: 16,
    stats: [["lightInc", 8], ["castSpd", 3]],
    d: "闪电伤害 +8% · 施法速度 +3%"
  },
  {
    id: "jewel_es_1",
    n: "护盾珠宝",
    tier: 1,
    w: 16,
    stats: [["esPct", 6], ["mana", 15]],
    d: "能量护盾 +6% · 魔力 +15"
  },
  {
    id: "jewel_res_1",
    n: "抗性珠宝",
    tier: 1,
    w: 16,
    stats: [["resAll", 6]],
    d: "全部元素抗性 +6%"
  },
  {
    id: "jewel_speed_1",
    n: "迅捷珠宝",
    tier: 1,
    w: 14,
    stats: [["atkSpd", 2], ["castSpd", 2]],
    d: "攻击速度 +2% · 施法速度 +2%"
  },
  {
    id: "jewel_minion_1",
    n: "兽群珠宝",
    tier: 1,
    w: 14,
    stats: [["minionInc", 8], ["minionSpd", 5]],
    d: "召唤物伤害 +8% · 召唤物攻速/施法 +5%"
  }
);
