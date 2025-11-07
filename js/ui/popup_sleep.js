// ui/popup_sleep.js
import { hero } from "../hero.js";
import { createPopupContainer } from "./ui_common.js";

export function showSleepPopup(drawMap) {
  if (document.getElementById("sleepPopup")) return;

  const popup = createPopupContainer("sleepPopup");
  popup.innerHTML = `
    <h3>眠りますか？</h3>
    <button id="sleepConfirm">はい</button>
    <button id="sleepCancel">いいえ</button>
  `;

  popup.querySelector("#sleepConfirm").onclick = () => {
    hero.hp = hero.maxHp;
    ["atk", "def", "speed", "luck"].forEach(stat => {
      hero.confirmedStats[stat] = hero[stat];
    });
    drawMap();
    popup.remove();
  };
  popup.querySelector("#sleepCancel").onclick = () => popup.remove();
}
