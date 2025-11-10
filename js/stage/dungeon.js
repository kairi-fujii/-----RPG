// stage/dungeon.js
function checkDungeonInteraction(){
  const tile = GameManager.map[Hero.pos.y][Hero.pos.x];

  if(tile===3){ // 下り階段
    showReturnHomePopup();
  }else if(tile===6){ // 宝箱
    Hero.soul += 10; // 仮に10ソウル取得
    GameManager.map[Hero.pos.y][Hero.pos.x] = 0; // 床に置き換え
    GameManager.drawMap();
  }else if(tile===2){ // 上り階段（次層）
    const layer = 1; // 仮
    const result = MapGen.generateDungeonMap(layer+1);
    GameManager.map = result.map;
    Hero.pos = result.heroStart;
    GameManager.drawMap();
  }
}
