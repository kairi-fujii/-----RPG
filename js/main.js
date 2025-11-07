// main.js
import { hero } from "./hero.js";
import { generateHomeMap, generateDungeonMap } from "./mapgen.js";
import { checkHomeInteraction } from "./stage/home.js";
import { showReturnHomePopup } from "./ui/popup_return.js";

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("stage");
  const ctx = canvas.getContext("2d");

  const homeTileSize = 64;
  const dungeonTileSize = 24;

  let currentStage = "home";
  let dungeonLayer = 1;
  let map = generateHomeMap();
  let heroPos = { x: 1, y: 1 };

  // 画像読み込み
  const assets = ["Ground", "Hero", "Bed", "GoddessStatue", "UphillStairs", "DownhillStairs"];
  const images = {};
  let loadedCount = 0;
  function checkAndDraw() { loadedCount++; if (loadedCount === assets.length) drawMap(); }

  assets.forEach(name => {
    images[name] = new Image();
    images[name].src = `assets/${name}.png`;
    images[name].onload = checkAndDraw;
  });

  function drawMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const tileSize = (currentStage === "home") ? homeTileSize : dungeonTileSize;
    canvas.width = tileSize * (currentStage === "home" ? 8 : 32);
    canvas.height = tileSize * (currentStage === "home" ? 6 : 32);

    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[0].length; x++) {
        const tile = map[y][x];
        const px = x * tileSize, py = y * tileSize;
        switch(tile){
          case 0: ctx.drawImage(images.Ground, px, py, tileSize, tileSize); break;
          case 1: ctx.fillStyle = "#555"; ctx.fillRect(px, py, tileSize, tileSize); break;
          case 2: ctx.drawImage(images.UphillStairs, px, py, tileSize, tileSize); break;
          case 3: ctx.drawImage(images.DownhillStairs, px, py, tileSize, tileSize); break;
          case 4: ctx.drawImage(images.Bed, px, py, tileSize, tileSize); break;
          case 5: ctx.drawImage(images.GoddessStatue, px, py, tileSize, tileSize); break;
        }
      }
    }

    ctx.drawImage(images.Hero, heroPos.x * tileSize, heroPos.y * tileSize, tileSize, tileSize);
    updateStatusDisplay();
  }

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

  function canMove(nx, ny) {
    return nx >= 0 && nx < map[0].length && ny >= 0 && ny < map.length && map[ny][nx] !== 1;
  }

  function setHomeState() {
    currentStage = "home";
    map = generateHomeMap();
    heroPos = { x: 1, y: 1 };
  }

  function checkStageTransition() {
    const tile = map[heroPos.y][heroPos.x];
    if (currentStage === "home" && tile === 2) {
      currentStage = "dungeon";
      dungeonLayer = 1;
      const result = generateDungeonMap(dungeonLayer);
      map = result.map;
      heroPos = result.heroStart;
      drawMap();
      return;
    }

    if (currentStage === "dungeon") {
      if (tile === 2) {
        dungeonLayer++;
        const result = generateDungeonMap(dungeonLayer);
        map = result.map;
        heroPos = result.heroStart;
        drawMap();
        return;
      }
      if (tile === 3) {
        showReturnHomePopup(drawMap, setHomeState);
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
        if (currentStage === "home" && map[heroPos.y][heroPos.x] === 4) import("./ui/popup_sleep.js").then(m=>m.showSleepPopup(drawMap));
        return;
      default: return;
    }
    if (canMove(nx, ny)) {
      heroPos.x = nx; heroPos.y = ny;
      drawMap();
      if (currentStage === "home") checkHomeInteraction(heroPos, map, drawMap);
      checkStageTransition();
    }
  });

  drawMap();
});
