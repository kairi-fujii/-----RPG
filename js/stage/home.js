// stage/home.js
import { hero } from "../hero.js";
import { showSleepPopup } from "../ui/popup_sleep.js";
import { showPrayerPopup } from "../ui/popup_prayer.js";

export function checkHomeInteraction(heroPos, map, drawMap) {
  const tile = map[heroPos.y][heroPos.x];
  if (tile === 4) showSleepPopup(drawMap);
  else if (tile === 5) showPrayerPopup(drawMap);
}
