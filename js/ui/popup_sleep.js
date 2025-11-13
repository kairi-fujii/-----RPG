// popup_sleep.js
function showSleepPopup() {
  if(document.getElementById("sleepPopup")) return;

  const popup = document.createElement("div");
  popup.id = "sleepPopup";
  Object.assign(popup.style,{
    position:"absolute", left:"50%", top:"50%",
    transform:"translate(-50%,-50%)",
    background:"#222", color:"white", padding:"20px",
    border:"2px solid #fff", zIndex:1000, fontFamily:"monospace"
  });

  popup.innerHTML = `
    <h3>眠りますか？</h3>
    <button id="sleepConfirm">はい</button>
    <button id="sleepCancel">いいえ</button>
  `;
  document.body.appendChild(popup);

  popup.querySelector("#sleepConfirm").onclick = ()=>{
    const hero = window.hero;

    // ==============================================
    // 予約値をステータスに反映
    // ==============================================
    ["maxHp","atk","def","spd","luck"].forEach(stat=>{
      // 祈りで予約された値を加算
      const reserve = hero.prayerReserve[stat] || 0;
      hero[stat] += reserve;

      // 確定ステータスを更新
      hero.confirmedStats[stat] = hero[stat];

      // ==============================================
      // レベルを確定値に更新（眠る前の予約値込みレベルを保存）
      // 次回の祈りで必要ソウル計算に反映される
      // ==============================================
      const lvlKey = stat + "Level";
      hero[lvlKey] = (hero[lvlKey] || 1) + reserve;

      // 予約値リセット
      hero.prayerReserve[stat] = 0;
    });

    // HP全回復
    hero.hp = hero.maxHp;

    // ソウルリセット
    hero.souls = 0;

    // マップ再描画
    GameManager.drawMap();
    popup.remove();
  };

  popup.querySelector("#sleepCancel").onclick = ()=>popup.remove();
}
