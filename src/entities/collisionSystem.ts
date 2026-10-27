import { Bullet } from "./bullet";
import { BossBullet } from "./bossBullet";
import { Boss } from "./boss";
import { Player } from "./player";
import { Asteroid } from "./asteroid";

export class CollisionSystem {
  public static checkBulletAsteroid(bullet: Bullet, asteroid: Asteroid): boolean {
    const dx = bullet.x - asteroid.x;
    const dy = bullet.y - asteroid.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < asteroid.radius;
  }

  public static checkBulletBoss(bullet: Bullet, boss: Boss): boolean {
    const dx = bullet.x - boss.x;
    const dy = bullet.y - boss.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < 50;
  }

  public static checkBulletBossBullet(bullet: Bullet, bossBullet: BossBullet): boolean {
    const dx = bullet.x - bossBullet.x;
    const dy = bullet.y - bossBullet.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < 15; 
  }

  public static checkBossBulletPlayer(bossBullet: BossBullet, player: Player): boolean {
    const dx = bossBullet.x - (player.x + player.width / 2);
    const dy = bossBullet.y - (player.y + player.height / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < 30; 
  }
}