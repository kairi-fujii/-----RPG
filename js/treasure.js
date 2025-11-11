// js/treasure.js
function handleTreasureTile(tile, layer){
  if(typeof window.hero !== "object"){
    console.error("window.heroが未定義です");
    return;
  }

  let baseSoul = 10 + layer*2;
  const isRare = (tile===7);

  if(!isRare && Math.random()<0.1){
    GameManager.map[window.hero.pos.y][window.hero.pos.x] = 7;
    GameManager.drawMap();
    return;
  }

  if(isRare) baseSoul = Math.floor(baseSoul*1.5);

  const luck = (typeof window.hero.luck==="number")? window.hero.luck : 0;
  const gainedSoul = baseSoul + Math.floor(Math.random()*(luck+1));

  window.hero.souls = (typeof window.hero.souls==="number") ? window.hero.souls + gainedSoul : gainedSoul;

  GameManager.map[window.hero.pos.y][window.hero.pos.x] = 0;
  GameManager.drawMap();

  showSoulEffect(window.hero.pos.x, window.hero.pos.y, gainedSoul, isRare);
}
