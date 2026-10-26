import { Application } from "pixi.js";
import { Game } from "./core/game";
import "./style.css";

async function initGame() {
  const app = new Application();

  await app.init({
    width: 1280,
    height: 720,
    backgroundColor: 0x0d0d1a,
  });

  document.querySelector("#app")?.appendChild(app.canvas);

  const game = new Game(app);
  await game.init();
}

initGame();