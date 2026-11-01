/* 符文之语（余烬裂隙扩展包）
 * 数据已整体加强；高级符文之语额外附带传奇词缀。
 * 字段：id / n / seq 符文序号 / req / w 武器效果 / a 防具效果 / d 说明
 */
window.RIFT_RUNEWORDS = window.RIFT_RUNEWORDS || [];

window.RIFT_RUNEWORDS.push(...[
  {
    "id": "steel",
    "n": "钢铁",
    "seq": [
      1,
      3
    ],
    "req": "weapon",
    "w": [
      [
        "physInc",
        70
      ],
      [
        "atkSpd",
        16
      ]
    ],
    "a": [
      [
        "armour",
        160
      ],
      [
        "resF",
        20
      ]
    ],
    "d": [
      "前期物理武器首选 · 物理伤害与攻速"
    ]
  },
  {
    "id": "radiance",
    "n": "灵光",
    "seq": [
      5,
      8
    ],
    "req": "helm|body",
    "w": [
      [
        "spellInc",
        30
      ],
      [
        "mana",
        80
      ]
    ],
    "a": [
      [
        "resAll",
        24
      ],
      [
        "es",
        160
      ],
      [
        "manaRegen",
        20
      ]
    ],
    "d": [
      "头盔/胸甲：全抗与能量护盾"
    ]
  },
  {
    "id": "storm",
    "n": "暴风",
    "seq": [
      12,
      10,
      15
    ],
    "req": "staff",
    "w": [
      [
        "castSpd",
        30
      ],
      [
        "lightInc",
        40
      ],
      [
        "skillLvl",
        2
      ]
    ],
    "a": [
      [
        "resL",
        50
      ],
      [
        "castSpd",
        16
      ]
    ],
    "d": [
      "法杖/长棍：施法速度与闪电技能等级"
    ]
  },
  {
    "id": "abysswhisper",
    "n": "深渊低语",
    "seq": [
      20,
      24,
      18
    ],
    "req": "any",
    "w": [
      [
        "life",
        96
      ],
      [
        "quant",
        36
      ],
      [
        "rarity",
        36
      ]
    ],
    "a": [
      [
        "life",
        144
      ],
      [
        "quant",
        48
      ],
      [
        "rarity",
        48
      ]
    ],
    "d": [
      "任意装备：生命与掉落收益"
    ]
  },
  {
    "id": "monarch",
    "n": "君主",
    "seq": [
      28,
      31,
      25
    ],
    "req": "body",
    "w": [
      [
        "life",
        180
      ],
      [
        "armour",
        300
      ],
      [
        "block",
        10
      ]
    ],
    "a": [
      [
        "life",
        360
      ],
      [
        "armour",
        600
      ],
      [
        "blockHeal",
        6
      ],
      [
        "block",
        10
      ]
    ],
    "d": [
      "胸甲：生命、护甲与格挡回复",
      "传奇词缀：格挡与护甲大幅提高"
    ],
    "legend": "传奇词缀：格挡与护甲大幅提高"
  },
  {
    "id": "finale",
    "n": "终焉",
    "seq": [
      35,
      38,
      40
    ],
    "req": "weapon",
    "w": [
      [
        "physInc",
        135
      ],
      [
        "critMulti",
        75
      ],
      [
        "critInc",
        60
      ]
    ],
    "a": [
      [
        "life",
        240
      ],
      [
        "critMulti",
        45
      ]
    ],
    "d": [
      "武器：全伤害与暴击（文案：受到伤害 +10%）"
    ]
  },
  {
    "id": "embervow",
    "n": "余烬之誓",
    "seq": [
      "rune_fire",
      "rune_light",
      3
    ],
    "req": "weapon",
    "w": [
      [
        "addFire",
        [
          12,
          30
        ]
      ],
      [
        "fireInc",
        50
      ]
    ],
    "a": [
      [
        "resF",
        40
      ],
      [
        "fireInc",
        30
      ]
    ],
    "d": [
      "兼容旧符文：火焰附加与火焰伤害"
    ]
  },
  {
    "id": "frostbind",
    "n": "冰封",
    "seq": [
      "rune_cold",
      "rune_body",
      8
    ],
    "req": "armour",
    "w": [
      [
        "addCold",
        [
          8,
          18
        ]
      ],
      [
        "coldInc",
        30
      ]
    ],
    "a": [
      [
        "resC",
        50
      ],
      [
        "es",
        140
      ]
    ],
    "d": [
      "护甲：冰霜抗性与能量护盾"
    ]
  },
  {
    "id": "bramble",
    "n": "荆棘",
    "seq": [
      7,
      9,
      11
    ],
    "req": "armour",
    "w": [
      [
        "physInc",
        40
      ],
      [
        "block",
        6
      ]
    ],
    "a": [
      [
        "armour",
        300
      ],
      [
        "block",
        10
      ],
      [
        "blockHeal",
        6
      ]
    ],
    "d": [
      "护甲：护甲与格挡"
    ]
  },
  {
    "id": "hunter",
    "n": "猎手",
    "seq": [
      13,
      16
    ],
    "req": "weapon",
    "w": [
      [
        "atkSpd",
        24
      ],
      [
        "critInc",
        60
      ]
    ],
    "a": [
      [
        "critInc",
        40
      ],
      [
        "moveInc",
        8
      ]
    ],
    "d": [
      "武器：攻速与暴击"
    ]
  },
  {
    "id": "arcane",
    "n": "秘法",
    "seq": [
      17,
      19,
      21
    ],
    "req": "helm",
    "w": [
      [
        "spellInc",
        48
      ],
      [
        "castSpd",
        24
      ],
      [
        "mana",
        60
      ]
    ],
    "a": [
      [
        "castSpd",
        28.8
      ],
      [
        "mana",
        192
      ],
      [
        "esInc",
        48
      ],
      [
        "spellInc",
        30
      ]
    ],
    "d": [
      "头盔：施法、魔力与能量护盾",
      "传奇词缀：法术伤害与最大魔力提高"
    ],
    "legend": "传奇词缀：法术伤害与最大魔力提高"
  },
  {
    "id": "verdict",
    "n": "圣裁",
    "seq": [
      23,
      26,
      29
    ],
    "req": "weapon",
    "w": [
      [
        "critMulti",
        96
      ],
      [
        "critInc",
        84
      ]
    ],
    "a": [
      [
        "critMulti",
        48
      ],
      [
        "critInc",
        48
      ]
    ],
    "d": [
      "武器：暴击伤害与暴击率"
    ]
  },
  {
    "id": "greed",
    "n": "贪婪",
    "seq": [
      30,
      32,
      34
    ],
    "req": "armour",
    "w": [
      [
        "rarity",
        90
      ],
      [
        "quant",
        30
      ]
    ],
    "a": [
      [
        "rarity",
        120
      ],
      [
        "quant",
        45
      ],
      [
        "life",
        150
      ]
    ],
    "d": [
      "护甲：物品稀有度与数量",
      "传奇词缀：物品稀有度与数量提高"
    ],
    "legend": "传奇词缀：物品稀有度与数量提高"
  },
  {
    "id": "void",
    "n": "虚空",
    "seq": [
      36,
      37,
      39
    ],
    "req": "any",
    "w": [
      [
        "moveInc",
        24
      ],
      [
        "critMulti",
        60
      ]
    ],
    "a": [
      [
        "moveInc",
        30
      ],
      [
        "resAll",
        60
      ],
      [
        "es",
        360
      ],
      [
        "critMulti",
        50
      ]
    ],
    "d": [
      "任意装备：移速、全抗与护盾",
      "传奇词缀：暴击伤害与移动速度提高"
    ],
    "legend": "传奇词缀：暴击伤害与移动速度提高"
  }
]);
