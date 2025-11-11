// hero.js
class Hero {
  constructor() {
    // ===============================
    // 基本ステータス（初期値）
    // ===============================

    this.maxHp = 10;          // 最大HP（初期値）
    this.hp = this.maxHp;     // 現在HP（最大HPと同期させる）
    this.atk = 2;             // 攻撃力
    this.def = 2;             // 防御力
    this.spd = 1;             // 素早さ
    this.luck = 1;            // 運
    this.souls = 20000;          // 所持ソウル

    // ===============================
    // 位置情報（マップ上の座標）
    // ===============================
    this.pos = { x: 1, y: 1 };

    // ===============================
    // 確定ステータス（眠った時に確定する値）
    // ※「最大HP」で同期を取る方が一貫性あり
    // ===============================
    this.confirmedStats = {
      maxHp: this.maxHp,  // ← ここを「hp」ではなく「maxHp」に
      atk: this.atk,
      def: this.def,
      spd: this.spd,
      luck: this.luck
    };

    // ===============================
    // 各ステータスのレベル（祈りで上昇）
    // ===============================
    this.maxHpLevel = 1;  // 最大HPのレベル
    this.atkLevel = 2;    // 攻撃力のレベル
    this.defLevel = 2;    // 防御力のレベル
    this.spdLevel = 1;    // 素早さのレベル
    this.luckLevel = 1;   // 運のレベル
  }

  // ===============================
  // HPを最大値まで回復するメソッド（補助用）
  // ===============================
  recoverFullHp() {
    this.hp = this.maxHp;
    console.log(`HP全回復: 現在HP=${this.hp}/${this.maxHp}`);
  }
}

// ===============================
// グローバル化
// ===============================
window.hero = new Hero();
console.log("✅ Hero initialized:", window.hero);
