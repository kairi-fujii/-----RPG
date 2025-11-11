// popup_prayer.js
function showPrayerPopup(){
  if(document.getElementById("prayerPopup")) return;

  const popup = document.createElement("div");
  popup.id = "prayerPopup";
  Object.assign(popup.style,{
    position:"absolute", left:"50%", top:"50%", transform:"translate(-50%,-50%)",
    background:"#222", color:"white", padding:"20px", border:"2px solid #fff", zIndex:1000, fontFamily:"monospace"
  });

  popup.innerHTML = `
    <h3>祈りを捧げる</h3>
    <p>ソウル: ${window.hero.souls}</p>
    ${createStatControl("ATK","atk","atkLevel")}
    ${createStatControl("DEF","def","defLevel")}
    ${createStatControl("SPD","spd","spdLevel")}
    ${createStatControl("LUK","luck","luckLevel")}
    <br><button id="closePopup">閉じる</button>
  `;
  document.body.appendChild(popup);
  popup.querySelector("#closePopup").onclick = ()=>popup.remove();

  ["atk","def","spd","luck"].forEach(stat=>{
    const lvlKey = stat+"Level";
    popup.querySelector(`#${stat}Up`).onclick = ()=>{
      const cost = 2*window.hero[lvlKey]+10;
      if(window.hero.souls>=cost){
        window.hero[stat]++; window.hero[lvlKey]++;
        window.hero.souls -= cost;
        popup.remove(); showPrayerPopup();
      }
    };
    popup.querySelector(`#${stat}Down`).onclick = ()=>{
      const confirmed = window.hero.confirmedStats[stat];
      if(window.hero[stat]>confirmed){
        window.hero[stat]--; window.hero[lvlKey]--;
        window.hero.souls += 2*window.hero[lvlKey]+10;
        popup.remove(); showPrayerPopup();
      }
    };
  });
}

function createStatControl(label,key,lvlKey){
  return `
    <div>
      <label>${label}: ${window.hero[key]} (Lv.${window.hero[lvlKey]})</label>
      <button id="${key}Up">＋</button>
      <button id="${key}Down">−</button>
    </div>
  `;
}
