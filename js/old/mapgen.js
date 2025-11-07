function generateMap(width = 32, height = 32) {
  // 1=壁, 0=床
  const map = Array.from({length: height}, () => Array(width).fill(1));

  // --- 部屋生成 ---
  const roomCount = 10;
  const rooms = [];
  for (let i = 0; i < roomCount; i++) {
    const rw = 3 + Math.floor(Math.random() * 4); // 3~6
    const rh = 3 + Math.floor(Math.random() * 4);
    const rx = 1 + Math.floor(Math.random() * (width - rw - 1));
    const ry = 1 + Math.floor(Math.random() * (height - rh - 1));

    // 部屋を床にする
    for (let y = 0; y < rh; y++) {
      for (let x = 0; x < rw; x++) {
        map[ry + y][rx + x] = 0;
      }
    }

    rooms.push({x: rx, y: ry, w: rw, h: rh});
  }

  // --- 部屋を必ず接続 ---
  function connectRooms(r1, r2) {
    const x1 = Math.floor(r1.x + r1.w / 2);
    const y1 = Math.floor(r1.y + r1.h / 2);
    const x2 = Math.floor(r2.x + r2.w / 2);
    const y2 = Math.floor(r2.y + r2.h / 2);

    let cx = x1, cy = y1;
    while (cx !== x2) {
      map[cy][cx] = 0;
      cx += (x2 > cx) ? 1 : -1;
    }
    while (cy !== y2) {
      map[cy][cx] = 0;
      cy += (y2 > cy) ? 1 : -1;
    }
  }

  for (let i = 1; i < rooms.length; i++) {
    connectRooms(rooms[i - 1], rooms[i]);
  }

  // --- DFS迷路で残り通路を生成 ---
  const stack = [];
  const startX = rooms[0].x; // 最初の部屋の床をスタート
  const startY = rooms[0].y;
  stack.push([startX, startY]);
  map[startY][startX] = 0;

  const dirs = [[0, -2], [0, 2], [-2, 0], [2, 0]];

  while (stack.length > 0) {
    const [x, y] = stack[stack.length - 1];
    const shuffled = dirs.sort(() => Math.random() - 0.5);
    let carved = false;

    for (const [dx, dy] of shuffled) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx > 0 && nx < width - 1 && ny > 0 && ny < height - 1 && map[ny][nx] === 1) {
        map[ny][nx] = 0;
        map[y + dy / 2][x + dx / 2] = 0; // 中間マスも床に
        stack.push([nx, ny]);
        carved = true;
        break;
      }
    }

    if (!carved) stack.pop();
  }

  // --- 念のため床がない場合は左上に1マス床を作る ---
  const floorExists = map.some(row => row.includes(0));
  if (!floorExists) map[1][1] = 0;

  return map;
}


// 拠点マップ生成
function generateHomeMap() {
  const width = 8, height = 6;
  const map = Array.from({length: height}, ()=>Array(width).fill(0));

  // 壁を周囲に配置
  for(let y=0;y<height;y++){
    for(let x=0;x<width;x++){
      if(x===0 || x===width-1 || y===0 || y===height-1) map[y][x]=1;
    }
  }

  // 上り階段、ベッド、女神像を配置
  map[1][6] = 2; // 上り階段
  map[4][1] = 3; // ベッド
  map[4][6] = 4; // 女神像

  return map;
}

// ダンジョンマップ生成（既存の generateMap を使用）
function generateDungeonMap(layer = 1){
  return generateMap(32,32); 
}
