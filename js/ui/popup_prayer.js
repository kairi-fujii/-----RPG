// popup_prayer.js
function showPrayerPopup() {
  // ==============================================
  // 既存ポップアップ取得
  // ==============================================
  let popup = document.getElementById("prayerPopup");
  const hero = window.hero;
  if (!hero) return; // Hero未定義なら終了

  // ==============================================
  // 予約値オブジェクト初期化（祈りで増加する値を保持）
  // ==============================================
  if (!hero.prayerReserve) hero.prayerReserve = { maxHp:0, atk:0, def:0, spd:0, luck:0 };

  // ==============================================
  // ポップアップ生成（初回のみ）
  // ==============================================
  if (!popup) {
    popup = document.createElement("div");
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
      display: "grid",
      gap: "8px"
    });

    // 初回HTML生成（ラベルは仮表示）
    popup.innerHTML = `<h3>🙏 祈りを捧げる</h3>
      <p id="prayerSouls">ソウル: ${hero.souls}</p>
      ${createStatControl("MaxHP","maxHp","maxHpLevel", hero.prayerReserve)}
      ${createStatControl("ATK","atk","atkLevel", hero.prayerReserve)}
      ${createStatControl("DEF","def","defLevel", hero.prayerReserve)}
      ${createStatControl("SPD","spd","spdLevel", hero.prayerReserve)}
      ${createStatControl("LUK","luck","luckLevel", hero.prayerReserve)}
      <br><button id="closePopup">閉じる</button>
    `;
    document.body.appendChild(popup);

    // 初期値更新（必要ソウル含む）
    updatePrayerPopupDisplay();

    // ==============================================
    // 「閉じる」ボタン
    // ==============================================
    popup.querySelector("#closePopup").onclick = () => popup.remove();

    // ==============================================
    // 各ステータス + / − ボタン設定
    // ==============================================
    ["maxHp","atk","def","spd","luck"].forEach((stat)=>{
      const upBtn = popup.querySelector(`#${stat}Up`);
      const downBtn = popup.querySelector(`#${stat}Down`);
      const lvlKey = stat + "Level";
      if(!upBtn || !downBtn) return;

      // + ボタン押下
      upBtn.onclick = ()=>{
        const cost = 2*hero[lvlKey]+10;  // 次レベルに必要ソウル
        if(hero.souls >= cost){
          hero.prayerReserve[stat]++;     // 予約値加算
          hero.souls -= cost;             // ソウル消費
          updatePrayerPopupDisplay();     // ラベルのみ更新
        }
      };

      // - ボタン押下
      downBtn.onclick = ()=>{
        const confirmed = hero.confirmedStats[stat]; // 下限
        if(hero[stat]+hero.prayerReserve[stat] > confirmed){
          hero.prayerReserve[stat]--;         // 予約値減少
          hero.souls += 2*hero[lvlKey]+10;    // ソウル返還
          updatePrayerPopupDisplay();
        }
      };
    });
  } else {
    // 既存ポップアップがある場合は値だけ更新
    updatePrayerPopupDisplay();
  }
}

// ==============================================
// ラベル・ソウルを更新（予約値 + 必要ソウルを含む）
// ==============================================
function updatePrayerPopupDisplay(){
  const hero = window.hero;
  if(!hero) return;

  // ソウル表示更新
  const soulsP = document.getElementById("prayerSouls");
  if(soulsP) soulsP.textContent = `ソウル: ${hero.souls}`;

  // 各ステータス更新
  ["maxHp","atk","def","spd","luck"].forEach(stat=>{
    const labelDiv = document.querySelector(`#${stat}Up`).parentElement.querySelector(".stat-label");
    const costDiv = document.querySelector(`#${stat}Up`).parentElement.querySelector(".stat-cost");
    if(!labelDiv || !costDiv) return;

    const lvlKey = stat + "Level";
    const currentVal = hero[stat];                   // 現在値
    const reserveVal = hero.prayerReserve[stat];     // 予約値
    const displayReserve = `+${reserveVal}`;        // 予約値表示（初期から +0）
    const displayLevel = hero[lvlKey]+reserveVal;   // 予約値込みでレベル表示
    const nextCost = 2*displayLevel+10;             // 次レベルに必要なソウル

    // 表示更新
    labelDiv.textContent = `${stat.toUpperCase()}: ${currentVal} (Lv.${displayLevel}) (${displayReserve})`;
    costDiv.textContent = `必要ソウル: ${nextCost}`;
  });
}

// ==============================================
// ステータス行生成（初回のみ）
// グリッド5列: 現在値 / レベル / 予約値 / ボタン / 必要ソウル
// ==============================================
function createStatControl(label,key,lvlKey,reserve){
  const hero = window.hero;
  const lvl = hero[lvlKey];
  const reserveVal = reserve[key] || 0;
  const displayReserve = `+${reserveVal}`;
  const displayLevel = lvl + reserveVal;
  const nextCost = 2*displayLevel+10;

  return `
    <div class="stat-row" style="display:grid;grid-template-columns:1fr auto auto auto auto;align-items:center;gap:4px;">
      <div class="stat-label">${label}: ${hero[key]} (Lv.${displayLevel}) (${displayReserve})</div>
      <button id="${key}Up">＋</button>
      <button id="${key}Down">−</button>
      <div class="stat-cost">必要ソウル: ${nextCost}</div>
    </div>
  `;
}
