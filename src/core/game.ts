import { Application, Assets, Sprite, Ticker } from "pixi.js";
import { Player } from "../entities/player";
import { Bullet } from "../entities/bullet";
import { Asteroid } from "../entities/asteroid";
import { CollisionSystem } from "../entities/collisionSystem";
import { KeyboardManager } from "./keyboard";
import { UIManager } from "./text";

export class Game {
  private app: Application;
  private keyboard: KeyboardManager;
  private player!: Player;
  private uiManager!: UIManager;
  private bullets: Bullet[] = [];
  private asteroids: Asteroid[] = [];

  private ammo: number = 10;
  private lastShootTime: number = 0;
  private shootCooldown: number = 250;
  private timeLeft: number = 60;
  private isGameOver: boolean = false;

  constructor(app: Application) {
    this.app = app;
    this.keyboard = new KeyboardManager();
  }

  public async init(): Promise<void> {
    await this.loadAssets();
    this.createScene();
    this.createAsteroids();

    this.uiManager = new UIManager(this.ammo, this.timeLeft);
    this.uiManager.updateTimer(this.timeLeft);
    this.app.stage.addChild(this.uiManager);
    this.uiManager.updateAmmo(this.ammo);
    this.app.ticker.add((ticker) => this.update(ticker));
  }

  private async loadAssets(): Promise<void> {
    await Assets.load([
      "assets/ship.png",
      "assets/space.png",
      "assets/asteroid.png",
    ]);
  }

  private createScene(): void {
    const bgSprite = new Sprite(Assets.get("assets/space.png"));
    bgSprite.width = 1280;
    bgSprite.height = 720;
    this.app.stage.addChild(bgSprite);

    this.player = new Player(
      { x: 640, y: 620, speed: 7 },
      Assets.get("assets/ship.png")
    );
    this.app.stage.addChild(this.player);
  }

  private createAsteroids(): void {
    const texture = Assets.get("assets/asteroid.png")
    const asteroidCount = 8;
    const positions = this.generateAsteroidPositions(asteroidCount, 75);

    positions.forEach((pos) => {
      const asteroid = new Asteroid(pos.x, pos.y, texture);
      this.asteroids.push(asteroid);
      this.app.stage.addChild(asteroid);
    });
  }

  private update(ticker: Ticker): void {
    if (this.isGameOver) return;

    const delta = ticker.deltaTime;
    const deltaMS = ticker.deltaMS;

    const direction = this.keyboard.getDirection();
    this.player.moveShip(direction);

    this.handleShooting();
    this.updateBullets(delta);
    this.checkCollisions();

    this.updateTimer(deltaMS);
    this.checkGameState();
  }

  private handleShooting(): void {
    const now = Date.now();
    if (
      this.keyboard.isBulletPressed() &&
      this.ammo > 0 &&
      now - this.lastShootTime > this.shootCooldown
    ) {
      this.ammo--;
      this.uiManager.updateAmmo(this.ammo);
      this.lastShootTime = now;

      const bullet = new Bullet({
        x: this.player.x,
        y: this.player.y - this.player.height / 2,
        speed: 12,
      });

      this.app.stage.addChild(bullet);
      this.bullets.push(bullet);
    }
  }

  private updateBullets(delta: number): void {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      bullet.update(delta);

      if (bullet.y < -20) {
        this.app.stage.removeChild(bullet);
        bullet.destroy();
        this.bullets.splice(i, 1);
      }
    }
  }

  private checkCollisions(): void {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];

      for (let j = this.asteroids.length - 1; j >= 0; j--) {
        const asteroid = this.asteroids[j];

        if (CollisionSystem.checkBulletAsteroid(bullet, asteroid)) {
          this.app.stage.removeChild(bullet);
          this.app.stage.removeChild(asteroid);

          bullet.destroy();
          asteroid.destroy();

          this.bullets.splice(i, 1);
          this.asteroids.splice(j, 1);

          break;
        }
      }
    }
  }
  private generateAsteroidPositions(
    count: number,
    minDistance: number = 0
  ): { x: number; y: number }[] {
    const positions: { x: number; y: number }[] = [];
    const minX = 60;
    const maxX = 1280 - 60;
    const minY = 60;
    const maxY = 360;
    let attempts = 0;
    while (positions.length < count && attempts < 1000) {
      attempts++;
      const candidateX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
      const candidateY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

      const isTooClose = positions.some((pos) => {
        const dx = pos.x - candidateX;
        const dy = pos.y - candidateY;
        return Math.sqrt(dx * dx + dy * dy) < minDistance;
      });

      if (!isTooClose) {
        positions.push({ x: candidateX, y: candidateY });
      }
    }

    return positions;
  }
  private updateTimer(deltaMs: number): void {
    this.timeLeft -= deltaMs / 1000;
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.endGame(false);
    }
    this.uiManager.updateTimer(this.timeLeft);
  }
  private checkGameState(): void {
    if (this.asteroids.length === 0) {
      this.endGame(true);
      return;
    }
    if (
      this.ammo === 0 &&
      this.bullets.length === 0 &&
      this.asteroids.length > 0
    ) {
      this.endGame(false);
      return;
    }
  }
  private endGame(isWin: boolean) {
    this.isGameOver = true;
    this.uiManager.showResult(isWin);
  }
}
