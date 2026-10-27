import { Container, Graphics, Sprite, Texture } from "pixi.js";

export class Boss extends Container {
  public hp: number = 4;
  public maxHp: number = 4;
  private healthBar: Graphics;
  private bossSprite: Sprite;
  private speed: number = 3;
  private direction: number = 1;
  private shootTimer: number = 1;
  private moveTimer: number = 0;
  private isMoving: boolean = true;

  public onShoot?: (x: number, y: number) => void;

  constructor(x: number = 640, y: number = 100, texture: Texture) {
    super();
    this.x = x;
    this.y = y;

    this.bossSprite = new Sprite(texture);

    this.bossSprite.anchor.set(0.5);
    this.bossSprite.width = 120;
    this.bossSprite.height = 110
    this.addChild(this.bossSprite);

    this.healthBar = new Graphics();
    this.addChild(this.healthBar);
    this.drawHealthBar();
  }

  public takeDamage(amount: number = 1): void {
    this.hp -= amount;
    if (this.hp < 0) this.hp = 0;
    this.drawHealthBar();
  }
  private drawHealthBar(): void {
    const width = (this.hp / this.maxHp) * 100;
    this.healthBar.clear();
    this.healthBar.rect(-50, -50, 100, 8).fill(0x555555);
    this.healthBar.rect(-50, -50, width, 8).fill(0x00ff00);
  }
  public update(delta: number, deltaMS: number) {
    this.moveTimer += deltaMS;
    if (this.moveTimer >= 2000) {
      this.moveTimer = 0;
      this.isMoving = !this.isMoving;
    }

    if (this.isMoving) {
      this.x += this.speed * this.direction * delta;

      if (this.x >= 1180) {
        this.x = 1180;
        this.direction = -1;
      } else if (this.x <= 100) {
        this.x = 100;
        this.direction = 1;
      }
    }
    this.shootTimer += deltaMS;
    if (this.shootTimer >= 2000) {
      this.shootTimer = 0;
      this.shoot();
    }
  }
  private shoot(): void {
    if (this.onShoot) {
      this.onShoot(this.x, this.y + 30);
    }
  }
}
