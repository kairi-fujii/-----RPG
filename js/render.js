window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("stage");
  const ctx = canvas.getContext("2d");

  const homeTileSize = 64;
  const dungeonTileSize = 24;

  let currentStage = "home";
  let dungeonLayer = 1;
  let map = generateHomeMap();
  let heroPos = { x: 1, y: 1 };

  const hero = {
    hp: 10,
    maxHp: 10,
    atk: 2, atkLevel: 1,
    def: 2, defLevel: 1,
    speed: 1, speedLevel: 1,
    luck: 0, luckLevel: 1,
    soul: 50,
    confirmedStats: { atk: 2, def: 2, speed: 1, luck: 0 }
  };

  const groundImg = new Image(); groundImg.src = "assets/Ground.png";
  const heroImg = new Image(); heroImg.src = "assets/Hero.png";
  const bedImg = new Image(); bedImg.src = "assets/Bed.png";
  const goddessImg = new Image(); goddessImg.src = "assets/GoddessStatue.png";
  const upStairsImg = new Image(); upStairsImg.src = "assets/UphillStairs.png";
  const downStairsImg = new Image(); downStairsImg.src = "assets/DownhillStairs.png";

  let loadedCount = 0;
  function checkAndDraw() { loadedCount++; if (loadedCount === 6) drawMap(); }
  groundImg.onload = heroImg.onload = bedImg.onload = goddessImg.onload = upStairsImg.onload = downStairsImg.onload = checkAndDraw;

  function generateHomeMap() {
    const width = 8, height = 6;
    const map = Array.from({ length: height }, () => Array(width).fill(0));
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (x === 0 || x === width - 1 || y === 0 || y === height - 1) map[y][x] = 1;
      }
    }
    map[1][6] = 2; // 上り階段
    map[4][1] = 4; // ベッド
    map[4][6] = 5; // 女神像
    return map;
  }

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

  function requiredSoul(level) {
    return 2 * level + 10;
  }

  function showPrayerPopup() {
    const existing = document.getElementById("prayerPopup");
    if (existing) existing.remove();

    const popup = document.createElement("div");
    popup.id = "prayerPopup";
    Object.assign(popup.style, {
      position: "absolute",
      left: "50%", top: "50%", transform: "translate(-50%,-50%)",
      background: "#222", color: "white", padding: "20px",
      border: "2px solid #fff", zIndex: 1000, fontFamily: "monospace"
    });

    popup.innerHTML = `
      <h3>祈りを捧げる</h3>
      <p>ソウル: ${hero.soul}</p>
      ${createStatControl("ATK", "atk", "atkLevel")}
      ${createStatControl("DEF", "def", "defLevel")}
      ${createStatControl("SPD", "speed", "speedLevel")}
      ${createStatControl("LUK", "luck", "luckLevel")}
      <br><button id="closePopup">閉じる</button>
    `;
    document.body.appendChild(popup);
    popup.querySelector("#closePopup").onclick = () => popup.remove();

    ["atk", "def", "speed", "luck"].forEach(stat => {
      const lvlKey = stat + "Level";
      popup.querySelector(`#${stat}Up`).onclick = () => {
        const cost = requiredSoul(hero[lvlKey]);
        if (hero.soul >= cost) {
          hero[stat]++;
          hero[lvlKey]++;
          hero.soul -= cost;
          showPrayerPopup();
        }
      };
      popup.querySelector(`#${stat}Down`).onclick = () => {
        const confirmed = hero.confirmedStats[stat];
        if (hero[stat] > confirmed) {
          hero[stat]--;
          hero[lvlKey]--; // レベルも減らす
          const refundedSoul = requiredSoul(hero[lvlKey]); // レベルを減らした後のソウルを返却
          hero.soul += refundedSoul;
          showPrayerPopup();
        }
      };
    });
  }

  function createStatControl(label, key, lvlKey) {
    return `
      <div>
        <label>${label}: ${hero[key]} (Lv.${hero[lvlKey]})</label>
        <button id="${key}Up">＋</button>
        <button id="${key}Down">−</button>
      </div>
    `;
  }

  function checkHomeInteraction() {
    const tile = map[heroPos.y][heroPos.x];
    if (tile === 4) showSleepPopup();
    else if (tile === 5) showPrayerPopup();
  }

  function showSleepPopup() {
    if (document.getElementById("sleepPopup")) return;
    const popup = document.createElement("div");
    popup.id = "sleepPopup";
    Object.assign(popup.style, {
      position: "absolute",
      left: "50%", top: "50%", transform: "translate(-50%,-50%)",
      background: "#222", color: "white", padding: "20px",
      border: "2px solid #fff", zIndex: 1000, fontFamily: "monospace"
    });
    popup.innerHTML = `<h3>眠りますか？</h3>
      <button id="sleepConfirm">はい</button>
      <button id="sleepCancel">いいえ</button>`;
    document.body.appendChild(popup);

    popup.querySelector("#sleepConfirm").onclick = () => {
      hero.hp = hero.maxHp;
      ["atk", "def", "speed", "luck"].forEach(stat => {
        hero.confirmedStats[stat] = hero[stat];
      });
      drawMap();
      popup.remove();
    };
    popup.querySelector("#sleepCancel").onclick = () => popup.remove();
  }

  function showReturnHomePopup() {
    if (document.getElementById("returnPopup")) return;
    const popup = document.createElement("div");
    popup.id = "returnPopup";
    Object.assign(popup.style, {
      position: "absolute",
      left: "50%", top: "50%", transform: "translate(-50%,-50%)",
      background: "#222", color: "white", padding: "20px",
      border: "2px solid #fff", zIndex: 1000, fontFamily: "monospace"
    });
    popup.innerHTML = `<h3>拠点に帰還しますか？</h3>
      <button id="returnConfirm">はい</button>
      <button id="returnCancel">いいえ</button>`;
    document.body.appendChild(popup);

    popup.querySelector("#returnConfirm").onclick = () => {
      currentStage = "home";
      map = generateHomeMap();
      heroPos = { x: 1, y: 1 };
      drawMap();
      popup.remove();
    };
    popup.querySelector("#returnCancel").onclick = () => popup.remove();
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
        showReturnHomePopup();
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
        if (currentStage === "home" && map[heroPos.y][heroPos.x] === 4) showSleepPopup();
        return;
      default: return;
    }
    if (canMove(nx, ny)) {
      heroPos.x = nx; heroPos.y = ny;
      drawMap();
      if (currentStage === "home") checkHomeInteraction();
      checkStageTransition();
    }
  });

  function generateDungeonMap(layer) {
    const size = 32;
    const map = Array.from({ length: size }, () => Array(size).fill(0));
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (Math.random() < 0.2) map[y][x] = 1;
      }
    }

    const emptyTiles = [];
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (map[y][x] === 0) emptyTiles.push({ x, y });
      }
    }

    const upPos = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    map[upPos.y][upPos.x] = 2;
    const farTiles = emptyTiles.filter(pos => Math.abs(pos.x - upPos.x) + Math.abs(pos.y - upPos.y) >= 10);
    const downPos = farTiles[Math.floor(Math.random() * farTiles.length)];
    map[downPos.y][downPos.x] = 3;

    const heroStartCandidates = emptyTiles.filter(p =>
      !(p.x === upPos.x && p.y === upPos.y) && !(p.x === downPos.x && p.y === downPos.y)
    );
    const heroStart = heroStartCandidates[Math.floor(Math.random() * heroStartCandidates.length)];
    return { map, heroStart };
  }

  drawMap();
});
