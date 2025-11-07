window.updateStatusDisplay = function(hero) {
  const container = document.getElementById("left");
  container.querySelectorAll(".stat").forEach(div => {
    const label = div.querySelector("span:first-child").textContent;
    const valueSpan = div.querySelector("span:last-child");
    switch (label) {
      case "HP": valueSpan.textContent = `${hero.hp} / ${hero.maxHp}`; break;
      case "ATK": valueSpan.textContent = hero.confirmedStats.atk ?? hero.atk; break;
      case "DEF": valueSpan.textContent = hero.confirmedStats.def ?? hero.def; break;
      case "SPD": valueSpan.textContent = hero.confirmedStats.speed ?? hero.speed; break;
      case "LUCK": valueSpan.textContent = hero.confirmedStats.luck ?? hero.luck; break;
      case "Souls": valueSpan.textContent = hero.soul; break;
    }
  });
};

window.createStatControl = function(hero, label, key, lvlKey) {
  return `
    <div>
      <label>${label}: ${hero[key]} (Lv.${hero[lvlKey]})</label>
      <button id="${key}Up">＋</button>
      <button id="${key}Down">−</button>
    </div>
  `;
};
