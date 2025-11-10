// core/game_manager.js
const GameManager = {
  map: MapGen.generateHomeMap(),
  currentStage:"home",
  canvas:null,

  init: function(){
    this.canvas=document.getElementById("stage");
    Renderer.loadImages(()=>this.drawMap());
    this.bindKeys();
  },

  drawMap: function(){
    Renderer.drawMap(this.canvas,this.map,this.currentStage);
    this.updateStatusDisplay();
  },

  updateStatusDisplay: function(){
    const container=document.getElementById("left");
    container.querySelectorAll(".stat").forEach(div=>{
      const label=div.querySelector("span:first-child").textContent;
      const valueSpan=div.querySelector("span:last-child");
      switch(label){
        case "HP": valueSpan.textContent=`${Hero.hp} / ${Hero.maxHp}`; break;
        case "ATK": valueSpan.textContent=Hero.confirmedStats.atk??Hero.atk; break;
        case "DEF": valueSpan.textContent=Hero.confirmedStats.def??Hero.def; break;
        case "SPD": valueSpan.textContent=Hero.confirmedStats.speed??Hero.speed; break;
        case "LUCK": valueSpan.textContent=Hero.confirmedStats.luck??Hero.luck; break;
        case "Souls": valueSpan.textContent=Hero.soul; break;
      }
    });
  },

  bindKeys: function(){
    window.addEventListener("keydown",e=>{
      if(document.getElementById("prayerPopup") || document.getElementById("sleepPopup") || document.getElementById("returnPopup")) return;
      let nx=Hero.pos.x, ny=Hero.pos.y;
      switch(e.key){
        case "ArrowUp": ny--; e.preventDefault(); break;
        case "ArrowDown": ny++; e.preventDefault(); break;
        case "ArrowLeft": nx--; e.preventDefault(); break;
        case "ArrowRight": nx++; e.preventDefault(); break;
        case "Enter":
          if(this.currentStage==="home" && this.map[Hero.pos.y][Hero.pos.x]===4) showSleepPopup();
          return;
        default: return;
      }
      if(this.canMove(nx,ny)){
        Hero.pos.x=nx; Hero.pos.y=ny;
        this.drawMap();
        if(this.currentStage==="home") checkHomeInteraction();
        else if(this.currentStage==="dungeon") checkDungeonInteraction();
      }
    });
  },

  canMove: function(nx,ny){
    return nx>=0 && nx<this.map[0].length && ny>=0 && ny<this.map.length && this.map[ny][nx]!==1;
  }
};
