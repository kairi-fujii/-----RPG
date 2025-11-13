// effect.js

/**
 * ソウル獲得エフェクトをDOM上に表示する関数
 * @param {number} tileX - タイルX座標
 * @param {number} tileY - タイルY座標
 * @param {number} gainedSoul - 獲得したソウル数
 * @param {boolean} isRare - レア宝箱かどうか
 */
export function showSoulEffect(tileX, tileY, gainedSoul, isRare = false) {
  console.log("💫 showSoulEffect 呼び出し確認:", tileX, tileY, gainedSoul, isRare);

  // --- 🎨 キャンバスまたは親要素の取得 ---
  const canvas = document.getElementById("gameCanvas");
  if (!canvas) {
    console.warn("⚠️ canvasが見つかりません。effectを表示できません。");
    return;
  }

  // --- 📏 canvasの位置を取得（画面座標系） ---
  const rect = canvas.getBoundingClientRect();

  // --- 🧮 タイルサイズを算出（仮に32pxを基本とする） ---
  const tileSize = 32;

  // --- 🎯 タイル座標を画面座標に変換 ---
  const screenX = rect.left + tileX * tileSize + tileSize / 2;
  const screenY = rect.top + tileY * tileSize + tileSize / 2;

  // --- 💬 エフェクト要素を作成 ---
  const effect = document.createElement("div");
  effect.className = "soul-effect";
  effect.innerText = `+${gainedSoul} 🪙`;

  // --- 🧭 レア宝箱の場合は特別な色を適用 ---
  if (isRare) {
    effect.style.color = "#FFD700"; // ゴールド
    effect.style.textShadow = "0 0 8px rgba(255, 215, 0, 0.8)";
  } else {
    effect.style.color = "#00FFFF"; // 通常はシアン
    effect.style.textShadow = "0 0 6px rgba(0, 255, 255, 0.6)";
  }

  // --- 📐 初期位置・見た目を設定 ---
  Object.assign(effect.style, {
    position: "fixed",
    left: `${screenX}px`,
    top: `${screenY}px`,
    transform: "translate(-50%, -50%)",
    fontSize: "20px",
    fontWeight: "bold",
    opacity: "1",
    pointerEvents: "none",
    zIndex: 9999,
    transition: "all 1s ease-out",
  });

  // --- 🌟 DOMに追加 ---
  document.body.appendChild(effect);

  // --- ⏫ 少し上にフェードアップさせて消す ---
  setTimeout(() => {
    effect.style.top = `${screenY - 50}px`;
    effect.style.opacity = "0";
  }, 50);

  // --- 🧹 完了後に削除 ---
  setTimeout(() => {
    effect.remove();
  }, 1200);
}
