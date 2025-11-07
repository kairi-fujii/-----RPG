window.hero = {
  hp: 10, maxHp: 10,
  atk: 2, atkLevel: 1,
  def: 2, defLevel: 1,
  speed: 1, speedLevel: 1,
  luck: 0, luckLevel: 1,
  soul: 50,
  confirmedStats: { atk: 2, def: 2, speed: 1, luck: 0 }
};

window.heroPos = { x: 1, y: 1 };

window.requiredSoul = function(level) {
  return 2 * level + 10;
};

window.canMove = function(nx, ny, map) {
  return nx >= 0 && nx < map[0].length && ny >= 0 && ny < map.length && map[ny][nx] !== 1;
};
