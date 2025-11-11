// popup_prayer.js
function showPrayerPopup() {
  // すでにポップアップが開いていたら新しく開かない
  if (document.getElementById("prayerPopup")) return;

  const hero = window.hero;
  const popup = document.createElement("div");
  popup.id = "prayerPopup";

  Object.assign(popup.style, {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    background: "#222",
    color: "white",
    padding: "20px",
    border: "2px solid #fff",
    zIndex: 1000,
    fontFamily: "monospace",
  });

  // ステータス選択ボタン生成
  popup.innerHTML = `
    <h3>祈りを捧げる</h3>
    <p>ソウル: ${hero.souls}</p>
    ${createStatControl("HP", "maxHp", "hpLevel")}
    ${createStatControl("ATK", "atk", "atkLevel")}
    ${createStatControl("DEF", "def", "defLevel")}
    ${createStatControl("SPD", "spd", "spdLevel")}
    ${createStatControl("LUK", "luck", "luckLevel")}
    <br><button id="closePopup">閉じる</button>
  `;

  document.body.appendChild(popup);

  // 閉じるボタン
  popup.querySelector("#closePopup").onclick = () => popup.remove();

  // 各ステータス操作処理
  ["maxHp", "atk", "def", "spd", "luck"].forEach((stat) => {
    const lvlKey = stat + "Level";

    popup.querySelector(`#${stat}Up`).onclick = () => {
      const cost = 2 * hero[lvlKey] + 10;
      if (hero.souls >= cost) {
        // ステータス上昇
        if (stat === "maxHp") {
          hero.maxHp += 2;
          hero.hp = hero.maxHp;
        } else {
          hero[stat]++;
        }
        hero[lvlKey]++;
        hero.souls -= cost;
        popup.remove();
        showPrayerPopup();
      }
    };

    popup.querySelector(`#${stat}Down`).onclick = () => {
      const confirmed = hero.confirmedStats[stat];
      if (hero[stat] > confirmed) {
        // ステータス減少
        if (stat === "maxHp") {
          hero.maxHp -= 2;
          if (hero.hp > hero.maxHp) hero.hp = hero.maxHp;
        } else {
          hero[stat]--;
        }
        hero[lvlKey]--;
        hero.souls += 2 * hero[lvlKey] + 10;
        popup.remove();
        showPrayerPopup();
      }
    };
  });
}

// ステータス項目の表示用関数
function createStatControl(label, key, lvlKey) {
  const hero = window.hero;
  return `
    <div>
      <label>${label}: ${hero[key]} (Lv.${hero[lvlKey]})</label>
      <button id="${key}Up">＋</button>
      <button id="${key}Down">−</button>
    </div>
  `;
}
