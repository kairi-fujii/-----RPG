// popup_sleep.js
function showSleepPopup() {
  // すでにポップアップが開いていたら再生成しない
  if (document.getElementById("sleepPopup")) return;

  const popup = document.createElement("div");
  popup.id = "sleepPopup";

  // スタイル設定
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

  // ポップアップ内容
  popup.innerHTML = `
    <h3>眠りますか？</h3>
    <button id="sleepConfirm">はい</button>
    <button id="sleepCancel">いいえ</button>
  `;
  document.body.appendChild(popup);

  // 「はい」選択時の処理
  popup.querySelector("#sleepConfirm").onclick = () => {
    const hero = window.hero;

    // HPを全回復
    hero.hp = hero.maxHp;

    // 現在のステータスを「確定ステータス」として保存
    ["maxHp", "atk", "def", "spd", "luck"].forEach((stat) => {
      hero.confirmedStats[stat] = hero[stat];
    });

    // ソウルをリセット（重要）
    hero.souls = 0;

    // 画面を再描画して反映
    GameManager.drawMap();

    // ポップアップを閉じる
    popup.remove();
  };

  // 「いいえ」選択時
  popup.querySelector("#sleepCancel").onclick = () => popup.remove();

}
