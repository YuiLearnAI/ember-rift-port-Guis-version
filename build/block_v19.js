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
  simLayers: 70,
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
  dropMul: {
    coreCur: 0.72,
    rune: 1.25,
    omen: 1.3,
    bone: 1.25,
    simNormal: { cur: 0.04, omen: 0.003, bone: 0.004, rune: 0.005, splinter: 0.002 }
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
var ExAll = () => Tt.filter(_v1 => q[_v1] && (q[_v1].grp === "sock" || (q[_v1].v > 0 && q[_v1].grp !== "sig" && (q[_v1].grp === "bone" || q[_v1].grp === "rune" || !EX_SKIP.has(_v1)))));
var ExC = _v2 => Math.round(q[_v2].v * 100);
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
    _v13.push(["leech", Math.round((0.2 + 0.1 * _v11) * 100) / 100]);
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
  var __rr = function (v) {
    v = +v;
    if (!isFinite(v)) return v;
    return Math.round(v * 1000) / 1000;
  };
  if (Array.isArray(_v16)) _v16 = [__rr(_v16[0]), __rr(_v16[1])];
  else _v16 = __rr(_v16);
  if (Fl[_v15]) return "附加 " + _v16[0] + " - " + _v16[1] + " " + Gg[Fl[_v15]] + "伤害";
  if (_v15 === "physInc") return "物理伤害提高 " + _v16 + "%";
  return _a(_v15, _v16);
}
function RuneEffectsText(_v17, _v18) {
  var _v19 = f0[RuneId(_v17)];
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
    if (!q[_v30]) return null;
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
    if (q[_v50]) q[_v50].v = RuneValue(_v49);
  }
  for (var _v51 = 1; _v51 <= 40; _v51++) f0[RuneId(_v51)] = RuneEffects(_v51);
  for (var _v52 = 1; _v52 <= 40; _v52++) {
    var _v53 = RuneId(_v52);
    if (!q[_v53]) continue;
    q[_v53].d = "武器: " + RuneEffectsText(_v52, "W") + " · 防具: " + RuneEffectsText(_v52, "A");
  }
  for (var _v54 in f0) if (_v54.indexOf("__rw_") === 0) delete f0[_v54];
  RUNE_WORDS.forEach(function (_v55) {
    f0["__rw_" + _v55.id] = {
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
    var _v61 = q[_v58].col;
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
    var _v69 = Math.floor((q[_v58].rn - 1) / 10);
    for (var _v70 = 0; _v70 <= _v69; _v70++) _v62(4, 7 - _v70, "#ffffffaa");
    Si[_v58] = _v59;
    Ye[_v58] = _v59.toDataURL();
  } catch (_v71) {}
}
function RuneInit() {
  RUNE_IDS = [];
  for (var _v72 = 1; _v72 <= 40; _v72++) {
    var _v73 = RuneId(_v72), _v74 = RUNE_CATS[(_v72 - 1) % 5];
    RUNE_IDS.push(_v73);
    if (!q[_v73]) q[_v73] = {};
    q[_v73].n = "#" + _v72 + " " + RUNE_NAMES[_v72 - 1];
    q[_v73].rn = _v72;
    q[_v73].cat = _v74;
    q[_v73].grp = "rune";
    q[_v73].col = RUNE_CAT_COL[_v74];
    q[_v73].w = 0;
    q[_v73].v = RuneValue(_v72);
    q[_v73].d = "";
    RuneMakeIcon(_v73);
  }
  JS.skillLvl = "+{v} 技能等级";
  RuneApplyConfig(BAL.runes && BAL.runes.words ? BAL.runes : RUNE_CFG_DEFAULT);
}
function RuneItemCat(_v75) {
  if (!_v75 || _v75.kind !== "item" || !_v75.slot) return null;
  if (_v75.slot === "W") {
    var _v76 = pe[_v75.base];
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
function RuneWordMatches(_v82) {
  if (!_v82 || _v82.kind !== "item") return [];
  var _v83 = _v82.runes || [];
  if (!_v83.length) return [];
  var _v84 = RuneItemCat(_v82), out = [], seen = {};
  for (var _v85 = 0; _v85 < RUNE_WORDS.length; _v85++) {
    var _v86 = RUNE_WORDS[_v85], _wlen = _v86.seq.length;
    if (_wlen > _v83.length) continue;
    for (var _start = 0; _start + _wlen <= _v83.length; _start++) {
      var _ok = true;
      for (var _v88 = 0; _v88 < _wlen; _v88++) if (_v86.seq[_v88] !== _v83[_start + _v88]) {
        _ok = false;
        break;
      }
      if (!_ok) continue;
      if (!RuneReqOK(_v86.req, _v84)) continue;
      if (!seen[_v86.id]) { seen[_v86.id] = 1; out.push(_v86); }
      break;
    }
  }
  return out;
}
function RuneWordMatch(_v82) {
  var all = RuneWordMatches(_v82);
  return all.length ? all[0] : null;
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
    return [_v96[0], Math.round(_v97 * 1000) / 1000];
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
  var _list = RuneWordMatches(_v102);
  if (!_list.length) {
    var _v104 = RuneWordNearMiss(_v102);
    return _v104 ? '<div class="sep"></div><div class="p" style="color:#c8a060">◇ 符文顺序不同 · 未激活符文之语</div>' : "";
  }
  return _list.map(function (_v103) {
    var _v105 = RuneWordEffects(_v102, _v103);
    var _v106 = _v105.map(function (_v107) {
      return RuneStatText(_v107[0], _v107[1]);
    }).join(" · ");
    var _v108 = (_v103.d || []).map(function (_v109) {
      return '<div class="p dim">' + O(_v109) + "</div>";
    }).join("");
    return '<div class="sep"></div><div class="md" style="color:#9dffb4;font-weight:700;font-size:13px">✦ 符文之语「' + O(_v103.n) + '」已激活 <span class="tg">顺序匹配</span></div><div class="md" style="color:#e2d2a8">' + _v106 + "</div>" + _v108;
  }).join("");
}
function RunePhysIncOf(_v110) {
  if (!_v110 || !_v110.runes) return 0;
  var _v111 = _v110.slot === "W", _v112 = 0;
  _v110.runes.forEach(function (_v113) {
    var _v114 = f0[_v113];
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
    if (!_v122 || !_v122.out || !q[_v122.out]) return;
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
    if (!_v133 || !_v133.out || !q[_v133.out] || !q[_v133.from]) return;
    _v121.push({
      id: _v133.id || "tgt_" + _v133.out,
      kind: "targeted",
      out: _v133.out,
      cost: _v133.cost || ({}),
      runes: [{
        id: _v133.from,
        count: _v133.count || 2
      }],
      bones: _v133.bone && q[_v133.bone] ? [{
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
    if (!q[_v141]) return "配方数据异常: " + _v141;
    if ((u.cur[_v141] || 0) < _v140[_v141]) return q[_v141].n + " 不足 (需要 " + _v140[_v141] + ", 持有 " + (u.cur[_v141] || 0) + ")";
  }
  return null;
}
function RuneCraft(_v142) {
  if (!u || !u.cur) return "没有可用角色";
  var _v143 = null;
  RuneRecipes().forEach(function (_v144) {
    if (_v144.id === _v142) _v143 = _v144;
  });
  if (!_v143) return "未知符文配方";
  var _v145 = RuneCanCraft(_v143);
  if (_v145) return _v145;
  var _v146 = RuneRecipeNeed(_v143);
  for (var _v147 in _v146) u.cur[_v147] -= _v146[_v147];
  u.cur[_v143.out] = (u.cur[_v143.out] || 0) + 1;
  try {
    var _v148 = AtlasRuneRefundChance();
    if (_v148 > 0 && I() < _v148) {
      Object.keys(_v143.cost || ({})).forEach(function (_v149) {
        u.cur[_v149] = (u.cur[_v149] || 0) + _v143.cost[_v149];
      });
      P("符文共鸣 · 本次合成未消耗通货");
    }
  } catch (_v150) {}
  return null;
}
function RuneCostText(_v151) {
  var _v152 = [];
  (_v151.runes || []).forEach(function (_v153) {
    _v152.push(q[_v153.id].n + " ×" + _v153.count);
  });
  (_v151.bones || []).forEach(function (_v154) {
    _v152.push(q[_v154.id].n + " ×" + _v154.count);
  });
  Object.keys(_v151.cost || ({})).forEach(function (_v155) {
    _v152.push(q[_v155].n + " ×" + _v151.cost[_v155]);
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
  return '<button data-rune="' + _v158.id + '" style="display:flex;align-items:center;gap:8px;width:100%;padding:5px 8px;border:1px solid ' + (_v159 ? "#5a4a2a" : "#2e2834") + ';background:' + (_v159 ? "#16120c" : "#0d0b10") + ';color:#d8d0c0;cursor:pointer;text-align:left;font-size:12px">' + '<img src="' + (Ye[_v158.out] || "") + '" alt="" style="width:20px;height:20px;image-rendering:pixelated;flex:none">' + '<span style="flex:1;min-width:0"><b style="color:' + q[_v158.out].col + '">' + q[_v158.out].n + "</b>" + '<small style="display:block;color:#8e98b0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + RuneCostText(_v158) + "</small></span>" + '<em style="font-style:normal;flex:none;color:' + (_v159 ? "#9dffb4" : "#e06a6a") + '">' + (_v159 ? "可合成" : "材料不足") + "</em></button>";
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
      return q[_v170].n;
    }).join(" → ");
    return '<div class="baff" data-rw="' + _v168.id + '" style="display:block;padding:3px 6px"><span class="btxt"><b style="color:#e8c870">' + _v168.n + '</b> <small style="color:#8e98b0">' + RuneReqLabel(_v168.req) + '</small><br><span style="color:#b8a888;font-size:11px">' + _v169 + "</span></span></div>";
  }).join("");
  return '<section class="bpick"><div class="bsec" style="padding:4px 2px"><h4>符文之语 <small>' + RUNE_WORDS.length + ' 条 · 按镶嵌顺序匹配 · 乱序不生效</small></h4><div style="max-height:56vh;overflow:auto;display:flex;flex-direction:column;gap:3px;padding-right:4px">' + _v167 + "</div></div></section>";
}
(function () {
  var _v171 = Tc;
  Tc = function (_v172) {
    var _v173 = [], _v174 = [];
    try {
      if (_v172) for (var _v175 in _v172) {
        var _v176 = _v172[_v175];
        if (!_v176 || !_v176.runes || !_v176.runes.length) continue;
        var __rwMatches = RuneWordMatches(_v176);
        if (!__rwMatches.length) continue;
        var _v179 = 1;
        try {
          _v179 = AtlasRuneWordMul();
        } catch (_v180) {}
        var __rwAdded = 0;
        __rwMatches.forEach(function (_v177) {
          var _v178 = "__rw_" + _v177.id;
          if (!f0[_v178]) { f0[_v178] = { w: [], a: [] }; }
          f0[_v178] = {
            w: RuneWordScaled(_v177.w, _v179),
            a: RuneWordScaled(_v177.a, _v179)
          };
          if (_v174.indexOf(_v177.id) < 0) _v174.push(_v177.id);
          _v176.runes.push(_v178);
          __rwAdded++;
        });
        _v176.__rwAdded = __rwAdded;
        _v173.push(_v176);
      }
    } catch (_v181) {}
    try {
      var __v0res = _v171.apply(this, arguments);
      // 旧存档/自定义职业可能没有 sp/asc 集合，基础代码会直接读 o.S.sp.has / asc.has
      if (__v0res) {
        if (!__v0res.sp) __v0res.sp = new Set();
        if (!__v0res.asc) __v0res.asc = new Set();
        if (__v0res.jk) __v0res.jk.swordCap = Math.min(__v0res.jk.swordCap || 12, 8);
        if (!__v0res.buffs) __v0res.buffs = new Set();
      }
      return __v0res;
    } finally {
      for (var _v182 = _v173.length - 1; _v182 >= 0; _v182--) {
        var __rwItem = _v173[_v182], __rwN = __rwItem.__rwAdded || 1;
        for (var __rwK = 0; __rwK < __rwN; __rwK++) __rwItem.runes.pop();
        try { delete __rwItem.__rwAdded; } catch (e) {}
      }
      for (var _v183 = 0; _v183 < _v174.length; _v183++) {
        var _v184 = null;
        for (var _v185 = 0; _v185 < RUNE_WORDS.length; _v185++) if (RUNE_WORDS[_v185].id === _v174[_v183]) _v184 = RUNE_WORDS[_v185];
        if (_v184) f0["__rw_" + _v184.id] = {
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
    return i3(_v188, _v189);
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
    return Tc(_v190 || ({}), u.tree || [], u.level || 1, u.cls, u.ascNodes || [], u.buffs || new Set());
  },
  benchHTML: RuneCraftHTML,
  barVisible: function (_v191) {
    return !q[_v191] || !q[_v191].rn || (u.cur[_v191] || 0) > 0;
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
  var _v217 = _v215 && _v216 ? qa(_v215, _v216.id) : null;
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
  var _v226 = qa(_v224, _v225.id) || ta[_v225.id];
  if (!_v226) return "";
  var _v227 = _v225.ur ? "" : '<span class="tg">' + (_v226.t === "P" ? "前缀" : "后缀") + " T" + (_v226.ranges.length - (_v225.ti || 0)) + "</span>";
  var _v228 = (_v225.fr ? '<span class="tg fr">破溃</span>' : _v224.meta && _v225.t === _v224.meta ? '<span class="tg lk">锁定</span>' : "") + (_v225.ex ? '<span class="tg ex">超越</span>' : "") + AffixTagHTML(_v224, _v225);
  return '<div class="md' + (_v225.fr ? " frm" : "") + '">' + O(Xs(_v226, _v225.v)) + _v227 + _v228 + "</div>";
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
      return '<div class="baff"><span class="btier">T' + AffixTierOf(_v243, _v248) + '</span><span class="btxt">' + O(Xs(qa(_v243, _v248.id), _v248.v)) + '</span><i class="bst" style="color:#5fe0c0">特殊</i></div>';
    }).join("") || '<div class="baff empty"><span class="btier">—</span><span class="btxt">空栏 · 需异界高级预兆</span></div>') + "</div>";
  }
  var _v249 = _v245.dsec;
  return '<div class="bcol"><h4>渎灵 <small>' + Math.min(_v246.length, _v249) + "/" + _v249 + (_v246.length > _v249 ? " +旧版" + (_v246.length - _v249) : "") + "</small></h4>" + (_v246.map(function (_v250) {
    return '<div class="baff"><span class="btier">D</span><span class="btxt">' + O(Xs(qa(_v243, _v250.id), _v250.v)) + '</span><i class="bst ds">' + (_v250.legacyDsec ? "旧版渎灵" : "渎灵") + "</i></div>";
  }).join("") || '<div class="baff empty"><span class="btier">—</span><span class="btxt">空栏 · 渎灵揭示</span></div>') + "</div>";
}
wt = function (_v251) {
  if (!_v251) return false;
  if (AffixTotalRoom(_v251) <= 0) return false;
  var _v252 = [];
  if (AffixRegRoom(_v251, "P") > 0 && _v251.meta !== "P") _v252.push("P");
  if (AffixRegRoom(_v251, "S") > 0 && _v251.meta !== "S") _v252.push("S");
  i0(_v252);
  for (var _v253 = 0; _v253 < _v252.length; _v253++) {
    var _v254 = O4(_v251, _v252[_v253]);
    if (_v254) {
      _v251.mods.push(_v254);
      return true;
    }
  }
  return false;
};
Du = function (_v255, _v256) {
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
  i0(_v260);
  for (var _v261 = 0; _v261 < _v260.length; _v261++) {
    var _v262 = O4(_v259, _v260[_v261]);
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
  na(_v263);
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
    return wt(_v272);
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
  if (ATLAS_BUILT_FOR === Ks.length && ATLAS_ALL.length) return;
  ATLAS_BUILT_FOR = Ks.length;
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
  for (let _v275 = 0; _v275 < Ks.length; _v275++) {
    let _v276 = Ks[_v275];
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
    let _v281 = ATLAS_EXTRA[_v280];
    if (!_v281) continue;
    let _v282 = Ks.find(function (_v283) {
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
  // 把自定义图谱节点注册进基础 En，避免基础点击/提示读取 En[key].b 时 undefined
  try {
    if (typeof Ma !== "undefined" && Ma) {
      for (let __ei = 0; __ei < ATLAS_EXTRA.length; __ei++) {
        let __en = ATLAS_EXTRA[__ei];
        if (__en && __en.k) Ma[__en.k] = __en;
      }
    }
  } catch (e) {}
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
  (u && u.atlas || []).forEach(function (_v292) {
    let _v293 = ATLAS_BY_K[_v292];
    if (_v293) _v291 += _v293.cost || 1;
  });
  return _v291;
}
function AtlasEarned() {
  return Math.min(Br, Math.max(0, Math.floor(+(u && u.atlasPts || 0))));
}
function AtlasAvailable() {
  return Math.max(0, Math.min(AtlasEarned(), ATLAS_SPEND) - AtlasUsed());
}
function AtlasCountAlloc(_v294) {
  return (u && u.atlas || []).filter(function (_v295) {
    return _v295 === _v294;
  }).length;
}
function AtlasBranchSmallCount(_v296) {
  AtlasEnsure();
  let _v297 = 0;
  (u && u.atlas || []).forEach(function (_v298) {
    let _v299 = ATLAS_BY_K[_v298];
    if (_v299 && _v299.b === _v296 && _v299.tier === "small") _v297++;
  });
  return _v297;
}
function AtlasChildren(_v300) {
  AtlasEnsure();
  return (u && u.atlas || []).filter(function (_v301) {
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
  if (!u) return "没有可用角色";
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
  u.atlas = u.atlas || [];
  u.atlas.push(_v311);
  u.atlasEver = Math.max(+(u.atlasEver || 0), u.atlasPts || 0);
  return null;
}
function AtlasRespecCost() {
  let _v313 = 2 * (u && u.atlas ? u.atlas.filter(function (_v314) {
    return _v314 === "atlas_sense";
  }).length : 0);
  return Math.max(2, 10 - _v313);
}
function AtlasRespec(_v315) {
  if (!u || !u.atlas) return "没有可用角色";
  if (!AtlasCountAlloc(_v315)) return "该节点没有点亮";
  let _v316 = AtlasChildren(_v315);
  if (_v316.length) return "需先退还更深层的节点";
  let _v317 = AtlasRespecCost();
  if ((u.cur.chaos || 0) < _v317) return "混沌石不足 (需要 " + _v317 + ")";
  u.cur.chaos -= _v317;
  u.atlas = u.atlas.filter(function (_v318) {
    return _v318 !== _v315;
  });
  u.atlasRespec = (u.atlasRespec || 0) + 1;
  return null;
}
function AtlasRespecAll() {
  if (!u || !u.atlas) return "没有可用角色";
  if (!u.atlas.length) return "图谱已经是空的";
  if ((u.cur.divine || 0) < 1) return "神圣石不足 (需要 1)";
  u.cur.divine -= 1;
  u.atlas = [];
  u.atlasRespec = (u.atlasRespec || 0) + 1;
  return null;
}
function AtlasMigrateSave(_v319) {
  if (!_v319) return;
  AtlasEnsure();
  _v319.atlasEver = Math.max(0, Math.floor(+(_v319.atlasEver || 0)));
  _v319.atlasRespec = Math.max(0, Math.floor(+(_v319.atlasRespec || 0)));
  _v319.atlasPts = Math.min(Br, Math.max(0, Math.floor(+(_v319.atlasPts || 0))));
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
  _v319.atlasPts = Math.min(Br, Math.max(_v319.atlasPts, Math.ceil(_v327)));
  _v319.atlasEver = Math.max(_v319.atlasEver, _v319.atlasPts);
}
function AtlasKillLootMul() {
  return re("greed") ? 1.25 : re("stability") ? 0.9 : 1;
}
function AtlasSimLootMul() {
  return re("simascetic") ? 1.4 : re("pleasure") ? 0.85 : 1;
}
function AtlasMonsterMul() {
  return re("greed") ? 1.3 : re("stability") ? 0.9 : 1;
}
function AtlasContentMul() {
  return re("converge") ? 0.7 : 1;
}
function AtlasRuneRefundChance() {
  return (re("run_affinity") ? 0.1 : 0) + (re("rune_resonance") ? 0.15 : 0);
}
function AtlasRuneWordMul() {
  return 1 + (re("runesmith_novice") ? 0.05 : 0) + (re("rune_weaver") ? 0.1 : 0);
}
function AtlasDeliriumCap() {
  return 250 + (re("sim_lore") ? 25 : 0);
}
function AtlasDeliriumGain(_v342) {
  return Math.round(_v342 * (re("sim_sense") ? 1.1 : 1));
}
function AtlasEnsureHooks() {
  try {
    A("kill:loot", function (_v343) {
      try {
        if (!_v343) return;
        _v343.dm = (_v343.dm || 1) * AtlasKillLootMul();
        if (n && n.simRun) _v343.dm *= AtlasSimLootMul();
        if (re("converge")) _v343.rb = (_v343.rb || 0) + 25;
      } catch (_v344) {}
    });
    A("map:stats", function (_v345) {
      try {
        if (_v345 && _v345.o && re("affix_sense")) _v345.o.quant = (_v345.o.quant || 0) + 5;
      } catch (_v346) {}
    });
    A("boss:map", function (_v347) {
      try {
        if (_v347 && re("map_sense")) _v347.up = Math.max(_v347.up || 0, 0.55);
      } catch (_v348) {}
    });
  } catch (_v349) {}
  try {
    if (typeof nt === "function" && !nt.__atlasWrapped) {
      let _v350 = nt;
      nt = function (_v351, _v352, _v353, _v354, _v355) {
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
      nt.__atlasWrapped = 1;
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
        Gs();
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
          if (!_v366 || n.tab !== "atlas") return;
          var _v367 = _v366.getBoundingClientRect();
          if (_v365.clientX < _v367.left || _v365.clientX > _v367.right || _v365.clientY < _v367.top || _v365.clientY > _v367.bottom) return;
          var _v368 = AtlasCanvasPoint(_v365, _v366), _v369 = AtlasNodeAtWorld(_v368.x, _v368.y);
          if (!_v369) {
            var _v370 = ATLAS_VIEW.s || 0.75, _v371 = (_v368.x - (ATLAS_VIEW.x || 0)) / _v370, _v372 = (_v368.y - (ATLAS_VIEW.y || 0)) / _v370, _v373 = 1e9;
            for (var _v374 = 0; _v374 < ATLAS_ALL.length; _v374++) {
              var _v375 = ATLAS_ALL[_v374];
              if (!(AtlasCanAlloc(_v375.k) || AtlasCountAlloc(_v375.k))) continue;
              var _v376 = Math.hypot(_v375.x - _v371, _v375.y - _v372);
              if (_v376 < _v373 && _v376 < 36) {
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
          $(AtlasCountAlloc(_v369.k) ? "craft" : "unique");
          Gs();
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
    let _v423 = (_v421.tier === "keystone" ? 15 : _v421.tier === "core" ? 18 : 9) + 14;
    if (_v422 < _v423 && _v422 < _v419) {
      _v419 = _v422;
      _v418 = _v421;
    }
  }
  if (!_v418) {
    for (let _v424 = 0; _v424 < ATLAS_ALL.length; _v424++) {
      let _v425 = ATLAS_ALL[_v424];
      let _v426 = Math.hypot(_v425.x - _v416, _v425.y - _v417);
      if (_v426 < 26 && _v426 < _v419) {
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
var ATLAS_LAST_LABELS = [], ATLAS_LAST_HUD = null;
/* 两个矩形（含各自的 p 内边距）的重叠面积，不相交返回 0。
   留内边距是为了「刚好贴边」也算冲突 —— 标签紧贴着排一行虽然没压字，但读起来仍是一团。 */
function AtlasRectOverlap(a, b) {
  var pa = a.p || 0, pb = b.p || 0;
  var ax = a.x - pa, ay = a.y - pa, aw = a.w + pa * 2, ah = a.h + pa * 2;
  var bx = b.x - pb, by = b.y - pb, bw = b.w + pb * 2, bh = b.h + pb * 2;
  var ow = Math.min(ax + aw, bx + bw) - Math.max(ax, bx);
  var oh = Math.min(ay + ah, by + bh) - Math.max(ay, by);
  return ow > 0 && oh > 0 ? ow * oh : 0;
}
/* 给节点名找位置：以节点圆心为原点，按「上 / 下 / 右 / 左」四方向 × 三档距离 × 三种错位，
   共 36 个候选；取重叠面积最小的那个（同分则取更靠前、也就是更贴近节点的候选）。
   入参都在屏幕坐标里，blocked 是已被占用的矩形（节点圆、HUD、已摆放的标签）。
   之所以改到屏幕坐标：旧的写法在世界坐标里画标签、字号随缩放变化，中心区节点间距只有
   42 世界单位，中文名却宽 40–60px，必然压字；固定字号 + 避让才能既读得清又不叠。 */
function AtlasLabelCandidates(it) {
  var bh = (it.fs || 10) + 4, bw = Math.max(10, it.w), rad = it.r || 6, gap = 5;
  var dirs = [[0, -1], [0, 1], [1, 0], [-1, 0]];
  var shifts = [0, -1, 1];
  var out = [];
  for (var di = 0; di < dirs.length; di++) {
    for (var step = 0; step < 5; step++) {
      for (var si = 0; si < shifts.length; si++) {
        var far = rad + gap + step * 16;
        var cx = it.x + dirs[di][0] * far, cy = it.y + dirs[di][1] * far;
        var ox, oy;
        if (dirs[di][0] === 0) {
          // 上 / 下：标签水平居中，shift 让它在左右错一档
          ox = -bw / 2 + shifts[si] * 11;
          oy = dirs[di][1] > 0 ? 0 : -bh;
        } else {
          // 右 / 左：标签竖直居中，shift 让它在上下错一档
          ox = dirs[di][0] > 0 ? 0 : -bw;
          oy = -bh / 2 + shifts[si] * (bh + 1);
        }
        out.push([cx + ox, cy + oy]);
      }
    }
  }
  return out;
}
/* 在 36 个候选里挑一个：先夹进画布，再按「与其他矩形的重叠面积」打分 */
function AtlasPickLabelSpot(it, taken, cw, ch) {
  var bh = (it.fs || 10) + 4, bw = Math.max(10, it.w);
  var cands = AtlasLabelCandidates(it);
  var best = null, bestCost = Infinity;
  for (var c = 0; c < cands.length; c++) {
    var box = { x: Math.round(cands[c][0]), y: Math.round(cands[c][1]), w: Math.ceil(bw), h: bh, p: 2 };
    if (box.x < 3) box.x = 3;
    if (box.x + box.w > cw - 3) box.x = Math.max(3, cw - 3 - box.w);
    if (box.y < 3) box.y = 3;
    if (box.y + box.h > ch - 3) box.y = Math.max(3, ch - 3 - box.h);
    // 候选序号只作极小的偏好项：只要有完全不重叠的候选，就一定压过任何带重叠的
    var cost = c * 0.02;
    for (var k = 0; k < taken.length; k++) {
      cost += AtlasRectOverlap(box, taken[k]);
      // 已经比当前最优差了就停：拖拽时每帧都要排一次，早退能省掉大半计算
      if (cost >= bestCost) break;
    }
    if (cost < bestCost) {
      bestCost = cost;
      best = box;
    }
    if (bestCost <= c * 0.02) break;
  }
  return best;
}
function AtlasPlaceLabels(items, blocked, cw, ch) {
  var out = [];
  var taken = blocked.slice();
  var i, k;
  for (i = 0; i < items.length; i++) {
    var it = items[i];
    if (!it || !it.t) continue;
    var bw = Math.max(10, it.w);
    if (it.x + bw < -16 || it.x - bw > cw + 16 || it.y < -32 || it.y > ch + 32) continue;
    var box = AtlasPickLabelSpot(it, taken, cw, ch);
    if (!box) continue;
    box.t = it.t;
    box.fs = it.fs || 10;
    box.strong = !!it.strong;
    box.ax = it.x;
    box.ay = it.y;
    box.rad = it.r || 6;
    out.push(box);
    taken.push(box);
  }
  // 二次修复：先放的标签可能占了后来者唯一空位，把仍有重叠的摘出来重放一遍。
  // 三轮足够收敛（每轮至少减少一个重叠，否则提前退出）。
  for (var pass = 0; pass < 3; pass++) {
    var moved = 0;
    for (i = 0; i < out.length; i++) {
      var cur = out[i], hit = false;
      for (k = 0; k < taken.length; k++) {
        if (taken[k] === cur) continue;
        if (AtlasRectOverlap(cur, taken[k]) > 0) {
          hit = true;
          break;
        }
      }
      if (!hit) continue;
      var idx = taken.indexOf(cur);
      if (idx >= 0) taken.splice(idx, 1);
      var spot = AtlasPickLabelSpot({ x: cur.ax, y: cur.ay, r: cur.rad, w: cur.w, fs: cur.fs }, taken, cw, ch);
      if (!spot) {
        taken.push(cur);
        continue;
      }
      spot.t = cur.t;
      spot.fs = cur.fs;
      spot.strong = cur.strong;
      spot.ax = cur.ax;
      spot.ay = cur.ay;
      spot.rad = cur.rad;
      out[i] = spot;
      taken.push(spot);
      moved++;
    }
    if (!moved) break;
  }
  return out;
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
    }
    /* ---- 节点名与 HUD：改到屏幕坐标里排版（EMB-113） ----
       旧写法把名字一律画在节点正上方、字号随缩放变化：中心区节点间距只有 42 世界单位，
       中文名宽 40–60px，于是互相压字；左上角那行「可用 / 已获得 / 已分配」也压在第一批
       名字上。现在固定字号放进屏幕坐标，交给 AtlasPlaceLabels 做避让，HUD 自带底片。 */
    _v436.setTransform(1, 0, 0, 1, 0, 0);
    var labelItems = [], blocked = [];
    for (var _vN = 0; _vN < ATLAS_ALL.length; _vN++) {
      var nd = ATLAS_ALL[_vN];
      var ndR = nd.tier === "core" ? 16 : nd.tier === "keystone" ? 13 : nd.tier === "sig" ? 9 : 6;
      var ndX = nd.x * _v437 + _v438, ndY = nd.y * _v437 + _v439, ndS = ndR * _v437;
      if (ndX + ndS < -24 || ndX - ndS > _v434 + 24 || ndY + ndS < -24 || ndY - ndS > _v435 + 24) continue;
      blocked.push({ x: ndX - ndS - 1, y: ndY - ndS - 1, w: ndS * 2 + 2, h: ndS * 2 + 2, p: 1 });
      var ndOn = !!AtlasCountAlloc(nd.k);
      if (!(ndOn || nd.tier === "keystone" || _v437 > 0.85)) continue;
      var ndFs = nd.tier === "keystone" ? 11 : 10;
      _v436.font = (nd.tier === "keystone" ? "700 " : "") + ndFs + "px monospace";
      labelItems.push({ t: nd.n, x: ndX, y: ndY, r: ndS, w: _v436.measureText(nd.n).width, fs: ndFs, strong: ndOn });
    }
    var hudTxt = "可用 " + AtlasAvailable() + " · 已获得 " + AtlasEarned() + "/" + Br + " · 已分配 " + AtlasUsed() + "/" + ATLAS_SPEND;
    _v436.font = "11px monospace";
    var hudBox = { x: 6, y: 5, w: Math.ceil(_v436.measureText(hudTxt).width) + 14, h: 19, p: 2 };
    blocked.push(hudBox);
    var placed = AtlasPlaceLabels(labelItems, blocked, _v434, _v435);
    _v436.textAlign = "left";
    _v436.textBaseline = "top";
    _v436.lineJoin = "round";
    for (var _vP = 0; _vP < placed.length; _vP++) {
      var lb = placed[_vP];
      _v436.font = (lb.strong ? "700 " : "") + lb.fs + "px monospace";
      // 描边当底衬：压在连线或节点边缘上也读得清（比给每行加色块轻）
      _v436.lineWidth = 3;
      _v436.strokeStyle = "rgba(9,8,12,.92)";
      _v436.strokeText(lb.t, lb.x, lb.y);
      _v436.fillStyle = lb.strong ? "#f0e8d0" : "#8e98b0";
      _v436.fillText(lb.t, lb.x, lb.y);
    }
    // HUD 最后画：它已经进了 blocked，不会有标签落在它身上
    _v436.fillStyle = "rgba(11,10,16,.86)";
    _v436.fillRect(hudBox.x, hudBox.y, hudBox.w, hudBox.h);
    _v436.font = "11px monospace";
    _v436.fillStyle = "#8e98b0";
    _v436.fillText(hudTxt, hudBox.x + 7, hudBox.y + 4);
    ATLAS_LAST_LABELS = placed;
    ATLAS_LAST_HUD = hudBox;
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
              if (_v472 < _v469 && _v472 < 36) {
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
          $(AtlasCountAlloc(_v465) ? "craft" : "unique");
          Gs();
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
r9 = AtlasCanAlloc;
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
    return Br;
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
    return _a(_v483, _v484);
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
    critInc: 40
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
    fireInc: 40
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
    life: 40
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
    eleInc: 40
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
    critMulti: 40
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
    coldInc: 40
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
    es: 40
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
    critInc: 40
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
    lightInc: 40
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
    resL: 40
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
    castSpd: 40
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
    critMulti: 40
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
    physInc: 40
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
    regen: 40
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
    armour: 40
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
    minionSpd: 40
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
    minionInc: 40
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
    life: 40
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
    lifeInc: 40
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
    esInc: 40
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
    lifeInc: 40
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
    resAll: 40
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
    rarity: 40
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
    rarity: 40
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
    quant: 40
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
    life: 40
  }
}];
var ADV_NODES = [], ADV_BY_K = {}, ADV_STARS = [], ADV_STAR_BY_K = {}, ADV_BUILT = !1, ADV_EFFECTS = [], ADV_CLUSTERS = [];
var ADV_EDGES = [], ADV_ADJ = {}, ADV_METRICS = {}, ADV_RING_COUNTS = [], ADV_RINGS = 9, ADV_SEED = 20261028;
var ADV_MINARC = 58, ADV_TARGET_RING_NODES = 223;
function AdvRegion(_v486) {
  for (var _v487 = 0; _v487 < ADV_REGIONS.length; _v487++) if (ADV_REGIONS[_v487].k === _v486) return ADV_REGIONS[_v487];
  return null;
}
function AdvKnownStats() {
  try {
    return JS || ({});
  } catch (_v488) {
    return {};
  }
}
function AdvMergeEffects() {
  var _v489 = typeof window !== "undefined" && window.RIFT_STAR_EFFECTS || [];
  var _v490 = [], _v491 = {};
  _v489.concat(ADV_STAR_EFFECT_DEFAULTS).forEach(function (_v492) {
    if (!_v492 || !_v492.id || _v492.enabled === false || !_v492.region || _v491[_v492.id]) return;
    var __starTags = (_v492.require && _v492.require.tags) || [];
    if (__starTags.length < 2) return;
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
    case "cluster":
      return 13;
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
function __advRender() {
  var pb = document.getElementById("pbody");
  var st = pb ? pb.scrollTop : 0;
  if (typeof Gs === "function") Gs();
  if (pb) { pb.scrollTop = st; requestAnimationFrame(function () { try { pb.scrollTop = st; } catch (e) {} }); }
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
  ADV_CLUSTERS = [];
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
  // 起点放在中心小环上，避免 9 个起点叠在同一点（否则看不到起点到天赋的连线）
  ADV_NODES.forEach(function (nd) {
    if (nd.kind !== "start") return;
    nd.x = Math.cos(nd.angle) * 90;
    nd.y = Math.sin(nd.angle) * 90;
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
      var __tagStat = { fire: "fireInc", cold: "coldInc", light: "lightInc", phys: "physInc", minion: "minionInc", defence: "lifeInc", currency: "rarity", crit: "critInc", life: "life", res: "resAll", attack: "atkSpd", spell: "castSpd" };
      var _v540 = _v537 ? 30 : 12 + _v513 + _v514 % 5;
      var _v541 = [[_v536.main, _v540], [_v536.sub, _v537 ? 18 : 8]];
      for (var __ti = 0; __ti < _v538.length; __ti++) {
        var __ts = __tagStat[_v538[__ti]];
        if (!__ts || __ts === _v536.main || __ts === _v536.sub) continue;
        _v541.push([__ts, _v537 ? 12 : 5]);
      }
      if (_v537) _v541.push([_v536.main === "lifeInc" ? "armour" : "lifeInc", 10]);
      // 第二/第三词条已在上方统一生成
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
  // 抱团显著节点：每个区域挑一个「显著节点」改造成抱团节点（大圆），四角均匀生成 4 个簇节点
  // 簇节点必须先点；显著节点要等 4 个簇节点全亮后才能点
  var __clubCfg = {
    fire: { inc: "fireInc", sats: ["fireInc", "eleInc", "critInc", "aoeInc"] },
    cold: { inc: "coldInc", sats: ["coldInc", "eleInc", "critInc", "aoeInc"] },
    light: { inc: "lightInc", sats: ["lightInc", "eleInc", "critInc", "aoeInc"] },
    phys: { inc: "physInc", sats: ["physInc", "armour", "critInc", "aoeInc"] },
    minion: { inc: "minionInc", sats: ["minionInc", "minionSpd", "minionCap", "minionMove"] },
    defence: { inc: "lifeInc", sats: ["lifeInc", "armour", "resAll", "block"] },
    currency: { inc: "rarity", sats: ["rarity", "quant", "critInc", "moveInc"] }
  };
  ADV_REGIONS.forEach(function (reg, ri) {
    var targetAng = ri * Math.PI * 2 / 7 + Math.PI / 7;
    var notable = null, bestScore = 1e9;
    ADV_NODES.forEach(function (nd) {
      if (nd.region !== reg.k || nd.kind !== "notable") return;
      var da = Math.abs(nd.angle - targetAng);
      if (da > Math.PI) da = Math.PI * 2 - da;
      var score = Math.abs(nd.ring - 3.5) * 2 + da;
      if (score < bestScore) { bestScore = score; notable = nd; }
    });
    if (!notable) return;
    var cfg4 = __clubCfg[reg.k] || __clubCfg.fire;
    var ck = notable.k;
    notable.kind = "cluster";
    notable.tier = "notable";
    notable.clusterCenter = ck;
    notable.n = reg.n + "·抱团显著节点";
    notable.d = "抱团显著节点：周围 4 个簇节点，每点亮 1 个额外 " + AdvStatLabel(cfg4.inc, 6) + " / " + AdvStatLabel("dmgMore", 1) + "；4 个全亮再 " + AdvStatLabel("dmgMore", 2) + "（需先点亮 4 个簇节点）";
    notable.cost = 2;
    notable.tags = [reg.tag, "cluster"];
    notable.clubInc = cfg4.inc;
    notable.s = [[cfg4.inc, 20], ["dmgMore", 4]];
    var members = [];
    for (var si = 0; si < 4; si++) {
      var sa = notable.angle + si * Math.PI / 2 + Math.PI / 4;
      var sk = ck + "_" + si;
      var satStat = cfg4.sats[si] || cfg4.inc;
      _v507({
        k: sk,
        n: reg.n + "·簇节点" + (si + 1),
        d: "抱团簇节点：点亮后强化抱团显著节点（" + AdvStatLabel(cfg4.inc, 6) + " / " + AdvStatLabel("dmgMore", 1) + "）",
        region: reg.k,
        kind: "small",
        tier: "small",
        ring: notable.ring,
        angle: sa,
        x: notable.x + Math.cos(sa) * 27,
        y: notable.y + Math.sin(sa) * 27,
        cost: 1,
        tags: [reg.tag, "cluster"],
        s: [[satStat, 7], [cfg4.inc, 3]],
        col: reg.col,
        clubInc: cfg4.inc,
        cluster: ck
      });
      members.push(sk);
    }
    ADV_CLUSTERS.push({ center: ck, members: members });
  });
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
  // 抱团显著节点连线：显著节点 ↔ 4 个簇节点；簇节点另外接一条最近的蛛网线，保证可以先点簇节点
  ADV_CLUSTERS.forEach(function (cl) {
    var c = ADV_BY_K[cl.center];
    if (!c) return;
    cl.members.forEach(function (mk) {
      var m = ADV_BY_K[mk];
      if (!m) return;
      _v578(c, m, "cluster");
      var best = null, bd = 1e9;
      ADV_NODES.forEach(function (nd) {
        if (!nd || nd === m || nd === c || nd.kind === "cluster" || nd.cluster || nd.ring <= 0 || nd.kind === "talent") return;
        if (Math.abs(nd.ring - m.ring) > 1) return;
        var d = Math.hypot(nd.x - m.x, nd.y - m.y);
        if (d < bd) { bd = d; best = nd; }
      });
      if (best) _v578(m, best, "cross");
    });
  });
  ADV_REGIONS.forEach(function (_v612) {
    var _v613 = {};
    ADV_NODES.forEach(function (_v614) {
      if (_v614.region === _v612.k && _v614.ring > 0 && _v614.kind !== "talent" && _v614.kind !== "cluster" && !_v614.cluster) (_v613[_v614.ring] = _v613[_v614.ring] || []).push(_v614);
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
      return _v679.kind !== "root" && !(_v679.kind === "start" && _v679.cls !== (u && u.advClassStart || u && u.cls));
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
  // 每个属性的最内圈入口（ring1）直连所有职业起点：避免只能从通货/火焰方向绕点
  (function () {
    var entries = [];
    ADV_REGIONS.forEach(function (reg) {
      var best = null;
      ADV_NODES.forEach(function (nd) {
        if (nd.region !== reg.k || nd.kind === "start" || nd.kind === "jewel") return;
        if (!best || nd.ring < best.ring) best = nd;
      });
      if (best) entries.push(best);
    });
    var starts = ADV_NODES.filter(function (nd) { return nd.kind === "start"; });
    starts.forEach(function (st) {
      entries.forEach(function (en) {
        if (st.k === en.k) return;
        var a = st.k < en.k ? st.k : en.k, b = st.k < en.k ? en.k : st.k;
        for (var i = 0; i < ADV_EDGES.length; i++) if (ADV_EDGES[i].a === a && ADV_EDGES[i].b === b) return;
        ADV_EDGES.push({ a: a, b: b, kind: "spoke" });
      });
    });
  })();
  _v639();
  // 修复孤立节点：确保每个节点至少有一条连线（连最近的内圈/同圈节点）
  (function () {
    ADV_NODES.forEach(function (nd) {
      if (nd.kind === "root" || nd.kind === "start" || nd.kind === "jewel") return;
      if ((ADV_ADJ[nd.k] || []).length > 0) return;
      var best = null, bd = 1e9;
      ADV_NODES.forEach(function (other) {
        if (other === nd || other.kind === "root" || other.kind === "start") return;
        var d = (other.x - nd.x) ** 2 + (other.y - nd.y) ** 2;
        if (d < bd) { bd = d; best = other; }
      });
      if (!best) return;
      var a = nd.k < best.k ? nd.k : best.k, b = nd.k < best.k ? best.k : nd.k;
      ADV_EDGES.push({ a: a, b: b, kind: "repair" });
    });
  })();
  _v639();
  var _v718 = ADV_NODES.filter(function (_v719) {
    return _v719.kind !== "root" && _v719.kind !== "start";
  });
  _v718 = _v718.concat(ADV_NODES.filter(function (_v720) {
    return _v720.kind === "start" && _v720.cls === (u && (u.advClassStart || u.cls) || "warrior");
  }));
  var _v721 = 0, _v722 = 0, _v723 = 0, _v724 = 0;
  // 起点到 7 个区域的“直达辐条”不计入平均/最大度，避免破坏蛛网密度指标
  var __deg = {};
  ADV_EDGES.forEach(function (e) {
    if (e.kind === "spoke" || e.kind === "repair") return;
    __deg[e.a] = (__deg[e.a] || 0) + 1;
    __deg[e.b] = (__deg[e.b] || 0) + 1;
  });
  _v718.forEach(function (_v725) {
    var _v726 = __deg[_v725.k] || 0;
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
  var _v732 = u && u.advClassStart || u && u.cls || "warrior";
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
  var _v737 = Math.max(1, Math.floor(+(u && u.level) || 1));
  var _v738 = Object.keys(u && u.done || ({})).length;
  var _v739 = Math.max(0, Math.floor(+(u && u.simRuns || 0)));
  var _v740 = Math.max(0, Math.floor(+(u && u.advBonus || 0)));
  return Math.floor(_v737 / _v736.perLevel) + Math.floor(_v738 / _v736.atlasEvery) + Math.floor(_v739 / _v736.simEvery) + _v740;
}
function AdvNodeCost(_v741) {
  return _v741 ? _v741.cost || 0 : 0;
}
function AdvUsed() {
  AdvBuild();
  var _v742 = 0;
  (u && u.advTree || []).forEach(function (_v743) {
    var _v744 = ADV_BY_K[_v743];
    if (_v744) _v742 += AdvNodeCost(_v744);
  });
  (u && u.starTree || []).forEach(function (_v745) {
    var _v746 = ADV_STAR_BY_K[_v745];
    if (_v746) _v742 += _v746.cost || AdvCfg().starCost;
  });
  return _v742;
}
function AdvLeft() {
  return Math.max(0, AdvEarned() - AdvUsed());
}
function AdvAllocated(_v747) {
  return !!u && Array.isArray(u.advTree) && u.advTree.indexOf(_v747) >= 0;
}
function AdvStarAllocated(_v748) {
  return !!u && Array.isArray(u.starTree) && u.starTree.indexOf(_v748) >= 0;
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
function AdvClusterLocked(kk) {
  try {
    var nd = ADV_BY_K[kk];
    if (!nd || nd.kind !== "cluster") return false;
    if (AdvAllocated(kk)) return false;
    var cl = null;
    for (var i = 0; i < ADV_CLUSTERS.length; i++) if (ADV_CLUSTERS[i].center === kk) { cl = ADV_CLUSTERS[i]; break; }
    if (!cl) return false;
    var have = 0;
    for (var j = 0; j < cl.members.length; j++) if (AdvAllocated(cl.members[j])) have++;
    return have < cl.members.length;
  } catch (e) { return false; }
}
function AdvPathTo(k) {
  AdvBuild();
  if (!k || AdvAllocated(k)) return null;
  var target = ADV_BY_K[k];
  if (!target || !AdvVisible(k)) return null;
  var q = [], prev = {}, seen = {};
  (u.advTree || []).forEach(function (a) {
    if (ADV_BY_K[a] && AdvVisible(a)) { seen[a] = 1; q.push(a); prev[a] = null; }
  });
  var found = false;
  while (q.length) {
    var cur = q.shift();
    var nb = AdvNeighbors(cur) || [];
    for (var i = 0; i < nb.length; i++) {
      var nx = nb[i];
      if (seen[nx] || !ADV_BY_K[nx] || !AdvVisible(nx)) continue;
      // 未解锁的抱团显著节点不能作为寻路中转（否则快速加点会被它挡住）
      if (nx !== k && AdvClusterLocked(nx)) continue;
      seen[nx] = 1; prev[nx] = cur; q.push(nx);
      if (nx === k) { found = true; q.length = 0; break; }
    }
    if (found) break;
  }
  if (!prev[k] && k !== k) return null;
  if (!found && !seen[k]) return null;
  var path = [], c = k;
  while (c && prev[c] != null) { path.unshift(c); c = prev[c]; }
  return path.length ? path : null;
}
function AdvPathCost(path) {
  var n = 0;
  (path || []).forEach(function (k) { var nd = ADV_BY_K[k]; if (nd) n += nd.cost || 1; });
  return n;
}
function AdvReason(_v760) {
  AdvBuild();
  var _v761 = ADV_BY_K[_v760];
  if (!_v761) return "未知高级天赋节点";
  if (!u) return "没有可用角色";
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
  if (_v761.kind === "talent" && AdvAllocNeighbors(_v760).length < 2) return "区域天赋节点需要 2 个已点亮邻接节点";
  // 抱团显著节点：周围 4 个簇节点全部点亮后才能点
  if (_v761.kind === "cluster") {
    try {
      var __cl = null;
      for (var __ci = 0; __ci < ADV_CLUSTERS.length; __ci++) if (ADV_CLUSTERS[__ci].center === _v760) { __cl = ADV_CLUSTERS[__ci]; break; }
      if (__cl) {
        var __have = 0;
        for (var __mi = 0; __mi < __cl.members.length; __mi++) if (AdvAllocated(__cl.members[__mi])) __have++;
        if (__have < __cl.members.length) return "先点亮周围 " + __cl.members.length + " 个簇节点（" + __have + "/" + __cl.members.length + "）";
      }
    } catch (eCl) {}
  }
  return null;
}
function AdvCanAlloc(_v765) {
  return AdvReason(_v765) === null;
}
function AdvAlloc(_v766) {
  var _v767 = AdvReason(_v766);
  if (_v767) return _v767;
  (u.advTree = u.advTree || []).push(_v766);
  if (n) n.advSel = _v766;
  return null;
}
function AdvRespec(_v768) {
  if (!u) return "没有可用角色";
  if (!AdvAllocated(_v768)) return "该节点没有点亮";
  var _v769 = ADV_BY_K[_v768];
  if (_v769 && (_v769.kind === "start" || _v769.kind === "root")) return "职业起点/核心不可退还";
  var _v770 = u.advTree.slice();
  u.advTree = u.advTree.filter(function (_v771) {
    return _v771 !== _v768;
  });
  var _v772 = AdvComponent();
  var _v773 = u.advTree.some(function (_v774) {
    var _v775 = AdvVisible(_v774);
    if (!_v775) return false;
    return !_v772[_v774];
  });
  u.advTree = _v770;
  if (_v773) return "需先退还更远的节点（会断开蛛网连线）";
  u.advTree = u.advTree.filter(function (_v776) {
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
  if (!u) return "没有可用角色";
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
  (u.starTree = u.starTree || []).push(_v781);
  return null;
}
function AdvStarRespec(_v783) {
  if (!u || !AdvStarAllocated(_v783)) return "该星图节点没有点亮";
  u.starTree = u.starTree.filter(function (_v784) {
    return _v784 !== _v783;
  });
  return null;
}
function AdvJewelSlots() {
  AdvBuild();
  return (u && u.advTree || []).filter(function (_v785) {
    var _v786 = ADV_BY_K[_v785];
    return _v786 && _v786.tier === "jewel";
  }).length;
}
function AdvBaseNodesAllocated() {
  AdvBuild();
  return (u && u.advTree || []).map(function (_v787) {
    return ADV_BY_K[_v787];
  }).filter(function (_v788) {
    return _v788 && _v788.tier !== "start" && _v788.tier !== "root" && _v788.tier !== "jewel";
  });
}
function AdvEffectMatches(_v789) {
  var _v790 = _v789.require || ({}), _v791 = _v790.tags || [];
  var _v792 = AdvBaseNodesAllocated(), _v793 = [], _used = {};
  var _needCount = _v790.min || _v791.length;
  // 每个需求标签必须由不同的基底节点满足，避免一个多标签节点同时触发整组联动
  for (var _ti = 0; _ti < _v791.length && _v793.length < _needCount; _ti++) {
    var _tag = _v791[_ti], _found = null;
    for (var _ni = 0; _ni < _v792.length; _ni++) {
      var _nd = _v792[_ni], _nk = _nd.k || _ni;
      if (_used[_nk]) continue;
      if ((_nd.tags || []).indexOf(_tag) >= 0) { _found = _nd; _used[_nk] = 1; break; }
    }
    if (!_found) return null;
    _v793.push(_found);
  }
  if (_v790.nodes && !_v790.nodes.every(function (_v799) {
    return AdvAllocated(_v799);
  })) return null;
  if (_v793.length < _needCount) return null;
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
  (u && u.starTree || []).forEach(function (_v805) {
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
  if (!u || !u.advJewels) return _v813;
  (u.advTree || []).forEach(function (_v815) {
    var _v816 = ADV_BY_K[_v815];
    if (!_v816 || _v816.tier !== "jewel") return;
    var _v817 = u.advJewels[_v815];
    var _v818 = typeof JewelDef === "function" ? JewelDef(_v817) : null;
    if (!_v818 || !_v818.stats) return;
    _v818.stats.forEach(function (_v819) {
      if (_v814[_v819[0]]) _v813[_v819[0]] = (_v813[_v819[0]] || 0) + _v819[1];
    });
  });
  return _v813;
}
function AdvClusterStatus(_v0nd) {
  try {
    if (!_v0nd || !u) return "";
    var key = _v0nd.kind === "cluster" ? _v0nd.k : (_v0nd.cluster || null);
    if (!key) return "";
    var n = 0;
    (u.advTree || []).forEach(function (k) {
      var x = ADV_BY_K[k];
      if (x && x.cluster === key) n++;
    });
    if (_v0nd.kind === "cluster") return "抱团显著节点 " + n + "/4 · 每点亮 1 个簇节点：区域伤害 +6% / 更多伤害 +1%，全亮再 +2% 更多伤害";
    return "抱团簇节点 " + n + "/4";
  } catch (e) { return ""; }
}
function AdvStatTotals() {
  AdvBuild();
  var _v820 = {}, _v821 = AdvKnownStats();
  if (!u) return _v820;
  (u.advTree || []).forEach(function (_v822) {
    var _v823 = ADV_BY_K[_v822];
    if (!_v823) return;
    (_v823.s || []).forEach(function (_v824) {
      if (_v821[_v824[0]]) _v820[_v824[0]] = (_v820[_v824[0]] || 0) + _v824[1];
    });
  });
  // 抱团显著节点：每点亮 1 个簇节点，显著节点额外 +6 区域伤害 / +1% 更多伤害；4 个全亮再 +2% 更多伤害
  try {
    var __clusters = {};
    (u.advTree || []).forEach(function (kk) {
      var nd = ADV_BY_K[kk];
      if (!nd) return;
      if (nd.kind === "cluster") { (__clusters[nd.k] = __clusters[nd.k] || { c: 0, n: 0 }).c = 1; }
      else if (nd.cluster) { (__clusters[nd.cluster] = __clusters[nd.cluster] || { c: 0, n: 0 }).n++; }
    });
    Object.keys(__clusters).forEach(function (ck) {
      var cc = __clusters[ck], cd = ADV_BY_K[ck];
      if (!cd || !cc.c || !cc.n) return;
      var inc = cd.clubInc;
      if (!inc) {
        for (var ri = 0; ri < ADV_REGIONS.length; ri++) if (ADV_REGIONS[ri].k === cd.region) { inc = ADV_REGIONS[ri].main; break; }
      }
      var addInc = 6 * cc.n;
      var addMore = 1 * cc.n + (cc.n >= 4 ? 2 : 0);
      if (inc && _v821[inc]) _v820[inc] = (_v820[inc] || 0) + addInc;
      if (_v821.dmgMore) _v820.dmgMore = (_v820.dmgMore || 0) + addMore;
    });
  } catch (eCl) {}
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
  var _v841 = n && n.advTab || "tree";
  var _v842 = function (_v843, _v844) {
    return '<button class="btn small' + (_v841 === _v843 ? " primary" : "") + '" data-advtab="' + _v843 + '">' + _v844 + "</button>";
  };
  return '<div class="shoptabs" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">' + _v842("tree", "天赋树") + _v842("base", "高级基底") + _v842("star", "星图") + '<span class="dim" style="align-self:center;font-size:11.5px">蛛网天赋树：滚轮以鼠标为锚缩放 · 拖拽平移 · 悬停高亮邻接 · 从职业起点沿连线点亮</span></div>';
}
function AdvTotalsHTML() {
  try {
    var t = AdvStatTotals() || {};
    var rows = Object.keys(t).filter(function (k) { return Math.abs(+t[k] || 0) >= 0.5; }).sort(function (a, b) { return Math.abs(t[b]) - Math.abs(t[a]); }).map(function (k) {
      return '<div style="display:flex;justify-content:space-between;gap:8px;padding:2px 0;border-bottom:1px solid #1a1620"><span class="dim" style="font-size:11.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + AdvStatLabel(k, t[k]).replace(/^[+\-]?[\d.]+%?\s*/, "") + '</span><b style="color:#9dffb4;font-size:12px">' + AdvStatLabel(k, t[k]) + '</b></div>';
    }).join("");
    return '<div class="bsec"><h4>总加成 <small>高级天赋 + 珠宝</small></h4>' + (rows || '<div class="dim" style="padding:4px 0;font-size:11.5px">还没有加成 · 点亮节点后这里实时汇总</div>') + '</div>';
  } catch (e) { return ""; }
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
  AdvBuild();
  var tagName = { fire: "火焰", cold: "冰霜", light: "闪电", phys: "物理", minion: "召唤", defence: "防御", currency: "通货", crit: "暴击", life: "生命", spell: "法术", attack: "攻击", speed: "速度" };
  var _activeIds = {};
  AdvActiveEffects().forEach(function (a) { if (a && a.effect && a.effect.id) _activeIds[a.effect.id] = 1; });
  var effects = (ADV_EFFECTS || []).slice().sort(function (a, b) {
    var aa = _activeIds[a.id] ? 0 : AdvEffectMatches(a) ? 1 : 2;
    var bb = _activeIds[b.id] ? 0 : AdvEffectMatches(b) ? 1 : 2;
    return aa - bb;
  });
  var rows = effects.map(function (eff) {
    var active = !!_activeIds[eff.id], ready = !active && !!AdvEffectMatches(eff);
    var req = (eff.require && eff.require.tags || []).map(function (t) { return tagName[t] || t; }).join(" + ");
    var need = (eff.require && eff.require.min) || (eff.require && eff.require.tags || []).length;
    var region = AdvRegion(eff.region) || { n: eff.region, col: "#e8c870" };
    var status = active ? "已激活" : ready ? "可点亮 · 去星图点亮对应节点" : "未满足";
    return '<div class="baff" style="display:block"><span class="btxt"><b style="color:' + (active ? "#9dffb4" : ready ? "#e8c870" : region.col) + '">' + eff.n + '</b> <small class="dim">' + region.n + " · [" + req + "] ×" + need + " · " + status + '</small><br><span style="color:#8f9cff">' + AdvEffectText(eff) + '</span></span></div>';
  }).join("");
  return '<div class="bsec"><h4>星图联动词条 <small>' + effects.length + ' 条 · 满足基底标签后激活</small></h4>' + (rows || '<p class="dim">暂无星图联动词条</p>') + "</div>";
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
  var _v867 = n && n.advSel, _v868 = _v867 ? AdvNode(_v867) : null;
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
    return AdvActiveListHTML() + AdvSelectedHTML() + AdvJewelPanelHTMLSafe();
  })();
  return '<div class="at">' + _v877 + '<div style="display:grid;grid-template-columns:minmax(0,1fr) 250px;gap:8px;margin-top:10px;align-items:start"><section class="card"><div class="shoptabs" style="display:flex;gap:6px;margin-bottom:6px"><button class="btn small' + (_v872 === "base" ? " primary" : "") + '" data-advtab="base">高级基底</button><button class="btn small' + (_v872 === "star" ? " primary" : "") + '" data-advtab="star">星图</button></div><div id="advWrap" style="position:relative;min-width:0"><canvas id="advcv" style="width:100%;height:70vh;min-height:460px;display:block;background:#0b0a10;border:1px solid #2e2834;cursor:grab;touch-action:none"></canvas><div id="advTip" style="display:none;position:absolute;z-index:30;max-width:290px;padding:6px 8px;background:rgba(12,10,16,.96);border:1px solid #4a4058;color:#d8d0c0;font-size:11.5px;line-height:1.5;pointer-events:none;border-radius:3px"></div><div class="dim" style="margin-top:4px">滚轮缩放 (0.3x~3x，以鼠标为锚) · 拖拽平移 · 左键点亮/选中 · 右键查看 · 悬停高亮自身+邻接节点+边</div></div></section><aside>' + AdvTotalsHTML() + AdvRegionBars() + '<div style="margin-top:8px">' + _v878 + "</div></aside></div></div>";
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
    var _v901 = (n && n.advTab) === "star" ? "star" : "base";
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
      var _v922 = n && n.advHover || null, _v923 = n && n.advSel || null;
      var _v924 = _v922 ? ADV_ADJ[_v922] || [] : [], _v925 = _v923 ? ADV_ADJ[_v923] || [] : [];
      ADV_EDGES.forEach(function (_v926) {
        var _v927 = ADV_BY_K[_v926.a], _v928 = ADV_BY_K[_v926.b];
        if (!_v927 || !_v928 || !AdvVisible(_v927.k) || !AdvVisible(_v928.k)) return;
        var _v929 = false;
        var __ps = n.advPath || [], __pa = __ps.indexOf(_v926.a) >= 0, __pb = __ps.indexOf(_v926.b) >= 0;
        var __onPath = __pa && __pb || __pa && AdvAllocated(_v926.b) || __pb && AdvAllocated(_v926.a);
        var __bothLit = AdvAllocated(_v926.a) && AdvAllocated(_v926.b);
        _v905.strokeStyle = __onPath ? "#7fd8a0" : __bothLit ? "#e8c060" : _v926.kind === "ring" ? "#2b2638" : _v926.kind === "cluster" ? "#332a44" : "#241f2c";
        _v905.lineWidth = __onPath ? 5.5 : __bothLit ? 4.5 : _v926.kind === "ring" ? 2.8 : _v926.kind === "cluster" ? 2.4 : 2.0;
        _v905.beginPath();
        _v905.moveTo(_v927.x, _v927.y);
        _v905.lineTo(_v928.x, _v928.y);
        _v905.stroke();
      });
      ADV_NODES.forEach(function (_v930) {
        if (!AdvVisible(_v930.k)) return;
        var _v931 = AdvAllocated(_v930.k), _v932 = !_v931 && AdvCanAlloc(_v930.k);
        var _v933 = AdvNodeRadius(_v930);
        var _v934 = false;
        _v905.beginPath();
        if (_v930.kind === "jewel") _v905.rect(_v930.x - _v933, _v930.y - _v933, _v933 * 2, _v933 * 2); else if (_v930.kind === "talent" || _v930.kind === "notable") {
          _v905.moveTo(_v930.x, _v930.y - _v933);
          _v905.lineTo(_v930.x + _v933, _v930.y);
          _v905.lineTo(_v930.x, _v930.y + _v933);
          _v905.lineTo(_v930.x - _v933, _v930.y);
          _v905.closePath();
        } else _v905.arc(_v930.x, _v930.y, _v933, 0, 6.2832);
        var __inPath = (n.advPath || []).indexOf(_v930.k) >= 0;
        _v905.fillStyle = __inPath ? "#2a5a3a" : _v931 ? _v930.col : _v932 ? "#3a3048" : "#1c1824";
        _v905.fill();
        var _litNear = _v931 && (ADV_ADJ[_v930.k] || []).some(function (nk) { return AdvAllocated(nk); });
        _v905.strokeStyle = _v934 ? "#ffd27a" : _litNear ? "#fff0c0" : _v931 ? "#7a7a8a" : _v930.kind === "start" ? "#ffffff" : _v930.col;
        _v905.lineWidth = _v934 ? 3 : _litNear ? 2.2 : _v931 ? 1.2 : 1;
        _v905.stroke();
      });
      var _v936 = AdvStartKey();
      if (ADV_BY_K[_v936]) {
        _v905.strokeStyle = "#8f9cff";
        _v905.lineWidth = 4;
        _v905.beginPath();
        _v905.arc(0, 0, 22, 0, 6.2832);
        _v905.stroke();
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
    })).n + " · 环 " + _v939.ring : "中心") + "</small><br>" + (_v939.d || "") + "<br>" + _v949 + (_v950.length ? '<br><span style="color:#8f9cff">星图词条: ' + _v950.join(" / ") + "</span>" : "") + (_v939.kind === "talent" ? '<br><span style="color:#e8c870">点亮后解锁「' + (AdvRegion(_v939.region) || ({
      n: _v939.region
    })).n + "」星图</span>" : "") + (_v939.kind === "jewel" ? '<br><span style="color:#c8a8ff">珠宝栏位 · 点击后选择背包里的珠宝</span>' : "") + (AdvClusterStatus(_v939) ? '<br><span style="color:#5fe0c0">' + AdvClusterStatus(_v939) + '</span>' : "") + '<br><span style="color:#8e98b0">邻接 ' + AdvNeighbors(_v939.k).length + " 个 · 左键点亮/选中</span>";
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
    if (!n || !n.advTab || n.advTab === "tree") return;
    var _v953 = document.getElementById("advcv");
    if (!_v953) return;
    var _v954 = _v953.parentElement, _v955 = Math.max(320, Math.floor(_v954 && _v954.clientWidth || 900));
    var _v956 = Math.max(460, Math.min(820, Math.floor((window && window.innerHeight || 720) * 0.7)));
    _v953.style.width = _v955 + "px";
    _v953.style.height = _v956 + "px";
    _v953.width = _v955;
    _v953.height = _v956;
    var fitView = function (view, list, tab) {
      if (!list || !list.length) return;
      var mnx = 1e9, mny = 1e9, mxx = -1e9, mxy = -1e9;
      for (var fi = 0; fi < list.length; fi++) {
        var fn = list[fi];
        if (!fn || !isFinite(fn.x) || !isFinite(fn.y)) continue;
        mnx = Math.min(mnx, fn.x); mxx = Math.max(mxx, fn.x);
        mny = Math.min(mny, fn.y); mxy = Math.max(mxy, fn.y);
      }
      if (mnx > mxx || mny > mxy) return;
      var dx = Math.max(80, mxx - mnx), dy = Math.max(80, mxy - mny);
      view.s = Math.max(0.35, Math.min(1.5, Math.min((_v955 - 60) / dx, (_v956 - 60) / dy)));
      view.x = _v955 / 2 - (mnx + mxx) / 2 * view.s;
      view.y = _v956 / 2 - (mny + mxy) / 2 * view.s;
      view.init = !0;
      view.fitTab = tab;
    };
    if (!ADV_VIEW.init || ADV_VIEW.fitTab !== "base") fitView(ADV_VIEW, ADV_NODES, "base");
    if (!ADV_STAR_VIEW.init || ADV_STAR_VIEW.fitTab !== "star") fitView(ADV_STAR_VIEW, ADV_STARS, "star");
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
        n.advTab = _v960.getAttribute("data-advtab");
        __advRender();
        return;
      }
      var _v961 = _v959.target && _v959.target.closest ? _v959.target.closest("[data-advjewel]") : null;
      if (_v961) {
        _v959.preventDefault();
        _v959.stopPropagation();
        var _v962 = typeof AdvJewelAction === "function" ? AdvJewelAction(_v961.getAttribute("data-advjewel")) : "珠宝面板未就绪";
        if (_v962) P(_v962);
        __advRender();
        return;
      }
      var _v963 = _v959.target && _v959.target.closest ? _v959.target.closest("[data-advalloc]") : null;
      if (_v963) {
        _v959.preventDefault();
        _v959.stopPropagation();
        var _v964 = AdvAlloc(_v963.getAttribute("data-advalloc"));
        if (_v964) P(_v964);
        __advRender();
        return;
      }
      var _v965 = _v959.target && _v959.target.closest ? _v959.target.closest("[data-advrefund]") : null;
      if (_v965) {
        _v959.preventDefault();
        _v959.stopPropagation();
        var _v966 = AdvRespec(_v965.getAttribute("data-advrefund"));
        if (_v966) P(_v966);
        __advRender();
        return;
      }
    }, true);
    var _v967 = function (_v968) {
      var _v969 = document.getElementById("advcv");
      if (!_v969 || n.advTab !== "base" && n.advTab !== "star") return;
      var _v970 = _v969.getBoundingClientRect();
      if (_v968.clientX < _v970.left || _v968.clientX > _v970.right || _v968.clientY < _v970.top || _v968.clientY > _v970.bottom) return;
      var _v971 = n.advTab === "star", _v972 = AdvCanvasPoint(_v968, _v969), _v973 = AdvHit(_v972.x, _v972.y, _v971);
      _v968.preventDefault();
      _v968.stopPropagation();
      if (!_v973) {
        n.advSel = null;
        n.advJewelSel = null;
        AdvDraw();
        return;
      }
      if (_v971) {
        var _v974 = AdvStarAllocated(_v973.k) ? AdvStarRespec(_v973.k) : AdvStarAlloc(_v973.k);
        if (_v974) P(_v974);
        __advRender();
        return;
      }
      if (_v973.kind === "jewel" && AdvAllocated(_v973.k)) {
        n.advJewelSel = _v973.k;
        __advRender();
        return;
      }
      n.advSel = _v973.k;
      if (AdvAllocated(_v973.k)) {
        var rr = AdvRespec(_v973.k);
        if (rr) P(rr); else $("craft");
        n.advPath = null;
        __advRender();
        return;
      }
      var path = AdvPathTo(_v973.k);
      if (!path) { P(AdvReason(_v973.k) || "无法规划路径"); return; }
      var cost = AdvPathCost(path);
      if (cost > AdvLeft()) { P("天赋点不足 · 需要 " + cost + " 点, 可用 " + AdvLeft()); return; }
      u.advTree = u.advTree || [];
      path.forEach(function (k) { if (!AdvAllocated(k)) u.advTree.push(k); });
      n.advPath = null;
      $("level");
      __advRender();
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
      var _v978 = AdvCanvasPoint(_v976, _v977), _v979 = (n.advTab || "") === "star", _v980 = AdvHit(_v978.x, _v978.y, _v979);
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
      var _v985 = (n.advTab || "") === "star" ? ADV_STAR_VIEW : ADV_VIEW;
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
      var _v989 = (n.advTab || "") === "star", _v990 = _v989 ? ADV_STAR_VIEW : ADV_VIEW;
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
      if (!_v989) {
        var newPath = _v994 && !AdvAllocated(_v994) ? AdvPathTo(_v994) : null;
        var oldKey = (n.advPath || []).join(","), newKey = (newPath || []).join(",");
        if (_v994 !== (n.advHover || null) || oldKey !== newKey) {
          n.advHover = _v994;
          n.advPath = newPath;
          AdvDraw();
        }
      }
      AdvShowTip(_v993, _v989, _v987);
    });
    _v958.addEventListener("pointerup", function () {
      if (n.advTab === "star") ADV_STAR_VIEW.drag = null; else ADV_VIEW.drag = null;
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
      var _v1000 = (n.advTab || "") === "star", _v1001 = _v1000 ? ADV_STAR_VIEW : ADV_VIEW;
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
var _f4Base = V$;
V$ = function () {
  var _v1007 = n && n.advTab || "tree";
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
  A("stats:pre", function (_v1009) {
    try {
      if (!u || !_v1009 || !_v1009.a) return;
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
  path: AdvPathTo,
  pathCost: AdvPathCost,
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
    if (n) {
      n.advHover = _v1044 || null;
      AdvDraw();
    }
    return n && n.advHover;
  },
  setSelected: function (_v1045) {
    if (n) n.advSel = _v1045 || null;
    return n && n.advSel;
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
    uid: Sa(),
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
  var _v1065 = I() * _v1063, _v1066 = 0;
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
    ue(_v1068, _v1069, {
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
    h: '<div class="th" style="color:' + _v1075 + '">' + O(_v1074.n) + "<small>天赋珠宝 · T" + _v1074.tier + '</small></div><div class="tb"><div class="sp">' + _v1076 + '</div><div class="sep"></div><div class="md">' + O(_v1074.d || "") + '</div><div class="sep"></div><div class="hint">可镶嵌在高级天赋树的「珠宝栏位」（点亮后点击该栏位选择）</div></div>'
  };
}
/* ------------------------------------------------------------------
 * 珠宝渲染接管（图标 / 背包格子 / tooltip）
 *
 * 判据必须只认「扩展包自己生成的珠宝」：官方 v19.2 新增的传奇珠宝
 * （逆流之玉 / 招魂之玉 / 盈虚之玉）kind 同样是 "jewel"，若按 kind 判断，
 * 会被整类吃掉 —— 表现就是背包里图标空白、格子丢了稀有度边框、悬浮
 * 只显示扩展包的通用「天赋珠宝 · T1」说明，看不到它到底是什么。
 * 特征区分：扩展珠宝带 jid（且能被 JewelDef 解析），官方珠宝带 uj / jt / th。
 * 非扩展珠宝一律透传宿主实现。
 * ------------------------------------------------------------------ */
function PortIsExtJewel(_e) {
  return !!(_e && _e.kind === "jewel" && typeof _e.jid === "string" && _e.jid && !_e.uj && JewelDef(_e.jid));
}
var _rpJewel = Ym;
Ym = function (_v1078) {
  if (PortIsExtJewel(_v1078)) return JEWEL_ICONS[_v1078.jid] || (JewelDef(_v1078.jid) ? JewelIcon(JewelDef(_v1078.jid)) : "");
  return _rpJewel.apply(this, arguments);
};
var _$sJewel = Mo;
Mo = function (_v1079, _v1080, _v1081) {
  if (PortIsExtJewel(_v1079)) return '<div class="cell gm" ' + (_v1081 || "") + ' data-act="' + _v1080 + '" data-uid="' + _v1079.uid + '" data-tt="it:' + _v1079.uid + '" data-craft="' + _v1079.uid + '"><img src="' + Ym(_v1079) + '" alt=""><span class="tg">珠宝</span></div>';
  return _$sJewel.apply(this, arguments);
};
var _asJewel = qs;
qs = function (_v1082, _v1083) {
  if (PortIsExtJewel(_v1082)) return JewelTooltip(_v1082);
  return _asJewel.apply(this, arguments);
};
function AdvJewelSocketInfo(_v1084) {
  if (!u) return null;
  var _v1085 = u.advJewels && u.advJewels[_v1084];
  var _v1086 = _v1085 ? JewelDef(_v1085) : null;
  return _v1085 ? {
    jid: _v1085,
    def: _v1086
  } : null;
}
function AdvJewelSocket(_v1087, _v1088) {
  if (!u || !u.advTree || u.advTree.indexOf(_v1087) < 0) return "珠宝栏位没有点亮";
  var _v1089 = AdvNode(_v1087);
  if (!_v1089 || _v1089.tier !== "jewel") return "不是珠宝栏位";
  u.advJewels = u.advJewels || ({});
  if (u.advJewels[_v1087]) return "这个栏位已经镶嵌了珠宝 · 先取出";
  var _v1090 = -1;
  for (var _v1091 = 0; _v1091 < (u.inv || []).length; _v1091++) if (u.inv[_v1091] && String(u.inv[_v1091].uid) === String(_v1088) && u.inv[_v1091].kind === "jewel") {
    _v1090 = _v1091;
    break;
  }
  if (_v1090 < 0) return "背包里没有这个珠宝";
  var _v1092 = u.inv[_v1090];
  if (!JewelDef(_v1092.jid)) return "未知珠宝";
  u.inv.splice(_v1090, 1);
  u.advJewels[_v1087] = _v1092.jid;
  return null;
}
function AdvJewelRemove(_v1093) {
  if (!u || !u.advJewels || !u.advJewels[_v1093]) return "这个栏位没有镶嵌珠宝";
  var _v1094 = u.advJewels[_v1093];
  var _v1095 = JewelItem(_v1094);
  if (!_v1095) return "珠宝数据缺失";
  (u.inv = u.inv || []).push(_v1095);
  delete u.advJewels[_v1093];
  return null;
}
function AdvJewelAction(_v1096) {
  _v1096 = String(_v1096 || "");
  var _v1097 = _v1096.split(":");
  if (_v1097[0] === "close") {
    n.advJewelSel = null;
    return null;
  }
  if (_v1097[0] === "open") {
    n.advJewelSel = _v1097[1];
    return null;
  }
  if (_v1097[0] === "equip") {
    var _v1098 = AdvJewelSocket(_v1097[1], _v1097[2]);
    if (!_v1098) n.advJewelSel = null;
    return _v1098;
  }
  if (_v1097[0] === "remove") return AdvJewelRemove(_v1097[1]);
  if (_v1097[0] === "refund") {
    if (AdvJewelSocketInfo(_v1097[1])) return "请先取出镶嵌的珠宝";
    var _v1099 = AdvRespec(_v1097[1]);
    if (!_v1099) n.advJewelSel = null;
    return _v1099;
  }
  return "未知操作";
}
function AdvJewelPanelHTML() {
  AdvBuild();
  var _v1100 = n && n.advJewelSel;
  var _v1101 = '<div class="bsec"><h4>珠宝栏位 <small>' + AdvJewelSlots() + " / 6 已点亮 · 点击已点亮栏位镶嵌/取出</small></h4>";
  if (_v1100) {
    var _v1102 = AdvNode(_v1100);
    _v1101 += '<div class="baff" style="display:block"><span class="btxt"><b style="color:#c8a8ff">' + (_v1102 ? _v1102.n : _v1100) + '</b> · ' + (AdvJewelSocketInfo(_v1100) ? "已镶嵌: " + AdvJewelSocketInfo(_v1100).def.n : "空插槽") + " · 选择背包里的珠宝</span></div>";
    var _v1103 = (u && u.inv || []).filter(function (_v1104) {
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
    if (I() >= 0.35) return null;
    var _v1113 = (n.Z && n.Z.M && n.Z.M.rooms || []).filter(function (_v1114) {
      return !_v1114.boss;
    });
    if (!_v1113.length) return null;
    var _v1115 = _v1113[Math.floor(I() * _v1113.length)], _v1116 = ui(_v1115);
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
      return Mo(_v1120, "test", "");
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
  return !!(u && u.om && u.om[_v1123]);
}
function OmOwned(_v1124) {
  return !!(u && (u.cur[_v1124] || 0) > 0);
}
function OmHas(_v1125) {
  return OmActive(_v1125) && OmOwned(_v1125);
}
function OmIsWorld(_v1126) {
  return !!(q[_v1126] && q[_v1126].og && String(q[_v1126].og).startsWith("world"));
}
function OmIsAbyss(_v1127) {
  return !!(q[_v1127] && q[_v1127].og && String(q[_v1127].og).startsWith("abyss"));
}
function OmIsCombat(_v1128) {
  return !!(q[_v1128] && (q[_v1128].og === "worldRes" || q[_v1128].og === "worldExp" || q[_v1128].og === "worldFlask"));
}
function OmToggle(_v1129) {
  if (!u || !q[_v1129]) return;
  let _v1130 = q[_v1129];
  if (!OmOwned(_v1129)) {
    (P("没有" + _v1130.n), $("nomana", 0.5));
    return;
  }
  if ((u.om || (u.om = {}), u.om[_v1129])) {
    (delete u.om[_v1129], P("已收起预兆 · " + _v1130.n), $("pick", 0.6));
  } else {
    for (let _v1131 in u.om) {
      if (_v1131 === _v1129) continue;
      let _v1132 = q[_v1131];
      (!_v1132 || _v1132.og && _v1132.og === _v1130.og) && delete u.om[_v1131];
    }
    (u.om[_v1129] = 1, P("预兆已激活 · " + _v1130.n), ke("预兆已激活", _v1130.n + " · " + _v1130.d), $("pick", 0.7));
  }
  be();
}
function OmTake(_v1133, _v1134, _v1135) {
  if (!OmHas(_v1133)) return !1;
  if (Ya && Ya.dry) return !0;
  if (OmIsCombat(_v1133)) {
    if (n.omTrig) return !1;
    n.omTrig = !0;
  }
  u.cur[_v1133] = Math.max(0, (u.cur[_v1133] || 0) - 1);
  u.cur[_v1133] <= 0 && (u.om || (u.om = {}), delete u.om[_v1133]);
  P("预兆触发 · " + q[_v1133].n);
  _v1134 != null && U(_v1134, _v1135 != null ? _v1135 : 0, 0, !1, "gold", "预兆 · " + (q[_v1133].s || q[_v1133].n));
  OmIsWorld(_v1133) && ke("预兆触发", q[_v1133].n + " · " + q[_v1133].d);
  return !0;
}
function OmPrune() {
  if (!u || !u.om) return;
  for (let _v1136 in u.om) (!q[_v1136] || (u.cur[_v1136] || 0) <= 0) && delete u.om[_v1136];
}
function OmDrop(_v1137, _v1138) {
  let _v1139 = n.Z && n.Z.tier ? n.Z.tier : 0, _v1140 = Tt.filter(_v1141 => q[_v1141].grp === "omen" && (q[_v1141].mt || 1) <= _v1139);
  if (!_v1140.length) return null;
  let _v1142 = ht(_v1140, _v1143 => q[_v1143].ow || 1);
  return (ue(_v1137, _v1138, {
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
  return _v1146.length ? _v1146.map(_v1148 => q[_v1148].s || q[_v1148].n).join(" + ") : null;
}
function OmWhittle(_v1149, _v1150) {
  let _v1151 = [], _v1152 = -1;
  for (let _v1153 of _v1150) {
    let _v1154 = qa(_v1149, _v1153.id);
    if (!_v1154 || typeof _v1153.ti !== "number" || !_v1154.ranges || !_v1154.ranges.length) continue;
    let _v1155 = _v1154.ranges.length - 1 - _v1153.ti;
    if (_v1155 < 0 || _v1155 >= _v1154.ranges.length) continue;
    let _v1156 = (_v1154.lv || [])[_v1153.ti], _v1157 = _v1155 * 1000 + (typeof _v1156 === "number" ? _v1156 : 0);
    (_v1157 > _v1152 && (_v1152 = _v1157, _v1151 = []), _v1157 === _v1152 && _v1151.push(_v1153));
  }
  if (!_v1151.length || Math.floor(_v1152 / 1000) <= 0) return null;
  return oe(_v1151);
}
function StSide(_v1158, _v1159) {
  if (!_v1159) return wt(_v1158);
  let _v1160 = O4(_v1158, _v1159);
  return _v1160 ? (_v1158.mods.push(_v1160), !0) : !1;
}
function OmBenchRow() {
  let _v1161 = Tt.filter(_v1162 => q[_v1162].grp === "omen" && (u.cur[_v1162] || 0) > 0);
  return _v1161.length ? _v1161.map(_v1163 => {
    let _v1164 = q[_v1163], _v1165 = OmActive(_v1163);
    return `<button class="bcur om${_v1165 ? " on" : ""}" data-omen="${_v1163}" data-tt="cur:${_v1163}"><img src="${Ye[_v1163]}" alt=""><span class="bn">${_v1164.s || _v1164.n}</span><b>${u.cur[_v1163] || 0}</b><small>${_v1165 ? "已激活" : OmIsAbyss(_v1163) ? "深渊预兆" : OmIsWorld(_v1163) ? "冒险预兆" : "工艺预兆"}</small></button>`;
  }).join("") : '<p class="dim bhint">还没有预兆 · 宝箱、稀有怪与 T6 以上的首领会掉落</p>';
}
function DsTierOf(_v1166) {
  return DS_TIER[_v1166] || 0;
}
/* 遗存骨固定词缀阶级：远古=T1，普通=T2，啃噬=T4（数字指从高到低，T1 最高） */
function DsFixedTi(_v1166, _v1190) {
  if (!_v1190 || !_v1190.ranges || !_v1190.ranges.length) return null;
  var n = _v1190.ranges.length - 1;
  var want = _v1166 === "bone_ancient" ? n : _v1166 === "bone_preserved" ? n - 1 : _v1166 === "bone_gnawed" ? n - 3 : null;
  if (want == null) return null;
  return Math.max(0, Math.min(n, want));
}
function DsBoneTip(_v1167) {
  let _v1168 = DsTierOf(_v1167), _v1169 = pf.filter(_v1170 => _v1170.dsec), _v1171 = (_v1172, _v1173) => _v1173 > 1 ? (_v1172 / _v1173).toFixed(1) : _v1172, _v1174 = _v1168 === 0 ? "低阶骨 · 低数值" : _v1168 === 1 ? "中阶骨 · 中数值" : "远古骨 · 最高数值";
  if (!_v1169.length) return "";
  let _v1175 = _v1169.map(_v1176 => {
    let _v1177 = (DsFixedTi(_v1167, _v1176) != null ? DsFixedTi(_v1167, _v1176) : Math.min(_v1168, _v1176.ranges.length - 1)), _v1178 = _v1176.ranges[_v1177], _v1179 = _v1176.div || 1;
    return `<div class="p">${_v1176.t === "P" ? "前缀" : "后缀"} · ${O(_v1176.text.replace("{0}", _v1171(_v1178[0], _v1179) + "–" + _v1171(_v1178[1], _v1179)))}</div>`;
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
  let _v1186 = pf.filter(_v1187 => _v1184(_v1187) && (!_v1187.slots || _v1187.slots.includes(_v1182.slot)) && _v1187.lv[0] <= _v1182.ilvl);
  if (!_v1186.length) _v1186 = pf.filter(_v1188 => _v1184(_v1188) && _v1188.lv[0] <= _v1182.ilvl);
  if (!_v1186.length) _v1186 = pf.filter(_v1184);
  return _v1186;
}
function DsRoll(_v1189, _v1190, _v1191, _v1198bone) {
  let _v1192 = 0;
  for (let _v1193 = 0; _v1193 < _v1190.ranges.length; _v1193++) _v1190.lv[_v1193] <= _v1189.ilvl && (_v1192 = _v1193);
  var __fixedTi = _v1198bone ? DsFixedTi(_v1198bone, _v1190) : null;
  let _v1194 = __fixedTi != null ? __fixedTi : Math.min(_v1192, _v1191);
  let _v1195 = wo(_v1190.ranges[_v1194]);
  try {
    if (re("desecrate_sense")) _v1195 = Array.isArray(_v1195) ? _v1195.map(_v1196 => Math.round(_v1196 * 1.05)) : Math.round(_v1195 * 1.05 * 10) / 10;
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
  _v1203.length && _v1202.push(DsRoll(_v1198, oe(_v1203), DsTierOf(_v1199.bone), _v1199.bone));
  let _v1205 = 3 + (re("desecrate_lore") ? 1 : 0);
  for (let _v1206 = 0; _v1206 < 80 && _v1202.length < _v1205; _v1206++) {
    let _v1207 = oe(_v1200);
    _v1202.some(_v1208 => _v1208.id === _v1207.id) || _v1202.push(DsRoll(_v1198, _v1207, DsTierOf(_v1199.bone), _v1199.bone));
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
        let _v1219 = oe(_v1216);
        let _v1220 = DsRoll(_v1210, _v1219, 2);
        _v1220.putrid = 1;
        _v1220.dsec = 0;
        _v1210.mods.push(_v1220);
        _v1216 = _v1216.filter(_v1221 => _v1221.id !== _v1219.id);
      }
    };
    _v1213("P", 3);
    _v1213("S", 3);
    return (_v1210.dsec = _v1210.mods.length, na(_v1210), P("腐烂预兆 · 全部词缀被渎灵替换, 装备已腐化"), null);
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
  }), _v1225.ds = null, _v1225.dsec = (_v1225.dsec || 0) + 1, na(_v1225), P("渎灵词缀已揭示"), null);
}
function DsReroll(_v1229) {
  if (!_v1229 || !_v1229.ds) return "没有待揭示的渎灵词缀";
  return OmTake("omen_abyss_echo") ? (_v1229.ds.opts = DsOptions(_v1229), null) : "需要激活深渊回响预兆";
}
function DsMapChaos(_v1230, _v1231) {
  let _v1232 = MAP_CAT[_v1231] || [];
  _v1230.mods = _v1230.mods.filter(_v1233 => Qr(_v1230, _v1233));
  let _v1234 = 4 + (I() < 0.5 ? 1 : 0);
  for (let _v1235 = 0; _v1235 < _v1234; _v1235++) {
    let _v1236 = nh.filter(_v1237 => !_v1232.includes(_v1237.stat) && _v1237.lv[0] <= _v1230.ilvl && (!_v1237.slots || _v1237.slots.includes(_v1230.slot)));
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
      v: wo(_v1238.ranges[_v1244])
    });
  }
  return null;
}
function DsBoneDrop(_v1246, _v1247, _v1248) {
  let _v1249 = n.Z && n.Z.tier || 0, _v1250 = Math.min(2, Math.max(_v1248 || 0, _v1249 >= 14 ? 2 : _v1249 >= 8 ? 1 : 0) + (re("bone_speech") ? 1 : 0)), _v1251 = [];
  for (let _v1252 = 0; _v1252 <= _v1250; _v1252++) _v1251.push(DS_BONES[_v1252]);
  let _v1253 = oe(_v1251);
  ue(_v1246, _v1247, {
    kind: "cur",
    cur: _v1253
  });
  try {
    if (re("bone_sense") && I() < 0.1) ue(_v1246, _v1247, {
      kind: "cur",
      cur: _v1253
    });
  } catch (_v1254) {}
  return _v1253;
}
function DlWell(_v1255, _v1256) {
  let x = Math.round(_v1256.x), y = Math.round(_v1256.y), t = n.T;
  // 像素化灵魂之井：全部用 2px 方块堆出，避免圆润椭圆
  _v1255.fillStyle = "rgba(0,0,0,0.45)";
  _v1255.fillRect(x - 12, y + 5, 24, 3);
  _v1255.fillStyle = "#1e201c";
  _v1255.fillRect(x - 14, y - 2, 28, 7);
  _v1255.fillStyle = "#3a3e36";
  _v1255.fillRect(x - 12, y - 5, 24, 3);
  _v1255.fillStyle = "#4e5448";
  _v1255.fillRect(x - 14, y - 2, 3, 3);
  _v1255.fillRect(x + 11, y - 2, 3, 3);
  _v1255.fillStyle = "#0a1a10";
  _v1255.fillRect(x - 10, y - 1, 20, 4);
  _v1255.fillStyle = "#0f2a18";
  _v1255.fillRect(x - 8, y - 2, 16, 4);
  // 绿色池水 + 像素高光
  _v1255.fillStyle = "#1f8a4a";
  _v1255.fillRect(x - 7, y - 2, 14, 3);
  _v1255.fillStyle = "#2ee6a8";
  _v1255.fillRect(x - 5, y - 2, 6, 1);
  _v1255.fillRect(x + 1, y, 4, 1);
  _v1255.fillStyle = "rgba(120,255,170,0.35)";
  _v1255.fillRect(x - 9, y - 4, 18, 1);
  _v1255.fillRect(x - 11, y + 3, 22, 1);
  // 上升的像素光点
  for (let i = 0; i < 3; i++) {
    let k = (t * 0.8 + i * 0.33) % 1;
    _v1255.globalAlpha = (1 - k) * 0.9;
    _v1255.fillStyle = i % 2 ? "#7dff9a" : "#d8ffe0";
    _v1255.fillRect(x - 4 + i * 3 + Math.round(Math.sin(t * 2 + i) * 1.5), y - 2 - Math.round(k * 14), 2, 2);
  }
  _v1255.globalAlpha = 1;
}
function DsWell() {
  let _v1264 = [...u.inv, ...Object.values(u.equip)].filter(_v1265 => _v1265 && _v1265.ds);
  if (!DW.sel || !_v1264.includes(DW.sel)) DW.sel = _v1264[0] || null;
  let _v1266 = DW.sel;
  _v1266 && !_v1266.ds.opts && (_v1266.ds.opts = DsOptions(_v1266));
  let _v1267 = _v1266 ? `<div class="dwhead"><b style="color:${Yo[_v1266.rarity]}">${O(_v1266.name)}</b><small>${O(_v1266.base)} · 物品等级 ${_v1266.ilvl} · 骨: ${q[_v1266.ds.bone].n}${_v1266.ds.fac ? " · " + DS_FAC[_v1266.ds.fac] : ""}</small></div><div class="dwopts">${(_v1266.ds.opts || []).map((_v1268, _v1269) => {
    let _v1270 = qa(_v1266, _v1268.id);
    return `<button class="dwopt" data-dwopt="${_v1269}"><b>${O(Xs(_v1270, _v1268.v))}</b><small>${_v1268.t === "P" ? "前缀" : "后缀"} T${_v1270.ranges.length - _v1268.ti}${_v1270.fac ? " · " + DS_FAC[_v1270.fac] : ""}</small></button>`;
  }).join("") || '<p class="dim">没有可用的渎灵词缀</p>'}</div><div class="dwbtns"><button class="btn small" data-dwreroll="1"${OmHas("omen_abyss_echo") ? "" : " disabled"}>重掷选项 (深渊回响预兆)</button></div>` : '<p class="dim">没有待揭示的渎灵装备 · 用遗存骨对稀有装备渎灵</p>';
  let _v1271 = _v1264.length ? _v1264.map(_v1272 => `<button class="dwitem${_v1272 === _v1266 ? " on" : ""}" data-dw="${_v1272.uid}"><b style="color:${Yo[_v1272.rarity]}">${O(_v1272.name)}</b><small>${q[_v1272.ds.bone].n}</small></button>`).join("") : '<p class="dim">背包里没有</p>';
  (Ve(`<div class="ovbox well"><h2>灵魂之井</h2><p class="sub">深渊的遗存骨在这里揭示渎灵词缀 · 三选一</p>
		 <div class="dwwrap"><div class="dwlist">${_v1271}</div><div class="dwbody">${_v1267}</div></div>
		 <div class="ovbtns"><button class="btn" id="dwClose">离开 <kbd>Esc</kbd></button></div></div>`), C("#dwClose").onclick = xt, document.querySelectorAll("#overlay [data-dw]").forEach(_v1273 => _v1273.onclick = () => {
    let _v1274 = +_v1273.dataset.dw, _v1275 = [...u.inv, ...Object.values(u.equip)].find(_v1276 => _v1276 && _v1276.uid === _v1274);
    (_v1275 && (DW.sel = _v1275), DsWell());
  }), document.querySelectorAll("#overlay [data-dwopt]").forEach(_v1277 => _v1277.onclick = () => {
    let _v1278 = DsReveal(DW.sel, +_v1277.dataset.dwopt);
    (_v1278 ? P(_v1278) : ($("unique"), ke("渎灵", "词缀已揭示")), DsWell());
  }), document.querySelectorAll("#overlay [data-dwreroll]").forEach(_v1279 => _v1279.onclick = () => {
    let _v1280 = DsReroll(DW.sel);
    (_v1280 ? P(_v1280) : ($("pick"), ke("深渊回响", "选项已重掷")), DsWell());
  }));
}
function DlMirror(_v1281, _v1282) {
  _v1281.globalAlpha = 1;
  let _v1283 = Math.round(_v1282.x), _v1284 = Math.round(_v1282.y), _v1285 = n.T;
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
  let _v1297 = Math.round(_v1296.x), _v1298 = Math.round(_v1296.y), _v1299 = n.T, _v1300 = _v1296.st === "done" ? 1 : 0.55 + Math.sin(_v1299 * 2.2) * 0.35;
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
  let _v1309 = n.del;
  if (!_v1309 || _v1309.spl >= _v1309.splMax) return !1;
  _v1309.spl++;
  return (ue(_v1307, _v1308, {
    kind: "cur",
    cur: "splinter"
  }), !0);
}
function DelDepthNow() {
  let _v1310 = 0;
  (n.del && n.del.depth > 0 && (_v1310 = n.del.depth), n.sim && n.sim.active && (_v1310 = Math.max(_v1310, n.sim.depth)));
  return _v1310;
}
function DelRarityBonus() {
  return Math.floor(DelDepthNow() / 20) * 5;
}
function DelDRMul() {
  let _v1311 = DelDepthNow();
  if (_v1311 <= 0) return 1;
  let _v1312 = Math.floor(_v1311 / 10), _v1313 = Math.min(BAL.delDmgCap, _v1312 * BAL.delDmgPer10);
  n.sim && n.sim.active && (_v1313 = Math.min(0.95, Math.min(90, _v1312) * 0.038));
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
  let _v1316 = u.delirium || 0;
  (n.del && n.del.depth > _v1316 && (_v1316 = n.del.depth), n.sim && n.sim.active && n.sim.depth > _v1316 && (_v1316 = n.sim.depth));
  return Math.min(BAL.delHpMax, Math.max(0, _v1316 / 100 * BAL.delHpPer100));
}
function DelBegin() {
  if (n.delRun) return;
  n.delRun = {
    layer: 0,
    max: DEL_LAYERS,
    active: !0
  };
  DelEnterLayer(1);
}
function DelEnterLayer(_v1317) {
  if (!n || n.state !== "play") return;
  let _v1318 = n.delRun || (n.delRun = {
    max: DEL_LAYERS,
    active: !0
  });
  (_v1318.layer = _v1317, _v1318.active = !0, _v1318.bossDead = !1);
  let _v1319 = Math.max(1, Math.min(16, _v1317 + 2)), _v1320 = Zt(_v1319);
  (_v1320.name = "惊悸迷雾 · 第 " + _v1317 + " 层", _v1320.base = "惊悸迷雾", _v1320.dbg = {
    rooms: [5, 6]
  });
  let _v1321 = Math.max(0, Math.min(AtlasDeliriumCap(), u.delirium || 0)), _v1322 = Math.min(250, _v1321 + _v1317 * 30);
  n.delRun = _v1318;
  n.del = {
    t: 0,
    base: _v1321,
    depth: _v1322,
    peak: _v1322,
    fogR: 2400,
    outT: 0,
    spl: 0,
    splMax: de(3, 6) + (re("deli3") ? 2 : 0) + (re("deli6") ? 1 : 0),
    pauseT: 0,
    shardAt: 9999,
    final: !1,
    maxReward: !1,
    layer: _v1317,
    m: null
  };
  DelLayerMap = !0;
  try {
    Xi(_v1320);
  } catch (_v1323) {
    DelLayerMap = !1;
    return;
  }
  DelLayerMap = !1;
  (n.Z.name = _v1320.name, n.Z.base = _v1320.base, n.Z.delLayer = _v1317);
  n.delRun = _v1318;
  DelTagBoss();
  (ke("惊悸迷雾 · 第 " + _v1317 + "/" + DEL_LAYERS + " 层", "击杀本层首领后按 F 进入下一层" + (_v1317 >= DEL_LAYERS ? " · 最终首领血量 ×5" : "")), $("portal"));
}
function DelTagBoss() {
  if (!n.delRun) return;
  for (let _v1324 of n.mons) {
    if (_v1324.rar !== 3 || _v1324.delBoss) continue;
    _v1324.delBoss = !0;
    if (n.delRun.layer >= n.delRun.max) {
      (_v1324.maxhp *= 5, _v1324.hp = _v1324.maxhp, _v1324.name = "最终·" + _v1324.name);
    } else _v1324.name = "迷雾首领·" + _v1324.name;
  }
}
function DelBossKilled(_v1325) {
  if (!n.delRun || !_v1325 || !_v1325.delBoss || _v1325.delRewarded) return;
  _v1325.delRewarded = !0;
  let _v1326 = n.delRun.layer >= n.delRun.max, _v1327 = _v1326 ? 20 + (re("deli7") ? 10 : 0) : 3 + (re("deli4") ? 1 : 0);
  for (let _v1328 = 0; _v1328 < _v1327; _v1328++) ue(_v1325.x, _v1325.y, {
    kind: "cur",
    cur: "divine"
  });
  if (_v1326) {
    (Ua.mageblood && I() < 0.015 && ue(_v1325.x, _v1325.y, {
      kind: "it",
      it: Kt(Ua.mageblood, 80)
    }), u.delirium = Math.min(AtlasDeliriumCap(), (u.delirium || 0) + AtlasDeliriumGain(25 + (re("deli2") ? 10 : 0) + (re("deli5") ? 10 : 0))), GrantAtlasPoint("惊悸迷雾"), ke("惊悸迷雾 · 终点", "最终首领倒下 · 20 神圣石已掉落 · 亢奋值 +25%"), $("unique"), n.delRun = null, n.del = null);
  } else {
    (n.objs.push({
      kind: "b-delportal",
      x: _v1325.x,
      y: _v1325.y + 24,
      r: 16,
      layer: n.delRun.layer + 1
    }), ke("第 " + n.delRun.layer + " 层完成", "按 F 进入第 " + (n.delRun.layer + 1) + " 层"), $("unique"));
  }
}
function DeliriumStart(_v1329) {
  if (n.del) return;
  (_v1329 && (_v1329.st = "active"), n.del = {
    m: _v1329,
    t: 0,
    base: Math.min(AtlasDeliriumCap(), u.delirium || 0),
    peak: Math.min(AtlasDeliriumCap(), u.delirium || 0),
    depth: Math.min(AtlasDeliriumCap(), u.delirium || 0),
    fogR: 80,
    outT: 0,
    waveT: 2,
    final: !1,
    wave: 0,
    pauseT: 0,
    shardAt: 25,
    maxReward: !1,
    spl: 0,
    splMax: de(3, 6) + (re("deli3") ? 2 : 0)
  });
  for (let _v1330 of n.mons) _v1330.dead || DelMark(_v1330, 0);
  (ke("惊悸迷雾", "迷雾从镜面扩散 · 越远离镜子亢奋度越高" + (u.delirium ? " · 已积累亢奋 " + u.delirium + "%" : "")), $("unique"), X(0.25));
}
function DeliriumEnd() {
  if (!n.del) return;
  let _v1331 = n.del;
  if ((_v1331.peak || 0) >= 50) {
    let _v1332 = Math.min(250, (u.delirium || 0) + 25 + (re("deli2") ? 10 : 0) + (re("deli5") ? 10 : 0));
    (u.delirium = _v1332, u.deliriumMaps = (u.deliriumMaps || 0) + 1);
    (ke("迷雾散去", "亢奋值 +25% · 当前 " + _v1332 + "%"), P("惊悸亢奋 " + _v1332 + "% (下一张地图起始亢奋更高)"));
  } else ke("迷雾散去", "你从惊悸迷雾中走了出来");
  (n.del = null, $("portal"));
}
function DeliriumUpdate(_v1333) {
  if (!n.Z || n.Z.type !== "map" || !n.pl) return;
  let _v1334 = n.del;
  if (!_v1334) {
    for (let _v1335 of n.objs) _v1335.kind === "mirror" && _v1335.st === "idle" && (_v1335.x - n.pl.x) ** 2 + (_v1335.y - n.pl.y) ** 2 < 1764 && DeliriumStart(_v1335);
    return;
  }
  if (n.pl.dead) return void DeliriumEnd();
  (_v1334.t += _v1333, _v1334.fogR = Math.min(1900, _v1334.fogR + _v1333 * 150));
  let _v1336 = _v1334.m ? _v1334.m.x : n.pl.x, _v1337 = _v1334.m ? _v1334.m.y : n.pl.y, _v1338 = Math.hypot(n.pl.x - _v1336, n.pl.y - _v1337);
  _v1334.pauseT > 0 && (_v1334.pauseT -= _v1333);
  (_v1334.depth = _v1334.pauseT > 0 ? _v1334.depth : Math.min(250, Math.round((_v1334.base || 0) + _v1338 / 1000 * 100)), _v1334.peak = Math.max(_v1334.peak || 0, _v1334.depth), _v1338 > _v1334.fogR + 40 && _v1334.pauseT <= 0 ? _v1334.outT += _v1333 : _v1334.outT = 0);
  for (let _v1339 of n.objs) _v1339.kind === "delshard" && !_v1339.taken && (_v1339.x - n.pl.x) ** 2 + (_v1339.y - n.pl.y) ** 2 < 324 && DelShard(_v1339);
  if (_v1334.depth >= _v1334.shardAt && _v1334.pauseT <= 0) {
    let _v1340 = We(n.pl.x, n.pl.y, 80);
    n.objs.push({
      kind: "delshard",
      x: _v1340.x,
      y: _v1340.y,
      r: 6,
      taken: !1,
      col: oe(Object.keys(DEL_SHARD_COL))
    });
    _v1334.shardAt = Math.min(251, _v1334.shardAt + 25);
    P("破溃之镜碎片出现了");
  }
  _v1334.outT > 5 && DeliriumEnd();
  if (!n.del) return;
  for (let _v1341 of n.mons) !_v1341.dead && !_v1341.del && (_v1341.x - _v1336) ** 2 + (_v1341.y - _v1337) ** 2 < _v1334.fogR * _v1334.fogR && DelMark(_v1341, _v1334.depth);
  if (!_v1334.maxReward && _v1334.depth >= 250) {
    _v1334.maxReward = !0;
    let _v1342 = We(n.pl.x, n.pl.y, 26);
    (n.objs.push({
      kind: "box",
      x: _v1342.x,
      y: _v1342.y,
      r: 6,
      open: !1,
      delBox: !0
    }), ke("亢奋巅峰", "第二只惊悸宝箱出现了"));
  }
  if (!_v1334.final && _v1334.depth >= 200) {
    _v1334.final = !0;
    let _v1343 = We(n.pl.x, n.pl.y, 20), _v1344 = nt(oe(Object.keys(n.Z.th.mon)), _v1343.x, _v1343.y, n.Z.lvl + 2, 2);
    (Object.assign(_v1344, {
      del: !0,
      delMul: 2.6,
      name: "迷雾之影",
      aggro: !0,
      maxhp: _v1344.maxhp * 2.5
    }), _v1344.hp = _v1344.maxhp, n.mons.push(_v1344), n.objs.push({
      kind: "box",
      x: _v1343.x + 26,
      y: _v1343.y + 10,
      r: 6,
      open: !1,
      delBox: !0
    }), ke("迷雾之潮", "迷雾之影与惊悸宝箱出现了"));
  }
}
function DelShard(_v1345) {
  if (!_v1345 || _v1345.taken) return;
  _v1345.taken = !0;
  let _v1346 = n.del, _v1347 = _v1345.col;
  if (_v1347 === "blue") {
    let _v1348 = n.mons.filter(_v1349 => !_v1349.dead && _v1349.rar === 2).sort((_v1350, _v1351) => (_v1350.x - n.pl.x) ** 2 + (_v1350.y - n.pl.y) ** 2 - ((_v1351.x - n.pl.x) ** 2 + (_v1351.y - n.pl.y) ** 2))[0];
    if (_v1348) {
      (_v1348.maxhp *= 1.5, _v1348.hp = _v1348.maxhp, _v1348.dmg *= 1.25, _v1348.name = "惊悸·" + _v1348.name);
      P("蓝色碎片 · 稀有怪物被惊悸强化");
    } else P("蓝色碎片 · 附近没有稀有怪物");
  } else if (_v1347 === "cyan") {
    _v1346 && (_v1346.pauseT = 12);
    P("青色碎片 · 迷雾暂停 12 秒");
  } else if (_v1347 === "purple") {
    let _v1352 = Object.keys(n.Z.th.mon);
    for (let _v1353 = 0; _v1353 < 4; _v1353++) {
      let _v1354 = We(n.pl.x, n.pl.y, 90), _v1355 = nt(oe(_v1352), _v1354.x, _v1354.y, n.Z.lvl, 1);
      (Object.assign(_v1355, {
        del: !0,
        delMul: 2,
        aggro: !0,
        name: "纯化·" + _v1355.name
      }), _v1355.maxhp *= 1.6, _v1355.hp = _v1355.maxhp, n.mons.push(_v1355));
    }
    P("紫色碎片 · 纯化怪群出现");
  } else {
    let _v1356 = We(n.pl.x, n.pl.y, 24), _v1357 = nt(oe(Object.keys(n.Z.th.mon)), _v1356.x, _v1356.y, n.Z.lvl + 2, 2);
    (Object.assign(_v1357, {
      del: !0,
      delMul: 2.6,
      name: "迷雾之影",
      aggro: !0,
      maxhp: _v1357.maxhp * 2.5
    }), _v1357.hp = _v1357.maxhp, n.mons.push(_v1357), P("橙色碎片 · 迷雾之影出现"));
  }
  (DelSplinter(_v1345.x, _v1345.y), DelSplinter(_v1345.x, _v1345.y));
  E(_v1345.x, _v1345.y, 24, [DEL_SHARD_COL[_v1347], "#e8f0ff"], 60, 0.8, {
    glow: !0
  });
}
function DlShardDraw(_v1358, _v1359) {
  let _v1360 = Math.round(_v1359.x), _v1361 = Math.round(_v1359.y), _v1362 = DEL_SHARD_COL[_v1359.col] || "#cfd8e8", _v1363 = 0.65 + Math.sin(n.T * 4) * 0.35;
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
  if (!n.ritualPool || n.ritualPool.zone !== n.Z) n.ritualPool = {
    zone: n.Z,
    tribute: 0
  };
  return n.ritualPool;
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
  let _v1370 = Math.max(3, Math.min(6, Math.ceil((_v1369.stored || 6) / 3))), _v1371 = Object.keys(n.Z.th.mon);
  _v1369.revive = (_v1369.revive || 0) + 1;
  for (let _v1372 = 0; _v1372 < _v1370; _v1372++) {
    let _v1373 = We(_v1369.x, _v1369.y, 90), _v1374 = nt(oe(_v1371), _v1373.x, _v1373.y, n.Z.lvl, I() < 0.12 ? 1 : 0);
    (Object.assign(_v1374, {
      ritual: _v1369,
      reviveGen: _v1369.revive,
      aggro: !0
    }), n.mons.push(_v1374));
  }
  (P("驱灵仪式 · 第 " + _v1369.wave + "/" + _v1369.waves + " 波"), E(_v1369.x, _v1369.y, 30, RIT_COL, 70, 0.8, {
    glow: !0
  }));
}
function RitualStart(_v1375) {
  if (!_v1375 || _v1375.st !== "idle") return;
  let _v1376 = re("rit4") ? 2 : 3;
  if ((_v1375.stored || 0) < _v1376) return P("先在祭坛范围内击杀怪物吸收怨灵 (" + (_v1375.stored || 0) + "/" + _v1376 + ")");
  (_v1375.st = "active", _v1375.wave = 1, _v1375.revive = 0, _v1375.restT = 0.6, RitualWave(_v1375), ke("驱灵仪式", "击退 3 波怨灵 · 击杀祭坛附近的怪物可获得贡品"), $("portal"), X(0.18));
}
function RitualUpdate(_v1377) {
  for (let _v1378 of n.objs) {
    if (_v1378.kind !== "ritual" || _v1378.st !== "active") continue;
    if (n.pl && n.pl.dead) {
      (_v1378.st = "idle", _v1378.stored = 0, _v1378.revive = 0, _v1378.offers = null, P("仪式中断 · 怨灵散去"));
      continue;
    }
    if (n.mons.some(_v1379 => _v1379.ritual === _v1378 && !_v1379.dead) || (_v1378.restT -= _v1377) > 0) continue;
    if (_v1378.wave < _v1378.waves) (_v1378.wave += 1, _v1378.restT = 0.8, RitualWave(_v1378)); else (_v1378.st = "done", u.ritualDone = (u.ritualDone || 0) + 1, RitualMapCheck(), $("unique"), ke("恩典降临", "回到祭坛领取恩赐 (贡品 " + RitTribute() + ")"), E(_v1378.x, _v1378.y, 40, RIT_COL, 90, 1, {
      glow: !0
    }));
  }
}
function RitItemTip(_v1380) {
  if (!_v1380) return "";
  let _v1381 = _v1380.name || (_v1380.base && pe[_v1380.base] ? pe[_v1380.base].n : "");
  try {
    if (_v1380.base && pe[_v1380.base]) _v1381 += " · " + pe[_v1380.base].n;
    (_v1380.impl || []).forEach(function (_v1382) {
      let _v1383 = Wo[_v1382.id] || ta[_v1382.id] || un[_v1382.id];
      if (_v1383) _v1381 += "\n" + Xs(_v1383, _v1382.v);
    });
    (_v1380.mods || []).forEach(function (_v1384) {
      let _v1385 = Wo[_v1384.id] || ta[_v1384.id] || un[_v1384.id];
      if (_v1385) _v1381 += "\n" + Xs(_v1385, _v1384.v);
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
  let _v1390 = [], _v1391 = Math.max(n.Z.lvl || 1, u.level || 1), _v1392 = $e(n.Z.tier || 1, 1, 16), __ritRar = Math.max(0, (n.S && n.S.rarity) || 0), _v1393 = ["omen_exalt_p", "omen_exalt_s", "omen_whittle", "omen_abyss_echo", "omen_abyss_light", "omen_sanctify", "omen_necro_p", "omen_necro_s", "omen_chaos_mon"], _v1394 = oe(_v1393), _v1395 = oe(DS_BONES), _v1396 = Tt.filter(_v1397 => q[_v1397].grp === "rune" || q[_v1397].grp === "ess"), _v1398 = oe(_v1396), _v1401 = Ft(oe(Pa), _v1391 + 1, 2), _v1402 = Zt(_v1392), _v1403 = yt.filter(_v1404 => _v1404.src === "world" && !_v1404.noDrop), _v1405 = _v1403.length && I() < (0.4 + (u.level || 0) / 300 + __ritRar / 1500) ? oe(_v1403) : null;
  // 稀有度越高，恩典里的稀有物品额外多词条；角色等级已通过物品等级体现
  try {
    var __extraMods = Math.min(4, Math.floor(__ritRar / 120));
    for (var __eiR = 0; __eiR < __extraMods; __eiR++) wt(_v1401);
  } catch (eR) {}
  _v1390.push({
    n: "预兆 · " + q[_v1394].n,
    cost: 70,
    tip: q[_v1394].n + "\n" + q[_v1394].d,
    tt: "cur:" + _v1394,
    give: () => {
      u.cur[_v1394] = (u.cur[_v1394] || 0) + 1;
    }
  });
  if (re("rit3")) {
    let _v1406 = oe([..._v1393].filter(_v1407 => _v1407 !== _v1394));
    _v1390.push({
      n: "预兆 · " + q[_v1406].n,
      cost: 70,
      tip: q[_v1406].n + "\n" + q[_v1406].d,
      tt: "cur:" + _v1406,
      give: () => {
        u.cur[_v1406] = (u.cur[_v1406] || 0) + 1;
      }
    });
  }
  _v1390.push({
    n: "遗存骨 · " + q[_v1395].n,
    cost: 60,
    tip: q[_v1395].n + "\n" + q[_v1395].d,
    tt: "cur:" + _v1395,
    give: () => {
      u.cur[_v1395] = (u.cur[_v1395] || 0) + 1;
    }
  });
  _v1390.push({
    n: "稀有 · " + O(_v1401.name),
    cost: 45,
    tip: RitItemTip(_v1401),
    give: () => ue(n.pl.x, n.pl.y, {
      kind: "it",
      it: _v1401
    })
  });
  _v1390.push({
    n: "符文/精华 · " + q[_v1398].n + " ×1",
    cost: 15,
    tip: q[_v1398].n + "：" + q[_v1398].d,
    give: () => {
      u.cur[_v1398] = (u.cur[_v1398] || 0) + 1;
    }
  });
  _v1390.push({
    n: "地图 · T" + _v1402.tier + " " + O(_v1402.base),
    cost: 30,
    tip: "T" + _v1402.tier + " 地图\n" + O(_v1402.name || ""),
    give: () => u.inv.push(_v1402)
  });
  _v1390.push({
    n: "迷雾副本裂片 ×8",
    cost: 35,
    tip: "迷雾副本裂片 ×8\n用于进入迷雾副本 / 相关兑换",
    give: () => {
      u.cur.splinter = (u.cur.splinter || 0) + 8;
    }
  });
  _v1390.push({
    n: "混沌石 ×5",
    cost: 20,
    tip: q.chaos.d,
    tt: "cur:chaos",
    give: () => {
      u.cur.chaos = (u.cur.chaos || 0) + 5;
    }
  });
  _v1390.push({
    n: "崇高石 ×1",
    cost: 40,
    tip: q.exalt.d,
    tt: "cur:exalt",
    give: () => {
      u.cur.exalt = (u.cur.exalt || 0) + 1;
    }
  });
  _v1390.push({
    n: "神圣石 ×1",
    cost: BAL.ritualDivineCost || 100,
    tip: q.divine.d,
    tt: "cur:divine",
    give: () => {
      u.cur.divine = (u.cur.divine || 0) + 1;
    }
  });
  if (_v1405) {
    let _v1410 = Kt(_v1405, _v1391);
    _v1390.push({
      n: "传奇 · " + O(_v1405.n),
      cost: 160,
      tip: RitItemTip(_v1410),
      give: () => ue(n.pl.x, n.pl.y, {
        kind: "it",
        it: _v1410
      })
    });
  } else _v1390.push({
    n: "传奇装备 (25%)",
    cost: 160,
    tip: "25% 概率掉落一件随机传奇装备",
    give: () => {
      let _v1411 = yt.filter(_v1412 => _v1412.src === "world" && !_v1412.noDrop);
      if (_v1411.length && I() < 0.25) ue(n.pl.x, n.pl.y, {
        kind: "it",
        it: Kt(oe(_v1411), _v1391)
      }); else ue(n.pl.x, n.pl.y, {
        kind: "cur",
        cur: "alch"
      });
    }
  });
  re("rit5") && _v1390.forEach(_v1413 => _v1413.cost = Math.round(_v1413.cost * 0.85));
  for (let _v1414 = _v1390.length - 1; _v1414 > 0; _v1414--) {
    let _v1415 = Math.floor(I() * (_v1414 + 1));
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
  return (RitSpendTribute(_v1419.cost), _v1419.bought = !0, _v1419.give(), P("恩典: " + _v1419.n), $("unique"), null);
}
function RitualReset() {
  let _v1420 = RitPool();
  if (!RitSpendTribute(10)) return "贡品不足 · 重置恩典需要 10 贡品";
  delete _v1420.offers;
  return null;
}
function RitualShop(_v1420) {
  n.ritualPause = !0;
  let _v1421 = RitualOffers(_v1420), _v1422 = RitTribute(), _v1423 = _v1421.map((_v1424, _v1425) => `<button class="ritopt${_v1424.bought ? " bought" : _v1422 < _v1424.cost ? " no" : ""}" data-rbuy="${_v1425}"${_v1424.bought ? " disabled" : ""} title="${O(_v1424.tip || _v1424.n).replace(/"/g, "&quot;")}"><b>${O(_v1424.n)}</b><small>${_v1424.bought ? "已兑换" : _v1424.cost + " 贡品"}</small></button>`).join("");
  (Ve(`<div class="ovbox ritual"><h2>驱灵祭坛 · 恩典</h2><p class="sub">用击杀祭坛附近怪物获得的贡品换取恩赐 · 全图共享贡品 <b style="color:#ffd0e0">${_v1422}</b></p>
		 <div class="ritgrid">${_v1423}</div>
		 <div class="ovbtns"><button class="btn" id="ritReset">重置恩典 · 10 贡品</button><button class="btn" id="ritClose">离开 <kbd>Esc</kbd></button></div></div>`), C("#ritClose").onclick = () => {
    (n.ritualPause = !1, xt());
  }, C("#ritReset") && (C("#ritReset").onclick = () => {
    let _v1427 = RitualReset();
    (_v1427 && (P(_v1427), $("nomana", 0.5)), RitualShop(_v1420));
  }), document.querySelectorAll("#overlay [data-rbuy]").forEach(_v1426 => _v1426.onclick = () => {
    let _v1427 = RitualBuy(_v1420, +_v1426.dataset.rbuy);
    (_v1427 && (P(_v1427), $("nomana", 0.5)), RitualShop(_v1420));
  }));
}
function RitualInteract(_v1428) {
  _v1428.st === "idle" ? RitualStart(_v1428) : _v1428.st === "done" && RitualShop(_v1428);
}
function DlSim(_v1429, _v1430) {
  _v1429.globalAlpha = 1;
  let _v1431 = Math.round(_v1430.x), _v1432 = Math.round(_v1430.y), _v1433 = n.T;
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
  DlSim(d, _v1438);
  var _v1439 = Math.round(_v1438.x), _v1440 = Math.round(_v1438.y);
  d.save();
  var _v1441 = _v1438.label || "F 下一层";
  d.font = "bold 11px system-ui, 'Microsoft YaHei', sans-serif";
  d.textAlign = "center";
  var _v1442 = Math.max(84, Math.round(d.measureText(_v1441).width) + 14);
  d.fillStyle = "rgba(8,6,16,.9)";
  d.fillRect(_v1439 - _v1442 / 2, _v1440 + 12, _v1442, 17);
  d.strokeStyle = "#8c64ff";
  d.lineWidth = 1;
  d.strokeRect(_v1439 - _v1442 / 2 + 0.5, _v1440 + 12.5, _v1442 - 1, 16);
  d.fillStyle = "#f0e8ff";
  d.fillText(_v1441, _v1439, _v1440 + 24.5);
  d.restore();
}
function SimulacrumInteract() {
  if (!u.simUnlocked) {
    u.simUnlocked = !0;
    ke("迷雾副本", "已解锁 · 70 层挑战，免费进入");
  }
  SimEnterLayer(1);
}
function SimulacrumEnter() {
  SimEnterLayer(1);
}
function SimEnterLayer(_v1443) {
  if (!n || n.state !== "play") return;
  if (_v1443 > SIM_LAYERS) return SimFinishRun();
  let _v1444 = n.simRun || (n.simRun = {
    max: SIM_LAYERS
  }), _v1445 = Math.max(1, BAL.simRoomsPerMap || 5), _v1446 = (_v1443 - 1) % _v1445, _v1447 = Math.floor((_v1443 - 1) / _v1445), _v1448 = !n.Z || n.Z.simMap == null || n.Z.simMap !== _v1447;
  _v1444.layer = _v1443;
  try {
    if (n.pl && n.S && re("pleasure")) {
      n.pl.hp = Math.min(n.S.maxLife, (n.pl.hp || 0) + n.S.maxLife * 0.25);
      n.pl.mana = Math.min(n.S.maxMana, (n.pl.mana || 0) + n.S.maxMana * 0.25);
    }
  } catch (_v1449) {}
  _v1444.map = _v1447 + 1;
  _v1444.room = _v1446 + 1;
  n.simRun = _v1444;
  if (_v1448) {
    let _v1450 = Math.max(1, Math.min(16, 1 + Math.floor(_v1443 / 3))), _v1451 = Zt(_v1450);
    (_v1451.name = "迷雾副本 · 第 " + _v1443 + " 层", _v1451.base = "迷雾副本", _v1451.dbg = {
      rooms: [_v1445, _v1445]
    });
    let _v1452 = null;
    for (let _v1453 = 0; _v1453 < 40; _v1453++) {
      let _v1454 = ai(_v1445);
      if (_v1454.rooms.length >= _v1445) {
        _v1452 = _v1454;
        break;
      }
    }
    SimLayerMap = !0;
    try {
      Xi(_v1451, _v1452 || void 0);
    } catch (_v1455) {
      SimLayerMap = !1;
      return;
    }
    SimLayerMap = !1;
    if (!n.Z || n.Z.type !== "map") return;
    n.Z.simMap = _v1447;
    n.Z.base = "迷雾副本";
  }
  n.sim = {
    layer: _v1443,
    depth: _v1443 * 50,
    active: !0,
    max: SIM_LAYERS,
    done: !1
  };
  (n.Z.simLayer = _v1443, n.Z.name = "迷雾副本 · 第 " + _v1443 + " 层", SimSetupRoom(_v1446, _v1443));
}
function SimSealRoom(_v1456) {
  let _v1457 = n.Z.M, _v1458 = _v1457.g, _v1459 = _v1457.W, _v1460 = _v1457.H;
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
  let _v1468 = n.Z.M, _v1469 = _v1468.rooms, _v1470 = _v1469[Math.min(_v1466, _v1469.length - 1)];
  (n.mons = [], n.objs = [], n.loots = []);
  SimSealRoom(_v1470);
  let _v1471 = ui(_v1470);
  (n.pl.x = _v1471.x, n.pl.y = _v1471.y);
  let _v1472 = (gt[n.Z.th.key] || ({})).boss || "boss", _v1473 = nt(_v1472, _v1471.x, _v1471.y - 20, n.Z.lvl + 2, 3);
  (_v1473.simBoss = !0, _v1473.aggro = !0, n.Z.boss = _v1473);
  n.mons.push(_v1473);
  let _v1474 = 1 + _v1467 * 50 / 100 * BAL.simSpawnPer100, _v1475 = Math.max(1, Math.round((3 + Math.floor(_v1467 / 5)) * _v1474));
  for (let _v1476 = 0; _v1476 < _v1475; _v1476++) {
    let _v1477 = ui(_v1470), _v1478 = nt(oe(Object.keys(n.Z.th.mon)), _v1477.x, _v1477.y, n.Z.lvl || 80, I() < 0.12 ? 2 : I() < 0.4 ? 1 : 0);
    (_v1478.aggro = !0, n.mons.push(_v1478));
  }
  SimScaleSpawns(_v1467);
  (ke("迷雾副本 · 第 " + _v1467 + "/" + SIM_LAYERS + " 层", "第 " + n.simRun.map + " 图 · 第 " + n.simRun.room + "/" + BAL.simRoomsPerMap + " 个房间 · 击杀首领后按 F 前进"), $("portal"));
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
    for (let _v1484 of n.mons) if (_v1484.rar >= 0 && _v1484.rar <= 2 && !_v1484.simBoss) _v1483[_v1484.rar].push(_v1484);
    let _v1485 = Object.keys(n.Z.th.mon);
    for (let _v1486 = 0; _v1486 < 3; _v1486++) {
      let _v1487 = _v1483[_v1486];
      if (!_v1487.length) continue;
      let _v1488 = Math.min(_v1482[_v1486] != null ? _v1482[_v1486] : 0, _v1481), _v1489 = Math.round(_v1487.length * _v1488);
      for (let _v1490 = 0; _v1490 < _v1489; _v1490++) {
        let _v1491 = oe(_v1487), _v1492 = We(_v1491.x, _v1491.y, 32), _v1493 = nt(oe(_v1485), _v1492.x, _v1492.y, n.Z.lvl || 80, _v1486);
        Object.assign(_v1493, {
          sim: !0,
          aggro: !0,
          del: !0
        });
        n.mons.push(_v1493);
      }
    }
  } catch (_v1494) {}
}
function SimTagBoss() {
  if (!n.simRun) return;
  for (let _v1495 of n.mons) {
    if (_v1495.rar !== 3 || _v1495.simBoss) continue;
    _v1495.simBoss = !0;
    if (n.simRun.layer >= n.simRun.max) {
      (_v1495.maxhp *= 5, _v1495.hp = _v1495.maxhp, _v1495.name = "最终·" + _v1495.name);
    } else _v1495.name = "拟像首领·" + _v1495.name;
  }
}
function SimBossKilled(_v1496) {
  if (!n.simRun || !_v1496 || !_v1496.simBoss || _v1496.simRewarded) return;
  _v1496.simRewarded = !0;
  let _v1497 = n.simRun.layer >= n.simRun.max, _v1498 = (_v1497 ? BAL.simFinalDivines : BAL.simLayerDivines) + (re("deli1") ? 1 : 0) + (re("deli4") ? 1 : 0) + (_v1497 && re("deli7") ? 10 : 0);
  for (let _v1499 = 0; _v1499 < _v1498; _v1499++) ue(_v1496.x, _v1496.y, {
    kind: "cur",
    cur: "divine"
  });
  let _v1500 = 2 + (re("deli3") ? 2 : 0);
  for (let _v1501 = 0; _v1501 < _v1500; _v1501++) ue(_v1496.x, _v1496.y, {
    kind: "cur",
    cur: "splinter"
  });
  if (re("deli6")) DsBoneDrop(_v1496.x, _v1496.y, 1);
  if (_v1497) {
    for (let _v1502 = 0; _v1502 < 30; _v1502++) ue(_v1496.x, _v1496.y, {
      kind: "cur",
      cur: "splinter"
    });
    for (let _v1503 = 0; _v1503 < 3; _v1503++) DsBoneDrop(_v1496.x, _v1496.y, 1);
    for (let _v1504 = 0; _v1504 < 3; _v1504++) OmDrop(_v1496.x, _v1496.y);
    let _v1505 = yt.filter(_v1506 => _v1506.src === "world" && !_v1506.noDrop);
    if (_v1505.length && I() < 0.6) ue(_v1496.x, _v1496.y, {
      kind: "it",
      it: Kt(oe(_v1505), 80)
    });
    Ua.mageblood && I() < BAL.drop.mageblood && ue(_v1496.x, _v1496.y, {
      kind: "it",
      it: Kt(Ua.mageblood, 80)
    });
    (u.delirium = Math.min(AtlasDeliriumCap(), (u.delirium || 0) + AtlasDeliriumGain(25 + (re("deli2") ? 10 : 0) + (re("deli5") ? 10 : 0))), u.simRuns = (u.simRuns || 0) + 1);
    ke("迷雾副本 · 完成", "70 层全部通过 · 最终首领掉落 20+ 神圣石");
    $("unique");
    n.simRun = null;
    n.sim = null;
  } else {
    let _v1507 = n.simRun.layer + 1, _v1508 = Math.max(1, BAL.simRoomsPerMap || 5);
    n.objs.push({
      kind: "b-simportal",
      x: _v1496.x,
      y: _v1496.y + 24,
      r: 16,
      layer: _v1507,
      label: (_v1507 - 1) % _v1508 === 0 ? "F 下一张图" : "F 下一个房间"
    });
    if (n.simRun.layer % (re("sim_resonance") ? 10 : BAL.simAtlasEvery) === 0) GrantAtlasPoint("迷雾副本");
    ke("第 " + n.simRun.layer + " 层完成", "按 F 进入第 " + (n.simRun.layer + 1) + " 层");
    $("unique");
  }
}
function SimulacrumNext() {
  if (n.simRun) SimEnterLayer(n.simRun.layer + 1);
}
function SimDmgMul(_v1509) {
  return 1 + Math.max(0, (_v1509 || 0) - 18) * 0.15;
}
function SimulacrumUpdate(_v1510) {
  let _v1511 = n.simRun;
  if (!_v1511) return;
  if (n.pl && n.pl.dead) {
    (n.simRun = null, n.sim = null, u.delirium = Math.min(AtlasDeliriumCap(), u.delirium || 0), ke("迷雾副本崩塌", "挑战失败"));
    return;
  }
  SimTagBoss();
}
function SimFinishRun() {
  (n.simRun = null, n.sim = null, u.delirium = Math.min(AtlasDeliriumCap(), u.delirium || 0));
}
function SimulacrumFinish() {
  SimFinishRun();
}
function curPage() {
  let _v1512 = [["basic", "基础通货"], ["sock", "工匠通货"], ["rune", "符文"], ["ess", "精华"], ["sig", "印记"], ["del", "破溃裂片"], ["bone", "遗存骨"], ["omen", "预兆"]];
  let _v1513 = _v1512.map(function (_v1514) {
    let _v1515 = Tt.filter(function (_v1516) {
      return q[_v1516].grp === _v1514[0];
    });
    if (!_v1515.length) return "";
    let _v1517 = _v1515.map(function (_v1518) {
      if (_v1514[0] === "omen") return `<div class="cur om${OmActive(_v1518) ? " on" : ""}${u.cur[_v1518] ? "" : " zero"}" data-act="omen" data-k="${_v1518}" data-tt="cur:${_v1518}"><img src="${Ye[_v1518]}" alt=""><span>${q[_v1518].s || q[_v1518].n}</span><b>${u.cur[_v1518] || 0}</b>${OmActive(_v1518) ? '<i class="omtag">激活</i>' : ""}</div>`;
      return `<div class="cur${n.held === _v1518 ? " sel" : ""}${u.cur[_v1518] ? "" : " zero"}" data-act="cur" data-k="${_v1518}" data-tt="cur:${_v1518}"><img src="${Ye[_v1518]}" alt=""><span>${q[_v1518].n}</span><b>${u.cur[_v1518] || 0}</b></div>`;
    }).join("");
    return `<div style="margin:10px 0 4px"><h3 style="margin:0 0 6px;font-size:13px;color:var(--mod)">${_v1514[1]} <small>${_v1515.length} 种</small></h3><div style="display:flex;flex-wrap:wrap;gap:8px">${_v1517}</div></div>`;
  }).join("");
  return `<div class="it"><section class="card"><h3>通货 <small>全角色共用 · 点击选中后使用 · 按住 Shift 连续使用</small></h3><p class="dim">按大类分行显示；预兆点击激活。全部通货与角色共享，不占背包格。</p>${_v1513}</section></div>`;
}
function jiBox(_v1519) {
  if ((_v1519.open = !0, $("craft"), $("boom", 0.6), X(0.2), E(_v1519.x, _v1519.y, 30, _v1519.riftBox ? ["#b080ff", "#ff70ff", "#fff"] : ["#ffd060", "#b08a3a", "#fff6d0"], 80, 0.9, {
    glow: !0,
    vz: 120
  }), u.stats && (u.stats.boxes = (u.stats.boxes || 0) + 1), _v1519.encBox)) {
    B5(_v1519);
    return;
  }
  Hc(_v1519.x, _v1519.y, 6 * (re("box2") ? 1.3 : 1) * (_v1519.riftBox ? 0.8 : 1), 30);
  let _v1520 = re("box6") && I() < 0.2, _v1521 = 3 * (_v1520 ? 2 : 1);
  for (let _v1522 = 0; _v1522 < _v1521; _v1522++) ue(_v1519.x, _v1519.y, {
    kind: "cur",
    cur: yc()
  });
  if ((_v1520 && U(_v1519.x, _v1519.y - 18, 0, !1, "gold", "通货翻倍"), _v1519.ornate)) for (let _v1523 = 0; _v1523 < 3; _v1523++) ue(_v1519.x, _v1519.y, {
    kind: "cur",
    cur: "chaos"
  });
  if (re("box7")) {
    let _v1524 = Tt.filter(_v1525 => q[_v1525].grp === "basic" && q[_v1525].v >= q.alch.v && _v1525 !== "divine" && _v1525 !== "exalt" && _v1525 !== "frac");
    ue(_v1519.x, _v1519.y, {
      kind: "cur",
      cur: ht(_v1524, _v1526 => q[_v1526].w)
    });
  }
  if (_v1519.riftBox) {
    I() < 0.22 + Math.min(0.13, (n.Z ? n.Z.tier : 0) * 0.008) && OmDrop(_v1519.x, _v1519.y);
    P("裂隙宝箱");
    return;
  }
  if (_v1519.abyssBox) {
    let _v1527 = n.objs.find(_v1528 => _v1528.kind === "abyss" && Math.hypot(_v1528.x - _v1519.x, _v1528.y - _v1519.y) < 80);
    (_v1527 && (_v1527.st = "opened"), u.abyssDone = (u.abyssDone || 0) + 1);
    let _v1529 = _v1519.abyssBox, _v1530 = _v1519.abyssName || "深渊保险箱", _v1531 = () => {
      (Hc(_v1519.x, _v1519.y, 10, 32), I() < 0.6 && DsBoneDrop(_v1519.x, _v1519.y, 1));
      try {
        re("abyssdom") && DsBoneDrop(_v1519.x, _v1519.y, 1);
      } catch (_v1532) {}
      for (let _v1533 = 0; _v1533 < 3 + (re("aby3") ? 2 : 0); _v1533++) ue(_v1519.x, _v1519.y, {
        kind: "cur",
        cur: yc()
      });
      if (_v1529 === "coffer") {
        (ue(_v1519.x, _v1519.y, {
          kind: "cur",
          cur: "chaos"
        }), ue(_v1519.x, _v1519.y, {
          kind: "cur",
          cur: "chaos"
        }));
      } else {
        let _v1534 = Pa.filter(_v1535 => _v1529 === "arsenal" ? _v1535.slot === "W" : ["B", "H", "G", "F"].includes(_v1535.slot)).map(_v1536 => pe[_v1536.n] || _v1536);
        _v1534.length && ue(_v1519.x, _v1519.y, {
          kind: "it",
          it: Ft(oe(_v1534), n.Z.lvl + 2, 2)
        });
      }
      I() < 0.5 && OmDrop(_v1519.x, _v1519.y);
      try {
        if (I() < 0.6 || (n.Z.tier || 0) >= 14) JewelDrop(_v1519.x, _v1519.y);
      } catch (_v1537) {}
      setTimeout(function () { try { window.__riftResetNext = true; } catch (e) {} }, 0);
    };
    (_v1531(), P(_v1530), ke(_v1530, "深渊的宝藏升起了"), E(_v1519.x, _v1519.y, 30, ["#2a6a3a", "#7dff9a", "#d8ffe0"], 90, 0.9, {
      glow: !0,
      vz: 140
    }));
    let _v1538 = yt.filter(_v1539 => _v1539.src === "world" && !_v1539.noDrop);
    _v1538.length && I() < 0.25 + (re("aby7") ? 0.25 : 0) && ue(_v1519.x, _v1519.y, {
      kind: "it",
      it: Kt(oe(_v1538), n.Z.lvl)
    });
    return;
  }
  if (_v1519.delBox) {
    (Hc(_v1519.x, _v1519.y, 8, 30), P("惊悸宝箱"));
    (DelSplinter(_v1519.x, _v1519.y), DelSplinter(_v1519.x, _v1519.y), DelSplinter(_v1519.x, _v1519.y));
    I() < 0.5 && OmDrop(_v1519.x, _v1519.y);
    I() < 0.3 && DsBoneDrop(_v1519.x, _v1519.y);
    return;
  }
  I() < (_v1519.ornate ? 0.4 : 0.12) && OmDrop(_v1519.x, _v1519.y);
  let _v1540 = re("box4") ? 4 : 7, _v1541 = n.Z.th.mon, _v1542 = Object.keys(_v1541);
  for (let _v1543 = 0; _v1543 < _v1540; _v1543++) {
    let _v1544 = We(_v1519.x, _v1519.y, 50), _v1545 = nt(ht(_v1542, _v1546 => _v1541[_v1546]), _v1544.x, _v1544.y, n.Z.lvl, 1);
    (_v1545.aggro = !0, n.mons.push(_v1545), E(_v1544.x, _v1544.y, 8, ["#8a8cff", "#fff"], 50, 0.4));
  }
  P("宝箱守卫出现了");
}
function AbyssModRoll(_v1547) {
  if (_v1547.abmod) return _v1547.abmod;
  let _v1548 = oe(Object.keys(ABMODS));
  return (_v1547.abmod = _v1548, _v1547.abmodT = B(1.5, 3), _v1548);
}
function AbyssOmenDrop(_v1549, _v1550) {
  let _v1551 = ht(AB_OMEN, _v1552 => q[_v1552].ow || 1);
  return (ue(_v1549, _v1550, {
    kind: "cur",
    cur: _v1551
  }), _v1551);
}
function AbyssMods(_v1553) {
  if (!n.Z || n.Z.type !== "map" || !n.pl || n.pl.dead) return;
  for (let _v1554 of n.mons) {
    if (_v1554.dead || !_v1554.abyss || !_v1554.abmod) continue;
    let _v1555 = _v1554.abmod;
    if ((_v1554.abmodT = (_v1554.abmodT || 0) - _v1553, _v1555 === "soul")) {
      (_v1554.soulT = (_v1554.soulT || 0) - _v1553, _v1554.soulT <= 0 && (_v1554.x - n.pl.x) ** 2 + (_v1554.y - n.pl.y) ** 2 < 7225 && (_v1554.soulT = 0.6, sa(_v1554.dmg * 0.6, "phys", {
        dot: !0,
        noCrit: !0
      })));
    } else if (_v1555 === "shade") {
      _v1554.abmodT <= 0 && (_v1554.abmodT = B(4.5, 6.5), _v1554.x = n.pl.x + B(-34, 34), _v1554.y = n.pl.y + B(-34, 34), n.fx.push({
        k: "ring",
        x: _v1554.x,
        y: _v1554.y,
        r0: 3,
        r1: 22,
        t: 0,
        max: 0.3,
        col: "#2ee6a8",
        w: 2
      }), E(_v1554.x, _v1554.y, 10, AB_GREEN, 50, 0.5, {
        glow: !0
      }), $("portal"));
    } else if (_v1555 === "rune") {
      if (_v1554.abmodT <= 0) {
        (_v1554.abmodT = B(3.2, 4.6), n.fx.push({
          k: "ring",
          x: n.pl.x,
          y: n.pl.y,
          r0: 2,
          r1: 26,
          t: 0,
          max: 0.75,
          col: "#2ee6a8",
          w: 2
        }));
        let _v1556 = n.pl.x, _v1557 = n.pl.y, _v1558 = _v1554.dmg * 1.2;
        n.pend.push({
          t: 0.85,
          fn: () => {
            (E(_v1556, _v1557, 16, AB_GREEN, 70, 0.5, {
              glow: !0
            }), $("boom", 0.4), (n.pl.x - _v1556) ** 2 + (n.pl.y - _v1557) ** 2 < 2500 && sa(_v1558, "phys", {
              area: !0
            }));
          }
        });
      }
    } else if (_v1555 === "revenant") {
      !_v1554.revSpawn && _v1554.hp < _v1554.maxhp * 0.7 && (_v1554.revSpawn = !0, n.pend.push({
        t: 0.15,
        fn: () => {
          for (let _v1559 = 0; _v1559 < 2; _v1559++) {
            let _v1560 = nt("abysswalker", _v1554.x + B(-14, 14), _v1554.y + B(-14, 14), Math.max(1, n.Z.lvl - 2), 0);
            (Object.assign(_v1560, {
              abyss: !0,
              pit: _v1554.pit,
              aggro: !0,
              name: "深渊亡魂"
            }), _v1560.maxhp *= 0.45, _v1560.hp = _v1560.maxhp, _v1560.dmg *= 0.6, n.mons.push(_v1560));
          }
          (E(_v1554.x, _v1554.y, 14, AB_GREEN, 60, 0.5, {
            glow: !0
          }), $("portal"));
        }
      }));
    } else if (_v1555 === "undying") {
      (_v1554.undT = (_v1554.undT || 0) - _v1553, _v1554.undT <= 0 && (_v1554.undT = 0.6, n.mons.forEach(_v1561 => {
        !_v1561.dead && _v1561.abyss && _v1561 !== _v1554 && (_v1561.x - _v1554.x) ** 2 + (_v1561.y - _v1554.y) ** 2 < 10000 && (_v1561.hp = Math.min(_v1561.maxhp, _v1561.hp + _v1561.maxhp * 0.05));
      })));
    }
  }
}
function AbyssFloorOK(_v1562, _v1563) {
  try {
    let _v1564 = n.Z && n.Z.M;
    if (!_v1564 || !_v1564.g) return !0;
    let _v1565 = Math.floor(_v1562 / K), _v1566 = Math.floor(_v1563 / K);
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
  let _v1575 = Math.max(1, Math.round(de(3, 5) * (re("abyssdom") ? 1.5 : 1))), _v1576 = (n.Z.M && n.Z.M.rooms || []).filter(_v1577 => !_v1577.boss);
  for (let _v1578 = 0; _v1578 < _v1575; _v1578++) {
    let _v1579 = _v1576[_v1578 % Math.max(1, _v1576.length)] || (n.Z.M.rooms || [])[0], _v1580 = _v1579 ? ui(_v1579) : We(_v1572, _v1573, 70 + _v1578 * 42);
    if (!_v1579) {
      (_v1580.x = $e(_v1580.x, 48, n.Z.M.W * K - 48), _v1580.y = $e(_v1580.y, 48, n.Z.M.H * K - 48));
    }
    for (let _v1581 = 0; _v1581 < 24 && (!AbyssFloorOK(_v1580.x, _v1580.y) || AbyssWallGap(_v1580.x, _v1580.y) < 28); _v1581++) {
      _v1580 = _v1579 ? ui(_v1579) : We(_v1572, _v1573, 70 + _v1578 * 42);
      if (!_v1579) {
        (_v1580.x = $e(_v1580.x, 48, n.Z.M.W * K - 48), _v1580.y = $e(_v1580.y, 48, n.Z.M.H * K - 48));
      }
    }
    if (!AbyssFloorOK(_v1580.x, _v1580.y)) {
      (_v1580.x = $e(_v1580.x, 48, n.Z.M.W * K - 48), _v1580.y = $e(_v1580.y, 48, n.Z.M.H * K - 48));
    }
    let _v1582 = {
      x: _v1580.x,
      y: _v1580.y,
      closed: !1,
      kills: 0,
      need: 1 + (re("abyssdom") ? 1 : 0)
    };
    _v1574.fissures.push(_v1582);
    for (let _v1583 = 0; _v1583 < 3; _v1583++) {
      let _v1584 = We(_v1582.x, _v1582.y, 30);
      for (let _v1585 = 0; _v1585 < 16 && !AbyssFloorOK(_v1584.x, _v1584.y); _v1585++) _v1584 = We(_v1582.x, _v1582.y, 30);
      if (!AbyssFloorOK(_v1584.x, _v1584.y)) {
        (_v1584.x = _v1582.x, _v1584.y = _v1582.y);
      }
      let _v1586 = nt(oe(Object.keys(n.Z.th.mon)), _v1584.x, _v1584.y, n.Z.lvl, I() < 0.16 ? 1 : 0);
      (_v1586.weak = !0, _v1586.dmg *= 0.75, _v1586.maxhp *= 0.85, _v1586.hp = _v1586.maxhp, _v1586.aggro = !0, n.mons.push(_v1586));
    }
  }
  for (let _v1587 of n.mons) !_v1587.abyss && !_v1587.weak && _v1574.fissures.some(_v1588 => (_v1588.x - _v1587.x) ** 2 + (_v1588.y - _v1587.y) ** 2 < 8100) && (_v1587.weak = !0, _v1587.dmg *= 0.75);
  return _v1574;
}
function AbyssAnnounce(_v1589) {
  _v1589.seen = !0;
  let _v1590 = _v1589.fissures.length;
  (ke("深渊裂缝", "击杀裂缝附近的怪物来关闭裂缝 · 共 " + _v1590 + " 道"), $("portal"), X(0.15), E(_v1589.x, _v1589.y, 26, AB_GREEN, 70, 0.9, {
    glow: !0,
    vz: 120
  }));
}
function AbyssCloseFissure(_v1591, _v1592) {
  (_v1592.closed = !0, E(_v1592.x, _v1592.y, 20, AB_GREEN, 70, 0.8, {
    glow: !0,
    vz: 110
  }), $("boom", 0.5), P("深渊裂缝关闭 (" + _v1591.fissures.filter(_v1593 => _v1593.closed).length + "/" + _v1591.fissures.length + ")"));
  let _v1594 = 3 + (I() < 0.3 ? 1 : 0);
  for (let _v1595 = 0; _v1595 < _v1594; _v1595++) {
    let _v1596 = We(_v1592.x, _v1592.y, 26), _v1597 = nt(oe(["abysswalker", "abyssshambler", "abyssstrangler"]), _v1596.x, _v1596.y, n.Z.lvl, I() < 0.08 ? 1 : 0);
    (_v1597.abyss = !0, _v1597.pit = _v1591, _v1597.aggro = !0, I() < (_v1597.rar >= 2 ? 1 : _v1597.rar === 1 ? 0.35 : 0.06) && AbyssModRoll(_v1597), n.mons.push(_v1597));
  }
  _v1591.fissures.every(_v1598 => _v1598.closed) && AbyssOpenPit(_v1591);
}
function AbyssOpenPit(_v1599) {
  if (_v1599.st !== "fissures") return;
  _v1599.st = "pit";
  _v1599.waveT = 1.2;
  let _v1600 = 9 + Math.min(8, Math.round((n.Z.tier || 1) / 2)), _v1601 = I() < 0.3 + (re("aby5") ? 0.2 : 0) ? oe(AB_LICHBORN) : null;
  _v1601 && (_v1599.lichborn = _v1601.n);
  for (let _v1602 = 0; _v1602 < _v1600; _v1602++) {
    let _v1603 = We(_v1599.x, _v1599.y, 40 + _v1602 % 3 * 28), _v1604 = nt(oe(["abysswalker", "abyssshambler", "abyssstrangler"]), _v1603.x, _v1603.y, n.Z.lvl, I() < 0.12 ? 2 : 0);
    if (_v1601 && _v1602 === 0) {
      (Object.assign(_v1604, {
        spr: "abysslich",
        h: Xt.abysslich.h,
        r: 9,
        abyss: !0,
        pit: _v1599,
        aggro: !0,
        lichborn: _v1601.k,
        name: _v1601.n + " · 深渊行者"
      }), _v1604.maxhp *= 2.6, _v1604.hp = _v1604.maxhp, _v1604.dmg *= 1.25, _v1604.rar = 2);
    } else (_v1604.abyss = !0, _v1604.pit = _v1599, _v1604.aggro = !0);
    I() < (_v1604.rar >= 2 ? 1 : _v1604.rar === 1 ? 0.4 : 0.08) && AbyssModRoll(_v1604);
    n.mons.push(_v1604);
  }
  (ke("深渊巨坑开启", "大量深渊怪物涌了出来" + (_v1601 ? " · " + _v1601.n + " 在其中" : "")), $("unique"), X(0.25), E(_v1599.x, _v1599.y, 60, AB_GREEN, 110, 1.1, {
    glow: !0,
    vz: 160
  }));
}
function AbyssSeal(_v1605) {
  if (_v1605.st !== "pit") return;
  _v1605.st = "sealed";
  let _v1606 = oe(AB_TROVE);
  (ke("深渊巨坑关闭", "深渊保险箱正在升起"), $("unique"), E(_v1605.x, _v1605.y, 34, AB_GREEN, 90, 1, {
    glow: !0,
    vz: 140
  }), n.pend.push({
    t: 0.85,
    fn: () => {
      let _v1607 = We(_v1605.x, _v1605.y, 10);
      try {
        for (let __bt = 0; __bt < 40; __bt++) {
          let __bFree = !At(_v1607.x, _v1607.y) && (typeof AbyssFloorOK !== "function" || AbyssFloorOK(_v1607.x, _v1607.y));
          if (__bFree) {
            for (let __bo = 0; __bo < n.objs.length; __bo++) {
              let __bx = n.objs[__bo];
              if (__bx && Math.hypot(__bx.x - _v1607.x, __bx.y - _v1607.y) < 26) { __bFree = false; break; }
            }
          }
          if (__bFree) break;
          let __ba = __bt * 2.399, __br = 12 + (__bt % 8) * 10;
          _v1607 = { x: _v1605.x + Math.cos(__ba) * __br, y: _v1605.y + Math.sin(__ba) * __br };
        }
      } catch (eBt) {}
      try {
        for (let __abi = 0; __abi < 3; __abi++) ue(_v1607.x, _v1607.y, { kind: "cur", cur: yc() });
        if (_v1606.k === "coffer") {
          ue(_v1607.x, _v1607.y, { kind: "cur", cur: "chaos" });
          ue(_v1607.x, _v1607.y, { kind: "cur", cur: "chaos" });
        } else {
          let __abPool = Pa.filter(function (b) { return _v1606.k === "arsenal" ? b.slot === "W" : ["B", "H", "G", "F"].indexOf(b.slot) >= 0; }).map(function (b) { return pe[b.n] || b; });
          if (__abPool.length) ue(_v1607.x, _v1607.y, { kind: "it", it: Ft(oe(__abPool), n.Z.lvl + 2, 2) });
        }
        if (I() < 0.6) DsBoneDrop(_v1607.x, _v1607.y, 1);
        if (I() < 0.5) OmDrop(_v1607.x, _v1607.y);
        if (I() < 0.6 || (n.Z.tier || 0) >= 14) JewelDrop(_v1607.x, _v1607.y);
      } catch (__abe) {}
      (n.objs.push({
        kind: "box",
        x: _v1607.x,
        y: _v1607.y,
        r: 6,
        open: !1
      }), _v1605.st = "done", ke(_v1606.n, "深渊的宝藏升起了"), E(_v1607.x, _v1607.y, 26, AB_GREEN, 80, 0.9, {
        glow: !0,
        vz: 130
      }));
    }
  }));
}
function AbyssUpdate(_v1608) {
  if (!n.Z || n.Z.type !== "map" || !n.pl || n.pl.dead) return;
  for (let _v1609 of n.objs) {
    if (_v1609.kind !== "abyss") continue;
    (!_v1609.seen && (_v1609.x - n.pl.x) ** 2 + (_v1609.y - n.pl.y) ** 2 < 90000 && AbyssAnnounce(_v1609), _v1609.st === "fissures" && _v1609.fissures.forEach(_v1610 => {
      !_v1610.closed && I() < 0.012 && n.parts.push({
        x: _v1610.x + B(-10, 10),
        y: _v1610.y + B(-6, 6),
        z: 1,
        vx: 0,
        vy: 0,
        vz: B(14, 30),
        g: -6,
        life: 0.8,
        max: 0.8,
        col: oe(AB_GREEN),
        s: 1,
        glow: !0,
        drag: 0
      });
    }), _v1609.st === "pit" && (_v1609.waveT -= _v1608, _v1609.waveT <= 0 && !n.mons.some(_v1611 => _v1611.abyss && _v1611.pit === _v1609 && !_v1611.dead) && AbyssSeal(_v1609)));
  }
}
function AbyssOnKill(_v1612) {
  if (!n.Z || n.Z.type !== "map") return;
  for (let _v1613 of n.objs) {
    if (_v1613.kind !== "abyss" || _v1613.st !== "fissures" || _v1612.abyss) continue;
    for (let _v1614 of _v1613.fissures) if (!_v1614.closed && (_v1614.x - _v1612.x) ** 2 + (_v1614.y - _v1612.y) ** 2 < 9025) {
      (_v1614.kills = (_v1614.kills || 0) + 1, _v1614.kills >= _v1614.need && AbyssCloseFissure(_v1613, _v1614));
      break;
    }
  }
}
function ExCalc(_v1615, _v1616, _v1617) {
  let _v1618 = q[_v1615], _v1619 = q[_v1616];
  if (!_v1618 || !_v1619) return {
    err: "不能兑换这一项"
  };
  _v1617 = Math.floor(+_v1617 || 0);
  if (!(_v1617 > 0)) return {
    err: "数量至少 1"
  };
  let _v1620 = u.cur[_v1615] || 0;
  if (_v1617 > _v1620) return {
    err: "只有 " + _v1620 + " 个" + _v1618.n
  };
  let _v1621 = ExC(_v1615), _v1622 = Math.round(ExC(_v1616) * ShopHeatMult("ex:" + _v1616)), _v1623 = _v1617 * _v1621, _v1624 = Math.floor(_v1623 / _v1622);
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
  let _v1625 = Qa.ex, _v1626 = ExCalc(_v1625.from, _v1625.to, _v1625.amt), _v1627 = C("#exOut"), _v1628 = C("#exGo");
  if (!_v1627) return;
  if (_v1626.err) {
    (_v1627.innerHTML = `<div class="exerr">${O(_v1626.err)}</div>`, _v1628 && (_v1628.disabled = !0, _v1628.classList.add("no")));
    return;
  }
  (_v1627.innerHTML = `<div class="exline">给出 <b>${_v1626.n}</b> × <span style="color:${q[_v1625.from].col}">${q[_v1625.from].n}</span> = <b>${Gt(_v1626.total / 100)}</b>c</div><div class="exline">得到 <b>${_v1626.got}</b> × <span style="color:${q[_v1625.to].col}">${q[_v1625.to].n}</span> <small class="exdim">= ${Gt(_v1626.used / 100)}c</small></div>${_v1626.left ? `<div class="exdim">尾数 ${Gt(_v1626.left / 100)}c 不找零</div>` : ""}`, _v1628 && (_v1628.disabled = !1, _v1628.classList.remove("no")));
}
function ExDo() {
  let _v1629 = Qa.ex, _v1630 = ExCalc(_v1629.from, _v1629.to, _v1629.amt);
  if (_v1630.err) return (P(_v1630.err), $("nomana", 0.5), !1);
  return (u.cur[_v1629.from] -= _v1630.n, u.cur[_v1629.to] = (u.cur[_v1629.to] || 0) + _v1630.got, ShopHeatBump("ex:" + _v1629.to), P("通货兑换 · " + _v1630.n + " " + q[_v1629.from].n + " → " + _v1630.got + " " + q[_v1629.to].n + (ShopHeatMult("ex:" + _v1629.to) > 1.0001 ? "（涨价 ×" + ShopHeatMult("ex:" + _v1629.to).toFixed(2) + "）" : "")), $("pick"), !0);
}
function ExWantApply() {
  let wantEl = C("#exWant");
  let want = Math.max(1, Math.floor(+(wantEl && wantEl.value || 1)));
  let cost = Math.round(ExC(Qa.ex.to) * ShopHeatMult("ex:" + Qa.ex.to));
  let fromV = ExC(Qa.ex.from);
  if (!cost || !fromV) return P("无法计算兑换数量");
  let need = Math.max(1, Math.ceil(want * cost / fromV));
  Qa.ex.amt = need;
  if (C("#exAmt")) C("#exAmt").value = need;
  ExPrev();
  P("想要 " + want + " 个" + q[Qa.ex.to].n + " · 需要 " + need + " 个" + q[Qa.ex.from].n);
}
function ExSelectionRefresh() {
  try {
    document.querySelectorAll("#overlay [data-exfrom]").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-exfrom") === Qa.ex.from); });
    document.querySelectorAll("#overlay [data-exto]").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-exto") === Qa.ex.to); });
    var h4s = document.querySelectorAll("#overlay .exside h4 small");
    if (h4s[0]) h4s[0].textContent = q[Qa.ex.from].n;
    if (h4s[1]) h4s[1].textContent = q[Qa.ex.to].n;
    var rate = document.querySelector("#overlay .exrate");
    if (rate) rate.textContent = "1 " + q[Qa.ex.from].n + " = " + Gt(q[Qa.ex.from].v / (q[Qa.ex.to].v * ShopHeatMult("ex:" + Qa.ex.to))) + " " + q[Qa.ex.to].n;
    ExPrev();
  } catch (e) {}
}
function ExBody() {
  let _v1631 = Qa.ex, _v1632 = ExAll(), _v1633 = u.cur[_v1631.from] || 0;
  (_v1631.amt > _v1633 && (_v1631.amt = _v1633 > 0 ? _v1633 : 1), _v1632.includes(_v1631.from) || (_v1631.from = _v1632[0]), _v1632.includes(_v1631.to) || (_v1631.to = _v1632[1] || _v1632[0]));
  let _v1634 = (_v1635, _v1636) => {
    let _v1637 = (_v1636 === "from" ? _v1631.from : _v1631.to) === _v1635, _v1638 = q[_v1635];
    return `<button class="exchip${_v1637 ? " on" : ""}" data-${_v1636 === "from" ? "exfrom" : "exto"}="${_v1635}" data-tt="cur:${_v1635}"><img src="${Ye[_v1635]}" alt=""><span>${_v1638.s || _v1638.n}</span><i>${Gt(_v1638.v)}c</i><b>${u.cur[_v1635] || 0}</b></button>`;
  };
  let _exGroupName = g => ({ basic: "基础通货", sock: "工匠", ess: "精华", omen: "预兆", bone: "遗存骨骸", rune: "符文", sig: "印记", other: "其他" })[g] || "其他";
  let _exOrder = ["basic", "sock", "ess", "omen", "bone", "rune", "other"];
  let _exGroups = (_v1645, _v1646) => {
    let map = {};
    _v1645.forEach(id => { let g = q[id].grp || "other"; (map[g] = map[g] || []).push(id); });
    return _exOrder.map(g => {
      let arr = map[g] || [];
      if (!arr.length) return "";
      return `<details class="exfold" open><summary>${_exGroupName(g)} <small>${arr.length}</small></summary><div class="exgrid">${arr.map(id => _v1634(id, _v1646)).join("")}</div></details>`;
    }).join("");
  };
  return `<div class="exc"><p class="exc-hint">汇率取作者标注的混沌石等价 · 兑换向下取整, 尾数不找零</p>
		 <div class="excols">
		  <section class="exside"><h4>给出 <small>${q[_v1631.from].n}</small></h4>${_exGroups(_v1632, "from")}</section>
		  <section class="exmid"><h4>交换</h4>
		   <div class="exrate">1 ${q[_v1631.from].n} = ${Gt(q[_v1631.from].v / (q[_v1631.to].v * ShopHeatMult("ex:" + _v1631.to)))} ${q[_v1631.to].n}</div>${ShopHeatMult("ex:" + _v1631.to) > 1.0001 ? `<div class="exdim" style="color:#e8c870">该通货需求涨价 ×${ShopHeatMult("ex:" + _v1631.to).toFixed(2)} · 2 分钟无购买后每 30 秒降 50%</div>` : ""}
		   <label class="examt">数量 <input id="exAmt" type="number" min="0" step="1" value="${_v1631.amt}"></label>
		   <div class="exq"><button data-examt="1">+1</button><button data-examt="10">+10</button><button data-examt="100">+100</button><button data-examt="max">最大</button></div>
		   <label class="examt">想要得到 <input id="exWant" type="number" min="1" step="1" value="1"></label>
		   <button class="btn small" data-exwant="1">按需求计算所需数量</button>
		   <div class="exout" id="exOut"></div>
		   <button class="btn primary" id="exGo" disabled>确认兑换</button>
		  </section>
		  <section class="exside"><h4>得到 <small>${q[_v1631.to].n}</small></h4>${_exGroups(_v1632, "to")}</section>
		 </div></div>`;
}
function UniqueResCap() {
  try {
    let _v1641 = u && u.equip && u.equip.body;
    if (_v1641 && _v1641.uniq === "kaoms_heart") return 70;
  } catch (_v1642) {}
  return 90;
}
function GrantAtlasPoint(_v1643) {
  try {
    if (!n || !n.Z || n.Z.type !== "map") return;
    n.Z.bFlags = n.Z.bFlags || ({});
    if (n.Z.bFlags[_v1643]) return;
    n.Z.bFlags[_v1643] = 1;
    if ((u.atlasPts || 0) < Br) {
      u.atlasPts = (u.atlasPts || 0) + 1;
      P("图谱点 +1 · " + _v1643 + " · 按 U 打开图谱加点");
    } else P("图谱点已达上限");
  } catch (_v1644) {}
}
function RitualMapCheck() {
  try {
    if (!n || !n.Z || n.Z.type !== "map") return;
    let _v1645 = 0, _v1646 = 0;
    for (let _v1647 of n.objs) {
      if (_v1647.kind !== "ritual") continue;
      _v1645++;
      if (_v1647.st === "done") _v1646++;
    }
    if (_v1645 > 0 && _v1646 >= _v1645) GrantAtlasPoint("驱灵仪式");
  } catch (_v1648) {}
}
Object.assign(pS, {
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
Object.assign(q, {
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
    v: 1200,
    w: 0,
    ow: 6,
    mt: 14,
    og: "exaltop",
    grp: "omen",
    col: "#5fe0c0",
    d: "你的下一个通货只会改变特殊词缀栏的词缀（仅限该装备按普通规则本来就能用的通货；特殊栏满时替换一条）"
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
    d: "你的下一个废除石只会移除前缀"
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
    d: "你的下一个废除石只会移除后缀"
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
    d: "你的下一个废除石只移除一条渎灵词缀（剥离石仍会清空全部词缀）"
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
    v: 24,
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
    v: 90,
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
    v: 270,
    w: 0,
    ow: 4,
    mt: 14,
    grp: "bone",
    col: "#efe0b0",
    d: "对一件稀有装备渎灵: 添加 1 条未揭示的渎灵词缀, 在灵魂之井揭示(3 选 1)。最高阶骨, 可出最高一档词缀"
  }
});
Object.assign(XC, {
  omen: "预兆",
  bone: "遗存骨",
  del: "碎片"
});
Object.assign($t, {
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
Ks.push({
  key: "deli",
  n: "迷雾副本",
  col: "#c8a8ff",
  vr: "叠加",
  d: "70 层迷雾副本的专精: 更多神圣石、裂片、遗存骨与持久亢奋",
  nodes: [{
    k: "deli1",
    n: "拟像亲和",
    d: "每层拟像首领额外 +1 神圣石"
  }, {
    k: "deli2",
    n: "亢奋共鸣",
    d: "完成 70 层拟像额外 +10% 持久亢奋"
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
Br = 56;
$m.push("bone_gnawed", "bone_preserved", "bone_ancient");
Object.assign(Am, {
  bone_gnawed: "稀装渎灵 · 低阶骨",
  bone_preserved: "稀装渎灵 · 中阶骨",
  bone_ancient: "稀装渎灵 · 远古骨"
});
yj = new Set(["device", "vendor", "stash", "bench", "altar", "monument", "dog", "well", "ritual", "simulacrum"]);
Object.assign(Qa, {
  ex: {
    from: "chaos",
    to: "divine",
    amt: 1
  }
});
SC = (_v1649, _v1650, _v1651, _v1652) => Sm(_v1649).filter(_v1653 => _v1653.t === _v1650 && _v1653.lv[0] <= _v1649.ilvl && (!_v1653.slots || _v1653.slots.includes(_v1649.slot)) && ic(_v1649, _v1653) && !_v1653.dsec && !_v1652.some(_v1654 => _v1654.id === _v1653.id) && (!_v1651 || _v1651.includes(_v1653.id)));
os = function () {
  if (Ge) {
    Ge.state === "suspended" && Ge.resume();
    return;
  }
  try {
    (Ge = new (window.AudioContext || window.webkitAudioContext)(), Ar = Ge.createGain(), Ar.gain.value = 0.28);
    let _v1655 = Ge.createDynamicsCompressor();
    (_v1655.threshold.value = -18, _v1655.knee.value = 12, _v1655.ratio.value = 3, _v1655.attack.value = 0.008, _v1655.release.value = 0.28);
    let _v1656 = Ge.createBiquadFilter(), _v1657 = Ge.createBiquadFilter(), _v1658 = Ge.createBiquadFilter(), _v1659 = Ge.createDynamicsCompressor();
    (_v1656.type = "peaking", _v1656.frequency.value = 240, _v1656.gain.value = 1.4, _v1656.Q.value = 0.7, _v1657.type = "highshelf", _v1657.frequency.value = 5200, _v1657.gain.value = -5.5, _v1658.type = "lowpass", _v1658.frequency.value = 13000, _v1658.Q.value = 0.4, _v1659.threshold.value = -3, _v1659.knee.value = 4, _v1659.ratio.value = 14, _v1659.attack.value = 0.002, _v1659.release.value = 0.12, Ar.connect(_v1656), _v1656.connect(_v1657), _v1657.connect(_v1658), _v1658.connect(_v1655), _v1655.connect(_v1659), _v1659.connect(Ge.destination), p0 = Ge.createGain(), p0.connect(Ar), wi = Ge.createGain(), wi.gain.value = 0.6, wi.connect(Ar), d0 = Ge.createBuffer(1, Ge.sampleRate * 2 | 0, Ge.sampleRate));
    let _v1660 = d0.getChannelData(0);
    for (let _v1661 = 0; _v1661 < _v1660.length; _v1661++) _v1660[_v1661] = I() * 2 - 1;
    ff = Ge.createConvolver();
    let _v1662 = Ge.sampleRate * 1.4 | 0, _v1663 = Ge.createBuffer(2, _v1662, Ge.sampleRate);
    for (let _v1664 = 0; _v1664 < 2; _v1664++) {
      let _v1665 = _v1663.getChannelData(_v1664);
      for (let _v1666 = 0; _v1666 < _v1662; _v1666++) _v1665[_v1666] = (I() * 2 - 1) * Math.pow(1 - _v1666 / _v1662, 3.2);
    }
    ff.buffer = _v1663;
    let _v1667 = Ge.createGain();
    (_v1667.gain.value = 0.35, ff.connect(_v1667), _v1667.connect(Ar));
    let _v1668 = Ge.createBufferSource();
    (_v1668.buffer = d0, _v1668.loop = !0);
    let _v1669 = Ge.createBiquadFilter();
    (_v1669.type = "lowpass", _v1669.frequency.value = 300);
    let _v1670 = Ge.createGain();
    (_v1670.gain.value = 0.09, _v1668.connect(_v1669), _v1669.connect(_v1670), _v1670.connect(wi), _v1668.start());
  } catch {
    Ge = null;
  }
};
V = function (_v1671, _v1672, _v1673, _v1674, _v1675, _v1676, _v1677) {
  let _v1678 = Ge.createOscillator(), _v1679 = Ge.createGain();
  (_v1678.type = _v1671, _v1678.frequency.setValueAtTime(_v1672, _v1676), _v1673 && _v1678.frequency.exponentialRampToValueAtTime(Math.max(20, _v1673), _v1676 + _v1674), _v1679.gain.setValueAtTime(1e-4, _v1676), _v1679.gain.linearRampToValueAtTime(_v1675, _v1676 + 0.012), _v1679.gain.exponentialRampToValueAtTime(1e-4, _v1676 + Math.max(_v1674, 0.03)), _v1678.connect(_v1679), _v1679.connect(p0), _v1677 && _v1679.connect(ff), _v1678.start(_v1676), _v1678.stop(_v1676 + _v1674 + 0.03));
};
ce = function (_v1680, _v1681, _v1682, _v1683, _v1684, _v1685, _v1686, _v1687) {
  let _v1688 = Ge.createBufferSource();
  _v1688.buffer = d0;
  let _v1689 = Ge.createBiquadFilter();
  (_v1689.type = _v1682, _v1689.frequency.setValueAtTime(_v1683, _v1685), _v1684 && _v1689.frequency.exponentialRampToValueAtTime(_v1684, _v1685 + _v1680), _v1689.Q.value = _v1686 || 1);
  let _v1690 = Ge.createGain();
  (_v1690.gain.setValueAtTime(1e-4, _v1685), _v1690.gain.linearRampToValueAtTime(_v1681, _v1685 + 0.008), _v1690.gain.exponentialRampToValueAtTime(1e-4, _v1685 + Math.max(_v1680, 0.03)), _v1688.connect(_v1689), _v1689.connect(_v1690), _v1690.connect(p0), _v1687 && _v1690.connect(ff), _v1688.start(_v1685, I() * 1.5), _v1688.stop(_v1685 + _v1680 + 0.03));
};
$ = function (_v1691, _v1692 = 1) {
  if (n.muted) return;
  let _v1693 = _v1692 * 0.92, _v1694 = 1 + (I() - 0.5) * 0.035;
  const _v1695 = __uploadedSfxMap[_v1691];
  if (_v1695) {
    for (const _v1696 of _v1695) {
      const [_v1697, _v1698, _v1699, _v1700 = 0, _v1701 = 0] = _v1696;
      if (_v1700 > 0) setTimeout(() => {
        if (!n.muted) playAssetSfx(_v1697, Math.min(1, _v1698 * _v1693), _v1699 * _v1694, _v1701);
      }, _v1700); else playAssetSfx(_v1697, Math.min(1, _v1698 * _v1693), _v1699 * _v1694, _v1701);
    }
    return;
  }
  if (!Ge) return;
  let _v1702 = Ge.currentTime;
  if (!(th[_v1691] && _v1702 - th[_v1691] < 0.05)) {
    th[_v1691] = _v1702;
    try {
      zn[_v1691](_v1702 + 0.006, _v1693);
    } catch {}
  }
};
rb = function (_v1703, _v1704, _v1705) {
  if (!Ge || n.muted) return;
  let _v1706 = Ge.currentTime;
  if (_v1703 === "light" && _v1706 - nb < 0.03) return;
  nb = _v1706;
  let _v1707 = _v1706 + 0.003, _v1708 = ({
    light: 0.4,
    mid: 0.7,
    heavy: 0.95,
    super: 1.1
  })[_v1703];
  try {
    (ce(0.025, 0.2 * _v1708, "highpass", 2400, 0, _v1707, 1), ce(0.05 + 0.05 * _v1708, 0.3 * _v1708, "bandpass", 650 + I() * 350, 280, _v1707, 1.6), _v1703 !== "light" && V("sine", 165 + I() * 35, 46, 0.1 + 0.14 * _v1708, 0.55 * _v1708, _v1707), _v1705 && (V("triangle", 1900 + I() * 300, 1200, 0.16, 0.07, _v1707), V("triangle", 2800, 1800, 0.12, 0.045, _v1707)), _v1704 === "fire" && ce(0.18, 0.12 * _v1708, "lowpass", 1400, 200, _v1707), _v1704 === "cold" && V("triangle", 2400, 1600, 0.15, 0.05 * _v1708, _v1707), _v1704 === "light" && V("square", 1100, 300, 0.07, 0.045 * _v1708, _v1707), (_v1703 === "heavy" || _v1703 === "super") && (ce(0.55 * _v1708, 0.28 * _v1708, "lowpass", 420, 60, _v1707 + 0.01, 1, !0), LS(0.15, 0.35)));
  } catch {}
};
eR = function () {
  for (let _v1709 in Ht) Ht[_v1709].fr = jS.map((_v1710, _v1711) => Bt("hero_" + _v1709 + _v1711, Ht[_v1709].rows.concat(Ht[_v1709].legs ? Ht[_v1709].legs[_v1711] : _v1710), {
    ...Ht[_v1709].pal
  }));
  (Bt("zombie", ["....aaaa....", "...abbbba...", "...acbbca...", "...abbbba...", "...abddba...", "..aaabbaaa..", ".abeeeeeeba.", "ab.eeffee.ba", "b..eeeeee..b", "...eeeeee...", "...aeeeea...", "...ah..ha...", "...ah..ha...", "..aah..haa.."], {
    b: "#6f8a5a",
    c: "#d8f070",
    d: "#3a1414",
    e: "#4a4038",
    f: "#7a2020",
    h: "#3a3a2a"
  }), Bt("skel", ["...aaaa....", "..abbbba...", "..acbbca...", "..abbbba..e", "...addda.e.", "..aabba..e.", ".ab.abba.e.", "ab.abbbabe.", "...abbba.e.", "...a.b.a..e", "....b.b....", "...ab.ba...", "...b...b...", "..bb...bb.."], {
    b: "#d8d0b8",
    c: "#ff4030",
    d: "#8a8070",
    e: "#9a6a32"
  }), Bt("imp", sb, {
    b: "#c8401a",
    c: "#ffe060",
    d: "#401008",
    e: "#ff9a40"
  }), Bt("riftling", sb, {
    b: "#6a3aa8",
    c: "#ff70ff",
    d: "#200838",
    e: "#b080ff"
  }), Bt("abyssling", sb, {
    b: "#1e6a3a",
    c: "#7dff9a",
    d: "#06180c",
    e: "#3fd070"
  }), Bt("cultist", ["....aa....", "...abba...", "..abbbba..", "..abccba..", "..acddca..", "..abccba..", "...abba...", "..aeeeea..", ".aeeffeea.", "gaeeffeeag", ".aeeffeea.", ".aeeeeeea.", ".aeeeeeea.", "aeeeeeeeea", "aaaaaaaaaa"], {
    b: "#2a4a6a",
    c: "#0c141c",
    d: "#80e8ff",
    e: "#3a5a7a",
    f: "#a8d0e8",
    g: "#c8f4ff"
  }), Bt("brute", ["......aaaa......", ".....abbbba.....", "....abcbbcba....", "....abbbbbba....", "..aaabddddbaaa..", ".abbbbbbbbbbbba.", "abeeebbbbbbeeeba", "abeeebbffbbeeeba", "abbba.bbbb.abbba", ".aa...bbbb...aa.", ".....bggggb.....", ".....bb..bb.....", "....abb..bba....", "....aaa..aaa...."], {
    b: "#7a6a58",
    c: "#ff3020",
    d: "#e8e0c8",
    e: "#c8c0a8",
    f: "#5a4a3a",
    g: "#3a2a20"
  }), Bt("boss", ["....a............a....", "...ab............ba...", "...abb..aaaaaa..bba...", "....abbabbbbbbabba....", ".....abbbbbbbbbba.....", "....abbcbbbbbbcbba....", "....abbbbbbbbbbbba....", ".....abbddddddbba.....", "...aaabbbbbbbbbbaaa...", "..abbbeeeeeeeeeebbba..", ".abbbeeeeffffeeeebbba.", ".abbaeeeffggffeeeabba.", ".abba.eeffggffee.abba.", ".abba.eeeffffeee.abba.", "..hh..eeeeeeeeee..hh..", "..hh...eeeeeeee...hh..", ".......aeeeeeea.......", "......abbb..bbba......", "......abb....bba......", ".....abbb....bbba.....", ".....aaaa....aaaa....."], {
    b: "#3a2a40",
    c: "#ff6020",
    d: "#ff9a40",
    e: "#5a4064",
    f: "#8a3050",
    g: "#ffd060",
    h: "#d8d0d0"
  }), Bt("abysslich", ["....a............a....", "...ab............ba...", "...abb..aaaaaa..bba...", "....abbabbbbbbabba....", ".....abbbbbbbbbba.....", "....abbcbbbbbbcbba....", "....abbbbbbbbbbbba....", ".....abbddddddbba.....", "...aaabbbbbbbbbbaaa...", "..abbbeeeeeeeeeebbba..", ".abbbeeeeffffeeeebbba.", ".abbaeeeffggffeeeabba.", ".abba.eeffggffee.abba.", ".abba.eeeffffeee.abba.", "..hh..eeeeeeeeee..hh..", "..hh...eeeeeeee...hh..", ".......aeeeeeea.......", "......abbb..bbba......", "......abb....bba......", ".....abbb....bbba.....", ".....aaaa....aaaa....."], {
    b: "#123a22",
    c: "#b8ff60",
    d: "#7dff9a",
    e: "#1e5a34",
    f: "#2a7a46",
    g: "#d8ffe0",
    h: "#c8e8c0"
  }), Bt("dummy", ["...aaaa...", "..abbbba..", "..abccba..", "..abbbba..", "aaaabbaaaa", "abbbbbbbba", "aaaabbaaaa", "...abba...", "...abba...", "...abba...", "...abba...", "..aaaaaa..", ".abbbbbba."], {
    b: "#8a6a42",
    c: "#c8a070"
  }), Bt("box", [".aaaaaaaa.", "abbbbbbbba", "acccddccca", "abbbddbbba", "abbbbbbbba", "acccccccca", "abbbbbbbba", "aaaaaaaaaa"], {
    b: "#6a4a2a",
    c: "#b08a3a",
    d: "#ffd060"
  }));
  for (let _v1712 of ["zombie", "skel", "imp", "cultist", "brute", "boss", "dummy"]) $t[_v1712].h = Xt[_v1712].h;
  $t.rift.h = Xt.riftling.h;
  ($t.abysswalker.h = Xt.abyssling.h, $t.abyssshambler.h = Math.round(Xt.abyssling.h * 1.05), $t.abyssstrangler.h = Math.round(Xt.abyssling.h * 1.2));
  for (let _v1713 in ob) {
    let _v1714 = Cr(ob[_v1713], {
      a: "#14101a",
      ...ES[_v1713]
    });
    (Ha[_v1713] = _v1714, mt[_v1713] = _v1714.toDataURL());
  }
  for (let _v1715 of Tt) {
    let _v1716 = document.createElement("canvas");
    (_v1716.width = 9, _v1716.height = 9);
    let _v1717 = _v1716.getContext("2d"), _v1718 = q[_v1715].col, _v1719 = (_v1720, _v1721, _v1722) => {
      (_v1717.fillStyle = _v1722, _v1717.fillRect(_v1720, _v1721, 1, 1));
    };
    for (let _v1723 = 0; _v1723 < 9; _v1723++) for (let _v1724 = 0; _v1724 < 9; _v1724++) {
      let _v1725 = Math.hypot(_v1724 - 4, _v1723 - 4);
      _v1725 <= 4.2 && _v1719(_v1724, _v1723, _v1725 > 3.4 ? "#120e14" : _v1718);
    }
    (_v1719(3, 2, "#ffffffcc"), _v1719(2, 3, "#ffffff88"), _v1715 === "chaos" && (_v1719(4, 4, "#3a2a10"), _v1719(5, 4, "#3a2a10"), _v1719(4, 5, "#3a2a10")), _v1715 === "divine" && (_v1717.fillStyle = "#d8b050", _v1717.fillRect(4, 1, 1, 7), _v1717.fillRect(1, 4, 7, 1), _v1719(4, 4, "#fff")), _v1715 === "exalt" && (_v1717.fillStyle = "#b89040", _v1717.fillRect(2, 5, 5, 1), _v1719(1, 4, "#b89040"), _v1719(7, 4, "#b89040")), _v1715 === "jewel" && (_v1719(5, 5, "#ffffff"), _v1719(4, 6, "#1a7a60")), _v1715 === "ember" && (_v1719(4, 2, "#ffe080"), _v1719(3, 3, "#ffb040"), _v1719(4, 3, "#fff2c0"), _v1719(5, 3, "#ffb040"), _v1719(3, 5, "#7a1406"), _v1719(4, 5, "#2a0602"), _v1719(5, 5, "#7a1406"), _v1719(4, 6, "#7a1406"), _v1719(2, 4, "#ff9a50"), _v1719(6, 4, "#c83010")), _v1715 === "ash" && (_v1719(2, 2, "#120e14"), _v1719(6, 6, "#120e14"), _v1719(6, 2, "#120e14"), _v1719(3, 4, "#5a504c"), _v1719(5, 3, "#5a504c"), _v1719(4, 6, "#5a504c"), _v1719(6, 5, "#b0a49c"), _v1719(4, 4, "#ff6a24"), _v1719(5, 5, "#a02a10")), _v1715 === "frac" && (_v1719(3, 3, "#4a2410"), _v1719(4, 4, "#4a2410"), _v1719(4, 5, "#4a2410"), _v1719(5, 6, "#4a2410"), _v1719(5, 3, "#4a2410"), _v1719(6, 2, "#4a2410"), _v1719(5, 4, "#ffe2b0")), _v1715 === "chance" && (_v1719(5, 5, "#404040"), _v1719(4, 4, "#404040")), _v1715.startsWith("omen_") && (_v1719(4, 2, "#fff0d0"), _v1719(3, 4, "#e0c070"), _v1719(5, 4, "#e0c070"), _v1719(4, 6, "#8a5ac0"), _v1719(4, 4, "#2a1030")), Si[_v1715] = _v1716, Ye[_v1715] = _v1716.toDataURL());
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
    (W.fireball = _v1726(_v1767 => {
      for (let _v1768 = 0; _v1768 < 6; _v1768++) _v1733(_v1767, 3 + _v1768, 3 + _v1768, 1, _v1768 < 3 ? "#7a2a10" : "#c8401a");
      (_v1733(_v1767, 10, 10, 4, "#e86a20"), _v1733(_v1767, 10, 10, 2, "#ffd060"), _v1767(9, 9, "#fff"));
    }), W.icespear = _v1726(_v1769 => {
      for (let _v1770 = 0; _v1770 < 12; _v1770++) (_v1769(2 + _v1770, 13 - _v1770, "#9fe8ff"), _v1769(3 + _v1770, 13 - _v1770, "#4a8ab8"));
      (_v1769(14, 1, "#fff"), _v1769(13, 2, "#fff"));
    }), W.arc = _v1726(_v1771 => {
      let _v1772 = [[2, 2], [6, 5], [4, 8], [9, 10], [7, 13], [13, 14]];
      for (let _v1773 = 0; _v1773 < _v1772.length - 1; _v1773++) _v1741(_v1771, _v1772[_v1773][0], _v1772[_v1773][1], _v1772[_v1773 + 1][0], _v1772[_v1773 + 1][1], "#a8b4ff");
    }), W.nova = _v1726(_v1774 => {
      for (let _v1775 = 0; _v1775 < 16; _v1775++) for (let _v1776 = 0; _v1776 < 16; _v1776++) {
        let _v1777 = Math.hypot(_v1776 - 7.5, _v1775 - 7.5);
        _v1777 > 5.2 && _v1777 < 6.8 ? _v1774(_v1776, _v1775, "#8ad8ff") : _v1777 > 3.8 && _v1777 < 5.2 && (_v1776 + _v1775) % 2 && _v1774(_v1776, _v1775, "#3a6a9a");
      }
      _v1733(_v1774, 8, 8, 1, "#e8fbff");
    }), W.meteor = _v1726(_v1778 => {
      for (let _v1779 = 0; _v1779 < 7; _v1779++) (_v1778(13 - _v1779, 2 + _v1779, "#e86a20"), _v1778(14 - _v1779, 2 + _v1779, "#ffb040"));
      (_v1733(_v1778, 6, 10, 3, "#6a4a3a"), _v1733(_v1778, 6, 10, 1, "#ff8a30"));
    }), W.cyclone = _v1726(_v1780 => {
      for (let _v1781 = 0; _v1781 < 6.2; _v1781 += 0.12) {
        let _v1782 = 1 + _v1781 * 1.05;
        _v1780(Math.round(8 + Math.cos(_v1781 * 1.6) * _v1782), Math.round(8 + Math.sin(_v1781 * 1.6) * _v1782), _v1781 > 4 ? "#e8e2d8" : "#8a8490");
      }
      _v1733(_v1780, 8, 8, 1, "#c8402a");
    }), W.larrow = _v1726(_v1783 => {
      (_v1759(_v1783, 2, 13, 13, 2, "#c8a040", "#fff"), _v1741(_v1783, 9, 3, 11, 6, "#a8b4ff"), _v1741(_v1783, 11, 6, 9, 8, "#a8b4ff"), _v1741(_v1783, 12, 9, 14, 11, "#a8b4ff"));
    }), W.iceshot = _v1726(_v1784 => {
      _v1759(_v1784, 2, 13, 13, 2, "#5a8ab8", "#e8fbff");
      for (let _v1785 = 0; _v1785 < 5; _v1785++) (_v1784(10 + _v1785 % 3, 6 + _v1785, "#9fe8ff"), _v1784(6 + _v1785, 10 + _v1785 % 2, "#9fe8ff"));
    }), W.rain = _v1726(_v1786 => {
      for (let _v1787 = 0; _v1787 < 5; _v1787++) {
        let _v1788 = 2 + _v1787 * 3, _v1789 = 1 + _v1787 % 2 * 3;
        (_v1741(_v1786, _v1788, _v1789, _v1788 + 1, _v1789 + 6, "#c8b890"), _v1786(_v1788 + 1, _v1789 + 7, "#fff"));
      }
      _v1741(_v1786, 0, 14, 15, 14, "#5a4a3a");
    }), W.javelin = _v1726(_v1790 => {
      (_v1741(_v1790, 1, 14, 12, 3, "#c8a040"), _v1741(_v1790, 12, 3, 14, 1, "#fff"), _v1741(_v1790, 8, 2, 10, 5, "#a8b4ff"), _v1741(_v1790, 13, 6, 11, 8, "#a8b4ff"));
    }), W.thrust = _v1726(_v1791 => {
      (_v1741(_v1791, 1, 8, 12, 8, "#9aa4b0"), _v1741(_v1791, 12, 8, 15, 8, "#fff"), _v1791(13, 7, "#fff"), _v1791(13, 9, "#fff"));
      for (let _v1792 = 0; _v1792 < 3; _v1792++) _v1741(_v1791, 2, 4 + _v1792 * 4, 6, 4 + _v1792 * 4, "#5a5060");
    }), W.whirl = _v1726(_v1793 => {
      (_v1750(_v1793, 8, 8, 6, 0, 5.5, "#e0c080"), _v1750(_v1793, 8, 8, 4, 2, 6.2, "#8a7050"), _v1741(_v1793, 8, 8, 14, 8, "#e8eef4"));
    }), W.flurry = _v1726(_v1794 => {
      for (let _v1795 = 0; _v1795 < 3; _v1795++) _v1750(_v1794, 4 + _v1795 * 3, 10, 4, -2.2, -0.6, "#e8e2d8");
      (_v1741(_v1794, 12, 1, 10, 5, "#a8b4ff"), _v1741(_v1794, 10, 5, 12, 6, "#a8b4ff"), _v1741(_v1794, 12, 6, 10, 10, "#a8b4ff"));
    }), W.thunder = _v1726(_v1796 => {
      (_v1741(_v1796, 8, 0, 6, 5, "#a8b4ff"), _v1741(_v1796, 6, 5, 9, 7, "#a8b4ff"), _v1741(_v1796, 9, 7, 7, 11, "#a8b4ff"));
      for (let _v1797 = 1; _v1797 < 15; _v1797++) _v1796(_v1797, 13 + (_v1797 % 3 ? 0 : -1), "#c8a040");
      _v1750(_v1796, 8, 13, 6, 3.4, 6, "#dfe6ff");
    }), W.glacial = _v1726(_v1798 => {
      for (let _v1799 = 0; _v1799 < 4; _v1799++) {
        let _v1800 = 2 + _v1799 * 4, _v1801 = 4 + _v1799 * 2;
        (_v1741(_v1798, _v1800, 14, _v1800 + 1, 14 - _v1801, "#9fe8ff"), _v1798(_v1800 + 1, 14 - _v1801, "#fff"), _v1741(_v1798, _v1800 + 1, 14, _v1800 + 2, 15 - _v1801, "#5a8ab8"));
      }
    }), W.tsubame = _v1726(_v1802 => {
      (_v1750(_v1802, 8, 9, 6, -2.6, -0.2, "#ffffff"), _v1750(_v1802, 8, 7, 5, 0.4, 2.8, "#f08090"), _v1802(8, 8, "#c03030"));
    }), W.iai = _v1726(_v1803 => {
      (_v1741(_v1803, 0, 8, 15, 8, "#ffffff"), _v1741(_v1803, 0, 9, 15, 9, "#7a7a8a"), _v1741(_v1803, 3, 12, 8, 11, "#c03030"), _v1741(_v1803, 8, 11, 13, 10, "#e8eef4"));
    }), W.windblade = _v1726(_v1804 => {
      for (let _v1805 = 0; _v1805 < 3; _v1805++) _v1750(_v1804, 5 + _v1805 * 1, 8, 4 + _v1805 * 2, -0.9, 0.9, _v1805 === 1 ? "#ffffff" : "#a8c8d0");
    }));
  })();
};
Fe = function (_v1806, _v1807, _v1808, _v1809, _v1810, _v1811, _v1812 = {}) {
  let _v1813 = {
    id: _v1806,
    t: _v1807,
    slots: _v1808,
    text: _v1809,
    stat: _v1810,
    ranges: _v1811,
    w: _v1812.w || 100,
    lv: _v1812.lv || US,
    div: _v1812.div || 1,
    nm: _v1812.nm || "",
    dsec: !!_v1812.dsec,
    fac: _v1812.fac || null,
    pair: Array.isArray(_v1811[0][0])
  };
  (ta[_v1806] = _v1813, pf.push(_v1813));
};
s5 = function () {
  AtlasEnsure();
  let _v1814 = AtlasAvailable(), _v1815 = pi(), _v1816 = Object.keys(u.done || ({})).length;
  let _v1817 = (_v1818, _v1819) => {
    let _v1820 = Ks.find(_v1821 => _v1821.key === _v1818), _v1822 = _v1820 ? _v1820.col : "#c8c8c8";
    let _v1823 = ATLAS_BRANCH_TOTAL[_v1818] || 0;
    let _v1824 = (u.atlas || []).filter(_v1825 => AtlasNode(_v1825) && AtlasNode(_v1825).b === _v1818).length;
    let _v1826 = _v1823 ? Math.round(_v1824 / _v1823 * 100) : 0;
    return `<div style="display:flex;align-items:center;gap:8px;margin:3px 0"><b style="width:58px;color:${_v1822}">${_v1820 ? _v1820.n : _v1819}</b><div style="flex:1;height:8px;background:#1a1620;border:1px solid #2e2834"><div style="width:${_v1826}%;height:100%;background:${_v1822}"></div></div><span class="dim" style="width:60px;text-align:right">${_v1824}/${_v1823}</span></div>`;
  };
  let _v1827 = ATLAS_MAIN_BRANCHES.map(_v1828 => _v1817(_v1828)).join("") + '<div class="dim" style="margin:8px 0 2px">交叉捷径</div>' + ATLAS_SHORTCUTS.map(_v1829 => _v1817(_v1829)).join("");
  let _v1830 = Ks.map(_v1831 => {
    let _v1832 = ATLAS_ALL.filter(_v1833 => _v1833.b === _v1831.key);
    return `<div class="acol" style="--ac:${_v1831.col}"><div class="ahd"><b style="color:${_v1831.col}">${_v1831.n} <small>${_v1832.length} 节点</small></b><p>${_v1831.d}</p></div>${_v1832.map(_v1834 => `<div class="anode${_v1834.tier === "keystone" ? " key" : ""}${AtlasCountAlloc(_v1834.k) ? " on" : ""}" style="cursor:default"><b>${_v1834.n}${_v1834.tier === "keystone" ? " ◆" : _v1834.tier === "sig" ? " ★" : ""}</b><span>${_v1834.d}</span></div>`).join("")}</div>`;
  }).join("");
  let _v1835 = `<div class="favor"><span class="lab">偏好主题 · 掉落的地图有 50% 是该主题</span>${["", ..._s].map(_v1836 => `<button class="btn small${(u.favor || "") === _v1836 ? " primary" : ""}" data-act="favor" data-t="${_v1836}" ${_v1836 ? `style="border-color:${gt[_v1836].col}"` : ""}>${_v1836 ? la[_v1836].names[0].slice(0, 2) + " · " + $t[gt[_v1836].boss].n : "不偏好"}</button>`).join("")}</div>`;
  let _v1837 = `<section class="card" style="margin-top:10px"><h3>异界机制 <small>惊悸迷雾 · 驱灵仪式 · 深渊</small></h3><div class="bgrid"><div class="bcard" style="--uc:#cfd8e8"><b>迷雾副本</b><small>70 层 · 每 5 个房间一张图 · 神圣石 · 亢奋</small><p>持久亢奋 <b>${u.delirium || 0}%</b> · 拟像通关 <b>${u.simRuns || 0}</b></p><p class="dim">藏身处进入; 每层首领掉 3 神圣石, 最终首领 ×5 血掉 20; 每完成 20 层 +1 图谱点。</p></div><div class="bcard" style="--uc:#d06a8a"><b>驱灵仪式</b><small>祭坛 · 贡品 · 恩典</small><p>已完成仪式 <b>${u.ritualDone || 0}</b></p><p class="dim">每图 3 座祭坛; 圈内击杀吸收怨灵, 分波复活; 恩典必出具体预兆。</p></div><div class="bcard" style="--uc:#4dff88"><b>深渊</b><small>裂隙 · 巨坑 · 保险箱</small><p>已开启深渊保险箱 <b>${u.abyssDone || 0}</b></p><p class="dim">深渊怪掉落遗存骨; 巫妖血脉稀有怪必掉骨与预兆; 关闭巨坑后升起保险箱。</p></div></div></section>`;
  return `<div class="at"><div class="ahead card"><div><span class="lab">可用点数</span><b class="big" style="color:#8f9cff">${_v1814}</b><span class="dim"> · 已获得 ${AtlasEarned()} / ${Br} · 已分配 ${AtlasUsed()} / ${ATLAS_SPEND}</span></div><div><span class="lab">当前专精路线</span><b class="big" style="color:${Od(_v1815)}">${Fd(_v1815)}</b></div><div><span class="lab">图谱完成度</span><b class="big">${_v1816}</b><span class="dim"> / 68</span></div><div class="dim" style="max-width:560px">异界天赋树：点节点需先点亮前置；<b>显著节点（★）</b>还要求同分支已点 ≥2 个小节点；<b>关键节点（◆）</b>两两互斥且花费 2 点。点数来自图谱完成度、异界玩法首通、拟像层数与首领首杀；可获取上限 ${Br}，本期可分配 ${ATLAS_SPEND}，必须取舍。</div><button class="btn small" data-atlas-act="reset">重置全树（神圣石 ×1）</button> <button class="btn small" data-atlas-act="respec">退还单点（混沌石 ×${AtlasRespecCost()}）</button></div>
		 <section class="card" style="margin-top:10px">${_v1835}</section>
 <section class="card" style="margin-top:10px"><h3>异界天赋树 <small>拖动平移 · 滚轮缩放 · 左键点亮/退还 · 右键看前置链</small></h3><div style="display:grid;grid-template-columns:1fr 240px;gap:10px;align-items:start"><div id="atlasWrap" style="position:relative;min-width:0"><canvas id="atlascv" style="width:100%;height:540px;display:block;background:#0b0a10;border:1px solid #2e2834;cursor:grab;touch-action:none"></canvas><div id="atlasTip" style="display:none;position:absolute;z-index:30;max-width:280px;padding:6px 8px;background:rgba(12,10,16,.96);border:1px solid #4a4058;color:#d8d0c0;font-size:11.5px;line-height:1.5;pointer-events:none;border-radius:3px"></div><div class="dim" style="margin-top:4px">★ 显著节点（同分支 ≥2 小节点） · ◆ 关键节点（2 点，互斥） · 圆点=普通节点</div></div><div>${_v1827}<div class="sep"></div><div class="dim" style="font-size:11px">洗点：点击已点亮节点（混沌石 ×${AtlasRespecCost()}）；重置全树神圣石 ×1。老存档图谱会自动补齐前置。</div></div></div></section>
		
 <details class="card" style="margin-top:10px"><summary style="cursor:pointer;font-weight:700">节点图鉴 · 全部 ${ATLAS_ALL.length} 个节点（含 6 条主分支与 2 条捷径）</summary><div class="acols" style="margin-top:8px">${_v1830}</div></details>
		 ${_v1837}<section class="card" style="margin-top:10px">${U1() || '<p class="dim">还没有按路线记录的地图。</p>'}</section></div>`;
};
GL = function () {
  let _v1838 = (_v1839, _v1840, _v1841) => `<button class="btn small" data-act="dbg" data-k="${_v1839}" title="${_v1841 || ""}">${_v1840}</button>`, _v1842 = n.Z && n.Z.type === "map";
  return `<div class="dbg"><section class="card"><h3>调试模式 <small>F9 开关此页</small></h3><p class="dim">所有功能都可以反复点。地图内功能需要先进入地图。</p>
		 <div class="dsec">角色</div><div class="dbtns">${_v1838("grant", "全部宝石 + 通货 + 点数", "所有主动宝石 20 级 5 孔, 每种辅助 2 颗, 全部精魂与元技能宝石, 通货至少 99, 天赋 +120, 升华 8 点, 图谱点满")}${_v1838("god", u.god ? "无敌: 开" : "无敌: 关")}${_v1838("lv10", "等级 +10")}${_v1838("lv60", "直升 60 级")}${_v1838("sock", "所有主动宝石 5 孔 20 级")}${_v1838("cur999", "全部通货 999999")}${_v1838("trial", "完成全部升华试炼")}${_v1838("atlas", "图谱点满")}${_v1838("cdr", "重置冷却与资源")}${_v1838("charges", "充能满 + 怒火 30")}${_v1838("metafull", "元技能能量满")}${_v1838("perf", "性能面板 (F8)")}</div>
		 <div class="dsec">满配测试 <small>60 级 · 宝石连好 · 升华与天赋点好 · 顶级稀有装 + 流派传奇 · 直接去试手感</small></div><div class="dbtns">${Ls.filter(_v1843 => _v1843.cls === u.cls).map(_v1844 => `<button class="btn small primary" data-act="testRig" data-n="${_v1844.n}">满配: ${_v1844.n}</button>`).join("")}</div>
		 <div class="dsec">流派</div><div class="dbtns">${Ls.filter(_v1845 => _v1845.cls === u.cls).map(_v1846 => `<button class="btn small" data-act="buildApply" data-n="${_v1846.n}">只套宝石: ${_v1846.n}</button>`).join("")}</div>
		 <div class="dsec">诊断 / 读屏 <small>截图或导出状态发给开发者</small></div><div class="dbtns"><button class="btn small" data-act="dbg" data-k="shot">保存截图 PNG</button><button class="btn small" data-act="dbg" data-k="diag">导出诊断 JSON</button><button class="btn small" data-act="dbg" data-k="spritedump">列出缺失贴图</button></div>
		 <div class="dsec">物品</div><div class="dbtns">${_v1838("rares", "10 件稀有装备")}${_v1838("offs", "全部副手与腰带")}${_v1838("uniqs", "全部传奇(计入图鉴)")}${_v1838("maps", "T1–T17 地图各 1")}${_v1838("mapsR", "5 张稀有 T16 地图")}${_v1838("ess", "精华与符文 ×20")}${_v1838("sigils", "四种首领印记 ×1")}${_v1838("souls", "全部兽魂(稀有)")}${_v1838("omens", "全部预兆 ×5")}${_v1838("pet", "千烬灵狐(宠物)")}${_v1838("pinlv", "裂隙之心等级 +1")}</div>
		 <div class="dsec">地图内 ${_v1842 ? "" : '<small class="neg">· 当前不在地图</small>'}</div><div class="dbtns">${_v1838("clear", "清屏")}${_v1838("boss", "召唤本图主题首领")}${_v1838("enc", "生成本图主题遭遇")}${_v1838("rift", "生成裂隙")}${_v1838("abyss", "生成深渊")}${_v1838("shrine", "生成神龛")}${_v1838("box", "生成宝箱")}${_v1838("pack", "召唤稀有怪群")}${_v1838("crystal", "冰晶柱 ×3")}${_v1838("rain", "通货雨")}${_v1838("divine", "掉一个神圣石")}${_v1838("ape", "召唤焚拳猿王")}${_v1838("stress", "压力测试 +150 怪")}</div>
		 <div class="dsec">直达首领</div><div class="dbtns">${_s.map(_v1847 => `<button class="btn small" data-act="dbg" data-k="go_${_v1847}">T10 ${la[_v1847].names[0]} · ${$t[gt[_v1847].boss].n}</button>`).join("")}<button class="btn small" data-act="dbg" data-k="go_pin">裂隙之心 · 虚空之主</button></div></section>
		 <section class="card"><h3>说明</h3><p class="dim">推荐流程: 先"全部宝石 + 通货 + 点数", 再"套用"一个流派, 去木桩看机制辅助与元技能能量条; 用"直达首领"测试四位主题首领的机制; 拿到印记后挑战裂隙之心。</p><p class="dim">上方职业条可以随时切换职业: 每个职业一个调试栏位, 切换前自动保存当前角色。<b>万能工匠台</b>可对任意装备增删改词条; <b>地图工坊</b>可开 2–8 倍密度的割草图。</p></section></div>`;
};
t$ = function (_v1848, _v1849) {
  return {
    x: _v1848,
    y: _v1849,
    r: 4,
    hp: n.S.maxLife,
    mana: n.S.maxMana,
    es: n.S.maxES,
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
Wc = function (_v1850, _v1851, _v1852, _v1853 = {}) {
  n.del && DeliriumEnd();
  e$();
  let _v1854 = XT(_v1850, _v1852);
  n.Z = {
    type: _v1851,
    M: _v1850,
    th: _v1852,
    img: _v1854.c,
    lights: _v1854.lights,
    lvl: _v1853.lvl || 1,
    tier: _v1853.tier || 0,
    ms: _v1853.ms || Ds(null),
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
  (_v1855.width = _v1850.W, _v1855.height = _v1850.H, n.Z.mini = _v1855);
  let _v1856 = _v1850.rooms[0];
  (n.pl = t$((_v1856.cx + 0.5) * K, (_v1856.cy + 0.5) * K), n.omTrig = !1, es.x = n.pl.x - lo / 2, es.y = n.pl.y - co / 2);
};
gl = function () {
  let _v1857 = YT();
  (Wc(_v1857, "hideout", la.hideout, {
    lvl: 1
  }), n.pl.x = 15 * K + 8, n.pl.y = 13 * K, n.objs.push({
    kind: "device",
    x: 15 * K,
    y: 6 * K + 8,
    r: 16
  }), n.objs.push({
    kind: "vendor",
    x: 9 * K,
    y: 6 * K + 4,
    r: 14
  }), n.Z.lights.push({
    x: 9 * K + 10,
    y: 6 * K - 16,
    r: 70,
    c: "#ffb050",
    i: 0.8,
    torch: 1
  }), n.objs.push({
    kind: "stash",
    x: 20 * K + 8,
    y: 6 * K + 6,
    r: 12
  }), n.objs.push({
    kind: "bench",
    x: 11 * K,
    y: 11 * K,
    r: 16
  }), n.Z.lights.push({
    x: 11 * K - 2,
    y: 11 * K - 20,
    r: 60,
    c: "#ff8a3a",
    i: 0.38,
    torch: 1
  }), n.objs.push({
    kind: "altar",
    x: 19 * K,
    y: 11 * K,
    r: 14
  }), n.objs.push({
    kind: "well",
    x: 24 * K,
    y: 16 * K,
    r: 12
  }), n.objs.push({
    kind: "simulacrum",
    x: 27 * K,
    y: 11 * K,
    r: 14
  }), n.Z.lights.push({
    x: 23 * K,
    y: 14 * K - 12,
    r: 55,
    c: "#7dff9a",
    i: 0.6
  }), n.Z.lights.push({
    x: 27 * K,
    y: 11 * K - 12,
    r: 55,
    c: "#b48cff",
    i: 0.7
  }), n.Z.lights.push({
    x: 19 * K,
    y: 11 * K - 22,
    r: 58,
    c: "#ff4a20",
    i: 0.42,
    torch: 1
  }), n.objs.push({
    kind: "monument",
    x: 25 * K + 8,
    y: 7 * K + 12,
    r: 12
  }), n.Z.lights.push({
    x: 25 * K + 8,
    y: 7 * K - 10,
    r: 62,
    c: "#ffb050",
    i: 0.55,
    torch: 1
  }), n.objs.push({
    kind: "dog",
    x: 5 * K + 6,
    y: 11 * K + 8,
    r: 8
  }), n.objs.push({
    kind: "tgate",
    x: 5 * K + 8,
    y: 15 * K + 4,
    r: 14
  }), n.objs.push({
    kind: "stele",
    x: 9 * K + 8,
    y: 15 * K + 6,
    r: 10
  }));
  let _v1858 = nt("dummy", 23 * K, 10 * K, 1, 0);
  (_v1858.dummy = !0, _v1858.log = [], n.mons.push(_v1858));
  let _v1859 = nt("dummy", 24 * K, 13 * K, 1, 2);
  (_v1859.dummy = !0, _v1859.log = [], _v1859.name = "精英木桩", n.mons.push(_v1859), n.objs.push({
    kind: "fire",
    x: 7 * K,
    y: 10 * K
  }), n.Z.lights.push({
    x: 7 * K,
    y: 10 * K,
    r: 110,
    c: "#ff9a40",
    i: 1,
    torch: 1
  }), u.flask.forEach(_v1860 => _v1860.ch = _v1860.max), n.state = "play", kl(), Xe());
};
Xi = function (_v1861, _v1862) {
  let _v1863 = la[_v1861.theme], _v1864 = Ds(_v1861), _v1865 = _v1861.dbg || null, _v1866 = n.endlessMode ? 0 : Math.max(1, Math.min(100, Math.round(n.mapIntensity || 1)));
  if (!n.endlessMode) {
    _v1864.mods.monLife = (_v1864.mods.monLife || 0) + _v1866 * 1000;
    _v1864.quant += _v1866 * 70;
    _v1864.rar += _v1866 * 70;
  }
  if (_v1865) for (let _v1867 of ["monLife", "magicPacks", "rarePacks"]) _v1865[_v1867] && (_v1864.mods[_v1867] = (_v1864.mods[_v1867] || 0) + _v1865[_v1867]);
  _v1865 && _v1865.torch && (_v1863 = {
    ..._v1863,
    torchCh: _v1865.torch
  });
  let [_v1868, _v1869] = _v1865 && _v1865.rooms ? _v1865.rooms : [14, 17], _v1870 = _v1862 || (ai(de(_v1868, _v1869)));
  for (let _v1871 = 0; !_v1862 && !n.endlessMode && _v1871 < 20 && _v1870.rooms.length < Math.min(7, _v1868 - 3); _v1871++) _v1870 = ai(de(_v1868, _v1869));
  (Wc(_v1870, "map", _v1863, {
    lvl: Ro(_v1861.tier),
    tier: _v1861.tier,
    ms: _v1864,
    map: _v1861
  }), n.Z.dens = _v1865 && _v1865.dens || 1, n.Z.quant = _v1864.quant, a$(), n.run = {
    route: pi(),
    name: "T" + _v1861.tier + " " + _v1861.name,
    tier: _v1861.tier,
    rarity: _v1861.rarity,
    intensity: _v1866,
    endless: !!n.endlessMode,
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
  }, n.state = "play", G("map:enter", {
    m: _v1861
  }), kl(), ke("T" + _v1861.tier + " · " + _v1861.name, "区域等级 " + n.Z.lvl + " · 强度 " + _v1866 + " · 怪物生命 +" + _v1866 * 1000 + "% · 怪物元素抗性 +" + Math.min(75, _v1866 * 10) + "%（上限 75%）· 物品数量 +" + _v1866 * 70 + "% · 物品稀有度 +" + _v1866 * 70 + "%（地图总数量 +" + _v1864.quant + "% / 总稀有度 +" + _v1864.rar + "%）"));
};
a$ = function () {
  let _v1872 = n.Z.M, _v1873 = n.Z.ms.mods, _v1874 = n.Z.dens || 1, _v1875 = Math.sqrt(_v1874), _v1876 = (1 + (_v1873.packSize || 0) / 100) * Ie.spawn.sizeMul * _v1875, _v1877 = Ie.spawn.packMul * _v1875, _v1878 = _v1879 => {
    let _v1880 = _v1879 * _v1877;
    return Math.floor(_v1880) + (I() < _v1880 % 1 ? 1 : 0);
  };
  _v1872.rooms.forEach((_v1881, _v1882) => {
    if (_v1882 === 0) return;
    if (_v1881.boss) {
      let _v1883 = (_v1881.cx + 0.5) * K, _v1884 = (_v1881.cy + 0.5) * K;
      try {
        let _v1885 = 0;
        while (_v1885++ < 80 && (!AbyssFloorOK(_v1883, _v1884) || AbyssWallGap(_v1883, _v1884) < 34)) {
          let _v1886 = ui(_v1881);
          _v1883 = _v1886.x;
          _v1884 = _v1886.y;
        }
      } catch (_v1887) {}
      let _v1888 = nt((gt[n.Z.th.key] || ({})).boss || "boss", _v1883, _v1884, n.Z.lvl + 2, 3);
      (n.Z.boss = _v1888, n.mons.push(_v1888), Dc(_v1881, Math.round(4 * Math.min(2, _v1875))));
      return;
    }
    let _v1889 = _v1878(de(1, 3) + (_v1881.w * _v1881.h > 110 ? 1 : 0));
    for (let _v1890 = 0; _v1890 < _v1889 && n.mons.length < Ie.spawn.cap; _v1890++) Dc(_v1881, Math.round(de(4, 8) * _v1876));
  });
  let _v1891 = _v1872.rooms.filter((_v1892, _v1893) => _v1893 > 0 && !_v1892.boss);
  if (!_v1891.length) return;
  let _v1894 = (I() < 0.55 ? 1 : 0) + (_v1873.boxes || 0) + (re("box1") ? 1 : 0) + (re("box5") ? 2 : 0), _v1895 = Math.max(0, Math.round(((I() < 0.35 ? 1 : 0) + (_v1873.rifts || 0) + (re("rift1") ? 1 : 0)) * AtlasContentMul()));
  if (re("sust5")) {
    let _v1896 = ui(oe(_v1891));
    n.objs.push({
      kind: "shrine",
      x: _v1896.x,
      y: _v1896.y,
      type: oe(is).k,
      used: !1
    });
  }
  for (let _v1897 = 0; _v1897 < _v1894; _v1897++) {
    let _v1898 = ui(oe(_v1891));
    n.objs.push({
      kind: "box",
      x: _v1898.x,
      y: _v1898.y,
      r: 6,
      open: !1,
      ornate: re("box3") && I() < 0.25
    });
  }
  for (let _v1899 = 0; _v1899 < _v1895; _v1899++) {
    let _v1900 = ui(oe(_v1891));
    n.objs.push({
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
  if (I() < (0.42 + (re("aby1") ? 0.15 : 0) + (n.Z.tier >= 11 ? 0.15 : 0)) * AtlasContentMul()) {
    let _v1901 = ui(oe(_v1891));
    n.objs.push(AbyssMake(_v1901.x, _v1901.y));
  }
  if (I() < BAL.mirrorChance * AtlasContentMul()) {
    let _v1902 = _v1872.rooms && _v1872.rooms[0] ? ui(_v1872.rooms[0]) : ui(oe(_v1891));
    n.objs.push({
      kind: "mirror",
      x: _v1902.x,
      y: _v1902.y,
      r: 10,
      st: "idle"
    });
  }
  let _v1903 = Math.max(1, Math.round((3 + (re("rit1") ? 1 : 0) + (n.Z.tier >= 11 && I() < 0.5 ? 1 : 0)) * AtlasContentMul())), _v1904 = _v1891.filter(_v1905 => !_v1905.boss), _v1906 = [];
  for (let _v1907 = 0; _v1907 < _v1903; _v1907++) {
    let _v1908 = _v1904.find(_v1909 => !_v1906.includes(_v1909)) || _v1904[_v1907 % Math.max(1, _v1904.length)] || oe(_v1891);
    (_v1906.push(_v1908), 0);
    let _v1910 = ui(_v1908);
    n.objs.push(RitualMake(_v1910.x, _v1910.y));
  }
  let _v1911 = _v1872.rooms.find(_v1912 => _v1912.boss);
  if (_v1911 && I() < BAL.ritualBossChance + (re("rit7") ? 0.15 : 0)) {
    let _v1913 = ui(_v1911), _v1914 = RitualMake(_v1913.x, _v1913.y);
    _v1914.bossAltar = !0;
    n.objs.push(_v1914);
  }
  try {
    JewelMapDrop(_v1872);
  } catch (_v1915) {}
  lu();
};
B5 = function (_v1916) {
  let _v1917 = _v1916.x, _v1918 = _v1916.y, _v1919 = _v1916.mult || 1, _v1920 = _v1916.encBox;
  if ((Hc(_v1917, _v1918, 8 * _v1919, 40), _v1920 === "crypt")) {
    for (let _v1921 = 0; _v1921 < Math.round(3 * _v1919); _v1921++) ue(_v1917, _v1918, {
      kind: "it",
      it: fg()
    });
    I() < 0.25 * _v1919 && ue(_v1917, _v1918, {
      kind: "it",
      it: ur(oe(Object.keys(Ze)))
    });
  }
  if (_v1920 === "lava") {
    let _v1922 = Tt.filter(_v1923 => q[_v1923].grp === "rune" || q[_v1923].grp === "ess");
    for (let _v1924 = 0; _v1924 < Math.round(4 * _v1919); _v1924++) ue(_v1917, _v1918, {
      kind: "cur",
      cur: oe(_v1922)
    });
  }
  if (_v1920 === "ice") for (let _v1925 = 0; _v1925 < Math.round(5 * _v1919); _v1925++) ue(_v1917, _v1918, {
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
    if (I() < 0.35 * _v1919) {
      let _v1927 = yt.filter(_v1928 => _v1928.src === "world" && !_v1928.noDrop && _v1928.lv <= n.Z.lvl + 5);
      _v1927.length && ue(_v1917, _v1918, {
        kind: "it",
        it: Kt(oe(_v1927), n.Z.lvl)
      });
    }
    for (let _v1929 = 0; _v1929 < 2; _v1929++) {
      let _v1930 = Ft(oe(Pa.filter(_v1931 => _v1931.lv <= n.Z.lvl)), n.Z.lvl, 2);
      ue(_v1917, _v1918, {
        kind: "it",
        it: _v1930
      });
    }
  }
};
q5 = function (_v1932) {
  if (!n.Z || n.Z.type !== "map") return;
  if (n.Z.pin) {
    let _v1933 = u.pinLv;
    (u.pinKills = (u.pinKills || 0) + 1, u.pinBest = Math.max(u.pinBest || 0, _v1933));
    for (let _v1934 = 0; _v1934 < 2 + Math.floor(_v1933 / 3); _v1934++) ue(_v1932.x, _v1932.y, {
      kind: "cur",
      cur: "divine"
    });
    for (let _v1935 = 0; _v1935 < 3; _v1935++) ue(_v1932.x, _v1932.y, {
      kind: "cur",
      cur: "exalt"
    });
    Hc(_v1932.x, _v1932.y, 25 + _v1933 * 3, 150);
    let _v1936 = yt.filter(_v1937 => _v1937.src === "void" && !_v1937.noDrop), _v1938 = 0;
    for (let _v1939 of _v1936) I() < 0.25 + 0.03 * _v1933 && (ue(_v1932.x, _v1932.y, {
      kind: "it",
      it: Kt(_v1939, n.Z.lvl)
    }), _v1938++);
    if (!_v1938) {
      let _v1940 = _v1936.filter(_v1941 => !u.codex[_v1941.id]);
      ue(_v1932.x, _v1932.y, {
        kind: "it",
        it: Kt(oe(_v1940.length ? _v1940 : _v1936), n.Z.lvl)
      });
    }
    (u.pinKills === 1 && (u.atlasPts = Math.min(Br, u.atlasPts + 3)), u.pinLv = Math.min(10, _v1933 + 1), setTimeout(() => ke("虚空之主 已陨落", "裂隙之心 等级提升至 " + u.pinLv), 1500), Nc());
    return;
  }
  let _v1942 = n.Z.th.key, _v1943 = n.Z.tier, _v1944 = _v1942 + ":" + _v1943;
  (u.done = u.done || ({}), u.done[_v1944] || (u.done[_v1944] = 1, u.atlasPts < Br && (u.atlasPts++, setTimeout(() => P("图谱完成度 +1 · 图谱点 +1 (按 U)"), 2400))), u.bestTier = Math.max(u.bestTier || 0, _v1943));
  let _v1945 = !(u.bossKills[_v1942] > 0);
  if ((u.bossKills[_v1942] = (u.bossKills[_v1942] || 0) + 1, u.bossBest[_v1942] = Math.max(u.bossBest[_v1942] || 0, _v1943), _v1943 >= 6 && I() < 0.35 * (re("enc4") ? 1.5 : 1) * (_v1932.awake ? 2 : 1) && ue(_v1932.x, _v1932.y, {
    kind: "cur",
    cur: u0[_v1942]
  }), _v1943 >= 4)) {
    let _v1946 = yt.filter(_v1947 => _v1947.src === _v1942), _v1948 = 0;
    for (let _v1949 of _v1946) I() < 0.12 * (re("enc5") ? 1.5 : 1) * (_v1932.awake ? 2 : 1) && (ue(_v1932.x, _v1932.y, {
      kind: "it",
      it: Kt(_v1949, n.Z.lvl)
    }), _v1948++);
    if (!_v1948 && _v1945) {
      let _v1950 = _v1946.filter(_v1951 => !u.codex[_v1951.id]);
      _v1950.length && (ue(_v1932.x, _v1932.y, {
        kind: "it",
        it: Kt(oe(_v1950), n.Z.lvl)
      }), setTimeout(() => P("首杀奖励: 专属传奇"), 1800));
    }
  }
  Nc();
};
ae = function (_v1952, _v1953, _v1954, _v1955 = 1, _v1956 = {}) {
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
  if (_v1957) (_v1958.amt = _v1953.fixed * (1 - Yr(_v1952, _v1953.el, _v1953) / 100), _v1958.dom = _v1953.el, _v1953.critHit && (_v1958.crit = !0)); else {
    let _v1959 = _v1958.by = {};
    for (let _v1960 of On) {
      let _v1961 = _v1953.dmg[_v1960];
      _v1961[1] <= 0 || (_v1959[_v1960] = (_v1961[0] + (_v1961[1] - _v1961[0]) * I()) * (1 - Yr(_v1952, _v1960, _v1953) / 100));
    }
    G("hit:base", _v1958);
    let _v1962 = 0;
    for (let _v1963 in _v1958.by) (_v1958.amt += _v1958.by[_v1963], _v1958.by[_v1963] > _v1962 && (_v1962 = _v1958.by[_v1963], _v1958.dom = _v1963));
    let _v1964 = G("hit:crit", {
      m: _v1952,
      c: _v1953,
      src: _v1954,
      cc: _v1953.crit,
      force: !!(_v1954 && (_v1954.sheathe && _v1953.isAtk || _v1954.perfect)) || n.pl.critNextT > 0
    });
    if ((_v1958.crit = !_v1953.noCrit && (_v1964.force || I() < Math.min(0.95, _v1964.cc)), _v1958.crit)) {
      _v1958.amt *= _v1953.multi;
      for (let _v1965 in _v1959) _v1959[_v1965] *= _v1953.multi;
    }
  }
  (_v1958.k = _v1955 * (1 + (_v1952.shockT > 0 ? _v1952.shockAmt : 0)), _v1952.stunT > 0 && (_v1958.k *= 1.25), !_v1957 && _v1954 && _v1954.sheathe && _v1953.isAtk && (_v1958.k *= G("hit:sheathe", {
    m: _v1952,
    c: _v1953,
    src: _v1954,
    mult: 1.4 + (n.S.a.sheathe || 0) / 100
  }).mult), G("hit:mods", _v1958), _v1958.amt *= _v1958.k * DelDRMul(), G("hit:land", _v1958));
  let _v1966 = _v1958.o, _v1967 = _v1958.crit, _v1968 = _v1958.dom, _v1969 = _v1958.by, _v1970 = _v1966.weight || "light", _v1971 = _v1966.dir != null ? _v1966.dir : Math.atan2(_v1952.y - n.pl.y, _v1952.x - n.pl.x);
  if ((_v1952.flash = _v1966.quiet ? Math.max(_v1952.flash, 0.03) : 0.09, _v1952.aggro = !0, _v1952.dummy)) return (G("hit:dummy", _v1958), _v1952.log.push([n.T, _v1958.amt]), U(_v1952.x, _v1952.y - _v1952.h - 2, _v1958.amt, _v1967, _v1968), _5(_v1952, _v1958.amt, _v1967, _v1970, _v1971, _v1966), _v1958.amt);
  if ((_v1952.hp -= _v1958.amt, _v1952.rar < 3)) {
    let _v1972 = Math.min(1, _v1958.amt / _v1952.maxhp), _v1973 = (({
      light: 14,
      mid: 42,
      heavy: 95,
      super: 150
    })[_v1970] + _v1972 * 60) * (_v1952.rar === 2 ? 0.35 : _v1952.rar === 1 ? 0.7 : 1), _v1974 = () => {
      (_v1952.kbx += Math.cos(_v1971) * _v1973, _v1952.kby += Math.sin(_v1971) * _v1973);
    };
    _v1970 === "heavy" || _v1970 === "super" ? n.releaseQ.push(_v1974) : _v1974();
  }
  if ((_v1969 && !_v1953.noAil && fI(_v1958), !_v1957 && !n.Z.ms.mods.noLeech)) {
    let _v1975 = G("hit:leech", {
      m: _v1952,
      c: _v1953,
      lch: n.S.leech
    });
    _v1975.lch > 0 && (n.pl.hp = Math.min(n.S.maxLife, n.pl.hp + Math.min(_v1958.amt * _v1975.lch, n.S.maxLife * 0.025)));
  }
  return (n.Z.ms.mods.reflect && _v1968 !== "phys" && !_v1957 && (n.pl.reflect += _v1958.amt * n.Z.ms.mods.reflect / 100), !_v1957 && _v1953.isAtk && n.pl.hitN++, G("hit:after", _v1958), (!_v1966.quiet || _v1967) && U(_v1952.x, _v1952.y - _v1952.h - 2, _v1958.amt, _v1967, _v1968), _5(_v1952, _v1958.amt, _v1967, _v1970, _v1971, _v1966), E(_v1952.x, _v1952.y, _v1967 ? 8 : 3, cI[_v1968], _v1967 ? 90 : 50, 0.3, {
    z: _v1952.h * 0.5,
    g: 60,
    glow: _v1968 !== "phys",
    dir: _v1971,
    spread: 1.2
  }), _v1952.hp <= 0 && di(_v1952, _v1954, {
    dir: _v1971,
    weight: _v1970,
    ign: !!_v1952.ign,
    dom: _v1968,
    crit: _v1967,
    over: -_v1952.hp / _v1952.maxhp,
    frozen: _v1952.frozen > 0
  }), _v1958.amt);
};
_5 = function (_v1976, _v1977, _v1978, _v1979, _v1980, _v1981) {
  let _v1982 = Math.min(1, _v1977 / _v1976.maxhp);
  (_v1976.stun += _v1982 * ({
    light: 0.7,
    mid: 1.9,
    heavy: 3.2,
    super: 5
  })[_v1979] * (_v1976.rar === 3 ? 0.45 : 1) * (_v1978 ? 1.3 : 1) * (_v1981.stunMul || 1), _v1976.stun >= 1 && _v1976.stunT <= 0 && _v1976.rar >= 1 && (_v1976.stun = 0, _v1976.stunT = _v1976.rar === 3 ? 1.1 : 1.7, _v1976.dummy || (_v1976.state = "chase"), _v1976.rar >= 2 && U(_v1976.x, _v1976.y - _v1976.h - 10, 0, !1, "gold", "重击晕眩", !0), $("stun"), G("stun", {
    m: _v1976,
    o: _v1981
  }), n.fx.push({
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
  (_v1978 && _v1979 !== "light" && (_v1984 += 0.015), _v1979 !== "light" && (_v1984 += _v1982 * 0.03), dg(_v1984), X(({
    light: 0.012,
    mid: 0.05,
    heavy: 0.14,
    super: 0.26
  })[_v1979] + (_v1978 ? 0.04 : 0)), vs(_v1980, ({
    light: 0.3,
    mid: 1.4,
    heavy: 2.8,
    super: 4.5
  })[_v1979]), isFinite(_v1976.x) && isFinite(_v1976.y) && isFinite(_v1976.h) && n.fx.push({
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
  }), (_v1978 || _v1979 !== "light") && E(_v1976.x, _v1976.y - _v1976.h * 0.5, _v1978 ? 6 : 3, _v1978 ? ["#fff2c0", "#ffd27a", "#ffb050"] : ["#ffd27a", "#ff9a60"], 34 + ({
    light: 0,
    mid: 18,
    heavy: 36,
    super: 60
  })[_v1979], 0.3, {
    glow: !0,
    vz: 40
  }), _v1979 === "heavy" && (n.zoomP = Math.max(n.zoomP, 0.025)), _v1979 === "super" && (n.zoomP = Math.max(n.zoomP, 0.05), n.fx.push({
    k: "lines",
    x: _v1976.x,
    y: _v1976.y - _v1976.h * 0.5,
    t: 0,
    max: 0.16
  }), n.flashW = Math.max(n.flashW, 0.18)), _v1979 !== "light" && n.fx.push({
    k: "star",
    x: _v1976.x + Math.cos(_v1980 + 3.14) * _v1976.r * 0.4,
    y: _v1976.y - _v1976.h * 0.5,
    t: 0,
    max: _v1979 === "mid" ? 0.1 : 0.16,
    col: _v1978 ? "#ffe080" : "#ffffff",
    r: _v1979 === "mid" ? 7 : 12
  }), rb(_v1979, _v1981.el || "phys", _v1978));
};
di = function (_v1985, _v1986, _v1987 = {}) {
  if (_v1985.dead) return;
  if (_v1985.t.prop) {
    (_v1985.dead = !0, _v1985.hp = 0, G("prop:death", {
      m: _v1985
    }));
    return;
  }
  _v1985.dead = !0;
  let _v1988 = _v1985.t, _v1989 = _v1985.rar >= 2, _v1990 = _v1987.weight || "light", _v1991 = _v1987.dir != null ? _v1987.dir : Math.atan2(_v1985.y - n.pl.y, _v1985.x - n.pl.x), _v1992 = ({
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
    vr: (I() < 0.5 ? -1 : 1) * (_v1990 === "light" ? 3 : 8 + _v1992 * 0.04),
    t: 0,
    life: 9,
    rift: _v1985.rift
  };
  if ((n.corpses.push(_v1993), n.corpses.length > 90 && n.corpses.shift(), n.Z.type === "map" && G("kill:corpse", {
    m: _v1985,
    corpse: _v1993,
    o: _v1987
  }), E(_v1985.x, _v1985.y, _v1989 ? 30 : 12, _v1988.gib, _v1989 ? 110 : 70, 0.7, {
    z: _v1985.h * 0.5,
    vz: 90,
    dir: _v1991,
    spread: 1.4
  }), E(_v1985.x, _v1985.y, _v1989 ? 7 : 3, _v1988.gib, 70, 2.2, {
    z: _v1985.h * 0.5,
    vz: 110,
    s: 2,
    g: 260,
    drag: 3,
    dir: _v1991,
    spread: 1
  }), qe(_v1985.x, _v1985.y, "blood", _v1989 ? 7 : 4), $("die"), n.Z.type !== "map")) return;
  E$(_v1985.xp * (_v1985.rift ? 1.5 : 1) * (_v1985.abyss ? 1.35 : 1));
  let _v1994 = G("kill:flask", {
    m: _v1985,
    mult: n.S.flaskCh
  });
  (u.flask.forEach(_v1995 => _v1995.ch = Math.min(_v1995.max, _v1995.ch + Ie.flaskGain[_v1985.rar] * _v1994.mult)), n.run && n.run.kills++);
  let _v1996 = G("kill:loot", {
    m: _v1985,
    src: _v1986,
    dm: Ie.loot.perKill[_v1985.rar] * (_v1985.rift ? Ie.loot.riftMul : 1) * (_v1985.abyss ? 1.3 : 1) * (_v1985.abyssloot || 1) * (_v1985.delMul || 1),
    rb: _v1986 && _v1986.c ? _v1986.c.rarity : 0
  });
  if ((Hc(_v1985.x, _v1985.y, _v1996.dm, _v1996.rb), _v1985.rift)) {
    let _v1997 = n.objs.find(_v1998 => _v1998.kind === "rift" && _v1998.st === "open");
    _v1997 && (_v1997.kills = (_v1997.kills || 0) + 1);
  }
  AbyssOnKill(_v1985);
  if (_v1985.del && n.Z && n.Z.type === "map") {
    let _v1999 = n.del ? n.del.depth : 0;
    if (I() < 0.45 + _v1999 / 1200) ue(_v1985.x, _v1985.y, {
      kind: "cur",
      cur: oe(["trans", "aug", "alch", "chaos", "exalt"])
    });
    if (I() < 0.05 + _v1999 / 4000) ue(_v1985.x, _v1985.y, {
      kind: "it",
      it: Ft(oe(Pa), (n.Z.lvl || 1) + 1, 2)
    });
  }
  (_v1985.abmod === "volatile" && (n.fx.push({
    k: "ring",
    x: _v1985.x,
    y: _v1985.y,
    r0: 3,
    r1: 40,
    t: 0,
    max: 0.35,
    col: "#2ee6a8",
    w: 2
  }), E(_v1985.x, _v1985.y, 18, AB_GREEN, 80, 0.6, {
    glow: !0
  }), $("boom", 0.5), (n.pl.x - _v1985.x) ** 2 + (n.pl.y - _v1985.y) ** 2 < 6400 && sa(_v1985.dmg * 1.4, "phys", {
    area: !0
  })), _v1985.abyss && _v1985.lichborn && AbyssOmenDrop(_v1985.x, _v1985.y), _v1985.abyss && !_v1985.lichborn && I() < (re("aby4") ? 0.04 : 0.02) && AbyssOmenDrop(_v1985.x, _v1985.y), _v1985.abyss && I() < (re("aby2") ? 0.12 : 0.06) && DsBoneDrop(_v1985.x, _v1985.y), _v1985.abyss && _v1985.lichborn && DsBoneDrop(_v1985.x, _v1985.y, 1));
  if (_v1985.abyss) {
    (I() < 0.03 && OmDrop(_v1985.x, _v1985.y), _v1985.lichborn && (OmDrop(_v1985.x, _v1985.y), OmDrop(_v1985.x, _v1985.y)), _v1985.lichborn === "void" && (ke("阿曼娜姆的虚空", "虚空溃散了"), $("unique")), _v1985.lichborn === "gasp" && !_v1985.revived && n.pend.push({
      t: 0.4,
      fn: () => {
        let _v2000 = nt("abyssstrangler", _v1985.x, _v1985.y, n.Z.lvl, 2);
        (Object.assign(_v2000, {
          spr: "abysslich",
          h: Xt.abysslich.h,
          r: 9,
          abyss: !0,
          pit: _v1985.pit,
          aggro: !0,
          revived: !0,
          lichborn: "gasp",
          name: "回响 · 古加尔的最后喘息"
        }), _v2000.maxhp = _v1985.maxhp * 0.55, _v2000.hp = _v2000.maxhp, _v2000.dmg = _v1985.dmg * 1.25, n.mons.push(_v2000), ke("古加尔的最后喘息", "它带着更强的力量站了起来"), $("unique"));
      }
    }), _v1985.lichborn === "legion" && n.pend.push({
      t: 0.2,
      fn: () => {
        for (let _v2001 = 0; _v2001 < 2; _v2001++) {
          let _v2002 = nt("abysswalker", _v1985.x + B(-16, 16), _v1985.y + B(-16, 16), n.Z.lvl, 0);
          (Object.assign(_v2002, {
            abyss: !0,
            pit: _v1985.pit,
            aggro: !0,
            name: "乌拉曼的军团 · 复制体"
          }), _v2002.maxhp *= 0.35, _v2002.hp = _v2002.maxhp, _v2002.dmg *= 0.7, n.mons.push(_v2002));
        }
        (ke("乌拉曼的军团", "军团从尸体中分裂出来"), $("unique"));
      }
    }));
  }
  (_v1985.del && I() < 0.35 && DelSplinter(_v1985.x, _v1985.y), _v1985.del && _v1985.rar >= 2 && I() < 0.5 && DelSplinter(_v1985.x, _v1985.y), _v1985.ritual ? (_v1985.ritual.st === "active" && (function () {
    let _v2003 = Math.max(1, Math.round((2 + (_v1985.rar || 0) * 3 + Math.floor(n.Z.lvl / 12)) * (re("rit2") ? 1.25 : 1) * (re("rit7") ? 1.25 : 1) * (_v1985.ritual.bossAltar ? 2 : 1) * (BAL.ritualTributeMul || 1) * (_v1985.reviveGen ? Math.max(0.25, 1 - 0.25 * (_v1985.reviveGen - 1)) : 1)));
    (RitAddTribute(_v2003), _v1985.ritual.tribute = RitTribute(), $("pick", 0.4));
  })(), _v1985.ritual.st === "idle" && 0) : (function () {
    if (!n.Z || n.Z.type !== "map") return 0;
    let _v2004 = n.objs.find(_v2005 => _v2005.kind === "ritual" && _v2005.st === "idle" && (_v1985.x - _v2005.x) ** 2 + (_v1985.y - _v2005.y) ** 2 < 36100);
    return _v2004 ? (_v2004.stored = (_v2004.stored || 0) + 1 + (_v1985.rar || 0) * 2, E(_v2004.x, _v2004.y, 10, RIT_COL, 30, 0.4, {
      glow: !0
    }), 1) : 0;
  })());
  let _v2006 = G("kill:explode", {
    m: _v1985,
    src: _v1986,
    o: _v1987,
    ex: _v1986 && _v1986.c && _v1986.c.explode || 0
  });
  if (_v2006.ex > 0) {
    let _v2007 = _v1985.x, _v2008 = _v1985.y, _v2009 = wa(_v1985) * _v2006.ex, _v2010 = _v1985.rar >= 2 ? 34 : 26;
    n.pend.push({
      t: 0.07,
      fn: () => gr(_v2007, _v2008, _v2009, _v2010, _v1986)
    });
  }
  if (_v1985.mods.some(_v2011 => _v2011.k === "frostbody")) {
    let _v2012 = _v1985.x, _v2013 = _v1985.y, _v2014 = _v1985.dmg * 1.6;
    (n.fx.push({
      k: "tele",
      x: _v2012,
      y: _v2013,
      r: 34,
      t: 0,
      max: 0.65,
      col: "#9fe8ff"
    }), n.pend.push({
      t: 0.65,
      fn: () => {
        (n.fx.push({
          k: "ring",
          x: _v2012,
          y: _v2013,
          r0: 4,
          r1: 34,
          t: 0,
          max: 0.3,
          col: "#bfefff",
          w: 2
        }), E(_v2012, _v2013, 20, ["#bfefff", "#5fb4e8"], 120, 0.5), $("ice"), (n.pl.x - _v2012) ** 2 + (n.pl.y - _v2013) ** 2 < 1444 && sa(_v2014, "cold", {
          area: 1
        }));
      }
    }));
  }
  if ((G("kill", {
    m: _v1985,
    src: _v1986,
    o: _v1987
  }), _v1985.rar === 2 && (ie.stop && (n.hitstop = Math.max(n.hitstop, 0.07)), X(0.2)), _v1985.rar === 3)) {
    if ((n.hitstop = 0.22, n.slowT = 1, X(0.7), n.flashW = 0.5, _v1985.guard)) {
      ($("slam"), qe(_v1985.x, _v1985.y, "scorch", 16), n.fx.push({
        k: "lines",
        x: _v1985.x,
        y: _v1985.y - 10,
        t: 0,
        max: 0.3
      }), G("tower:guard", {
        m: _v1985
      }));
      return;
    }
    if ((n.Z.done = !0, n.run && (n.run.bossDead = !0), $("slam"), ke(_v1985.name + " 已陨落", "地图完成 · 按 T 返回藏身处结算"), qe(_v1985.x, _v1985.y, "scorch", 16), n.fx.push({
      k: "lines",
      x: _v1985.x,
      y: _v1985.y - 10,
      t: 0,
      max: 0.3
    }), ue(_v1985.x, _v1985.y, {
      kind: "it",
      it: Zt($e(n.Z.tier + (I() < G("boss:map", {
        m: _v1985,
        up: 0.45
      }).up ? 1 : 0), 1, 16))
    }), n.Z.tier >= 16 && I() < (n.Z.tier >= 17 ? _c.dropT17 : _c.dropT16) && ue(_v1985.x, _v1985.y, {
      kind: "it",
      it: Zt(17)
    }), n.Z.tier >= 16 && I() < (n.Z.tier >= 17 ? 0.5 : 0.25) && ue(_v1985.x, _v1985.y, {
      kind: "cur",
      cur: "frac"
    }), n.Z.tier >= 17)) {
      ue(_v1985.x, _v1985.y, {
        kind: "cur",
        cur: "divine"
      });
      for (let _v2015 = 0; _v2015 < 2; _v2015++) ue(_v1985.x, _v1985.y, {
        kind: "cur",
        cur: "exalt"
      });
      let _v2016 = yt.filter(_v2017 => _v2017.src === "world" && !_v2017.noDrop);
      _v2016.length && I() < 0.6 && ue(_v1985.x, _v1985.y, {
        kind: "it",
        it: Kt(oe(_v2016), n.Z.lvl)
      });
    }
    let _v2018 = 0;
    for (let _v2019 of Us) n.Z.tier >= _v2019 && !u.trials.includes(_v2019) && (u.trials.push(_v2019), _v2018 += 2);
    (_v2018 && (u.ascPts += _v2018, setTimeout(() => ke("升华试炼完成", "升华点 +" + _v2018 + (u.asc ? "" : " · 按 P 选择你的升华")), 1600)), n.Z.tier >= 6 && I() < 0.1 + Math.min(0.1, n.Z.tier * 0.006) && OmDrop(_v1985.x, _v1985.y), G("boss:kill", {
      m: _v1985
    }));
  }
};
sa = function (_v2020, _v2021, _v2022 = {}) {
  if (n.state !== "play" || !n.Z || n.Z.type !== "map" || n.pl.dead || u.god || G("player:avoid", {
    amt: _v2020,
    el: _v2021,
    o: _v2022,
    avoided: !1
  }).avoided) return !1;
  let _v2023 = n.Z.ms.mods;
  if ((!_v2022.dot && !_v2022.noCrit && I() < Ie.mon.crit * (1 + (_v2023.monCrit || 0) / 100) && (_v2020 *= 1.5), _v2020 = G("player:mitigate", {
    amt: _v2020,
    el: _v2021,
    o: _v2022
  }).amt, n.pl.shockT > 0 && (_v2020 *= 1 + n.pl.shockAmt), _v2021 === "phys" ? _v2020 *= 1 - Math.min(0.9, n.S.armour / (n.S.armour + 6 * _v2020)) : _v2020 *= 1 - Math.min(UniqueResCap(), (n.S.res[_v2021] || 0) - (_v2023.playerRes || 0)) / 100, _v2020 = G("player:mitigate:post", {
    amt: _v2020,
    el: _v2021,
    o: _v2022
  }).amt, _v2022.dot || (n.pl.sinceHit = 0), n.pl.esDelay = n.S.esDelay, n.pl.es > 0)) {
    let _v2024 = Math.min(n.pl.es, _v2020);
    (n.pl.es -= _v2024, _v2020 -= _v2024);
  }
  return (n.pl.hp - _v2020 <= 0 && G("player:lethal", {
    amt: _v2020,
    o: _v2022,
    prevented: !1
  }).prevented || (n.pl.hp -= _v2020, G("player:hurt", {
    amt: _v2020,
    el: _v2021,
    o: _v2022
  }), !_v2022.dot && _v2020 > 0.5 && (n.pl.hurtT = 0.14, X(Math.min(0.5, 0.1 + _v2020 / n.S.maxLife)), $("hurt"), U(n.pl.x, n.pl.y - 20, _v2020, !1, "hurt"), n.edgeFlash = Math.min(1, 0.25 + _v2020 / n.S.maxLife * 2), _v2020 > n.S.maxLife * 0.3 && !_v2022.area && !n.S.noStagger && (n.pl.stagT = 0.25, n.pl.act = null, U(n.pl.x, n.pl.y - 28, 0, !1, "info", "硬直"))), n.pl.hp > 0 && n.pl.hp <= n.S.maxLife * 0.35 && n.pl.hp + _v2020 > n.S.maxLife * 0.35 && OmTake("omen_refresh") && (u.flask.forEach(_v2025 => _v2025.ch = _v2025.max), ke("恢复预兆", "药剂充能已回满")), n.pl.hp > 0 && n.pl.hp <= n.S.maxLife * 0.35 && n.pl.hp + _v2020 > n.S.maxLife * 0.35 && OmHas("omen_resurgence") && OmTake("omen_resurgence", n.pl.x, n.pl.y - 24) && (n.pl.hp = n.S.maxLife, n.pl.mana = n.S.maxMana, n.pl.es = n.S.maxES, E(n.pl.x, n.pl.y, 40, ["#80e0a0", "#ffffff"], 90, 0.9, {
    glow: !0,
    vz: 140,
    g: 60
  })), n.pl.hp <= 0 && P$()), !0);
};
P$ = function () {
  (n.pl.dead = !0, n.pl.hp = 0, n.state = "dead", $("slam"), n.slowT = 1.2, X(0.8), E(n.pl.x, n.pl.y, 40, ["#a81d2c", "#5a1018", "#574468"], 100, 1.2, {
    vz: 120
  }), setTimeout(() => {
    if (n.state !== "dead") return;
    let _v2026 = Math.min(u.xp, Math.floor(qc(u.level) * Ie.xp.deathLoss)), _v2027 = _v2026 > 0 && OmTake("omen_amelioration", n.pl.x, n.pl.y - 20);
    (_v2027 && (_v2026 = Math.floor(_v2026 * 0.25)), u.xp = Math.max(0, u.xp - _v2026), n.run && (n.run.died = !0), Ve(`<div class="ovbox"><h1 style="color:#c8303a;font-size:clamp(34px,7vw,60px)">你已死亡</h1><p class="sub">经验损失 ${ze(_v2026)}${_v2027 ? " · 进步预兆减免 75%" : ""} · 地图已失效</p>${V5(n.run)}<div class="ovbtns" style="margin-top:18px"><button class="btn primary" id="ovBack">返回藏身处</button></div></div>`), C("#ovBack").onclick = () => {
      (xt(), od(!0));
    });
  }, 1100));
};
s7 = function () {
  A("kill", ({m: _v2028}) => {
    if (!n.Z || !u) return;
    let _v2029 = n.Z.tier || 0, _v2030 = _v2028.ub ? 0.2 : _v2028.rar === 3 && n.Z.type === "map" && !_v2028.guard ? z6(_v2029) : 0;
    _v2030 && I() < _v2030 && ue(_v2028.x, _v2028.y, {
      kind: "cur",
      cur: "ember"
    });
    _v2028.rar === 2 && n.Z.type === "map" && I() < 0.015 && OmDrop(_v2028.x, _v2028.y);
    _v2028.rar === 3 && n.Z.type === "map" && I() < 0.4 && JewelDrop(_v2028.x, _v2028.y);
  });
};
U$ = function () {
  let _v2031 = [];
  if (!n.pl || !n.S) return _v2031;
  if ((n.S.cls === "samurai" && _v2031.push([n.pl.sheReady ? "纳刀 ✓" : "纳刀 " + Math.min(1.2, n.pl.idleAtk).toFixed(1), n.pl.sheReady]), n.S.asc.has("focus") && _v2031.push(["凝神 " + n.pl.focus, n.pl.focus >= 5]), n.S.asc.has("momentum") && _v2031.push(["动量 " + n.pl.mom, n.pl.mom >= 20]), n.S.asc.has("shuraba") && _v2031.push(["杀意 " + n.pl.kills, n.pl.kills >= 25]), n.pl.kishinT > 0 && _v2031.push(["鬼神化 " + n.pl.kishinT.toFixed(1), !0]), n.pl.demon > 0 && _v2031.push(["魔焰 " + n.pl.demon, n.pl.demon >= 10]), n.pl.drunkT > 0 && _v2031.push(["醉意 " + n.pl.drunkT.toFixed(0), !0]), n.pl.pdT > 0 && _v2031.push(["见切", !0]), n.pl.critNextT > 0 && _v2031.push(["必暴", !0]), (u.skills.some(_v2032 => _v2032 && _v2032.gid === "hyakka") || n.pl.ki > 0) && _v2031.push(["刀意 " + n.pl.ki, n.pl.ki >= 10]), u.skills.some(_v2033 => _v2033 && _v2033.gid === "salvo") && _v2031.push(["冰箭 " + n.pl.salvo, n.pl.salvo >= 6]), n.pl.shrineT > 0 || n.pl.shrineT2 > 0)) {
    let _v2034 = n.pl.shrineT > 0 && is.find(_v2035 => _v2035.k === n.pl.shrine);
    _v2034 && _v2031.push([_v2034.n + " " + Math.ceil(n.pl.shrineT), !0]);
    let _v2036 = n.pl.shrineT2 > 0 && is.find(_v2037 => _v2037.k === n.pl.shrine2);
    _v2036 && _v2031.push([_v2036.n + " " + Math.ceil(n.pl.shrineT2), !0]);
  }
  u.om && Object.keys(u.om).forEach(_v2038 => {
    let _v2039 = q[_v2038];
    _v2039 && _v2031.push([_v2039.n, !0]);
  });
  n.sim && n.sim.active && n.Z && n.Z.simLayer && _v2031.push(["迷雾副本 " + n.sim.layer + "/" + n.sim.max + " 层 · 亢奋 " + n.sim.depth + "% · 伤害 -" + DelDRPct() + (n.sim.layer > 18 ? "% · 怪伤 +" + Math.round((SimDmgMul(n.sim.layer) - 1) * 100) + "%" : "%"), !0]);
  n.del && _v2031.push([n.del.outT > 0 ? "离开迷雾 " + Math.max(0, 5 - n.del.outT).toFixed(1) + "s" : "亢奋度 " + Math.round(n.del.depth) + "%" + (n.del.base ? " (基础 " + n.del.base + "%)" : "") + " · 伤害 -" + DelDRPct() + "%" + (n.del.pauseT > 0 ? " · 迷雾暂停" : ""), !0]);
  return (n.pl.noutouT > 0 && _v2031.push(["纳刀·无拍子", !0]), n.pl.parryBuffT > 0 && _v2031.push(["弹刀·重击", !0]), n.pl.waveT > 0 && _v2031.push(["寒冰波 ×2", !0]), n.pl.disT > 0 && _v2031.push(["撤离→重刺", !0]), n.minions.length && _v2031.push(["骷髅 " + n.minions.length, !1]), n.pl.ds > 0 && _v2031.push(["斗志 " + n.pl.ds, n.pl.ds >= (n.S.dsCap || 10)]), u.god && _v2031.push(["无敌", !0]), n.pl.tailT > 0 && _v2031.push(["顺风", !0]), n.pl.rangerT > 0 && _v2031.push(["游击", !1]), n.pl.overT > 0 && _v2031.push(["霸主", !0]), n.pl.markT > 0 && _v2031.push(["猎杀", !1]), n.pl.eoT > 0 && _v2031.push(["元素超载", !0]), t5(_v2031), _v2031);
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
  var _v2044 = C("#curbar");
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
    var _v2050 = Tt.filter(function (_v2051) {
      return q[_v2051].grp === _v2049 && (!q[_v2051].rn || (u.cur[_v2051] || 0) > 0);
    });
    if (!_v2050.length) return;
    var _v2052 = _v2042[_v2049] != null ? !!_v2042[_v2049] : _v2049 === "basic" || _v2049 === "omen";
    _v2048 += '<details class="curfold" data-g="' + _v2049 + '"' + (_v2052 ? " open" : "") + '><summary><span class="cg">' + _v2040[_v2049] + "</span><small>" + _v2050.length + "</small></summary><div class=\"curgrid\">";
    _v2050.forEach(function (_v2053) {
      if (_v2049 === "omen") _v2048 += '<div class="cur om' + (OmActive(_v2053) ? " on" : "") + (u.cur[_v2053] ? "" : " zero") + '" data-act="omen" data-k="' + _v2053 + '" data-tt="cur:' + _v2053 + '"><img src="' + Ye[_v2053] + '" alt=""><span>' + (q[_v2053].s || q[_v2053].n) + "</span><b>" + (u.cur[_v2053] || 0) + "</b>" + (OmActive(_v2053) ? '<i class="omtag">激活</i>' : "") + "</div>"; else _v2048 += '<div class="cur' + (n.held === _v2053 ? " sel" : "") + (u.cur[_v2053] ? "" : " zero") + '" data-act="cur" data-k="' + _v2053 + '" data-tt="cur:' + _v2053 + '"><img src="' + Ye[_v2053] + '" alt=""><span>' + q[_v2053].n + "</span><b>" + (u.cur[_v2053] || 0) + "</b></div>";
    });
    _v2048 += "</div></details>";
  });
  return _v2048;
}
Gs = function () {
  if (!n.tab) return;
  OmPrune();
  document.querySelectorAll("#tabs button").forEach(_v2054 => _v2054.classList.toggle("on", _v2054.dataset.tab === n.tab));
  let _v2055 = C("#pbody"), _v2056 = _v2055.scrollTop;
  (_v2055.innerHTML = n.tab === "map" ? i1() : n.tab === "inv" ? K$() : n.tab === "cur" ? curPage() : n.tab === "gem" ? a5() : n.tab === "atlas" ? s5() : n.tab === "debug" ? n5() : n.tab === "codex" ? o5() : V$(), _v2055.scrollTop = _v2056, _v2055.querySelectorAll("[data-pv]").forEach(_v2057 => _v2057.replaceWith(Qp(_v2057.dataset.pv))));
  let _v2058 = C("#tabDebug");
  _v2058 && (_v2058.hidden = !u.debug);
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
  (C("#curbar").innerHTML = CurbarHTML(), n.tab === "tree" && setTimeout(() => {
    (q1(!1), Ea());
  }, 0), n.tab === "tree" && setTimeout(() => {
    if (n.advTab === "base" || n.advTab === "star") AdvAfterRender(); else (q1(!1), Ea());
  }, 0), n.tab === "atlas" && setTimeout(AtlasAfterRender, 0));
};
l1 = function () {
  let _v2060 = n.S, _v2061 = _v2062 => _v2060.a[_v2062] || 0, _v2063 = (_v2064, _v2065) => `<div class="row"><span>${_v2064}</span><b>${_v2065}</b></div>`, _v2066 = n.Z && n.Z.ms && n.Z.ms.mods.playerRes || 0, _v2067 = _v2068 => {
    let _v2069 = _v2060.res[_v2068] - _v2066;
    return `<span style="color:${_v2069 >= UniqueResCap() ? "var(--up)" : _v2069 < 0 ? "var(--down)" : "inherit"}">${Math.min(UniqueResCap(), _v2069)}%${_v2069 > UniqueResCap() ? " (" + _v2069 + ")" : ""}</span>`;
  }, _v2070 = `<div class="sec">${le[u.cls].n}${u.asc ? " · " + Ce[u.asc].n : ""}</div><div class="dim" style="font-size:11.5px">${le[u.cls].trait}</div>`;
  return (_v2070 += '<div class="sec">防御</div>' + _v2063("最大生命", Math.round(_v2060.maxLife)) + _v2063("能量护盾", Math.round(_v2060.maxES)) + _v2063("最大魔力", Math.round(_v2060.maxMana)) + _v2063("护甲", Math.round(_v2060.armour)) + _v2063("火焰抗性", _v2067("fire")) + _v2063("冰霜抗性", _v2067("cold")) + _v2063("闪电抗性", _v2067("light")) + _v2063("生命回复", Gt(_v2060.regen) + "/秒") + _v2063("生命偷取", (_v2060.leech * 100).toFixed(1) + "%"), _v2070 += _v2063("格挡几率", Math.round(_v2060.block || 0) + "%") + _v2063("精魂", _v2060.spUsed + " / " + _v2060.spMax) + _v2063("药剂效果", "×" + (_v2060.flaskEff || 1).toFixed(2)), _v2060.buffs.size && (_v2070 += '<div class="sec">精魂增益</div>' + [..._v2060.buffs].map(_v2071 => {
    let _v2072 = He[_v2071] || Ze[_v2071];
    return _v2063(`<span style="color:${_v2072.col}">${_v2072.n}</span>`, _v2072.spirit);
  }).join("")), (_v2060.souls || []).length && (_v2070 += '<div class="sec">伙伴</div>' + _v2060.souls.map(_v2073 => _v2063(`<span style="color:${je[_v2073.beast].col}">${O(je[_v2073.beast].n)}</span>`, ze(ks(_v2073)) + "/秒")).join("")), _v2070 += '<div class="sec">收益与机动</div>' + _v2063("图谱路线", Fd(pi())) + _v2063("物品稀有度", "+" + Math.round(_v2060.rarity) + "%") + _v2063("物品数量", "+" + Math.round(_v2060.quant) + "%") + _v2063("移动速度", "+" + Math.round(_v2061("moveInc")) + "%") + _v2063("翻滚冷却", _v2060.rollCd.toFixed(2) + " 秒"), _v2070 += '<div class="sec">技能 DPS(单体估算)</div>' + u.skills.map((_v2074, _v2075) => _v2074 ? _v2063(se[_v2074.gid].n + (n.SKC[_v2075].wtOK ? "" : " ✕"), n.SKC[_v2075].wtOK ? ze(n.SKC[_v2075].dps) : "需要" + n.SKC[_v2075].wtNeed) : "").join(""), _v2060.ks.size && (_v2070 += '<div class="sec">基石天赋</div>' + [..._v2060.ks].map(_v2076 => _v2063((xe.nodes.find(_v2077 => _v2077.ks === _v2076) || ({
    name: _v2076
  })).name, "✓")).join("")), _v2070);
};
qs = function (_v2078, _v2079) {
  /* 官方 v19.2 的 qs 自带珠宝分支（`if(e.kind==="jewel")return Tx(e,t)`），
     Tx 里有传奇珠宝的转换效果 / 腐化 / 破溃 / 插槽提示等完整信息。
     这里只接管扩展珠宝，官方珠宝一律交回官方实现。 */
  if (PortIsExtJewel(_v2078)) return JewelTooltip(_v2078);
  if (_v2078 && _v2078.kind === "jewel") return _asJewel.apply(this, arguments);
  if (_v2078.kind === "gem") {
    let _v2080 = se[_v2078.gid], _v2081 = ri(_v2078, n.S), _v2082 = ir(_v2078.lvl);
    return {
      b: "#2ec4a0",
      h: `<div class="th" style="color:#4fe0c0">${_v2080.n}<small>主动技能宝石${_v2080.wt ? " · " + _v2080.wt.map(_v2083 => _t[_v2083]).join("/") : ""}</small></div><div class="tb"><div class="p">${_v2080.tags.map(_v2084 => gf[_v2084] || _v2084).join(" · ")}</div>${(() => {
        let _v2085 = mn.filter(_v2086 => Ut[_v2086].pool.includes(_v2078.gid));
        return _v2085.length ? '<div class="p" style="color:#e8c890">' + _v2085.map(_v2087 => le[_v2087].n).join("/") + " 专属技能</div>" : "";
      })()}<div class="p">等级 <b>${_v2078.lvl}</b> · 插槽 <b>${_v2078.sock}</b>/5${_v2080.cd ? " · 冷却 <b>" + _v2081.cd.toFixed(1) + "s</b>" : ""} · 经验 <b>${_v2078.lvl >= 20 ? "MAX" : ze(_v2078.xp) + "/" + ze(_v2082)}</b></div><div class="sep"></div><div class="md">${_v2080.d}</div><div class="sep"></div>${_v2081.wtOK ? `<div class="p">按当前装备: DPS <b>${ze(_v2081.dps)}</b> · 均伤 <b>${ze(_v2081.avg)}</b></div>` : `<div class="p" style="color:var(--down)">需要装备 ${_v2081.wtNeed}</div>`}${_v2080.tags.includes("attack") ? '<div class="hint">使用武器伤害 · 伤害效用 ' + Math.round(_v2080.eff * (1 + 0.03 * (_v2081.lvl - 1)) * 100) + "%</div>" : '<div class="hint">装备上的附加伤害对法术按 60% 生效</div>'}${_v2080.tags.includes("melee") ? '<div class="hint" style="color:#e8b070">近战本能: 伤害总增 40% · 范围 +15% · 命中积累斗志(每层受到伤害 -2%、近战攻速 +1%) · 命中回复生命</div>' : ""}</div>`
    };
  }
  if (_v2078.kind === "buff") {
    let _v2088 = He[_v2078.gid], _v2089 = n.S.buffs.has(_v2078.gid) && _v2079 === "buff";
    return {
      b: _v2088.col,
      h: `<div class="th" style="color:${_v2088.col}">${_v2088.n}<small>精魂宝石 · 持续增益</small></div><div class="tb"><div class="p">保留 <b>${_v2088.spirit}</b> 精魂 · 当前 ${n.S.spUsed}/${n.S.spMax}</div><div class="sep"></div><div class="md">${_v2088.d}</div><div class="sep"></div><div class="hint">${_v2079 === "buff" ? _v2089 ? "生效中 · 点击卸下" : "精魂不足, 未生效 · 点击卸下" : "点击放入增益槽"}</div></div>`
    };
  }
  if (_v2078.kind === "meta") {
    let _v2090 = Ze[_v2078.gid], _v2091 = _v2079 === "buff" && n.S.buffs.has(_v2078.gid);
    return {
      b: _v2090.col,
      h: `<div class="th" style="color:${_v2090.col}">${_v2090.n}<small>元技能宝石 · 保留 ${_v2090.spirit} 精魂</small></div><div class="tb"><div class="md">${_v2090.d}</div><div class="sep"></div><div class="p">内含法术: ${_v2078.inner.map(_v2092 => _v2092 ? se[_v2092.gid].n : "空").join(" / ")}</div><div class="p">能量 <b>${Math.floor(_v2078.energy || 0)}</b>/100</div><div class="hint">只能插入定点、投射或印记类法术 · ${_v2079 === "buff" ? _v2091 ? "生效中" : "精魂不足" : "点击放入精魂槽"}</div></div>`
    };
  }
  if (_v2078.kind === "sup") {
    let _v2093 = ne[_v2078.gid];
    return {
      b: _v2093.mech ? "#c8a040" : "#2ec4a0",
      h: `<div class="th" style="color:${_v2093.mech ? "#ffd27a" : "#4fe0c0"}">${_v2093.n}<small>${_v2093.mech ? "机制辅助宝石" : "辅助宝石"}</small></div><div class="tb"><div class="p">适用: ${_v2093.req ? _v2093.req.split("|").map(_v2094 => _v2094.split("+").map(_v2095 => gf[_v2095] || _v2095).join(" + ")).join(" 或 ") : "所有技能"}${_v2093.noChannel ? " (非引导)" : ""}</div><div class="sep"></div><div class="md">${_v2093.d}</div><div class="sep"></div><div class="p" style="color:${An[_v2078.gid] ? ko : "#6a5a50"}">${An[_v2078.gid] ? "<span>插在兽栏 · 对伙伴:</span> " + km(_v2078.gid) : "插在兽栏: 对伙伴无效"}</div><div class="hint">每个辅助使技能消耗 ×1.1</div></div>`
    };
  }
  if (_v2078.kind === "map") {
    let _v2096 = Ds(_v2078);
    return {
      b: "#c8c8c8",
      h: `<div class="th" style="color:${["#f0f0f0", "#8a8cff", "#ecd85a"][_v2078.rarity]}">${O(_v2078.name)}<small>T${_v2078.tier} 地图 · ${O(_v2078.base)}</small></div><div class="tb"><div class="p">区域等级 <b>${Ro(_v2078.tier)}</b> · 物品数量 <b>+${_v2096.quant}%</b> · 稀有度 <b>+${_v2096.rar}%</b></div>${_v2078.tier >= 17 ? '<div class="p t17">深渊之境 · 怪物生命 +120% · 伤害 +60% · 速度 +20% · 魔法/稀有怪大幅增加</div><div class="p t17r">首领必掉神圣石与崇高石 ×2 · 高几率额外传奇 · 40% 掉落新的 T17</div>' : ""}${_v2078.dbg ? '<div class="p" style="color:#7fe0ff">' + Xk(_v2078) + "</div>" : ""}${_v2078.mods.length ? '<div class="sep"></div>' + _v2078.mods.map(_v2097 => {
        let _v2098 = Wo[_v2097.id];
        return `<div class="md">${O(Xs(_v2098, _v2097.v))}<span class="tg">${_v2098.t === "P" ? "前缀" : "后缀"} 数量+${_v2098.q[_v2097.ti]}%</span></div>`;
      }).join("") : ""}${_v2078.invest ? '<div class="sep"></div><div class="p">已投入 <b>' + Gt(_v2078.invest) + "c</b></div>" : ""}<div class="sep"></div><div class="hint">${_v2079 === "dev" ? "点击取回" : "点击放入地图装置"} · 可用通货改造</div></div>`
    };
  }
  if (_v2078.kind === "soul") return J$(_v2078, _v2079);
  let _v2099 = pe[_v2078.base], _v2100 = _v2078.rarity === 3 ? Ua[_v2078.uniq] : null, _v2101 = `<div class="th" style="color:${Yo[_v2078.rarity]}">${O(_v2078.name)}${_v2078.rarity >= 2 || _v2100 ? "<small>" + O(_v2078.base) + "</small>" : ""}</div><div class="tb"><div class="p">${_v2099.wt ? _t[_v2099.wt] : Es[_v2078.slot]} · 物品等级 <b>${_v2078.ilvl}</b></div>`;
  if (_v2099.wpn) {
    let _v2102 = _v2078.mods.filter(_v2103 => _v2103.id === "physInc").reduce((_v2104, _v2105) => _v2104 + _v2105.v[0], 0) + RunePhysIncOf(_v2078), _v2106 = _v2078.mods.filter(_v2107 => _v2107.id === "addPhys").reduce((_v2108, _v2109) => [_v2108[0] + _v2109.v[0], _v2108[1] + _v2109.v[1]], [0, 0]);
    (_v2101 += `<div class="p">物理伤害 <b style="color:${_v2102 || _v2106[0] ? "#8f9cff" : ""}">${Math.round((_v2099.wpn[0] + _v2106[0]) * (1 + _v2102 / 100))}–${Math.round((_v2099.wpn[1] + _v2106[1]) * (1 + _v2102 / 100))}</b> · 攻速 <b>${_v2099.aps}</b> · 暴击 <b>${_v2099.crit}%</b></div>`, _v2099.wt !== le[u.cls].wt && (_v2101 += '<div class="hint">非本职业初始武器, 需要配合对应技能宝石</div>'));
  }
  if ((_v2099.def && (_v2101 += `<div class="p">${Object.entries(_v2099.def).map(([_v2110, _v2111]) => (_v2110 === "es" ? "能量护盾 " : "护甲 ") + "<b>" + _v2111 + "</b>").join(" · ")}</div>`), _v2078.impl.length && (_v2101 += '<div class="sep"></div>' + _v2078.impl.map(_v2112 => `<div class="md">${O(Xs(ta[_v2112.id], _v2112.v))}</div>`).join("")), _v2078.cimpl && (_v2101 += '<div class="sep"></div><div class="md" style="color:#ff6060">' + O(_a(_v2078.cimpl.k, _v2078.cimpl.v)) + '<span class="tg">腐化</span></div>'), _v2078.cimpl2 && (_v2101 += '<div class="md" style="color:#ff6060">' + O(_a(_v2078.cimpl2.k, _v2078.cimpl2.v)) + '<span class="tg">双重腐化</span></div>'), _v2078.mods.length && (_v2101 += AffixBlocksHTML(_v2078)), _v2078.meta && (_v2101 += `<div class="md metal">◈ ${_v2078.meta === "P" ? "前缀无法被改变" : "后缀无法被改变"} <span class="tg">${_v2078.meta === "P" ? "工艺 · 占用 1 个后缀" : "工艺 · 占用 1 个前缀"}</span></div>`), _v2078.ds && (_v2101 += `<div class="md dsline">◇ 未揭示的渎灵词缀 <span class="tg ds">${q[_v2078.ds.bone].n}</span> <small class="dim">去灵魂之井揭示</small></div>`), _v2100 && (_v2101 += _v2100.st.map(_v2113 => `<div class="sp">${_v2113}</div>`).join(""), _v2101 += `<div class="sep"></div><div class="fl">${_v2100.fl}</div>`), _v2078.rsock)) {
    _v2101 += '<div class="sep"></div>';
    if ((_v2078.runes || []).length) _v2101 += '<div class="hint" style="color:#e8c870">按住 Shift 锁定预览，再点取出</div>';
    let __specialFrom = _v2078.rsock - (_v2078.specialRsock || 0);
    for (let _v2114 = 0; _v2114 < _v2078.rsock; _v2114++) {
      let _v2115 = (_v2078.runes || [])[_v2114];
      let __isSp = _v2114 >= __specialFrom;
      _v2101 += _v2115 ? `<div class="md" style="color:${q[_v2115].col}">◆ ${q[_v2115].n}: ${i3(_v2115, _v2078.slot)}${__isSp ? ' <span class="tg">符文之语</span>' : ""} <button class="btn small" data-runeout="${_v2078.uid}:${_v2114}" style="padding:0 5px;font-size:10px">取出</button></div>` : `<div class="p dim">◇ ${__isSp ? "特殊符文槽 · 仅限符文之语" : "空符文插槽"}</div>`;
    }
  }
  _v2101 += RuneWordTipHTML(_v2078);
  if (hf(_v2078.slot)) {
    let _v2116 = u.equip.weapon && pe[u.equip.weapon.base].wt || "none";
    (ya[_v2116] || []).includes(va[_v2078.slot]) || (_v2101 += '<div class="hint" style="color:var(--down)">与当前武器不兼容</div>');
  }
  return (_v2078.corrupted && (_v2101 += `<div class="p" style="color:#ff5050;font-weight:700">${_v2078.cimpl2 ? "双重腐化" : "已腐化"}</div>`), _v2101 += Hf(_v2078), _v2079 === "inv" && (_v2101 += oi(_v2078)), _v2101 += `<div class="sep"></div><div class="hint">${_v2079 === "inv" ? "左键装备 - 右键出售 - Alt+左键锁定" : _v2079 === "eq" ? "点击卸下" : ""}</div></div>`, {
    b: _v2078.rarity === 3 ? "#d2803a" : _v2078.rarity === 2 ? "#8a7a24" : _v2078.rarity === 1 ? "#3e40a0" : "#666",
    h: _v2101
  });
};
el = function (_v2117) {
  let _v2118 = q[_v2117];
  if (_v2118.grp === "rune") {
    let _v2119 = (RUNE_WORDS || []).filter(function (_v2120) {
      return _v2120.seq.indexOf(_v2117) >= 0;
    }).slice(0, 4).map(function (_v2121) {
      return _v2121.n;
    }).join(" / ");
    return {
      b: _v2118.col,
      h: '<div class="th" style="color:' + _v2118.col + '">' + _v2118.n + "<small>符文 · 持有 " + (u.cur[_v2117] || 0) + '</small></div><div class="tb"><div class="md">武器: ' + i3(_v2117, "W") + '</div><div class="md">防具: ' + i3(_v2117, "A") + "</div>" + (_v2119 ? '<div class="sep"></div><div class="p" style="color:#e8c870">参与符文之语: ' + _v2119 + "</div>" : "") + '<div class="sep"></div><div class="p">账本估值 <b>' + Gt(_v2118.v) + 'c</b> · 获取: 工艺台「符文合成」</div><div class="hint">镶嵌在装备上生效 · 多颗符文的镶嵌顺序决定符文之语</div></div>'
    };
  }
  if (_v2118.grp === "omen") {
    let _v2122 = OmActive(_v2117), _v2123 = _v2118.og === "worldRes" || _v2118.og === "worldExp", _v2124 = OmIsAbyss(_v2117) ? "深渊预兆" : OmIsWorld(_v2117) ? "冒险预兆" : "工艺预兆", _v2125 = _v2118.mt > 1 ? "T" + _v2118.mt + "+ " : "", _v2126 = _v2123 ? "每个副本只能在战斗中触发一个预兆。" : OmIsAbyss(_v2117) ? "只在深渊/渎灵相关操作中生效 · 同类只能激活 1 个" : OmIsWorld(_v2117) ? "满足条件时自动触发并消耗" : "同类预兆只能激活 1 个 · 工艺预兆可以与其他类别并存";
    return {
      b: _v2122 ? "#c070ff" : "#8a7a9a",
      h: `<div class="th" style="color:${_v2122 ? "#d8a8ff" : "#b8a8c8"}">${_v2118.n}<small>预兆 · 持有 ${u.cur[_v2117] || 0}</small></div><div class="tb"><div class="md">此物品在你的背包中激活时, ${_v2118.d}</div><div class="sep"></div><div class="md">${_v2122 ? '<span style="color:#c070ff">已激活 · 下次满足条件时生效</span>' : "未激活 · 点击通货栏或工艺台里的预兆激活"}</div><div class="p">${_v2124} · ${_v2126}</div><div class="p">账本估值 <b>${Gt(_v2118.v)}c</b> · 来源: ${_v2125}宝箱、稀有怪与首领</div><div class="hint">点击此物品以将其激活。此物品触发效果时会被消耗。</div></div>`
    };
  }
  return {
    b: "#b4a070",
    h: `<div class="th" style="color:#e8d8a8">${_v2118.n}<small>通货 · 持有 ${u.cur[_v2117] || 0}</small></div><div class="tb"><div class="md">${_v2118.d}</div>${_v2118.grp === "bone" ? DsBoneTip(_v2117) : ""}<div class="sep"></div><div class="p">账本估值 <b>${Gt(_v2118.v)}c</b> · 掉落权重 <b>${_v2118.w}</b></div><div class="hint">点击选中, 再点击物品或地图使用</div></div>`
  };
};
Vf = function (_v2127, _v2128) {
  let _v2129 = _v2127.mods.filter(_v2130 => _v2130.t === _v2128 && AffixClass(_v2130) === "regular"), _v2131 = AffixSideCap(_v2127, _v2128), _v2132 = we.last && we.last.d ? we.last.d.filter(_v2133 => _v2133.k === "add" || _v2133.k === "ch" || _v2133.k === "fr").map(_v2134 => _v2134.m.id) : [], _v2135 = _v2129.map(_v2136 => {
    let _v2137 = qa(_v2127, _v2136.id), _v2138 = _v2137.ranges.length - _v2136.ti, _v2139 = (_v2136.fr ? '<i class="bst fr">破溃</i>' : _v2127.meta === _v2128 ? '<i class="bst lk">锁定</i>' : "") + (_v2136.ex ? '<i class="bst ex">超越</i>' : "") + (_v2136.dsec ? '<i class="bst ds">渎灵</i>' : "");
    return `<div class="baff${_v2138 === 1 ? " t1" : ""}${Qr(_v2127, _v2136) ? " fixed" : ""}${_v2136.fr ? " frx" : ""}${_v2132.includes(_v2136.id) ? " fresh" : ""}"><span class="btier">T${_v2138}</span><span class="btxt">${O(Xs(_v2137, _v2136.v))}</span>${_v2139}</div>`;
  }).join("");
  _v2127.meta && _v2127.meta !== _v2128 && (_v2135 += `<div class="baff metarow"><span class="btier">◈</span><span class="btxt">${_v2127.meta === "P" ? "前缀锁定 · 占用 1 个后缀位" : "后缀锁定 · 占用 1 个前缀位"}</span><i class="bst lk">工艺</i></div>`);
  for (let _v2140 = _v2129.length; _v2140 < _v2131; _v2140++) _v2135 += '<div class="baff empty"><span class="btier">—</span><span class="btxt">空位</span></div>';
  return _v2135;
};
q6 = function (_v2141, _v2142) {
  let _v2143 = _v2142 ? pp(_v2141, _v2142) : "先选一件装备", _v2144 = u.cur[_v2141] || 0, _v2145 = OmHint(_v2141), _v2146 = _v2145 ? "预兆生效 · " + _v2145 : _v2141 === "vaal" && !_v2143 ? (u.pity || 0) >= _i ? "怨念已满 · 必出腐化词缀" : "赌一把 · 怨念 " + (u.pity || 0) + "/" + _i : Am[_v2141] || "必定带有对应词缀";
  return `<button class="bcur${_v2143 ? " no" : ""}${_v2141 === "frac" ? " rare" : ""}${_v2145 ? " om" : ""}" data-bu="${_v2141}" data-tt="cur:${_v2141}"${_v2143 ? ` title="${O(_v2143)}"` : ""}><img src="${Ye[_v2141]}" alt=""><span class="bn">${q[_v2141].n}</span><b>${_v2144}</b><small>${_v2143 ? O(_v2143) : _v2146}</small></button>`;
};
en = function () {
  OmPrune();
  let _v2147 = we.mode === "rune";
  let _v2148 = So(), {eq: _v2149, inv: _v2150} = Jf(), _v2151 = (we.from === "eq" ? _v2149 : _v2150).map(_v2152 => Mo(_v2152, "bench", `data-bsel="${_v2152.uid}"${_v2152.uid === we.sel ? ' data-on="1"' : ""}`)).join("") || '<p class="dim">没有装备</p>', _v2153;
  if (_v2147) _v2153 = RuneCraftHTML(); else if (!_v2148) _v2153 = we.mode === "altar" ? `<div class="bempty">左边选一件<b>已腐化</b>的装备放上祭坛。</div>${_f(null)}` : '<div class="bempty">左边选一件装备开始。</div>'; else {
    let _v2154 = _v2148.kind === "soul" ? {} : pe[_v2148.base], _v2155 = `<div class="bhead"><div class="bname" style="color:${Yo[_v2148.rarity]}">${O(_v2148.name)}</div><div class="bsub">${_v2148.kind === "soul" ? je[_v2148.beast].cls === "boss" ? "首领兽魂" : "野兽兽魂" : _v2154.wt ? _t[_v2154.wt] : Es[_v2148.slot]} · ${Kf[_v2148.rarity]} · 物品等级 ${_v2148.ilvl}${dp(_v2148) ? ' · <span class="on">已装备</span>' : ""}${_v2148.dc ? ' · <span class="cor">双重腐化</span>' : _v2148.corrupted ? ' · <span class="cor">已腐化</span>' : ""}${(() => { try { var __rws = RuneWordMatches(_v2148); return __rws.length ? ' · <span style="color:#9dffb4">✦ ' + __rws.map(function (w) { return O(w.n); }).join(" / ") + '（符文之语）已激活</span>' : ""; } catch (e) { return ""; } })()}</div><button class="bshare" data-bshare="1" title="把这件装备和它的铸造履历做成一张图">晒图卡</button>${_v2148.kind === "soul" ? `<div class="bdps">伙伴单体伤害估算 <b style="color:${je[_v2148.beast].col}">${ze(ks(_v2148))}</b>/秒</div>` : ""}</div>`, _v2156;
    _v2148.rarity === 3 ? _v2156 = `<div class="bcol wide"><h4>传奇词缀 <small>固定</small></h4>${_v2148.mods.filter(_v2157 => _v2157.t === "U").map(_v2158 => `<div class="baff"><span class="btier">U</span><span class="btxt">${O(Xs(qa(_v2148, _v2158.id), _v2158.v))}</span></div>`).join("")}<p class="dim bhint">传奇固定词缀不占 10 词条栏位，也不受栏位限制；传奇装备只能用神圣石重随数值, 或者用瓦尔宝珠腐化。</p></div>` : _v2148.rarity === 0 ? _v2156 = '<div class="bcol wide"><h4>没有词缀</h4><p class="dim bhint">普通物品: 用蜕变石变成魔法, 点金石变成稀有, 或者用精华直接做出带指定词缀的稀有装备。</p></div>' : _v2156 = `<div class="bcol"><h4>前缀 <small>${AffixRegCount(_v2148, "P")}/${AffixSlotCfg().regularPerSide}</small></h4>${Vf(_v2148, "P")}</div><div class="bcol"><h4>后缀 <small>${AffixRegCount(_v2148, "S")}/${AffixSlotCfg().regularPerSide}</small></h4>${Vf(_v2148, "S")}</div>${AffixSlotRowsHTML(_v2148, "sp")}${AffixSlotRowsHTML(_v2148, "dsec")}`;
    let _v2159 = _v2148.rarity <= 2 && !_v2148.corrupted && _v2148.kind !== "soul";
    _v2153 = we.mode === "altar" ? `${_v2155}${AffixStatusHTML(_v2148)}<div class="baffs">${_v2156}</div>${_f(_v2148)}` : `${_v2155}${AffixStatusHTML(_v2148)}<div class="baffs">${_v2156}</div>
		  <div class="bsec"><h4>通货 <small>灰色的按钮会说明为什么不能用</small></h4><div class="bcurs">${$m.map(_v2160 => q6(_v2160, _v2148)).join("")}</div>
		  ${_v2159 ? `<h4>精华 <small>普通/魔法 → 稀有; 稀有装备会重铸 (保留破溃和锁定的一侧), 必定带有对应词缀</small></h4><div class="bcurs ess">${fp.map(_v2161 => q6(_v2161, _v2148)).join("")}</div>` : ""}</div>
		  <div class="bsec"><h4>预兆 <small>点击激活 · 同类只能激活 1 个 · 下次对应操作时自动消耗</small></h4><div class="bcurs oms">${OmBenchRow()}</div></div>
		  <div class="bsec"><h4>工艺 · 神圣石 <small>锁定会占用另一侧 1 个位置, 解除免费</small></h4><div class="bmetas">${Nv("lockP", _v2148)}${Nv("lockS", _v2148)}<button class="bmeta${_v2148.meta ? "" : " no"}" data-bu="unlock"><span class="bn">解除锁定</span><span class="bcost">免费</span><small>${_v2148.meta ? "腾出被占用的位置" : "没有锁定"}</small></button></div></div>
		`;
  }
  let _v2162 = we.mode === "altar";
  let _v2163 = _v2147 ? RuneBenchHelp() : `<section class="bpick"><div class="shoptabs"><button class="${we.from === "eq" ? "on" : ""}" data-bfrom="eq">已装备 <small>${_v2149.length}</small></button><button class="${we.from === "inv" ? "on" : ""}" data-bfrom="inv">背包 <small>${_v2150.length}</small></button></div><div class="grid bgrid">${_v2151}</div><div class="blastw"><h4>上一次操作</h4>${Em()}</div></section>`;
  (Ve(`<div class="ovbox bench${_v2162 ? " altarmode" : ""}${_v2147 ? " runemode" : ""}"><div class="bmodes"><button class="${!_v2162 && !_v2147 ? "on" : ""}" data-bmode="craft">工艺台</button><button class="${_v2162 ? "on" : ""}" data-bmode="altar">余烬祭坛</button><button class="${_v2147 ? "on" : ""}" data-bmode="rune">符文合成</button></div><p class="bintro">${_v2147 ? "40 级符文 · <b>低阶合成 / 升阶合成 / 定向合成</b> 三条路线 · 符文镶嵌顺序决定符文之语是否激活" : _v2162 ? "已腐化的装备可以在这里<b>再腐化一次</b> · 30% 超越 T1 · 30% 化为余烬 · 每件装备只能献祭一次" : "通货操作<b>不可逆</b>，点击即生效，请谨慎操作 · 每次结果都会标出<b>出现概率</b>"}</p>
		 <div class="bcols">
		  ${_v2163}
		  <section class="bwork">${_v2153}</section>
		 </div>
		 <div class="ovbtns"><button class="btn" id="bClose">离开 <kbd>Esc</kbd></button></div></div>`), C("#bClose").onclick = jm, document.querySelectorAll("#overlay [data-bfrom]").forEach(_v2164 => _v2164.onclick = () => {
    (we.from = _v2164.dataset.bfrom, en());
  }), document.querySelectorAll("#overlay [data-bsel]").forEach(_v2165 => _v2165.onclick = _v2166 => {
    (_v2166.stopPropagation(), we.sel = +_v2165.dataset.bsel, we.last = null, $("pick", 0.5), en());
  }), document.querySelectorAll("#overlay [data-bu]").forEach(_v2167 => _v2167.onclick = () => {
    if (Cm(_v2167.dataset.bu)) {
      en();
      let _v2168 = document.querySelector("#overlay .blast");
      (_v2168 && _v2168.classList.add("pop"), we.last && we.last.vaal && Uf(rc(So(), we.last.vaal)));
    }
  }), document.querySelectorAll("#overlay [data-omen]").forEach(_v2169 => _v2169.onclick = _v2170 => {
    (_v2170.stopPropagation(), OmToggle(_v2169.dataset.omen), en());
  }), document.querySelectorAll("#overlay [data-rune]").forEach(_v2171 => _v2171.onclick = () => {
    let _v2172 = RuneCraft(_v2171.dataset.rune);
    if (_v2172) (P(_v2172), $("nomana", 0.5)); else ($("craft"), P("合成成功 · " + q[RuneRecipes().filter(_v2173 => _v2173.id === _v2171.dataset.rune)[0].out].n));
    en();
  }), document.querySelectorAll("#overlay [data-bmode]").forEach(_v2174 => _v2174.onclick = () => {
    we.mode !== _v2174.dataset.bmode && (we.mode = _v2174.dataset.bmode, we.last = null, $("pick", 0.5), en());
  }));
  let _v2175 = document.querySelector("#overlay [data-bshare]");
  (_v2175 && (_v2175.onclick = () => Zf(So(), "item")), document.querySelectorAll("#overlay [data-altar]").forEach(_v2176 => _v2176.onclick = () => Rm(_v2176.dataset.altar)));
};
mA = function (_v2177, _v2178) {
  let _v2179 = (n.S.rarity + n.Z.ms.rar + DelRarityBonus() + (n.endlessMode ? n.endlessIntensity * 70 : 0) + _v2178) / 100, _v2180 = n.Z && n.Z.th && n.Z.th.key === "swamp" ? 1.6 : 1, _v2181 = ht([0, 1, 2, 3], _v2182 => [100, 32 * (1 + _v2179), 7 * (1 + _v2179), 0.6 * (1 + _v2179) * _v2180][_v2182]);
  if (_v2181 === 3) {
    let _v2183 = yt.filter(_v2184 => _v2184.src === "world" && !_v2184.noDrop && _v2184.lv <= _v2177 + 5);
    if (_v2183.length) return Kt(oe(_v2183), _v2177);
  }
  let _v2185 = ht(["W", "O", "H", "B", "G", "F", "L", "R", "A"], _v2186 => _v2186 === "O" ? 0.9 : _v2186 === "L" ? 0.7 : _v2186 === "W" && n.Z && n.Z.th && n.Z.th.key === "lava" ? 1.6 : 1), _v2187 = [_v2185];
  if (_v2185 === "O") {
    let _v2188 = ["Q", "S", "X", "K"], _v2189 = u.equip.weapon && pe[u.equip.weapon.base].wt || "none", _v2190 = ya[_v2189] || [], _v2191 = _v2188.filter(_v2192 => _v2190.includes(va[_v2192]));
    _v2187 = _v2191.length && I() < 0.7 ? _v2191 : _v2188;
  }
  let _v2193 = Pa.filter(_v2194 => _v2187.includes(_v2194.slot) && _v2194.lv <= _v2177);
  if ((_v2193.length || (_v2193 = Pa.filter(_v2195 => _v2195.slot === "H" && _v2195.lv <= _v2177)), _v2185 === "W" && I() < 0.6)) {
    let _v2196 = _v2193.filter(_v2197 => Ut[u.cls].wts.includes(_v2197.wt));
    _v2196.length && (_v2193 = _v2196);
  }
  let _v2198 = ht(_v2193, _v2199 => 1 + _v2199.lv / 20);
  return Ft(_v2198, _v2177, Math.min(2, _v2181));
};
gA = function (_v2200) {
  if (_v2200.kind === "cur") {
    let _v2201 = _v2200.cur;
    (_v2200.txt = q[_v2201].n, _v2200.fg = "#c8b890", _v2200.bg = "rgba(10,8,12,0.82)", _v2200.bd = null, _v2200.size = 6, (_v2201 === "chaos" || _v2201 === "alch" || _v2201 === "regal") && (_v2200.fg = "#e8c870", _v2200.bd = "#7a6430"));
    let _v2202 = q[_v2201].grp;
    (_v2202 === "sock" && (_v2200.fg = "#5fe0c0", _v2200.bd = "#1f6a58", (_v2201 === "jewel3" || _v2201 === "artif") && (_v2200.beam = "#5fe0c0", _v2200.size = 6.5)), _v2202 === "rune" && (_v2200.fg = q[_v2201].col, _v2200.bd = "#5a5a5a"), _v2202 === "ess" && (_v2200.fg = q[_v2201].col, _v2200.bd = q[_v2201].col, _v2200.size = 6.5, _v2200.beam = q[_v2201].col), _v2202 === "omen" && (_v2200.fg = "#e8d090", _v2200.bg = "rgba(20,8,28,0.94)", _v2200.bd = "#a05ad0", _v2200.size = 7, _v2200.beam = "#c070ff", _v2200.snd = "exalt"), _v2201 === "vaal" && (_v2200.fg = "#ff6060", _v2200.bd = "#801818"), _v2202 === "sig" && (_v2200.fg = q[_v2201].col, _v2200.bd = q[_v2201].col, _v2200.bg = "rgba(16,6,24,0.92)", _v2200.size = 7.5, _v2200.beam = q[_v2201].col, _v2200.snd = "unique", _v2200.big = 1), _v2201 === "exalt" && (_v2200.fg = "#fff0b0", _v2200.bd = "#e8c870", _v2200.size = 7, _v2200.beam = "#ffe080", _v2200.snd = "exalt"), _v2201 === "ember" && (_v2200.fg = "#ffb080", _v2200.bg = "rgba(42,8,2,0.94)", _v2200.bd = "#ff5a24", _v2200.size = 7.5, _v2200.beam = "#ff5a24", _v2200.snd = "unique", _v2200.big = 1), _v2201 === "ash" && (_v2200.fg = "#c8bab2", _v2200.bd = "#6a5e58"), _v2201 === "frac" && (_v2200.fg = "#ffd8a8", _v2200.bg = "rgba(40,18,6,0.94)", _v2200.bd = "#d89a5a", _v2200.size = 7.5, _v2200.beam = "#ffb060", _v2200.snd = "exalt", _v2200.big = 1), _v2201 === "divine" && (_v2200.fg = "#b01818", _v2200.bg = "rgba(248,240,226,0.96)", _v2200.bd = "#b01818", _v2200.size = 8, _v2200.beam = "#fff2d0", _v2200.snd = "divine", _v2200.big = 1), _v2200.snd || (_v2200.snd = _v2201 === "chaos" ? "chaos" : "drop"));
    return;
  }
  let _v2203 = _v2200.it;
  if (_v2203.kind === "meta") {
    (_v2200.txt = Ze[_v2203.gid].n + " (元技能)", _v2200.fg = "#fff0b0", _v2200.bg = "rgba(24,16,4,0.9)", _v2200.bd = "#ffd060", _v2200.size = 7, _v2200.beam = "#ffd060", _v2200.snd = "unique");
    return;
  }
  if (_v2203.kind === "buff") {
    (_v2200.txt = He[_v2203.gid].n + " (精魄)", _v2200.fg = "#ffe080", _v2200.bg = "rgba(20,14,4,0.88)", _v2200.bd = "#e8c060", _v2200.size = 6.5, _v2200.beam = "#e8c060", _v2200.snd = "unique");
    return;
  }
  if (_v2203.kind === "gem" || _v2203.kind === "sup") {
    let _v2204 = _v2203.kind === "gem" && (se[_v2203.gid].wt || []).includes(le[u.cls].wt);
    (_v2200.txt = (_v2203.kind === "gem" ? se[_v2203.gid].n : ne[_v2203.gid].n) + (_v2203.kind === "gem" ? " (主动)" : " (辅助)"), _v2200.fg = "#4fe0c0", _v2200.bg = "rgba(6,16,14,0.85)", _v2200.bd = _v2204 ? "#e8c870" : "#1f6a58", _v2200.size = 6, _v2200.snd = "drop");
    return;
  }
  if (_v2203.kind === "soul") {
    let _v2205 = je[_v2203.beast];
    (_v2200.txt = _v2203.name, _v2200.fg = ["#e8e0d0", "#8a8cff", "#ecd85a"][_v2203.rarity], _v2200.bg = "rgba(8,20,16,0.9)", _v2200.bd = _v2205.cls === "boss" ? "#ffd27a" : "#7affc8", _v2200.size = _v2205.cls === "boss" ? 7.5 : 6.5, _v2200.beam = _v2205.cls === "boss" ? _v2205.col : _v2203.rarity === 2 ? "#7affc8" : null, _v2200.snd = _v2205.cls === "boss" ? "unique" : "drop", _v2200.big = _v2205.cls === "boss" ? 1 : 0);
    return;
  }
  if (_v2203.kind === "map") {
    (_v2200.txt = "T" + _v2203.tier + " " + _v2203.name, _v2200.fg = "#f0f0f0", _v2200.bg = "rgba(10,10,10,0.85)", _v2200.bd = "#c8c8c8", _v2200.size = 6.5, _v2200.snd = "drop", n.Z && _v2203.tier > n.Z.tier && (_v2200.beam = "#e8e8e8"));
    return;
  }
  (_v2200.txt = _v2203.rarity === 3 ? pe[_v2203.base].n : _v2203.name, _v2200.size = _v2203.rarity >= 2 ? 6.5 : 6, _v2200.bg = "rgba(10,8,12,0.78)", _v2200.bd = null, _v2200.fg = ["#d8d4cc", "#8a8cff", "#ecd85a", "#d2803a"][_v2203.rarity], _v2203.rarity === 3 ? (_v2200.bd = "#d2803a", _v2200.beam = "#e0904a", _v2200.snd = "unique", _v2200.size = 7) : _v2200.snd = null);
  let _v2206 = _v2203.rarity >= 1 && _v2203.rarity <= 2 ? Sl(_v2203) : 0;
  _v2206 && (_v2200.txt += " · T1" + (_v2206 > 1 ? "×" + _v2206 : ""), _v2200.bd = "#ffd27a", _v2203.rarity === 2 && (_v2200.size = 6.5));
};
Js = function (_v2207) {
  if (_v2207.kind === "cur") {
    let _v2208 = !!(q[_v2207.cur] && q[_v2207.cur].grp === "omen" && !u.omenSeen);
    return (u.cur[_v2207.cur] = (u.cur[_v2207.cur] || 0) + 1, n.run && (n.run.cur[_v2207.cur] = (n.run.cur[_v2207.cur] || 0) + 1, n.run.value += q[_v2207.cur].v, (!n.run.best || q[_v2207.cur].v > n.run.best.v) && (n.run.best = {
      n: q[_v2207.cur].n,
      v: q[_v2207.cur].v
    })), $("pick"), U(n.pl.x, n.pl.y - 22, 0, !1, "info", "+" + q[_v2207.cur].n), _v2208 && (u.omenSeen = 1, setTimeout(() => ke("预兆", "在通货栏或工艺台点击预兆即可激活 · 下次对应操作时自动生效并被消耗"), 600)), !0);
  }
  let _v2209 = _v2207.it;
  if (_v2209.kind === "gem" || _v2209.kind === "sup" || _v2209.kind === "buff" || _v2209.kind === "meta") u.gems.push(_v2209); else {
    if (!Vo(_v2209)) return (P(_v2209.kind === "map" ? n.touchMode ? "地图袋已满 (" + xa + ") · 在地图页批量出售, 或 3 张换 1 张高阶" : "地图袋已满 (" + xa + ") · 地图页(M)里右键出售, 或 3 张换 1 张高阶" : "背包已满, 打开背包出售物品"), !1);
    (u.inv.push(_v2209), si(_v2209));
  }
  let _v2210 = $3(_v2209);
  return (n.run && (n.run.value += _v2210, n.run.items++, (_v2209.rarity === 3 || !n.run.best || _v2210 > n.run.best.v) && (n.run.best = {
    n: _v2209.name || _v2209.kind === "buff" && He[_v2209.gid].n || _v2209.kind === "meta" && Ze[_v2209.gid].n || se[_v2209.gid] && se[_v2209.gid].n || ne[_v2209.gid] && ne[_v2209.gid].n || "宝石",
    v: _v2210
  })), $("pick"), !0);
};
dd = function () {
  let _v2211 = null, _v2212 = 1e9;
  for (let _v2213 of n.objs) {
    if (!(_v2213.kind === "box" && !_v2213.open || yj.has(_v2213.kind))) continue;
    let _v2214 = (_v2213.x - n.pl.x) ** 2 + (_v2213.y - n.pl.y) ** 2, _v2215 = _v2213.kind === "device" ? 42 : _v2213.kind === "vendor" || _v2213.kind === "stash" || _v2213.kind === "bench" || _v2213.kind === "altar" || _v2213.kind === "monument" || _v2213.kind === "dog" || _v2213.kind === "well" || _v2213.kind === "ritual" || _v2213.kind === "simulacrum" ? 34 : 36;
    _v2214 < _v2215 * _v2215 && _v2214 < _v2212 && (_v2212 = _v2214, _v2211 = _v2213);
  }
  if (_v2211) {
    if (_v2211.kind === "box" && !_v2211.open) return (ou(_v2211), !0);
    if (_v2211.kind === "device") return (ja("map"), !0);
    if (_v2211.kind === "vendor") return (op(), !0);
    if (_v2211.kind === "stash") return (nu(), !0);
    if (_v2211.kind === "bench" || _v2211.kind === "altar") return (cc(_v2211.kind === "altar" ? "altar" : "craft"), !0);
    if (_v2211.kind === "well") return (DsWell(), !0);
    if (_v2211.kind === "ritual") return (RitualInteract(_v2211), !0);
    if (_v2211.kind === "simulacrum") return (SimulacrumInteract(), !0);
    if (_v2211.kind === "monument") return (su(), !0);
    if (_v2211.kind === "dog") return (au(), !0);
  }
  return yA();
};
ou = function (_v2216) {
  jiBox(_v2216);
};
Zw = function (_v2217) {
  if (n.ritualPause) {
    let _v2218 = document.getElementById("overlay");
    if (!_v2218 || _v2218.hidden || !_v2218.querySelector(".ovbox.ritual")) n.ritualPause = !1; else return;
  }
  (n.T += _v2217, M3(_v2217), n.endlessMode && n.Z && n.Z.type === "map" && n.state === "play" && !n.pl.dead && (n.endlessSpawnT -= _v2217, n.endlessSpawnT <= 0 && (n.endlessSpawnT += 1, (function () {
    const _v2219 = n.endlessIntensity;
    n.endlessIntensityT = (n.endlessIntensityT ?? 0) - 1;
    const _v2220 = n.endlessIntensityT <= 0;
    if (_v2220) {
      n.endlessIntensityT = 5;
      n.endlessIntensity += 1;
    }
    if (n.run) n.run.intensity = n.endlessIntensity;
    C("#zinfo").textContent = "无尽强度 " + n.endlessIntensity + " · 怪物生命 ×" + (1 + n.endlessIntensity * 10) + " · 物品数量 +" + n.endlessIntensity * 70 + "% · 物品稀有度 +" + n.endlessIntensity * 70 + "%";
    C("#zmods").textContent = "每 5 秒强度 +1 · 怪物抗性最高 75% · 持续刷新全主题怪物";
    const _v2221 = (1 + n.endlessIntensity * 10) / (1 + _v2219 * 10);
    for (const _v2222 of n.mons) if (!_v2222.dead) {
      _v2222.hp *= _v2221;
      _v2222.maxhp *= _v2221;
      for (const _v2223 of ["phys", "fire", "cold", "light"]) _v2222.res[_v2223] = Math.min(75, Math.max(_v2222.res[_v2223] || 0, n.endlessIntensity * 10));
    }
    const _v2224 = [...new Set(Object.values(la).flatMap(_v2225 => Object.keys(_v2225.mon || ({}))))].filter(_v2226 => $t[_v2226] && _v2226 !== "boss" && _v2226 !== "dummy");
    const _v2227 = [...new Set(Object.values(gt).map(_v2228 => _v2228.boss).filter(_v2229 => _v2229 && $t[_v2229]))];
    const _v2230 = n.mons.reduce((_v2231, _v2232) => _v2231 + (!_v2232.dead ? 1 : 0), 0);
    const _v2233 = Math.min(8, 3 + Math.floor(n.endlessIntensity / 20));
    for (let _v2234 = 0; _v2234 < _v2233 && _v2230 + _v2234 < 120 && _v2224.length; _v2234++) {
      let _v2235 = We(n.pl.x, n.pl.y, B(150, 320));
      let _v2236 = $e(_v2235.x, 48, n.Z.M.W * K - 48), _v2237 = $e(_v2235.y, 48, n.Z.M.H * K - 48);
      if (ka(_v2236, _v2237, 5)) continue;
      let _v2238 = _v2224[n.endlessSpawnIndex++ % _v2224.length];
      let _v2239 = I();
      let _v2240 = _v2239 < 0.025 ? 3 : _v2239 < Math.min(0.42, 0.12 + n.endlessIntensity * 0.001) ? 2 : _v2239 < 0.62 ? 1 : 0;
      let _v2241 = nt(_v2238, _v2236, _v2237, Math.max(n.Z.lvl, Math.floor(n.Z.lvl + n.endlessIntensity / 4)), _v2240);
      _v2241.aggro = true;
      _v2241.kbx = 0;
      _v2241.kby = 0;
      n.mons.push(_v2241);
    }
    n.endlessBossSpawnT = (n.endlessBossSpawnT || 0) - 1;
    if (_v2227.length && n.endlessBossSpawnT <= 0 && _v2230 < 116) {
      n.endlessBossSpawnT = 5;
      const _v2242 = _v2227[n.endlessSpawnIndex++ % _v2227.length];
      const _v2243 = We(n.pl.x, n.pl.y, B(260, 380));
      const _v2244 = $e(_v2243.x, 56, n.Z.M.W * K - 56), _v2245 = $e(_v2243.y, 56, n.Z.M.H * K - 56);
      if (!ka(_v2244, _v2245, 6)) {
        const _v2246 = nt(_v2242, _v2244, _v2245, Math.max(n.Z.lvl, Math.floor(n.Z.lvl + n.endlessIntensity / 4)), 3);
        _v2246.aggro = true;
        _v2246.kbx = 0;
        _v2246.kby = 0;
        _v2246.endlessBoss = true;
        n.mons.push(_v2246);
        ke("无尽首领出现", ($t[_v2242].n || _v2242) + " · 来自全地图首领池");
      }
    }
    if (Math.floor(_v2219 / 20) !== Math.floor(n.endlessIntensity / 20)) ke("无尽强度 " + n.endlessIntensity, "怪物不受击退 · 全地图怪物、传奇怪物、稀有怪与首领持续刷新");
  })())), n.Z.type === "map" && (n.Z.flowT -= _v2217, n.Z.flowT <= 0 && (n.Z.flowT = 0.3, c5()), n.Z.revT -= _v2217, n.Z.revT <= 0 && (n.Z.revT = 0.25, xA()), n.run && !n.pl.dead && (n.run.t += _v2217)));
  let _v2247 = [];
  for (let _v2248 of n.mons) _v2248.dead || Math.abs(_v2248.x - n.pl.x) < 380 && Math.abs(_v2248.y - n.pl.y) < 260 && (Z5(_v2248, _v2217), _v2248.dead || _v2247.push(_v2248));
  (kA(_v2247), w3(_v2217), S3(_v2217));
  for (let _v2249 = n.pend.length - 1; _v2249 >= 0; _v2249--) {
    let _v2250 = n.pend[_v2249];
    if ((_v2250.t -= _v2217, _v2250.t <= 0)) {
      n.pend.splice(_v2249, 1);
      try {
        _v2250.fn();
      } catch (_v2251) {
        console.error(_v2251);
      }
    }
  }
  (T3(_v2217), vA(_v2217), AbyssUpdate(_v2217), AbyssMods(_v2217), DeliriumUpdate(_v2217), RitualUpdate(_v2217), SimulacrumUpdate(_v2217), bA(_v2217), G1(_v2217), n.mons.some(_v2252 => _v2252.dead) && (n.mons = n.mons.filter(_v2253 => !_v2253.dead)));
  let _v2254 = n.camFocus, _v2255 = (_v2254 ? _v2254.x : n.pl.x) - lo / 2, _v2256 = (_v2254 ? _v2254.y : n.pl.y) - co / 2 + (_v2254 ? 0 : 10);
  (es.x += (_v2255 - es.x) * Math.min(1, _v2217 * 9), es.y += (_v2256 - es.y) * Math.min(1, _v2217 * 9));
  let _v2257 = n.Z.M.W * K, _v2258 = n.Z.M.H * K;
  (_v2254 && _v2254.free || (es.x = _v2257 > lo ? $e(es.x, 0, _v2257 - lo) : (_v2257 - lo) / 2, es.y = _v2258 > co ? $e(es.y, 0, _v2258 - co) : (_v2258 - co) / 2), U5());
};
er = function (_v2259) {
  let _v2260 = u.inv.indexOf(_v2259);
  if (_v2260 < 0) return;
  u.inv.splice(_v2260, 1);
  // 珠宝也能出售：按阶级给改造石（T1=1 … 上限 6），其它物品走原价表
  let _v2261 = (_v2259 && _v2259.kind === "jewel") ? { alt: Math.max(1, Math.min(6, +(_v2259.tier || 1))) } : ru(_v2259);
  OmTake("omen_barter") && Object.keys(_v2261).forEach(_v2262 => _v2261[_v2262] *= 2);
  for (let _v2263 in _v2261) u.cur[_v2263] = (u.cur[_v2263] || 0) + _v2261[_v2263];
  qf(_v2259, _v2261);
  let _v2264 = Object.entries(_v2261).map(([_v2265, _v2266]) => q[_v2265].n + (_v2266 > 1 ? "×" + _v2266 : "")).join(" ");
  (P(_v2264 ? "出售获得 " + _v2264 : "已出售"), $("pick"));
};
/* 投射物过多时限制动态光源数量：防止光源缓冲过大导致场景贴图/文字渲染异常 */
try {
  var __baseLightRebuild = m4;
  if (typeof __baseLightRebuild === "function") {
    m4 = function () {
      var r = __baseLightRebuild.apply(this, arguments);
      try { if (n.LIGHTS && n.LIGHTS.length > 160) n.LIGHTS.length = 160; } catch (e) {}
      return r;
    };
  }
} catch (e) {}
/* 一层天赋树：绿色加厚最短路径 */
function __drawBaseTreePath() {
  try {
    if (typeof C !== "function" || typeof xe === "undefined" || typeof Q === "undefined") return;
    var path = window.__baseTreePath || [];
    if (!path.length) return;
    var cv = C("#treecv");
    if (!cv || !cv.getContext) return;
    var ctx = cv.getContext("2d");
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    ctx.save();
    ctx.setTransform(Q.s * dpr, 0, 0, Q.s * dpr, Q.ox * dpr, Q.oy * dpr);
    var seq = path.slice();
    var src = null;
    (xe.adj[seq[0]] || []).forEach(function (id) { if (u.tree.includes(id)) src = id; });
    if (src != null) seq.unshift(src);
    ctx.strokeStyle = "#7fd8a0";
    ctx.lineWidth = 5.5;
    ctx.lineCap = "round";
    ctx.globalAlpha = 0.95;
    for (var i = 0; i + 1 < seq.length; i++) {
      var a = xe.nodes[seq[i]], b = xe.nodes[seq[i + 1]];
      if (!a || !b) continue;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
    for (var j = 0; j < seq.length; j++) {
      var nd = xe.nodes[seq[j]];
      if (!nd) continue;
      var rr = (nd.kind === "key" ? 14 : nd.kind === "notable" ? 9 : 7) + 5;
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = "#7fd8a0";
      ctx.beginPath(); ctx.arc(nd.x, nd.y, rr, 0, 6.2832); ctx.fill();
      ctx.globalAlpha = 0.95;
      ctx.strokeStyle = "#9dffb4";
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(nd.x, nd.y, rr, 0, 6.2832); ctx.stroke();
    }
    ctx.restore();
  } catch (e) {}
}
(function () {
  if (window.__baseTreePathWrapped) return;
  window.__baseTreePathWrapped = 1;
  var __baseJa = Ea;
  Ea = function () {
    __baseJa.apply(this, arguments);
    __drawBaseTreePath();
  };
})();
/* 符文合成：悬浮配方直接显示产出符文的效果 */
(function () {
  if (window.__riftRuneHoverBound) return;
  window.__riftRuneHoverBound = 1;
  var el = document.createElement("div");
  el.id = "riftRuneTip";
  el.style.cssText = "display:none;position:fixed;z-index:60;pointer-events:none;max-width:320px;min-width:190px;background:#0a080cf0;border:1px solid #666;color:#d8d0c0;font-size:12.5px;line-height:1.55;padding:6px 8px;box-shadow:0 10px 30px #000d";
  document.body.appendChild(el);
  document.addEventListener("pointermove", function (ev) {
    try {
      if (typeof n !== "undefined" && n && n.touchMode && ev.pointerType === "touch") return;
      var b = ev.target && ev.target.closest ? ev.target.closest("[data-rune]") : null;
      if (!b) { el.style.display = "none"; return; }
      if (typeof RuneRecipes !== "function" || typeof el !== "function") { el.style.display = "none"; return; }
      var rid = b.getAttribute("data-rune");
      var rec = (RuneRecipes() || []).filter(function (r) { return r.id === rid; })[0];
      if (!rec) { el.style.display = "none"; return; }
      var info = el(rec.out);
      if (!info || !info.h) { el.style.display = "none"; return; }
      el.innerHTML = info.h;
      el.style.borderColor = info.b || "#666";
      el.style.display = "block";
      // 按配方行定位，避免滚动容器内 fixed/clientX 偏移
      var __rr = b.getBoundingClientRect();
      var x = __rr.right + 10, y = __rr.top;
      if (x + 330 > innerWidth) x = Math.max(8, __rr.left - 330);
      if (y + 240 > innerHeight) y = Math.max(8, innerHeight - 250);
      el.style.left = Math.max(8, x) + "px";
      el.style.top = Math.max(8, y) + "px";
    } catch (e) { el.style.display = "none"; }
  }, true);
  document.addEventListener("pointerleave", function (ev) {
    try { if (!ev.target || !ev.target.closest || !ev.target.closest("[data-rune]")) el.style.display = "none"; } catch (e) {}
  }, true);
})();
/* 符文之语列表：悬浮预览属性 */
(function () {
  try {
    if (window.__riftRwTipBound) return;
    window.__riftRwTipBound = 1;
    var el = document.createElement("div");
    el.id = "riftRwTip";
    el.style.cssText = "display:none;position:fixed;z-index:300;pointer-events:none;max-width:340px;min-width:220px;background:#0a080cf5;border:1px solid #8a6a3a;color:#d8d0c0;font-size:12.5px;line-height:1.6;padding:8px 10px;box-shadow:0 12px 34px #000e";
    document.body.appendChild(el);
    var fmt = function (arr) {
      return (arr || []).map(function (x) {
        try { return (typeof _a === "function" ? _a(x[0], x[1] || 0) : x[0] + " " + x[1]); } catch (e) { return x[0] + " " + x[1]; }
      }).join("<br>");
    };
    document.addEventListener("pointermove", function (ev) {
      try {
        if (typeof n !== "undefined" && n && n.touchMode && ev.pointerType === "touch") return;
        var b = ev.target && ev.target.closest ? ev.target.closest("[data-rw]") : null;
        if (!b) { el.style.display = "none"; return; }
        var id = b.getAttribute("data-rw");
        var rw = null;
        for (var i = 0; i < RUNE_WORDS.length; i++) if (RUNE_WORDS[i].id === id) { rw = RUNE_WORDS[i]; break; }
        if (!rw) { el.style.display = "none"; return; }
        var seq = (rw.seq || []).map(function (n) { return (q[n] && q[n].n) || ("#" + n); }).join(" → ");
        el.innerHTML = '<b style="color:#e8c870">' + rw.n + '</b> <small style="color:#8e98b0">' + RuneReqLabel(rw.req) + '</small><br>' +
          '<span style="color:#b8a888">镶嵌: ' + seq + '</span>' +
          (rw.w && rw.w.length ? '<div class="sep" style="border-top:1px solid #3a3020;margin:5px 0"></div><b style="color:#9dffb4">武器</b><br>' + fmt(rw.w) : "") +
          (rw.a && rw.a.length ? '<div class="sep" style="border-top:1px solid #3a3020;margin:5px 0"></div><b style="color:#8fd0ea">防具</b><br>' + fmt(rw.a) : "") +
          (rw.d && rw.d.length ? '<div style="color:#b8a888;margin-top:5px">' + rw.d.join(" · ") + '</div>' : "");
        el.style.display = "block";
        var r = b.getBoundingClientRect();
        var x = r.right + 10, y = r.top;
        if (x + 350 > innerWidth) x = Math.max(8, r.left - 350);
        if (y + 260 > innerHeight) y = Math.max(8, innerHeight - 270);
        el.style.left = Math.max(8, x) + "px";
        el.style.top = Math.max(8, y) + "px";
      } catch (e) { el.style.display = "none"; }
    }, true);
  } catch (e) {}
})();
/* 升华节点：左键点击已点亮的升华节点直接取消（并清掉因此失效的深层节点） */
function __riftAscRefund(k) {
  try {
    if (!u || !u.asc || !Array.isArray(u.ascNodes)) return false;
    var asc = Ce && Ce[u.asc];
    if (!asc || !asc.nodes) return false;
    var byK = {};
    asc.nodes.forEach(function (n) { byK[n.k] = n; });
    if (!u.ascNodes.includes(k) || !byK[k]) return false;
    u.ascNodes = u.ascNodes.filter(function (x) { return x !== k; });
    var changed = true;
    while (changed) {
      changed = false;
      u.ascNodes.slice().forEach(function (x) {
        var nd = byK[x];
        if (!nd || !nd.tier) return;
        var ok = asc.nodes.some(function (p) { return p.tier === nd.tier - 1 && u.ascNodes.includes(p.k); });
        if (!ok) {
          u.ascNodes = u.ascNodes.filter(function (y) { return y !== x; });
          changed = true;
        }
      });
    }
    if (typeof be === "function") be();
    if (typeof Gs === "function") Gs();
    $("craft");
    P("已取消升华节点 · 返还 " + (2) + " 点");
    return true;
  } catch (e) { return false; }
}
window.__riftAscRefund = __riftAscRefund;
(function () {
  if (window.__riftAscRefundBound) return;
  window.__riftAscRefundBound = 1;
  document.addEventListener("click", function (ev) {
    try {
      var b = ev.target && ev.target.closest ? ev.target.closest('[data-act="ascNode"]') : null;
      if (!b) return;
      var k = b.getAttribute("data-k");
      if (!k || !u || !u.ascNodes || !u.ascNodes.includes(k)) return;
      ev.preventDefault();
      ev.stopPropagation();
      __riftAscRefund(k);
    } catch (e) {}
  }, true);
})();
/* 一层天赋树悬停 tooltip 兜底：基础 #tip 不显示时用自建浮窗显示节点属性 */
(function () {
  if (window.__riftTreeHoverBound) return;
  window.__riftTreeHoverBound = 1;
  var el = document.createElement("div");
  el.id = "riftTreeTip";
  el.style.cssText = "display:none;position:fixed;z-index:60;pointer-events:none;max-width:320px;min-width:180px;background:#0a080cf0;border:1px solid #666;color:#d8d0c0;font-size:12.5px;line-height:1.55;padding:6px 8px;box-shadow:0 10px 30px #000d";
  document.body.appendChild(el);
  document.addEventListener("pointermove", function (ev) {
    try {
      if (typeof n !== "undefined" && n && n.touchMode && ev.pointerType === "touch") return;
      var t = ev && ev.target;
      if (!t || t.id !== "treecv") { el.style.display = "none"; return; }
      if (typeof sL !== "function" || typeof xe === "undefined") { el.style.display = "none"; return; }
      var id = sL(ev.clientX, ev.clientY);
      var __p = id >= 0 && typeof Bs === "function" ? (Bs(id) || []) : [];
      var __pk = (window.__baseTreePath || []).join(",");
      if (__pk !== __p.join(",")) {
        window.__baseTreePath = __p;
        if (typeof Ea === "function") Ea();
      }
      if (id < 0) { el.style.display = "none"; return; }
      var base = document.getElementById("tip");
      if (base && !base.hidden && base.innerHTML) { el.style.display = "none"; return; }
      if (typeof Gp !== "function") { el.style.display = "none"; return; }
      var info = Gp(xe.nodes[id]);
      if (!info || !info.h) { el.style.display = "none"; return; }
      el.innerHTML = info.h;
      el.style.borderColor = info.b || "#666";
      el.style.display = "block";
      var x = ev.clientX + 18, y = ev.clientY + 14;
      if (x + 320 > innerWidth) x = ev.clientX - 320;
      if (y + 220 > innerHeight) y = Math.max(8, ev.clientY - 220);
      el.style.left = Math.max(8, x) + "px";
      el.style.top = Math.max(8, y) + "px";
    } catch (e) { el.style.display = "none"; }
  }, true);
  document.addEventListener("pointerleave", function (ev) {
    try { if (ev.target && ev.target.id === "treecv") el.style.display = "none"; } catch (e) {}
  }, true);
})();
/* 自动光影/自动降画质 watchdog：旧存档或抢在回调前触发时强制恢复，避免文字/提示消失 */
try {
  window.__riftGfxUser = window.__riftGfxUser || !1;
  setInterval(function () {
    try {
      if (typeof ut !== "undefined" && ut && !ut.on) ut.on = !0;
      if (typeof Vt !== "undefined" && Vt && Vt.auto && !window.__riftGfxUser && Vt.q !== "high") {
        Vt.q = "high";
        Vt.auto = !0;
        if (typeof ik === "function") ik("high");
      }
    } catch (e) {}
  }, 800);
} catch (e) {}
/* 背包去重：防止同一物品对象被重复 push 导致“捡 1 个变 2 个” */
try {
  var __meBase = be;
  be = function () {
    try {
      if (u && Array.isArray(u.inv)) {
        var __seen = new Set(), __seenUid = {};
        u.inv = u.inv.filter(function (it) {
          if (!it) return false;
          if (__seen.has(it)) return false;
          if (it.uid != null) {
            var __u = String(it.uid);
            if (__seenUid[__u]) return false;
            __seenUid[__u] = 1;
          }
          __seen.add(it);
          return true;
        });
      }
    } catch (e) {}
    return __meBase.apply(this, arguments);
  };
} catch (e) {}
/* 背包点击珠宝：基础装备逻辑不认 kind="jewel"，直接点会抛 TypeError（reading 'o'）。
   这里接管：天赋页选中珠宝槽时直接镶嵌，否则提示去天赋页镶嵌，避免报错。 */
try {
  if (!window.__jewelClickHooked) {
    window.__jewelClickHooked = 1;
    var __baseL = rd;
    rd = function (it, shift) {
      try {
        if (it && it.kind === "jewel") {
          var sel = n && n.advJewelSel;
          if (sel && typeof AdvJewelSocket === "function") {
            var msg = AdvJewelSocket(sel, it.uid);
            if (msg) { P(msg); return true; }
            P("已镶嵌珠宝：" + (it.n || "珠宝"));
            try { $("craft"); } catch (e2) {}
            try { if (typeof __advRender === "function") __advRender(); } catch (e3) {}
            return true;
          }
          P("珠宝需要在「天赋与升华」→ 珠宝槽里镶嵌 · 先点珠宝槽再点这件珠宝");
          return true;
        }
      } catch (e4) {}
      return __baseL.apply(this, arguments);
    };
  }
} catch (e) {}
/* 宝石界面搜索 + 折叠 */
(function () {
  try {
    if (window.__gemSearchWrapped || typeof a5 !== "function") return;
    window.__gemSearchWrapped = 1;
    var __gemSearchBase = a5;
    var foldedState = window.__gemFolded || (window.__gemFolded = {});
    var foldKey = function (h) {
      return (h.textContent || "").replace(/折叠|展开/g, "").trim();
    };

    var scanFolds = function () {
      var root = document.getElementById("pbody");
      if (!root) return;
      var hs = root.querySelectorAll(".gt .card > h3");
      for (var i = 0; i < hs.length; i++) {
        var h = hs[i];
        if (!h.querySelector(".gemfoldbtn")) {
          var b = document.createElement("button");
          b.type = "button";
          b.className = "gemfoldbtn";
          b.textContent = "折叠";
          b.setAttribute("data-gemfold-btn", "1");
          b.addEventListener("click", function (ev) {
            ev.stopPropagation();
            toggleFold(this.parentNode);
          });
          h.appendChild(b);
        }
        if (foldedState[foldKey(h)]) toggleFold(h, true);
      }
    };
    var toggleFold = function (h, force) {
      var folded = force !== undefined ? force : !h.classList.contains("folded");
      h.classList.toggle("folded", folded);
      var n = h.nextElementSibling;
      while (n && !(n.tagName === "H3")) {
        n.style.display = folded ? "none" : "";
        n = n.nextElementSibling;
      }
      var b = h.querySelector(".gemfoldbtn");
      if (b) b.textContent = folded ? "展开" : "折叠";
      foldedState[foldKey(h)] = folded;
    };
    window.__gemFoldAll = function (folded) {
      var root = document.getElementById("pbody");
      if (!root) return;
      var hs = root.querySelectorAll(".gt .card > h3");
      for (var i = 0; i < hs.length; i++) toggleFold(hs[i], folded);
    };

    a5 = function () {
      var body = __gemSearchBase.apply(this, arguments);
      setTimeout(scanFolds, 0);
      return '<div class="gemsearch"><input id="gemSearch" type="text" placeholder="搜索宝石 / 辅助 / 等级…" autocomplete="off"><div class="gemfoldbar"><button type="button" data-gemfold="all">折叠全部</button><button type="button" data-gemfold="none">展开全部</button></div></div>' + body;
    };
    document.addEventListener("input", function (e) {
      if (!e.target || e.target.id !== "gemSearch") return;
      var q = (e.target.value || "").trim().toLowerCase();
      var root = document.getElementById("pbody") || document;
      root.querySelectorAll(".gchip").forEach(function (el) {
        var txt = (el.textContent || "").toLowerCase();
        el.style.display = !q || txt.indexOf(q) >= 0 ? "" : "none";
      });
    }, true);
    document.addEventListener("click", function (e) {
      var t = e.target;
      if (!t || !t.getAttribute) return;
      var v = t.getAttribute("data-gemfold");
      if (!v) return;
      e.preventDefault();
      if (window.__gemFoldAll) window.__gemFoldAll(v === "all");
    }, true);
  } catch (e) {}
})();
/* 闪现技能图标兜底：复用基础技能图标表 D */
(function () {
  try {
    if (typeof W === "undefined" || !W) return;
    if (!W["mods_blink"]) W["mods_blink"] = W["blink"] || W["arc"] || W["fireball"] || "";
    if (typeof Ye !== "undefined" && Ye && !Ye["mods_blink"]) Ye["mods_blink"] = W["mods_blink"];
  } catch (e) {}
})();
/* 闪现技能加入所有职业商人的主动技能宝石购买栏 */
(function () {
  try {
    if (typeof Ut === "undefined" || !Ut) return;
    Object.keys(Ut).forEach(function (cls) {
      var c = Ut[cls];
      if (c && Array.isArray(c.pool) && c.pool.indexOf("mods_blink") < 0) c.pool.push("mods_blink");
    });
  } catch (e) {}
})();
/* 超越地图模式：开图界面下方 1-100 级，每级怪物生命/伤害 +1000%，稀有度 +50% */
(function () {
  if (window.__beyondHooked) return;
  window.__beyondHooked = 1;
  var MAX = 100;
  var lv = function () { try { return Math.max(0, Math.min(MAX, +u.beyond || 0)); } catch (e) { return 0; } };
  var beyondHTML = function () {
    return '<h3>超越地图 <small>100 级 · 越级越危险，掉落稀有度越高</small></h3>' +
      '<p class="dim" style="font-size:11.5px">每 1 级：怪物生命 +1000%、伤害 +1000%、物品稀有度 +50%。0 = 关闭。</p>' +
      '<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">' +
      '<button class="btn small" data-beyond="-10">-10</button>' +
      '<button class="btn small" data-beyond="-1">-1</button>' +
      '<input id="beyondLv" type="number" min="0" max="100" step="1" value="' + lv() + '" style="width:70px;background:#0d0b10;border:1px solid #3a3244;color:#d8d0c0;padding:4px 6px">' +
      '<button class="btn small" data-beyond="1">+1</button>' +
      '<button class="btn small" data-beyond="10">+10</button>' +
      '<button class="btn small primary" data-beyond="apply">应用</button>' +
      '<span id="beyondInfo" class="dim" style="font-size:11.5px"></span></div>';
  };
  var inject = function () {
    try {
      if (document.getElementById("beyondPanel")) return;
      var root = null;
      var ids = ["overlay", "pbody"];
      for (var ri = 0; ri < ids.length; ri++) {
        var el0 = document.getElementById(ids[ri]);
        if (el0 && el0.textContent && (el0.textContent || "").indexOf("地图装置") >= 0) { root = el0; break; }
      }
      if (!root) return;
      var sec = document.createElement("section");
      sec.id = "beyondPanel";
      sec.className = "card";
      sec.style.cssText = "margin-top:10px";
      sec.innerHTML = beyondHTML();
      // 优先插到左侧「升华试炼」卡片下方（开图界面左栏），找不到再退回容器末尾
      var target = null;
      try {
        var heads = root.querySelectorAll("h3,h4,summary");
        for (var hi = 0; hi < heads.length; hi++) {
          if ((heads[hi].textContent || "").indexOf("升华试炼") >= 0) {
            target = heads[hi].closest("section,.card,div");
            break;
          }
        }
      } catch (e0) {}
      if (target && target.parentNode) target.parentNode.insertBefore(sec, target.nextSibling);
      else root.appendChild(sec);
      var info = function () {
        var L = Math.max(0, Math.min(MAX, +(document.getElementById("beyondLv") || {}).value || 0));
        var m = 1 + 10 * L;
        var el = document.getElementById("beyondInfo");
        if (el) el.textContent = L ? "Lv " + L + " · 怪物生命 ×" + m + " · 伤害 ×" + m + " · 稀有度 +" + (50 * L) + "%" : "已关闭";
      };
      var inp = document.getElementById("beyondLv");
      if (inp) inp.addEventListener("input", info);
      info();
    } catch (e) {}
  };
  // 地图页 Ap() 直接返回 HTML：把面板拼进左侧「升华试炼」下方，避免 DOM 注入跑到页面底部
  try {
    if (typeof i1 === "function") {
      var __beyondAp = i1;
      i1 = function () {
        var html = __beyondAp.apply(this, arguments);
        try {
          var idx = html.lastIndexOf("升华试炼");
          if (idx >= 0) {
            var close = html.indexOf("</p>", idx);
            if (close >= 0) {
              html = html.slice(0, close + 4) + '<section id="beyondPanel" class="card" style="margin-top:8px">' + beyondHTML() + '</section>' + html.slice(close + 4);
            }
          }
        } catch (e0) {}
        return html;
      };
    }
  } catch (e0) {}
  document.addEventListener("input", function (e) {
    if (!e.target || e.target.id !== "beyondLv") return;
    var L = Math.max(0, Math.min(MAX, +(e.target.value || 0)));
    var el = document.getElementById("beyondInfo");
    if (el) el.textContent = L ? "Lv " + L + " · 怪物生命 ×" + (1 + 10 * L) + " · 伤害 ×" + (1 + 10 * L) + " · 稀有度 +" + (50 * L) + "%" : "已关闭";
  }, true);
  var apply = function (raw) {
    var n = Math.max(0, Math.min(MAX, Math.round(+raw || 0)));
    try { u.beyond = n; } catch (e) {}
    var inp = document.getElementById("beyondLv");
    if (inp) inp.value = n;
    try { P(n ? "超越地图已设为 Lv " + n + " · 下次开图生效" : "超越地图已关闭"); } catch (e) {}
    try { Gs(); } catch (e) {}
  };
  document.addEventListener("click", function (e) {
    var b = e.target && e.target.closest ? e.target.closest("[data-beyond]") : null;
    if (!b) return;
    e.preventDefault();
    e.stopPropagation();
    var v = b.getAttribute("data-beyond");
    var inp = document.getElementById("beyondLv");
    var cur = inp ? +inp.value || 0 : lv();
    if (v === "apply") apply(inp ? inp.value : lv());
    else apply(cur + (+v));
  }, true);
  // 地图装置界面可能由对象的 F/点击直接打开，不一定走 Jp：定期检查 overlay 文本
  try {
    setInterval(function () {
      try {
        inject();
      } catch (err) {}
    }, 500);
  } catch (e) {}
  if (typeof B1 === "function") {
    var __beyondJp = B1;
    B1 = function () {
      var r = __beyondJp.apply(this, arguments);
      setTimeout(inject, 0);
      return r;
    };
  }
  A("map:enter", function () {
    try {
      var L = lv();
      if (!L) return;
      var mult = 1 + 10 * L;
      (n.mons || []).forEach(function (m) {
        if (!m) return;
        m.maxhp = (m.maxhp || 1) * mult;
        m.hp = m.maxhp;
        m.dmg = (m.dmg || 1) * mult;
      });
      n.Z.beyond = L;
      n.Z.beyondRarity = 50 * L;
      P("超越地图 Lv " + L + " · 怪物生命/伤害 ×" + mult + " · 稀有度 +" + (50 * L) + "%");
    } catch (e) {}
  });
  document.addEventListener("click", function (e) {
    try { if (e.target && e.target.id === "btnPortal") setTimeout(inject, 0); } catch (err) {}
  }, true);
  A("kill:loot", function (ev) {
    try {
      if (!n.Z || !n.Z.beyond) return;
      // kill:loot 事件字段是 {m, src, dm, rb}：稀有度加成要写 rb，写 rar 不会生效
      ev.dm = (ev.dm == null ? 1 : ev.dm) * (1 + 0.5 * n.Z.beyond);
      ev.rb = (ev.rb || 0) + 50 * n.Z.beyond;
    } catch (e) {}
  });
})();
/* 恩典（驱灵祭坛）界面 Esc 关闭 */
(function () {
  try {
    if (window.__ritualEscHooked) return;
    window.__ritualEscHooked = 1;
    window.addEventListener("keydown", function (ev) {
      try {
        if (!ev || ev.key !== "Escape") return;
        var ov = document.getElementById("overlay");
        if (!ov || ov.hidden || (ov.textContent || "").indexOf("驱灵祭坛 · 恩典") < 0) return;
        ev.preventDefault();
        ev.stopPropagation();
        n.ritualPause = !1;
        if (typeof xt === "function") xt();
      } catch (e) {}
    }, true);
  } catch (e) {}
})();
/* 剑客剑系绘制：包一层 save/restore，防止飞剑特效把画布状态留在低 alpha / lighter，导致后续贴图与文字消失 */
(function () {
  try {
    var names = ["P6", "z6", "j6", "E6"];
    names.forEach(function (name) {
      try {
        var fn = null;
        if (name === "P6" && typeof Aj === "function") fn = Aj;
        if (name === "z6" && typeof Cj === "function") fn = Cj;
        if (name === "j6" && typeof Tj === "function") fn = Tj;
        if (name === "E6" && typeof Sj === "function") fn = Sj;
        if (!fn) return;
        var wrapped = function () {
          try { d.save(); } catch (e) {}
          try { return fn.apply(this, arguments); }
          finally { try { d.restore(); } catch (e) {} }
        };
        if (name === "P6") Aj = wrapped;
        if (name === "z6") Cj = wrapped;
        if (name === "j6") Tj = wrapped;
        if (name === "E6") Sj = wrapped;
      } catch (e) {}
    });
  } catch (e) {}
})();
/* 首领血条：首领死亡后立即隐藏，避免血条停在旧状态 */
(function () {
  try {
    if (window.__bossbarFixed) return;
    window.__bossbarFixed = 1;
    setInterval(function () {
      try {
        var el = document.getElementById("bossbar");
        if (!el) return;
        var boss = n && n.Z && n.Z.boss;
        if (!boss || boss.dead) el.style.display = "none";
        else el.style.display = "";
      } catch (e) {}
    }, 250);
  } catch (e) {}
})();
/* 高级天赋珠宝：全局兜底点击（防止面板重渲染后 pbody 监听丢失） */
(function () {
  try {
    if (window.__advJewelGlobal) return;
    window.__advJewelGlobal = 1;
    document.addEventListener("click", function (e) {
      try {
        var b = e.target && e.target.closest ? e.target.closest("[data-advjewel]") : null;
        if (!b) return;
        e.preventDefault();
        e.stopPropagation();
        var msg = typeof AdvJewelAction === "function" ? AdvJewelAction(b.getAttribute("data-advjewel")) : "珠宝面板未就绪";
        if (msg && typeof P === "function") P(msg);
        if (typeof __advRender === "function") __advRender();
      } catch (err) {}
    }, true);
  } catch (e) {}
})();
/* 稀有/首领眩晕保底：只有陨石/彗星这类“砸下来”的技能额外加 0.6% 眩晕，其它技能走正常眩晕运算 */
(function () {
  try {
    if (window.__stunMinHooked) return;
    window.__stunMinHooked = 1;
    A("hit:land", function (e) {
      try {
        if (!e || e.fixed || !e.m) return;
        var m = e.m;
        if (!m || m.dead || m.rar < 2 || m.stunT > 0) return;
        var sk = e.c || (e.src && e.src.c) || null;
        var gid = sk && sk.gid;
        if (gid !== "meteor" && gid !== "comet") return;
        m.stun = Math.min(1, (m.stun || 0) + 0.006);
      } catch (err) {}
    });
  } catch (e) {}
})();
/* 切屏回来 / 窗口重新聚焦：重置画布 clip/状态，避免黑屏只剩 HUD */
(function () {
  try {
    if (window.__riftVisibilityReset) return;
    window.__riftVisibilityReset = 1;
    var resetCanvas = function () {
      // 不在事件里直接 reset，避免打断当前绘制；标记到下一帧开头再重置
      window.__riftResetNext = true;
    };
    document.addEventListener("visibilitychange", function () { if (!document.hidden) resetCanvas(); });
  } catch (e) {}
})();
/* 新号开荒：T1–T10 地图怪物生命/伤害下调，T11+ 不变 */
(function () {
  try {
    if (window.__lowTierEase) return;
    window.__lowTierEase = 1;
    A("map:enter", function () {
      try {
        if (!n || !n.Z || n.Z.type !== "map") return;
        var tier = n.Z.tier || 1;
        if (tier > 10 || n.Z.beyond) return;
        var mul = 0.5 + tier * 0.02; // T1 0.52 → T10 0.70
        (n.mons || []).forEach(function (m) {
          if (!m || m.dead) return;
          m.maxhp = (m.maxhp || 1) * mul;
          m.hp = m.maxhp;
          m.dmg = (m.dmg || 1) * mul;
        });
      } catch (e) {}
    });
  } catch (e) {}
})();
/* 手机版：额外「交互」按键，等价 F */
(function () {
  try {
    if (window.__mobileInteractBtn) return;
    window.__mobileInteractBtn = 1;
    var btn = document.createElement("button");
    btn.id = "btnMobileInteract";
    btn.type = "button";
    btn.textContent = "交互";
    btn.setAttribute("aria-label", "交互 F");
    document.body.appendChild(btn);
    var press = function (ev) {
      try { ev.preventDefault(); ev.stopPropagation(); } catch (e) {}
      try { window.dispatchEvent(new KeyboardEvent("keydown", { key: "f", bubbles: true })); } catch (e) {}
      setTimeout(function () {
        try { window.dispatchEvent(new KeyboardEvent("keyup", { key: "f", bubbles: true })); } catch (e) {}
      }, 40);
    };
    btn.addEventListener("pointerdown", press, { passive: false });
    btn.addEventListener("click", function (ev) { ev.preventDefault(); });
  } catch (e) {}
})();
/* 大量掉落/开裂隙后，强制重置一次画布状态，避免文字层被特效状态污染 */
(function () {
  try {
    if (window.__lootBurstReset) return;
    window.__lootBurstReset = 1;
    var last = 0;
    setInterval(function () {
      try {
        var n = (n && n.loots && n.loots.length) || 0;
        if (n - last > 25) {
          setTimeout(function () {
            try { window.__riftResetNext = true; } catch (e) {}
          }, 0);
        }
        last = n;
      } catch (e) {}
    }, 400);
  } catch (e) {}
})();
/* 通货掉落堆叠：靠近的同类通货合并为一堆，拾取时按堆叠数量结算 */
(function () {
  try {
    if (window.__lootStackHooked) return;
    window.__lootStackHooked = 1;

    // 每 250ms 合并附近已落地的同类通货
    setInterval(function () {
      try {
        if (!n || !n.loots || n.loots.length < 2) return;
        var arr = n.loots;
        for (var i = 0; i < arr.length; i++) {
          var a = arr[i];
          if (!a || a.kind !== "cur" || !a.landed || a.hid) continue;
          for (var j = arr.length - 1; j > i; j--) {
            var b = arr[j];
            if (!b || b.kind !== "cur" || b.cur !== a.cur || !b.landed || b.hid) continue;
            if (Math.hypot(a.x - b.x, a.y - b.y) > 30) continue;
            a.stackN = (a.stackN || 1) + (b.stackN || 1);
            arr.splice(j, 1);
          }
        }
      } catch (e) {}
    }, 250);

    // 拾取时一次给整堆数量
    if (typeof Js === "function") {
      var __baseIo = Js;
      Js = function (loot) {
        try {
          if (loot && loot.kind === "cur" && (loot.stackN || 1) > 1) {
            var n = loot.stackN;
            loot.stackN = 1;
            var ok = __baseIo(loot);
            if (ok) {
              try {
                u.cur[loot.cur] = (u.cur[loot.cur] || 0) + (n - 1);
                if (n.run) {
                  n.run.cur[loot.cur] = (n.run.cur[loot.cur] || 0) + (n - 1);
                  n.run.value += (n - 1) * (q[loot.cur] ? q[loot.cur].v : 0);
                }
              } catch (e) {}
            }
            return ok;
          }
        } catch (e) {}
        return __baseIo(loot);
      };
    }

    // 世界层在堆叠通货上方画 ×N
    var installDraw = function () {
      if (typeof window.__portDrawGroundCustom !== "function" || window.__portGroundStackWrapped) return;
      window.__portGroundStackWrapped = 1;
      var __baseGround = window.__portDrawGroundCustom;
      window.__portDrawGroundCustom = function () {
        __baseGround.apply(this, arguments);
        try {
          if (!n || !n.loots || !d) return;
          d.save();
          d.font = "700 11px " + (typeof cn !== "undefined" && cn ? cn : "'Microsoft YaHei',sans-serif");
          d.textAlign = "center";
          d.textBaseline = "middle";
          d.lineWidth = 2;
          d.strokeStyle = "rgba(0,0,0,.85)";
          for (var i = 0; i < n.loots.length; i++) {
            var l = n.loots[i];
            if (!l || l.kind !== "cur" || (l.stackN || 1) <= 1 || !l.landed) continue;
            var txt = "×" + l.stackN;
            d.strokeText(txt, l.x, l.y - 13);
            d.fillStyle = "#ffd27a";
            d.fillText(txt, l.x, l.y - 13);
          }
          // 过滤显示模式下，被过滤物品只画图标不画名字；把名字缓存到屏幕层，等基础绘制结束后再画
          window.__riftLootLabels = [];
          try {
            if (typeof yr === "function" && yr()) {
              var __lm = d.getTransform();
              for (var li = 0; li < n.loots.length; li++) {
                var ll = n.loots[li];
                if (!ll || !ll.landed) continue;
                if (n.pl && Math.hypot(ll.x - n.pl.x, ll.y - n.pl.y) > 320) continue;
                var nm = "", col = "#c8c8c8";
                if (ll.kind === "cur") { nm = q[ll.cur] ? q[ll.cur].n : ""; col = "#ffd27a"; }
                else if (ll.kind === "it" && ll.it) {
                  nm = ll.it.name || (typeof pe !== "undefined" && ll.it.base ? pe[ll.it.base].n : "");
                  col = ll.it.rarity === 3 ? "#ff9a40" : ll.it.rarity === 2 ? "#f0d040" : ll.it.rarity === 1 ? "#6a9aff" : "#d8d8d8";
                }
                if (!nm) continue;
                if ((ll.stackN || 1) > 1) nm += " ×" + ll.stackN;
                window.__riftLootLabels.push({
                  txt: nm,
                  col: col,
                  x: __lm.a * ll.x + __lm.e,
                  y: __lm.d * (ll.y - 18) + __lm.f,
                  size: Math.max(10, Math.min(18, 8 * __lm.a))
                });
              }
            }
          } catch (eLbl) {}
          d.restore();
        } catch (e) { try { d.restore(); } catch (e2) {} }
      };
    };
    setTimeout(installDraw, 0);
  } catch (e) {}
})();
/* 符文取出：从装备插槽卸下符文并放回通货栏 */
(function () {
  try {
    if (window.__runeOutHooked) return;
    window.__runeOutHooked = 1;
    var findItems = function (uid) {
      var pool = [];
      if (u && u.equip) Object.keys(u.equip).forEach(function (k) { if (u.equip[k]) pool.push(u.equip[k]); });
      if (u && u.inv) pool = pool.concat(u.inv);
      if (u && Array.isArray(u.stash)) pool = pool.concat(u.stash);
      if (u && Array.isArray(u.gems)) pool = pool.concat(u.gems);
      var out = [];
      for (var i = 0; i < pool.length; i++) if (pool[i] && String(pool[i].uid) === String(uid)) out.push(pool[i]);
      return out;
    };
    document.addEventListener("click", function (e) {
      try {
        var b = e.target && e.target.closest ? e.target.closest("[data-runeout]") : null;
        if (!b) return;
        e.preventDefault();
        e.stopPropagation();
        var parts = String(b.getAttribute("data-runeout") || "").split(":");
        var list = findItems(parts[0]);
        var idx = +parts[1];
        var rid = null;
        for (var li = 0; li < list.length; li++) {
          var item = list[li];
          if (item && Array.isArray(item.runes) && item.runes[idx]) {
            rid = item.runes.splice(idx, 1)[0];
            break;
          }
        }
        if (!rid) {
          P("取出失败：找不到装备或符文");
          return;
        }
        u.cur[rid] = (u.cur[rid] || 0) + 1;
        try { be(); } catch (e1) {}
        try { Gs(); } catch (e2) {}
        // 关闭旧 tooltip / 锁定面板，避免看起来符文还在
        try { var lock = document.getElementById("riftTipLock"); if (lock) lock.remove(); } catch (e3) {}
        try { var tip = document.getElementById("tip"); if (tip) tip.hidden = true; } catch (e4) {}
        P("已取出符文: " + (q[rid] ? q[rid].n : rid));
      } catch (err) {
        P("取出失败");
      }
    }, true);
  } catch (e) {}
})();
/* Alt / Ctrl 锁定物品预览，方便点符文取出 */
(function () {
  try {
    if (window.__riftTipLockHooked) return;
    window.__riftTipLockHooked = 1;
    var lock = function () {
      try {
        var tip = document.getElementById("tip");
        if (!tip || tip.hidden || (tip.innerHTML || "").indexOf("data-runeout") < 0) return;
        var old = document.getElementById("riftTipLock");
        if (old) old.remove();
        var r = tip.getBoundingClientRect();
        var d = document.createElement("div");
        d.id = "riftTipLock";
        d.innerHTML = tip.innerHTML;
        d.style.cssText = "position:fixed;left:" + Math.max(4, r.left) + "px;top:" + Math.max(4, r.top) + "px;z-index:9999;min-width:260px;max-width:420px;max-height:70vh;overflow:auto;background:#0a080cf8;border:1px solid #8a6a3a;color:#d8d0c0;padding:8px 10px;box-shadow:0 12px 40px #000e;pointer-events:auto";
        document.body.appendChild(d);
      } catch (e) {}
    };
    var unlock = function () {
      var d = document.getElementById("riftTipLock");
      if (d) d.remove();
    };
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Shift") return;
      if (e.repeat) return;
      if (document.getElementById("riftTipLock")) return;
      lock();
    }, true);
    document.addEventListener("keyup", function (e) {
      if (e.key === "Shift") unlock();
    }, true);
    window.addEventListener("blur", unlock);
  } catch (e) {}
})();
/* 清理已拾取但仍留在地面的掉落幽灵（地图内看起来“捡 1 变 2”） */
(function () {
  try {
    if (window.__ghostLootClean) return;
    window.__ghostLootClean = 1;
    setInterval(function () {
      try {
        if (!n || !Array.isArray(n.loots) || !u) return;
        var owned = new Set();
        (u.inv || []).forEach(function (it) { if (it) owned.add(it); });
        if (u.equip) Object.keys(u.equip).forEach(function (k) { if (u.equip[k]) owned.add(u.equip[k]); });
        n.loots = n.loots.filter(function (l) {
          if (!l || l.kind !== "it" || !l.it) return true;
          return !owned.has(l.it);
        });
      } catch (e) {}
    }, 300);
  } catch (e) {}
})();
/* 瓦尔腐化随机化：每次腐化都有概率追加一条随机双重腐化词缀 */
(function () {
  try {
    if (window.__vaalRandomHooked) return;
    window.__vaalRandomHooked = 1;
    if (typeof l9 !== "function") return;
    var __baseTA = l9;
    l9 = function (item, pity) {
      var res = __baseTA.apply(this, arguments);
      try {
        // EMB-126：传奇专属腐化 → 单瓦出词缀（impl）时「替换一条原生词缀」
        // 官版 l9 的 up 分支返回 "impl" 并写 cimpl；这里补上「移除一条 st/mods 原生词缀」。
        if (res === "impl" && item && item.uniq) {
          var __uPool = null;
          try { __uPool = (window.__CORRUPT_POOL && window.__CORRUPT_POOL.unique) || null; } catch (eU) {}
          if (__uPool && __uPool[item.uniq]) {
            try { if (typeof window.__CORRUPT_POOL.replaceUnique === "function") window.__CORRUPT_POOL.replaceUnique(item); } catch (eR) {}
          }
        }
      } catch (e) {}
      try {
        // EMB-122：珠宝同样可以双瓦；用 cp(item) 取池以沿用「珠宝不出 skillLvl」的官版规则
        if (item && (item.kind === "item" || item.kind === "jewel") && item.corrupted && !item.cimpl2 && I() < 0.28) {
          var pool = (typeof cp === "function") ? cp(item) : ((typeof Xu !== "undefined" && Xu) ? Xu : null);
          if (pool && pool.length) {
            var pick = oe(pool);
            // 与已有第一条同 key 时跳过，避免一件装备上出现两条一模一样的腐化
            if (!item.cimpl || pick[0] !== item.cimpl.k) {
              item.cimpl2 = { k: pick[0], v: de(pick[1][0], pick[1][1]) };
              // EMB-122：这里原先写 item.dc = true，而 dc 是余烬祭坛的「已献祭」标记，
              // 导致瓦尔出双瓦的装备永久无法上祭坛。改用独立标记 dc2。
              item.dc2 = true;
            }
          }
        }
      } catch (e) {}
      return res;
    };
  } catch (e) {}
})();
/* 手机端画布点击兜底：触摸结束后补发 click，修复天赋/地图节点点不了 */
(function () {
  try {
    if (window.__touchCanvasClick) return;
    window.__touchCanvasClick = 1;
    var start = null;
    var ids = { advcv: 1, atlascv: 1, treecv: 1 };
    document.addEventListener("touchstart", function (e) {
      var t = e.target;
      if (!t || !ids[t.id] || !e.touches || !e.touches[0]) { start = null; return; }
      // 面板/装备 UI 覆盖在画布上方时，不把点击透传给底下的天赋/地图画布
      try {
        var __hit = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
        if (__hit && __hit !== t && !t.contains(__hit)) { start = null; return; }
      } catch (eHit) {}
      start = { id: t.id, x: e.touches[0].clientX, y: e.touches[0].clientY, el: t };
    }, { passive: true, capture: true });
    document.addEventListener("touchend", function (e) {
      if (!start || !e.changedTouches || !e.changedTouches[0]) { start = null; return; }
      var t = e.changedTouches[0], dx = t.clientX - start.x, dy = t.clientY - start.y;
      var el = start.el, id = start.id;
      start = null;
      if (Math.abs(dx) + Math.abs(dy) > 12) return;
      try {
        var ev = new MouseEvent("click", { bubbles: true, cancelable: true, clientX: t.clientX, clientY: t.clientY, button: 0 });
        el.dispatchEvent(ev);
        if (id === "advcv" && typeof AdvCanvasPoint === "function" && typeof AdvHit === "function" && typeof AdvShowTip === "function") {
          var __cxt = { clientX: t.clientX, clientY: t.clientY };
          var __pt = AdvCanvasPoint(__cxt, el), __star = (n && n.advTab) === "star", __hit = AdvHit(__pt.x, __pt.y, __star);
          if (__hit) setTimeout(function () { try { AdvShowTip(__hit, __star, __cxt); } catch (e) {} }, 40);
        }
      } catch (err) {}
    }, { passive: true, capture: true });
  } catch (e) {}
})();
/* 缺贴图怪物兜底：避免绘制异常导致整只怪看不见 */
(function () {
  try {
    if (window.__monSpriteFallback) return;
    window.__monSpriteFallback = 1;
    setInterval(function () {
      try {
        if (!n || !n.Z || n.Z.type !== "map" || !n.mons) return;
        for (var i = 0; i < n.mons.length; i++) {
          var m = n.mons[i];
          if (!m || m.dead || !m.spr) continue;
          if (typeof Xt === "undefined" || !Xt[m.spr] || !Xt[m.spr].img) {
            window.__riftMissingSprites = window.__riftMissingSprites || {};
            window.__riftMissingSprites[m.spr] = (window.__riftMissingSprites[m.spr] || 0) + 1;
            m.__fallbackSprite = m.spr;
            m.spr = "skel";
            if (m.t) m.t = Object.assign({}, m.t, { spr: "skel" });
          }
        }
      } catch (e) {}
    }, 500);
  } catch (e) {}
})();
/* 宝箱绘制后恢复画布状态，避免箱子高亮/光效把文字透明度带低 */
(function () {
  try {
    if (window.__boxDrawGuard || typeof _A !== "function") return;
    window.__boxDrawGuard = 1;
    var __baseU3 = _A;
    _A = function () {
      try {
        d.save();
        return __baseU3.apply(this, arguments);
      } catch (eBox) {
        return;
      } finally {
        try { d.restore(); } catch (e) {}
      }
    };
  } catch (e) {}
})();
/* 怪物卡墙兜底：检测到怪物中心在墙里时拉回最近的可站立点 */
(function () {
  try {
    if (window.__monUnstuck) return;
    window.__monUnstuck = 1;
    setInterval(function () {
      try {
        if (!n || !n.mons || !n.pl || !n.Z) return;
        for (var i = 0; i < n.mons.length; i++) {
          var m = n.mons[i];
          if (!m || m.dead || typeof At !== "function" || !At(m.x, m.y)) continue;
          var placed = false;
          for (var r = 8; r <= 120 && !placed; r += 8) {
            for (var a = 0; a < 16 && !placed; a++) {
              var nx = m.x + Math.cos(a * 0.3927) * r, ny = m.y + Math.sin(a * 0.3927) * r;
              if (!At(nx, ny)) { m.x = nx; m.y = ny; m.vx = m.vy = 0; m.stuck = 0; placed = true; }
            }
          }
        }
      } catch (e) {}
    }, 500);
  } catch (e) {}
})();
/* 记录运行时异常，F7 诊断里能看到导致整帧绘制中断的报错 */
(function () {
  try {
    if (window.__riftErrorHook) return;
    window.__riftErrorHook = 1;
    window.__riftErrors = [];
    var push = function (msg, src) {
      try { window.__riftErrors.push(String(msg) + (src ? " @ " + src : "")); if (window.__riftErrors.length > 20) window.__riftErrors.shift(); } catch (e) {}
    };
    window.addEventListener("error", function (e) {
      push(e && (e.message || e.error), (e && e.filename ? e.filename + ":" + e.lineno + ":" + e.colno : ""));
    });
    window.addEventListener("unhandledrejection", function (e) { push("promise: " + (e && e.reason && (e.reason.stack || e.reason.message || e.reason))); });
  } catch (e) {}
})();
/* 阻止 Ctrl+滚轮 / Ctrl+加减号 改变浏览器页面缩放，避免游戏 UI 突然变小 */
(function () {
  try {
    if (window.__riftZoomGuard) return;
    window.__riftZoomGuard = 1;
    window.addEventListener("wheel", function (e) {
      if (e.ctrlKey) { try { e.preventDefault(); } catch (x) {} }
    }, { passive: false });
    window.addEventListener("keydown", function (e) {
      if (!e.ctrlKey) return;
      if (e.key === "-" || e.key === "=" || e.key === "+" || e.key === "0" || e.key === "NumpadSubtract" || e.key === "NumpadAdd") {
        try { e.preventDefault(); } catch (x) {}
      }
    }, true);
  } catch (e) {}
})();
/* 页面缩放/尺寸突变时提示并恢复画布，不改变浏览器缩放本身 */
(function () {
  try {
    if (window.__riftDprGuard) return;
    window.__riftDprGuard = 1;
    var baseDpr = window.devicePixelRatio || 1, warned = false;
    var resetSoon = function () {
      window.__riftResetNext = true;
      setTimeout(function () { try { window.dispatchEvent(new Event("resize")); } catch (e) {} }, 60);
    };
    window.addEventListener("resize", function () { resetSoon(); }, { passive: true });
    setInterval(function () {
      try {
        var dpr = window.devicePixelRatio || 1;
        if (Math.abs(dpr - baseDpr) > 0.08) {
          baseDpr = dpr;
          if (!warned) {
            warned = true;
            P("检测到页面缩放变化 · 按 Ctrl+0 恢复 100% · 已尝试修复画面");
            setTimeout(function () { warned = false; }, 5000);
          }
          resetSoon();
        }
      } catch (e) {}
    }, 1000);
  } catch (e) {}
})();
/* 掉落名字：由基础渲染统一绘制（筛选模式）。v2.0.5 曾加过一层 DOM 掉落名字做兜底，
   但在筛选模式下会和基础文字重复显示（大小/位置不一致，看起来像“名字错误显示”），已移除。
   吞字问题的根因（缺图标掉落导致整帧抛错）已在 v2.0.5 从源头修复，不再需要这层兜底。 */
/* 珠宝提升：地图怪物也有概率掉珠宝；超越地图每级 +50% 经验 */
(function () {
  try {
    if (window.__jewelBeyondTune) return;
    window.__jewelBeyondTune = 1;
    A("kill:loot", function (ev) {
      try {
        if (!n || !n.Z || n.Z.type !== "map" || !ev || !ev.m) return;
        var m = ev.m;
        var chance = 0.02;
        if (m.rar === 1) chance = 0.06;
        else if (m.rar === 2) chance = 0.16;
        else if (m.rar === 3) chance = 0.45;
        if (Math.random() < chance) JewelDrop(m.x, m.y);
      } catch (e) {}
    });
    // 经验：y4 是基础发经验函数，按超越等级翻倍加成
    try {
      if (typeof E$ === "function") {
        var __baseY4 = E$;
        E$ = function (amount) {
          try {
            if (n && n.Z && n.Z.type === "map" && n.Z.beyond > 0) amount = amount * (1 + 0.5 * n.Z.beyond);
          } catch (e) {}
          var args = [].slice.call(arguments);
          args[0] = amount;
          return __baseY4.apply(this, args);
        };
      }
    } catch (eY4) {}
  } catch (e) {}
})();
/* 猎首：击败稀有/传奇敌人偷取词缀，60 秒内叠层增伤 */
(function () {
  if (window.__hhHooked) return;
  window.__hhHooked = 1;
  var hasHH = function () {
    try { return !!(u && u.equip && u.equip.belt && u.equip.belt.uniq === "headhunter"); } catch (e) { return false; }
  };
  var nameOf = function (m) {
    try {
      if (m && Array.isArray(m.mods) && m.mods.length) {
        var mm = m.mods[0];
        if (typeof mm === "string") return mm;
        if (mm && (mm.n || mm.id || mm.k)) return mm.n || mm.id || mm.k;
      }
    } catch (e) {}
    return "稀有怪物";
  };
  A("kill", function (ev) {
    try {
      var m = ev && (ev.m || ev);
      if (!m || !m.rar || m.rar < 2 || !hasHH()) return;
      var now = (typeof n !== "undefined" && n.T) || 0;
      if (!n.pl.__hhUntil || now > n.pl.__hhUntil) n.pl.__hhStacks = 0;
      n.pl.__hhStacks = Math.min(10, (n.pl.__hhStacks || 0) + 1);
      n.pl.__hhUntil = now + 60;
      P("猎首 · 偷取 " + nameOf(m) + " 的词缀 (" + n.pl.__hhStacks + " 层, 60 秒)");
    } catch (e) {}
  });
  A("hit:base", function (e) {
    try {
      if (!e || !e.by) return;
      if (!hasHH()) return;
      var now = (typeof n !== "undefined" && n.T) || 0;
      if (!n.pl.__hhUntil || now > n.pl.__hhUntil) { n.pl.__hhStacks = 0; return; }
      var mul = 1 + (n.pl.__hhStacks || 0) * 0.05;
      for (var k in e.by) if (e.by[k] > 0) e.by[k] *= mul;
    } catch (e) {}
  });
  A("map:enter", function () {
    try { n.pl.__hhStacks = 0; n.pl.__hhUntil = 0; } catch (e) {}
  });
})();
/* 阿图鲁伊的放血术：技能消耗多少魔力，就消耗多少生命；每 1 生命使元素伤害总增 5%，最多 100% */
(function () {
  if (window.__atuBloodHooked) return;
  window.__atuBloodHooked = 1;
  try {
    A("hit:base", function (e) {
      try {
        if (!e || !e.c) return;
        var sups = e.c.sup || e.c.supports || [];
        if (!Array.isArray(sups) || sups.indexOf("mods_atu_bloodletting") < 0) return;
        var now = performance.now() / 1000;
        var key = e.c.gid || e.c.uid || e.c.id || "x";
        var last = n.pl.__atuLast || (n.pl.__atuLast = {});
        var bonusMap = n.pl.__atuBonus || (n.pl.__atuBonus = {});
        if (now - (last[key] || 0) >= 0.35) {
          last[key] = now;
          var baseCost = 6;
          try {
            if (typeof se !== "undefined" && se[e.c.gid] && se[e.c.gid].cost) baseCost = se[e.c.gid].cost;
          } catch (err) {}
          var lifeCost = Math.max(1, Math.round(baseCost));
          if (n.pl.hp > lifeCost) n.pl.hp = Math.max(1, n.pl.hp - lifeCost);
          bonusMap[key] = Math.min(100, lifeCost * 5);
        }
        var bonus = bonusMap[key] || 0;
        if (bonus <= 0) return;
        var mul = 1 + bonus / 100;
        ["fire", "cold", "light"].forEach(function (k) {
          if (e.by[k] > 0) e.by[k] *= mul;
        });
      } catch (err) {}
    });
    A("map:enter", function () {
      try { n.pl.__atuLast = {}; n.pl.__atuBonus = {}; } catch (e) {}
    });
  } catch (e) {}
})();
/* ---- 读屏 / 诊断插件：截图 PNG + 导出状态 JSON + 缺失贴图列表 ---- */
function __riftDownload(name, data, mime) {
  try {
    var blob = data instanceof Blob ? data : new Blob([data], { type: mime || "application/octet-stream" });
    var url = URL.createObjectURL(blob), a = document.createElement("a");
    a.href = url; a.download = name; document.body.appendChild(a); a.click();
    setTimeout(function () { try { URL.revokeObjectURL(url); a.remove(); } catch (e) {} }, 1500);
  } catch (e) { P("导出失败: " + e.message); }
}
function __riftShot() {
  try {
    var cv = document.getElementById("cv");
    if (!cv) return;
    var url = cv.toDataURL("image/png");
    var a = document.createElement("a");
    a.href = url; a.download = "余烬裂隙-截图-" + Date.now() + ".png";
    document.body.appendChild(a); a.click(); a.remove();
    P("截图已保存");
  } catch (e) { P("截图失败: " + e.message); }
}
function __riftStats() {
  var mons = {}, projs = {}, objs = {}, missing = {};
  try {
    for (var i = 0; i < (n.mons || []).length; i++) {
      var m = n.mons[i]; if (!m) continue;
      var tk = m.type || m.t && m.t.k || "?";
      var sp = m.spr || (m.t && m.t.spr) || "";
      mons[tk] = mons[tk] || { type: tk, n: m.t && m.t.n, spr: sp, count: 0, hidden: !!m.hidden, dead: !!m.dead, hp: Math.round(m.hp || 0), maxhp: Math.round(m.maxhp || 0), rar: m.rar || 0, fallback: m.__fallbackSprite || null };
      mons[tk].count++;
      if (sp && (!Xt[sp] || !Xt[sp].img || !Xt[sp].img.width)) { mons[tk].missing = true; missing[sp] = (missing[sp] || 0) + 1; }
    }
    for (var j = 0; j < (n.projs || []).length; j++) { var pj = n.projs[j]; if (pj) projs[pj.kind || "?"] = (projs[pj.kind || "?"] || 0) + 1; }
    for (var k = 0; k < (n.objs || []).length; k++) { var ob = n.objs[k]; if (ob) objs[ob.kind || "?"] = (objs[ob.kind || "?"] || 0) + 1; }
  } catch (e) {}
  var ctxInfo = {};
  try { ctxInfo = { alpha: d.globalAlpha, composite: d.globalCompositeOperation, filter: d.filter, transform: d.getTransform ? JSON.stringify(d.getTransform()) : "n/a" }; } catch (e) {}
  return {
    at: new Date().toISOString(), version: (window.HOTFIX && window.HOTFIX.version) || window.__HOTFIX_APPLIED || "unknown", state: n.state,
    zone: n.Z && n.Z.type, tower: n.Z && n.Z.tower && { n: n.Z.tower.n, theme: n.Z.tower.plan && n.Z.tower.plan.theme },
    player: u && { cls: u.cls, level: u.level, hp: n.pl && Math.round(n.pl.hp), es: n.pl && Math.round(n.pl.es) },
    counts: { mons: (n.mons || []).length, projs: (n.projs || []).length, eprojs: (n.eprojs || []).length, fx: (n.fx || []).length, parts: (n.parts || []).length, lights: (n.LIGHTS || []).length, objs: (n.objs || []).length, decals: (n.decals || []).length, texts: (n.texts || []).length },
    ctx: ctxInfo, monsters: mons, projectiles: projs, objs: objs, missingSprites: missing, errors: (window.__riftErrors || []).slice(-5)
  };
}
function __riftDiag() {
  try {
    var st = __riftStats();
    __riftDownload("余烬裂隙-诊断-" + Date.now() + ".json", JSON.stringify(st, null, 1), "application/json");
    try { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(JSON.stringify(st, null, 1)); } catch (eClip) {}
    try { console.log("[诊断]", st); } catch (e) {}
    var miss = Object.keys(st.missingSprites || {});
    P("诊断已保存" + (miss.length ? " · 缺失贴图: " + miss.join(", ") : " · 未发现缺失贴图"));
  } catch (e) { P("诊断失败: " + e.message); }
}
function __riftSpriteDump() {
  try {
    var st = __riftStats(), miss = Object.keys(st.missingSprites || {});
    if (!miss.length) { P("当前没有缺失贴图"); return; }
    var lines = miss.map(function (k) { return k + " ×" + st.missingSprites[k]; }).join(" · ");
    P("缺失贴图: " + lines);
    try { console.log("[缺失贴图]", miss, st.monsters); } catch (e) {}
  } catch (e) { P("检查失败: " + e.message); }
}
window.__riftDiag = __riftDiag;
window.__riftShot = __riftShot;
window.__riftStats = __riftStats;
ZT = function (_v2267) {
  let _v2268 = n.Z && n.Z.type === "map" && n.state === "play", _v2269 = () => _v2268 ? !0 : (P("请先进入地图"), !1), _v2270 = _v2271 => We(n.pl.x + B(-_v2271, _v2271), n.pl.y + B(-_v2271, _v2271), 20);
  switch (_v2267) {
    case "grant":
      (pc(), P("已发放: 全部宝石 / 通货 / 点数"));
      break;
    case "perf":
      _u();
      break;
    case "shot":
      __riftShot();
      break;
    case "diag":
      __riftDiag();
      break;
    case "spritedump":
      __riftSpriteDump();
      break;
    case "stress":
      {
        if (!_v2269()) return;
        let _v2272 = n.Z.th.mon, _v2273 = Object.keys(_v2272);
        for (let _v2274 = 0; _v2274 < 150; _v2274++) {
          let _v2275 = _v2270(220), _v2276 = nt(ht(_v2273, _v2277 => _v2272[_v2277]), _v2275.x, _v2275.y, n.Z.lvl, 0);
          (_v2276.aggro = !0, n.mons.push(_v2276));
        }
        P("压力测试: +150 只怪物 (F8 看性能)");
      }
      break;
    case "god":
      (u.god = !u.god, P(u.god ? "无敌已开启" : "无敌已关闭"));
      break;
    case "lv10":
    case "lv60":
      {
        let _v2278 = _v2267 === "lv60" ? 60 : Math.min(60, u.level + 10);
        for (; u.level < _v2278; ) u.level++;
        (u.xp = 0, P("等级 " + u.level));
        break;
      }
    case "sock":
      for (let _v2279 of [...u.skills, ...u.gems]) _v2279 && _v2279.kind === "gem" && (_v2279.lvl = 20, _v2279.sock = 5);
      P("所有主动宝石已 20 级 5 孔");
      break;
    case "cur999":
      Tt.forEach(_v2280 => u.cur[_v2280] = 999999);
      break;
    case "trial":
      (u.trials = Us.slice(), u.ascPts = 8, P("升华点 8"));
      break;
    case "atlas":
      (u.atlasPts = 28, P("图谱点 28"));
      break;
    case "cdr":
      (n.pl.cds = {}, n.pl.hp = n.S.maxLife, n.pl.mana = n.S.maxMana, n.pl.es = n.S.maxES, n.pl.ki = 10, n.pl.salvo = 6, u.flask.forEach(_v2281 => _v2281.ch = _v2281.max), P("冷却/资源已重置 · 刀意 10 · 冰箭 6"));
      break;
    case "rares":
      for (let _v2282 = 0; _v2282 < 10; _v2282++) {
        let _v2283 = null;
        for (let _v2284 = 0; _v2284 < 30 && !_v2283; _v2284++) {
          let _v2285 = oe(Pa.filter(_v2286 => _v2286.lv <= Math.max(u.level, 10)));
          _v2283 = Ft(_v2285, Math.max(u.level, 10), 2);
        }
        _v2283 && Vo(_v2283) && u.inv.push(_v2283);
      }
      P("已生成稀有装备");
      break;
    case "offs":
      for (let _v2287 of Pa) (hf(_v2287.slot) || _v2287.slot === "L") && Ca() < Dt && u.inv.push(Ft(_v2287, Math.max(u.level, _v2287.lv), 2));
      break;
    case "uniqs":
      for (let _v2288 of yt) {
        let _v2289 = Kt(_v2288, Math.max(u.level, _v2288.lv));
        (si(_v2289), Vo(_v2289) && u.inv.push(_v2289));
      }
      break;
    case "charges":
      (n.pl.pch = n.pl.fch = z1(), n.pl.chT = 10, n.pl.rage = 40, n.pl.rageT = 5);
      break;
    case "metafull":
      u.buffs.forEach(_v2290 => {
        _v2290 && _v2290.kind === "meta" && (_v2290.energy = 99);
      });
      break;
    case "sigils":
      js.forEach(_v2291 => u.cur[_v2291] = (u.cur[_v2291] || 0) + 1);
      break;
    case "pinlv":
      (u.pinLv = Math.min(10, u.pinLv + 1), P("裂隙之心 Lv" + u.pinLv));
      break;
    case "enc":
      {
        if (!_v2269()) return;
        let _v2292 = _v2270(60), _v2293 = {
          kind: "enc",
          type: n.Z.th.key,
          x: _v2292.x,
          y: _v2292.y,
          st: "idle",
          t: 0
        };
        if (!gt[_v2293.type]) return;
        if ((n.objs.push(_v2293), _v2293.type === "ice")) {
          let _v2294 = nt("icechest", _v2292.x, _v2292.y, n.Z.lvl, 0);
          (_v2294.prop = !0, _v2294.encObj = _v2293, _v2294.res = {
            phys: 90,
            fire: -200,
            cold: 90,
            light: 90
          }, n.mons.push(_v2294), _v2293.st = "chest");
        }
        break;
      }
    case "crystal":
      {
        if (!_v2269()) return;
        for (let _v2295 = 0; _v2295 < 3; _v2295++) {
          let _v2296 = _v2270(60), _v2297 = nt("crystal", _v2296.x, _v2296.y, n.Z.lvl, 0);
          (_v2297.prop = !0, n.mons.push(_v2297));
        }
        break;
      }
    case "go_crypt":
    case "go_lava":
    case "go_ice":
    case "go_swamp":
      {
        let _v2298 = _v2267.slice(3), _v2299 = Zt(10);
        (_v2299.theme = _v2298, _v2299.base = _v2299.name = la[_v2298].names[0], Ot(), Xi(_v2299));
        let _v2300 = n.Z.boss;
        if (_v2300) {
          let _v2301 = We(_v2300.x, _v2300.y + 60, 30);
          (n.pl.x = _v2301.x, n.pl.y = _v2301.y, es.x = n.pl.x - lo / 2, es.y = n.pl.y - co / 2);
        }
        return;
      }
    case "go_pin":
      (js.forEach(_v2302 => u.cur[_v2302] = Math.max(1, u.cur[_v2302] || 0)), D1());
      return;
    case "maps":
      for (let _v2303 = 1; _v2303 <= 17; _v2303++) yo() < xa && u.inv.push(Zt(_v2303));
      break;
    case "mapsR":
      for (let _v2304 = 0; _v2304 < 5; _v2304++) {
        let _v2305 = Zt(16);
        (eo("alch", _v2305), Vo(_v2305) && u.inv.push(_v2305));
      }
      break;
    case "ess":
      Tt.forEach(_v2306 => {
        (q[_v2306].grp === "ess" || q[_v2306].grp === "rune" || q[_v2306].grp === "sock") && (u.cur[_v2306] = (u.cur[_v2306] || 0) + 20);
      });
      break;
    case "clear":
      if (!_v2269()) return;
      for (let _v2307 of n.mons) !_v2307.dead && !_v2307.dummy && _v2307.rar < 3 && di(_v2307, null, {
        weight: "heavy"
      });
      break;
    case "boss":
      {
        if (!_v2269()) return;
        let _v2308 = _v2270(60), _v2309 = nt((gt[n.Z.th.key] || ({})).boss || "boss", _v2308.x, _v2308.y, n.Z.lvl + 2, 3);
        (_v2309.aggro = !0, n.mons.push(_v2309), n.Z.boss = _v2309, n.Z.done = !1, P("首领出现"));
        break;
      }
    case "rift":
      {
        if (!_v2269()) return;
        let _v2310 = _v2270(50);
        (n.objs.push({
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
        (n.objs.push(AbyssMake(_v2311.x, _v2311.y)), P("深渊裂缝已生成 · 靠近开启"));
        break;
      }
    case "shrine":
      {
        if (!_v2269()) return;
        let _v2312 = _v2270(40);
        n.objs.push({
          kind: "shrine",
          x: _v2312.x,
          y: _v2312.y,
          type: oe(is).k,
          used: !1
        });
        break;
      }
    case "box":
      {
        if (!_v2269()) return;
        let _v2313 = _v2270(30);
        n.objs.push({
          kind: "box",
          x: _v2313.x,
          y: _v2313.y,
          r: 6,
          open: !1,
          ornate: re("box3") && I() < 0.25
        });
        break;
      }
    case "pack":
      {
        if (!_v2269()) return;
        let _v2314 = n.Z.th.mon, _v2315 = Object.keys(_v2314);
        for (let _v2316 = 0; _v2316 < 8; _v2316++) {
          let _v2317 = _v2270(70), _v2318 = nt(ht(_v2315, _v2319 => _v2314[_v2319]), _v2317.x, _v2317.y, n.Z.lvl, _v2316 < 2 ? 2 : 1);
          (_v2318.aggro = !0, n.mons.push(_v2318));
        }
        break;
      }
    case "rain":
      if (!_v2269()) return;
      for (let _v2320 = 0; _v2320 < 40; _v2320++) ue(n.pl.x, n.pl.y, {
        kind: "cur",
        cur: yc()
      });
      break;
    case "ape":
      {
        if (!_v2269()) return;
        let _v2321 = _v2270(90), _v2322 = Wf(_v2321.x, _v2321.y, n.Z.lvl + 1);
        _v2322.aggro = !0;
        break;
      }
    case "pet":
      (u.pets = [...new Set([...u.pets || [], "dragon"])], u.pet = "dragon", u.showPet = !0, P("千烬游龙 跟上了你"));
      break;
    case "souls":
      for (let _v2323 of b0) if (Ca() < Dt) {
        let _v2324 = Wf(_v2323, Math.max(60, u.level));
        for (; _v2324.rarity < 2; ) {
          (_v2324.rarity = 2, _v2324.mods = []);
          for (let _v2325 = 0; _v2325 < 4; _v2325++) wt(_v2324);
          na(_v2324);
        }
        u.inv.push(_v2324);
      }
      P("已发放全部兽魂");
      break;
    case "omens":
      for (let _v2326 of Tt) q[_v2326].grp === "omen" && (u.cur[_v2326] = (u.cur[_v2326] || 0) + 5);
      (P("已发放全部预兆 ×5"), Gs());
      break;
    case "divine":
      if (!_v2269()) return;
      ue(n.pl.x, n.pl.y, {
        kind: "cur",
        cur: "divine"
      });
      break;
  }
  (be(), n.pl && (n.pl.hp = Math.min(n.pl.hp, n.S.maxLife)));
};
WL = function () {
  (C("#panel").addEventListener("click", _v2327 => {
    let _v2328 = n.held && !_v2327.target.closest('[data-act="cur"]') && _v2327.target.closest("[data-craft]");
    if (_v2328) {
      let _v2329 = Qt(_v2328.dataset.craft);
      if (_v2329) {
        let _v2330 = _v2329.it, _v2331 = _v2330.mods ? nc(_v2330) : null;
        Ya.last = null;
        let _v2332 = eo(n.held, _v2330);
        if (_v2332) {
          P(_v2332);
          return;
        }
        (u.cur[n.held]--, (_v2330.kind === "item" || _v2330.kind === "soul") && lp(n.held, _v2330, Hi(n.held, _v2330, _v2331)), _v2330.kind === "map" && (_v2330.invest = (_v2330.invest || 0) + q[n.held].v), $("craft"), (n.held === "divine" || n.held === "exalt") && $(n.held === "divine" ? "chaos" : "exalt", 0.6), (_v2329.loc === "eq" || _v2329.loc === "skill" || _v2329.loc === "gems" || _v2329.loc === "minner" || _v2329.loc === "beast") && be());
        let _v2333 = n.held;
        ((!_v2327.shiftKey || !u.cur[_v2333]) && Ts(null), Gs());
        let _v2334 = document.querySelector(`[data-craft="${_v2330.uid}"]`);
        (_v2334 && _v2334.classList.add("pop"), n.tipKey = null, Xp(Sd("it:" + _v2330.uid), _v2327.clientX, _v2327.clientY), n.held && Ts(n.held));
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
          if (!_v2337 || !q[_v2337]) return;
          (OmToggle(_v2337), Gs());
          return;
        }
      case "cur":
        {
          let _v2338 = _v2335.dataset.k;
          if (!u.cur[_v2338]) {
            P("没有" + q[_v2338].n);
            return;
          }
          Ts(n.held === _v2338 ? null : _v2338);
          return;
        }
      case "inv":
        {
          let _v2339 = Qt(_v2335.dataset.uid);
          if (!_v2339) return;
          _v2339.it.kind === "map" ? (u.device && u.inv.push(u.device), u.device = _v2339.it, u.inv.splice(u.inv.indexOf(_v2339.it), 1), $("pick")) : _v2339.it.kind === "soul" ? Sv(_v2339.it) : rd(_v2339.it, _v2327.shiftKey);
          break;
        }
      case "beast":
        Mv(+_v2335.dataset.i, Dt);
        break;
      case "mapin":
        {
          let _v2340 = Qt(_v2335.dataset.uid);
          if (!_v2340) return;
          (u.device && u.inv.push(u.device), u.device = _v2340.it, u.inv.splice(u.inv.indexOf(_v2340.it), 1), $("pick"));
          break;
        }
      case "eq":
        {
          let _v2341 = _v2335.dataset.slot;
          if (!_v2341 || !u.equip[_v2341]) return;
          if (Ca() >= Dt) {
            P("背包已满");
            return;
          }
          (u.inv.push(u.equip[_v2341]), u.equip[_v2341] = null, be());
          break;
        }
      case "dev":
        {
          if (!u.device) return;
          (u.inv.push(u.device), u.device = null);
          break;
        }
      case "open":
        n.endlessMode = !1;
        n.endlessLiteMode = !1;
        Kw();
        return;
      case "endless-lite":
        {
          n.endlessMode = !0;
          n.endlessLiteMode = !0;
          n.endlessIntensity = 0;
          n.endlessIntensityT = 5;
          n.endlessSpawnT = 0;
          n.endlessSpawnIndex = 0;
          n.endlessBossSpawnT = 0;
          Ot();
          let _v2342 = {
            ...Zt(17),
            tier: 17,
            ilvl: 17,
            name: "低卡无尽试炼",
            rarity: 0,
            mods: [],
            invest: 0
          };
          Xi(_v2342);
          ke("低卡无尽模式开启", "无掉落 · 无怪物尸体与击杀特效 · 不触发击杀效果 · 每 5 秒强度 +1 · 按 T 返回藏身处结束");
          return;
        }
      case "endless":
        {
          n.endlessMode = !0;
          n.endlessLiteMode = !1;
          n.endlessIntensity = 0;
          n.endlessIntensityT = 5;
          n.endlessSpawnT = 0;
          n.endlessSpawnIndex = 0;
          n.endlessBossSpawnT = 0;
          Ot();
          let _v2343 = {
            ...Zt(17),
            tier: 17,
            ilvl: 17,
            name: "无尽试炼",
            rarity: 0,
            mods: [],
            invest: 0
          };
          Xi(_v2343);
          ke("无尽模式开启", "怪物受击击退为 0 · 全地图怪物、传奇怪物、稀有怪与首领持续刷新 · 每 5 秒强度 +1 · 按 T 返回藏身处结束");
          return;
        }
      case "free":
        u.device = Zt(1);
        break;
      case "sellN":
      case "sellM":
        {
          let _v2344 = _v2336 === "sellN" ? 0 : 1, _v2345 = u.inv.filter(_v2346 => _v2346.kind === "item" && _v2346.rarity === _v2344);
          if (!_v2345.length) {
            P("没有可出售的物品");
            return;
          }
          _v2345.forEach(_v2347 => er(_v2347));
          break;
        }
      case "sellLowMaps":
        {
          let _v2348 = Ko();
          if (!_v2348.length) {
            P("没有可出售的低阶地图 (只卖普通/魔法地图)");
            return;
          }
          _v2348.forEach(_v2349 => er(_v2349));
          break;
        }
      case "mapUp":
        {
          let _v2350 = uv(+_v2335.dataset.t);
          if (_v2350) {
            P(_v2350);
            return;
          }
          (P("换到 1 张 T" + (+_v2335.dataset.t + 1) + " 地图"), $("craft"));
          break;
        }
      case "filter":
        Wp();
        return;
      case "reset":
        Rd(!1);
        return;
      case "gslot":
        (n.selSlot = +_v2335.dataset.i, n.selMeta = null);
        break;
      case "msel":
        n.selMeta = {
          i: +_v2335.dataset.i,
          j: +_v2335.dataset.j
        };
        break;
      case "mout":
        {
          let _v2351 = u.buffs[+_v2335.dataset.i], _v2352 = +_v2335.dataset.j;
          _v2351 && _v2351.inner[_v2352] && (u.gems.push(_v2351.inner[_v2352]), _v2351.inner[_v2352] = null, be());
          break;
        }
      case "munsock":
        {
          let _v2353 = u.buffs[+_v2335.dataset.i], _v2354 = _v2353 && _v2353.inner[+_v2335.dataset.m];
          if (!_v2354) return;
          let _v2355 = _v2354.sup.splice(+_v2335.dataset.j, 1)[0];
          (_v2355 && u.gems.push(_v2355), be());
          break;
        }
      case "pin":
        D1();
        return;
      case "favor":
        u.favor = _v2335.dataset.t || null;
        break;
      case "buildApply":
        {
          let _v2356 = Ls.find(_v2357 => _v2357.n === _v2335.dataset.n && _v2357.cls === u.cls);
          _v2356 && gp(_v2356);
          break;
        }
      case "gunslot":
        {
          let _v2358 = +_v2335.dataset.i, _v2359 = u.skills[_v2358];
          if (!_v2359) return;
          (u.skills[_v2358] = null, u.gems.push(_v2359), be());
          break;
        }
      case "gact":
        {
          let _v2360 = Qt(_v2335.dataset.uid);
          if (!_v2360) return;
          if (n.selMeta) {
            let _v2361 = u.buffs[n.selMeta.i];
            if (!_v2361 || _v2361.kind !== "meta") return;
            if (!il(_v2360.it.gid)) {
              P("元技能只能插入定点或投射类法术");
              return;
            }
            (u.gems.splice(u.gems.indexOf(_v2360.it), 1), _v2361.inner[n.selMeta.j] && u.gems.push(_v2361.inner[n.selMeta.j]), _v2361.inner[n.selMeta.j] = _v2360.it, be(), $("craft"));
            break;
          }
          let _v2362 = u.skills[n.selSlot];
          (u.gems.splice(u.gems.indexOf(_v2360.it), 1), u.skills[n.selSlot] = _v2360.it, _v2362 && (_v2362.sup.forEach(_v2363 => {
            _v2360.it.sup.length < _v2360.it.sock ? _v2360.it.sup.push(_v2363) : u.gems.push(_v2363);
          }), _v2362.sup = [], u.gems.push(_v2362)), be(), $("pick"));
          break;
        }
      case "gsup":
        {
          let _v2364 = Qt(_v2335.dataset.uid), _v2365 = md();
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
          (Dn(ne[_v2364.it.gid], se[_v2365.gid]) || P("标签不匹配: 该辅助不会生效"), u.gems.splice(u.gems.indexOf(_v2364.it), 1), _v2365.sup.push(_v2364.it), be(), $("craft"));
          break;
        }
      case "unsock":
        {
          let _v2367 = u.skills[+_v2335.dataset.i].sup.splice(+_v2335.dataset.j, 1)[0];
          (_v2367 && u.gems.push(_v2367), be());
          break;
        }
      case "treeReset":
        (u.tree = [Er(u.cls)], be());
        break;
      case "tzoom":
        {
          let _v2368 = +_v2335.dataset.z;
          (Q.ox = Q.size / 2 + (Q.ox - Q.size / 2) * _v2368, Q.oy = Q.size / 2 + (Q.oy - Q.size / 2) * _v2368, Q.s = $e(Q.s * _v2368, 0.25, 3), Ea());
          return;
        }
      case "tfit":
        (q1(!0), Ea());
        return;
      case "ascPick":
        {
          (u.asc = _v2335.dataset.a, u.ascNodes = [], $("level"), ke("升华 · " + Ce[u.asc].n, Ce[u.asc].d), be());
          break;
        }
      case "ascNode":
        {
          let _v2369 = eh[_v2335.dataset.k];
          if (!_v2369 || u.ascNodes.includes(_v2369.k)) return;
          let _v2370 = Ce[u.asc];
          if (!(_v2369.tier === 0 || _v2370.nodes.some(_v2371 => _v2371.tier === _v2369.tier - 1 && u.ascNodes.includes(_v2371.k)))) {
            P("需先点亮上一层的任意节点");
            return;
          }
          if (u.ascPts - u.ascNodes.length * 2 < 2) {
            P("升华点不足 · 完成更高阶地图的首领试炼");
            return;
          }
          (u.ascNodes.push(_v2369.k), $("unique"), be());
          break;
        }
      case "ascReset":
        (u.ascNodes = [], be());
        break;
      case "bact":
        {
          let _v2372 = Qt(_v2335.dataset.uid);
          if (!_v2372) return;
          if (u.buffs.some(_v2373 => _v2373 && _v2373.gid === _v2372.it.gid)) {
            P("同名增益只能放一个");
            return;
          }
          let _v2374 = u.buffs.findIndex(_v2375 => !_v2375);
          if (_v2374 < 0) {
            P("精魂槽已满 · 点击已装备的卸下");
            return;
          }
          (u.gems.splice(u.gems.indexOf(_v2372.it), 1), u.buffs[_v2374] = _v2372.it, _v2372.it.kind === "meta" && (n.selMeta = {
            i: _v2374,
            j: 0
          }), be(), n.S.buffs.has(_v2372.it.gid) || P("精魂不足: " + (He[_v2372.it.gid] || Ze[_v2372.it.gid]).n + " 未生效"), $("craft"));
          break;
        }
      case "bunslot":
        {
          let _v2376 = +_v2335.dataset.i, _v2377 = u.buffs[_v2376];
          if (!_v2377) return;
          (u.buffs[_v2376] = null, _v2377.kind === "meta" && _v2377.inner && (_v2377.inner.forEach(_v2378 => _v2378 && u.gems.push(_v2378)), _v2377.inner = [null, null]), u.gems.push(_v2377), n.selMeta && n.selMeta.i === _v2376 && (n.selMeta = null), be());
          break;
        }
      case "atlasNode":
        {
          let _v2379 = _v2335.dataset.k;
          if (u.atlas.includes(_v2379)) {
            let _v2380 = Ma[_v2379];
            if (_v2380 && _v2380.b) {
              let _v2381 = Ks.find(_v2382 => _v2382.key === _v2380.b);
              if (_v2381 && _v2381.nodes && _v2381.nodes.slice(_v2380.i + 1).some(_v2383 => u.atlas.includes(_v2383.k))) {
                P("需先退还更深层的节点");
                return;
              }
            }
            if (false) {
              P("需先退还更深层的节点");
              return;
            }
            (u.atlas = u.atlas.filter(_v2384 => _v2384 !== _v2379), $("craft"));
            break;
          }
          if (!r9(_v2379)) {
            P(u.atlasPts - u.atlas.length < 1 ? "图谱点不足 · 击败地图首领获得" : "需先点亮上一层");
            return;
          }
          (u.atlas.push(_v2379), $("unique"));
          break;
        }
      case "atlasReset":
        (u.atlas = [], $("craft"));
        break;
      case "dbg":
        ZT(_v2335.dataset.k);
        break;
      case "dbgView":
        (n.dbgView = _v2335.dataset.v, C("#pbody").scrollTop = 0);
        break;
      case "dcls":
        M1(_v2335.dataset.dcls);
        return;
      case "lab":
        sx(_v2335.dataset.t);
        return;
      case "dbgReset":
        l1();
        return;
      case "toTitle":
        Rd(!1);
        return;
      case "fsel":
        (n.forgeSel = +_v2335.dataset.uid, Re.delArm = 0);
        break;
      case "fg":
        Jk(_v2335);
        break;
      case "mw":
        if (!tx(_v2335)) return;
        break;
    }
    (Gs(), n.tipKey = null);
  }), C("#panel").addEventListener("contextmenu", _v2385 => {
    if ((_v2385.preventDefault(), n.touchMode && n.lastPtr !== "mouse")) {
      P('触屏上长按不会出售 · 请在商人处的"出售"页卖东西');
      return;
    }
    if (n.held) {
      Ts(null);
      return;
    }
    let _v2386 = _v2385.target.closest('[data-act="gact"],[data-act="gsup"],[data-act="bact"]');
    if (_v2386) {
      let _v2387 = Qt(_v2386.dataset.uid);
      if (_v2387 && _v2387.loc === "gems") {
        let _v2388 = $n(_v2387.it);
        (Di(_v2387.it), P("出售获得 " + Object.entries(_v2388).map(([_v2389, _v2390]) => q[_v2389].n + (_v2390 > 1 ? "×" + _v2390 : "")).join(" ") + " · 可在商人处回购"), Ms(), Gs());
      }
      return;
    }
    let _v2391 = _v2385.target.closest('[data-act="inv"],[data-act="mapin"]');
    if (!_v2391) return;
    let _v2392 = Qt(_v2391.dataset.uid);
    _v2392 && _v2392.loc === "inv" && (er(_v2392.it), Ms(), Gs());
  }), C("#panel").addEventListener("change", _v2393 => {
    if (_v2393.target.dataset.mapIntensity !== undefined) {
      n.mapIntensity = Math.max(1, Math.min(100, Math.round(Number(_v2393.target.value) || 1)));
      return;
    }
    let _v2394 = _v2393.target.dataset.fg;
    if (_v2394) {
      (_v2394.startsWith("mw") ? ax(_v2393.target) : Qk(_v2393.target)) && (Gs(), n.tipKey = null);
      return;
    }
    (_v2393.target.dataset.f && (u.filter[_v2393.target.dataset.f] = _v2393.target.checked), _v2393.target.dataset.pk && (u.petPick = {
      ...u.petPick || ({}),
      [_v2393.target.dataset.pk]: _v2393.target.checked
    }));
  }), C("#panel").addEventListener("input", _v2395 => {
    _v2395.target.id === "tsearch" && (Q.q = _v2395.target.value, Ea());
  }), C("#panel").addEventListener("pointerdown", _v2396 => {
    if (_v2396.target.id === "treecv") {
      Q.drag = {
        x: _v2396.clientX,
        y: _v2396.clientY,
        ox: Q.ox,
        oy: Q.oy,
        moved: !1
      };
      try {
        _v2396.target.setPointerCapture(_v2396.pointerId);
      } catch {}
    }
  }), C("#panel").addEventListener("pointerup", _v2397 => {
    if (_v2397.target.id !== "treecv" || !Q.drag) return;
    let _v2398 = Q.drag;
    (Q.drag = null, _v2398.moved || Lc(xm(_v2397)));
  }), C("#panel").addEventListener("wheel", _v2399 => {
    if (_v2399.target.id !== "treecv") return;
    _v2399.preventDefault();
    let _v2400 = _v2399.target.getBoundingClientRect(), _v2401 = (_v2399.clientX - _v2400.left) / ie.uiZ, _v2402 = (_v2399.clientY - _v2400.top) / ie.uiZ, _v2403 = _v2399.deltaY < 0 ? 1.15 : 1 / 1.15, _v2404 = $e(Q.s * _v2403, 0.25, 3), _v2405 = _v2404 / Q.s;
    (Q.ox = _v2401 - (_v2401 - Q.ox) * _v2405, Q.oy = _v2402 - (_v2402 - Q.oy) * _v2405, Q.s = _v2404, Ea());
  }, {
    passive: !1
  }), C("#pclose").onclick = Ot, C("#btnPortal").onclick = B1, C("#btnMenu").onclick = () => {
    n.menu ? fl() : Ss();
  });
  let _v2406 = () => {
    C("#btnGfx").textContent = "画质 " + (Vt.q === "high" ? "高" : "低");
  };
  (_v2406(), ut.onAuto = () => {
    try { ut.on = !0; ut.auto = !0; } catch (e) {}
  }, Vt.onAuto = () => {
    try { Vt.q = "high"; Vt.auto = !0; ik("high"); _v2406(); } catch (e) {}
  }, C("#btnGfx").onclick = () => {
    (ik(Vt.q === "high" ? "low" : "high"), Vt.auto = !0, _v2406(), P(Vt.q === "high" ? "高画质: 泛光与调色已开启" : "低画质: 已关闭泛光"));
  }, C("#btnMute").onclick = () => {
    (n.muted = !n.muted, C("#btnMute").textContent = n.muted ? "静音中" : "声音", __syncUploadedSfxVolume());
  }, C("#hrow").addEventListener("click", _v2407 => {
    let _v2408 = _v2407.target.closest("[data-hud]");
    _v2408 && (n.selSlot = +_v2408.dataset.hud, ja("gem"));
  }), document.addEventListener("pointermove", _v2409 => {
    if (n.held) {
      let _v2410 = C("#held");
      (_v2410.style.left = _v2409.clientX + "px", _v2410.style.top = _v2409.clientY + "px");
    }
    if (_v2409.target.id === "treecv") {
      if (Q.drag) {
        let _v2411 = (_v2409.clientX - Q.drag.x) / ie.uiZ, _v2412 = (_v2409.clientY - Q.drag.y) / ie.uiZ;
        if ((Math.abs(_v2411) + Math.abs(_v2412) > 4 && (Q.drag.moved = !0), Q.drag.moved)) {
          (Q.ox = Q.drag.ox + _v2411, Q.oy = Q.drag.oy + _v2412, Ea(), Ms());
          return;
        }
      }
      let _v2413 = xm(_v2409);
      (_v2413 !== n.treeHover && (n.treeHover = _v2413, n.treePath = _v2413 >= 0 && !u.tree.includes(_v2413) ? Bs(_v2413) || [] : [], Ea()), _v2413 >= 0 ? Xp(Gp(xe.nodes[_v2413]), _v2409.clientX, _v2409.clientY) : Ms());
      return;
    }
    let _v2414 = null; // 物品 tooltip 交给基础 18.0.3，旧移植处理器与基础共用 o.tipKey 会导致 A/B 装备属性串
    if (false) {
      let _v2415 = _v2414.dataset.tt;
      _v2415 !== n.tipKey || !!De.shift !== n.tipShift ? (n.tipKey = _v2415, n.tipShift = !!De.shift, Xp(Sd(_v2415), _v2409.clientX, _v2409.clientY)) : W1(_v2409.clientX, _v2409.clientY);
    } else { /* base handles tooltip hide */ }
  }), ft.addEventListener("pointermove", eu), ft.addEventListener("pointerdown", _v2416 => {
    if ((eu(_v2416), os(), n.state === "play")) {
      if (n.held) {
        Ts(null);
        return;
      }
      if ((H1(), _v2416.button === 0)) {
        for (let _v2417 = n.labelRects.length - 1; _v2417 >= 0; _v2417--) {
          let _v2418 = n.labelRects[_v2417];
          if (Je.sx >= _v2418.x && Je.sx <= _v2418.x + _v2418.w && Je.sy >= _v2418.y && Je.sy <= _v2418.y + _v2418.h) {
            if (Math.hypot(_v2418.l.x - n.pl.x, _v2418.l.y - n.pl.y) > 150) {
              P("距离太远");
              return;
            }
            if (Js(_v2418.l)) {
              let _v2419 = n.loots.indexOf(_v2418.l);
              _v2419 >= 0 && n.loots.splice(_v2419, 1);
            }
            return;
          }
        }
        for (let _v2420 of n.objs) {
          if (Math.hypot(_v2420.x - Je.wx, _v2420.y - Je.wy) < 18) {
            if (_v2420.kind === "device") {
              ja("map");
              return;
            }
            if (_v2420.kind === "vendor" && Math.hypot(_v2420.x - n.pl.x, _v2420.y - n.pl.y) < 60) {
              op();
              return;
            }
            if (_v2420.kind === "stash" && Math.hypot(_v2420.x - n.pl.x, _v2420.y - n.pl.y) < 60) {
              nu();
              return;
            }
            if ((_v2420.kind === "bench" || _v2420.kind === "altar") && Math.hypot(_v2420.x - n.pl.x, _v2420.y - n.pl.y) < 60) {
              cc(_v2420.kind === "altar" ? "altar" : "craft");
              return;
            }
            if (_v2420.kind === "well" && Math.hypot(_v2420.x - n.pl.x, _v2420.y - n.pl.y) < 60) {
              DsWell();
              return;
            }
            if (_v2420.kind === "ritual" && Math.hypot(_v2420.x - n.pl.x, _v2420.y - n.pl.y) < 60) {
              RitualInteract(_v2420);
              return;
            }
            if (_v2420.kind === "simulacrum" && Math.hypot(_v2420.x - n.pl.x, _v2420.y - n.pl.y) < 60) {
              SimulacrumInteract();
              return;
            }
            if (_v2420.kind === "box" && !_v2420.open && Math.hypot(_v2420.x - n.pl.x, _v2420.y - n.pl.y) < 40) {
              ou(_v2420);
              return;
            }
          }
          if ((_v2420.kind === "monument" || _v2420.kind === "dog") && Math.abs(_v2420.x - Je.wx) < 11 && Je.wy < _v2420.y + 5 && Je.wy > _v2420.y - (_v2420.kind === "monument" ? 48 : 20) && Math.hypot(_v2420.x - n.pl.x, _v2420.y - n.pl.y) < 60) {
            _v2420.kind === "monument" ? su() : au();
            return;
          }
        }
        if (_v2416.pointerType === "touch" && n.touchMode) return;
        (Je.l = !0, an(0));
      }
      _v2416.button === 2 && (Je.r = !0, an(1));
      try {
        ft.setPointerCapture(_v2416.pointerId);
      } catch {}
    }
  }), ft.addEventListener("pointerup", _v2421 => {
    (_v2421.button === 0 && (Je.l = !1), _v2421.button === 2 && (Je.r = !1));
  }), ft.addEventListener("pointercancel", () => {
    Je.l = Je.r = !1;
  }), ft.addEventListener("contextmenu", _v2422 => _v2422.preventDefault()), addEventListener("pointerdown", _v2423 => {
    n.lastPtr = _v2423.pointerType || "mouse";
  }, !0), C("#overlay").addEventListener("contextmenu", _v2424 => {
    (_v2424.preventDefault(), !(n.touchMode && n.lastPtr !== "mouse") && Vw(_v2424));
  }), addEventListener("blur", () => {
    for (let _v2425 in De) De[_v2425] = !1;
    Je.l = Je.r = !1;
  }));
  let _v2426 = () => n.state === "play" && n.Z && n.Z.type !== "hideout" && u && !n.pl?.dead;
  (addEventListener("visibilitychange", () => {
    document.visibilityState === "hidden" && Xe();
  }), addEventListener("pagehide", () => Xe()), addEventListener("beforeunload", _v2427 => {
    (Xe(), (_v2426() || ie.leaveAsk && n.state === "play" && u) && (_v2427.preventDefault(), _v2427.returnValue = ""));
  }));
  function _v2428() {
    if (!(Ld.armed || !ie.leaveAsk || n.state !== "play")) try {
      (history.pushState({
        rift: 1
      }, ""), Ld.armed = !0);
    } catch {}
  }
  (addEventListener("pointerdown", _v2428, !0), addEventListener("keydown", _v2428, !0), addEventListener("popstate", () => {
    Ld.armed && (Ld.armed = !1, Ld.caught++, n.state === "play" && P('已拦截浏览器"后退"(鼠标手势) · 可在 Esc 设置里关闭这项保护'));
  }), addEventListener("dragstart", _v2429 => _v2429.preventDefault()), ft.addEventListener("selectstart", _v2430 => _v2430.preventDefault()));
  let _v2431 = () => {
    (os(), removeEventListener("pointerdown", _v2431, !0), removeEventListener("keydown", _v2431, !0));
  };
  (addEventListener("pointerdown", _v2431, !0), addEventListener("keydown", _v2431, !0), N1(), matchMedia("(pointer: coarse)").matches && Hx(), zc("witch"), be(), ps(), NT(), requestAnimationFrame(Gw), setInterval(() => {
    n.state === "play" && n.Z && n.Z.type === "hideout" && Xe();
  }, 2e4));
};
um = function (_v2432, _v2433) {
  let _v2434, _v2435;
  if (_v2432 === "gem") {
    if (!Ut[u.cls].pool.includes(_v2433)) return !1;
    (_v2434 = Xl(), _v2435 = () => u.gems.push(vo(_v2433, 1, 2)));
  } else if (_v2432 === "sup") {
    if (!ne[_v2433]) return !1;
    (_v2434 = ec(_v2433), _v2435 = () => u.gems.push(Ys(_v2433)));
  } else if (_v2432 === "map") {
    let _v2436 = +_v2433;
    if (!(_v2436 >= 1 && _v2436 <= ep())) return !1;
    if (yo() >= xa) return (P("地图袋已满"), !1);
    (_v2434 = tc(_v2436), _v2435 = () => u.inv.push(Zt(_v2436)));
  } else return !1;
  if (OmHas("omen_gamble") && I() < 0.5) {
    (ShopHeatBump(ShopHeatKey(_v2432, _v2433)), _v2435(), $("unique"), P("强运预兆 · 这次购买免费"));
    return !0;
  }
  let _v2434h = ShopHeatPriceMap(ShopHeatKey(_v2432, _v2433), _v2434);
  let _v2437 = bo(_v2434h);
  return _v2437 ? (OmHas("omen_gamble") && OmTake("omen_gamble"), g6(_v2434h), ShopHeatBump(ShopHeatKey(_v2432, _v2433)), _v2435(), $("pick"), !0) : (P("通货不足"), !1);
};
Uo = function () {
  let _v2438 = Qa.tab, _v2439 = [["gem", "技能宝石"], ["sup", "辅助宝石"], ["map", "地图"], ["ex", "通货兑换"], ["sell", "出售"], ["back", "回购"]], _v2440 = ["trans", "alch", "chaos"].map(_v2441 => `<span style="color:${q[_v2441].col}">${q[_v2441].n} <b>${u.cur[_v2441] || 0}</b></span>`).join(""), _v2442 = "";
  if (_v2438 === "gem") _v2442 = '<p class="dim">本职业的主动技能宝石, 1 级 · 2 孔。</p><div class="shopgrid">' + Ut[u.cls].pool.filter(_v2443 => se[_v2443]).map(_v2444 => {
    let _v2445 = Xl(), _v2445h = ShopHeatPriceMap(ShopHeatKey("gem", _v2444), _v2445);
    return `<button class="shopit${bo(_v2445h) ? "" : " no"}" data-buy="gem" data-id="${_v2444}"><b>${se[_v2444].n}</b>${Zr(_v2445h)}${ShopHeatLabel(ShopHeatKey("gem", _v2444))}</button>`;
  }).join("") + "</div>"; else if (_v2438 === "sup") _v2442 = '<p class="dim">金色为机制辅助 (改变技能的行为)。</p><div class="shopgrid">' + Object.keys(ne).sort((_v2446, _v2447) => (ne[_v2447].mech ? 1 : 0) - (ne[_v2446].mech ? 1 : 0)).map(_v2448 => {
    let _v2449 = ec(_v2448), _v2449h = ShopHeatPriceMap(ShopHeatKey("sup", _v2448), _v2449);
    return `<button class="shopit${ne[_v2448].mech ? " mech" : ""}${bo(_v2449h) ? "" : " no"}" data-buy="sup" data-id="${_v2448}" title="${ne[_v2448].d}"><b>${ne[_v2448].n}</b>${Zr(_v2449h)}${ShopHeatLabel(ShopHeatKey("sup", _v2448))}</button>`;
  }).join("") + "</div>"; else if (_v2438 === "map") {
    let _v2450 = ep();
    _v2442 = `<p class="dim">可购买 T1 – T${_v2450} 的地图 (上限为你击败过首领的最高阶级), 主题随机。用来补齐低阶首领的图谱完成度。</p><div class="shopgrid maps">` + Array.from({
      length: _v2450
    }, (_v2451, _v2452) => _v2452 + 1).map(_v2453 => {
      let _v2454 = tc(_v2453), _v2454h = ShopHeatPriceMap(ShopHeatKey("map", _v2453), _v2454);
      return `<button class="shopit${bo(_v2454h) ? "" : " no"}" data-buy="map" data-id="${_v2453}"><b>T${_v2453} 地图</b>${Zr(_v2454h)}${ShopHeatLabel(ShopHeatKey("map", _v2453))}</button>`;
    }).join("") + "</div>";
  } else if (_v2438 === "ex") _v2442 = ExBody(); else if (_v2438 === "sell") {
    let _v2455 = u.inv.filter(_v2456 => _v2456.kind === "item" && _v2456.rarity === 0).length, _v2457 = u.inv.filter(_v2458 => _v2458.kind === "item" && _v2458.rarity === 1).length, _v2459 = Kr(), _v2460 = Ko().length, _v2461 = _v2462 => _v2462.kind === "gem" ? se[_v2462.gid].n + " Lv" + _v2462.lvl : _v2462.kind === "sup" ? ne[_v2462.gid].n : (Ze[_v2462.gid] || He[_v2462.gid] || ({})).n || _v2462.gid, _v2463 = u.gems.map((_v2464, _v2465) => `<button class="shopit${_v2464.kind === "sup" && ne[_v2464.gid].mech ? " mech" : ""}" data-sg="${_v2465}" data-tt="it:${_v2464.uid}"><b>${_v2461(_v2464)}</b>${Zr($n(_v2464))}</button>`).join("");
    _v2442 = `<p class="dim">装备: 也可以在背包里右键单件出售。</p><div class="ovbtns"><button class="btn" data-sell="0">出售全部白装 (${_v2455})</button><button class="btn" data-sell="1">出售全部蓝装 (${_v2457})</button><button class="btn" data-sell="rare">出售全部稀有装备 (${u.inv.filter(function (i) { return i && i.kind === "item" && i.rarity === 2; }).length})</button><button class="btn" data-sell="irrelevant">出售全部无关主手武器 (${u.inv.filter(function (i) { if (!i || i.kind !== "item" || i.rarity >= 3) return false; var b = pe[i.base]; return !!(b && b.slot === "W" && b.wt && !Ut[u.cls].wts.includes(b.wt)); }).length})</button><button class="btn" data-sell="jewel">出售全部珠宝 (${u.inv.filter(function (i) { return i && i.kind === "jewel"; }).length})</button><button class="btn" data-sell="map">出售 T${_v2459} 及以下地图 (${_v2460})</button></div>
		 <p class="dim">未镶嵌的宝石 (点击出售, 卖错了可以在"回购"买回):</p><div class="shopgrid">${_v2463 || '<p class="dim">没有未镶嵌的宝石</p>'}</div>`;
  } else _v2442 = '<p class="dim">本次游戏中卖掉的最近 16 件, 按卖出价买回。</p><div class="shopgrid">' + (Zo.map((_v2466, _v2467) => `<button class="shopit${bo(_v2466.got) ? "" : " no"}" data-bb="${_v2467}"><b>${_v2466.it.kind === "gem" ? se[_v2466.it.gid].n : _v2466.it.kind === "sup" ? ne[_v2466.it.gid].n : _v2466.it.name || (Ze[_v2466.it.gid] || He[_v2466.it.gid] || ({})).n}</b>${Zr(_v2466.got) || '<span class="pc">免费</span>'}</button>`).join("") || '<p class="dim">还没有卖过东西</p>') + "</div>";
  (Ve(`<div class="ovbox shop"><h2>商人</h2><div class="wallet">${_v2440}</div>
		 <div class="shoptabs">${_v2439.map(([_v2468, _v2469]) => `<button class="${_v2468 === _v2438 ? "on" : ""}" data-stab="${_v2468}">${_v2469}</button>`).join("")}</div>
		 <div class="shopbody">${_v2442}</div>
		 <div class="ovbtns"><button class="btn" id="shopClose">离开 <kbd>Esc</kbd></button></div></div>`), C("#shopClose").onclick = gm, document.querySelectorAll("#overlay [data-stab]").forEach(_v2470 => _v2470.onclick = () => {
    (Qa.tab = _v2470.dataset.stab, Uo());
  }), document.querySelectorAll("#overlay [data-buy]").forEach(_v2471 => _v2471.onclick = () => {
    (um(_v2471.dataset.buy, _v2471.dataset.id) && P("已购买 " + _v2471.querySelector("b").textContent), Uo());
  }), document.querySelectorAll("#overlay [data-sg]").forEach(_v2472 => _v2472.onclick = () => {
    let _v2473 = u.gems[+_v2472.dataset.sg];
    (_v2473 && Di(_v2473) && P("已出售 " + _v2472.querySelector("b").textContent), Uo());
  }), document.querySelectorAll("#overlay [data-bb]").forEach(_v2474 => _v2474.onclick = () => {
    (pm(+_v2474.dataset.bb) && P("已买回"), Uo());
  }), document.querySelectorAll("#overlay [data-sell]").forEach(_v2475 => _v2475.onclick = () => {
    let _v2476 = _v2475.dataset.sell, _v2477 = _v2476 === "map" ? Ko() : _v2476 === "jewel" ? u.inv.filter(_v2478 => _v2478 && _v2478.kind === "jewel") : _v2476 === "irrelevant" ? u.inv.filter(_v2478 => { if (!_v2478 || _v2478.kind !== "item" || _v2478.rarity >= 3) return false; var __wb = pe[_v2478.base]; return !!(__wb && __wb.slot === "W" && __wb.wt && !Ut[u.cls].wts.includes(__wb.wt)); }) : u.inv.filter(_v2478 => _v2478.kind === "item" && _v2478.rarity === (_v2476 === "rare" ? 2 : +_v2476));
    (_v2477.length ? _v2477.forEach(_v2479 => er(_v2479)) : P("没有可出售的物品"), Uo());
  }), document.querySelectorAll("#overlay [data-exfrom]").forEach(_v2480 => _v2480.onclick = () => {
    (Qa.ex.from = _v2480.dataset.exfrom, Qa.ex.from === Qa.ex.to && (Qa.ex.to = ExAll().find(_v2481 => _v2481 !== Qa.ex.from) || Qa.ex.from), ExSelectionRefresh());
  }), document.querySelectorAll("#overlay [data-exto]").forEach(_v2482 => _v2482.onclick = () => {
    (Qa.ex.to = _v2482.dataset.exto, Qa.ex.to === Qa.ex.from && (Qa.ex.to = ExAll().find(_v2483 => _v2483 !== Qa.ex.from) || Qa.ex.to), ExSelectionRefresh());
  }), document.querySelectorAll("#overlay [data-examt]").forEach(_v2484 => _v2484.onclick = () => {
    let _v2485 = _v2484.dataset.examt;
    (Qa.ex.amt = _v2485 === "max" ? u.cur[Qa.ex.from] || 0 : Math.max(1, (Qa.ex.amt | 0) + +_v2485), C("#exAmt").value = Qa.ex.amt, ExPrev());
  }), C("#exAmt") && (C("#exAmt").oninput = _v2486 => {
    (Qa.ex.amt = Math.max(0, Math.floor(+_v2486.target.value || 0)), ExPrev());
  }, C("#exAmt").onkeydown = _v2487 => _v2487.stopPropagation()), document.querySelectorAll("#overlay [data-exwant]").forEach(_v2488 => _v2488.onclick = () => ExWantApply()), C("#exWant") && (C("#exWant").onkeydown = _v2489 => {
    _v2489.stopPropagation();
    if (_v2489.key === "Enter") ExWantApply();
  }), C("#exGo") && (C("#exGo").onclick = () => {
    if (!ExDo()) return;
    // 只刷新数量/预览，不重建整个兑换面板，避免滚动位置和按钮堆叠被重置
    try {
      document.querySelectorAll("#overlay [data-exfrom], #overlay [data-exto]").forEach(function (b) {
        var id = b.getAttribute("data-exfrom") || b.getAttribute("data-exto");
        var n = b.querySelector("b");
        if (n) n.textContent = u.cur[id] || 0;
      });
      ExPrev();
    } catch (e) {}
  }), _v2438 === "ex" && ExPrev());
};
window.__portVb = function () {
  if ((d.setTransform(1, 0, 0, 1, 0, 0), d.globalCompositeOperation = "source-over", d.globalAlpha = 1, d.fillStyle = "#000", d.fillRect(0, 0, ft.width, ft.height), !n.Z || !n.pl)) return;
  let _v2488 = 1 + n.zoomP, _v2489 = n.trauma * n.trauma * ie.shake, _v2490 = (I() * 2 - 1) * _v2489 * 7 + pr.x * ie.shake, _v2491 = (I() * 2 - 1) * _v2489 * 7 + pr.y * ie.shake, _v2492 = lo / _v2488, _v2493 = co / _v2488, _v2494 = es.x + lo / 2 + _v2490, _v2495 = es.y + co / 2 + _v2491, _v2496 = Fu * _v2488;
  (St.l = _v2494 - _v2492 / 2, St.t = _v2495 - _v2493 / 2, St.w = _v2492, St.h = _v2493, St.s = _v2496);
  let _v2497 = _v2496 * gi, _v2498 = Math.round(St.l * _v2497) / _v2497, _v2499 = Math.round(St.t * _v2497) / _v2497, _v2500 = () => d.setTransform(_v2497, 0, 0, _v2497, -_v2498 * _v2497, -_v2499 * _v2497), _v2501 = ut.on && ed();
  (_v2500(), d.imageSmoothingEnabled = !1);
  let _v2502 = Math.max(0, Math.floor(_v2498)), _v2503 = Math.max(0, Math.floor(_v2499)), _v2504 = Math.min(n.Z.img.width - _v2502, Math.ceil(_v2492) + 2), _v2505 = Math.min(n.Z.img.height - _v2503, Math.ceil(_v2493) + 2);
  _v2504 > 0 && _v2505 > 0 && d.drawImage(n.Z.img, _v2502, _v2503, _v2504, _v2505, _v2502, _v2503, _v2504, _v2505);
  let _v2506 = (_v2507, _v2508, _v2509) => _v2507 > _v2498 - _v2509 && _v2507 < _v2498 + _v2492 + _v2509 && _v2508 > _v2499 - _v2509 && _v2508 < _v2499 + _v2493 + _v2509;
  for (let _v2510 of n.decals) {
    if (!_v2506(_v2510.x, _v2510.y, 20)) continue;
    let _v2511 = _v2510.t > _v2510.max * 0.7 ? 1 - (_v2510.t - _v2510.max * 0.7) / (_v2510.max * 0.3) : 1;
    (d.globalAlpha = _v2511 * 0.85, d.fillStyle = s9[_v2510.kind] || "#4a0c10", _v2510.kind === "frost" && (d.globalAlpha = _v2511 * 0.5));
    for (let [_v2512, _v2513, _v2514] of _v2510.pts) d.fillRect(Math.round(_v2510.x + _v2512), Math.round(_v2510.y + _v2513), _v2514, _v2514);
  }
  d.globalAlpha = 1;
  for (let _v2515 of n.grounds) _v2506(_v2515.x, _v2515.y, 20) && (d.globalAlpha = Math.min(1, _v2515.t) * 0.5, d.fillStyle = "#ff5a1a", d.fillRect(_v2515.x - _v2515.r * 0.6, _v2515.y - 1, _v2515.r * 1.2, 2), d.fillRect(_v2515.x - _v2515.r * 0.3, _v2515.y - 2, _v2515.r * 0.6, 4));
  (d.globalAlpha = 1, DA(_v2506), fk(_v2506), Ev(d));
  for (let _v2516 of n.fx) if (_v2516.k === "tele") {
    let _v2517 = _v2516.t / _v2516.max;
    (d.globalAlpha = 0.55, d.strokeStyle = _v2516.col, d.lineWidth = 1, d.beginPath(), d.ellipse(_v2516.x, _v2516.y, _v2516.r, _v2516.r * 0.75, 0, 0, 6.283), d.stroke(), d.globalAlpha = 0.24, d.fillStyle = _v2516.col, d.beginPath(), d.ellipse(_v2516.x, _v2516.y, _v2516.r * _v2517, _v2516.r * _v2517 * 0.75, 0, 0, 6.283), d.fill());
  } else if (_v2516.k === "line") {
    let _v2518 = _v2516.t / _v2516.max;
    (d.globalAlpha = 0.25 + _v2518 * 0.4, d.strokeStyle = _v2516.col, d.lineWidth = 2 + _v2518 * 3, d.beginPath(), d.moveTo(_v2516.x1, _v2516.y1), d.lineTo(_v2516.x2, _v2516.y2), d.stroke());
  }
  d.globalAlpha = 1;
  let _v2519 = () => {
    for (let _v2520 of n.mons) {
      if (_v2520.dead || _v2520.state !== "wind" || _v2520.t.atk === "ranged" || !_v2506(_v2520.x, _v2520.y, 30)) continue;
      let _v2521 = 1 - _v2520.st / 0.4;
      (d.globalAlpha = 0.18 + 0.25 * $e(_v2521, 0, 1), d.fillStyle = "#ff3a2a", d.beginPath(), d.moveTo(_v2520.x, _v2520.y), d.arc(_v2520.x, _v2520.y, _v2520.r + _v2520.t.range + 5, _v2520.wa - 0.8, _v2520.wa + 0.8), d.closePath(), d.fill(), d.globalAlpha = 1);
    }
  };
  _v2501 || _v2519();
  for (let _v2522 of n.objs) {
    if (_v2522.kind === "rift" && _v2522.st !== "done" && _v2506(_v2522.x, _v2522.y, 200)) {
      let _v2523 = _v2522.st === "open" ? _v2522.R : 10 + Math.sin(n.T * 3) * 1.5;
      (d.globalAlpha = _v2522.st === "open" ? 0.18 : 0.5, d.fillStyle = "#4a1a80", d.beginPath(), d.ellipse(_v2522.x, _v2522.y, _v2523, _v2523 * 0.8, 0, 0, 6.283), d.fill(), d.globalAlpha = 0.8, d.strokeStyle = "#b080ff", d.lineWidth = 1, d.beginPath(), d.ellipse(_v2522.x, _v2522.y, _v2523, _v2523 * 0.8, 0, 0, 6.283), d.stroke(), d.globalAlpha = 1);
    }
    if (_v2522.kind === "abyss" && _v2506(_v2522.x, _v2522.y, 400)) {
      let _v2524 = _v2522.st === "sealed" || _v2522.st === "done", _v2525 = _v2522.st === "pit" ? 1 + Math.sin(n.T * 6) * 0.08 : 1;
      (_v2524 || (d.globalCompositeOperation = "lighter", d.fillStyle = "rgba(40,180,90,0.13)", d.globalAlpha = 1, d.beginPath(), d.ellipse(_v2522.x, _v2522.y, _v2522.r * 1.5 * _v2525, _v2522.r * 1.05 * _v2525, 0, 0, 6.283), d.fill(), d.globalCompositeOperation = "source-over"), d.fillStyle = _v2524 ? "#0b1410" : "#06110c", d.globalAlpha = _v2524 ? 0.5 : 0.8, d.beginPath(), d.ellipse(_v2522.x, _v2522.y, _v2522.r, _v2522.r * 0.7, 0, 0, 6.283), d.fill(), d.globalAlpha = _v2524 ? 0.22 : 0.75, d.strokeStyle = "#2ee6a8", d.lineWidth = 1.3, d.beginPath(), d.ellipse(_v2522.x, _v2522.y, _v2522.r, _v2522.r * 0.7, 0, 0, 6.283), d.stroke());
      for (let _v2526 of _v2522.fissures) {
        if (_v2526.closed) continue;
        let _v2527 = 1 + Math.sin(n.T * 4 + _v2526.x) * 0.2;
        (d.globalCompositeOperation = "lighter", d.globalAlpha = 0.75 * _v2527, d.strokeStyle = "#9dffb4", d.lineWidth = 1.4, d.beginPath(), d.moveTo(_v2526.x - 18, _v2526.y + 3), d.lineTo(_v2526.x - 7, _v2526.y - 3), d.lineTo(_v2526.x + 3, _v2526.y + 4), d.lineTo(_v2526.x + 16, _v2526.y - 2), d.stroke(), d.globalAlpha = 0.16, d.strokeStyle = "#1e7a3c", d.lineWidth = 4.5, d.stroke(), d.globalCompositeOperation = "source-over", d.globalAlpha = 1);
      }
      // 修复：没有未关闭裂缝时 alpha 会停在 0.75/0.22，导致附近掉落文字和伤害数字变淡
      d.globalAlpha = 1;
      d.globalCompositeOperation = "source-over";
    }
    _v2522.kind === "device" ? UA(_v2522) : _v2522.kind === "vendor" ? hv(d, _v2522) : _v2522.kind === "stash" ? F3(d, _v2522) : _v2522.kind === "bench" ? _v(d, _v2522) : _v2522.kind === "altar" ? Wv(d, _v2522) : _v2522.kind === "well" ? DlWell(d, _v2522) : _v2522.kind === "monument" ? u3(d, _v2522) : _v2522.kind === "dog" ? p3(d, _v2522) : _v2522.kind === "mirror" && _v2522.st === "idle" ? DlMirror(d, _v2522) : _v2522.kind === "delshard" ? DlShardDraw(d, _v2522) : _v2522.kind === "simulacrum" ? DlSim(d, _v2522) : _v2522.kind === "b-simportal" ? drawSimPortal(_v2522) : _v2522.kind === "ritual" && DlRitual(d, _v2522);
  }
  let _v2528 = () => {
    let _v2529 = yr();
    for (let _v2530 of n.loots) {
      if (!_v2506(_v2530.x, _v2530.y, 30) || _v2530.hid && !_v2529) continue;
      if ((_v2530.hid && (d.globalAlpha = 0.5), _v2530.beam && _v2530.landed && !_v2530.hid)) {
        let _v2531 = 0.35 + Math.sin(n.T * 4 + _v2530.x) * 0.12;
        d.globalCompositeOperation = "lighter";
        let _v2532 = d.createLinearGradient(0, _v2530.y - 150, 0, _v2530.y);
        (_v2532.addColorStop(0, "rgba(0,0,0,0)"), _v2532.addColorStop(1, _v2530.beam), d.globalAlpha = _v2531 * (_v2530.big ? 1.4 : 1), d.fillStyle = _v2532, d.fillRect(_v2530.x - (_v2530.big ? 3 : 2), _v2530.y - 150, _v2530.big ? 6 : 4, 150), d.globalAlpha = 1, d.globalCompositeOperation = "source-over");
      }
      (d.fillStyle = "rgba(0,0,0,0.4)", d.fillRect(Math.round(_v2530.x - 3), Math.round(_v2530.y), 6, 1));
      let _v2533 = _v2530.kind === "cur" ? Si[_v2530.cur] : _v2530.it.kind === "map" ? Ha.map : _v2530.it.kind === "gem" || _v2530.it.kind === "sup" ? Ha.gem : _v2530.it.kind === "buff" ? Ha.buff : _v2530.it.kind === "meta" ? Ha.meta : _v2530.it.kind === "soul" ? Ha["soul_" + _v2530.it.beast] : Ha[pe[_v2530.it.base].icon];
      (d.drawImage(_v2533, Math.round(_v2530.x - _v2533.width / 2), Math.round(_v2530.y - _v2530.z - _v2533.height)), d.globalAlpha = 1);
    }
  };
  _v2501 || _v2528();
  let _v2534 = [];
  for (let _v2535 of n.mons) !_v2535.dead && _v2506(_v2535.x, _v2535.y, 40) && _v2534.push(_v2535);
  for (let _v2536 of n.objs) (_v2536.kind === "box" || _v2536.kind === "fire") && _v2506(_v2536.x, _v2536.y, 30) && _v2534.push(_v2536);
  for (let _v2537 of n.corpses) _v2506(_v2537.x, _v2537.y, 40) && _v2534.push(_v2537);
  for (let _v2538 of n.minions) _v2506(_v2538.x, _v2538.y, 20) && _v2534.push(_v2538);
  for (let _v2539 of n.comps || []) _v2506(_v2539.x, _v2539.y, 40) && _v2534.push(_v2539);
  for (let _v2540 of n.bells) _v2506(_v2540.x, _v2540.y, 30) && _v2534.push(_v2540);
  for (let _v2541 of n.objs) _v2541.kind === "shrine" && _v2506(_v2541.x, _v2541.y, 30) && _v2534.push(_v2541);
  (_v2534.push(n.pl), ua.e && _v2534.push(ua.e), _v2534.sort((_v2542, _v2543) => _v2542.y - _v2543.y), bi.mode = _v2501 ? 1 : 0);
  for (let _v2544 of _v2534) _v2501 && _v2544.kind === "fire" || (_v2544 === n.pl ? OA() : _v2544.kind === "pet" ? W2(d, _v2544, _v2501) : _v2544.comp ? jv(d, _v2544, _v2501) : n.minions.includes(_v2544) ? qA(_v2544) : n.bells.includes(_v2544) ? WA(_v2544) : _v2544.kind === "shrine" ? GA(_v2544) : _v2544.kind === "box" ? _A(_v2544) : _v2544.kind === "fire" ? h4(_v2544) : _v2544.spr && _v2544.rot != null ? HA(_v2544) : zA(_v2544));
  if (_v2501) {
    for (let _v2545 of n.parts) _v2545.glow || !_v2506(_v2545.x, _v2545.y, 10) || (d.globalAlpha = _v2545.life < _v2545.max * 0.4 ? _v2545.life / (_v2545.max * 0.4) : 1, d.fillStyle = _v2545.col, d.fillRect(Math.round(_v2545.x), Math.round(_v2545.y - _v2545.z), _v2545.s, _v2545.s));
    (d.globalAlpha = 1, kg(_v2506), m4(), ok(d, ft, _v2498, _v2499, _v2492, _v2493, _v2497), _v2500());
    for (let _v2546 of _v2534) _v2546.kind === "fire" && h4(_v2546);
    for (let _v2547 of _v2534) _v2547.comp && wm(d, _v2547);
    (Dh(d), zh(d), Ul() && (d.save(), d.translate(0, -ve.lift)), Wh(d), _h(d), Ul() && d.restore());
    for (let _v2548 of _v2534) _v2548 !== n.pl && !_v2548.comp && !_v2548.kind && !(_v2548.spr && _v2548.rot != null) && !n.minions.includes(_v2548) && !n.bells.includes(_v2548) && g4(_v2548);
    (_v2519(), _v2528());
  }
  bi.mode = 0;
  for (let _v2549 of n.projs) _v2506(_v2549.x, _v2549.y, 12) && ZA(_v2549);
  dk(_v2506);
  try {
    if (typeof kk === "function") kk(_v2506);
    if (typeof K3 === "function") K3(_v2506);
  } catch (_v2550) {}
  for (let _v2551 of n.sticks) {
    if (!_v2506(_v2551.x, _v2551.y, 20)) continue;
    let _v2552 = Math.cos(_v2551.ang), _v2553 = Math.sin(_v2551.ang), _v2554 = _v2551.x, _v2555 = _v2551.y - 8;
    (d.strokeStyle = "#c8a040", d.lineWidth = 1.2, d.beginPath(), d.moveTo(_v2554 - _v2552 * 10, _v2555 - _v2553 * 10 - 3), d.lineTo(_v2554, _v2555), d.stroke());
    let _v2556 = _v2551.t < 0.5 && Math.floor(n.T * 16) % 2;
    (d.fillStyle = _v2556 ? "#ffffff" : "#ff6a1a", d.fillRect(Math.round(_v2554 - 1.5), Math.round(_v2555 - 1.5), 3, 3));
  }
  for (let _v2557 of n.eprojs) _v2506(_v2557.x, _v2557.y, 10) && (d.fillStyle = _v2557.col, d.fillRect(Math.round(_v2557.x - 1.5), Math.round(_v2557.y - 7.5), 3, 3), d.fillStyle = "#fff", d.fillRect(Math.round(_v2557.x - 0.5), Math.round(_v2557.y - 6.5), 1, 1));
  let _v2558 = Qe();
  for (let _v2559 of n.parts) {
    if (!_v2506(_v2559.x, _v2559.y, 10) || _v2501 && !_v2559.glow) continue;
    let _v2560 = _v2559.life < _v2559.max * 0.4 ? _v2559.life / (_v2559.max * 0.4) : 1;
    (d.globalAlpha = _v2559.glow ? _v2560 * _v2558 : _v2560, _v2559.glow && (d.globalCompositeOperation = "lighter"), d.fillStyle = _v2559.col, d.fillRect(Math.round(_v2559.x), Math.round(_v2559.y - _v2559.z), _v2559.s, _v2559.s), _v2559.glow && (d.globalCompositeOperation = "source-over"));
  }
  if ((d.globalAlpha = 1, _v2501 || kg(_v2506), Os(Qe(), VA), _v2501 || (m4(), JA(_v2498, _v2499, _v2492, _v2493)), _v2500(), d.globalCompositeOperation = "lighter", !_v2501)) for (let _v2561 of n.LIGHTS) {
    if (!_v2561.c || !_v2506(_v2561.x, _v2561.y, _v2561.r)) continue;
    let _v2562 = d.createRadialGradient(_v2561.x, _v2561.y, 0, _v2561.x, _v2561.y, _v2561.r * 0.7);
    (_v2562.addColorStop(0, tt(_v2561.c, 0.2 * (_v2561.i || 1))), _v2562.addColorStop(1, tt(_v2561.c, 0)), d.fillStyle = _v2562, d.fillRect(_v2561.x - _v2561.r, _v2561.y - _v2561.r, _v2561.r * 2, _v2561.r * 2));
  }
  for (let _v2563 of n.objs) _v2563.kind === "ritual" && _v2506(_v2563.x, _v2563.y, 80) && DlRitualBase(d, _v2563);
  Os(Qe(), () => {
    for (let _v2564 of n.fx) if (_v2564.k === "flash") {
      let _v2565 = _v2564.t / _v2564.max, _v2566 = d.createRadialGradient(_v2564.x, _v2564.y, 0, _v2564.x, _v2564.y, _v2564.r);
      (_v2566.addColorStop(0, tt(_v2564.col, 0.55 * (1 - _v2565))), _v2566.addColorStop(1, tt(_v2564.col, 0)), d.fillStyle = _v2566, d.fillRect(_v2564.x - _v2564.r, _v2564.y - _v2564.r, _v2564.r * 2, _v2564.r * 2));
    }
  });
  for (let _v2567 of n.pl.smears) {
    let _v2568 = _v2567.t / _v2567.max;
    if ((d.globalAlpha = (1 - _v2568) * 0.8, d.fillStyle = _v2567.col, _v2567.line)) (d.save(), d.translate(_v2567.x, _v2567.y), d.rotate(_v2567.a0), d.fillRect(2, -1.2 * (1 - _v2568), _v2567.r, 2.4 * (1 - _v2568)), d.restore()); else {
      let _v2569 = _v2567.a0, _v2570 = _v2567.a1;
      if (_v2570 < _v2569) {
        let _v2571 = _v2569;
        (_v2569 = _v2570, _v2570 = _v2571);
      }
      (_v2570 - _v2569 > 6 && (_v2570 = _v2569 + 6.28), d.beginPath(), d.arc(_v2567.x, _v2567.y, _v2567.r, _v2569, _v2570), d.arc(_v2567.x, _v2567.y, _v2567.r * (0.45 + 0.4 * _v2568), _v2570, _v2569, !0), d.closePath(), d.fill());
    }
  }
  (d.globalAlpha = 1, d.globalCompositeOperation = "source-over", Os(Qe(), () => {
    for (let _v2572 of n.fx) KA.has(_v2572.k) && W3(_v2572, $e(_v2572.t / _v2572.max, 0, 1));
  }), z3(), D3(), lk(), _v2500(), n.desat > 0.01 && (d.setTransform(1, 0, 0, 1, 0, 0), d.globalCompositeOperation = "saturation", d.fillStyle = `rgba(128,128,128,${Math.min(1, n.desat)})`, d.fillRect(0, 0, ft.width, ft.height), d.globalCompositeOperation = "source-over", _v2500()), n.del && (d.setTransform(1, 0, 0, 1, 0, 0), (function () {
    let _v2573 = $e(n.del.depth / 250, 0, 1), _v2574 = d.createRadialGradient(ft.width / 2, ft.height / 2, Math.min(ft.width, ft.height) * 0.18, ft.width / 2, ft.height / 2, Math.max(ft.width, ft.height) * 0.72);
    (_v2574.addColorStop(0, "rgba(200,210,235,0)"), _v2574.addColorStop(1, "rgba(150,160,200," + (0.12 + _v2573 * 0.34).toFixed(3) + ")"), d.fillStyle = _v2574, d.fillRect(0, 0, ft.width, ft.height));
    for (let _v2575 = 0; _v2575 < 5; _v2575++) {
      let _v2576 = (n.T * (5 + _v2575 * 1.6) + _v2575 * 137) % (ft.width + 240) - 120, _v2577 = (Math.sin(n.T * 0.35 + _v2575 * 1.7) + 1) / 2 * ft.height;
      (d.globalAlpha = 0.04 + _v2573 * 0.07, d.fillStyle = "#cfd8e8", d.beginPath(), d.ellipse(_v2576, _v2577, 90 + _v2575 * 22, 42 + _v2575 * 12, 0, 0, 6.283), d.fill());
    }
    d.globalAlpha = 1;
  })(), _v2500()));
  for (let _v2578 of n.mons) {
    if (_v2578.dead || _v2578.rar === 3 || !_v2506(_v2578.x, _v2578.y, 30)) continue;
    if ((_v2578.rar >= 1 || _v2578.hp < _v2578.maxhp) && !_v2578.dummy) {
      let _v2579 = _v2578.rar === 2 ? 20 : _v2578.rar === 1 ? 16 : 12, _v2580 = Math.round(_v2578.x - _v2579 / 2), _v2581 = Math.round(_v2578.y - _v2578.h - 5);
      (d.fillStyle = "rgba(0,0,0,0.7)", d.fillRect(_v2580 - 1, _v2581 - 1, _v2579 + 2, _v2578.rar ? 4 : 3), d.fillStyle = _v2578.rar === 2 ? "#e0c040" : _v2578.rar === 1 ? "#7a80ff" : "#c8303a", d.fillRect(_v2580, _v2581, Math.max(0, _v2579 * _v2578.hp / _v2578.maxhp), 1), _v2578.rar && (d.fillStyle = _v2578.stunT > 0 ? "#ffffff" : "#c89a30", d.fillRect(_v2580, _v2581 + 2, _v2579 * (_v2578.stunT > 0 ? 1 : Math.min(1, _v2578.stun)), 1)));
    }
    if ((_v2578.rar === 2 && (d.font = "600 5px " + cn, d.textAlign = "center", d.fillStyle = "#000", d.fillText(_v2578.name, _v2578.x + 0.4, _v2578.y - _v2578.h - 6.6), d.fillStyle = "#ecd85a", d.fillText(_v2578.name, _v2578.x, _v2578.y - _v2578.h - 7)), _v2578.stunT > 0)) for (let _v2582 = 0; _v2582 < 3; _v2582++) {
      let _v2583 = n.T * 6 + _v2582 * 2.09;
      (d.fillStyle = "#ffe080", d.fillRect(Math.round(_v2578.x + Math.cos(_v2583) * 5), Math.round(_v2578.y - _v2578.h - 3 + Math.sin(_v2583) * 1.5), 1, 1));
    }
  }
  for (let _v2584 of n.mons) if (_v2584.dummy) {
    _v2584.log = _v2584.log.filter(_v2585 => n.T - _v2585[0] < 4);
    let _v2586 = _v2584.log.reduce((_v2587, _v2588) => _v2587 + _v2588[1], 0), _v2589 = _v2584.log.length ? Math.max(1, n.T - _v2584.log[0][0]) : 1;
    (d.font = "7px " + Zi, d.textAlign = "center", d.fillStyle = "#000", d.fillText("DPS " + ze(_v2586 / _v2589), _v2584.x + 0.5, _v2584.y - _v2584.h - 25.5), d.fillStyle = "#ffd27a", d.fillText("DPS " + ze(_v2586 / _v2589), _v2584.x, _v2584.y - _v2584.h - 26), _v2584.rar && (d.fillStyle = "#c89a30", d.fillRect(_v2584.x - 10, _v2584.y - _v2584.h - 3, 20 * (_v2584.stunT > 0 ? 1 : Math.min(1, _v2584.stun)), 1)));
  }
  (QA(_v2498, _v2499, _v2492, _v2493), W2(d, cn));
  for (let _v2590 of n.texts) {
    let _v2591 = _v2590.t / _v2590.max;
    d.globalAlpha = _v2591 > 0.6 ? 1 - (_v2591 - 0.6) / 0.4 : 1;
    let _v2592 = _v2590.crit ? 1 + Math.max(0, 0.12 - _v2590.t) * 5 : 1;
    (d.font = (_v2590.crit ? "700 " : "") + (_v2590.s * _v2592).toFixed(1) + "px " + (_v2590.txt.match(/[一-鿿]/) ? cn : Zi), d.textAlign = "center", d.lineWidth = 2, d.strokeStyle = "#000", d.strokeText(_v2590.txt, _v2590.x, _v2590.y), d.fillStyle = _v2590.col, d.fillText(_v2590.txt, _v2590.x, _v2590.y));
  }
  if ((d.globalAlpha = 1, n.state === "play" && !n.pl.dead)) {
    for (let _v2593 of n.objs) if ((_v2593.kind === "box" && !_v2593.open && (_v2593.x - n.pl.x) ** 2 + (_v2593.y - n.pl.y) ** 2 < 1296 && us(_v2593.x, _v2593.y - 14, "F 开启宝箱"), _v2593.kind === "rift" && _v2593.st === "idle" && (_v2593.x - n.pl.x) ** 2 + (_v2593.y - n.pl.y) ** 2 < 3600 && us(_v2593.x, _v2593.y - 16, "走入裂隙即开启"), _v2593.kind === "device" && (_v2593.x - n.pl.x) ** 2 + (_v2593.y - n.pl.y) ** 2 < 1600 && us(_v2593.x, _v2593.y - 26, "F / 点击 打开地图装置"), _v2593.kind === "vendor" && (_v2593.x - n.pl.x) ** 2 + (_v2593.y - n.pl.y) ** 2 < 1156 && us(_v2593.x, _v2593.y - 30, "F / 点击 与商人交易"), _v2593.kind === "stash" && (_v2593.x - n.pl.x) ** 2 + (_v2593.y - n.pl.y) ** 2 < 1156 && us(_v2593.x, _v2593.y - 22, "F / 点击 打开仓库"), _v2593.kind === "bench" && (_v2593.x - n.pl.x) ** 2 + (_v2593.y - n.pl.y) ** 2 < 1156 && us(_v2593.x, _v2593.y - 26, "F / 点击 打开工艺台"), _v2593.kind === "altar" && (_v2593.x - n.pl.x) ** 2 + (_v2593.y - n.pl.y) ** 2 < 1156 && us(_v2593.x, _v2593.y - 32, "F / 点击 打开余烬祭坛"), _v2593.kind === "well" && (_v2593.x - n.pl.x) ** 2 + (_v2593.y - n.pl.y) ** 2 < 1156 && us(_v2593.x, _v2593.y - 30, "F / 点击 打开灵魂之井"), _v2593.kind === "simulacrum" && (_v2593.x - n.pl.x) ** 2 + (_v2593.y - n.pl.y) ** 2 < 1156 && us(_v2593.x, _v2593.y - 32, u.simUnlocked ? "F / 点击 进入迷雾副本 (70 层)" : "F / 点击 解锁迷雾副本 (需 8 裂片)"), _v2593.kind === "mirror" && _v2593.st === "idle" && (_v2593.x - n.pl.x) ** 2 + (_v2593.y - n.pl.y) ** 2 < 1600 && us(_v2593.x, _v2593.y - 26, "F / 点击 开启惊悸迷雾"), _v2593.kind === "ritual" && (_v2593.x - n.pl.x) ** 2 + (_v2593.y - n.pl.y) ** 2 < 1600 && us(_v2593.x, _v2593.y - 32, _v2593.st === "idle" ? "F / 点击 开始驱灵仪式 · 已吸收 " + (_v2593.stored || 0) : _v2593.st === "done" ? "F / 点击 领取恩典 · 贡品 " + RitTribute() : "驱灵仪式 · 第 " + _v2593.wave + "/" + _v2593.waves + " 波 · 贡品 " + RitTribute()), _v2593.kind === "monument" && (_v2593.x - n.pl.x) ** 2 + (_v2593.y - n.pl.y) ** 2 < 1156 && us(_v2593.x, _v2593.y - 50, "F / 点击 查看创世群纪念碑"), _v2593.kind === "dog" && (_v2593.x - n.pl.x) ** 2 + (_v2593.y - n.pl.y) ** 2 < 1156 && us(_v2593.x, _v2593.y - 32, Zc() ? "F / 点击 看看今天的签" : "F / 点击 找过油肉抽签"), _v2593.kind === "shrine" && !_v2593.used && (_v2593.x - n.pl.x) ** 2 + (_v2593.y - n.pl.y) ** 2 < 2500)) {
      let _v2594 = is.find(_v2595 => _v2595.k === _v2593.type);
      us(_v2593.x, _v2593.y - 28, _v2594.n + " · " + _v2594.d);
    }
    for (let _v2596 of n.objs) _v2596.kind === "rift" && _v2596.st === "open" && (d.font = "6px " + Zi, d.textAlign = "center", d.fillStyle = "#000", d.fillText(Math.ceil(_v2596.t) + "s · " + (_v2596.kills || 0), _v2596.x + 0.5, _v2596.y - _v2596.R * 0.8 - 3.5), d.fillStyle = "#d0a0ff", d.fillText(Math.ceil(_v2596.t) + "s · " + (_v2596.kills || 0), _v2596.x, _v2596.y - _v2596.R * 0.8 - 4));
    for (let _v2597 of n.objs) {
      if (_v2597.kind !== "abyss") continue;
      let _v2598 = (_v2597.x - n.pl.x) ** 2 + (_v2597.y - n.pl.y) ** 2;
      (_v2597.st === "fissures" && _v2598 < 90400 && us(_v2597.x, _v2597.y - 22, "深渊裂缝 · 关闭 " + _v2597.fissures.filter(_v2599 => _v2599.closed).length + "/" + _v2597.fissures.length), _v2597.st === "pit" && _v2598 < 90400 && us(_v2597.x, _v2597.y - 24, "深渊巨坑 · 清理怪物"), _v2597.st === "sealed" && _v2598 < 90400 && us(_v2597.x, _v2597.y - 24, "深渊保险箱正在升起"), _v2597.st === "done" && _v2598 < 90400 && us(_v2597.x, _v2597.y - 24, "深渊保险箱"));
      for (let _v2600 of _v2597.fissures) !_v2600.closed && (_v2600.x - n.pl.x) ** 2 + (_v2600.y - n.pl.y) ** 2 < 32400 && us(_v2600.x, _v2600.y - 12, "击杀附近怪物 (" + _v2600.kills + "/" + _v2600.need + ")");
    }
  }
  if (n.state === "play" && !n.pl.dead) for (let _v2601 of n.objs) (_v2601.kind === "enc" && _v2601.st === "idle" && _v2601.type !== "ice" && (_v2601.x - n.pl.x) ** 2 + (_v2601.y - n.pl.y) ** 2 < 8100 && us(_v2601.x, _v2601.y - 22, gt[_v2601.type].enc + " · 靠近开始"), _v2601.kind === "enc" && _v2601.st === "active" && (d.font = "6px " + Zi, d.textAlign = "center", d.fillStyle = "#000", d.fillText(Math.ceil(_v2601.t) + "s", _v2601.x + 0.5, _v2601.y - 27.5), d.fillStyle = "#ffd27a", d.fillText(Math.ceil(_v2601.t) + "s", _v2601.x, _v2601.y - 28)));
  for (let _v2602 of n.mons) _v2602.type === "icechest" && !_v2602.dead && (_v2602.x - n.pl.x) ** 2 + (_v2602.y - n.pl.y) ** 2 < 1e4 && us(_v2602.x, _v2602.y - 16, "冰封宝藏 · 火焰伤害 ×3");
  (n.flashW > 0.01 && ie.flash > 0 && (d.setTransform(1, 0, 0, 1, 0, 0), d.fillStyle = `rgba(255,250,240,${Math.min(0.8, n.flashW) * ie.flash})`, d.fillRect(0, 0, ft.width, ft.height)), n.Z.type === "map" && YA());
};
zA = function (_v2603) {
  if (_v2603.hidden) return;
  if (bi.mode === 2) return g4(_v2603);
  let _v2604 = Xt[_v2603.spr], _v2605 = _v2603.face < 0, _v2606 = _v2605 ? _v2604.flip : _v2604.img, _v2607 = _v2603.moving && _v2603.frozen <= 0 ? Math.abs(Math.sin((n.T + _v2603.bob) * 10)) * 1.2 : 0, _v2608 = 0, _v2609 = 0;
  if (_v2603.shT > 0) {
    let _v2610 = Math.sin(n.T * 95) * 1.6 * (_v2603.shT / 0.14);
    (_v2608 = _v2603.shx * _v2610, _v2609 = _v2603.shy * _v2610 * 0.6);
  }
  let _v2611 = Math.round(_v2603.x - _v2604.w / 2 + _v2608), _v2612 = Math.round(_v2603.y - _v2604.h + 1 - _v2607 + _v2609);
  if ((d.fillStyle = "rgba(0,0,0,0.42)", d.beginPath(), d.ellipse(_v2603.x, _v2603.y + 0.5, _v2603.r * 1.1, _v2603.r * 0.4, 0, 0, 6.283), d.fill(), _v2603.rar >= 1 && !bi.mode)) {
    let _v2613 = _v2603.rar === 1 ? "#6a70ff" : _v2603.rar === 2 ? "#f0d040" : "#ff5030", _v2614 = Ne(_v2604, _v2613, _v2605);
    (d.globalAlpha = 0.85, d.drawImage(_v2614, _v2611 - 1, _v2612), d.drawImage(_v2614, _v2611 + 1, _v2612), d.drawImage(_v2614, _v2611, _v2612 - 1), d.drawImage(_v2614, _v2611, _v2612 + 1), d.globalAlpha = 1);
  }
  _v2603.weak && (d.globalAlpha = 0.32, d.drawImage(Ne(_v2604, "#2ee6a8", _v2605), _v2611, _v2612), d.globalAlpha = 1);
  _v2603.abmod && (d.globalAlpha = 0.55, d.strokeStyle = "#2ee6a8", d.lineWidth = 0.8, d.beginPath(), d.ellipse(_v2603.x, _v2603.y + 0.5, _v2603.r * 1.6, _v2603.r * 0.62, 0, 0, 6.283), d.stroke(), d.fillStyle = "#2ee6a8", d.fillRect(_v2603.x - 9, _v2603.y - _v2603.h - 6, 2, 2), d.fillRect(_v2603.x + 7, _v2603.y - _v2603.h - 6, 2, 2), d.globalAlpha = 1, (_v2603.x - n.pl.x) ** 2 + (_v2603.y - n.pl.y) ** 2 < 40000 && us(_v2603.x, _v2603.y - _v2603.h - 7, ABMODS[_v2603.abmod].n));
  if (_v2603.mark) {
    let _v2615 = _v2603.mark.type === "sniper" ? "#ffd27a" : "#ff6040", _v2616 = _v2603.x, _v2617 = _v2603.y - _v2603.h - 9, _v2618 = 3.5 + Math.sin(n.T * 8) * 0.6;
    (d.strokeStyle = _v2615, d.lineWidth = 0.8, d.beginPath(), d.arc(_v2616, _v2617, _v2618, 0, 6.283), d.stroke(), d.fillStyle = _v2615, d.fillRect(_v2616 - 0.5, _v2617 - _v2618 - 2, 1, 2), d.fillRect(_v2616 - 0.5, _v2617 + _v2618, 1, 2), d.fillRect(_v2616 - _v2618 - 2, _v2617 - 0.5, 2, 1), d.fillRect(_v2616 + _v2618, _v2617 - 0.5, 2, 1));
  }
  (_v2603.marked && (d.strokeStyle = "#a8e070", d.lineWidth = 0.8, d.beginPath(), d.arc(_v2603.x, _v2603.y - _v2603.h - 8, 2.5, 0, 6.283), d.stroke()), _v2603.rift && (d.globalAlpha = 0.5, d.drawImage(Ne(_v2604, "#b080ff", _v2605), _v2611, _v2612 - 1), d.globalAlpha = 1));
  let _v2619 = 1, _v2620 = 1;
  if (_v2603.sqT > 0 && _v2603.frozen <= 0) {
    let _v2621 = _v2603.sqT / 0.12 * (_v2603.sqA || 0.2) * (_v2603.rar >= 2 ? 0.5 : 1);
    (_v2619 = 1 + _v2621, _v2620 = 1 - _v2621 * 0.75);
  }
  let _v2622 = _v2604.w * _v2619, _v2623 = _v2604.h * _v2620, _v2624 = Math.round(_v2603.x - _v2622 / 2 + _v2608), _v2625 = Math.round(_v2603.y - _v2623 + 1 - _v2607 + _v2609);
  (_v2619 !== 1 ? d.drawImage(_v2603.rar ? _v2606 : vg(_v2603.spr, _v2605), _v2624 - (_v2603.rar ? 0 : _v2619), _v2625 - (_v2603.rar ? 0 : _v2620), _v2603.rar ? _v2622 : _v2622 + 2 * _v2619, _v2603.rar ? _v2623 : _v2623 + 2 * _v2620) : _v2603.rar ? d.drawImage(_v2606, _v2611, _v2612) : d.drawImage(vg(_v2603.spr, _v2605), _v2611 - 1, _v2612 - 1), bi.mode !== 1 && ((_v2603.state === "wind" || _v2603.state === "aim" || _v2603.state === "bslam" || _v2603.state === "bnova") && Math.floor(n.T * 20) % 2 && (d.globalAlpha = 0.5, d.drawImage(Ne(_v2604, "#ff6a50", _v2605), _v2611, _v2612), d.globalAlpha = 1), _v2603.frozen > 0 ? (d.globalAlpha = 0.6, d.drawImage(Ne(_v2604, "#aeeaff", _v2605), _v2611, _v2612), d.globalAlpha = 1) : _v2603.chill > 0 && (d.globalAlpha = 0.28, d.drawImage(Ne(_v2604, "#7fd0ff", _v2605), _v2611, _v2612), d.globalAlpha = 1), _v2603.shockT > 0 && I() < 0.25 && E(_v2603.x + B(-4, 4), _v2603.y, 1, ["#a8b4ff", "#fff"], 30, 0.15, {
    z: _v2603.h * 0.6,
    glow: !0,
    g: 0
  }), _v2603.flash > 0 && (d.globalAlpha = Math.min(1, _v2603.flash * 12), d.drawImage(Ne(_v2604, "#ffffff", _v2605), _v2611, _v2612), d.globalAlpha = 1)));
};
VA = function () {
  for (let _v2626 of n.fx) {
    if (KA.has(_v2626.k)) continue;
    let _v2627 = $e(_v2626.t / _v2626.max, 0, 1);
    if (!isFinite(_v2626.x) || !isFinite(_v2626.y)) continue;
    try {
      let _v2628 = _v2626.col && typeof _v2626.col === "string" && _v2626.col[0] === "#" ? ao(_v2626.col) : [1, 0.85, 0.62], _v2629 = Math.max(0, 1 - _v2627), _v2630 = _v2631 => "rgba(" + Math.round(_v2628[0] * 255) + "," + Math.round(_v2628[1] * 255) + "," + Math.round(_v2628[2] * 255) + "," + _v2631.toFixed(3) + ")", _v2632 = _v2626.k === "ring" ? _v2626.r1 || _v2626.r || 24 : _v2626.k === "cone" ? _v2626.r || 24 : _v2626.k === "slash" || _v2626.k === "iai" ? (_v2626.r || 26) + 12 : _v2626.r || _v2626.r1 || 18;
      if (!isFinite(_v2632) || _v2632 <= 0) _v2632 = 18;
      d.save();
      try {
        d.globalCompositeOperation = "lighter";
        let _v2633 = d.createRadialGradient(_v2626.x, _v2626.y - 6, 0, _v2626.x, _v2626.y - 6, _v2632 * 1.6 + 10);
        (_v2633.addColorStop(0, _v2630(0.2 * _v2629)), _v2633.addColorStop(0.55, _v2630(0.07 * _v2629)), _v2633.addColorStop(1, _v2630(0)), d.fillStyle = _v2633, d.beginPath(), d.arc(_v2626.x, _v2626.y - 6, _v2632 * 1.6 + 10, 0, 6.283), d.fill());
      } finally {
        d.restore();
      }
    } catch (_v2634) {}
    if (_v2626.k === "ring") {
      let _v2635 = 1 - Math.pow(1 - _v2627, 3), _v2636 = _v2626.r0 + (_v2626.r1 - _v2626.r0) * _v2635;
      if (!isFinite(_v2636) || _v2636 <= 0) continue;
      (d.globalAlpha = 1 - _v2627, d.strokeStyle = _v2626.col, d.lineWidth = _v2626.w * (1 - _v2627 * 0.5), d.beginPath(), d.ellipse(_v2626.x, _v2626.y, _v2636, _v2636 * 0.78, 0, 0, 6.283), d.stroke(), d.globalAlpha = (1 - _v2627) * 0.4, d.lineWidth = _v2626.w * 1.9 * (1 - _v2627) + 0.4, d.beginPath(), d.ellipse(_v2626.x, _v2626.y, _v2636 * 0.9, _v2636 * 0.7, 0, 0, 6.283), d.stroke(), d.globalAlpha = (1 - _v2627) * 0.55, d.lineWidth = 0.7, d.beginPath(), d.ellipse(_v2626.x, _v2626.y, _v2636 * 1.14, _v2636 * 0.9, 0, 0, 6.283), d.stroke(), d.globalAlpha = 1);
    } else if (_v2626.k === "bolt") (d.globalAlpha = (1 - _v2627) * 0.45, d.globalCompositeOperation = "lighter", d.beginPath(), _v2626.pts.forEach((_v2637, _v2638) => _v2638 ? d.lineTo(_v2637.x, _v2637.y) : d.moveTo(_v2637.x, _v2637.y)), d.strokeStyle = "#6a48ff", d.lineWidth = 5, d.stroke(), d.globalAlpha = 1 - _v2627, d.strokeStyle = _v2626.col, d.lineWidth = 2.2, d.stroke(), d.strokeStyle = "#ffffff", d.lineWidth = 0.8, d.stroke(), d.globalCompositeOperation = "source-over"); else if (_v2626.k === "sky") (_v2626.pts || (_v2626.pts = Qs([{
      x: _v2626.x + B(-8, 8),
      y: _v2626.y - 130
    }, {
      x: _v2626.x,
      y: _v2626.y
    }])), d.globalCompositeOperation = "lighter", d.beginPath(), _v2626.pts.forEach((_v2639, _v2640) => _v2640 ? d.lineTo(_v2639.x, _v2639.y) : d.moveTo(_v2639.x, _v2639.y)), d.globalAlpha = (1 - _v2627) * 0.4, d.strokeStyle = "#6a48ff", d.lineWidth = 6 * (1 - _v2627) + 1.5, d.stroke(), d.globalAlpha = 1 - _v2627, d.strokeStyle = _v2626.col, d.lineWidth = 3 * (1 - _v2627) + 0.5, d.stroke(), d.strokeStyle = "#fff", d.lineWidth = 1, d.stroke(), d.globalCompositeOperation = "source-over"); else if (_v2626.k === "slash") (d.globalAlpha = 1 - _v2627, d.strokeStyle = _v2626.col, d.lineWidth = 1.5, d.beginPath(), d.arc(_v2626.x, _v2626.y, _v2626.r, _v2626.ang - 0.9 + _v2627 * 0.6, _v2626.ang + 0.3 + _v2627 * 0.6), d.stroke()); else if (_v2626.k === "cone") {
      (d.globalAlpha = (1 - _v2627) * 0.6, d.globalCompositeOperation = "lighter", d.fillStyle = _v2626.col);
      let _v2641 = _v2626.r * (0.3 + 0.7 * ms(_v2627));
      (d.beginPath(), d.moveTo(_v2626.x, _v2626.y), d.arc(_v2626.x, _v2626.y, _v2641, _v2626.ang - _v2626.a / 2, _v2626.ang + _v2626.a / 2), d.closePath(), d.fill(), d.globalCompositeOperation = "source-over");
    } else if (_v2626.k === "iai") {
      let _v2642 = _v2627 < 0.2 ? _v2627 / 0.2 : 1 - (_v2627 - 0.2) / 0.8;
      (d.globalAlpha = 1, d.globalCompositeOperation = "lighter", d.strokeStyle = "#ffffff", d.lineWidth = 2.5 * _v2642 + 0.3, d.beginPath(), d.moveTo(_v2626.x0, _v2626.y0), d.lineTo(_v2626.x1, _v2626.y1), d.stroke(), d.strokeStyle = "#ff8090", d.lineWidth = 0.6, d.stroke(), d.globalCompositeOperation = "source-over");
    } else if (_v2626.k === "star") {
      (d.globalAlpha = 1 - _v2627, d.fillStyle = _v2626.col);
      let _v2643 = _v2626.r * (0.5 + 0.5 * ms(_v2627));
      d.beginPath();
      for (let _v2644 = 0; _v2644 < 8; _v2644++) {
        let _v2645 = _v2644 / 8 * 6.283, _v2646 = _v2644 % 2 ? _v2643 * 0.22 : _v2643;
        d.lineTo(_v2626.x + Math.cos(_v2645) * _v2646, _v2626.y + Math.sin(_v2645) * _v2646);
      }
      (d.closePath(), d.fill());
    } else if (_v2626.k === "chainl") (d.globalCompositeOperation = "lighter", d.globalAlpha = (1 - _v2627) * 0.5, d.strokeStyle = _v2626.col, d.lineWidth = 4 * (1 - _v2627) + 1, d.beginPath(), d.moveTo(_v2626.x1, _v2626.y1), d.lineTo(_v2626.x2, _v2626.y2), d.stroke(), d.globalAlpha = 1 - _v2627, d.strokeStyle = "#ffffff", d.lineWidth = 0.9, d.stroke(), d.globalCompositeOperation = "source-over"); else if (_v2626.k === "lines") {
      (d.globalAlpha = (1 - _v2627) * 0.85, d.strokeStyle = "#ffffff", d.lineWidth = 0.8);
      for (let _v2647 = 0; _v2647 < 20; _v2647++) {
        let _v2648 = _v2647 / 20 * 6.283 + _v2647 * 37 % 7 * 0.05, _v2649 = 26 + _v2647 % 3 * 6, _v2650 = 180;
        (d.beginPath(), d.moveTo(_v2626.x + Math.cos(_v2648) * _v2649, _v2626.y + Math.sin(_v2648) * _v2649), d.lineTo(_v2626.x + Math.cos(_v2648) * _v2650, _v2626.y + Math.sin(_v2648) * _v2650), d.stroke());
      }
    } else if (_v2626.k === "spike") {
      let _v2651 = (_v2627 < 0.15 ? _v2627 / 0.15 : 1) * 14 * _v2626.s, _v2652 = _v2627 > 0.7 ? 1 - (_v2627 - 0.7) / 0.3 : 1;
      (d.globalAlpha = _v2652, d.fillStyle = "#9fe8ff", d.beginPath(), d.moveTo(_v2626.x - 4, _v2626.y), d.lineTo(_v2626.x, _v2626.y - _v2651), d.lineTo(_v2626.x + 4, _v2626.y), d.closePath(), d.fill(), d.fillStyle = "#e8fbff", d.beginPath(), d.moveTo(_v2626.x - 1, _v2626.y), d.lineTo(_v2626.x, _v2626.y - _v2651), d.lineTo(_v2626.x + 1.5, _v2626.y), d.closePath(), d.fill(), d.fillStyle = "#5fb4e8", d.beginPath(), d.moveTo(_v2626.x + 3, _v2626.y), d.lineTo(_v2626.x + 6, _v2626.y - _v2651 * 0.5), d.lineTo(_v2626.x + 7, _v2626.y), d.closePath(), d.fill());
    } else if (_v2626.k === "arrow") {
      if (_v2626.t < 0) continue;
      let _v2653 = 1 - _v2627;
      (d.globalAlpha = 1, d.strokeStyle = "#c8b890", d.lineWidth = 0.8, d.beginPath(), d.moveTo(_v2626.x + _v2653 * 24, _v2626.y - _v2653 * 80 - 8), d.lineTo(_v2626.x + _v2653 * 24 - 2, _v2626.y - _v2653 * 80), d.stroke());
    } else if (_v2626.k === "comet") {
      let _v2654 = 1 - _v2627, _v2655 = _v2626.x - _v2654 * 60, _v2656 = _v2626.y - _v2654 * 170, _v2657 = 0.88 + Math.sin(n.T * 24) * 0.12;
      d.save();
      d.globalCompositeOperation = "lighter";
      let _v2658 = d.createLinearGradient(_v2655 - 34, _v2656 - 92, _v2655 + 5, _v2656 + 5);
      _v2658.addColorStop(0, "rgba(65,174,255,0)");
      _v2658.addColorStop(0.38, "rgba(76,194,255,0.18)");
      _v2658.addColorStop(0.78, "rgba(150,231,255,0.42)");
      _v2658.addColorStop(1, "rgba(245,255,255,0.75)");
      d.fillStyle = _v2658;
      d.globalAlpha = 0.8;
      d.beginPath();
      d.moveTo(_v2655 - 5, _v2656 - 4);
      d.lineTo(_v2655 - 24, _v2656 - 33);
      d.lineTo(_v2655 - 51, _v2656 - 70);
      d.lineTo(_v2655 - 34, _v2656 - 52);
      d.lineTo(_v2655 - 62, _v2656 - 94);
      d.lineTo(_v2655 - 22, _v2656 - 72);
      d.lineTo(_v2655 - 35, _v2656 - 43);
      d.lineTo(_v2655 + 4, _v2656 - 13);
      d.closePath();
      d.fill();
      for (let _v2659 = 0; _v2659 < 42; _v2659++) {
        let _v2660 = _v2659 * 37 % 43 / 43, _v2661 = _v2655 - 6 - _v2660 * 42 + Math.sin(_v2659 * 2.17 + n.T * 3) * (2 + _v2660 * 10), _v2662 = _v2656 - 8 - _v2660 * 82 + Math.cos(n.T * 7 + _v2659) * 4, _v2663 = 0.8 + _v2659 % 5 * 0.42;
        d.globalAlpha = (0.66 - _v2660 * 0.48) * (0.65 + 0.35 * Math.sin(n.T * 15 + _v2659));
        d.fillStyle = _v2659 % 5 === 0 ? "#ffffff" : _v2659 % 3 === 0 ? "#55caff" : "#a8edff";
        d.beginPath();
        if (_v2659 % 3 === 0) {
          d.moveTo(_v2661, _v2662 - _v2663 * 1.8);
          d.lineTo(_v2661 + _v2663, _v2662);
          d.lineTo(_v2661 - _v2663 * 0.7, _v2662 + _v2663);
          d.closePath();
          d.fill();
        } else {
          d.beginPath();
          d.arc(_v2661, _v2662, _v2663, 0, Math.PI * 2);
          d.fill();
        }
      }
      d.globalAlpha = 0.25 * _v2657;
      let _v2664 = d.createRadialGradient(_v2655, _v2656, 2, _v2655, _v2656, 30);
      _v2664.addColorStop(0, "rgba(230,252,255,0.8)");
      _v2664.addColorStop(0.45, "rgba(72,195,255,0.28)");
      _v2664.addColorStop(1, "rgba(72,195,255,0)");
      d.fillStyle = _v2664;
      d.beginPath();
      d.arc(_v2655, _v2656, 30, 0, Math.PI * 2);
      d.fill();
      d.globalCompositeOperation = "lighter";
      let _v2665 = d.createRadialGradient(0, 0, 1, 0, 0, 42);
      _v2665.addColorStop(0, "rgba(255,255,255,0.98)");
      _v2665.addColorStop(0.16, "rgba(205,250,255,0.82)");
      _v2665.addColorStop(0.42, "rgba(86,201,255,0.42)");
      _v2665.addColorStop(0.72, "rgba(92,145,255,0.16)");
      _v2665.addColorStop(1, "rgba(80,130,255,0)");
      d.globalAlpha = 0.82 * _v2657;
      d.fillStyle = _v2665;
      d.beginPath();
      d.arc(_v2655, _v2656, 42, 0, Math.PI * 2);
      d.fill();
      let _v2666 = d.createRadialGradient(_v2655 - 2, _v2656 - 2, 0, _v2655, _v2656, 21);
      _v2666.addColorStop(0, "rgba(255,255,255,1)");
      _v2666.addColorStop(0.24, "rgba(236,255,255,0.96)");
      _v2666.addColorStop(0.58, "rgba(104,218,255,0.68)");
      _v2666.addColorStop(1, "rgba(76,160,255,0)");
      d.globalAlpha = 0.95;
      d.fillStyle = _v2666;
      d.beginPath();
      d.arc(_v2655, _v2656, 21, 0, Math.PI * 2);
      d.fill();
      d.globalCompositeOperation = "source-over";
      d.translate(_v2655, _v2656);
      d.rotate(-0.48 + Math.sin(n.T * 4) * 0.08);
      const _v2667 = [[-13, -5, 4.2, "#2b719e"], [-9, -12, 3.4, "#5ecfff"], [-3, -15, 2.6, "#d9faff"], [4, -12, 4.0, "#2f8fc5"], [11, -7, 3.0, "#a5edff"], [13, 1, 3.7, "#276b9c"], [8, 8, 4.2, "#55bde9"], [2, 13, 3.0, "#e5fbff"], [-6, 11, 4.0, "#347fac"], [-13, 6, 3.3, "#72d8ff"], [-17, -1, 2.4, "#b9f3ff"], [-4, 1, 5.0, "#d9fbff"], [2, -4, 4.5, "#ffffff"], [7, 1, 2.7, "#d7f8ff"], [-7, -4, 2.6, "#f5ffff"]];
      for (let _v2668 = 0; _v2668 < _v2667.length; _v2668++) {
        let _v2669 = _v2667[_v2668], _v2670 = Math.sin(n.T * 8 + _v2668 * 1.7) * 0.65;
        d.globalAlpha = 0.72 + 0.28 * Math.sin(n.T * 13 + _v2668 * 2);
        d.fillStyle = _v2669[3];
        d.beginPath();
        d.moveTo(_v2669[0] - _v2669[2] * 0.7, _v2669[1] - _v2669[2] * 0.4);
        d.lineTo(_v2669[0] + _v2669[2] * 0.45 + _v2670, _v2669[1] - _v2669[2]);
        d.lineTo(_v2669[0] + _v2669[2], _v2669[1] + _v2669[2] * 0.2);
        d.lineTo(_v2669[0] + _v2669[2] * 0.15, _v2669[1] + _v2669[2] * 0.85);
        d.lineTo(_v2669[0] - _v2669[2] * 0.9, _v2669[1] + _v2669[2] * 0.25);
        d.closePath();
        d.fill();
      }
      const _v2671 = [[-25, -12, 2.8, "#5bcaff"], [22, -14, 2.2, "#eaffff"], [25, 5, 3.1, "#66cfff"], [-19, 19, 2.5, "#a8edff"], [3, 25, 2.0, "#ffffff"], [-28, 2, 1.8, "#d5f8ff"], [14, -27, 2.0, "#8adfff"]];
      for (let _v2672 = 0; _v2672 < _v2671.length; _v2672++) {
        let _v2673 = _v2671[_v2672], _v2674 = 0.75 + 0.25 * Math.sin(n.T * 17 + _v2672 * 2.4);
        d.globalAlpha = _v2674;
        d.fillStyle = _v2673[3];
        d.beginPath();
        d.arc(_v2673[0], _v2673[1], _v2673[2], 0, Math.PI * 2);
        d.fill();
      }
      d.globalAlpha = 0.98;
      d.fillStyle = "#ffffff";
      d.beginPath();
      d.arc(-1, -2, 3.2, 0, Math.PI * 2);
      d.fill();
      d.globalAlpha = 0.7;
      d.strokeStyle = "#eaffff";
      d.lineWidth = 1;
      d.beginPath();
      d.moveTo(-12, -1);
      d.lineTo(-5, -3);
      d.moveTo(3, 5);
      d.lineTo(10, 2);
      d.stroke();
      d.restore();
    } else if (_v2626.k === "meteor") {
      let _v2675 = 1 - _v2627, _v2676 = _v2626.x + _v2675 * 70, _v2677 = _v2626.y - _v2675 * 170, _v2678 = 0.85 + Math.sin(n.T * 31) * 0.15;
      d.save();
      d.globalCompositeOperation = "lighter";
      let _v2679 = d.createLinearGradient(_v2676 + 28, _v2677 - 96, _v2676 - 3, _v2677 + 5);
      _v2679.addColorStop(0, "rgba(255,70,18,0)");
      _v2679.addColorStop(0.32, "rgba(255,76,18,0.18)");
      _v2679.addColorStop(0.72, "rgba(255,140,28,0.48)");
      _v2679.addColorStop(1, "rgba(255,236,150,0.78)");
      d.fillStyle = _v2679;
      d.globalAlpha = 0.85;
      d.beginPath();
      d.moveTo(_v2676 - 3, _v2677 - 5);
      d.lineTo(_v2676 + 22, _v2677 - 31);
      d.lineTo(_v2676 + 45, _v2677 - 61);
      d.lineTo(_v2676 + 30, _v2677 - 52);
      d.lineTo(_v2676 + 59, _v2677 - 94);
      d.lineTo(_v2676 + 17, _v2677 - 70);
      d.lineTo(_v2676 + 34, _v2677 - 42);
      d.lineTo(_v2676 - 9, _v2677 - 13);
      d.closePath();
      d.fill();
      for (let _v2680 = 0; _v2680 < 48; _v2680++) {
        let _v2681 = _v2680 * 17 % 53 / 53, _v2682 = _v2676 + 6 + _v2681 * 42 + Math.sin(_v2680 * 1.91 + n.T * 4) * (2 + _v2681 * 10), _v2683 = _v2677 - 8 - _v2681 * 84 + Math.cos(n.T * 9 + _v2680) * 4, _v2684 = 0.8 + _v2680 % 5 * 0.4;
        d.globalAlpha = (0.76 - _v2681 * 0.53) * (0.6 + 0.4 * Math.sin(n.T * 20 + _v2680));
        d.fillStyle = _v2680 % 5 === 0 ? "#fff7cf" : _v2680 % 2 === 0 ? "#ffb13b" : "#ff4b12";
        d.beginPath();
        if (_v2680 % 4 === 0) {
          d.moveTo(_v2682, _v2683 - _v2684 * 1.8);
          d.lineTo(_v2682 + _v2684, _v2683);
          d.lineTo(_v2682 - _v2684, _v2683 + _v2684);
          d.closePath();
          d.fill();
        } else {
          d.beginPath();
          d.arc(_v2682, _v2683, _v2684, 0, Math.PI * 2);
          d.fill();
        }
      }
      d.globalAlpha = 0.23 * _v2678;
      let _v2685 = d.createRadialGradient(_v2676, _v2677, 2, _v2676, _v2677, 31);
      _v2685.addColorStop(0, "rgba(255,242,176,0.9)");
      _v2685.addColorStop(0.45, "rgba(255,91,22,0.28)");
      _v2685.addColorStop(1, "rgba(255,91,22,0)");
      d.fillStyle = _v2685;
      d.beginPath();
      d.arc(_v2676, _v2677, 31, 0, Math.PI * 2);
      d.fill();
      d.globalCompositeOperation = "source-over";
      d.translate(_v2676, _v2677);
      d.rotate(0.38 + Math.sin(n.T * 3.5) * 0.1);
      d.globalCompositeOperation = "lighter";
      let _v2686 = d.createRadialGradient(0, 0, 1, 0, 0, 43);
      _v2686.addColorStop(0, "rgba(255,255,225,0.98)");
      _v2686.addColorStop(0.16, "rgba(255,205,92,0.9)");
      _v2686.addColorStop(0.42, "rgba(255,91,22,0.5)");
      _v2686.addColorStop(0.72, "rgba(255,56,12,0.18)");
      _v2686.addColorStop(1, "rgba(255,56,12,0)");
      d.globalAlpha = 0.72 * _v2678;
      d.fillStyle = _v2686;
      d.beginPath();
      d.arc(0, 0, 43, 0, Math.PI * 2);
      d.fill();
      let _v2687 = d.createRadialGradient(-2, -2, 0, 0, 0, 22);
      _v2687.addColorStop(0, "rgba(255,255,235,0.95)");
      _v2687.addColorStop(0.22, "rgba(255,204,92,0.82)");
      _v2687.addColorStop(0.58, "rgba(255,80,15,0.4)");
      _v2687.addColorStop(1, "rgba(255,80,15,0)");
      d.globalAlpha = 0.8;
      d.fillStyle = _v2687;
      d.beginPath();
      d.arc(0, 0, 22, 0, Math.PI * 2);
      d.fill();
      d.globalCompositeOperation = "source-over";
      const _v2688 = [[-13, -7, 4.2, "#201512"], [-8, -15, 3.8, "#563023"], [-1, -17, 3.1, "#2b1b16"], [7, -13, 4.4, "#6a3522"], [14, -7, 3.4, "#281713"], [16, 2, 4.0, "#48251a"], [10, 10, 4.5, "#241612"], [2, 15, 3.3, "#69351f"], [-7, 12, 4.3, "#301b15"], [-15, 7, 3.4, "#5a2b1b"], [-18, -1, 2.8, "#241511"], [-5, -3, 4.2, "#a33c16"], [2, -7, 3.5, "#ff6a18"], [6, 1, 3.6, "#51251a"], [-2, 5, 3.1, "#ff9a27"], [7, 7, 2.4, "#e34a13"]];
      for (let _v2689 = 0; _v2689 < _v2688.length; _v2689++) {
        let _v2690 = _v2688[_v2689], _v2691 = Math.sin(n.T * 9 + _v2689 * 1.9) * 0.55;
        d.globalAlpha = 0.78 + 0.22 * Math.sin(n.T * 16 + _v2689 * 2.1);
        d.fillStyle = _v2690[3];
        d.beginPath();
        d.moveTo(_v2690[0] - _v2690[2] * 0.8, _v2690[1] - _v2690[2] * 0.2);
        d.lineTo(_v2690[0] + _v2690[2] * 0.25 + _v2691, _v2690[1] - _v2690[2]);
        d.lineTo(_v2690[0] + _v2690[2], _v2690[1] + _v2690[2] * 0.35);
        d.lineTo(_v2690[0] + _v2690[2] * 0.1, _v2690[1] + _v2690[2] * 0.9);
        d.lineTo(_v2690[0] - _v2690[2] * 0.9, _v2690[1] + _v2690[2] * 0.25);
        d.closePath();
        d.fill();
      }
      const _v2692 = [[-25, -12, 2.5, "#ff8a24"], [22, -15, 2.7, "#3a2118"], [25, 5, 2.4, "#ff5a16"], [-19, 20, 2.6, "#7d3b20"], [3, 25, 2.0, "#ffb33b"], [-28, 2, 1.9, "#ff6a1a"], [14, -27, 2.2, "#ffcf62"]];
      for (let _v2693 = 0; _v2693 < _v2692.length; _v2693++) {
        let _v2694 = _v2692[_v2693], _v2695 = 0.68 + 0.32 * Math.sin(n.T * 19 + _v2693 * 2.2);
        d.globalAlpha = _v2695;
        d.fillStyle = _v2694[3];
        d.beginPath();
        d.moveTo(_v2694[0] - _v2694[2], _v2694[1] - _v2694[2] * 0.2);
        d.lineTo(_v2694[0] + _v2694[2] * 0.6, _v2694[1] - _v2694[2]);
        d.lineTo(_v2694[0] + _v2694[2], _v2694[1] + _v2694[2] * 0.5);
        d.lineTo(_v2694[0] - _v2694[2] * 0.6, _v2694[1] + _v2694[2]);
        d.closePath();
        d.fill();
      }
      d.globalCompositeOperation = "lighter";
      d.globalAlpha = 0.9;
      d.fillStyle = "#fff4c8";
      d.beginPath();
      d.arc(-2, -3, 2.2, 0, Math.PI * 2);
      d.fill();
      d.fillStyle = "#ffb33b";
      d.beginPath();
      d.arc(5, 4, 1.6, 0, Math.PI * 2);
      d.fill();
      d.globalAlpha = 0.72;
      d.strokeStyle = "#ff7a1b";
      d.lineWidth = 1.1;
      d.beginPath();
      d.moveTo(-10, -4);
      d.lineTo(-5, -1);
      d.moveTo(1, -12);
      d.lineTo(4, -8);
      d.moveTo(7, 8);
      d.lineTo(11, 4);
      d.stroke();
      d.restore();
    }
  }
  d.globalAlpha = 1;
};
m4 = function () {
  n.LIGHTS = [];
  let _v2696 = _v2697 => 0.85 + Math.sin(n.T * 9 + _v2697) * 0.08 + I() * 0.05;
  n.LIGHTS.push({
    x: n.pl.x,
    y: n.pl.y - 6,
    r: n.Z.type === "hideout" ? 190 : 135,
    i: 1
  });
  let _v2698 = p2();
  _v2698 && n.LIGHTS.push(_v2698);
  let _v2699 = Uh(Va("wings"));
  _v2699 && n.LIGHTS.push(_v2699);
  let _v2700 = Nv(Va("back"));
  _v2700 && n.LIGHTS.push(_v2700);
  let _v2701 = r2();
  (_v2701 && n.LIGHTS.push(_v2701), n.Z.lights.forEach((_v2702, _v2703) => n.LIGHTS.push({
    x: _v2702.x,
    y: _v2702.y,
    r: _v2702.r * (_v2702.torch ? _v2696(_v2703) : 1),
    c: _v2702.c,
    i: _v2702.i,
    env: 1
  })));
  for (let _v2704 of n.projs) n.LIGHTS.push({
    x: _v2704.x,
    y: _v2704.y - 6,
    r: _v2704.kind === "fireball" ? 42 : 26,
    c: _v2704.kind === "fireball" ? "#ff8a30" : Yt[_v2704.c.dom],
    i: 0.8
  });
  for (let _v2705 of n.eprojs) n.LIGHTS.push({
    x: _v2705.x,
    y: _v2705.y - 6,
    r: 20,
    c: _v2705.col,
    i: 0.7
  });
  for (let _v2706 of n.fx) {
    if ((_v2706.k === "flash" && n.LIGHTS.push({
      x: _v2706.x,
      y: _v2706.y,
      r: _v2706.r * 1.4 * (1 - _v2706.t / _v2706.max),
      c: null,
      i: 1
    }), _v2706.k === "bolt")) {
      let _v2707 = _v2706.pts[Math.floor(_v2706.pts.length / 2)];
      n.LIGHTS.push({
        x: _v2707.x,
        y: _v2707.y,
        r: 80,
        c: "#a8b4ff",
        i: 0.8
      });
    }
    (_v2706.k === "sky" && n.LIGHTS.push({
      x: _v2706.x,
      y: _v2706.y,
      r: 70,
      c: "#a8b4ff",
      i: 0.9
    }), _v2706.k === "tele" && n.LIGHTS.push({
      x: _v2706.x,
      y: _v2706.y,
      r: _v2706.r * 1.3,
      c: _v2706.col,
      i: 0.5
    }), _v2706.k === "cone" && n.LIGHTS.push({
      x: _v2706.x,
      y: _v2706.y,
      r: _v2706.r,
      c: _v2706.col,
      i: 0.6
    }));
  }
  for (let _v2708 of n.loots) _v2708.beam && _v2708.landed && !_v2708.hid && n.LIGHTS.push({
    env: 1,
    x: _v2708.x,
    y: _v2708.y,
    r: _v2708.big ? 60 : 36,
    c: _v2708.beam,
    i: 0.8
  });
  for (let _v2709 of n.objs) (_v2709.kind === "rift" && _v2709.st !== "done" && n.LIGHTS.push({
    env: 1,
    x: _v2709.x,
    y: _v2709.y,
    r: _v2709.st === "open" ? _v2709.R + 40 : 50,
    c: "#9a60ff",
    i: 0.8
  }), _v2709.kind === "abyss" && (n.LIGHTS.push({
    env: 1,
    x: _v2709.x,
    y: _v2709.y,
    r: _v2709.st === "sealed" || _v2709.st === "done" ? 50 : 110,
    c: "#2ee6a8",
    i: 0.85
  }), _v2709.fissures.forEach(_v2710 => {
    !_v2710.closed && n.LIGHTS.push({
      env: 1,
      x: _v2710.x,
      y: _v2710.y,
      r: 44,
      c: "#2ee6a8",
      i: 0.55
    });
  })), _v2709.kind === "device" && n.LIGHTS.push({
    env: 1,
    x: _v2709.x,
    y: _v2709.y,
    r: 70,
    c: u.device ? la[u.device.theme].torch : "#8a6aff",
    i: 0.8
  }), _v2709.kind === "mirror" && n.LIGHTS.push({
    env: 1,
    x: _v2709.x,
    y: _v2709.y,
    r: 55,
    c: "#cfd8e8",
    i: 0.7
  }), _v2709.kind === "ritual" && n.LIGHTS.push({
    env: 1,
    x: _v2709.x,
    y: _v2709.y,
    r: 50,
    c: "#d06a8a",
    i: 0.75
  }));
  for (let _v2711 of n.orbs || []) n.LIGHTS.push({
    env: 1,
    x: _v2711.x,
    y: _v2711.y - 12,
    r: 70,
    c: "#8a70ff",
    i: 0.8
  });
  for (let _v2712 of n.grenades || []) n.LIGHTS.push({
    x: _v2712.x,
    y: _v2712.y - _v2712.z,
    r: 14,
    c: "#ffb040",
    i: 0.5
  });
  for (let _v2713 of n.grounds) n.LIGHTS.push({
    x: _v2713.x,
    y: _v2713.y,
    r: _v2713.oil ? _v2713.r * 1.8 : 20,
    c: "#ff6a1a",
    i: 0.5
  });
  for (let _v2714 of n.walls) n.LIGHTS.push({
    x: (_v2714.x1 + _v2714.x2) / 2,
    y: (_v2714.y1 + _v2714.y2) / 2,
    r: 55,
    c: "#ff6a1a",
    i: 0.8
  });
  for (let _v2715 of n.bombs) n.LIGHTS.push({
    x: _v2715.x,
    y: _v2715.y,
    r: _v2715.r + 10,
    c: "#7fd0ff",
    i: 0.5
  });
  for (let _v2716 of n.bells) n.LIGHTS.push({
    x: _v2716.x,
    y: _v2716.y - 12,
    r: 40,
    c: "#ffe060",
    i: 0.6
  });
  for (let _v2717 of n.sticks) n.LIGHTS.push({
    x: _v2717.x,
    y: _v2717.y - 8,
    r: 16,
    c: "#ff8a30",
    i: 0.6
  });
  for (let _v2718 of n.haz) _v2718.kind === "pool" && _v2718.el === "fire" && n.LIGHTS.push({
    x: _v2718.x,
    y: _v2718.y,
    r: _v2718.r + 12,
    c: "#ff6a1a",
    i: 0.5
  });
  for (let _v2719 of n.objs) (_v2719.kind === "vent" && n.LIGHTS.push({
    x: _v2719.x,
    y: _v2719.y,
    r: _v2719.st === "tele" ? 60 : 26,
    c: "#ff6a1a",
    i: _v2719.st === "tele" ? 0.9 : 0.4
  }), _v2719.kind === "enc" && _v2719.st !== "done" && _v2719.st !== "fail" && n.LIGHTS.push({
    x: _v2719.x,
    y: _v2719.y,
    r: 50,
    c: gt[_v2719.type] ? gt[_v2719.type].col : "#fff",
    i: 0.6
  }));
  n.pl.clone && n.LIGHTS.push({
    x: n.pl.clone.x,
    y: n.pl.clone.y - 6,
    r: 30,
    c: "#8a70c0",
    i: 0.5
  });
  for (let _v2720 of n.objs) _v2720.kind === "shrine" && !_v2720.used && n.LIGHTS.push({
    x: _v2720.x,
    y: _v2720.y - 14,
    r: 46,
    c: is.find(_v2721 => _v2721.k === _v2720.type).col,
    i: 0.8
  });
  if (n.pl.shrineT > 0) {
    let _v2722 = is.find(_v2723 => _v2723.k === n.pl.shrine);
    _v2722 && n.LIGHTS.push({
      x: n.pl.x,
      y: n.pl.y - 6,
      r: 50,
      c: _v2722.col,
      i: 0.5
    });
  }
  for (let _v2724 of n.mons) _v2724.rar === 3 && !_v2724.dead && n.LIGHTS.push({
    x: _v2724.x,
    y: _v2724.y - 10,
    r: 60,
    c: "#ff6020",
    i: 0.6
  });
  n.pl.kishinT > 0 && n.LIGHTS.push({
    x: n.pl.x,
    y: n.pl.y - 6,
    r: 60,
    c: "#ff3a1a",
    i: 0.8
  });
};
YA = function () {
  let _v2725 = n.Z.M, _v2726 = n.touchMode && n.miniBox, _v2727 = _v2726 ? Math.min(1.6, _v2726.w / _v2725.W) : Math.min(1.9, Xc * 0.2 / _v2725.W), _v2728 = _v2726 ? _v2726.right ? _v2726.x - _v2725.W * _v2727 : _v2726.x : Xc - _v2725.W * _v2727 - 10, _v2729 = _v2726 ? _v2726.y : Math.min(Jd * 0.25, 74);
  (d.setTransform(gi * _v2727, 0, 0, gi * _v2727, _v2728 * gi, _v2729 * gi), d.globalAlpha = 0.85, d.fillStyle = "rgba(0,0,0,0.35)", d.fillRect(-1, -1, _v2725.W + 2, _v2725.H + 2), d.drawImage(n.Z.mini, 0, 0));
  let _v2730 = _v2725.rooms[_v2725.rooms.length - 1];
  (d.fillStyle = n.Z.done ? "#6a6a6a" : "#ff4030", d.fillRect(_v2730.cx - 1, _v2730.cy - 1, 3, 3));
  for (let _v2731 of n.objs) {
    let _v2732 = Math.floor(_v2731.x / K), _v2733 = Math.floor(_v2731.y / K);
    n.Z.explored[_v2733 * _v2725.W + _v2732] && (_v2731.kind === "box" && !_v2731.open && (d.fillStyle = "#ffd060", d.fillRect(_v2732 - 1, _v2733 - 1, 2, 2)), _v2731.kind === "rift" && _v2731.st !== "done" && (d.fillStyle = "#b080ff", d.fillRect(_v2732 - 1, _v2733 - 1, 3, 3)), _v2731.kind === "abyss" && (d.fillStyle = _v2731.st === "done" ? "#6a6a6a" : "#2ee6a8", d.fillRect(_v2732 - 1, _v2733 - 1, 3, 3)), _v2731.kind === "abyss" && _v2731.fissures.forEach(_v2734 => {
      if (_v2734.closed) return;
      let _v2735 = Math.floor(_v2734.x / K), _v2736 = Math.floor(_v2734.y / K);
      (d.fillStyle = "#9dffb4", d.fillRect(_v2735 - 1, _v2736 - 1, 2, 2));
    }), _v2731.kind === "mirror" && (d.fillStyle = "#cfd8e8", d.fillRect(_v2732 - 1, _v2733 - 1, 3, 3)), _v2731.kind === "ritual" && (d.fillStyle = _v2731.st === "done" ? "#ffd0e0" : "#d06a8a", d.fillRect(_v2732 - 1, _v2733 - 1, 3, 3)), _v2731.kind === "enc" && (_v2731.st === "idle" || _v2731.st === "active" || _v2731.st === "chest") && (d.fillStyle = gt[_v2731.type].col, d.fillRect(_v2732 - 1, _v2733 - 1, 3, 3)), _v2731.kind === "shrine" && !_v2731.used && (d.fillStyle = is.find(_v2737 => _v2737.k === _v2731.type).col, d.fillRect(_v2732 - 1, _v2733 - 1, 3, 3)));
  }
  (d.fillStyle = "#ffffff", d.fillRect(n.pl.x / K - 1, n.pl.y / K - 1, 2, 2), d.globalAlpha = 1);
};
C4 = function (_v2738) {
  for (let _v2739 in n.pl.cds) n.pl.cds[_v2739] > 0 && (n.pl.cds[_v2739] -= _v2738);
  for (let _v2740 of ["parryT", "noutouT", "drT", "disT", "waveT", "parryBuffT", "shrineT", "shrineT2", "noHitT"]) n.pl[_v2740] > 0 && (n.pl[_v2740] -= _v2738);
  (n.pl.noHitT = n.pl.noHitT || 0, n.pl.sinceHit = (n.pl.sinceHit || 0) + _v2738, hC(_v2738));
  for (let _v2741 = n.sticks.length - 1; _v2741 >= 0; _v2741--) {
    let _v2742 = n.sticks[_v2741];
    (_v2742.t -= _v2738, _v2742.host && !_v2742.host.dead && (_v2742.x = _v2742.host.x, _v2742.y = _v2742.host.y), _v2742.t <= 0 && Rg(_v2742, 1));
  }
  for (let _v2743 of n.bells.slice()) (_v2743.t -= _v2738, _v2743.t <= 0 && Bu(_v2743, "crack"));
  for (let _v2744 of n.walls) {
    if ((_v2744.t -= _v2738, _v2744.tick -= _v2738, I() < 0.8)) {
      let _v2745 = I();
      n.parts.push({
        x: Hs(_v2744.x1, _v2744.x2, _v2745) + B(-1, 1),
        y: Hs(_v2744.y1, _v2744.y2, _v2745),
        z: 1,
        vx: B(-4, 4),
        vy: 0,
        vz: B(20, 45),
        g: -20,
        life: 0.5,
        max: 0.5,
        col: oe(["#ff6a1a", "#ffb040", "#ffd060"]),
        s: 1,
        glow: !0,
        drag: 1
      });
    }
    if (_v2744.tick <= 0) {
      _v2744.tick = 0.3;
      for (let _v2746 of n.mons) _v2746.dead || _v2746.dummy && !1 || qd(_v2746.x, _v2746.y, _v2744.x1, _v2744.y1, _v2744.x2, _v2744.y2) < _v2746.r + 6 && (ae(_v2746, _v2744.c, _v2744.src, 0.3, {
        el: "fire"
      }), !_v2746.dead && !_v2746.ign && (_v2746.ign = {
        dps: _v2744.c.avg * 0.3,
        t: 2,
        src: _v2744.src
      }));
    }
  }
  n.walls = n.walls.filter(_v2747 => _v2747.t > 0);
  for (let _v2748 of n.bombs.slice()) {
    if ((_v2748.t -= _v2738, _v2748.pulse -= _v2738, _v2748.pulse <= 0)) {
      (_v2748.pulse = 0.5, n.fx.push({
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
      for (let _v2749 of n.mons) !_v2749.dead && (_v2749.x - _v2748.x) ** 2 + (_v2749.y - _v2748.y) ** 2 < _v2748.r * _v2748.r && (_v2749.chill = 1, _v2749.chillAmt = Math.max(_v2749.chillAmt, 0.35));
    }
    _v2748.t <= 0 && Xd(_v2748, 1);
  }
  mC(_v2738);
  for (let _v2750 of n.mons) (_v2750.mark && (_v2750.mark.t -= _v2738, _v2750.mark.t <= 0 && (_v2750.mark = null)), _v2750.expT > 0 && (_v2750.expT -= _v2738, _v2750.expT <= 0 && (_v2750.res.cold += _v2750.expA || 0, _v2750.expA = 0)));
  for (let _v2751 of n.objs) if (_v2751.kind === "shrine" && !_v2751.used && (_v2751.x - n.pl.x) ** 2 + (_v2751.y - n.pl.y) ** 2 < 324) {
    (_v2751.used = !0, n.pl.shrine = _v2751.type, n.pl.shrineT = 45, n.pl.shrine2 = null, n.pl.shrineT2 = 0);
    let _v2752 = is.find(_v2753 => _v2753.k === _v2751.type), _v2754 = null;
    OmHas("omen_prayer") && OmTake("omen_prayer", _v2751.x, _v2751.y - 20) && (_v2754 = oe(is.filter(_v2755 => _v2755.k !== _v2751.type)), n.pl.shrine2 = _v2754.k, n.pl.shrineT2 = 45, E(_v2751.x, _v2751.y, 40, [_v2754.col, "#ffffff"], 90, 0.9, {
      glow: !0,
      vz: 140,
      g: 60
    }));
    ($("shrine"), ke(_v2752.n + (_v2754 ? " + " + _v2754.n : ""), _v2752.d + (_v2754 ? " · " + _v2754.d : "") + " · 45 秒"), E(_v2751.x, _v2751.y, 40, [_v2752.col, "#ffffff"], 90, 0.9, {
      glow: !0,
      vz: 140,
      g: 60
    }));
  }
};
tf = function (_v2756) {
  return !!(n.pl && (n.pl.shrineT > 0 && n.pl.shrine === _v2756 || n.pl.shrineT2 > 0 && n.pl.shrine2 === _v2756));
};
Fe = function (_v2757, _v2758, _v2759, _v2760, _v2761, _v2762, _v2763 = {}) {
  let _v2764 = {
    id: _v2757,
    t: _v2758,
    slots: _v2759,
    text: _v2760,
    stat: _v2761,
    ranges: _v2762,
    w: _v2763.w || 100,
    lv: _v2763.lv || US,
    div: _v2763.div || 1,
    nm: _v2763.nm || "",
    dsec: !!_v2763.dsec,
    fac: _v2763.fac || null,
    pair: Array.isArray(_v2762[0][0])
  };
  (ta[_v2757] = _v2764, pf.push(_v2764));
};
Kt = function (_v2765, _v2766) {
  let _v2767 = pe[_v2765.base];
  return {
    uid: Sa(),
    kind: "item",
    base: _v2765.base,
    slot: _v2767.slot,
    ilvl: Math.max(_v2766 || 1, _v2765.lv || 1),
    rarity: 3,
    uniq: _v2765.id,
    impl: Lg(_v2767),
    mods: _v2765.mods.map(([_v2768, _v2769]) => ({
      id: _v2768,
      t: "U",
      ur: _v2769,
      v: wo(_v2769)
    })),
    name: _v2765.n,
    rsock: Ol(_v2767.slot) ? 1 : 0,
    runes: []
  };
};
/* 异界高级预兆：让任意通货都能作用于特殊词缀栏（不再只限崇高/混沌/剥离/神圣，也不再限制稀有度/词缀数） */
/* 普通规则预检：把这颗通货按“没有异界高级预兆”的普通逻辑在装备副本上跑一次，
   合法返回 null，不合法返回普通规则给的原话。不修改真装备、不消耗任何预兆。 */
function __riftNormalProbe(_v0cur, _v0it) {
  var omSave = null, curSave = null, hadOm = false;
  try {
    if (u && u.om) {
      omSave = JSON.parse(JSON.stringify(u.om));
      if (u.om.omen_special) { hadOm = true; delete u.om.omen_special; }
    }
    if (u && u.cur) curSave = JSON.parse(JSON.stringify(u.cur));
    var clone = JSON.parse(JSON.stringify(_v0it));
    var res;
    try { res = c9(_v0cur, clone); } catch (e) { res = "这颗通货不能用于该装备"; }
    return (res === null) ? null : res;
  } catch (e) {
    return null;
  } finally {
    try {
      if (u) {
        if (omSave) u.om = omSave;
        else if (hadOm) { u.om = u.om || {}; }
        if (curSave) u.cur = curSave;
      }
    } catch (e2) {}
  }
}
function __riftOmenSpecialApply(_v0cur, _v0it) {
  try {
    if (!_v0it || _v0it.kind !== "item") return "只能用于装备";
    var sp = (_v0it.mods || []).filter(function (m) { return m && AffixClass(m) === "sp" && !Qr(_v0it, m); });
    var cap = (AffixSlotCfg().special || 2);
    var isRemove = (_v0cur === "annul" || _v0cur === "scour");
    var isDivine = (_v0cur === "divine");
    var changed = false;
    if (isRemove && sp.length) {
      _v0it.mods.splice(_v0it.mods.indexOf(sp[Math.floor(I() * sp.length)]), 1);
      changed = true;
    } else if (isDivine && sp.length) {
      sp.forEach(function (m) {
        if (m.ur) m.v = wo(m.ur);
        else {
          var def = qa(_v0it, m.id);
          if (def && def.ranges) m.v = wo(def.ranges[m.ti]);
        }
      });
      changed = true;
    } else {
      // 其它通货（以及剥离/神圣在没有特殊词缀时）：加一条特殊词缀；满 2 条就替换一条；总词缀满则替换一条普通词缀
      if (sp.length >= cap) {
        _v0it.mods.splice(_v0it.mods.indexOf(sp[Math.floor(I() * sp.length)]), 1);
      } else if (AffixTotalRoom(_v0it) <= 0) {
        var victim = (_v0it.mods || []).filter(function (m) { return !Qr(_v0it, m) && AffixClass(m) !== "sp"; });
        if (!victim.length) return "没有可替换的词缀";
        _v0it.mods.splice(_v0it.mods.indexOf(victim[Math.floor(I() * victim.length)]), 1);
      }
      var sides = I() < 0.5 ? ["P", "S"] : ["S", "P"], nmod = null;
      var __essIds = null;
      try { if (typeof Yu !== "undefined" && Yu[_v0cur]) __essIds = Yu[_v0cur]; } catch (eEss) {}
      var __forceT2 = false;
      try { __forceT2 = !!(window && window.__RIFT_ADV_T2); } catch (eFT) {}
      for (var si = 0; si < sides.length && !nmod; si++) nmod = O4(_v0it, sides[si], __essIds || undefined);
      if (!nmod) return "没有可用词缀";
      // 高级通货 + 预兆：把特殊词缀强制定在最高两阶（T1/T2）
      if (__forceT2) {
        try {
          var __spDef = qa(_v0it, nmod.id);
          if (__spDef && __spDef.ranges && __spDef.ranges.length) {
            var __top = __spDef.ranges.length - 1;
            var __ti2 = __top - (I() < 0.5 ? 0 : 1);
            if (__ti2 < 0) __ti2 = 0;
            nmod.ti = __ti2;
            nmod.v = wo(__spDef.ranges[__ti2]);
          }
        } catch (eFT2) {}
      }
      nmod.sp = 1;
      _v0it.mods.push(nmod);
      changed = true;
    }
    if (!changed) return "特殊词缀处理失败";
    try { OmTake("omen_special"); } catch (e0) {}
    try { na(_v0it); } catch (e1) {}
    return null;
  } catch (e) { return "特殊词缀处理失败"; }
}
c9 = function (_v2770, _v2771) {
  if (!_v2771) return "无效目标";
  if (_v2770 === "ember" || _v2770 === "ash") return "在藏身处的余烬祭坛使用";
  if (q[_v2770].grp === "bone") return DsDesecrate(_v2770, _v2771);
  let _v2772 = q[_v2770].grp;
  if (_v2772 === "sig") return "首领印记用于在地图装置开启裂隙之心";
  if (_v2771.kind === "meta" || _v2771.kind === "buff") return "无法对该宝石使用通货";
  // 异界高级预兆：只允许“当前装备按普通规则本来就能用”的通货；能用则改为作用于特殊词缀栏
  if (OmHas("omen_special") && _v2771.kind === "item" && !({ rune: 1, sock: 1, omen: 1 })[_v2772]) {
    var __omProbe = __riftNormalProbe(_v2770, _v2771);
    if (__omProbe) return __omProbe;
    return __riftOmenSpecialApply(_v2770, _v2771);
  }
  if (_v2770.startsWith("jewel")) {
    if (_v2771.kind !== "gem") return "珠宝匠石只能用于主动技能宝石";
    let _v2773 = ({
      jewel1: 2,
      jewel2: 3,
      jewel3: 4
    })[_v2770];
    return _v2771.sock >= 5 ? "插槽已达上限 5" : _v2771.sock !== _v2773 ? q[_v2770].n + "只能把插槽从 " + _v2773 + " 提升到 " + (_v2773 + 1) + " (当前 " + _v2771.sock + ")" : (_v2771.sock++, null);
  }
  if (_v2771.kind === "gem" || _v2771.kind === "sup" || _v2771.kind === "buff") return "这种通货不能用于宝石";
  if (_v2771.corrupted && _v2772 !== "rune") return "已腐化的物品无法改造";
  if (_v2771.ds) return "有未揭示的渎灵词缀 · 先到灵魂之井揭示";
  if (_v2771.sanctified) return "已圣化的物品无法改造";
  let _v2774 = _v2771.rarity === 3;
  if (_v2770 === "mods_runesmith_artificer") {
    if (_v2771.kind !== "item") return "只能用于装备";
    if (!Ol(_v2771.slot)) return "该部位没有符文插槽";
    if (_v2771.rsUsed || (_v2771.specialRsock || 0) > 0) return "这件装备已经使用过符文师工匠石 · 每件只能使用一次";
    var __rsIlvl = Math.max(1, +_v2771.ilvl || 1);
    var __rsAdd = Math.max(1, Math.floor(__rsIlvl / 15));
    _v2771.rsock = (_v2771.rsock || 0) + __rsAdd;
    _v2771.specialRsock = (_v2771.specialRsock || 0) + __rsAdd;
    _v2771.rsUsed = 1;
    return null;
  }
  if (_v2770 === "artif") {
    if (_v2771.kind !== "item") return "只能用于装备";
    var __artCap = Ol(_v2771.slot) + (_v2771.extraSock || 0);
    if (!__artCap) return "该部位没有符文插槽";
    var __normalUsed = Math.max(0, (_v2771.rsock || 0) - (_v2771.specialRsock || 0));
    return __normalUsed >= __artCap ? "符文插槽已满 (" + __artCap + ")" : (_v2771.rsock = (_v2771.rsock || 0) + 1, null);
  }
  if (_v2772 === "rune") {
    if (_v2771.kind !== "item") return "只能用于装备";
    if (!_v2771.rsock) return "没有符文插槽 · 先用工匠石开孔";
    _v2771.runes = _v2771.runes || [];
    var __rsSpecialStart = _v2771.rsock - (_v2771.specialRsock || 0);
    if (_v2771.runes.length >= __rsSpecialStart) {
      var __rsRune = _v2770, __rsRn = (q[__rsRune] && q[__rsRune].rn) || null, __rsOK = false;
      try {
        for (var __rwi2 = 0; __rwi2 < RUNE_WORDS.length && !__rsOK; __rwi2++) {
          var __seq = RUNE_WORDS[__rwi2].seq || [];
          for (var __si = 0; __si < __seq.length; __si++) {
            var __sv = __seq[__si];
            if (__sv === __rsRune || (__rsRn != null && String(__sv) === String(__rsRn))) { __rsOK = true; break; }
          }
        }
      } catch (eRW) {}
      if (!__rsOK) return "特殊符文槽只能放入符文之语所需的符文";
    }
    _v2771.runes.length >= _v2771.rsock && _v2771.runes.shift();
    _v2771.runes.push(_v2770);
    return null;
  }
  if (_v2772 === "ess") {
    if (_v2771.kind !== "item") return "只能用于装备";
    if (_v2774) return "传奇装备无法使用精华";
    let _v2776 = _v2771.mods.filter(_v2777 => Qr(_v2771, _v2777) || AffixClass(_v2777) !== "regular"), _v2778 = _v2771.meta, _v2779 = _v2780 => _v2780 !== _v2778 && AffixSideCap(_v2771, _v2780) - AffixRegCount(_v2771, _v2780) > 0, _v2781 = {
      r: _v2771.rarity,
      mods: _v2771.mods,
      meta: _v2771.meta
    };
    (_v2771.rarity = 2, _v2771.mods = _v2776.slice(), delete _v2771.meta);
    // 精华：给 2 条本精华词缀，且都固定 T1/T2（不管装备等级）
    let __essAdded = 0;
    for (let _v2783 of ["P", "S", "P", "S"]) {
      if (__essAdded >= 2) break;
      if (!_v2779(_v2783)) continue;
      let __essMod = O4(_v2771, _v2783, Yu[_v2770]);
      if (!__essMod) continue;
      try {
        var __essDef = qa(_v2771, __essMod.id);
        if (__essDef && __essDef.ranges && __essDef.ranges.length) {
          var __essTop = __essDef.ranges.length - 1;
          var __essTi = __essTop - (I() < 0.5 ? 0 : 1);
          if (__essTi < 0) __essTi = 0;
          __essMod.ti = __essTi;
          __essMod.v = wo(__essDef.ranges[__essTi]);
        }
      } catch (eEssTi) {}
      _v2771.mods.push(__essMod);
      __essAdded++;
    }
    if (!__essAdded) {
      (_v2771.rarity = _v2781.r, _v2771.mods = _v2781.mods, _v2781.meta && (_v2771.meta = _v2781.meta));
      let _v2784 = ["P", "S"].some(_v2785 => SC(_v2771, _v2785, Yu[_v2770], []).length);
      return _v2776.length && _v2784 ? "精华词缀那一侧被锁定或已满" : "该部位无法获得此精华的词缀";
    }
    // 只保留这 2 条精华词缀，不再随机补满其它词缀
    return (na(_v2771), null);
  }
  if (_v2770 === "vaal") {
    if (_v2771.kind !== "item") return "只能用于装备";
    let _v2786 = !Ya.dry && u, _v2787 = !!_v2786 && (u.pity || 0) >= _i, _v2788 = Mm(_v2771, () => l9(_v2771, _v2787));
    return (_v2786 && (u.pity = _v2788 === "impl" || _v2788 === "sock" ? 0 : (u.pity || 0) + 1, Ya.last = {
      k: "vaal",
      out: _v2788,
      pity: _v2787
    }), null);
  }
  switch (_v2770) {
    case "trans":
      if (_v2771.rarity !== 0) return "需要普通物品";
      (_v2771.rarity = 1, wt(_v2771));
      break;
    case "aug":
      if (_v2771.rarity !== 1) return "需要魔法物品";
      if (_v2771.mods.length >= 2) return "词缀已满";
      if (!wt(_v2771)) return "没有可用词缀";
      break;
    case "alt":
      {
        if (_v2771.rarity !== 1) return "需要魔法物品";
        let _v2789 = _v2771.mods.filter(_v2790 => Qr(_v2771, _v2790) || AffixClass(_v2790) !== "regular");
        if (_v2789.length >= 2) return "没有可以改变的词缀(破溃或已锁定)";
        (_v2771.mods = _v2789, wt(_v2771), !_v2789.length && Do(0.5) && wt(_v2771));
        break;
      }
    case "alch":
      if (_v2771.rarity !== 0) return "需要普通物品";
      _v2771.rarity = 2;
      for (let _v2791 = 0; _v2791 < 4; _v2791++) wt(_v2771);
      if (_v2771.kind === "map" && re("affix_zeal")) wt(_v2771);
      break;
    case "regal":
      if (_v2771.rarity !== 1) return "需要魔法物品";
      _v2771.rarity = 2;
      if (!wt(_v2771)) {
        _v2771.rarity = 1;
        return "没有可用词缀";
      }
      na(_v2771);
      return null;
    case "chaos":
      {
        if (_v2771.rarity !== 2) return "需要稀有物品";
        if (_v2771.kind === "map") {
          let _v2792 = OmHas("omen_chaos_quant") ? "quant" : OmHas("omen_chaos_mon") ? "mon" : OmHas("omen_chaos_rar") ? "player" : null;
          if (_v2792) return (DsMapChaos(_v2771, _v2792), OmTake(_v2792 === "quant" ? "omen_chaos_quant" : _v2792 === "mon" ? "omen_chaos_mon" : "omen_chaos_rar"), null);
        }
        if (OmHas("omen_special")) {
          let _v2793 = _v2771.mods.filter(_v2794 => AffixClass(_v2794) === "special" && !Qr(_v2771, _v2794));
          if (!_v2793.length) return "特殊词缀栏没有可改变的词缀";
          let _v2795 = _v2771.mods.slice(), _v2796 = oe(_v2793);
          _v2771.mods.splice(_v2771.mods.indexOf(_v2796), 1);
          let _v2797 = AffixAddSpecial(_v2771);
          if (_v2797) {
            _v2771.mods = _v2795;
            return _v2797;
          }
          OmTake("omen_special");
          return null;
        }
        let _v2798 = OmHas("omen_whittle") ? "omen_whittle" : OmHas("omen_chaos_p") ? "omen_chaos_p" : OmHas("omen_chaos_s") ? "omen_chaos_s" : null, _v2799 = _v2798 === "omen_chaos_p" ? "P" : _v2798 === "omen_chaos_s" ? "S" : null, _v2800 = _v2771.mods.filter(_v2801 => !Qr(_v2771, _v2801) && AffixClass(_v2801) === "regular" && (!_v2799 || _v2801.t === _v2799));
        if (!_v2800.length) {
          return _v2799 ? _v2799 === "P" ? "没有可移除的前缀" : "没有可移除的后缀" : wt(_v2771) ? null : "没有可以改变的词缀(破溃或已锁定)";
        }
        let _v2802 = _v2798 === "omen_whittle" ? OmWhittle(_v2771, _v2800) : oe(_v2800);
        if (!_v2802) return "没有可消减的低等级词缀";
        _v2771.mods.splice(_v2771.mods.indexOf(_v2802), 1);
        if (!wt(_v2771)) {
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
          let _v2803 = _v2771.mods.filter(_v2804 => AffixClass(_v2804) === "special" && !Qr(_v2771, _v2804));
          if (!_v2803.length) return "特殊词缀栏没有可移除的词缀";
          _v2771.mods.splice(_v2771.mods.indexOf(oe(_v2803)), 1);
          OmTake("omen_special");
          _v2771.rarity === 1 && na(_v2771);
          return null;
        }
        if (OmHas("omen_abyss_light")) {
          let _v2805 = _v2771.mods.filter(_v2806 => _v2806.dsec && !Qr(_v2771, _v2806));
          return _v2805.length ? (_v2771.mods.splice(_v2771.mods.indexOf(oe(_v2805)), 1), OmTake("omen_abyss_light"), _v2771.rarity === 1 && na(_v2771), null) : "没有渎灵词缀";
        }
        let _v2807 = OmHas("omen_annul_p") ? "P" : OmHas("omen_annul_s") ? "S" : null, _v2808 = _v2771.mods.filter(_v2809 => !Qr(_v2771, _v2809) && AffixClass(_v2809) === "regular" && (!_v2807 || _v2809.t === _v2807));
        return _v2808.length ? (_v2771.mods.splice(_v2771.mods.indexOf(oe(_v2808)), 1), _v2771.rarity === 1 && na(_v2771), _v2807 && OmTake(_v2807 === "P" ? "omen_annul_p" : "omen_annul_s"), null) : _v2807 ? _v2807 === "P" ? "没有可移除的前缀" : "没有可移除的后缀" : "没有可以移除的词缀(破溃或已锁定)";
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
          let _v2819 = _v2771.mods.filter(_v2820 => AffixClass(_v2820) === "special" && !Qr(_v2771, _v2820));
          if (!_v2819.length) return "特殊词缀栏没有可重随的词缀";
          for (let _v2821 of _v2819) {
            if (_v2821.ur) _v2821.v = wo(_v2821.ur); else {
              let _v2822 = qa(_v2771, _v2821.id);
              _v2821.v = wo(_v2822.ranges[_v2821.ti]);
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
            _v2823.v = _v2823.v.map(_v2824 => Math.max(1, Math.round(_v2824 * B(0.78, 1.22))));
          }), _v2771.sanctified = !0);
          return null;
        }
        if (OmHas("omen_blessed")) {
          if (!_v2771.impl || !_v2771.impl.length) return "没有固有词缀";
          (OmTake("omen_blessed"), _v2771.impl.forEach(_v2825 => {
            let _v2826 = _v2825.v.map(_v2827 => Math.max(0, Math.round(_v2827 * B(0.85, 1.15))));
            _v2825.v = _v2826.length === 2 ? [Math.min(..._v2826), Math.max(..._v2826)] : _v2826;
          }));
          return null;
        }
        let _v2828 = _v2771.mods.filter(_v2829 => !Qr(_v2771, _v2829));
        if (!_v2828.length) return "没有可以重随的词缀(破溃或已锁定)";
        for (let _v2830 of _v2828) if (_v2830.ur) _v2830.v = wo(_v2830.ur); else {
          let _v2831 = qa(_v2771, _v2830.id);
          _v2830.v = wo(_v2831.ranges[_v2830.ti]);
        }
        return null;
      }
    case "frac":
      return _v2771.kind !== "item" && _v2771.kind !== "soul" ? "只能用于装备或兽魂" : _v2771.rarity !== 2 ? "需要稀有装备" : AffixRegCount(_v2771, "P") + AffixRegCount(_v2771, "S") < 4 ? "需要至少 4 条常规词缀" : _v2771.mods.some(_v2832 => _v2832.fr) ? "每件装备只能有 1 条破溃词缀" : (oe(_v2771.mods.filter(_v2833 => AffixClass(_v2833) === "regular" && AffixIsSide(_v2833))).fr = !0, null);
    case "scour":
      {
        if (_v2771.rarity === 0 || _v2774) return "需要魔法或稀有物品";
        (_v2771.mods = _v2771.mods.filter(_v2834 => Qr(_v2771, _v2834) || AffixClass(_v2834) !== "regular"), delete _v2771.meta, _v2771.rarity = MC(_v2771.mods.filter(_v2835 => AffixClass(_v2835) === "regular")));
        break;
      }
    case "chance":
      {
        if (_v2771.rarity !== 0) return "需要普通物品";
        let _v2836 = OmHas("omen_ancient");
        if (_v2836 && _v2771.kind !== "item") return "远古预兆只能作用于装备";
        if (_v2771.kind === "item") {
          let _v2837 = yt.filter(_v2838 => pe[_v2838.base].slot === _v2771.slot && (_v2771.slot !== "W" || pe[_v2838.base].wt === pe[_v2771.base].wt));
          if (_v2837.length && (_v2836 || I() < 0.04)) {
            let _v2839 = Kt(oe(_v2837), _v2771.ilvl);
            return (Object.assign(_v2771, _v2839, {
              uid: _v2771.uid
            }), _v2836 && OmTake("omen_ancient"), null);
          }
          if (_v2836) return "该部位没有可用的传奇";
        }
        if (OmHas("omen_chance2")) {
          if (_v2771.kind !== "item") return "机遇预兆只能作用于装备";
          (_v2771.rarity = 2, OmTake("omen_chance2"));
          for (let _v2840 = 0; _v2840 < 4; _v2840++) wt(_v2771);
          break;
        }
        if (I() < 0.7) (_v2771.rarity = 1, wt(_v2771), Do(0.5) && wt(_v2771)); else {
          _v2771.rarity = 2;
          for (let _v2841 = 0; _v2841 < 4; _v2841++) wt(_v2771);
        }
        break;
      }
    default:
      return "未知通货";
  }
  return (na(_v2771), null);
};
zc = function (_v2842, _v2843) {
  _v2842 = _v2842 || "witch";
  let _v2844 = le[_v2842], _v2845 = Ut[_v2842];
  (u = {
    v: Eg,
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
    tree: [Er(_v2842)],
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
    shopHeat: {},
    advClassStart: _v2842,
    god: !1
  }, u.advTree = ["adv_root", _v2842 + "_start"], Tt.forEach(_v2846 => u.cur[_v2846] = 0), Object.assign(u.cur, {
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
  let _v2847 = Pa.find(_v2848 => _v2848.wt === _v2844.wt && _v2848.lv === 1), _v2849 = Ft(_v2847, 5, 0);
  (_v2849.rarity = 1, _v2849.mods = _v2844.wt === "staff" ? [Vi("spellInc", 1), Vi("castSpd", 0)] : [Vi("physInc", 1), Vi("atkSpd", 0)], na(_v2849), u.equip.weapon = _v2849, u.equip.body = Ft(pe[_v2842 === "witch" || _v2842 === "monk" || _v2842 === "sorceress" ? "学徒长袍" : "粗布外衣"], 1, 0), u.equip.boots = Ft(pe.旅者之靴, 1, 0), u.equip.ring1 = Ft(pe.红玉戒指, 3, 0), u.equip.belt = Ft(pe.皮腰带, 1, 0));
  let _v2850 = ({
    ranger: "锐利箭袋",
    huntress: "木圆盾",
    samurai: "胁差",
    warrior: "木圆盾"
  })[_v2842];
  (_v2850 && (u.equip.offhand = Ft(pe[_v2850], 1, 0)), u.inv.push(Zt(1), Zt(1), Zt(1), Zt(2), Ft(pe.皮革兜帽, 3, 0), Ft(pe.皮手套, 3, 0)), _v2842 === "witch" && u.inv.push(Ft(pe.骨制短杖, 3, 1), Ft(pe.骨制法器, 3, 0)), _v2844.skills.forEach(([_v2851, _v2852, _v2853], _v2854) => u.skills[_v2854] = vo(_v2851, _v2852, _v2853)), _v2844.gems.forEach(([_v2855, _v2856, _v2857]) => u.gems.push(vo(_v2855, _v2856, _v2857))), _v2844.sups.forEach(_v2858 => u.gems.push(Ys(_v2858))));
  let _v2859 = new Set([..._v2844.skills, ..._v2844.gems].map(_v2860 => _v2860[0]));
  (_v2845.pool.forEach(_v2861 => {
    _v2859.has(_v2861) || u.gems.push(vo(_v2861, 1, 2));
  }), ["huntress", "monk", "samurai", "warrior", "jianke"].includes(_v2842) && u.gems.push(vo("cyclone", 1, 2)), u.buffs[0] = yl(_v2845.buff), u.gems.push(ur(({
    witch: "meta_cof",
    ranger: "meta_coc",
    huntress: "meta_coc",
    monk: "meta_coms",
    samurai: "meta_coms",
    mercenary: "meta_coc",
    sorceress: "meta_coc",
    warrior: "meta_coms",
    jianke: "meta_coc"
  })[_v2842])), u.gems.push(Ys("hourglass"), Ys(({
    witch: "icebite",
    ranger: "ricochet",
    huntress: "frenzyGain",
    monk: "powerSiphon",
    samurai: "rage",
    mercenary: "autoload",
    sorceress: "arcanetempo",
    warrior: "armourexplode",
    jianke: "jkEcho"
  })[_v2842])), _v2843 && pc(), G("char:bind", {
    fresh: !0,
    id: null
  }));
};
C1 = function (_v2862) {
  if (typeof _v2862.v != "number") return null;
  for (; _v2862.v < Eg && kC[_v2862.v]; ) kC[_v2862.v](_v2862);
  if (_v2862.v !== Eg) return null;
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
    // 旧存档可能带有已不存在的一层天赋/升华节点 key，先过滤，避免渲染时读未定义节点的 .b 崩溃
    try {
      if (Array.isArray(_v2862.tree) && typeof xe !== "undefined" && xe && Array.isArray(xe.nodes)) {
        var __validTree = {};
        xe.nodes.forEach(function (n) { if (n && n.id != null) __validTree[n.id] = 1; });
        _v2862.tree = _v2862.tree.filter(function (k) { return !!__validTree[k]; });
      }
      if (Array.isArray(_v2862.ascNodes) && _v2862.asc && typeof Ce !== "undefined" && Ce[_v2862.asc] && Array.isArray(Ce[_v2862.asc].nodes)) {
        var __validAsc = {};
        Ce[_v2862.asc].nodes.forEach(function (n) { if (n && n.k != null) __validAsc[n.k] = 1; });
        _v2862.ascNodes = _v2862.ascNodes.filter(function (k) { return !!__validAsc[k]; });
      }
      // 旧版本曾解除宝石等级上限，读档时把自然等级收回到 40（装备加等级仍可超过 40）
      try {
        var __clampGem = function (g) {
          if (g && g.kind === "gem" && g.lvl > 30) g.lvl = 30;
        };
        if (Array.isArray(_v2862.gems)) _v2862.gems.forEach(__clampGem);
        if (Array.isArray(_v2862.skills)) _v2862.skills.forEach(__clampGem);
      } catch (e2) {}
      // 过滤旧存档里已删除的主动/元技能宝石（例如工程示例），避免读取 X[gid].icon 崩溃
      try {
        if (typeof se !== "undefined" && se) {
          var __knownSkill = function (g) {
            if (!g || g.kind !== "gem") return true;
            return !!(se[g.gid]);
          };
          if (Array.isArray(_v2862.gems)) _v2862.gems = _v2862.gems.filter(__knownSkill);
          if (Array.isArray(_v2862.skills)) _v2862.skills = _v2862.skills.map(function (sk) { return sk && __knownSkill(sk) ? sk : null; });
          if (Array.isArray(_v2862.gems)) {
            _v2862.gems.forEach(function (g) {
              if (g && Array.isArray(g.inner)) g.inner = g.inner.map(function (it) { return it && se[it.gid] ? it : null; });
            });
          }
        }
      } catch (e3) {}
      // 旧存档可能还带着已删除的辅助宝石（例如工程示例），过滤掉避免宝石页读取未定义 .mech
      try {
        var __supTable = typeof ne !== "undefined" ? ne : null;
        if (__supTable) {
          if (Array.isArray(_v2862.gems)) _v2862.gems = _v2862.gems.filter(function (g) { return !g || g.kind !== "sup" || !!__supTable[g.gid]; });
          if (Array.isArray(_v2862.skills)) _v2862.skills.forEach(function (sk) {
            if (sk && Array.isArray(sk.sup)) sk.sup = sk.sup.filter(function (id) {
              var __k = id && typeof id === "object" ? (id.gid || id.id || id.k) : id;
              return !!__supTable[__k];
            });
          });
        }
      } catch (e1) {}
    } catch (e0) {}
    AtlasMigrateSave(_v2862);
    AffixMigrateSave(_v2862);
    AdvMigrateSave(_v2862);
    ShopHeatMigrateSave(_v2862);
  } catch (_v2866) {
    console.warn("[atlas] save migration failed", _v2866);
  }
  return _v2862;
};
m9 = function () {
  (A("kill:loot", _v2867 => {
    let _v2868 = _v2867.m;
    (_v2868.rift && (re("rift3") && (_v2867.dm *= 1.4), re("rift7") && (_v2867.dm *= 1.6)), _v2868.rar === 3 ? (re("boss1") && (_v2867.dm *= 1.5), _v2868.awake && (_v2867.dm *= 2), re("boss7") && (_v2867.dm *= 3), re("boss4") && (_v2867.rb += 100)) : re("boss7") && (_v2867.dm *= 0.6), _v2868.envHit && re("enc3") && (_v2867.dm *= 2), _v2868.encM && re("enc7") && (_v2867.dm *= 1.5));
  }), A("kill", ({m: _v2869}) => {
    if (!(_v2869.rar !== 3 || _v2869.guard)) {
      if ((re("boss3") && I() < 0.08 && ue(_v2869.x, _v2869.y, {
        kind: "cur",
        cur: "divine"
      }), re("boss6") && I() < 0.15)) {
        let _v2870 = yt.filter(_v2871 => !_v2871.noDrop && _v2871.lv <= n.Z.lvl + 5);
        _v2870.length && ue(_v2869.x, _v2869.y, {
          kind: "it",
          it: Kt(oe(_v2870), n.Z.lvl)
        });
      }
      if (re("boss7") && I() < 0.03) for (let _v2872 = 0; _v2872 < 3; _v2872++) ue(_v2869.x, _v2869.y, {
        kind: "cur",
        cur: "divine"
      });
    }
  }), A("boss:map", _v2873 => {
    re("boss2") && (_v2873.up = 0.68);
  }), A("boss:kill", ({m: _v2874}) => q5(_v2874)));
};
Object.assign(pS, {
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
  "你的下一个废除石只会移除前缀": "your next Orb of Annulment will only remove prefix modifiers",
  "你的下一个废除石只会移除后缀": "your next Orb of Annulment will only remove suffix modifiers",
  "你的下一个混沌石只会移除前缀": "your next Chaos Orb will only remove prefix modifiers",
  "你的下一个混沌石只会移除后缀": "your next Chaos Orb will only remove suffix modifiers",
  "你的下一个机会石会把普通物品升级为相同类别的随机传奇": "your next Orb of Chance will upgrade the item into a random Unique of the same Item Class",
  "你达到低血状态时会完全回复生命、魔力和能量护盾": "fully recover your Life, Mana and Energy Shield when you reach Low Life",
  "你被击败时防止 75% 的经验值损失": "prevent 75% of Experience loss when you are defeated",
  "你点击的下一个神龛会提供一个额外效果": "the next Shrine you click will grant an additional effect"
});
var DS_SLOTS = "WQSKXHBGFLRAO";
Fe("ds_es", "P", DS_SLOTS, "+{0} 能量护盾", "es", [[60, 85], [90, 120]], {
  nm: "渎灵·溺光",
  dsec: !0,
  fac: "amanamu",
  w: 1,
  lv: [1, 50]
});
Fe("ds_cast", "S", DS_SLOTS, "施法速度提高 {0}%", "castSpd", [[12, 16], [18, 24]], {
  nm: "渎灵·低语",
  dsec: !0,
  fac: "amanamu",
  w: 1,
  lv: [1, 50]
});
Fe("ds_skill", "P", DS_SLOTS, "+{0} 所有技能宝石等级", "skillLvl", [[1, 1], [2, 2]], {
  nm: "渎灵·虚空",
  dsec: !0,
  fac: "amanamu",
  w: 1,
  lv: [1, 50]
});
Fe("ds_life", "P", DS_SLOTS, "+{0} 最大生命", "life", [[70, 90], [100, 130]], {
  nm: "渎灵·血肉",
  dsec: !0,
  fac: "kurgal",
  w: 1,
  lv: [1, 50]
});
Fe("ds_atk", "S", DS_SLOTS, "攻击速度提高 {0}%", "atkSpd", [[12, 15], [16, 22]], {
  nm: "渎灵·喘息",
  dsec: !0,
  fac: "kurgal",
  w: 1,
  lv: [1, 50]
});
Fe("ds_leech", "S", DS_SLOTS, "击中偷取 {0}% 伤害为生命", "leech", [[20, 30], [35, 50]], {
  nm: "渎灵·黑血",
  dsec: !0,
  fac: "kurgal",
  w: 1,
  lv: [1, 50],
  div: 10
});
Fe("ds_crit", "S", DS_SLOTS, "暴击率提高 {0}%", "critInc", [[40, 55], [60, 80]], {
  nm: "渎灵·军团",
  dsec: !0,
  fac: "ulaman",
  w: 1,
  lv: [1, 50]
});
Fe("ds_move", "S", DS_SLOTS, "移动速度提高 {0}%", "moveInc", [[15, 19], [20, 26]], {
  nm: "渎灵·跋涉",
  dsec: !0,
  fac: "ulaman",
  w: 1,
  lv: [1, 50]
});
Fe("ds_rarity", "S", DS_SLOTS, "物品稀有度提高 {0}%", "rarity", [[35, 45], [50, 65]], {
  nm: "渎灵·特克罗",
  dsec: !0,
  fac: "tecrod",
  w: 1,
  lv: [1, 50]
});
Fe("ds_res", "S", DS_SLOTS, "+{0}% 所有元素抗性", "resAll", [[12, 16], [17, 22]], {
  nm: "渎灵·回响",
  dsec: !0,
  w: 1,
  lv: [1, 50]
});
(function () {
  var _v2875 = VA;
  VA = function () {
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
  var _v2884 = nt;
  nt = function (_v2885, _v2886, _v2887, _v2888, _v2889) {
    var _v2890 = _v2884.apply(this, arguments);
    try {
      if (_v2890 && !_v2890.minion && !_v2890.ally) {
        var _v2891 = DelHpBonus();
        if (_v2891 > 0) {
          _v2890.maxhp *= 1 + _v2891;
          _v2890.hp = _v2890.maxhp;
        }
        if (n.delRun) {
          _v2890.del = !0;
          _v2890.delMul = 1.2 + (n.del ? n.del.depth : 0) / 100 * 1.2;
          if (_v2889 === 3 && !_v2890.delBoss) {
            _v2890.delBoss = !0;
            if (n.delRun.layer >= n.delRun.max) {
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
  var _v2893 = dd;
  dd = function () {
    try {
      if (n && n.Z && n.Z.type === "map" && n.delRun) {
        var _v2894 = null, _v2895 = 4900;
        for (var _v2896 = 0; _v2896 < n.objs.length; _v2896++) {
          var _v2897 = n.objs[_v2896];
          if (_v2897.kind !== "b-delportal") continue;
          var _v2898 = (_v2897.x - n.pl.x) ** 2 + (_v2897.y - n.pl.y) ** 2;
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
  var _v2900 = di;
  di = function (_v2901, _v2902, _v2903) {
    var _v2904 = _v2900.apply(this, arguments);
    try {
      if (n.delRun && _v2901 && _v2901.delBoss) DelBossKilled(_v2901);
    } catch (_v2905) {}
    return _v2904;
  };
  var _v2906 = Wc;
  Wc = function () {
    var _v2907 = _v2906.apply(this, arguments);
    try {
      if (!DelLayerMap && n.delRun && (!n.Z || n.Z.type !== "map" || !n.Z.delLayer)) {
        n.delRun = null;
        n.del = null;
      }
      if (n.del && (!n.Z || n.Z.type !== "map")) DeliriumEnd();
    } catch (_v2908) {}
    return _v2907;
  };
  var _v2909 = VA;
  VA = function () {
    _v2909();
    try {
      if (n.delRun) for (var _v2910 = 0; _v2910 < n.objs.length; _v2910++) {
        var _v2911 = n.objs[_v2910];
        if (_v2911.kind === "b-delportal") _v2912(_v2911);
      }
    } catch (_v2913) {}
  };
  var _v2914 = U$;
  U$ = function () {
    var _v2915 = _v2914.apply(this, arguments) || [];
    try {
      if (n.delRun) _v2915.push(["惊悸迷雾 · 第 " + n.delRun.layer + "/" + DEL_LAYERS + " 层", !0]);
    } catch (_v2916) {}
    return _v2915;
  };
  function _v2912(_v2917) {
    var _v2918 = Math.round(_v2917.x), _v2919 = Math.round(_v2917.y), _v2920 = n.T;
    d.save();
    d.globalCompositeOperation = "lighter";
    var _v2921 = d.createRadialGradient(_v2918, _v2919, 0, _v2918, _v2919, 22);
    (_v2921.addColorStop(0, "rgba(220,200,255,.65)"), _v2921.addColorStop(0.6, "rgba(150,110,255,.25)"), _v2921.addColorStop(1, "rgba(90,50,180,0)"), d.fillStyle = _v2921, d.beginPath(), d.arc(_v2918, _v2919, 22, 0, 6.283), d.fill());
    d.strokeStyle = "#cdb4ff";
    d.lineWidth = 1.2;
    d.beginPath();
    d.arc(_v2918, _v2919 - 6, 12 + Math.sin(_v2920 * 3) * 1.5, 0, 6.283);
    d.stroke();
    (d.fillStyle = "#e8ddff", d.font = "7px monospace", d.textAlign = "center", d.fillText("F 下一层", _v2918, _v2919 - 22));
    d.restore();
  }
})();
(function () {
  var _v2922 = di;
  di = function (_v2923, _v2924, _v2925) {
    var _v2926 = _v2922.apply(this, arguments);
    try {
      if (_v2923 && n.Z && n.Z.type === "map" && _v2923.rar === 3) {
        var _v2927 = Math.max(1, n.Z && n.Z.lvl || 80);
        var _v2928 = function (_v2929, _v2930) {
          if (Ua[_v2929] && I() < _v2930) ue(_v2923.x, _v2923.y, {
            kind: "it",
            it: Kt(Ua[_v2929], _v2927)
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
  var _v2932 = ou;
  ou = function (_v2933) {
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
    _v2936.__bpCollapsed = false;
    _v2936.addEventListener("click", function (ev) {
      var t = ev.target;
      if (!t || !t.getAttribute || !t.getAttribute("data-bp-toggle")) return;
      ev.preventDefault();
      ev.stopPropagation();
      _v2936.__bpCollapsed = !_v2936.__bpCollapsed;
      var kids = _v2936.children;
      for (var ki = 1; ki < kids.length; ki++) kids[ki].style.display = _v2936.__bpCollapsed ? "none" : "";
      t.textContent = _v2936.__bpCollapsed ? "▸" : "▾";
    });
    try {
      if (matchMedia("(max-width: 900px), (pointer: coarse)").matches) {
        _v2936.__bpCollapsed = true;
        _v2936.style.width = "132px";
        _v2936.style.fontSize = "10px";
        _v2936.style.opacity = "0.9";
      }
    } catch (e) {}
    return _v2936;
  }
  function _v2940(_v2941, _v2942, _v2943) {
    return '<div style="display:flex;justify-content:space-between;gap:6px">' + '<span style="color:#8e98b0">' + _v2941 + "</span>" + '<b style="color:' + (_v2943 || "#e8eefc") + '">' + _v2942 + "</b></div>";
  }
  function _v2944() {
    if (!n || !n.Z || n.state !== "play" || n.Z.type !== "map") {
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
    if (n.del) _v2949.push(_v2940("惊悸迷雾", "亢奋 " + n.del.depth + "%", "#cfd8e8")); else if (n.objs.some(function (_v2950) {
      return _v2950.kind === "mirror" && _v2950.st === "idle";
    })) _v2949.push(_v2940("惊悸迷雾", "镜子待进入", "#cfd8e8")); else _v2949.push(_v2940("惊悸迷雾", "—", "#556"));
    if (n.simRun) _v2949.push(_v2940("迷雾副本", "第 " + n.simRun.layer + "/" + SIM_LAYERS + " 层", "#c8a8ff")); else _v2949.push(_v2940("迷雾副本", "—", "#556"));
    var _v2951 = n.objs.filter(function (_v2952) {
      return _v2952.kind === "ritual";
    });
    if (_v2951.length) {
      var _v2953 = _v2951.filter(function (_v2954) {
        return _v2954.st === "done";
      }).length;
      _v2949.push(_v2940("驱灵仪式", _v2953 + "/" + _v2951.length + " 祭坛 · 剩余 " + (_v2951.length - _v2953) + " · 贡品 " + RitTribute(), "#ffd0e0"));
    } else _v2949.push(_v2940("驱灵仪式", "—", "#556"));
    var _v2955 = n.objs.find(function (_v2956) {
      return _v2956.kind === "abyss";
    });
    if (_v2955) {
      var _v2957 = (_v2955.fissures || []).filter(function (_v2958) {
        return _v2958.closed;
      }).length, _v2959 = (_v2955.fissures || []).length, _v2960 = _v2955.st === "fissures" ? _v2957 + "/" + _v2959 : _v2955.st === "pit" ? "巨坑清怪" : _v2955.st === "done" ? "保险箱待开" : "已开启";
      _v2949.push(_v2940("深渊", _v2960, "#9dffb4"));
    } else _v2949.push(_v2940("深渊", "—", "#556"));
    var _v2961 = n.objs.filter(function (_v2962) {
      return _v2962.kind === "shrine";
    });
    if (_v2961.length) _v2949.push(_v2940("神龛", _v2961.filter(function (_v2963) {
      return _v2963.used;
    }).length + "/" + _v2961.length));
    var _v2964 = n.objs.filter(function (_v2965) {
      return _v2965.kind === "rift";
    });
    if (_v2964.length) _v2949.push(_v2940("裂隙", _v2964.filter(function (_v2966) {
      return _v2966.st === "done";
    }).length + "/" + _v2964.length));
    var _v2967 = n.objs.filter(function (_v2968) {
      return _v2968.kind === "box";
    });
    if (_v2967.length) _v2949.push(_v2940("宝箱", _v2967.filter(function (_v2969) {
      return _v2969.open;
    }).length + "/" + _v2967.length));
    _v2949.push(_v2940("图谱点", Math.max(0, (u.atlasPts || 0) - (u.atlas && u.atlas.length || 0)) + " 可用", "#ffe8b0"));
    var _v2970 = '<div style="color:#9dffb4;font-size:11px;border-bottom:1px solid #2e3444;padding-bottom:3px;margin-bottom:3px;cursor:grab" title="按住拖动可移动 · 双击复位">异界进度 ⠿<span data-bp-toggle="1" style="float:right;cursor:pointer;padding:0 2px;color:#8e98b0">' + (_v2936 && _v2936.__bpCollapsed ? "▸" : "▾") + '</span></div>' + _v2949.join("");
    if (_v2970 !== _v2937) {
      _v2936.innerHTML = _v2970;
      _v2937 = _v2970;
      if (_v2936.__bpCollapsed) {
        var _bpKids = _v2936.children;
        for (var _bki = 1; _bki < _bpKids.length; _bki++) _bpKids[_bki].style.display = "none";
      }
    }
  }
  function _v2971() {
    try {
      if (!n.Z || n.Z.type !== "map" || !n.mons) return;
      for (var _v2972 = 0; _v2972 < n.mons.length; _v2972++) {
        var _v2973 = n.mons[_v2972];
        if (!_v2973 || _v2973.dead || !(_v2973.rar === 3 || _v2973.simBoss || _v2973 === n.Z.boss)) continue;
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
  var _v2994 = Zw;
  Zw = function (_v2995) {
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
  var _v2998 = nt;
  nt = function (_v2999, _v3000, _v3001, _v3002, _v3003) {
    var _v3004 = _v2998.apply(this, arguments);
    try {
      if (_v3004 && n.simRun) {
        if (_v3003 === 3 && !_v3004.simBoss) {
          _v3004.simBoss = !0;
          if (n.simRun.layer >= n.simRun.max) {
            _v3004.maxhp *= BAL.simFinalHpMul;
            _v3004.hp = _v3004.maxhp;
            _v3004.name = "最终·" + _v3004.name;
          } else _v3004.name = "拟像首领·" + _v3004.name;
        }
      }
    } catch (_v3005) {}
    return _v3004;
  };
  var _v3006 = di;
  di = function (_v3007, _v3008, _v3009) {
    var _v3010 = _v3006.apply(this, arguments);
    try {
      if (n.simRun && _v3007 && _v3007.simBoss) SimBossKilled(_v3007);
    } catch (_v3011) {}
    return _v3010;
  };
  var _v3012 = dd;
  dd = function () {
    try {
      if (n && n.Z && n.Z.type === "map" && n.simRun) {
        var _v3013 = null, _v3014 = 4900;
        for (var _v3015 = 0; _v3015 < n.objs.length; _v3015++) {
          var _v3016 = n.objs[_v3015];
          if (_v3016.kind !== "b-simportal") continue;
          var _v3017 = (_v3016.x - n.pl.x) ** 2 + (_v3016.y - n.pl.y) ** 2;
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
  var _v3019 = Wc;
  Wc = function () {
    var _v3020 = _v3019.apply(this, arguments);
    try {
      if (!SimLayerMap && (n.simRun || n.sim) && (!n.Z || n.Z.type !== "map" || !n.Z.simLayer)) {
        n.simRun = null;
        n.sim = null;
      }
    } catch (_v3021) {}
    return _v3020;
  };
  var _v3022 = U$;
  U$ = function () {
    var _v3023 = _v3022.apply(this, arguments) || [];
    try {
      if (n.simRun) _v3023.push(["迷雾副本 · 第 " + n.simRun.layer + "/" + SIM_LAYERS + " 层", !0]);
    } catch (_v3024) {}
    return _v3023;
  };
})();
(function () {
  var _v3025 = window.HOTFIX;
  if (!_v3025) return;
  try {
    if (_v3025.currencies) for (var _v3026 in _v3025.currencies) if (q[_v3026]) Object.assign(q[_v3026], _v3025.currencies[_v3026]);
    if (_v3025.mods) for (var _v3027 in _v3025.mods) if (ta[_v3027]) Object.assign(ta[_v3027], _v3025.mods[_v3027]);
    if (_v3025.bal) Object.assign(BAL, _v3025.bal);
    try {
      RuneApplyConfig(BAL.runes);
    } catch (_v3028) {
      console.warn("[rune] hotfix apply failed", _v3028);
    }
    SIM_LAYERS = BAL.simLayers;
    if (typeof _v3025.atlasCap === "number") Br = _v3025.atlasCap;
    if (_v3025.uniques) for (var _v3029 in _v3025.uniques) {
      var _v3030 = Ua[_v3029] || yt.find(function (_v3031) {
        return _v3031.id === _v3029;
      });
      if (_v3030) Object.assign(_v3030, _v3025.uniques[_v3029]);
    }
    if (typeof _v3025.apply === "function") _v3025.apply({
      P: q,
      Ct: ta,
      Ur: un,
      Oe: yt,
      aa: Ua,
      Na: Ks,
      le: pe,
      BAL: BAL,
      get As() {
        return Br;
      },
      set As(_v3032) {
        Br = _v3032;
      },
      get u() {
        return u;
      },
      get o() {
        return n;
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
    st: ["晕眩阈值提高 20–30%", "击败稀有怪物时，获得它的词缀，持续 60 秒"],
    sr: [[20, 30], null],
    srt: ["晕眩阈值提高 {0}%", "击败稀有怪物时，获得它的词缀，持续 60 秒"],
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
    st: ["20% 的药剂回复量立即生效", "每拥有一个重复的法师遗产，所有法师遗产效果提高 25–50%"],
    sr: [null, [25, 50]],
    srt: ["20% 的药剂回复量立即生效", "每拥有一个重复的法师遗产，所有法师遗产效果提高 {0}%"],
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
    if (Ua[_v3037.id]) return;
    if (!pe[_v3037.base]) {
      console.warn("[暗金扩展] 基底不存在, 已跳过: " + _v3037.base + " (" + _v3037.id + ")");
      return;
    }
    _v3037.mods = _v3037.mods || [];
    _v3037.sp = _v3037.sp || [];
    _v3037.st = _v3037.st || [];
    _v3037.fl = _v3037.fl || "";
    _v3037.src = _v3037.src || "world";
    var _v3038 = _v3037.mods.filter(function (_v3039) {
      return !_v3039 || !_v3039[0] || !ta[_v3039[0]] && !un[_v3039[0]];
    });
    if (_v3038.length) {
      console.warn("[暗金扩展] 未知词缀, 已跳过: " + _v3037.id + " -> " + _v3038.map(function (_v3040) {
        return _v3040 && _v3040[0];
      }).join(","));
      return;
    }
    yt.push(_v3037);
    Ua[_v3037.id] = _v3037;
    _v3036.push(_v3037.id);
  });
  if (_v3036.length) console.info("[暗金扩展] 已加载新暗金: " + _v3036.join(", "));
  window.__EXTRA_UNIQUES = _v3035;
})();
(function () {
  function _v3041(_v3042) {
    return _v3042.sr.map(function (_v3043) {
      return _v3043 ? de(_v3043[0], _v3043[1]) : null;
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
    var _v3053 = _v3052 && _v3052.uniq ? Ua[_v3052.uniq] : null;
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
  var _v3061 = Kt;
  Kt = function (_v3062, _v3063) {
    var _v3064 = _v3061.apply(this, arguments);
    try {
      if (_v3064 && _v3062 && _v3062.sr) _v3064.ur = _v3041(_v3062);
    } catch (_v3065) {}
    return _v3064;
  };
  var _v3066 = qs;
  qs = function (_v3067) {
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
  if (typeof Tt !== "undefined" && Tt && Tt.length >= 0) {
    Tt.length = 0;
    Object.keys(q).forEach(function (_v3076) {
      Tt.push(_v3076);
    });
  }
} catch (_v3077) {
  console.warn("[port] rebuild lt", _v3077);
}
try {
  if (typeof Ma !== "undefined" && typeof Ks !== "undefined") {
    Ma = {};
    Ks.forEach(function (_v3078) {
      _v3078.nodes.forEach(function (_v3079, _v3080) {
        _v3079.b = _v3078.key;
        _v3079.i = _v3080;
        Ma[_v3079.k] = _v3079;
      });
    });
  }
} catch (_v3081) {
  console.warn("[port] rebuild Ts", _v3081);
}
try {
  ["ds_es", "ds_cast", "ds_skill", "ds_life", "ds_atk", "ds_leech", "ds_crit", "ds_move", "ds_rarity", "ds_res"].forEach(function (_v3082) {
    if (ta[_v3082] && pf.indexOf(ta[_v3082]) < 0) pf.push(ta[_v3082]);
  });
} catch (_v3083) {
  console.warn("[port] rebuild zn", _v3083);
}
try {
  if (typeof vS === "function") vS();
} catch (_v3084) {
  console.warn("[port] x1", _v3084);
}
try {
  if (typeof eR === "function") eR();
} catch (_v3085) {
  console.warn("[port] Cx", _v3085);
}
try {
  if (typeof WL === "function") WL();
} catch (_v3086) {
  console.warn("[port] qv", _v3086);
}
document.addEventListener("keydown", function (_v3087) {
  if (_v3087.key !== "Escape") return;
  try {
    if (n.menu) return;
    if (n.held) {
      Ts(null);
      _v3087.preventDefault();
      _v3087.stopImmediatePropagation();
      return;
    }
    if (n.tab) {
      n.tab = null;
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
      if (n.menu) return;
      if (n.held) {
        Ts(null);
        _v3090.preventDefault();
        _v3090.stopImmediatePropagation();
        return;
      }
      if (n.tab) {
        Ot();
        try {
          n.tab = null;
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
  var _usBase = Ss;
  Ss = function () {
    try {
      if (window.__escGuardUntil && Date.now() < window.__escGuardUntil) return;
    } catch (_v3094) {}
    return _usBase.apply(this, arguments);
  };
} catch (_v3095) {}
/* 18.0.3 原生无尽裂隙门：F/点击 直接打开层数选择（基础 obj:use 在移植块里被绕过） */
(function () {
  function __gateNear() {
    try {
      if (!n || !n.pl || !n.objs) return null;
      var best = null, bd = 70 * 70;
      for (var i = 0; i < n.objs.length; i++) {
        var ob = n.objs[i];
        if (!ob || ob.kind !== "tgate") continue;
        var d = (ob.x - n.pl.x) * (ob.x - n.pl.x) + (ob.y - n.pl.y) * (ob.y - n.pl.y);
        if (d < bd) { bd = d; best = ob; }
      }
      return best;
    } catch (e) { return null; }
  }
  function __openGate() {
    try { if (typeof ng === "function") { ng(); return true; } } catch (e) { console.error("无尽裂隙打开失败", e); }
    return false;
  }
  window.__openRiftGate = __openGate;
  window.addEventListener("keydown", function (ev) {
    if (ev && ev.key === "F7") { ev.preventDefault(); ev.stopPropagation(); __riftDiag(); return; }
    if (ev && ev.key === "F8") { ev.preventDefault(); ev.stopPropagation(); __riftShot(); return; }
    var k = ev && (ev.key || "").toLowerCase();
    if (k !== "f") return;
    // 自定义交互对象兜底：灵魂之井 / 仪式 / 拟像
    try {
      if (n && n.pl && n.objs && n.state === "play") {
        var near = null, nd = 70 * 70;
        for (var qi = 0; qi < n.objs.length; qi++) {
          var qo = n.objs[qi];
          if (!qo || (qo.kind !== "well" && qo.kind !== "ritual" && qo.kind !== "simulacrum" && qo.kind !== "mirror")) continue;
          var qd = (qo.x - n.pl.x) * (qo.x - n.pl.x) + (qo.y - n.pl.y) * (qo.y - n.pl.y);
          if (qd < nd) { nd = qd; near = qo; }
        }
        if (near) {
          ev.preventDefault(); ev.stopPropagation();
          if (near.kind === "well") { DsWell(); return; }
          if (near.kind === "ritual") { RitualInteract(near); return; }
          if (near.kind === "simulacrum") { SimulacrumInteract(); return; }
          if (near.kind === "mirror") { DeliriumStart(near); return; }
        }
      }
    } catch (e) { console.error("对象交互失败", e); }
    // 无尽裂隙层内：前往下一层（基础 obj:use 没被触发时兜底）
    try {
      if (n && n.pl && n.objs && n.Z && n.Z.tower) {
        var te = null, td = 70 * 70;
        for (var i = 0; i < n.objs.length; i++) {
          var ob = n.objs[i];
          if (!ob || ob.kind !== "texit") continue;
          var d2 = (ob.x - n.pl.x) * (ob.x - n.pl.x) + (ob.y - n.pl.y) * (ob.y - n.pl.y);
          if (d2 < td) { td = d2; te = ob; }
        }
        if (te) { ev.preventDefault(); ev.stopPropagation(); if (typeof h$ === "function") h$(te); return; }
      }
    } catch (e) { console.error("下一层打开失败", e); }
    if (!__gateNear()) return;
    ev.preventDefault();
    ev.stopPropagation();
    __openGate();
  }, true);
  window.addEventListener("pointerdown", function (ev) {
    try {
      if (!d || !n || !n.pl) return;
      var g = __gateNear();
      if (!g) return;
      var d = (St && St.s) || 1;
      var sx = (g.x * d - (St.l || 0) * d), sy = (g.y * d - (St.t || 0) * d);
      // 点击门附近（世界坐标换算到画布像素）
      var cv = document.getElementById("cv");
      if (!cv) return;
      var r = cv.getBoundingClientRect();
      var dx = ev.clientX - r.left, dy = ev.clientY - r.top;
      var dpr = cv.width / (r.width || cv.width);
      if (Math.hypot(dx - sx * 1, dy - sy * 1) < 64 * (dpr || 1)) { ev.preventDefault(); __openGate(); }
    } catch (e) {}
  }, true);
})();
/* 无尽裂隙入口使用 18.0.3 藏身处原生「无尽裂隙门」(kind:"tgate")，
   旧的移植块调试入口在 18.0.3 上会调用旧地图函数失败，已移除。 */
(function () {
  try {
    var _v3102 = typeof window !== "undefined" && window.RIFT_EXTRA_SKILLS || [];
    var _v3103 = typeof window !== "undefined" && window.RIFT_EXTRA_SUPPORTS || [];
    var _v3104 = typeof Pb !== "undefined" && Pb && Pb.SK ? Pb.SK : typeof se !== "undefined" ? se : null;
    var _v3105 = typeof tb !== "undefined" && tb && tb.SUP ? tb.SUP : typeof ne !== "undefined" ? ne : null;
    if (!_v3104 || !_v3105) {
      console.warn("[mods] 技能/辅助表不可用，跳过新宝石");
      return;
    }
    function _v3106(_v3107, _v3108) {
      try {
        if (typeof Ye !== "undefined" && Ye && !Ye[_v3107]) Ye[_v3107] = Ye[_v3108] || Ye.arc || "";
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
      if (_v3113.icon) {
        try {
          if (typeof W !== "undefined" && W) W[_v3112.id] = _v3113.icon;
          if (typeof Ye !== "undefined" && Ye) Ye[_v3112.id] = _v3113.icon;
        } catch (e1) {}
      }
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
    if (typeof q !== "undefined" && typeof Tt !== "undefined") {
      _v3118.forEach(function (_v3121) {
        if (!_v3121 || !_v3121.id || _v3121.enabled === false || q[_v3121.id]) return;
        var _v3122 = {};
        for (var _v3123 in _v3121) if (_v3123 !== "id" && _v3123 !== "enabled" && _v3123 !== "like") _v3122[_v3123] = _v3121[_v3123];
        if (!_v3122.n) _v3122.n = _v3121.id;
        if (!_v3122.d) _v3122.d = "";
        if (!_v3122.grp) _v3122.grp = "basic";
        if (_v3122.v == null) _v3122.v = 0.5;
        if (_v3122.advLike && q[_v3122.advLike]) _v3122.v = Math.round(q[_v3122.advLike].v * (_v3122.vMult || 100));
        q[_v3121.id] = _v3122;
        if (_v3121.advLike && q[_v3121.advLike]) {
          window.__RIFT_ADV = window.__RIFT_ADV || {};
          window.__RIFT_ADV[_v3121.id] = { like: _v3121.advLike };
        }
        if (Tt.indexOf(_v3121.id) < 0) Tt.push(_v3121.id);
        _v3106(_v3121.id, "chaos");
        if (_v3121.like && q[_v3121.like]) _v3119[_v3121.id] = _v3121.like;
        _v3120.push(_v3121.id);
      });
      if (!window.__RIFT_CUR_WRAPPED) {
        window.__RIFT_CUR_WRAPPED = 1;
        var _v3124 = eo, _v3125 = lp, _v3126 = Hi;
        var __advCraft = function (like, item) {
          if (!item || item.kind !== "item") return _v3124.apply(this, arguments);
          var extra = [].slice.call(arguments, 2);
          var omenActive = false;
          try { omenActive = !!(typeof OmHas === "function" && OmHas("omen_special")); } catch (eO) {}
          // 开预兆时只执行一次：特殊词缀的 T2 由 __riftOmenSpecialApply 内部强制，不再做整件重试
          if (omenActive) {
            try { window.__RIFT_ADV_T2 = 1; } catch (eT0) {}
            var __advRes;
            try { __advRes = _v3124.apply(this, [like, item].concat(extra)); }
            finally { try { delete window.__RIFT_ADV_T2; } catch (eT1) {} }
            return __advRes;
          }
          var snap = JSON.parse(JSON.stringify({ mods: item.mods || [], rarity: item.rarity, impl: item.impl || [], meta: item.meta || null, corrupted: !!item.corrupted }));
          var omSnap = null, curSnap = null;
          if (omenActive) {
            try { omSnap = JSON.parse(JSON.stringify((u && u.om) || {})); curSnap = JSON.parse(JSON.stringify((u && u.cur) || {})); } catch (eOS) {}
          }
          var restoreItem = function () {
            item.mods = JSON.parse(JSON.stringify(snap.mods));
            item.rarity = snap.rarity;
            item.impl = JSON.parse(JSON.stringify(snap.impl));
            item.meta = snap.meta;
            item.corrupted = snap.corrupted;
          };
          var restoreOmen = function () {
            if (!omenActive) return;
            try {
              if (u && omSnap) u.om = JSON.parse(JSON.stringify(omSnap));
              if (u && curSnap) u.cur = JSON.parse(JSON.stringify(curSnap));
            } catch (eOR) {}
          };
          var tierOK = function (m) {
            try {
              var def = typeof qa === "function" ? qa(item, m.id) : null;
              if (!def || !def.ranges) return true;
              return def.ranges.length - (m.ti || 0) <= 2;
            } catch (e) { return true; }
          };
          var newOK = function (oldMods) {
            var cnt = {};
            (oldMods || []).forEach(function (m) { var k = m.id + ":" + (m.ti || 0); cnt[k] = (cnt[k] || 0) + 1; });
            var added = [];
            (item.mods || []).forEach(function (m) {
              var k = m.id + ":" + (m.ti || 0);
              if (cnt[k]) cnt[k]--; else added.push(m);
            });
            // 只要有 1 条新词缀达到 T2 就算成功（重随整件装备时不可能要求所有新词缀都是 T2）
            return added.length > 0 && added.some(tierOK);
          };
          for (var t = 0; t < 400; t++) {
            restoreItem();
            var oldMods = JSON.parse(JSON.stringify(item.mods));
            var res = _v3124.apply(this, [like, item].concat(extra));
            if (res) { restoreItem(); return res; }
            if (newOK(oldMods)) return null;
          }
          // 400 轮都没点出 T2：保留最后一次已经生效的结果，不再回滚报错（保证通货能用）
          return null;
        };
        eo = function (_v3127) {
          if (window.__RIFT_ADV && window.__RIFT_ADV[_v3127]) {
            return __advCraft.apply(this, [window.__RIFT_ADV[_v3127].like].concat([].slice.call(arguments, 1)));
          }
          return _v3124.apply(this, [_v3119[_v3127] || _v3127].concat([].slice.call(arguments, 1)));
        };
        lp = function (_v3128) {
          return _v3125.apply(this, [_v3119[_v3128] || _v3128].concat([].slice.call(arguments, 1)));
        };
        Hi = function (_v3129) {
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
      currencyTable: q,
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
  __advRender();
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
window.__PORT = window.__PORT || ({});
window.__PORT.version = "1.05-port";
/* 音频：静音要真正压掉主增益（环境底噪/残留循环声也要停），切屏时挂起音频上下文 */
(function () {
  try {
    if (window.__riftAudioFix) return;
    window.__riftAudioFix = 1;
    var gainFor = function () { return (n && n.muted) ? 0 : 0.28; };
    var apply = function () {
      try {
        if (typeof Ar !== "undefined" && Ar && Ar.gain) {
          var v = gainFor();
          if (Math.abs((Ar.gain.value || 0) - v) > 0.001) Ar.gain.value = v;
        }
      } catch (e) {}
    };
    window.__riftApplyAudio = apply;
    try {
      var __baseAa2 = os;
      os = function () { var r = __baseAa2.apply(this, arguments); apply(); return r; };
    } catch (e0) {}
    document.addEventListener("click", function (ev) {
      try {
        var t = ev.target && ev.target.closest ? ev.target.closest("#btnMute,#gmMute") : null;
        if (!t) return;
        setTimeout(apply, 0);
        setTimeout(apply, 80);
      } catch (e1) {}
    }, true);
    document.addEventListener("visibilitychange", function () {
      try {
        if (typeof Ge === "undefined" || !Ge) return;
        if (document.hidden) { if (Ge.state === "running") Ge.suspend(); }
        else { if (Ge.state === "suspended") Ge.resume(); apply(); }
      } catch (e2) {}
    });
    window.addEventListener("pagehide", function () { try { if (typeof Ge !== "undefined" && Ge && Ge.state === "running") Ge.suspend(); } catch (e3) {} });
    setInterval(apply, 1000);
    apply();
  } catch (e) {}
})();
/* 时空之肌：技能冷却 -2~-1 秒（按件 roll），冷却下限 0.1 秒；
   短 CD（<2 秒）技能同样吃减 CD，减到 0 以下按 0.1 秒算。 */
(function () {
  try {
    if (window.__temporalisHooked) return;
    window.__temporalisHooked = 1;
    var __tempReduction = function () {
      try {
        var it = u && u.equip && u.equip.body;
        if (!it || it.uniq !== "temporalis") return 0;
        var ur = it.ur;
        var v = Array.isArray(ur) && ur.length > 2 ? +ur[2] : -1.5;
        if (!isFinite(v) || v >= 0) v = -1.5;
        return v;
      } catch (e) { return 0; }
    };
    A("skill:calc", function (e) {
      try {
        if (!e || e.cdBase == null) return;
        var red = __tempReduction();
        if (!red) return;
        e.cdBase = Math.max(0.1, e.cdBase + red);
      } catch (err) {}
    }, 5);
    A("skill:start", function (e) {
      try {
        if (!e || !e.c || !(e.c.cd > 0)) return;
        if (!__tempReduction()) return;
        if (e.c.cd < 0.1) e.c.cd = 0.1;
      } catch (err) {}
    });
  } catch (e) {}
})();
/* 快速出售：稀有装备 / 本职业用不到的主手武器（背包页顶部按钮 + 商人页按钮） */
(function () {
  try {
    if (window.__quickSellHooked) return;
    window.__quickSellHooked = 1;
    var afterSell = function () {
      // 卖完立刻重绘背包，不用手动关开背包
      try { if (typeof Gs === "function") Gs(); } catch (e1) {}
      try { if (typeof refresh === "function") refresh(); } catch (e2) {}
    };
    var sellRare = function () {
      var arr = (u.inv || []).filter(function (i) { return i && i.kind === "item" && i.rarity === 2; });
      if (!arr.length) { P("没有可出售的稀有装备"); return; }
      arr.forEach(function (i) { er(i); });
      afterSell();
    };
    var sellIrr = function () {
      var arr = (u.inv || []).filter(function (i) {
        if (!i || i.kind !== "item" || i.rarity >= 3) return false;
        var b = pe[i.base];
        return !!(b && b.slot === "W" && b.wt && !Ut[u.cls].wts.includes(b.wt));
      });
      if (!arr.length) { P("没有无关的主手武器"); return; }
      arr.forEach(function (i) { er(i); });
      afterSell();
    };
    window.__QUICKSELL = { rare: sellRare, irrelevant: sellIrr };
    var bar = null;
    var countRare = function () {
      return (u.inv || []).filter(function (i) { return i && i.kind === "item" && i.rarity === 2; }).length;
    };
    var countIrr = function () {
      return (u.inv || []).filter(function (i) {
        if (!i || i.kind !== "item" || i.rarity >= 3) return false;
        var b = pe[i.base];
        return !!(b && b.slot === "W" && b.wt && !Ut[u.cls].wts.includes(b.wt));
      }).length;
    };
    var refresh = function () {
      try {
        if (!n || n.tab !== "inv") { if (bar) { bar.parentNode && bar.parentNode.removeChild(bar); bar = null; } return; }
        var pb = document.getElementById("pbody");
        if (!pb) return;
        // 背包内容会重绘，bar 被一起冲掉时重新插回顶部
        if (!bar || bar.parentNode !== pb) {
          bar = document.createElement("div");
          bar.id = "quickSellBar";
          bar.style.cssText = "display:flex;gap:6px;flex-wrap:wrap;margin:0 0 8px";
          bar.innerHTML = '<button class="btn small" data-qs="rare">快速出售稀有装备</button><button class="btn small" data-qs="irrelevant">快速出售无关主手武器</button>';
          pb.insertBefore(bar, pb.firstChild);
          bar.addEventListener("click", function (ev) {
            try {
              var t = ev.target && ev.target.closest ? ev.target.closest("[data-qs]") : null;
              if (!t) return;
              ev.preventDefault();
              ev.stopPropagation();
              if (t.getAttribute("data-qs") === "rare") sellRare(); else sellIrr();
            } catch (e2) {}
          });
        }
        if (bar.firstElementChild) bar.firstElementChild.textContent = "快速出售稀有装备 (" + countRare() + ")";
        if (bar.lastElementChild) bar.lastElementChild.textContent = "快速出售无关主手武器 (" + countIrr() + ")";
      } catch (e) {}
    };
    setInterval(refresh, 600);
  } catch (e) {}
})();
/* 抱团显著节点的「更多伤害」：dmgMore 按乘法生效（inc 类走基础属性系统） */
try {
  if (typeof JS === "object" && JS && !JS.dmgMore) JS.dmgMore = "更多伤害 +{v}%";
  if (!window.__dmgMoreHooked) {
    window.__dmgMoreHooked = 1;
    A("skill:calc", function (e) {
      try {
        if (!e) return;
        var m = AdvStatTotals().dmgMore || 0;
        if (m > 0) e.more *= 1 + m / 100;
      } catch (err) {}
    }, 70);
  }
} catch (e) {}
window.__PORT.ready = true;

/* ==================== v2.01 HUD 合并：基础 18.0.3 主渲染 + 自定义对象 overlay ====================
   旧 18.0.1 整段 Vb 覆盖会盖掉 18.0.3 的 HUD/优化（HP/ES 文字、药瓶、交互提示、木桩 DPS、
   伤害数字、200 格背包等）。这里不再覆盖 Vb：先调用基础 18.0.3 的 Vb，再用本 overlay 只补画
   自定义可见对象（深渊坑/裂隙 fissure、仪式、拟像门、迷雾镜、遗存碎片、自定义装置等）。 */
var __portBaseVb = Jw;
function __portDrawAbyss(ob) {
  var sealed = ob.st === "sealed" || ob.st === "done";
  var pulse = ob.st === "pit" ? 1 + Math.sin(n.T * 6) * 0.08 : 1;
  if (!sealed) {
    d.globalCompositeOperation = "lighter";
    d.fillStyle = "rgba(40,180,90,0.13)";
    d.globalAlpha = 1;
    d.beginPath(); d.ellipse(ob.x, ob.y, ob.r * 1.5 * pulse, ob.r * 1.05 * pulse, 0, 0, 6.283); d.fill();
    d.globalCompositeOperation = "source-over";
  }
  d.fillStyle = sealed ? "#0b1410" : "#06110c";
  d.globalAlpha = sealed ? 0.5 : 0.8;
  d.beginPath(); d.ellipse(ob.x, ob.y, ob.r, ob.r * 0.7, 0, 0, 6.283); d.fill();
  d.globalAlpha = sealed ? 0.22 : 0.75;
  d.strokeStyle = "#2ee6a8";
  d.lineWidth = 1.3;
  d.beginPath(); d.ellipse(ob.x, ob.y, ob.r, ob.r * 0.7, 0, 0, 6.283); d.stroke();
  var fs = ob.fissures || [];
  for (var i = 0; i < fs.length; i++) {
    var ff = fs[i];
    if (ff.closed) continue;
    var k = 1 + Math.sin(n.T * 4 + ff.x) * 0.2;
    d.globalCompositeOperation = "lighter";
    d.globalAlpha = 0.75 * k;
    d.strokeStyle = "#9dffb4";
    d.lineWidth = 1.4;
    d.beginPath(); d.moveTo(ff.x - 18, ff.y + 3); d.lineTo(ff.x - 7, ff.y - 3); d.lineTo(ff.x + 3, ff.y + 4); d.lineTo(ff.x + 16, ff.y - 2); d.stroke();
    d.globalAlpha = 0.16;
    d.strokeStyle = "#1e7a3c";
    d.lineWidth = 4.5;
    d.stroke();
    d.globalCompositeOperation = "source-over";
    d.globalAlpha = 1;
  }
  d.globalAlpha = 1;
  d.globalCompositeOperation = "source-over";
  d.lineWidth = 1;
}
/* 自定义地面对象：由 build 注入到基础 Vb 的实体绘制之前
/* 自定义地面对象：由 build 注入到基础 Vb 的实体绘制之前，保证角色/怪物画在井上面 */
var __riftPromptCache = {};
function __riftPromptSprite(text) {
  try {
    if (__riftPromptCache[text]) return __riftPromptCache[text];
    var scale = 4, fs = 28;
    var c = document.createElement("canvas");
    var cx = c.getContext("2d");
    cx.font = "600 " + fs + "px " + (typeof cn !== "undefined" && cn ? cn : "'Microsoft YaHei', sans-serif");
    var tw = cx.measureText(text).width;
    c.width = Math.ceil(tw) + 20;
    c.height = fs + 18;
    cx = c.getContext("2d");
    cx.font = "600 " + fs + "px " + (typeof cn !== "undefined" && cn ? cn : "'Microsoft YaHei', sans-serif");
    cx.textAlign = "center";
    cx.textBaseline = "middle";
    cx.fillStyle = "rgba(0,0,0,0.72)";
    cx.fillRect(0, 0, c.width, c.height);
    cx.fillStyle = "#ffffff";
    cx.fillText(text, c.width / 2, c.height / 2);
    __riftPromptCache[text] = c;
    return c;
  } catch (e) { return null; }
}
window.__portDrawGroundCustom = function () {
  try {
    if (!n || !n.Z || !d) return;
    try { window.__riftLastTransform = d.getTransform(); } catch (eT) {}
    var objs = n.objs || [];
    for (var i = 0; i < objs.length; i++) {
      var ob = objs[i];
      if (!ob || ob.kind === "rift") continue;
      d.save();
      try {
        if (ob.kind === "abyss") __portDrawAbyss(ob);
      else if (ob.kind === "well") DlWell(d, ob);
      else if (ob.kind === "mirror" && ob.st === "idle") DlMirror(d, ob);
      else if (ob.kind === "delshard") DlShardDraw(d, ob);
      else if (ob.kind === "simulacrum") DlSim(d, ob);
      else if (ob.kind === "b-simportal") drawSimPortal(ob);
      else if (ob.kind === "ritual") DlRitual(d, ob);
      } catch (eObj) {
        // 单个对象绘制失败不能中断整帧，否则后面的玩家/怪物/文字会一起消失
      } finally { d.restore(); }
    }
    try {
      if (n.state === "play" && n.pl && !n.pl.dead) {
        var __pr = null, __txt = "";
        for (var pi = 0; pi < objs.length; pi++) {
          var po = objs[pi];
          if (!po || (po.kind !== "well" && po.kind !== "ritual" && po.kind !== "simulacrum" && po.kind !== "b-simportal" && po.kind !== "mirror")) continue;
          var pd = (po.x - n.pl.x) * (po.x - n.pl.x) + (po.y - n.pl.y) * (po.y - n.pl.y);
          if (pd >= 70 * 70) continue;
          __pr = po;
          __txt = po.kind === "well" ? "F / 点击 打开灵魂之井" : po.kind === "ritual" ? (po.st === "done" ? "F / 点击 领取恩典" : po.st === "idle" ? "F / 点击 开始驱灵仪式" : "F / 点击 继续驱灵仪式") : po.kind === "mirror" ? "走入 / F / 点击 开启惊悸迷雾" : (u.simUnlocked ? "F / 点击 进入迷雾副本" : "F / 点击 解锁迷雾副本");
          break;
        }
        if (__pr) {
          try {
            var __sc2 = (St && St.s) || 0;
            if (__sc2) window.__riftPrompt = {
              text: __txt,
              x: (__pr.x - (St.l || 0)) * __sc2,
              y: (__pr.y - 42 - (St.t || 0)) * __sc2,
              size: Math.max(12, Math.min(30, 5.5 * __sc2))
            };
          } catch (e) {}
        }
      }
    } catch (e) {}
  } catch (e) {}
};
/* 自定义对象互动提示：DOM 固定显示，不依赖基础 Pa / 世界坐标 */
window.__portDrawCustom = function () {
  try {
    // 深渊巨坑 DOM 标记（不经过世界画布，避免污染文字/贴图）
    try {
      var mk = window.__riftAbyssMarker;
      window.__riftAbyssMarker = null;
      var mkEl = document.getElementById("riftAbyssMark");
      if (mk && mk.r) {
        if (!mkEl) {
          mkEl = document.createElement("div");
          mkEl.id = "riftAbyssMark";
          mkEl.style.cssText = "position:fixed;pointer-events:none;z-index:12;border-radius:50%;box-sizing:border-box;transform:translate(-50%,-50%);background:radial-gradient(ellipse at center,rgba(0,0,0,.5),rgba(0,0,0,0) 72%)";
          document.body.appendChild(mkEl);
        }
        mkEl.style.width = mk.r * 2 + "px";
        mkEl.style.height = mk.r * 1.44 + "px";
        mkEl.style.left = mk.x + "px";
        mkEl.style.top = mk.y + "px";
        mkEl.style.border = "2px solid " + (mk.sealed ? "#1e5a3c" : "#2ee6a8");
        mkEl.style.boxShadow = "0 0 10px rgba(46,230,168,.35)";
        mkEl.style.display = "block";
      } else if (mkEl) mkEl.style.display = "none";
    } catch (eMk) {}
    // 掉落名字改为 DOM 层渲染（见 __domLootLabels），画布内不再重复绘制，避免吞字时名字一起消失
    window.__riftLootLabels = [];
    // 互动提示改为 DOM 层渲染：即使画布文字层出问题也能看到 F 提示
    var el = document.getElementById("riftObjPrompt");
    if (!el) {
      try {
        el = document.createElement("div");
        el.id = "riftObjPrompt";
        el.style.cssText = "position:fixed;pointer-events:none;z-index:13;transform:translate(-50%,-50%);color:#fff;font:600 14px 'Microsoft YaHei',sans-serif;text-shadow:0 0 3px #000,1px 1px 0 #000;background:rgba(0,0,0,.72);padding:3px 8px;border-radius:3px;white-space:nowrap;display:none";
        (document.getElementById("app") || document.body).appendChild(el);
      } catch (eEl) { el = null; }
    }
    var pr = window.__riftPrompt;
    window.__riftPrompt = null;
    if (el) {
      if (pr && pr.text) {
        el.textContent = pr.text;
        el.style.left = pr.x + "px";
        el.style.top = pr.y + "px";
        el.style.fontSize = Math.max(12, Math.min(26, pr.size || 14)) + "px";
        el.style.display = "block";
      } else {
        el.style.display = "none";
      }
    }
  } catch (e) { try { d.restore(); } catch (e2) {} }
};
/* 视野/画布自愈：画布尺寸或视野缩放与 #stage 不一致时重建布局。
   修复「玩着玩着画面突然变小/黑屏只剩 HUD」——该现象本质是 ou() 在 stage 临时变小时跑过，
   留下 U0=1.2 的小视野而没有再恢复；这里每帧校验并自愈。 */
function __riftFixView() {
  try {
    if (typeof n === "undefined" || !n || !n.Z) return;
    var st = document.getElementById("stage");
    if (!st || !ft) return;
    var w = st.clientWidth || 0, h = st.clientHeight || 0;
    if (w < 50 || h < 50) return;
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    var wantW = Math.round(w * dpr), wantH = Math.round(h * dpr);
    var wantU0 = Math.max(1.2, Math.min(w / 480, h / 270)) * (n.touchMode && n.camZoom || 1);
    var bad = false;
    if (Math.abs(ft.width - wantW) > 2 || Math.abs(ft.height - wantH) > 2) bad = true;
    if (!isFinite(Fu) || Fu <= 0 || Math.abs(Fu - wantU0) > Math.max(0.03, wantU0 * 0.03)) bad = true;
    if (!isFinite(lo) || !isFinite(co) || lo <= 0 || co <= 0) bad = true;
    if (!isFinite(St.s) || St.s <= 0.1) bad = true;
    if (bad) {
      try { N1(); } catch (e1) {}
      try { window.__riftResetNext = true; } catch (e2) {}
      try { if (window.__riftErrors) { window.__riftErrors.push("layout repaired U0=" + Fu + " ot=" + ft.width + "x" + ft.height); if (window.__riftErrors.length > 20) window.__riftErrors.shift(); } } catch (e3) {}
    }
  } catch (e) {}
}
function __riftResetCtxState() {
  try {
    if (!d) return;
    d.setTransform(1, 0, 0, 1, 0, 0);
    d.globalAlpha = 1;
    d.globalCompositeOperation = "source-over";
    if ("filter" in d) d.filter = "none";
    d.shadowBlur = 0;
    d.shadowColor = "rgba(0,0,0,0)";
  } catch (e) {}
}
Jw = function () {
  try { if (window.__riftResetNext) { window.__riftResetNext = false; __riftResetCtxState(); } } catch (e) {}
  __riftFixView();
  __riftResetCtxState();
  try {
    __portBaseVb.apply(this, arguments);
  } catch (eVb) {
    try {
      window.__riftLastVbError = String(eVb) + "\n" + (eVb && eVb.stack || "");
      if (window.__riftErrors) { window.__riftErrors.push("Vb: " + String(eVb)); if (window.__riftErrors.length > 20) window.__riftErrors.shift(); }
    } catch (x) {}
    __riftResetCtxState();
  }
  try { window.__portDrawCustom(); } catch (e) {}
  __riftResetCtxState();
};
/* 通货图标补全：注册得比图标生成循环晚的通货，缺 hr/He 图标时
   一旦掉到地上，基础绘制在 loot 图标处每帧抛错，导致整帧中断（吞字/贴图消失）。
   这里给所有 F 通货补齐图标，并定期自检。 */
function __riftEnsureCurrencyIcons() {
  try {
    if (typeof q === "undefined" || !q || typeof Si === "undefined" || !Si) return;
    var ids = Object.keys(q);
    for (var i = 0; i < ids.length; i++) {
      var id = ids[i], meta = q[id];
      if (!meta || typeof meta !== "object") continue;
      if (Si[id]) continue;
      try {
        var c = document.createElement("canvas");
        c.width = 9; c.height = 9;
        var g = c.getContext("2d");
        if (!g) continue;
        g.fillStyle = "#0d0b10"; g.fillRect(0, 0, 9, 9);
        var col = meta.col || "#d8d0c0";
        for (var y = 0; y < 9; y++) for (var x = 0; x < 9; x++) {
          var dd = Math.sqrt((x - 4) * (x - 4) + (y - 4) * (y - 4));
          if (dd <= 4.2) { g.fillStyle = dd > 3.4 ? "#120e14" : col; g.fillRect(x, y, 1, 1); }
        }
        g.fillStyle = "rgba(255,255,255,0.8)"; g.fillRect(3, 2, 1, 1); g.fillRect(2, 3, 1, 1);
        Si[id] = c;
        if (typeof Ye !== "undefined" && Ye) Ye[id] = c.toDataURL();
      } catch (eIcon) {}
    }
  } catch (e) {}
}
try { __riftEnsureCurrencyIcons(); } catch (e) {}
setInterval(function () { try { __riftEnsureCurrencyIcons(); } catch (e) {} }, 3000);

/* ==================== v2.02 掉率集中配置 + 迷雾副本普通怪掉落 ====================
   调参入口：hotfix.json 的 bal.dropMul（缺省见 DROP_MUL_DEFAULT）。
   - 核心通货（神圣/崇高/混沌/剥离）权重降低；
   - 符文/精华权重小幅提升；预兆/遗存骨按概率额外多掉 1 个；
   - 迷雾副本普通怪改为受控物资掉落（关掉基础普通掉落后按本表补，奖励低于正常地图）。
   报告见 发布检查/v2.02- 检查报告 的「掉率调整前后对比」表。 */
var DROP_MUL_DEFAULT = {
  coreCur: 0.72,
  rune: 1.25,
  omen: 1.3,
  bone: 1.25,
  simNormal: { cur: 0.12, omen: 0.02, bone: 0.025, rune: 0.03, splinter: 0.015 }
};
function DropMulCfg() {
  var src = (BAL && BAL.dropMul && typeof BAL.dropMul === "object") ? BAL.dropMul : {};
  var out = {};
  for (var k in DROP_MUL_DEFAULT) {
    if (k === "simNormal") {
      out.simNormal = {};
      var s1 = src.simNormal || {}, s2 = DROP_MUL_DEFAULT.simNormal;
      for (var k2 in s2) out.simNormal[k2] = typeof s1[k2] === "number" ? s1[k2] : s2[k2];
    } else out[k] = typeof src[k] === "number" ? src[k] : DROP_MUL_DEFAULT[k];
  }
  return out;
}
var __dropMulApplied = !1;
function DropMulApplyOnce() {
  try {
    if (__dropMulApplied || typeof q === "undefined" || !q || typeof Tt === "undefined") return;
    __dropMulApplied = !0;
    var cfg = DropMulCfg();
    ["divine", "exalt", "chaos", "annul"].forEach(function (id) {
      if (q[id] && typeof q[id].w === "number") q[id].w = Math.max(0, q[id].w * cfg.coreCur);
    });
    Tt.forEach(function (id) {
      var d = q[id];
      if (d && (d.grp === "rune" || d.grp === "ess") && typeof d.w === "number") d.w = d.w * cfg.rune;
    });
  } catch (e) {}
}
/* 基础货币选择走 h0：第一次调用时应用权重调整（之后热修 B.A.L 已稳定） */
var __baseH0 = yc;
yc = function () {
  DropMulApplyOnce();
  return __baseH0.apply(this, arguments);
};
/* 预兆 / 遗存骨：按配置提供额外掉率（1.0 = 不变，1.3 = 额外 30% 再掉一个） */
var __baseOmDrop = OmDrop;
OmDrop = function () {
  var r = __baseOmDrop.apply(this, arguments);
  try {
    var extra = DropMulCfg().omen - 1;
    if (r && extra > 0 && I() < extra) __baseOmDrop.apply(this, arguments);
  } catch (e) {}
  return r;
};
var __baseDsBoneDrop = DsBoneDrop;
DsBoneDrop = function () {
  var r = __baseDsBoneDrop.apply(this, arguments);
  try {
    var extra = DropMulCfg().bone - 1;
    if (r && extra > 0 && I() < extra) __baseDsBoneDrop.apply(this, arguments);
  } catch (e) {}
  return r;
};
/* 迷雾副本普通怪：关闭基础普通掉落，按受控表补物资（首领仍走 SimBossKilled 原奖励） */
function SimNormalDrop(m) {
  try {
    if (!m || !n || !n.simRun) return;
    var c = DropMulCfg().simNormal;
    if (I() < c.cur) ue(m.x, m.y, { kind: "cur", cur: yc() });
    if (I() < c.omen) OmDrop(m.x, m.y);
    if (I() < c.bone) DsBoneDrop(m.x, m.y, 0);
    if (I() < c.rune) {
      var runes = Tt.filter(function (id) { return q[id] && q[id].grp === "rune" && (q[id].w || 0) > 0; });
      if (runes.length && typeof ht === "function") ue(m.x, m.y, { kind: "cur", cur: ht(runes, function (id) { return q[id].w || 1; }) });
    }
    if (I() < c.splinter) ue(m.x, m.y, { kind: "cur", cur: "splinter" });
  } catch (e) {}
}
try {
  A("kill:loot", function (e) {
    try {
      if (n && n.simRun && e && e.m && !e.m.simBoss) e.dm = 0;
    } catch (err) {}
  });
  A("kill", function (ev) {
    try {
      if (n && n.simRun && ev && ev.m && !ev.m.simBoss) SimNormalDrop(ev.m);
    } catch (err) {}
  });
  DropMulApplyOnce();
} catch (e) { console.warn("[balance] drop config init", e); }
window.__DROP = {
  cfg: DropMulCfg,
  apply: DropMulApplyOnce,
  simNormal: SimNormalDrop
};

/* ==================== v2.02 商人/通货兑换动态涨价（heat） ====================
   规则：每次成功购买后该 itemKey 涨价 +10%（×1.1，封顶 ×6）；记录最后购买时间；
   最后购买 2 分钟后每 30 秒价格降 50%（mult = 1 + (mult-1)*0.5，最低 1），惰性计算。
   只影响买价；卖价不变。存档字段 h.shopHeat = { [key]: { mult, lastAt } }。 */
var SHOP_HEAT = { cap: 6, step: 1.1, idle: 120000, decay: 30000, half: 0.5 };
function ShopHeatStore() {
  if (!u) return null;
  if (!u.shopHeat || typeof u.shopHeat !== "object" || Array.isArray(u.shopHeat)) u.shopHeat = {};
  return u.shopHeat;
}
function ShopHeatKey(kind, id) { return "shop:" + kind + ":" + id; }
function ShopHeatMult(key) {
  try {
    var store = ShopHeatStore();
    if (!store) return 1;
    var e = store[key];
    if (!e || typeof e !== "object") return 1;
    var mult = Number(e.mult);
    if (!isFinite(mult) || mult < 1) mult = 1;
    var last = Number(e.lastAt) || 0, now = Date.now();
    if (last > 0 && now > last + SHOP_HEAT.idle) {
      var steps = Math.floor((now - last - SHOP_HEAT.idle) / SHOP_HEAT.decay);
      mult = Math.max(1, 1 + (mult - 1) * Math.pow(SHOP_HEAT.half, steps));
      e.mult = mult;
      e.lastAt = now - ((now - last - SHOP_HEAT.idle) % SHOP_HEAT.decay);
    }
    mult = Math.min(SHOP_HEAT.cap, Math.max(1, mult));
    if (e.mult !== mult) e.mult = mult;
    return mult;
  } catch (err) { return 1; }
}
function ShopHeatBump(key, count) {
  try {
    var store = ShopHeatStore();
    if (!store) return 1;
    var cur = ShopHeatMult(key), n = Math.max(1, Math.floor(+count || 1));
    var mult = Math.min(SHOP_HEAT.cap, cur * Math.pow(SHOP_HEAT.step, n));
    store[key] = { mult: mult, lastAt: Date.now() };
    return mult;
  } catch (e) { return 1; }
}
/* 价格查询统一入口：base 为 {货币id:数量}（商店）或 chaos 等价数值（兑换） */
function ShopHeatPriceMap(key, baseMap) {
  var mult = ShopHeatMult(key), out = {};
  if (baseMap) for (var k in baseMap) out[k] = Math.max(1, Math.ceil((baseMap[k] || 0) * mult - 1e-9));
  return out;
}
function ShopHeatPrice(key, baseValue) { return Math.max(1, Math.ceil((baseValue || 0) * ShopHeatMult(key) - 1e-9)); }
function ShopHeatLabel(key) {
  var m = ShopHeatMult(key);
  return m > 1.0001 ? '<small style="color:#e8c870;display:block;margin-top:2px">涨价 ×' + m.toFixed(2) + " · 2 分钟无购买后每 30 秒降 50%</small>" : "";
}
function ShopHeatMigrateSave(g) {
  if (!g) return;
  var src = (g.shopHeat && typeof g.shopHeat === "object" && !Array.isArray(g.shopHeat)) ? g.shopHeat : {};
  var out = {};
  Object.keys(src).forEach(function (k) {
    var e = src[k];
    if (!e || typeof e !== "object") return;
    var m = Number(e.mult);
    if (!isFinite(m)) return;
    out[k] = { mult: Math.min(SHOP_HEAT.cap, Math.max(1, m)), lastAt: isFinite(Number(e.lastAt)) ? Number(e.lastAt) : 0 };
  });
  g.shopHeat = out;
}
window.__SHOP = {
  version: "2.02",
  reset: function () { try { if (u) u.shopHeat = {}; } catch (e) {} },
  bump: ShopHeatBump,
  mult: ShopHeatMult,
  priceMap: ShopHeatPriceMap,
  price: ShopHeatPrice,
  label: ShopHeatLabel,
  key: ShopHeatKey,
  migrate: ShopHeatMigrateSave,
  cap: SHOP_HEAT.cap,
  idle: SHOP_HEAT.idle,
  decay: SHOP_HEAT.decay
};
/* ===== EMB-122 · 腐化词缀扩池 =====
 * 瓦尔宝珠（l9）与余烬祭坛双瓦（Dv）共用 Xu 池，官版只有 10 条且等概率。
 * 做法刻意保守：
 *   1) 不重建抽取逻辑 —— 把 Xu 展开成「按权重重复」的数组，
 *      官版 oe() 等概率抽一次 = 加权抽一次；cp() 的珠宝过滤自动沿用。
 *   2) 数值型直接复用官版 statKey，进 l 表即生效，零结算改动。
 *   3) 带代价 / 机制型用自定义 key，只在 stats:pre / stats:post 展开，
 *      不去碰宿主那四处 cimpl 读取点。
 *   4) 机制型效果全部挂官方事件总线（kill / hit:mods / hit:ailment）。
 */
(function () {
  try {
    if (window.__corruptPoolHooked) return;
    window.__corruptPoolHooked = 1;

    /* ---------- 1. 文案：只有自定义 key 需要，数值型复用官版模板 ---------- */
    if (typeof JS === "object" && JS) {
      // 官版池里有 skillLvl 却没有对应文案，抽到会显示裸 key「skillLvl 1」
      if (!JS.skillLvl) JS.skillLvl = "所有技能等级 +{v}";
      JS.corruptCruel = "暴击伤害 +{v}% · 最大生命总降 6%";
      JS.corruptGluttony = "物品数量提高 {v}% · 物品稀有度总降 20%";
      JS.corruptEmberBlood = "每秒回复 {v} 生命 · 最大能量护盾总降 10%";
      JS.corruptBone = "击杀时 {v}% 几率留下 1 片余烬残片";
      JS.corruptResonance = "每 1 条腐化词缀使伤害提高 {v}%";
      JS.corruptScorch = "命中时 {v}% 几率使目标点燃";
      // EMB-125 传奇专属腐化词缀（献祭之心 / rathpith_globe）
      JS.rpgRathCastSpd = "非吟唱法术的施法速度提高 {v}%";
      JS.rpgRathAilLife = "每 50 点生命上限使非吟唱法术的异常状态强度提高 {v}%";
      JS.rpgRathCritMana = "每 50 点魔力上限使非吟唱技能的法术暴击几率提高 {v}%";
      JS.rpgRathDmgMana = "每 50 点魔力上限使非吟唱法术的伤害提高 {v}%";
    }

    /* ---------- 2. 池定义 ----------
     * k=statKey  a/b=取值区间  w=权重  jewel=false 珠宝不抽  cap=机制型叠加上限
     */
    var POOL = [
      // 官版 10 条，原样保留
      { k: "skillLvl",  a: 1,   b: 1,   w: 10, jewel: false },
      { k: "lifeInc",   a: 8,   b: 12,  w: 10 },
      { k: "critInc",   a: 20,  b: 30,  w: 10 },
      { k: "leech",     a: 1,   b: 2,   w: 10 },
      { k: "resAll",    a: 8,   b: 12,  w: 10 },
      { k: "moveInc",   a: 5,   b: 8,   w: 10 },
      { k: "atkSpd",    a: 6,   b: 10,  w: 10 },
      { k: "castSpd",   a: 6,   b: 10,  w: 10 },
      { k: "spirit",    a: 10,  b: 20,  w: 10 },
      { k: "rarity",    a: 10,  b: 15,  w: 10 },
      // 新增数值型 7 条：key 均已在 JS 有中文且被派生属性 D 消费
      { k: "critMulti", a: 15,  b: 25,  w: 14 },
      { k: "ailment",   a: 8,   b: 12,  w: 14 },
      { k: "armour",    a: 80,  b: 150, w: 13 },
      { k: "esInc",     a: 12,  b: 18,  w: 12 },
      { k: "manaRegen", a: 15,  b: 25,  w: 12 },
      { k: "regen",     a: 2,   b: 4,   w: 11 },
      { k: "projAdd",   a: 1,   b: 1,   w: 2  },
      // 新增带代价 3 条：收益吃 {v}，代价固定，在 stats:post 里结算
      { k: "corruptCruel",      a: 15, b: 25, w: 7 },
      { k: "corruptGluttony",   a: 8,  b: 12, w: 6 },
      { k: "corruptEmberBlood", a: 3,  b: 5,  w: 6 },
      // 新增机制型 3 条：数值固定，cap 保证多来源只生效一次
      { k: "corruptBone",      a: 4,  b: 4,  w: 3, cap: 4  },
      { k: "corruptResonance", a: 6,  b: 6,  w: 3, cap: 6  },
      { k: "corruptScorch",    a: 10, b: 10, w: 3, cap: 10 }
    ];

    var TOTAL = 0, i, j;
    for (i = 0; i < POOL.length; i++) TOTAL += POOL[i].w;

    /* ---------- 2b. 传奇专属腐化词缀（EMB-125） ----------
     * 有原型的传奇装备，腐化时（瓦尔 / 祭坛双瓦都算）额外抽专属池：
     *   专属 4 条高权重 + 通用 23 条低权重兜底。
     * 首单只做献祭之心（rathpith_globe）当样板，其余传奇后续逐个补。
     * 专属词缀用自定义 key，stats:post 里按 S.maxLife / S.maxMana 折算。
     */
    var UNIQUE_POOL = {
      rathpith_globe: {
        n: "献祭之心",
        pool: [
          { k: "rpgRathCastSpd",  a: 4,  b: 8,  w: 10 },  // 非吟唱法术施法速度
          { k: "rpgRathAilLife",  a: 3,  b: 3,  w: 10 },  // 每 50 生命 → 异常强度
          { k: "rpgRathCritMana", a: 3,  b: 3,  w: 10 },  // 每 50 魔力 → 法术暴击
          { k: "rpgRathDmgMana",  a: 6,  b: 6,  w: 10 }   // 每 50 魔力 → 法术伤害
        ],
        // 通用池兜底权重：专属 4 条合计 40，通用 23 条按原权重摊（合计 ~206 中的 206），
        // 这里把通用池整体压到一个较低权重，让专属词缀占主导。
        fallbackScale: 0.5
      }
    };

    // 为每个传奇的专属池预展开（按权重重复），供 cp 劫持时直接拼装
    var UNIQUE_EXPANDED = {};
    for (var uk in UNIQUE_POOL) {
      var udef = UNIQUE_POOL[uk];
      var uexp = [];
      for (j = 0; j < udef.pool.length; j++) {
        var up = udef.pool[j];
        for (var uw = 0; uw < up.w; uw++) uexp.push([up.k, [up.a, up.b]]);
      }
      UNIQUE_EXPANDED[uk] = uexp;
    }

    /* ---------- 2c. 传奇腐化「替换原生词缀」（EMB-126 修复） ----------
     * 官版腐化（l9 单瓦 / Dv 双瓦）的 up 分支是「新增 cimpl/cimpl2」，从不替换原生词缀。
     * 需求要求「通过替代原生词条瓦出专属词缀」：腐化时从传奇的 st（固定词缀）
     * 与 mods（随机词缀）里随机移除一条，被移除词缀的数值/文本效果随之消失，
     * 专属词缀效果叠加（走 cimpl/cimpl2 → stats:pre 折算通道）。
     * 返回被替换的词缀描述，供面板文案展示；无可替换词缀时返回 null。
     */
    function __uniqueReplace(item) {
      try {
        if (!item) return null;
        var st = (item.st && item.st.length) ? item.st : null;
        var mods = (item.mods && item.mods.length) ? item.mods : null;
        var stN = st ? st.length : 0;
        var modN = mods ? mods.length : 0;
        if (stN + modN === 0) return null;
        // 在 st 与 mods 之间按条目数均匀随机选一条（覆盖最全）
        var pick = Math.floor(I() * (stN + modN));
        if (pick < stN) {
          // 命中 st：移除该条固定词缀文本
          var removed = st[pick];
          item.st.splice(pick, 1);
          return { src: "st", text: removed };
        }
        // 命中 mods：移除该条随机词缀（o8 不再读取，数值随之消失）
        var mi = pick - stN;
        var mremoved = item.mods[mi];
        item.mods.splice(mi, 1);
        return { src: "mods", text: (mremoved && mremoved.id) ? mremoved.id : String(mi) };
      } catch (e) { return null; }
    }

    /* ---------- 3. 展开并顶替官版 Xu ---------- */
    if (typeof Xu !== "undefined" && Array.isArray(Xu)) {
      var expanded = [];
      for (i = 0; i < POOL.length; i++) {
        var p = POOL[i];
        // 每个副本独立建数组，避免宿主日后改写污染其他条目
        for (j = 0; j < p.w; j++) expanded.push([p.k, [p.a, p.b]]);
      }
      Xu.length = 0;
      for (i = 0; i < expanded.length; i++) Xu.push(expanded[i]);
    }

    /* ---------- 3b. 劫持 cp：传奇专属腐化词缀（EMB-125） ----------
     * 官版 cp=e=>e&&e.kind==="jewel"?Xu.filter(t=>t[0]!=="skillLvl"):Xu
     * 瓦尔 l9 与祭坛 Dv 都调 cp(e)，e 是完整 item（含 uniq）。
     * 这里在官版结果之上，若 e.uniq 命中专属池，则返回「专属词缀 + 通用兜底」。
     * 传奇本身不是珠宝，所以跳过官版的珠宝过滤路径，直接拼装。
     */
    if (typeof cp === "function") {
      var __baseCp = cp;
      cp = function (e) {
        var base = __baseCp.call(this, e);
        try {
          if (e && e.uniq && UNIQUE_POOL[e.uniq]) {
            var uexp = UNIQUE_EXPANDED[e.uniq];
            // 通用兜底：把官版 Xu（已展开的加权数组）按 fallbackScale 抽样压缩权重，
            // 实现「专属优先、通用兜底」——专属 40 份 vs 通用 ~103 份。
            var fallback = base || Xu || [];
            var merged = uexp.slice();
            for (var f = 0; f < fallback.length; f++) {
              // fallbackScale=0.5：每 2 条通用保留 1 条，权重减半
              if (f % 2 === 0) merged.push(fallback[f]);
            }
            return merged;
          }
        } catch (e2) {}
        return base;
      };
    }

    /* ---------- 4. 机制型状态（只生效一次，不随装备件数叠加） ---------- */
    var MECH = { bone: 0, resonance: 0, scorch: 0 };
    var lastJewelCount = 0;

    // 珠宝的腐化词缀条数：ay(e, t) 的 t 就是「已激活」集合，判据只认 cimpl 字段
    if (typeof ay === "function" && typeof rs !== "undefined" && typeof Fa === "function") {
      var __baseAy = ay;
      ay = function (e, t) {
        try {
          var set = (t instanceof Set) ? t : new Set(t || []);
          var n = 0;
          for (var r = 0; r < rs; r++) {
            var jb = (e && e.jw) ? e.jw[r] : null;
            if (!jb || !set.has(Fa(r))) continue;
            if (jb.cimpl) n++;
            if (jb.cimpl2) n++;
          }
          lastJewelCount = n;
        } catch (e2) {}
        return __baseAy.apply(this, arguments);
      };
    }

    function corruptCount() {
      var n = lastJewelCount;
      try {
        if (u && u.equip) {
          for (var s in u.equip) {
            var it = u.equip[s];
            if (!it) continue;
            if (it.cimpl) n++;
            if (it.cimpl2) n++;
          }
        }
      } catch (e) {}
      return n;
    }

    /* ---------- 5. 属性展开 ---------- */
    if (typeof A === "function") {
      A("stats:pre", function (p) {
        try {
          var L = p.a;
          if (!L) return;
          // 带代价的三条：收益转成官版标准属性，代价放到 stats:post
          if (L.corruptCruel) p.add("critMulti", L.corruptCruel);
          if (L.corruptGluttony) p.add("quant", L.corruptGluttony);
          if (L.corruptEmberBlood) p.add("regen", L.corruptEmberBlood);
          // 机制型：多来源取上限，只生效一次
          MECH.bone = Math.min(L.corruptBone || 0, 4);
          MECH.resonance = Math.min(L.corruptResonance || 0, 6);
          MECH.scorch = Math.min(L.corruptScorch || 0, 10);
          // EMB-125 传奇专属腐化词缀：跨属性折算（按最终生命/魔力上限）
          // 重算 maxLife / maxMana（与宿主 D 的公式一致，见 3771061）
          var lvl = (typeof p.level === "number") ? p.level : 0;
          var maxLife = (50 + 9 * lvl + (L.life || 0)) * (1 + (L.lifeInc || 0) / 100);
          var maxMana = 60 + 5 * lvl + (L.mana || 0);
          // 第 1 条：非吟唱法术施法速度（v 即施法速度 %）
          if (L.rpgRathCastSpd) p.add("castSpd", L.rpgRathCastSpd);
          // 第 2 条：每 50 生命上限 → 元素异常效果（v=3）
          if (L.rpgRathAilLife) p.add("ailEff", Math.floor(maxLife / 50) * L.rpgRathAilLife);
          // 第 3 条：每 50 魔力上限 → 法术暴击率（v=3）
          if (L.rpgRathCritMana) p.add("critInc", Math.floor(maxMana / 50) * L.rpgRathCritMana);
          // 第 4 条：每 50 魔力上限 → 法术伤害（v=6）
          if (L.rpgRathDmgMana) p.add("spellInc", Math.floor(maxMana / 50) * L.rpgRathDmgMana);
        } catch (e) {}
      });

      A("stats:post", function (p) {
        try {
          var S = p.S, g = p.g;
          if (!S || typeof g !== "function") return;
          if (g("corruptCruel")) S.maxLife *= 0.94;
          if (g("corruptGluttony")) S.rarity = Math.max(0, S.rarity * 0.8);
          if (g("corruptEmberBlood")) S.maxES *= 0.9;
        } catch (e) {}
      });

      // 烬骨：击杀时按概率留下余烬残片（喂祭坛经济闭环）
      A("kill", function () {
        try {
          if (!MECH.bone) return;
          if (I() * 100 < MECH.bone) u.cur.ash = (u.cur.ash || 0) + 1;
        } catch (e) {}
      });

      // 腐化共鸣：自身每 1 条腐化词缀提高伤害
      A("hit:mods", function (p) {
        try {
          if (!MECH.resonance || p.fixed) return;
          var n = corruptCount();
          if (n > 0) p.k *= 1 + MECH.resonance * n / 100;
        } catch (e) {}
      });

      // 烬灼：命中时按概率强制点燃
      A("hit:ailment", function (p) {
        try {
          if (!MECH.scorch) return;
          if (I() * 100 < MECH.scorch) p.forceIgn = true;
        } catch (e) {}
      });
    }

    /* ---------- 6. 修祭坛覆盖已有第二条 ---------- */
    if (typeof Dv === "function") {
      var __baseDv = Dv;
      Dv = function (item) {
        var old2 = (item && item.cimpl2) ? { k: item.cimpl2.k, v: item.cimpl2.v } : null;
        // 先摘掉，让官版 up 分支照常写一条新的；写完再按「不覆盖」改写
        if (old2) { try { delete item.cimpl2; } catch (e) {} }
        var res;
        try {
          res = __baseDv.apply(this, arguments);
        } catch (err) {
          if (old2 && item && !item.cimpl2) item.cimpl2 = old2;
          throw err;
        }
        try {
          // EMB-126：传奇专属腐化 → 双瓦 up 分支「继续替换一条原生词缀」
          // 官版 up 分支会新增 cimpl2，这里补上「移除一条 st/mods 原生词缀」，
          // 使双重腐化表现为「替换」而非「平白多一条」。
          if (res && res.cls === "up" && item && item.uniq && UNIQUE_POOL[item.uniq]) {
            var repl = __uniqueReplace(item);
            if (repl) {
              res.sub = "替换原生词缀: " + repl.text + " · 全部词缀 +10%(至少 +1)";
            }
          }
        } catch (e2) {}
        try {
          if (old2 && res && res.cls === "up") {
            var rng = null;
            for (var n = 0; n < POOL.length; n++) {
              if (POOL[n].k === old2.k) { rng = POOL[n]; break; }
            }
            var nv = rng ? de(rng.a, rng.b) : old2.v;
            item.cimpl2 = { k: old2.k, v: nv };
            res.sub = "重铸双重腐化: " + _a(old2.k, nv) + " · 全部词缀 +10%(至少 +1)";
          } else if (old2 && item && !item.cimpl2) {
            item.cimpl2 = old2;
          }
        } catch (e2) {}
        return res;
      };
    }

    /* ---------- 7. 导出，供门禁断言读取 ---------- */
    window.__CORRUPT_POOL = {
      version: "1.1",
      pool: POOL,
      weight: TOTAL,
      cost: ["corruptCruel", "corruptGluttony", "corruptEmberBlood"],
      mech: ["corruptBone", "corruptResonance", "corruptScorch"],
      unique: UNIQUE_POOL,
      // EMB-126：替换原生词缀（供 l9 单瓦劫持跨 IIFE 调用，与 Dv 双瓦共用同一实现）
      replaceUnique: __uniqueReplace,
      count: function () { return POOL.length; },
      // 自检：只有块内能访问 JS / Xu / cp 这类宿主符号
      audit: function () {
        var missing = [], dup = [], seen = {}, n;
        for (n = 0; n < POOL.length; n++) {
          var k = POOL[n].k;
          if (typeof JS !== "object" || !JS || !JS[k]) missing.push(k);
          if (seen[k]) dup.push(k);
          seen[k] = 1;
        }
        // 传奇专属池的文案也查一遍
        for (var uk in UNIQUE_POOL) {
          var upool = UNIQUE_POOL[uk].pool;
          for (n = 0; n < upool.length; n++) {
            var uk2 = upool[n].k;
            if (typeof JS !== "object" || !JS || !JS[uk2]) missing.push(uk2);
            if (seen[uk2]) dup.push(uk2);
            seen[uk2] = 1;
          }
        }
        return {
          count: POOL.length,
          weight: TOTAL,
          xuLen: (typeof Xu !== "undefined" && Xu) ? Xu.length : -1,
          missingText: missing,
          dupKey: dup,
          uniqueCount: (function () { var c = 0; for (var k in UNIQUE_POOL) c++; return c; })(),
          jewelKeys: (typeof cp === "function")
            ? (function () { var s = {}; cp({ kind: "jewel" }).forEach(function (t) { s[t[0]] = 1; }); return Object.keys(s); })()
            : []
        };
      },
      // 走官版真实抽取路径（cp + oe），用来验权重是否生效
      rollOnce: function (isJewel) {
        var fake = { kind: isJewel ? "jewel" : "item" };
        var list = (typeof cp === "function") ? cp(fake) : Xu;
        if (!list || !list.length) return null;
        var pick = oe(list);
        return { k: pick[0], v: de(pick[1][0], pick[1][1]) };
      },
      // 传奇专属池抽取（验专属词缀是否被抽到）
      rollUnique: function (uniqId, isJewel) {
        var fake = { kind: isJewel ? "jewel" : "item", uniq: uniqId };
        var list = (typeof cp === "function") ? cp(fake) : Xu;
        if (!list || !list.length) return null;
        var pick = oe(list);
        return { k: pick[0], v: de(pick[1][0], pick[1][1]) };
      }
    };
  } catch (e) {}
})();
