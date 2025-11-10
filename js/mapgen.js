// mapgen.js
const MapGen = {
  generateHomeMap: function() {
    const width = 8, height = 6;
    const map = Array.from({ length: height }, () => Array(width).fill(0));
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (x === 0 || x === width-1 || y === 0 || y === height-1) map[y][x] = 1;
      }
    }
    map[1][6] = 2; // 上り階段
    map[4][1] = 4; // ベッド
    map[4][6] = 5; // 女神像
    return map;
  },

  generateDungeonMap: function(layer) {
    const size = 32;
    const map = Array.from({ length: size }, () => Array(size).fill(0));
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (Math.random() < 0.2) map[y][x] = 1; // 壁
      }
    }

    // 上下階段設置
    const emptyTiles = [];
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (map[y][x] === 0) emptyTiles.push({x, y});
      }
    }

    const upPos = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    map[upPos.y][upPos.x] = 2;

    const farTiles = emptyTiles.filter(p => Math.abs(p.x - upPos.x) + Math.abs(p.y - upPos.y) >= 10);
    const downPos = farTiles[Math.floor(Math.random() * farTiles.length)];
    map[downPos.y][downPos.x] = 3;

    // 宝箱ランダム設置（10個）
    const treasureTiles = emptyTiles.filter(p =>
      !(p.x === upPos.x && p.y === upPos.y) && !(p.x === downPos.x && p.y === downPos.y)
    );
    for (let i=0;i<10 && treasureTiles.length>0;i++){
      const idx = Math.floor(Math.random() * treasureTiles.length);
      const pos = treasureTiles.splice(idx,1)[0];
      map[pos.y][pos.x] = 6; // 宝箱
    }

    const heroStartCandidates = emptyTiles.filter(p =>
      !(p.x === upPos.x && p.y === upPos.y) && !(p.x === downPos.x && p.y === downPos.y)
    );
    const heroStart = heroStartCandidates[Math.floor(Math.random() * heroStartCandidates.length)];

    return { map, heroStart };
  }
};
