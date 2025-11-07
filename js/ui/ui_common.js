// ui/ui_common.js
export function createPopupContainer(id) {
  const existing = document.getElementById(id);
  if (existing) existing.remove();

  const popup = document.createElement("div");
  popup.id = id;
  Object.assign(popup.style, {
    position: "absolute",
    left: "50%", top: "50%", transform: "translate(-50%,-50%)",
    background: "#222", color: "white", padding: "20px",
    border: "2px solid #fff", zIndex: 1000, fontFamily: "monospace"
  });

  document.body.appendChild(popup);
  return popup;
}

export function createStatControl(label, key, lvlKey, hero) {
  return `
    <div>
      <label>${label}: ${hero[key]} (Lv.${hero[lvlKey]})</label>
      <button id="${key}Up">＋</button>
      <button id="${key}Down">−</button>
    </div>
  `;
}
