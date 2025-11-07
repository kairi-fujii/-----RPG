window.showPrayerPopup = function(hero) {
  const existing = document.getElementById("prayerPopup");
  if (existing) existing.remove();

  const popup = document.createElement("div");
  popup.id = "prayerPopup";
  Object.assign(popup.style, {
    position: "absolute",
    left: "50%", top: "50%", transform: "translate(-50%,-50%)",
    background: "#222", color: "white", padding: "20px",
    border: "2px solid #fff", zIndex: 1000, fontFamily: "monospace"
  });

  popup.innerHTML = `
    <h3>祈りを捧げる</h3>
    <p>ソウル: ${hero.soul}</p>
    ${window.createStatControl(hero, "ATK", "atk", "atkLevel")}
    ${window.createStatControl(hero, "DEF", "def", "defLevel")}
    ${window.createStatControl(hero, "SPD", "speed", "speedLevel")}
    ${window.createStatControl(hero, "LUK", "luck", "luckLevel")}
    <br><button id="closePopup">閉じる</button>
  `;

  document.body.appendChild(popup);
  popup.querySelector("#closePopup").onclick = () => popup.remove();

  ["atk","def","speed","luck"].forEach(stat => {
    const lvlKey = stat + "Level";
    popup.querySelector(`#${stat}Up`).onclick = () => {
      const cost = window.requiredSoul(hero[lvlKey]);
      if (hero.soul >= cost) {
        hero[stat]++;
        hero[lvlKey]++;
        hero.soul -= cost;
        window.showPrayerPopup(hero);
      }
    };
    popup.querySelector(`#${stat}Down`).onclick = () => {
      const confirmed = hero.confirmedStats[stat];
      if (hero[stat] > confirmed) {
        hero[stat]--;
        hero[lvlKey]--;
        hero.soul += window.requiredSoul(hero[lvlKey]);
        window.showPrayerPopup(hero);
      }
    };
  });
};
