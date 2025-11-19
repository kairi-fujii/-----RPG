// ==============================================
// core/renderer.js
// ----------------------------------------------
// マップ描画、Hero・魔物の描画、魔物AI追跡ロジックを含む
// ブラウザ直読み対応版（ESモジュールではない）
// ==============================================

// ----------------------------------------------
// Rendererオブジェクト
// ----------------------------------------------
// ゲーム内の地形やキャラクターをCanvasに描画する責務を持つ
// ----------------------------------------------
const Renderer = {
  // 各種スプライト画像（ゲーム内の見た目）
  groundImg: new Image(),
  heroImg: new Image(),
  bedImg: new Image(),
  goddessImg: new Image(),
  upStairsImg: new Image(),
  downStairsImg: new Image(),
  treasureImg: new Image(),
  soulImg: new Image(),
  treasureRareImg: new Image(),
  monsterImg: new Image(), // ← 魔物スプライト追加

  // ----------------------------------------------
  // 画像ロード関数
  // ----------------------------------------------
  // 各種スプライトを非同期でロードし、すべて読み込み終わったらcallbackを実行
  // ----------------------------------------------
  loadImages: function (callback) {
    this.groundImg.src = "assets/Ground.png";
    this.heroImg.src = "assets/Hero.png";
    this.bedImg.src = "assets/Bed.png";
    this.goddessImg.src = "assets/GoddessStatue.png";
    this.upStairsImg.src = "assets/UphillStairs.png";
    this.downStairsImg.src = "assets/DownhillStairs.png";
    this.treasureImg.src = "assets/TreasureChest.png";
    this.treasureRareImg.src = "assets/TreasureChestRare.png";
    this.soulImg.src = "assets/Soul.png";
    this.monsterImg.src = "assets/Slime.png"; // 魔物画像（存在しない場合は空画像扱い）

    // 読み込み完了チェック用カウンタ
    let loadedCount = 0;
    const imgs = [
      this.groundImg, this.heroImg, this.bedImg, this.goddessImg,
      this.upStairsImg, this.downStairsImg, this.treasureImg,
      this.treasureRareImg, this.soulImg, this.monsterImg
    ];

    // 各画像読み込み完了時の処理
    imgs.forEach(img => {
      img.onload = () => {
        loadedCount++;
        // 全画像読み込みが完了したらcallback発火
        if (loadedCount === imgs.length && typeof callback === "function") callback();
      };
      // エラー時もカウントしてハングを防ぐ（ファイル欠損時の保険）
      img.onerror = () => {
        console.warn("[Renderer] 画像の読み込みに失敗しました:", img.src);
        loadedCount++;
        if (loadedCount === imgs.length && typeof callback === "function") callback();
      };
    });
  },

  // ----------------------------------------------
  // マップ描画処理
  // ----------------------------------------------
  // canvas：描画対象のCanvas要素
  // map：マップ配列（2次元）
  // currentStage："home" か "dungeon" を想定
  // ----------------------------------------------
  drawMap: function (canvas, map, currentStage) {
    // safety: canvas と map がない場合は早期リターン（既存処理に影響しないように）
    if (!canvas || !map) {
      console.warn("[Renderer] drawMap: canvas または map が未定義です");
      return;
    }

    const ctx = canvas.getContext("2d");

    // ステージによってタイルサイズを変更
    const tileSize = (currentStage === "home") ? 64 : 24;

    // Canvasサイズをマップに合わせて設定
    // ※ map の横幅は map[0].length、縦幅は map.length を使う（汎用対応）
    canvas.width = tileSize * (map[0] ? map[0].length : (currentStage === "home" ? 8 : 32));
    canvas.height = tileSize * (map.length || (currentStage === "home" ? 6 : 32));

    // 画面初期化
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ----------------------------------------------
    // マップ全体を走査し、各セルを描画
    // ----------------------------------------------
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < (map[0] ? map[0].length : 0); x++) {
        const tile = map[y][x];
        const px = x * tileSize;
        const py = y * tileSize;

        // タイル番号に応じた描画処理
        if (tile === 0) ctx.drawImage(this.groundImg, px, py, tileSize, tileSize);
        else if (tile === 1) { ctx.fillStyle = "#555"; ctx.fillRect(px, py, tileSize, tileSize); }
        else if (tile === 2) ctx.drawImage(this.upStairsImg, px, py, tileSize, tileSize);
        else if (tile === 3) ctx.drawImage(this.downStairsImg, px, py, tileSize, tileSize);
        else if (tile === 4) ctx.drawImage(this.bedImg, px, py, tileSize, tileSize);
        else if (tile === 5) ctx.drawImage(this.goddessImg, px, py, tileSize, tileSize);
        else if (tile === 6) ctx.drawImage(this.treasureImg, px, py, tileSize, tileSize);
        else if (tile === 7) ctx.drawImage(this.treasureRareImg, px, py, tileSize, tileSize);
      }
    }

    // ----------------------------------------------
    // 魔物描画（スプライト表示）
    // ----------------------------------------------
    // window.monsters が配列で存在する場合のみ描画を行う
    if (Array.isArray(window.monsters)) {
      window.monsters.forEach(monster => {
        if (!monster || !monster.alive) return;

        // 保険: monster.x/monster.y が map 範囲外の場合は描画しない
        const mx = monster.x, my = monster.y;
        if (typeof mx !== "number" || typeof my !== "number") return;
        if (!map[my] || typeof map[my][mx] === "undefined") return;

        // 魔物スプライトを描画（スプライト画像が未ロードでもエラーにならない）
        try {
          ctx.drawImage(this.monsterImg,
            mx * tileSize,
            my * tileSize,
            tileSize, tileSize
          );
        } catch (e) {
          // drawImage が失敗しても処理を継続（代替表示）
          ctx.fillStyle = "red";
          ctx.fillRect(mx * tileSize, my * tileSize, tileSize, tileSize);
        }

        // HPバー（魔物の上部に赤で表示） - maxHpが未定義ならhpを最大値扱い
        const maxHp = (typeof monster.maxHp === "number" && monster.maxHp > 0) ? monster.maxHp : monster.hp || 1;
        const hpRatio = Math.max((monster.hp || 0) / maxHp, 0);
        // HPバーのY座標が負になる場合は画面外に描画されるため clamp
        const barY = Math.max(my * tileSize - 4, 0);
        ctx.fillStyle = "black";
        ctx.fillRect(mx * tileSize, barY, tileSize, 3); // 背景バー（黒）
        ctx.fillStyle = "red";
        ctx.fillRect(mx * tileSize, barY, tileSize * hpRatio, 3); // 実HP量
      });
    }

    // ----------------------------------------------
    // Hero描画（window.hero を参照）
    // ----------------------------------------------
    if (typeof window.hero === "object" && window.hero.pos) {
      const hx = window.hero.pos.x, hy = window.hero.pos.y;
      // 範囲チェック：hero.pos がマップ外ならログして描画を試みない
      if (typeof hx === "number" && typeof hy === "number" && map[hy] && typeof map[hy][hx] !== "undefined") {
        ctx.drawImage(
          this.heroImg,
          hx * tileSize,
          hy * tileSize,
          tileSize, tileSize
        );
      } else {
        console.warn("[Renderer] hero.pos がマップ範囲外か未定義です:", window.hero && window.hero.pos);
      }
    }
  }
};

// ==============================================
// 魔物生成関数
// ==============================================
// 指定座標に魔物を生成し、window.monsters に追加する
// ==============================================
window.spawnMonster = function (x, y, type = "slime") {
  // Hero と GameManager.map が存在することを前提にするが、未定義なら警告を出す
  if (!window.hero) {
    console.warn("[spawnMonster] hero が未定義のためスポーンをスキップ:", x, y);
    return;
  }
  if (!GameManager || !Array.isArray(GameManager.map)) {
    console.warn("[spawnMonster] GameManager.map が未定義です。スポーン位置の妥当性を確認してください");
    // それでも登録は行う（map チェックは updateMonsters で行う）
  }

  // 魔物データ定義（種類別に将来拡張可能）
  const monster = {
    x, y,               // 現在座標
    type,               // 種類（例："slime"）
    hp: 10,
    maxHp: 10,
    atk: 2,
    def: 1,
    spd: 1,
    alive: true
  };

  if (!Array.isArray(window.monsters)) window.monsters = [];
  window.monsters.push(monster);
  console.log("[Monster] spawn:", monster);
};

// ==============================================
// 魔物AI（Hero追尾）
// ==============================================
// 全ての魔物がHeroの方向に1マスずつ近づく
// Heroに接触したら簡易戦闘を行う
// ==============================================
window.updateMonsters = function () {
  const hero = window.hero;
  if (!hero) return;
  if (!Array.isArray(window.monsters)) window.monsters = [];

  // Safety: GameManager.map が未定義のときは空配列扱いして処理崩壊を防ぐ
  const map = (typeof GameManager !== "undefined" && Array.isArray(GameManager.map)) ? GameManager.map : [];

  window.monsters.forEach(monster => {
    if (!monster || !monster.alive) return;

    // ----------------------------------------------
    // Heroへの方向ベクトルを算出
    // ----------------------------------------------
    const dx = hero.pos.x - monster.x;
    const dy = hero.pos.y - monster.y;

    // 移動方向を決定（シンプル追尾）
    let stepX = 0, stepY = 0;
    if (Math.abs(dx) > Math.abs(dy)) {
      stepX = dx > 0 ? 1 : -1;
    } else if (dy !== 0) {
      stepY = dy > 0 ? 1 : -1;
    }

    const nextX = monster.x + stepX;
    const nextY = monster.y + stepY;

    // ----------------------------------------------
    // 通行可能マス判定（map 範囲外／壁の場合は移動キャンセル）
    // ----------------------------------------------
    if (map[nextY] && typeof map[nextY][nextX] !== "undefined" && map[nextY][nextX] === 0) {
      monster.x = nextX;
      monster.y = nextY;
    }

    // ----------------------------------------------
    // Heroと接触した場合の戦闘処理
    // ----------------------------------------------
    if (monster.x === hero.pos.x && monster.y === hero.pos.y) {
      // ダメージ計算: 防御差分を考慮して最低1ダメージ
      const damage = Math.max((monster.atk || 1) - (hero.def || 0), 1);
      hero.hp -= damage;
      console.log(`💀 ${monster.type} が攻撃！Heroに${damage}ダメージ！`);

      // Hero死亡時処理
      if (hero.hp <= 0) {
        hero.hp = 0;
        // 必要ならここで Game Over ロジックやリスポーン処理を追加してください
        alert("あなたは倒れてしまった…");
      }
    }
  });

  // 再描画（AI更新後） - 既存処理を維持するためここで drawMap を呼ぶ
  if (typeof GameManager !== "undefined" && typeof GameManager.drawMap === "function") {
    GameManager.drawMap();
  }
};

// ----------------------------------------------
// Rendererをグローバルに公開
// ----------------------------------------------
window.Renderer = Renderer;
