import { Container, Sprite, Texture } from "pixi.js";
import { type PlayerOptions } from "../types/player.types";

export class Player extends Container {
  public speed: number;
  public hp: number;
  public maxHp: number;
  constructor(options: PlayerOptions, texture: Texture) {
    super();
    this.x = options.x;
    this.y = options.y;
    this.speed = options.speed ?? 5;
    this.hp = 3;
    this.maxHp = this.hp;

    const sprite = new Sprite(texture);
    sprite.width = 40;
    sprite.height = 70;
    this.addChild(sprite);
  }

  public moveShip(direction: number) {
    const nextX = this.x + direction * this.speed;
    if (nextX < 0) {
      this.x = 0;
      return;
    }
    if (nextX > 1280 - this.width) {
      this.x = 1280 - this.width;
      return;
    }
    this.x = nextX;
  }
}
