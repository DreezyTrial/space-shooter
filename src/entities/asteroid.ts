import { Container, Sprite, Texture } from "pixi.js";

export class Asteroid extends Container {
  public radius: number;

  constructor(x: number, y: number, texture: Texture, radius: number = 25) {
    super();
    this.x = x;
    this.y = y;
    this.radius = radius;

    const sprite = new Sprite(texture);
    sprite.anchor.set(0.5);
    sprite.width = radius * 2;
    sprite.height = radius * 2;

    this.addChild(sprite);
  }
}
