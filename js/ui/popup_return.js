window.showReturnHomePopup = function(hero, drawMap, setHomeMap) {
  if (document.getElementById("returnPopup")) return;

  const popup = document.createElement("div");
  popup.id = "returnPopup";
  Object.assign(popup.style, {
    position: "absolute",
    left: "50%", top: "50%", transform: "translate(-50%,-50%)",
    background: "#222", color: "white", padding: "20px",
    border: "2px solid #fff", zIndex: 1000, fontFamily: "monospace"
  });

  popup.innerHTML = `<h3>拠点に帰還しますか？</h3>
    <button id="returnConfirm">はい</button>
    <button id="returnCancel">いいえ</button>`;

  document.body.appendChild(popup);

  popup.querySelector("#returnConfirm").onclick = () => {
    setHomeMap();
    drawMap();
    popup.remove();
  };
  popup.querySelector("#returnCancel").onclick = () => popup.remove();
};
