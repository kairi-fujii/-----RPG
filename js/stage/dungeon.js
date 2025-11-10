// stage/dungeon.js

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
    // 宝箱取得
    handleTreasureTile(tile, layer);
  }
}

// 宝箱取得処理
function handleTreasureTile(tile, layer) {
  let baseSoul = 10 + layer * 2;
  const isRare = (tile === 7);

  // 通常宝箱が10%でレア宝箱に変化
  if (!isRare && Math.random() < 0.1) {
    GameManager.map[Hero.pos.y][Hero.pos.x] = 7; // レア宝箱
    GameManager.drawMap();
    return; // 次フレームで再判定
  }

  if (isRare) baseSoul = Math.floor(baseSoul * 1.5);

  // 獲得ソウル量にラックを加算
  const gainedSoul = baseSoul + Math.floor(Math.random() * (Hero.luck + 1));
  Hero.soul += gainedSoul;

  // 宝箱を床に置き換え
  GameManager.map[Hero.pos.y][Hero.pos.x] = 0;
  GameManager.drawMap();

  // エフェクト表示
  showSoulEffect(Hero.pos.x, Hero.pos.y, gainedSoul);
}

// ダンジョンマップ生成
// layer: 階層番号
MapGen.generateDungeonMap = function(layer) {
  const size = 32;
  const map = Array.from({ length: size }, () => Array(size).fill(0));

  // 階層ごとの障害物生成（壁）
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (Math.random() < 0.2) map[y][x] = 1;
    }
  }

  // 空きタイルを収集
  const emptyTiles = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (map[y][x] === 0) emptyTiles.push({ x, y });
    }
  }

  // 上り階段をランダムに配置
  const upPos = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
  map[upPos.y][upPos.x] = 2;

  // 下り階段を上り階段から遠い位置に配置
  const farTiles = emptyTiles.filter(p => Math.abs(p.x - upPos.x) + Math.abs(p.y - upPos.y) >= 10);
  const downPos = farTiles[Math.floor(Math.random() * farTiles.length)];
  map[downPos.y][downPos.x] = 3;

  // 宝箱配置
  const numTreasures = Math.max(1, Math.floor(size * size * 0.02)); // 2%程度
  for (let i = 0; i < numTreasures; i++) {
    const pos = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    if (map[pos.y][pos.x] === 0) {
      map[pos.y][pos.x] = (Math.random() < 0.1) ? 7 : 6; // 10%でレア宝箱
    }
  }

  // 主人公の初期位置（階段以外）
  const heroStartCandidates = emptyTiles.filter(p =>
    !(p.x === upPos.x && p.y === upPos.y) && !(p.x === downPos.x && p.y === downPos.y) && map[p.y][p.x] === 0
  );
  const heroStart = heroStartCandidates[Math.floor(Math.random() * heroStartCandidates.length)];

  return { map, heroStart };
};

// 宝箱取得エフェクト
function showSoulEffect(x, y, amount) {
  const canvas = document.getElementById("stage");
  const ctx = canvas.getContext("2d");
  const tileSize = 24; // ダンジョン用タイルサイズ

  let alpha = 1.0;
  let offsetY = 0;

  function animate() {
    ctx.clearRect(x * tileSize, y * tileSize - 20, tileSize, tileSize + 20);
    ctx.drawImage(GameManager.groundImg, x * tileSize, y * tileSize, tileSize, tileSize);

    ctx.font = "16px monospace";
    ctx.fillStyle = `rgba(255,255,0,${alpha})`;
    ctx.fillText(`+${amount}`, x * tileSize, y * tileSize - offsetY);

    alpha -= 0.02;
    offsetY += 0.5;
    if (alpha > 0) requestAnimationFrame(animate);
    else GameManager.drawMap(); // 最終的に通常描画に戻す
  }

  animate();
}
