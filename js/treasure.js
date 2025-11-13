// js/treasure.js
// 宝箱タイル処理
function handleTreasureTile(tile, layer) {

  layer = (typeof layer === "number") ? layer : 1;

  let baseSoul = 10 + layer * 2;
  const isRare = (tile === 7);

  if (!isRare && Math.random() < 0.1) {
    console.log("✨ 宝箱がレアに変化しました！");
    GameManager.map[window.hero.pos.y][window.hero.pos.x] = 7;
    GameManager.drawMap();
    console.groupEnd();
    return;
  }

  if (isRare) baseSoul = Math.floor(baseSoul * 1.5);

  const luck = (typeof window.hero.luck === "number") ? window.hero.luck : 0;
  const gainedSoul = baseSoul + Math.floor(Math.random() * (luck + 1));

  if (typeof window.hero.souls === "number" && !isNaN(window.hero.souls)) {
    window.hero.souls += gainedSoul;
  } else {
    window.hero.souls = gainedSoul;
  }

  // 宝箱消去
  GameManager.map[window.hero.pos.y][window.hero.pos.x] = 0;
  GameManager.drawMap();

  // Hero上にDOMエフェクト
  if (typeof showSoulEffect === "function") {
    showSoulEffect(window.hero.pos.x, window.hero.pos.y, gainedSoul, isRare);
  } 

}

// グローバル登録
window.handleTreasureTile = handleTreasureTile;
