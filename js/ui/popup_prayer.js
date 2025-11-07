// ui/popup_prayer.js
import { hero, requiredSoul } from "../hero.js";
import { createPopupContainer, createStatControl } from "./ui_common.js";

export function showPrayerPopup(drawMap) {
  const popup = createPopupContainer("prayerPopup");

  popup.innerHTML = `
    <h3>祈りを捧げる</h3>
    <p>ソウル: ${hero.soul}</p>
    ${createStatControl("ATK", "atk", "atkLevel", hero)}
    ${createStatControl("DEF", "def", "defLevel", hero)}
    ${createStatControl("SPD", "speed", "speedLevel", hero)}
    ${createStatControl("LUK", "luck", "luckLevel", hero)}
    <br><button id="closePopup">閉じる</button>
  `;

  popup.querySelector("#closePopup").onclick = () => popup.remove();

  ["atk", "def", "speed", "luck"].forEach(stat => {
    const lvlKey = stat + "Level";
    popup.querySelector(`#${stat}Up`).onclick = () => {
      const cost = requiredSoul(hero[lvlKey]);
      if (hero.soul >= cost) {
        hero[stat]++;
        hero[lvlKey]++;
        hero.soul -= cost;
        showPrayerPopup(drawMap);
      }
    };
    popup.querySelector(`#${stat}Down`).onclick = () => {
      const confirmed = hero.confirmedStats[stat];
      if (hero[stat] > confirmed) {
        hero[stat]--;
        hero[lvlKey]--;
        hero.soul += requiredSoul(hero[lvlKey]);
        showPrayerPopup(drawMap);
      }
    };
  });
}
