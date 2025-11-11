function handleTreasureTile(tile, layer) {
  console.group("[Treasure] handleTreasureTile 呼び出し");

  if (typeof window.hero !== "object") {
    console.error("❌ window.heroが未定義です");
    console.groupEnd();
    return;
  }

  // 階層が undefined の場合は 1 とする
  layer = (typeof layer === "number") ? layer : 1;
  
  console.log("🧍‍♂️ 現在のHero状態:", JSON.parse(JSON.stringify(window.hero)));
  console.log("🧭 現在位置:", window.hero.pos, " タイル:", tile, " 階層:", layer);

  let baseSoul = 10 + layer * 2;
  const isRare = (tile === 7);
  console.log("💎 宝箱タイプ:", isRare ? "レア" : "ノーマル", " baseSoul:", baseSoul);

  if (!isRare && Math.random() < 0.1) {
    console.log("✨ 宝箱がレアに変化しました！");
    GameManager.map[window.hero.pos.y][window.hero.pos.x] = 7;
    GameManager.drawMap();
    console.groupEnd();
    return;
  }

  if (isRare) baseSoul = Math.floor(baseSoul * 1.5);

  const luck = (typeof window.hero.luck === "number") ? window.hero.luck : 0;
  const gainedSoul = baseSoul + Math.floor(Math.random() * (luck + 1));
  console.log("🪙 獲得ソウル計算: baseSoul=", baseSoul, " luck=", luck, " → gainedSoul=", gainedSoul);

  if (typeof window.hero.souls === "number" && !isNaN(window.hero.souls)) {
    window.hero.souls += gainedSoul;
  } else {
    console.warn("⚠️ hero.soulsがNaNまたは未定義でした。リセットして再計算します。");
    window.hero.souls = gainedSoul;
  }

  GameManager.map[window.hero.pos.y][window.hero.pos.x] = 0;
  GameManager.drawMap();

  console.log("✅ 更新後Hero:", JSON.parse(JSON.stringify(window.hero)));

  if (typeof showSoulEffect === "function") {
    console.log("🎆 showSoulEffectを呼び出します:", { x: window.hero.pos.x, y: window.hero.pos.y, gainedSoul, isRare });
    showSoulEffect(window.hero.pos.x, window.hero.pos.y, gainedSoul, isRare);
  } else {
    console.warn("⚠️ showSoulEffectが未定義です。エフェクトは表示されません。");
  }

  console.groupEnd();
}

// 仮表示用 showSoulEffect
function showSoulEffect(x, y, amount, isRare) {
  console.log(`[SoulEffect] x:${x}, y:${y}, +${amount} ${isRare?"💎":"🪙"}`);
}
