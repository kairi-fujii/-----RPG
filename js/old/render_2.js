window.addEventListener("DOMContentLoaded", ()=>{
  const canvas = document.getElementById("stage");
  const ctx = canvas.getContext("2d");

  const homeTileSize = 64;
  const dungeonTileSize = 24;

  let currentStage = "home";
  let dungeonLayer = 1;
  let map = generateHomeMap();
  let heroPos = {x:1,y:1};

  // --- 画像ロード ---
  const groundImg = new Image(); groundImg.src="assets/Ground.png";
  const heroImg = new Image(); heroImg.src="assets/Hero.png";
  const bedImg = new Image(); bedImg.src="assets/Bed.png";
  const goddessImg = new Image(); goddessImg.src="assets/GoddessStatue.png";
  const upStairsImg = new Image(); upStairsImg.src="assets/UphillStairs.png";
  const downStairsImg = new Image(); downStairsImg.src="assets/DownhillStairs.png";

  let loadedCount=0;
  function checkAndDraw(){ loadedCount++; if(loadedCount===6) drawMap(); }
  groundImg.onload=heroImg.onload=bedImg.onload=goddessImg.onload=upStairsImg.onload=downStairsImg.onload=checkAndDraw;

  // --- 拠点マップ生成 ---
  function generateHomeMap() {
    const width = 8, height = 6;
    const map = Array.from({length: height}, ()=>Array(width).fill(0));
    for(let y=0;y<height;y++){
      for(let x=0;x<width;x++){
        if(x===0||x===width-1||y===0||y===height-1) map[y][x]=1; // 壁
      }
    }
    map[1][6] = 2; // 上り階段（ダンジョンに進む）
    map[4][1] = 4; // ベッド
    map[4][6] = 5; // 女神像
    return map;
  }

  // --- ダンジョンマップ生成 ---
  function generateDungeonMap(layer = 1){
    const map = generateMap(32,32);

    // 空きマスリスト作成
    const emptyTiles = [];
    for(let y=0;y<map.length;y++){
      for(let x=0;x<map[0].length;x++){
        if(map[y][x]===0) emptyTiles.push({x,y});
      }
    }

    // 上り階段（次階層）
    const upPos = emptyTiles[Math.floor(Math.random()*emptyTiles.length)];
    map[upPos.y][upPos.x] = 2;

    // 下り階段（拠点帰還）候補を絞る
    const minDistance = 8;
    const downCandidates = emptyTiles.filter(pos => distance(pos, upPos) >= minDistance);
    const downPos = downCandidates[Math.floor(Math.random()*downCandidates.length)];
    map[downPos.y][downPos.x] = 3;

    // Hero初期位置を階段と被らない位置に設定
    const heroCandidates = emptyTiles.filter(pos => 
      !(pos.x === upPos.x && pos.y === upPos.y) &&
      !(pos.x === downPos.x && pos.y === downPos.y)
    );
    const heroStart = heroCandidates[Math.floor(Math.random()*heroCandidates.length)];

    return {map, heroStart};
  }

  // --- マンハッタン距離 ---
  function distance(pos1, pos2){
    return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
  }

  // --- 描画 ---
  function drawMap(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const tileSize = (currentStage==="home")? homeTileSize : dungeonTileSize;
    canvas.width = tileSize*(currentStage==="home"? 8 : 32);
    canvas.height = tileSize*(currentStage==="home"? 6 : 32);

    for(let y=0;y<map.length;y++){
      for(let x=0;x<map[0].length;x++){
        const tile = map[y][x];
        const px = x*tileSize, py = y*tileSize;
        if(tile===0) ctx.drawImage(groundImg, px, py, tileSize, tileSize);
        else if(tile===1) ctx.fillStyle="#555", ctx.fillRect(px,py,tileSize,tileSize);
        else if(tile===2) ctx.drawImage(upStairsImg, px, py, tileSize, tileSize);
        else if(tile===3) ctx.drawImage(downStairsImg, px, py, tileSize, tileSize);
        else if(tile===4) ctx.drawImage(bedImg, px, py, tileSize, tileSize);
        else if(tile===5) ctx.drawImage(goddessImg, px, py, tileSize, tileSize);
      }
    }
    ctx.drawImage(heroImg, heroPos.x*tileSize, heroPos.y*tileSize, tileSize, tileSize);
  }

  // --- 移動可能判定 ---
  function canMove(nx,ny){
    return nx>=0 && nx<map[0].length && ny>=0 && ny<map.length && map[ny][nx]!==1;
  }

  // --- ステージ遷移判定 ---
  function checkStageTransition(){
    const tile = map[heroPos.y][heroPos.x];

    if(currentStage==="home" && tile===2){
      // 拠点→ダンジョン
      currentStage="dungeon";
      dungeonLayer = 1;
      const result = generateDungeonMap(dungeonLayer);
      map = result.map;
      heroPos = result.heroStart;
      drawMap();
    } else if(currentStage==="dungeon"){
      if(tile===2){
        // 上り階段 → 次階層
        dungeonLayer++;
        const result = generateDungeonMap(dungeonLayer);
        map = result.map;
        heroPos = result.heroStart;
        drawMap();
      } else if(tile===3){
        // 下り階段 → 拠点帰還
        if(confirm("拠点に帰還しますか？")){
          currentStage="home";
          map = generateHomeMap();
          heroPos = {x:1,y:1};
          drawMap();
        }
      }
    }
  }

  // --- Hero移動 ---
  window.addEventListener("keydown", e=>{
    let nx=heroPos.x, ny=heroPos.y;
    switch(e.key){
      case "ArrowUp": ny--; e.preventDefault(); break;
      case "ArrowDown": ny++; e.preventDefault(); break;
      case "ArrowLeft": nx--; e.preventDefault(); break;
      case "ArrowRight": nx++; e.preventDefault(); break;
      default: return;
    }
    if(canMove(nx,ny)){
      heroPos.x=nx; heroPos.y=ny;
      drawMap();
      checkStageTransition();
    }
  });
});
