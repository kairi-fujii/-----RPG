// js/treasure.js
function handleTreasureTile(tile, layer) {
  console.group("[Treasure] handleTreasureTile 呼び出し");

  // window.heroの存在確認
  if (typeof window.hero !== "object") {
    console.error("❌ window.heroが未定義です");
    console.groupEnd();
    return;
  }

  
  // 階層が undefined の場合は 1 とする
  layer = (typeof layer === "number") ? layer : 1;
  
  // 初期ログ
  console.log("🧍‍♂️ 現在のHero状態:", JSON.parse(JSON.stringify(window.hero)));
  console.log("🧭 現在位置:", window.hero.pos, " タイル:", tile, " 階層:", layer);

  // ベースソウル計算
  let baseSoul = 10 + layer * 2;
  const isRare = (tile === 7);
  console.log("💎 宝箱タイプ:", isRare ? "レア" : "ノーマル", " baseSoul:", baseSoul);

  // ランダムでレア化するケース
  if (!isRare && Math.random() < 0.1) {
    console.log("✨ 宝箱がレアに変化しました！");
    GameManager.map[window.hero.pos.y][window.hero.pos.x] = 7;
    GameManager.drawMap();
    console.groupEnd();
    return;
  }

  // レアならソウル倍率
  if (isRare) baseSoul = Math.floor(baseSoul * 1.5);

  // 幸運値を安全に取得
  const luck = (typeof window.hero.luck === "number") ? window.hero.luck : 0;

  // 獲得ソウル計算
  const gainedSoul = baseSoul + Math.floor(Math.random() * (luck + 1));
  console.log("🪙 獲得ソウル計算: baseSoul=", baseSoul, " luck=", luck, " → gainedSoul=", gainedSoul);

  // Heroのsoulsを更新
  if (typeof window.hero.souls === "number" && !isNaN(window.hero.souls)) {
    window.hero.souls += gainedSoul;
  } else {
    console.warn("⚠️ hero.soulsがNaNまたは未定義でした。リセットして再計算します。");
    window.hero.souls = gainedSoul;
  }

  // マップの更新
  GameManager.map[window.hero.pos.y][window.hero.pos.x] = 0;
  GameManager.drawMap();

  // デバッグ: 更新後のHero状態を確認
  console.log("✅ 更新後Hero:", JSON.parse(JSON.stringify(window.hero)));

  // showSoulEffect呼び出し（存在確認付き）
  if (typeof showSoulEffect === "function") {
    console.log("🎆 showSoulEffectを呼び出します:", { x: window.hero.pos.x, y: window.hero.pos.y, gainedSoul, isRare });
    showSoulEffect(window.hero.pos.x, window.hero.pos.y, gainedSoul, isRare);
  } else {
    console.warn("⚠️ showSoulEffectが未定義です。エフェクトは表示されません。");
  }

  console.groupEnd();
}
