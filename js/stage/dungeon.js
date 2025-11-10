// js/stage/dungeon.js

// ダンジョン内でのタイル判定
function checkDungeonInteraction() {
  const tile = GameManager.map[Hero.pos.y][Hero.pos.x];
  const layer = GameManager.dungeonLayer;

  if (tile === 3) {
    // 下り階段：拠点に戻る
    showReturnHomePopup();
  } else if (tile === 2) {
    // 上り階段：次の階層に進む
    const result = MapGen.generateDungeonMap(layer + 1);
    GameManager.map = result.map;
    Hero.pos = result.heroStart;
    GameManager.dungeonLayer = layer + 1;
    GameManager.drawMap();
  } else if (tile === 6 || tile === 7) {
    // 宝箱取得処理は treasure.js に委譲
    handleTreasureTile(tile, layer);
  }
}

// ダンジョンマップ生成
MapGen.generateDungeonMap = function(layer) {
  const size = 32;
  const map = Array.from({ length: size }, () => Array(size).fill(0));

  // 障害物生成
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (Math.random() < 0.2) map[y][x] = 1;
    }
  }

  // 空きタイル収集
  const emptyTiles = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (map[y][x] === 0) emptyTiles.push({ x, y });
    }
  }

  // 上り階段配置
  const upPos = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
  map[upPos.y][upPos.x] = 2;

  // 下り階段配置（上り階段から遠い）
  const farTiles = emptyTiles.filter(p => Math.abs(p.x - upPos.x) + Math.abs(p.y - upPos.y) >= 10);
  const downPos = farTiles[Math.floor(Math.random() * farTiles.length)];
  map[downPos.y][downPos.x] = 3;

  // 宝箱配置（2%程度、10%でレア）
  const numTreasures = Math.max(1, Math.floor(size * size * 0.02));
  for (let i = 0; i < numTreasures; i++) {
    const pos = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    if (map[pos.y][pos.x] === 0) {
      map[pos.y][pos.x] = (Math.random() < 0.1) ? 7 : 6;
    }
  }

  // 主人公初期位置（階段以外）
  const heroStartCandidates = emptyTiles.filter(p =>
    !(p.x === upPos.x && p.y === upPos.y) &&
    !(p.x === downPos.x && p.y === downPos.y) &&
    map[p.y][p.x] === 0
  );
  const heroStart = heroStartCandidates[Math.floor(Math.random() * heroStartCandidates.length)];

  return { map, heroStart };
};
