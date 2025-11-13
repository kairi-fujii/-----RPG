// ----------------------------------------------------------
// SoulEffectクラス
// 宝箱取得時に出現する「ソウル獲得エフェクト」をDOMで表示
// ----------------------------------------------------------
class SoulEffect {
  /**
   * コンストラクタ
   * @param {number} x - マップ上のタイルX座標
   * @param {number} y - マップ上のタイルY座標
   * @param {number} gainedSoul - 獲得したソウル量
   * @param {boolean} isRare - レア宝箱かどうか
   */
  constructor(x, y, gainedSoul, isRare) {
    this.x = x;                 // タイルX座標
    this.y = y;                 // タイルY座標
    this.gainedSoul = gainedSoul; // 獲得ソウル量
    this.isRare = isRare;       // レア宝箱かどうか

    // 描画処理はブラウザの次フレームで行う
    // これによりDOMが安定してからの配置が可能
    requestAnimationFrame(() => this.createElement());
  }

  /**
   * エフェクト用DOM要素の作成
   */
  createElement() {
    // 1. div要素を作成して文字を設定
    this.el = document.createElement("div");
    this.el.textContent = `+${this.gainedSoul}`;

    // 2. CSSスタイルを設定
    this.el.style.position = "absolute";           // 絶対配置
    this.el.style.color = this.isRare ? "#FFD700" : "#00FFFF"; // 色分け
    this.el.style.fontWeight = "bold";            // 太字
    this.el.style.fontFamily = "monospace";       // 等幅フォント
    this.el.style.fontSize = "28px";              // サイズ大きめ
    this.el.style.textShadow = "0 0 6px #000";    // 文字を浮かせる影
    this.el.style.pointerEvents = "none";         // マウスイベントを無効化
    this.el.style.transition = "transform 1s ease-out, opacity 1s ease-out"; // フェード＆移動
    this.el.style.opacity = "1";                  // 初期は完全に表示

    // 3. 親要素に追加
    const container = document.getElementById("stage-wrap");
    container.appendChild(this.el);

    // 4. Canvasの位置とサイズを取得
    const stageCanvas = document.getElementById("stage");
    const rect = stageCanvas.getBoundingClientRect(); // 画面上の位置とサイズ

    // マップタイルの1マスのピクセルサイズを計算
    const tileSizeX = rect.width / (window.GameManager?.map[0].length || 32);
    const tileSizeY = rect.height / (window.GameManager?.map.length || 32);
    const tileSize = Math.min(tileSizeX, tileSizeY); // 正方形タイルを想定

    // 5. Heroの上にエフェクトを配置
    // offsetX: 横方向微調整（正値で右方向、負値で左方向にずらす）
    // offsetY: 縦方向微調整（正値で下方向、負値で上方向にずらす）
    // この値を調整することで、Heroの中心に合わせたり、画面端でのズレを補正可能
    const offsetX = tileSize * (-11.0); // 現状右方向微調整（負値で右寄せ）
    const offsetY = tileSize * 1.0;     // 少し上にずらす（負にするとさらに上、正にすると下）

    // 左上原点からの座標を計算して適用
    // rect.left/top + scroll を加えることでスクロール位置も考慮
    this.el.style.left = `${rect.left + window.scrollX + this.x * tileSize + tileSize / 2 + offsetX}px`;
    this.el.style.top = `${rect.top + window.scrollY + this.y * tileSize - offsetY}px`;

    // transformで文字中央揃え＆上寄せ
    this.el.style.transform = "translate(-50%, -100%)";

    // アニメーション開始
    requestAnimationFrame(() => this.animate());
  }

  /**
   * 上昇＆フェードアウトアニメーション
   * transformで上方向に移動し、opacityを0にして徐々に消す
   * 1秒後にDOMから削除
   */
  animate() {
    // 上方向に60px移動
    this.el.style.transform += " translateY(-60px)";

    // フェードアウト
    this.el.style.opacity = "0";

    // 1秒後にDOMを削除してメモリ解放
    setTimeout(() => {
      if (this.el && this.el.parentElement) {
        this.el.parentElement.removeChild(this.el);
      }
    }, 1000);
  }
}

// ----------------------------------------------------------
// ソウルエフェクト呼び出し関数
// ----------------------------------------------------------
function showSoulEffect(x, y, gainedSoul, isRare) {
  // SoulEffectインスタンスを生成してエフェクト表示
  new SoulEffect(x, y, gainedSoul, isRare);
}

// グローバルに公開
window.SoulEffect = SoulEffect;
window.showSoulEffect = showSoulEffect;
