const InputHandler = (() => {
  let game;

  return {
    init(gameManager) {
      game = gameManager;

      window.addEventListener("keydown", e => {
        const prayer = document.getElementById("prayerPopup");
        const sleep = document.getElementById("sleepPopup");
        const ret = document.getElementById("returnPopup");

        if (prayer || sleep || ret) return;

        let nx = game.getState().heroPos.x;
        let ny = game.getState().heroPos.y;

        switch(e.key) {
          case "ArrowUp": ny--; e.preventDefault(); break;
          case "ArrowDown": ny++; e.preventDefault(); break;
          case "ArrowLeft": nx--; e.preventDefault(); break;
          case "ArrowRight": nx++; e.preventDefault(); break;
          case "Enter":
            // 特殊操作はEventManagerで処理
            EventManager.handleEnter();
            return;
          default: return;
        }

        game.moveHero(nx, ny);
      });
    }
  };
})();
