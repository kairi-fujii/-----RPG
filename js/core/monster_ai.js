// core/monster_ai.js
function updateMonsters() {
  if (!window.monsters || !window.hero) return;

  window.monsters.forEach(monster => {
    const dx = window.hero.pos.x - monster.pos.x;
    const dy = window.hero.pos.y - monster.pos.y;

    // x方向・y方向のいずれかを1マスだけ動かす
    if (Math.abs(dx) > Math.abs(dy)) {
      monster.pos.x += Math.sign(dx);
    } else {
      monster.pos.y += Math.sign(dy);
    }
  });

  // 再描画
  GameManager.drawMap();
}
