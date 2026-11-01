/* ============================================================
 * 星图联动效果（余烬裂隙扩展包）
 * ------------------------------------------------------------
 * 星图节点本身不直接加属性；这里定义"基底天赋组合 → 特殊词条"。
 * 改完保存后运行：node 迁移工具/build/build.mjs
 *
 * 字段：
 *   id      唯一英文 id
 *   n       名称（显示在星图节点/已激活列表）
 *   region  对应基底区域：fire / cold / light / phys / minion / defence / currency
 *   d       星图节点说明
 *   require 触发条件：
 *            tags: ["cold","defence"]  基底已点节点需要覆盖的标签（都要有）
 *            nodes: ["adv_cold_3"]     可选，指定必须点亮的基底节点
 *            min: 2                    至少匹配几个基底节点（默认 tags 数量）
 *   text    追加到基底节点的词条文案（{0} 会替换 stats 的第一个值）
 *   stats   可选，沿用游戏现有结算键（没有对应键时只显示文案）
 *   enabled:false 可选，跳过
 * ============================================================ */
window.RIFT_STAR_EFFECTS = window.RIFT_STAR_EFFECTS || [];

window.RIFT_STAR_EFFECTS.push(
  {
    id: "star_cold_es_1",
    n: "寒冰护盾",
    region: "cold",
    d: "冰霜伤害的 8% 转化为能量护盾",
    require: { tags: ["cold", "defence"], min: 2 },
    text: "冰霜伤害的 {0}% 转化为能量护盾",
    stats: { esPct: 40 }
  },
  {
    id: "star_cold_es_2",
    n: "极寒屏障",
    region: "cold",
    d: "护盾对冰霜伤害额外减伤 12%",
    require: { tags: ["cold", "defence"], min: 3 },
    text: "护盾对冰霜伤害额外减伤 {0}%",
    stats: { coldShieldDR: 40 }
  },
  {
    id: "star_fire_life_1",
    n: "燃血",
    region: "fire",
    d: "火焰伤害的 6% 转化为生命回复",
    require: { tags: ["fire", "life"], min: 2 },
    text: "火焰伤害的 {0}% 转化为生命回复",
    stats: { fireLeech: 40 }
  },
  {
    id: "star_light_crit_1",
    n: "雷暴聚焦",
    region: "light",
    d: "对感电敌人暴击率 +15%",
    require: { tags: ["light", "crit"], min: 2 },
    text: "对感电敌人暴击率 +{0}%",
    stats: { critVsShock: 40 }
  },
  {
    id: "star_minion_def_1",
    n: "亡者壁垒",
    region: "minion",
    d: "召唤物获得你 30% 的护甲",
    require: { tags: ["minion", "defence"], min: 2 },
    text: "召唤物获得你 {0}% 的护甲",
    stats: { minionArmourPct: 40 }
  },
  {
    id: "star_phys_es_1",
    n: "钢铁意志",
    region: "phys",
    d: "物理伤害的 5% 转化为能量护盾",
    require: { tags: ["phys", "defence"], min: 2 },
    text: "物理伤害的 {0}% 转化为能量护盾",
    stats: { physToEs: 40 }
  },
  {
    id: "star_currency_life_1",
    n: "富贵险中求",
    region: "currency",
    d: "通货掉落 +5%，生命上限 -2%",
    require: { tags: ["currency", "life"], min: 2 },
    text: "通货掉落 +{0}%，生命上限 -2%",
    stats: { currencyInc: 40 }
  }
);

/* ==================== 2.0.4 新增：三属性组合星图联动 ==================== */
window.RIFT_STAR_EFFECTS.push(
  {
    id: "star_syn_fire_crit_spell",
    n: "烈焰风暴",
    region: "fire",
    d: "火焰、暴击、施法速度三重联动",
    require: { tags: ["fire", "crit", "spell"], min: 3 },
    text: "火焰伤害 +{0}%，暴击率 +{1}%，施法速度 +{2}%",
    stats: { fireInc: 35, critInc: 25, castSpd: 10 }
  },
  {
    id: "star_syn_cold_life_def",
    n: "冰川之心",
    region: "cold",
    d: "冰霜、生命、防御三重联动",
    require: { tags: ["cold", "life", "defence"], min: 3 },
    text: "冰霜伤害 +{0}%，能量护盾 +{1}，全元素抗性 +{2}%",
    stats: { coldInc: 35, es: 120, resAll: 8 }
  },
  {
    id: "star_syn_light_crit_life",
    n: "雷霆引擎",
    region: "light",
    d: "闪电、暴击、生命三重联动",
    require: { tags: ["light", "crit", "life"], min: 3 },
    text: "闪电伤害 +{0}%，暴击伤害 +{1}%，移动速度 +{2}%",
    stats: { lightInc: 35, critMulti: 35, moveInc: 8 }
  },
  {
    id: "star_syn_phys_life_def",
    n: "钢铁血脉",
    region: "phys",
    d: "物理、生命、防御三重联动",
    require: { tags: ["phys", "life", "defence"], min: 3 },
    text: "物理伤害 +{0}%，生命 +{1}%，护甲 +{2}，生命偷取 +{3}%",
    stats: { physInc: 35, lifeInc: 10, armour: 150, leech: 0.4 }
  },
  {
    id: "star_syn_minion_life_def",
    n: "万兽之王",
    region: "minion",
    d: "召唤物、生命、防御三重联动",
    require: { tags: ["minion", "life", "defence"], min: 3 },
    text: "召唤物伤害 +{0}%，最大生命 +{1}，护甲 +{2}",
    stats: { minionInc: 40, life: 60, armour: 120 }
  },
  {
    id: "star_syn_currency_crit_life",
    n: "财富猎手",
    region: "currency",
    d: "通货、暴击、生命三重联动",
    require: { tags: ["currency", "crit", "life"], min: 3 },
    text: "物品稀有度 +{0}%，物品数量 +{1}%，最大生命 +{2}",
    stats: { rarity: 80, quant: 40, life: 50 }
  },
  {
    id: "star_syn_tri_element",
    n: "三相共鸣",
    region: "light",
    d: "火、冰、电三系同时点亮",
    require: { tags: ["fire", "cold", "light"], min: 3 },
    text: "火焰伤害 +{0}%，冰霜伤害 +{1}%，闪电伤害 +{2}%，全元素抗性 +{3}%",
    stats: { fireInc: 25, coldInc: 25, lightInc: 25, resAll: 10 }
  },
  {
    id: "star_syn_ele_def",
    n: "元素壁垒",
    region: "defence",
    d: "火冰与防御联动",
    require: { tags: ["fire", "cold", "defence"], min: 2 },
    text: "火焰抗性 +{0}%，冰霜抗性 +{1}%，能量护盾 +{2}",
    stats: { resF: 20, resC: 20, es: 100 }
  },
  {
    id: "star_syn_phys_crit_currency",
    n: "混沌契约",
    region: "currency",
    d: "物理、暴击、通货三重联动",
    require: { tags: ["phys", "crit", "currency"], min: 3 },
    text: "物理伤害 +{0}%，暴击伤害 +{1}%，物品稀有度 +{2}%",
    stats: { physInc: 40, critMulti: 40, rarity: 50 }
  },
  {
    id: "star_syn_minion_def_currency",
    n: "守护者",
    region: "minion",
    d: "召唤物、防御、通货三重联动",
    require: { tags: ["minion", "defence", "currency"], min: 3 },
    text: "召唤物伤害 +{0}%，护甲 +{1}，物品稀有度 +{2}%",
    stats: { minionInc: 30, armour: 180, rarity: 40 }
  }
);
