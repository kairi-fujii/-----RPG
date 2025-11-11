// hero.js
class Hero {
  constructor() {
    this.hp = 10;
    this.maxHp = 10;
    this.atk = 2;
    this.def = 2;
    this.spd = 1;
    this.luck = 1;
    this.souls = 1;

    // 初期位置
    this.pos = { x: 1, y: 1 };

    // ステータス確定値
    this.confirmedStats = { atk: this.atk, def: this.def, speed: this.spd, luck: this.luck };

    // レベル（祈り用）
    this.atkLevel = 2;
    this.defLevel = 2;
    this.speedLevel = 1;
    this.luckLevel = 1;
  }
}

// グローバル化
window.hero = new Hero();
console.log("Hero initialized:", window.hero);
