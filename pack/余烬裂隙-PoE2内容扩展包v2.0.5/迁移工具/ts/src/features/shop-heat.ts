/**
 * 商人动态价格（路线 A 试点：纯逻辑，先作为可类型检查的模块，
 * 后续由构建脚本注入/替换 block 内实现）。
 */
export interface HeatEntry { mult: number; lastAt: number; }

export const HEAT_STEP = 0.1;
export const HEAT_MAX = 6;
export const COOLDOWN_MS = 2 * 60 * 1000;
export const DECAY_MS = 30 * 1000;

export function decay(entry: HeatEntry, now = Date.now()): HeatEntry {
  if (!entry || !Number.isFinite(entry.mult)) return { mult: 1, lastAt: now };
  if (now - entry.lastAt < COOLDOWN_MS) return entry;
  const steps = Math.floor((now - entry.lastAt - COOLDOWN_MS) / DECAY_MS);
  let mult = entry.mult;
  for (let i = 0; i < steps && mult > 1; i++) mult = 1 + (mult - 1) * 0.5;
  return { mult: Math.max(1, Math.min(HEAT_MAX, mult)), lastAt: entry.lastAt + COOLDOWN_MS + steps * DECAY_MS };
}

export function bump(entry: HeatEntry | undefined, now = Date.now()): HeatEntry {
  const cur = decay(entry || { mult: 1, lastAt: now }, now);
  return { mult: Math.min(HEAT_MAX, cur.mult * (1 + HEAT_STEP)), lastAt: now };
}

export function price(base: number, entry: HeatEntry | undefined, now = Date.now()): number {
  const e = decay(entry || { mult: 1, lastAt: now }, now);
  return Math.ceil(base * e.mult);
}
