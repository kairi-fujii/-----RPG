// monster.js
// ==============================================
// 魔物管理・生成・追尾AI・描画
// ==============================================

// ゲーム内の全モンスター配列をグローバルに保持
window.monsters = [];

// ==============================================
// 魔物生成関数
// x, y: マップ上の座標
// type: 魔物の種類（デフォルト "slime"）
// ==============================================
export function spawnMonster(x, y, type = "slime") {
  const hero = window.hero;
  if (!hero) return;

  const monster = {
    x, y,           // マップ座標
    type,           // 魔物タイプ
    hp: 10,         // 初期HP
    atk: 2,
    def: 1,
    spd: 1
  };

  window.monsters.push(monster);
  console.log(`[Monster] spawn:`, monster);
}

// ==============================================
// 魔物AI（全て追尾型）
// Hero に近づく挙動
// ==============================================
export function updateMonsters() {
  const hero = window.hero;
  if (!hero) return;

  window.monsters.forEach(monster => {
    const dx = hero.pos.x - monster.x;
    const dy = hero.pos.y - monster.y;

    // Hero に近づく方向を1マス選択
    let stepX = 0, stepY = 0;
    if (Math.abs(dx) > Math.abs(dy)) stepX = dx > 0 ? 1 : -1;
    else if (dy !== 0) stepY = dy > 0 ? 1 : -1;

    // 移動先タイルが空きか確認（0: 通行可能）
    const nextX = monster.x + stepX;
    const nextY = monster.y + stepY;
    if (GameManager.map[nextY] && GameManager.map[nextY][nextX] === 0) {
      monster.x = nextX;
      monster.y = nextY;
    }

    // Hero と衝突した場合は戦闘開始
    if (monster.x === hero.pos.x && monster.y === hero.pos.y) {
      console.log(`[Battle] Hero encountered ${monster.type}`);
      // battleStart(monster) など戦闘処理呼び出しへ
    }
  });

  // 魔物描画呼び出し
  drawMonsters();
}

// ==============================================
// 魔物描画関数
// canvas 上に赤四角で表示（仮）
// ==============================================
export function drawMonsters() {
  const canvas = document.getElementById("stage");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const tileSizeX = canvas.width / GameManager.map[0].length;
  const tileSizeY = canvas.height / GameManager.map.length;
  const tileSize = Math.min(tileSizeX, tileSizeY);

  window.monsters.forEach(monster => {
    ctx.fillStyle = "red"; // 仮の色
    ctx.fillRect(monster.x * tileSize, monster.y * tileSize, tileSize, tileSize);
  });
}

// ==============================================
// グローバル登録
// ==============================================
window.spawnMonster = spawnMonster;
window.updateMonsters = updateMonsters;
window.drawMonsters = drawMonsters;
