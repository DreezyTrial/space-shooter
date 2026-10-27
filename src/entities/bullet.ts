import { Graphics } from "pixi.js";
import type { BulletOptions } from "../types/bullet.types";

export class Bullet extends Graphics {
  public speed: number;
  constructor(options: BulletOptions) {
    super();

    this.rect(-2, -8, 2, 15).fill(0xFF0000);

    this.x = options.x;
    this.y = options.y;
    this.speed = options.speed ?? 10;
  }

  public update(delta: number): void {
    this.y -= this.speed * delta;
  }
}
