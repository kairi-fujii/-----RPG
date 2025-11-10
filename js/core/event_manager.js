const EventManager = (() => {
  let game;

  return {
    init(gameManager) { game=gameManager; },

    checkTile(heroPos, map, currentStage){
      const tile = map[heroPos.y][heroPos.x];

      if(currentStage==="home"){
        if(tile===4) PopupSleep.show();
        else if(tile===5) PopupPrayer.show();
        else if(tile===2){
          const result = StageDungeon.generateDungeonMap(1);
          game.switchStage("dungeon", result.map, result.heroStart);
        }
      } else if(currentStage==="dungeon"){
        if(tile===2){
          const result = StageDungeon.generateDungeonMap(game.getState().dungeonLayer+1);
          game.switchStage("dungeon", result.map, result.heroStart);
        } else if(tile===3){
          PopupReturn.show();
        } else if(tile===6){
          // 宝箱取得
          Hero.soul += 10;
          Renderer.spawnSoulEffect(heroPos.x, heroPos.y, 15);
          map[heroPos.y][heroPos.x] = 0; // 床に置き換え
        }
      }
    },

    handleEnter(){
      const state = game.getState();
      const tile = state.map[state.heroPos.y][state.heroPos.x];
      if(state.currentStage==="home" && tile===4) PopupSleep.show();
    }
  };
})();
