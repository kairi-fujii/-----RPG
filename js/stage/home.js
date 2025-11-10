// stage/home.js
function checkHomeInteraction(){
  const tile = GameManager.map[Hero.pos.y][Hero.pos.x];
  if(tile===4) showSleepPopup();
  else if(tile===5) showPrayerPopup();
  else if(tile===2){
    // 上り階段がある場合はダンジョンへ移動
    GameManager.currentStage="dungeon";
    const result = MapGen.generateDungeonMap(1);
    GameManager.map = result.map;
    Hero.pos = result.heroStart;
    GameManager.drawMap();
  }
}
