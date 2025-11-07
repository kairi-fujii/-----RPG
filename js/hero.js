// hero.js
export const hero = {
  hp: 10,
  maxHp: 10,
  atk: 2, atkLevel: 1,
  def: 2, defLevel: 1,
  speed: 1, speedLevel: 1,
  luck: 0, luckLevel: 1,
  soul: 50,
  confirmedStats: { atk: 2, def: 2, speed: 1, luck: 0 }
};

// ソウル消費量計算
export function requiredSoul(level) {
  return 2 * level + 10;
}
