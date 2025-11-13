// js/effect.js
// ----------------------------------------------------------
// Hero上にDOMでフェードアップするソウル獲得エフェクト
// 座標補正と文字サイズ拡大で視認性向上
// ----------------------------------------------------------

class SoulEffect {
  constructor(x, y, gainedSoul, isRare) {
    this.x = x; // タイル座標X
    this.y = y; // タイル座標Y
    this.gainedSoul = gainedSoul;
    this.isRare = isRare;

    this.createElement();
  }

  createElement() {
    this.el = document.createElement("div");
    this.el.textContent = `+${this.gainedSoul}`;
    this.el.style.position = "absolute";
    this.el.style.color = this.isRare ? "#FFD700" : "#00FFFF"; // 金色／シアン
    this.el.style.fontWeight = "bold";
    this.el.style.fontFamily = "monospace";
    this.el.style.fontSize = "24px"; // 文字サイズ大きめ
    this.el.style.textShadow = "0 0 6px #000"; // 文字の視認性アップ
    this.el.style.pointerEvents = "none";
    this.el.style.transition = "transform 1s ease-out, opacity 1s ease-out";
    this.el.style.opacity = "1";

    const container = document.getElementById("stage-wrap");
    container.appendChild(this.el);

    // 初期位置をHeroの中央上にセット
    this.updatePosition(0);

    requestAnimationFrame(() => this.animate());
  }

  updatePosition(offsetY) {
    const tileSize = 24; // ダンジョンモード想定
    const stageCanvas = document.getElementById("stage");

    // Canvas上のタイル座標をDOM座標に変換
    const heroPx = this.x * tileSize + tileSize / 2;
    const heroPy = this.y * tileSize + tileSize / 2;

    // テキストの中心をHero中央に揃える
    const elWidth = 0; // transformで中央揃えするので不要
    const elHeight = 0;

    this.el.style.left = `${heroPx}px`;
    this.el.style.top = `${heroPy + offsetY}px`;
    this.el.style.transform = "translate(-50%, -100%)"; // 中央上に配置
  }

  animate() {
    // 上昇・フェードアウト
    this.el.style.transform += " translateY(-40px)"; // さらに上昇
    this.el.style.opacity = "0";

    // 1秒後に削除
    setTimeout(() => {
      if (this.el && this.el.parentElement) {
        this.el.parentElement.removeChild(this.el);
      }
    }, 1000);
  }
}

// グローバル関数
function showSoulEffect(x, y, gainedSoul, isRare) {
  console.log("💫 showSoulEffect 呼び出し確認:", x, y, gainedSoul, isRare);
  new SoulEffect(x, y, gainedSoul, isRare);
}

window.SoulEffect = SoulEffect;
window.showSoulEffect = showSoulEffect;
