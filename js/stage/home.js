// stage/home.js
function checkHomeInteraction() {
  const tile = GameManager.map[window.hero.pos.y][window.hero.pos.x];

  if (tile === 4) {
    // ベッド：睡眠ポップアップ
    showSleepPopup();
  } else if (tile === 5) {
    // 女神像：祈りポップアップ
    showPrayerPopup();
  } else if (tile === 2) {
    // 上り階段がある場合はダンジョンへ移動
    GameManager.currentStage = "dungeon";
    const result = MapGen.generateDungeonMap(1);
    GameManager.map = result.map;
    window.hero.pos = result.heroStart;
    GameManager.drawMap();
  } else if (tile === 6 || tile === 7) {
    // 宝箱取得処理は treasure.js に委譲
    handleTreasureTile(tile, 1);
  }
}
