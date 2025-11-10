// ui/popup_prayer.js
function showPrayerPopup(){
  if(document.getElementById("prayerPopup")) return;

  const popup = document.createElement("div");
  popup.id = "prayerPopup";
  Object.assign(popup.style,{
    position:"absolute", left:"50%", top:"50%", transform:"translate(-50%,-50%)",
    background:"#222", color:"white", padding:"20px",
    border:"2px solid #fff", zIndex:1000, fontFamily:"monospace"
  });
  popup.innerHTML = `
    <h3>祈りを捧げる</h3>
    <p>ソウル: ${Hero.soul}</p>
    ${createStatControl("ATK","atk","atkLevel")}
    ${createStatControl("DEF","def","defLevel")}
    ${createStatControl("SPD","speed","speedLevel")}
    ${createStatControl("LUK","luck","luckLevel")}
    <br><button id="closePopup">閉じる</button>`;
  document.body.appendChild(popup);

  popup.querySelector("#closePopup").onclick = ()=>popup.remove();

  ["atk","def","speed","luck"].forEach(stat=>{
    const lvlKey = stat+"Level";
    popup.querySelector(`#${stat}Up`).onclick = ()=>{
      const cost = 2*Hero[lvlKey]+10;
      if(Hero.soul>=cost){
        Hero[stat]++; Hero[lvlKey]++;
        Hero.soul -= cost;
        popup.remove(); showPrayerPopup();
      }
    };
    popup.querySelector(`#${stat}Down`).onclick = ()=>{
      const confirmed = Hero.confirmedStats[stat];
      if(Hero[stat]>confirmed){
        Hero[stat]--; Hero[lvlKey]--;
        Hero.soul += 2*Hero[lvlKey]+10;
        popup.remove(); showPrayerPopup();
      }
    };
  });
}
