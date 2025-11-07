window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("stage");
  const ctx = canvas.getContext("2d");

  const mapWidth = 32;
  const mapHeight = 32;
  const map = generateMap(mapWidth, mapHeight); // mapgen.js で生成

  // Canvasサイズ固定（画面中央、スクロールなし）
  const canvasSize = Math.min(window.innerWidth * 0.8, window.innerHeight * 0.8);
  canvas.width = canvasSize;
  canvas.height = canvasSize;

  // タイルサイズを計算
  const tileSize = canvas.width / mapWidth;

  // 画像読み込み
  const groundImg = new Image();
  groundImg.src = "assets/Ground.png";

  const heroImg = new Image();
  heroImg.src = "assets/Hero.png";

  let heroPos = { x: 1, y: 1 };
  outer: for (let y = 0; y < mapHeight; y++) {
    for (let x = 0; x < mapWidth; x++) {
      if (map[y][x] === 0) {
        heroPos = { x, y };
        break outer;
      }
    }
  }

  // --- 両方ロード完了を待つ ---
  let loadedCount = 0;
  function checkAndDraw() {
    loadedCount++;
    if (loadedCount === 2) drawMap();
  }

  groundImg.onload = checkAndDraw;
  heroImg.onload = checkAndDraw;

  // マップ描画
  function drawMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < mapHeight; y++) {
      for (let x = 0; x < mapWidth; x++) {
        if (map[y][x] === 0) {
          ctx.drawImage(groundImg, x * tileSize, y * tileSize, tileSize, tileSize);
        } else {
          ctx.fillStyle = "#555"; // 壁
          ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
      }
    }

    ctx.drawImage(heroImg, heroPos.x * tileSize, heroPos.y * tileSize, tileSize, tileSize);
  }

  // 移動可能判定
  function canMove(nx, ny) {
    return nx >= 0 && nx < mapWidth && ny >= 0 && ny < mapHeight && map[ny][nx] === 0;
  }

  // 十字キーで移動（ブラウザスクロール防止）
  window.addEventListener("keydown", (e) => {
    let nx = heroPos.x;
    let ny = heroPos.y;

    switch (e.key) {
      case "ArrowUp": ny--; e.preventDefault(); break;
      case "ArrowDown": ny++; e.preventDefault(); break;
      case "ArrowLeft": nx--; e.preventDefault(); break;
      case "ArrowRight": nx++; e.preventDefault(); break;
      default: return;
    }

    if (canMove(nx, ny)) {
      heroPos.x = nx;
      heroPos.y = ny;
      drawMap();
    }
  });
});
