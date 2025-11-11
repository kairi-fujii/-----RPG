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

    // 予約値をステータスに反映
    ["maxHp","atk","def","spd","luck"].forEach(stat=>{
      hero[stat] += hero.prayerReserve[stat] || 0;
      hero.confirmedStats[stat] = hero[stat]; // 確定ステータス更新
      hero.prayerReserve[stat] = 0;          // 予約値リセット
    });

    // HP全回復
    hero.hp = hero.maxHp;

    // ソウルリセット
    hero.souls = 0;

    GameManager.drawMap();
    popup.remove();
  };

  popup.querySelector("#sleepCancel").onclick = ()=>popup.remove();
}
