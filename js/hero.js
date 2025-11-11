// hero.js
class Hero {
  constructor() {
    // ステータス値（初期値）
    this.hp = 10;           // 現在HP
    this.maxHp = 10;        // 最大HP
    this.atk = 2;           // 攻撃力
    this.def = 2;           // 防御力
    this.spd = 1;           // 素早さ
    this.luck = 1;          // 運
    this.souls = 1;         // 所持ソウル

    // 位置情報（マップ上の座標）
    this.pos = { x: 1, y: 1 };

    // 確定ステータス（眠った時に確定する値）
    this.confirmedStats = {
      hp: this.hp,
      atk: this.atk,
      def: this.def,
      spd: this.spd,
      luck: this.luck
    };

    // 各種レベル（祈り用）
    this.hpLevel = 1;
    this.atkLevel = 2;
    this.defLevel = 2;
    this.spdLevel = 1;
    this.luckLevel = 1;
  }
}

// グローバル化
window.hero = new Hero();
console.log("Hero initialized:", window.hero);
