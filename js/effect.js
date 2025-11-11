// js/effect.js
// 宝箱取得時にソウル増加のエフェクトを表示する
function showSoulEffect(x, y, gainedSoul, isRare) {
  console.group("[Effect] showSoulEffect 呼び出し");

  // エフェクト表示用のDIV作成
  const effect = document.createElement("div");
  effect.className = "soul-effect";
  effect.textContent = `+${gainedSoul} Souls${isRare ? " 💎" : ""}`;
  
  Object.assign(effect.style, {
    position: "absolute",
    left: `${x * 24}px`,    // タイルサイズに合わせて調整（ダンジョンは24px）
    top: `${y * 24}px`,
    color: isRare ? "gold" : "cyan",
    fontWeight: "bold",
    fontFamily: "monospace",
    fontSize: "16px",
    zIndex: 2000,
    pointerEvents: "none",
    transition: "transform 1s ease-out, opacity 1s ease-out",
  });

  document.body.appendChild(effect);

  console.log("🎆 ソウルエフェクト表示:", { x, y, gainedSoul, isRare });

  // アニメーション: 上に移動しながら透明に
  requestAnimationFrame(() => {
    effect.style.transform = "translateY(-40px)";
    effect.style.opacity = "0";
  });

  // 1秒後に削除
  setTimeout(() => {
    effect.remove();
    console.groupEnd();
  }, 1000);
}
