window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("stage");
  const ctx = canvas.getContext("2d");

  const homeTileSize = 64;
  const dungeonTileSize = 24;

  let currentStage = "home";
  let dungeonLayer = 1;
  let map = window.generateHomeMap();
  let heroPos = window.heroPos;

  const groundImg = new Image(); groundImg.src = "assets/Ground.png";
  const heroImg = new Image(); heroImg.src = "assets/Hero.png";
  const bedImg = new Image(); bedImg.src = "assets/Bed.png";
  const goddessImg = new Image(); goddessImg.src = "assets/GoddessStatue.png";
  const upStairsImg = new Image(); upStairsImg.src = "assets/UphillStairs.png";
  const downStairsImg = new Image(); downStairsImg.src = "assets/DownhillStairs.png";

  let loadedCount = 0;
  function checkAndDraw() { loadedCount++; if (loadedCount === 6) drawMap(); }
  groundImg.onload = heroImg.onload = bedImg.onload = goddessImg.onload = upStairsImg.onload = downStairsImg.onload = checkAndDraw;

  function drawMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const tileSize = (currentStage === "home") ? homeTileSize : dungeonTileSize;
    canvas.width = tileSize * (currentStage === "home" ? 8 : 32);
    canvas.height = tileSize * (currentStage === "home" ? 6 : 32);

    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[0].length; x++) {
        const tile = map[y][x];
        const px = x * tileSize, py = y * tileSize;
        if (tile === 0) ctx.drawImage(groundImg, px, py, tileSize, tileSize);
        else if (tile === 1) ctx.fillStyle = "#555", ctx.fillRect(px, py, tileSize, tileSize);
        else if (tile === 2) ctx.drawImage(upStairsImg, px, py, tileSize, tileSize);
        else if (tile === 3) ctx.drawImage(downStairsImg, px, py, tileSize, tileSize);
        else if (tile === 4) ctx.drawImage(bedImg, px, py, tileSize, tileSize);
        else if (tile === 5) ctx.drawImage(goddessImg, px, py, tileSize, tileSize);
      }
    }

    ctx.drawImage(heroImg, heroPos.x * tileSize, heroPos.y * tileSize, tileSize, tileSize);
    window.updateStatusDisplay(window.hero);
  }

  function setHomeMap() {
    currentStage = "home";
    map = window.generateHomeMap();
    heroPos.x = 1; heroPos.y = 1;
  }

  function checkHomeInteraction() {
    const tile = map[heroPos.y][heroPos.x];
    if (tile === 4) window.showSleepPopup(window.hero, drawMap);
    else if (tile === 5) window.showPrayerPopup(window.hero);
  }

  function checkStageTransition() {
    const tile = map[heroPos.y][heroPos.x];
    if (currentStage === "home" && tile === 2) {
      currentStage = "dungeon";
      dungeonLayer = 1;
      const result = window.generateDungeonMap(dungeonLayer);
      map = result.map;
      heroPos.x = result.heroStart.x;
      heroPos.y = result.heroStart.y;
      drawMap();
      return;
    }

    if (currentStage === "dungeon") {
      if (tile === 2) {
        dungeonLayer++;
        const result = window.generateDungeonMap(dungeonLayer);
        map = result.map;
        heroPos.x = result.heroStart.x;
        heroPos.y = result.heroStart.y;
        drawMap();
        return;
      }
      if (tile === 3) {
        window.showReturnHomePopup(window.hero, drawMap, setHomeMap);
      }
    }
  }

  window.addEventListener("keydown", e => {
    if (document.getElementById("prayerPopup") || document.getElementById("sleepPopup") || document.getElementById("returnPopup")) return;
    let nx = heroPos.x, ny = heroPos.y;
    switch (e.key) {
      case "ArrowUp": ny--; e.preventDefault(); break;
      case "ArrowDown": ny++; e.preventDefault(); break;
      case "ArrowLeft": nx--; e.preventDefault(); break;
      case "ArrowRight": nx++; e.preventDefault(); break;
      case "Enter":
        if (currentStage === "home" && map[heroPos.y][heroPos.x] === 4) window.showSleepPopup(window.hero, drawMap);
        return;
      default: return;
    }
    if (window.canMove(nx, ny, map)) {
      heroPos.x = nx; heroPos.y = ny;
      drawMap();
      if (currentStage === "home") checkHomeInteraction();
      checkStageTransition();
    }
  });

  drawMap();
});
