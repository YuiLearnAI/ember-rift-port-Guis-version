var DS_BONES = ["bone_gnawed", "bone_preserved", "bone_ancient"];
var DS_TIER = {
  bone_gnawed: 0,
  bone_preserved: 1,
  bone_ancient: 2
};
var DS_FAC = {
  amanamu: "阿曼娜姆",
  kurgal: "古加尔",
  ulaman: "乌拉曼",
  tecrod: "特克罗"
};
var MAP_CAT = {
  quant: ["quant", "rar", "boxes", "rifts", "packSize", "magicPacks", "rarePacks"],
  mon: ["monLife", "monDmg", "monSpd", "monFire", "monRes", "monCrit", "reflect", "noLeech"],
  player: ["playerRes", "lessRegen"]
};
var DW = {
  sel: null
};
var DEL_LIFE = 180;
var DEL_SHARD_COL = {
  blue: "#6f9fff",
  cyan: "#7fe8e0",
  purple: "#b48cff",
  orange: "#ffb060"
};
var RIT_COL = ["#b05a7a", "#ffd0e0"];
var RIT_COL_STR = "#ffd0e0";
var BAL = {
  simLayers: 35,
  simLayerDivines: 3,
  simFinalDivines: 20,
  simFinalHpMul: 5,
  simAtlasEvery: 20,
  simSpawnPer100: 0.1,
  simRoomsPerMap: 5,
  simSpawnCaps: {
    0: 0.1,
    1: 0.5,
    2: 0.25
  },
  mirrorChance: 0.3,
  ritualBossChance: 0.15,
  ritualTributeMul: 1.5,
  ritualDivineCost: 100,
  delHpPer100: 2,
  delHpMax: 10,
  delDmgPer10: 0.025,
  delDmgCap: 0.8,
  dsMaxUses: 0,
  affix: {
    regularPerSide: 3,
    special: 2,
    dsec: 2,
    total: 10
  },
  atlasSpend: 56,
  advTree: {
    perLevel: 5,
    atlasEvery: 2,
    simEvery: 10,
    clusterCap: 0.5,
    globalCap: 1.5,
    maxCombos: 2,
    nodeCost: 1
  },
  drop: {
    headhunter: 0.003,
    kaoms_heart: 0.02,
    temporalis: 0.012,
    rathpith_globe: 0.006,
    mageblood: 0.015
  }
};
var DEL_LAYERS = 20;
var DelLayerMap = !1;
var SIM_LAYERS = BAL.simLayers;
var SimLayerMap = !1;
var AB_GREEN = ["#2a6a3a", "#7dff9a", "#d8ffe0"];
var AB_LICHBORN = [{
  k: "void",
  n: "阿曼娜姆的虚空"
}, {
  k: "gasp",
  n: "古加尔的最后喘息"
}, {
  k: "legion",
  n: "乌拉曼的军团"
}];
var AB_TROVE = [{
  k: "coffer",
  n: "深渊保险箱 · 通货库"
}, {
  k: "arsenal",
  n: "深渊保险箱 · 武器库"
}, {
  k: "armoury",
  n: "深渊保险箱 · 护甲库"
}];
var ABMODS = {
  soul: {
    n: "灵魂虹吸",
    d: "靠近它的敌人会被绿环持续灼烧"
  },
  volatile: {
    n: "易爆灵魂",
    d: "死亡时爆出一圈深渊伤害"
  },
  revenant: {
    n: "不稳定的亡魂",
    d: "重伤时会分裂出亡魂"
  },
  shade: {
    n: "暗影行者",
    d: "会突然传送到你身边"
  },
  rune: {
    n: "石语符文",
    d: "在你脚下留下延迟爆炸的符文"
  },
  undying: {
    n: "不朽意志",
    d: "持续治疗周围的深渊怪物"
  }
};
var AB_OMEN = ["omen_abyss_echo", "omen_abyss_light", "omen_abyss_putrid", "omen_abyss_liege", "omen_abyss_blackblood", "omen_abyss_sovereign"];
var EX_SKIP = new Set(["frac", "ember", "ash"]);
var ExAll = () => rt.filter(_v1 => F[_v1].v > 0 && F[_v1].grp !== "sig" && F[_v1].grp !== "bone" && !EX_SKIP.has(_v1));
var ExC = _v2 => Math.round(F[_v2].v * 100);
var RUNE_NAMES = ["艾尔", "艾德", "提尔", "那夫", "爱斯", "伊司", "塔尔", "拉尔", "欧特", "索尔", "安姆", "夏", "多尔", "海尔", "埃欧", "卢姆", "科", "法尔", "蓝姆", "普尔", "乌姆", "马尔", "伊斯特", "古尔", "伐克斯", "欧姆", "罗", "瑟", "贝", "乔", "查姆", "奈落", "阿卡", "塞拉斯", "维恩", "欧泽", "厄里", "图尔", "雷姆", "佐德"];
var RUNE_CATS = ["fire", "cold", "light", "phys", "vit"];
var RUNE_CAT_COL = {
  fire: "#ff7a30",
  cold: "#7fd0ff",
  light: "#ffe060",
  phys: "#9aa0a8",
  vit: "#c83040"
};
var RUNE_CAT_LABEL = {
  fire: "火焰",
  cold: "冰霜",
  light: "闪电",
  phys: "物理",
  vit: "生命"
};
var RUNE_WORDS_DEFAULT = [{
  id: "steel",
  n: "钢铁",
  seq: [1, 3],
  req: "weapon",
  w: [["physInc", 35], ["atkSpd", 8]],
  a: [["armour", 80], ["resF", 10]],
  d: ["前期物理武器首选 · 物理伤害与攻速"]
}, {
  id: "radiance",
  n: "灵光",
  seq: [5, 8],
  req: "helm|body",
  w: [["spellInc", 15], ["mana", 40]],
  a: [["resAll", 12], ["es", 80], ["manaRegen", 10]],
  d: ["头盔/胸甲：全抗与能量护盾"]
}, {
  id: "storm",
  n: "暴风",
  seq: [12, 10, 15],
  req: "staff",
  w: [["castSpd", 15], ["lightInc", 20], ["skillLvl", 1]],
  a: [["resL", 25], ["castSpd", 8]],
  d: ["法杖/长杖：施法速度与闪电技能等级"]
}, {
  id: "abysswhisper",
  n: "深渊低语",
  seq: [20, 24, 18],
  req: "any",
  w: [["life", 40], ["quant", 15], ["rarity", 15]],
  a: [["life", 60], ["quant", 20], ["rarity", 20]],
  d: ["任意装备：生命与掉落收益"]
}, {
  id: "monarch",
  n: "君主",
  seq: [28, 31, 25],
  req: "body",
  w: [["life", 60], ["armour", 100]],
  a: [["life", 120], ["armour", 200], ["blockHeal", 2]],
  d: ["胸甲：生命、护甲与格挡回复"]
}, {
  id: "finale",
  n: "终焉",
  seq: [35, 38, 40],
  req: "weapon",
  w: [["physInc", 45], ["critMulti", 25], ["critInc", 20]],
  a: [["life", 80], ["critMulti", 15]],
  d: ["武器：全伤害与暴击（文案：受到伤害 +10%）"]
}, {
  id: "embervow",
  n: "余烬之誓",
  seq: ["rune_fire", "rune_light", 3],
  req: "weapon",
  w: [["addFire", [12, 30]], ["fireInc", 25]],
  a: [["resF", 20], ["fireInc", 15]],
  d: ["兼容旧符文：火焰附加与火焰伤害"]
}, {
  id: "frostbind",
  n: "冰封",
  seq: ["rune_cold", "rune_body", 8],
  req: "armour",
  w: [["addCold", [8, 18]], ["coldInc", 15]],
  a: [["resC", 25], ["es", 70]],
  d: ["护甲：冰霜抗性与能量护盾"]
}, {
  id: "bramble",
  n: "荆棘",
  seq: [7, 9, 11],
  req: "armour",
  w: [["physInc", 20], ["block", 3]],
  a: [["armour", 150], ["block", 5], ["blockHeal", 3]],
  d: ["护甲：护甲与格挡"]
}, {
  id: "hunter",
  n: "猎手",
  seq: [13, 16],
  req: "weapon",
  w: [["atkSpd", 12], ["critInc", 30]],
  a: [["critInc", 20], ["moveInc", 4]],
  d: ["武器：攻速与暴击"]
}, {
  id: "arcane",
  n: "秘法",
  seq: [17, 19, 21],
  req: "helm",
  w: [["spellInc", 20], ["castSpd", 10]],
  a: [["castSpd", 12], ["mana", 80], ["esInc", 20]],
  d: ["头盔：施法、魔力与能量护盾"]
}, {
  id: "verdict",
  n: "圣裁",
  seq: [23, 26, 29],
  req: "weapon",
  w: [["critMulti", 40], ["critInc", 35]],
  a: [["critMulti", 20], ["critInc", 20]],
  d: ["武器：暴击伤害与暴击率"]
}, {
  id: "greed",
  n: "贪婪",
  seq: [30, 32, 34],
  req: "armour",
  w: [["rarity", 30], ["quant", 10]],
  a: [["rarity", 40], ["quant", 15], ["life", 50]],
  d: ["护甲：物品稀有度与数量"]
}, {
  id: "void",
  n: "虚空",
  seq: [36, 37, 39],
  req: "any",
  w: [["moveInc", 8], ["critMulti", 20]],
  a: [["moveInc", 10], ["resAll", 20], ["es", 120]],
  d: ["任意装备：移速、全抗与护盾"]
}];
var RUNE_RECIPES_DEFAULT = {
  low: [{
    id: "low_01",
    out: "rune_01",
    cost: {
      trans: 50
    }
  }, {
    id: "low_02",
    out: "rune_02",
    cost: {
      trans: 150
    }
  }, {
    id: "low_03",
    out: "rune_03",
    cost: {
      aug: 200
    }
  }, {
    id: "low_04",
    out: "rune_04",
    cost: {
      alt: 180
    }
  }, {
    id: "low_05",
    out: "rune_05",
    cost: {
      alt: 240
    }
  }, {
    id: "low_06",
    out: "rune_06",
    cost: {
      alch: 70
    }
  }, {
    id: "low_07",
    out: "rune_07",
    cost: {
      alch: 90
    }
  }, {
    id: "low_08",
    out: "rune_08",
    cost: {
      chaos: 34
    }
  }, {
    id: "low_09",
    out: "rune_09",
    cost: {
      chaos: 41
    }
  }, {
    id: "low_10",
    out: "rune_10",
    cost: {
      chaos: 48
    }
  }],
  upgrade: {
    count: 3,
    bands: [{
      to: 10,
      cur: "trans",
      n: 4
    }, {
      to: 20,
      cur: "alch",
      n: 2
    }, {
      to: 30,
      cur: "chaos",
      n: 2
    }, {
      to: 40,
      cur: "exalt",
      n: 1
    }],
    gates: {
      11: {
        cur: "divine",
        n: 1
      },
      21: {
        cur: "divine",
        n: 1
      },
      31: {
        cur: "divine",
        n: 1
      }
    }
  },
  targeted: [{
    id: "tgt_a",
    out: "rune_07",
    from: "rune_05",
    count: 2,
    bone: "bone_gnawed",
    cost: {
      trans: 60
    }
  }, {
    id: "tgt_b",
    out: "rune_18",
    from: "rune_12",
    count: 2,
    bone: "bone_preserved",
    cost: {
      alch: 30
    }
  }, {
    id: "tgt_c",
    out: "rune_28",
    from: "rune_22",
    count: 2,
    bone: "bone_preserved",
    cost: {
      chaos: 20
    }
  }, {
    id: "tgt_d",
    out: "rune_38",
    from: "rune_33",
    count: 2,
    bone: "bone_ancient",
    cost: {
      exalt: 2
    }
  }]
};
var RUNE_CFG_DEFAULT = {
  values: {
    mul: 1.2,
    exp: 1.6,
    overrides: {}
  },
  recipes: RUNE_RECIPES_DEFAULT,
  words: RUNE_WORDS_DEFAULT,
  exchange: false
};
var RUNE_CFG = RUNE_CFG_DEFAULT;
var RUNE_CFG_SRC = null;
var RUNE_WORDS = [];
var RUNE_IDS = [];
var RUNE_EXCHANGE = false;
var RUNE_RECIPE_CACHE = null;
function RuneId(_v3) {
  return "rune_" + (_v3 < 10 ? "0" + _v3 : String(_v3));
}
function RuneNormalizeId(_v4) {
  if (typeof _v4 === "number") return RuneId(_v4);
  var _v5 = String(_v4 == null ? "" : _v4);
  if ((/^\d+$/).test(_v5)) return RuneId(parseInt(_v5, 10));
  return _v5;
}
function RuneValue(_v6) {
  var _v7 = RUNE_CFG && RUNE_CFG.values || ({});
  var _v8 = _v7.overrides && _v7.overrides[RuneId(_v6)];
  if (typeof _v8 === "number") return _v8;
  return Math.round((_v7.mul || 1.2) * Math.pow(_v6, _v7.exp || 1.6) * 100) / 100;
}
function RuneEffects(_v9) {
  var _v10 = RUNE_CATS[(_v9 - 1) % 5], _v11 = Math.floor((_v9 - 1) / 5), _v12 = Math.floor((_v9 - 1) / 10), _v13 = [], _v14 = [];
  if (_v10 === "fire") {
    _v13.push(["addFire", [1 + 2 * _v11, 4 + 3 * _v11]]);
    _v14.push(["resF", 8 + 2 * _v11]);
    if (_v12 >= 1) _v13.push(["fireInc", 5 + 2 * _v11]);
    if (_v12 >= 2) {
      _v13.push(["critMulti", 5 + 3 * _v11]);
      _v14.push(["ailEff", 5 + 2 * _v11]);
    }
    if (_v12 >= 3) _v14.push(["resAll", 3 + _v11]);
  } else if (_v10 === "cold") {
    _v13.push(["addCold", [1 + 2 * _v11, 3 + 3 * _v11]]);
    _v14.push(["resC", 8 + 2 * _v11]);
    if (_v12 >= 1) _v13.push(["coldInc", 5 + 2 * _v11]);
    if (_v12 >= 2) {
      _v13.push(["ailment", 5 + 3 * _v11]);
      _v14.push(["esInc", 4 + 2 * _v11]);
    }
    if (_v12 >= 3) _v14.push(["resAll", 3 + _v11]);
  } else if (_v10 === "light") {
    _v13.push(["addLight", [1 + 2 * _v11, 6 + 4 * _v11]]);
    _v14.push(["resL", 8 + 2 * _v11]);
    if (_v12 >= 1) _v13.push(["lightInc", 5 + 2 * _v11]);
    if (_v12 >= 2) {
      _v13.push(["critInc", 8 + 3 * _v11]);
      _v14.push(["esInc", 4 + 2 * _v11]);
    }
    if (_v12 >= 3) _v14.push(["moveInc", 1 + _v11]);
  } else if (_v10 === "phys") {
    _v13.push(["physInc", 6 + 3 * _v11]);
    _v14.push(["armour", 20 + 15 * _v11]);
    if (_v12 >= 1) _v13.push(["atkSpd", 3 + _v11]);
    if (_v12 >= 2) {
      _v13.push(["critInc", 8 + 3 * _v11]);
      _v14.push(["lifeInc", 3 + _v11]);
    }
    if (_v12 >= 3) _v14.push(["resAll", 3 + _v11]);
  } else {
    _v13.push(["leech", 0.2 + 0.1 * _v11]);
    _v14.push(["life", 10 + 6 * _v11]);
    if (_v12 >= 1) _v13.push(["regen", 1 + _v11]);
    if (_v12 >= 2) {
      _v13.push(["lifeInc", 2 + _v11]);
      _v14.push(["es", 15 + 8 * _v11]);
    }
    if (_v12 >= 3) _v14.push(["resAll", 3 + _v11]);
  }
  if (_v9 >= 36) _v13.push(["skillLvl", 1]);
  return {
    w: _v13,
    a: _v14
  };
}
function RuneStatText(_v15, _v16) {
  if (hi[_v15]) return "附加 " + _v16[0] + " - " + _v16[1] + " " + Yu[hi[_v15]] + "伤害";
  if (_v15 === "physInc") return "物理伤害提高 " + _v16 + "%";
  return Vs(_v15, _v16);
}
function RuneEffectsText(_v17, _v18) {
  var _v19 = Wc[RuneId(_v17)];
  if (!_v19) return "";
  return (_v18 === "W" ? _v19.w : _v19.a).map(function (_v20) {
    return RuneStatText(_v20[0], _v20[1]);
  }).join(" · ");
}
function RuneNormStats(_v21) {
  if (!Array.isArray(_v21)) return [];
  var _v22 = [];
  _v21.forEach(function (_v23) {
    if (!Array.isArray(_v23) || _v23.length < 2 || typeof _v23[0] !== "string") return;
    if (Array.isArray(_v23[1])) {
      var _v24 = Number(_v23[1][0]), _v25 = Number(_v23[1][1]);
      if (isFinite(_v24) && isFinite(_v25)) _v22.push([_v23[0], [Math.round(Math.min(_v24, _v25)), Math.round(Math.max(_v24, _v25))]]);
    } else {
      var _v26 = Number(_v23[1]);
      if (isFinite(_v26)) _v22.push([_v23[0], _v26]);
    }
  });
  return _v22;
}
function RuneNormWord(_v27) {
  if (!_v27 || !_v27.n || !Array.isArray(_v27.seq) || !_v27.seq.length) return null;
  var _v28 = [];
  for (var _v29 = 0; _v29 < _v27.seq.length; _v29++) {
    var _v30 = RuneNormalizeId(_v27.seq[_v29]);
    if (!F[_v30]) return null;
    _v28.push(_v30);
  }
  var _v31 = RuneNormStats(_v27.w), _v32 = RuneNormStats(_v27.a);
  if (!_v31.length && !_v32.length) return null;
  return {
    id: String(_v27.id || "w_" + _v28.join("_")),
    n: String(_v27.n),
    seq: _v28,
    req: String(_v27.req || "any"),
    w: _v31,
    a: _v32,
    d: Array.isArray(_v27.d) ? _v27.d.map(String) : []
  };
}
function RuneApplyConfig(_v33) {
  _v33 = _v33 && typeof _v33 === "object" ? _v33 : {};
  RUNE_CFG_SRC = _v33;
  var _v34 = RUNE_CFG_DEFAULT;
  var _v35 = _v33.values && typeof _v33.values === "object" ? _v33.values : {};
  var _v36 = {
    mul: typeof _v35.mul === "number" ? _v35.mul : _v34.values.mul,
    exp: typeof _v35.exp === "number" ? _v35.exp : _v34.values.exp,
    overrides: _v35.overrides && typeof _v35.overrides === "object" ? _v35.overrides : {}
  };
  var _v37 = _v33.recipes && typeof _v33.recipes === "object" ? _v33.recipes : {};
  var _v38 = {
    low: Array.isArray(_v37.low) && _v37.low.length ? _v37.low : _v34.recipes.low,
    upgrade: _v37.upgrade && typeof _v37.upgrade === "object" ? {
      count: typeof _v37.upgrade.count === "number" ? _v37.upgrade.count : _v34.recipes.upgrade.count,
      bands: Array.isArray(_v37.upgrade.bands) && _v37.upgrade.bands.length ? _v37.upgrade.bands : _v34.recipes.upgrade.bands,
      gates: _v37.upgrade.gates && typeof _v37.upgrade.gates === "object" ? _v37.upgrade.gates : _v34.recipes.upgrade.gates
    } : _v34.recipes.upgrade,
    targeted: Array.isArray(_v37.targeted) && _v37.targeted.length ? _v37.targeted : _v34.recipes.targeted
  };
  var _v39 = Array.isArray(_v33.words) && _v33.words.length ? _v33.words : _v34.words;
  var _v40 = [];
  _v39.forEach(function (_v41) {
    var _v42 = RuneNormWord(_v41);
    if (_v42) _v40.push(_v42);
  });
  try {
    var _v43 = typeof window !== "undefined" && Array.isArray(window.RIFT_RUNEWORDS) ? window.RIFT_RUNEWORDS : [];
    _v43.forEach(function (_v44) {
      var _v45 = RuneNormWord(_v44);
      if (!_v45) return;
      var _v46 = -1;
      for (var _v47 = 0; _v47 < _v40.length; _v47++) if (_v40[_v47].id === _v45.id) {
        _v46 = _v47;
        break;
      }
      if (_v46 >= 0) _v40[_v46] = _v45; else _v40.push(_v45);
    });
  } catch (_v48) {}
  RUNE_CFG = {
    values: _v36,
    recipes: _v38,
    words: _v40,
    exchange: !!_v33.exchange
  };
  RUNE_WORDS = _v40;
  for (var _v49 = 1; _v49 <= 40; _v49++) {
    var _v50 = RuneId(_v49);
    if (F[_v50]) F[_v50].v = RuneValue(_v49);
  }
  for (var _v51 = 1; _v51 <= 40; _v51++) Wc[RuneId(_v51)] = RuneEffects(_v51);
  for (var _v52 = 1; _v52 <= 40; _v52++) {
    var _v53 = RuneId(_v52);
    if (!F[_v53]) continue;
    F[_v53].d = "武器: " + RuneEffectsText(_v52, "W") + " · 防具: " + RuneEffectsText(_v52, "A");
  }
  for (var _v54 in Wc) if (_v54.indexOf("__rw_") === 0) delete Wc[_v54];
  RUNE_WORDS.forEach(function (_v55) {
    Wc["__rw_" + _v55.id] = {
      w: _v55.w,
      a: _v55.a
    };
  });
  RUNE_EXCHANGE = !!_v33.exchange;
  RUNE_IDS.forEach(function (_v56) {
    if (RUNE_EXCHANGE) EX_SKIP.delete(_v56); else EX_SKIP.add(_v56);
  });
  RUNE_RECIPE_CACHE = null;
  BAL.runes = {
    values: _v36,
    recipes: _v38,
    words: RUNE_WORDS.map(function (_v57) {
      return _v57;
    }),
    exchange: RUNE_EXCHANGE
  };
}
function RuneMakeIcon(_v58) {
  try {
    if (typeof document === "undefined" || !document.createElement) return;
    var _v59 = document.createElement("canvas");
    _v59.width = 9;
    _v59.height = 9;
    var _v60 = _v59.getContext("2d");
    if (!_v60) return;
    var _v61 = F[_v58].col;
    _v60.fillStyle = "#0d0b10";
    _v60.fillRect(0, 0, 9, 9);
    var _v62 = function (_v63, _v64, _v65) {
      _v60.fillStyle = _v65;
      _v60.fillRect(_v63, _v64, 1, 1);
    };
    for (var _v66 = 0; _v66 < 9; _v66++) for (var _v67 = 0; _v67 < 9; _v67++) {
      var _v68 = Math.max(Math.abs(_v67 - 4), Math.abs(_v66 - 4));
      if (_v68 <= 3.5) _v62(_v67, _v66, _v68 > 2.6 ? "#120e14" : _v61);
    }
    var _v69 = Math.floor((F[_v58].rn - 1) / 10);
    for (var _v70 = 0; _v70 <= _v69; _v70++) _v62(4, 7 - _v70, "#ffffffaa");
    hr[_v58] = _v59;
    He[_v58] = _v59.toDataURL();
  } catch (_v71) {}
}
function RuneInit() {
  RUNE_IDS = [];
  for (var _v72 = 1; _v72 <= 40; _v72++) {
    var _v73 = RuneId(_v72), _v74 = RUNE_CATS[(_v72 - 1) % 5];
    RUNE_IDS.push(_v73);
    if (!F[_v73]) F[_v73] = {};
    F[_v73].n = "#" + _v72 + " " + RUNE_NAMES[_v72 - 1];
    F[_v73].rn = _v72;
    F[_v73].cat = _v74;
    F[_v73].grp = "rune";
    F[_v73].col = RUNE_CAT_COL[_v74];
    F[_v73].w = 0;
    F[_v73].v = RuneValue(_v72);
    F[_v73].d = "";
    RuneMakeIcon(_v73);
  }
  ex.skillLvl = "+{v} 技能等级";
  RuneApplyConfig(BAL.runes && BAL.runes.words ? BAL.runes : RUNE_CFG_DEFAULT);
}
function RuneItemCat(_v75) {
  if (!_v75 || _v75.kind !== "item" || !_v75.slot) return null;
  if (_v75.slot === "W") {
    var _v76 = he[_v75.base];
    return _v76 && (_v76.wt === "staff" || _v76.wt === "qstaff") ? "staff" : "weapon";
  }
  if (_v75.slot === "H") return "helm";
  if (_v75.slot === "B") return "body";
  if (("GFLRA").indexOf(_v75.slot) >= 0) return "armour";
  return null;
}
function RuneReqOK(_v77, _v78) {
  if (!_v77 || _v77 === "any") return true;
  var _v79 = String(_v77).split("|");
  for (var _v80 = 0; _v80 < _v79.length; _v80++) {
    var _v81 = _v79[_v80];
    if (_v81 === "any") return true;
    if (_v81 === "weapon" && (_v78 === "weapon" || _v78 === "staff")) return true;
    if (_v81 === "armour" && (_v78 === "armour" || _v78 === "helm" || _v78 === "body")) return true;
    if (_v81 === _v78) return true;
  }
  return false;
}
function RuneWordMatch(_v82) {
  if (!_v82 || _v82.kind !== "item") return null;
  var _v83 = _v82.runes || [];
  if (!_v83.length) return null;
  var _v84 = RuneItemCat(_v82);
  for (var _v85 = 0; _v85 < RUNE_WORDS.length; _v85++) {
    var _v86 = RUNE_WORDS[_v85];
    if (_v86.seq.length !== _v83.length) continue;
    var _v87 = true;
    for (var _v88 = 0; _v88 < _v86.seq.length; _v88++) if (_v86.seq[_v88] !== _v83[_v88]) {
      _v87 = false;
      break;
    }
    if (!_v87) continue;
    if (!RuneReqOK(_v86.req, _v84)) continue;
    return _v86;
  }
  return null;
}
function RuneWordNearMiss(_v89) {
  var _v90 = _v89 && _v89.runes || [];
  if (_v90.length < 2) return null;
  var _v91 = _v90.slice().sort().join(",");
  for (var _v92 = 0; _v92 < RUNE_WORDS.length; _v92++) {
    var _v93 = RUNE_WORDS[_v92];
    if (_v93.seq.length !== _v90.length) continue;
    if (_v93.seq.slice().sort().join(",") === _v91) return _v93;
  }
  return null;
}
function RuneWordScaled(_v94, _v95) {
  if (!_v94) return [];
  if (!_v95 || _v95 === 1) return _v94.slice();
  return _v94.map(function (_v96) {
    if (_v96[0] === "skillLvl") return _v96;
    if (Array.isArray(_v96[1])) return [_v96[0], [Math.round(_v96[1][0] * _v95), Math.round(_v96[1][1] * _v95)]];
    var _v97 = _v96[1] * _v95;
    return [_v96[0], Math.abs(_v97) < 2 ? Math.round(_v97 * 10) / 10 : Math.round(_v97)];
  });
}
function RuneWordEffects(_v98, _v99) {
  if (!_v99) _v99 = RuneWordMatch(_v98);
  if (!_v99) return [];
  var _v100 = 1;
  try {
    _v100 = AtlasRuneWordMul();
  } catch (_v101) {}
  return RuneWordScaled(_v98 && _v98.slot === "W" ? _v99.w : _v99.a, _v100);
}
function RuneWordTipHTML(_v102) {
  var _v103 = RuneWordMatch(_v102);
  if (!_v103) {
    var _v104 = RuneWordNearMiss(_v102);
    return _v104 ? '<div class="sep"></div><div class="p" style="color:#c8a060">◇ 符文顺序不同 · 未激活符文之语</div>' : "";
  }
  var _v105 = RuneWordEffects(_v102, _v103);
  var _v106 = _v105.map(function (_v107) {
    return RuneStatText(_v107[0], _v107[1]);
  }).join(" · ");
  var _v108 = (_v103.d || []).map(function (_v109) {
    return '<div class="p dim">' + B(_v109) + "</div>";
  }).join("");
  return '<div class="sep"></div><div class="md" style="color:#e8c870;font-weight:700">✦ 符文之语 · ' + B(_v103.n) + ' <span class="tg">顺序匹配</span></div><div class="md" style="color:#e2d2a8">' + _v106 + "</div>" + _v108;
}
function RunePhysIncOf(_v110) {
  if (!_v110 || !_v110.runes) return 0;
  var _v111 = _v110.slot === "W", _v112 = 0;
  _v110.runes.forEach(function (_v113) {
    var _v114 = Wc[_v113];
    if (!_v114) return;
    var _v115 = (_v111 ? _v114.w : _v114.a) || [];
    _v115.forEach(function (_v116) {
      if (_v116[0] === "physInc") _v112 += _v116[1];
    });
  });
  var _v117 = RuneWordMatch(_v110);
  if (_v117) {
    var _v118 = (_v111 ? _v117.w : _v117.a) || [];
    _v118.forEach(function (_v119) {
      if (_v119[0] === "physInc") _v112 += _v119[1];
    });
  }
  return _v112;
}
function RuneRecipes() {
  if (RUNE_RECIPE_CACHE) return RUNE_RECIPE_CACHE;
  var _v120 = RUNE_CFG && RUNE_CFG.recipes || RUNE_RECIPES_DEFAULT, _v121 = [];
  (_v120.low || []).forEach(function (_v122) {
    if (!_v122 || !_v122.out || !F[_v122.out]) return;
    _v121.push({
      id: _v122.id || "low_" + _v122.out,
      kind: "low",
      out: _v122.out,
      cost: _v122.cost || ({}),
      runes: [],
      bones: [],
      label: "低阶合成"
    });
  });
  var _v123 = _v120.upgrade || RUNE_RECIPES_DEFAULT.upgrade, _v124 = _v123.bands || [], _v125 = _v123.count || 3, _v126 = _v123.gates || ({});
  for (var _v127 = 1; _v127 <= 39; _v127++) {
    var _v128 = _v127 + 1, _v129 = null;
    for (var _v130 = 0; _v130 < _v124.length; _v130++) if (_v128 <= _v124[_v130].to) {
      _v129 = _v124[_v130];
      break;
    }
    if (!_v129) _v129 = _v124[_v124.length - 1];
    var _v131 = {};
    if (_v129 && _v129.cur && _v129.n) _v131[_v129.cur] = _v129.n;
    var _v132 = _v126[String(_v128)];
    if (_v132 && _v132.cur && _v132.n) _v131[_v132.cur] = (_v131[_v132.cur] || 0) + _v132.n;
    _v121.push({
      id: "up_" + _v127,
      kind: "upgrade",
      out: RuneId(_v128),
      cost: _v131,
      runes: [{
        id: RuneId(_v127),
        count: _v125
      }],
      bones: [],
      label: "升阶合成"
    });
  }
  (_v120.targeted || []).forEach(function (_v133) {
    if (!_v133 || !_v133.out || !F[_v133.out] || !F[_v133.from]) return;
    _v121.push({
      id: _v133.id || "tgt_" + _v133.out,
      kind: "targeted",
      out: _v133.out,
      cost: _v133.cost || ({}),
      runes: [{
        id: _v133.from,
        count: _v133.count || 2
      }],
      bones: _v133.bone && F[_v133.bone] ? [{
        id: _v133.bone,
        count: 1
      }] : [],
      label: "定向合成"
    });
  });
  RUNE_RECIPE_CACHE = _v121;
  return _v121;
}
function RuneRecipeNeed(_v134) {
  var _v135 = {};
  Object.keys(_v134.cost || ({})).forEach(function (_v136) {
    _v135[_v136] = (_v135[_v136] || 0) + (_v134.cost[_v136] || 0);
  });
  (_v134.runes || []).forEach(function (_v137) {
    _v135[_v137.id] = (_v135[_v137.id] || 0) + _v137.count;
  });
  (_v134.bones || []).forEach(function (_v138) {
    _v135[_v138.id] = (_v135[_v138.id] || 0) + _v138.count;
  });
  return _v135;
}
function RuneCanCraft(_v139) {
  if (!_v139) return "未知符文配方";
  var _v140 = RuneRecipeNeed(_v139);
  for (var _v141 in _v140) {
    if (!F[_v141]) return "配方数据异常: " + _v141;
    if ((h.cur[_v141] || 0) < _v140[_v141]) return F[_v141].n + " 不足 (需要 " + _v140[_v141] + ", 持有 " + (h.cur[_v141] || 0) + ")";
  }
  return null;
}
function RuneCraft(_v142) {
  if (!h || !h.cur) return "没有可用角色";
  var _v143 = null;
  RuneRecipes().forEach(function (_v144) {
    if (_v144.id === _v142) _v143 = _v144;
  });
  if (!_v143) return "未知符文配方";
  var _v145 = RuneCanCraft(_v143);
  if (_v145) return _v145;
  var _v146 = RuneRecipeNeed(_v143);
  for (var _v147 in _v146) h.cur[_v147] -= _v146[_v147];
  h.cur[_v143.out] = (h.cur[_v143.out] || 0) + 1;
  try {
    var _v148 = AtlasRuneRefundChance();
    if (_v148 > 0 && j() < _v148) {
      Object.keys(_v143.cost || ({})).forEach(function (_v149) {
        h.cur[_v149] = (h.cur[_v149] || 0) + _v143.cost[_v149];
      });
      P("符文共鸣 · 本次合成未消耗通货");
    }
  } catch (_v150) {}
  return null;
}
function RuneCostText(_v151) {
  var _v152 = [];
  (_v151.runes || []).forEach(function (_v153) {
    _v152.push(F[_v153.id].n + " ×" + _v153.count);
  });
  (_v151.bones || []).forEach(function (_v154) {
    _v152.push(F[_v154.id].n + " ×" + _v154.count);
  });
  Object.keys(_v151.cost || ({})).forEach(function (_v155) {
    _v152.push(F[_v155].n + " ×" + _v151.cost[_v155]);
  });
  return _v152.join(" + ");
}
function RuneReqLabel(_v156) {
  if (!_v156 || _v156 === "any") return "任意装备";
  return String(_v156).split("|").map(function (_v157) {
    return ({
      weapon: "任意武器",
      staff: "法杖/长棍",
      helm: "头盔",
      body: "胸甲",
      armour: "护甲"
    })[_v157] || _v157;
  }).join("/");
}
function RuneRecipeRow(_v158) {
  var _v159 = !RuneCanCraft(_v158);
  return '<button data-rune="' + _v158.id + '" style="display:flex;align-items:center;gap:8px;width:100%;padding:5px 8px;border:1px solid ' + (_v159 ? "#5a4a2a" : "#2e2834") + ';background:' + (_v159 ? "#16120c" : "#0d0b10") + ';color:#d8d0c0;cursor:pointer;text-align:left;font-size:12px">' + '<img src="' + (He[_v158.out] || "") + '" alt="" style="width:20px;height:20px;image-rendering:pixelated;flex:none">' + '<span style="flex:1;min-width:0"><b style="color:' + F[_v158.out].col + '">' + F[_v158.out].n + "</b>" + '<small style="display:block;color:#8e98b0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + RuneCostText(_v158) + "</small></span>" + '<em style="font-style:normal;flex:none;color:' + (_v159 ? "#9dffb4" : "#e06a6a") + '">' + (_v159 ? "可合成" : "材料不足") + "</em></button>";
}
function RuneCraftHTML() {
  var _v160 = RuneRecipes();
  var _v161 = function (_v162, _v163, _v164) {
    var _v165 = _v160.filter(function (_v166) {
      return _v166.kind === _v164;
    }).map(RuneRecipeRow).join("");
    return '<div class="bsec"><h4>' + _v162 + " <small>" + _v163 + "</small></h4>" + '<div style="max-height:26vh;overflow:auto;display:flex;flex-direction:column;gap:4px;padding-right:4px">' + _v165 + "</div></div>";
  };
  return '<div class="bcol wide"><h4>符文合成 <small>三条路线 · 材料从通货/遗存骨扣除 · 合成即入账通货栏</small></h4>' + _v161("低阶合成", "通货 → #1~#10", "low") + _v161("升阶合成", "#n ×3 + 通货 → #(n+1) · 每跨 10 级台阶额外 1 神圣石", "upgrade") + _v161("定向合成", "#n ×2 + 遗存骨 + 通货 → 指定高阶符文", "targeted") + "</div>";
}
function RuneBenchHelp() {
  var _v167 = RUNE_WORDS.map(function (_v168) {
    var _v169 = _v168.seq.map(function (_v170) {
      return F[_v170].n;
    }).join(" → ");
    return '<div class="baff" style="display:block;padding:3px 6px"><span class="btxt"><b style="color:#e8c870">' + _v168.n + '</b> <small style="color:#8e98b0">' + RuneReqLabel(_v168.req) + '</small><br><span style="color:#b8a888;font-size:11px">' + _v169 + "</span></span></div>";
  }).join("");
  return '<section class="bpick"><div class="bsec" style="padding:4px 2px"><h4>符文之语 <small>' + RUNE_WORDS.length + ' 条 · 按镶嵌顺序匹配 · 乱序不生效</small></h4><div style="max-height:56vh;overflow:auto;display:flex;flex-direction:column;gap:3px;padding-right:4px">' + _v167 + "</div></div></section>";
}
(function () {
  var _v171 = v0;
  v0 = function (_v172) {
    var _v173 = [], _v174 = [];
    try {
      if (_v172) for (var _v175 in _v172) {
        var _v176 = _v172[_v175];
        if (!_v176 || !_v176.runes || !_v176.runes.length) continue;
        var _v177 = RuneWordMatch(_v176);
        var _v178 = _v177 ? "__rw_" + _v177.id : null;
        if (!_v177 || !Wc[_v178]) continue;
        var _v179 = 1;
        try {
          _v179 = AtlasRuneWordMul();
        } catch (_v180) {}
        Wc[_v178] = {
          w: RuneWordScaled(_v177.w, _v179),
          a: RuneWordScaled(_v177.a, _v179)
        };
        if (_v174.indexOf(_v177.id) < 0) _v174.push(_v177.id);
        _v176.runes.push(_v178);
        _v173.push(_v176);
      }
    } catch (_v181) {}
    try {
      return _v171.apply(this, arguments);
    } finally {
      for (var _v182 = _v173.length - 1; _v182 >= 0; _v182--) _v173[_v182].runes.pop();
      for (var _v183 = 0; _v183 < _v174.length; _v183++) {
        var _v184 = null;
        for (var _v185 = 0; _v185 < RUNE_WORDS.length; _v185++) if (RUNE_WORDS[_v185].id === _v174[_v183]) _v184 = RUNE_WORDS[_v185];
        if (_v184) Wc["__rw_" + _v184.id] = {
          w: _v184.w,
          a: _v184.a
        };
      }
    }
  };
})();
try {
  RuneInit();
} catch (_v186) {
  console.warn("[rune] init failed", _v186);
}
window.__RUNE = {
  version: "2.00",
  list: RUNE_IDS,
  ids: function () {
    return RUNE_IDS.slice();
  },
  words: function () {
    return RUNE_WORDS;
  },
  reload: function () {
    try {
      RuneApplyConfig(RUNE_CFG_SRC && RUNE_CFG_SRC.words ? RUNE_CFG_SRC : BAL.runes);
      return RUNE_WORDS.length;
    } catch (_v187) {
      return -1;
    }
  },
  fileWords: function () {
    return typeof window !== "undefined" && Array.isArray(window.RIFT_RUNEWORDS) ? window.RIFT_RUNEWORDS.slice() : [];
  },
  recipes: function () {
    return RuneRecipes();
  },
  craft: RuneCraft,
  canCraft: RuneCanCraft,
  match: RuneWordMatch,
  nearMiss: RuneWordNearMiss,
  effects: RuneWordEffects,
  tip: RuneWordTipHTML,
  ky: function (_v188, _v189) {
    return c2(_v188, _v189);
  },
  statText: RuneStatText,
  value: RuneValue,
  cfg: function () {
    return RUNE_CFG;
  },
  physInc: RunePhysIncOf,
  itemCat: RuneItemCat,
  reqOK: RuneReqOK,
  calc: function (_v190) {
    return v0(_v190 || ({}), h.tree || [], h.level || 1, h.cls, h.ascNodes || [], h.buffs || new Set());
  },
  benchHTML: RuneCraftHTML,
  barVisible: function (_v191) {
    return !F[_v191] || !F[_v191].rn || (h.cur[_v191] || 0) > 0;
  }
};
function AffixSlotCfg() {
  var _v192 = BAL && BAL.affix || ({});
  return {
    regularPerSide: typeof _v192.regularPerSide === "number" ? _v192.regularPerSide : 3,
    special: typeof _v192.special === "number" ? _v192.special : 2,
    dsec: typeof _v192.dsec === "number" ? _v192.dsec : 2,
    total: typeof _v192.total === "number" ? _v192.total : 10
  };
}
function AffixClass(_v193) {
  if (!_v193) return "regular";
  if (_v193.dsec) return "dsec";
  if (_v193.sp) return "sp";
  return "regular";
}
function AffixIsSide(_v194) {
  return !!_v194 && (_v194.t === "P" || _v194.t === "S");
}
function AffixRegCount(_v195, _v196) {
  if (!_v195 || !_v195.mods) return 0;
  var _v197 = 0;
  _v195.mods.forEach(function (_v198) {
    if (AffixIsSide(_v198) && AffixClass(_v198) === "regular" && (!_v196 || _v198.t === _v196)) _v197++;
  });
  return _v197;
}
function AffixSpecialCount(_v199) {
  return _v199 && _v199.mods ? _v199.mods.filter(function (_v200) {
    return AffixClass(_v200) === "sp";
  }).length : 0;
}
function AffixDsecCount(_v201) {
  return _v201 && _v201.mods ? _v201.mods.filter(function (_v202) {
    return AffixClass(_v202) === "dsec";
  }).length : 0;
}
function AffixTotalCount(_v203) {
  return _v203 && _v203.mods ? _v203.mods.filter(AffixIsSide).length : 0;
}
function AffixLegacyDsecCount(_v204) {
  return _v204 && _v204.mods ? _v204.mods.filter(function (_v205) {
    return AffixClass(_v205) === "dsec" && _v205.legacyDsec;
  }).length : 0;
}
function AffixSideCap(_v206, _v207) {
  if (!_v206) return 0;
  var _v208 = AffixSlotCfg();
  if (_v206.kind === "soul") return _v206.rarity === 1 ? 1 : _v206.rarity === 2 ? 3 : 0;
  if (_v206.kind === "map") return 3;
  if (_v206.kind !== "item") return 0;
  if (_v206.rarity === 1) return 1;
  if (_v206.rarity === 2) return _v208.regularPerSide;
  return 0;
}
function AffixRegRoom(_v209, _v210) {
  return Math.max(0, AffixSideCap(_v209, _v210) - AffixRegCount(_v209, _v210));
}
function AffixSpecialRoom(_v211) {
  return Math.max(0, AffixSlotCfg().special - AffixSpecialCount(_v211));
}
function AffixDsecRoom(_v212) {
  return Math.max(0, AffixSlotCfg().dsec - AffixDsecCount(_v212));
}
function AffixTotalRoom(_v213) {
  return Math.max(0, AffixSlotCfg().total - AffixTotalCount(_v213));
}
function AffixCanAddRegular(_v214) {
  if (!_v214 || AffixTotalRoom(_v214) <= 0) return false;
  return AffixRegRoom(_v214, "P") > 0 || AffixRegRoom(_v214, "S") > 0;
}
function AffixTierOf(_v215, _v216) {
  var _v217 = _v215 && _v216 ? jt(_v215, _v216.id) : null;
  if (!_v217 || !_v217.ranges) return 1;
  return Math.max(1, _v217.ranges.length - (_v216.ti || 0));
}
function AffixStatusHTML(_v218) {
  if (!_v218 || _v218.kind !== "item" && _v218.kind !== "soul") return "";
  var _v219 = AffixSlotCfg();
  var _v220 = AffixLegacyDsecCount(_v218);
  return '<div class="p">常规 前缀 <b>' + AffixRegCount(_v218, "P") + "/" + _v219.regularPerSide + "</b> · 后缀 <b>" + AffixRegCount(_v218, "S") + "/" + _v219.regularPerSide + '</b> · 特殊 <b style="color:#5fe0c0">' + AffixSpecialCount(_v218) + "/" + _v219.special + '</b> · 渎灵 <b style="color:#c070ff">' + AffixDsecCount(_v218) + "/" + _v219.dsec + '</b> · 总计 ' + AffixTotalCount(_v218) + "/" + _v219.total + (_v220 ? ' · <span style="color:#e0a060">旧版渎灵 +' + _v220 + "</span>" : "") + "</div>";
}
function AffixTagHTML(_v221, _v222) {
  var _v223 = AffixClass(_v222);
  if (_v223 === "sp") return '<span class="tg" style="color:#5fe0c0">特殊</span>';
  if (_v223 === "dsec") return _v222.legacyDsec ? '<span class="tg" style="color:#e0a060">旧版渎灵</span>' : '<span class="tg ds">渎灵</span>';
  return "";
}
function AffixRowHTML(_v224, _v225) {
  var _v226 = jt(_v224, _v225.id) || Yt[_v225.id];
  if (!_v226) return "";
  var _v227 = _v225.ur ? "" : '<span class="tg">' + (_v226.t === "P" ? "前缀" : "后缀") + " T" + (_v226.ranges.length - (_v225.ti || 0)) + "</span>";
  var _v228 = (_v225.fr ? '<span class="tg fr">破溃</span>' : _v224.meta && _v225.t === _v224.meta ? '<span class="tg lk">锁定</span>' : "") + (_v225.ex ? '<span class="tg ex">超越</span>' : "") + AffixTagHTML(_v224, _v225);
  return '<div class="md' + (_v225.fr ? " frm" : "") + '">' + B(ea(_v226, _v225.v)) + _v227 + _v228 + "</div>";
}
function AffixBlocksHTML(_v229) {
  if (!_v229 || !_v229.mods || !_v229.mods.length) return "";
  if (_v229.kind !== "item" && _v229.kind !== "soul") return "";
  var _v230 = AffixSlotCfg();
  var _v231 = [], _v232 = [], _v233 = [], _v234 = [];
  _v229.mods.forEach(function (_v235) {
    var _v236 = AffixClass(_v235);
    if (_v236 === "regular") {
      if (_v235.t === "U") _v231.push(_v235); else _v232.push(_v235);
    } else if (_v236 === "sp") _v233.push(_v235); else if (_v236 === "dsec") _v234.push(_v235);
  });
  if (!_v231.length && !_v232.length && !_v233.length && !_v234.length) return "";
  var _v237 = "";
  var _v238 = AffixTotalCount(_v229) >= 10 ? '<div style="font-size:11px;line-height:1.4">' : "";
  _v237 += _v238;
  if (_v231.length) _v237 += _v231.map(function (_v239) {
    return AffixRowHTML(_v229, _v239);
  }).join("");
  if (_v232.length) {
    _v237 += '<div class="sep"></div><div class="p" style="color:#c8b890">常规词缀 <b>' + _v232.length + "/" + _v230.regularPerSide * 2 + "</b>" + (_v229.meta ? ' <span class="tg">锁定' + (_v229.meta === "P" ? "前缀" : "后缀") + "</span>" : "") + "</div>";
    _v237 += _v232.map(function (_v240) {
      return AffixRowHTML(_v229, _v240);
    }).join("");
  }
  if (_v233.length) {
    _v237 += '<div class="sep"></div><div class="p" style="color:#5fe0c0">特殊词缀 <b>' + _v233.length + "/" + _v230.special + '</b> <span class="tg">异界高级预兆</span></div>';
    _v237 += _v233.map(function (_v241) {
      return AffixRowHTML(_v229, _v241);
    }).join("");
  }
  if (_v234.length) {
    _v237 += '<div class="sep"></div><div class="p" style="color:#c070ff">渎灵词缀 <b>' + Math.min(_v234.length, _v230.dsec) + "/" + _v230.dsec + "</b>" + (_v234.length > _v230.dsec ? ' <span class="tg" style="color:#e0a060">旧版 +' + (_v234.length - _v230.dsec) + "</span>" : "") + "</div>";
    _v237 += _v234.map(function (_v242) {
      return AffixRowHTML(_v229, _v242);
    }).join("");
  }
  _v237 += _v238 ? "</div>" : "";
  return _v237;
}
function AffixSlotRowsHTML(_v243, _v244) {
  if (!_v243 || _v243.kind !== "item" && _v243.kind !== "soul") return "";
  var _v245 = AffixSlotCfg();
  var _v246 = (_v243.mods || []).filter(function (_v247) {
    return AffixClass(_v247) === _v244;
  });
  if (_v244 === "sp") {
    return '<div class="bcol"><h4>特殊 <small>' + _v246.length + "/" + _v245.special + "</small></h4>" + (_v246.map(function (_v248) {
      return '<div class="baff"><span class="btier">T' + AffixTierOf(_v243, _v248) + '</span><span class="btxt">' + B(ea(jt(_v243, _v248.id), _v248.v)) + '</span><i class="bst" style="color:#5fe0c0">特殊</i></div>';
    }).join("") || '<div class="baff empty"><span class="btier">—</span><span class="btxt">空栏 · 需异界高级预兆</span></div>') + "</div>";
  }
  var _v249 = _v245.dsec;
  return '<div class="bcol"><h4>渎灵 <small>' + Math.min(_v246.length, _v249) + "/" + _v249 + (_v246.length > _v249 ? " +旧版" + (_v246.length - _v249) : "") + "</small></h4>" + (_v246.map(function (_v250) {
    return '<div class="baff"><span class="btier">D</span><span class="btxt">' + B(ea(jt(_v243, _v250.id), _v250.v)) + '</span><i class="bst ds">' + (_v250.legacyDsec ? "旧版渎灵" : "渎灵") + "</i></div>";
  }).join("") || '<div class="baff empty"><span class="btier">—</span><span class="btxt">空栏 · 渎灵揭示</span></div>') + "</div>";
}
St = function (_v251) {
  if (!_v251) return false;
  if (AffixTotalRoom(_v251) <= 0) return false;
  var _v252 = [];
  if (AffixRegRoom(_v251, "P") > 0 && _v251.meta !== "P") _v252.push("P");
  if (AffixRegRoom(_v251, "S") > 0 && _v251.meta !== "S") _v252.push("S");
  Dc(_v252);
  for (var _v253 = 0; _v253 < _v252.length; _v253++) {
    var _v254 = Nv(_v251, _v252[_v253]);
    if (_v254) {
      _v251.mods.push(_v254);
      return true;
    }
  }
  return false;
};
K0 = function (_v255, _v256) {
  if (!_v255 || !_v255.mods) return 0;
  var _v257 = 0;
  _v255.mods.forEach(function (_v258) {
    if (_v258.t === _v256 && AffixClass(_v258) === "regular") _v257++;
  });
  return _v257;
};
function AffixRollSpecial(_v259) {
  if (!_v259 || AffixSpecialRoom(_v259) <= 0 || AffixTotalRoom(_v259) <= 0) return null;
  var _v260 = ["P", "S"];
  Dc(_v260);
  for (var _v261 = 0; _v261 < _v260.length; _v261++) {
    var _v262 = Nv(_v259, _v260[_v261]);
    if (_v262) {
      _v262.sp = 1;
      return _v262;
    }
  }
  return null;
}
function AffixAddSpecial(_v263) {
  if (!_v263) return "无效目标";
  if (_v263.rarity !== 2) return "特殊词缀栏需要稀有装备";
  if (AffixSpecialRoom(_v263) <= 0) return "特殊词缀栏已满 (" + AffixSpecialCount(_v263) + "/" + AffixSlotCfg().special + ") · 预兆未消耗";
  if (AffixTotalRoom(_v263) <= 0) return "总词缀已满 (" + AffixSlotCfg().total + "/" + AffixSlotCfg().total + ") · 预兆未消耗";
  var _v264 = AffixRollSpecial(_v263);
  if (!_v264) return "没有可用词缀 · 预兆未消耗";
  _v263.mods.push(_v264);
  ga(_v263);
  return null;
}
function AffixMigrateItem(_v265) {
  if (!_v265 || !_v265.mods || !_v265.mods.length) return;
  if (_v265.kind !== "item" && _v265.kind !== "soul") return;
  var _v266 = 0, _v267 = AffixSlotCfg().dsec;
  _v265.mods.forEach(function (_v268) {
    if (!_v268 || !_v268.dsec) return;
    _v266++;
    if (_v266 > _v267) _v268.legacyDsec = 1; else if (_v268.legacyDsec) delete _v268.legacyDsec;
  });
}
function AffixMigrateSave(_v269) {
  if (!_v269) return;
  try {
    if (_v269.equip) for (var _v270 in _v269.equip) AffixMigrateItem(_v269.equip[_v270]);
    if (Array.isArray(_v269.inv)) _v269.inv.forEach(AffixMigrateItem);
    if (Array.isArray(_v269.gems)) _v269.gems.forEach(AffixMigrateItem);
  } catch (_v271) {}
}
window.__AFFIX = {
  version: "2.00",
  cfg: AffixSlotCfg,
  cls: AffixClass,
  regCount: AffixRegCount,
  spCount: AffixSpecialCount,
  dsecCount: AffixDsecCount,
  total: AffixTotalCount,
  legacyDsec: AffixLegacyDsecCount,
  sideCap: AffixSideCap,
  regRoom: AffixRegRoom,
  spRoom: AffixSpecialRoom,
  dsecRoom: AffixDsecRoom,
  totalRoom: AffixTotalRoom,
  canAddRegular: AffixCanAddRegular,
  statusHTML: AffixStatusHTML,
  blocksHTML: AffixBlocksHTML,
  addSpecial: AffixAddSpecial,
  rollSpecial: AffixRollSpecial,
  migrateItem: AffixMigrateItem,
  migrateSave: AffixMigrateSave,
  tierOf: AffixTierOf,
  st: function (_v272) {
    return St(_v272);
  }
};
var ATLAS_EXTRA = [{
  k: "run_affinity",
  n: "符文亲和",
  d: "符文合成有 10% 几率不消耗通货",
  b: "box",
  tier: "small",
  cost: 1,
  par: "core",
  ang: -16,
  rad: 150
}, {
  k: "runesmith_novice",
  n: "符文学徒",
  d: "符文之语效果 +5%",
  b: "box",
  tier: "small",
  cost: 1,
  par: "run_affinity",
  ang: -4,
  rad: 200
}, {
  k: "rune_resonance",
  n: "符文共鸣",
  d: "符文合成再有 15% 几率不消耗通货",
  b: "box",
  tier: "sig",
  cost: 1,
  par: "runesmith_novice",
  ang: 8,
  rad: 252
}, {
  k: "rune_weaver",
  n: "符文织者",
  d: "符文之语效果 +10%",
  b: "box",
  tier: "sig",
  cost: 1,
  par: "rune_resonance",
  ang: 20,
  rad: 300
}, {
  k: "greed",
  n: "贪婪",
  d: "key: 所有掉落 +25%, 怪物生命与伤害 +30%",
  b: "box",
  tier: "keystone",
  cost: 2,
  par: "rune_weaver",
  ang: 32,
  rad: 348,
  rival: "stability"
}, {
  k: "bone_sense",
  n: "骨语",
  d: "遗存骨掉落有 10% 几率额外掉 1 个",
  b: "abyss",
  tier: "small",
  cost: 1,
  par: "core",
  ang: -16,
  rad: 150
}, {
  k: "desecrate_sense",
  n: "渎灵洞悉",
  d: "凑灵词缀数值 +5%",
  b: "abyss",
  tier: "small",
  cost: 1,
  par: "bone_sense",
  ang: -4,
  rad: 200
}, {
  k: "desecrate_lore",
  n: "渎灵学识",
  d: "渎灵揭示时多 1 个选项",
  b: "abyss",
  tier: "sig",
  cost: 1,
  par: "desecrate_sense",
  ang: 8,
  rad: 252
}, {
  k: "bone_speech",
  n: "深渊骨语",
  d: "遗存骨掉落档位 +1",
  b: "abyss",
  tier: "sig",
  cost: 1,
  par: "desecrate_lore",
  ang: 20,
  rad: 300
}, {
  k: "abyssdom",
  n: "深渊主宰",
  d: "key: 深渊保险箱必出遗存骨, 深渊怪 +50%; 裂缝闭合击杀需求 +1",
  b: "abyss",
  tier: "keystone",
  cost: 2,
  par: "bone_speech",
  ang: 32,
  rad: 348,
  rival: "converge"
}, {
  k: "affix_sense",
  n: "词缀嗅觉",
  d: "地图物品数量 +5%",
  b: "boss",
  tier: "small",
  cost: 1,
  par: "core",
  ang: -16,
  rad: 150
}, {
  k: "map_sense",
  n: "地图学识",
  d: "首领掉落地图提升一阶的几率 +10%",
  b: "boss",
  tier: "small",
  cost: 1,
  par: "affix_sense",
  ang: -4,
  rad: 200
}, {
  k: "affix_zeal",
  n: "词缀狂热",
  d: "地图词缀数量 +1（地图词缀走地图规则，不占装备 10 栏位）",
  b: "boss",
  tier: "sig",
  cost: 1,
  par: "map_sense",
  ang: 8,
  rad: 252
}, {
  k: "sim_sense",
  n: "亢奋嗅觉",
  d: "迷雾亢奋获取 +10%",
  b: "deli",
  tier: "small",
  cost: 1,
  par: "core",
  ang: -16,
  rad: 150
}, {
  k: "sim_lore",
  n: "亢奋学识",
  d: "持久亢奋上限 +25%",
  b: "deli",
  tier: "small",
  cost: 1,
  par: "sim_sense",
  ang: -4,
  rad: 200
}, {
  k: "sim_resonance",
  n: "拟像共鸣",
  d: "拟像每 10 层就 +1 图谱点（原本 20 层）",
  b: "deli",
  tier: "sig",
  cost: 1,
  par: "sim_lore",
  ang: 8,
  rad: 252
}, {
  k: "simascetic",
  n: "拟像苦行",
  d: "key: 拟像每层掉落 +40%, 但每层开始不回复生命",
  b: "deli",
  tier: "keystone",
  cost: 2,
  par: "sim_resonance",
  ang: 20,
  rad: 300,
  rival: "pleasure"
}, {
  k: "atlas_sense",
  n: "图谱学识",
  d: "退还单点所需混沌石 -2（可叠加）",
  b: "sust",
  tier: "small",
  cost: 1,
  par: "core",
  ang: -12,
  rad: 190
}, {
  k: "stability",
  n: "稳健",
  d: "key: 怪物生命与伤害 -10%, 掉落 -10%",
  b: "sust",
  tier: "keystone",
  cost: 2,
  par: "atlas_sense",
  ang: 2,
  rad: 250,
  rival: "greed"
}, {
  k: "converge",
  n: "收束",
  d: "key: 地图内容出现率 -30%, 掉落品质 +1 阶",
  b: "rit",
  tier: "keystone",
  cost: 2,
  par: "rit3",
  ang: -14,
  rad: 230,
  rival: "abyssdom"
}, {
  k: "pleasure",
  n: "逸乐",
  d: "key: 拟像每层开始回复 25% 生命/魔力, 掉落 -15%",
  b: "enc",
  tier: "keystone",
  cost: 2,
  par: "enc5",
  ang: -14,
  rad: 230,
  rival: "simascetic"
}];
var ATLAS_BY_K = {}, ATLAS_ALL = [], ATLAS_BRANCH_TOTAL = {}, ATLAS_ANGLES = {
  rift: -90,
  deli: -38,
  box: 38,
  boss: 90,
  sust: 142,
  rit: 180,
  abyss: 218,
  enc: 0
};
var ATLAS_MAIN_BRANCHES = ["rift", "abyss", "deli", "boss", "box", "sust"];
var ATLAS_SHORTCUTS = ["enc", "rit"];
var ATLAS_BUILT_FOR = -1, ATLAS_CORE = null;
var ATLAS_SPEND = 56, ATLAS_VIEW = {
  x: 0,
  y: 0,
  s: 0.75,
  w: 900,
  h: 540,
  init: !1,
  drag: null
};
function AtlasNode(_v273) {
  AtlasEnsure();
  if (ATLAS_BY_K[_v273]) return ATLAS_BY_K[_v273];
  for (let _v274 = 0; _v274 < ATLAS_ALL.length; _v274++) {
    if (ATLAS_ALL[_v274] && ATLAS_ALL[_v274].k === _v273) {
      ATLAS_BY_K[_v273] = ATLAS_ALL[_v274];
      return ATLAS_ALL[_v274];
    }
  }
  return null;
}
function AtlasEnsure() {
  if (ATLAS_BUILT_FOR === Co.length && ATLAS_ALL.length) return;
  ATLAS_BUILT_FOR = Co.length;
  ATLAS_BY_K = {};
  ATLAS_ALL = [];
  ATLAS_BRANCH_TOTAL = {};
  ATLAS_CORE = {
    k: "core",
    n: "异界核心",
    d: "异界树的起点（不消耗点数）",
    b: "core",
    tier: "core",
    cost: 0,
    x: 0,
    y: 0,
    parent: null,
    col: "#e8eefc"
  };
  ATLAS_BY_K.core = ATLAS_CORE;
  ATLAS_ALL.push(ATLAS_CORE);
  for (let _v275 = 0; _v275 < Co.length; _v275++) {
    let _v276 = Co[_v275];
    let _v277 = (ATLAS_ANGLES[_v276.key] !== undefined ? ATLAS_ANGLES[_v276.key] : _v275 * 45) * Math.PI / 180;
    _v276.ang = _v277;
    for (let _v278 = 0; _v278 < _v276.nodes.length; _v278++) {
      let _v279 = _v276.nodes[_v278];
      _v279.b = _v276.key;
      _v279.i = _v278;
      _v279.x = Math.cos(_v277) * (95 + _v278 * 42);
      _v279.y = Math.sin(_v277) * (95 + _v278 * 42);
      _v279.parent = _v278 === 0 ? "core" : _v276.nodes[_v278 - 1].k;
      _v279.tier = _v279.key ? "sig" : "small";
      _v279.cost = 1;
      ATLAS_BY_K[_v279.k] = _v279;
      ATLAS_ALL.push(_v279);
      ATLAS_BRANCH_TOTAL[_v276.key] = (ATLAS_BRANCH_TOTAL[_v276.key] || 0) + 1;
    }
  }
  for (let _v280 = 0; _v280 < ATLAS_EXTRA.length; _v280++) {
    let _v281 = ATLAS_EXTRA[_v280], _v282 = Co.find(function (_v283) {
      return _v283.key === _v281.b;
    });
    let _v284 = (_v282 ? _v282.ang : 0) + (_v281.ang || 0) * Math.PI / 180;
    _v281.x = Math.cos(_v284) * (_v281.rad || 200);
    _v281.y = Math.sin(_v284) * (_v281.rad || 200);
    _v281.parent = _v281.par || "core";
    _v281.col = _v282 ? _v282.col : "#c8c8c8";
    ATLAS_BY_K[_v281.k] = _v281;
    ATLAS_ALL.push(_v281);
    ATLAS_BRANCH_TOTAL[_v281.b] = (ATLAS_BRANCH_TOTAL[_v281.b] || 0) + 1;
  }
  for (let _v285 = 0; _v285 < ATLAS_ALL.length; _v285++) {
    let _v286 = ATLAS_ALL[_v285];
    _v286.depth = 0;
    let _v287 = _v286.parent, _v288 = 0;
    while (_v287 && ATLAS_BY_K[_v287] && _v288++ < 40) {
      _v286.depth++;
      _v287 = ATLAS_BY_K[_v287].parent;
    }
  }
}
function AtlasKeystoneRival(_v289) {
  let _v290 = AtlasNode(_v289);
  return _v290 && _v290.rival ? _v290.rival : null;
}
function AtlasUsed() {
  AtlasEnsure();
  let _v291 = 0;
  (h && h.atlas || []).forEach(function (_v292) {
    let _v293 = ATLAS_BY_K[_v292];
    if (_v293) _v291 += _v293.cost || 1;
  });
  return _v291;
}
function AtlasEarned() {
  return Math.min(Ln, Math.max(0, Math.floor(+(h && h.atlasPts || 0))));
}
function AtlasAvailable() {
  return Math.max(0, Math.min(AtlasEarned(), ATLAS_SPEND) - AtlasUsed());
}
function AtlasCountAlloc(_v294) {
  return (h && h.atlas || []).filter(function (_v295) {
    return _v295 === _v294;
  }).length;
}
function AtlasBranchSmallCount(_v296) {
  AtlasEnsure();
  let _v297 = 0;
  (h && h.atlas || []).forEach(function (_v298) {
    let _v299 = ATLAS_BY_K[_v298];
    if (_v299 && _v299.b === _v296 && _v299.tier === "small") _v297++;
  });
  return _v297;
}
function AtlasChildren(_v300) {
  AtlasEnsure();
  return (h && h.atlas || []).filter(function (_v301) {
    let _v302 = ATLAS_BY_K[_v301];
    let _v303 = _v302 && _v302.parent, _v304 = 0;
    while (_v303 && ATLAS_BY_K[_v303] && _v304++ < 40) {
      if (_v303 === _v300) return true;
      _v303 = ATLAS_BY_K[_v303].parent;
    }
    return false;
  });
}
function AtlasReason(_v305) {
  let _v306 = AtlasNode(_v305);
  if (!_v306) return "未知节点";
  if (!h) return "没有可用角色";
  if (_v306.k === "core") return "核心无需点亮";
  if (AtlasCountAlloc(_v305)) return "已经点亮";
  let _v307 = _v306.rival;
  if (_v307 && AtlasCountAlloc(_v307)) return "与「" + (AtlasNode(_v307) || ({
    n: _v307
  })).n + "」互斥";
  if (AtlasUsed() + (_v306.cost || 1) > ATLAS_SPEND) return "可分配点数已达上限 " + ATLAS_SPEND;
  if (AtlasAvailable() < (_v306.cost || 1)) return "点数不足 (需要 " + (_v306.cost || 1) + ", 可用 " + AtlasAvailable() + ")";
  if (_v306.tier === "sig") {
    let _v308 = AtlasBranchSmallCount(_v306.b);
    if (_v308 < 2) return "同分支需先点亮 2 个小节点 (当前 " + _v308 + ")";
  }
  if (_v306.parent && _v306.parent !== "core" && !AtlasCountAlloc(_v306.parent)) {
    let _v309 = AtlasNode(_v306.parent);
    return "需先点亮前置: " + (_v309 ? _v309.n : _v306.parent);
  }
  return null;
}
function AtlasCanAlloc(_v310) {
  return AtlasReason(_v310) === null;
}
function AtlasAlloc(_v311) {
  let _v312 = AtlasReason(_v311);
  if (_v312) return _v312;
  h.atlas = h.atlas || [];
  h.atlas.push(_v311);
  h.atlasEver = Math.max(+(h.atlasEver || 0), h.atlasPts || 0);
  return null;
}
function AtlasRespecCost() {
  let _v313 = 2 * (h && h.atlas ? h.atlas.filter(function (_v314) {
    return _v314 === "atlas_sense";
  }).length : 0);
  return Math.max(2, 10 - _v313);
}
function AtlasRespec(_v315) {
  if (!h || !h.atlas) return "没有可用角色";
  if (!AtlasCountAlloc(_v315)) return "该节点没有点亮";
  let _v316 = AtlasChildren(_v315);
  if (_v316.length) return "需先退还更深层的节点";
  let _v317 = AtlasRespecCost();
  if ((h.cur.chaos || 0) < _v317) return "混沌石不足 (需要 " + _v317 + ")";
  h.cur.chaos -= _v317;
  h.atlas = h.atlas.filter(function (_v318) {
    return _v318 !== _v315;
  });
  h.atlasRespec = (h.atlasRespec || 0) + 1;
  return null;
}
function AtlasRespecAll() {
  if (!h || !h.atlas) return "没有可用角色";
  if (!h.atlas.length) return "图谱已经是空的";
  if ((h.cur.divine || 0) < 1) return "神圣石不足 (需要 1)";
  h.cur.divine -= 1;
  h.atlas = [];
  h.atlasRespec = (h.atlasRespec || 0) + 1;
  return null;
}
function AtlasMigrateSave(_v319) {
  if (!_v319) return;
  AtlasEnsure();
  _v319.atlasEver = Math.max(0, Math.floor(+(_v319.atlasEver || 0)));
  _v319.atlasRespec = Math.max(0, Math.floor(+(_v319.atlasRespec || 0)));
  _v319.atlasPts = Math.min(Ln, Math.max(0, Math.floor(+(_v319.atlasPts || 0))));
  _v319.atlasEver = Math.max(_v319.atlasEver, _v319.atlasPts);
  let _v320 = Array.isArray(_v319.atlas) ? _v319.atlas : [];
  let _v321 = {}, _v322 = [];
  _v320.forEach(function (_v323) {
    if (ATLAS_BY_K[_v323] && !_v321[_v323]) {
      _v321[_v323] = 1;
      _v322.push(_v323);
    }
  });
  _v322.sort(function (_v324, _v325) {
    return (ATLAS_BY_K[_v324].depth || 0) - (ATLAS_BY_K[_v325].depth || 0);
  });
  let _v326 = [], _v327 = 0, _v328 = Math.min(_v319.atlasPts, ATLAS_SPEND);
  let _v329 = function (_v330) {
    return _v326.indexOf(_v330) >= 0;
  };
  let _v331 = function (_v332) {
    let _v333 = [], _v334 = ATLAS_BY_K[_v332].parent, _v335 = 0;
    while (_v334 && ATLAS_BY_K[_v334] && _v334 !== "core" && _v335++ < 40) {
      _v333.unshift(_v334);
      _v334 = ATLAS_BY_K[_v334].parent;
    }
    for (let _v336 = 0; _v336 < _v333.length; _v336++) {
      let _v337 = _v333[_v336], _v338 = ATLAS_BY_K[_v337];
      if (_v329(_v337)) continue;
      if (_v338.rival && _v329(_v338.rival)) return false;
      if (_v327 + (_v338.cost || 1) > _v328) return false;
      _v326.push(_v337);
      _v327 += _v338.cost || 1;
    }
    return true;
  };
  for (let _v339 = 0; _v339 < _v322.length; _v339++) {
    let _v340 = _v322[_v339], _v341 = ATLAS_BY_K[_v340];
    if (!_v341) continue;
    if (_v329(_v340)) continue;
    if (_v341.rival && _v329(_v341.rival)) continue;
    if (!_v331(_v340)) continue;
    if (_v327 + (_v341.cost || 1) > _v328) continue;
    _v326.push(_v340);
    _v327 += _v341.cost || 1;
  }
  _v319.atlas = _v326;
  _v319.atlasPts = Math.min(Ln, Math.max(_v319.atlasPts, Math.ceil(_v327)));
  _v319.atlasEver = Math.max(_v319.atlasEver, _v319.atlasPts);
}
function AtlasKillLootMul() {
  return ue("greed") ? 1.25 : ue("stability") ? 0.9 : 1;
}
function AtlasSimLootMul() {
  return ue("simascetic") ? 1.4 : ue("pleasure") ? 0.85 : 1;
}
function AtlasMonsterMul() {
  return ue("greed") ? 1.3 : ue("stability") ? 0.9 : 1;
}
function AtlasContentMul() {
  return ue("converge") ? 0.7 : 1;
}
function AtlasRuneRefundChance() {
  return (ue("run_affinity") ? 0.1 : 0) + (ue("rune_resonance") ? 0.15 : 0);
}
function AtlasRuneWordMul() {
  return 1 + (ue("runesmith_novice") ? 0.05 : 0) + (ue("rune_weaver") ? 0.1 : 0);
}
function AtlasDeliriumCap() {
  return 250 + (ue("sim_lore") ? 25 : 0);
}
function AtlasDeliriumGain(_v342) {
  return Math.round(_v342 * (ue("sim_sense") ? 1.1 : 1));
}
function AtlasEnsureHooks() {
  try {
    R("kill:loot", function (_v343) {
      try {
        if (!_v343) return;
        _v343.dm = (_v343.dm || 1) * AtlasKillLootMul();
        if (o && o.simRun) _v343.dm *= AtlasSimLootMul();
        if (ue("converge")) _v343.rb = (_v343.rb || 0) + 25;
      } catch (_v344) {}
    });
    R("map:stats", function (_v345) {
      try {
        if (_v345 && _v345.o && ue("affix_sense")) _v345.o.quant = (_v345.o.quant || 0) + 5;
      } catch (_v346) {}
    });
    R("boss:map", function (_v347) {
      try {
        if (_v347 && ue("map_sense")) _v347.up = Math.max(_v347.up || 0, 0.55);
      } catch (_v348) {}
    });
  } catch (_v349) {}
  try {
    if (typeof _e === "function" && !_e.__atlasWrapped) {
      let _v350 = _e;
      _e = function (_v351, _v352, _v353, _v354, _v355) {
        let _v356 = _v350.apply(this, arguments);
        try {
          let _v357 = AtlasMonsterMul();
          if (_v356 && _v357 !== 1) {
            _v356.maxhp = Math.max(1, Math.round(_v356.maxhp * _v357));
            _v356.hp = _v356.maxhp;
            if (typeof _v356.dmg === "number") _v356.dmg *= _v357;
          }
        } catch (_v358) {}
        return _v356;
      };
      _e.__atlasWrapped = 1;
    }
  } catch (_v359) {}
}
function AtlasEnsureInput() {
  try {
    AtlasEnsure();
    ATLAS_SPEND = Math.max(1, Math.floor(Number(BAL && BAL.atlasSpend || 56)));
    let _v360 = document.getElementById("pbody");
    if (!_v360 || _v360.__atlasBound) return;
    _v360.__atlasBound = 1;
    _v360.addEventListener("click", function (_v361) {
      let _v362 = _v361.target && _v361.target.closest ? _v361.target.closest("[data-atlas-act]") : null;
      if (_v362) {
        _v361.preventDefault();
        _v361.stopPropagation();
        let _v363 = _v362.getAttribute("data-atlas-act"), _v364 = null;
        if (_v363 === "reset") _v364 = AtlasRespecAll(); else if (_v363 === "respec") {
          P("点击已点亮的节点即可退还该点（混沌石 ×" + AtlasRespecCost() + "）");
          return;
        }
        if (_v364) P(_v364); else P("已重置全部图谱点");
        ms();
        return;
      }
      return;
    }, true);
    if (!window.__atlasDocClick) {
      window.__atlasDocClick = 1;
      document.addEventListener("click", function (_v365) {
        try {
          if (_v365.__atlasHandled) return;
          var _v366 = document.getElementById("atlascv");
          if (!_v366 || o.tab !== "atlas") return;
          var _v367 = _v366.getBoundingClientRect();
          if (_v365.clientX < _v367.left || _v365.clientX > _v367.right || _v365.clientY < _v367.top || _v365.clientY > _v367.bottom) return;
          var _v368 = AtlasCanvasPoint(_v365, _v366), _v369 = AtlasNodeAtWorld(_v368.x, _v368.y);
          if (!_v369) {
            var _v370 = ATLAS_VIEW.s || 0.75, _v371 = (_v368.x - (ATLAS_VIEW.x || 0)) / _v370, _v372 = (_v368.y - (ATLAS_VIEW.y || 0)) / _v370, _v373 = 1e9;
            for (var _v374 = 0; _v374 < ATLAS_ALL.length; _v374++) {
              var _v375 = ATLAS_ALL[_v374];
              if (!(AtlasCanAlloc(_v375.k) || AtlasCountAlloc(_v375.k))) continue;
              var _v376 = Math.hypot(_v375.x - _v371, _v375.y - _v372);
              if (_v376 < _v373 && _v376 < 140) {
                _v373 = _v376;
                _v369 = _v375;
              }
            }
          }
          if (!_v369) return;
          _v365.__atlasHandled = 1;
          _v365.preventDefault();
          _v365.stopPropagation();
          var _v377 = AtlasCountAlloc(_v369.k) ? AtlasRespec(_v369.k) : AtlasAlloc(_v369.k);
          if (_v377) {
            P(_v377);
            return;
          }
          M(AtlasCountAlloc(_v369.k) ? "craft" : "unique");
          ms();
        } catch (_v378) {}
      }, true);
    }
    _v360.addEventListener("contextmenu", function (_v379) {
      let _v380 = _v379.target && _v379.target.id === "atlascv" ? _v379.target : null;
      if (!_v380) return;
      _v379.preventDefault();
      _v379.stopPropagation();
      let _v381 = AtlasCanvasPoint(_v379, _v380), _v382 = AtlasNodeAtWorld(_v381.x, _v381.y);
      if (!_v382) return;
      let _v383 = [], _v384 = _v382, _v385 = 0;
      while (_v384 && ATLAS_BY_K[_v384.parent] && _v385++ < 40) {
        _v383.push(ATLAS_BY_K[_v384.parent].n);
        _v384 = ATLAS_BY_K[_v384.parent];
      }
      P("前置链: " + (_v383.length ? _v383.reverse().join(" → ") : "无（核心直连）") + (AtlasCountAlloc(_v382) ? " · 已点亮" : ""));
    }, true);
    _v360.addEventListener("pointerdown", function (_v386) {
      let _v387 = _v386.target && _v386.target.id === "atlascv" ? _v386.target : null;
      if (!_v387) return;
      ATLAS_VIEW.drag = {
        x: _v386.clientX,
        y: _v386.clientY,
        ox: ATLAS_VIEW.x || 0,
        oy: ATLAS_VIEW.y || 0,
        moved: 0
      };
      try {
        _v386.target.setPointerCapture && _v386.target.setPointerCapture(_v386.pointerId);
      } catch (_v388) {}
    });
    _v360.addEventListener("pointermove", function (_v389) {
      let _v390 = _v389.target && _v389.target.id === "atlascv" ? _v389.target : document.getElementById("atlascv");
      if (!_v390) return;
      if (ATLAS_VIEW.drag) {
        let _v391 = ATLAS_VIEW.drag;
        _v391.moved = Math.max(_v391.moved, Math.abs(_v389.clientX - _v391.x) + Math.abs(_v389.clientY - _v391.y));
        if (_v391.moved > 4) {
          ATLAS_VIEW.x = _v391.ox + (_v389.clientX - _v391.x);
          ATLAS_VIEW.y = _v391.oy + (_v389.clientY - _v391.y);
          AtlasDraw();
        }
        return;
      }
      let _v392 = AtlasCanvasPoint(_v389, _v390), _v393 = AtlasNodeAtWorld(_v392.x, _v392.y);
      AtlasShowTip(_v393, _v389);
    });
    _v360.addEventListener("pointerup", function (_v394) {
      let _v395 = _v394.target && _v394.target.id === "atlascv" ? _v394.target : null;
      if (!_v395) {
        ATLAS_VIEW.drag = null;
        return;
      }
      ATLAS_VIEW.drag = null;
    });
    _v360.addEventListener("wheel", function (_v396) {
      let _v397 = _v396.target && _v396.target.id === "atlascv" ? _v396.target : null;
      if (!_v397) return;
      _v396.preventDefault();
      let _v398 = _v397.getBoundingClientRect ? _v397.getBoundingClientRect() : {
        left: 0,
        top: 0
      };
      let _v399 = _v396.clientX - _v398.left, _v400 = _v396.clientY - _v398.top;
      let _v401 = ATLAS_VIEW.s || 0.75;
      let _v402 = Math.max(0.35, Math.min(2.4, _v401 * (_v396.deltaY > 0 ? 0.9 : 1.1)));
      let _v403 = (_v399 - (ATLAS_VIEW.x || 0)) / _v401, _v404 = (_v400 - (ATLAS_VIEW.y || 0)) / _v401;
      ATLAS_VIEW.s = _v402;
      ATLAS_VIEW.x = _v399 - _v403 * _v402;
      ATLAS_VIEW.y = _v400 - _v404 * _v402;
      AtlasDraw();
    }, {
      passive: !1
    });
  } catch (_v405) {}
}
function AtlasCanvasPoint(_v406, _v407) {
  let _v408 = _v407.getBoundingClientRect ? _v407.getBoundingClientRect() : {
    left: 0,
    top: 0
  };
  let _v409 = _v408.width ? (_v407.width || _v408.width) / _v408.width : 1;
  let _v410 = _v408.height ? (_v407.height || _v408.height) / _v408.height : 1;
  return {
    x: (_v406.clientX - _v408.left) * _v409,
    y: (_v406.clientY - _v408.top) * _v410
  };
}
function AtlasNodeAtWorld(_v411, _v412) {
  AtlasEnsure();
  let _v413 = ATLAS_VIEW.s || 0.75, _v414 = ATLAS_VIEW.x, _v415 = ATLAS_VIEW.y;
  let _v416 = (_v411 - _v414) / _v413, _v417 = (_v412 - _v415) / _v413, _v418 = null, _v419 = 1e9;
  for (let _v420 = 0; _v420 < ATLAS_ALL.length; _v420++) {
    let _v421 = ATLAS_ALL[_v420];
    let _v422 = Math.hypot(_v421.x - _v416, _v421.y - _v417);
    let _v423 = (_v421.tier === "keystone" ? 15 : _v421.tier === "core" ? 18 : 9) + 30;
    if (_v422 < _v423 && _v422 < _v419) {
      _v419 = _v422;
      _v418 = _v421;
    }
  }
  if (!_v418) {
    for (let _v424 = 0; _v424 < ATLAS_ALL.length; _v424++) {
      let _v425 = ATLAS_ALL[_v424];
      let _v426 = Math.hypot(_v425.x - _v416, _v425.y - _v417);
      if (_v426 < 45 && _v426 < _v419) {
        _v419 = _v426;
        _v418 = _v425;
      }
    }
  }
  return _v418;
}
function AtlasShowTip(_v427, _v428) {
  let _v429 = document.getElementById("atlasTip");
  if (!_v429) return;
  if (!_v427) {
    _v429.style.display = "none";
    return;
  }
  let _v430 = AtlasCountAlloc(_v427.k) ? '<span style="color:#9dffb4">已点亮</span>' : AtlasReason(_v427.k) ? '<span style="color:#e06a6a">' + AtlasReason(_v427.k) + "</span>" : '<span style="color:#e8c870">可点亮</span>';
  _v429.innerHTML = "<b style=\"color:" + (_v427.col || "#e8eefc") + "\">" + _v427.n + "</b><br>" + _v427.d + "<br>" + _v430 + (_v427.cost > 1 ? " · 花费 " + _v427.cost + " 点" : "") + '<br><span style="color:#8e98b0">左键: ' + (AtlasCountAlloc(_v427.k) ? "退还 (混沌石×" + AtlasRespecCost() + ")" : "点亮") + " · 右键: 前置链</span>";
  _v429.style.display = "block";
  let _v431 = document.getElementById("atlascv");
  if (_v431 && _v428) {
    let _v432 = _v431.getBoundingClientRect ? _v431.getBoundingClientRect() : {
      left: 0,
      top: 0
    };
    _v429.style.left = Math.max(4, _v428.clientX - _v432.left + 14) + "px";
    _v429.style.top = Math.max(4, _v428.clientY - _v432.top + 12) + "px";
  }
}
function AtlasDraw() {
  try {
    AtlasEnsure();
    let _v433 = document.getElementById("atlascv");
    if (!_v433) return;
    let _v434 = _v433.width || 900, _v435 = _v433.height || 540, _v436 = _v433.getContext("2d");
    if (!_v436) return;
    if (!ATLAS_VIEW.init || !isFinite(ATLAS_VIEW.x) || !isFinite(ATLAS_VIEW.y)) {
      ATLAS_VIEW.init = !0;
      ATLAS_VIEW.s = Math.max(0.4, Math.min(1.1, _v434 / 1100));
      ATLAS_VIEW.x = _v434 / 2;
      ATLAS_VIEW.y = _v435 / 2;
    }
    let _v437 = ATLAS_VIEW.s || 0.75, _v438 = ATLAS_VIEW.x, _v439 = ATLAS_VIEW.y;
    ATLAS_VIEW.w = _v434;
    ATLAS_VIEW.h = _v435;
    _v436.setTransform(1, 0, 0, 1, 0, 0);
    _v436.fillStyle = "#0b0a10";
    _v436.fillRect(0, 0, _v434, _v435);
    _v436.setTransform(_v437, 0, 0, _v437, _v438, _v439);
    for (let _v440 = 0; _v440 < ATLAS_ALL.length; _v440++) {
      let _v441 = ATLAS_ALL[_v440], _v442 = ATLAS_BY_K[_v441.parent];
      if (!_v442) continue;
      let _v443 = AtlasCountAlloc(_v441.k) && AtlasCountAlloc(_v442.k) || _v442.k === "core" && AtlasCountAlloc(_v441.k);
      let _v444 = AtlasCanAlloc(_v441.k);
      _v436.strokeStyle = _v443 ? "#6a5a3a" : _v444 ? "#3a3448" : "#241f2c";
      _v436.lineWidth = (_v443 ? 2.2 : 1.2) / _v437;
      _v436.beginPath();
      _v436.moveTo(_v442.x, _v442.y);
      _v436.lineTo(_v441.x, _v441.y);
      _v436.stroke();
    }
    for (let _v445 = 0; _v445 < ATLAS_ALL.length; _v445++) {
      let _v446 = ATLAS_ALL[_v445], _v447 = !!AtlasCountAlloc(_v446.k), _v448 = !_v447 && AtlasCanAlloc(_v446.k);
      let _v449 = _v446.tier === "core" ? 16 : _v446.tier === "keystone" ? 13 : _v446.tier === "sig" ? 9 : 6;
      _v436.beginPath();
      if (_v446.tier === "keystone") {
        _v436.moveTo(_v446.x, _v446.y - _v449);
        _v436.lineTo(_v446.x + _v449, _v446.y);
        _v436.lineTo(_v446.x, _v446.y + _v449);
        _v436.lineTo(_v446.x - _v449, _v446.y);
        _v436.closePath();
      } else _v436.arc(_v446.x, _v446.y, _v449, 0, 6.2832);
      _v436.fillStyle = _v447 ? _v446.col || "#e8c870" : _v448 ? "#3a3048" : "#1c1824";
      _v436.fill();
      _v436.strokeStyle = _v447 ? "#fff0c0" : _v446.col || "#4a4258";
      _v436.lineWidth = (_v447 ? 1.8 : 1) / _v437;
      _v436.stroke();
      if (_v447 || _v446.tier === "keystone" || _v437 > 0.85) {
        _v436.font = (_v446.tier === "keystone" ? "700 11px " : "10px ") + "monospace";
        _v436.textAlign = "center";
        _v436.fillStyle = _v447 ? "#f0e8d0" : "#8e98b0";
        _v436.fillText(_v446.n, _v446.x, _v446.y - _v449 - 5 / _v437);
      }
    }
    _v436.setTransform(1, 0, 0, 1, 0, 0);
    _v436.fillStyle = "#8e98b0";
    _v436.font = "11px monospace";
    _v436.textAlign = "left";
    _v436.fillText("可用 " + AtlasAvailable() + " · 已获得 " + AtlasEarned() + "/" + Ln + " · 已分配 " + AtlasUsed() + "/" + ATLAS_SPEND, 10, 16);
  } catch (_v450) {}
}
function AtlasAfterRender() {
  try {
    AtlasEnsure();
    AtlasEnsureInput();
    let _v451 = document.getElementById("atlascv");
    if (!_v451) return;
    let _v452 = _v451.parentElement, _v453 = Math.max(320, Math.floor(_v452 && _v452.clientWidth || 900));
    let _v454 = Math.max(360, Math.min(620, Math.floor((window && window.innerHeight || 720) - 240)));
    _v451.style.width = _v453 + "px";
    _v451.style.height = _v454 + "px";
    _v451.width = _v453;
    _v451.height = _v454;
    if (!ATLAS_VIEW.init || ATLAS_VIEW.w !== _v453 || ATLAS_VIEW.h !== _v454) {
      AtlasEnsure();
      var _v455 = 1e9, _v456 = 1e9, _v457 = -1e9, _v458 = -1e9;
      for (var _v459 = 0; _v459 < ATLAS_ALL.length; _v459++) {
        var _v460 = ATLAS_ALL[_v459];
        if (_v460.x < _v455) _v455 = _v460.x;
        if (_v460.y < _v456) _v456 = _v460.y;
        if (_v460.x > _v457) _v457 = _v460.x;
        if (_v460.y > _v458) _v458 = _v460.y;
      }
      var _v461 = Math.max(80, _v457 - _v455), _v462 = Math.max(80, _v458 - _v456);
      ATLAS_VIEW.s = Math.max(0.3, Math.min(1.0, Math.min((_v453 - 50) / _v461, (_v454 - 50) / _v462)));
      ATLAS_VIEW.x = _v453 / 2 - (_v455 + _v457) / 2 * ATLAS_VIEW.s;
      ATLAS_VIEW.y = _v454 / 2 - (_v456 + _v458) / 2 * ATLAS_VIEW.s;
      ATLAS_VIEW.init = !0;
    }
    AtlasDraw();
    if (!_v451.__atlasDirectClick) {
      _v451.__atlasDirectClick = 1;
      _v451.addEventListener("click", function (_v463) {
        try {
          let _v464 = AtlasCanvasPoint(_v463, _v451), _v465 = AtlasNodeAtWorld(_v464.x, _v464.y);
          if (!_v465) {
            let _v466 = ATLAS_VIEW.s || 0.75, _v467 = (_v464.x - (ATLAS_VIEW.x || 0)) / _v466, _v468 = (_v464.y - (ATLAS_VIEW.y || 0)) / _v466, _v469 = 1e9;
            for (let _v470 = 0; _v470 < ATLAS_ALL.length; _v470++) {
              let _v471 = ATLAS_ALL[_v470];
              if (!(AtlasCanAlloc(_v471.k) || AtlasCountAlloc(_v471.k))) continue;
              let _v472 = Math.hypot(_v471.x - _v467, _v471.y - _v468);
              if (_v472 < _v469 && _v472 < 140) {
                _v469 = _v472;
                _v465 = _v471;
              }
            }
          }
          if (!_v465) {
            P("请点节点圆点");
            return;
          }
          let _v473 = AtlasCountAlloc(_v465) ? AtlasRespec(_v465) : AtlasAlloc(_v465);
          if (_v473) {
            P(_v473);
            return;
          }
          M(AtlasCountAlloc(_v465) ? "craft" : "unique");
          ms();
        } catch (_v474) {}
      });
    }
    if (!ATLAS_VIEW.scrolled) {
      ATLAS_VIEW.scrolled = 1;
      try {
        _v451.scrollIntoView({
          block: "center",
          inline: "nearest"
        });
      } catch (_v475) {}
    }
  } catch (_v476) {}
}
try {
  AtlasEnsureHooks();
  setTimeout(AtlasEnsureInput, 0);
} catch (_v477) {
  console.warn("[atlas] init failed", _v477);
}
Ui = AtlasCanAlloc;
window.__ATLAS = {
  version: "2.00",
  ensure: AtlasEnsure,
  all: function () {
    AtlasEnsure();
    return ATLAS_ALL;
  },
  extra: ATLAS_EXTRA,
  branches: function () {
    return {
      main: ATLAS_MAIN_BRANCHES.slice(),
      shortcuts: ATLAS_SHORTCUTS.slice(),
      totals: Object.assign({}, ATLAS_BRANCH_TOTAL)
    };
  },
  node: AtlasNode,
  reason: AtlasReason,
  canAlloc: AtlasCanAlloc,
  alloc: AtlasAlloc,
  respec: AtlasRespec,
  respecCost: AtlasRespecCost,
  respecAll: AtlasRespecAll,
  used: AtlasUsed,
  earned: AtlasEarned,
  available: AtlasAvailable,
  cap: function () {
    return Ln;
  },
  spendCap: function () {
    return ATLAS_SPEND;
  },
  keystones: function () {
    AtlasEnsure();
    return ATLAS_ALL.filter(function (_v478) {
      return _v478.tier === "keystone";
    }).map(function (_v479) {
      return {
        k: _v479.k,
        n: _v479.n,
        rival: _v479.rival || null
      };
    });
  },
  migrate: AtlasMigrateSave,
  draw: AtlasDraw,
  afterRender: AtlasAfterRender,
  contentMul: AtlasContentMul,
  monsterMul: AtlasMonsterMul,
  killLootMul: AtlasKillLootMul
};
var ADV_DEFAULTS = {
  perLevel: 5,
  atlasEvery: 2,
  simEvery: 10,
  nodeCost: 1,
  talentCost: 2,
  starCost: 1
};
function AdvCfg() {
  var _v480 = BAL && BAL.advTree || ({});
  var _v481 = {};
  for (var _v482 in ADV_DEFAULTS) _v481[_v482] = typeof _v480[_v482] === "number" ? _v480[_v482] : ADV_DEFAULTS[_v482];
  return _v481;
}
function AdvStatLabel(_v483, _v484) {
  try {
    return Vs(_v483, _v484);
  } catch (_v485) {
    return _v483 + " " + _v484;
  }
}
var ADV_CLASSES = ["witch", "ranger", "huntress", "monk", "samurai", "mercenary", "sorceress", "warrior", "jianke"];
var ADV_REGIONS = [{
  k: "fire",
  tag: "fire",
  n: "火焰",
  col: "#ff7a30",
  main: "fireInc",
  sub: "life"
}, {
  k: "cold",
  tag: "cold",
  n: "冰霜",
  col: "#7fd0ff",
  main: "coldInc",
  sub: "esInc"
}, {
  k: "light",
  tag: "light",
  n: "闪电",
  col: "#ffe060",
  main: "lightInc",
  sub: "critInc"
}, {
  k: "phys",
  tag: "phys",
  n: "物理",
  col: "#9aa0a8",
  main: "physInc",
  sub: "armour"
}, {
  k: "minion",
  tag: "minion",
  n: "召唤",
  col: "#80e0a0",
  main: "minionInc",
  sub: "minionSpd"
}, {
  k: "defence",
  tag: "defence",
  n: "防御",
  col: "#c0c8d0",
  main: "lifeInc",
  sub: "resAll"
}, {
  k: "currency",
  tag: "currency",
  n: "通货",
  col: "#e8c048",
  main: "rarity",
  sub: "quant"
}];
var ADV_STAR_EFFECT_DEFAULTS = [{
  id: "d_fire_1",
  n: "烈焰暴击",
  region: "fire",
  d: "火焰暴击率 +5%",
  require: {
    tags: ["fire", "crit"],
    min: 2
  },
  text: "火焰暴击率 +{0}%",
  stats: {
    critInc: 5
  }
}, {
  id: "d_fire_2",
  n: "炎之心",
  region: "fire",
  d: "火焰伤害 +6%",
  require: {
    tags: ["fire"],
    min: 3
  },
  text: "火焰伤害 +{0}%",
  stats: {
    fireInc: 6
  }
}, {
  id: "d_fire_3",
  n: "生命燃烧",
  region: "fire",
  d: "最大生命 +8",
  require: {
    tags: ["fire", "life"],
    min: 2
  },
  text: "最大生命 +{0}",
  stats: {
    life: 8
  }
}, {
  id: "d_fire_4",
  n: "元素共鸣",
  region: "fire",
  d: "元素伤害 +5%",
  require: {
    tags: ["fire", "defence"],
    min: 2
  },
  text: "元素伤害 +{0}%",
  stats: {
    eleInc: 5
  }
}, {
  id: "d_cold_1",
  n: "极寒暴击",
  region: "cold",
  d: "冰霜暴击伤害 +8%",
  require: {
    tags: ["cold", "crit"],
    min: 2
  },
  text: "冰霜暴击伤害 +{0}%",
  stats: {
    critMulti: 8
  }
}, {
  id: "d_cold_2",
  n: "冰川之心",
  region: "cold",
  d: "冰霜伤害 +6%",
  require: {
    tags: ["cold"],
    min: 3
  },
  text: "冰霜伤害 +{0}%",
  stats: {
    coldInc: 6
  }
}, {
  id: "d_cold_3",
  n: "寒冰壁垒",
  region: "cold",
  d: "护甲 +40",
  require: {
    tags: ["cold", "defence"],
    min: 2
  },
  text: "护甲 +{0}",
  stats: {
    armour: 40
  }
}, {
  id: "d_cold_4",
  n: "冰霜护盾",
  region: "cold",
  d: "能量护盾 +12",
  require: {
    tags: ["cold", "defence"],
    min: 3
  },
  text: "能量护盾 +{0}",
  stats: {
    es: 12
  }
}, {
  id: "d_light_1",
  n: "闪电暴击",
  region: "light",
  d: "暴击率 +6%",
  require: {
    tags: ["light", "crit"],
    min: 2
  },
  text: "暴击率 +{0}%",
  stats: {
    critInc: 6
  }
}, {
  id: "d_light_2",
  n: "雷霆",
  region: "light",
  d: "闪电伤害 +6%",
  require: {
    tags: ["light"],
    min: 3
  },
  text: "闪电伤害 +{0}%",
  stats: {
    lightInc: 6
  }
}, {
  id: "d_light_3",
  n: "导电护盾",
  region: "light",
  d: "闪电抗性 +6%",
  require: {
    tags: ["light", "defence"],
    min: 2
  },
  text: "+{0}% 闪电抗性",
  stats: {
    resL: 6
  }
}, {
  id: "d_light_4",
  n: "迅雷",
  region: "light",
  d: "施法速度 +4%",
  require: {
    tags: ["light", "crit"],
    min: 3
  },
  text: "施法速度 +{0}%",
  stats: {
    castSpd: 4
  }
}, {
  id: "d_phys_1",
  n: "破甲",
  region: "phys",
  d: "暴击伤害 +8%",
  require: {
    tags: ["phys", "crit"],
    min: 2
  },
  text: "暴击伤害 +{0}%",
  stats: {
    critMulti: 8
  }
}, {
  id: "d_phys_2",
  n: "钢铁之躯",
  region: "phys",
  d: "物理伤害 +6%",
  require: {
    tags: ["phys"],
    min: 3
  },
  text: "物理伤害 +{0}%",
  stats: {
    physInc: 6
  }
}, {
  id: "d_phys_3",
  n: "战场韧性",
  region: "phys",
  d: "生命回复 +2/秒",
  require: {
    tags: ["phys", "life"],
    min: 2
  },
  text: "每秒回复 {0} 生命",
  stats: {
    regen: 2
  }
}, {
  id: "d_phys_4",
  n: "重甲",
  region: "phys",
  d: "护甲 +50",
  require: {
    tags: ["phys", "defence"],
    min: 2
  },
  text: "护甲 +{0}",
  stats: {
    armour: 50
  }
}, {
  id: "d_minion_1",
  n: "亡者之怒",
  region: "minion",
  d: "召唤物攻击速度 +5%",
  require: {
    tags: ["minion", "crit"],
    min: 2
  },
  text: "召唤物攻击速度 +{0}%",
  stats: {
    minionSpd: 5
  }
}, {
  id: "d_minion_2",
  n: "万灵",
  region: "minion",
  d: "召唤物伤害 +6%",
  require: {
    tags: ["minion"],
    min: 3
  },
  text: "召唤物伤害 +{0}%",
  stats: {
    minionInc: 6
  }
}, {
  id: "d_minion_3",
  n: "骸骨壁垒",
  region: "minion",
  d: "最大生命 +10",
  require: {
    tags: ["minion", "defence"],
    min: 2
  },
  text: "最大生命 +{0}",
  stats: {
    life: 10
  }
}, {
  id: "d_minion_4",
  n: "亡灵生命",
  region: "minion",
  d: "最大生命提高 4%",
  require: {
    tags: ["minion", "life"],
    min: 2
  },
  text: "最大生命提高 {0}%",
  stats: {
    lifeInc: 4
  }
}, {
  id: "d_def_1",
  n: "冰甲",
  region: "defence",
  d: "最大能量护盾提高 6%",
  require: {
    tags: ["defence", "cold"],
    min: 2
  },
  text: "最大能量护盾提高 {0}%",
  stats: {
    esInc: 6
  }
}, {
  id: "d_def_2",
  n: "铁壁",
  region: "defence",
  d: "护甲 +40",
  require: {
    tags: ["defence", "phys"],
    min: 2
  },
  text: "护甲 +{0}",
  stats: {
    armour: 40
  }
}, {
  id: "d_def_3",
  n: "生命之泉",
  region: "defence",
  d: "最大生命提高 5%",
  require: {
    tags: ["defence", "life"],
    min: 2
  },
  text: "最大生命提高 {0}%",
  stats: {
    lifeInc: 5
  }
}, {
  id: "d_def_4",
  n: "元素抗性",
  region: "defence",
  d: "所有元素抗性 +5%",
  require: {
    tags: ["defence"],
    min: 3
  },
  text: "+{0}% 所有元素抗性",
  stats: {
    resAll: 5
  }
}, {
  id: "d_cur_1",
  n: "财富",
  region: "currency",
  d: "物品稀有度 +6%",
  require: {
    tags: ["currency", "crit"],
    min: 2
  },
  text: "物品稀有度提高 {0}%",
  stats: {
    rarity: 6
  }
}, {
  id: "d_cur_2",
  n: "丰饶",
  region: "currency",
  d: "物品稀有度 +8%",
  require: {
    tags: ["currency"],
    min: 3
  },
  text: "物品稀有度提高 {0}%",
  stats: {
    rarity: 8
  }
}, {
  id: "d_cur_3",
  n: "贪欲",
  region: "currency",
  d: "物品数量 +5%",
  require: {
    tags: ["currency", "defence"],
    min: 2
  },
  text: "物品数量提高 {0}%",
  stats: {
    quant: 5
  }
}, {
  id: "d_cur_4",
  n: "富甲一方",
  region: "currency",
  d: "最大生命 +12",
  require: {
    tags: ["currency", "life"],
    min: 2
  },
  text: "最大生命 +{0}",
  stats: {
    life: 12
  }
}];
var ADV_NODES = [], ADV_BY_K = {}, ADV_STARS = [], ADV_STAR_BY_K = {}, ADV_BUILT = !1, ADV_EFFECTS = [];
var ADV_EDGES = [], ADV_ADJ = {}, ADV_METRICS = {}, ADV_RING_COUNTS = [], ADV_RINGS = 9, ADV_SEED = 20261028;
var ADV_MINARC = 58, ADV_TARGET_RING_NODES = 223;
function AdvRegion(_v486) {
  for (var _v487 = 0; _v487 < ADV_REGIONS.length; _v487++) if (ADV_REGIONS[_v487].k === _v486) return ADV_REGIONS[_v487];
  return null;
}
function AdvKnownStats() {
  try {
    return ex || ({});
  } catch (_v488) {
    return {};
  }
}
function AdvMergeEffects() {
  var _v489 = typeof window !== "undefined" && window.RIFT_STAR_EFFECTS || [];
  var _v490 = [], _v491 = {};
  _v489.concat(ADV_STAR_EFFECT_DEFAULTS).forEach(function (_v492) {
    if (!_v492 || !_v492.id || _v492.enabled === false || !_v492.region || _v491[_v492.id]) return;
    if (!ADV_REGIONS.some(function (_v493) {
      return _v493.k === _v492.region;
    })) return;
    _v491[_v492.id] = 1;
    _v490.push(_v492);
  });
  return _v490;
}
function AdvClamp(_v494, _v495, _v496) {
  return _v494 < _v495 ? _v495 : _v494 > _v496 ? _v496 : _v494;
}
function AdvRingR(_v497) {
  return 110 * Math.pow(Math.max(0, _v497), 1.12);
}
function AdvRng(_v498) {
  var _v499 = _v498 >>> 0;
  return function () {
    _v499 = _v499 + 0x6D2B79F5 >>> 0;
    var _v500 = _v499;
    _v500 = Math.imul(_v500 ^ _v500 >>> 15, _v500 | 1);
    _v500 ^= _v500 + Math.imul(_v500 ^ _v500 >>> 7, _v500 | 61);
    return ((_v500 ^ _v500 >>> 14) >>> 0) / 4294967296;
  };
}
function AdvNodeRadius(_v501) {
  if (!_v501) return 6;
  switch (_v501.kind) {
    case "talent":
      return 15;
    case "start":
      return 10;
    case "notable":
      return 8.5;
    case "jewel":
      return 8;
    case "root":
      return 5;
    default:
      return 6.5;
  }
}
function AdvRingGap(_v502, _v503) {
  var _v504 = _v502.ring > 0 ? _v502.ring : 1, _v505 = _v503.ring > 0 ? _v503.ring : 1;
  return Math.abs(AdvRingR(Math.max(_v504, _v505)) - AdvRingR(Math.min(_v504, _v505))) || 100;
}
function AdvBuild() {
  if (ADV_BUILT) return;
  ADV_BUILT = !0;
  if (!ADV_EFFECTS.length) ADV_EFFECTS = AdvMergeEffects();
  ADV_NODES = [];
  ADV_BY_K = {};
  ADV_STARS = [];
  ADV_STAR_BY_K = {};
  ADV_EDGES = [];
  ADV_ADJ = {};
  ADV_RING_COUNTS = [];
  var _v506 = AdvRng(ADV_SEED);
  var _v507 = function (_v508) {
    ADV_NODES.push(_v508);
    ADV_BY_K[_v508.k] = _v508;
    ADV_ADJ[_v508.k] = [];
    return _v508;
  };
  _v507({
    k: "adv_root",
    n: "异界核心",
    d: "蛛网天赋树的中心（兼容旧存档的占位节点）",
    region: null,
    kind: "root",
    tier: "root",
    ring: 0,
    angle: 0,
    x: 0,
    y: 0,
    cost: 0,
    tags: [],
    s: [],
    col: "#e8eefc"
  });
  ADV_CLASSES.forEach(function (_v509, _v510) {
    _v507({
      k: _v509 + "_start",
      n: "职业起点·" + _v509,
      d: "本职业的蛛网起点（免费自动点亮，仅自己可见）",
      region: null,
      kind: "start",
      tier: "start",
      ring: 0,
      angle: _v510 * Math.PI * 2 / ADV_CLASSES.length,
      x: 0,
      y: 0,
      cost: 0,
      tags: [],
      s: [["life", 5]],
      col: "#8f9cff",
      cls: _v509
    });
  });
  var _v511 = [], _v512 = 0, _v513, _v514, _v515;
  for (_v513 = 1; _v513 <= ADV_RINGS; _v513++) {
    var _v516 = AdvClamp(Math.round(2 * Math.PI * AdvRingR(_v513) / ADV_MINARC), 6, 48);
    _v511.push(_v516);
    _v512 += _v516;
  }
  var _v517 = _v511.map(function (_v518) {
    return Math.max(6, Math.round(_v518 * ADV_TARGET_RING_NODES / _v512));
  });
  var _v519 = 0;
  _v517.forEach(function (_v520) {
    _v519 += _v520;
  });
  var _v521 = 0, _v522 = 0;
  while (_v519 !== ADV_TARGET_RING_NODES && _v521++ < 500) {
    _v522 = (_v522 + 1) % _v517.length;
    if (_v519 < ADV_TARGET_RING_NODES && _v517[_v522] < 48) {
      _v517[_v522]++;
      _v519++;
    } else if (_v519 > ADV_TARGET_RING_NODES && _v517[_v522] > 6) {
      _v517[_v522]--;
      _v519--;
    }
  }
  ADV_RING_COUNTS = _v517.slice();
  var _v523 = {
    fire: ["life", "crit"],
    cold: ["defence", "life"],
    light: ["crit", "defence"],
    phys: ["defence", "crit"],
    minion: ["defence", "life"],
    defence: ["cold", "phys", "minion", "fire"],
    currency: ["life", "crit"]
  };
  var _v524 = {};
  for (_v513 = 1; _v513 <= ADV_RINGS; _v513++) {
    var _v525 = _v517[_v513 - 1], _v526 = AdvRingR(_v513), _v527 = Math.PI * 2 / _v525;
    var _v528 = _v513 % 2 === 1 ? _v527 / 2 : 0;
    var _v529 = _v513 > 1 ? _v526 - AdvRingR(_v513 - 1) : _v526;
    var _v530 = [];
    for (_v514 = 0; _v514 < _v525; _v514++) {
      var _v531 = (_v506() * 2 - 1) * 0.3 * _v527;
      var _v532 = _v528 + _v514 * _v527 + _v531;
      var _v533 = _v514 % 3 === 0 ? (_v506() * 2 - 1) * 0.15 * _v529 : 0;
      var _v534 = _v526 + _v533;
      var _v535 = Math.floor((_v532 + Math.PI * 2) % (Math.PI * 2) / (Math.PI * 2 / 7)) % 7;
      var _v536 = ADV_REGIONS[_v535];
      var _v537 = _v514 % 5 === 2;
      var _v538 = [_v536.tag], _v539 = _v523[_v536.k] || [];
      if (_v539.length && _v514 % 4 === 0) _v538.push(_v539[_v514 % _v539.length]);
      if (_v539.length && _v514 % 7 === 3) _v538.push(_v539[(_v514 + 1) % _v539.length]);
      var _v540 = _v537 ? 8 : 3 + Math.floor(_v513 / 2) + _v514 % 3, _v541 = [[_v536.main, _v540]];
      if (_v537) _v541.push([_v536.sub, 5]); else if (_v514 % 4 === 1) _v541.push([_v536.sub, 2]);
      var _v542 = _v507({
        k: "adv_" + _v513 + "_" + _v514,
        n: _v536.n + "·" + (_v537 ? "显著" : "节点") + _v513 + "-" + _v514,
        d: _v541.map(function (_v543) {
          return AdvStatLabel(_v543[0], _v543[1]);
        }).join(" · "),
        region: _v536.k,
        kind: _v537 ? "notable" : "small",
        tier: _v537 ? "notable" : "small",
        ring: _v513,
        angle: _v532,
        x: Math.cos(_v532) * _v534,
        y: Math.sin(_v532) * _v534,
        cost: 1,
        tags: _v538,
        s: _v541,
        col: _v536.col
      });
      _v530.push(_v542);
    }
    _v530.sort(function (_v544, _v545) {
      return _v544.angle - _v545.angle;
    });
    _v524[_v513] = _v530;
  }
  ADV_REGIONS.forEach(function (_v546, _v547) {
    var _v548 = _v547 * Math.PI * 2 / 7 + Math.PI / 7;
    var _v549 = AdvClamp(2 + _v547, 2, 8), _v550 = AdvRingR(_v549) * 1.06;
    _v507({
      k: _v546.k + "_talent",
      n: _v546.n + "·天赋节点",
      d: "区域大天赋节点 · 点亮后解锁对应星图区域",
      region: _v546.k,
      kind: "talent",
      tier: "talent",
      ring: _v549,
      angle: _v548,
      x: Math.cos(_v548) * _v550,
      y: Math.sin(_v548) * _v550,
      cost: AdvCfg().talentCost,
      tags: [_v546.tag],
      s: [[_v546.main, 18], [_v546.sub, 10]],
      col: _v546.col
    });
  });
  for (var _v551 = 0; _v551 < 6; _v551++) {
    var _v552 = _v551 * Math.PI * 2 / 6 + Math.PI / 6, _v553 = AdvRingR(1) * 1.45;
    _v507({
      k: "adv_jewel_" + (_v551 + 1),
      n: "珠宝栏位·" + (_v551 + 1),
      d: "点亮后提供 1 个珠宝插槽（点击镶嵌背包里的珠宝）",
      region: ADV_REGIONS[_v551 % 7].k,
      kind: "jewel",
      tier: "jewel",
      ring: 0,
      angle: _v552,
      x: Math.cos(_v552) * _v553,
      y: Math.sin(_v552) * _v553,
      cost: 1,
      tags: ["jewel"],
      s: [],
      col: "#c8a8ff"
    });
  }
  ADV_REGIONS.forEach(function (_v554, _v555) {
    var _v556 = _v555 * Math.PI * 2 / 7 + Math.PI / 7, _v557 = Math.cos(_v556) * 470, _v558 = Math.sin(_v556) * 470;
    var _v559 = ADV_EFFECTS.filter(function (_v560) {
      return _v560.region === _v554.k;
    });
    for (var _v561 = 0; _v561 < 5; _v561++) {
      var _v562 = _v559[_v561];
      if (!_v562) {
        _v562 = {
          id: _v554.k + "_fallback_" + _v561,
          n: _v554.n + "共鸣" + (_v561 + 1),
          region: _v554.k,
          d: "区域联动",
          require: {
            tags: [_v554.tag],
            min: 2 + _v561 % 2
          },
          text: "区域效果 +{0}%",
          stats: (function () {
            var _v563 = {};
            _v563[_v554.main] = 4 + _v561;
            return _v563;
          })()
        };
      }
      var _v564 = _v561 * Math.PI * 2 / 5;
      var _v565 = {
        k: "star_" + _v554.k + "_" + (_v561 + 1),
        n: _v562.n,
        d: _v562.d,
        region: _v554.k,
        effect: _v562,
        x: _v557 + Math.cos(_v564) * 110,
        y: _v558 + Math.sin(_v564) * 110,
        cost: AdvCfg().starCost,
        col: _v554.col
      };
      ADV_STARS.push(_v565);
      ADV_STAR_BY_K[_v565.k] = _v565;
    }
  });
  var _v566 = ADV_NODES.filter(function (_v567) {
    return _v567.ring > 0;
  });
  for (var _v568 = 0; _v568 < 3; _v568++) {
    for (var _v569 = 0; _v569 < _v566.length; _v569++) for (var _v570 = _v569 + 1; _v570 < _v566.length; _v570++) {
      var _v571 = _v566[_v569], _v572 = _v566[_v570], _v573 = _v572.x - _v571.x, _v574 = _v572.y - _v571.y, _v575 = Math.hypot(_v573, _v574), _v576 = AdvNodeRadius(_v571) + AdvNodeRadius(_v572) + 8;
      if (_v575 < _v576) {
        if (_v575 < 0.001) {
          _v573 = 1;
          _v574 = 0;
          _v575 = 1;
        }
        var _v577 = (_v576 - _v575) / 2 + 0.5;
        _v571.x -= _v573 / _v575 * _v577;
        _v571.y -= _v574 / _v575 * _v577;
        _v572.x += _v573 / _v575 * _v577;
        _v572.y += _v574 / _v575 * _v577;
      }
    }
  }
  var _v578 = function (_v579, _v580, _v581) {
    if (!_v579 || !_v580 || _v579.k === _v580.k) return;
    var _v582 = _v579.k < _v580.k ? _v579.k : _v580.k, _v583 = _v579.k < _v580.k ? _v580.k : _v579.k;
    if (_v579.ring === 0 && _v580.ring === 0) return;
    var _v584 = _v579.ring > 0 ? _v579.ring : 0, _v585 = _v580.ring > 0 ? _v580.ring : 0;
    if (_v584 > 0 && _v585 > 0 && Math.abs(_v584 - _v585) > 1) return;
    if (_v584 === 0 && _v585 > 1) return;
    for (var _v586 = 0; _v586 < ADV_EDGES.length; _v586++) if (ADV_EDGES[_v586].a === _v582 && ADV_EDGES[_v586].b === _v583) return;
    ADV_EDGES.push({
      a: _v582,
      b: _v583,
      kind: _v581 || "cross"
    });
  };
  for (_v513 = 1; _v513 <= ADV_RINGS; _v513++) {
    var _v587 = _v524[_v513];
    for (_v514 = 0; _v514 < _v587.length; _v514++) _v578(_v587[_v514], _v587[(_v514 + 1) % _v587.length], "ring");
  }
  for (_v513 = 1; _v513 < ADV_RINGS; _v513++) {
    var _v588 = _v524[_v513 + 1];
    _v524[_v513].forEach(function (_v589) {
      var _v590 = null, _v591 = null, _v592 = 1e9, _v593 = 1e9;
      _v588.forEach(function (_v594) {
        var _v595 = Math.abs(_v589.angle - _v594.angle);
        if (_v595 > Math.PI) _v595 = Math.PI * 2 - _v595;
        if (_v595 < _v592) {
          _v593 = _v592;
          _v591 = _v590;
          _v592 = _v595;
          _v590 = _v594;
        } else if (_v595 < _v593) {
          _v593 = _v595;
          _v591 = _v594;
        }
      });
      if (_v590) _v578(_v589, _v590, "cross");
      if (_v591 && _v593 < _v592 * 1.15) _v578(_v589, _v591, "cross");
    });
  }
  ADV_CLASSES.forEach(function (_v596) {
    var _v597 = ADV_BY_K[_v596 + "_start"];
    var _v598 = _v524[1].slice().sort(function (_v599, _v600) {
      return Math.abs(_v599.angle - _v597.angle) - Math.abs(_v600.angle - _v597.angle);
    });
    if (_v598[0]) _v578(_v597, _v598[0], "cross");
    if (_v598[1]) _v578(_v597, _v598[1], "cross");
  });
  for (_v551 = 0; _v551 < 6; _v551++) {
    var _v601 = ADV_BY_K["adv_jewel_" + (_v551 + 1)];
    var _v602 = _v524[1].slice().sort(function (_v603, _v604) {
      return Math.hypot(_v603.x - _v601.x, _v603.y - _v601.y) - Math.hypot(_v604.x - _v601.x, _v604.y - _v601.y);
    });
    if (_v602[0]) _v578(_v601, _v602[0], "cluster");
    if (_v602[1]) _v578(_v601, _v602[1], "cluster");
  }
  ADV_REGIONS.forEach(function (_v605) {
    var _v606 = ADV_BY_K[_v605.k + "_talent"];
    var _v607 = ADV_NODES.filter(function (_v608) {
      return _v608.region === _v605.k && _v608.k !== _v606.k && _v608.kind !== "start";
    });
    _v607.sort(function (_v609, _v610) {
      return Math.hypot(_v609.x - _v606.x, _v609.y - _v606.y) - Math.hypot(_v610.x - _v606.x, _v610.y - _v606.y);
    });
    _v607.slice(0, 3).forEach(function (_v611) {
      _v578(_v606, _v611, "cluster");
    });
  });
  ADV_REGIONS.forEach(function (_v612) {
    var _v613 = {};
    ADV_NODES.forEach(function (_v614) {
      if (_v614.region === _v612.k && _v614.ring > 0 && _v614.kind !== "talent") (_v613[_v614.ring] = _v613[_v614.ring] || []).push(_v614);
    });
    Object.keys(_v613).forEach(function (_v615) {
      var _v616 = _v613[_v615].sort(function (_v617, _v618) {
        return _v617.angle - _v618.angle;
      });
      for (var _v619 = 0; _v619 < _v616.length; _v619 += 3) {
        var _v620 = _v616.slice(_v619, _v619 + 3);
        if (_v620.length < 3) continue;
        var _v621 = [];
        for (var _v622 = 0; _v622 < _v620.length; _v622++) for (var _v623 = _v622 + 1; _v623 < _v620.length; _v623++) _v621.push([_v620[_v622], _v620[_v623]]);
        var _v624 = null, _v625 = -1;
        _v621.forEach(function (_v626) {
          var _v627 = Math.hypot(_v626[0].x - _v626[1].x, _v626[0].y - _v626[1].y);
          _v578(_v626[0], _v626[1], "cluster");
          if (_v627 > _v625) {
            _v625 = _v627;
            _v624 = _v626;
          }
        });
        if (_v624) {
          var _v628 = _v624[0].k < _v624[1].k ? _v624[0].k : _v624[1].k, _v629 = _v624[0].k < _v624[1].k ? _v624[1].k : _v624[0].k;
          ADV_EDGES = ADV_EDGES.filter(function (_v630) {
            return !(_v630.a === _v628 && _v630.b === _v629 && _v630.kind === "cluster");
          });
        }
      }
    });
  });
  ADV_EDGES = ADV_EDGES.filter(function (_v631) {
    var _v632 = ADV_BY_K[_v631.a], _v633 = ADV_BY_K[_v631.b];
    if (!_v632 || !_v633) return false;
    if (_v631.kind !== "cross") return true;
    var _v634 = AdvRingGap(_v632, _v633), _v635 = Math.hypot(_v632.x - _v633.x, _v632.y - _v633.y);
    return _v635 <= _v634 * 2.2;
  });
  ADV_EDGES = ADV_EDGES.filter(function (_v636) {
    var _v637 = ADV_BY_K[_v636.a], _v638 = ADV_BY_K[_v636.b];
    if (!_v637 || !_v638) return false;
    if (_v637.ring > 0 && _v638.ring > 0 && Math.abs(_v637.ring - _v638.ring) > 1) return false;
    if (_v637.ring === 0 && _v638.ring > 1 || _v638.ring === 0 && _v637.ring > 1) return false;
    return true;
  });
  var _v639 = function () {
    ADV_ADJ = {};
    ADV_NODES.forEach(function (_v640) {
      ADV_ADJ[_v640.k] = [];
    });
    ADV_EDGES.forEach(function (_v641) {
      if (ADV_ADJ[_v641.a] && ADV_ADJ[_v641.b]) {
        ADV_ADJ[_v641.a].push(_v641.b);
        ADV_ADJ[_v641.b].push(_v641.a);
      }
    });
  };
  for (var _v642 = 0; _v642 < 400; _v642++) {
    _v639();
    var _v643 = null, _v644 = 6;
    ADV_NODES.forEach(function (_v645) {
      var _v646 = (ADV_ADJ[_v645.k] || []).length;
      if (_v646 > _v644) {
        _v644 = _v646;
        _v643 = _v645;
      }
    });
    if (!_v643) break;
    var _v647 = ADV_EDGES.filter(function (_v648) {
      return _v648.a === _v643.k || _v648.b === _v643.k;
    });
    var _v649 = _v647.filter(function (_v650) {
      return _v650.kind !== "ring";
    });
    if (!_v649.length) _v649 = _v647;
    _v649.sort(function (_v651, _v652) {
      var _v653 = ADV_BY_K[_v651.a], _v654 = ADV_BY_K[_v651.b], _v655 = ADV_BY_K[_v652.a], _v656 = ADV_BY_K[_v652.b];
      return Math.hypot(_v655.x - _v656.x, _v655.y - _v656.y) - Math.hypot(_v653.x - _v654.x, _v653.y - _v654.y);
    });
    ADV_EDGES = ADV_EDGES.filter(function (_v657) {
      return _v657 !== _v649[0];
    });
  }
  var _v658 = function () {
    _v639();
    var _v659 = {}, _v660 = [];
    ADV_NODES.forEach(function (_v661) {
      if (_v659[_v661.k] || _v661.kind === "root") return;
      var _v662 = [_v661.k], _v663 = [];
      _v659[_v661.k] = 1;
      while (_v662.length) {
        var _v664 = _v662.pop();
        _v663.push(_v664);
        (ADV_ADJ[_v664] || []).forEach(function (_v665) {
          if (!_v659[_v665]) {
            _v659[_v665] = 1;
            _v662.push(_v665);
          }
        });
      }
      _v660.push(_v663);
    });
    return _v660;
  };
  var _v666 = _v658();
  var _v667 = 0;
  while (_v666.length > 1 && _v667++ < 400) {
    var _v668 = null, _v669 = 1e18;
    _v666[0].forEach(function (_v670) {
      _v666.slice(1).forEach(function (_v671) {
        _v671.forEach(function (_v672) {
          var _v673 = ADV_BY_K[_v670], _v674 = ADV_BY_K[_v672], _v675 = Math.hypot(_v673.x - _v674.x, _v673.y - _v674.y);
          if (_v675 < _v669) {
            _v669 = _v675;
            _v668 = [_v673, _v674];
          }
        });
      });
    });
    if (!_v668) break;
    var _v676 = ADV_EDGES.length;
    _v578(_v668[0], _v668[1], "cluster");
    if (ADV_EDGES.length === _v676) {
      ADV_EDGES.push({
        a: _v668[0].k < _v668[1].k ? _v668[0].k : _v668[1].k,
        b: _v668[0].k < _v668[1].k ? _v668[1].k : _v668[0].k,
        kind: "cluster"
      });
    }
    _v666 = _v658();
  }
  for (var _v677 = 0; _v677 < 200; _v677++) {
    _v639();
    var _v678 = ADV_NODES.filter(function (_v679) {
      return _v679.kind !== "root" && !(_v679.kind === "start" && _v679.cls !== (h && h.advClassStart || h && h.cls));
    });
    var _v680 = _v678.reduce(function (_v681, _v682) {
      return _v681 + (ADV_ADJ[_v682.k] || []).length;
    }, 0) / _v678.length;
    if (_v680 >= 2.6) break;
    var _v683 = _v678.filter(function (_v684) {
      return (ADV_ADJ[_v684.k] || []).length < 2;
    })[0];
    if (!_v683) break;
    var _v685 = ADV_NODES.filter(function (_v686) {
      return _v686.k !== _v683.k && _v686.kind !== "root" && _v686.ring > 0 && Math.abs(_v686.ring - _v683.ring) <= 1;
    }).sort(function (_v687, _v688) {
      return Math.hypot(_v687.x - _v683.x, _v687.y - _v683.y) - Math.hypot(_v688.x - _v683.x, _v688.y - _v683.y);
    })[0];
    if (!_v685) break;
    _v578(_v683, _v685, "cross");
  }
  var _v689 = function () {
    var _v690 = ADV_NODES.filter(function (_v691) {
      return _v691.kind !== "root";
    });
    if (!_v690.length) return true;
    var _v692 = _v690[0].k, _v693 = {}, _v694 = [_v692];
    _v693[_v692] = 1;
    while (_v694.length) {
      var _v695 = _v694.pop();
      (ADV_ADJ[_v695] || []).forEach(function (_v696) {
        if (!_v693[_v696]) {
          _v693[_v696] = 1;
          _v694.push(_v696);
        }
      });
    }
    return _v690.every(function (_v697) {
      return _v693[_v697.k];
    });
  };
  for (var _v698 = 0; _v698 < 400; _v698++) {
    _v639();
    var _v699 = ADV_NODES.filter(function (_v700) {
      return _v700.kind !== "root";
    });
    var _v701 = _v699.reduce(function (_v702, _v703) {
      return _v702 + (ADV_ADJ[_v703.k] || []).length;
    }, 0);
    if (_v701 / _v699.length <= 3.4) break;
    var _v704 = ADV_EDGES.filter(function (_v705) {
      return _v705.kind !== "ring";
    }).sort(function (_v706, _v707) {
      var _v708 = ADV_BY_K[_v706.a], _v709 = ADV_BY_K[_v706.b], _v710 = ADV_BY_K[_v707.a], _v711 = ADV_BY_K[_v707.b];
      return Math.hypot(_v710.x - _v711.x, _v710.y - _v711.y) - Math.hypot(_v708.x - _v709.x, _v708.y - _v709.y);
    });
    var _v712 = false;
    for (var _v713 = 0; _v713 < _v704.length; _v713++) {
      var _v714 = _v704[_v713];
      var _v715 = ADV_BY_K[_v714.a], _v716 = ADV_BY_K[_v714.b];
      if ((ADV_ADJ[_v715.k] || []).length <= 2 || (ADV_ADJ[_v716.k] || []).length <= 2) continue;
      var _v717 = ADV_EDGES.indexOf(_v714);
      if (_v717 < 0) continue;
      ADV_EDGES.splice(_v717, 1);
      _v639();
      if (_v689()) {
        _v712 = true;
        break;
      }
      ADV_EDGES.splice(_v717, 0, _v714);
      _v639();
    }
    if (!_v712) break;
  }
  _v639();
  var _v718 = ADV_NODES.filter(function (_v719) {
    return _v719.kind !== "root" && _v719.kind !== "start";
  });
  _v718 = _v718.concat(ADV_NODES.filter(function (_v720) {
    return _v720.kind === "start" && _v720.cls === (h && (h.advClassStart || h.cls) || "warrior");
  }));
  var _v721 = 0, _v722 = 0, _v723 = 0, _v724 = 0;
  _v718.forEach(function (_v725) {
    var _v726 = (ADV_ADJ[_v725.k] || []).length;
    _v721 += _v726;
    if (_v726 > _v722) _v722 = _v726;
  });
  ADV_EDGES.forEach(function (_v727) {
    var _v728 = ADV_BY_K[_v727.a], _v729 = ADV_BY_K[_v727.b];
    if (_v728.ring > 0 && _v729.ring > 0 && Math.abs(_v728.ring - _v729.ring) > 1) _v723++;
    if (_v727.kind === "cross" && Math.hypot(_v728.x - _v729.x, _v728.y - _v729.y) > AdvRingGap(_v728, _v729) * 2.2 + 0.001) _v724++;
  });
  ADV_METRICS = {
    nodeCount: ADV_NODES.length,
    visibleNodes: _v718.length,
    edgeCount: ADV_EDGES.length,
    avgDegree: _v718.length ? _v721 / _v718.length : 0,
    maxDegree: _v722,
    cross2Ring: _v723,
    longEdges: _v724,
    rings: ADV_RINGS,
    ringCounts: ADV_RING_COUNTS.slice()
  };
}
function AdvLoadEffects() {
  ADV_EFFECTS = AdvMergeEffects();
}
function AdvNode(_v730) {
  AdvBuild();
  return ADV_BY_K[_v730] || null;
}
function AdvStar(_v731) {
  AdvBuild();
  return ADV_STAR_BY_K[_v731] || null;
}
function AdvStartKey() {
  var _v732 = h && h.advClassStart || h && h.cls || "warrior";
  return ADV_BY_K[_v732 + "_start"] ? _v732 + "_start" : "warrior_start";
}
function AdvVisible(_v733) {
  var _v734 = AdvNode(_v733);
  if (!_v734) return false;
  if (_v734.kind === "root") return false;
  if (_v734.kind === "start") return _v733 === AdvStartKey();
  return true;
}
function AdvNeighbors(_v735) {
  AdvBuild();
  return (ADV_ADJ[_v735] || []).slice();
}
function AdvEarned() {
  var _v736 = AdvCfg();
  var _v737 = Math.max(1, Math.floor(+(h && h.level) || 1));
  var _v738 = Object.keys(h && h.done || ({})).length;
  var _v739 = Math.max(0, Math.floor(+(h && h.simRuns || 0)));
  var _v740 = Math.max(0, Math.floor(+(h && h.advBonus || 0)));
  return Math.floor(_v737 / _v736.perLevel) + Math.floor(_v738 / _v736.atlasEvery) + Math.floor(_v739 / _v736.simEvery) + _v740;
}
function AdvNodeCost(_v741) {
  return _v741 ? _v741.cost || 0 : 0;
}
function AdvUsed() {
  AdvBuild();
  var _v742 = 0;
  (h && h.advTree || []).forEach(function (_v743) {
    var _v744 = ADV_BY_K[_v743];
    if (_v744) _v742 += AdvNodeCost(_v744);
  });
  (h && h.starTree || []).forEach(function (_v745) {
    var _v746 = ADV_STAR_BY_K[_v745];
    if (_v746) _v742 += _v746.cost || AdvCfg().starCost;
  });
  return _v742;
}
function AdvLeft() {
  return Math.max(0, AdvEarned() - AdvUsed());
}
function AdvAllocated(_v747) {
  return !!h && Array.isArray(h.advTree) && h.advTree.indexOf(_v747) >= 0;
}
function AdvStarAllocated(_v748) {
  return !!h && Array.isArray(h.starTree) && h.starTree.indexOf(_v748) >= 0;
}
function AdvComponent() {
  AdvBuild();
  var _v749 = AdvStartKey(), _v750 = {};
  if (!AdvAllocated(_v749)) return _v750;
  var _v751 = [_v749];
  _v750[_v749] = 1;
  while (_v751.length) {
    var _v752 = _v751.pop();
    (ADV_ADJ[_v752] || []).forEach(function (_v753) {
      if (!_v750[_v753] && AdvAllocated(_v753)) {
        _v750[_v753] = 1;
        _v751.push(_v753);
      }
    });
  }
  return _v750;
}
function AdvReachable(_v754) {
  var _v755 = AdvNode(_v754);
  if (!_v755 || !AdvVisible(_v754) || AdvAllocated(_v754)) return false;
  var _v756 = AdvComponent();
  return (ADV_ADJ[_v754] || []).some(function (_v757) {
    return _v756[_v757];
  });
}
function AdvAllocNeighbors(_v758) {
  return (ADV_ADJ[_v758] || []).filter(function (_v759) {
    return AdvAllocated(_v759);
  });
}
function AdvReason(_v760) {
  AdvBuild();
  var _v761 = ADV_BY_K[_v760];
  if (!_v761) return "未知高级天赋节点";
  if (!h) return "没有可用角色";
  if (AdvAllocated(_v760)) return "已经点亮";
  if (_v761.kind === "root") return "核心节点不可点亮";
  if (_v761.kind === "start" && !AdvVisible(_v760)) return "只能选择本职业的起点";
  var _v762 = AdvNodeCost(_v761);
  if (_v762 > 0 && AdvLeft() < _v762) return "高级天赋点不足 (需要 " + _v762 + ", 可用 " + AdvLeft() + ")";
  if (!AdvAllocNeighbors(_v760).length) return "需从你的职业起点沿蛛网连线扩展到这里";
  var _v763 = AdvComponent();
  if (!(ADV_ADJ[_v760] || []).some(function (_v764) {
    return _v763[_v764];
  })) return "需从你的职业起点沿蛛网连线扩展到这里";
  if (_v761.kind === "notable" && AdvAllocNeighbors(_v760).length < 2) return "显著节点需要 2 个已点亮邻接节点";
  if (_v761.kind === "talent" && AdvAllocNeighbors(_v760).length < 2) return "区域天赋节点需要 2 个已点亮邻接节点";
  return null;
}
function AdvCanAlloc(_v765) {
  return AdvReason(_v765) === null;
}
function AdvAlloc(_v766) {
  var _v767 = AdvReason(_v766);
  if (_v767) return _v767;
  (h.advTree = h.advTree || []).push(_v766);
  if (o) o.advSel = _v766;
  return null;
}
function AdvRespec(_v768) {
  if (!h) return "没有可用角色";
  if (!AdvAllocated(_v768)) return "该节点没有点亮";
  var _v769 = ADV_BY_K[_v768];
  if (_v769 && (_v769.kind === "start" || _v769.kind === "root")) return "职业起点/核心不可退还";
  var _v770 = h.advTree.slice();
  h.advTree = h.advTree.filter(function (_v771) {
    return _v771 !== _v768;
  });
  var _v772 = AdvComponent();
  var _v773 = h.advTree.some(function (_v774) {
    var _v775 = AdvVisible(_v774);
    if (!_v775) return false;
    return !_v772[_v774];
  });
  h.advTree = _v770;
  if (_v773) return "需先退还更远的节点（会断开蛛网连线）";
  h.advTree = h.advTree.filter(function (_v776) {
    return _v776 !== _v768;
  });
  return null;
}
function AdvRegionUnlocked(_v777) {
  return AdvAllocated(_v777 + "_talent");
}
function AdvStarReason(_v778) {
  AdvBuild();
  var _v779 = ADV_STAR_BY_K[_v778];
  if (!_v779) return "未知星图节点";
  if (!h) return "没有可用角色";
  if (AdvStarAllocated(_v778)) return "已经点亮";
  if (!AdvRegionUnlocked(_v779.region)) return "星图区域未解锁 · 先点亮「" + (AdvRegion(_v779.region) || ({
    n: _v779.region
  })).n + "·天赋节点」";
  if (AdvLeft() < (_v779.cost || AdvCfg().starCost)) return "高级天赋点不足 (需要 " + (_v779.cost || AdvCfg().starCost) + ", 可用 " + AdvLeft() + ")";
  return null;
}
function AdvStarCanAlloc(_v780) {
  return AdvStarReason(_v780) === null;
}
function AdvStarAlloc(_v781) {
  var _v782 = AdvStarReason(_v781);
  if (_v782) return _v782;
  (h.starTree = h.starTree || []).push(_v781);
  return null;
}
function AdvStarRespec(_v783) {
  if (!h || !AdvStarAllocated(_v783)) return "该星图节点没有点亮";
  h.starTree = h.starTree.filter(function (_v784) {
    return _v784 !== _v783;
  });
  return null;
}
function AdvJewelSlots() {
  AdvBuild();
  return (h && h.advTree || []).filter(function (_v785) {
    var _v786 = ADV_BY_K[_v785];
    return _v786 && _v786.tier === "jewel";
  }).length;
}
function AdvBaseNodesAllocated() {
  AdvBuild();
  return (h && h.advTree || []).map(function (_v787) {
    return ADV_BY_K[_v787];
  }).filter(function (_v788) {
    return _v788 && _v788.tier !== "start" && _v788.tier !== "root" && _v788.tier !== "jewel";
  });
}
function AdvEffectMatches(_v789) {
  var _v790 = _v789.require || ({}), _v791 = _v790.tags || [];
  var _v792 = AdvBaseNodesAllocated(), _v793 = [], _v794 = {};
  _v792.forEach(function (_v795) {
    var _v796 = (_v795.tags || []).some(function (_v797) {
      return _v791.indexOf(_v797) >= 0;
    });
    if (_v796) {
      _v793.push(_v795);
      (_v795.tags || []).forEach(function (_v798) {
        if (_v791.indexOf(_v798) >= 0) _v794[_v798] = 1;
      });
    }
  });
  if (_v790.nodes && !_v790.nodes.every(function (_v799) {
    return AdvAllocated(_v799);
  })) return null;
  if (!_v791.every(function (_v800) {
    return _v794[_v800];
  })) return null;
  if (_v793.length < (_v790.min || _v791.length)) return null;
  return _v793;
}
function AdvEffectText(_v801) {
  var _v802 = "";
  if (_v801.stats) for (var _v803 in _v801.stats) {
    _v802 = _v801.stats[_v803];
    break;
  }
  return String(_v801.text || _v801.d || "").replace("{0}", String(_v802));
}
function AdvActiveEffects() {
  AdvBuild();
  var _v804 = [];
  (h && h.starTree || []).forEach(function (_v805) {
    var _v806 = ADV_STAR_BY_K[_v805];
    if (!_v806 || !_v806.effect) return;
    var _v807 = AdvEffectMatches(_v806.effect);
    if (!_v807 || !_v807.length) return;
    _v804.push({
      star: _v805,
      id: _v806.effect.id,
      n: _v806.effect.n,
      region: _v806.region,
      d: _v806.effect.d,
      text: AdvEffectText(_v806.effect),
      effect: _v806.effect,
      matched: _v807.map(function (_v808) {
        return _v808.k;
      })
    });
  });
  return _v804;
}
function AdvEffectKnownStats(_v809) {
  var _v810 = AdvKnownStats(), _v811 = {};
  if (!_v809 || !_v809.stats) return _v811;
  for (var _v812 in _v809.stats) if (_v810[_v812]) _v811[_v812] = _v809.stats[_v812];
  return _v811;
}
function AdvJewelTotals() {
  AdvBuild();
  var _v813 = {}, _v814 = AdvKnownStats();
  if (!h || !h.advJewels) return _v813;
  (h.advTree || []).forEach(function (_v815) {
    var _v816 = ADV_BY_K[_v815];
    if (!_v816 || _v816.tier !== "jewel") return;
    var _v817 = h.advJewels[_v815];
    var _v818 = typeof JewelDef === "function" ? JewelDef(_v817) : null;
    if (!_v818 || !_v818.stats) return;
    _v818.stats.forEach(function (_v819) {
      if (_v814[_v819[0]]) _v813[_v819[0]] = (_v813[_v819[0]] || 0) + _v819[1];
    });
  });
  return _v813;
}
function AdvStatTotals() {
  AdvBuild();
  var _v820 = {}, _v821 = AdvKnownStats();
  if (!h) return _v820;
  (h.advTree || []).forEach(function (_v822) {
    var _v823 = ADV_BY_K[_v822];
    if (!_v823) return;
    (_v823.s || []).forEach(function (_v824) {
      if (_v821[_v824[0]]) _v820[_v824[0]] = (_v820[_v824[0]] || 0) + _v824[1];
    });
  });
  var _v825 = AdvJewelTotals();
  for (var _v826 in _v825) _v820[_v826] = (_v820[_v826] || 0) + _v825[_v826];
  var _v827 = AdvActiveEffects();
  _v827.forEach(function (_v828) {
    var _v829 = AdvEffectKnownStats(_v828.effect);
    for (var _v830 in _v829) _v820[_v830] = (_v820[_v830] || 0) + _v829[_v830];
  });
  return _v820;
}
function AdvNodeStarLines(_v831) {
  var _v832 = [];
  AdvActiveEffects().forEach(function (_v833) {
    if (_v833.matched.indexOf(_v831.k) >= 0) _v832.push(_v833.n + ": " + _v833.text);
  });
  return _v832;
}
function AdvMigrateSave(_v834) {
  if (!_v834) return;
  AdvBuild();
  _v834.advTree = Array.isArray(_v834.advTree) ? _v834.advTree.slice() : [];
  _v834.starTree = Array.isArray(_v834.starTree) ? _v834.starTree.slice() : [];
  _v834.advBonus = Math.max(0, Math.floor(+(_v834.advBonus || 0)));
  _v834.advClassStart = _v834.advClassStart || _v834.cls || "warrior";
  if (!ADV_BY_K[_v834.advClassStart + "_start"]) _v834.advClassStart = "warrior";
  ["adv_root", _v834.advClassStart + "_start"].forEach(function (_v835) {
    if (ADV_BY_K[_v835] && _v834.advTree.indexOf(_v835) < 0) _v834.advTree.push(_v835);
  });
  var _v836 = _v834.advJewels && typeof _v834.advJewels === "object" && !Array.isArray(_v834.advJewels) ? _v834.advJewels : {};
  var _v837 = {};
  Object.keys(_v836).forEach(function (_v838) {
    var _v839 = ADV_BY_K[_v838], _v840 = _v836[_v838];
    if (_v839 && _v839.tier === "jewel" && typeof _v840 === "string" && (typeof JewelDef !== "function" || JewelDef(_v840))) _v837[_v838] = _v840;
  });
  _v834.advJewels = _v837;
}
function AdvTabsBar() {
  var _v841 = o && o.advTab || "tree";
  var _v842 = function (_v843, _v844) {
    return '<button class="btn small' + (_v841 === _v843 ? " primary" : "") + '" data-advtab="' + _v843 + '">' + _v844 + "</button>";
  };
  return '<div class="shoptabs" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">' + _v842("tree", "天赋树") + _v842("base", "高级基底") + _v842("star", "星图") + '<span class="dim" style="align-self:center;font-size:11.5px">蛛网天赋树：滚轮以鼠标为锚缩放 · 拖拽平移 · 悬停高亮邻接 · 从职业起点沿连线点亮</span></div>';
}
function AdvRegionBars() {
  AdvBuild();
  return ADV_REGIONS.map(function (_v845) {
    var _v846 = 0, _v847 = 0;
    ADV_NODES.forEach(function (_v848) {
      if (_v848.region === _v845.k) {
        _v846++;
        if (AdvAllocated(_v848.k)) _v847++;
      }
    });
    var _v849 = _v846 ? Math.round(_v847 / _v846 * 100) : 0;
    var _v850 = AdvRegionUnlocked(_v845.k);
    return '<div style="display:flex;align-items:center;gap:8px;margin:3px 0"><b style="width:54px;color:' + _v845.col + '">' + _v845.n + (_v850 ? " ★" : "") + '</b><div style="flex:1;height:8px;background:#1a1620;border:1px solid #2e2834"><div style="width:' + _v849 + '%;height:100%;background:' + _v845.col + '"></div></div><span class="dim" style="width:64px;text-align:right">' + _v847 + "/" + _v846 + (_v850 ? " 解锁" : "") + "</span></div>";
  }).join("");
}
function AdvStarRegionsHTML() {
  var _v851 = ADV_REGIONS.map(function (_v852) {
    var _v853 = AdvRegionUnlocked(_v852.k);
    var _v854 = ADV_STARS.filter(function (_v855) {
      return _v855.region === _v852.k;
    }).length;
    var _v856 = (h && h.starTree || []).filter(function (_v857) {
      var _v858 = ADV_STAR_BY_K[_v857];
      return _v858 && _v858.region === _v852.k;
    }).length;
    return '<div class="baff" style="display:block"><span class="btxt"><b style="color:' + (_v853 ? _v852.col : "#6a6472") + '">' + _v852.n + "</b> <small class=\"dim\">" + (_v853 ? "已解锁" : "未解锁 · 需点亮区域大天赋节点") + " · 星图节点 " + _v856 + "/" + _v854 + "</small></span></div>";
  }).join("");
  return '<div class="bsec"><h4>星图区域 <small>7 区域 · 与基底区域一一对应</small></h4>' + _v851 + "</div>";
}
function AdvActiveListHTML() {
  var _v859 = AdvActiveEffects();
  var _v860 = _v859.map(function (_v861) {
    var _v862 = AdvRegion(_v861.region) || ({
      col: "#e8c870",
      n: _v861.region
    });
    var _v863 = AdvEffectKnownStats(_v861.effect), _v864 = Object.keys(_v863).map(function (_v865) {
      return AdvStatLabel(_v865, _v863[_v865]);
    }).join(" · ");
    return '<div class="baff" style="display:block"><span class="btxt"><b style="color:' + _v862.col + '">' + _v861.n + '</b> <small class="dim">' + _v862.n + " · " + _v861.matched.length + ' 节点</small><br><span style="color:#8f9cff">「星图词条」' + _v861.text + '</span><br><span class="dim" style="font-size:11px">' + (_v864 ? "结算: " + _v864 : "仅文案（无对应结算键）") + " · 来源: " + _v861.matched.map(function (_v866) {
      return (AdvNode(_v866) || ({
        n: _v866
      })).n;
    }).join(" + ") + "</span></span></div>";
  }).join("");
  return '<div class="bsec"><h4>已激活星图联动 <small>' + _v859.length + ' 条 · 星图节点不直接加属性</small></h4>' + (_v860 || '<p class="dim">还没有激活的星图联动。先点亮基底区域的「天赋节点」解锁星图区域，再点亮满足条件的星图节点。</p>') + "</div>";
}
function AdvSelectedHTML() {
  var _v867 = o && o.advSel, _v868 = _v867 ? AdvNode(_v867) : null;
  if (!_v868 || !AdvVisible(_v867)) return "";
  var _v869 = AdvAllocated(_v867) ? '<span style="color:#9dffb4">已点亮</span>' : '<span style="color:' + (AdvCanAlloc(_v867) ? "#e8c870" : "#e06a6a") + '">' + (AdvReason(_v867) || "可点亮") + "</span>";
  var _v870 = "";
  if (AdvAllocated(_v867)) _v870 = '<button class="btn small" data-advrefund="' + _v867 + '">退还该节点</button>'; else if (AdvCanAlloc(_v867)) _v870 = '<button class="btn small" data-advalloc="' + _v867 + '">点亮</button>';
  return '<div class="bsec"><h4>选中节点</h4><div class="baff" style="display:block"><span class="btxt"><b style="color:' + (_v868.col || "#e8eefc") + '">' + _v868.n + '</b> <small class="dim">' + (_v868.region ? (AdvRegion(_v868.region) || ({
    n: _v868.region
  })).n + " · 环 " + _v868.ring : "中心") + '</small><br><span class="dim">' + _v868.d + "</span><br>" + _v869 + "</span></div>" + _v870 + "</div>";
}
function AdvJewelPanelHTMLSafe() {
  try {
    return typeof AdvJewelPanelHTML === "function" ? AdvJewelPanelHTML() : "";
  } catch (_v871) {
    return "";
  }
}
function AdvPageHTML(_v872) {
  AdvBuild();
  _v872 = _v872 === "star" ? "star" : "base";
  var _v873 = AdvEarned(), _v874 = AdvUsed(), _v875 = AdvLeft(), _v876 = AdvCfg();
  var _v877 = `<div class="ahead card"><div><span class="lab">高级天赋点</span><b class="big" style="color:#8f9cff">${_v875}</b><span class="dim"> · 已获得 ${_v873} · 已使用 ${_v874}</span></div><div><span class="lab">来源</span><span class="dim">等级每 ${_v876.perLevel} 级 +1 · 图谱每 ${_v876.atlasEvery} 个首通 +1 · 拟像每 ${_v876.simEvery} 次 +1</span></div><div class="dim" style="max-width:460px">蛛网天赋树（约 245 节点）：中心只显示本职业起点，7 大区域沿环分布；点亮需从起点沿连线可达。7 个区域大天赋节点解锁对应星图区域；6 个珠宝栏可镶嵌珠宝。</div></div>`;
  var _v878 = _v872 === "star" ? AdvStarRegionsHTML() + AdvActiveListHTML() : (function () {
    var _v879 = ADV_REGIONS.map(function (_v880) {
      var _v881 = AdvNode(_v880.k + "_talent");
      return '<div class="baff" style="display:block"><span class="btxt"><b style="color:' + _v880.col + '">' + _v880.n + " · 大天赋节点</b> <small class=\"dim\">" + (AdvAllocated(_v881.k) ? "已点亮 · 星图已解锁" : AdvReason(_v881.k) || "可点亮") + '</small><br><span class="dim" style="font-size:11px">' + _v881.d + " · 花费 " + _v881.cost + " 点</span></span></div>";
    }).join("");
    return '<div class="bsec"><h4>区域大天赋节点 <small>7 个 · 解锁对应星图区域</small></h4>' + _v879 + "</div>" + AdvSelectedHTML() + AdvJewelPanelHTMLSafe();
  })();
  return '<div class="at">' + _v877 + '<div style="display:grid;grid-template-columns:1fr 300px;gap:10px;margin-top:10px;align-items:start"><section class="card"><div class="shoptabs" style="display:flex;gap:6px;margin-bottom:6px"><button class="btn small' + (_v872 === "base" ? " primary" : "") + '" data-advtab="base">高级基底</button><button class="btn small' + (_v872 === "star" ? " primary" : "") + '" data-advtab="star">星图</button></div><div id="advWrap" style="position:relative;min-width:0"><canvas id="advcv" style="width:100%;height:600px;display:block;background:#0b0a10;border:1px solid #2e2834;cursor:grab;touch-action:none"></canvas><div id="advTip" style="display:none;position:absolute;z-index:30;max-width:290px;padding:6px 8px;background:rgba(12,10,16,.96);border:1px solid #4a4058;color:#d8d0c0;font-size:11.5px;line-height:1.5;pointer-events:none;border-radius:3px"></div><div class="dim" style="margin-top:4px">滚轮缩放 (0.3x~3x，以鼠标为锚) · 拖拽平移 · 左键点亮/选中 · 右键查看 · 悬停高亮自身+邻接节点+边</div></div></section><aside>' + AdvRegionBars() + '<div style="margin-top:8px">' + _v878 + "</div></aside></div></div>";
}
var ADV_VIEW = {
  s: 0.7,
  x: 0,
  y: 0,
  w: 900,
  h: 600,
  init: !1,
  drag: null
};
var ADV_STAR_VIEW = {
  s: 0.55,
  x: 0,
  y: 0,
  w: 900,
  h: 600,
  init: !1,
  drag: null
};
function AdvCanvasPoint(_v882, _v883) {
  var _v884 = _v883.getBoundingClientRect ? _v883.getBoundingClientRect() : {
    left: 0,
    top: 0
  };
  return {
    x: _v882.clientX - _v884.left,
    y: _v882.clientY - _v884.top
  };
}
function AdvHit(_v885, _v886, _v887) {
  AdvBuild();
  var _v888 = _v887 ? ADV_STAR_VIEW : ADV_VIEW;
  var _v889 = (_v885 - (_v888.x || 0)) / _v888.s, _v890 = (_v886 - (_v888.y || 0)) / _v888.s, _v891 = null, _v892 = 1e9;
  if (_v887) {
    ADV_STARS.forEach(function (_v893) {
      var _v894 = Math.hypot(_v893.x - _v889, _v893.y - _v890);
      if (_v894 < 22 && _v894 < _v892) {
        _v892 = _v894;
        _v891 = _v893;
      }
    });
    return _v891;
  }
  ADV_NODES.forEach(function (_v895) {
    if (!AdvVisible(_v895.k)) return;
    var _v896 = Math.hypot(_v895.x - _v889, _v895.y - _v890), _v897 = AdvNodeRadius(_v895);
    if (_v896 < _v897 + 4 && _v896 < _v892) {
      _v892 = _v896;
      _v891 = _v895;
    }
  });
  return _v891;
}
function AdvHoverInfo(_v898) {
  var _v899 = AdvNode(_v898);
  if (!_v899) return null;
  return {
    node: _v899,
    neighbors: AdvNeighbors(_v898),
    edges: ADV_EDGES.filter(function (_v900) {
      return _v900.a === _v898 || _v900.b === _v898;
    })
  };
}
function AdvDraw() {
  try {
    AdvBuild();
    var _v901 = (o && o.advTab) === "star" ? "star" : "base";
    var _v902 = document.getElementById("advcv");
    if (!_v902) return;
    var _v903 = _v902.width || 900, _v904 = _v902.height || 600, _v905 = _v902.getContext("2d");
    if (!_v905) return;
    _v905.setTransform(1, 0, 0, 1, 0, 0);
    _v905.fillStyle = "#0b0a10";
    _v905.fillRect(0, 0, _v903, _v904);
    var _v906 = _v901 === "star" ? ADV_STAR_VIEW : ADV_VIEW;
    _v906.w = _v903;
    _v906.h = _v904;
    var _v907 = AdvClamp(_v906.s || 0.7, 0.3, 3), _v908 = _v906.x || 0, _v909 = _v906.y || 0;
    _v905.setTransform(_v907, 0, 0, _v907, _v908, _v909);
    if (_v901 === "star") {
      ADV_REGIONS.forEach(function (_v910) {
        var _v911 = AdvRegionUnlocked(_v910.k), _v912 = ADV_REGIONS.indexOf(_v910);
        var _v913 = _v912 * Math.PI * 2 / 7 + Math.PI / 7, _v914 = Math.cos(_v913) * 470, _v915 = Math.sin(_v913) * 470;
        _v905.fillStyle = _v911 ? "rgba(40,36,52,0.45)" : "rgba(18,16,22,0.5)";
        _v905.beginPath();
        _v905.arc(_v914, _v915, 150, 0, 6.2832);
        _v905.fill();
        _v905.font = "700 14px monospace";
        _v905.textAlign = "center";
        _v905.fillStyle = _v911 ? _v910.col : "#4a4456";
        _v905.fillText(_v910.n + (_v911 ? " · 星图" : " · 未解锁"), _v914, _v915 - 175);
      });
      ADV_STARS.forEach(function (_v916) {
        var _v917 = AdvStarAllocated(_v916.k), _v918 = !_v917 && AdvStarCanAlloc(_v916.k);
        var _v919 = AdvActiveEffects().some(function (_v920) {
          return _v920.star === _v916.k;
        });
        var _v921 = 10;
        _v905.beginPath();
        _v905.moveTo(_v916.x, _v916.y - _v921);
        _v905.lineTo(_v916.x + _v921, _v916.y);
        _v905.lineTo(_v916.x, _v916.y + _v921);
        _v905.lineTo(_v916.x - _v921, _v916.y);
        _v905.closePath();
        _v905.fillStyle = _v917 ? _v919 ? "#ffd27a" : _v916.col : _v918 ? "#3a3048" : "#1c1824";
        _v905.fill();
        _v905.strokeStyle = _v917 ? _v919 ? "#fff0c0" : _v916.col : _v916.col;
        _v905.lineWidth = _v919 ? 2.6 : 1.4;
        _v905.stroke();
        _v905.font = "11px monospace";
        _v905.textAlign = "center";
        _v905.fillStyle = _v917 ? "#f0e8d0" : "#8e98b0";
        _v905.fillText(_v916.n, _v916.x, _v916.y - _v921 - 6);
      });
    } else {
      var _v922 = o && o.advHover || null, _v923 = o && o.advSel || null;
      var _v924 = _v922 ? ADV_ADJ[_v922] || [] : [], _v925 = _v923 ? ADV_ADJ[_v923] || [] : [];
      ADV_EDGES.forEach(function (_v926) {
        var _v927 = ADV_BY_K[_v926.a], _v928 = ADV_BY_K[_v926.b];
        if (!_v927 || !_v928 || !AdvVisible(_v927.k) || !AdvVisible(_v928.k)) return;
        var _v929 = _v922 && (_v926.a === _v922 || _v926.b === _v922) || _v923 && (_v926.a === _v923 || _v926.b === _v923);
        _v905.strokeStyle = _v929 ? "#ffd27a" : _v926.kind === "ring" ? "#2b2638" : _v926.kind === "cluster" ? "#332a44" : "#241f2c";
        _v905.lineWidth = _v929 ? 2.4 : _v926.kind === "ring" ? 1.1 : 0.9;
        _v905.beginPath();
        _v905.moveTo(_v927.x, _v927.y);
        _v905.lineTo(_v928.x, _v928.y);
        _v905.stroke();
      });
      ADV_NODES.forEach(function (_v930) {
        if (!AdvVisible(_v930.k)) return;
        var _v931 = AdvAllocated(_v930.k), _v932 = !_v931 && AdvCanAlloc(_v930.k);
        var _v933 = AdvNodeRadius(_v930);
        var _v934 = _v922 === _v930.k || _v923 === _v930.k || _v924.indexOf(_v930.k) >= 0 || _v925.indexOf(_v930.k) >= 0;
        _v905.beginPath();
        if (_v930.kind === "jewel") _v905.rect(_v930.x - _v933, _v930.y - _v933, _v933 * 2, _v933 * 2); else if (_v930.kind === "talent" || _v930.kind === "notable") {
          _v905.moveTo(_v930.x, _v930.y - _v933);
          _v905.lineTo(_v930.x + _v933, _v930.y);
          _v905.lineTo(_v930.x, _v930.y + _v933);
          _v905.lineTo(_v930.x - _v933, _v930.y);
          _v905.closePath();
        } else _v905.arc(_v930.x, _v930.y, _v933, 0, 6.2832);
        _v905.fillStyle = _v931 ? _v930.col : _v932 ? "#3a3048" : "#1c1824";
        _v905.fill();
        _v905.strokeStyle = _v934 ? "#ffd27a" : _v931 ? "#fff0c0" : _v930.kind === "start" ? "#ffffff" : _v930.col;
        _v905.lineWidth = _v934 ? 3 : _v931 ? 1.8 : 1;
        _v905.stroke();
        if (_v931 || _v930.kind === "talent" || _v907 > 0.55) {
          var _v935 = _v930.kind === "start" ? "起点" : _v930.kind === "talent" ? "天赋" : _v930.n;
          _v905.font = (_v930.kind === "talent" ? "700 13px " : "10px ") + "monospace";
          _v905.textAlign = "center";
          _v905.fillStyle = _v931 ? "#f0e8d0" : "#8e98b0";
          _v905.fillText(_v935, _v930.x, _v930.y - _v933 - 6);
        }
      });
      var _v936 = AdvStartKey();
      if (ADV_BY_K[_v936]) {
        _v905.strokeStyle = "#8f9cff";
        _v905.lineWidth = 1.4;
        _v905.beginPath();
        _v905.arc(0, 0, 22, 0, 6.2832);
        _v905.stroke();
        _v905.font = "11px monospace";
        _v905.textAlign = "center";
        _v905.fillStyle = "#8f9cff";
        _v905.fillText("你的职业起点", 0, 40);
      }
    }
    _v905.setTransform(1, 0, 0, 1, 0, 0);
    _v905.fillStyle = "#8e98b0";
    _v905.font = "11px monospace";
    _v905.textAlign = "left";
    var _v937 = _v901 === "star" ? ADV_STAR_VIEW : ADV_VIEW;
    _v905.fillText((_v901 === "star" ? "星图" : "高级基底 · 蛛网") + " · 缩放 " + (_v937.s || 1).toFixed(2) + "x · 可用 " + AdvLeft() + " · 已获得 " + AdvEarned() + " · 已使用 " + AdvUsed() + " · 节点 " + (_v901 === "star" ? ADV_STARS.length : ADV_METRICS.nodeCount), 10, 16);
  } catch (_v938) {}
}
function AdvShowTip(_v939, _v940, _v941) {
  var _v942 = document.getElementById("advTip");
  if (!_v942) return;
  if (!_v939) {
    _v942.style.display = "none";
    return;
  }
  if (!_v940 && !AdvVisible(_v939.k)) {
    _v942.style.display = "none";
    return;
  }
  var _v943 = "";
  if (_v940) {
    var _v944 = AdvStarAllocated(_v939.k) ? "已点亮" : AdvStarReason(_v939.k) || "可点亮";
    var _v945 = _v939.effect || ({}), _v946 = _v945.require || ({}), _v947 = AdvEffectKnownStats(_v945);
    _v943 = '<b style="color:' + (_v939.col || "#e8eefc") + '">' + _v939.n + "</b><br>" + _v939.d + "<br>星图词条: " + AdvEffectText(_v945) + "<br>" + (Object.keys(_v947).length ? "结算: " + Object.keys(_v947).map(function (_v948) {
      return AdvStatLabel(_v948, _v947[_v948]);
    }).join(" · ") : "无对应结算键 · 仅显示文案") + "<br>条件: " + (_v946.tags || []).join(" + ") + " · 至少 " + (_v946.min || (_v946.tags || []).length) + ' 个已点基底节点<br><span style="color:#8e98b0">' + _v944 + " · 左键点亮/退还</span>";
  } else {
    var _v949 = AdvAllocated(_v939.k) ? '<span style="color:#9dffb4">已点亮</span>' : '<span style="color:#e06a6a">' + AdvReason(_v939.k) + "</span>";
    var _v950 = AdvNodeStarLines(_v939);
    _v943 = '<b style="color:' + (_v939.col || "#e8eefc") + '">' + _v939.n + "</b> <small style=\"color:#8e98b0\">" + (_v939.region ? (AdvRegion(_v939.region) || ({
      n: _v939.region
    })).n + " · 环 " + _v939.ring : "中心") + "</small><br>" + (_v939.d || "") + "<br>" + _v949 + (_v939.kind === "notable" ? " · 需 2 个已点亮邻接" : "") + (_v950.length ? '<br><span style="color:#8f9cff">星图词条: ' + _v950.join(" / ") + "</span>" : "") + (_v939.kind === "talent" ? '<br><span style="color:#e8c870">点亮后解锁「' + (AdvRegion(_v939.region) || ({
      n: _v939.region
    })).n + "」星图</span>" : "") + (_v939.kind === "jewel" ? '<br><span style="color:#c8a8ff">珠宝栏位 · 点击后选择背包里的珠宝</span>' : "") + '<br><span style="color:#8e98b0">邻接 ' + AdvNeighbors(_v939.k).length + " 个 · 左键点亮/选中</span>";
  }
  _v942.innerHTML = _v943;
  _v942.style.display = "block";
  var _v951 = document.getElementById("advcv");
  if (_v951 && _v941) {
    var _v952 = _v951.getBoundingClientRect ? _v951.getBoundingClientRect() : {
      left: 0,
      top: 0
    };
    _v942.style.left = Math.max(4, _v941.clientX - _v952.left + 14) + "px";
    _v942.style.top = Math.max(4, _v941.clientY - _v952.top + 12) + "px";
  }
}
function AdvAfterRender() {
  try {
    AdvBuild();
    if (!o || !o.advTab || o.advTab === "tree") return;
    var _v953 = document.getElementById("advcv");
    if (!_v953) return;
    var _v954 = _v953.parentElement, _v955 = Math.max(320, Math.floor(_v954 && _v954.clientWidth || 900));
    var _v956 = Math.max(400, Math.min(680, Math.floor((window && window.innerHeight || 720) - 220)));
    _v953.style.width = _v955 + "px";
    _v953.style.height = _v956 + "px";
    _v953.width = _v955;
    _v953.height = _v956;
    if (!ADV_VIEW.init) {
      ADV_VIEW.init = !0;
      ADV_VIEW.s = 0.7;
      ADV_VIEW.x = _v955 / 2;
      ADV_VIEW.y = _v956 / 2;
    }
    if (!ADV_STAR_VIEW.init) {
      ADV_STAR_VIEW.init = !0;
      ADV_STAR_VIEW.s = 0.5;
      ADV_STAR_VIEW.x = _v955 / 2;
      ADV_STAR_VIEW.y = _v956 / 2;
    }
    AdvDraw();
  } catch (_v957) {}
}
function AdvEnsureInput() {
  try {
    var _v958 = document.getElementById("pbody");
    if (!_v958 || _v958.__advBound) return;
    _v958.__advBound = 1;
    _v958.addEventListener("click", function (_v959) {
      var _v960 = _v959.target && _v959.target.closest ? _v959.target.closest("[data-advtab]") : null;
      if (_v960) {
        _v959.preventDefault();
        _v959.stopPropagation();
        o.advTab = _v960.getAttribute("data-advtab");
        if (typeof ms === "function") ms();
        return;
      }
      var _v961 = _v959.target && _v959.target.closest ? _v959.target.closest("[data-advjewel]") : null;
      if (_v961) {
        _v959.preventDefault();
        _v959.stopPropagation();
        var _v962 = typeof AdvJewelAction === "function" ? AdvJewelAction(_v961.getAttribute("data-advjewel")) : "珠宝面板未就绪";
        if (_v962) P(_v962);
        if (typeof ms === "function") ms();
        return;
      }
      var _v963 = _v959.target && _v959.target.closest ? _v959.target.closest("[data-advalloc]") : null;
      if (_v963) {
        _v959.preventDefault();
        _v959.stopPropagation();
        var _v964 = AdvAlloc(_v963.getAttribute("data-advalloc"));
        if (_v964) P(_v964);
        if (typeof ms === "function") ms();
        return;
      }
      var _v965 = _v959.target && _v959.target.closest ? _v959.target.closest("[data-advrefund]") : null;
      if (_v965) {
        _v959.preventDefault();
        _v959.stopPropagation();
        var _v966 = AdvRespec(_v965.getAttribute("data-advrefund"));
        if (_v966) P(_v966);
        if (typeof ms === "function") ms();
        return;
      }
    }, true);
    var _v967 = function (_v968) {
      var _v969 = document.getElementById("advcv");
      if (!_v969 || o.advTab !== "base" && o.advTab !== "star") return;
      var _v970 = _v969.getBoundingClientRect();
      if (_v968.clientX < _v970.left || _v968.clientX > _v970.right || _v968.clientY < _v970.top || _v968.clientY > _v970.bottom) return;
      var _v971 = o.advTab === "star", _v972 = AdvCanvasPoint(_v968, _v969), _v973 = AdvHit(_v972.x, _v972.y, _v971);
      _v968.preventDefault();
      _v968.stopPropagation();
      if (!_v973) {
        o.advSel = null;
        o.advJewelSel = null;
        AdvDraw();
        return;
      }
      if (_v971) {
        var _v974 = AdvStarAllocated(_v973.k) ? AdvStarRespec(_v973.k) : AdvStarAlloc(_v973.k);
        if (_v974) P(_v974);
        if (typeof ms === "function") ms();
        return;
      }
      if (_v973.kind === "jewel" && AdvAllocated(_v973.k)) {
        o.advJewelSel = _v973.k;
        if (typeof ms === "function") ms();
        return;
      }
      o.advSel = _v973.k;
      if (!AdvAllocated(_v973.k)) {
        var _v975 = AdvAlloc(_v973.k);
        if (_v975) P(_v975); else M("craft");
      }
      if (typeof ms === "function") ms();
    };
    if (!window.__advDocClick2) {
      window.__advDocClick2 = 1;
      document.addEventListener("click", _v967, true);
    }
    _v958.addEventListener("contextmenu", function (_v976) {
      var _v977 = _v976.target && _v976.target.id === "advcv" ? _v976.target : null;
      if (!_v977) return;
      _v976.preventDefault();
      _v976.stopPropagation();
      var _v978 = AdvCanvasPoint(_v976, _v977), _v979 = (o.advTab || "") === "star", _v980 = AdvHit(_v978.x, _v978.y, _v979);
      if (!_v980) return;
      if (_v979) {
        var _v981 = _v980.effect || ({}), _v982 = _v981.require || ({});
        P("星图词条条件: " + ((_v982.tags || []).join(" + ") || "无") + " · 至少 " + (_v982.min || (_v982.tags || []).length) + " 个已点基底节点 · 当前" + (AdvStarAllocated(_v980.k) && AdvEffectMatches(_v981) ? "已激活" : "未激活"));
      } else if (AdvAllocated(_v980.k)) {
        P("已点亮 · 邻接 " + AdvNeighbors(_v980.k).length + " 个 · 可点右侧「退还该节点」");
      } else {
        P(AdvReason(_v980.k) || "可点亮 · 左键点亮");
      }
    }, true);
    _v958.addEventListener("pointerdown", function (_v983) {
      var _v984 = _v983.target && _v983.target.id === "advcv" ? _v983.target : null;
      if (!_v984) return;
      var _v985 = (o.advTab || "") === "star" ? ADV_STAR_VIEW : ADV_VIEW;
      _v985.drag = {
        x: _v983.clientX,
        y: _v983.clientY,
        ox: _v985.x || 0,
        oy: _v985.y || 0,
        moved: 0
      };
      try {
        _v983.target.setPointerCapture && _v983.target.setPointerCapture(_v983.pointerId);
      } catch (_v986) {}
    });
    _v958.addEventListener("pointermove", function (_v987) {
      var _v988 = _v987.target && _v987.target.id === "advcv" ? _v987.target : document.getElementById("advcv");
      if (!_v988) return;
      var _v989 = (o.advTab || "") === "star", _v990 = _v989 ? ADV_STAR_VIEW : ADV_VIEW;
      if (_v990.drag) {
        var _v991 = _v990.drag;
        _v991.moved = Math.max(_v991.moved, Math.abs(_v987.clientX - _v991.x) + Math.abs(_v987.clientY - _v991.y));
        if (_v991.moved > 4) {
          _v990.x = _v991.ox + (_v987.clientX - _v991.x);
          _v990.y = _v991.oy + (_v987.clientY - _v991.y);
          AdvDraw();
        }
        return;
      }
      var _v992 = AdvCanvasPoint(_v987, _v988), _v993 = AdvHit(_v992.x, _v992.y, _v989);
      var _v994 = _v993 ? _v993.k : null;
      if (!_v989 && _v994 !== (o.advHover || null)) {
        o.advHover = _v994;
        AdvDraw();
      }
      AdvShowTip(_v993, _v989, _v987);
    });
    _v958.addEventListener("pointerup", function () {
      if (o.advTab === "star") ADV_STAR_VIEW.drag = null; else ADV_VIEW.drag = null;
    });
    _v958.addEventListener("wheel", function (_v995) {
      var _v996 = _v995.target && _v995.target.id === "advcv" ? _v995.target : null;
      if (!_v996) return;
      _v995.preventDefault();
      var _v997 = _v996.getBoundingClientRect ? _v996.getBoundingClientRect() : {
        left: 0,
        top: 0
      };
      var _v998 = _v995.clientX - _v997.left, _v999 = _v995.clientY - _v997.top;
      var _v1000 = (o.advTab || "") === "star", _v1001 = _v1000 ? ADV_STAR_VIEW : ADV_VIEW;
      var _v1002 = _v1001.s || 0.7;
      var _v1003 = AdvClamp(_v1002 * (_v995.deltaY > 0 ? 0.9 : 1.1), 0.3, 3);
      var _v1004 = (_v998 - (_v1001.x || 0)) / _v1002, _v1005 = (_v999 - (_v1001.y || 0)) / _v1002;
      _v1001.s = _v1003;
      _v1001.x = _v998 - _v1004 * _v1003;
      _v1001.y = _v999 - _v1005 * _v1003;
      AdvDraw();
    }, {
      passive: !1
    });
  } catch (_v1006) {}
}
var _f4Base = F4;
F4 = function () {
  var _v1007 = o && o.advTab || "tree";
  if (_v1007 === "base" || _v1007 === "star") return AdvTabsBar() + AdvPageHTML(_v1007);
  try {
    return AdvTabsBar() + _f4Base.apply(this, arguments);
  } catch (_v1008) {
    return AdvTabsBar();
  }
};
try {
  AdvLoadEffects();
  AdvBuild();
  R("stats:pre", function (_v1009) {
    try {
      if (!h || !_v1009 || !_v1009.a) return;
      var _v1010 = AdvStatTotals();
      for (var _v1011 in _v1010) _v1009.a[_v1011] = (_v1009.a[_v1011] || 0) + _v1010[_v1011];
    } catch (_v1012) {}
  });
  setTimeout(AdvEnsureInput, 0);
} catch (_v1013) {
  console.warn("[adv] init failed", _v1013);
}
window.__ADV = {
  version: "2.00",
  regions: function () {
    AdvBuild();
    return ADV_REGIONS;
  },
  nodes: function () {
    AdvBuild();
    return ADV_NODES;
  },
  stars: function () {
    AdvBuild();
    return ADV_STARS;
  },
  edges: function () {
    AdvBuild();
    return ADV_EDGES.slice();
  },
  neighbors: AdvNeighbors,
  metrics: function () {
    AdvBuild();
    return ADV_METRICS;
  },
  ringCounts: function () {
    AdvBuild();
    return ADV_RING_COUNTS.slice();
  },
  nodeRadius: function (_v1014) {
    var _v1015 = AdvNode(_v1014);
    return _v1015 ? AdvNodeRadius(_v1015) : 0;
  },
  visible: AdvVisible,
  reachable: AdvReachable,
  component: function () {
    return Object.keys(AdvComponent());
  },
  node: AdvNode,
  star: AdvStar,
  effects: function () {
    return ADV_EFFECTS.slice();
  },
  startKey: AdvStartKey,
  classStarts: function () {
    AdvBuild();
    return ADV_NODES.filter(function (_v1016) {
      return _v1016.kind === "start";
    });
  },
  regionUnlocked: AdvRegionUnlocked,
  jewelSlots: AdvJewelSlots,
  earned: AdvEarned,
  used: AdvUsed,
  left: AdvLeft,
  canAlloc: AdvCanAlloc,
  reason: AdvReason,
  alloc: AdvAlloc,
  respec: AdvRespec,
  starCanAlloc: AdvStarCanAlloc,
  starReason: AdvStarReason,
  starAlloc: AdvStarAlloc,
  starRespec: AdvStarRespec,
  active: AdvActiveEffects,
  nodeStarLines: function (_v1017) {
    var _v1018 = AdvNode(_v1017);
    return _v1018 ? AdvNodeStarLines(_v1018) : [];
  },
  tipHTML: function (_v1019, _v1020) {
    try {
      var _v1021 = _v1020 ? AdvStar(_v1019) : AdvNode(_v1019);
      if (!_v1021) return "";
      var _v1022 = document.createElement("div");
      AdvShowTip(_v1021, !!_v1020, null);
      var _v1023 = document.getElementById("advTip");
      if (_v1023) {
        _v1022.innerHTML = _v1023.innerHTML;
        _v1023.style.display = "none";
      }
      return _v1022.innerHTML;
    } catch (_v1024) {
      return "";
    }
  },
  effectText: AdvEffectText,
  effectMatches: function (_v1025) {
    for (var _v1026 = 0; _v1026 < ADV_EFFECTS.length; _v1026++) if (ADV_EFFECTS[_v1026].id === _v1025) return AdvEffectMatches(ADV_EFFECTS[_v1026]);
    return null;
  },
  totals: AdvStatTotals,
  migrate: AdvMigrateSave,
  pageHTML: function (_v1027) {
    return AdvTabsBar() + AdvPageHTML(_v1027);
  },
  draw: AdvDraw,
  afterRender: AdvAfterRender,
  cfg: AdvCfg,
  knownStat: function (_v1028) {
    return !!AdvKnownStats()[_v1028];
  },
  camera: function (_v1029) {
    var _v1030 = _v1029 ? ADV_STAR_VIEW : ADV_VIEW;
    return {
      s: _v1030.s,
      x: _v1030.x,
      y: _v1030.y
    };
  },
  zoomAt: function (_v1031, _v1032, _v1033, _v1034) {
    var _v1035 = _v1034 ? ADV_STAR_VIEW : ADV_VIEW, _v1036 = _v1035.s || 0.7;
    var _v1037 = AdvClamp(_v1036 * _v1031, 0.3, 3);
    var _v1038 = (_v1032 - (_v1035.x || 0)) / _v1036, _v1039 = (_v1033 - (_v1035.y || 0)) / _v1036;
    _v1035.s = _v1037;
    _v1035.x = _v1032 - _v1038 * _v1037;
    _v1035.y = _v1033 - _v1039 * _v1037;
    AdvDraw();
    return _v1035.s;
  },
  screenPos: function (_v1040, _v1041) {
    var _v1042 = _v1041 ? ADV_STAR_VIEW : ADV_VIEW, _v1043 = _v1041 ? AdvStar(_v1040) : AdvNode(_v1040);
    if (!_v1043) return null;
    return {
      x: (_v1042.x || 0) + _v1043.x * (_v1042.s || 1),
      y: (_v1042.y || 0) + _v1043.y * (_v1042.s || 1),
      r: AdvNodeRadius(_v1043) * (_v1042.s || 1)
    };
  },
  hoverInfo: AdvHoverInfo,
  setHover: function (_v1044) {
    if (o) {
      o.advHover = _v1044 || null;
      AdvDraw();
    }
    return o && o.advHover;
  },
  setSelected: function (_v1045) {
    if (o) o.advSel = _v1045 || null;
    return o && o.advSel;
  }
};
var JEWEL_DEFAULTS = [{
  id: "jewel_cold_1",
  n: "寒冰珠宝",
  tier: 1,
  w: 14,
  stats: [["coldInc", 8], ["esPct", 4]],
  d: "冰霜伤害 +8% · 能量护盾 +4%"
}, {
  id: "jewel_life_1",
  n: "生命珠宝",
  tier: 1,
  w: 14,
  stats: [["life", 25], ["resAll", 4]],
  d: "生命上限 +25 · 全抗 +4%"
}, {
  id: "jewel_crit_1",
  n: "锐利珠宝",
  tier: 2,
  w: 8,
  stats: [["critInc", 12], ["critMulti", 10]],
  d: "暴击率 +12% · 暴击伤害 +10%"
}, {
  id: "jewel_phys_1",
  n: "沉重珠宝",
  tier: 2,
  w: 8,
  stats: [["physInc", 12], ["atkSpd", 3]],
  d: "物理伤害 +12% · 攻击速度 +3%"
}, {
  id: "jewel_star_1",
  n: "星辉珠宝",
  tier: 3,
  w: 3,
  stats: [["lightInc", 10], ["castSpd", 5], ["mana", 20]],
  d: "闪电伤害 +10% · 施法速度 +5% · 魔力 +20"
}];
var JEWELS = [], JEWEL_BY_ID = {}, JEWEL_ICONS = {}, JEWEL_BUILT = !1;
function JewelInit() {
  if (JEWEL_BUILT) return;
  JEWEL_BUILT = !0;
  JEWELS = [];
  JEWEL_BY_ID = {};
  var _v1046 = typeof window !== "undefined" && Array.isArray(window.RIFT_EXTRA_JEWELS) ? window.RIFT_EXTRA_JEWELS : [];
  var _v1047 = _v1046.length ? _v1046 : JEWEL_DEFAULTS;
  _v1047.forEach(function (_v1048) {
    if (!_v1048 || !_v1048.id || _v1048.enabled === false || JEWEL_BY_ID[_v1048.id]) return;
    var _v1049 = {
      id: _v1048.id,
      n: _v1048.n || _v1048.id,
      tier: Math.max(1, Math.min(3, Math.floor(+_v1048.tier || 1))),
      w: Math.max(1, +_v1048.w || 10),
      stats: Array.isArray(_v1048.stats) ? _v1048.stats.slice() : [],
      d: _v1048.d || ""
    };
    JEWELS.push(_v1049);
    JEWEL_BY_ID[_v1049.id] = _v1049;
  });
  if (!JEWELS.length) JEWEL_DEFAULTS.forEach(function (_v1050) {
    JEWELS.push(_v1050);
    JEWEL_BY_ID[_v1050.id] = _v1050;
  });
  JEWELS.forEach(function (_v1051) {
    JewelIcon(_v1051);
  });
}
function JewelDef(_v1052) {
  JewelInit();
  return JEWEL_BY_ID[_v1052] || null;
}
function JewelColor(_v1053) {
  return _v1053 >= 3 ? "#ffd050" : _v1053 === 2 ? "#c070ff" : "#7fd0ff";
}
function JewelIcon(_v1054) {
  try {
    if (JEWEL_ICONS[_v1054.id]) return JEWEL_ICONS[_v1054.id];
    if (typeof document === "undefined" || !document.createElement) return "";
    var _v1055 = document.createElement("canvas");
    _v1055.width = 16;
    _v1055.height = 16;
    var _v1056 = _v1055.getContext("2d");
    if (!_v1056) return "";
    _v1056.fillStyle = "#0d0b10";
    _v1056.fillRect(0, 0, 16, 16);
    var _v1057 = JewelColor(_v1054.tier);
    _v1056.fillStyle = _v1057;
    _v1056.beginPath();
    _v1056.moveTo(8, 2);
    _v1056.lineTo(13, 8);
    _v1056.lineTo(8, 14);
    _v1056.lineTo(3, 8);
    _v1056.closePath();
    _v1056.fill();
    _v1056.fillStyle = "#ffffffcc";
    _v1056.fillRect(7, 4, 2, 2);
    _v1056.fillStyle = "#1a7a60";
    _v1056.fillRect(6, 9, 4, 2);
    var _v1058 = _v1055.toDataURL();
    JEWEL_ICONS[_v1054.id] = _v1058;
    return _v1058;
  } catch (_v1059) {
    return "";
  }
}
function JewelItem(_v1060) {
  var _v1061 = JewelDef(_v1060);
  if (!_v1061) return null;
  return {
    uid: va(),
    kind: "jewel",
    jid: _v1061.id,
    n: _v1061.n,
    tier: _v1061.tier,
    rarity: Math.max(0, _v1061.tier - 1),
    ilvl: 60,
    impl: [],
    mods: [],
    d: _v1061.d,
    stats: _v1061.stats.slice(),
    name: _v1061.n
  };
}
function JewelPool() {
  JewelInit();
  return JEWELS.slice();
}
function JewelPick() {
  var _v1062 = JewelPool();
  if (!_v1062.length) return null;
  var _v1063 = 0;
  _v1062.forEach(function (_v1064) {
    _v1063 += _v1064.w;
  });
  var _v1065 = j() * _v1063, _v1066 = 0;
  for (var _v1067 = 0; _v1067 < _v1062.length; _v1067++) {
    _v1066 += _v1062[_v1067].w;
    if (_v1065 <= _v1066) return _v1062[_v1067];
  }
  return _v1062[_v1062.length - 1];
}
function JewelDrop(_v1068, _v1069) {
  try {
    var _v1070 = JewelPick();
    if (!_v1070) return null;
    var _v1071 = JewelItem(_v1070.id);
    if (!_v1071) return null;
    ve(_v1068, _v1069, {
      kind: "it",
      it: _v1071
    });
    return _v1070.id;
  } catch (_v1072) {
    return null;
  }
}
function JewelTooltip(_v1073) {
  var _v1074 = JewelDef(_v1073.jid) || ({
    n: _v1073.n || "珠宝",
    tier: _v1073.tier || 1,
    stats: _v1073.stats || [],
    d: _v1073.d || ""
  });
  var _v1075 = JewelColor(_v1074.tier);
  var _v1076 = (_v1074.stats || []).map(function (_v1077) {
    return AdvStatLabel(_v1077[0], _v1077[1]);
  }).join(" · ");
  return {
    b: _v1075,
    h: '<div class="th" style="color:' + _v1075 + '">' + B(_v1074.n) + "<small>天赋珠宝 · T" + _v1074.tier + '</small></div><div class="tb"><div class="sp">' + _v1076 + '</div><div class="sep"></div><div class="md">' + B(_v1074.d || "") + '</div><div class="sep"></div><div class="hint">可镶嵌在高级天赋树的「珠宝栏位」（点亮后点击该栏位选择）</div></div>'
  };
}
var _rpJewel = Sp;
Sp = function (_v1078) {
  if (_v1078 && _v1078.kind === "jewel") return JEWEL_ICONS[_v1078.jid] || (JewelDef(_v1078.jid) ? JewelIcon(JewelDef(_v1078.jid)) : "");
  return _rpJewel.apply(this, arguments);
};
var _$sJewel = Rs;
Rs = function (_v1079, _v1080, _v1081) {
  if (_v1079 && _v1079.kind === "jewel") return '<div class="cell gm" ' + (_v1081 || "") + ' data-act="' + _v1080 + '" data-uid="' + _v1079.uid + '" data-tt="it:' + _v1079.uid + '" data-craft="' + _v1079.uid + '"><img src="' + Sp(_v1079) + '" alt=""><span class="tg">珠宝</span></div>';
  return _$sJewel.apply(this, arguments);
};
var _asJewel = ss;
ss = function (_v1082, _v1083) {
  if (_v1082 && _v1082.kind === "jewel") return JewelTooltip(_v1082);
  return _asJewel.apply(this, arguments);
};
function AdvJewelSocketInfo(_v1084) {
  if (!h) return null;
  var _v1085 = h.advJewels && h.advJewels[_v1084];
  var _v1086 = _v1085 ? JewelDef(_v1085) : null;
  return _v1085 ? {
    jid: _v1085,
    def: _v1086
  } : null;
}
function AdvJewelSocket(_v1087, _v1088) {
  if (!h || !h.advTree || h.advTree.indexOf(_v1087) < 0) return "珠宝栏位没有点亮";
  var _v1089 = AdvNode(_v1087);
  if (!_v1089 || _v1089.tier !== "jewel") return "不是珠宝栏位";
  h.advJewels = h.advJewels || ({});
  if (h.advJewels[_v1087]) return "这个栏位已经镶嵌了珠宝 · 先取出";
  var _v1090 = -1;
  for (var _v1091 = 0; _v1091 < (h.inv || []).length; _v1091++) if (h.inv[_v1091] && h.inv[_v1091].uid === _v1088 && h.inv[_v1091].kind === "jewel") {
    _v1090 = _v1091;
    break;
  }
  if (_v1090 < 0) return "背包里没有这个珠宝";
  var _v1092 = h.inv[_v1090];
  if (!JewelDef(_v1092.jid)) return "未知珠宝";
  h.inv.splice(_v1090, 1);
  h.advJewels[_v1087] = _v1092.jid;
  return null;
}
function AdvJewelRemove(_v1093) {
  if (!h || !h.advJewels || !h.advJewels[_v1093]) return "这个栏位没有镶嵌珠宝";
  var _v1094 = h.advJewels[_v1093];
  var _v1095 = JewelItem(_v1094);
  if (!_v1095) return "珠宝数据缺失";
  (h.inv = h.inv || []).push(_v1095);
  delete h.advJewels[_v1093];
  return null;
}
function AdvJewelAction(_v1096) {
  _v1096 = String(_v1096 || "");
  var _v1097 = _v1096.split(":");
  if (_v1097[0] === "close") {
    o.advJewelSel = null;
    return null;
  }
  if (_v1097[0] === "open") {
    o.advJewelSel = _v1097[1];
    return null;
  }
  if (_v1097[0] === "equip") {
    var _v1098 = AdvJewelSocket(_v1097[1], _v1097[2]);
    if (!_v1098) o.advJewelSel = null;
    return _v1098;
  }
  if (_v1097[0] === "remove") return AdvJewelRemove(_v1097[1]);
  if (_v1097[0] === "refund") {
    if (AdvJewelSocketInfo(_v1097[1])) return "请先取出镶嵌的珠宝";
    var _v1099 = AdvRespec(_v1097[1]);
    if (!_v1099) o.advJewelSel = null;
    return _v1099;
  }
  return "未知操作";
}
function AdvJewelPanelHTML() {
  AdvBuild();
  var _v1100 = o && o.advJewelSel;
  var _v1101 = '<div class="bsec"><h4>珠宝栏位 <small>' + AdvJewelSlots() + " / 6 已点亮 · 点击已点亮栏位镶嵌/取出</small></h4>";
  if (_v1100) {
    var _v1102 = AdvNode(_v1100);
    _v1101 += '<div class="baff" style="display:block"><span class="btxt"><b style="color:#c8a8ff">' + (_v1102 ? _v1102.n : _v1100) + '</b> · ' + (AdvJewelSocketInfo(_v1100) ? "已镶嵌: " + AdvJewelSocketInfo(_v1100).def.n : "空插槽") + " · 选择背包里的珠宝</span></div>";
    var _v1103 = (h && h.inv || []).filter(function (_v1104) {
      return _v1104 && _v1104.kind === "jewel";
    });
    _v1101 += _v1103.length ? _v1103.map(function (_v1105) {
      return '<button class="btn small" style="display:block;width:100%;margin:3px 0;text-align:left" data-advjewel="equip:' + _v1100 + ":" + _v1105.uid + '"><b style="color:' + JewelColor(_v1105.tier) + '">' + (JewelDef(_v1105.jid) || ({
        n: _v1105.n
      })).n + '</b> <small class="dim">' + ((JewelDef(_v1105.jid) || ({})).stats || []).map(function (_v1106) {
        return AdvStatLabel(_v1106[0], _v1106[1]);
      }).join(" · ") + "</small></button>";
    }).join("") : '<p class="dim">背包里没有未镶嵌的珠宝（T14+ 地图/首领/深渊保险箱掉落）。</p>';
    _v1101 += '<button class="btn small" data-advjewel="close" style="margin-top:4px">关闭</button></div>';
  }
  for (var _v1107 = 1; _v1107 <= 6; _v1107++) {
    var _v1108 = "adv_jewel_" + _v1107, _v1109 = AdvNode(_v1108);
    if (!_v1109) continue;
    var _v1110 = AdvAllocated(_v1108), _v1111 = AdvJewelSocketInfo(_v1108);
    _v1101 += '<div class="baff" style="display:block"><span class="btxt"><b style="color:' + (_v1110 ? "#c8a8ff" : "#6a6472") + '">' + _v1109.n + '</b> <small class="dim">' + (_v1110 ? _v1111 ? "已镶嵌: " + _v1111.def.n : "空插槽" : AdvReason(_v1108) || "未点亮") + "</small>" + (_v1110 ? _v1111 ? ' <button class="btn small" data-advjewel="remove:' + _v1108 + '">取出</button>' : ' <button class="btn small" data-advjewel="open:' + _v1108 + '">镶嵌珠宝</button>' : "") + "</span></div>";
  }
  return _v1101 + "</div>";
}
function JewelMapDrop(_v1112) {
  try {
    if (!_v1112 || (_v1112.tier || 0) < 14) return null;
    if (j() >= 0.35) return null;
    var _v1113 = (o.Z && o.Z.M && o.Z.M.rooms || []).filter(function (_v1114) {
      return !_v1114.boss;
    });
    if (!_v1113.length) return null;
    var _v1115 = _v1113[Math.floor(j() * _v1113.length)], _v1116 = ar(_v1115);
    return JewelDrop(_v1116.x, _v1116.y);
  } catch (_v1117) {
    return null;
  }
}
window.__JEWEL = {
  version: "2.00",
  def: JewelDef,
  pool: JewelPool,
  item: JewelItem,
  drop: JewelDrop,
  mapDrop: JewelMapDrop,
  icon: function (_v1118) {
    var _v1119 = JewelDef(_v1118);
    return _v1119 ? JewelIcon(_v1119) : "";
  },
  socket: AdvJewelSocket,
  unsocket: AdvJewelRemove,
  socketInfo: AdvJewelSocketInfo,
  cell: function (_v1120) {
    try {
      return Rs(_v1120, "test", "");
    } catch (_v1121) {
      return "";
    }
  },
  panelHTML: AdvJewelPanelHTML,
  action: AdvJewelAction,
  totals: function () {
    return AdvJewelTotals ? AdvJewelTotals() : {};
  }
};
try {
  JewelInit();
} catch (_v1122) {
  console.warn("[jewel] init failed", _v1122);
}
function OmActive(_v1123) {
  return !!(h && h.om && h.om[_v1123]);
}
function OmOwned(_v1124) {
  return !!(h && (h.cur[_v1124] || 0) > 0);
}
function OmHas(_v1125) {
  return OmActive(_v1125) && OmOwned(_v1125);
}
function OmIsWorld(_v1126) {
  return !!(F[_v1126] && F[_v1126].og && String(F[_v1126].og).startsWith("world"));
}
function OmIsAbyss(_v1127) {
  return !!(F[_v1127] && F[_v1127].og && String(F[_v1127].og).startsWith("abyss"));
}
function OmIsCombat(_v1128) {
  return !!(F[_v1128] && (F[_v1128].og === "worldRes" || F[_v1128].og === "worldExp" || F[_v1128].og === "worldFlask"));
}
function OmToggle(_v1129) {
  if (!h || !F[_v1129]) return;
  let _v1130 = F[_v1129];
  if (!OmOwned(_v1129)) {
    (P("没有" + _v1130.n), M("nomana", 0.5));
    return;
  }
  if ((h.om || (h.om = {}), h.om[_v1129])) {
    (delete h.om[_v1129], P("已收起预兆 · " + _v1130.n), M("pick", 0.6));
  } else {
    for (let _v1131 in h.om) {
      if (_v1131 === _v1129) continue;
      let _v1132 = F[_v1131];
      (!_v1132 || _v1132.og && _v1132.og === _v1130.og) && delete h.om[_v1131];
    }
    (h.om[_v1129] = 1, P("预兆已激活 · " + _v1130.n), $e("预兆已激活", _v1130.n + " · " + _v1130.d), M("pick", 0.7));
  }
  me();
}
function OmTake(_v1133, _v1134, _v1135) {
  if (!OmHas(_v1133)) return !1;
  if (Sa && Sa.dry) return !0;
  if (OmIsCombat(_v1133)) {
    if (o.omTrig) return !1;
    o.omTrig = !0;
  }
  h.cur[_v1133] = Math.max(0, (h.cur[_v1133] || 0) - 1);
  h.cur[_v1133] <= 0 && (h.om || (h.om = {}), delete h.om[_v1133]);
  P("预兆触发 · " + F[_v1133].n);
  _v1134 != null && U(_v1134, _v1135 != null ? _v1135 : 0, 0, !1, "gold", "预兆 · " + (F[_v1133].s || F[_v1133].n));
  OmIsWorld(_v1133) && $e("预兆触发", F[_v1133].n + " · " + F[_v1133].d);
  return !0;
}
function OmPrune() {
  if (!h || !h.om) return;
  for (let _v1136 in h.om) (!F[_v1136] || (h.cur[_v1136] || 0) <= 0) && delete h.om[_v1136];
}
function OmDrop(_v1137, _v1138) {
  let _v1139 = o.Z && o.Z.tier ? o.Z.tier : 0, _v1140 = rt.filter(_v1141 => F[_v1141].grp === "omen" && (F[_v1141].mt || 1) <= _v1139);
  if (!_v1140.length) return null;
  let _v1142 = ht(_v1140, _v1143 => F[_v1143].ow || 1);
  return (ve(_v1137, _v1138, {
    kind: "cur",
    cur: _v1142
  }), _v1142);
}
function OmHint(_v1144) {
  let _v1145 = ({
    exalt: ["omen_exalt_p", "omen_exalt_s", "omen_exalt_2", "omen_special"],
    annul: ["omen_annul_p", "omen_annul_s"],
    chaos: ["omen_chaos_p", "omen_chaos_s", "omen_whittle"],
    chance: ["omen_ancient"]
  })[_v1144] || [], _v1146 = _v1145.filter(_v1147 => OmHas(_v1147));
  return _v1146.length ? _v1146.map(_v1148 => F[_v1148].s || F[_v1148].n).join(" + ") : null;
}
function OmWhittle(_v1149, _v1150) {
  let _v1151 = [], _v1152 = -1;
  for (let _v1153 of _v1150) {
    let _v1154 = jt(_v1149, _v1153.id);
    if (!_v1154 || typeof _v1153.ti !== "number" || !_v1154.ranges || !_v1154.ranges.length) continue;
    let _v1155 = _v1154.ranges.length - 1 - _v1153.ti;
    if (_v1155 < 0 || _v1155 >= _v1154.ranges.length) continue;
    let _v1156 = (_v1154.lv || [])[_v1153.ti], _v1157 = _v1155 * 1000 + (typeof _v1156 === "number" ? _v1156 : 0);
    (_v1157 > _v1152 && (_v1152 = _v1157, _v1151 = []), _v1157 === _v1152 && _v1151.push(_v1153));
  }
  if (!_v1151.length || Math.floor(_v1152 / 1000) <= 0) return null;
  return se(_v1151);
}
function StSide(_v1158, _v1159) {
  if (!_v1159) return St(_v1158);
  let _v1160 = Nv(_v1158, _v1159);
  return _v1160 ? (_v1158.mods.push(_v1160), !0) : !1;
}
function OmBenchRow() {
  let _v1161 = rt.filter(_v1162 => F[_v1162].grp === "omen" && (h.cur[_v1162] || 0) > 0);
  return _v1161.length ? _v1161.map(_v1163 => {
    let _v1164 = F[_v1163], _v1165 = OmActive(_v1163);
    return `<button class="bcur om${_v1165 ? " on" : ""}" data-omen="${_v1163}" data-tt="cur:${_v1163}"><img src="${He[_v1163]}" alt=""><span class="bn">${_v1164.s || _v1164.n}</span><b>${h.cur[_v1163] || 0}</b><small>${_v1165 ? "已激活" : OmIsAbyss(_v1163) ? "深渊预兆" : OmIsWorld(_v1163) ? "冒险预兆" : "工艺预兆"}</small></button>`;
  }).join("") : '<p class="dim bhint">还没有预兆 · 宝箱、稀有怪与 T6 以上的首领会掉落</p>';
}
function DsTierOf(_v1166) {
  return DS_TIER[_v1166] || 0;
}
function DsBoneTip(_v1167) {
  let _v1168 = DsTierOf(_v1167), _v1169 = ml.filter(_v1170 => _v1170.dsec), _v1171 = (_v1172, _v1173) => _v1173 > 1 ? (_v1172 / _v1173).toFixed(1) : _v1172, _v1174 = _v1168 === 0 ? "低阶骨 · 低数值" : _v1168 === 1 ? "中阶骨 · 中数值" : "远古骨 · 最高数值";
  if (!_v1169.length) return "";
  let _v1175 = _v1169.map(_v1176 => {
    let _v1177 = Math.min(_v1168, _v1176.ranges.length - 1), _v1178 = _v1176.ranges[_v1177], _v1179 = _v1176.div || 1;
    return `<div class="p">${_v1176.t === "P" ? "前缀" : "后缀"} · ${B(_v1176.text.replace("{0}", _v1171(_v1178[0], _v1179) + "–" + _v1171(_v1178[1], _v1179)))}</div>`;
  }).join("");
  return `<div class="sep"></div><div class="md">可揭示的渎灵词缀（${_v1174}）</div>${_v1175}<div class="hint">揭示时按装备部位的可用词缀三选一 · 词缀槽位未满前可重复渎灵</div>`;
}
function DsRoom(_v1180, _v1181) {
  return !!_v1180 && AffixDsecRoom(_v1180) > 0 && AffixTotalRoom(_v1180) > 0;
}
function DsPool(_v1182, _v1183) {
  let _v1184 = function (_v1185) {
    return _v1185.dsec && (!_v1183 || _v1185.t === _v1183);
  };
  let _v1186 = ml.filter(_v1187 => _v1184(_v1187) && (!_v1187.slots || _v1187.slots.includes(_v1182.slot)) && _v1187.lv[0] <= _v1182.ilvl);
  if (!_v1186.length) _v1186 = ml.filter(_v1188 => _v1184(_v1188) && _v1188.lv[0] <= _v1182.ilvl);
  if (!_v1186.length) _v1186 = ml.filter(_v1184);
  return _v1186;
}
function DsRoll(_v1189, _v1190, _v1191) {
  let _v1192 = 0;
  for (let _v1193 = 0; _v1193 < _v1190.ranges.length; _v1193++) _v1190.lv[_v1193] <= _v1189.ilvl && (_v1192 = _v1193);
  let _v1194 = Math.min(_v1192, _v1191);
  let _v1195 = no(_v1190.ranges[_v1194]);
  try {
    if (ue("desecrate_sense")) _v1195 = Array.isArray(_v1195) ? _v1195.map(_v1196 => Math.round(_v1196 * 1.05)) : Math.round(_v1195 * 1.05 * 10) / 10;
  } catch (_v1197) {}
  return {
    id: _v1190.id,
    t: _v1190.t,
    ti: _v1194,
    v: _v1195,
    dsec: !0
  };
}
function DsOptions(_v1198) {
  let _v1199 = _v1198 && _v1198.ds;
  if (!_v1199) return null;
  let _v1200 = DsPool(_v1198, _v1199.side);
  if (!_v1199.side) _v1200 = _v1200.filter(_v1201 => DsRoom(_v1198, _v1201.t));
  if (!_v1200.length) return null;
  let _v1202 = [], _v1203 = _v1199.fac ? _v1200.filter(_v1204 => _v1204.fac === _v1199.fac) : [];
  _v1203.length && _v1202.push(DsRoll(_v1198, se(_v1203), DsTierOf(_v1199.bone)));
  let _v1205 = 3 + (ue("desecrate_lore") ? 1 : 0);
  for (let _v1206 = 0; _v1206 < 80 && _v1202.length < _v1205; _v1206++) {
    let _v1207 = se(_v1200);
    _v1202.some(_v1208 => _v1208.id === _v1207.id) || _v1202.push(DsRoll(_v1198, _v1207, DsTierOf(_v1199.bone)));
  }
  return _v1202;
}
function DsDesecrate(_v1209, _v1210) {
  if (!_v1210 || _v1210.kind !== "item") return "渎灵只能用于装备";
  if (_v1210.rarity !== 2) return "需要稀有装备";
  if (_v1210.corrupted) return "已腐化的物品无法渎灵";
  if (_v1210.sanctified) return "已圣化的物品无法渎灵";
  if (_v1210.ds) return "已经有未揭示的渎灵词缀 · 先到灵魂之井揭示";
  let _v1211 = Math.max(0, Math.floor(Number(BAL.dsMaxUses) || 0));
  if (_v1211 > 0 && (_v1210.dsec || 0) >= _v1211) return "这件装备已经渎灵 " + (_v1210.dsec || 0) + " 次（上限 " + _v1211 + " 次）";
  if (OmHas("omen_abyss_putrid")) {
    let _v1212 = DsPool(_v1210, null);
    if (!_v1212.length) return "没有可用的渎灵词缀";
    OmTake("omen_abyss_putrid");
    _v1210.mods = [];
    delete _v1210.meta;
    _v1210.corrupted = !0;
    let _v1213 = (_v1214, _v1215) => {
      let _v1216 = _v1212.filter(_v1217 => _v1217.t === _v1214);
      for (let _v1218 = 0; _v1218 < _v1215 && _v1216.length; _v1218++) {
        let _v1219 = se(_v1216);
        let _v1220 = DsRoll(_v1210, _v1219, 2);
        _v1220.putrid = 1;
        _v1220.dsec = 0;
        _v1210.mods.push(_v1220);
        _v1216 = _v1216.filter(_v1221 => _v1221.id !== _v1219.id);
      }
    };
    _v1213("P", 3);
    _v1213("S", 3);
    return (_v1210.dsec = _v1210.mods.length, ga(_v1210), P("腐烂预兆 · 全部词缀被渎灵替换, 装备已腐化"), null);
  }
  let _v1222 = OmHas("omen_necro_p") ? "P" : OmHas("omen_necro_s") ? "S" : null;
  if (!DsRoom(_v1210, _v1222)) return "渎灵词缀栏已满 (" + AffixDsecCount(_v1210) + "/" + AffixSlotCfg().dsec + ")";
  if (!DsPool(_v1210, _v1222).some(_v1223 => DsRoom(_v1210, _v1223.t))) return "没有可用的渎灵词缀";
  let _v1224 = OmHas("omen_abyss_liege") ? "amanamu" : OmHas("omen_abyss_blackblood") ? "kurgal" : OmHas("omen_abyss_sovereign") ? "ulaman" : null;
  (_v1222 && OmTake(_v1222 === "P" ? "omen_necro_p" : "omen_necro_s"), _v1224 && OmTake(_v1224 === "amanamu" ? "omen_abyss_liege" : _v1224 === "kurgal" ? "omen_abyss_blackblood" : "omen_abyss_sovereign"));
  return (_v1210.ds = {
    bone: _v1209,
    side: _v1222,
    fac: _v1224,
    opts: null
  }, P("渎灵 · 到藏身处的灵魂之井揭示词缀"), null);
}
function DsReveal(_v1225, _v1226) {
  if (!_v1225 || !_v1225.ds) return "没有待揭示的渎灵词缀";
  let _v1227 = _v1225.ds.opts || DsOptions(_v1225), _v1228 = _v1227 && _v1227[_v1226];
  if (!_v1228) return "无效的选择";
  if (!DsRoom(_v1225, _v1228.t)) return "渎灵词缀栏已满 (" + AffixDsecCount(_v1225) + "/" + AffixSlotCfg().dsec + ")";
  return (_v1225.mods.push({
    id: _v1228.id,
    t: _v1228.t,
    ti: _v1228.ti,
    v: _v1228.v,
    dsec: !0
  }), _v1225.ds = null, _v1225.dsec = (_v1225.dsec || 0) + 1, ga(_v1225), P("渎灵词缀已揭示"), null);
}
function DsReroll(_v1229) {
  if (!_v1229 || !_v1229.ds) return "没有待揭示的渎灵词缀";
  return OmTake("omen_abyss_echo") ? (_v1229.ds.opts = DsOptions(_v1229), null) : "需要激活深渊回响预兆";
}
function DsMapChaos(_v1230, _v1231) {
  let _v1232 = MAP_CAT[_v1231] || [];
  _v1230.mods = _v1230.mods.filter(_v1233 => Gn(_v1230, _v1233));
  let _v1234 = 4 + (j() < 0.5 ? 1 : 0);
  for (let _v1235 = 0; _v1235 < _v1234; _v1235++) {
    let _v1236 = cd.filter(_v1237 => !_v1232.includes(_v1237.stat) && _v1237.lv[0] <= _v1230.ilvl && (!_v1237.slots || _v1237.slots.includes(_v1230.slot)));
    if (!_v1236.length) break;
    let _v1238 = ht(_v1236, _v1239 => _v1239.w), _v1240 = 0;
    for (let _v1241 = 0; _v1241 < _v1238.ranges.length; _v1241++) _v1238.lv[_v1241] <= _v1230.ilvl && (_v1240 = _v1241);
    let _v1242 = [];
    for (let _v1243 = 0; _v1243 <= _v1240; _v1243++) _v1242.push(_v1243);
    let _v1244 = ht(_v1242, _v1245 => Math.pow(0.62, _v1245));
    _v1230.mods.push({
      id: _v1238.id,
      t: _v1238.t,
      ti: _v1244,
      v: no(_v1238.ranges[_v1244])
    });
  }
  return null;
}
function DsBoneDrop(_v1246, _v1247, _v1248) {
  let _v1249 = o.Z && o.Z.tier || 0, _v1250 = Math.min(2, Math.max(_v1248 || 0, _v1249 >= 14 ? 2 : _v1249 >= 8 ? 1 : 0) + (ue("bone_speech") ? 1 : 0)), _v1251 = [];
  for (let _v1252 = 0; _v1252 <= _v1250; _v1252++) _v1251.push(DS_BONES[_v1252]);
  let _v1253 = se(_v1251);
  ve(_v1246, _v1247, {
    kind: "cur",
    cur: _v1253
  });
  try {
    if (ue("bone_sense") && j() < 0.1) ve(_v1246, _v1247, {
      kind: "cur",
      cur: _v1253
    });
  } catch (_v1254) {}
  return _v1253;
}
function DlWell(_v1255, _v1256) {
  let _v1257 = Math.round(_v1256.x), _v1258 = Math.round(_v1256.y), _v1259 = o.T, _v1260 = 0.75 + Math.sin(_v1259 * 2.4) * 0.25;
  (_v1255.fillStyle = "rgba(0,0,0,0.42)", _v1255.beginPath(), _v1255.ellipse(_v1257, _v1258 + 5, 16, 5, 0, 0, 6.283), _v1255.fill(), _v1255.fillStyle = "#2a2a24", _v1255.beginPath(), _v1255.ellipse(_v1257, _v1258, 13, 8, 0, 0, 6.283), _v1255.fill(), _v1255.fillStyle = "#0a1a10", _v1255.beginPath(), _v1255.ellipse(_v1257, _v1258 - 1, 9, 5, 0, 0, 6.283), _v1255.fill());
  _v1255.save();
  _v1255.globalCompositeOperation = "lighter";
  let _v1261 = _v1255.createRadialGradient(_v1257, _v1258 - 1, 0, _v1257, _v1258 - 1, 14);
  (_v1261.addColorStop(0, "rgba(70,230,150," + (0.6 * _v1260).toFixed(3) + ")"), _v1261.addColorStop(0.5, "rgba(45,200,120," + (0.16 * _v1260).toFixed(3) + ")"), _v1261.addColorStop(1, "rgba(30,180,100,0)"), _v1255.fillStyle = _v1261, _v1255.fillRect(_v1257 - 14, _v1258 - 15, 28, 28));
  _v1255.restore();
  (_v1255.strokeStyle = "#4a5a4a", _v1255.lineWidth = 1, _v1255.beginPath(), _v1255.ellipse(_v1257, _v1258, 13, 8, 0, 0, 6.283), _v1255.stroke());
  for (let _v1262 = 0; _v1262 < 3; _v1262++) {
    let _v1263 = (_v1259 * 0.8 + _v1262 * 0.33) % 1;
    (_v1255.globalAlpha = (1 - _v1263) * 0.85, _v1255.fillStyle = _v1262 % 2 ? "#7dff9a" : "#d8ffe0", _v1255.fillRect(_v1257 - 4 + _v1262 * 3 + Math.round(Math.sin(_v1259 * 2 + _v1262) * 1.5), _v1258 - 2 - Math.round(_v1263 * 14), 1, 2));
  }
  _v1255.globalAlpha = 1;
}
function DsWell() {
  let _v1264 = [...h.inv, ...Object.values(h.equip)].filter(_v1265 => _v1265 && _v1265.ds);
  if (!DW.sel || !_v1264.includes(DW.sel)) DW.sel = _v1264[0] || null;
  let _v1266 = DW.sel;
  _v1266 && !_v1266.ds.opts && (_v1266.ds.opts = DsOptions(_v1266));
  let _v1267 = _v1266 ? `<div class="dwhead"><b style="color:${oo[_v1266.rarity]}">${B(_v1266.name)}</b><small>${B(_v1266.base)} · 物品等级 ${_v1266.ilvl} · 骨: ${F[_v1266.ds.bone].n}${_v1266.ds.fac ? " · " + DS_FAC[_v1266.ds.fac] : ""}</small></div><div class="dwopts">${(_v1266.ds.opts || []).map((_v1268, _v1269) => {
    let _v1270 = jt(_v1266, _v1268.id);
    return `<button class="dwopt" data-dwopt="${_v1269}"><b>${B(ea(_v1270, _v1268.v))}</b><small>${_v1268.t === "P" ? "前缀" : "后缀"} T${_v1270.ranges.length - _v1268.ti}${_v1270.fac ? " · " + DS_FAC[_v1270.fac] : ""}</small></button>`;
  }).join("") || '<p class="dim">没有可用的渎灵词缀</p>'}</div><div class="dwbtns"><button class="btn small" data-dwreroll="1"${OmHas("omen_abyss_echo") ? "" : " disabled"}>重掷选项 (深渊回响预兆)</button></div>` : '<p class="dim">没有待揭示的渎灵装备 · 用遗存骨对稀有装备渎灵</p>';
  let _v1271 = _v1264.length ? _v1264.map(_v1272 => `<button class="dwitem${_v1272 === _v1266 ? " on" : ""}" data-dw="${_v1272.uid}"><b style="color:${oo[_v1272.rarity]}">${B(_v1272.name)}</b><small>${F[_v1272.ds.bone].n}</small></button>`).join("") : '<p class="dim">背包里没有</p>';
  (Ue(`<div class="ovbox well"><h2>灵魂之井</h2><p class="sub">深渊的遗存骨在这里揭示渎灵词缀 · 三选一</p>
		 <div class="dwwrap"><div class="dwlist">${_v1271}</div><div class="dwbody">${_v1267}</div></div>
		 <div class="ovbtns"><button class="btn" id="dwClose">离开 <kbd>Esc</kbd></button></div></div>`), A("#dwClose").onclick = mt, document.querySelectorAll("#overlay [data-dw]").forEach(_v1273 => _v1273.onclick = () => {
    let _v1274 = +_v1273.dataset.dw, _v1275 = [...h.inv, ...Object.values(h.equip)].find(_v1276 => _v1276 && _v1276.uid === _v1274);
    (_v1275 && (DW.sel = _v1275), DsWell());
  }), document.querySelectorAll("#overlay [data-dwopt]").forEach(_v1277 => _v1277.onclick = () => {
    let _v1278 = DsReveal(DW.sel, +_v1277.dataset.dwopt);
    (_v1278 ? P(_v1278) : (M("unique"), $e("渎灵", "词缀已揭示")), DsWell());
  }), document.querySelectorAll("#overlay [data-dwreroll]").forEach(_v1279 => _v1279.onclick = () => {
    let _v1280 = DsReroll(DW.sel);
    (_v1280 ? P(_v1280) : (M("pick"), $e("深渊回响", "选项已重掷")), DsWell());
  }));
}
function DlMirror(_v1281, _v1282) {
  _v1281.globalAlpha = 1;
  let _v1283 = Math.round(_v1282.x), _v1284 = Math.round(_v1282.y), _v1285 = o.T;
  (_v1281.fillStyle = "rgba(0,0,0,0.4)", _v1281.beginPath(), _v1281.ellipse(_v1283, _v1284 + 5, 13, 4, 0, 0, 6.283), _v1281.fill(), _v1281.fillStyle = "#2a2c38", _v1281.fillRect(_v1283 - 9, _v1284 - 18, 18, 22), _v1281.fillStyle = "#1a1e2a", _v1281.fillRect(_v1283 - 7, _v1284 - 16, 14, 18));
  let _v1286 = 0.5 + Math.sin(_v1285 * 1.8) * 0.3;
  _v1281.save();
  _v1281.globalCompositeOperation = "lighter";
  let _v1287 = _v1281.createRadialGradient(_v1283, _v1284 - 7, 0, _v1283, _v1284 - 7, 12);
  (_v1287.addColorStop(0, "rgba(220,228,255," + (0.5 * _v1286).toFixed(3) + ")"), _v1287.addColorStop(0.6, "rgba(160,180,230," + (0.16 * _v1286).toFixed(3) + ")"), _v1287.addColorStop(1, "rgba(120,140,200,0)"), _v1281.fillStyle = _v1287, _v1281.fillRect(_v1283 - 14, _v1284 - 22, 28, 28));
  _v1281.restore();
  for (let _v1288 = 0; _v1288 < 5; _v1288++) {
    let _v1289 = (_v1285 * 0.5 + _v1288 * 0.21) % 1;
    (_v1281.globalAlpha = (1 - _v1289) * 0.5, _v1281.fillStyle = "#cfd8e8", _v1281.fillRect(_v1283 - 6 + Math.round(Math.sin(_v1285 + _v1288 * 2) * 4), _v1284 - 15 - Math.round(_v1289 * 20), 1, 2));
  }
  if (_v1282.st === "idle") {
    let _v1290 = Math.sin(_v1285 * 3) * 2;
    (_v1281.fillStyle = "rgba(210,225,255,.95)", _v1281.beginPath(), _v1281.moveTo(_v1283, _v1284 - 38 + _v1290), _v1281.lineTo(_v1283 - 5, _v1284 - 46 + _v1290), _v1281.lineTo(_v1283 + 5, _v1284 - 46 + _v1290), _v1281.closePath(), _v1281.fill(), _v1281.fillRect(_v1283 - 1, _v1284 - 46 + _v1290, 2, 8), _v1281.font = "7px monospace", _v1281.textAlign = "center", _v1281.fillStyle = "#dfe8ff", _v1281.fillText("迷雾之镜", _v1283, _v1284 - 51 + _v1290));
  }
  _v1281.globalAlpha = 1;
}
function DlRitualBase(_v1291, _v1292) {
  _v1291.save();
  _v1291.globalAlpha = 1;
  _v1291.globalCompositeOperation = "source-over";
  let _v1293 = Math.round(_v1292.x), _v1294 = Math.round(_v1292.y);
  (_v1291.fillStyle = "rgba(0,0,0,0.42)", _v1291.beginPath(), _v1291.ellipse(_v1293, _v1294 + 6, 17, 5, 0, 0, 6.283), _v1291.fill(), _v1291.fillStyle = "#2a1a22", _v1291.fillRect(_v1293 - 14, _v1294 - 2, 28, 8), _v1291.fillStyle = "#4a2a36", _v1291.fillRect(_v1293 - 14, _v1294 - 3, 28, 2), _v1291.fillStyle = "#3a2028", _v1291.fillRect(_v1293 - 9, _v1294 - 11, 18, 9), _v1291.fillStyle = "#5a3040", _v1291.fillRect(_v1293 - 9, _v1294 - 12, 18, 2), _v1291.strokeStyle = "rgba(255,190,215,.8)", _v1291.lineWidth = 1, _v1291.strokeRect(_v1293 - 15, _v1294 - 12, 30, 18));
  _v1291.restore();
}
function DlRitual(_v1295, _v1296) {
  _v1295.globalAlpha = 1;
  let _v1297 = Math.round(_v1296.x), _v1298 = Math.round(_v1296.y), _v1299 = o.T, _v1300 = _v1296.st === "done" ? 1 : 0.55 + Math.sin(_v1299 * 2.2) * 0.35;
  DlRitualBase(_v1295, _v1296);
  _v1295.save();
  _v1295.globalCompositeOperation = "lighter";
  let _v1301 = _v1295.createRadialGradient(_v1297, _v1298 - 18, 0, _v1297, _v1298 - 18, 15);
  (_v1301.addColorStop(0, "rgba(230,120,160," + (0.45 * _v1300).toFixed(3) + ")"), _v1301.addColorStop(0.6, "rgba(170,70,110," + (0.14 * _v1300).toFixed(3) + ")"), _v1301.addColorStop(1, "rgba(120,40,80,0)"), _v1295.fillStyle = _v1301, _v1295.fillRect(_v1297 - 15, _v1298 - 33, 30, 30));
  _v1295.restore();
  (_v1295.fillStyle = _v1296.st === "done" ? "#ffd0e0" : "#a04a68", _v1295.fillRect(_v1297 - 2, _v1298 - 24, 4, 8), _v1295.fillStyle = "#ffd0e0", _v1295.fillRect(_v1297 - 1, _v1298 - 26, 2, 2));
  if (_v1296.st === "idle") {
    _v1295.save();
    _v1295.globalCompositeOperation = "lighter";
    let _v1302 = 0.55 + Math.sin(_v1299 * 2.5) * 0.35;
    (_v1295.strokeStyle = "rgba(255,150,190," + _v1302.toFixed(3) + ")", _v1295.lineWidth = 1.2, _v1295.beginPath(), _v1295.arc(_v1297, _v1298 - 6, 20 + Math.sin(_v1299 * 2) * 2, 0, 6.283), _v1295.stroke());
    for (let _v1303 = 0; _v1303 < 7; _v1303++) {
      let _v1304 = _v1299 * 0.9 + _v1303 * 0.897, _v1305 = _v1297 + Math.cos(_v1304) * 22, _v1306 = _v1298 - 10 + Math.sin(_v1304) * 11;
      (_v1295.fillStyle = _v1303 % 2 ? "#ffd0e0" : "#ff8fb8", _v1295.globalAlpha = 0.5 + 0.35 * Math.sin(_v1299 * 3 + _v1303), _v1295.fillRect(Math.round(_v1305), Math.round(_v1306), 2, 2));
    }
    (_v1295.globalAlpha = 1, _v1295.fillStyle = "#ffd0e0", _v1295.font = "7px monospace", _v1295.textAlign = "center", _v1295.fillText("未开启", _v1297, _v1298 - 40));
    _v1295.restore();
  }
}
function DelSplinter(_v1307, _v1308) {
  let _v1309 = o.del;
  if (!_v1309 || _v1309.spl >= _v1309.splMax) return !1;
  _v1309.spl++;
  return (ve(_v1307, _v1308, {
    kind: "cur",
    cur: "splinter"
  }), !0);
}
function DelDepthNow() {
  let _v1310 = 0;
  (o.del && o.del.depth > 0 && (_v1310 = o.del.depth), o.sim && o.sim.active && (_v1310 = Math.max(_v1310, o.sim.depth)));
  return _v1310;
}
function DelRarityBonus() {
  return Math.floor(DelDepthNow() / 20) * 5;
}
function DelDRMul() {
  let _v1311 = DelDepthNow();
  if (_v1311 <= 0) return 1;
  let _v1312 = Math.floor(_v1311 / 10), _v1313 = Math.min(BAL.delDmgCap, _v1312 * BAL.delDmgPer10);
  o.sim && o.sim.active && (_v1313 = Math.min(0.95, Math.min(90, _v1312) * 0.038));
  return 1 - _v1313;
}
function DelDRPct() {
  return Math.round((1 - DelDRMul()) * 100);
}
function DelMark(_v1314, _v1315) {
  if (!_v1314 || _v1314.del) return;
  (_v1314.del = !0, _v1314.delMul = 1.2 + _v1315 / 100 * 1.2, _v1314.dmg *= 1 + _v1315 / 400 * 0.8);
}
function DelHpBonus() {
  let _v1316 = h.delirium || 0;
  (o.del && o.del.depth > _v1316 && (_v1316 = o.del.depth), o.sim && o.sim.active && o.sim.depth > _v1316 && (_v1316 = o.sim.depth));
  return Math.min(BAL.delHpMax, Math.max(0, _v1316 / 100 * BAL.delHpPer100));
}
function DelBegin() {
  if (o.delRun) return;
  o.delRun = {
    layer: 0,
    max: DEL_LAYERS,
    active: !0
  };
  DelEnterLayer(1);
}
function DelEnterLayer(_v1317) {
  if (!o || o.state !== "play") return;
  let _v1318 = o.delRun || (o.delRun = {
    max: DEL_LAYERS,
    active: !0
  });
  (_v1318.layer = _v1317, _v1318.active = !0, _v1318.bossDead = !1);
  let _v1319 = Math.max(1, Math.min(16, _v1317 + 2)), _v1320 = ia(_v1319);
  (_v1320.name = "惊悸迷雾 · 第 " + _v1317 + " 层", _v1320.base = "惊悸迷雾", _v1320.dbg = {
    rooms: [5, 6]
  });
  let _v1321 = Math.max(0, Math.min(AtlasDeliriumCap(), h.delirium || 0)), _v1322 = Math.min(250, _v1321 + _v1317 * 30);
  o.delRun = _v1318;
  o.del = {
    t: 0,
    base: _v1321,
    depth: _v1322,
    peak: _v1322,
    fogR: 2400,
    outT: 0,
    spl: 0,
    splMax: ie(3, 6) + (ue("deli3") ? 2 : 0) + (ue("deli6") ? 1 : 0),
    pauseT: 0,
    shardAt: 9999,
    final: !1,
    maxReward: !1,
    layer: _v1317,
    m: null
  };
  DelLayerMap = !0;
  try {
    Pr(_v1320);
  } catch (_v1323) {
    DelLayerMap = !1;
    return;
  }
  DelLayerMap = !1;
  (o.Z.name = _v1320.name, o.Z.base = _v1320.base, o.Z.delLayer = _v1317);
  o.delRun = _v1318;
  DelTagBoss();
  ($e("惊悸迷雾 · 第 " + _v1317 + "/" + DEL_LAYERS + " 层", "击杀本层首领后按 F 进入下一层" + (_v1317 >= DEL_LAYERS ? " · 最终首领血量 ×5" : "")), M("portal"));
}
function DelTagBoss() {
  if (!o.delRun) return;
  for (let _v1324 of o.mons) {
    if (_v1324.rar !== 3 || _v1324.delBoss) continue;
    _v1324.delBoss = !0;
    if (o.delRun.layer >= o.delRun.max) {
      (_v1324.maxhp *= 5, _v1324.hp = _v1324.maxhp, _v1324.name = "最终·" + _v1324.name);
    } else _v1324.name = "迷雾首领·" + _v1324.name;
  }
}
function DelBossKilled(_v1325) {
  if (!o.delRun || !_v1325 || !_v1325.delBoss || _v1325.delRewarded) return;
  _v1325.delRewarded = !0;
  let _v1326 = o.delRun.layer >= o.delRun.max, _v1327 = _v1326 ? 20 + (ue("deli7") ? 10 : 0) : 3 + (ue("deli4") ? 1 : 0);
  for (let _v1328 = 0; _v1328 < _v1327; _v1328++) ve(_v1325.x, _v1325.y, {
    kind: "cur",
    cur: "divine"
  });
  if (_v1326) {
    (Ra.mageblood && j() < 0.015 && ve(_v1325.x, _v1325.y, {
      kind: "it",
      it: _t(Ra.mageblood, 80)
    }), h.delirium = Math.min(AtlasDeliriumCap(), (h.delirium || 0) + AtlasDeliriumGain(25 + (ue("deli2") ? 10 : 0) + (ue("deli5") ? 10 : 0))), GrantAtlasPoint("惊悸迷雾"), $e("惊悸迷雾 · 终点", "最终首领倒下 · 20 神圣石已掉落 · 亢奋值 +25%"), M("unique"), o.delRun = null, o.del = null);
  } else {
    (o.objs.push({
      kind: "b-delportal",
      x: _v1325.x,
      y: _v1325.y + 24,
      r: 16,
      layer: o.delRun.layer + 1
    }), $e("第 " + o.delRun.layer + " 层完成", "按 F 进入第 " + (o.delRun.layer + 1) + " 层"), M("unique"));
  }
}
function DeliriumStart(_v1329) {
  if (o.del) return;
  (_v1329 && (_v1329.st = "active"), o.del = {
    m: _v1329,
    t: 0,
    base: Math.min(AtlasDeliriumCap(), h.delirium || 0),
    peak: Math.min(AtlasDeliriumCap(), h.delirium || 0),
    depth: Math.min(AtlasDeliriumCap(), h.delirium || 0),
    fogR: 80,
    outT: 0,
    waveT: 2,
    final: !1,
    wave: 0,
    pauseT: 0,
    shardAt: 25,
    maxReward: !1,
    spl: 0,
    splMax: ie(3, 6) + (ue("deli3") ? 2 : 0)
  });
  for (let _v1330 of o.mons) _v1330.dead || DelMark(_v1330, 0);
  ($e("惊悸迷雾", "迷雾从镜面扩散 · 越远离镜子亢奋度越高" + (h.delirium ? " · 已积累亢奋 " + h.delirium + "%" : "")), M("unique"), V(0.25));
}
function DeliriumEnd() {
  if (!o.del) return;
  let _v1331 = o.del;
  if ((_v1331.peak || 0) >= 50) {
    let _v1332 = Math.min(250, (h.delirium || 0) + 25 + (ue("deli2") ? 10 : 0) + (ue("deli5") ? 10 : 0));
    (h.delirium = _v1332, h.deliriumMaps = (h.deliriumMaps || 0) + 1);
    ($e("迷雾散去", "亢奋值 +25% · 当前 " + _v1332 + "%"), P("惊悸亢奋 " + _v1332 + "% (下一张地图起始亢奋更高)"));
  } else $e("迷雾散去", "你从惊悸迷雾中走了出来");
  (o.del = null, M("portal"));
}
function DeliriumUpdate(_v1333) {
  if (!o.Z || o.Z.type !== "map" || !o.pl) return;
  let _v1334 = o.del;
  if (!_v1334) {
    for (let _v1335 of o.objs) _v1335.kind === "mirror" && _v1335.st === "idle" && (_v1335.x - o.pl.x) ** 2 + (_v1335.y - o.pl.y) ** 2 < 676 && DeliriumStart(_v1335);
    return;
  }
  if (o.pl.dead) return void DeliriumEnd();
  (_v1334.t += _v1333, _v1334.fogR = Math.min(1900, _v1334.fogR + _v1333 * 150));
  let _v1336 = _v1334.m ? _v1334.m.x : o.pl.x, _v1337 = _v1334.m ? _v1334.m.y : o.pl.y, _v1338 = Math.hypot(o.pl.x - _v1336, o.pl.y - _v1337);
  _v1334.pauseT > 0 && (_v1334.pauseT -= _v1333);
  (_v1334.depth = _v1334.pauseT > 0 ? _v1334.depth : Math.min(250, Math.round((_v1334.base || 0) + _v1338 / 1000 * 100)), _v1334.peak = Math.max(_v1334.peak || 0, _v1334.depth), _v1338 > _v1334.fogR + 40 && _v1334.pauseT <= 0 ? _v1334.outT += _v1333 : _v1334.outT = 0);
  for (let _v1339 of o.objs) _v1339.kind === "delshard" && !_v1339.taken && (_v1339.x - o.pl.x) ** 2 + (_v1339.y - o.pl.y) ** 2 < 324 && DelShard(_v1339);
  if (_v1334.depth >= _v1334.shardAt && _v1334.pauseT <= 0) {
    let _v1340 = Ge(o.pl.x, o.pl.y, 80);
    o.objs.push({
      kind: "delshard",
      x: _v1340.x,
      y: _v1340.y,
      r: 6,
      taken: !1,
      col: se(Object.keys(DEL_SHARD_COL))
    });
    _v1334.shardAt = Math.min(251, _v1334.shardAt + 25);
    P("破溃之镜碎片出现了");
  }
  _v1334.outT > 5 && DeliriumEnd();
  if (!o.del) return;
  for (let _v1341 of o.mons) !_v1341.dead && !_v1341.del && (_v1341.x - _v1336) ** 2 + (_v1341.y - _v1337) ** 2 < _v1334.fogR * _v1334.fogR && DelMark(_v1341, _v1334.depth);
  if (!_v1334.maxReward && _v1334.depth >= 250) {
    _v1334.maxReward = !0;
    let _v1342 = Ge(o.pl.x, o.pl.y, 26);
    (o.objs.push({
      kind: "box",
      x: _v1342.x,
      y: _v1342.y,
      r: 6,
      open: !1,
      delBox: !0
    }), $e("亢奋巅峰", "第二只惊悸宝箱出现了"));
  }
  if (!_v1334.final && _v1334.depth >= 200) {
    _v1334.final = !0;
    let _v1343 = Ge(o.pl.x, o.pl.y, 20), _v1344 = _e(se(Object.keys(o.Z.th.mon)), _v1343.x, _v1343.y, o.Z.lvl + 2, 2);
    (Object.assign(_v1344, {
      del: !0,
      delMul: 2.6,
      name: "迷雾之影",
      aggro: !0,
      maxhp: _v1344.maxhp * 2.5
    }), _v1344.hp = _v1344.maxhp, o.mons.push(_v1344), o.objs.push({
      kind: "box",
      x: _v1343.x + 26,
      y: _v1343.y + 10,
      r: 6,
      open: !1,
      delBox: !0
    }), $e("迷雾之潮", "迷雾之影与惊悸宝箱出现了"));
  }
}
function DelShard(_v1345) {
  if (!_v1345 || _v1345.taken) return;
  _v1345.taken = !0;
  let _v1346 = o.del, _v1347 = _v1345.col;
  if (_v1347 === "blue") {
    let _v1348 = o.mons.filter(_v1349 => !_v1349.dead && _v1349.rar === 2).sort((_v1350, _v1351) => (_v1350.x - o.pl.x) ** 2 + (_v1350.y - o.pl.y) ** 2 - ((_v1351.x - o.pl.x) ** 2 + (_v1351.y - o.pl.y) ** 2))[0];
    if (_v1348) {
      (_v1348.maxhp *= 1.5, _v1348.hp = _v1348.maxhp, _v1348.dmg *= 1.25, _v1348.name = "惊悸·" + _v1348.name);
      P("蓝色碎片 · 稀有怪物被惊悸强化");
    } else P("蓝色碎片 · 附近没有稀有怪物");
  } else if (_v1347 === "cyan") {
    _v1346 && (_v1346.pauseT = 12);
    P("青色碎片 · 迷雾暂停 12 秒");
  } else if (_v1347 === "purple") {
    let _v1352 = Object.keys(o.Z.th.mon);
    for (let _v1353 = 0; _v1353 < 4; _v1353++) {
      let _v1354 = Ge(o.pl.x, o.pl.y, 90), _v1355 = _e(se(_v1352), _v1354.x, _v1354.y, o.Z.lvl, 1);
      (Object.assign(_v1355, {
        del: !0,
        delMul: 2,
        aggro: !0,
        name: "纯化·" + _v1355.name
      }), _v1355.maxhp *= 1.6, _v1355.hp = _v1355.maxhp, o.mons.push(_v1355));
    }
    P("紫色碎片 · 纯化怪群出现");
  } else {
    let _v1356 = Ge(o.pl.x, o.pl.y, 24), _v1357 = _e(se(Object.keys(o.Z.th.mon)), _v1356.x, _v1356.y, o.Z.lvl + 2, 2);
    (Object.assign(_v1357, {
      del: !0,
      delMul: 2.6,
      name: "迷雾之影",
      aggro: !0,
      maxhp: _v1357.maxhp * 2.5
    }), _v1357.hp = _v1357.maxhp, o.mons.push(_v1357), P("橙色碎片 · 迷雾之影出现"));
  }
  (DelSplinter(_v1345.x, _v1345.y), DelSplinter(_v1345.x, _v1345.y));
  L(_v1345.x, _v1345.y, 24, [DEL_SHARD_COL[_v1347], "#e8f0ff"], 60, 0.8, {
    glow: !0
  });
}
function DlShardDraw(_v1358, _v1359) {
  let _v1360 = Math.round(_v1359.x), _v1361 = Math.round(_v1359.y), _v1362 = DEL_SHARD_COL[_v1359.col] || "#cfd8e8", _v1363 = 0.65 + Math.sin(o.T * 4) * 0.35;
  (_v1358.fillStyle = "rgba(0,0,0,0.35)", _v1358.beginPath(), _v1358.ellipse(_v1360, _v1361 + 4, 7, 3, 0, 0, 6.283), _v1358.fill(), _v1358.save(), _v1358.globalCompositeOperation = "lighter", _v1358.fillStyle = _v1362, _v1358.globalAlpha = _v1363, _v1358.beginPath(), _v1358.moveTo(_v1360, _v1361 - 10), _v1358.lineTo(_v1360 + 4, _v1361 - 4), _v1358.lineTo(_v1360 + 2, _v1361 + 2), _v1358.lineTo(_v1360 - 2, _v1361 + 2), _v1358.lineTo(_v1360 - 4, _v1361 - 4), _v1358.closePath(), _v1358.fill(), _v1358.restore(), _v1358.globalAlpha = 1, _v1358.fillStyle = "#ffffff", _v1358.fillRect(_v1360 - 1, _v1361 - 8, 1, 4));
}
function RitualMake(_v1364, _v1365) {
  return {
    kind: "ritual",
    x: _v1364,
    y: _v1365,
    r: 14,
    st: "idle",
    wave: 0,
    waves: 3,
    tribute: 0,
    stored: 0,
    revive: 0,
    restT: 0,
    offers: null
  };
}
function RitPool() {
  if (!o.ritualPool || o.ritualPool.zone !== o.Z) o.ritualPool = {
    zone: o.Z,
    tribute: 0
  };
  return o.ritualPool;
}
function RitTribute() {
  return Math.round(RitPool().tribute || 0);
}
function RitAddTribute(_v1366) {
  RitPool().tribute = (RitPool().tribute || 0) + (_v1366 || 0);
}
function RitSpendTribute(_v1367) {
  let _v1368 = RitPool();
  if ((_v1368.tribute || 0) < _v1367) return !1;
  _v1368.tribute -= _v1367;
  return !0;
}
function RitualWave(_v1369) {
  let _v1370 = Math.max(3, Math.min(6, Math.ceil((_v1369.stored || 6) / 3))), _v1371 = Object.keys(o.Z.th.mon);
  _v1369.revive = (_v1369.revive || 0) + 1;
  for (let _v1372 = 0; _v1372 < _v1370; _v1372++) {
    let _v1373 = Ge(_v1369.x, _v1369.y, 90), _v1374 = _e(se(_v1371), _v1373.x, _v1373.y, o.Z.lvl, j() < 0.12 ? 1 : 0);
    (Object.assign(_v1374, {
      ritual: _v1369,
      reviveGen: _v1369.revive,
      aggro: !0
    }), o.mons.push(_v1374));
  }
  (P("驱灵仪式 · 第 " + _v1369.wave + "/" + _v1369.waves + " 波"), L(_v1369.x, _v1369.y, 30, RIT_COL, 70, 0.8, {
    glow: !0
  }));
}
function RitualStart(_v1375) {
  if (!_v1375 || _v1375.st !== "idle") return;
  let _v1376 = ue("rit4") ? 2 : 3;
  if ((_v1375.stored || 0) < _v1376) return P("先在祭坛范围内击杀怪物吸收怨灵 (" + (_v1375.stored || 0) + "/" + _v1376 + ")");
  (_v1375.st = "active", _v1375.wave = 1, _v1375.revive = 0, _v1375.restT = 0.6, RitualWave(_v1375), $e("驱灵仪式", "击退 3 波怨灵 · 击杀祭坛附近的怪物可获得贡品"), M("portal"), V(0.18));
}
function RitualUpdate(_v1377) {
  for (let _v1378 of o.objs) {
    if (_v1378.kind !== "ritual" || _v1378.st !== "active") continue;
    if (o.pl && o.pl.dead) {
      (_v1378.st = "idle", _v1378.stored = 0, _v1378.revive = 0, _v1378.offers = null, P("仪式中断 · 怨灵散去"));
      continue;
    }
    if (o.mons.some(_v1379 => _v1379.ritual === _v1378 && !_v1379.dead) || (_v1378.restT -= _v1377) > 0) continue;
    if (_v1378.wave < _v1378.waves) (_v1378.wave += 1, _v1378.restT = 0.8, RitualWave(_v1378)); else (_v1378.st = "done", h.ritualDone = (h.ritualDone || 0) + 1, RitualMapCheck(), M("unique"), $e("恩典降临", "回到祭坛领取恩赐 (贡品 " + RitTribute() + ")"), L(_v1378.x, _v1378.y, 40, RIT_COL, 90, 1, {
      glow: !0
    }));
  }
}
function RitItemTip(_v1380) {
  if (!_v1380) return "";
  let _v1381 = _v1380.name || (_v1380.base && he[_v1380.base] ? he[_v1380.base].n : "");
  try {
    if (_v1380.base && he[_v1380.base]) _v1381 += " · " + he[_v1380.base].n;
    (_v1380.impl || []).forEach(function (_v1382) {
      let _v1383 = So[_v1382.id] || Yt[_v1382.id] || Mo[_v1382.id];
      if (_v1383) _v1381 += "\n" + ea(_v1383, _v1382.v);
    });
    (_v1380.mods || []).forEach(function (_v1384) {
      let _v1385 = So[_v1384.id] || Yt[_v1384.id] || Mo[_v1384.id];
      if (_v1385) _v1381 += "\n" + ea(_v1385, _v1384.v);
    });
    (_v1380.st || []).forEach(function (_v1386) {
      _v1381 += "\n" + _v1386;
    });
  } catch (_v1387) {}
  return _v1381;
}
function RitualOffers(_v1388) {
  let _v1389 = RitPool();
  if (_v1389.offers) return _v1389.offers;
  let _v1390 = [], _v1391 = o.Z.lvl || 1, _v1392 = we(o.Z.tier || 1, 1, 16), _v1393 = ["omen_exalt_p", "omen_exalt_s", "omen_whittle", "omen_abyss_echo", "omen_abyss_light", "omen_sanctify", "omen_necro_p", "omen_necro_s", "omen_chaos_mon"], _v1394 = se(_v1393), _v1395 = se(DS_BONES), _v1396 = rt.filter(_v1397 => F[_v1397].grp === "rune" || F[_v1397].grp === "ess"), _v1398 = se(_v1396), _v1399 = se(_v1396), _v1400 = se(_v1396), _v1401 = la(se(Ca), _v1391 + 1, 2), _v1402 = ia(_v1392), _v1403 = lt.filter(_v1404 => _v1404.src === "world" && !_v1404.noDrop), _v1405 = _v1403.length && j() < 0.4 ? se(_v1403) : null;
  _v1390.push({
    n: "预兆 · " + F[_v1394].n,
    cost: 70,
    tip: F[_v1394].n + "\n" + F[_v1394].d,
    tt: "cur:" + _v1394,
    give: () => {
      h.cur[_v1394] = (h.cur[_v1394] || 0) + 1;
    }
  });
  if (ue("rit3")) {
    let _v1406 = se([..._v1393].filter(_v1407 => _v1407 !== _v1394));
    _v1390.push({
      n: "预兆 · " + F[_v1406].n,
      cost: 70,
      tip: F[_v1406].n + "\n" + F[_v1406].d,
      tt: "cur:" + _v1406,
      give: () => {
        h.cur[_v1406] = (h.cur[_v1406] || 0) + 1;
      }
    });
  }
  _v1390.push({
    n: "遗存骨 · " + F[_v1395].n,
    cost: 60,
    tip: F[_v1395].n + "\n" + F[_v1395].d,
    tt: "cur:" + _v1395,
    give: () => {
      h.cur[_v1395] = (h.cur[_v1395] || 0) + 1;
    }
  });
  _v1390.push({
    n: "稀有 · " + B(_v1401.name),
    cost: 45,
    tip: RitItemTip(_v1401),
    give: () => ve(o.pl.x, o.pl.y, {
      kind: "it",
      it: _v1401
    })
  });
  _v1390.push({
    n: "符文/精华 · " + F[_v1398].n + " ×3",
    cost: 25,
    tip: [_v1398, _v1399, _v1400].map(_v1408 => F[_v1408].n + "：" + F[_v1408].d).join("\n"),
    give: () => {
      [_v1398, _v1399, _v1400].forEach(_v1409 => h.cur[_v1409] = (h.cur[_v1409] || 0) + 1);
    }
  });
  _v1390.push({
    n: "地图 · T" + _v1402.tier + " " + B(_v1402.base),
    cost: 30,
    tip: "T" + _v1402.tier + " 地图\n" + B(_v1402.name || ""),
    give: () => h.inv.push(_v1402)
  });
  _v1390.push({
    n: "迷雾副本裂片 ×8",
    cost: 35,
    tip: "迷雾副本裂片 ×8\n用于进入迷雾副本 / 相关兑换",
    give: () => {
      h.cur.splinter = (h.cur.splinter || 0) + 8;
    }
  });
  _v1390.push({
    n: "混沌石 ×5",
    cost: 20,
    tip: F.chaos.d,
    tt: "cur:chaos",
    give: () => {
      h.cur.chaos = (h.cur.chaos || 0) + 5;
    }
  });
  _v1390.push({
    n: "崇高石 ×1",
    cost: 40,
    tip: F.exalt.d,
    tt: "cur:exalt",
    give: () => {
      h.cur.exalt = (h.cur.exalt || 0) + 1;
    }
  });
  _v1390.push({
    n: "神圣石 ×1",
    cost: BAL.ritualDivineCost || 100,
    tip: F.divine.d,
    tt: "cur:divine",
    give: () => {
      h.cur.divine = (h.cur.divine || 0) + 1;
    }
  });
  if (_v1405) {
    let _v1410 = _t(_v1405, _v1391);
    _v1390.push({
      n: "传奇 · " + B(_v1405.n),
      cost: 160,
      tip: RitItemTip(_v1410),
      give: () => ve(o.pl.x, o.pl.y, {
        kind: "it",
        it: _v1410
      })
    });
  } else _v1390.push({
    n: "传奇装备 (25%)",
    cost: 160,
    tip: "25% 概率掉落一件随机传奇装备",
    give: () => {
      let _v1411 = lt.filter(_v1412 => _v1412.src === "world" && !_v1412.noDrop);
      if (_v1411.length && j() < 0.25) ve(o.pl.x, o.pl.y, {
        kind: "it",
        it: _t(se(_v1411), _v1391)
      }); else ve(o.pl.x, o.pl.y, {
        kind: "cur",
        cur: "alch"
      });
    }
  });
  ue("rit5") && _v1390.forEach(_v1413 => _v1413.cost = Math.round(_v1413.cost * 0.85));
  for (let _v1414 = _v1390.length - 1; _v1414 > 0; _v1414--) {
    let _v1415 = Math.floor(j() * (_v1414 + 1));
    [_v1390[_v1414], _v1390[_v1415]] = [_v1390[_v1415], _v1390[_v1414]];
  }
  return (_v1389.offers = _v1390.slice(0, 6).map(_v1416 => ({
    ..._v1416,
    bought: !1
  })), _v1389.offers);
}
function RitualBuy(_v1417, _v1418) {
  let _v1419 = RitualOffers(_v1417)[_v1418];
  if (!_v1419 || _v1419.bought) return "已售出";
  if (RitTribute() < _v1419.cost) return "贡品不足";
  return (RitSpendTribute(_v1419.cost), _v1419.bought = !0, _v1419.give(), P("恩典: " + _v1419.n), M("unique"), null);
}
function RitualShop(_v1420) {
  o.ritualPause = !0;
  let _v1421 = RitualOffers(_v1420), _v1422 = RitTribute(), _v1423 = _v1421.map((_v1424, _v1425) => `<button class="ritopt${_v1424.bought ? " bought" : _v1422 < _v1424.cost ? " no" : ""}" data-rbuy="${_v1425}"${_v1424.bought ? " disabled" : ""} title="${B(_v1424.tip || _v1424.n).replace(/"/g, "&quot;")}"><b>${B(_v1424.n)}</b><small>${_v1424.bought ? "已兑换" : _v1424.cost + " 贡品"}</small></button>`).join("");
  (Ue(`<div class="ovbox ritual"><h2>驱灵祭坛 · 恩典</h2><p class="sub">用击杀祭坛附近怪物获得的贡品换取恩赐 · 全图共享贡品 <b style="color:#ffd0e0">${_v1422}</b></p>
		 <div class="ritgrid">${_v1423}</div>
		 <div class="ovbtns"><button class="btn" id="ritClose">离开 <kbd>Esc</kbd></button></div></div>`), A("#ritClose").onclick = () => {
    (o.ritualPause = !1, mt());
  }, document.querySelectorAll("#overlay [data-rbuy]").forEach(_v1426 => _v1426.onclick = () => {
    let _v1427 = RitualBuy(_v1420, +_v1426.dataset.rbuy);
    (_v1427 && (P(_v1427), M("nomana", 0.5)), RitualShop(_v1420));
  }));
}
function RitualInteract(_v1428) {
  _v1428.st === "idle" ? RitualStart(_v1428) : _v1428.st === "done" && RitualShop(_v1428);
}
function DlSim(_v1429, _v1430) {
  _v1429.globalAlpha = 1;
  let _v1431 = Math.round(_v1430.x), _v1432 = Math.round(_v1430.y), _v1433 = o.T;
  (_v1429.fillStyle = "rgba(0,0,0,0.4)", _v1429.beginPath(), _v1429.ellipse(_v1431, _v1432 + 5, 14, 4, 0, 0, 6.283), _v1429.fill(), _v1429.fillStyle = "#2a2038", _v1429.fillRect(_v1431 - 11, _v1432 - 22, 22, 26), _v1429.fillStyle = "#1a1228", _v1429.fillRect(_v1431 - 8, _v1432 - 19, 16, 20));
  _v1429.save();
  _v1429.globalCompositeOperation = "lighter";
  let _v1434 = 0.5 + Math.sin(_v1433 * 2.2) * 0.3, _v1435 = _v1429.createRadialGradient(_v1431, _v1432 - 9, 0, _v1431, _v1432 - 9, 14);
  (_v1435.addColorStop(0, "rgba(190,150,255," + (0.5 * _v1434).toFixed(3) + ")"), _v1435.addColorStop(0.6, "rgba(140,100,220," + (0.16 * _v1434).toFixed(3) + ")"), _v1435.addColorStop(1, "rgba(100,60,180,0)"), _v1429.fillStyle = _v1435, _v1429.fillRect(_v1431 - 15, _v1432 - 25, 30, 30));
  _v1429.restore();
  for (let _v1436 = 0; _v1436 < 4; _v1436++) {
    let _v1437 = (_v1433 * 0.4 + _v1436 * 0.25) % 1;
    (_v1429.globalAlpha = (1 - _v1437) * 0.7, _v1429.fillStyle = "#c8a8ff", _v1429.fillRect(_v1431 - 3 + Math.round(Math.sin(_v1433 + _v1436) * 3), _v1432 - 4 - Math.round(_v1437 * 16), 1, 2));
  }
  (_v1429.globalAlpha = 1, _v1429.fillStyle = "#8c64ff", _v1429.fillRect(_v1431 - 2, _v1432 - 20, 4, 1));
}
function drawSimPortal(_v1438) {
  DlSim(f, _v1438);
  var _v1439 = Math.round(_v1438.x), _v1440 = Math.round(_v1438.y);
  f.save();
  var _v1441 = _v1438.label || "F 下一层";
  f.font = "bold 11px system-ui, 'Microsoft YaHei', sans-serif";
  f.textAlign = "center";
  var _v1442 = Math.max(84, Math.round(f.measureText(_v1441).width) + 14);
  f.fillStyle = "rgba(8,6,16,.9)";
  f.fillRect(_v1439 - _v1442 / 2, _v1440 + 12, _v1442, 17);
  f.strokeStyle = "#8c64ff";
  f.lineWidth = 1;
  f.strokeRect(_v1439 - _v1442 / 2 + 0.5, _v1440 + 12.5, _v1442 - 1, 16);
  f.fillStyle = "#f0e8ff";
  f.fillText(_v1441, _v1439, _v1440 + 24.5);
  f.restore();
}
function SimulacrumInteract() {
  if (!h.simUnlocked) {
    h.simUnlocked = !0;
    $e("迷雾副本", "已解锁 · 35 层挑战，免费进入");
  }
  SimEnterLayer(1);
}
function SimulacrumEnter() {
  SimEnterLayer(1);
}
function SimEnterLayer(_v1443) {
  if (!o || o.state !== "play") return;
  if (_v1443 > SIM_LAYERS) return SimFinishRun();
  let _v1444 = o.simRun || (o.simRun = {
    max: SIM_LAYERS
  }), _v1445 = Math.max(1, BAL.simRoomsPerMap || 5), _v1446 = (_v1443 - 1) % _v1445, _v1447 = Math.floor((_v1443 - 1) / _v1445), _v1448 = !o.Z || o.Z.simMap == null || o.Z.simMap !== _v1447;
  _v1444.layer = _v1443;
  try {
    if (o.pl && o.S && ue("pleasure")) {
      o.pl.hp = Math.min(o.S.maxLife, (o.pl.hp || 0) + o.S.maxLife * 0.25);
      o.pl.mana = Math.min(o.S.maxMana, (o.pl.mana || 0) + o.S.maxMana * 0.25);
    }
  } catch (_v1449) {}
  _v1444.map = _v1447 + 1;
  _v1444.room = _v1446 + 1;
  o.simRun = _v1444;
  if (_v1448) {
    let _v1450 = Math.max(1, Math.min(16, 1 + Math.floor(_v1443 / 3))), _v1451 = ia(_v1450);
    (_v1451.name = "迷雾副本 · 第 " + _v1443 + " 层", _v1451.base = "迷雾副本", _v1451.dbg = {
      rooms: [_v1445, _v1445]
    });
    let _v1452 = null;
    for (let _v1453 = 0; _v1453 < 40; _v1453++) {
      let _v1454 = Zn(_v1445);
      if (_v1454.rooms.length >= _v1445) {
        _v1452 = _v1454;
        break;
      }
    }
    SimLayerMap = !0;
    try {
      Pr(_v1451, _v1452 || void 0);
    } catch (_v1455) {
      SimLayerMap = !1;
      return;
    }
    SimLayerMap = !1;
    if (!o.Z || o.Z.type !== "map") return;
    o.Z.simMap = _v1447;
    o.Z.base = "迷雾副本";
  }
  o.sim = {
    layer: _v1443,
    depth: _v1443 * 50,
    active: !0,
    max: SIM_LAYERS,
    done: !1
  };
  (o.Z.simLayer = _v1443, o.Z.name = "迷雾副本 · 第 " + _v1443 + " 层", SimSetupRoom(_v1446, _v1443));
}
function SimSealRoom(_v1456) {
  let _v1457 = o.Z.M, _v1458 = _v1457.g, _v1459 = _v1457.W, _v1460 = _v1457.H;
  if (!_v1457 || !_v1458 || !_v1456) return;
  let _v1461 = function (_v1462, _v1463) {
    if (_v1462 >= 0 && _v1463 >= 0 && _v1462 < _v1459 && _v1463 < _v1460) _v1458[_v1463 * _v1459 + _v1462] = 1;
  };
  for (let _v1464 = _v1456.x - 1; _v1464 <= _v1456.x + _v1456.w; _v1464++) {
    _v1461(_v1464, _v1456.y - 1);
    _v1461(_v1464, _v1456.y + _v1456.h);
  }
  for (let _v1465 = _v1456.y - 1; _v1465 <= _v1456.y + _v1456.h; _v1465++) {
    _v1461(_v1456.x - 1, _v1465);
    _v1461(_v1456.x + _v1456.w, _v1465);
  }
}
function SimSetupRoom(_v1466, _v1467) {
  let _v1468 = o.Z.M, _v1469 = _v1468.rooms, _v1470 = _v1469[Math.min(_v1466, _v1469.length - 1)];
  (o.mons = [], o.objs = [], o.loots = []);
  SimSealRoom(_v1470);
  let _v1471 = ar(_v1470);
  (o.pl.x = _v1471.x, o.pl.y = _v1471.y);
  let _v1472 = (tt[o.Z.th.key] || ({})).boss || "boss", _v1473 = _e(_v1472, _v1471.x, _v1471.y - 20, o.Z.lvl + 2, 3);
  (_v1473.simBoss = !0, _v1473.aggro = !0, o.Z.boss = _v1473);
  o.mons.push(_v1473);
  let _v1474 = 1 + _v1467 * 50 / 100 * BAL.simSpawnPer100, _v1475 = Math.max(1, Math.round((3 + Math.floor(_v1467 / 5)) * _v1474));
  for (let _v1476 = 0; _v1476 < _v1475; _v1476++) {
    let _v1477 = ar(_v1470), _v1478 = _e(se(Object.keys(o.Z.th.mon)), _v1477.x, _v1477.y, o.Z.lvl || 80, j() < 0.12 ? 2 : j() < 0.4 ? 1 : 0);
    (_v1478.aggro = !0, o.mons.push(_v1478));
  }
  SimScaleSpawns(_v1467);
  ($e("迷雾副本 · 第 " + _v1467 + "/" + SIM_LAYERS + " 层", "第 " + o.simRun.map + " 图 · 第 " + o.simRun.room + "/" + BAL.simRoomsPerMap + " 个房间 · 击杀首领后按 F 前进"), M("portal"));
}
function SimScaleSpawns(_v1479) {
  try {
    let _v1480 = _v1479 * 50, _v1481 = _v1480 / 100 * BAL.simSpawnPer100, _v1482 = BAL.simSpawnCaps || ({
      0: 0.1,
      1: 0.5,
      2: 0.25
    }), _v1483 = {
      0: [],
      1: [],
      2: []
    };
    for (let _v1484 of o.mons) if (_v1484.rar >= 0 && _v1484.rar <= 2 && !_v1484.simBoss) _v1483[_v1484.rar].push(_v1484);
    let _v1485 = Object.keys(o.Z.th.mon);
    for (let _v1486 = 0; _v1486 < 3; _v1486++) {
      let _v1487 = _v1483[_v1486];
      if (!_v1487.length) continue;
      let _v1488 = Math.min(_v1482[_v1486] != null ? _v1482[_v1486] : 0, _v1481), _v1489 = Math.round(_v1487.length * _v1488);
      for (let _v1490 = 0; _v1490 < _v1489; _v1490++) {
        let _v1491 = se(_v1487), _v1492 = Ge(_v1491.x, _v1491.y, 32), _v1493 = _e(se(_v1485), _v1492.x, _v1492.y, o.Z.lvl || 80, _v1486);
        Object.assign(_v1493, {
          sim: !0,
          aggro: !0,
          del: !0
        });
        o.mons.push(_v1493);
      }
    }
  } catch (_v1494) {}
}
function SimTagBoss() {
  if (!o.simRun) return;
  for (let _v1495 of o.mons) {
    if (_v1495.rar !== 3 || _v1495.simBoss) continue;
    _v1495.simBoss = !0;
    if (o.simRun.layer >= o.simRun.max) {
      (_v1495.maxhp *= 5, _v1495.hp = _v1495.maxhp, _v1495.name = "最终·" + _v1495.name);
    } else _v1495.name = "拟像首领·" + _v1495.name;
  }
}
function SimBossKilled(_v1496) {
  if (!o.simRun || !_v1496 || !_v1496.simBoss || _v1496.simRewarded) return;
  _v1496.simRewarded = !0;
  let _v1497 = o.simRun.layer >= o.simRun.max, _v1498 = (_v1497 ? BAL.simFinalDivines : BAL.simLayerDivines) + (ue("deli1") ? 1 : 0) + (ue("deli4") ? 1 : 0) + (_v1497 && ue("deli7") ? 10 : 0);
  for (let _v1499 = 0; _v1499 < _v1498; _v1499++) ve(_v1496.x, _v1496.y, {
    kind: "cur",
    cur: "divine"
  });
  let _v1500 = 2 + (ue("deli3") ? 2 : 0);
  for (let _v1501 = 0; _v1501 < _v1500; _v1501++) ve(_v1496.x, _v1496.y, {
    kind: "cur",
    cur: "splinter"
  });
  if (ue("deli6")) DsBoneDrop(_v1496.x, _v1496.y, 1);
  if (_v1497) {
    for (let _v1502 = 0; _v1502 < 30; _v1502++) ve(_v1496.x, _v1496.y, {
      kind: "cur",
      cur: "splinter"
    });
    for (let _v1503 = 0; _v1503 < 3; _v1503++) DsBoneDrop(_v1496.x, _v1496.y, 1);
    for (let _v1504 = 0; _v1504 < 3; _v1504++) OmDrop(_v1496.x, _v1496.y);
    let _v1505 = lt.filter(_v1506 => _v1506.src === "world" && !_v1506.noDrop);
    if (_v1505.length && j() < 0.6) ve(_v1496.x, _v1496.y, {
      kind: "it",
      it: _t(se(_v1505), 80)
    });
    Ra.mageblood && j() < BAL.drop.mageblood && ve(_v1496.x, _v1496.y, {
      kind: "it",
      it: _t(Ra.mageblood, 80)
    });
    (h.delirium = Math.min(AtlasDeliriumCap(), (h.delirium || 0) + AtlasDeliriumGain(25 + (ue("deli2") ? 10 : 0) + (ue("deli5") ? 10 : 0))), h.simRuns = (h.simRuns || 0) + 1);
    $e("迷雾副本 · 完成", "35 层全部通过 · 最终首领掉落 20+ 神圣石");
    M("unique");
    o.simRun = null;
    o.sim = null;
  } else {
    let _v1507 = o.simRun.layer + 1, _v1508 = Math.max(1, BAL.simRoomsPerMap || 5);
    o.objs.push({
      kind: "b-simportal",
      x: _v1496.x,
      y: _v1496.y + 24,
      r: 16,
      layer: _v1507,
      label: (_v1507 - 1) % _v1508 === 0 ? "F 下一张图" : "F 下一个房间"
    });
    if (o.simRun.layer % (ue("sim_resonance") ? 10 : BAL.simAtlasEvery) === 0) GrantAtlasPoint("迷雾副本");
    $e("第 " + o.simRun.layer + " 层完成", "按 F 进入第 " + (o.simRun.layer + 1) + " 层");
    M("unique");
  }
}
function SimulacrumNext() {
  if (o.simRun) SimEnterLayer(o.simRun.layer + 1);
}
function SimDmgMul(_v1509) {
  return 1 + Math.max(0, (_v1509 || 0) - 18) * 0.15;
}
function SimulacrumUpdate(_v1510) {
  let _v1511 = o.simRun;
  if (!_v1511) return;
  if (o.pl && o.pl.dead) {
    (o.simRun = null, o.sim = null, h.delirium = Math.min(AtlasDeliriumCap(), h.delirium || 0), $e("迷雾副本崩塌", "挑战失败"));
    return;
  }
  SimTagBoss();
}
function SimFinishRun() {
  (o.simRun = null, o.sim = null, h.delirium = Math.min(AtlasDeliriumCap(), h.delirium || 0));
}
function SimulacrumFinish() {
  SimFinishRun();
}
function curPage() {
  let _v1512 = [["basic", "基础通货"], ["sock", "工匠通货"], ["rune", "符文"], ["ess", "精华"], ["sig", "印记"], ["del", "破溃裂片"], ["bone", "遗存骨"], ["omen", "预兆"]];
  let _v1513 = _v1512.map(function (_v1514) {
    let _v1515 = rt.filter(function (_v1516) {
      return F[_v1516].grp === _v1514[0];
    });
    if (!_v1515.length) return "";
    let _v1517 = _v1515.map(function (_v1518) {
      if (_v1514[0] === "omen") return `<div class="cur om${OmActive(_v1518) ? " on" : ""}${h.cur[_v1518] ? "" : " zero"}" data-act="omen" data-k="${_v1518}" data-tt="cur:${_v1518}"><img src="${He[_v1518]}" alt=""><span>${F[_v1518].s || F[_v1518].n}</span><b>${h.cur[_v1518] || 0}</b>${OmActive(_v1518) ? '<i class="omtag">激活</i>' : ""}</div>`;
      return `<div class="cur${o.held === _v1518 ? " sel" : ""}${h.cur[_v1518] ? "" : " zero"}" data-act="cur" data-k="${_v1518}" data-tt="cur:${_v1518}"><img src="${He[_v1518]}" alt=""><span>${F[_v1518].n}</span><b>${h.cur[_v1518] || 0}</b></div>`;
    }).join("");
    return `<div style="margin:10px 0 4px"><h3 style="margin:0 0 6px;font-size:13px;color:var(--mod)">${_v1514[1]} <small>${_v1515.length} 种</small></h3><div style="display:flex;flex-wrap:wrap;gap:8px">${_v1517}</div></div>`;
  }).join("");
  return `<div class="it"><section class="card"><h3>通货 <small>全角色共用 · 点击选中后使用 · 按住 Shift 连续使用</small></h3><p class="dim">按大类分行显示；预兆点击激活。全部通货与角色共享，不占背包格。</p>${_v1513}</section></div>`;
}
function jiBox(_v1519) {
  if ((_v1519.open = !0, M("craft"), M("boom", 0.6), V(0.2), L(_v1519.x, _v1519.y, 30, _v1519.riftBox ? ["#b080ff", "#ff70ff", "#fff"] : ["#ffd060", "#b08a3a", "#fff6d0"], 80, 0.9, {
    glow: !0,
    vz: 120
  }), h.stats && (h.stats.boxes = (h.stats.boxes || 0) + 1), _v1519.encBox)) {
    Ly(_v1519);
    return;
  }
  el(_v1519.x, _v1519.y, 6 * (ue("box2") ? 1.3 : 1) * (_v1519.riftBox ? 0.8 : 1), 30);
  let _v1520 = ue("box6") && j() < 0.2, _v1521 = 3 * (_v1520 ? 2 : 1);
  for (let _v1522 = 0; _v1522 < _v1521; _v1522++) ve(_v1519.x, _v1519.y, {
    kind: "cur",
    cur: h0()
  });
  if ((_v1520 && U(_v1519.x, _v1519.y - 18, 0, !1, "gold", "通货翻倍"), _v1519.ornate)) for (let _v1523 = 0; _v1523 < 3; _v1523++) ve(_v1519.x, _v1519.y, {
    kind: "cur",
    cur: "chaos"
  });
  if (ue("box7")) {
    let _v1524 = rt.filter(_v1525 => F[_v1525].grp === "basic" && F[_v1525].v >= F.alch.v && _v1525 !== "divine" && _v1525 !== "exalt" && _v1525 !== "frac");
    ve(_v1519.x, _v1519.y, {
      kind: "cur",
      cur: ht(_v1524, _v1526 => F[_v1526].w)
    });
  }
  if (_v1519.riftBox) {
    j() < 0.22 + Math.min(0.13, (o.Z ? o.Z.tier : 0) * 0.008) && OmDrop(_v1519.x, _v1519.y);
    P("裂隙宝箱");
    return;
  }
  if (_v1519.abyssBox) {
    let _v1527 = o.objs.find(_v1528 => _v1528.kind === "abyss" && Math.hypot(_v1528.x - _v1519.x, _v1528.y - _v1519.y) < 80);
    (_v1527 && (_v1527.st = "opened"), h.abyssDone = (h.abyssDone || 0) + 1);
    let _v1529 = _v1519.abyssBox, _v1530 = _v1519.abyssName || "深渊保险箱", _v1531 = () => {
      (el(_v1519.x, _v1519.y, 10, 32), j() < 0.6 && DsBoneDrop(_v1519.x, _v1519.y, 1));
      try {
        ue("abyssdom") && DsBoneDrop(_v1519.x, _v1519.y, 1);
      } catch (_v1532) {}
      for (let _v1533 = 0; _v1533 < 3 + (ue("aby3") ? 2 : 0); _v1533++) ve(_v1519.x, _v1519.y, {
        kind: "cur",
        cur: h0()
      });
      if (_v1529 === "coffer") {
        (ve(_v1519.x, _v1519.y, {
          kind: "cur",
          cur: "chaos"
        }), ve(_v1519.x, _v1519.y, {
          kind: "cur",
          cur: "chaos"
        }));
      } else {
        let _v1534 = Ca.filter(_v1535 => _v1529 === "arsenal" ? _v1535.slot === "W" : ["B", "H", "G", "F"].includes(_v1535.slot)).map(_v1536 => he[_v1536.n] || _v1536);
        _v1534.length && ve(_v1519.x, _v1519.y, {
          kind: "it",
          it: la(se(_v1534), o.Z.lvl + 2, 2)
        });
      }
      j() < 0.5 && OmDrop(_v1519.x, _v1519.y);
      try {
        if (j() < 0.25 || (o.Z.tier || 0) >= 14) JewelDrop(_v1519.x, _v1519.y);
      } catch (_v1537) {}
    };
    (_v1531(), P(_v1530), $e(_v1530, "深渊的宝藏升起了"), L(_v1519.x, _v1519.y, 30, ["#2a6a3a", "#7dff9a", "#d8ffe0"], 90, 0.9, {
      glow: !0,
      vz: 140
    }));
    let _v1538 = lt.filter(_v1539 => _v1539.src === "world" && !_v1539.noDrop);
    _v1538.length && j() < 0.25 + (ue("aby7") ? 0.25 : 0) && ve(_v1519.x, _v1519.y, {
      kind: "it",
      it: _t(se(_v1538), o.Z.lvl)
    });
    return;
  }
  if (_v1519.delBox) {
    (el(_v1519.x, _v1519.y, 8, 30), P("惊悸宝箱"));
    (DelSplinter(_v1519.x, _v1519.y), DelSplinter(_v1519.x, _v1519.y), DelSplinter(_v1519.x, _v1519.y));
    j() < 0.5 && OmDrop(_v1519.x, _v1519.y);
    j() < 0.3 && DsBoneDrop(_v1519.x, _v1519.y);
    return;
  }
  j() < (_v1519.ornate ? 0.4 : 0.12) && OmDrop(_v1519.x, _v1519.y);
  let _v1540 = ue("box4") ? 4 : 7, _v1541 = o.Z.th.mon, _v1542 = Object.keys(_v1541);
  for (let _v1543 = 0; _v1543 < _v1540; _v1543++) {
    let _v1544 = Ge(_v1519.x, _v1519.y, 50), _v1545 = _e(ht(_v1542, _v1546 => _v1541[_v1546]), _v1544.x, _v1544.y, o.Z.lvl, 1);
    (_v1545.aggro = !0, o.mons.push(_v1545), L(_v1544.x, _v1544.y, 8, ["#8a8cff", "#fff"], 50, 0.4));
  }
  P("宝箱守卫出现了");
}
function AbyssModRoll(_v1547) {
  if (_v1547.abmod) return _v1547.abmod;
  let _v1548 = se(Object.keys(ABMODS));
  return (_v1547.abmod = _v1548, _v1547.abmodT = O(1.5, 3), _v1548);
}
function AbyssOmenDrop(_v1549, _v1550) {
  let _v1551 = ht(AB_OMEN, _v1552 => F[_v1552].ow || 1);
  return (ve(_v1549, _v1550, {
    kind: "cur",
    cur: _v1551
  }), _v1551);
}
function AbyssMods(_v1553) {
  if (!o.Z || o.Z.type !== "map" || !o.pl || o.pl.dead) return;
  for (let _v1554 of o.mons) {
    if (_v1554.dead || !_v1554.abyss || !_v1554.abmod) continue;
    let _v1555 = _v1554.abmod;
    if ((_v1554.abmodT = (_v1554.abmodT || 0) - _v1553, _v1555 === "soul")) {
      (_v1554.soulT = (_v1554.soulT || 0) - _v1553, _v1554.soulT <= 0 && (_v1554.x - o.pl.x) ** 2 + (_v1554.y - o.pl.y) ** 2 < 7225 && (_v1554.soulT = 0.6, Dt(_v1554.dmg * 0.6, "phys", {
        dot: !0,
        noCrit: !0
      })));
    } else if (_v1555 === "shade") {
      _v1554.abmodT <= 0 && (_v1554.abmodT = O(4.5, 6.5), _v1554.x = o.pl.x + O(-34, 34), _v1554.y = o.pl.y + O(-34, 34), o.fx.push({
        k: "ring",
        x: _v1554.x,
        y: _v1554.y,
        r0: 3,
        r1: 22,
        t: 0,
        max: 0.3,
        col: "#2ee6a8",
        w: 2
      }), L(_v1554.x, _v1554.y, 10, AB_GREEN, 50, 0.5, {
        glow: !0
      }), M("portal"));
    } else if (_v1555 === "rune") {
      if (_v1554.abmodT <= 0) {
        (_v1554.abmodT = O(3.2, 4.6), o.fx.push({
          k: "ring",
          x: o.pl.x,
          y: o.pl.y,
          r0: 2,
          r1: 26,
          t: 0,
          max: 0.75,
          col: "#2ee6a8",
          w: 2
        }));
        let _v1556 = o.pl.x, _v1557 = o.pl.y, _v1558 = _v1554.dmg * 1.2;
        o.pend.push({
          t: 0.85,
          fn: () => {
            (L(_v1556, _v1557, 16, AB_GREEN, 70, 0.5, {
              glow: !0
            }), M("boom", 0.4), (o.pl.x - _v1556) ** 2 + (o.pl.y - _v1557) ** 2 < 2500 && Dt(_v1558, "phys", {
              area: !0
            }));
          }
        });
      }
    } else if (_v1555 === "revenant") {
      !_v1554.revSpawn && _v1554.hp < _v1554.maxhp * 0.7 && (_v1554.revSpawn = !0, o.pend.push({
        t: 0.15,
        fn: () => {
          for (let _v1559 = 0; _v1559 < 2; _v1559++) {
            let _v1560 = _e("abysswalker", _v1554.x + O(-14, 14), _v1554.y + O(-14, 14), Math.max(1, o.Z.lvl - 2), 0);
            (Object.assign(_v1560, {
              abyss: !0,
              pit: _v1554.pit,
              aggro: !0,
              name: "深渊亡魂"
            }), _v1560.maxhp *= 0.45, _v1560.hp = _v1560.maxhp, _v1560.dmg *= 0.6, o.mons.push(_v1560));
          }
          (L(_v1554.x, _v1554.y, 14, AB_GREEN, 60, 0.5, {
            glow: !0
          }), M("portal"));
        }
      }));
    } else if (_v1555 === "undying") {
      (_v1554.undT = (_v1554.undT || 0) - _v1553, _v1554.undT <= 0 && (_v1554.undT = 0.6, o.mons.forEach(_v1561 => {
        !_v1561.dead && _v1561.abyss && _v1561 !== _v1554 && (_v1561.x - _v1554.x) ** 2 + (_v1561.y - _v1554.y) ** 2 < 10000 && (_v1561.hp = Math.min(_v1561.maxhp, _v1561.hp + _v1561.maxhp * 0.05));
      })));
    }
  }
}
function AbyssFloorOK(_v1562, _v1563) {
  try {
    let _v1564 = o.Z && o.Z.M;
    if (!_v1564 || !_v1564.g) return !0;
    let _v1565 = Math.floor(_v1562 / N), _v1566 = Math.floor(_v1563 / N);
    return _v1565 >= 1 && _v1566 >= 1 && _v1565 < _v1564.W - 1 && _v1566 < _v1564.H - 1 && _v1564.g[_v1566 * _v1564.W + _v1565] !== 1;
  } catch (_v1567) {
    return !0;
  }
}
function AbyssWallGap(_v1568, _v1569) {
  for (let _v1570 = 0; _v1570 <= 56; _v1570 += 4) for (let _v1571 = 0; _v1571 < 6.2832; _v1571 += 0.5236) if (!AbyssFloorOK(_v1568 + Math.cos(_v1571) * _v1570, _v1569 + Math.sin(_v1571) * _v1570)) return _v1570;
  return 56;
}
function AbyssMake(_v1572, _v1573) {
  let _v1574 = {
    kind: "abyss",
    x: _v1572,
    y: _v1573,
    r: 16,
    st: "fissures",
    fissures: [],
    waveT: 0,
    seen: !1,
    lichborn: null
  };
  let _v1575 = Math.max(1, Math.round(ie(3, 5) * (ue("abyssdom") ? 1.5 : 1))), _v1576 = (o.Z.M && o.Z.M.rooms || []).filter(_v1577 => !_v1577.boss);
  for (let _v1578 = 0; _v1578 < _v1575; _v1578++) {
    let _v1579 = _v1576[_v1578 % Math.max(1, _v1576.length)] || (o.Z.M.rooms || [])[0], _v1580 = _v1579 ? ar(_v1579) : Ge(_v1572, _v1573, 70 + _v1578 * 42);
    if (!_v1579) {
      (_v1580.x = we(_v1580.x, 48, o.Z.M.W * N - 48), _v1580.y = we(_v1580.y, 48, o.Z.M.H * N - 48));
    }
    for (let _v1581 = 0; _v1581 < 24 && (!AbyssFloorOK(_v1580.x, _v1580.y) || AbyssWallGap(_v1580.x, _v1580.y) < 28); _v1581++) {
      _v1580 = _v1579 ? ar(_v1579) : Ge(_v1572, _v1573, 70 + _v1578 * 42);
      if (!_v1579) {
        (_v1580.x = we(_v1580.x, 48, o.Z.M.W * N - 48), _v1580.y = we(_v1580.y, 48, o.Z.M.H * N - 48));
      }
    }
    if (!AbyssFloorOK(_v1580.x, _v1580.y)) {
      (_v1580.x = we(_v1580.x, 48, o.Z.M.W * N - 48), _v1580.y = we(_v1580.y, 48, o.Z.M.H * N - 48));
    }
    let _v1582 = {
      x: _v1580.x,
      y: _v1580.y,
      closed: !1,
      kills: 0,
      need: 1 + (ue("abyssdom") ? 1 : 0)
    };
    _v1574.fissures.push(_v1582);
    for (let _v1583 = 0; _v1583 < 3; _v1583++) {
      let _v1584 = Ge(_v1582.x, _v1582.y, 30);
      for (let _v1585 = 0; _v1585 < 16 && !AbyssFloorOK(_v1584.x, _v1584.y); _v1585++) _v1584 = Ge(_v1582.x, _v1582.y, 30);
      if (!AbyssFloorOK(_v1584.x, _v1584.y)) {
        (_v1584.x = _v1582.x, _v1584.y = _v1582.y);
      }
      let _v1586 = _e(se(Object.keys(o.Z.th.mon)), _v1584.x, _v1584.y, o.Z.lvl, j() < 0.16 ? 1 : 0);
      (_v1586.weak = !0, _v1586.dmg *= 0.75, _v1586.maxhp *= 0.85, _v1586.hp = _v1586.maxhp, _v1586.aggro = !0, o.mons.push(_v1586));
    }
  }
  for (let _v1587 of o.mons) !_v1587.abyss && !_v1587.weak && _v1574.fissures.some(_v1588 => (_v1588.x - _v1587.x) ** 2 + (_v1588.y - _v1587.y) ** 2 < 8100) && (_v1587.weak = !0, _v1587.dmg *= 0.75);
  return _v1574;
}
function AbyssAnnounce(_v1589) {
  _v1589.seen = !0;
  let _v1590 = _v1589.fissures.length;
  ($e("深渊裂缝", "击杀裂缝附近的怪物来关闭裂缝 · 共 " + _v1590 + " 道"), M("portal"), V(0.15), L(_v1589.x, _v1589.y, 26, AB_GREEN, 70, 0.9, {
    glow: !0,
    vz: 120
  }));
}
function AbyssCloseFissure(_v1591, _v1592) {
  (_v1592.closed = !0, L(_v1592.x, _v1592.y, 20, AB_GREEN, 70, 0.8, {
    glow: !0,
    vz: 110
  }), M("boom", 0.5), P("深渊裂缝关闭 (" + _v1591.fissures.filter(_v1593 => _v1593.closed).length + "/" + _v1591.fissures.length + ")"));
  let _v1594 = 3 + (j() < 0.3 ? 1 : 0);
  for (let _v1595 = 0; _v1595 < _v1594; _v1595++) {
    let _v1596 = Ge(_v1592.x, _v1592.y, 26), _v1597 = _e(se(["abysswalker", "abyssshambler", "abyssstrangler"]), _v1596.x, _v1596.y, o.Z.lvl, j() < 0.08 ? 1 : 0);
    (_v1597.abyss = !0, _v1597.pit = _v1591, _v1597.aggro = !0, j() < (_v1597.rar >= 2 ? 1 : _v1597.rar === 1 ? 0.35 : 0.06) && AbyssModRoll(_v1597), o.mons.push(_v1597));
  }
  _v1591.fissures.every(_v1598 => _v1598.closed) && AbyssOpenPit(_v1591);
}
function AbyssOpenPit(_v1599) {
  if (_v1599.st !== "fissures") return;
  _v1599.st = "pit";
  _v1599.waveT = 1.2;
  let _v1600 = 9 + Math.min(8, Math.round((o.Z.tier || 1) / 2)), _v1601 = j() < 0.3 + (ue("aby5") ? 0.2 : 0) ? se(AB_LICHBORN) : null;
  _v1601 && (_v1599.lichborn = _v1601.n);
  for (let _v1602 = 0; _v1602 < _v1600; _v1602++) {
    let _v1603 = Ge(_v1599.x, _v1599.y, 40 + _v1602 % 3 * 28), _v1604 = _e(se(["abysswalker", "abyssshambler", "abyssstrangler"]), _v1603.x, _v1603.y, o.Z.lvl, j() < 0.12 ? 2 : 0);
    if (_v1601 && _v1602 === 0) {
      (Object.assign(_v1604, {
        spr: "abysslich",
        h: zt.abysslich.h,
        r: 9,
        abyss: !0,
        pit: _v1599,
        aggro: !0,
        lichborn: _v1601.k,
        name: _v1601.n + " · 深渊行者"
      }), _v1604.maxhp *= 2.6, _v1604.hp = _v1604.maxhp, _v1604.dmg *= 1.25, _v1604.rar = 2);
    } else (_v1604.abyss = !0, _v1604.pit = _v1599, _v1604.aggro = !0);
    j() < (_v1604.rar >= 2 ? 1 : _v1604.rar === 1 ? 0.4 : 0.08) && AbyssModRoll(_v1604);
    o.mons.push(_v1604);
  }
  ($e("深渊巨坑开启", "大量深渊怪物涌了出来" + (_v1601 ? " · " + _v1601.n + " 在其中" : "")), M("unique"), V(0.25), L(_v1599.x, _v1599.y, 60, AB_GREEN, 110, 1.1, {
    glow: !0,
    vz: 160
  }));
}
function AbyssSeal(_v1605) {
  if (_v1605.st !== "pit") return;
  _v1605.st = "sealed";
  let _v1606 = se(AB_TROVE);
  ($e("深渊巨坑关闭", "深渊保险箱正在升起"), M("unique"), L(_v1605.x, _v1605.y, 34, AB_GREEN, 90, 1, {
    glow: !0,
    vz: 140
  }), o.pend.push({
    t: 0.85,
    fn: () => {
      let _v1607 = Ge(_v1605.x, _v1605.y, 10);
      (o.objs.push({
        kind: "box",
        x: _v1607.x,
        y: _v1607.y,
        r: 6,
        open: !1,
        abyssBox: _v1606.k,
        abyssName: _v1606.n
      }), _v1605.st = "done", $e(_v1606.n, "深渊的宝藏升起了"), L(_v1607.x, _v1607.y, 26, AB_GREEN, 80, 0.9, {
        glow: !0,
        vz: 130
      }));
    }
  }));
}
function AbyssUpdate(_v1608) {
  if (!o.Z || o.Z.type !== "map" || !o.pl || o.pl.dead) return;
  for (let _v1609 of o.objs) {
    if (_v1609.kind !== "abyss") continue;
    (!_v1609.seen && (_v1609.x - o.pl.x) ** 2 + (_v1609.y - o.pl.y) ** 2 < 90000 && AbyssAnnounce(_v1609), _v1609.st === "fissures" && _v1609.fissures.forEach(_v1610 => {
      !_v1610.closed && j() < 0.012 && o.parts.push({
        x: _v1610.x + O(-10, 10),
        y: _v1610.y + O(-6, 6),
        z: 1,
        vx: 0,
        vy: 0,
        vz: O(14, 30),
        g: -6,
        life: 0.8,
        max: 0.8,
        col: se(AB_GREEN),
        s: 1,
        glow: !0,
        drag: 0
      });
    }), _v1609.st === "pit" && (_v1609.waveT -= _v1608, _v1609.waveT <= 0 && !o.mons.some(_v1611 => _v1611.abyss && _v1611.pit === _v1609 && !_v1611.dead) && AbyssSeal(_v1609)));
  }
}
function AbyssOnKill(_v1612) {
  if (!o.Z || o.Z.type !== "map") return;
  for (let _v1613 of o.objs) {
    if (_v1613.kind !== "abyss" || _v1613.st !== "fissures" || _v1612.abyss) continue;
    for (let _v1614 of _v1613.fissures) if (!_v1614.closed && (_v1614.x - _v1612.x) ** 2 + (_v1614.y - _v1612.y) ** 2 < 9025) {
      (_v1614.kills = (_v1614.kills || 0) + 1, _v1614.kills >= _v1614.need && AbyssCloseFissure(_v1613, _v1614));
      break;
    }
  }
}
function ExCalc(_v1615, _v1616, _v1617) {
  let _v1618 = F[_v1615], _v1619 = F[_v1616];
  if (!_v1618 || !_v1619) return {
    err: "不能兑换这一项"
  };
  _v1617 = Math.floor(+_v1617 || 0);
  if (!(_v1617 > 0)) return {
    err: "数量至少 1"
  };
  let _v1620 = h.cur[_v1615] || 0;
  if (_v1617 > _v1620) return {
    err: "只有 " + _v1620 + " 个" + _v1618.n
  };
  let _v1621 = ExC(_v1615), _v1622 = ExC(_v1616), _v1623 = _v1617 * _v1621, _v1624 = Math.floor(_v1623 / _v1622);
  if (_v1624 < 1) return {
    err: "太少了 · 至少要 " + Math.ceil(_v1622 / _v1621) + " 个" + _v1618.n
  };
  return {
    n: _v1617,
    got: _v1624,
    total: _v1623,
    used: _v1624 * _v1622,
    left: _v1623 - _v1624 * _v1622
  };
}
function ExPrev() {
  let _v1625 = wa.ex, _v1626 = ExCalc(_v1625.from, _v1625.to, _v1625.amt), _v1627 = A("#exOut"), _v1628 = A("#exGo");
  if (!_v1627) return;
  if (_v1626.err) {
    (_v1627.innerHTML = `<div class="exerr">${B(_v1626.err)}</div>`, _v1628 && (_v1628.disabled = !0, _v1628.classList.add("no")));
    return;
  }
  (_v1627.innerHTML = `<div class="exline">给出 <b>${_v1626.n}</b> × <span style="color:${F[_v1625.from].col}">${F[_v1625.from].n}</span> = <b>${At(_v1626.total / 100)}</b>c</div><div class="exline">得到 <b>${_v1626.got}</b> × <span style="color:${F[_v1625.to].col}">${F[_v1625.to].n}</span> <small class="exdim">= ${At(_v1626.used / 100)}c</small></div>${_v1626.left ? `<div class="exdim">尾数 ${At(_v1626.left / 100)}c 不找零</div>` : ""}`, _v1628 && (_v1628.disabled = !1, _v1628.classList.remove("no")));
}
function ExDo() {
  let _v1629 = wa.ex, _v1630 = ExCalc(_v1629.from, _v1629.to, _v1629.amt);
  if (_v1630.err) return (P(_v1630.err), M("nomana", 0.5), !1);
  return (h.cur[_v1629.from] -= _v1630.n, h.cur[_v1629.to] = (h.cur[_v1629.to] || 0) + _v1630.got, P("通货兑换 · " + _v1630.n + " " + F[_v1629.from].n + " → " + _v1630.got + " " + F[_v1629.to].n), M("pick"), o.tab && ms(), !0);
}
function ExBody() {
  let _v1631 = wa.ex, _v1632 = ExAll(), _v1633 = h.cur[_v1631.from] || 0;
  (_v1631.amt > _v1633 && (_v1631.amt = _v1633 > 0 ? _v1633 : 1), _v1632.includes(_v1631.from) || (_v1631.from = _v1632[0]), _v1632.includes(_v1631.to) || (_v1631.to = _v1632[1] || _v1632[0]));
  let _v1634 = (_v1635, _v1636) => {
    let _v1637 = (_v1636 === "from" ? _v1631.from : _v1631.to) === _v1635, _v1638 = F[_v1635];
    return `<button class="exchip${_v1637 ? " on" : ""}" data-${_v1636 === "from" ? "exfrom" : "exto"}="${_v1635}" data-tt="cur:${_v1635}"><img src="${He[_v1635]}" alt=""><span>${_v1638.s || _v1638.n}</span><i>${At(_v1638.v)}c</i><b>${h.cur[_v1635] || 0}</b></button>`;
  };
  return `<div class="exc"><p class="exc-hint">汇率取作者标注的混沌石等价 · 兑换向下取整, 尾数不找零</p>
		 <div class="excols">
		  <section class="exside"><h4>给出 <small>${F[_v1631.from].n}</small></h4><div class="exgrid">${_v1632.map(_v1639 => _v1634(_v1639, "from")).join("")}</div></section>
		  <section class="exmid"><h4>交换</h4>
		   <div class="exrate">1 ${F[_v1631.from].n} = ${At(F[_v1631.from].v / F[_v1631.to].v)} ${F[_v1631.to].n}</div>
		   <label class="examt">数量 <input id="exAmt" type="number" min="0" step="1" value="${_v1631.amt}"></label>
		   <div class="exq"><button data-examt="1">+1</button><button data-examt="10">+10</button><button data-examt="100">+100</button><button data-examt="max">最大</button></div>
		   <div class="exout" id="exOut"></div>
		   <button class="btn primary" id="exGo" disabled>确认兑换</button>
		  </section>
		  <section class="exside"><h4>得到 <small>${F[_v1631.to].n}</small></h4><div class="exgrid">${_v1632.map(_v1640 => _v1634(_v1640, "to")).join("")}</div></section>
		 </div></div>`;
}
function UniqueResCap() {
  try {
    let _v1641 = h && h.equip && h.equip.body;
    if (_v1641 && _v1641.uniq === "kaoms_heart") return 70;
  } catch (_v1642) {}
  return 90;
}
function GrantAtlasPoint(_v1643) {
  try {
    if (!o || !o.Z || o.Z.type !== "map") return;
    o.Z.bFlags = o.Z.bFlags || ({});
    if (o.Z.bFlags[_v1643]) return;
    o.Z.bFlags[_v1643] = 1;
    if ((h.atlasPts || 0) < Ln) {
      h.atlasPts = (h.atlasPts || 0) + 1;
      P("图谱点 +1 · " + _v1643 + " · 按 U 打开图谱加点");
    } else P("图谱点已达上限");
  } catch (_v1644) {}
}
function RitualMapCheck() {
  try {
    if (!o || !o.Z || o.Z.type !== "map") return;
    let _v1645 = 0, _v1646 = 0;
    for (let _v1647 of o.objs) {
      if (_v1647.kind !== "ritual") continue;
      _v1645++;
      if (_v1647.st === "done") _v1646++;
    }
    if (_v1645 > 0 && _v1646 >= _v1645) GrantAtlasPoint("驱灵仪式");
  } catch (_v1648) {}
}
Object.assign(yk, {
  通货兑换: "Currency Exchange",
  给出: "Give",
  得到: "Receive",
  交换: "Exchange",
  确认兑换: "Confirm Exchange",
  "不能兑换这一项": "Can't exchange this",
  "数量至少 1": "Amount must be at least 1",
  "汇率取作者标注的混沌石等价 · 兑换向下取整, 尾数不找零": "Rates use the author's chaos-equivalent prices · rounded down, the remainder is not refunded",
  深渊裂缝: "Abyssal Fissures",
  深渊巨坑: "Abyssal Pit",
  深渊保险箱: "Abyssal Trove",
  "深渊保险箱 · 通货库": "Abyssal Coffer",
  "深渊保险箱 · 武器库": "Abyssal Arsenal",
  "深渊保险箱 · 护甲库": "Abyssal Armoury",
  深渊行者: "Abyssal Walker",
  深渊蹒跚者: "Abyssal Shambler",
  深渊绞杀者: "Abyssal Strangler",
  巫妖血脉: "Lichborn",
  阿曼娜姆的虚空: "Amanamu's Void",
  古加尔的最后喘息: "Kurgal's Final Gasp",
  乌拉曼的军团: "Ulaman's Legion",
  深渊回响预兆: "Omen of Abyssal Echoes",
  光明预兆: "Omen of Light",
  腐烂预兆: "Omen of Putrefaction",
  领主预兆: "Omen of the Liege",
  黑血预兆: "Omen of the Blackblooded",
  至高预兆: "Omen of the Sovereign",
  深渊回响: "Abyssal Echo",
  光明: "Light",
  领主: "Liege",
  黑血: "Blackblooded",
  至高: "Sovereign",
  "你的下一个深渊保险箱会额外重摇一次掉落": "your next Abyssal Trove will roll its loot one extra time",
  "你的下一个深渊保险箱必定掉落一件传奇物品": "your next Abyssal Trove is guaranteed to contain a Unique",
  "你的下一个深渊巨坑里所有怪物都会获得一条深渊词缀, 且掉落提高": "every monster from your next Abyssal Pit gains an Abyssal modifier and drops more loot",
  "你的下一个深渊巨坑必定出现阿曼娜姆的虚空": "your next Abyssal Pit is guaranteed to spawn Amanamu's Void",
  "你的下一个深渊巨坑必定出现古加尔的最后喘息": "your next Abyssal Pit is guaranteed to spawn Kurgal's Final Gasp",
  "你的下一个深渊巨坑必定出现乌拉曼的军团": "your next Abyssal Pit is guaranteed to spawn Ulaman's Legion",
  灵魂虹吸: "Soul Siphoner",
  易爆灵魂: "Volatile Souls",
  不稳定的亡魂: "Unstable Revenants",
  暗影行者: "Shade Walker",
  石语符文: "Lithomantic Runes",
  不朽意志: "Undying Will",
  "靠近它的敌人会被绿环持续灼烧": "nearby enemies are scorched by a green ring",
  "死亡时爆出一圈深渊伤害": "explodes in abyssal damage on death",
  "重伤时会分裂出亡魂": "splits into revenants when badly wounded",
  "会突然传送到你身边": "teleports next to you",
  "在你脚下留下延迟爆炸的符文": "leaves delayed explosive runes at your feet",
  "持续治疗周围的深渊怪物": "heals nearby abyssal monsters",
  深渊亡魂: "Abyssal Revenant",
  "深渊回响 · 宝藏又响了一次": "Abyssal Echo · the trove rang again",
  "只在深渊/渎灵相关操作中生效 · 同类只能激活 1 个": "Only during Abyss / Desecration actions · one of each kind active",
  惊悸迷雾: "Delirium",
  惊悸迷雾之镜: "Mirror of Delirium",
  亢奋度: "Deliriousness",
  迷雾之影: "Delirium Shade",
  惊悸宝箱: "Delirium Chest",
  迷雾副本裂片: "Simulacrum Splinter",
  拟像裂片: "Splinter",
  "迷雾从镜面扩散 · 越远离镜子亢奋度越高": "The mist spreads from the mirror · the farther you are, the higher the Deliriousness",
  迷雾散去: "The Delirium mist fades",
  "你从惊悸迷雾中走了出来": "You step out of the Delirium",
  迷雾之潮: "Delirium Wave",
  "迷雾之影与惊悸宝箱出现了": "A Delirium Shade and a Delirium Chest appear",
  驱灵仪式: "Ritual",
  驱灵祭坛: "Ritual Altar",
  恩典: "Favours",
  恩赐: "Favour",
  贡品: "Tribute",
  开始驱灵仪式: "Start Ritual",
  领取恩典: "Claim Favours",
  驱灵仪式进行中: "Ritual in progress",
  恩典降临: "Favours have arrived",
  "回到祭坛领取恩赐": "Return to the altar to claim favours",
  "已兑换": "Claimed",
  "贡品不足": "Not enough Tribute",
  "已售出": "Sold out",
  灵魂之井: "Well of Souls",
  打开灵魂之井: "Open the Well of Souls",
  渎灵: "Desecrated",
  渎灵词缀已揭示: "Desecrated modifier revealed",
  未揭示的渎灵词缀: "Unrevealed Desecrated modifier",
  去灵魂之井揭示: "Reveal it at the Well of Souls",
  没有待揭示的渎灵装备: "No items with unrevealed Desecrated modifiers",
  "用遗存骨对稀有装备渎灵": "Use a Preserved Bone on a Rare item to Desecrate it",
  背包里没有: "None in inventory",
  揭示: "Reveal",
  重掷选项: "Reroll options",
  词缀已揭示: "Modifier revealed",
  选项已重掷: "Options rerolled",
  骨: "Bone",
  三选一: "choose 1 of 3",
  啃噬遗存骨: "Gnawed Preserved Bone",
  遗存骨: "Preserved Bone",
  远古遗存骨: "Ancient Preserved Bone",
  啃噬骨: "Gnawed Bone",
  远古骨: "Ancient Bone",
  "对一件稀有装备渎灵: 添加 1 条未揭示的渎灵词缀, 在藏身处的灵魂之井揭示(3 选 1)。低阶骨, 词缀数值较低": "Desecrate a Rare item: adds 1 unrevealed Desecrated modifier, revealed at the Well of Souls (choose 1 of 3). Low tier bone, lower modifier values",
  "对一件稀有装备渎灵: 添加 1 条未揭示的渎灵词缀, 在藏身处的灵魂之井揭示(3 选 1)。中阶骨, 词缀数值较高": "Desecrate a Rare item: adds 1 unrevealed Desecrated modifier, revealed at the Well of Souls (choose 1 of 3). Mid tier bone, higher modifier values",
  "对一件稀有装备渎灵: 添加 1 条未揭示的渎灵词缀, 在藏身处的灵魂之井揭示(3 选 1)。最高阶骨, 可出最高一档词缀": "Desecrate a Rare item: adds 1 unrevealed Desecrated modifier, revealed at the Well of Souls (choose 1 of 3). Highest tier bone, can roll the top tier",
  左旋死灵预兆: "Omen of Sinistral Necromancy",
  右旋死灵预兆: "Omen of Dextral Necromancy",
  圣化预兆: "Omen of Sanctification",
  祝福预兆: "Omen of the Blessed",
  机遇预兆: "Omen of Chance",
  恢复预兆: "Omen of Refreshment",
  互换预兆: "Omen of Bartering",
  强运预兆: "Omen of Gambling",
  混沌数量预兆: "Omen of Chaotic Quantity",
  混沌怪物预兆: "Omen of Chaotic Monsters",
  混沌稀有预兆: "Omen of Chaotic Rarity",
  左旋死灵: "Sinistral Necromancy",
  右旋死灵: "Dextral Necromancy",
  圣化: "Sanctification",
  祝福: "Blessed",
  机遇: "Chance",
  恢复: "Refreshment",
  互换: "Bartering",
  强运: "Gambling",
  混沌数量: "Chaotic Quantity",
  混沌怪物: "Chaotic Monsters",
  混沌稀有: "Chaotic Rarity",
  "你的下一次渎灵只会添加前缀": "your next Desecration will add only prefix modifiers",
  "你的下一次渎灵只会添加后缀": "your next Desecration will add only suffix modifiers",
  "你的下一个作用于稀有或传奇物品的神圣石会圣化该物品, 词缀数值随机浮动 0.78~1.22 倍后无法再改造": "your next Divine Orb used on a Rare item will Sanctify it: each modifier is multiplied by 0.78~1.22 and the item can no longer be modified",
  "你的下一个神圣石只会重随固有词缀的数值": "your next Divine Orb will only reroll the values of implicit modifiers",
  "你的下一个机会石不会把物品变成魔法物品(至少为稀有)": "your next Orb of Chance will not downgrade the item to Magic (at least Rare)",
  "你达到低血状态时会完全回复药剂充能": "fully recover your flask charges when you reach Low Life",
  "你下一个卖给商人的物品会获得双倍通货": "the next item you sell to a vendor grants double currency",
  "你的下一次商人购买有 50% 几率免费, 免费时不消耗此预兆": "your next vendor purchase has a 50% chance to be free; this omen is not consumed when it is free",
  "你的下一个混沌石会重铸地图词缀, 且不会出现怪群/宝箱/裂隙类词缀": "your next Chaos Orb rerolls a Waystone without pack size / chest / rift modifiers",
  "你的下一个混沌石会重铸地图词缀, 且不会出现强化怪物的词缀": "your next Chaos Orb rerolls a Waystone without monster-buffing modifiers",
  "你的下一个混沌石会重铸地图词缀, 且不会出现削弱玩家的词缀": "your next Chaos Orb rerolls a Waystone without player-weakening modifiers",
  渎灵溺光: "Desecrated Drowned Light",
  渎灵低语: "Desecrated Whisper",
  渎灵虚空: "Desecrated Void",
  渎灵血肉: "Desecrated Flesh",
  渎灵喘息: "Desecrated Gasp",
  渎灵黑血: "Desecrated Black Blood",
  渎灵军团: "Desecrated Legion",
  渎灵跋涉: "Desecrated Trek",
  渎灵特克罗: "Desecrated Tecrod",
  渎灵回响: "Desecrated Echo",
  阿曼娜姆: "Amanamu",
  古加尔: "Kurgal",
  乌拉曼: "Ulaman",
  "击杀裂缝附近的怪物来关闭裂缝": "Kill monsters near the fissures to close them",
  "深渊巨坑开启": "The Abyssal Pit opens",
  "深渊巨坑关闭": "The Abyssal Pit closes",
  "深渊保险箱正在升起": "An Abyssal Trove is rising",
  "深渊的宝藏升起了": "The treasure of the Abyss has risen",
  "深渊的宝藏": "Treasure of the Abyss",
  "击杀附近怪物": "Kill nearby monsters",
  "生成深渊": "Spawn Abyss",
  "深渊裂缝已生成 · 靠近开启": "Abyssal Fissures spawned · approach to begin",
  "虚空溃散了": "The void has collapsed",
  "深渊裂缝关闭": "Abyssal fissure closed",
  腐烂: "Putrefaction"
});
Object.assign(F, {
  omen_exalt_p: {
    n: "左旋崇高预兆",
    s: "左旋崇高",
    v: 22,
    w: 0,
    ow: 42,
    mt: 1,
    og: "exaltside",
    grp: "omen",
    col: "#ffd050",
    d: "你的下一个崇高石只会添加前缀"
  },
  omen_exalt_s: {
    n: "右旋崇高预兆",
    s: "右旋崇高",
    v: 22,
    w: 0,
    ow: 42,
    mt: 1,
    og: "exaltside",
    grp: "omen",
    col: "#f0c040",
    d: "你的下一个崇高石只会添加后缀"
  },
  omen_exalt_2: {
    n: "强效崇高预兆",
    s: "强效崇高",
    v: 48,
    w: 0,
    ow: 14,
    mt: 1,
    og: "exaltcount",
    grp: "omen",
    col: "#ffe080",
    d: "你的下一个崇高石会添加两个随机词缀"
  },
  omen_special: {
    n: "异界高级预兆",
    s: "异界高级",
    v: 60,
    w: 0,
    ow: 6,
    mt: 14,
    og: "exaltop",
    grp: "omen",
    col: "#5fe0c0",
    d: "你的下一个通货只会改变特殊词缀栏的词缀（崇高/混沌/剥离/神圣可用）"
  },
  omen_whittle: {
    n: "消减预兆",
    s: "消减",
    v: 34,
    w: 0,
    ow: 18,
    mt: 12,
    og: "chaosop",
    grp: "omen",
    col: "#c8a050",
    d: "你的下一个混沌石会移除最低等级的词缀"
  },
  omen_annul_p: {
    n: "左旋剥离预兆",
    s: "左旋剥离",
    v: 26,
    w: 0,
    ow: 22,
    mt: 14,
    og: "annulside",
    grp: "omen",
    col: "#b08aff",
    d: "你的下一个剥离石只会移除前缀"
  },
  omen_annul_s: {
    n: "右旋剥离预兆",
    s: "右旋剥离",
    v: 26,
    w: 0,
    ow: 22,
    mt: 14,
    og: "annulside",
    grp: "omen",
    col: "#a07af0",
    d: "你的下一个剥离石只会移除后缀"
  },
  omen_chaos_p: {
    n: "左旋消抹预兆",
    s: "左旋消抹",
    v: 26,
    w: 0,
    ow: 22,
    mt: 14,
    og: "chaosop",
    grp: "omen",
    col: "#b89050",
    d: "你的下一个混沌石只会移除前缀"
  },
  omen_chaos_s: {
    n: "右旋消抹预兆",
    s: "右旋消抹",
    v: 26,
    w: 0,
    ow: 22,
    mt: 14,
    og: "chaosop",
    grp: "omen",
    col: "#a88048",
    d: "你的下一个混沌石只会移除后缀"
  },
  omen_ancient: {
    n: "远古预兆",
    s: "远古",
    v: 160,
    w: 0,
    ow: 6,
    mt: 1,
    og: "chance",
    grp: "omen",
    col: "#ff8a40",
    d: "你的下一个机会石会把普通物品升级为相同类别的随机传奇"
  },
  omen_resurgence: {
    n: "复苏预兆",
    s: "复苏",
    v: 16,
    w: 0,
    ow: 30,
    mt: 1,
    og: "worldRes",
    grp: "omen",
    col: "#80e0a0",
    d: "你达到低血状态时会完全回复生命、魔力和能量护盾"
  },
  omen_amelioration: {
    n: "进步预兆",
    s: "进步",
    v: 20,
    w: 0,
    ow: 24,
    mt: 1,
    og: "worldExp",
    grp: "omen",
    col: "#7ab8ff",
    d: "你被击败时防止 75% 的经验值损失"
  },
  omen_prayer: {
    n: "有求必应预兆",
    s: "有求必应",
    v: 24,
    w: 0,
    ow: 20,
    mt: 1,
    og: "worldShrine",
    grp: "omen",
    col: "#c8b0ff",
    d: "你点击的下一个神龛会提供一个额外效果"
  },
  omen_abyss_echo: {
    n: "深渊回响预兆",
    s: "深渊回响",
    v: 30,
    w: 0,
    ow: 12,
    mt: 1,
    og: "abyssChest",
    grp: "omen",
    col: "#7dff9a",
    d: "你下一次揭示渎灵词缀时可以重掷一次选项"
  },
  omen_abyss_light: {
    n: "光明预兆",
    s: "光明",
    v: 40,
    w: 0,
    ow: 9,
    mt: 1,
    og: "abyssLight",
    grp: "omen",
    col: "#d8ffe0",
    d: "你的下一个剥离石只会移除渎灵词缀"
  },
  omen_abyss_putrid: {
    n: "腐烂预兆",
    s: "腐烂",
    v: 26,
    w: 0,
    ow: 14,
    mt: 1,
    og: "abyssPit",
    grp: "omen",
    col: "#6aa050",
    d: "你的下一次渎灵会替换全部词缀, 生成最多 6 条渎灵词缀并腐化该装备"
  },
  omen_abyss_liege: {
    n: "领主预兆",
    s: "领主",
    v: 34,
    w: 0,
    ow: 8,
    mt: 1,
    og: "abyssPit",
    grp: "omen",
    col: "#b8ff60",
    d: "你的下一次渎灵必定出现阿曼娜姆的词缀"
  },
  omen_abyss_blackblood: {
    n: "黑血预兆",
    s: "黑血",
    v: 34,
    w: 0,
    ow: 8,
    mt: 1,
    og: "abyssPit",
    grp: "omen",
    col: "#7dd0a0",
    d: "你的下一次渎灵必定出现古加尔的词缀"
  },
  omen_abyss_sovereign: {
    n: "至高预兆",
    s: "至高",
    v: 34,
    w: 0,
    ow: 8,
    mt: 1,
    og: "abyssPit",
    grp: "omen",
    col: "#c8ffe0",
    d: "你的下一次渎灵必定出现乌拉曼的词缀"
  },
  omen_necro_p: {
    n: "左旋死灵预兆",
    s: "左旋死灵",
    v: 24,
    w: 0,
    ow: 10,
    mt: 1,
    og: "necro",
    grp: "omen",
    col: "#9dffb4",
    d: "你的下一次渎灵只会添加前缀"
  },
  omen_necro_s: {
    n: "右旋死灵预兆",
    s: "右旋死灵",
    v: 24,
    w: 0,
    ow: 10,
    mt: 1,
    og: "necro",
    grp: "omen",
    col: "#7dd0a0",
    d: "你的下一次渎灵只会添加后缀"
  },
  omen_sanctify: {
    n: "圣化预兆",
    s: "圣化",
    v: 60,
    w: 0,
    ow: 5,
    mt: 1,
    og: "divine",
    grp: "omen",
    col: "#ffe8b0",
    d: "你的下一个作用于稀有或传奇物品的神圣石会圣化该物品, 词缀数值随机浮动 0.78~1.22 倍后无法再改造"
  },
  omen_blessed: {
    n: "祝福预兆",
    s: "祝福",
    v: 50,
    w: 0,
    ow: 6,
    mt: 1,
    og: "divine",
    grp: "omen",
    col: "#fff2c0",
    d: "你的下一个神圣石只会重随固有词缀的数值"
  },
  omen_chance2: {
    n: "机遇预兆",
    s: "机遇",
    v: 30,
    w: 0,
    ow: 10,
    mt: 1,
    og: "chance",
    grp: "omen",
    col: "#e8e8c8",
    d: "你的下一个机会石不会把物品变成魔法物品(至少为稀有)"
  },
  omen_refresh: {
    n: "恢复预兆",
    s: "恢复",
    v: 15,
    w: 0,
    ow: 15,
    mt: 1,
    og: "worldFlask",
    grp: "omen",
    col: "#9ab8ff",
    d: "你达到低血状态时会完全回复药剂充能"
  },
  omen_barter: {
    n: "互换预兆",
    s: "互换",
    v: 20,
    w: 0,
    ow: 10,
    mt: 1,
    og: "worldTrade",
    grp: "omen",
    col: "#c8c090",
    d: "你下一个卖给商人的物品会获得双倍通货"
  },
  omen_gamble: {
    n: "强运预兆",
    s: "强运",
    v: 20,
    w: 0,
    ow: 10,
    mt: 1,
    og: "worldGamble",
    grp: "omen",
    col: "#d8c8a0",
    d: "你的下一次商人购买有 50% 几率免费, 免费时不消耗此预兆"
  },
  omen_chaos_quant: {
    n: "混沌数量预兆",
    s: "混沌数量",
    v: 18,
    w: 0,
    ow: 12,
    mt: 1,
    og: "mapQuant",
    grp: "omen",
    col: "#b8b060",
    d: "你的下一个混沌石会重铸地图词缀, 且不会出现怪群/宝箱/裂隙类词缀"
  },
  omen_chaos_mon: {
    n: "混沌怪物预兆",
    s: "混沌怪物",
    v: 18,
    w: 0,
    ow: 12,
    mt: 1,
    og: "mapMon",
    grp: "omen",
    col: "#b09060",
    d: "你的下一个混沌石会重铸地图词缀, 且不会出现强化怪物的词缀"
  },
  omen_chaos_rar: {
    n: "混沌稀有预兆",
    s: "混沌稀有",
    v: 18,
    w: 0,
    ow: 12,
    mt: 1,
    og: "mapPlayer",
    grp: "omen",
    col: "#c0a070",
    d: "你的下一个混沌石会重铸地图词缀, 且不会出现削弱玩家的词缀"
  },
  splinter: {
    n: "迷雾副本裂片",
    s: "拟像裂片",
    v: 2,
    w: 0,
    mt: 1,
    grp: "del",
    col: "#cfd8e8",
    d: "惊悸迷雾里析出的结晶残片 · 可在惊悸宝箱、迷雾怪物身上获得, 也可在商人处兑换"
  },
  bone_gnawed: {
    n: "啃噬遗存骨",
    s: "啃噬骨",
    v: 8,
    w: 0,
    ow: 30,
    mt: 1,
    grp: "bone",
    col: "#9a8a70",
    d: "对一件稀有装备渎灵: 添加 1 条未揭示的渎灵词缀, 在藏身处的灵魂之井揭示(3 选 1)。低阶骨, 词缀数值较低"
  },
  bone_preserved: {
    n: "遗存骨",
    s: "遗存骨",
    v: 30,
    w: 0,
    ow: 14,
    mt: 8,
    grp: "bone",
    col: "#c8b890",
    d: "对一件稀有装备渎灵: 添加 1 条未揭示的渎灵词缀, 在灵魂之井揭示(3 选 1)。中阶骨, 词缀数值较高"
  },
  bone_ancient: {
    n: "远古遗存骨",
    s: "远古骨",
    v: 90,
    w: 0,
    ow: 4,
    mt: 14,
    grp: "bone",
    col: "#efe0b0",
    d: "对一件稀有装备渎灵: 添加 1 条未揭示的渎灵词缀, 在灵魂之井揭示(3 选 1)。最高阶骨, 可出最高一档词缀"
  }
});
Object.assign(VS, {
  omen: "预兆",
  bone: "遗存骨",
  del: "碎片"
});
Object.assign(it, {
  abysswalker: {
    n: "深渊行者",
    hp: 11,
    dmg: 6,
    spd: 46,
    r: 4,
    atk: "melee",
    range: 7,
    cd: 1.05,
    xp: 5,
    el: "phys",
    spr: "abyssling",
    gib: ["#2a6a3a", "#7dff9a", "#0a2410"]
  },
  abyssshambler: {
    n: "深渊蹒跚者",
    hp: 20,
    dmg: 8,
    spd: 18,
    r: 5,
    atk: "ranged",
    range: 95,
    cd: 2.2,
    xp: 7,
    el: "phys",
    ps: 62,
    pc: "#7dff9a",
    spr: "abyssling",
    gib: ["#1e5a34", "#7dff9a", "#d8ffe0"]
  },
  abyssstrangler: {
    n: "深渊绞杀者",
    hp: 17,
    dmg: 9,
    spd: 34,
    r: 5,
    atk: "charge",
    range: 10,
    cd: 2.8,
    xp: 8,
    el: "phys",
    spr: "abyssling",
    gib: ["#2a6a3a", "#d8ffe0", "#0a2410"]
  }
});
Co.push({
  key: "deli",
  n: "迷雾副本",
  col: "#c8a8ff",
  vr: "叠加",
  d: "35 层迷雾副本的专精: 更多神圣石、裂片、遗存骨与持久亢奋",
  nodes: [{
    k: "deli1",
    n: "拟像亲和",
    d: "每层拟像首领额外 +1 神圣石"
  }, {
    k: "deli2",
    n: "亢奋共鸣",
    d: "完成 35 层拟像额外 +10% 持久亢奋"
  }, {
    k: "deli3",
    n: "裂片丰饶",
    d: "每层拟像首领额外 +2 裂片"
  }, {
    k: "deli4",
    n: "首领馈赠",
    d: "每层拟像首领再 +1 神圣石"
  }, {
    k: "deli5",
    n: "深层亢奋",
    d: "完成拟像再额外 +10% 持久亢奋"
  }, {
    k: "deli6",
    n: "遗骨馈赠",
    d: "每层拟像首领额外掉 1 个遗存骨"
  }, {
    k: "deli7",
    n: "终极馈赠",
    d: "最终首领额外 +10 神圣石",
    key: 1
  }]
}, {
  key: "rit",
  n: "驱灵仪式",
  col: "#d06a8a",
  vr: "稳定",
  d: "祭坛与恩典的专精: 更多祭坛、更便宜的恩典与额外预兆",
  nodes: [{
    k: "rit1",
    n: "祭坛共鸣",
    d: "每张地图额外出现 1 座驱灵祭坛"
  }, {
    k: "rit2",
    n: "贡品富集",
    d: "仪式贡品获取 +25%"
  }, {
    k: "rit3",
    n: "恩典余晖",
    d: "恩典额外出现 1 个预兆"
  }, {
    k: "rit4",
    n: "低语回响",
    d: "开坛所需吸收的怨灵 -1"
  }, {
    k: "rit5",
    n: "恩典折价",
    d: "恩典奖励价格 -15%"
  }, {
    k: "rit6",
    n: "免费重置",
    d: "每座祭坛第一次重置恩典免费"
  }, {
    k: "rit7",
    n: "仪式之主",
    d: "贡品再 +25%；祭坛有额外 15% 概率出现在首领房（双倍贡品）",
    key: 1
  }]
}, {
  key: "abyss",
  n: "深渊",
  col: "#4dff88",
  vr: "风险",
  d: "深渊与遗存骨的专精: 更频繁的深渊、更高的遗骨与保险箱收益",
  nodes: [{
    k: "aby1",
    n: "深渊之眼",
    d: "地图出现深渊的概率 +15%"
  }, {
    k: "aby2",
    n: "遗骨滋养",
    d: "深渊怪掉落遗存骨的概率翻倍"
  }, {
    k: "aby3",
    n: "保险箱增幅",
    d: "深渊保险箱额外掉出 2 个通货"
  }, {
    k: "aby4",
    n: "深渊预兆",
    d: "深渊怪掉落预兆的概率翻倍"
  }, {
    k: "aby5",
    n: "巫妖血脉",
    d: "巨坑出现巫妖血脉的概率 +20%"
  }, {
    k: "aby6",
    n: "裂隙速闭",
    d: "关闭深渊裂隙所需击杀 -1"
  }, {
    k: "aby7",
    n: "深渊宝藏",
    d: "保险箱传奇掉率 +25%",
    key: 1
  }]
});
Ln = 56;
op.push("bone_gnawed", "bone_preserved", "bone_ancient");
Object.assign(np, {
  bone_gnawed: "稀装渎灵 · 低阶骨",
  bone_preserved: "稀装渎灵 · 中阶骨",
  bone_ancient: "稀装渎灵 · 远古骨"
});
WT = new Set(["device", "vendor", "stash", "bench", "altar", "monument", "dog", "well", "ritual", "simulacrum"]);
Object.assign(wa, {
  ex: {
    from: "chaos",
    to: "divine",
    amt: 1
  }
});
kS = (_v1649, _v1650, _v1651, _v1652) => tp(_v1649).filter(_v1653 => _v1653.t === _v1650 && _v1653.lv[0] <= _v1649.ilvl && (!_v1653.slots || _v1653.slots.includes(_v1649.slot)) && Ol(_v1649, _v1653) && !_v1653.dsec && !_v1652.some(_v1654 => _v1654.id === _v1653.id) && (!_v1651 || _v1651.includes(_v1653.id)));
Aa = function () {
  if (De) {
    De.state === "suspended" && De.resume();
    return;
  }
  try {
    (De = new (window.AudioContext || window.webkitAudioContext)(), Tn = De.createGain(), Tn.gain.value = 0.28);
    let _v1655 = De.createDynamicsCompressor();
    (_v1655.threshold.value = -18, _v1655.knee.value = 12, _v1655.ratio.value = 3, _v1655.attack.value = 0.008, _v1655.release.value = 0.28);
    let _v1656 = De.createBiquadFilter(), _v1657 = De.createBiquadFilter(), _v1658 = De.createBiquadFilter(), _v1659 = De.createDynamicsCompressor();
    (_v1656.type = "peaking", _v1656.frequency.value = 240, _v1656.gain.value = 1.4, _v1656.Q.value = 0.7, _v1657.type = "highshelf", _v1657.frequency.value = 5200, _v1657.gain.value = -5.5, _v1658.type = "lowpass", _v1658.frequency.value = 13000, _v1658.Q.value = 0.4, _v1659.threshold.value = -3, _v1659.knee.value = 4, _v1659.ratio.value = 14, _v1659.attack.value = 0.002, _v1659.release.value = 0.12, Tn.connect(_v1656), _v1656.connect(_v1657), _v1657.connect(_v1658), _v1658.connect(_v1655), _v1655.connect(_v1659), _v1659.connect(De.destination), Uc = De.createGain(), Uc.connect(Tn), ur = De.createGain(), ur.gain.value = 0.6, ur.connect(Tn), Hc = De.createBuffer(1, De.sampleRate * 2 | 0, De.sampleRate));
    let _v1660 = Hc.getChannelData(0);
    for (let _v1661 = 0; _v1661 < _v1660.length; _v1661++) _v1660[_v1661] = j() * 2 - 1;
    ul = De.createConvolver();
    let _v1662 = De.sampleRate * 1.4 | 0, _v1663 = De.createBuffer(2, _v1662, De.sampleRate);
    for (let _v1664 = 0; _v1664 < 2; _v1664++) {
      let _v1665 = _v1663.getChannelData(_v1664);
      for (let _v1666 = 0; _v1666 < _v1662; _v1666++) _v1665[_v1666] = (j() * 2 - 1) * Math.pow(1 - _v1666 / _v1662, 3.2);
    }
    ul.buffer = _v1663;
    let _v1667 = De.createGain();
    (_v1667.gain.value = 0.35, ul.connect(_v1667), _v1667.connect(Tn));
    let _v1668 = De.createBufferSource();
    (_v1668.buffer = Hc, _v1668.loop = !0);
    let _v1669 = De.createBiquadFilter();
    (_v1669.type = "lowpass", _v1669.frequency.value = 300);
    let _v1670 = De.createGain();
    (_v1670.gain.value = 0.09, _v1668.connect(_v1669), _v1669.connect(_v1670), _v1670.connect(ur), _v1668.start());
  } catch {
    De = null;
  }
};
K = function (_v1671, _v1672, _v1673, _v1674, _v1675, _v1676, _v1677) {
  let _v1678 = De.createOscillator(), _v1679 = De.createGain();
  (_v1678.type = _v1671, _v1678.frequency.setValueAtTime(_v1672, _v1676), _v1673 && _v1678.frequency.exponentialRampToValueAtTime(Math.max(20, _v1673), _v1676 + _v1674), _v1679.gain.setValueAtTime(1e-4, _v1676), _v1679.gain.linearRampToValueAtTime(_v1675, _v1676 + 0.012), _v1679.gain.exponentialRampToValueAtTime(1e-4, _v1676 + Math.max(_v1674, 0.03)), _v1678.connect(_v1679), _v1679.connect(Uc), _v1677 && _v1679.connect(ul), _v1678.start(_v1676), _v1678.stop(_v1676 + _v1674 + 0.03));
};
ae = function (_v1680, _v1681, _v1682, _v1683, _v1684, _v1685, _v1686, _v1687) {
  let _v1688 = De.createBufferSource();
  _v1688.buffer = Hc;
  let _v1689 = De.createBiquadFilter();
  (_v1689.type = _v1682, _v1689.frequency.setValueAtTime(_v1683, _v1685), _v1684 && _v1689.frequency.exponentialRampToValueAtTime(_v1684, _v1685 + _v1680), _v1689.Q.value = _v1686 || 1);
  let _v1690 = De.createGain();
  (_v1690.gain.setValueAtTime(1e-4, _v1685), _v1690.gain.linearRampToValueAtTime(_v1681, _v1685 + 0.008), _v1690.gain.exponentialRampToValueAtTime(1e-4, _v1685 + Math.max(_v1680, 0.03)), _v1688.connect(_v1689), _v1689.connect(_v1690), _v1690.connect(Uc), _v1687 && _v1690.connect(ul), _v1688.start(_v1685, j() * 1.5), _v1688.stop(_v1685 + _v1680 + 0.03));
};
M = function (_v1691, _v1692 = 1) {
  if (o.muted) return;
  let _v1693 = _v1692 * 0.92, _v1694 = 1 + (j() - 0.5) * 0.035;
  const _v1695 = __uploadedSfxMap[_v1691];
  if (_v1695) {
    for (const _v1696 of _v1695) {
      const [_v1697, _v1698, _v1699, _v1700 = 0, _v1701 = 0] = _v1696;
      if (_v1700 > 0) setTimeout(() => {
        if (!o.muted) playAssetSfx(_v1697, Math.min(1, _v1698 * _v1693), _v1699 * _v1694, _v1701);
      }, _v1700); else playAssetSfx(_v1697, Math.min(1, _v1698 * _v1693), _v1699 * _v1694, _v1701);
    }
    return;
  }
  if (!De) return;
  let _v1702 = De.currentTime;
  if (!(rd[_v1691] && _v1702 - rd[_v1691] < 0.05)) {
    rd[_v1691] = _v1702;
    try {
      mr[_v1691](_v1702 + 0.006, _v1693);
    } catch {}
  }
};
gh = function (_v1703, _v1704, _v1705) {
  if (!De || o.muted) return;
  let _v1706 = De.currentTime;
  if (_v1703 === "light" && _v1706 - mh < 0.03) return;
  mh = _v1706;
  let _v1707 = _v1706 + 0.003, _v1708 = ({
    light: 0.4,
    mid: 0.7,
    heavy: 0.95,
    super: 1.1
  })[_v1703];
  try {
    (ae(0.025, 0.2 * _v1708, "highpass", 2400, 0, _v1707, 1), ae(0.05 + 0.05 * _v1708, 0.3 * _v1708, "bandpass", 650 + j() * 350, 280, _v1707, 1.6), _v1703 !== "light" && K("sine", 165 + j() * 35, 46, 0.1 + 0.14 * _v1708, 0.55 * _v1708, _v1707), _v1705 && (K("triangle", 1900 + j() * 300, 1200, 0.16, 0.07, _v1707), K("triangle", 2800, 1800, 0.12, 0.045, _v1707)), _v1704 === "fire" && ae(0.18, 0.12 * _v1708, "lowpass", 1400, 200, _v1707), _v1704 === "cold" && K("triangle", 2400, 1600, 0.15, 0.05 * _v1708, _v1707), _v1704 === "light" && K("square", 1100, 300, 0.07, 0.045 * _v1708, _v1707), (_v1703 === "heavy" || _v1703 === "super") && (ae(0.55 * _v1708, 0.28 * _v1708, "lowpass", 420, 60, _v1707 + 0.01, 1, !0), Bk(0.15, 0.35)));
  } catch {}
};
QS = function () {
  for (let _v1709 in Rt) Rt[_v1709].fr = zk.map((_v1710, _v1711) => xt("hero_" + _v1709 + _v1711, Rt[_v1709].rows.concat(Rt[_v1709].legs ? Rt[_v1709].legs[_v1711] : _v1710), {
    ...Rt[_v1709].pal
  }));
  (xt("zombie", ["....aaaa....", "...abbbba...", "...acbbca...", "...abbbba...", "...abddba...", "..aaabbaaa..", ".abeeeeeeba.", "ab.eeffee.ba", "b..eeeeee..b", "...eeeeee...", "...aeeeea...", "...ah..ha...", "...ah..ha...", "..aah..haa.."], {
    b: "#6f8a5a",
    c: "#d8f070",
    d: "#3a1414",
    e: "#4a4038",
    f: "#7a2020",
    h: "#3a3a2a"
  }), xt("skel", ["...aaaa....", "..abbbba...", "..acbbca...", "..abbbba..e", "...addda.e.", "..aabba..e.", ".ab.abba.e.", "ab.abbbabe.", "...abbba.e.", "...a.b.a..e", "....b.b....", "...ab.ba...", "...b...b...", "..bb...bb.."], {
    b: "#d8d0b8",
    c: "#ff4030",
    d: "#8a8070",
    e: "#9a6a32"
  }), xt("imp", uh, {
    b: "#c8401a",
    c: "#ffe060",
    d: "#401008",
    e: "#ff9a40"
  }), xt("riftling", uh, {
    b: "#6a3aa8",
    c: "#ff70ff",
    d: "#200838",
    e: "#b080ff"
  }), xt("abyssling", uh, {
    b: "#1e6a3a",
    c: "#7dff9a",
    d: "#06180c",
    e: "#3fd070"
  }), xt("cultist", ["....aa....", "...abba...", "..abbbba..", "..abccba..", "..acddca..", "..abccba..", "...abba...", "..aeeeea..", ".aeeffeea.", "gaeeffeeag", ".aeeffeea.", ".aeeeeeea.", ".aeeeeeea.", "aeeeeeeeea", "aaaaaaaaaa"], {
    b: "#2a4a6a",
    c: "#0c141c",
    d: "#80e8ff",
    e: "#3a5a7a",
    f: "#a8d0e8",
    g: "#c8f4ff"
  }), xt("brute", ["......aaaa......", ".....abbbba.....", "....abcbbcba....", "....abbbbbba....", "..aaabddddbaaa..", ".abbbbbbbbbbbba.", "abeeebbbbbbeeeba", "abeeebbffbbeeeba", "abbba.bbbb.abbba", ".aa...bbbb...aa.", ".....bggggb.....", ".....bb..bb.....", "....abb..bba....", "....aaa..aaa...."], {
    b: "#7a6a58",
    c: "#ff3020",
    d: "#e8e0c8",
    e: "#c8c0a8",
    f: "#5a4a3a",
    g: "#3a2a20"
  }), xt("boss", ["....a............a....", "...ab............ba...", "...abb..aaaaaa..bba...", "....abbabbbbbbabba....", ".....abbbbbbbbbba.....", "....abbcbbbbbbcbba....", "....abbbbbbbbbbbba....", ".....abbddddddbba.....", "...aaabbbbbbbbbbaaa...", "..abbbeeeeeeeeeebbba..", ".abbbeeeeffffeeeebbba.", ".abbaeeeffggffeeeabba.", ".abba.eeffggffee.abba.", ".abba.eeeffffeee.abba.", "..hh..eeeeeeeeee..hh..", "..hh...eeeeeeee...hh..", ".......aeeeeeea.......", "......abbb..bbba......", "......abb....bba......", ".....abbb....bbba.....", ".....aaaa....aaaa....."], {
    b: "#3a2a40",
    c: "#ff6020",
    d: "#ff9a40",
    e: "#5a4064",
    f: "#8a3050",
    g: "#ffd060",
    h: "#d8d0d0"
  }), xt("abysslich", ["....a............a....", "...ab............ba...", "...abb..aaaaaa..bba...", "....abbabbbbbbabba....", ".....abbbbbbbbbba.....", "....abbcbbbbbbcbba....", "....abbbbbbbbbbbba....", ".....abbddddddbba.....", "...aaabbbbbbbbbbaaa...", "..abbbeeeeeeeeeebbba..", ".abbbeeeeffffeeeebbba.", ".abbaeeeffggffeeeabba.", ".abba.eeffggffee.abba.", ".abba.eeeffffeee.abba.", "..hh..eeeeeeeeee..hh..", "..hh...eeeeeeee...hh..", ".......aeeeeeea.......", "......abbb..bbba......", "......abb....bba......", ".....abbb....bbba.....", ".....aaaa....aaaa....."], {
    b: "#123a22",
    c: "#b8ff60",
    d: "#7dff9a",
    e: "#1e5a34",
    f: "#2a7a46",
    g: "#d8ffe0",
    h: "#c8e8c0"
  }), xt("dummy", ["...aaaa...", "..abbbba..", "..abccba..", "..abbbba..", "aaaabbaaaa", "abbbbbbbba", "aaaabbaaaa", "...abba...", "...abba...", "...abba...", "...abba...", "..aaaaaa..", ".abbbbbba."], {
    b: "#8a6a42",
    c: "#c8a070"
  }), xt("box", [".aaaaaaaa.", "abbbbbbbba", "acccddccca", "abbbddbbba", "abbbbbbbba", "acccccccca", "abbbbbbbba", "aaaaaaaaaa"], {
    b: "#6a4a2a",
    c: "#b08a3a",
    d: "#ffd060"
  }));
  for (let _v1712 of ["zombie", "skel", "imp", "cultist", "brute", "boss", "dummy"]) it[_v1712].h = zt[_v1712].h;
  it.rift.h = zt.riftling.h;
  (it.abysswalker.h = zt.abyssling.h, it.abyssshambler.h = Math.round(zt.abyssling.h * 1.05), it.abyssstrangler.h = Math.round(zt.abyssling.h * 1.2));
  for (let _v1713 in hh) {
    let _v1714 = pi(hh[_v1713], {
      a: "#14101a",
      ...Ok[_v1713]
    });
    (Ya[_v1713] = _v1714, wt[_v1713] = _v1714.toDataURL());
  }
  for (let _v1715 of rt) {
    let _v1716 = document.createElement("canvas");
    (_v1716.width = 9, _v1716.height = 9);
    let _v1717 = _v1716.getContext("2d"), _v1718 = F[_v1715].col, _v1719 = (_v1720, _v1721, _v1722) => {
      (_v1717.fillStyle = _v1722, _v1717.fillRect(_v1720, _v1721, 1, 1));
    };
    for (let _v1723 = 0; _v1723 < 9; _v1723++) for (let _v1724 = 0; _v1724 < 9; _v1724++) {
      let _v1725 = Math.hypot(_v1724 - 4, _v1723 - 4);
      _v1725 <= 4.2 && _v1719(_v1724, _v1723, _v1725 > 3.4 ? "#120e14" : _v1718);
    }
    (_v1719(3, 2, "#ffffffcc"), _v1719(2, 3, "#ffffff88"), _v1715 === "chaos" && (_v1719(4, 4, "#3a2a10"), _v1719(5, 4, "#3a2a10"), _v1719(4, 5, "#3a2a10")), _v1715 === "divine" && (_v1717.fillStyle = "#d8b050", _v1717.fillRect(4, 1, 1, 7), _v1717.fillRect(1, 4, 7, 1), _v1719(4, 4, "#fff")), _v1715 === "exalt" && (_v1717.fillStyle = "#b89040", _v1717.fillRect(2, 5, 5, 1), _v1719(1, 4, "#b89040"), _v1719(7, 4, "#b89040")), _v1715 === "jewel" && (_v1719(5, 5, "#ffffff"), _v1719(4, 6, "#1a7a60")), _v1715 === "ember" && (_v1719(4, 2, "#ffe080"), _v1719(3, 3, "#ffb040"), _v1719(4, 3, "#fff2c0"), _v1719(5, 3, "#ffb040"), _v1719(3, 5, "#7a1406"), _v1719(4, 5, "#2a0602"), _v1719(5, 5, "#7a1406"), _v1719(4, 6, "#7a1406"), _v1719(2, 4, "#ff9a50"), _v1719(6, 4, "#c83010")), _v1715 === "ash" && (_v1719(2, 2, "#120e14"), _v1719(6, 6, "#120e14"), _v1719(6, 2, "#120e14"), _v1719(3, 4, "#5a504c"), _v1719(5, 3, "#5a504c"), _v1719(4, 6, "#5a504c"), _v1719(6, 5, "#b0a49c"), _v1719(4, 4, "#ff6a24"), _v1719(5, 5, "#a02a10")), _v1715 === "frac" && (_v1719(3, 3, "#4a2410"), _v1719(4, 4, "#4a2410"), _v1719(4, 5, "#4a2410"), _v1719(5, 6, "#4a2410"), _v1719(5, 3, "#4a2410"), _v1719(6, 2, "#4a2410"), _v1719(5, 4, "#ffe2b0")), _v1715 === "chance" && (_v1719(5, 5, "#404040"), _v1719(4, 4, "#404040")), _v1715.startsWith("omen_") && (_v1719(4, 2, "#fff0d0"), _v1719(3, 4, "#e0c070"), _v1719(5, 4, "#e0c070"), _v1719(4, 6, "#8a5ac0"), _v1719(4, 4, "#2a1030")), hr[_v1715] = _v1716, He[_v1715] = _v1716.toDataURL());
  }
  (function () {
    let _v1726 = _v1727 => {
      let _v1728 = document.createElement("canvas");
      (_v1728.width = 16, _v1728.height = 16);
      let _v1729 = _v1728.getContext("2d");
      return (_v1729.fillStyle = "#0d0b10", _v1729.fillRect(0, 0, 16, 16), _v1727((_v1730, _v1731, _v1732) => {
        _v1730 >= 0 && _v1731 >= 0 && _v1730 < 16 && _v1731 < 16 && (_v1729.fillStyle = _v1732, _v1729.fillRect(_v1730, _v1731, 1, 1));
      }), _v1728.toDataURL());
    }, _v1733 = (_v1734, _v1735, _v1736, _v1737, _v1738) => {
      for (let _v1739 = -_v1737; _v1739 <= _v1737; _v1739++) for (let _v1740 = -_v1737; _v1740 <= _v1737; _v1740++) _v1740 * _v1740 + _v1739 * _v1739 <= _v1737 * _v1737 + 0.5 && _v1734(_v1735 + _v1740, _v1736 + _v1739, _v1738);
    }, _v1741 = (_v1742, _v1743, _v1744, _v1745, _v1746, _v1747) => {
      let _v1748 = Math.max(Math.abs(_v1745 - _v1743), Math.abs(_v1746 - _v1744)) || 1;
      for (let _v1749 = 0; _v1749 <= _v1748; _v1749++) _v1742(Math.round(_v1743 + (_v1745 - _v1743) * _v1749 / _v1748), Math.round(_v1744 + (_v1746 - _v1744) * _v1749 / _v1748), _v1747);
    }, _v1750 = (_v1751, _v1752, _v1753, _v1754, _v1755, _v1756, _v1757) => {
      for (let _v1758 = _v1755; _v1758 <= _v1756; _v1758 += 0.06) _v1751(Math.round(_v1752 + Math.cos(_v1758) * _v1754), Math.round(_v1753 + Math.sin(_v1758) * _v1754), _v1757);
    }, _v1759 = (_v1760, _v1761, _v1762, _v1763, _v1764, _v1765, _v1766) => {
      (_v1741(_v1760, _v1761, _v1762, _v1763, _v1764, _v1765), _v1760(_v1763, _v1764, _v1766), _v1760(_v1763 - 1, _v1764, _v1766), _v1760(_v1763, _v1764 + 1, _v1766));
    };
    (D.fireball = _v1726(_v1767 => {
      for (let _v1768 = 0; _v1768 < 6; _v1768++) _v1733(_v1767, 3 + _v1768, 3 + _v1768, 1, _v1768 < 3 ? "#7a2a10" : "#c8401a");
      (_v1733(_v1767, 10, 10, 4, "#e86a20"), _v1733(_v1767, 10, 10, 2, "#ffd060"), _v1767(9, 9, "#fff"));
    }), D.icespear = _v1726(_v1769 => {
      for (let _v1770 = 0; _v1770 < 12; _v1770++) (_v1769(2 + _v1770, 13 - _v1770, "#9fe8ff"), _v1769(3 + _v1770, 13 - _v1770, "#4a8ab8"));
      (_v1769(14, 1, "#fff"), _v1769(13, 2, "#fff"));
    }), D.arc = _v1726(_v1771 => {
      let _v1772 = [[2, 2], [6, 5], [4, 8], [9, 10], [7, 13], [13, 14]];
      for (let _v1773 = 0; _v1773 < _v1772.length - 1; _v1773++) _v1741(_v1771, _v1772[_v1773][0], _v1772[_v1773][1], _v1772[_v1773 + 1][0], _v1772[_v1773 + 1][1], "#a8b4ff");
    }), D.nova = _v1726(_v1774 => {
      for (let _v1775 = 0; _v1775 < 16; _v1775++) for (let _v1776 = 0; _v1776 < 16; _v1776++) {
        let _v1777 = Math.hypot(_v1776 - 7.5, _v1775 - 7.5);
        _v1777 > 5.2 && _v1777 < 6.8 ? _v1774(_v1776, _v1775, "#8ad8ff") : _v1777 > 3.8 && _v1777 < 5.2 && (_v1776 + _v1775) % 2 && _v1774(_v1776, _v1775, "#3a6a9a");
      }
      _v1733(_v1774, 8, 8, 1, "#e8fbff");
    }), D.meteor = _v1726(_v1778 => {
      for (let _v1779 = 0; _v1779 < 7; _v1779++) (_v1778(13 - _v1779, 2 + _v1779, "#e86a20"), _v1778(14 - _v1779, 2 + _v1779, "#ffb040"));
      (_v1733(_v1778, 6, 10, 3, "#6a4a3a"), _v1733(_v1778, 6, 10, 1, "#ff8a30"));
    }), D.cyclone = _v1726(_v1780 => {
      for (let _v1781 = 0; _v1781 < 6.2; _v1781 += 0.12) {
        let _v1782 = 1 + _v1781 * 1.05;
        _v1780(Math.round(8 + Math.cos(_v1781 * 1.6) * _v1782), Math.round(8 + Math.sin(_v1781 * 1.6) * _v1782), _v1781 > 4 ? "#e8e2d8" : "#8a8490");
      }
      _v1733(_v1780, 8, 8, 1, "#c8402a");
    }), D.larrow = _v1726(_v1783 => {
      (_v1759(_v1783, 2, 13, 13, 2, "#c8a040", "#fff"), _v1741(_v1783, 9, 3, 11, 6, "#a8b4ff"), _v1741(_v1783, 11, 6, 9, 8, "#a8b4ff"), _v1741(_v1783, 12, 9, 14, 11, "#a8b4ff"));
    }), D.iceshot = _v1726(_v1784 => {
      _v1759(_v1784, 2, 13, 13, 2, "#5a8ab8", "#e8fbff");
      for (let _v1785 = 0; _v1785 < 5; _v1785++) (_v1784(10 + _v1785 % 3, 6 + _v1785, "#9fe8ff"), _v1784(6 + _v1785, 10 + _v1785 % 2, "#9fe8ff"));
    }), D.rain = _v1726(_v1786 => {
      for (let _v1787 = 0; _v1787 < 5; _v1787++) {
        let _v1788 = 2 + _v1787 * 3, _v1789 = 1 + _v1787 % 2 * 3;
        (_v1741(_v1786, _v1788, _v1789, _v1788 + 1, _v1789 + 6, "#c8b890"), _v1786(_v1788 + 1, _v1789 + 7, "#fff"));
      }
      _v1741(_v1786, 0, 14, 15, 14, "#5a4a3a");
    }), D.javelin = _v1726(_v1790 => {
      (_v1741(_v1790, 1, 14, 12, 3, "#c8a040"), _v1741(_v1790, 12, 3, 14, 1, "#fff"), _v1741(_v1790, 8, 2, 10, 5, "#a8b4ff"), _v1741(_v1790, 13, 6, 11, 8, "#a8b4ff"));
    }), D.thrust = _v1726(_v1791 => {
      (_v1741(_v1791, 1, 8, 12, 8, "#9aa4b0"), _v1741(_v1791, 12, 8, 15, 8, "#fff"), _v1791(13, 7, "#fff"), _v1791(13, 9, "#fff"));
      for (let _v1792 = 0; _v1792 < 3; _v1792++) _v1741(_v1791, 2, 4 + _v1792 * 4, 6, 4 + _v1792 * 4, "#5a5060");
    }), D.whirl = _v1726(_v1793 => {
      (_v1750(_v1793, 8, 8, 6, 0, 5.5, "#e0c080"), _v1750(_v1793, 8, 8, 4, 2, 6.2, "#8a7050"), _v1741(_v1793, 8, 8, 14, 8, "#e8eef4"));
    }), D.flurry = _v1726(_v1794 => {
      for (let _v1795 = 0; _v1795 < 3; _v1795++) _v1750(_v1794, 4 + _v1795 * 3, 10, 4, -2.2, -0.6, "#e8e2d8");
      (_v1741(_v1794, 12, 1, 10, 5, "#a8b4ff"), _v1741(_v1794, 10, 5, 12, 6, "#a8b4ff"), _v1741(_v1794, 12, 6, 10, 10, "#a8b4ff"));
    }), D.thunder = _v1726(_v1796 => {
      (_v1741(_v1796, 8, 0, 6, 5, "#a8b4ff"), _v1741(_v1796, 6, 5, 9, 7, "#a8b4ff"), _v1741(_v1796, 9, 7, 7, 11, "#a8b4ff"));
      for (let _v1797 = 1; _v1797 < 15; _v1797++) _v1796(_v1797, 13 + (_v1797 % 3 ? 0 : -1), "#c8a040");
      _v1750(_v1796, 8, 13, 6, 3.4, 6, "#dfe6ff");
    }), D.glacial = _v1726(_v1798 => {
      for (let _v1799 = 0; _v1799 < 4; _v1799++) {
        let _v1800 = 2 + _v1799 * 4, _v1801 = 4 + _v1799 * 2;
        (_v1741(_v1798, _v1800, 14, _v1800 + 1, 14 - _v1801, "#9fe8ff"), _v1798(_v1800 + 1, 14 - _v1801, "#fff"), _v1741(_v1798, _v1800 + 1, 14, _v1800 + 2, 15 - _v1801, "#5a8ab8"));
      }
    }), D.tsubame = _v1726(_v1802 => {
      (_v1750(_v1802, 8, 9, 6, -2.6, -0.2, "#ffffff"), _v1750(_v1802, 8, 7, 5, 0.4, 2.8, "#f08090"), _v1802(8, 8, "#c03030"));
    }), D.iai = _v1726(_v1803 => {
      (_v1741(_v1803, 0, 8, 15, 8, "#ffffff"), _v1741(_v1803, 0, 9, 15, 9, "#7a7a8a"), _v1741(_v1803, 3, 12, 8, 11, "#c03030"), _v1741(_v1803, 8, 11, 13, 10, "#e8eef4"));
    }), D.windblade = _v1726(_v1804 => {
      for (let _v1805 = 0; _v1805 < 3; _v1805++) _v1750(_v1804, 5 + _v1805 * 1, 8, 4 + _v1805 * 2, -0.9, 0.9, _v1805 === 1 ? "#ffffff" : "#a8c8d0");
    }));
  })();
};
Le = function (_v1806, _v1807, _v1808, _v1809, _v1810, _v1811, _v1812 = {}) {
  let _v1813 = {
    id: _v1806,
    t: _v1807,
    slots: _v1808,
    text: _v1809,
    stat: _v1810,
    ranges: _v1811,
    w: _v1812.w || 100,
    lv: _v1812.lv || Jk,
    div: _v1812.div || 1,
    nm: _v1812.nm || "",
    dsec: !!_v1812.dsec,
    fac: _v1812.fac || null,
    pair: Array.isArray(_v1811[0][0])
  };
  (Yt[_v1806] = _v1813, ml.push(_v1813));
};
ty = function () {
  AtlasEnsure();
  let _v1814 = AtlasAvailable(), _v1815 = tr(), _v1816 = Object.keys(h.done || ({})).length;
  let _v1817 = (_v1818, _v1819) => {
    let _v1820 = Co.find(_v1821 => _v1821.key === _v1818), _v1822 = _v1820 ? _v1820.col : "#c8c8c8";
    let _v1823 = ATLAS_BRANCH_TOTAL[_v1818] || 0;
    let _v1824 = (h.atlas || []).filter(_v1825 => AtlasNode(_v1825) && AtlasNode(_v1825).b === _v1818).length;
    let _v1826 = _v1823 ? Math.round(_v1824 / _v1823 * 100) : 0;
    return `<div style="display:flex;align-items:center;gap:8px;margin:3px 0"><b style="width:58px;color:${_v1822}">${_v1820 ? _v1820.n : _v1819}</b><div style="flex:1;height:8px;background:#1a1620;border:1px solid #2e2834"><div style="width:${_v1826}%;height:100%;background:${_v1822}"></div></div><span class="dim" style="width:60px;text-align:right">${_v1824}/${_v1823}</span></div>`;
  };
  let _v1827 = ATLAS_MAIN_BRANCHES.map(_v1828 => _v1817(_v1828)).join("") + '<div class="dim" style="margin:8px 0 2px">交叉捷径</div>' + ATLAS_SHORTCUTS.map(_v1829 => _v1817(_v1829)).join("");
  let _v1830 = Co.map(_v1831 => {
    let _v1832 = ATLAS_ALL.filter(_v1833 => _v1833.b === _v1831.key);
    return `<div class="acol" style="--ac:${_v1831.col}"><div class="ahd"><b style="color:${_v1831.col}">${_v1831.n} <small>${_v1832.length} 节点</small></b><p>${_v1831.d}</p></div>${_v1832.map(_v1834 => `<div class="anode${_v1834.tier === "keystone" ? " key" : ""}${AtlasCountAlloc(_v1834.k) ? " on" : ""}" style="cursor:default"><b>${_v1834.n}${_v1834.tier === "keystone" ? " ◆" : _v1834.tier === "sig" ? " ★" : ""}</b><span>${_v1834.d}</span></div>`).join("")}</div>`;
  }).join("");
  let _v1835 = `<div class="favor"><span class="lab">偏好主题 · 掉落的地图有 50% 是该主题</span>${["", ...ns].map(_v1836 => `<button class="btn small${(h.favor || "") === _v1836 ? " primary" : ""}" data-act="favor" data-t="${_v1836}" ${_v1836 ? `style="border-color:${tt[_v1836].col}"` : ""}>${_v1836 ? Wt[_v1836].names[0].slice(0, 2) + " · " + it[tt[_v1836].boss].n : "不偏好"}</button>`).join("")}</div>`;
  let _v1837 = `<section class="card" style="margin-top:10px"><h3>异界机制 <small>惊悸迷雾 · 驱灵仪式 · 深渊</small></h3><div class="bgrid"><div class="bcard" style="--uc:#cfd8e8"><b>迷雾副本</b><small>35 层 · 每 5 个房间一张图 · 神圣石 · 亢奋</small><p>持久亢奋 <b>${h.delirium || 0}%</b> · 拟像通关 <b>${h.simRuns || 0}</b></p><p class="dim">藏身处进入; 每层首领掉 3 神圣石, 最终首领 ×5 血掉 20; 每完成 20 层 +1 图谱点。</p></div><div class="bcard" style="--uc:#d06a8a"><b>驱灵仪式</b><small>祭坛 · 贡品 · 恩典</small><p>已完成仪式 <b>${h.ritualDone || 0}</b></p><p class="dim">每图 3 座祭坛; 圈内击杀吸收怨灵, 分波复活; 恩典必出具体预兆。</p></div><div class="bcard" style="--uc:#4dff88"><b>深渊</b><small>裂隙 · 巨坑 · 保险箱</small><p>已开启深渊保险箱 <b>${h.abyssDone || 0}</b></p><p class="dim">深渊怪掉落遗存骨; 巫妖血脉稀有怪必掉骨与预兆; 关闭巨坑后升起保险箱。</p></div></div></section>`;
  return `<div class="at"><div class="ahead card"><div><span class="lab">可用点数</span><b class="big" style="color:#8f9cff">${_v1814}</b><span class="dim"> · 已获得 ${AtlasEarned()} / ${Ln} · 已分配 ${AtlasUsed()} / ${ATLAS_SPEND}</span></div><div><span class="lab">当前专精路线</span><b class="big" style="color:${bc(_v1815)}">${gc(_v1815)}</b></div><div><span class="lab">图谱完成度</span><b class="big">${_v1816}</b><span class="dim"> / 68</span></div><div class="dim" style="max-width:560px">异界天赋树：点节点需先点亮前置；<b>显著节点（★）</b>还要求同分支已点 ≥2 个小节点；<b>关键节点（◆）</b>两两互斥且花费 2 点。点数来自图谱完成度、异界玩法首通、拟像层数与首领首杀；可获取上限 ${Ln}，本期可分配 ${ATLAS_SPEND}，必须取舍。</div><button class="btn small" data-atlas-act="reset">重置全树（神圣石 ×1）</button> <button class="btn small" data-atlas-act="respec">退还单点（混沌石 ×${AtlasRespecCost()}）</button></div>
		 <section class="card" style="margin-top:10px">${_v1835}</section>
 <section class="card" style="margin-top:10px"><h3>异界天赋树 <small>拖动平移 · 滚轮缩放 · 左键点亮/退还 · 右键看前置链</small></h3><div style="display:grid;grid-template-columns:1fr 240px;gap:10px;align-items:start"><div id="atlasWrap" style="position:relative;min-width:0"><canvas id="atlascv" style="width:100%;height:540px;display:block;background:#0b0a10;border:1px solid #2e2834;cursor:grab;touch-action:none"></canvas><div id="atlasTip" style="display:none;position:absolute;z-index:30;max-width:280px;padding:6px 8px;background:rgba(12,10,16,.96);border:1px solid #4a4058;color:#d8d0c0;font-size:11.5px;line-height:1.5;pointer-events:none;border-radius:3px"></div><div class="dim" style="margin-top:4px">★ 显著节点（同分支 ≥2 小节点） · ◆ 关键节点（2 点，互斥） · 圆点=普通节点</div></div><div>${_v1827}<div class="sep"></div><div class="dim" style="font-size:11px">洗点：点击已点亮节点（混沌石 ×${AtlasRespecCost()}）；重置全树神圣石 ×1。老存档图谱会自动补齐前置。</div></div></div></section>
		
 <details class="card" style="margin-top:10px"><summary style="cursor:pointer;font-weight:700">节点图鉴 · 全部 ${ATLAS_ALL.length} 个节点（含 6 条主分支与 2 条捷径）</summary><div class="acols" style="margin-top:8px">${_v1830}</div></details>
		 ${_v1837}<section class="card" style="margin-top:10px">${ru() || '<p class="dim">还没有按路线记录的地图。</p>'}</section></div>`;
};
IT = function () {
  let _v1838 = (_v1839, _v1840, _v1841) => `<button class="btn small" data-act="dbg" data-k="${_v1839}" title="${_v1841 || ""}">${_v1840}</button>`, _v1842 = o.Z && o.Z.type === "map";
  return `<div class="dbg"><section class="card"><h3>调试模式 <small>F9 开关此页</small></h3><p class="dim">所有功能都可以反复点。地图内功能需要先进入地图。</p>
		 <div class="dsec">角色</div><div class="dbtns">${_v1838("grant", "全部宝石 + 通货 + 点数", "所有主动宝石 20 级 5 孔, 每种辅助 2 颗, 全部精魂与元技能宝石, 通货至少 99, 天赋 +120, 升华 8 点, 图谱点满")}${_v1838("god", h.god ? "无敌: 开" : "无敌: 关")}${_v1838("lv10", "等级 +10")}${_v1838("lv60", "直升 60 级")}${_v1838("sock", "所有主动宝石 5 孔 20 级")}${_v1838("cur999", "全部通货 999999")}${_v1838("trial", "完成全部升华试炼")}${_v1838("atlas", "图谱点满")}${_v1838("cdr", "重置冷却与资源")}${_v1838("charges", "充能满 + 怒火 30")}${_v1838("metafull", "元技能能量满")}${_v1838("perf", "性能面板 (F8)")}</div>
		 <div class="dsec">满配测试 <small>60 级 · 宝石连好 · 升华与天赋点好 · 顶级稀有装 + 流派传奇 · 直接去试手感</small></div><div class="dbtns">${es.filter(_v1843 => _v1843.cls === h.cls).map(_v1844 => `<button class="btn small primary" data-act="testRig" data-n="${_v1844.n}">满配: ${_v1844.n}</button>`).join("")}</div>
		 <div class="dsec">流派</div><div class="dbtns">${es.filter(_v1845 => _v1845.cls === h.cls).map(_v1846 => `<button class="btn small" data-act="buildApply" data-n="${_v1846.n}">只套宝石: ${_v1846.n}</button>`).join("")}</div>
		 <div class="dsec">物品</div><div class="dbtns">${_v1838("rares", "10 件稀有装备")}${_v1838("offs", "全部副手与腰带")}${_v1838("uniqs", "全部传奇(计入图鉴)")}${_v1838("maps", "T1–T17 地图各 1")}${_v1838("mapsR", "5 张稀有 T16 地图")}${_v1838("ess", "精华与符文 ×20")}${_v1838("sigils", "四种首领印记 ×1")}${_v1838("souls", "全部兽魂(稀有)")}${_v1838("omens", "全部预兆 ×5")}${_v1838("pet", "千烬灵狐(宠物)")}${_v1838("pinlv", "裂隙之心等级 +1")}</div>
		 <div class="dsec">地图内 ${_v1842 ? "" : '<small class="neg">· 当前不在地图</small>'}</div><div class="dbtns">${_v1838("clear", "清屏")}${_v1838("boss", "召唤本图主题首领")}${_v1838("enc", "生成本图主题遭遇")}${_v1838("rift", "生成裂隙")}${_v1838("abyss", "生成深渊")}${_v1838("shrine", "生成神龛")}${_v1838("box", "生成宝箱")}${_v1838("pack", "召唤稀有怪群")}${_v1838("crystal", "冰晶柱 ×3")}${_v1838("rain", "通货雨")}${_v1838("divine", "掉一个神圣石")}${_v1838("ape", "召唤焚拳猿王")}${_v1838("stress", "压力测试 +150 怪")}</div>
		 <div class="dsec">直达首领</div><div class="dbtns">${ns.map(_v1847 => `<button class="btn small" data-act="dbg" data-k="go_${_v1847}">T10 ${Wt[_v1847].names[0]} · ${it[tt[_v1847].boss].n}</button>`).join("")}<button class="btn small" data-act="dbg" data-k="go_pin">裂隙之心 · 虚空之主</button></div></section>
		 <section class="card"><h3>说明</h3><p class="dim">推荐流程: 先"全部宝石 + 通货 + 点数", 再"套用"一个流派, 去木桩看机制辅助与元技能能量条; 用"直达首领"测试四位主题首领的机制; 拿到印记后挑战裂隙之心。</p><p class="dim">上方职业条可以随时切换职业: 每个职业一个调试栏位, 切换前自动保存当前角色。<b>万能工匠台</b>可对任意装备增删改词条; <b>地图工坊</b>可开 2–8 倍密度的割草图。</p></section></div>`;
};
a4 = function (_v1848, _v1849) {
  return {
    x: _v1848,
    y: _v1849,
    r: 4,
    hp: o.S.maxLife,
    mana: o.S.maxMana,
    es: o.S.maxES,
    face: 1,
    act: null,
    combo: {},
    chanT: 0,
    coneAng: 0,
    ammo: {},
    reloadT: {},
    recoilT: 0,
    jz: 0,
    exert: null,
    slamN: 0,
    fowT: 0,
    scourCd: 0,
    surgeT: 0,
    manaSpent: 0,
    ward: 0,
    wardT: 0,
    wardMax: 0,
    tempo: {},
    cstaffT: 0,
    cstaffN: 0,
    cstaffHits: 0,
    roll: 0,
    rollT0: -9,
    rollCd: 0,
    rvx: 0,
    rvy: 0,
    rollHit: new Set(),
    iframe: 0,
    eoT: 0,
    hurtT: 0,
    stagT: 0,
    channel: -1,
    cycT: 0,
    spin: 0,
    esDelay: 0,
    moving: !1,
    moveT: 0,
    stillT: 0,
    reflect: 0,
    healT: 0,
    healRate: 0,
    trailT: 0,
    nmT: 0,
    dead: !1,
    smears: [],
    idleAtk: 9,
    lastAtk: -9,
    pdT: 0,
    critNextT: 0,
    pdCd: 0,
    tailT: 0,
    rangerT: 0,
    markT: 0,
    overT: 0,
    drunkT: 0,
    kishinT: 0,
    focus: 0,
    focusAcc: 0,
    mom: 0,
    momT: 0,
    kills: 0,
    killT: 0,
    killDecay: 0,
    demon: 0,
    demonT: 0,
    hitN: 0,
    undyCd: 0,
    scorT: 0,
    wAng: 0,
    cds: {},
    ki: 0,
    salvo: 0,
    salvoT: 0,
    parryT: 0,
    noutouT: 0,
    drT: 0,
    disT: 0,
    waveT: 0,
    parryBuffT: 0,
    shrine: null,
    shrineT: 0,
    shrine2: null,
    shrineT2: 0,
    ruth: {},
    sinceHit: 9,
    pch: 0,
    fch: 0,
    chT: 0,
    rage: 0,
    rageT: 0,
    seals: {},
    sealT: {},
    clone: null,
    shockT: 0,
    shockAmt: 0,
    metaCd: {},
    gasT: 0,
    bogT: 0
  };
};
Vi = function (_v1850, _v1851, _v1852, _v1853 = {}) {
  o.del && DeliriumEnd();
  t4();
  let _v1854 = e4(_v1850, _v1852);
  o.Z = {
    type: _v1851,
    M: _v1850,
    th: _v1852,
    img: _v1854.c,
    lights: _v1854.lights,
    lvl: _v1853.lvl || 1,
    tier: _v1853.tier || 0,
    ms: _v1853.ms || qs(null),
    quant: 0,
    flow: new Int16Array(_v1850.W * _v1850.H).fill(-1),
    q: new Int32Array(_v1850.W * _v1850.H),
    flowT: 0,
    revT: 0,
    explored: new Uint8Array(_v1850.W * _v1850.H),
    mini: null,
    boss: null,
    done: !1,
    map: _v1853.map || null
  };
  let _v1855 = document.createElement("canvas");
  (_v1855.width = _v1850.W, _v1855.height = _v1850.H, o.Z.mini = _v1855);
  let _v1856 = _v1850.rooms[0];
  (o.pl = a4((_v1856.cx + 0.5) * N, (_v1856.cy + 0.5) * N), o.omTrig = !1, Ta.x = o.pl.x - ys / 2, Ta.y = o.pl.y - vs / 2);
};
Zr = function () {
  let _v1857 = Xw();
  (Vi(_v1857, "hideout", Wt.hideout, {
    lvl: 1
  }), o.pl.x = 15 * N + 8, o.pl.y = 13 * N, o.objs.push({
    kind: "device",
    x: 15 * N,
    y: 6 * N + 8,
    r: 16
  }), o.objs.push({
    kind: "vendor",
    x: 9 * N,
    y: 6 * N + 4,
    r: 14
  }), o.Z.lights.push({
    x: 9 * N + 10,
    y: 6 * N - 16,
    r: 70,
    c: "#ffb050",
    i: 0.8,
    torch: 1
  }), o.objs.push({
    kind: "stash",
    x: 20 * N + 8,
    y: 6 * N + 6,
    r: 12
  }), o.objs.push({
    kind: "bench",
    x: 11 * N,
    y: 11 * N,
    r: 16
  }), o.Z.lights.push({
    x: 11 * N - 2,
    y: 11 * N - 20,
    r: 60,
    c: "#ff8a3a",
    i: 0.38,
    torch: 1
  }), o.objs.push({
    kind: "altar",
    x: 19 * N,
    y: 11 * N,
    r: 14
  }), o.objs.push({
    kind: "well",
    x: 23 * N,
    y: 14 * N,
    r: 14
  }), o.objs.push({
    kind: "simulacrum",
    x: 27 * N,
    y: 11 * N,
    r: 14
  }), o.Z.lights.push({
    x: 23 * N,
    y: 14 * N - 12,
    r: 55,
    c: "#7dff9a",
    i: 0.6
  }), o.Z.lights.push({
    x: 27 * N,
    y: 11 * N - 12,
    r: 55,
    c: "#b48cff",
    i: 0.7
  }), o.Z.lights.push({
    x: 19 * N,
    y: 11 * N - 22,
    r: 58,
    c: "#ff4a20",
    i: 0.42,
    torch: 1
  }), o.objs.push({
    kind: "monument",
    x: 25 * N + 8,
    y: 7 * N + 12,
    r: 12
  }), o.Z.lights.push({
    x: 25 * N + 8,
    y: 7 * N - 10,
    r: 62,
    c: "#ffb050",
    i: 0.55,
    torch: 1
  }), o.objs.push({
    kind: "dog",
    x: 5 * N + 6,
    y: 11 * N + 8,
    r: 8
  }), o.objs.push({
    kind: "tgate",
    x: 5 * N + 8,
    y: 15 * N + 4,
    r: 14
  }), o.objs.push({
    kind: "stele",
    x: 9 * N + 8,
    y: 15 * N + 6,
    r: 10
  }));
  let _v1858 = _e("dummy", 23 * N, 10 * N, 1, 0);
  (_v1858.dummy = !0, _v1858.log = [], o.mons.push(_v1858));
  let _v1859 = _e("dummy", 24 * N, 13 * N, 1, 2);
  (_v1859.dummy = !0, _v1859.log = [], _v1859.name = "精英木桩", o.mons.push(_v1859), o.objs.push({
    kind: "fire",
    x: 7 * N,
    y: 10 * N
  }), o.Z.lights.push({
    x: 7 * N,
    y: 10 * N,
    r: 110,
    c: "#ff9a40",
    i: 1,
    torch: 1
  }), h.flask.forEach(_v1860 => _v1860.ch = _v1860.max), o.state = "play", Vr(), Ye());
};
Pr = function (_v1861, _v1862) {
  let _v1863 = Wt[_v1861.theme], _v1864 = qs(_v1861), _v1865 = _v1861.dbg || null, _v1866 = o.endlessMode ? 0 : Math.max(1, Math.min(100, Math.round(o.mapIntensity || 1)));
  if (!o.endlessMode) {
    _v1864.mods.monLife = (_v1864.mods.monLife || 0) + _v1866 * 1000;
    _v1864.quant += _v1866 * 70;
    _v1864.rar += _v1866 * 70;
  }
  if (_v1865) for (let _v1867 of ["monLife", "magicPacks", "rarePacks"]) _v1865[_v1867] && (_v1864.mods[_v1867] = (_v1864.mods[_v1867] || 0) + _v1865[_v1867]);
  _v1865 && _v1865.torch && (_v1863 = {
    ..._v1863,
    torchCh: _v1865.torch
  });
  let [_v1868, _v1869] = _v1865 && _v1865.rooms ? _v1865.rooms : [14, 17], _v1870 = _v1862 || (o.endlessMode ? makeEndlessMap() : Zn(ie(_v1868, _v1869)));
  for (let _v1871 = 0; !_v1862 && !o.endlessMode && _v1871 < 20 && _v1870.rooms.length < Math.min(7, _v1868 - 3); _v1871++) _v1870 = Zn(ie(_v1868, _v1869));
  (Vi(_v1870, "map", _v1863, {
    lvl: Os(_v1861.tier),
    tier: _v1861.tier,
    ms: _v1864,
    map: _v1861
  }), o.Z.dens = _v1865 && _v1865.dens || 1, o.Z.quant = _v1864.quant, s4(), o.run = {
    route: tr(),
    name: "T" + _v1861.tier + " " + _v1861.name,
    tier: _v1861.tier,
    rarity: _v1861.rarity,
    intensity: _v1866,
    endless: !!o.endlessMode,
    nmods: _v1861.mods.length,
    quant: _v1864.quant,
    t: 0,
    kills: 0,
    value: 0,
    invest: _v1861.invest || 0,
    cur: {},
    items: 0,
    best: null,
    bossDead: !1,
    died: !1,
    filtered: 0
  }, o.state = "play", H("map:enter", {
    m: _v1861
  }), Vr(), $e("T" + _v1861.tier + " · " + _v1861.name, "区域等级 " + o.Z.lvl + " · 强度 " + _v1866 + " · 怪物生命 +" + _v1866 * 1000 + "% · 怪物元素抗性 +" + Math.min(75, _v1866 * 10) + "%（上限 75%）· 物品数量 +" + _v1866 * 70 + "% · 物品稀有度 +" + _v1866 * 70 + "%（地图总数量 +" + _v1864.quant + "% / 总稀有度 +" + _v1864.rar + "%）"));
};
s4 = function () {
  let _v1872 = o.Z.M, _v1873 = o.Z.ms.mods, _v1874 = o.Z.dens || 1, _v1875 = Math.sqrt(_v1874), _v1876 = (1 + (_v1873.packSize || 0) / 100) * Ce.spawn.sizeMul * _v1875, _v1877 = Ce.spawn.packMul * _v1875, _v1878 = _v1879 => {
    let _v1880 = _v1879 * _v1877;
    return Math.floor(_v1880) + (j() < _v1880 % 1 ? 1 : 0);
  };
  _v1872.rooms.forEach((_v1881, _v1882) => {
    if (_v1882 === 0) return;
    if (_v1881.boss) {
      let _v1883 = (_v1881.cx + 0.5) * N, _v1884 = (_v1881.cy + 0.5) * N;
      try {
        let _v1885 = 0;
        while (_v1885++ < 80 && (!AbyssFloorOK(_v1883, _v1884) || AbyssWallGap(_v1883, _v1884) < 34)) {
          let _v1886 = ar(_v1881);
          _v1883 = _v1886.x;
          _v1884 = _v1886.y;
        }
      } catch (_v1887) {}
      let _v1888 = _e((tt[o.Z.th.key] || ({})).boss || "boss", _v1883, _v1884, o.Z.lvl + 2, 3);
      (o.Z.boss = _v1888, o.mons.push(_v1888), Zi(_v1881, Math.round(4 * Math.min(2, _v1875))));
      return;
    }
    let _v1889 = _v1878(ie(1, 3) + (_v1881.w * _v1881.h > 110 ? 1 : 0));
    for (let _v1890 = 0; _v1890 < _v1889 && o.mons.length < Ce.spawn.cap; _v1890++) Zi(_v1881, Math.round(ie(4, 8) * _v1876));
  });
  let _v1891 = _v1872.rooms.filter((_v1892, _v1893) => _v1893 > 0 && !_v1892.boss);
  if (!_v1891.length) return;
  let _v1894 = (j() < 0.55 ? 1 : 0) + (_v1873.boxes || 0) + (ue("box1") ? 1 : 0) + (ue("box5") ? 2 : 0), _v1895 = Math.max(0, Math.round(((j() < 0.35 ? 1 : 0) + (_v1873.rifts || 0) + (ue("rift1") ? 1 : 0)) * AtlasContentMul()));
  if (ue("sust5")) {
    let _v1896 = ar(se(_v1891));
    o.objs.push({
      kind: "shrine",
      x: _v1896.x,
      y: _v1896.y,
      type: se(Ea).k,
      used: !1
    });
  }
  for (let _v1897 = 0; _v1897 < _v1894; _v1897++) {
    let _v1898 = ar(se(_v1891));
    o.objs.push({
      kind: "box",
      x: _v1898.x,
      y: _v1898.y,
      r: 6,
      open: !1,
      ornate: ue("box3") && j() < 0.25
    });
  }
  for (let _v1899 = 0; _v1899 < _v1895; _v1899++) {
    let _v1900 = ar(se(_v1891));
    o.objs.push({
      kind: "rift",
      x: _v1900.x,
      y: _v1900.y,
      r: 8,
      st: "idle",
      t: 0,
      R: 0,
      spT: 0
    });
  }
  if (j() < (0.42 + (ue("aby1") ? 0.15 : 0) + (o.Z.tier >= 11 ? 0.15 : 0)) * AtlasContentMul()) {
    let _v1901 = ar(se(_v1891));
    o.objs.push(AbyssMake(_v1901.x, _v1901.y));
  }
  if (j() < BAL.mirrorChance * AtlasContentMul()) {
    let _v1902 = _v1872.rooms && _v1872.rooms[0] ? ar(_v1872.rooms[0]) : ar(se(_v1891));
    o.objs.push({
      kind: "mirror",
      x: _v1902.x,
      y: _v1902.y,
      r: 10,
      st: "idle"
    });
  }
  let _v1903 = Math.max(1, Math.round((3 + (ue("rit1") ? 1 : 0) + (o.Z.tier >= 11 && j() < 0.5 ? 1 : 0)) * AtlasContentMul())), _v1904 = _v1891.filter(_v1905 => !_v1905.boss), _v1906 = [];
  for (let _v1907 = 0; _v1907 < _v1903; _v1907++) {
    let _v1908 = _v1904.find(_v1909 => !_v1906.includes(_v1909)) || _v1904[_v1907 % Math.max(1, _v1904.length)] || se(_v1891);
    (_v1906.push(_v1908), 0);
    let _v1910 = ar(_v1908);
    o.objs.push(RitualMake(_v1910.x, _v1910.y));
  }
  let _v1911 = _v1872.rooms.find(_v1912 => _v1912.boss);
  if (_v1911 && j() < BAL.ritualBossChance + (ue("rit7") ? 0.15 : 0)) {
    let _v1913 = ar(_v1911), _v1914 = RitualMake(_v1913.x, _v1913.y);
    _v1914.bossAltar = !0;
    o.objs.push(_v1914);
  }
  try {
    JewelMapDrop(_v1872);
  } catch (_v1915) {}
  y0();
};
Ly = function (_v1916) {
  let _v1917 = _v1916.x, _v1918 = _v1916.y, _v1919 = _v1916.mult || 1, _v1920 = _v1916.encBox;
  if ((el(_v1917, _v1918, 8 * _v1919, 40), _v1920 === "crypt")) {
    for (let _v1921 = 0; _v1921 < Math.round(3 * _v1919); _v1921++) ve(_v1917, _v1918, {
      kind: "it",
      it: pu()
    });
    j() < 0.25 * _v1919 && ve(_v1917, _v1918, {
      kind: "it",
      it: fn(se(Object.keys(ze)))
    });
  }
  if (_v1920 === "lava") {
    let _v1922 = rt.filter(_v1923 => F[_v1923].grp === "rune" || F[_v1923].grp === "ess");
    for (let _v1924 = 0; _v1924 < Math.round(4 * _v1919); _v1924++) ve(_v1917, _v1918, {
      kind: "cur",
      cur: se(_v1922)
    });
  }
  if (_v1920 === "ice") for (let _v1925 = 0; _v1925 < Math.round(5 * _v1919); _v1925++) ve(_v1917, _v1918, {
    kind: "cur",
    cur: ht(["chaos", "regal", "exalt", "vaal", "jewel2", "divine"], _v1926 => ({
      chaos: 30,
      regal: 20,
      exalt: 6,
      vaal: 15,
      jewel2: 8,
      divine: 1.2
    })[_v1926])
  });
  if (_v1920 === "swamp") {
    if (j() < 0.35 * _v1919) {
      let _v1927 = lt.filter(_v1928 => _v1928.src === "world" && !_v1928.noDrop && _v1928.lv <= o.Z.lvl + 5);
      _v1927.length && ve(_v1917, _v1918, {
        kind: "it",
        it: _t(se(_v1927), o.Z.lvl)
      });
    }
    for (let _v1929 = 0; _v1929 < 2; _v1929++) {
      let _v1930 = la(se(Ca.filter(_v1931 => _v1931.lv <= o.Z.lvl)), o.Z.lvl, 2);
      ve(_v1917, _v1918, {
        kind: "it",
        it: _v1930
      });
    }
  }
};
Py = function (_v1932) {
  if (!o.Z || o.Z.type !== "map") return;
  if (o.Z.pin) {
    let _v1933 = h.pinLv;
    (h.pinKills = (h.pinKills || 0) + 1, h.pinBest = Math.max(h.pinBest || 0, _v1933));
    for (let _v1934 = 0; _v1934 < 2 + Math.floor(_v1933 / 3); _v1934++) ve(_v1932.x, _v1932.y, {
      kind: "cur",
      cur: "divine"
    });
    for (let _v1935 = 0; _v1935 < 3; _v1935++) ve(_v1932.x, _v1932.y, {
      kind: "cur",
      cur: "exalt"
    });
    el(_v1932.x, _v1932.y, 25 + _v1933 * 3, 150);
    let _v1936 = lt.filter(_v1937 => _v1937.src === "void" && !_v1937.noDrop), _v1938 = 0;
    for (let _v1939 of _v1936) j() < 0.25 + 0.03 * _v1933 && (ve(_v1932.x, _v1932.y, {
      kind: "it",
      it: _t(_v1939, o.Z.lvl)
    }), _v1938++);
    if (!_v1938) {
      let _v1940 = _v1936.filter(_v1941 => !h.codex[_v1941.id]);
      ve(_v1932.x, _v1932.y, {
        kind: "it",
        it: _t(se(_v1940.length ? _v1940 : _v1936), o.Z.lvl)
      });
    }
    (h.pinKills === 1 && (h.atlasPts = Math.min(Ln, h.atlasPts + 3)), h.pinLv = Math.min(10, _v1933 + 1), setTimeout(() => $e("虚空之主 已陨落", "裂隙之心 等级提升至 " + h.pinLv), 1500), Yi());
    return;
  }
  let _v1942 = o.Z.th.key, _v1943 = o.Z.tier, _v1944 = _v1942 + ":" + _v1943;
  (h.done = h.done || ({}), h.done[_v1944] || (h.done[_v1944] = 1, h.atlasPts < Ln && (h.atlasPts++, setTimeout(() => P("图谱完成度 +1 · 图谱点 +1 (按 U)"), 2400))), h.bestTier = Math.max(h.bestTier || 0, _v1943));
  let _v1945 = !(h.bossKills[_v1942] > 0);
  if ((h.bossKills[_v1942] = (h.bossKills[_v1942] || 0) + 1, h.bossBest[_v1942] = Math.max(h.bossBest[_v1942] || 0, _v1943), _v1943 >= 6 && j() < 0.35 * (ue("enc4") ? 1.5 : 1) * (_v1932.awake ? 2 : 1) && ve(_v1932.x, _v1932.y, {
    kind: "cur",
    cur: Zc[_v1942]
  }), _v1943 >= 4)) {
    let _v1946 = lt.filter(_v1947 => _v1947.src === _v1942), _v1948 = 0;
    for (let _v1949 of _v1946) j() < 0.12 * (ue("enc5") ? 1.5 : 1) * (_v1932.awake ? 2 : 1) && (ve(_v1932.x, _v1932.y, {
      kind: "it",
      it: _t(_v1949, o.Z.lvl)
    }), _v1948++);
    if (!_v1948 && _v1945) {
      let _v1950 = _v1946.filter(_v1951 => !h.codex[_v1951.id]);
      _v1950.length && (ve(_v1932.x, _v1932.y, {
        kind: "it",
        it: _t(se(_v1950), o.Z.lvl)
      }), setTimeout(() => P("首杀奖励: 专属传奇"), 1800));
    }
  }
  Yi();
};
ee = function (_v1952, _v1953, _v1954, _v1955 = 1, _v1956 = {}) {
  if (_v1952.dead || _v1952.inv) return 0;
  let _v1957 = _v1953.fixed != null, _v1958 = {
    m: _v1952,
    c: _v1953,
    src: _v1954,
    o: _v1956,
    fixed: _v1957,
    crit: !1,
    dom: "phys",
    by: null,
    amt: 0,
    k: 1
  };
  if (_v1957) (_v1958.amt = _v1953.fixed * (1 - Nn(_v1952, _v1953.el, _v1953) / 100), _v1958.dom = _v1953.el, _v1953.critHit && (_v1958.crit = !0)); else {
    let _v1959 = _v1958.by = {};
    for (let _v1960 of Uo) {
      let _v1961 = _v1953.dmg[_v1960];
      _v1961[1] <= 0 || (_v1959[_v1960] = (_v1961[0] + (_v1961[1] - _v1961[0]) * j()) * (1 - Nn(_v1952, _v1960, _v1953) / 100));
    }
    H("hit:base", _v1958);
    let _v1962 = 0;
    for (let _v1963 in _v1958.by) (_v1958.amt += _v1958.by[_v1963], _v1958.by[_v1963] > _v1962 && (_v1962 = _v1958.by[_v1963], _v1958.dom = _v1963));
    let _v1964 = H("hit:crit", {
      m: _v1952,
      c: _v1953,
      src: _v1954,
      cc: _v1953.crit,
      force: !!(_v1954 && (_v1954.sheathe && _v1953.isAtk || _v1954.perfect)) || o.pl.critNextT > 0
    });
    if ((_v1958.crit = !_v1953.noCrit && (_v1964.force || j() < Math.min(0.95, _v1964.cc)), _v1958.crit)) {
      _v1958.amt *= _v1953.multi;
      for (let _v1965 in _v1959) _v1959[_v1965] *= _v1953.multi;
    }
  }
  (_v1958.k = _v1955 * (1 + (_v1952.shockT > 0 ? _v1952.shockAmt : 0)), _v1952.stunT > 0 && (_v1958.k *= 1.25), !_v1957 && _v1954 && _v1954.sheathe && _v1953.isAtk && (_v1958.k *= H("hit:sheathe", {
    m: _v1952,
    c: _v1953,
    src: _v1954,
    mult: 1.4 + (o.S.a.sheathe || 0) / 100
  }).mult), H("hit:mods", _v1958), _v1958.amt *= _v1958.k * DelDRMul(), H("hit:land", _v1958));
  let _v1966 = _v1958.o, _v1967 = _v1958.crit, _v1968 = _v1958.dom, _v1969 = _v1958.by, _v1970 = _v1966.weight || "light", _v1971 = _v1966.dir != null ? _v1966.dir : Math.atan2(_v1952.y - o.pl.y, _v1952.x - o.pl.x);
  if ((_v1952.flash = _v1966.quiet ? Math.max(_v1952.flash, 0.03) : 0.09, _v1952.aggro = !0, _v1952.dummy)) return (H("hit:dummy", _v1958), _v1952.log.push([o.T, _v1958.amt]), U(_v1952.x, _v1952.y - _v1952.h - 2, _v1958.amt, _v1967, _v1968), Dy(_v1952, _v1958.amt, _v1967, _v1970, _v1971, _v1966), _v1958.amt);
  if ((_v1952.hp -= _v1958.amt, _v1952.rar < 3)) {
    let _v1972 = Math.min(1, _v1958.amt / _v1952.maxhp), _v1973 = (({
      light: 14,
      mid: 42,
      heavy: 95,
      super: 150
    })[_v1970] + _v1972 * 60) * (_v1952.rar === 2 ? 0.35 : _v1952.rar === 1 ? 0.7 : 1), _v1974 = () => {
      (_v1952.kbx += Math.cos(_v1971) * _v1973, _v1952.kby += Math.sin(_v1971) * _v1973);
    };
    _v1970 === "heavy" || _v1970 === "super" ? o.releaseQ.push(_v1974) : _v1974();
  }
  if ((_v1969 && !_v1953.noAil && ZT(_v1958), !_v1957 && !o.Z.ms.mods.noLeech)) {
    let _v1975 = H("hit:leech", {
      m: _v1952,
      c: _v1953,
      lch: o.S.leech
    });
    _v1975.lch > 0 && (o.pl.hp = Math.min(o.S.maxLife, o.pl.hp + Math.min(_v1958.amt * _v1975.lch, o.S.maxLife * 0.025)));
  }
  return (o.Z.ms.mods.reflect && _v1968 !== "phys" && !_v1957 && (o.pl.reflect += _v1958.amt * o.Z.ms.mods.reflect / 100), !_v1957 && _v1953.isAtk && o.pl.hitN++, H("hit:after", _v1958), (!_v1966.quiet || _v1967) && U(_v1952.x, _v1952.y - _v1952.h - 2, _v1958.amt, _v1967, _v1968), Dy(_v1952, _v1958.amt, _v1967, _v1970, _v1971, _v1966), L(_v1952.x, _v1952.y, _v1967 ? 8 : 3, UT[_v1968], _v1967 ? 90 : 50, 0.3, {
    z: _v1952.h * 0.5,
    g: 60,
    glow: _v1968 !== "phys",
    dir: _v1971,
    spread: 1.2
  }), _v1952.hp <= 0 && er(_v1952, _v1954, {
    dir: _v1971,
    weight: _v1970,
    ign: !!_v1952.ign,
    dom: _v1968,
    crit: _v1967,
    over: -_v1952.hp / _v1952.maxhp,
    frozen: _v1952.frozen > 0
  }), _v1958.amt);
};
Dy = function (_v1976, _v1977, _v1978, _v1979, _v1980, _v1981) {
  let _v1982 = Math.min(1, _v1977 / _v1976.maxhp);
  (_v1976.stun += _v1982 * ({
    light: 0.7,
    mid: 1.9,
    heavy: 3.2,
    super: 5
  })[_v1979] * (_v1976.rar === 3 ? 0.45 : 1) * (_v1978 ? 1.3 : 1) * (_v1981.stunMul || 1), _v1976.stun >= 1 && _v1976.stunT <= 0 && _v1976.rar >= 1 && (_v1976.stun = 0, _v1976.stunT = _v1976.rar === 3 ? 1.1 : 1.7, _v1976.dummy || (_v1976.state = "chase"), _v1976.rar >= 2 && U(_v1976.x, _v1976.y - _v1976.h - 10, 0, !1, "gold", "重击晕眩", !0), M("stun"), H("stun", {
    m: _v1976,
    o: _v1981
  }), o.fx.push({
    k: "star",
    x: _v1976.x,
    y: _v1976.y - _v1976.h * 0.5,
    t: 0,
    max: 0.25,
    col: "#ffe080",
    r: 16
  })));
  let _v1983 = ({
    light: 0,
    mid: 0.14,
    heavy: 0.32,
    super: 0.5
  })[_v1979] * [1, 0.6, 0.25, 0][_v1976.rar];
  (_v1983 > 0 && !_v1976.dummy && (_v1976.stagT = Math.max(_v1976.stagT, _v1983), (_v1976.state === "wind" || _v1976.state === "aim") && (_v1976.state = "chase")), _v1976.shx = Math.cos(_v1980), _v1976.shy = Math.sin(_v1980), _v1976.shT = 0.14, _v1976.sqT = 0.12, _v1976.sqA = ({
    light: 0.12,
    mid: 0.2,
    heavy: 0.3,
    super: 0.38
  })[_v1979] + (_v1978 ? 0.08 : 0));
  let _v1984 = ({
    light: _v1978 ? 0.016 : 0,
    mid: 0.034,
    heavy: 0.07,
    super: 0.12
  })[_v1979];
  (_v1978 && _v1979 !== "light" && (_v1984 += 0.015), _v1979 !== "light" && (_v1984 += _v1982 * 0.03), b4(_v1984), V(({
    light: 0.012,
    mid: 0.05,
    heavy: 0.14,
    super: 0.26
  })[_v1979] + (_v1978 ? 0.04 : 0)), Da(_v1980, ({
    light: 0.3,
    mid: 1.4,
    heavy: 2.8,
    super: 4.5
  })[_v1979]), isFinite(_v1976.x) && isFinite(_v1976.y) && isFinite(_v1976.h) && o.fx.push({
    k: "ring",
    x: _v1976.x,
    y: _v1976.y - _v1976.h * 0.45,
    t: 0,
    max: _v1979 === "light" ? 0.18 : _v1979 === "super" ? 0.32 : 0.24,
    r0: 2,
    r1: 8 + ({
      light: 2,
      mid: 7,
      heavy: 13,
      super: 20
    })[_v1979],
    w: _v1978 ? 1.7 : 1.2,
    col: _v1978 ? "#ffe8b0" : _v1977 > _v1976.maxhp * 0.25 ? "#ffb070" : "#ff8a60"
  }), (_v1978 || _v1979 !== "light") && L(_v1976.x, _v1976.y - _v1976.h * 0.5, _v1978 ? 6 : 3, _v1978 ? ["#fff2c0", "#ffd27a", "#ffb050"] : ["#ffd27a", "#ff9a60"], 34 + ({
    light: 0,
    mid: 18,
    heavy: 36,
    super: 60
  })[_v1979], 0.3, {
    glow: !0,
    vz: 40
  }), _v1979 === "heavy" && (o.zoomP = Math.max(o.zoomP, 0.025)), _v1979 === "super" && (o.zoomP = Math.max(o.zoomP, 0.05), o.fx.push({
    k: "lines",
    x: _v1976.x,
    y: _v1976.y - _v1976.h * 0.5,
    t: 0,
    max: 0.16
  }), o.flashW = Math.max(o.flashW, 0.18)), _v1979 !== "light" && o.fx.push({
    k: "star",
    x: _v1976.x + Math.cos(_v1980 + 3.14) * _v1976.r * 0.4,
    y: _v1976.y - _v1976.h * 0.5,
    t: 0,
    max: _v1979 === "mid" ? 0.1 : 0.16,
    col: _v1978 ? "#ffe080" : "#ffffff",
    r: _v1979 === "mid" ? 7 : 12
  }), gh(_v1979, _v1981.el || "phys", _v1978));
};
er = function (_v1985, _v1986, _v1987 = {}) {
  if (_v1985.dead) return;
  if (_v1985.t.prop) {
    (_v1985.dead = !0, _v1985.hp = 0, H("prop:death", {
      m: _v1985
    }));
    return;
  }
  _v1985.dead = !0;
  let _v1988 = _v1985.t, _v1989 = _v1985.rar >= 2, _v1990 = _v1987.weight || "light", _v1991 = _v1987.dir != null ? _v1987.dir : Math.atan2(_v1985.y - o.pl.y, _v1985.x - o.pl.x), _v1992 = ({
    light: 45,
    mid: 95,
    heavy: 170,
    super: 240
  })[_v1990] * (_v1985.rar === 3 ? 0.2 : _v1985.rar === 2 ? 0.55 : 1), _v1993 = {
    maxhp: _v1985.maxhp,
    settled: !1,
    spr: _v1985.spr,
    flip: _v1985.face < 0,
    x: _v1985.x,
    y: _v1985.y,
    z: 2,
    vx: Math.cos(_v1991) * _v1992,
    vy: Math.sin(_v1991) * _v1992 * 0.7,
    vz: _v1990 === "light" ? 30 : 60 + _v1992 * 0.35,
    rot: 0,
    vr: (j() < 0.5 ? -1 : 1) * (_v1990 === "light" ? 3 : 8 + _v1992 * 0.04),
    t: 0,
    life: 9,
    rift: _v1985.rift
  };
  if ((o.corpses.push(_v1993), o.corpses.length > 90 && o.corpses.shift(), o.Z.type === "map" && H("kill:corpse", {
    m: _v1985,
    corpse: _v1993,
    o: _v1987
  }), L(_v1985.x, _v1985.y, _v1989 ? 30 : 12, _v1988.gib, _v1989 ? 110 : 70, 0.7, {
    z: _v1985.h * 0.5,
    vz: 90,
    dir: _v1991,
    spread: 1.4
  }), L(_v1985.x, _v1985.y, _v1989 ? 7 : 3, _v1988.gib, 70, 2.2, {
    z: _v1985.h * 0.5,
    vz: 110,
    s: 2,
    g: 260,
    drag: 3,
    dir: _v1991,
    spread: 1
  }), Be(_v1985.x, _v1985.y, "blood", _v1989 ? 7 : 4), M("die"), o.Z.type !== "map")) return;
  y4(_v1985.xp * (_v1985.rift ? 1.5 : 1) * (_v1985.abyss ? 1.35 : 1));
  let _v1994 = H("kill:flask", {
    m: _v1985,
    mult: o.S.flaskCh
  });
  (h.flask.forEach(_v1995 => _v1995.ch = Math.min(_v1995.max, _v1995.ch + Ce.flaskGain[_v1985.rar] * _v1994.mult)), o.run && o.run.kills++);
  let _v1996 = H("kill:loot", {
    m: _v1985,
    src: _v1986,
    dm: Ce.loot.perKill[_v1985.rar] * (_v1985.rift ? Ce.loot.riftMul : 1) * (_v1985.abyss ? 1.3 : 1) * (_v1985.abyssloot || 1) * (_v1985.delMul || 1),
    rb: _v1986 && _v1986.c ? _v1986.c.rarity : 0
  });
  if ((el(_v1985.x, _v1985.y, _v1996.dm, _v1996.rb), _v1985.rift)) {
    let _v1997 = o.objs.find(_v1998 => _v1998.kind === "rift" && _v1998.st === "open");
    _v1997 && (_v1997.kills = (_v1997.kills || 0) + 1);
  }
  AbyssOnKill(_v1985);
  if (_v1985.del && o.Z && o.Z.type === "map") {
    let _v1999 = o.del ? o.del.depth : 0;
    if (j() < 0.45 + _v1999 / 1200) ve(_v1985.x, _v1985.y, {
      kind: "cur",
      cur: se(["trans", "aug", "alch", "chaos", "exalt"])
    });
    if (j() < 0.05 + _v1999 / 4000) ve(_v1985.x, _v1985.y, {
      kind: "it",
      it: la(se(Ca), (o.Z.lvl || 1) + 1, 2)
    });
  }
  (_v1985.abmod === "volatile" && (o.fx.push({
    k: "ring",
    x: _v1985.x,
    y: _v1985.y,
    r0: 3,
    r1: 40,
    t: 0,
    max: 0.35,
    col: "#2ee6a8",
    w: 2
  }), L(_v1985.x, _v1985.y, 18, AB_GREEN, 80, 0.6, {
    glow: !0
  }), M("boom", 0.5), (o.pl.x - _v1985.x) ** 2 + (o.pl.y - _v1985.y) ** 2 < 6400 && Dt(_v1985.dmg * 1.4, "phys", {
    area: !0
  })), _v1985.abyss && _v1985.lichborn && AbyssOmenDrop(_v1985.x, _v1985.y), _v1985.abyss && !_v1985.lichborn && j() < (ue("aby4") ? 0.04 : 0.02) && AbyssOmenDrop(_v1985.x, _v1985.y), _v1985.abyss && j() < (ue("aby2") ? 0.12 : 0.06) && DsBoneDrop(_v1985.x, _v1985.y), _v1985.abyss && _v1985.lichborn && DsBoneDrop(_v1985.x, _v1985.y, 1));
  if (_v1985.abyss) {
    (j() < 0.03 && OmDrop(_v1985.x, _v1985.y), _v1985.lichborn && (OmDrop(_v1985.x, _v1985.y), OmDrop(_v1985.x, _v1985.y)), _v1985.lichborn === "void" && ($e("阿曼娜姆的虚空", "虚空溃散了"), M("unique")), _v1985.lichborn === "gasp" && !_v1985.revived && o.pend.push({
      t: 0.4,
      fn: () => {
        let _v2000 = _e("abyssstrangler", _v1985.x, _v1985.y, o.Z.lvl, 2);
        (Object.assign(_v2000, {
          spr: "abysslich",
          h: zt.abysslich.h,
          r: 9,
          abyss: !0,
          pit: _v1985.pit,
          aggro: !0,
          revived: !0,
          lichborn: "gasp",
          name: "回响 · 古加尔的最后喘息"
        }), _v2000.maxhp = _v1985.maxhp * 0.55, _v2000.hp = _v2000.maxhp, _v2000.dmg = _v1985.dmg * 1.25, o.mons.push(_v2000), $e("古加尔的最后喘息", "它带着更强的力量站了起来"), M("unique"));
      }
    }), _v1985.lichborn === "legion" && o.pend.push({
      t: 0.2,
      fn: () => {
        for (let _v2001 = 0; _v2001 < 2; _v2001++) {
          let _v2002 = _e("abysswalker", _v1985.x + O(-16, 16), _v1985.y + O(-16, 16), o.Z.lvl, 0);
          (Object.assign(_v2002, {
            abyss: !0,
            pit: _v1985.pit,
            aggro: !0,
            name: "乌拉曼的军团 · 复制体"
          }), _v2002.maxhp *= 0.35, _v2002.hp = _v2002.maxhp, _v2002.dmg *= 0.7, o.mons.push(_v2002));
        }
        ($e("乌拉曼的军团", "军团从尸体中分裂出来"), M("unique"));
      }
    }));
  }
  (_v1985.del && j() < 0.35 && DelSplinter(_v1985.x, _v1985.y), _v1985.del && _v1985.rar >= 2 && j() < 0.5 && DelSplinter(_v1985.x, _v1985.y), _v1985.ritual ? (_v1985.ritual.st === "active" && (function () {
    let _v2003 = Math.max(1, Math.round((2 + (_v1985.rar || 0) * 3 + Math.floor(o.Z.lvl / 12)) * (ue("rit2") ? 1.25 : 1) * (ue("rit7") ? 1.25 : 1) * (_v1985.ritual.bossAltar ? 2 : 1) * (BAL.ritualTributeMul || 1) * (_v1985.reviveGen ? Math.max(0.25, 1 - 0.25 * (_v1985.reviveGen - 1)) : 1)));
    (RitAddTribute(_v2003), _v1985.ritual.tribute = RitTribute(), M("pick", 0.4));
  })(), _v1985.ritual.st === "idle" && 0) : (function () {
    if (!o.Z || o.Z.type !== "map") return 0;
    let _v2004 = o.objs.find(_v2005 => _v2005.kind === "ritual" && _v2005.st === "idle" && (_v1985.x - _v2005.x) ** 2 + (_v1985.y - _v2005.y) ** 2 < 36100);
    return _v2004 ? (_v2004.stored = (_v2004.stored || 0) + 1 + (_v1985.rar || 0) * 2, L(_v2004.x, _v2004.y, 10, RIT_COL, 30, 0.4, {
      glow: !0
    }), 1) : 0;
  })());
  let _v2006 = H("kill:explode", {
    m: _v1985,
    src: _v1986,
    o: _v1987,
    ex: _v1986 && _v1986.c && _v1986.c.explode || 0
  });
  if (_v2006.ex > 0) {
    let _v2007 = _v1985.x, _v2008 = _v1985.y, _v2009 = ma(_v1985) * _v2006.ex, _v2010 = _v1985.rar >= 2 ? 34 : 26;
    o.pend.push({
      t: 0.07,
      fn: () => or(_v2007, _v2008, _v2009, _v2010, _v1986)
    });
  }
  if (_v1985.mods.some(_v2011 => _v2011.k === "frostbody")) {
    let _v2012 = _v1985.x, _v2013 = _v1985.y, _v2014 = _v1985.dmg * 1.6;
    (o.fx.push({
      k: "tele",
      x: _v2012,
      y: _v2013,
      r: 34,
      t: 0,
      max: 0.65,
      col: "#9fe8ff"
    }), o.pend.push({
      t: 0.65,
      fn: () => {
        (o.fx.push({
          k: "ring",
          x: _v2012,
          y: _v2013,
          r0: 4,
          r1: 34,
          t: 0,
          max: 0.3,
          col: "#bfefff",
          w: 2
        }), L(_v2012, _v2013, 20, ["#bfefff", "#5fb4e8"], 120, 0.5), M("ice"), (o.pl.x - _v2012) ** 2 + (o.pl.y - _v2013) ** 2 < 1444 && Dt(_v2014, "cold", {
          area: 1
        }));
      }
    }));
  }
  if ((H("kill", {
    m: _v1985,
    src: _v1986,
    o: _v1987
  }), _v1985.rar === 2 && (re.stop && (o.hitstop = Math.max(o.hitstop, 0.07)), V(0.2)), _v1985.rar === 3)) {
    if ((o.hitstop = 0.22, o.slowT = 1, V(0.7), o.flashW = 0.5, _v1985.guard)) {
      (M("slam"), Be(_v1985.x, _v1985.y, "scorch", 16), o.fx.push({
        k: "lines",
        x: _v1985.x,
        y: _v1985.y - 10,
        t: 0,
        max: 0.3
      }), H("tower:guard", {
        m: _v1985
      }));
      return;
    }
    if ((o.Z.done = !0, o.run && (o.run.bossDead = !0), M("slam"), $e(_v1985.name + " 已陨落", "地图完成 · 按 T 返回藏身处结算"), Be(_v1985.x, _v1985.y, "scorch", 16), o.fx.push({
      k: "lines",
      x: _v1985.x,
      y: _v1985.y - 10,
      t: 0,
      max: 0.3
    }), ve(_v1985.x, _v1985.y, {
      kind: "it",
      it: ia(we(o.Z.tier + (j() < H("boss:map", {
        m: _v1985,
        up: 0.45
      }).up ? 1 : 0), 1, 16))
    }), o.Z.tier >= 16 && j() < (o.Z.tier >= 17 ? tl.dropT17 : tl.dropT16) && ve(_v1985.x, _v1985.y, {
      kind: "it",
      it: ia(17)
    }), o.Z.tier >= 16 && j() < (o.Z.tier >= 17 ? 0.5 : 0.25) && ve(_v1985.x, _v1985.y, {
      kind: "cur",
      cur: "frac"
    }), o.Z.tier >= 17)) {
      ve(_v1985.x, _v1985.y, {
        kind: "cur",
        cur: "divine"
      });
      for (let _v2015 = 0; _v2015 < 2; _v2015++) ve(_v1985.x, _v1985.y, {
        kind: "cur",
        cur: "exalt"
      });
      let _v2016 = lt.filter(_v2017 => _v2017.src === "world" && !_v2017.noDrop);
      _v2016.length && j() < 0.6 && ve(_v1985.x, _v1985.y, {
        kind: "it",
        it: _t(se(_v2016), o.Z.lvl)
      });
    }
    let _v2018 = 0;
    for (let _v2019 of is) o.Z.tier >= _v2019 && !h.trials.includes(_v2019) && (h.trials.push(_v2019), _v2018 += 2);
    (_v2018 && (h.ascPts += _v2018, setTimeout(() => $e("升华试炼完成", "升华点 +" + _v2018 + (h.asc ? "" : " · 按 P 选择你的升华")), 1600)), o.Z.tier >= 6 && j() < 0.1 + Math.min(0.1, o.Z.tier * 0.006) && OmDrop(_v1985.x, _v1985.y), H("boss:kill", {
      m: _v1985
    }));
  }
};
Dt = function (_v2020, _v2021, _v2022 = {}) {
  if (o.state !== "play" || !o.Z || o.Z.type !== "map" || o.pl.dead || h.god || H("player:avoid", {
    amt: _v2020,
    el: _v2021,
    o: _v2022,
    avoided: !1
  }).avoided) return !1;
  let _v2023 = o.Z.ms.mods;
  if ((!_v2022.dot && !_v2022.noCrit && j() < Ce.mon.crit * (1 + (_v2023.monCrit || 0) / 100) && (_v2020 *= 1.5), _v2020 = H("player:mitigate", {
    amt: _v2020,
    el: _v2021,
    o: _v2022
  }).amt, o.pl.shockT > 0 && (_v2020 *= 1 + o.pl.shockAmt), _v2021 === "phys" ? _v2020 *= 1 - Math.min(0.9, o.S.armour / (o.S.armour + 6 * _v2020)) : _v2020 *= 1 - Math.min(UniqueResCap(), (o.S.res[_v2021] || 0) - (_v2023.playerRes || 0)) / 100, _v2020 = H("player:mitigate:post", {
    amt: _v2020,
    el: _v2021,
    o: _v2022
  }).amt, _v2022.dot || (o.pl.sinceHit = 0), o.pl.esDelay = o.S.esDelay, o.pl.es > 0)) {
    let _v2024 = Math.min(o.pl.es, _v2020);
    (o.pl.es -= _v2024, _v2020 -= _v2024);
  }
  return (o.pl.hp - _v2020 <= 0 && H("player:lethal", {
    amt: _v2020,
    o: _v2022,
    prevented: !1
  }).prevented || (o.pl.hp -= _v2020, H("player:hurt", {
    amt: _v2020,
    el: _v2021,
    o: _v2022
  }), !_v2022.dot && _v2020 > 0.5 && (o.pl.hurtT = 0.14, V(Math.min(0.5, 0.1 + _v2020 / o.S.maxLife)), M("hurt"), U(o.pl.x, o.pl.y - 20, _v2020, !1, "hurt"), o.edgeFlash = Math.min(1, 0.25 + _v2020 / o.S.maxLife * 2), _v2020 > o.S.maxLife * 0.3 && !_v2022.area && !o.S.noStagger && (o.pl.stagT = 0.25, o.pl.act = null, U(o.pl.x, o.pl.y - 28, 0, !1, "info", "硬直"))), o.pl.hp > 0 && o.pl.hp <= o.S.maxLife * 0.35 && o.pl.hp + _v2020 > o.S.maxLife * 0.35 && OmTake("omen_refresh") && (h.flask.forEach(_v2025 => _v2025.ch = _v2025.max), $e("恢复预兆", "药剂充能已回满")), o.pl.hp > 0 && o.pl.hp <= o.S.maxLife * 0.35 && o.pl.hp + _v2020 > o.S.maxLife * 0.35 && OmHas("omen_resurgence") && OmTake("omen_resurgence", o.pl.x, o.pl.y - 24) && (o.pl.hp = o.S.maxLife, o.pl.mana = o.S.maxMana, o.pl.es = o.S.maxES, L(o.pl.x, o.pl.y, 40, ["#80e0a0", "#ffffff"], 90, 0.9, {
    glow: !0,
    vz: 140,
    g: 60
  })), o.pl.hp <= 0 && x4()), !0);
};
x4 = function () {
  (o.pl.dead = !0, o.pl.hp = 0, o.state = "dead", M("slam"), o.slowT = 1.2, V(0.8), L(o.pl.x, o.pl.y, 40, ["#a81d2c", "#5a1018", "#574468"], 100, 1.2, {
    vz: 120
  }), setTimeout(() => {
    if (o.state !== "dead") return;
    let _v2026 = Math.min(h.xp, Math.floor(Ki(h.level) * Ce.xp.deathLoss)), _v2027 = _v2026 > 0 && OmTake("omen_amelioration", o.pl.x, o.pl.y - 20);
    (_v2027 && (_v2026 = Math.floor(_v2026 * 0.25)), h.xp = Math.max(0, h.xp - _v2026), o.run && (o.run.died = !0), Ue(`<div class="ovbox"><h1 style="color:#c8303a;font-size:clamp(34px,7vw,60px)">你已死亡</h1><p class="sub">经验损失 ${Pe(_v2026)}${_v2027 ? " · 进步预兆减免 75%" : ""} · 地图已失效</p>${Ny(o.run)}<div class="ovbtns" style="margin-top:18px"><button class="btn primary" id="ovBack">返回藏身处</button></div></div>`), A("#ovBack").onclick = () => {
      (mt(), hu(!0));
    });
  }, 1100));
};
C8 = function () {
  R("kill", ({m: _v2028}) => {
    if (!o.Z || !h) return;
    let _v2029 = o.Z.tier || 0, _v2030 = _v2028.ub ? 0.2 : _v2028.rar === 3 && o.Z.type === "map" && !_v2028.guard ? k5(_v2029) : 0;
    _v2030 && j() < _v2030 && ve(_v2028.x, _v2028.y, {
      kind: "cur",
      cur: "ember"
    });
    _v2028.rar === 2 && o.Z.type === "map" && j() < 0.015 && OmDrop(_v2028.x, _v2028.y);
    _v2028.rar === 3 && o.Z.type === "map" && j() < 0.12 && JewelDrop(_v2028.x, _v2028.y);
  });
};
z4 = function () {
  let _v2031 = [];
  if (!o.pl || !o.S) return _v2031;
  if ((o.S.cls === "samurai" && _v2031.push([o.pl.sheReady ? "纳刀 ✓" : "纳刀 " + Math.min(1.2, o.pl.idleAtk).toFixed(1), o.pl.sheReady]), o.S.asc.has("focus") && _v2031.push(["凝神 " + o.pl.focus, o.pl.focus >= 5]), o.S.asc.has("momentum") && _v2031.push(["动量 " + o.pl.mom, o.pl.mom >= 20]), o.S.asc.has("shuraba") && _v2031.push(["杀意 " + o.pl.kills, o.pl.kills >= 25]), o.pl.kishinT > 0 && _v2031.push(["鬼神化 " + o.pl.kishinT.toFixed(1), !0]), o.pl.demon > 0 && _v2031.push(["魔焰 " + o.pl.demon, o.pl.demon >= 10]), o.pl.drunkT > 0 && _v2031.push(["醉意 " + o.pl.drunkT.toFixed(0), !0]), o.pl.pdT > 0 && _v2031.push(["见切", !0]), o.pl.critNextT > 0 && _v2031.push(["必暴", !0]), (h.skills.some(_v2032 => _v2032 && _v2032.gid === "hyakka") || o.pl.ki > 0) && _v2031.push(["刀意 " + o.pl.ki, o.pl.ki >= 10]), h.skills.some(_v2033 => _v2033 && _v2033.gid === "salvo") && _v2031.push(["冰箭 " + o.pl.salvo, o.pl.salvo >= 6]), o.pl.shrineT > 0 || o.pl.shrineT2 > 0)) {
    let _v2034 = o.pl.shrineT > 0 && Ea.find(_v2035 => _v2035.k === o.pl.shrine);
    _v2034 && _v2031.push([_v2034.n + " " + Math.ceil(o.pl.shrineT), !0]);
    let _v2036 = o.pl.shrineT2 > 0 && Ea.find(_v2037 => _v2037.k === o.pl.shrine2);
    _v2036 && _v2031.push([_v2036.n + " " + Math.ceil(o.pl.shrineT2), !0]);
  }
  h.om && Object.keys(h.om).forEach(_v2038 => {
    let _v2039 = F[_v2038];
    _v2039 && _v2031.push([_v2039.n, !0]);
  });
  o.sim && o.sim.active && o.Z && o.Z.simLayer && _v2031.push(["迷雾副本 " + o.sim.layer + "/" + o.sim.max + " 层 · 亢奋 " + o.sim.depth + "% · 伤害 -" + DelDRPct() + (o.sim.layer > 18 ? "% · 怪伤 +" + Math.round((SimDmgMul(o.sim.layer) - 1) * 100) + "%" : "%"), !0]);
  o.del && _v2031.push([o.del.outT > 0 ? "离开迷雾 " + Math.max(0, 5 - o.del.outT).toFixed(1) + "s" : "亢奋度 " + Math.round(o.del.depth) + "%" + (o.del.base ? " (基础 " + o.del.base + "%)" : "") + " · 伤害 -" + DelDRPct() + "%" + (o.del.pauseT > 0 ? " · 迷雾暂停" : ""), !0]);
  return (o.pl.noutouT > 0 && _v2031.push(["纳刀·无拍子", !0]), o.pl.parryBuffT > 0 && _v2031.push(["弹刀·重击", !0]), o.pl.waveT > 0 && _v2031.push(["寒冰波 ×2", !0]), o.pl.disT > 0 && _v2031.push(["撤离→重刺", !0]), o.minions.length && _v2031.push(["骷髅 " + o.minions.length, !1]), o.pl.ds > 0 && _v2031.push(["斗志 " + o.pl.ds, o.pl.ds >= (o.S.dsCap || 10)]), h.god && _v2031.push(["无敌", !0]), o.pl.tailT > 0 && _v2031.push(["顺风", !0]), o.pl.rangerT > 0 && _v2031.push(["游击", !1]), o.pl.overT > 0 && _v2031.push(["霸主", !0]), o.pl.markT > 0 && _v2031.push(["猎杀", !1]), o.pl.eoT > 0 && _v2031.push(["元素超载", !0]), Xb(_v2031), _v2031);
};
function CurbarHTML() {
  var _v2040 = {
    basic: "通货",
    sock: "工匠",
    rune: "符文",
    ess: "精华",
    sig: "印记",
    omen: "预兆",
    bone: "遗存骨",
    del: "裂片"
  };
  var _v2041 = ["basic", "sock", "rune", "ess", "sig", "bone", "del", "omen"];
  var _v2042 = {};
  try {
    _v2042 = JSON.parse(localStorage.getItem("er_cur_fold") || "{}") || ({});
  } catch (_v2043) {}
  var _v2044 = A("#curbar");
  if (_v2044 && !_v2044.__foldHooked) {
    _v2044.__foldHooked = 1;
    _v2044.addEventListener("toggle", function (_v2045) {
      var _v2046 = _v2045.target;
      if (!_v2046 || !_v2046.classList || !_v2046.classList.contains("curfold")) return;
      try {
        _v2042[_v2046.dataset.g] = !!_v2046.open;
        localStorage.setItem("er_cur_fold", JSON.stringify(_v2042));
      } catch (_v2047) {}
    }, true);
  }
  var _v2048 = '<span class="lbl">选中后点击物品使用 · 按住 Shift 连续使用 · 通货全角色共用 · 预兆点击激活</span>';
  _v2041.forEach(function (_v2049) {
    var _v2050 = rt.filter(function (_v2051) {
      return F[_v2051].grp === _v2049 && (!F[_v2051].rn || (h.cur[_v2051] || 0) > 0);
    });
    if (!_v2050.length) return;
    var _v2052 = _v2042[_v2049] != null ? !!_v2042[_v2049] : _v2049 === "basic" || _v2049 === "omen";
    _v2048 += '<details class="curfold" data-g="' + _v2049 + '"' + (_v2052 ? " open" : "") + '><summary><span class="cg">' + _v2040[_v2049] + "</span><small>" + _v2050.length + "</small></summary><div class=\"curgrid\">";
    _v2050.forEach(function (_v2053) {
      if (_v2049 === "omen") _v2048 += '<div class="cur om' + (OmActive(_v2053) ? " on" : "") + (h.cur[_v2053] ? "" : " zero") + '" data-act="omen" data-k="' + _v2053 + '" data-tt="cur:' + _v2053 + '"><img src="' + He[_v2053] + '" alt=""><span>' + (F[_v2053].s || F[_v2053].n) + "</span><b>" + (h.cur[_v2053] || 0) + "</b>" + (OmActive(_v2053) ? '<i class="omtag">激活</i>' : "") + "</div>"; else _v2048 += '<div class="cur' + (o.held === _v2053 ? " sel" : "") + (h.cur[_v2053] ? "" : " zero") + '" data-act="cur" data-k="' + _v2053 + '" data-tt="cur:' + _v2053 + '"><img src="' + He[_v2053] + '" alt=""><span>' + F[_v2053].n + "</span><b>" + (h.cur[_v2053] || 0) + "</b></div>";
    });
    _v2048 += "</div></details>";
  });
  return _v2048;
}
ms = function () {
  if (!o.tab) return;
  OmPrune();
  document.querySelectorAll("#tabs button").forEach(_v2054 => _v2054.classList.toggle("on", _v2054.dataset.tab === o.tab));
  let _v2055 = A("#pbody"), _v2056 = _v2055.scrollTop;
  (_v2055.innerHTML = o.tab === "map" ? Ap() : o.tab === "inv" ? B4() : o.tab === "cur" ? curPage() : o.tab === "gem" ? ey() : o.tab === "atlas" ? ty() : o.tab === "debug" ? sy() : o.tab === "codex" ? ay() : F4(), _v2055.scrollTop = _v2056, _v2055.querySelectorAll("[data-pv]").forEach(_v2057 => _v2057.replaceWith(l0(_v2057.dataset.pv))));
  let _v2058 = A("#tabDebug");
  _v2058 && (_v2058.hidden = !h.debug);
  let _v2059 = {
    basic: "通货",
    sock: "工匠",
    rune: "符文",
    ess: "精华",
    sig: "印记",
    omen: "预兆",
    bone: "遗存骨",
    del: "裂片"
  };
  (A("#curbar").innerHTML = CurbarHTML(), o.tab === "tree" && setTimeout(() => {
    (tu(!1), ja());
  }, 0), o.tab === "tree" && setTimeout(() => {
    if (o.advTab === "base" || o.advTab === "star") AdvAfterRender(); else (tu(!1), ja());
  }, 0), o.tab === "atlas" && setTimeout(AtlasAfterRender, 0));
};
Cp = function () {
  let _v2060 = o.S, _v2061 = _v2062 => _v2060.a[_v2062] || 0, _v2063 = (_v2064, _v2065) => `<div class="row"><span>${_v2064}</span><b>${_v2065}</b></div>`, _v2066 = o.Z && o.Z.ms && o.Z.ms.mods.playerRes || 0, _v2067 = _v2068 => {
    let _v2069 = _v2060.res[_v2068] - _v2066;
    return `<span style="color:${_v2069 >= UniqueResCap() ? "var(--up)" : _v2069 < 0 ? "var(--down)" : "inherit"}">${Math.min(UniqueResCap(), _v2069)}%${_v2069 > UniqueResCap() ? " (" + _v2069 + ")" : ""}</span>`;
  }, _v2070 = `<div class="sec">${te[h.cls].n}${h.asc ? " · " + Me[h.asc].n : ""}</div><div class="dim" style="font-size:11.5px">${te[h.cls].trait}</div>`;
  return (_v2070 += '<div class="sec">防御</div>' + _v2063("最大生命", Math.round(_v2060.maxLife)) + _v2063("能量护盾", Math.round(_v2060.maxES)) + _v2063("最大魔力", Math.round(_v2060.maxMana)) + _v2063("护甲", Math.round(_v2060.armour)) + _v2063("火焰抗性", _v2067("fire")) + _v2063("冰霜抗性", _v2067("cold")) + _v2063("闪电抗性", _v2067("light")) + _v2063("生命回复", At(_v2060.regen) + "/秒") + _v2063("生命偷取", (_v2060.leech * 100).toFixed(1) + "%"), _v2070 += _v2063("格挡几率", Math.round(_v2060.block || 0) + "%") + _v2063("精魂", _v2060.spUsed + " / " + _v2060.spMax) + _v2063("药剂效果", "×" + (_v2060.flaskEff || 1).toFixed(2)), _v2060.buffs.size && (_v2070 += '<div class="sec">精魂增益</div>' + [..._v2060.buffs].map(_v2071 => {
    let _v2072 = Ee[_v2071] || ze[_v2071];
    return _v2063(`<span style="color:${_v2072.col}">${_v2072.n}</span>`, _v2072.spirit);
  }).join("")), (_v2060.souls || []).length && (_v2070 += '<div class="sec">伙伴</div>' + _v2060.souls.map(_v2073 => _v2063(`<span style="color:${Se[_v2073.beast].col}">${B(Se[_v2073.beast].n)}</span>`, Pe(Na(_v2073)) + "/秒")).join("")), _v2070 += '<div class="sec">收益与机动</div>' + _v2063("图谱路线", gc(tr())) + _v2063("物品稀有度", "+" + Math.round(_v2060.rarity) + "%") + _v2063("物品数量", "+" + Math.round(_v2060.quant) + "%") + _v2063("移动速度", "+" + Math.round(_v2061("moveInc")) + "%") + _v2063("翻滚冷却", _v2060.rollCd.toFixed(2) + " 秒"), _v2070 += '<div class="sec">技能 DPS(单体估算)</div>' + h.skills.map((_v2074, _v2075) => _v2074 ? _v2063(X[_v2074.gid].n + (o.SKC[_v2075].wtOK ? "" : " ✕"), o.SKC[_v2075].wtOK ? Pe(o.SKC[_v2075].dps) : "需要" + o.SKC[_v2075].wtNeed) : "").join(""), _v2060.ks.size && (_v2070 += '<div class="sec">基石天赋</div>' + [..._v2060.ks].map(_v2076 => _v2063((at.nodes.find(_v2077 => _v2077.ks === _v2076) || ({
    name: _v2076
  })).name, "✓")).join("")), _v2070);
};
ss = function (_v2078, _v2079) {
  if (_v2078 && _v2078.kind === "jewel") return JewelTooltip(_v2078);
  if (_v2078.kind === "gem") {
    let _v2080 = X[_v2078.gid], _v2081 = _i(_v2078, o.S), _v2082 = ln(_v2078.lvl);
    return {
      b: "#2ec4a0",
      h: `<div class="th" style="color:#4fe0c0">${_v2080.n}<small>主动技能宝石${_v2080.wt ? " · " + _v2080.wt.map(_v2083 => Et[_v2083]).join("/") : ""}</small></div><div class="tb"><div class="p">${_v2080.tags.map(_v2084 => bl[_v2084] || _v2084).join(" · ")}</div>${(() => {
        let _v2085 = $o.filter(_v2086 => Lt[_v2086].pool.includes(_v2078.gid));
        return _v2085.length ? '<div class="p" style="color:#e8c890">' + _v2085.map(_v2087 => te[_v2087].n).join("/") + " 专属技能</div>" : "";
      })()}<div class="p">等级 <b>${_v2078.lvl}</b> · 插槽 <b>${_v2078.sock}</b>/5${_v2080.cd ? " · 冷却 <b>" + _v2081.cd.toFixed(1) + "s</b>" : ""} · 经验 <b>${_v2078.lvl >= 20 ? "MAX" : Pe(_v2078.xp) + "/" + Pe(_v2082)}</b></div><div class="sep"></div><div class="md">${_v2080.d}</div><div class="sep"></div>${_v2081.wtOK ? `<div class="p">按当前装备: DPS <b>${Pe(_v2081.dps)}</b> · 均伤 <b>${Pe(_v2081.avg)}</b></div>` : `<div class="p" style="color:var(--down)">需要装备 ${_v2081.wtNeed}</div>`}${_v2080.tags.includes("attack") ? '<div class="hint">使用武器伤害 · 伤害效用 ' + Math.round(_v2080.eff * (1 + 0.03 * (_v2081.lvl - 1)) * 100) + "%</div>" : '<div class="hint">装备上的附加伤害对法术按 60% 生效</div>'}${_v2080.tags.includes("melee") ? '<div class="hint" style="color:#e8b070">近战本能: 伤害总增 40% · 范围 +15% · 命中积累斗志(每层受到伤害 -2%、近战攻速 +1%) · 命中回复生命</div>' : ""}</div>`
    };
  }
  if (_v2078.kind === "buff") {
    let _v2088 = Ee[_v2078.gid], _v2089 = o.S.buffs.has(_v2078.gid) && _v2079 === "buff";
    return {
      b: _v2088.col,
      h: `<div class="th" style="color:${_v2088.col}">${_v2088.n}<small>精魂宝石 · 持续增益</small></div><div class="tb"><div class="p">保留 <b>${_v2088.spirit}</b> 精魂 · 当前 ${o.S.spUsed}/${o.S.spMax}</div><div class="sep"></div><div class="md">${_v2088.d}</div><div class="sep"></div><div class="hint">${_v2079 === "buff" ? _v2089 ? "生效中 · 点击卸下" : "精魂不足, 未生效 · 点击卸下" : "点击放入增益槽"}</div></div>`
    };
  }
  if (_v2078.kind === "meta") {
    let _v2090 = ze[_v2078.gid], _v2091 = _v2079 === "buff" && o.S.buffs.has(_v2078.gid);
    return {
      b: _v2090.col,
      h: `<div class="th" style="color:${_v2090.col}">${_v2090.n}<small>元技能宝石 · 保留 ${_v2090.spirit} 精魂</small></div><div class="tb"><div class="md">${_v2090.d}</div><div class="sep"></div><div class="p">内含法术: ${_v2078.inner.map(_v2092 => _v2092 ? X[_v2092.gid].n : "空").join(" / ")}</div><div class="p">能量 <b>${Math.floor(_v2078.energy || 0)}</b>/100</div><div class="hint">只能插入定点、投射或印记类法术 · ${_v2079 === "buff" ? _v2091 ? "生效中" : "精魂不足" : "点击放入精魂槽"}</div></div>`
    };
  }
  if (_v2078.kind === "sup") {
    let _v2093 = Y[_v2078.gid];
    return {
      b: _v2093.mech ? "#c8a040" : "#2ec4a0",
      h: `<div class="th" style="color:${_v2093.mech ? "#ffd27a" : "#4fe0c0"}">${_v2093.n}<small>${_v2093.mech ? "机制辅助宝石" : "辅助宝石"}</small></div><div class="tb"><div class="p">适用: ${_v2093.req ? _v2093.req.split("|").map(_v2094 => _v2094.split("+").map(_v2095 => bl[_v2095] || _v2095).join(" + ")).join(" 或 ") : "所有技能"}${_v2093.noChannel ? " (非引导)" : ""}</div><div class="sep"></div><div class="md">${_v2093.d}</div><div class="sep"></div><div class="p" style="color:${Go[_v2078.gid] ? Ns : "#6a5a50"}">${Go[_v2078.gid] ? "<span>插在兽栏 · 对伙伴:</span> " + bu(_v2078.gid) : "插在兽栏: 对伙伴无效"}</div><div class="hint">每个辅助使技能消耗 ×1.1</div></div>`
    };
  }
  if (_v2078.kind === "map") {
    let _v2096 = qs(_v2078);
    return {
      b: "#c8c8c8",
      h: `<div class="th" style="color:${["#f0f0f0", "#8a8cff", "#ecd85a"][_v2078.rarity]}">${B(_v2078.name)}<small>T${_v2078.tier} 地图 · ${B(_v2078.base)}</small></div><div class="tb"><div class="p">区域等级 <b>${Os(_v2078.tier)}</b> · 物品数量 <b>+${_v2096.quant}%</b> · 稀有度 <b>+${_v2096.rar}%</b></div>${_v2078.tier >= 17 ? '<div class="p t17">深渊之境 · 怪物生命 +120% · 伤害 +60% · 速度 +20% · 魔法/稀有怪大幅增加</div><div class="p t17r">首领必掉神圣石与崇高石 ×2 · 高几率额外传奇 · 40% 掉落新的 T17</div>' : ""}${_v2078.dbg ? '<div class="p" style="color:#7fe0ff">' + Pg(_v2078) + "</div>" : ""}${_v2078.mods.length ? '<div class="sep"></div>' + _v2078.mods.map(_v2097 => {
        let _v2098 = So[_v2097.id];
        return `<div class="md">${B(ea(_v2098, _v2097.v))}<span class="tg">${_v2098.t === "P" ? "前缀" : "后缀"} 数量+${_v2098.q[_v2097.ti]}%</span></div>`;
      }).join("") : ""}${_v2078.invest ? '<div class="sep"></div><div class="p">已投入 <b>' + At(_v2078.invest) + "c</b></div>" : ""}<div class="sep"></div><div class="hint">${_v2079 === "dev" ? "点击取回" : "点击放入地图装置"} · 可用通货改造</div></div>`
    };
  }
  if (_v2078.kind === "soul") return D4(_v2078, _v2079);
  let _v2099 = he[_v2078.base], _v2100 = _v2078.rarity === 3 ? Ra[_v2078.uniq] : null, _v2101 = `<div class="th" style="color:${oo[_v2078.rarity]}">${B(_v2078.name)}${_v2078.rarity >= 2 || _v2100 ? "<small>" + B(_v2078.base) + "</small>" : ""}</div><div class="tb"><div class="p">${_v2099.wt ? Et[_v2099.wt] : rs[_v2078.slot]} · 物品等级 <b>${_v2078.ilvl}</b></div>`;
  if (_v2099.wpn) {
    let _v2102 = _v2078.mods.filter(_v2103 => _v2103.id === "physInc").reduce((_v2104, _v2105) => _v2104 + _v2105.v[0], 0) + RunePhysIncOf(_v2078), _v2106 = _v2078.mods.filter(_v2107 => _v2107.id === "addPhys").reduce((_v2108, _v2109) => [_v2108[0] + _v2109.v[0], _v2108[1] + _v2109.v[1]], [0, 0]);
    (_v2101 += `<div class="p">物理伤害 <b style="color:${_v2102 || _v2106[0] ? "#8f9cff" : ""}">${Math.round((_v2099.wpn[0] + _v2106[0]) * (1 + _v2102 / 100))}–${Math.round((_v2099.wpn[1] + _v2106[1]) * (1 + _v2102 / 100))}</b> · 攻速 <b>${_v2099.aps}</b> · 暴击 <b>${_v2099.crit}%</b></div>`, _v2099.wt !== te[h.cls].wt && (_v2101 += '<div class="hint">非本职业初始武器, 需要配合对应技能宝石</div>'));
  }
  if ((_v2099.def && (_v2101 += `<div class="p">${Object.entries(_v2099.def).map(([_v2110, _v2111]) => (_v2110 === "es" ? "能量护盾 " : "护甲 ") + "<b>" + _v2111 + "</b>").join(" · ")}</div>`), _v2078.impl.length && (_v2101 += '<div class="sep"></div>' + _v2078.impl.map(_v2112 => `<div class="md">${B(ea(Yt[_v2112.id], _v2112.v))}</div>`).join("")), _v2078.cimpl && (_v2101 += '<div class="sep"></div><div class="md" style="color:#ff6060">' + B(Vs(_v2078.cimpl.k, _v2078.cimpl.v)) + '<span class="tg">腐化</span></div>'), _v2078.cimpl2 && (_v2101 += '<div class="md" style="color:#ff6060">' + B(Vs(_v2078.cimpl2.k, _v2078.cimpl2.v)) + '<span class="tg">双重腐化</span></div>'), _v2078.mods.length && (_v2101 += AffixBlocksHTML(_v2078)), _v2078.meta && (_v2101 += `<div class="md metal">◈ ${_v2078.meta === "P" ? "前缀无法被改变" : "后缀无法被改变"} <span class="tg">${_v2078.meta === "P" ? "工艺 · 占用 1 个后缀" : "工艺 · 占用 1 个前缀"}</span></div>`), _v2078.ds && (_v2101 += `<div class="md dsline">◇ 未揭示的渎灵词缀 <span class="tg ds">${F[_v2078.ds.bone].n}</span> <small class="dim">去灵魂之井揭示</small></div>`), _v2100 && (_v2101 += _v2100.st.map(_v2113 => `<div class="sp">${_v2113}</div>`).join(""), _v2101 += `<div class="sep"></div><div class="fl">${_v2100.fl}</div>`), _v2078.rsock)) {
    _v2101 += '<div class="sep"></div>';
    for (let _v2114 = 0; _v2114 < _v2078.rsock; _v2114++) {
      let _v2115 = (_v2078.runes || [])[_v2114];
      _v2101 += _v2115 ? `<div class="md" style="color:${F[_v2115].col}">◆ ${F[_v2115].n}: ${c2(_v2115, _v2078.slot)}</div>` : '<div class="p dim">◇ 空符文插槽</div>';
    }
  }
  _v2101 += RuneWordTipHTML(_v2078);
  if (gl(_v2078.slot)) {
    let _v2116 = h.equip.weapon && he[h.equip.weapon.base].wt || "none";
    (Fa[_v2116] || []).includes(ka[_v2078.slot]) || (_v2101 += '<div class="hint" style="color:var(--down)">与当前武器不兼容</div>');
  }
  return (_v2078.corrupted && (_v2101 += `<div class="p" style="color:#ff5050;font-weight:700">${_v2078.dc ? "双重腐化 · " + (jl[_v2078.dc] || [""])[0] : "已腐化"}</div>`), _v2101 += ep(_v2078), _v2079 === "inv" && (_v2101 += Kn(_v2078)), _v2101 += `<div class="sep"></div><div class="hint">${_v2079 === "inv" ? "左键装备 - 右键出售 - Alt+左键锁定" : _v2079 === "eq" ? "点击卸下" : ""}</div></div>`, {
    b: _v2078.rarity === 3 ? "#d2803a" : _v2078.rarity === 2 ? "#8a7a24" : _v2078.rarity === 1 ? "#3e40a0" : "#666",
    h: _v2101
  });
};
zr = function (_v2117) {
  let _v2118 = F[_v2117];
  if (_v2118.grp === "rune") {
    let _v2119 = (RUNE_WORDS || []).filter(function (_v2120) {
      return _v2120.seq.indexOf(_v2117) >= 0;
    }).slice(0, 4).map(function (_v2121) {
      return _v2121.n;
    }).join(" / ");
    return {
      b: _v2118.col,
      h: '<div class="th" style="color:' + _v2118.col + '">' + _v2118.n + "<small>符文 · 持有 " + (h.cur[_v2117] || 0) + '</small></div><div class="tb"><div class="md">武器: ' + c2(_v2117, "W") + '</div><div class="md">防具: ' + c2(_v2117, "A") + "</div>" + (_v2119 ? '<div class="sep"></div><div class="p" style="color:#e8c870">参与符文之语: ' + _v2119 + "</div>" : "") + '<div class="sep"></div><div class="p">账本估值 <b>' + At(_v2118.v) + 'c</b> · 获取: 工艺台「符文合成」</div><div class="hint">镶嵌在装备上生效 · 多颗符文的镶嵌顺序决定符文之语</div></div>'
    };
  }
  if (_v2118.grp === "omen") {
    let _v2122 = OmActive(_v2117), _v2123 = _v2118.og === "worldRes" || _v2118.og === "worldExp", _v2124 = OmIsAbyss(_v2117) ? "深渊预兆" : OmIsWorld(_v2117) ? "冒险预兆" : "工艺预兆", _v2125 = _v2118.mt > 1 ? "T" + _v2118.mt + "+ " : "", _v2126 = _v2123 ? "每个副本只能在战斗中触发一个预兆。" : OmIsAbyss(_v2117) ? "只在深渊/渎灵相关操作中生效 · 同类只能激活 1 个" : OmIsWorld(_v2117) ? "满足条件时自动触发并消耗" : "同类预兆只能激活 1 个 · 工艺预兆可以与其他类别并存";
    return {
      b: _v2122 ? "#c070ff" : "#8a7a9a",
      h: `<div class="th" style="color:${_v2122 ? "#d8a8ff" : "#b8a8c8"}">${_v2118.n}<small>预兆 · 持有 ${h.cur[_v2117] || 0}</small></div><div class="tb"><div class="md">此物品在你的背包中激活时, ${_v2118.d}</div><div class="sep"></div><div class="md">${_v2122 ? '<span style="color:#c070ff">已激活 · 下次满足条件时生效</span>' : "未激活 · 点击通货栏或工艺台里的预兆激活"}</div><div class="p">${_v2124} · ${_v2126}</div><div class="p">账本估值 <b>${At(_v2118.v)}c</b> · 来源: ${_v2125}宝箱、稀有怪与首领</div><div class="hint">点击此物品以将其激活。此物品触发效果时会被消耗。</div></div>`
    };
  }
  return {
    b: "#b4a070",
    h: `<div class="th" style="color:#e8d8a8">${_v2118.n}<small>通货 · 持有 ${h.cur[_v2117] || 0}</small></div><div class="tb"><div class="md">${_v2118.d}</div>${_v2118.grp === "bone" ? DsBoneTip(_v2117) : ""}<div class="sep"></div><div class="p">账本估值 <b>${At(_v2118.v)}c</b> · 掉落权重 <b>${_v2118.w}</b></div><div class="hint">点击选中, 再点击物品或地图使用</div></div>`
  };
};
Fl = function (_v2127, _v2128) {
  let _v2129 = _v2127.mods.filter(_v2130 => _v2130.t === _v2128 && AffixClass(_v2130) === "regular"), _v2131 = AffixSideCap(_v2127, _v2128), _v2132 = de.last && de.last.d ? de.last.d.filter(_v2133 => _v2133.k === "add" || _v2133.k === "ch" || _v2133.k === "fr").map(_v2134 => _v2134.m.id) : [], _v2135 = _v2129.map(_v2136 => {
    let _v2137 = jt(_v2127, _v2136.id), _v2138 = _v2137.ranges.length - _v2136.ti, _v2139 = (_v2136.fr ? '<i class="bst fr">破溃</i>' : _v2127.meta === _v2128 ? '<i class="bst lk">锁定</i>' : "") + (_v2136.ex ? '<i class="bst ex">超越</i>' : "") + (_v2136.dsec ? '<i class="bst ds">渎灵</i>' : "");
    return `<div class="baff${_v2138 === 1 ? " t1" : ""}${Gn(_v2127, _v2136) ? " fixed" : ""}${_v2136.fr ? " frx" : ""}${_v2132.includes(_v2136.id) ? " fresh" : ""}"><span class="btier">T${_v2138}</span><span class="btxt">${B(ea(_v2137, _v2136.v))}</span>${_v2139}</div>`;
  }).join("");
  _v2127.meta && _v2127.meta !== _v2128 && (_v2135 += `<div class="baff metarow"><span class="btier">◈</span><span class="btxt">${_v2127.meta === "P" ? "前缀锁定 · 占用 1 个后缀位" : "后缀锁定 · 占用 1 个前缀位"}</span><i class="bst lk">工艺</i></div>`);
  for (let _v2140 = _v2129.length; _v2140 < _v2131; _v2140++) _v2135 += '<div class="baff empty"><span class="btier">—</span><span class="btxt">空位</span></div>';
  return _v2135;
};
x5 = function (_v2141, _v2142) {
  let _v2143 = _v2142 ? zf(_v2141, _v2142) : "先选一件装备", _v2144 = h.cur[_v2141] || 0, _v2145 = OmHint(_v2141), _v2146 = _v2145 ? "预兆生效 · " + _v2145 : _v2141 === "vaal" && !_v2143 ? (h.pity || 0) >= Er ? "怨念已满 · 必出腐化词缀" : "赌一把 · 怨念 " + (h.pity || 0) + "/" + Er : np[_v2141] || "必定带有对应词缀";
  return `<button class="bcur${_v2143 ? " no" : ""}${_v2141 === "frac" ? " rare" : ""}${_v2145 ? " om" : ""}" data-bu="${_v2141}" data-tt="cur:${_v2141}"${_v2143 ? ` title="${B(_v2143)}"` : ""}><img src="${He[_v2141]}" alt=""><span class="bn">${F[_v2141].n}</span><b>${_v2144}</b><small>${_v2143 ? B(_v2143) : _v2146}</small></button>`;
};
io = function () {
  OmPrune();
  let _v2147 = de.mode === "rune";
  let _v2148 = Cs(), {eq: _v2149, inv: _v2150} = Dl(), _v2151 = (de.from === "eq" ? _v2149 : _v2150).map(_v2152 => Rs(_v2152, "bench", `data-bsel="${_v2152.uid}"${_v2152.uid === de.sel ? ' data-on="1"' : ""}`)).join("") || '<p class="dim">没有装备</p>', _v2153;
  if (_v2147) _v2153 = RuneCraftHTML(); else if (!_v2148) _v2153 = de.mode === "altar" ? `<div class="bempty">左边选一件<b>已腐化</b>的装备放上祭坛。</div>${Il(null)}` : '<div class="bempty">左边选一件装备开始。</div>'; else {
    let _v2154 = _v2148.kind === "soul" ? {} : he[_v2148.base], _v2155 = `<div class="bhead"><div class="bname" style="color:${oo[_v2148.rarity]}">${B(_v2148.name)}</div><div class="bsub">${_v2148.kind === "soul" ? Se[_v2148.beast].cls === "boss" ? "首领兽魂" : "野兽兽魂" : _v2154.wt ? Et[_v2154.wt] : rs[_v2148.slot]} · ${Bl[_v2148.rarity]} · 物品等级 ${_v2148.ilvl}${Pf(_v2148) ? ' · <span class="on">已装备</span>' : ""}${_v2148.dc ? ' · <span class="cor">双重腐化</span>' : _v2148.corrupted ? ' · <span class="cor">已腐化</span>' : ""}</div><button class="bshare" data-bshare="1" title="把这件装备和它的铸造履历做成一张图">晒图卡</button>${_v2148.kind === "soul" ? `<div class="bdps">伙伴单体伤害估算 <b style="color:${Se[_v2148.beast].col}">${Pe(Na(_v2148))}</b>/秒</div>` : ""}</div>`, _v2156;
    _v2148.rarity === 3 ? _v2156 = `<div class="bcol wide"><h4>传奇词缀 <small>固定</small></h4>${_v2148.mods.filter(_v2157 => _v2157.t === "U").map(_v2158 => `<div class="baff"><span class="btier">U</span><span class="btxt">${B(ea(jt(_v2148, _v2158.id), _v2158.v))}</span></div>`).join("")}<p class="dim bhint">传奇固定词缀不占 10 词条栏位，也不受栏位限制；传奇装备只能用神圣石重随数值, 或者用瓦尔宝珠腐化。</p></div>` : _v2148.rarity === 0 ? _v2156 = '<div class="bcol wide"><h4>没有词缀</h4><p class="dim bhint">普通物品: 用蜕变石变成魔法, 点金石变成稀有, 或者用精华直接做出带指定词缀的稀有装备。</p></div>' : _v2156 = `<div class="bcol"><h4>前缀 <small>${AffixRegCount(_v2148, "P")}/${AffixSlotCfg().regularPerSide}</small></h4>${Fl(_v2148, "P")}</div><div class="bcol"><h4>后缀 <small>${AffixRegCount(_v2148, "S")}/${AffixSlotCfg().regularPerSide}</small></h4>${Fl(_v2148, "S")}</div>${AffixSlotRowsHTML(_v2148, "sp")}${AffixSlotRowsHTML(_v2148, "dsec")}`;
    let _v2159 = _v2148.rarity <= 2 && !_v2148.corrupted && _v2148.kind !== "soul";
    _v2153 = de.mode === "altar" ? `${_v2155}${AffixStatusHTML(_v2148)}<div class="baffs">${_v2156}</div>${Il(_v2148)}` : `${_v2155}${AffixStatusHTML(_v2148)}<div class="baffs">${_v2156}</div>
		  <div class="bsec"><h4>通货 <small>灰色的按钮会说明为什么不能用</small></h4><div class="bcurs">${op.map(_v2160 => x5(_v2160, _v2148)).join("")}</div>
		  ${_v2159 ? `<h4>精华 <small>普通/魔法 → 稀有; 稀有装备会重铸 (保留破溃和锁定的一侧), 必定带有对应词缀</small></h4><div class="bcurs ess">${If.map(_v2161 => x5(_v2161, _v2148)).join("")}</div>` : ""}</div>
		  <div class="bsec"><h4>预兆 <small>点击激活 · 同类只能激活 1 个 · 下次对应操作时自动消耗</small></h4><div class="bcurs oms">${OmBenchRow()}</div></div>
		  <div class="bsec"><h4>工艺 · 神圣石 <small>锁定会占用另一侧 1 个位置, 解除免费</small></h4><div class="bmetas">${G1("lockP", _v2148)}${G1("lockS", _v2148)}<button class="bmeta${_v2148.meta ? "" : " no"}" data-bu="unlock"><span class="bn">解除锁定</span><span class="bcost">免费</span><small>${_v2148.meta ? "腾出被占用的位置" : "没有锁定"}</small></button></div></div>
		`;
  }
  let _v2162 = de.mode === "altar";
  let _v2163 = _v2147 ? RuneBenchHelp() : `<section class="bpick"><div class="shoptabs"><button class="${de.from === "eq" ? "on" : ""}" data-bfrom="eq">已装备 <small>${_v2149.length}</small></button><button class="${de.from === "inv" ? "on" : ""}" data-bfrom="inv">背包 <small>${_v2150.length}</small></button></div><div class="grid bgrid">${_v2151}</div><div class="blastw"><h4>上一次操作</h4>${cp()}</div></section>`;
  (Ue(`<div class="ovbox bench${_v2162 ? " altarmode" : ""}${_v2147 ? " runemode" : ""}"><div class="bmodes"><button class="${!_v2162 && !_v2147 ? "on" : ""}" data-bmode="craft">工艺台</button><button class="${_v2162 ? "on" : ""}" data-bmode="altar">余烬祭坛</button><button class="${_v2147 ? "on" : ""}" data-bmode="rune">符文合成</button></div><p class="bintro">${_v2147 ? "40 级符文 · <b>低阶合成 / 升阶合成 / 定向合成</b> 三条路线 · 符文镶嵌顺序决定符文之语是否激活" : _v2162 ? "已腐化的装备可以在这里<b>再腐化一次</b> · 30% 超越 T1 · 30% 化为余烬 · 每件装备只能献祭一次" : "通货操作<b>不可逆</b>，点击即生效，请谨慎操作 · 每次结果都会标出<b>出现概率</b>"}</p>
		 <div class="bcols">
		  ${_v2163}
		  <section class="bwork">${_v2153}</section>
		 </div>
		 <div class="ovbtns"><button class="btn" id="bClose">离开 <kbd>Esc</kbd></button></div></div>`), A("#bClose").onclick = lp, document.querySelectorAll("#overlay [data-bfrom]").forEach(_v2164 => _v2164.onclick = () => {
    (de.from = _v2164.dataset.bfrom, io());
  }), document.querySelectorAll("#overlay [data-bsel]").forEach(_v2165 => _v2165.onclick = _v2166 => {
    (_v2166.stopPropagation(), de.sel = +_v2165.dataset.bsel, de.last = null, M("pick", 0.5), io());
  }), document.querySelectorAll("#overlay [data-bu]").forEach(_v2167 => _v2167.onclick = () => {
    if (rp(_v2167.dataset.bu)) {
      io();
      let _v2168 = document.querySelector("#overlay .blast");
      (_v2168 && _v2168.classList.add("pop"), de.last && de.last.vaal && Pl(Ri(Cs(), de.last.vaal)));
    }
  }), document.querySelectorAll("#overlay [data-omen]").forEach(_v2169 => _v2169.onclick = _v2170 => {
    (_v2170.stopPropagation(), OmToggle(_v2169.dataset.omen), io());
  }), document.querySelectorAll("#overlay [data-rune]").forEach(_v2171 => _v2171.onclick = () => {
    let _v2172 = RuneCraft(_v2171.dataset.rune);
    if (_v2172) (P(_v2172), M("nomana", 0.5)); else (M("craft"), P("合成成功 · " + F[RuneRecipes().filter(_v2173 => _v2173.id === _v2171.dataset.rune)[0].out].n));
    io();
  }), document.querySelectorAll("#overlay [data-bmode]").forEach(_v2174 => _v2174.onclick = () => {
    de.mode !== _v2174.dataset.bmode && (de.mode = _v2174.dataset.bmode, de.last = null, M("pick", 0.5), io());
  }));
  let _v2175 = document.querySelector("#overlay [data-bshare]");
  (_v2175 && (_v2175.onclick = () => zl(Cs(), "item")), document.querySelectorAll("#overlay [data-altar]").forEach(_v2176 => _v2176.onclick = () => ip(_v2176.dataset.altar)));
};
o3 = function (_v2177, _v2178) {
  let _v2179 = (o.S.rarity + o.Z.ms.rar + DelRarityBonus() + (o.endlessMode ? o.endlessIntensity * 70 : 0) + _v2178) / 100, _v2180 = o.Z && o.Z.th && o.Z.th.key === "swamp" ? 1.6 : 1, _v2181 = ht([0, 1, 2, 3], _v2182 => [100, 32 * (1 + _v2179), 7 * (1 + _v2179), 0.6 * (1 + _v2179) * _v2180][_v2182]);
  if (_v2181 === 3) {
    let _v2183 = lt.filter(_v2184 => _v2184.src === "world" && !_v2184.noDrop && _v2184.lv <= _v2177 + 5);
    if (_v2183.length) return _t(se(_v2183), _v2177);
  }
  let _v2185 = ht(["W", "O", "H", "B", "G", "F", "L", "R", "A"], _v2186 => _v2186 === "O" ? 0.9 : _v2186 === "L" ? 0.7 : _v2186 === "W" && o.Z && o.Z.th && o.Z.th.key === "lava" ? 1.6 : 1), _v2187 = [_v2185];
  if (_v2185 === "O") {
    let _v2188 = ["Q", "S", "X", "K"], _v2189 = h.equip.weapon && he[h.equip.weapon.base].wt || "none", _v2190 = Fa[_v2189] || [], _v2191 = _v2188.filter(_v2192 => _v2190.includes(ka[_v2192]));
    _v2187 = _v2191.length && j() < 0.7 ? _v2191 : _v2188;
  }
  let _v2193 = Ca.filter(_v2194 => _v2187.includes(_v2194.slot) && _v2194.lv <= _v2177);
  if ((_v2193.length || (_v2193 = Ca.filter(_v2195 => _v2195.slot === "H" && _v2195.lv <= _v2177)), _v2185 === "W" && j() < 0.6)) {
    let _v2196 = _v2193.filter(_v2197 => Lt[h.cls].wts.includes(_v2197.wt));
    _v2196.length && (_v2193 = _v2196);
  }
  let _v2198 = ht(_v2193, _v2199 => 1 + _v2199.lv / 20);
  return la(_v2198, _v2177, Math.min(2, _v2181));
};
n3 = function (_v2200) {
  if (_v2200.kind === "cur") {
    let _v2201 = _v2200.cur;
    (_v2200.txt = F[_v2201].n, _v2200.fg = "#c8b890", _v2200.bg = "rgba(10,8,12,0.82)", _v2200.bd = null, _v2200.size = 6, (_v2201 === "chaos" || _v2201 === "alch" || _v2201 === "regal") && (_v2200.fg = "#e8c870", _v2200.bd = "#7a6430"));
    let _v2202 = F[_v2201].grp;
    (_v2202 === "sock" && (_v2200.fg = "#5fe0c0", _v2200.bd = "#1f6a58", (_v2201 === "jewel3" || _v2201 === "artif") && (_v2200.beam = "#5fe0c0", _v2200.size = 6.5)), _v2202 === "rune" && (_v2200.fg = F[_v2201].col, _v2200.bd = "#5a5a5a"), _v2202 === "ess" && (_v2200.fg = F[_v2201].col, _v2200.bd = F[_v2201].col, _v2200.size = 6.5, _v2200.beam = F[_v2201].col), _v2202 === "omen" && (_v2200.fg = "#e8d090", _v2200.bg = "rgba(20,8,28,0.94)", _v2200.bd = "#a05ad0", _v2200.size = 7, _v2200.beam = "#c070ff", _v2200.snd = "exalt"), _v2201 === "vaal" && (_v2200.fg = "#ff6060", _v2200.bd = "#801818"), _v2202 === "sig" && (_v2200.fg = F[_v2201].col, _v2200.bd = F[_v2201].col, _v2200.bg = "rgba(16,6,24,0.92)", _v2200.size = 7.5, _v2200.beam = F[_v2201].col, _v2200.snd = "unique", _v2200.big = 1), _v2201 === "exalt" && (_v2200.fg = "#fff0b0", _v2200.bd = "#e8c870", _v2200.size = 7, _v2200.beam = "#ffe080", _v2200.snd = "exalt"), _v2201 === "ember" && (_v2200.fg = "#ffb080", _v2200.bg = "rgba(42,8,2,0.94)", _v2200.bd = "#ff5a24", _v2200.size = 7.5, _v2200.beam = "#ff5a24", _v2200.snd = "unique", _v2200.big = 1), _v2201 === "ash" && (_v2200.fg = "#c8bab2", _v2200.bd = "#6a5e58"), _v2201 === "frac" && (_v2200.fg = "#ffd8a8", _v2200.bg = "rgba(40,18,6,0.94)", _v2200.bd = "#d89a5a", _v2200.size = 7.5, _v2200.beam = "#ffb060", _v2200.snd = "exalt", _v2200.big = 1), _v2201 === "divine" && (_v2200.fg = "#b01818", _v2200.bg = "rgba(248,240,226,0.96)", _v2200.bd = "#b01818", _v2200.size = 8, _v2200.beam = "#fff2d0", _v2200.snd = "divine", _v2200.big = 1), _v2200.snd || (_v2200.snd = _v2201 === "chaos" ? "chaos" : "drop"));
    return;
  }
  let _v2203 = _v2200.it;
  if (_v2203.kind === "meta") {
    (_v2200.txt = ze[_v2203.gid].n + " (元技能)", _v2200.fg = "#fff0b0", _v2200.bg = "rgba(24,16,4,0.9)", _v2200.bd = "#ffd060", _v2200.size = 7, _v2200.beam = "#ffd060", _v2200.snd = "unique");
    return;
  }
  if (_v2203.kind === "buff") {
    (_v2200.txt = Ee[_v2203.gid].n + " (精魄)", _v2200.fg = "#ffe080", _v2200.bg = "rgba(20,14,4,0.88)", _v2200.bd = "#e8c060", _v2200.size = 6.5, _v2200.beam = "#e8c060", _v2200.snd = "unique");
    return;
  }
  if (_v2203.kind === "gem" || _v2203.kind === "sup") {
    let _v2204 = _v2203.kind === "gem" && (X[_v2203.gid].wt || []).includes(te[h.cls].wt);
    (_v2200.txt = (_v2203.kind === "gem" ? X[_v2203.gid].n : Y[_v2203.gid].n) + (_v2203.kind === "gem" ? " (主动)" : " (辅助)"), _v2200.fg = "#4fe0c0", _v2200.bg = "rgba(6,16,14,0.85)", _v2200.bd = _v2204 ? "#e8c870" : "#1f6a58", _v2200.size = 6, _v2200.snd = "drop");
    return;
  }
  if (_v2203.kind === "soul") {
    let _v2205 = Se[_v2203.beast];
    (_v2200.txt = _v2203.name, _v2200.fg = ["#e8e0d0", "#8a8cff", "#ecd85a"][_v2203.rarity], _v2200.bg = "rgba(8,20,16,0.9)", _v2200.bd = _v2205.cls === "boss" ? "#ffd27a" : "#7affc8", _v2200.size = _v2205.cls === "boss" ? 7.5 : 6.5, _v2200.beam = _v2205.cls === "boss" ? _v2205.col : _v2203.rarity === 2 ? "#7affc8" : null, _v2200.snd = _v2205.cls === "boss" ? "unique" : "drop", _v2200.big = _v2205.cls === "boss" ? 1 : 0);
    return;
  }
  if (_v2203.kind === "map") {
    (_v2200.txt = "T" + _v2203.tier + " " + _v2203.name, _v2200.fg = "#f0f0f0", _v2200.bg = "rgba(10,10,10,0.85)", _v2200.bd = "#c8c8c8", _v2200.size = 6.5, _v2200.snd = "drop", o.Z && _v2203.tier > o.Z.tier && (_v2200.beam = "#e8e8e8"));
    return;
  }
  (_v2200.txt = _v2203.rarity === 3 ? he[_v2203.base].n : _v2203.name, _v2200.size = _v2203.rarity >= 2 ? 6.5 : 6, _v2200.bg = "rgba(10,8,12,0.78)", _v2200.bd = null, _v2200.fg = ["#d8d4cc", "#8a8cff", "#ecd85a", "#d2803a"][_v2203.rarity], _v2203.rarity === 3 ? (_v2200.bd = "#d2803a", _v2200.beam = "#e0904a", _v2200.snd = "unique", _v2200.size = 7) : _v2200.snd = null);
  let _v2206 = _v2203.rarity >= 1 && _v2203.rarity <= 2 ? Sl(_v2203) : 0;
  _v2206 && (_v2200.txt += " · T1" + (_v2206 > 1 ? "×" + _v2206 : ""), _v2200.bd = "#ffd27a", _v2203.rarity === 2 && (_v2200.size = 6.5));
};
Io = function (_v2207) {
  if (_v2207.kind === "cur") {
    let _v2208 = !!(F[_v2207.cur] && F[_v2207.cur].grp === "omen" && !h.omenSeen);
    return (h.cur[_v2207.cur] = (h.cur[_v2207.cur] || 0) + 1, o.run && (o.run.cur[_v2207.cur] = (o.run.cur[_v2207.cur] || 0) + 1, o.run.value += F[_v2207.cur].v, (!o.run.best || F[_v2207.cur].v > o.run.best.v) && (o.run.best = {
      n: F[_v2207.cur].n,
      v: F[_v2207.cur].v
    })), M("pick"), U(o.pl.x, o.pl.y - 22, 0, !1, "info", "+" + F[_v2207.cur].n), _v2208 && (h.omenSeen = 1, setTimeout(() => $e("预兆", "在通货栏或工艺台点击预兆即可激活 · 下次对应操作时自动生效并被消耗"), 600)), !0);
  }
  let _v2209 = _v2207.it;
  if (_v2209.kind === "gem" || _v2209.kind === "sup" || _v2209.kind === "buff" || _v2209.kind === "meta") h.gems.push(_v2209); else {
    if (!so(_v2209)) return (P(_v2209.kind === "map" ? o.touchMode ? "地图袋已满 (" + ra + ") · 在地图页批量出售, 或 3 张换 1 张高阶" : "地图袋已满 (" + ra + ") · 地图页(M)里右键出售, 或 3 张换 1 张高阶" : "背包已满, 打开背包出售物品"), !1);
    (h.inv.push(_v2209), _n(_v2209));
  }
  let _v2210 = A2(_v2209);
  return (o.run && (o.run.value += _v2210, o.run.items++, (_v2209.rarity === 3 || !o.run.best || _v2210 > o.run.best.v) && (o.run.best = {
    n: _v2209.name || _v2209.kind === "buff" && Ee[_v2209.gid].n || _v2209.kind === "meta" && ze[_v2209.gid].n || X[_v2209.gid] && X[_v2209.gid].n || Y[_v2209.gid] && Y[_v2209.gid].n || "宝石",
    v: _v2210
  })), M("pick"), !0);
};
Yl = function () {
  let _v2211 = null, _v2212 = 1e9;
  for (let _v2213 of o.objs) {
    if (!(_v2213.kind === "box" && !_v2213.open || WT.has(_v2213.kind))) continue;
    let _v2214 = (_v2213.x - o.pl.x) ** 2 + (_v2213.y - o.pl.y) ** 2, _v2215 = _v2213.kind === "device" ? 42 : _v2213.kind === "vendor" || _v2213.kind === "stash" || _v2213.kind === "bench" || _v2213.kind === "altar" || _v2213.kind === "monument" || _v2213.kind === "dog" || _v2213.kind === "well" || _v2213.kind === "ritual" || _v2213.kind === "simulacrum" ? 34 : 36;
    _v2214 < _v2215 * _v2215 && _v2214 < _v2212 && (_v2212 = _v2214, _v2211 = _v2213);
  }
  if (_v2211) {
    if (_v2211.kind === "box" && !_v2211.open) return (m0(_v2211), !0);
    if (_v2211.kind === "device") return (ca("map"), !0);
    if (_v2211.kind === "vendor") return (wf(), !0);
    if (_v2211.kind === "stash") return (g0(), !0);
    if (_v2211.kind === "bench" || _v2211.kind === "altar") return (Ei(_v2211.kind === "altar" ? "altar" : "craft"), !0);
    if (_v2211.kind === "well") return (DsWell(), !0);
    if (_v2211.kind === "ritual") return (RitualInteract(_v2211), !0);
    if (_v2211.kind === "simulacrum") return (SimulacrumInteract(), !0);
    if (_v2211.kind === "monument") return (u0(), !0);
    if (_v2211.kind === "dog") return (p0(), !0);
  }
  return l3();
};
m0 = function (_v2216) {
  jiBox(_v2216);
};
Zb = function (_v2217) {
  if (o.ritualPause) {
    let _v2218 = document.getElementById("overlay");
    if (!_v2218 || _v2218.hidden || !_v2218.querySelector(".ovbox.ritual")) o.ritualPause = !1; else return;
  }
  (o.T += _v2217, T2(_v2217), o.endlessMode && o.Z && o.Z.type === "map" && o.state === "play" && !o.pl.dead && (o.endlessSpawnT -= _v2217, o.endlessSpawnT <= 0 && (o.endlessSpawnT += 1, (function () {
    const _v2219 = o.endlessIntensity;
    o.endlessIntensityT = (o.endlessIntensityT ?? 0) - 1;
    const _v2220 = o.endlessIntensityT <= 0;
    if (_v2220) {
      o.endlessIntensityT = 5;
      o.endlessIntensity += 1;
    }
    if (o.run) o.run.intensity = o.endlessIntensity;
    A("#zinfo").textContent = "无尽强度 " + o.endlessIntensity + " · 怪物生命 ×" + (1 + o.endlessIntensity * 10) + " · 物品数量 +" + o.endlessIntensity * 70 + "% · 物品稀有度 +" + o.endlessIntensity * 70 + "%";
    A("#zmods").textContent = "每 5 秒强度 +1 · 怪物抗性最高 75% · 持续刷新全主题怪物";
    const _v2221 = (1 + o.endlessIntensity * 10) / (1 + _v2219 * 10);
    for (const _v2222 of o.mons) if (!_v2222.dead) {
      _v2222.hp *= _v2221;
      _v2222.maxhp *= _v2221;
      for (const _v2223 of ["phys", "fire", "cold", "light"]) _v2222.res[_v2223] = Math.min(75, Math.max(_v2222.res[_v2223] || 0, o.endlessIntensity * 10));
    }
    const _v2224 = [...new Set(Object.values(Wt).flatMap(_v2225 => Object.keys(_v2225.mon || ({}))))].filter(_v2226 => it[_v2226] && _v2226 !== "boss" && _v2226 !== "dummy");
    const _v2227 = [...new Set(Object.values(tt).map(_v2228 => _v2228.boss).filter(_v2229 => _v2229 && it[_v2229]))];
    const _v2230 = o.mons.reduce((_v2231, _v2232) => _v2231 + (!_v2232.dead ? 1 : 0), 0);
    const _v2233 = Math.min(8, 3 + Math.floor(o.endlessIntensity / 20));
    for (let _v2234 = 0; _v2234 < _v2233 && _v2230 + _v2234 < 120 && _v2224.length; _v2234++) {
      let _v2235 = Ge(o.pl.x, o.pl.y, O(150, 320));
      let _v2236 = we(_v2235.x, 48, o.Z.M.W * N - 48), _v2237 = we(_v2235.y, 48, o.Z.M.H * N - 48);
      if (Xt(_v2236, _v2237, 5)) continue;
      let _v2238 = _v2224[o.endlessSpawnIndex++ % _v2224.length];
      let _v2239 = j();
      let _v2240 = _v2239 < 0.025 ? 3 : _v2239 < Math.min(0.42, 0.12 + o.endlessIntensity * 0.001) ? 2 : _v2239 < 0.62 ? 1 : 0;
      let _v2241 = _e(_v2238, _v2236, _v2237, Math.max(o.Z.lvl, Math.floor(o.Z.lvl + o.endlessIntensity / 4)), _v2240);
      _v2241.aggro = true;
      _v2241.kbx = 0;
      _v2241.kby = 0;
      o.mons.push(_v2241);
    }
    o.endlessBossSpawnT = (o.endlessBossSpawnT || 0) - 1;
    if (_v2227.length && o.endlessBossSpawnT <= 0 && _v2230 < 116) {
      o.endlessBossSpawnT = 5;
      const _v2242 = _v2227[o.endlessSpawnIndex++ % _v2227.length];
      const _v2243 = Ge(o.pl.x, o.pl.y, O(260, 380));
      const _v2244 = we(_v2243.x, 56, o.Z.M.W * N - 56), _v2245 = we(_v2243.y, 56, o.Z.M.H * N - 56);
      if (!Xt(_v2244, _v2245, 6)) {
        const _v2246 = _e(_v2242, _v2244, _v2245, Math.max(o.Z.lvl, Math.floor(o.Z.lvl + o.endlessIntensity / 4)), 3);
        _v2246.aggro = true;
        _v2246.kbx = 0;
        _v2246.kby = 0;
        _v2246.endlessBoss = true;
        o.mons.push(_v2246);
        $e("无尽首领出现", (it[_v2242].n || _v2242) + " · 来自全地图首领池");
      }
    }
    if (Math.floor(_v2219 / 20) !== Math.floor(o.endlessIntensity / 20)) $e("无尽强度 " + o.endlessIntensity, "怪物不受击退 · 全地图怪物、传奇怪物、稀有怪与首领持续刷新");
  })())), o.Z.type === "map" && (o.Z.flowT -= _v2217, o.Z.flowT <= 0 && (o.Z.flowT = 0.3, iy()), o.Z.revT -= _v2217, o.Z.revT <= 0 && (o.Z.revT = 0.25, d3()), o.run && !o.pl.dead && (o.run.t += _v2217)));
  let _v2247 = [];
  for (let _v2248 of o.mons) _v2248.dead || Math.abs(_v2248.x - o.pl.x) < 380 && Math.abs(_v2248.y - o.pl.y) < 260 && (Gy(_v2248, _v2217), _v2248.dead || _v2247.push(_v2248));
  (f3(_v2247), S2(_v2217), M2(_v2217));
  for (let _v2249 = o.pend.length - 1; _v2249 >= 0; _v2249--) {
    let _v2250 = o.pend[_v2249];
    if ((_v2250.t -= _v2217, _v2250.t <= 0)) {
      o.pend.splice(_v2249, 1);
      try {
        _v2250.fn();
      } catch (_v2251) {
        console.error(_v2251);
      }
    }
  }
  ($2(_v2217), c3(_v2217), AbyssUpdate(_v2217), AbyssMods(_v2217), DeliriumUpdate(_v2217), RitualUpdate(_v2217), SimulacrumUpdate(_v2217), i3(_v2217), su(_v2217), o.mons.some(_v2252 => _v2252.dead) && (o.mons = o.mons.filter(_v2253 => !_v2253.dead)));
  let _v2254 = o.camFocus, _v2255 = (_v2254 ? _v2254.x : o.pl.x) - ys / 2, _v2256 = (_v2254 ? _v2254.y : o.pl.y) - vs / 2 + (_v2254 ? 0 : 10);
  (Ta.x += (_v2255 - Ta.x) * Math.min(1, _v2217 * 9), Ta.y += (_v2256 - Ta.y) * Math.min(1, _v2217 * 9));
  let _v2257 = o.Z.M.W * N, _v2258 = o.Z.M.H * N;
  (_v2254 && _v2254.free || (Ta.x = _v2257 > ys ? we(Ta.x, 0, _v2257 - ys) : (_v2257 - ys) / 2, Ta.y = _v2258 > vs ? we(Ta.y, 0, _v2258 - vs) : (_v2258 - vs) / 2), qy());
};
tn = function (_v2259) {
  if (_v2259 && _v2259.kind === "jewel") return P("天赋珠宝不能出售 · 请镶嵌到高级天赋树的珠宝栏");
  let _v2260 = h.inv.indexOf(_v2259);
  if (_v2260 < 0) return;
  h.inv.splice(_v2260, 1);
  let _v2261 = b0(_v2259);
  OmTake("omen_barter") && Object.keys(_v2261).forEach(_v2262 => _v2261[_v2262] *= 2);
  for (let _v2263 in _v2261) h.cur[_v2263] = (h.cur[_v2263] || 0) + _v2261[_v2263];
  Tl(_v2259, _v2261);
  let _v2264 = Object.entries(_v2261).map(([_v2265, _v2266]) => F[_v2265].n + (_v2266 > 1 ? "×" + _v2266 : "")).join(" ");
  (P(_v2264 ? "出售获得 " + _v2264 : "已出售"), M("pick"));
};
Qw = function (_v2267) {
  let _v2268 = o.Z && o.Z.type === "map" && o.state === "play", _v2269 = () => _v2268 ? !0 : (P("请先进入地图"), !1), _v2270 = _v2271 => Ge(o.pl.x + O(-_v2271, _v2271), o.pl.y + O(-_v2271, _v2271), 20);
  switch (_v2267) {
    case "grant":
      (Ii(), P("已发放: 全部宝石 / 通货 / 点数"));
      break;
    case "perf":
      X0();
      break;
    case "stress":
      {
        if (!_v2269()) return;
        let _v2272 = o.Z.th.mon, _v2273 = Object.keys(_v2272);
        for (let _v2274 = 0; _v2274 < 150; _v2274++) {
          let _v2275 = _v2270(220), _v2276 = _e(ht(_v2273, _v2277 => _v2272[_v2277]), _v2275.x, _v2275.y, o.Z.lvl, 0);
          (_v2276.aggro = !0, o.mons.push(_v2276));
        }
        P("压力测试: +150 只怪物 (F8 看性能)");
      }
      break;
    case "god":
      (h.god = !h.god, P(h.god ? "无敌已开启" : "无敌已关闭"));
      break;
    case "lv10":
    case "lv60":
      {
        let _v2278 = _v2267 === "lv60" ? 60 : Math.min(60, h.level + 10);
        for (; h.level < _v2278; ) h.level++;
        (h.xp = 0, P("等级 " + h.level));
        break;
      }
    case "sock":
      for (let _v2279 of [...h.skills, ...h.gems]) _v2279 && _v2279.kind === "gem" && (_v2279.lvl = 20, _v2279.sock = 5);
      P("所有主动宝石已 20 级 5 孔");
      break;
    case "cur999":
      rt.forEach(_v2280 => h.cur[_v2280] = 999999);
      break;
    case "trial":
      (h.trials = is.slice(), h.ascPts = 8, P("升华点 8"));
      break;
    case "atlas":
      (h.atlasPts = 28, P("图谱点 28"));
      break;
    case "cdr":
      (o.pl.cds = {}, o.pl.hp = o.S.maxLife, o.pl.mana = o.S.maxMana, o.pl.es = o.S.maxES, o.pl.ki = 10, o.pl.salvo = 6, h.flask.forEach(_v2281 => _v2281.ch = _v2281.max), P("冷却/资源已重置 · 刀意 10 · 冰箭 6"));
      break;
    case "rares":
      for (let _v2282 = 0; _v2282 < 10; _v2282++) {
        let _v2283 = null;
        for (let _v2284 = 0; _v2284 < 30 && !_v2283; _v2284++) {
          let _v2285 = se(Ca.filter(_v2286 => _v2286.lv <= Math.max(h.level, 10)));
          _v2283 = la(_v2285, Math.max(h.level, 10), 2);
        }
        _v2283 && so(_v2283) && h.inv.push(_v2283);
      }
      P("已生成稀有装备");
      break;
    case "offs":
      for (let _v2287 of Ca) (gl(_v2287.slot) || _v2287.slot === "L") && Ha() < ta && h.inv.push(la(_v2287, Math.max(h.level, _v2287.lv), 2));
      break;
    case "uniqs":
      for (let _v2288 of lt) {
        let _v2289 = _t(_v2288, Math.max(h.level, _v2288.lv));
        (_n(_v2289), so(_v2289) && h.inv.push(_v2289));
      }
      break;
    case "charges":
      (o.pl.pch = o.pl.fch = Yp(), o.pl.chT = 10, o.pl.rage = 40, o.pl.rageT = 5);
      break;
    case "metafull":
      h.buffs.forEach(_v2290 => {
        _v2290 && _v2290.kind === "meta" && (_v2290.energy = 99);
      });
      break;
    case "sigils":
      Xa.forEach(_v2291 => h.cur[_v2291] = (h.cur[_v2291] || 0) + 1);
      break;
    case "pinlv":
      (h.pinLv = Math.min(10, h.pinLv + 1), P("裂隙之心 Lv" + h.pinLv));
      break;
    case "enc":
      {
        if (!_v2269()) return;
        let _v2292 = _v2270(60), _v2293 = {
          kind: "enc",
          type: o.Z.th.key,
          x: _v2292.x,
          y: _v2292.y,
          st: "idle",
          t: 0
        };
        if (!tt[_v2293.type]) return;
        if ((o.objs.push(_v2293), _v2293.type === "ice")) {
          let _v2294 = _e("icechest", _v2292.x, _v2292.y, o.Z.lvl, 0);
          (_v2294.prop = !0, _v2294.encObj = _v2293, _v2294.res = {
            phys: 90,
            fire: -200,
            cold: 90,
            light: 90
          }, o.mons.push(_v2294), _v2293.st = "chest");
        }
        break;
      }
    case "crystal":
      {
        if (!_v2269()) return;
        for (let _v2295 = 0; _v2295 < 3; _v2295++) {
          let _v2296 = _v2270(60), _v2297 = _e("crystal", _v2296.x, _v2296.y, o.Z.lvl, 0);
          (_v2297.prop = !0, o.mons.push(_v2297));
        }
        break;
      }
    case "go_crypt":
    case "go_lava":
    case "go_ice":
    case "go_swamp":
      {
        let _v2298 = _v2267.slice(3), _v2299 = ia(10);
        (_v2299.theme = _v2298, _v2299.base = _v2299.name = Wt[_v2298].names[0], kt(), Pr(_v2299));
        let _v2300 = o.Z.boss;
        if (_v2300) {
          let _v2301 = Ge(_v2300.x, _v2300.y + 60, 30);
          (o.pl.x = _v2301.x, o.pl.y = _v2301.y, Ta.x = o.pl.x - ys / 2, Ta.y = o.pl.y - vs / 2);
        }
        return;
      }
    case "go_pin":
      (Xa.forEach(_v2302 => h.cur[_v2302] = Math.max(1, h.cur[_v2302] || 0)), Xp());
      return;
    case "maps":
      for (let _v2303 = 1; _v2303 <= 17; _v2303++) ao() < ra && h.inv.push(ia(_v2303));
      break;
    case "mapsR":
      for (let _v2304 = 0; _v2304 < 5; _v2304++) {
        let _v2305 = ia(16);
        (Bo("alch", _v2305), so(_v2305) && h.inv.push(_v2305));
      }
      break;
    case "ess":
      rt.forEach(_v2306 => {
        (F[_v2306].grp === "ess" || F[_v2306].grp === "rune" || F[_v2306].grp === "sock") && (h.cur[_v2306] = (h.cur[_v2306] || 0) + 20);
      });
      break;
    case "clear":
      if (!_v2269()) return;
      for (let _v2307 of o.mons) !_v2307.dead && !_v2307.dummy && _v2307.rar < 3 && er(_v2307, null, {
        weight: "heavy"
      });
      break;
    case "boss":
      {
        if (!_v2269()) return;
        let _v2308 = _v2270(60), _v2309 = _e((tt[o.Z.th.key] || ({})).boss || "boss", _v2308.x, _v2308.y, o.Z.lvl + 2, 3);
        (_v2309.aggro = !0, o.mons.push(_v2309), o.Z.boss = _v2309, o.Z.done = !1, P("首领出现"));
        break;
      }
    case "rift":
      {
        if (!_v2269()) return;
        let _v2310 = _v2270(50);
        (o.objs.push({
          kind: "rift",
          x: _v2310.x,
          y: _v2310.y,
          r: 8,
          st: "idle",
          t: 0,
          R: 0,
          spT: 0
        }), P("裂隙已生成 · 走进去开启"));
        break;
      }
    case "abyss":
      {
        if (!_v2269()) return;
        let _v2311 = _v2270(60);
        (o.objs.push(AbyssMake(_v2311.x, _v2311.y)), P("深渊裂缝已生成 · 靠近开启"));
        break;
      }
    case "shrine":
      {
        if (!_v2269()) return;
        let _v2312 = _v2270(40);
        o.objs.push({
          kind: "shrine",
          x: _v2312.x,
          y: _v2312.y,
          type: se(Ea).k,
          used: !1
        });
        break;
      }
    case "box":
      {
        if (!_v2269()) return;
        let _v2313 = _v2270(30);
        o.objs.push({
          kind: "box",
          x: _v2313.x,
          y: _v2313.y,
          r: 6,
          open: !1,
          ornate: ue("box3") && j() < 0.25
        });
        break;
      }
    case "pack":
      {
        if (!_v2269()) return;
        let _v2314 = o.Z.th.mon, _v2315 = Object.keys(_v2314);
        for (let _v2316 = 0; _v2316 < 8; _v2316++) {
          let _v2317 = _v2270(70), _v2318 = _e(ht(_v2315, _v2319 => _v2314[_v2319]), _v2317.x, _v2317.y, o.Z.lvl, _v2316 < 2 ? 2 : 1);
          (_v2318.aggro = !0, o.mons.push(_v2318));
        }
        break;
      }
    case "rain":
      if (!_v2269()) return;
      for (let _v2320 = 0; _v2320 < 40; _v2320++) ve(o.pl.x, o.pl.y, {
        kind: "cur",
        cur: h0()
      });
      break;
    case "ape":
      {
        if (!_v2269()) return;
        let _v2321 = _v2270(90), _v2322 = hc(_v2321.x, _v2321.y, o.Z.lvl + 1);
        _v2322.aggro = !0;
        break;
      }
    case "pet":
      (h.pets = [...new Set([...h.pets || [], "dragon"])], h.pet = "dragon", h.showPet = !0, P("千烬游龙 跟上了你"));
      break;
    case "souls":
      for (let _v2323 of Jc) if (Ha() < ta) {
        let _v2324 = hc(_v2323, Math.max(60, h.level));
        for (; _v2324.rarity < 2; ) {
          (_v2324.rarity = 2, _v2324.mods = []);
          for (let _v2325 = 0; _v2325 < 4; _v2325++) St(_v2324);
          ga(_v2324);
        }
        h.inv.push(_v2324);
      }
      P("已发放全部兽魂");
      break;
    case "omens":
      for (let _v2326 of rt) F[_v2326].grp === "omen" && (h.cur[_v2326] = (h.cur[_v2326] || 0) + 5);
      (P("已发放全部预兆 ×5"), ms());
      break;
    case "divine":
      if (!_v2269()) return;
      ve(o.pl.x, o.pl.y, {
        kind: "cur",
        cur: "divine"
      });
      break;
  }
  (me(), o.pl && (o.pl.hp = Math.min(o.pl.hp, o.S.maxLife)));
};
jT = function () {
  (A("#panel").addEventListener("click", _v2327 => {
    let _v2328 = o.held && !_v2327.target.closest('[data-act="cur"]') && _v2327.target.closest("[data-craft]");
    if (_v2328) {
      let _v2329 = aa(_v2328.dataset.craft);
      if (_v2329) {
        let _v2330 = _v2329.it, _v2331 = _v2330.mods ? Ci(_v2330) : null;
        Sa.last = null;
        let _v2332 = Bo(o.held, _v2330);
        if (_v2332) {
          P(_v2332);
          return;
        }
        (h.cur[o.held]--, (_v2330.kind === "item" || _v2330.kind === "soul") && jf(o.held, _v2330, Rr(o.held, _v2330, _v2331)), _v2330.kind === "map" && (_v2330.invest = (_v2330.invest || 0) + F[o.held].v), M("craft"), (o.held === "divine" || o.held === "exalt") && M(o.held === "divine" ? "chaos" : "exalt", 0.6), (_v2329.loc === "eq" || _v2329.loc === "skill" || _v2329.loc === "gems" || _v2329.loc === "minner" || _v2329.loc === "beast") && me());
        let _v2333 = o.held;
        ((!_v2327.shiftKey || !h.cur[_v2333]) && Za(null), ms());
        let _v2334 = document.querySelector(`[data-craft="${_v2330.uid}"]`);
        (_v2334 && _v2334.classList.add("pop"), o.tipKey = null, c0(fc("it:" + _v2330.uid), _v2327.clientX, _v2327.clientY), o.held && Za(o.held));
        return;
      }
    }
    let _v2335 = _v2327.target.closest("[data-act]");
    if (!_v2335) return;
    let _v2336 = _v2335.dataset.act;
    if (_v2336 !== "omen" && _v2336 !== "endless" && _v2336 !== "endless-lite") return;
    switch (_v2336) {
      case "omen":
        {
          let _v2337 = _v2335.dataset.k;
          if (!_v2337 || !F[_v2337]) return;
          (OmToggle(_v2337), ms());
          return;
        }
      case "cur":
        {
          let _v2338 = _v2335.dataset.k;
          if (!h.cur[_v2338]) {
            P("没有" + F[_v2338].n);
            return;
          }
          Za(o.held === _v2338 ? null : _v2338);
          return;
        }
      case "inv":
        {
          let _v2339 = aa(_v2335.dataset.uid);
          if (!_v2339) return;
          _v2339.it.kind === "map" ? (h.device && h.inv.push(h.device), h.device = _v2339.it, h.inv.splice(h.inv.indexOf(_v2339.it), 1), M("pick")) : _v2339.it.kind === "soul" ? Nb(_v2339.it) : _l(_v2339.it, _v2327.shiftKey);
          break;
        }
      case "beast":
        Hb(+_v2335.dataset.i, ta);
        break;
      case "mapin":
        {
          let _v2340 = aa(_v2335.dataset.uid);
          if (!_v2340) return;
          (h.device && h.inv.push(h.device), h.device = _v2340.it, h.inv.splice(h.inv.indexOf(_v2340.it), 1), M("pick"));
          break;
        }
      case "eq":
        {
          let _v2341 = _v2335.dataset.slot;
          if (!_v2341 || !h.equip[_v2341]) return;
          if (Ha() >= ta) {
            P("背包已满");
            return;
          }
          (h.inv.push(h.equip[_v2341]), h.equip[_v2341] = null, me());
          break;
        }
      case "dev":
        {
          if (!h.device) return;
          (h.inv.push(h.device), h.device = null);
          break;
        }
      case "open":
        o.endlessMode = !1;
        o.endlessLiteMode = !1;
        _b();
        return;
      case "endless-lite":
        {
          o.endlessMode = !0;
          o.endlessLiteMode = !0;
          o.endlessIntensity = 0;
          o.endlessIntensityT = 5;
          o.endlessSpawnT = 0;
          o.endlessSpawnIndex = 0;
          o.endlessBossSpawnT = 0;
          kt();
          let _v2342 = {
            ...ia(17),
            tier: 17,
            ilvl: 17,
            name: "低卡无尽试炼",
            rarity: 0,
            mods: [],
            invest: 0
          };
          Pr(_v2342);
          $e("低卡无尽模式开启", "无掉落 · 无怪物尸体与击杀特效 · 不触发击杀效果 · 每 5 秒强度 +1 · 按 T 返回藏身处结束");
          return;
        }
      case "endless":
        {
          o.endlessMode = !0;
          o.endlessLiteMode = !1;
          o.endlessIntensity = 0;
          o.endlessIntensityT = 5;
          o.endlessSpawnT = 0;
          o.endlessSpawnIndex = 0;
          o.endlessBossSpawnT = 0;
          kt();
          let _v2343 = {
            ...ia(17),
            tier: 17,
            ilvl: 17,
            name: "无尽试炼",
            rarity: 0,
            mods: [],
            invest: 0
          };
          Pr(_v2343);
          $e("无尽模式开启", "怪物受击击退为 0 · 全地图怪物、传奇怪物、稀有怪与首领持续刷新 · 每 5 秒强度 +1 · 按 T 返回藏身处结束");
          return;
        }
      case "free":
        h.device = ia(1);
        break;
      case "sellN":
      case "sellM":
        {
          let _v2344 = _v2336 === "sellN" ? 0 : 1, _v2345 = h.inv.filter(_v2346 => _v2346.kind === "item" && _v2346.rarity === _v2344);
          if (!_v2345.length) {
            P("没有可出售的物品");
            return;
          }
          _v2345.forEach(_v2347 => tn(_v2347));
          break;
        }
      case "sellLowMaps":
        {
          let _v2348 = to();
          if (!_v2348.length) {
            P("没有可出售的低阶地图 (只卖普通/魔法地图)");
            return;
          }
          _v2348.forEach(_v2349 => tn(_v2349));
          break;
        }
      case "mapUp":
        {
          let _v2350 = Nm(+_v2335.dataset.t);
          if (_v2350) {
            P(_v2350);
            return;
          }
          (P("换到 1 张 T" + (+_v2335.dataset.t + 1) + " 地图"), M("craft"));
          break;
        }
      case "filter":
        uf();
        return;
      case "reset":
        pc(!1);
        return;
      case "gslot":
        (o.selSlot = +_v2335.dataset.i, o.selMeta = null);
        break;
      case "msel":
        o.selMeta = {
          i: +_v2335.dataset.i,
          j: +_v2335.dataset.j
        };
        break;
      case "mout":
        {
          let _v2351 = h.buffs[+_v2335.dataset.i], _v2352 = +_v2335.dataset.j;
          _v2351 && _v2351.inner[_v2352] && (h.gems.push(_v2351.inner[_v2352]), _v2351.inner[_v2352] = null, me());
          break;
        }
      case "munsock":
        {
          let _v2353 = h.buffs[+_v2335.dataset.i], _v2354 = _v2353 && _v2353.inner[+_v2335.dataset.m];
          if (!_v2354) return;
          let _v2355 = _v2354.sup.splice(+_v2335.dataset.j, 1)[0];
          (_v2355 && h.gems.push(_v2355), me());
          break;
        }
      case "pin":
        Xp();
        return;
      case "favor":
        h.favor = _v2335.dataset.t || null;
        break;
      case "buildApply":
        {
          let _v2356 = es.find(_v2357 => _v2357.n === _v2335.dataset.n && _v2357.cls === h.cls);
          _v2356 && Df(_v2356);
          break;
        }
      case "gunslot":
        {
          let _v2358 = +_v2335.dataset.i, _v2359 = h.skills[_v2358];
          if (!_v2359) return;
          (h.skills[_v2358] = null, h.gems.push(_v2359), me());
          break;
        }
      case "gact":
        {
          let _v2360 = aa(_v2335.dataset.uid);
          if (!_v2360) return;
          if (o.selMeta) {
            let _v2361 = h.buffs[o.selMeta.i];
            if (!_v2361 || _v2361.kind !== "meta") return;
            if (!Dr(_v2360.it.gid)) {
              P("元技能只能插入定点或投射类法术");
              return;
            }
            (h.gems.splice(h.gems.indexOf(_v2360.it), 1), _v2361.inner[o.selMeta.j] && h.gems.push(_v2361.inner[o.selMeta.j]), _v2361.inner[o.selMeta.j] = _v2360.it, me(), M("craft"));
            break;
          }
          let _v2362 = h.skills[o.selSlot];
          (h.gems.splice(h.gems.indexOf(_v2360.it), 1), h.skills[o.selSlot] = _v2360.it, _v2362 && (_v2362.sup.forEach(_v2363 => {
            _v2360.it.sup.length < _v2360.it.sock ? _v2360.it.sup.push(_v2363) : h.gems.push(_v2363);
          }), _v2362.sup = [], h.gems.push(_v2362)), me(), M("pick"));
          break;
        }
      case "gsup":
        {
          let _v2364 = aa(_v2335.dataset.uid), _v2365 = tc();
          if (!_v2364 || !_v2365) {
            P("先选中一个有主动宝石的技能槽");
            return;
          }
          if (_v2365.sup.length >= _v2365.sock) {
            P("没有空插槽 · 用珠宝匠石增加插槽");
            return;
          }
          if (_v2365.sup.some(_v2366 => _v2366.gid === _v2364.it.gid)) {
            P("同一辅助不能重复插入");
            return;
          }
          (_o(Y[_v2364.it.gid], X[_v2365.gid]) || P("标签不匹配: 该辅助不会生效"), h.gems.splice(h.gems.indexOf(_v2364.it), 1), _v2365.sup.push(_v2364.it), me(), M("craft"));
          break;
        }
      case "unsock":
        {
          let _v2367 = h.skills[+_v2335.dataset.i].sup.splice(+_v2335.dataset.j, 1)[0];
          (_v2367 && h.gems.push(_v2367), me());
          break;
        }
      case "treeReset":
        (h.tree = [An(h.cls)], me());
        break;
      case "tzoom":
        {
          let _v2368 = +_v2335.dataset.z;
          (J.ox = J.size / 2 + (J.ox - J.size / 2) * _v2368, J.oy = J.size / 2 + (J.oy - J.size / 2) * _v2368, J.s = we(J.s * _v2368, 0.25, 3), ja());
          return;
        }
      case "tfit":
        (tu(!0), ja());
        return;
      case "ascPick":
        {
          (h.asc = _v2335.dataset.a, h.ascNodes = [], M("level"), $e("升华 · " + Me[h.asc].n, Me[h.asc].d), me());
          break;
        }
      case "ascNode":
        {
          let _v2369 = nd[_v2335.dataset.k];
          if (!_v2369 || h.ascNodes.includes(_v2369.k)) return;
          let _v2370 = Me[h.asc];
          if (!(_v2369.tier === 0 || _v2370.nodes.some(_v2371 => _v2371.tier === _v2369.tier - 1 && h.ascNodes.includes(_v2371.k)))) {
            P("需先点亮上一层的任意节点");
            return;
          }
          if (h.ascPts - h.ascNodes.length * 2 < 2) {
            P("升华点不足 · 完成更高阶地图的首领试炼");
            return;
          }
          (h.ascNodes.push(_v2369.k), M("unique"), me());
          break;
        }
      case "ascReset":
        (h.ascNodes = [], me());
        break;
      case "bact":
        {
          let _v2372 = aa(_v2335.dataset.uid);
          if (!_v2372) return;
          if (h.buffs.some(_v2373 => _v2373 && _v2373.gid === _v2372.it.gid)) {
            P("同名增益只能放一个");
            return;
          }
          let _v2374 = h.buffs.findIndex(_v2375 => !_v2375);
          if (_v2374 < 0) {
            P("精魂槽已满 · 点击已装备的卸下");
            return;
          }
          (h.gems.splice(h.gems.indexOf(_v2372.it), 1), h.buffs[_v2374] = _v2372.it, _v2372.it.kind === "meta" && (o.selMeta = {
            i: _v2374,
            j: 0
          }), me(), o.S.buffs.has(_v2372.it.gid) || P("精魂不足: " + (Ee[_v2372.it.gid] || ze[_v2372.it.gid]).n + " 未生效"), M("craft"));
          break;
        }
      case "bunslot":
        {
          let _v2376 = +_v2335.dataset.i, _v2377 = h.buffs[_v2376];
          if (!_v2377) return;
          (h.buffs[_v2376] = null, _v2377.kind === "meta" && _v2377.inner && (_v2377.inner.forEach(_v2378 => _v2378 && h.gems.push(_v2378)), _v2377.inner = [null, null]), h.gems.push(_v2377), o.selMeta && o.selMeta.i === _v2376 && (o.selMeta = null), me());
          break;
        }
      case "atlasNode":
        {
          let _v2379 = _v2335.dataset.k;
          if (h.atlas.includes(_v2379)) {
            let _v2380 = En[_v2379];
            if (_v2380 && _v2380.b) {
              let _v2381 = Co.find(_v2382 => _v2382.key === _v2380.b);
              if (_v2381 && _v2381.nodes && _v2381.nodes.slice(_v2380.i + 1).some(_v2383 => h.atlas.includes(_v2383.k))) {
                P("需先退还更深层的节点");
                return;
              }
            }
            if (false) {
              P("需先退还更深层的节点");
              return;
            }
            (h.atlas = h.atlas.filter(_v2384 => _v2384 !== _v2379), M("craft"));
            break;
          }
          if (!Ui(_v2379)) {
            P(h.atlasPts - h.atlas.length < 1 ? "图谱点不足 · 击败地图首领获得" : "需先点亮上一层");
            return;
          }
          (h.atlas.push(_v2379), M("unique"));
          break;
        }
      case "atlasReset":
        (h.atlas = [], M("craft"));
        break;
      case "dbg":
        Qw(_v2335.dataset.k);
        break;
      case "dbgView":
        (o.dbgView = _v2335.dataset.v, A("#pbody").scrollTop = 0);
        break;
      case "dcls":
        Dp(_v2335.dataset.dcls);
        return;
      case "lab":
        Fg(_v2335.dataset.t);
        return;
      case "dbgReset":
        Cp();
        return;
      case "toTitle":
        pc(!1);
        return;
      case "fsel":
        (o.forgeSel = +_v2335.dataset.uid, ke.delArm = 0);
        break;
      case "fg":
        Lg(_v2335);
        break;
      case "mw":
        if (!Og(_v2335)) return;
        break;
    }
    (ms(), o.tipKey = null);
  }), A("#panel").addEventListener("contextmenu", _v2385 => {
    if ((_v2385.preventDefault(), o.touchMode && o.lastPtr !== "mouse")) {
      P('触屏上长按不会出售 · 请在商人处的"出售"页卖东西');
      return;
    }
    if (o.held) {
      Za(null);
      return;
    }
    let _v2386 = _v2385.target.closest('[data-act="gact"],[data-act="gsup"],[data-act="bact"]');
    if (_v2386) {
      let _v2387 = aa(_v2386.dataset.uid);
      if (_v2387 && _v2387.loc === "gems") {
        let _v2388 = Ro(_v2387.it);
        (xr(_v2387.it), P("出售获得 " + Object.entries(_v2388).map(([_v2389, _v2390]) => F[_v2389].n + (_v2390 > 1 ? "×" + _v2390 : "")).join(" ") + " · 可在商人处回购"), Ua(), ms());
      }
      return;
    }
    let _v2391 = _v2385.target.closest('[data-act="inv"],[data-act="mapin"]');
    if (!_v2391) return;
    let _v2392 = aa(_v2391.dataset.uid);
    _v2392 && _v2392.loc === "inv" && (tn(_v2392.it), Ua(), ms());
  }), A("#panel").addEventListener("change", _v2393 => {
    if (_v2393.target.dataset.mapIntensity !== undefined) {
      o.mapIntensity = Math.max(1, Math.min(100, Math.round(Number(_v2393.target.value) || 1)));
      return;
    }
    let _v2394 = _v2393.target.dataset.fg;
    if (_v2394) {
      (_v2394.startsWith("mw") ? Bg(_v2393.target) : jg(_v2393.target)) && (ms(), o.tipKey = null);
      return;
    }
    (_v2393.target.dataset.f && (h.filter[_v2393.target.dataset.f] = _v2393.target.checked), _v2393.target.dataset.pk && (h.petPick = {
      ...h.petPick || ({}),
      [_v2393.target.dataset.pk]: _v2393.target.checked
    }));
  }), A("#panel").addEventListener("input", _v2395 => {
    _v2395.target.id === "tsearch" && (J.q = _v2395.target.value, ja());
  }), A("#panel").addEventListener("pointerdown", _v2396 => {
    if (_v2396.target.id === "treecv") {
      J.drag = {
        x: _v2396.clientX,
        y: _v2396.clientY,
        ox: J.ox,
        oy: J.oy,
        moved: !1
      };
      try {
        _v2396.target.setPointerCapture(_v2396.pointerId);
      } catch {}
    }
  }), A("#panel").addEventListener("pointerup", _v2397 => {
    if (_v2397.target.id !== "treecv" || !J.drag) return;
    let _v2398 = J.drag;
    (J.drag = null, _v2398.moved || r0(eu(_v2397)));
  }), A("#panel").addEventListener("wheel", _v2399 => {
    if (_v2399.target.id !== "treecv") return;
    _v2399.preventDefault();
    let _v2400 = _v2399.target.getBoundingClientRect(), _v2401 = (_v2399.clientX - _v2400.left) / re.uiZ, _v2402 = (_v2399.clientY - _v2400.top) / re.uiZ, _v2403 = _v2399.deltaY < 0 ? 1.15 : 1 / 1.15, _v2404 = we(J.s * _v2403, 0.25, 3), _v2405 = _v2404 / J.s;
    (J.ox = _v2401 - (_v2401 - J.ox) * _v2405, J.oy = _v2402 - (_v2402 - J.oy) * _v2405, J.s = _v2404, ja());
  }, {
    passive: !1
  }), A("#pclose").onclick = kt, A("#btnPortal").onclick = Jp, A("#btnMenu").onclick = () => {
    o.menu ? Wr() : gs();
  });
  let _v2406 = () => {
    A("#btnGfx").textContent = "画质 " + (It.q === "high" ? "高" : "低");
  };
  (_v2406(), Xe.onAuto = () => P("这台设备渲染较慢, 已自动切换为简化光影"), It.onAuto = () => {
    (_v2406(), P('检测到渲染较慢, 已自动关闭泛光(可点右上角"画质"重新开启)'));
  }, A("#btnGfx").onclick = () => {
    (Xm(It.q === "high" ? "low" : "high"), It.auto = !0, _v2406(), P(It.q === "high" ? "高画质: 泛光与调色已开启" : "低画质: 已关闭泛光"));
  }, A("#btnMute").onclick = () => {
    (o.muted = !o.muted, A("#btnMute").textContent = o.muted ? "静音中" : "声音", __syncUploadedSfxVolume());
  }, A("#hrow").addEventListener("click", _v2407 => {
    let _v2408 = _v2407.target.closest("[data-hud]");
    _v2408 && (o.selSlot = +_v2408.dataset.hud, ca("gem"));
  }), document.addEventListener("pointermove", _v2409 => {
    if (o.held) {
      let _v2410 = A("#held");
      (_v2410.style.left = _v2409.clientX + "px", _v2410.style.top = _v2409.clientY + "px");
    }
    if (_v2409.target.id === "treecv") {
      if (J.drag) {
        let _v2411 = (_v2409.clientX - J.drag.x) / re.uiZ, _v2412 = (_v2409.clientY - J.drag.y) / re.uiZ;
        if ((Math.abs(_v2411) + Math.abs(_v2412) > 4 && (J.drag.moved = !0), J.drag.moved)) {
          (J.ox = J.drag.ox + _v2411, J.oy = J.drag.oy + _v2412, ja(), Ua());
          return;
        }
      }
      let _v2413 = eu(_v2409);
      (_v2413 !== o.treeHover && (o.treeHover = _v2413, o.treePath = _v2413 >= 0 && !h.tree.includes(_v2413) ? Is(_v2413) || [] : [], ja()), _v2413 >= 0 ? c0(n0(at.nodes[_v2413]), _v2409.clientX, _v2409.clientY) : Ua());
      return;
    }
    let _v2414 = _v2409.target.closest && _v2409.target.closest("[data-tt]");
    if (_v2414) {
      let _v2415 = _v2414.dataset.tt;
      _v2415 !== o.tipKey || !!Re.shift !== o.tipShift ? (o.tipKey = _v2415, o.tipShift = !!Re.shift, c0(fc(_v2415), _v2409.clientX, _v2409.clientY)) : au(_v2409.clientX, _v2409.clientY);
    } else Ie.hidden || Ua();
  }), ot.addEventListener("pointermove", f0), ot.addEventListener("pointerdown", _v2416 => {
    if ((f0(_v2416), Aa(), o.state === "play")) {
      if (o.held) {
        Za(null);
        return;
      }
      if ((nu(), _v2416.button === 0)) {
        for (let _v2417 = o.labelRects.length - 1; _v2417 >= 0; _v2417--) {
          let _v2418 = o.labelRects[_v2417];
          if (Fe.sx >= _v2418.x && Fe.sx <= _v2418.x + _v2418.w && Fe.sy >= _v2418.y && Fe.sy <= _v2418.y + _v2418.h) {
            if (Math.hypot(_v2418.l.x - o.pl.x, _v2418.l.y - o.pl.y) > 150) {
              P("距离太远");
              return;
            }
            if (Io(_v2418.l)) {
              let _v2419 = o.loots.indexOf(_v2418.l);
              _v2419 >= 0 && o.loots.splice(_v2419, 1);
            }
            return;
          }
        }
        for (let _v2420 of o.objs) {
          if (Math.hypot(_v2420.x - Fe.wx, _v2420.y - Fe.wy) < 18) {
            if (_v2420.kind === "device") {
              ca("map");
              return;
            }
            if (_v2420.kind === "vendor" && Math.hypot(_v2420.x - o.pl.x, _v2420.y - o.pl.y) < 60) {
              wf();
              return;
            }
            if (_v2420.kind === "stash" && Math.hypot(_v2420.x - o.pl.x, _v2420.y - o.pl.y) < 60) {
              g0();
              return;
            }
            if ((_v2420.kind === "bench" || _v2420.kind === "altar") && Math.hypot(_v2420.x - o.pl.x, _v2420.y - o.pl.y) < 60) {
              Ei(_v2420.kind === "altar" ? "altar" : "craft");
              return;
            }
            if (_v2420.kind === "well" && Math.hypot(_v2420.x - o.pl.x, _v2420.y - o.pl.y) < 60) {
              DsWell();
              return;
            }
            if (_v2420.kind === "ritual" && Math.hypot(_v2420.x - o.pl.x, _v2420.y - o.pl.y) < 60) {
              RitualInteract(_v2420);
              return;
            }
            if (_v2420.kind === "simulacrum" && Math.hypot(_v2420.x - o.pl.x, _v2420.y - o.pl.y) < 60) {
              SimulacrumInteract();
              return;
            }
            if (_v2420.kind === "box" && !_v2420.open && Math.hypot(_v2420.x - o.pl.x, _v2420.y - o.pl.y) < 40) {
              m0(_v2420);
              return;
            }
          }
          if ((_v2420.kind === "monument" || _v2420.kind === "dog") && Math.abs(_v2420.x - Fe.wx) < 11 && Fe.wy < _v2420.y + 5 && Fe.wy > _v2420.y - (_v2420.kind === "monument" ? 48 : 20) && Math.hypot(_v2420.x - o.pl.x, _v2420.y - o.pl.y) < 60) {
            _v2420.kind === "monument" ? u0() : p0();
            return;
          }
        }
        if (_v2416.pointerType === "touch" && o.touchMode) return;
        (Fe.l = !0, co(0));
      }
      _v2416.button === 2 && (Fe.r = !0, co(1));
      try {
        ot.setPointerCapture(_v2416.pointerId);
      } catch {}
    }
  }), ot.addEventListener("pointerup", _v2421 => {
    (_v2421.button === 0 && (Fe.l = !1), _v2421.button === 2 && (Fe.r = !1));
  }), ot.addEventListener("pointercancel", () => {
    Fe.l = Fe.r = !1;
  }), ot.addEventListener("contextmenu", _v2422 => _v2422.preventDefault()), addEventListener("pointerdown", _v2423 => {
    o.lastPtr = _v2423.pointerType || "mouse";
  }, !0), A("#overlay").addEventListener("contextmenu", _v2424 => {
    (_v2424.preventDefault(), !(o.touchMode && o.lastPtr !== "mouse") && Kb(_v2424));
  }), addEventListener("blur", () => {
    for (let _v2425 in Re) Re[_v2425] = !1;
    Fe.l = Fe.r = !1;
  }));
  let _v2426 = () => o.state === "play" && o.Z && o.Z.type !== "hideout" && h && !o.pl?.dead;
  (addEventListener("visibilitychange", () => {
    document.visibilityState === "hidden" && Ye();
  }), addEventListener("pagehide", () => Ye()), addEventListener("beforeunload", _v2427 => {
    (Ye(), (_v2426() || re.leaveAsk && o.state === "play" && h) && (_v2427.preventDefault(), _v2427.returnValue = ""));
  }));
  function _v2428() {
    if (!(uc.armed || !re.leaveAsk || o.state !== "play")) try {
      (history.pushState({
        rift: 1
      }, ""), uc.armed = !0);
    } catch {}
  }
  (addEventListener("pointerdown", _v2428, !0), addEventListener("keydown", _v2428, !0), addEventListener("popstate", () => {
    uc.armed && (uc.armed = !1, uc.caught++, o.state === "play" && P('已拦截浏览器"后退"(鼠标手势) · 可在 Esc 设置里关闭这项保护'));
  }), addEventListener("dragstart", _v2429 => _v2429.preventDefault()), ot.addEventListener("selectstart", _v2430 => _v2430.preventDefault()));
  let _v2431 = () => {
    (Aa(), removeEventListener("pointerdown", _v2431, !0), removeEventListener("keydown", _v2431, !0));
  };
  (addEventListener("pointerdown", _v2431, !0), addEventListener("keydown", _v2431, !0), ou(), matchMedia("(pointer: coarse)").matches && pb(), Hi("witch"), me(), bs(), Vw(), requestAnimationFrame(Gb), setInterval(() => {
    o.state === "play" && o.Z && o.Z.type === "hideout" && Ye();
  }, 2e4));
};
Ed = function (_v2432, _v2433) {
  let _v2434, _v2435;
  if (_v2432 === "gem") {
    if (!Lt[h.cls].pool.includes(_v2433)) return !1;
    (_v2434 = xi(), _v2435 = () => h.gems.push($s(_v2433, 1, 2)));
  } else if (_v2432 === "sup") {
    if (!Y[_v2433]) return !1;
    (_v2434 = wi(_v2433), _v2435 = () => h.gems.push(ls(_v2433)));
  } else if (_v2432 === "map") {
    let _v2436 = +_v2433;
    if (!(_v2436 >= 1 && _v2436 <= yf())) return !1;
    if (ao() >= ra) return (P("地图袋已满"), !1);
    (_v2434 = Si(_v2436), _v2435 = () => h.inv.push(ia(_v2436)));
  } else return !1;
  if (OmHas("omen_gamble") && j() < 0.5) {
    (_v2435(), M("unique"), P("强运预兆 · 这次购买免费"));
    return !0;
  }
  let _v2437 = Ts(_v2434);
  return _v2437 ? (OmHas("omen_gamble") && OmTake("omen_gamble"), Tx(_v2434), _v2435(), M("pick"), !0) : (P("通货不足"), !1);
};
Xs = function () {
  let _v2438 = wa.tab, _v2439 = [["gem", "技能宝石"], ["sup", "辅助宝石"], ["map", "地图"], ["ex", "通货兑换"], ["sell", "出售"], ["back", "回购"]], _v2440 = ["trans", "alch", "chaos"].map(_v2441 => `<span style="color:${F[_v2441].col}">${F[_v2441].n} <b>${h.cur[_v2441] || 0}</b></span>`).join(""), _v2442 = "";
  if (_v2438 === "gem") _v2442 = '<p class="dim">本职业的主动技能宝石, 1 级 · 2 孔。</p><div class="shopgrid">' + Lt[h.cls].pool.filter(_v2443 => X[_v2443]).map(_v2444 => {
    let _v2445 = xi();
    return `<button class="shopit${Ts(_v2445) ? "" : " no"}" data-buy="gem" data-id="${_v2444}"><b>${X[_v2444].n}</b>${On(_v2445)}</button>`;
  }).join("") + "</div>"; else if (_v2438 === "sup") _v2442 = '<p class="dim">金色为机制辅助 (改变技能的行为)。</p><div class="shopgrid">' + Object.keys(Y).sort((_v2446, _v2447) => (Y[_v2447].mech ? 1 : 0) - (Y[_v2446].mech ? 1 : 0)).map(_v2448 => {
    let _v2449 = wi(_v2448);
    return `<button class="shopit${Y[_v2448].mech ? " mech" : ""}${Ts(_v2449) ? "" : " no"}" data-buy="sup" data-id="${_v2448}" title="${Y[_v2448].d}"><b>${Y[_v2448].n}</b>${On(_v2449)}</button>`;
  }).join("") + "</div>"; else if (_v2438 === "map") {
    let _v2450 = yf();
    _v2442 = `<p class="dim">可购买 T1 – T${_v2450} 的地图 (上限为你击败过首领的最高阶级), 主题随机。用来补齐低阶首领的图谱完成度。</p><div class="shopgrid maps">` + Array.from({
      length: _v2450
    }, (_v2451, _v2452) => _v2452 + 1).map(_v2453 => {
      let _v2454 = Si(_v2453);
      return `<button class="shopit${Ts(_v2454) ? "" : " no"}" data-buy="map" data-id="${_v2453}"><b>T${_v2453} 地图</b>${On(_v2454)}</button>`;
    }).join("") + "</div>";
  } else if (_v2438 === "ex") _v2442 = ExBody(); else if (_v2438 === "sell") {
    let _v2455 = h.inv.filter(_v2456 => _v2456.kind === "item" && _v2456.rarity === 0).length, _v2457 = h.inv.filter(_v2458 => _v2458.kind === "item" && _v2458.rarity === 1).length, _v2459 = Bn(), _v2460 = to().length, _v2461 = _v2462 => _v2462.kind === "gem" ? X[_v2462.gid].n + " Lv" + _v2462.lvl : _v2462.kind === "sup" ? Y[_v2462.gid].n : (ze[_v2462.gid] || Ee[_v2462.gid] || ({})).n || _v2462.gid, _v2463 = h.gems.map((_v2464, _v2465) => `<button class="shopit${_v2464.kind === "sup" && Y[_v2464.gid].mech ? " mech" : ""}" data-sg="${_v2465}" data-tt="it:${_v2464.uid}"><b>${_v2461(_v2464)}</b>${On(Ro(_v2464))}</button>`).join("");
    _v2442 = `<p class="dim">装备: 也可以在背包里右键单件出售。</p><div class="ovbtns"><button class="btn" data-sell="0">出售全部白装 (${_v2455})</button><button class="btn" data-sell="1">出售全部蓝装 (${_v2457})</button><button class="btn" data-sell="map">出售 T${_v2459} 及以下地图 (${_v2460})</button></div>
		 <p class="dim">未镶嵌的宝石 (点击出售, 卖错了可以在"回购"买回):</p><div class="shopgrid">${_v2463 || '<p class="dim">没有未镶嵌的宝石</p>'}</div>`;
  } else _v2442 = '<p class="dim">本次游戏中卖掉的最近 16 件, 按卖出价买回。</p><div class="shopgrid">' + (eo.map((_v2466, _v2467) => `<button class="shopit${Ts(_v2466.got) ? "" : " no"}" data-bb="${_v2467}"><b>${_v2466.it.kind === "gem" ? X[_v2466.it.gid].n : _v2466.it.kind === "sup" ? Y[_v2466.it.gid].n : _v2466.it.name || (ze[_v2466.it.gid] || Ee[_v2466.it.gid] || ({})).n}</b>${On(_v2466.got) || '<span class="pc">免费</span>'}</button>`).join("") || '<p class="dim">还没有卖过东西</p>') + "</div>";
  (Ue(`<div class="ovbox shop"><h2>商人</h2><div class="wallet">${_v2440}</div>
		 <div class="shoptabs">${_v2439.map(([_v2468, _v2469]) => `<button class="${_v2468 === _v2438 ? "on" : ""}" data-stab="${_v2468}">${_v2469}</button>`).join("")}</div>
		 <div class="shopbody">${_v2442}</div>
		 <div class="ovbtns"><button class="btn" id="shopClose">离开 <kbd>Esc</kbd></button></div></div>`), A("#shopClose").onclick = Id, document.querySelectorAll("#overlay [data-stab]").forEach(_v2470 => _v2470.onclick = () => {
    (wa.tab = _v2470.dataset.stab, Xs());
  }), document.querySelectorAll("#overlay [data-buy]").forEach(_v2471 => _v2471.onclick = () => {
    (Ed(_v2471.dataset.buy, _v2471.dataset.id) && P("已购买 " + _v2471.querySelector("b").textContent), Xs());
  }), document.querySelectorAll("#overlay [data-sg]").forEach(_v2472 => _v2472.onclick = () => {
    let _v2473 = h.gems[+_v2472.dataset.sg];
    (_v2473 && xr(_v2473) && P("已出售 " + _v2472.querySelector("b").textContent), Xs());
  }), document.querySelectorAll("#overlay [data-bb]").forEach(_v2474 => _v2474.onclick = () => {
    (Rd(+_v2474.dataset.bb) && P("已买回"), Xs());
  }), document.querySelectorAll("#overlay [data-sell]").forEach(_v2475 => _v2475.onclick = () => {
    let _v2476 = _v2475.dataset.sell, _v2477 = _v2476 === "map" ? to() : h.inv.filter(_v2478 => _v2478.kind === "item" && _v2478.rarity === +_v2476);
    (_v2477.length ? _v2477.forEach(_v2479 => tn(_v2479)) : P("没有可出售的物品"), Xs());
  }), document.querySelectorAll("#overlay [data-exfrom]").forEach(_v2480 => _v2480.onclick = () => {
    (wa.ex.from = _v2480.dataset.exfrom, wa.ex.from === wa.ex.to && (wa.ex.to = ExAll().find(_v2481 => _v2481 !== wa.ex.from) || wa.ex.from), Xs());
  }), document.querySelectorAll("#overlay [data-exto]").forEach(_v2482 => _v2482.onclick = () => {
    (wa.ex.to = _v2482.dataset.exto, wa.ex.to === wa.ex.from && (wa.ex.to = ExAll().find(_v2483 => _v2483 !== wa.ex.from) || wa.ex.to), Xs());
  }), document.querySelectorAll("#overlay [data-examt]").forEach(_v2484 => _v2484.onclick = () => {
    let _v2485 = _v2484.dataset.examt;
    (wa.ex.amt = _v2485 === "max" ? h.cur[wa.ex.from] || 0 : Math.max(1, (wa.ex.amt | 0) + +_v2485), A("#exAmt").value = wa.ex.amt, ExPrev());
  }), A("#exAmt") && (A("#exAmt").oninput = _v2486 => {
    (wa.ex.amt = Math.max(0, Math.floor(+_v2486.target.value || 0)), ExPrev());
  }, A("#exAmt").onkeydown = _v2487 => _v2487.stopPropagation()), A("#exGo") && (A("#exGo").onclick = () => {
    ExDo() && Xs();
  }), _v2438 === "ex" && ExPrev());
};
Vb = function () {
  if ((f.setTransform(1, 0, 0, 1, 0, 0), f.globalCompositeOperation = "source-over", f.globalAlpha = 1, f.fillStyle = "#000", f.fillRect(0, 0, ot.width, ot.height), !o.Z || !o.pl)) return;
  let _v2488 = 1 + o.zoomP, _v2489 = o.trauma * o.trauma * re.shake, _v2490 = (j() * 2 - 1) * _v2489 * 7 + cn.x * re.shake, _v2491 = (j() * 2 - 1) * _v2489 * 7 + cn.y * re.shake, _v2492 = ys / _v2488, _v2493 = vs / _v2488, _v2494 = Ta.x + ys / 2 + _v2490, _v2495 = Ta.y + vs / 2 + _v2491, _v2496 = U0 * _v2488;
  (nt.l = _v2494 - _v2492 / 2, nt.t = _v2495 - _v2493 / 2, nt.w = _v2492, nt.h = _v2493, nt.s = _v2496);
  let _v2497 = _v2496 * rr, _v2498 = Math.round(nt.l * _v2497) / _v2497, _v2499 = Math.round(nt.t * _v2497) / _v2497, _v2500 = () => f.setTransform(_v2497, 0, 0, _v2497, -_v2498 * _v2497, -_v2499 * _v2497), _v2501 = Xe.on && Nl();
  (_v2500(), f.imageSmoothingEnabled = !1);
  let _v2502 = Math.max(0, Math.floor(_v2498)), _v2503 = Math.max(0, Math.floor(_v2499)), _v2504 = Math.min(o.Z.img.width - _v2502, Math.ceil(_v2492) + 2), _v2505 = Math.min(o.Z.img.height - _v2503, Math.ceil(_v2493) + 2);
  _v2504 > 0 && _v2505 > 0 && f.drawImage(o.Z.img, _v2502, _v2503, _v2504, _v2505, _v2502, _v2503, _v2504, _v2505);
  let _v2506 = (_v2507, _v2508, _v2509) => _v2507 > _v2498 - _v2509 && _v2507 < _v2498 + _v2492 + _v2509 && _v2508 > _v2499 - _v2509 && _v2508 < _v2499 + _v2493 + _v2509;
  for (let _v2510 of o.decals) {
    if (!_v2506(_v2510.x, _v2510.y, 20)) continue;
    let _v2511 = _v2510.t > _v2510.max * 0.7 ? 1 - (_v2510.t - _v2510.max * 0.7) / (_v2510.max * 0.3) : 1;
    (f.globalAlpha = _v2511 * 0.85, f.fillStyle = J$[_v2510.kind] || "#4a0c10", _v2510.kind === "frost" && (f.globalAlpha = _v2511 * 0.5));
    for (let [_v2512, _v2513, _v2514] of _v2510.pts) f.fillRect(Math.round(_v2510.x + _v2512), Math.round(_v2510.y + _v2513), _v2514, _v2514);
  }
  f.globalAlpha = 1;
  for (let _v2515 of o.grounds) _v2506(_v2515.x, _v2515.y, 20) && (f.globalAlpha = Math.min(1, _v2515.t) * 0.5, f.fillStyle = "#ff5a1a", f.fillRect(_v2515.x - _v2515.r * 0.6, _v2515.y - 1, _v2515.r * 1.2, 2), f.fillRect(_v2515.x - _v2515.r * 0.3, _v2515.y - 2, _v2515.r * 0.6, 4));
  (f.globalAlpha = 1, D3(_v2506), cg(_v2506), a2(f));
  for (let _v2516 of o.fx) if (_v2516.k === "tele") {
    let _v2517 = _v2516.t / _v2516.max;
    (f.globalAlpha = 0.55, f.strokeStyle = _v2516.col, f.lineWidth = 1, f.beginPath(), f.ellipse(_v2516.x, _v2516.y, _v2516.r, _v2516.r * 0.75, 0, 0, 6.283), f.stroke(), f.globalAlpha = 0.24, f.fillStyle = _v2516.col, f.beginPath(), f.ellipse(_v2516.x, _v2516.y, _v2516.r * _v2517, _v2516.r * _v2517 * 0.75, 0, 0, 6.283), f.fill());
  } else if (_v2516.k === "line") {
    let _v2518 = _v2516.t / _v2516.max;
    (f.globalAlpha = 0.25 + _v2518 * 0.4, f.strokeStyle = _v2516.col, f.lineWidth = 2 + _v2518 * 3, f.beginPath(), f.moveTo(_v2516.x1, _v2516.y1), f.lineTo(_v2516.x2, _v2516.y2), f.stroke());
  }
  f.globalAlpha = 1;
  let _v2519 = () => {
    for (let _v2520 of o.mons) {
      if (_v2520.dead || _v2520.state !== "wind" || _v2520.t.atk === "ranged" || !_v2506(_v2520.x, _v2520.y, 30)) continue;
      let _v2521 = 1 - _v2520.st / 0.4;
      (f.globalAlpha = 0.18 + 0.25 * we(_v2521, 0, 1), f.fillStyle = "#ff3a2a", f.beginPath(), f.moveTo(_v2520.x, _v2520.y), f.arc(_v2520.x, _v2520.y, _v2520.r + _v2520.t.range + 5, _v2520.wa - 0.8, _v2520.wa + 0.8), f.closePath(), f.fill(), f.globalAlpha = 1);
    }
  };
  _v2501 || _v2519();
  for (let _v2522 of o.objs) {
    if (_v2522.kind === "rift" && _v2522.st !== "done" && _v2506(_v2522.x, _v2522.y, 200)) {
      let _v2523 = _v2522.st === "open" ? _v2522.R : 10 + Math.sin(o.T * 3) * 1.5;
      (f.globalAlpha = _v2522.st === "open" ? 0.18 : 0.5, f.fillStyle = "#4a1a80", f.beginPath(), f.ellipse(_v2522.x, _v2522.y, _v2523, _v2523 * 0.8, 0, 0, 6.283), f.fill(), f.globalAlpha = 0.8, f.strokeStyle = "#b080ff", f.lineWidth = 1, f.beginPath(), f.ellipse(_v2522.x, _v2522.y, _v2523, _v2523 * 0.8, 0, 0, 6.283), f.stroke(), f.globalAlpha = 1);
    }
    if (_v2522.kind === "abyss" && _v2506(_v2522.x, _v2522.y, 400)) {
      let _v2524 = _v2522.st === "sealed" || _v2522.st === "done", _v2525 = _v2522.st === "pit" ? 1 + Math.sin(o.T * 6) * 0.08 : 1;
      (_v2524 || (f.globalCompositeOperation = "lighter", f.fillStyle = "rgba(40,180,90,0.13)", f.globalAlpha = 1, f.beginPath(), f.ellipse(_v2522.x, _v2522.y, _v2522.r * 1.5 * _v2525, _v2522.r * 1.05 * _v2525, 0, 0, 6.283), f.fill(), f.globalCompositeOperation = "source-over"), f.fillStyle = _v2524 ? "#0b1410" : "#06110c", f.globalAlpha = _v2524 ? 0.5 : 0.8, f.beginPath(), f.ellipse(_v2522.x, _v2522.y, _v2522.r, _v2522.r * 0.7, 0, 0, 6.283), f.fill(), f.globalAlpha = _v2524 ? 0.22 : 0.75, f.strokeStyle = "#2ee6a8", f.lineWidth = 1.3, f.beginPath(), f.ellipse(_v2522.x, _v2522.y, _v2522.r, _v2522.r * 0.7, 0, 0, 6.283), f.stroke());
      for (let _v2526 of _v2522.fissures) {
        if (_v2526.closed) continue;
        let _v2527 = 1 + Math.sin(o.T * 4 + _v2526.x) * 0.2;
        (f.globalCompositeOperation = "lighter", f.globalAlpha = 0.75 * _v2527, f.strokeStyle = "#9dffb4", f.lineWidth = 1.4, f.beginPath(), f.moveTo(_v2526.x - 18, _v2526.y + 3), f.lineTo(_v2526.x - 7, _v2526.y - 3), f.lineTo(_v2526.x + 3, _v2526.y + 4), f.lineTo(_v2526.x + 16, _v2526.y - 2), f.stroke(), f.globalAlpha = 0.16, f.strokeStyle = "#1e7a3c", f.lineWidth = 4.5, f.stroke(), f.globalCompositeOperation = "source-over", f.globalAlpha = 1);
      }
    }
    _v2522.kind === "device" ? Z3(_v2522) : _v2522.kind === "vendor" ? Hm(f, _v2522) : _v2522.kind === "stash" ? O2(f, _v2522) : _v2522.kind === "bench" ? N1(f, _v2522) : _v2522.kind === "altar" ? D1(f, _v2522) : _v2522.kind === "well" ? DlWell(f, _v2522) : _v2522.kind === "monument" ? m2(f, _v2522) : _v2522.kind === "dog" ? h2(f, _v2522) : _v2522.kind === "mirror" ? DlMirror(f, _v2522) : _v2522.kind === "delshard" ? DlShardDraw(f, _v2522) : _v2522.kind === "simulacrum" ? DlSim(f, _v2522) : _v2522.kind === "b-simportal" ? drawSimPortal(_v2522) : _v2522.kind === "ritual" && DlRitual(f, _v2522);
  }
  let _v2528 = () => {
    let _v2529 = yr();
    for (let _v2530 of o.loots) {
      if (!_v2506(_v2530.x, _v2530.y, 30) || _v2530.hid && !_v2529) continue;
      if ((_v2530.hid && (f.globalAlpha = 0.5), _v2530.beam && _v2530.landed && !_v2530.hid)) {
        let _v2531 = 0.35 + Math.sin(o.T * 4 + _v2530.x) * 0.12;
        f.globalCompositeOperation = "lighter";
        let _v2532 = f.createLinearGradient(0, _v2530.y - 150, 0, _v2530.y);
        (_v2532.addColorStop(0, "rgba(0,0,0,0)"), _v2532.addColorStop(1, _v2530.beam), f.globalAlpha = _v2531 * (_v2530.big ? 1.4 : 1), f.fillStyle = _v2532, f.fillRect(_v2530.x - (_v2530.big ? 3 : 2), _v2530.y - 150, _v2530.big ? 6 : 4, 150), f.globalAlpha = 1, f.globalCompositeOperation = "source-over");
      }
      (f.fillStyle = "rgba(0,0,0,0.4)", f.fillRect(Math.round(_v2530.x - 3), Math.round(_v2530.y), 6, 1));
      let _v2533 = _v2530.kind === "cur" ? hr[_v2530.cur] : _v2530.it.kind === "map" ? Ya.map : _v2530.it.kind === "gem" || _v2530.it.kind === "sup" ? Ya.gem : _v2530.it.kind === "buff" ? Ya.buff : _v2530.it.kind === "meta" ? Ya.meta : _v2530.it.kind === "soul" ? Ya["soul_" + _v2530.it.beast] : Ya[he[_v2530.it.base].icon];
      (f.drawImage(_v2533, Math.round(_v2530.x - _v2533.width / 2), Math.round(_v2530.y - _v2530.z - _v2533.height)), f.globalAlpha = 1);
    }
  };
  _v2501 || _v2528();
  let _v2534 = [];
  for (let _v2535 of o.mons) !_v2535.dead && _v2506(_v2535.x, _v2535.y, 40) && _v2534.push(_v2535);
  for (let _v2536 of o.objs) (_v2536.kind === "box" || _v2536.kind === "fire") && _v2506(_v2536.x, _v2536.y, 30) && _v2534.push(_v2536);
  for (let _v2537 of o.corpses) _v2506(_v2537.x, _v2537.y, 40) && _v2534.push(_v2537);
  for (let _v2538 of o.minions) _v2506(_v2538.x, _v2538.y, 20) && _v2534.push(_v2538);
  for (let _v2539 of o.comps || []) _v2506(_v2539.x, _v2539.y, 40) && _v2534.push(_v2539);
  for (let _v2540 of o.bells) _v2506(_v2540.x, _v2540.y, 30) && _v2534.push(_v2540);
  for (let _v2541 of o.objs) _v2541.kind === "shrine" && _v2506(_v2541.x, _v2541.y, 30) && _v2534.push(_v2541);
  (_v2534.push(o.pl), Ut.e && _v2534.push(Ut.e), _v2534.sort((_v2542, _v2543) => _v2542.y - _v2543.y), ir.mode = _v2501 ? 1 : 0);
  for (let _v2544 of _v2534) _v2501 && _v2544.kind === "fire" || (_v2544 === o.pl ? O3() : _v2544.kind === "pet" ? C1(f, _v2544, _v2501) : _v2544.comp ? t2(f, _v2544, _v2501) : o.minions.includes(_v2544) ? q3(_v2544) : o.bells.includes(_v2544) ? G3(_v2544) : _v2544.kind === "shrine" ? W3(_v2544) : _v2544.kind === "box" ? U3(_v2544) : _v2544.kind === "fire" ? kv(_v2544) : _v2544.spr && _v2544.rot != null ? H3(_v2544) : F3(_v2544));
  if (_v2501) {
    for (let _v2545 of o.parts) _v2545.glow || !_v2506(_v2545.x, _v2545.y, 10) || (f.globalAlpha = _v2545.life < _v2545.max * 0.4 ? _v2545.life / (_v2545.max * 0.4) : 1, f.fillStyle = _v2545.col, f.fillRect(Math.round(_v2545.x), Math.round(_v2545.y - _v2545.z), _v2545.s, _v2545.s));
    (f.globalAlpha = 1, Su(_v2506), xv(), sg(f, ot, _v2498, _v2499, _v2492, _v2493, _v2497), _v2500());
    for (let _v2546 of _v2534) _v2546.kind === "fire" && kv(_v2546);
    for (let _v2547 of _v2534) _v2547.comp && yu(f, _v2547);
    (Fd(f), Bd(f), Mi() && (f.save(), f.translate(0, -Ae.lift)), qd(f), Hd(f), Mi() && f.restore());
    for (let _v2548 of _v2534) _v2548 !== o.pl && !_v2548.comp && !_v2548.kind && !(_v2548.spr && _v2548.rot != null) && !o.minions.includes(_v2548) && !o.bells.includes(_v2548) && wv(_v2548);
    (_v2519(), _v2528());
  }
  ir.mode = 0;
  for (let _v2549 of o.projs) _v2506(_v2549.x, _v2549.y, 12) && _3(_v2549);
  fg(_v2506);
  try {
    if (typeof vg === "function") vg(_v2506);
    if (typeof V2 === "function") V2(_v2506);
  } catch (_v2550) {}
  for (let _v2551 of o.sticks) {
    if (!_v2506(_v2551.x, _v2551.y, 20)) continue;
    let _v2552 = Math.cos(_v2551.ang), _v2553 = Math.sin(_v2551.ang), _v2554 = _v2551.x, _v2555 = _v2551.y - 8;
    (f.strokeStyle = "#c8a040", f.lineWidth = 1.2, f.beginPath(), f.moveTo(_v2554 - _v2552 * 10, _v2555 - _v2553 * 10 - 3), f.lineTo(_v2554, _v2555), f.stroke());
    let _v2556 = _v2551.t < 0.5 && Math.floor(o.T * 16) % 2;
    (f.fillStyle = _v2556 ? "#ffffff" : "#ff6a1a", f.fillRect(Math.round(_v2554 - 1.5), Math.round(_v2555 - 1.5), 3, 3));
  }
  for (let _v2557 of o.eprojs) _v2506(_v2557.x, _v2557.y, 10) && (f.fillStyle = _v2557.col, f.fillRect(Math.round(_v2557.x - 1.5), Math.round(_v2557.y - 7.5), 3, 3), f.fillStyle = "#fff", f.fillRect(Math.round(_v2557.x - 0.5), Math.round(_v2557.y - 6.5), 1, 1));
  let _v2558 = Jt();
  for (let _v2559 of o.parts) {
    if (!_v2506(_v2559.x, _v2559.y, 10) || _v2501 && !_v2559.glow) continue;
    let _v2560 = _v2559.life < _v2559.max * 0.4 ? _v2559.life / (_v2559.max * 0.4) : 1;
    (f.globalAlpha = _v2559.glow ? _v2560 * _v2558 : _v2560, _v2559.glow && (f.globalCompositeOperation = "lighter"), f.fillStyle = _v2559.col, f.fillRect(Math.round(_v2559.x), Math.round(_v2559.y - _v2559.z), _v2559.s, _v2559.s), _v2559.glow && (f.globalCompositeOperation = "source-over"));
  }
  if ((f.globalAlpha = 1, _v2501 || Su(_v2506), Fo(Jt(), V3), _v2501 || (xv(), Q3(_v2498, _v2499, _v2492, _v2493)), _v2500(), f.globalCompositeOperation = "lighter", !_v2501)) for (let _v2561 of o.LIGHTS) {
    if (!_v2561.c || !_v2506(_v2561.x, _v2561.y, _v2561.r)) continue;
    let _v2562 = f.createRadialGradient(_v2561.x, _v2561.y, 0, _v2561.x, _v2561.y, _v2561.r * 0.7);
    (_v2562.addColorStop(0, Ze(_v2561.c, 0.2 * (_v2561.i || 1))), _v2562.addColorStop(1, Ze(_v2561.c, 0)), f.fillStyle = _v2562, f.fillRect(_v2561.x - _v2561.r, _v2561.y - _v2561.r, _v2561.r * 2, _v2561.r * 2));
  }
  for (let _v2563 of o.objs) _v2563.kind === "ritual" && _v2506(_v2563.x, _v2563.y, 80) && DlRitualBase(f, _v2563);
  Fo(Jt(), () => {
    for (let _v2564 of o.fx) if (_v2564.k === "flash") {
      let _v2565 = _v2564.t / _v2564.max, _v2566 = f.createRadialGradient(_v2564.x, _v2564.y, 0, _v2564.x, _v2564.y, _v2564.r);
      (_v2566.addColorStop(0, Ze(_v2564.col, 0.55 * (1 - _v2565))), _v2566.addColorStop(1, Ze(_v2564.col, 0)), f.fillStyle = _v2566, f.fillRect(_v2564.x - _v2564.r, _v2564.y - _v2564.r, _v2564.r * 2, _v2564.r * 2));
    }
  });
  for (let _v2567 of o.pl.smears) {
    let _v2568 = _v2567.t / _v2567.max;
    if ((f.globalAlpha = (1 - _v2568) * 0.8, f.fillStyle = _v2567.col, _v2567.line)) (f.save(), f.translate(_v2567.x, _v2567.y), f.rotate(_v2567.a0), f.fillRect(2, -1.2 * (1 - _v2568), _v2567.r, 2.4 * (1 - _v2568)), f.restore()); else {
      let _v2569 = _v2567.a0, _v2570 = _v2567.a1;
      if (_v2570 < _v2569) {
        let _v2571 = _v2569;
        (_v2569 = _v2570, _v2570 = _v2571);
      }
      (_v2570 - _v2569 > 6 && (_v2570 = _v2569 + 6.28), f.beginPath(), f.arc(_v2567.x, _v2567.y, _v2567.r, _v2569, _v2570), f.arc(_v2567.x, _v2567.y, _v2567.r * (0.45 + 0.4 * _v2568), _v2570, _v2569, !0), f.closePath(), f.fill());
    }
  }
  (f.globalAlpha = 1, f.globalCompositeOperation = "source-over", Fo(Jt(), () => {
    for (let _v2572 of o.fx) I3.has(_v2572.k) && W2(_v2572, we(_v2572.t / _v2572.max, 0, 1));
  }), D2(), q2(), ig(), _v2500(), o.desat > 0.01 && (f.setTransform(1, 0, 0, 1, 0, 0), f.globalCompositeOperation = "saturation", f.fillStyle = `rgba(128,128,128,${Math.min(1, o.desat)})`, f.fillRect(0, 0, ot.width, ot.height), f.globalCompositeOperation = "source-over", _v2500()), o.del && (f.setTransform(1, 0, 0, 1, 0, 0), (function () {
    let _v2573 = we(o.del.depth / 250, 0, 1), _v2574 = f.createRadialGradient(ot.width / 2, ot.height / 2, Math.min(ot.width, ot.height) * 0.18, ot.width / 2, ot.height / 2, Math.max(ot.width, ot.height) * 0.72);
    (_v2574.addColorStop(0, "rgba(200,210,235,0)"), _v2574.addColorStop(1, "rgba(150,160,200," + (0.12 + _v2573 * 0.34).toFixed(3) + ")"), f.fillStyle = _v2574, f.fillRect(0, 0, ot.width, ot.height));
    for (let _v2575 = 0; _v2575 < 5; _v2575++) {
      let _v2576 = (o.T * (5 + _v2575 * 1.6) + _v2575 * 137) % (ot.width + 240) - 120, _v2577 = (Math.sin(o.T * 0.35 + _v2575 * 1.7) + 1) / 2 * ot.height;
      (f.globalAlpha = 0.04 + _v2573 * 0.07, f.fillStyle = "#cfd8e8", f.beginPath(), f.ellipse(_v2576, _v2577, 90 + _v2575 * 22, 42 + _v2575 * 12, 0, 0, 6.283), f.fill());
    }
    f.globalAlpha = 1;
  })(), _v2500()));
  for (let _v2578 of o.mons) {
    if (_v2578.dead || _v2578.rar === 3 || !_v2506(_v2578.x, _v2578.y, 30)) continue;
    if ((_v2578.rar >= 1 || _v2578.hp < _v2578.maxhp) && !_v2578.dummy) {
      let _v2579 = _v2578.rar === 2 ? 20 : _v2578.rar === 1 ? 16 : 12, _v2580 = Math.round(_v2578.x - _v2579 / 2), _v2581 = Math.round(_v2578.y - _v2578.h - 5);
      (f.fillStyle = "rgba(0,0,0,0.7)", f.fillRect(_v2580 - 1, _v2581 - 1, _v2579 + 2, _v2578.rar ? 4 : 3), f.fillStyle = _v2578.rar === 2 ? "#e0c040" : _v2578.rar === 1 ? "#7a80ff" : "#c8303a", f.fillRect(_v2580, _v2581, Math.max(0, _v2579 * _v2578.hp / _v2578.maxhp), 1), _v2578.rar && (f.fillStyle = _v2578.stunT > 0 ? "#ffffff" : "#c89a30", f.fillRect(_v2580, _v2581 + 2, _v2579 * (_v2578.stunT > 0 ? 1 : Math.min(1, _v2578.stun)), 1)));
    }
    if ((_v2578.rar === 2 && (f.font = "600 5px " + vo, f.textAlign = "center", f.fillStyle = "#000", f.fillText(_v2578.name, _v2578.x + 0.4, _v2578.y - _v2578.h - 6.6), f.fillStyle = "#ecd85a", f.fillText(_v2578.name, _v2578.x, _v2578.y - _v2578.h - 7)), _v2578.stunT > 0)) for (let _v2582 = 0; _v2582 < 3; _v2582++) {
      let _v2583 = o.T * 6 + _v2582 * 2.09;
      (f.fillStyle = "#ffe080", f.fillRect(Math.round(_v2578.x + Math.cos(_v2583) * 5), Math.round(_v2578.y - _v2578.h - 3 + Math.sin(_v2583) * 1.5), 1, 1));
    }
  }
  for (let _v2584 of o.mons) if (_v2584.dummy) {
    _v2584.log = _v2584.log.filter(_v2585 => o.T - _v2585[0] < 4);
    let _v2586 = _v2584.log.reduce((_v2587, _v2588) => _v2587 + _v2588[1], 0), _v2589 = _v2584.log.length ? Math.max(1, o.T - _v2584.log[0][0]) : 1;
    (f.font = "7px " + jr, f.textAlign = "center", f.fillStyle = "#000", f.fillText("DPS " + Pe(_v2586 / _v2589), _v2584.x + 0.5, _v2584.y - _v2584.h - 25.5), f.fillStyle = "#ffd27a", f.fillText("DPS " + Pe(_v2586 / _v2589), _v2584.x, _v2584.y - _v2584.h - 26), _v2584.rar && (f.fillStyle = "#c89a30", f.fillRect(_v2584.x - 10, _v2584.y - _v2584.h - 3, 20 * (_v2584.stunT > 0 ? 1 : Math.min(1, _v2584.stun)), 1)));
  }
  (J3(_v2498, _v2499, _v2492, _v2493), C1(f, vo));
  for (let _v2590 of o.texts) {
    let _v2591 = _v2590.t / _v2590.max;
    f.globalAlpha = _v2591 > 0.6 ? 1 - (_v2591 - 0.6) / 0.4 : 1;
    let _v2592 = _v2590.crit ? 1 + Math.max(0, 0.12 - _v2590.t) * 5 : 1;
    (f.font = (_v2590.crit ? "700 " : "") + (_v2590.s * _v2592).toFixed(1) + "px " + (_v2590.txt.match(/[一-鿿]/) ? vo : jr), f.textAlign = "center", f.lineWidth = 2, f.strokeStyle = "#000", f.strokeText(_v2590.txt, _v2590.x, _v2590.y), f.fillStyle = _v2590.col, f.fillText(_v2590.txt, _v2590.x, _v2590.y));
  }
  if ((f.globalAlpha = 1, o.state === "play" && !o.pl.dead)) {
    for (let _v2593 of o.objs) if ((_v2593.kind === "box" && !_v2593.open && (_v2593.x - o.pl.x) ** 2 + (_v2593.y - o.pl.y) ** 2 < 1296 && Pa(_v2593.x, _v2593.y - 14, "F 开启宝箱"), _v2593.kind === "rift" && _v2593.st === "idle" && (_v2593.x - o.pl.x) ** 2 + (_v2593.y - o.pl.y) ** 2 < 3600 && Pa(_v2593.x, _v2593.y - 16, "走入裂隙即开启"), _v2593.kind === "device" && (_v2593.x - o.pl.x) ** 2 + (_v2593.y - o.pl.y) ** 2 < 1600 && Pa(_v2593.x, _v2593.y - 26, "F / 点击 打开地图装置"), _v2593.kind === "vendor" && (_v2593.x - o.pl.x) ** 2 + (_v2593.y - o.pl.y) ** 2 < 1156 && Pa(_v2593.x, _v2593.y - 30, "F / 点击 与商人交易"), _v2593.kind === "stash" && (_v2593.x - o.pl.x) ** 2 + (_v2593.y - o.pl.y) ** 2 < 1156 && Pa(_v2593.x, _v2593.y - 22, "F / 点击 打开仓库"), _v2593.kind === "bench" && (_v2593.x - o.pl.x) ** 2 + (_v2593.y - o.pl.y) ** 2 < 1156 && Pa(_v2593.x, _v2593.y - 26, "F / 点击 打开工艺台"), _v2593.kind === "altar" && (_v2593.x - o.pl.x) ** 2 + (_v2593.y - o.pl.y) ** 2 < 1156 && Pa(_v2593.x, _v2593.y - 32, "F / 点击 打开余烬祭坛"), _v2593.kind === "well" && (_v2593.x - o.pl.x) ** 2 + (_v2593.y - o.pl.y) ** 2 < 1156 && Pa(_v2593.x, _v2593.y - 30, "F / 点击 打开灵魂之井"), _v2593.kind === "simulacrum" && (_v2593.x - o.pl.x) ** 2 + (_v2593.y - o.pl.y) ** 2 < 1156 && Pa(_v2593.x, _v2593.y - 32, h.simUnlocked ? "F / 点击 进入迷雾副本 (35 层)" : "F / 点击 解锁迷雾副本 (需 8 裂片)"), _v2593.kind === "mirror" && _v2593.st === "idle" && (_v2593.x - o.pl.x) ** 2 + (_v2593.y - o.pl.y) ** 2 < 1600 && Pa(_v2593.x, _v2593.y - 26, "走入迷雾之镜开启惊悸迷雾"), _v2593.kind === "ritual" && (_v2593.x - o.pl.x) ** 2 + (_v2593.y - o.pl.y) ** 2 < 1600 && Pa(_v2593.x, _v2593.y - 32, _v2593.st === "idle" ? "F / 点击 开始驱灵仪式 · 已吸收 " + (_v2593.stored || 0) : _v2593.st === "done" ? "F / 点击 领取恩典 · 贡品 " + RitTribute() : "驱灵仪式 · 第 " + _v2593.wave + "/" + _v2593.waves + " 波 · 贡品 " + RitTribute()), _v2593.kind === "monument" && (_v2593.x - o.pl.x) ** 2 + (_v2593.y - o.pl.y) ** 2 < 1156 && Pa(_v2593.x, _v2593.y - 50, "F / 点击 查看创世群纪念碑"), _v2593.kind === "dog" && (_v2593.x - o.pl.x) ** 2 + (_v2593.y - o.pl.y) ** 2 < 1156 && Pa(_v2593.x, _v2593.y - 32, al() ? "F / 点击 看看今天的签" : "F / 点击 找过油肉抽签"), _v2593.kind === "shrine" && !_v2593.used && (_v2593.x - o.pl.x) ** 2 + (_v2593.y - o.pl.y) ** 2 < 2500)) {
      let _v2594 = Ea.find(_v2595 => _v2595.k === _v2593.type);
      Pa(_v2593.x, _v2593.y - 28, _v2594.n + " · " + _v2594.d);
    }
    for (let _v2596 of o.objs) _v2596.kind === "rift" && _v2596.st === "open" && (f.font = "6px " + jr, f.textAlign = "center", f.fillStyle = "#000", f.fillText(Math.ceil(_v2596.t) + "s · " + (_v2596.kills || 0), _v2596.x + 0.5, _v2596.y - _v2596.R * 0.8 - 3.5), f.fillStyle = "#d0a0ff", f.fillText(Math.ceil(_v2596.t) + "s · " + (_v2596.kills || 0), _v2596.x, _v2596.y - _v2596.R * 0.8 - 4));
    for (let _v2597 of o.objs) {
      if (_v2597.kind !== "abyss") continue;
      let _v2598 = (_v2597.x - o.pl.x) ** 2 + (_v2597.y - o.pl.y) ** 2;
      (_v2597.st === "fissures" && _v2598 < 90400 && Pa(_v2597.x, _v2597.y - 22, "深渊裂缝 · 关闭 " + _v2597.fissures.filter(_v2599 => _v2599.closed).length + "/" + _v2597.fissures.length), _v2597.st === "pit" && _v2598 < 90400 && Pa(_v2597.x, _v2597.y - 24, "深渊巨坑 · 清理怪物"), _v2597.st === "sealed" && _v2598 < 90400 && Pa(_v2597.x, _v2597.y - 24, "深渊保险箱正在升起"), _v2597.st === "done" && _v2598 < 90400 && Pa(_v2597.x, _v2597.y - 24, "深渊保险箱"));
      for (let _v2600 of _v2597.fissures) !_v2600.closed && (_v2600.x - o.pl.x) ** 2 + (_v2600.y - o.pl.y) ** 2 < 32400 && Pa(_v2600.x, _v2600.y - 12, "击杀附近怪物 (" + _v2600.kills + "/" + _v2600.need + ")");
    }
  }
  if (o.state === "play" && !o.pl.dead) for (let _v2601 of o.objs) (_v2601.kind === "enc" && _v2601.st === "idle" && _v2601.type !== "ice" && (_v2601.x - o.pl.x) ** 2 + (_v2601.y - o.pl.y) ** 2 < 8100 && Pa(_v2601.x, _v2601.y - 22, tt[_v2601.type].enc + " · 靠近开始"), _v2601.kind === "enc" && _v2601.st === "active" && (f.font = "6px " + jr, f.textAlign = "center", f.fillStyle = "#000", f.fillText(Math.ceil(_v2601.t) + "s", _v2601.x + 0.5, _v2601.y - 27.5), f.fillStyle = "#ffd27a", f.fillText(Math.ceil(_v2601.t) + "s", _v2601.x, _v2601.y - 28)));
  for (let _v2602 of o.mons) _v2602.type === "icechest" && !_v2602.dead && (_v2602.x - o.pl.x) ** 2 + (_v2602.y - o.pl.y) ** 2 < 1e4 && Pa(_v2602.x, _v2602.y - 16, "冰封宝藏 · 火焰伤害 ×3");
  (o.flashW > 0.01 && re.flash > 0 && (f.setTransform(1, 0, 0, 1, 0, 0), f.fillStyle = `rgba(255,250,240,${Math.min(0.8, o.flashW) * re.flash})`, f.fillRect(0, 0, ot.width, ot.height)), o.Z.type === "map" && Y3());
};
F3 = function (_v2603) {
  if (_v2603.hidden) return;
  if (ir.mode === 2) return wv(_v2603);
  let _v2604 = zt[_v2603.spr], _v2605 = _v2603.face < 0, _v2606 = _v2605 ? _v2604.flip : _v2604.img, _v2607 = _v2603.moving && _v2603.frozen <= 0 ? Math.abs(Math.sin((o.T + _v2603.bob) * 10)) * 1.2 : 0, _v2608 = 0, _v2609 = 0;
  if (_v2603.shT > 0) {
    let _v2610 = Math.sin(o.T * 95) * 1.6 * (_v2603.shT / 0.14);
    (_v2608 = _v2603.shx * _v2610, _v2609 = _v2603.shy * _v2610 * 0.6);
  }
  let _v2611 = Math.round(_v2603.x - _v2604.w / 2 + _v2608), _v2612 = Math.round(_v2603.y - _v2604.h + 1 - _v2607 + _v2609);
  if ((f.fillStyle = "rgba(0,0,0,0.42)", f.beginPath(), f.ellipse(_v2603.x, _v2603.y + 0.5, _v2603.r * 1.1, _v2603.r * 0.4, 0, 0, 6.283), f.fill(), _v2603.rar >= 1 && !ir.mode)) {
    let _v2613 = _v2603.rar === 1 ? "#6a70ff" : _v2603.rar === 2 ? "#f0d040" : "#ff5030", _v2614 = Ne(_v2604, _v2613, _v2605);
    (f.globalAlpha = 0.85, f.drawImage(_v2614, _v2611 - 1, _v2612), f.drawImage(_v2614, _v2611 + 1, _v2612), f.drawImage(_v2614, _v2611, _v2612 - 1), f.drawImage(_v2614, _v2611, _v2612 + 1), f.globalAlpha = 1);
  }
  _v2603.weak && (f.globalAlpha = 0.32, f.drawImage(Ne(_v2604, "#2ee6a8", _v2605), _v2611, _v2612), f.globalAlpha = 1);
  _v2603.abmod && (f.globalAlpha = 0.55, f.strokeStyle = "#2ee6a8", f.lineWidth = 0.8, f.beginPath(), f.ellipse(_v2603.x, _v2603.y + 0.5, _v2603.r * 1.6, _v2603.r * 0.62, 0, 0, 6.283), f.stroke(), f.fillStyle = "#2ee6a8", f.fillRect(_v2603.x - 9, _v2603.y - _v2603.h - 6, 2, 2), f.fillRect(_v2603.x + 7, _v2603.y - _v2603.h - 6, 2, 2), f.globalAlpha = 1, (_v2603.x - o.pl.x) ** 2 + (_v2603.y - o.pl.y) ** 2 < 40000 && Pa(_v2603.x, _v2603.y - _v2603.h - 7, ABMODS[_v2603.abmod].n));
  if (_v2603.mark) {
    let _v2615 = _v2603.mark.type === "sniper" ? "#ffd27a" : "#ff6040", _v2616 = _v2603.x, _v2617 = _v2603.y - _v2603.h - 9, _v2618 = 3.5 + Math.sin(o.T * 8) * 0.6;
    (f.strokeStyle = _v2615, f.lineWidth = 0.8, f.beginPath(), f.arc(_v2616, _v2617, _v2618, 0, 6.283), f.stroke(), f.fillStyle = _v2615, f.fillRect(_v2616 - 0.5, _v2617 - _v2618 - 2, 1, 2), f.fillRect(_v2616 - 0.5, _v2617 + _v2618, 1, 2), f.fillRect(_v2616 - _v2618 - 2, _v2617 - 0.5, 2, 1), f.fillRect(_v2616 + _v2618, _v2617 - 0.5, 2, 1));
  }
  (_v2603.marked && (f.strokeStyle = "#a8e070", f.lineWidth = 0.8, f.beginPath(), f.arc(_v2603.x, _v2603.y - _v2603.h - 8, 2.5, 0, 6.283), f.stroke()), _v2603.rift && (f.globalAlpha = 0.5, f.drawImage(Ne(_v2604, "#b080ff", _v2605), _v2611, _v2612 - 1), f.globalAlpha = 1));
  let _v2619 = 1, _v2620 = 1;
  if (_v2603.sqT > 0 && _v2603.frozen <= 0) {
    let _v2621 = _v2603.sqT / 0.12 * (_v2603.sqA || 0.2) * (_v2603.rar >= 2 ? 0.5 : 1);
    (_v2619 = 1 + _v2621, _v2620 = 1 - _v2621 * 0.75);
  }
  let _v2622 = _v2604.w * _v2619, _v2623 = _v2604.h * _v2620, _v2624 = Math.round(_v2603.x - _v2622 / 2 + _v2608), _v2625 = Math.round(_v2603.y - _v2623 + 1 - _v2607 + _v2609);
  (_v2619 !== 1 ? f.drawImage(_v2603.rar ? _v2606 : wu(_v2603.spr, _v2605), _v2624 - (_v2603.rar ? 0 : _v2619), _v2625 - (_v2603.rar ? 0 : _v2620), _v2603.rar ? _v2622 : _v2622 + 2 * _v2619, _v2603.rar ? _v2623 : _v2623 + 2 * _v2620) : _v2603.rar ? f.drawImage(_v2606, _v2611, _v2612) : f.drawImage(wu(_v2603.spr, _v2605), _v2611 - 1, _v2612 - 1), ir.mode !== 1 && ((_v2603.state === "wind" || _v2603.state === "aim" || _v2603.state === "bslam" || _v2603.state === "bnova") && Math.floor(o.T * 20) % 2 && (f.globalAlpha = 0.5, f.drawImage(Ne(_v2604, "#ff6a50", _v2605), _v2611, _v2612), f.globalAlpha = 1), _v2603.frozen > 0 ? (f.globalAlpha = 0.6, f.drawImage(Ne(_v2604, "#aeeaff", _v2605), _v2611, _v2612), f.globalAlpha = 1) : _v2603.chill > 0 && (f.globalAlpha = 0.28, f.drawImage(Ne(_v2604, "#7fd0ff", _v2605), _v2611, _v2612), f.globalAlpha = 1), _v2603.shockT > 0 && j() < 0.25 && L(_v2603.x + O(-4, 4), _v2603.y, 1, ["#a8b4ff", "#fff"], 30, 0.15, {
    z: _v2603.h * 0.6,
    glow: !0,
    g: 0
  }), _v2603.flash > 0 && (f.globalAlpha = Math.min(1, _v2603.flash * 12), f.drawImage(Ne(_v2604, "#ffffff", _v2605), _v2611, _v2612), f.globalAlpha = 1)));
};
V3 = function () {
  for (let _v2626 of o.fx) {
    if (I3.has(_v2626.k)) continue;
    let _v2627 = we(_v2626.t / _v2626.max, 0, 1);
    if (!isFinite(_v2626.x) || !isFinite(_v2626.y)) continue;
    try {
      let _v2628 = _v2626.col && typeof _v2626.col === "string" && _v2626.col[0] === "#" ? ds(_v2626.col) : [1, 0.85, 0.62], _v2629 = Math.max(0, 1 - _v2627), _v2630 = _v2631 => "rgba(" + Math.round(_v2628[0] * 255) + "," + Math.round(_v2628[1] * 255) + "," + Math.round(_v2628[2] * 255) + "," + _v2631.toFixed(3) + ")", _v2632 = _v2626.k === "ring" ? _v2626.r1 || _v2626.r || 24 : _v2626.k === "cone" ? _v2626.r || 24 : _v2626.k === "slash" || _v2626.k === "iai" ? (_v2626.r || 26) + 12 : _v2626.r || _v2626.r1 || 18;
      if (!isFinite(_v2632) || _v2632 <= 0) _v2632 = 18;
      f.save();
      try {
        f.globalCompositeOperation = "lighter";
        let _v2633 = f.createRadialGradient(_v2626.x, _v2626.y - 6, 0, _v2626.x, _v2626.y - 6, _v2632 * 1.6 + 10);
        (_v2633.addColorStop(0, _v2630(0.2 * _v2629)), _v2633.addColorStop(0.55, _v2630(0.07 * _v2629)), _v2633.addColorStop(1, _v2630(0)), f.fillStyle = _v2633, f.beginPath(), f.arc(_v2626.x, _v2626.y - 6, _v2632 * 1.6 + 10, 0, 6.283), f.fill());
      } finally {
        f.restore();
      }
    } catch (_v2634) {}
    if (_v2626.k === "ring") {
      let _v2635 = 1 - Math.pow(1 - _v2627, 3), _v2636 = _v2626.r0 + (_v2626.r1 - _v2626.r0) * _v2635;
      if (!isFinite(_v2636) || _v2636 <= 0) continue;
      (f.globalAlpha = 1 - _v2627, f.strokeStyle = _v2626.col, f.lineWidth = _v2626.w * (1 - _v2627 * 0.5), f.beginPath(), f.ellipse(_v2626.x, _v2626.y, _v2636, _v2636 * 0.78, 0, 0, 6.283), f.stroke(), f.globalAlpha = (1 - _v2627) * 0.4, f.lineWidth = _v2626.w * 1.9 * (1 - _v2627) + 0.4, f.beginPath(), f.ellipse(_v2626.x, _v2626.y, _v2636 * 0.9, _v2636 * 0.7, 0, 0, 6.283), f.stroke(), f.globalAlpha = (1 - _v2627) * 0.55, f.lineWidth = 0.7, f.beginPath(), f.ellipse(_v2626.x, _v2626.y, _v2636 * 1.14, _v2636 * 0.9, 0, 0, 6.283), f.stroke(), f.globalAlpha = 1);
    } else if (_v2626.k === "bolt") (f.globalAlpha = (1 - _v2627) * 0.45, f.globalCompositeOperation = "lighter", f.beginPath(), _v2626.pts.forEach((_v2637, _v2638) => _v2638 ? f.lineTo(_v2637.x, _v2637.y) : f.moveTo(_v2637.x, _v2637.y)), f.strokeStyle = "#6a48ff", f.lineWidth = 5, f.stroke(), f.globalAlpha = 1 - _v2627, f.strokeStyle = _v2626.col, f.lineWidth = 2.2, f.stroke(), f.strokeStyle = "#ffffff", f.lineWidth = 0.8, f.stroke(), f.globalCompositeOperation = "source-over"); else if (_v2626.k === "sky") (_v2626.pts || (_v2626.pts = bo([{
      x: _v2626.x + O(-8, 8),
      y: _v2626.y - 130
    }, {
      x: _v2626.x,
      y: _v2626.y
    }])), f.globalCompositeOperation = "lighter", f.beginPath(), _v2626.pts.forEach((_v2639, _v2640) => _v2640 ? f.lineTo(_v2639.x, _v2639.y) : f.moveTo(_v2639.x, _v2639.y)), f.globalAlpha = (1 - _v2627) * 0.4, f.strokeStyle = "#6a48ff", f.lineWidth = 6 * (1 - _v2627) + 1.5, f.stroke(), f.globalAlpha = 1 - _v2627, f.strokeStyle = _v2626.col, f.lineWidth = 3 * (1 - _v2627) + 0.5, f.stroke(), f.strokeStyle = "#fff", f.lineWidth = 1, f.stroke(), f.globalCompositeOperation = "source-over"); else if (_v2626.k === "slash") (f.globalAlpha = 1 - _v2627, f.strokeStyle = _v2626.col, f.lineWidth = 1.5, f.beginPath(), f.arc(_v2626.x, _v2626.y, _v2626.r, _v2626.ang - 0.9 + _v2627 * 0.6, _v2626.ang + 0.3 + _v2627 * 0.6), f.stroke()); else if (_v2626.k === "cone") {
      (f.globalAlpha = (1 - _v2627) * 0.6, f.globalCompositeOperation = "lighter", f.fillStyle = _v2626.col);
      let _v2641 = _v2626.r * (0.3 + 0.7 * Oa(_v2627));
      (f.beginPath(), f.moveTo(_v2626.x, _v2626.y), f.arc(_v2626.x, _v2626.y, _v2641, _v2626.ang - _v2626.a / 2, _v2626.ang + _v2626.a / 2), f.closePath(), f.fill(), f.globalCompositeOperation = "source-over");
    } else if (_v2626.k === "iai") {
      let _v2642 = _v2627 < 0.2 ? _v2627 / 0.2 : 1 - (_v2627 - 0.2) / 0.8;
      (f.globalAlpha = 1, f.globalCompositeOperation = "lighter", f.strokeStyle = "#ffffff", f.lineWidth = 2.5 * _v2642 + 0.3, f.beginPath(), f.moveTo(_v2626.x0, _v2626.y0), f.lineTo(_v2626.x1, _v2626.y1), f.stroke(), f.strokeStyle = "#ff8090", f.lineWidth = 0.6, f.stroke(), f.globalCompositeOperation = "source-over");
    } else if (_v2626.k === "star") {
      (f.globalAlpha = 1 - _v2627, f.fillStyle = _v2626.col);
      let _v2643 = _v2626.r * (0.5 + 0.5 * Oa(_v2627));
      f.beginPath();
      for (let _v2644 = 0; _v2644 < 8; _v2644++) {
        let _v2645 = _v2644 / 8 * 6.283, _v2646 = _v2644 % 2 ? _v2643 * 0.22 : _v2643;
        f.lineTo(_v2626.x + Math.cos(_v2645) * _v2646, _v2626.y + Math.sin(_v2645) * _v2646);
      }
      (f.closePath(), f.fill());
    } else if (_v2626.k === "chainl") (f.globalCompositeOperation = "lighter", f.globalAlpha = (1 - _v2627) * 0.5, f.strokeStyle = _v2626.col, f.lineWidth = 4 * (1 - _v2627) + 1, f.beginPath(), f.moveTo(_v2626.x1, _v2626.y1), f.lineTo(_v2626.x2, _v2626.y2), f.stroke(), f.globalAlpha = 1 - _v2627, f.strokeStyle = "#ffffff", f.lineWidth = 0.9, f.stroke(), f.globalCompositeOperation = "source-over"); else if (_v2626.k === "lines") {
      (f.globalAlpha = (1 - _v2627) * 0.85, f.strokeStyle = "#ffffff", f.lineWidth = 0.8);
      for (let _v2647 = 0; _v2647 < 20; _v2647++) {
        let _v2648 = _v2647 / 20 * 6.283 + _v2647 * 37 % 7 * 0.05, _v2649 = 26 + _v2647 % 3 * 6, _v2650 = 180;
        (f.beginPath(), f.moveTo(_v2626.x + Math.cos(_v2648) * _v2649, _v2626.y + Math.sin(_v2648) * _v2649), f.lineTo(_v2626.x + Math.cos(_v2648) * _v2650, _v2626.y + Math.sin(_v2648) * _v2650), f.stroke());
      }
    } else if (_v2626.k === "spike") {
      let _v2651 = (_v2627 < 0.15 ? _v2627 / 0.15 : 1) * 14 * _v2626.s, _v2652 = _v2627 > 0.7 ? 1 - (_v2627 - 0.7) / 0.3 : 1;
      (f.globalAlpha = _v2652, f.fillStyle = "#9fe8ff", f.beginPath(), f.moveTo(_v2626.x - 4, _v2626.y), f.lineTo(_v2626.x, _v2626.y - _v2651), f.lineTo(_v2626.x + 4, _v2626.y), f.closePath(), f.fill(), f.fillStyle = "#e8fbff", f.beginPath(), f.moveTo(_v2626.x - 1, _v2626.y), f.lineTo(_v2626.x, _v2626.y - _v2651), f.lineTo(_v2626.x + 1.5, _v2626.y), f.closePath(), f.fill(), f.fillStyle = "#5fb4e8", f.beginPath(), f.moveTo(_v2626.x + 3, _v2626.y), f.lineTo(_v2626.x + 6, _v2626.y - _v2651 * 0.5), f.lineTo(_v2626.x + 7, _v2626.y), f.closePath(), f.fill());
    } else if (_v2626.k === "arrow") {
      if (_v2626.t < 0) continue;
      let _v2653 = 1 - _v2627;
      (f.globalAlpha = 1, f.strokeStyle = "#c8b890", f.lineWidth = 0.8, f.beginPath(), f.moveTo(_v2626.x + _v2653 * 24, _v2626.y - _v2653 * 80 - 8), f.lineTo(_v2626.x + _v2653 * 24 - 2, _v2626.y - _v2653 * 80), f.stroke());
    } else if (_v2626.k === "comet") {
      let _v2654 = 1 - _v2627, _v2655 = _v2626.x - _v2654 * 60, _v2656 = _v2626.y - _v2654 * 170, _v2657 = 0.88 + Math.sin(o.T * 24) * 0.12;
      f.save();
      f.globalCompositeOperation = "lighter";
      let _v2658 = f.createLinearGradient(_v2655 - 34, _v2656 - 92, _v2655 + 5, _v2656 + 5);
      _v2658.addColorStop(0, "rgba(65,174,255,0)");
      _v2658.addColorStop(0.38, "rgba(76,194,255,0.18)");
      _v2658.addColorStop(0.78, "rgba(150,231,255,0.42)");
      _v2658.addColorStop(1, "rgba(245,255,255,0.75)");
      f.fillStyle = _v2658;
      f.globalAlpha = 0.8;
      f.beginPath();
      f.moveTo(_v2655 - 5, _v2656 - 4);
      f.lineTo(_v2655 - 24, _v2656 - 33);
      f.lineTo(_v2655 - 51, _v2656 - 70);
      f.lineTo(_v2655 - 34, _v2656 - 52);
      f.lineTo(_v2655 - 62, _v2656 - 94);
      f.lineTo(_v2655 - 22, _v2656 - 72);
      f.lineTo(_v2655 - 35, _v2656 - 43);
      f.lineTo(_v2655 + 4, _v2656 - 13);
      f.closePath();
      f.fill();
      for (let _v2659 = 0; _v2659 < 42; _v2659++) {
        let _v2660 = _v2659 * 37 % 43 / 43, _v2661 = _v2655 - 6 - _v2660 * 42 + Math.sin(_v2659 * 2.17 + o.T * 3) * (2 + _v2660 * 10), _v2662 = _v2656 - 8 - _v2660 * 82 + Math.cos(o.T * 7 + _v2659) * 4, _v2663 = 0.8 + _v2659 % 5 * 0.42;
        f.globalAlpha = (0.66 - _v2660 * 0.48) * (0.65 + 0.35 * Math.sin(o.T * 15 + _v2659));
        f.fillStyle = _v2659 % 5 === 0 ? "#ffffff" : _v2659 % 3 === 0 ? "#55caff" : "#a8edff";
        f.beginPath();
        if (_v2659 % 3 === 0) {
          f.moveTo(_v2661, _v2662 - _v2663 * 1.8);
          f.lineTo(_v2661 + _v2663, _v2662);
          f.lineTo(_v2661 - _v2663 * 0.7, _v2662 + _v2663);
          f.closePath();
          f.fill();
        } else {
          f.beginPath();
          f.arc(_v2661, _v2662, _v2663, 0, Math.PI * 2);
          f.fill();
        }
      }
      f.globalAlpha = 0.25 * _v2657;
      let _v2664 = f.createRadialGradient(_v2655, _v2656, 2, _v2655, _v2656, 30);
      _v2664.addColorStop(0, "rgba(230,252,255,0.8)");
      _v2664.addColorStop(0.45, "rgba(72,195,255,0.28)");
      _v2664.addColorStop(1, "rgba(72,195,255,0)");
      f.fillStyle = _v2664;
      f.beginPath();
      f.arc(_v2655, _v2656, 30, 0, Math.PI * 2);
      f.fill();
      f.globalCompositeOperation = "lighter";
      let _v2665 = f.createRadialGradient(0, 0, 1, 0, 0, 42);
      _v2665.addColorStop(0, "rgba(255,255,255,0.98)");
      _v2665.addColorStop(0.16, "rgba(205,250,255,0.82)");
      _v2665.addColorStop(0.42, "rgba(86,201,255,0.42)");
      _v2665.addColorStop(0.72, "rgba(92,145,255,0.16)");
      _v2665.addColorStop(1, "rgba(80,130,255,0)");
      f.globalAlpha = 0.82 * _v2657;
      f.fillStyle = _v2665;
      f.beginPath();
      f.arc(_v2655, _v2656, 42, 0, Math.PI * 2);
      f.fill();
      let _v2666 = f.createRadialGradient(_v2655 - 2, _v2656 - 2, 0, _v2655, _v2656, 21);
      _v2666.addColorStop(0, "rgba(255,255,255,1)");
      _v2666.addColorStop(0.24, "rgba(236,255,255,0.96)");
      _v2666.addColorStop(0.58, "rgba(104,218,255,0.68)");
      _v2666.addColorStop(1, "rgba(76,160,255,0)");
      f.globalAlpha = 0.95;
      f.fillStyle = _v2666;
      f.beginPath();
      f.arc(_v2655, _v2656, 21, 0, Math.PI * 2);
      f.fill();
      f.globalCompositeOperation = "source-over";
      f.translate(_v2655, _v2656);
      f.rotate(-0.48 + Math.sin(o.T * 4) * 0.08);
      const _v2667 = [[-13, -5, 4.2, "#2b719e"], [-9, -12, 3.4, "#5ecfff"], [-3, -15, 2.6, "#d9faff"], [4, -12, 4.0, "#2f8fc5"], [11, -7, 3.0, "#a5edff"], [13, 1, 3.7, "#276b9c"], [8, 8, 4.2, "#55bde9"], [2, 13, 3.0, "#e5fbff"], [-6, 11, 4.0, "#347fac"], [-13, 6, 3.3, "#72d8ff"], [-17, -1, 2.4, "#b9f3ff"], [-4, 1, 5.0, "#d9fbff"], [2, -4, 4.5, "#ffffff"], [7, 1, 2.7, "#d7f8ff"], [-7, -4, 2.6, "#f5ffff"]];
      for (let _v2668 = 0; _v2668 < _v2667.length; _v2668++) {
        let _v2669 = _v2667[_v2668], _v2670 = Math.sin(o.T * 8 + _v2668 * 1.7) * 0.65;
        f.globalAlpha = 0.72 + 0.28 * Math.sin(o.T * 13 + _v2668 * 2);
        f.fillStyle = _v2669[3];
        f.beginPath();
        f.moveTo(_v2669[0] - _v2669[2] * 0.7, _v2669[1] - _v2669[2] * 0.4);
        f.lineTo(_v2669[0] + _v2669[2] * 0.45 + _v2670, _v2669[1] - _v2669[2]);
        f.lineTo(_v2669[0] + _v2669[2], _v2669[1] + _v2669[2] * 0.2);
        f.lineTo(_v2669[0] + _v2669[2] * 0.15, _v2669[1] + _v2669[2] * 0.85);
        f.lineTo(_v2669[0] - _v2669[2] * 0.9, _v2669[1] + _v2669[2] * 0.25);
        f.closePath();
        f.fill();
      }
      const _v2671 = [[-25, -12, 2.8, "#5bcaff"], [22, -14, 2.2, "#eaffff"], [25, 5, 3.1, "#66cfff"], [-19, 19, 2.5, "#a8edff"], [3, 25, 2.0, "#ffffff"], [-28, 2, 1.8, "#d5f8ff"], [14, -27, 2.0, "#8adfff"]];
      for (let _v2672 = 0; _v2672 < _v2671.length; _v2672++) {
        let _v2673 = _v2671[_v2672], _v2674 = 0.75 + 0.25 * Math.sin(o.T * 17 + _v2672 * 2.4);
        f.globalAlpha = _v2674;
        f.fillStyle = _v2673[3];
        f.beginPath();
        f.arc(_v2673[0], _v2673[1], _v2673[2], 0, Math.PI * 2);
        f.fill();
      }
      f.globalAlpha = 0.98;
      f.fillStyle = "#ffffff";
      f.beginPath();
      f.arc(-1, -2, 3.2, 0, Math.PI * 2);
      f.fill();
      f.globalAlpha = 0.7;
      f.strokeStyle = "#eaffff";
      f.lineWidth = 1;
      f.beginPath();
      f.moveTo(-12, -1);
      f.lineTo(-5, -3);
      f.moveTo(3, 5);
      f.lineTo(10, 2);
      f.stroke();
      f.restore();
    } else if (_v2626.k === "meteor") {
      let _v2675 = 1 - _v2627, _v2676 = _v2626.x + _v2675 * 70, _v2677 = _v2626.y - _v2675 * 170, _v2678 = 0.85 + Math.sin(o.T * 31) * 0.15;
      f.save();
      f.globalCompositeOperation = "lighter";
      let _v2679 = f.createLinearGradient(_v2676 + 28, _v2677 - 96, _v2676 - 3, _v2677 + 5);
      _v2679.addColorStop(0, "rgba(255,70,18,0)");
      _v2679.addColorStop(0.32, "rgba(255,76,18,0.18)");
      _v2679.addColorStop(0.72, "rgba(255,140,28,0.48)");
      _v2679.addColorStop(1, "rgba(255,236,150,0.78)");
      f.fillStyle = _v2679;
      f.globalAlpha = 0.85;
      f.beginPath();
      f.moveTo(_v2676 - 3, _v2677 - 5);
      f.lineTo(_v2676 + 22, _v2677 - 31);
      f.lineTo(_v2676 + 45, _v2677 - 61);
      f.lineTo(_v2676 + 30, _v2677 - 52);
      f.lineTo(_v2676 + 59, _v2677 - 94);
      f.lineTo(_v2676 + 17, _v2677 - 70);
      f.lineTo(_v2676 + 34, _v2677 - 42);
      f.lineTo(_v2676 - 9, _v2677 - 13);
      f.closePath();
      f.fill();
      for (let _v2680 = 0; _v2680 < 48; _v2680++) {
        let _v2681 = _v2680 * 17 % 53 / 53, _v2682 = _v2676 + 6 + _v2681 * 42 + Math.sin(_v2680 * 1.91 + o.T * 4) * (2 + _v2681 * 10), _v2683 = _v2677 - 8 - _v2681 * 84 + Math.cos(o.T * 9 + _v2680) * 4, _v2684 = 0.8 + _v2680 % 5 * 0.4;
        f.globalAlpha = (0.76 - _v2681 * 0.53) * (0.6 + 0.4 * Math.sin(o.T * 20 + _v2680));
        f.fillStyle = _v2680 % 5 === 0 ? "#fff7cf" : _v2680 % 2 === 0 ? "#ffb13b" : "#ff4b12";
        f.beginPath();
        if (_v2680 % 4 === 0) {
          f.moveTo(_v2682, _v2683 - _v2684 * 1.8);
          f.lineTo(_v2682 + _v2684, _v2683);
          f.lineTo(_v2682 - _v2684, _v2683 + _v2684);
          f.closePath();
          f.fill();
        } else {
          f.beginPath();
          f.arc(_v2682, _v2683, _v2684, 0, Math.PI * 2);
          f.fill();
        }
      }
      f.globalAlpha = 0.23 * _v2678;
      let _v2685 = f.createRadialGradient(_v2676, _v2677, 2, _v2676, _v2677, 31);
      _v2685.addColorStop(0, "rgba(255,242,176,0.9)");
      _v2685.addColorStop(0.45, "rgba(255,91,22,0.28)");
      _v2685.addColorStop(1, "rgba(255,91,22,0)");
      f.fillStyle = _v2685;
      f.beginPath();
      f.arc(_v2676, _v2677, 31, 0, Math.PI * 2);
      f.fill();
      f.globalCompositeOperation = "source-over";
      f.translate(_v2676, _v2677);
      f.rotate(0.38 + Math.sin(o.T * 3.5) * 0.1);
      f.globalCompositeOperation = "lighter";
      let _v2686 = f.createRadialGradient(0, 0, 1, 0, 0, 43);
      _v2686.addColorStop(0, "rgba(255,255,225,0.98)");
      _v2686.addColorStop(0.16, "rgba(255,205,92,0.9)");
      _v2686.addColorStop(0.42, "rgba(255,91,22,0.5)");
      _v2686.addColorStop(0.72, "rgba(255,56,12,0.18)");
      _v2686.addColorStop(1, "rgba(255,56,12,0)");
      f.globalAlpha = 0.72 * _v2678;
      f.fillStyle = _v2686;
      f.beginPath();
      f.arc(0, 0, 43, 0, Math.PI * 2);
      f.fill();
      let _v2687 = f.createRadialGradient(-2, -2, 0, 0, 0, 22);
      _v2687.addColorStop(0, "rgba(255,255,235,0.95)");
      _v2687.addColorStop(0.22, "rgba(255,204,92,0.82)");
      _v2687.addColorStop(0.58, "rgba(255,80,15,0.4)");
      _v2687.addColorStop(1, "rgba(255,80,15,0)");
      f.globalAlpha = 0.8;
      f.fillStyle = _v2687;
      f.beginPath();
      f.arc(0, 0, 22, 0, Math.PI * 2);
      f.fill();
      f.globalCompositeOperation = "source-over";
      const _v2688 = [[-13, -7, 4.2, "#201512"], [-8, -15, 3.8, "#563023"], [-1, -17, 3.1, "#2b1b16"], [7, -13, 4.4, "#6a3522"], [14, -7, 3.4, "#281713"], [16, 2, 4.0, "#48251a"], [10, 10, 4.5, "#241612"], [2, 15, 3.3, "#69351f"], [-7, 12, 4.3, "#301b15"], [-15, 7, 3.4, "#5a2b1b"], [-18, -1, 2.8, "#241511"], [-5, -3, 4.2, "#a33c16"], [2, -7, 3.5, "#ff6a18"], [6, 1, 3.6, "#51251a"], [-2, 5, 3.1, "#ff9a27"], [7, 7, 2.4, "#e34a13"]];
      for (let _v2689 = 0; _v2689 < _v2688.length; _v2689++) {
        let _v2690 = _v2688[_v2689], _v2691 = Math.sin(o.T * 9 + _v2689 * 1.9) * 0.55;
        f.globalAlpha = 0.78 + 0.22 * Math.sin(o.T * 16 + _v2689 * 2.1);
        f.fillStyle = _v2690[3];
        f.beginPath();
        f.moveTo(_v2690[0] - _v2690[2] * 0.8, _v2690[1] - _v2690[2] * 0.2);
        f.lineTo(_v2690[0] + _v2690[2] * 0.25 + _v2691, _v2690[1] - _v2690[2]);
        f.lineTo(_v2690[0] + _v2690[2], _v2690[1] + _v2690[2] * 0.35);
        f.lineTo(_v2690[0] + _v2690[2] * 0.1, _v2690[1] + _v2690[2] * 0.9);
        f.lineTo(_v2690[0] - _v2690[2] * 0.9, _v2690[1] + _v2690[2] * 0.25);
        f.closePath();
        f.fill();
      }
      const _v2692 = [[-25, -12, 2.5, "#ff8a24"], [22, -15, 2.7, "#3a2118"], [25, 5, 2.4, "#ff5a16"], [-19, 20, 2.6, "#7d3b20"], [3, 25, 2.0, "#ffb33b"], [-28, 2, 1.9, "#ff6a1a"], [14, -27, 2.2, "#ffcf62"]];
      for (let _v2693 = 0; _v2693 < _v2692.length; _v2693++) {
        let _v2694 = _v2692[_v2693], _v2695 = 0.68 + 0.32 * Math.sin(o.T * 19 + _v2693 * 2.2);
        f.globalAlpha = _v2695;
        f.fillStyle = _v2694[3];
        f.beginPath();
        f.moveTo(_v2694[0] - _v2694[2], _v2694[1] - _v2694[2] * 0.2);
        f.lineTo(_v2694[0] + _v2694[2] * 0.6, _v2694[1] - _v2694[2]);
        f.lineTo(_v2694[0] + _v2694[2], _v2694[1] + _v2694[2] * 0.5);
        f.lineTo(_v2694[0] - _v2694[2] * 0.6, _v2694[1] + _v2694[2]);
        f.closePath();
        f.fill();
      }
      f.globalCompositeOperation = "lighter";
      f.globalAlpha = 0.9;
      f.fillStyle = "#fff4c8";
      f.beginPath();
      f.arc(-2, -3, 2.2, 0, Math.PI * 2);
      f.fill();
      f.fillStyle = "#ffb33b";
      f.beginPath();
      f.arc(5, 4, 1.6, 0, Math.PI * 2);
      f.fill();
      f.globalAlpha = 0.72;
      f.strokeStyle = "#ff7a1b";
      f.lineWidth = 1.1;
      f.beginPath();
      f.moveTo(-10, -4);
      f.lineTo(-5, -1);
      f.moveTo(1, -12);
      f.lineTo(4, -8);
      f.moveTo(7, 8);
      f.lineTo(11, 4);
      f.stroke();
      f.restore();
    }
  }
  f.globalAlpha = 1;
};
xv = function () {
  o.LIGHTS = [];
  let _v2696 = _v2697 => 0.85 + Math.sin(o.T * 9 + _v2697) * 0.08 + j() * 0.05;
  o.LIGHTS.push({
    x: o.pl.x,
    y: o.pl.y - 6,
    r: o.Z.type === "hideout" ? 190 : 135,
    i: 1
  });
  let _v2698 = o1();
  _v2698 && o.LIGHTS.push(_v2698);
  let _v2699 = Ud(Wa("wings"));
  _v2699 && o.LIGHTS.push(_v2699);
  let _v2700 = G1(Wa("back"));
  _v2700 && o.LIGHTS.push(_v2700);
  let _v2701 = Xm();
  (_v2701 && o.LIGHTS.push(_v2701), o.Z.lights.forEach((_v2702, _v2703) => o.LIGHTS.push({
    x: _v2702.x,
    y: _v2702.y,
    r: _v2702.r * (_v2702.torch ? _v2696(_v2703) : 1),
    c: _v2702.c,
    i: _v2702.i,
    env: 1
  })));
  for (let _v2704 of o.projs) o.LIGHTS.push({
    x: _v2704.x,
    y: _v2704.y - 6,
    r: _v2704.kind === "fireball" ? 42 : 26,
    c: _v2704.kind === "fireball" ? "#ff8a30" : Pt[_v2704.c.dom],
    i: 0.8
  });
  for (let _v2705 of o.eprojs) o.LIGHTS.push({
    x: _v2705.x,
    y: _v2705.y - 6,
    r: 20,
    c: _v2705.col,
    i: 0.7
  });
  for (let _v2706 of o.fx) {
    if ((_v2706.k === "flash" && o.LIGHTS.push({
      x: _v2706.x,
      y: _v2706.y,
      r: _v2706.r * 1.4 * (1 - _v2706.t / _v2706.max),
      c: null,
      i: 1
    }), _v2706.k === "bolt")) {
      let _v2707 = _v2706.pts[Math.floor(_v2706.pts.length / 2)];
      o.LIGHTS.push({
        x: _v2707.x,
        y: _v2707.y,
        r: 80,
        c: "#a8b4ff",
        i: 0.8
      });
    }
    (_v2706.k === "sky" && o.LIGHTS.push({
      x: _v2706.x,
      y: _v2706.y,
      r: 70,
      c: "#a8b4ff",
      i: 0.9
    }), _v2706.k === "tele" && o.LIGHTS.push({
      x: _v2706.x,
      y: _v2706.y,
      r: _v2706.r * 1.3,
      c: _v2706.col,
      i: 0.5
    }), _v2706.k === "cone" && o.LIGHTS.push({
      x: _v2706.x,
      y: _v2706.y,
      r: _v2706.r,
      c: _v2706.col,
      i: 0.6
    }));
  }
  for (let _v2708 of o.loots) _v2708.beam && _v2708.landed && !_v2708.hid && o.LIGHTS.push({
    env: 1,
    x: _v2708.x,
    y: _v2708.y,
    r: _v2708.big ? 60 : 36,
    c: _v2708.beam,
    i: 0.8
  });
  for (let _v2709 of o.objs) (_v2709.kind === "rift" && _v2709.st !== "done" && o.LIGHTS.push({
    env: 1,
    x: _v2709.x,
    y: _v2709.y,
    r: _v2709.st === "open" ? _v2709.R + 40 : 50,
    c: "#9a60ff",
    i: 0.8
  }), _v2709.kind === "abyss" && (o.LIGHTS.push({
    env: 1,
    x: _v2709.x,
    y: _v2709.y,
    r: _v2709.st === "sealed" || _v2709.st === "done" ? 50 : 110,
    c: "#2ee6a8",
    i: 0.85
  }), _v2709.fissures.forEach(_v2710 => {
    !_v2710.closed && o.LIGHTS.push({
      env: 1,
      x: _v2710.x,
      y: _v2710.y,
      r: 44,
      c: "#2ee6a8",
      i: 0.55
    });
  })), _v2709.kind === "device" && o.LIGHTS.push({
    env: 1,
    x: _v2709.x,
    y: _v2709.y,
    r: 70,
    c: h.device ? Wt[h.device.theme].torch : "#8a6aff",
    i: 0.8
  }), _v2709.kind === "box" && !_v2709.open && o.LIGHTS.push({
    env: 1,
    x: _v2709.x,
    y: _v2709.y,
    r: 26,
    c: _v2709.abyssBox ? "#4dff88" : "#ffd060",
    i: _v2709.abyssBox ? 0.7 : 0.5
  }), _v2709.kind === "mirror" && o.LIGHTS.push({
    env: 1,
    x: _v2709.x,
    y: _v2709.y,
    r: 55,
    c: "#cfd8e8",
    i: 0.7
  }), _v2709.kind === "ritual" && o.LIGHTS.push({
    env: 1,
    x: _v2709.x,
    y: _v2709.y,
    r: 50,
    c: "#d06a8a",
    i: 0.75
  }));
  for (let _v2711 of o.orbs || []) o.LIGHTS.push({
    env: 1,
    x: _v2711.x,
    y: _v2711.y - 12,
    r: 70,
    c: "#8a70ff",
    i: 0.8
  });
  for (let _v2712 of o.grenades || []) o.LIGHTS.push({
    x: _v2712.x,
    y: _v2712.y - _v2712.z,
    r: 14,
    c: "#ffb040",
    i: 0.5
  });
  for (let _v2713 of o.grounds) o.LIGHTS.push({
    x: _v2713.x,
    y: _v2713.y,
    r: _v2713.oil ? _v2713.r * 1.8 : 20,
    c: "#ff6a1a",
    i: 0.5
  });
  for (let _v2714 of o.walls) o.LIGHTS.push({
    x: (_v2714.x1 + _v2714.x2) / 2,
    y: (_v2714.y1 + _v2714.y2) / 2,
    r: 55,
    c: "#ff6a1a",
    i: 0.8
  });
  for (let _v2715 of o.bombs) o.LIGHTS.push({
    x: _v2715.x,
    y: _v2715.y,
    r: _v2715.r + 10,
    c: "#7fd0ff",
    i: 0.5
  });
  for (let _v2716 of o.bells) o.LIGHTS.push({
    x: _v2716.x,
    y: _v2716.y - 12,
    r: 40,
    c: "#ffe060",
    i: 0.6
  });
  for (let _v2717 of o.sticks) o.LIGHTS.push({
    x: _v2717.x,
    y: _v2717.y - 8,
    r: 16,
    c: "#ff8a30",
    i: 0.6
  });
  for (let _v2718 of o.haz) _v2718.kind === "pool" && _v2718.el === "fire" && o.LIGHTS.push({
    x: _v2718.x,
    y: _v2718.y,
    r: _v2718.r + 12,
    c: "#ff6a1a",
    i: 0.5
  });
  for (let _v2719 of o.objs) (_v2719.kind === "vent" && o.LIGHTS.push({
    x: _v2719.x,
    y: _v2719.y,
    r: _v2719.st === "tele" ? 60 : 26,
    c: "#ff6a1a",
    i: _v2719.st === "tele" ? 0.9 : 0.4
  }), _v2719.kind === "enc" && _v2719.st !== "done" && _v2719.st !== "fail" && o.LIGHTS.push({
    x: _v2719.x,
    y: _v2719.y,
    r: 50,
    c: tt[_v2719.type] ? tt[_v2719.type].col : "#fff",
    i: 0.6
  }));
  o.pl.clone && o.LIGHTS.push({
    x: o.pl.clone.x,
    y: o.pl.clone.y - 6,
    r: 30,
    c: "#8a70c0",
    i: 0.5
  });
  for (let _v2720 of o.objs) _v2720.kind === "shrine" && !_v2720.used && o.LIGHTS.push({
    x: _v2720.x,
    y: _v2720.y - 14,
    r: 46,
    c: Ea.find(_v2721 => _v2721.k === _v2720.type).col,
    i: 0.8
  });
  if (o.pl.shrineT > 0) {
    let _v2722 = Ea.find(_v2723 => _v2723.k === o.pl.shrine);
    _v2722 && o.LIGHTS.push({
      x: o.pl.x,
      y: o.pl.y - 6,
      r: 50,
      c: _v2722.col,
      i: 0.5
    });
  }
  for (let _v2724 of o.mons) _v2724.rar === 3 && !_v2724.dead && o.LIGHTS.push({
    x: _v2724.x,
    y: _v2724.y - 10,
    r: 60,
    c: "#ff6020",
    i: 0.6
  });
  o.pl.kishinT > 0 && o.LIGHTS.push({
    x: o.pl.x,
    y: o.pl.y - 6,
    r: 60,
    c: "#ff3a1a",
    i: 0.8
  });
};
Y3 = function () {
  let _v2725 = o.Z.M, _v2726 = o.touchMode && o.miniBox, _v2727 = _v2726 ? Math.min(1.6, _v2726.w / _v2725.W) : Math.min(1.9, nl * 0.2 / _v2725.W), _v2728 = _v2726 ? _v2726.right ? _v2726.x - _v2725.W * _v2727 : _v2726.x : nl - _v2725.W * _v2727 - 10, _v2729 = _v2726 ? _v2726.y : Math.min(Lc * 0.25, 74);
  (f.setTransform(rr * _v2727, 0, 0, rr * _v2727, _v2728 * rr, _v2729 * rr), f.globalAlpha = 0.85, f.fillStyle = "rgba(0,0,0,0.35)", f.fillRect(-1, -1, _v2725.W + 2, _v2725.H + 2), f.drawImage(o.Z.mini, 0, 0));
  let _v2730 = _v2725.rooms[_v2725.rooms.length - 1];
  (f.fillStyle = o.Z.done ? "#6a6a6a" : "#ff4030", f.fillRect(_v2730.cx - 1, _v2730.cy - 1, 3, 3));
  for (let _v2731 of o.objs) {
    let _v2732 = Math.floor(_v2731.x / N), _v2733 = Math.floor(_v2731.y / N);
    o.Z.explored[_v2733 * _v2725.W + _v2732] && (_v2731.kind === "box" && !_v2731.open && (f.fillStyle = "#ffd060", f.fillRect(_v2732 - 1, _v2733 - 1, 2, 2)), _v2731.kind === "rift" && _v2731.st !== "done" && (f.fillStyle = "#b080ff", f.fillRect(_v2732 - 1, _v2733 - 1, 3, 3)), _v2731.kind === "abyss" && (f.fillStyle = _v2731.st === "done" ? "#6a6a6a" : "#2ee6a8", f.fillRect(_v2732 - 1, _v2733 - 1, 3, 3)), _v2731.kind === "abyss" && _v2731.fissures.forEach(_v2734 => {
      if (_v2734.closed) return;
      let _v2735 = Math.floor(_v2734.x / N), _v2736 = Math.floor(_v2734.y / N);
      (f.fillStyle = "#9dffb4", f.fillRect(_v2735 - 1, _v2736 - 1, 2, 2));
    }), _v2731.kind === "mirror" && (f.fillStyle = "#cfd8e8", f.fillRect(_v2732 - 1, _v2733 - 1, 3, 3)), _v2731.kind === "ritual" && (f.fillStyle = _v2731.st === "done" ? "#ffd0e0" : "#d06a8a", f.fillRect(_v2732 - 1, _v2733 - 1, 3, 3)), _v2731.kind === "enc" && (_v2731.st === "idle" || _v2731.st === "active" || _v2731.st === "chest") && (f.fillStyle = tt[_v2731.type].col, f.fillRect(_v2732 - 1, _v2733 - 1, 3, 3)), _v2731.kind === "shrine" && !_v2731.used && (f.fillStyle = Ea.find(_v2737 => _v2737.k === _v2731.type).col, f.fillRect(_v2732 - 1, _v2733 - 1, 3, 3)));
  }
  (f.fillStyle = "#ffffff", f.fillRect(o.pl.x / N - 1, o.pl.y / N - 1, 2, 2), f.globalAlpha = 1);
};
Pv = function (_v2738) {
  for (let _v2739 in o.pl.cds) o.pl.cds[_v2739] > 0 && (o.pl.cds[_v2739] -= _v2738);
  for (let _v2740 of ["parryT", "noutouT", "drT", "disT", "waveT", "parryBuffT", "shrineT", "shrineT2", "noHitT"]) o.pl[_v2740] > 0 && (o.pl[_v2740] -= _v2738);
  (o.pl.noHitT = o.pl.noHitT || 0, o.pl.sinceHit = (o.pl.sinceHit || 0) + _v2738, hS(_v2738));
  for (let _v2741 = o.sticks.length - 1; _v2741 >= 0; _v2741--) {
    let _v2742 = o.sticks[_v2741];
    (_v2742.t -= _v2738, _v2742.host && !_v2742.host.dead && (_v2742.x = _v2742.host.x, _v2742.y = _v2742.host.y), _v2742.t <= 0 && Gu(_v2742, 1));
  }
  for (let _v2743 of o.bells.slice()) (_v2743.t -= _v2738, _v2743.t <= 0 && _0(_v2743, "crack"));
  for (let _v2744 of o.walls) {
    if ((_v2744.t -= _v2738, _v2744.tick -= _v2738, j() < 0.8)) {
      let _v2745 = j();
      o.parts.push({
        x: os(_v2744.x1, _v2744.x2, _v2745) + O(-1, 1),
        y: os(_v2744.y1, _v2744.y2, _v2745),
        z: 1,
        vx: O(-4, 4),
        vy: 0,
        vz: O(20, 45),
        g: -20,
        life: 0.5,
        max: 0.5,
        col: se(["#ff6a1a", "#ffb040", "#ffd060"]),
        s: 1,
        glow: !0,
        drag: 1
      });
    }
    if (_v2744.tick <= 0) {
      _v2744.tick = 0.3;
      for (let _v2746 of o.mons) _v2746.dead || _v2746.dummy && !1 || xc(_v2746.x, _v2746.y, _v2744.x1, _v2744.y1, _v2744.x2, _v2744.y2) < _v2746.r + 6 && (ee(_v2746, _v2744.c, _v2744.src, 0.3, {
        el: "fire"
      }), !_v2746.dead && !_v2746.ign && (_v2746.ign = {
        dps: _v2744.c.avg * 0.3,
        t: 2,
        src: _v2744.src
      }));
    }
  }
  o.walls = o.walls.filter(_v2747 => _v2747.t > 0);
  for (let _v2748 of o.bombs.slice()) {
    if ((_v2748.t -= _v2738, _v2748.pulse -= _v2738, _v2748.pulse <= 0)) {
      (_v2748.pulse = 0.5, o.fx.push({
        k: "ring",
        x: _v2748.x,
        y: _v2748.y,
        r0: _v2748.r * 0.6,
        r1: _v2748.r,
        t: 0,
        max: 0.4,
        col: "#7fd0ff",
        w: 1
      }));
      for (let _v2749 of o.mons) !_v2749.dead && (_v2749.x - _v2748.x) ** 2 + (_v2749.y - _v2748.y) ** 2 < _v2748.r * _v2748.r && (_v2749.chill = 1, _v2749.chillAmt = Math.max(_v2749.chillAmt, 0.35));
    }
    _v2748.t <= 0 && Pc(_v2748, 1);
  }
  mS(_v2738);
  for (let _v2750 of o.mons) (_v2750.mark && (_v2750.mark.t -= _v2738, _v2750.mark.t <= 0 && (_v2750.mark = null)), _v2750.expT > 0 && (_v2750.expT -= _v2738, _v2750.expT <= 0 && (_v2750.res.cold += _v2750.expA || 0, _v2750.expA = 0)));
  for (let _v2751 of o.objs) if (_v2751.kind === "shrine" && !_v2751.used && (_v2751.x - o.pl.x) ** 2 + (_v2751.y - o.pl.y) ** 2 < 324) {
    (_v2751.used = !0, o.pl.shrine = _v2751.type, o.pl.shrineT = 45, o.pl.shrine2 = null, o.pl.shrineT2 = 0);
    let _v2752 = Ea.find(_v2753 => _v2753.k === _v2751.type), _v2754 = null;
    OmHas("omen_prayer") && OmTake("omen_prayer", _v2751.x, _v2751.y - 20) && (_v2754 = se(Ea.filter(_v2755 => _v2755.k !== _v2751.type)), o.pl.shrine2 = _v2754.k, o.pl.shrineT2 = 45, L(_v2751.x, _v2751.y, 40, [_v2754.col, "#ffffff"], 90, 0.9, {
      glow: !0,
      vz: 140,
      g: 60
    }));
    (M("shrine"), $e(_v2752.n + (_v2754 ? " + " + _v2754.n : ""), _v2752.d + (_v2754 ? " · " + _v2754.d : "") + " · 45 秒"), L(_v2751.x, _v2751.y, 40, [_v2752.col, "#ffffff"], 90, 0.9, {
      glow: !0,
      vz: 140,
      g: 60
    }));
  }
};
il = function (_v2756) {
  return !!(o.pl && (o.pl.shrineT > 0 && o.pl.shrine === _v2756 || o.pl.shrineT2 > 0 && o.pl.shrine2 === _v2756));
};
Le = function (_v2757, _v2758, _v2759, _v2760, _v2761, _v2762, _v2763 = {}) {
  let _v2764 = {
    id: _v2757,
    t: _v2758,
    slots: _v2759,
    text: _v2760,
    stat: _v2761,
    ranges: _v2762,
    w: _v2763.w || 100,
    lv: _v2763.lv || Jk,
    div: _v2763.div || 1,
    nm: _v2763.nm || "",
    dsec: !!_v2763.dsec,
    fac: _v2763.fac || null,
    pair: Array.isArray(_v2762[0][0])
  };
  (Yt[_v2757] = _v2764, ml.push(_v2764));
};
_t = function (_v2765, _v2766) {
  let _v2767 = he[_v2765.base];
  return {
    uid: va(),
    kind: "item",
    base: _v2765.base,
    slot: _v2767.slot,
    ilvl: Math.max(_v2766 || 1, _v2765.lv || 1),
    rarity: 3,
    uniq: _v2765.id,
    impl: Hv(_v2767),
    mods: _v2765.mods.map(([_v2768, _v2769]) => ({
      id: _v2768,
      t: "U",
      ur: _v2769,
      v: no(_v2769)
    })),
    name: _v2765.n,
    rsock: mi(_v2767.slot) ? 1 : 0,
    runes: []
  };
};
aA = function (_v2770, _v2771) {
  if (!_v2771) return "无效目标";
  if (_v2770 === "ember" || _v2770 === "ash") return "在藏身处的余烬祭坛使用";
  if (F[_v2770].grp === "bone") return DsDesecrate(_v2770, _v2771);
  let _v2772 = F[_v2770].grp;
  if (_v2772 === "sig") return "首领印记用于在地图装置开启裂隙之心";
  if (_v2771.kind === "meta" || _v2771.kind === "buff") return "无法对该宝石使用通货";
  if (_v2770.startsWith("jewel")) {
    if (_v2771.kind !== "gem") return "珠宝匠石只能用于主动技能宝石";
    let _v2773 = ({
      jewel1: 2,
      jewel2: 3,
      jewel3: 4
    })[_v2770];
    return _v2771.sock >= 5 ? "插槽已达上限 5" : _v2771.sock !== _v2773 ? F[_v2770].n + "只能把插槽从 " + _v2773 + " 提升到 " + (_v2773 + 1) + " (当前 " + _v2771.sock + ")" : (_v2771.sock++, null);
  }
  if (_v2771.kind === "gem" || _v2771.kind === "sup" || _v2771.kind === "buff") return "这种通货不能用于宝石";
  if (_v2771.corrupted && _v2772 !== "rune") return "已腐化的物品无法改造";
  if (_v2771.ds) return "有未揭示的渎灵词缀 · 先到灵魂之井揭示";
  if (_v2771.sanctified) return "已圣化的物品无法改造";
  let _v2774 = _v2771.rarity === 3;
  if (_v2770 === "artif") {
    if (_v2771.kind !== "item") return "只能用于装备";
    let _v2775 = mi(_v2771.slot) + (_v2771.extraSock || 0);
    return _v2775 ? _v2771.rsock >= _v2775 ? "符文插槽已满 (" + _v2775 + ")" : (_v2771.rsock++, null) : "该部位没有符文插槽";
  }
  if (_v2772 === "rune") return _v2771.kind !== "item" ? "只能用于装备" : _v2771.rsock ? (_v2771.runes = _v2771.runes || [], _v2771.runes.length >= _v2771.rsock && _v2771.runes.shift(), _v2771.runes.push(_v2770), null) : "没有符文插槽 · 先用工匠石开孔";
  if (_v2772 === "ess") {
    if (_v2771.kind !== "item") return "只能用于装备";
    if (_v2774) return "传奇装备无法使用精华";
    let _v2776 = _v2771.mods.filter(_v2777 => Gn(_v2771, _v2777) || AffixClass(_v2777) !== "regular"), _v2778 = _v2771.meta, _v2779 = _v2780 => _v2780 !== _v2778 && AffixSideCap(_v2771, _v2780) - AffixRegCount(_v2771, _v2780) > 0, _v2781 = {
      r: _v2771.rarity,
      mods: _v2771.mods,
      meta: _v2771.meta
    };
    (_v2771.rarity = 2, _v2771.mods = _v2776.slice(), delete _v2771.meta);
    let _v2782 = null;
    for (let _v2783 of ["P", "S"]) if (_v2779(_v2783) && (_v2782 = Nv(_v2771, _v2783, od[_v2770]), _v2782)) break;
    if (!_v2782) {
      (_v2771.rarity = _v2781.r, _v2771.mods = _v2781.mods, _v2781.meta && (_v2771.meta = _v2781.meta));
      let _v2784 = ["P", "S"].some(_v2785 => kS(_v2771, _v2785, od[_v2770], []).length);
      return _v2776.length && _v2784 ? "精华词缀那一侧被锁定或已满" : "该部位无法获得此精华的词缀";
    }
    for (_v2771.mods.push(_v2782); AffixTotalCount(_v2771) < 4 && St(_v2771); ) ;
    return (ga(_v2771), null);
  }
  if (_v2770 === "vaal") {
    if (_v2771.kind !== "item") return "只能用于装备";
    let _v2786 = !Sa.dry && h, _v2787 = !!_v2786 && (h.pity || 0) >= Er, _v2788 = ap(_v2771, () => tA(_v2771, _v2787));
    return (_v2786 && (h.pity = _v2788 === "impl" || _v2788 === "sock" ? 0 : (h.pity || 0) + 1, Sa.last = {
      k: "vaal",
      out: _v2788,
      pity: _v2787
    }), null);
  }
  if (OmHas("omen_special") && ["exalt", "chaos", "annul", "divine", "vaal"].indexOf(_v2770) < 0) return "异界高级预兆：下一个通货只能作用于特殊词缀栏（可用崇高/混沌/剥离/神圣）";
  switch (_v2770) {
    case "trans":
      if (_v2771.rarity !== 0) return "需要普通物品";
      (_v2771.rarity = 1, St(_v2771));
      break;
    case "aug":
      if (_v2771.rarity !== 1) return "需要魔法物品";
      if (_v2771.mods.length >= 2) return "词缀已满";
      if (!St(_v2771)) return "没有可用词缀";
      break;
    case "alt":
      {
        if (_v2771.rarity !== 1) return "需要魔法物品";
        let _v2789 = _v2771.mods.filter(_v2790 => Gn(_v2771, _v2790) || AffixClass(_v2790) !== "regular");
        if (_v2789.length >= 2) return "没有可以改变的词缀(破溃或已锁定)";
        (_v2771.mods = _v2789, St(_v2771), !_v2789.length && _s(0.5) && St(_v2771));
        break;
      }
    case "alch":
      if (_v2771.rarity !== 0) return "需要普通物品";
      _v2771.rarity = 2;
      for (let _v2791 = 0; _v2791 < 4; _v2791++) St(_v2771);
      if (_v2771.kind === "map" && ue("affix_zeal")) St(_v2771);
      break;
    case "regal":
      if (_v2771.rarity !== 1) return "需要魔法物品";
      _v2771.rarity = 2;
      if (!St(_v2771)) {
        _v2771.rarity = 1;
        return "没有可用词缀";
      }
      ga(_v2771);
      return null;
    case "chaos":
      {
        if (_v2771.rarity !== 2) return "需要稀有物品";
        if (_v2771.kind === "map") {
          let _v2792 = OmHas("omen_chaos_quant") ? "quant" : OmHas("omen_chaos_mon") ? "mon" : OmHas("omen_chaos_rar") ? "player" : null;
          if (_v2792) return (DsMapChaos(_v2771, _v2792), OmTake(_v2792 === "quant" ? "omen_chaos_quant" : _v2792 === "mon" ? "omen_chaos_mon" : "omen_chaos_rar"), null);
        }
        if (OmHas("omen_special")) {
          let _v2793 = _v2771.mods.filter(_v2794 => AffixClass(_v2794) === "special" && !Gn(_v2771, _v2794));
          if (!_v2793.length) return "特殊词缀栏没有可改变的词缀";
          let _v2795 = _v2771.mods.slice(), _v2796 = se(_v2793);
          _v2771.mods.splice(_v2771.mods.indexOf(_v2796), 1);
          let _v2797 = AffixAddSpecial(_v2771);
          if (_v2797) {
            _v2771.mods = _v2795;
            return _v2797;
          }
          OmTake("omen_special");
          return null;
        }
        let _v2798 = OmHas("omen_whittle") ? "omen_whittle" : OmHas("omen_chaos_p") ? "omen_chaos_p" : OmHas("omen_chaos_s") ? "omen_chaos_s" : null, _v2799 = _v2798 === "omen_chaos_p" ? "P" : _v2798 === "omen_chaos_s" ? "S" : null, _v2800 = _v2771.mods.filter(_v2801 => !Gn(_v2771, _v2801) && AffixClass(_v2801) === "regular" && (!_v2799 || _v2801.t === _v2799));
        if (!_v2800.length) {
          return _v2799 ? _v2799 === "P" ? "没有可移除的前缀" : "没有可移除的后缀" : St(_v2771) ? null : "没有可以改变的词缀(破溃或已锁定)";
        }
        let _v2802 = _v2798 === "omen_whittle" ? OmWhittle(_v2771, _v2800) : se(_v2800);
        if (!_v2802) return "没有可消减的低等级词缀";
        _v2771.mods.splice(_v2771.mods.indexOf(_v2802), 1);
        if (!St(_v2771)) {
          _v2771.mods.push(_v2802);
          return "没有可用词缀";
        }
        _v2798 && OmTake(_v2798);
        return null;
      }
    case "annul":
      {
        if (_v2771.rarity !== 1 && _v2771.rarity !== 2) return "需要魔法或稀有物品";
        if (!_v2771.mods.length) return "没有词缀";
        if (OmHas("omen_special")) {
          let _v2803 = _v2771.mods.filter(_v2804 => AffixClass(_v2804) === "special" && !Gn(_v2771, _v2804));
          if (!_v2803.length) return "特殊词缀栏没有可移除的词缀";
          _v2771.mods.splice(_v2771.mods.indexOf(se(_v2803)), 1);
          OmTake("omen_special");
          _v2771.rarity === 1 && ga(_v2771);
          return null;
        }
        if (OmHas("omen_abyss_light")) {
          let _v2805 = _v2771.mods.filter(_v2806 => _v2806.dsec && !Gn(_v2771, _v2806));
          return _v2805.length ? (_v2771.mods.splice(_v2771.mods.indexOf(se(_v2805)), 1), OmTake("omen_abyss_light"), _v2771.rarity === 1 && ga(_v2771), null) : "没有渎灵词缀";
        }
        let _v2807 = OmHas("omen_annul_p") ? "P" : OmHas("omen_annul_s") ? "S" : null, _v2808 = _v2771.mods.filter(_v2809 => !Gn(_v2771, _v2809) && AffixClass(_v2809) === "regular" && (!_v2807 || _v2809.t === _v2807));
        return _v2808.length ? (_v2771.mods.splice(_v2771.mods.indexOf(se(_v2808)), 1), _v2771.rarity === 1 && ga(_v2771), _v2807 && OmTake(_v2807 === "P" ? "omen_annul_p" : "omen_annul_s"), null) : _v2807 ? _v2807 === "P" ? "没有可移除的前缀" : "没有可移除的后缀" : "没有可以移除的词缀(破溃或已锁定)";
      }
    case "exalt":
      {
        if (_v2771.rarity !== 2) return "需要稀有物品";
        if (OmHas("omen_special")) {
          let _v2810 = AffixAddSpecial(_v2771);
          if (_v2810) return _v2810;
          OmTake("omen_special");
          return null;
        }
        if (AffixTotalRoom(_v2771) <= 0) return "词缀已满 (" + AffixSlotCfg().total + "/" + AffixSlotCfg().total + ")";
        let _v2811 = OmHas("omen_exalt_p") ? "P" : OmHas("omen_exalt_s") ? "S" : null, _v2812 = OmHas("omen_exalt_2");
        let _v2813 = _v2814 => _v2771.meta === _v2814 ? 0 : AffixRegRoom(_v2771, _v2814), _v2815 = _v2812 ? 2 : 1;
        if (_v2811 ? _v2813(_v2811) < _v2815 : _v2813("P") + _v2813("S") < _v2815) return _v2811 ? (_v2811 === "P" ? "前缀" : "后缀") + "空间不足 (常规 3/3)" : "常规词缀已满 (3/3)";
        let _v2816 = _v2771.mods.slice(), _v2817 = 0;
        for (let _v2818 = 0; _v2818 < _v2815; _v2818++) {
          if (!StSide(_v2771, _v2811)) break;
          _v2817++;
        }
        if (_v2817 < _v2815) {
          _v2771.mods = _v2816;
          return "没有可用词缀";
        }
        return (_v2811 && OmTake(_v2811 === "P" ? "omen_exalt_p" : "omen_exalt_s"), _v2812 && OmTake("omen_exalt_2"), null);
      }
    case "divine":
      {
        if (_v2771.rarity === 0) return "没有可重随的词缀";
        if (OmHas("omen_special")) {
          let _v2819 = _v2771.mods.filter(_v2820 => AffixClass(_v2820) === "special" && !Gn(_v2771, _v2820));
          if (!_v2819.length) return "特殊词缀栏没有可重随的词缀";
          for (let _v2821 of _v2819) {
            if (_v2821.ur) _v2821.v = no(_v2821.ur); else {
              let _v2822 = jt(_v2771, _v2821.id);
              _v2821.v = no(_v2822.ranges[_v2821.ti]);
            }
          }
          OmTake("omen_special");
          return null;
        }
        if (OmHas("omen_sanctify")) {
          if (_v2771.rarity !== 2 && _v2771.rarity !== 3) return "圣化预兆需要稀有或传奇物品";
          if (_v2771.corrupted) return "已腐化的物品无法圣化";
          if (_v2771.sanctified) return "已经圣化";
          (OmTake("omen_sanctify"), _v2771.mods.forEach(_v2823 => {
            _v2823.v = _v2823.v.map(_v2824 => Math.max(1, Math.round(_v2824 * O(0.78, 1.22))));
          }), _v2771.sanctified = !0);
          return null;
        }
        if (OmHas("omen_blessed")) {
          if (!_v2771.impl || !_v2771.impl.length) return "没有固有词缀";
          (OmTake("omen_blessed"), _v2771.impl.forEach(_v2825 => {
            let _v2826 = _v2825.v.map(_v2827 => Math.max(0, Math.round(_v2827 * O(0.85, 1.15))));
            _v2825.v = _v2826.length === 2 ? [Math.min(..._v2826), Math.max(..._v2826)] : _v2826;
          }));
          return null;
        }
        let _v2828 = _v2771.mods.filter(_v2829 => !Gn(_v2771, _v2829));
        if (!_v2828.length) return "没有可以重随的词缀(破溃或已锁定)";
        for (let _v2830 of _v2828) if (_v2830.ur) _v2830.v = no(_v2830.ur); else {
          let _v2831 = jt(_v2771, _v2830.id);
          _v2830.v = no(_v2831.ranges[_v2830.ti]);
        }
        return null;
      }
    case "frac":
      return _v2771.kind !== "item" && _v2771.kind !== "soul" ? "只能用于装备或兽魂" : _v2771.rarity !== 2 ? "需要稀有装备" : AffixRegCount(_v2771, "P") + AffixRegCount(_v2771, "S") < 4 ? "需要至少 4 条常规词缀" : _v2771.mods.some(_v2832 => _v2832.fr) ? "每件装备只能有 1 条破溃词缀" : (se(_v2771.mods.filter(_v2833 => AffixClass(_v2833) === "regular" && AffixIsSide(_v2833))).fr = !0, null);
    case "scour":
      {
        if (_v2771.rarity === 0 || _v2774) return "需要魔法或稀有物品";
        (_v2771.mods = _v2771.mods.filter(_v2834 => Gn(_v2771, _v2834) || AffixClass(_v2834) !== "regular"), delete _v2771.meta, _v2771.rarity = xS(_v2771.mods.filter(_v2835 => AffixClass(_v2835) === "regular")));
        break;
      }
    case "chance":
      {
        if (_v2771.rarity !== 0) return "需要普通物品";
        let _v2836 = OmHas("omen_ancient");
        if (_v2836 && _v2771.kind !== "item") return "远古预兆只能作用于装备";
        if (_v2771.kind === "item") {
          let _v2837 = lt.filter(_v2838 => he[_v2838.base].slot === _v2771.slot && (_v2771.slot !== "W" || he[_v2838.base].wt === he[_v2771.base].wt));
          if (_v2837.length && (_v2836 || j() < 0.04)) {
            let _v2839 = _t(se(_v2837), _v2771.ilvl);
            return (Object.assign(_v2771, _v2839, {
              uid: _v2771.uid
            }), _v2836 && OmTake("omen_ancient"), null);
          }
          if (_v2836) return "该部位没有可用的传奇";
        }
        if (OmHas("omen_chance2")) {
          if (_v2771.kind !== "item") return "机遇预兆只能作用于装备";
          (_v2771.rarity = 2, OmTake("omen_chance2"));
          for (let _v2840 = 0; _v2840 < 4; _v2840++) St(_v2771);
          break;
        }
        if (j() < 0.7) (_v2771.rarity = 1, St(_v2771), _s(0.5) && St(_v2771)); else {
          _v2771.rarity = 2;
          for (let _v2841 = 0; _v2841 < 4; _v2841++) St(_v2771);
        }
        break;
      }
    default:
      return "未知通货";
  }
  return (ga(_v2771), null);
};
Hi = function (_v2842, _v2843) {
  _v2842 = _v2842 || "witch";
  let _v2844 = te[_v2842], _v2845 = Lt[_v2842];
  (h = {
    v: Wu,
    cls: _v2842,
    fsalt: String(Date.now()),
    debug: !!_v2843,
    level: 1,
    xp: 0,
    equip: {
      weapon: null,
      offhand: null,
      helm: null,
      body: null,
      gloves: null,
      boots: null,
      belt: null,
      ring1: null,
      ring2: null,
      amulet: null
    },
    inv: [],
    gems: [],
    skills: [null, null, null, null, null, null, null],
    buffs: [null, null, null, null],
    codex: {},
    ach: [],
    done: {},
    bossKills: {},
    bossBest: {},
    bestTier: 0,
    pinLv: 1,
    pinKills: 0,
    pinBest: 0,
    favor: null,
    cur: {},
    om: {},
    omenSeen: 0,
    tree: [An(_v2842)],
    bonusPts: 0,
    hist: [],
    device: null,
    filter: {
      normal: !1,
      magic: !1
    },
    flask: [{
      ch: 3,
      max: 3
    }, {
      ch: 3,
      max: 3
    }],
    lastRun: null,
    stats: {
      divines: 0,
      maps: 0,
      metaCasts: 0,
      boxes: 0
    },
    asc: null,
    ascNodes: [],
    ascPts: 0,
    trials: [],
    atlas: [],
    atlasPts: 0,
    atlasEver: 0,
    atlasRespec: 0,
    advTree: [],
    starTree: [],
    advBonus: 0,
    advJewels: {},
    advClassStart: _v2842,
    god: !1
  }, h.advTree = ["adv_root", _v2842 + "_start"], rt.forEach(_v2846 => h.cur[_v2846] = 0), Object.assign(h.cur, {
    trans: 6,
    aug: 4,
    alt: 4,
    alch: 3,
    chaos: 2,
    chance: 2,
    scour: 1,
    jewel1: 2,
    artif: 1,
    rune_iron: 1,
    omen_exalt_p: 2,
    omen_whittle: 1
  }));
  let _v2847 = Ca.find(_v2848 => _v2848.wt === _v2844.wt && _v2848.lv === 1), _v2849 = la(_v2847, 5, 0);
  (_v2849.rarity = 1, _v2849.mods = _v2844.wt === "staff" ? [Pi("spellInc", 1), Pi("castSpd", 0)] : [Pi("physInc", 1), Pi("atkSpd", 0)], ga(_v2849), h.equip.weapon = _v2849, h.equip.body = la(he[_v2842 === "witch" || _v2842 === "monk" || _v2842 === "sorceress" ? "学徒长袍" : "粗布外衣"], 1, 0), h.equip.boots = la(he.旅者之靴, 1, 0), h.equip.ring1 = la(he.红玉戒指, 3, 0), h.equip.belt = la(he.皮腰带, 1, 0));
  let _v2850 = ({
    ranger: "锐利箭袋",
    huntress: "木圆盾",
    samurai: "胁差",
    warrior: "木圆盾"
  })[_v2842];
  (_v2850 && (h.equip.offhand = la(he[_v2850], 1, 0)), h.inv.push(ia(1), ia(1), ia(1), ia(2), la(he.皮革兜帽, 3, 0), la(he.皮手套, 3, 0)), _v2842 === "witch" && h.inv.push(la(he.骨制短杖, 3, 1), la(he.骨制法器, 3, 0)), _v2844.skills.forEach(([_v2851, _v2852, _v2853], _v2854) => h.skills[_v2854] = $s(_v2851, _v2852, _v2853)), _v2844.gems.forEach(([_v2855, _v2856, _v2857]) => h.gems.push($s(_v2855, _v2856, _v2857))), _v2844.sups.forEach(_v2858 => h.gems.push(ls(_v2858))));
  let _v2859 = new Set([..._v2844.skills, ..._v2844.gems].map(_v2860 => _v2860[0]));
  (_v2845.pool.forEach(_v2861 => {
    _v2859.has(_v2861) || h.gems.push($s(_v2861, 1, 2));
  }), ["huntress", "monk", "samurai", "warrior", "jianke"].includes(_v2842) && h.gems.push($s("cyclone", 1, 2)), h.buffs[0] = _r(_v2845.buff), h.gems.push(fn(({
    witch: "meta_cof",
    ranger: "meta_coc",
    huntress: "meta_coc",
    monk: "meta_coms",
    samurai: "meta_coms",
    mercenary: "meta_coc",
    sorceress: "meta_coc",
    warrior: "meta_coms",
    jianke: "meta_coc"
  })[_v2842])), h.gems.push(ls("hourglass"), ls(({
    witch: "icebite",
    ranger: "ricochet",
    huntress: "frenzyGain",
    monk: "powerSiphon",
    samurai: "rage",
    mercenary: "autoload",
    sorceress: "arcanetempo",
    warrior: "armourexplode",
    jianke: "jkEcho"
  })[_v2842])), _v2843 && Ii(), H("char:bind", {
    fresh: !0,
    id: null
  }));
};
Hp = function (_v2862) {
  if (typeof _v2862.v != "number") return null;
  for (; _v2862.v < Wu && yS[_v2862.v]; ) yS[_v2862.v](_v2862);
  if (_v2862.v !== Wu) return null;
  for (; _v2862.skills.length < 7; ) _v2862.skills.push(null);
  _v2862.om && typeof _v2862.om == "object" || (_v2862.om = {});
  typeof _v2862.omenSeen == "number" || (_v2862.omenSeen = 0);
  _v2862.delirium = Math.max(0, Math.min(250, +_v2862.delirium || 0));
  _v2862.simUnlocked = !!_v2862.simUnlocked;
  _v2862.ritualDone = Math.max(0, +_v2862.ritualDone || 0);
  _v2862.abyssDone = Math.max(0, +_v2862.abyssDone || 0);
  _v2862.deliriumMaps = Math.max(0, +_v2862.deliriumMaps || 0);
  _v2862.simRuns = Math.max(0, +_v2862.simRuns || 0);
  if (Array.isArray(_v2862.gems) && Array.isArray(_v2862.inv)) {
    let _v2863 = _v2862.gems.filter(_v2864 => _v2864 && (_v2864.kind === "soul" || _v2864.kind === "item" || _v2864.kind === "map"));
    _v2863.length && (_v2862.gems = _v2862.gems.filter(_v2865 => !_v2863.includes(_v2865)), _v2862.inv.push(..._v2863));
  }
  try {
    AtlasMigrateSave(_v2862);
    AffixMigrateSave(_v2862);
    AdvMigrateSave(_v2862);
  } catch (_v2866) {
    console.warn("[atlas] save migration failed", _v2866);
  }
  return _v2862;
};
cA = function () {
  (R("kill:loot", _v2867 => {
    let _v2868 = _v2867.m;
    (_v2868.rift && (ue("rift3") && (_v2867.dm *= 1.4), ue("rift7") && (_v2867.dm *= 1.6)), _v2868.rar === 3 ? (ue("boss1") && (_v2867.dm *= 1.5), _v2868.awake && (_v2867.dm *= 2), ue("boss7") && (_v2867.dm *= 3), ue("boss4") && (_v2867.rb += 100)) : ue("boss7") && (_v2867.dm *= 0.6), _v2868.envHit && ue("enc3") && (_v2867.dm *= 2), _v2868.encM && ue("enc7") && (_v2867.dm *= 1.5));
  }), R("kill", ({m: _v2869}) => {
    if (!(_v2869.rar !== 3 || _v2869.guard)) {
      if ((ue("boss3") && j() < 0.08 && ve(_v2869.x, _v2869.y, {
        kind: "cur",
        cur: "divine"
      }), ue("boss6") && j() < 0.15)) {
        let _v2870 = lt.filter(_v2871 => !_v2871.noDrop && _v2871.lv <= o.Z.lvl + 5);
        _v2870.length && ve(_v2869.x, _v2869.y, {
          kind: "it",
          it: _t(se(_v2870), o.Z.lvl)
        });
      }
      if (ue("boss7") && j() < 0.03) for (let _v2872 = 0; _v2872 < 3; _v2872++) ve(_v2869.x, _v2869.y, {
        kind: "cur",
        cur: "divine"
      });
    }
  }), R("boss:map", _v2873 => {
    ue("boss2") && (_v2873.up = 0.68);
  }), R("boss:kill", ({m: _v2874}) => Py(_v2874)));
};
Object.assign(yk, {
  预兆: "Omens",
  全部预兆: "All Omens",
  "全部预兆 ×5": "All Omens ×5",
  "已发放全部预兆 ×5": "Granted all omens ×5",
  "选中后点击物品使用 · 按住 Shift 连续使用 · 通货全角色共用 · 预兆点击激活": "Select then click an item to use · hold Shift to repeat · currency is shared by all characters · click an omen to activate it",
  工艺预兆: "Crafting Omen",
  战斗预兆: "Combat Omen",
  已激活: "Active",
  "已激活 · 下次满足条件时生效": "Active · triggers on the next matching action",
  "未激活 · 点击通货栏或工艺台里的预兆激活": "Inactive · click the omen in the currency bar or bench to activate",
  预兆已激活: "Omen activated",
  预兆触发: "Omen triggered",
  "此物品在你的背包中激活时, ": "While this item is active in your inventory, ",
  "右键点击此物品以将其激活。此物品触发效果时会被消耗。": "Right click this item in your inventory to set it to be active. This item is consumed when triggered.",
  "每个副本只能在战斗中触发一个预兆。": "Only one Omen can be triggered from combat in each instance.",
  "同类预兆只能激活 1 个 · 工艺预兆可以与其他类别并存": "Only one Omen of the same kind can be active · crafting omens stack with other kinds",
  "宝箱、稀有怪与 T6 以上的首领会掉落": "Drops from chests, rare monsters and bosses above T6",
  "还没有预兆 · 宝箱、稀有怪与 T6 以上的首领会掉落": "No omens yet · drops from chests, rare monsters and bosses above T6",
  "点击激活 · 同类只能激活 1 个 · 下次对应操作时自动消耗": "Click to activate · one per kind · consumed by the next matching action",
  "预兆 · 持有 ": "Omen · holding ",
  来源: "Source",
  "宝箱、稀有怪与首领": "Chests, rare monsters and bosses",
  冒险预兆: "Adventure Omen",
  "点击此物品以将其激活。此物品触发效果时会被消耗。": "Click this item to set it to be active. This item is consumed when triggered.",
  左旋崇高预兆: "Omen of Sinistral Exaltation",
  右旋崇高预兆: "Omen of Dextral Exaltation",
  强效崇高预兆: "Omen of Greater Exaltation",
  消减预兆: "Omen of Whittling",
  左旋剥离预兆: "Omen of Sinistral Annulment",
  右旋剥离预兆: "Omen of Dextral Annulment",
  左旋消抹预兆: "Omen of Sinistral Erasure",
  右旋消抹预兆: "Omen of Dextral Erasure",
  远古预兆: "Omen of the Ancients",
  复苏预兆: "Omen of Resurgence",
  进步预兆: "Omen of Amelioration",
  有求必应预兆: "Omen of Answered Prayers",
  左旋崇高: "Sinistral Exalt",
  右旋崇高: "Dextral Exalt",
  强效崇高: "Greater Exalt",
  消减: "Whittling",
  左旋剥离: "Sinistral Annul",
  右旋剥离: "Dextral Annul",
  左旋消抹: "Sinistral Erase",
  右旋消抹: "Dextral Erase",
  远古: "Ancients",
  复苏: "Resurgence",
  进步: "Amelioration",
  有求必应: "Answered Prayers",
  "你的下一个崇高石只会添加前缀": "your next Exalted Orb will only add prefix modifiers",
  "你的下一个崇高石只会添加后缀": "your next Exalted Orb will only add suffix modifiers",
  "你的下一个崇高石会添加两个随机词缀": "your next Exalted Orb will add two random modifiers",
  "你的下一个混沌石会移除最低等级的词缀": "your next Chaos Orb will remove the lowest level modifier",
  "你的下一个剥离石只会移除前缀": "your next Orb of Annulment will only remove prefix modifiers",
  "你的下一个剥离石只会移除后缀": "your next Orb of Annulment will only remove suffix modifiers",
  "你的下一个混沌石只会移除前缀": "your next Chaos Orb will only remove prefix modifiers",
  "你的下一个混沌石只会移除后缀": "your next Chaos Orb will only remove suffix modifiers",
  "你的下一个机会石会把普通物品升级为相同类别的随机传奇": "your next Orb of Chance will upgrade the item into a random Unique of the same Item Class",
  "你达到低血状态时会完全回复生命、魔力和能量护盾": "fully recover your Life, Mana and Energy Shield when you reach Low Life",
  "你被击败时防止 75% 的经验值损失": "prevent 75% of Experience loss when you are defeated",
  "你点击的下一个神龛会提供一个额外效果": "the next Shrine you click will grant an additional effect"
});
var DS_SLOTS = "WQSKXHBGFLRAO";
Le("ds_es", "P", DS_SLOTS, "+{0} 能量护盾", "es", [[60, 85], [90, 120]], {
  nm: "渎灵·溺光",
  dsec: !0,
  fac: "amanamu",
  w: 1,
  lv: [1, 50]
});
Le("ds_cast", "S", DS_SLOTS, "施法速度提高 {0}%", "castSpd", [[12, 16], [18, 24]], {
  nm: "渎灵·低语",
  dsec: !0,
  fac: "amanamu",
  w: 1,
  lv: [1, 50]
});
Le("ds_skill", "P", DS_SLOTS, "+{0} 所有技能宝石等级", "skillLvl", [[1, 1], [2, 2]], {
  nm: "渎灵·虚空",
  dsec: !0,
  fac: "amanamu",
  w: 1,
  lv: [1, 50]
});
Le("ds_life", "P", DS_SLOTS, "+{0} 最大生命", "life", [[70, 90], [100, 130]], {
  nm: "渎灵·血肉",
  dsec: !0,
  fac: "kurgal",
  w: 1,
  lv: [1, 50]
});
Le("ds_atk", "S", DS_SLOTS, "攻击速度提高 {0}%", "atkSpd", [[12, 15], [16, 22]], {
  nm: "渎灵·喘息",
  dsec: !0,
  fac: "kurgal",
  w: 1,
  lv: [1, 50]
});
Le("ds_leech", "S", DS_SLOTS, "击中偷取 {0}% 伤害为生命", "leech", [[20, 30], [35, 50]], {
  nm: "渎灵·黑血",
  dsec: !0,
  fac: "kurgal",
  w: 1,
  lv: [1, 50],
  div: 10
});
Le("ds_crit", "S", DS_SLOTS, "暴击率提高 {0}%", "critInc", [[40, 55], [60, 80]], {
  nm: "渎灵·军团",
  dsec: !0,
  fac: "ulaman",
  w: 1,
  lv: [1, 50]
});
Le("ds_move", "S", DS_SLOTS, "移动速度提高 {0}%", "moveInc", [[15, 19], [20, 26]], {
  nm: "渎灵·跋涉",
  dsec: !0,
  fac: "ulaman",
  w: 1,
  lv: [1, 50]
});
Le("ds_rarity", "S", DS_SLOTS, "物品稀有度提高 {0}%", "rarity", [[35, 45], [50, 65]], {
  nm: "渎灵·特克罗",
  dsec: !0,
  fac: "tecrod",
  w: 1,
  lv: [1, 50]
});
Le("ds_res", "S", DS_SLOTS, "+{0}% 所有元素抗性", "resAll", [[12, 16], [17, 22]], {
  nm: "渎灵·回响",
  dsec: !0,
  w: 1,
  lv: [1, 50]
});
(function () {
  var _v2875 = V3;
  V3 = function () {
    try {
      _v2875();
    } catch (_v2876) {
      try {
        console.error("[VFX]", _v2876);
      } catch (_v2877) {}
    }
  };
  window.addEventListener("error", function (_v2878) {
    try {
      var _v2879 = document.getElementById("b-errbox");
      if (!_v2879) {
        _v2879 = document.createElement("div");
        _v2879.id = "b-errbox";
        _v2879.style.cssText = "position:fixed;left:8px;bottom:8px;z-index:99999;max-width:70vw;" + "max-height:40vh;overflow:auto;background:rgba(20,0,0,.92);color:#ffb0b0;" + "border:1px solid #a33;padding:8px 10px;font:12px/1.5 monospace;" + "white-space:pre-wrap;pointer-events:auto;border-radius:3px";
        document.body.appendChild(_v2879);
      }
      _v2879.textContent += "错误: " + (_v2878.message || _v2878) + "\n" + (_v2878.filename || "") + ":" + (_v2878.lineno || "") + "\n(截图这条发给开发者)";
    } catch (_v2880) {}
  });
})();
(function () {
  function _v2881() {
    try {
      var _v2882 = document.getElementById("overlay");
      if (_v2882 && !_v2882.hidden && !_v2882.querySelector(".ovbox")) _v2882.hidden = true;
    } catch (_v2883) {}
  }
  _v2881();
  setTimeout(_v2881, 400);
  setTimeout(_v2881, 1500);
  window.addEventListener("keydown", _v2881, true);
  window.addEventListener("pointerdown", _v2881, true);
})();
(function () {
  var _v2884 = _e;
  _e = function (_v2885, _v2886, _v2887, _v2888, _v2889) {
    var _v2890 = _v2884.apply(this, arguments);
    try {
      if (_v2890 && !_v2890.minion && !_v2890.ally) {
        var _v2891 = DelHpBonus();
        if (_v2891 > 0) {
          _v2890.maxhp *= 1 + _v2891;
          _v2890.hp = _v2890.maxhp;
        }
        if (o.delRun) {
          _v2890.del = !0;
          _v2890.delMul = 1.2 + (o.del ? o.del.depth : 0) / 100 * 1.2;
          if (_v2889 === 3 && !_v2890.delBoss) {
            _v2890.delBoss = !0;
            if (o.delRun.layer >= o.delRun.max) {
              _v2890.maxhp *= 5;
              _v2890.hp = _v2890.maxhp;
              _v2890.name = "最终·" + _v2890.name;
            }
          }
        }
      }
    } catch (_v2892) {}
    return _v2890;
  };
  var _v2893 = Yl;
  Yl = function () {
    try {
      if (o && o.Z && o.Z.type === "map" && o.delRun) {
        var _v2894 = null, _v2895 = 4900;
        for (var _v2896 = 0; _v2896 < o.objs.length; _v2896++) {
          var _v2897 = o.objs[_v2896];
          if (_v2897.kind !== "b-delportal") continue;
          var _v2898 = (_v2897.x - o.pl.x) ** 2 + (_v2897.y - o.pl.y) ** 2;
          if (_v2898 < _v2895) {
            _v2895 = _v2898;
            _v2894 = _v2897;
          }
        }
        if (_v2894) return (DelEnterLayer(_v2894.layer), !0);
      }
    } catch (_v2899) {}
    return _v2893.apply(this, arguments);
  };
  var _v2900 = er;
  er = function (_v2901, _v2902, _v2903) {
    var _v2904 = _v2900.apply(this, arguments);
    try {
      if (o.delRun && _v2901 && _v2901.delBoss) DelBossKilled(_v2901);
    } catch (_v2905) {}
    return _v2904;
  };
  var _v2906 = Vi;
  Vi = function () {
    var _v2907 = _v2906.apply(this, arguments);
    try {
      if (!DelLayerMap && o.delRun && (!o.Z || o.Z.type !== "map" || !o.Z.delLayer)) {
        o.delRun = null;
        o.del = null;
      }
      if (o.del && (!o.Z || o.Z.type !== "map")) DeliriumEnd();
    } catch (_v2908) {}
    return _v2907;
  };
  var _v2909 = V3;
  V3 = function () {
    _v2909();
    try {
      if (o.delRun) for (var _v2910 = 0; _v2910 < o.objs.length; _v2910++) {
        var _v2911 = o.objs[_v2910];
        if (_v2911.kind === "b-delportal") _v2912(_v2911);
      }
    } catch (_v2913) {}
  };
  var _v2914 = z4;
  z4 = function () {
    var _v2915 = _v2914.apply(this, arguments) || [];
    try {
      if (o.delRun) _v2915.push(["惊悸迷雾 · 第 " + o.delRun.layer + "/" + DEL_LAYERS + " 层", !0]);
    } catch (_v2916) {}
    return _v2915;
  };
  function _v2912(_v2917) {
    var _v2918 = Math.round(_v2917.x), _v2919 = Math.round(_v2917.y), _v2920 = o.T;
    f.save();
    f.globalCompositeOperation = "lighter";
    var _v2921 = f.createRadialGradient(_v2918, _v2919, 0, _v2918, _v2919, 22);
    (_v2921.addColorStop(0, "rgba(220,200,255,.65)"), _v2921.addColorStop(0.6, "rgba(150,110,255,.25)"), _v2921.addColorStop(1, "rgba(90,50,180,0)"), f.fillStyle = _v2921, f.beginPath(), f.arc(_v2918, _v2919, 22, 0, 6.283), f.fill());
    f.strokeStyle = "#cdb4ff";
    f.lineWidth = 1.2;
    f.beginPath();
    f.arc(_v2918, _v2919 - 6, 12 + Math.sin(_v2920 * 3) * 1.5, 0, 6.283);
    f.stroke();
    (f.fillStyle = "#e8ddff", f.font = "7px monospace", f.textAlign = "center", f.fillText("F 下一层", _v2918, _v2919 - 22));
    f.restore();
  }
})();
(function () {
  var _v2922 = er;
  er = function (_v2923, _v2924, _v2925) {
    var _v2926 = _v2922.apply(this, arguments);
    try {
      if (_v2923 && o.Z && o.Z.type === "map" && _v2923.rar === 3) {
        var _v2927 = Math.max(1, o.Z && o.Z.lvl || 80);
        var _v2928 = function (_v2929, _v2930) {
          if (Ra[_v2929] && j() < _v2930) ve(_v2923.x, _v2923.y, {
            kind: "it",
            it: _t(Ra[_v2929], _v2927)
          });
        };
        _v2928("headhunter", BAL.drop.headhunter);
        _v2928("kaoms_heart", BAL.drop.kaoms_heart);
        _v2928("temporalis", BAL.drop.temporalis);
        _v2928("rathpith_globe", BAL.drop.rathpith_globe);
      }
    } catch (_v2931) {}
    return _v2926;
  };
})();
(function () {
  var _v2932 = m0;
  m0 = function (_v2933) {
    var _v2934 = _v2932.apply(this, arguments);
    try {
      if (_v2933 && _v2933.abyssBox) GrantAtlasPoint("深渊");
    } catch (_v2935) {}
    return _v2934;
  };
})();
(function () {
  var _v2936 = null, _v2937 = "", _v2938 = 0;
  function _v2939() {
    if (_v2936) return _v2936;
    _v2936 = document.createElement("div");
    _v2936.id = "b-progress";
    _v2936.style.cssText = "position:fixed;left:10px;top:58px;z-index:45;" + "width:168px;background:rgba(8,8,12,.86);border:1px solid #3a3a4a;" + "border-radius:4px;padding:6px 8px;color:#cfd8e8;font:11px/1.55 monospace;" + "pointer-events:auto;cursor:grab;touch-action:none;user-select:none;box-shadow:0 2px 12px rgba(0,0,0,.5);display:none";
    document.body.appendChild(_v2936);
    return _v2936;
  }
  function _v2940(_v2941, _v2942, _v2943) {
    return '<div style="display:flex;justify-content:space-between;gap:6px">' + '<span style="color:#8e98b0">' + _v2941 + "</span>" + '<b style="color:' + (_v2943 || "#e8eefc") + '">' + _v2942 + "</b></div>";
  }
  function _v2944() {
    if (!o || !o.Z || o.state !== "play" || o.Z.type !== "map") {
      if (_v2936) _v2936.style.display = "none";
      return;
    }
    try {
      var _v2945 = document.getElementById("tip"), _v2946 = document.getElementById("panel"), _v2947 = document.getElementById("overlay");
      if (_v2945 && !_v2945.hidden || _v2946 && !_v2946.hidden || _v2947 && !_v2947.hidden) {
        if (_v2936) _v2936.style.display = "none";
        return;
      }
    } catch (_v2948) {}
    _v2939().style.display = "block";
    var _v2949 = [];
    if (o.del) _v2949.push(_v2940("惊悸迷雾", "亢奋 " + o.del.depth + "%", "#cfd8e8")); else if (o.objs.some(function (_v2950) {
      return _v2950.kind === "mirror" && _v2950.st === "idle";
    })) _v2949.push(_v2940("惊悸迷雾", "镜子待进入", "#cfd8e8")); else _v2949.push(_v2940("惊悸迷雾", "—", "#556"));
    if (o.simRun) _v2949.push(_v2940("迷雾副本", "第 " + o.simRun.layer + "/" + SIM_LAYERS + " 层", "#c8a8ff")); else _v2949.push(_v2940("迷雾副本", "—", "#556"));
    var _v2951 = o.objs.filter(function (_v2952) {
      return _v2952.kind === "ritual";
    });
    if (_v2951.length) {
      var _v2953 = _v2951.filter(function (_v2954) {
        return _v2954.st === "done";
      }).length;
      _v2949.push(_v2940("驱灵仪式", _v2953 + "/" + _v2951.length + " 祭坛 · 剩余 " + (_v2951.length - _v2953) + " · 贡品 " + RitTribute(), "#ffd0e0"));
    } else _v2949.push(_v2940("驱灵仪式", "—", "#556"));
    var _v2955 = o.objs.find(function (_v2956) {
      return _v2956.kind === "abyss";
    });
    if (_v2955) {
      var _v2957 = (_v2955.fissures || []).filter(function (_v2958) {
        return _v2958.closed;
      }).length, _v2959 = (_v2955.fissures || []).length, _v2960 = _v2955.st === "fissures" ? _v2957 + "/" + _v2959 : _v2955.st === "pit" ? "巨坑清怪" : _v2955.st === "done" ? "保险箱待开" : "已开启";
      _v2949.push(_v2940("深渊", _v2960, "#9dffb4"));
    } else _v2949.push(_v2940("深渊", "—", "#556"));
    var _v2961 = o.objs.filter(function (_v2962) {
      return _v2962.kind === "shrine";
    });
    if (_v2961.length) _v2949.push(_v2940("神龛", _v2961.filter(function (_v2963) {
      return _v2963.used;
    }).length + "/" + _v2961.length));
    var _v2964 = o.objs.filter(function (_v2965) {
      return _v2965.kind === "rift";
    });
    if (_v2964.length) _v2949.push(_v2940("裂隙", _v2964.filter(function (_v2966) {
      return _v2966.st === "done";
    }).length + "/" + _v2964.length));
    var _v2967 = o.objs.filter(function (_v2968) {
      return _v2968.kind === "box";
    });
    if (_v2967.length) _v2949.push(_v2940("宝箱", _v2967.filter(function (_v2969) {
      return _v2969.open;
    }).length + "/" + _v2967.length));
    _v2949.push(_v2940("图谱点", Math.max(0, (h.atlasPts || 0) - (h.atlas && h.atlas.length || 0)) + " 可用", "#ffe8b0"));
    var _v2970 = '<div style="color:#9dffb4;font-size:11px;border-bottom:1px solid #2e3444;padding-bottom:3px;margin-bottom:3px;cursor:grab" title="按住拖动可移动 · 双击复位">异界进度 ⠿</div>' + _v2949.join("");
    if (_v2970 !== _v2937) {
      _v2936.innerHTML = _v2970;
      _v2937 = _v2970;
    }
  }
  function _v2971() {
    try {
      if (!o.Z || o.Z.type !== "map" || !o.mons) return;
      for (var _v2972 = 0; _v2972 < o.mons.length; _v2972++) {
        var _v2973 = o.mons[_v2972];
        if (!_v2973 || _v2973.dead || !(_v2973.rar === 3 || _v2973.simBoss || _v2973 === o.Z.boss)) continue;
        if (typeof AbyssFloorOK !== "function" || AbyssFloorOK(_v2973.x, _v2973.y)) continue;
        var _v2974 = null;
        for (var _v2975 = 8; _v2975 <= 140 && !_v2974; _v2975 += 8) for (var _v2976 = 0; _v2976 < 6.2832; _v2976 += 0.3927) {
          var _v2977 = _v2973.x + Math.cos(_v2976) * _v2975, _v2978 = _v2973.y + Math.sin(_v2976) * _v2975;
          if (AbyssFloorOK(_v2977, _v2978)) {
            _v2974 = {
              x: _v2977,
              y: _v2978
            };
            break;
          }
        }
        if (_v2974) {
          _v2973.x = _v2974.x;
          _v2973.y = _v2974.y;
          _v2973.state = "chase";
          _v2973.aggro = !0;
        }
      }
    } catch (_v2979) {}
  }
  _v2939();
  (function initProgressDrag() {
    var _v2980 = "er_progress_pos";
    try {
      var _v2981 = JSON.parse(localStorage.getItem(_v2980) || "null");
      if (_v2981 && isFinite(_v2981.x) && isFinite(_v2981.y)) {
        _v2936.style.left = Math.max(0, Math.min(innerWidth - 40, _v2981.x)) + "px";
        _v2936.style.top = Math.max(0, Math.min(innerHeight - 30, _v2981.y)) + "px";
      }
    } catch (_v2982) {}
    var _v2983 = null;
    _v2936.addEventListener("pointerdown", function (_v2984) {
      if (_v2984.button !== 0) return;
      var _v2985 = _v2936.getBoundingClientRect();
      _v2983 = {
        dx: _v2984.clientX - _v2985.left,
        dy: _v2984.clientY - _v2985.top
      };
      _v2936.style.cursor = "grabbing";
      try {
        _v2936.setPointerCapture(_v2984.pointerId);
      } catch (_v2986) {}
      _v2984.preventDefault();
      _v2984.stopPropagation();
    });
    _v2936.addEventListener("pointermove", function (_v2987) {
      if (!_v2983) return;
      var _v2988 = Math.max(0, Math.min(innerWidth - _v2936.offsetWidth, _v2987.clientX - _v2983.dx));
      var _v2989 = Math.max(0, Math.min(innerHeight - _v2936.offsetHeight, _v2987.clientY - _v2983.dy));
      _v2936.style.left = _v2988 + "px";
      _v2936.style.top = _v2989 + "px";
      _v2987.preventDefault();
      _v2987.stopPropagation();
    });
    function _v2990(_v2991) {
      if (!_v2983) return;
      _v2983 = null;
      _v2936.style.cursor = "grab";
      try {
        localStorage.setItem(_v2980, JSON.stringify({
          x: parseInt(_v2936.style.left, 10) || 10,
          y: parseInt(_v2936.style.top, 10) || 58
        }));
      } catch (_v2992) {}
      _v2991 && _v2991.preventDefault && _v2991.preventDefault();
    }
    _v2936.addEventListener("pointerup", _v2990);
    _v2936.addEventListener("pointercancel", _v2990);
    _v2936.addEventListener("dblclick", function () {
      _v2936.style.left = "10px";
      _v2936.style.top = "58px";
      try {
        localStorage.removeItem(_v2980);
      } catch (_v2993) {}
    });
  })();
  var _v2994 = Zb;
  Zb = function (_v2995) {
    _v2994(_v2995);
    try {
      var _v2996 = Date.now();
      if (_v2996 - _v2938 > 180) {
        _v2938 = _v2996;
        _v2971();
        _v2944();
      }
    } catch (_v2997) {}
  };
})();
(function () {
  var _v2998 = _e;
  _e = function (_v2999, _v3000, _v3001, _v3002, _v3003) {
    var _v3004 = _v2998.apply(this, arguments);
    try {
      if (_v3004 && o.simRun) {
        if (_v3003 === 3 && !_v3004.simBoss) {
          _v3004.simBoss = !0;
          if (o.simRun.layer >= o.simRun.max) {
            _v3004.maxhp *= BAL.simFinalHpMul;
            _v3004.hp = _v3004.maxhp;
            _v3004.name = "最终·" + _v3004.name;
          } else _v3004.name = "拟像首领·" + _v3004.name;
        }
      }
    } catch (_v3005) {}
    return _v3004;
  };
  var _v3006 = er;
  er = function (_v3007, _v3008, _v3009) {
    var _v3010 = _v3006.apply(this, arguments);
    try {
      if (o.simRun && _v3007 && _v3007.simBoss) SimBossKilled(_v3007);
    } catch (_v3011) {}
    return _v3010;
  };
  var _v3012 = Yl;
  Yl = function () {
    try {
      if (o && o.Z && o.Z.type === "map" && o.simRun) {
        var _v3013 = null, _v3014 = 4900;
        for (var _v3015 = 0; _v3015 < o.objs.length; _v3015++) {
          var _v3016 = o.objs[_v3015];
          if (_v3016.kind !== "b-simportal") continue;
          var _v3017 = (_v3016.x - o.pl.x) ** 2 + (_v3016.y - o.pl.y) ** 2;
          if (_v3017 < _v3014) {
            _v3014 = _v3017;
            _v3013 = _v3016;
          }
        }
        if (_v3013) return (SimEnterLayer(_v3013.layer), !0);
      }
    } catch (_v3018) {}
    return _v3012.apply(this, arguments);
  };
  var _v3019 = Vi;
  Vi = function () {
    var _v3020 = _v3019.apply(this, arguments);
    try {
      if (!SimLayerMap && (o.simRun || o.sim) && (!o.Z || o.Z.type !== "map" || !o.Z.simLayer)) {
        o.simRun = null;
        o.sim = null;
      }
    } catch (_v3021) {}
    return _v3020;
  };
  var _v3022 = z4;
  z4 = function () {
    var _v3023 = _v3022.apply(this, arguments) || [];
    try {
      if (o.simRun) _v3023.push(["迷雾副本 · 第 " + o.simRun.layer + "/" + SIM_LAYERS + " 层", !0]);
    } catch (_v3024) {}
    return _v3023;
  };
})();
(function () {
  var _v3025 = window.HOTFIX;
  if (!_v3025) return;
  try {
    if (_v3025.currencies) for (var _v3026 in _v3025.currencies) if (F[_v3026]) Object.assign(F[_v3026], _v3025.currencies[_v3026]);
    if (_v3025.mods) for (var _v3027 in _v3025.mods) if (Yt[_v3027]) Object.assign(Yt[_v3027], _v3025.mods[_v3027]);
    if (_v3025.bal) Object.assign(BAL, _v3025.bal);
    try {
      RuneApplyConfig(BAL.runes);
    } catch (_v3028) {
      console.warn("[rune] hotfix apply failed", _v3028);
    }
    SIM_LAYERS = BAL.simLayers;
    if (typeof _v3025.atlasCap === "number") Ln = _v3025.atlasCap;
    if (_v3025.uniques) for (var _v3029 in _v3025.uniques) {
      var _v3030 = Ra[_v3029] || lt.find(function (_v3031) {
        return _v3031.id === _v3029;
      });
      if (_v3030) Object.assign(_v3030, _v3025.uniques[_v3029]);
    }
    if (typeof _v3025.apply === "function") _v3025.apply({
      P: F,
      Ct: Yt,
      Ur: Mo,
      Oe: lt,
      aa: Ra,
      Na: Co,
      le: he,
      BAL: BAL,
      get As() {
        return Ln;
      },
      set As(_v3032) {
        Ln = _v3032;
      },
      get u() {
        return h;
      },
      get o() {
        return o;
      },
      setSimLayers: function (_v3033) {
        SIM_LAYERS = _v3033;
      }
    });
    window.__HOTFIX_APPLIED = _v3025.version || "unknown";
    console.info("[Hotfix] 已应用", window.__HOTFIX_APPLIED, _v3025.notes || "");
  } catch (_v3034) {
    console.error("[Hotfix] 应用失败", _v3034);
  }
})();
(function () {
  var _v3035 = [{
    id: "headhunter",
    n: "猎首",
    base: "重型腰带",
    lv: 50,
    mods: [["life", [40, 60]]],
    sp: ["headhunter"],
    st: ["具有 1–3 个咒符位", "晕眩阈值提高 20–30%", "+20–40 力量", "+20–40 敏捷", "击败稀有怪物时，获得它的词缀，持续 60 秒"],
    sr: [[1, 3], [20, 30], [20, 40], [20, 40], null],
    srt: ["具有 {0} 个咒符位", "晕眩阈值提高 {0}%", "+{0} 力量", "+{0} 敏捷", "击败稀有怪物时，获得它的词缀，持续 60 秒"],
    fl: "骨骼是灵魂的居所，血肉是精神与世界交流的窗口。",
    src: "world",
    noDrop: !0
  }, {
    id: "mageblood",
    n: "法师之血",
    base: "链甲腰带",
    lv: 55,
    mods: [["flaskEff", [20, 20]]],
    sp: ["mageblood"],
    st: ["具有 1–3 个咒符位", "20% 的药剂回复量立即生效", "每拥有一个重复的法师遗产，所有法师遗产效果提高 25–50%"],
    sr: [[1, 3], null, [25, 50]],
    srt: ["具有 {0} 个咒符位", "20% 的药剂回复量立即生效", "每拥有一个重复的法师遗产，所有法师遗产效果提高 {0}%"],
    fl: "力量的河流曾于他们血管中奔涌，如今属于你了。",
    src: "world",
    noDrop: !0
  }, {
    id: "temporalis",
    n: "时空之肌",
    base: "秘法长袍",
    lv: 64,
    mods: [["es", [100, 150]], ["resAll", [10, 20]]],
    sp: ["temporalis"],
    st: ["将所受伤害的 5–30% 吸纳为生命", "将所受伤害的 5–30% 吸纳为魔力", "技能的冷却时间 -2 ~ -1 秒"],
    sr: [[5, 30], [5, 30], [-2, -1]],
    srt: ["将所受伤害的 {0}% 吸纳为生命", "将所受伤害的 {0}% 吸纳为魔力", "技能的冷却时间 {0} 秒"],
    fl: "说书人最后掌握的元素，乃是时光本身。",
    src: "world",
    noDrop: !0
  }, {
    id: "kaoms_heart",
    n: "冈姆的壮志",
    base: "龙鳞板甲",
    lv: 68,
    mods: [["life", [1500, 1500]]],
    sp: ["kaoms_heart"],
    st: ["晕眩阈值提高 30–40%", "+1500 生命上限", "抗性上限降低至 70%"],
    sr: [[30, 40], null, null],
    srt: ["晕眩阈值提高 {0}%", "+1500 生命上限", "抗性上限降低至 70%"],
    fl: "勇斗之魂无坚不摧，懦弱之心退缩避畏。",
    src: "world",
    noDrop: !0
  }, {
    id: "rathpith_globe",
    n: "献祭之心",
    base: "水晶法器",
    lv: 75,
    mods: [["es", [60, 100]], ["life", [60, 100]]],
    sp: ["rathpith"],
    st: ["非吟唱法术额外消耗 6% 的生命上限", "每 50 生命上限使非吟唱法术的暴击率提高 3%", "每 50 生命上限使非吟唱法术的伤害提高 6%"],
    fl: "瓦尔帝国建立在无数人的血汗之上。",
    src: "world",
    noDrop: !0
  }];
  var _v3036 = [];
  _v3035.forEach(function (_v3037) {
    if (!_v3037 || !_v3037.id || !_v3037.n || !_v3037.base) return;
    if (Ra[_v3037.id]) return;
    if (!he[_v3037.base]) {
      console.warn("[暗金扩展] 基底不存在, 已跳过: " + _v3037.base + " (" + _v3037.id + ")");
      return;
    }
    _v3037.mods = _v3037.mods || [];
    _v3037.sp = _v3037.sp || [];
    _v3037.st = _v3037.st || [];
    _v3037.fl = _v3037.fl || "";
    _v3037.src = _v3037.src || "world";
    var _v3038 = _v3037.mods.filter(function (_v3039) {
      return !_v3039 || !_v3039[0] || !Yt[_v3039[0]] && !Mo[_v3039[0]];
    });
    if (_v3038.length) {
      console.warn("[暗金扩展] 未知词缀, 已跳过: " + _v3037.id + " -> " + _v3038.map(function (_v3040) {
        return _v3040 && _v3040[0];
      }).join(","));
      return;
    }
    lt.push(_v3037);
    Ra[_v3037.id] = _v3037;
    _v3036.push(_v3037.id);
  });
  if (_v3036.length) console.info("[暗金扩展] 已加载新暗金: " + _v3036.join(", "));
  window.__EXTRA_UNIQUES = _v3035;
})();
(function () {
  function _v3041(_v3042) {
    return _v3042.sr.map(function (_v3043) {
      return _v3043 ? ie(_v3043[0], _v3043[1]) : null;
    });
  }
  function _v3044(_v3045, _v3046, _v3047) {
    if (!_v3047) return null;
    var _v3048 = String(_v3045 == null ? "" : _v3045) + ":" + _v3046, _v3049 = 2166136261;
    for (var _v3050 = 0; _v3050 < _v3048.length; _v3050++) {
      _v3049 ^= _v3048.charCodeAt(_v3050);
      _v3049 = Math.imul(_v3049, 16777619);
    }
    _v3049 = _v3049 >>> 0;
    return _v3047[0] + _v3049 % (_v3047[1] - _v3047[0] + 1);
  }
  function _v3051(_v3052) {
    var _v3053 = _v3052 && _v3052.uniq ? Ra[_v3052.uniq] : null;
    if (!_v3053 || !_v3053.sr) return null;
    if (!Array.isArray(_v3052.ur) || _v3052.ur.length !== _v3053.sr.length) {
      _v3052.ur = _v3053.sr.map(function (_v3054, _v3055) {
        return _v3044(_v3052.uid, _v3055, _v3054);
      });
    }
    return _v3053;
  }
  function _v3056(_v3057) {
    var _v3058 = _v3051(_v3057);
    if (!_v3058 || !_v3058.srt) return null;
    return _v3058.srt.map(function (_v3059, _v3060) {
      return _v3057.ur[_v3060] == null ? _v3059 : _v3059.replace("{0}", String(_v3057.ur[_v3060]));
    });
  }
  var _v3061 = _t;
  _t = function (_v3062, _v3063) {
    var _v3064 = _v3061.apply(this, arguments);
    try {
      if (_v3064 && _v3062 && _v3062.sr) _v3064.ur = _v3041(_v3062);
    } catch (_v3065) {}
    return _v3064;
  };
  var _v3066 = ss;
  ss = function (_v3067) {
    var _v3068 = _v3066.apply(this, arguments);
    try {
      if (_v3068 && _v3068.h && _v3067 && _v3067.uniq) {
        var _v3069 = _v3051(_v3067), _v3070 = _v3056(_v3067);
        if (_v3069 && _v3070) for (var _v3071 = 0; _v3071 < _v3070.length; _v3071++) {
          var _v3072 = '<div class="sp">' + _v3069.st[_v3071] + "</div>";
          var _v3073 = '<div class="sp">' + _v3070[_v3071] + "</div>";
          _v3068.h = _v3068.h.split(_v3072).join(_v3073);
        }
      }
    } catch (_v3074) {}
    return _v3068;
  };
  window.__TEMPORALIS_ROLL = function (_v3075) {
    return _v3051(_v3075) ? _v3075.ur.slice() : null;
  };
})();
try {
  if (typeof rt !== "undefined" && rt && rt.length >= 0) {
    rt.length = 0;
    Object.keys(F).forEach(function (_v3076) {
      rt.push(_v3076);
    });
  }
} catch (_v3077) {
  console.warn("[port] rebuild lt", _v3077);
}
try {
  if (typeof En !== "undefined" && typeof Co !== "undefined") {
    En = {};
    Co.forEach(function (_v3078) {
      _v3078.nodes.forEach(function (_v3079, _v3080) {
        _v3079.b = _v3078.key;
        _v3079.i = _v3080;
        En[_v3079.k] = _v3079;
      });
    });
  }
} catch (_v3081) {
  console.warn("[port] rebuild Ts", _v3081);
}
try {
  ["ds_es", "ds_cast", "ds_skill", "ds_life", "ds_atk", "ds_leech", "ds_crit", "ds_move", "ds_rarity", "ds_res"].forEach(function (_v3082) {
    if (Yt[_v3082] && ml.indexOf(Yt[_v3082]) < 0) ml.push(Yt[_v3082]);
  });
} catch (_v3083) {
  console.warn("[port] rebuild zn", _v3083);
}
try {
  if (typeof Tk === "function") Tk();
} catch (_v3084) {
  console.warn("[port] x1", _v3084);
}
try {
  if (typeof QS === "function") QS();
} catch (_v3085) {
  console.warn("[port] Cx", _v3085);
}
try {
  if (typeof jT === "function") jT();
} catch (_v3086) {
  console.warn("[port] qv", _v3086);
}
document.addEventListener("keydown", function (_v3087) {
  if (_v3087.key !== "Escape") return;
  try {
    if (o.menu) return;
    if (o.held) {
      Za(null);
      _v3087.preventDefault();
      _v3087.stopImmediatePropagation();
      return;
    }
    if (o.tab) {
      o.tab = null;
      var _v3088 = document.getElementById("panel");
      if (_v3088) _v3088.hidden = true;
      console.log("[esc2-after]", document.getElementById("panel").hidden);
      _v3087.preventDefault();
      _v3087.stopImmediatePropagation();
      return;
    }
  } catch (_v3089) {}
}, true);
try {
  window.addEventListener("keydown", function (_v3090) {
    if (_v3090.key !== "Escape" || _v3090.repeat) return;
    try {
      if (o.menu) return;
      if (o.held) {
        Za(null);
        _v3090.preventDefault();
        _v3090.stopImmediatePropagation();
        return;
      }
      if (o.tab) {
        kt();
        try {
          o.tab = null;
          document.getElementById("panel").hidden = true;
        } catch (_v3091) {}
        window.__escGuardUntil = Date.now() + 450;
        _v3090.preventDefault();
        _v3090.stopImmediatePropagation();
        return;
      }
    } catch (_v3092) {}
  }, true);
} catch (_v3093) {}
try {
  var _usBase = gs;
  gs = function () {
    try {
      if (window.__escGuardUntil && Date.now() < window.__escGuardUntil) return;
    } catch (_v3094) {}
    return _usBase.apply(this, arguments);
  };
} catch (_v3095) {}
function StartEndlessRift() {
  try {
    o.endlessMode = !0;
    o.endlessLiteMode = !1;
    o.endlessIntensity = 0;
    o.endlessIntensityT = 5;
    o.endlessSpawnT = 0;
    o.endlessSpawnIndex = 0;
    o.endlessBossSpawnT = 0;
    kt();
    let _v3096 = {
      ...ia(17),
      tier: 17,
      ilvl: 17,
      name: "无尽裂隙 · 第 150 层",
      rarity: 0,
      mods: [],
      invest: 0
    };
    Pr(_v3096);
    $e("无尽裂隙", "怪物每 5 秒强度 +1 · 抵达第 150 层为深渊之底 · 按 T 返回藏身处");
  } catch (_v3097) {
    P("无尽裂隙暂时无法进入");
  }
}
window.__StartEndlessRift = StartEndlessRift;
try {
  let _v3098 = document.getElementById("menu");
  if (_v3098 && !document.getElementById("btnEndless")) {
    let _v3099 = document.createElement("button");
    _v3099.id = "btnEndless";
    _v3099.className = "mbtn";
    _v3099.title = "进入无尽裂隙（第 150 层为深渊之底）";
    _v3099.innerHTML = "无尽 <kbd>150</kbd>";
    _v3099.onclick = function (_v3100) {
      _v3100.preventDefault();
      _v3100.stopPropagation();
      StartEndlessRift();
    };
    _v3098.insertBefore(_v3099, _v3098.firstChild);
  }
} catch (_v3101) {}
(function () {
  try {
    var _v3102 = typeof window !== "undefined" && window.RIFT_EXTRA_SKILLS || [];
    var _v3103 = typeof window !== "undefined" && window.RIFT_EXTRA_SUPPORTS || [];
    var _v3104 = typeof Hh !== "undefined" && Hh && Hh.SK ? Hh.SK : typeof X !== "undefined" ? X : null;
    var _v3105 = typeof dh !== "undefined" && dh && dh.SUP ? dh.SUP : typeof Y !== "undefined" ? Y : null;
    if (!_v3104 || !_v3105) {
      console.warn("[mods] 技能/辅助表不可用，跳过新宝石");
      return;
    }
    function _v3106(_v3107, _v3108) {
      try {
        if (typeof He !== "undefined" && He && !He[_v3107]) He[_v3107] = He[_v3108] || He.arc || "";
      } catch (_v3109) {}
    }
    var _v3110 = [], _v3111 = [];
    _v3102.forEach(function (_v3112) {
      if (!_v3112 || !_v3112.id || _v3112.enabled === false || _v3104[_v3112.id]) return;
      var _v3113 = {};
      for (var _v3114 in _v3112) if (_v3114 !== "id" && _v3114 !== "enabled") _v3113[_v3114] = _v3112[_v3114];
      if (!_v3113.n) _v3113.n = _v3112.id;
      if (!_v3113.d) _v3113.d = "";
      _v3104[_v3112.id] = _v3113;
      _v3106(_v3112.id, "arc");
      _v3110.push(_v3112.id);
    });
    _v3103.forEach(function (_v3115) {
      if (!_v3115 || !_v3115.id || _v3115.enabled === false || _v3105[_v3115.id]) return;
      var _v3116 = {};
      for (var _v3117 in _v3115) if (_v3117 !== "id" && _v3117 !== "enabled") _v3116[_v3117] = _v3115[_v3117];
      if (!_v3116.n) _v3116.n = _v3115.id;
      if (!_v3116.d) _v3116.d = "";
      if (_v3116.req == null) _v3116.req = "";
      _v3105[_v3115.id] = _v3116;
      _v3106(_v3115.id, "critsup");
      _v3111.push(_v3115.id);
    });
    var _v3118 = typeof window !== "undefined" && window.RIFT_EXTRA_CURRENCIES || [];
    var _v3119 = window.__RIFT_CUR_ALIAS || (window.__RIFT_CUR_ALIAS = {});
    var _v3120 = [];
    if (typeof F !== "undefined" && typeof rt !== "undefined") {
      _v3118.forEach(function (_v3121) {
        if (!_v3121 || !_v3121.id || _v3121.enabled === false || F[_v3121.id]) return;
        var _v3122 = {};
        for (var _v3123 in _v3121) if (_v3123 !== "id" && _v3123 !== "enabled" && _v3123 !== "like") _v3122[_v3123] = _v3121[_v3123];
        if (!_v3122.n) _v3122.n = _v3121.id;
        if (!_v3122.d) _v3122.d = "";
        if (!_v3122.grp) _v3122.grp = "basic";
        if (_v3122.v == null) _v3122.v = 0.5;
        F[_v3121.id] = _v3122;
        if (rt.indexOf(_v3121.id) < 0) rt.push(_v3121.id);
        _v3106(_v3121.id, "chaos");
        if (_v3121.like && F[_v3121.like]) _v3119[_v3121.id] = _v3121.like;
        _v3120.push(_v3121.id);
      });
      if (!window.__RIFT_CUR_WRAPPED && Object.keys(_v3119).length) {
        window.__RIFT_CUR_WRAPPED = 1;
        var _v3124 = Bo, _v3125 = jf, _v3126 = Rr;
        Bo = function (_v3127) {
          return _v3124.apply(this, [_v3119[_v3127] || _v3127].concat([].slice.call(arguments, 1)));
        };
        jf = function (_v3128) {
          return _v3125.apply(this, [_v3119[_v3128] || _v3128].concat([].slice.call(arguments, 1)));
        };
        Rr = function (_v3129) {
          return _v3126.apply(this, [_v3119[_v3129] || _v3129].concat([].slice.call(arguments, 1)));
        };
      }
    }
    var _v3130 = typeof window !== "undefined" && Array.isArray(window.RIFT_STAR_EFFECTS) ? window.RIFT_STAR_EFFECTS.filter(function (_v3131) {
      return _v3131 && _v3131.id && _v3131.enabled !== false;
    }) : [];
    var _v3132 = typeof window !== "undefined" && Array.isArray(window.RIFT_RUNEWORDS) ? window.RIFT_RUNEWORDS.filter(function (_v3133) {
      return _v3133 && _v3133.id;
    }) : [];
    var _v3134 = typeof window !== "undefined" && Array.isArray(window.RIFT_EXTRA_JEWELS) ? window.RIFT_EXTRA_JEWELS.filter(function (_v3135) {
      return _v3135 && _v3135.id;
    }) : [];
    window.__RIFT_MODS = {
      skills: _v3110,
      supports: _v3111,
      currencies: _v3120,
      starEffects: _v3130,
      runewords: _v3132,
      jewels: _v3134,
      currencyTable: F,
      currencyAlias: _v3119,
      skillTable: _v3104,
      supportTable: _v3105
    };
    if (_v3110.length || _v3111.length || _v3120.length || _v3130.length || _v3132.length || _v3134.length) console.log("[mods] 已加载新内容: 技能 " + _v3110.length + " · 辅助 " + _v3111.length + " · 通货 " + _v3120.length + " · 星图效果 " + _v3130.length + " · 符文之语 " + _v3132.length + " · 珠宝 " + _v3134.length);
  } catch (_v3136) {
    console.warn("[mods] 加载失败", _v3136);
  }
})();
try {
  if (typeof ms === "function") ms();
} catch (_v3137) {
  console.warn("[port] Vs", _v3137);
}
var __uploadedSfxMap = typeof window !== "undefined" && window.__uploadedSfxMap || ({});
var __uploadedSfxAudio = typeof window !== "undefined" && window.__uploadedSfxAudio || null;
var __uploadedSfxData = typeof window !== "undefined" && window.__uploadedSfxData || null;
var __uploadedSfxLive = typeof window !== "undefined" && window.__uploadedSfxLive || null;
var __uploadedSfxTrim = typeof window !== "undefined" && window.__uploadedSfxTrim || 0;
var __uploadedSfxVolume = typeof window !== "undefined" && window.__uploadedSfxVolume || 1;
var playAssetSfx = typeof window !== "undefined" && window.playAssetSfx || (function () {});
var __syncUploadedSfxVolume = typeof window !== "undefined" && window.__syncUploadedSfxVolume || (function () {});
var makeEndlessMap = typeof window !== "undefined" && window.makeEndlessMap || null;
window.__PORT = window.__PORT || ({});
window.__PORT.version = "1.05-port";
window.__PORT.ready = true;
