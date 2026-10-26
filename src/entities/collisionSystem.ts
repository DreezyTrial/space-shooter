import type { Asteroid } from "./asteroid";
import type { Bullet } from "./bullet";

export class CollisionSystem {
  public static checkBulletAsteroid(
    bullet: Bullet,
    asteroid: Asteroid
  ): boolean {
    const dx = bullet.x - asteroid.x;
    const dy = bullet.y - asteroid.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < asteroid.radius;
  }
}
