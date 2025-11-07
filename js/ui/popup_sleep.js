window.showSleepPopup = function(hero, drawMap) {
  if (document.getElementById("sleepPopup")) return;

  const popup = document.createElement("div");
  popup.id = "sleepPopup";
  Object.assign(popup.style, {
    position: "absolute",
    left: "50%", top: "50%", transform: "translate(-50%,-50%)",
    background: "#222", color: "white", padding: "20px",
    border: "2px solid #fff", zIndex: 1000, fontFamily: "monospace"
  });

  popup.innerHTML = `<h3>眠りますか？</h3>
    <button id="sleepConfirm">はい</button>
    <button id="sleepCancel">いいえ</button>`;

  document.body.appendChild(popup);

  popup.querySelector("#sleepConfirm").onclick = () => {
    hero.hp = hero.maxHp;
    ["atk","def","speed","luck"].forEach(stat => {
      hero.confirmedStats[stat] = hero[stat];
    });
    drawMap();
    popup.remove();
  };

  popup.querySelector("#sleepCancel").onclick = () => popup.remove();
};
