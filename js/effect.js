class SoulEffect {
  constructor(x, y, gainedSoul, isRare) {
    this.x = x;
    this.y = y;
    this.gainedSoul = gainedSoul;
    this.isRare = isRare;

    // 描画後にDOM作成
    requestAnimationFrame(() => this.createElement());
  }

  createElement() {
    this.el = document.createElement("div");
    this.el.textContent = `+${this.gainedSoul}`;
    this.el.style.position = "absolute";
    this.el.style.color = this.isRare ? "#FFD700" : "#00FFFF";
    this.el.style.fontWeight = "bold";
    this.el.style.fontFamily = "monospace";
    this.el.style.fontSize = "28px";
    this.el.style.textShadow = "0 0 6px #000";
    this.el.style.pointerEvents = "none";
    this.el.style.transition = "transform 1s ease-out, opacity 1s ease-out";
    this.el.style.opacity = "1";

    const container = document.getElementById("stage-wrap");
    container.appendChild(this.el);

    // Canvas位置・サイズを取得
    const stageCanvas = document.getElementById("stage");
    const rect = stageCanvas.getBoundingClientRect();
    const tileSizeX = stageCanvas.width / (window.GameManager?.map[0].length || 32);
    const tileSizeY = stageCanvas.height / (window.GameManager?.map.length || 32);
    const tileSize = Math.min(tileSizeX, tileSizeY);

    // Hero中央上に配置
    this.el.style.left = `${this.x * tileSize + tileSize / 2}px`;
    this.el.style.top = `${this.y * tileSize}px`;
    this.el.style.transform = "translate(-50%, -100%)";

    requestAnimationFrame(() => this.animate());
  }

  animate() {
    this.el.style.transform += " translateY(-60px)"; // 上昇量調整
    this.el.style.opacity = "0";

    setTimeout(() => {
      if (this.el && this.el.parentElement) {
        this.el.parentElement.removeChild(this.el);
      }
    }, 1000);
  }
}

function showSoulEffect(x, y, gainedSoul, isRare) {
  console.log("💫 showSoulEffect 呼び出し確認:", x, y, gainedSoul, isRare);
  new SoulEffect(x, y, gainedSoul, isRare);
}

window.SoulEffect = SoulEffect;
window.showSoulEffect = showSoulEffect;
