// core/renderer.js
const Renderer = {
  groundImg: new Image(),
  heroImg: new Image(),
  bedImg: new Image(),
  goddessImg: new Image(),
  upStairsImg: new Image(),
  downStairsImg: new Image(),
  treasureImg: new Image(),
  treasureRareImg: new Image(),
  soulImg: new Image(),

  loadImages: function (callback) {
    this.groundImg.src = "assets/Ground.png";
    this.heroImg.src = "assets/Hero.png";
    this.bedImg.src = "assets/Bed.png";
    this.goddessImg.src = "assets/GoddessStatue.png";
    this.upStairsImg.src = "assets/UphillStairs.png";
    this.downStairsImg.src = "assets/DownhillStairs.png";
    this.treasureImg.src = "assets/TreasureChest.png";
    this.treasureRareImg.src = "assets/TreasureChestRare.png";
    this.soulImg.src = "assets/Soul.png";

    let loadedCount = 0;
    const imgs = [
      this.groundImg, this.heroImg, this.bedImg, this.goddessImg,
      this.upStairsImg, this.downStairsImg, this.treasureImg, this.treasureRareImg, this.soulImg
    ];

    imgs.forEach(img => {
      img.onload = () => {
        loadedCount++;
        if (loadedCount === imgs.length) callback();
      }
    });
  },
  drawMap: function (canvas, map, currentStage) {
    const ctx = canvas.getContext("2d");
    const tileSize = (currentStage === "home") ? 64 : 24;
    canvas.width = tileSize * map[0].length;
    canvas.height = tileSize * map.length;

    // effectCanvas をメインに合わせる
    const effectCanvas = document.getElementById("effectCanvas");
    effectCanvas.width = canvas.width;
    effectCanvas.height = canvas.height;

    // エフェクトループ開始（tileSize を同期）
    if (typeof startEffectLoop === "function") startEffectLoop(tileSize);

    const renderFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 背景描画
      for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[0].length; x++) {
          const tile = map[y][x];
          const px = x * tileSize;
          const py = y * tileSize;
          if (tile === 0) ctx.drawImage(this.groundImg, px, py, tileSize, tileSize);
          else if (tile === 1) { ctx.fillStyle = "#444"; ctx.fillRect(px, py, tileSize, tileSize); }
          else if (tile === 2) ctx.drawImage(this.upStairsImg, px, py, tileSize, tileSize);
          else if (tile === 3) ctx.drawImage(this.downStairsImg, px, py, tileSize, tileSize);
          else if (tile === 4) ctx.drawImage(this.bedImg, px, py, tileSize, tileSize);
          else if (tile === 5) ctx.drawImage(this.goddessImg, px, py, tileSize, tileSize);
          else if (tile === 6) ctx.drawImage(this.treasureImg, px, py, tileSize, tileSize);
          else if (tile === 7) ctx.drawImage(this.treasureRareImg, px, py, tileSize, tileSize);
        }
      }

      // Hero描画
      if (window.hero?.pos) {
        ctx.drawImage(this.heroImg,
          window.hero.pos.x * tileSize,
          window.hero.pos.y * tileSize,
          tileSize, tileSize
        );
      }

      requestAnimationFrame(renderFrame);
    };

    renderFrame();
  }


};
