// js/treasure.js

/**
 * 宝箱取得処理
 * tile: 現在のタイル番号（6=通常宝箱, 7=レア宝箱）
 * layer: 現在のダンジョン階層
 */
function handleTreasureTile(tile, layer) {
    if (typeof window.Hero !== "object") {
        console.error("Heroが未定義です");
        return;
    }

    let baseSoul = 10 + layer * 2;          // 基礎ソウル量
    const isRare = (tile === 7);            // レア宝箱か判定

    // 通常宝箱が10%でレア宝箱に変化
    if (!isRare && Math.random() < 0.1) {
        GameManager.map[window.Hero.pos.y][window.Hero.pos.x] = 7; // レア宝箱
        GameManager.drawMap();
        return; // 次フレームで再判定
    }

    if (isRare) baseSoul = Math.floor(baseSoul * 1.5);

    // ラックによるボーナス
    const luck = (typeof window.Hero.luck === "number") ? window.Hero.luck : 0;
    const gainedSoul = baseSoul + Math.floor(Math.random() * (luck + 1));

    // Heroのソウルに加算
    window.Hero.soul = (typeof window.Hero.soul === "number") ? window.Hero.soul + gainedSoul : gainedSoul;

    // 宝箱を床に置き換え
    GameManager.map[window.Hero.pos.y][window.Hero.pos.x] = 0;
    GameManager.drawMap();

    // 取得エフェクト表示
    showSoulEffect(window.Hero.pos.x, window.Hero.pos.y, gainedSoul, isRare);
}

/**
 * 宝箱取得時のエフェクト
 * x, y: タイル座標
 * amount: 取得ソウル量
 * isRare: レア宝箱かどうか
 */
function showSoulEffect(x, y, amount, isRare) {
    const canvas = document.getElementById("stage");
    const ctx = canvas.getContext("2d");
    const tileSize = 24; // ダンジョン用タイルサイズ
    const soulImg = Renderer.soulImg;

    let alpha = 1.0;
    let offsetY = 0;

    function animate() {
        // 背景タイルを描画
        ctx.clearRect(x * tileSize, y * tileSize - 20, tileSize, tileSize + 20);
        ctx.drawImage(Renderer.groundImg, x * tileSize, y * tileSize, tileSize, tileSize);

        // ソウル画像を描画
        ctx.globalAlpha = alpha;
        ctx.drawImage(soulImg, x * tileSize, y * tileSize - offsetY, tileSize, tileSize);

        // 取得数文字を描画
        ctx.font = "16px monospace";
        ctx.fillStyle = isRare ? `rgba(255,215,0,${alpha})` : `rgba(255,255,0,${alpha})`;
        ctx.fillText(`+${amount}`, x * tileSize, y * tileSize - offsetY - 4);

        ctx.globalAlpha = 1.0;

        alpha -= 0.02;
        offsetY += 0.5;
        if (alpha > 0) requestAnimationFrame(animate);
        else GameManager.drawMap(); // 最終的に通常描画に戻す
    }

    animate();
}
