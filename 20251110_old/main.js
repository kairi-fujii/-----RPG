window.addEventListener("DOMContentLoaded", () => {
  // === キャンバス設定 ===
  const canvas = document.getElementById("stage");
  const ctx = canvas.getContext("2d");

  const homeTileSize = 64;
  const dungeonTileSize = 24;

  // === ゲーム状態管理 ===
  let currentStage = "home"; // home or dungeon
  let dungeonLayer = 1;      // ダンジョン階層
  let map = generateHomeMap();
  let heroPos = { x: 1, y: 1 };

  // === ヒーロー情報 ===
  const hero = {
    hp: 10, maxHp: 10,
    atk: 2, atkLevel: 1,
    def: 2, defLevel: 1,
    speed: 1, speedLevel: 1,
    luck: 0, luckLevel: 1,
    soul: 50,
    confirmedStats: { atk: 2, def: 2, speed: 1, luck: 0 }
  };

  // === 画像読み込み ===
  const images = {
    ground: loadImage("assets/Ground.png"),
    hero: loadImage("assets/Hero.png"),
    bed: loadImage("assets/Bed.png"),
    goddess: loadImage("assets/GoddessStatue.png"),
    upStairs: loadImage("assets/UphillStairs.png"),
    downStairs: loadImage("assets/DownhillStairs.png"),
    treasure: loadImage("assets/TreasureChest.png"),
    soul: loadImage("assets/Soul.png")
  };

  function loadImage(src) {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      loadedCount++;
      if (loadedCount === Object.keys(images).length) drawMap();
    };
    return img;
  }

  let loadedCount = 0;

  // === ホームマップ生成 ===
  function generateHomeMap() {
    const width = 8, height = 6;
    const map = Array.from({ length: height }, () => Array(width).fill(0));
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (x === 0 || x === width - 1 || y === 0 || y === height - 1) map[y][x] = 1;
      }
    }
    map[1][6] = 2; // 階段
    map[4][1] = 4; // ベッド
    map[4][6] = 5; // 女神像
    return map;
  }

  // === ダンジョンマップ生成 ===
  function generateDungeonMap(layer) {
    const size = 32;
    const map = Array.from({ length: size }, () => Array(size).fill(0));

    // 壁ランダム生成
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (Math.random() < 0.2) map[y][x] = 1;
      }
    }

    // 空タイルリスト
    const emptyTiles = [];
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++)
        if (map[y][x] === 0) emptyTiles.push({ x, y });

    // 上り階段
    const upPos = emptyTiles.splice(Math.floor(Math.random() * emptyTiles.length), 1)[0];
    map[upPos.y][upPos.x] = 2;

    // 下り階段
    const farTiles = emptyTiles.filter(pos => Math.abs(pos.x - upPos.x) + Math.abs(pos.y - upPos.y) >= 10);
    const downPos = farTiles.splice(Math.floor(Math.random() * farTiles.length), 1)[0];
    map[downPos.y][downPos.x] = 3;

    // 宝箱は最大5個
    const treasureCount = Math.min(5, emptyTiles.length);
    for (let i = 0; i < treasureCount; i++) {
      const idx = Math.floor(Math.random() * emptyTiles.length);
      const pos = emptyTiles.splice(idx, 1)[0];
      map[pos.y][pos.x] = 6;
    }

    // ヒーロー開始位置
    const heroStart = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    return { map, heroStart };
  }

  // === 描画 ===
  function drawMap() {
    const tileSize = currentStage === "home" ? homeTileSize : dungeonTileSize;
    canvas.width = tileSize * (currentStage === "home" ? 8 : 32);
    canvas.height = tileSize * (currentStage === "home" ? 6 : 32);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[0].length; x++) {
        const px = x * tileSize, py = y * tileSize;
        switch (map[y][x]) {
          case 0: ctx.drawImage(images.ground, px, py, tileSize, tileSize); break;
          case 1: ctx.fillStyle = "#555"; ctx.fillRect(px, py, tileSize, tileSize); break;
          case 2: ctx.drawImage(images.upStairs, px, py, tileSize, tileSize); break;
          case 3: ctx.drawImage(images.downStairs, px, py, tileSize, tileSize); break;
          case 4: ctx.drawImage(images.bed, px, py, tileSize, tileSize); break;
          case 5: ctx.drawImage(images.goddess, px, py, tileSize, tileSize); break;
          case 6: ctx.drawImage(images.treasure, px, py, tileSize, tileSize); break;
        }
      }
    }
    ctx.drawImage(images.hero, heroPos.x * tileSize, heroPos.y * tileSize, tileSize, tileSize);
    updateStatusDisplay();
  }

  // === 移動可能判定 ===
  function canMove(nx, ny) {
    return nx >= 0 && nx < map[0].length && ny >= 0 && ny < map.length && map[ny][nx] !== 1;
  }

  // === キー入力 ===
  window.addEventListener("keydown", e => {
    if (document.getElementById("prayerPopup") || document.getElementById("sleepPopup") || document.getElementById("returnPopup")) return;
    let nx = heroPos.x, ny = heroPos.y;
    switch (e.key) {
      case "ArrowUp": ny--; e.preventDefault(); break;
      case "ArrowDown": ny++; e.preventDefault(); break;
      case "ArrowLeft": nx--; e.preventDefault(); break;
      case "ArrowRight": nx++; e.preventDefault(); break;
      case "Enter":
        if (currentStage === "home" && map[heroPos.y][heroPos.x] === 4) showSleepPopup();
        return;
      default: return;
    }

    if (canMove(nx, ny)) {
      heroPos.x = nx;
      heroPos.y = ny;
      drawMap();

      if (currentStage === "home") {
        checkHomeInteraction();
      } else if (currentStage === "dungeon") {
        checkTreasure();
        checkStageTransition();
      }
    }
  });

  // === 宝箱取得処理 ===
  function checkTreasure() {
    if (map[heroPos.y][heroPos.x] === 6) {
      hero.soul += 10;
      map[heroPos.y][heroPos.x] = 0;
      drawMap();
      showSoulEffect("+10 Souls");
    }
  }

  // === ソウル取得エフェクト ===
  function showSoulEffect(text) {
    const popup = document.createElement("div");
    popup.textContent = text;
    Object.assign(popup.style, {
      position: "absolute",
      left: "50%", top: "15%",
      transform: "translateX(-50%)",
      color: "gold",
      fontWeight: "bold",
      fontSize: "24px",
      textShadow: "0 0 8px black",
      zIndex: 9999,
      opacity: "1",
      transition: "opacity 0.8s ease-out, top 0.8s ease-out"
    });
    document.body.appendChild(popup);
    setTimeout(() => {
      popup.style.top = "5%";
      popup.style.opacity = "0";
    }, 50);
    setTimeout(() => popup.remove(), 850);
  }

  // === ステータス更新 ===
  function updateStatusDisplay() {
    const container = document.getElementById("left");
    container.querySelectorAll(".stat").forEach(div => {
      const label = div.querySelector("span:first-child").textContent;
      const valueSpan = div.querySelector("span:last-child");
      switch (label) {
        case "HP": valueSpan.textContent = `${hero.hp} / ${hero.maxHp}`; break;
        case "ATK": valueSpan.textContent = hero.confirmedStats.atk ?? hero.atk; break;
        case "DEF": valueSpan.textContent = hero.confirmedStats.def ?? hero.def; break;
        case "SPD": valueSpan.textContent = hero.confirmedStats.speed ?? hero.speed; break;
        case "LUCK": valueSpan.textContent = hero.confirmedStats.luck ?? hero.luck; break;
        case "Souls": valueSpan.textContent = hero.soul; break;
      }
    });
  }

  // === ホーム判定 ===
  function checkHomeInteraction() {
    const tile = map[heroPos.y][heroPos.x];
    if (tile === 4) showSleepPopup();
    else if (tile === 5) showPrayerPopup();
    else if (tile === 2) {
      currentStage = "dungeon";
      dungeonLayer = 1;
      const result = generateDungeonMap(dungeonLayer);
      map = result.map;
      heroPos = result.heroStart;
      drawMap();
    }
  }

  // === ダンジョン階段判定 ===
  function checkStageTransition() {
    const tile = map[heroPos.y][heroPos.x];
    if (tile === 2) {
      dungeonLayer++;
      const result = generateDungeonMap(dungeonLayer);
      map = result.map;
      heroPos = result.heroStart;
      drawMap();
    } else if (tile === 3) {
      currentStage = "home";
      map = generateHomeMap();
      heroPos = { x: 1, y: 1 };
      drawMap();
    }
  }

  // === 初回描画 ===
  drawMap();
});
