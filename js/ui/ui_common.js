// ui/ui_common.js
function createStatControl(label,key,lvlKey){
  return `
  <div>
    <label>${label}: ${Hero[key]} (Lv.${Hero[lvlKey]})</label>
    <button id="${key}Up">＋</button>
    <button id="${key}Down">−</button>
  </div>`;
}
