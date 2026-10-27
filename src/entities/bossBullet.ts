import { Container, Graphics } from "pixi.js";
import type { BulletOptions } from "../types/bullet.types";


export class BossBullet extends Container{
    public speed: number;
  constructor(options: BulletOptions) {
    super();
    this.x = options.x;
    this.y = options.y;
    this.speed = options.speed ?? 5;

    const graphic = new Graphics();
    graphic.circle(0, 0, 5).fill(0xffaa00);
    this.addChild(graphic);
  }

  public update(delta: number): void {
    this.y += this.speed * delta;
  }
}