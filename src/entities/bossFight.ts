import { Container, Texture } from "pixi.js";
import { Boss } from "./boss";
import { BossBullet } from "./bossBullet";
import { Bullet } from "./bullet";
import { CollisionSystem } from "./collisionSystem";
import { Player } from "./player";

export class BossFight {
  private boss: Boss;
  private bullets: BossBullet[] = [];
  private stage: Container;

  constructor(stage: Container, texture: Texture) {
    this.stage = stage;
    this.boss = new Boss(640, 100, texture);
    this.stage.addChild(this.boss);
    this.boss.onShoot = (x, y) => this.spawnBullet(x, y);
  }

  public get hp(): number {
    return this.boss.hp;
  }

  public update(delta: number, deltaMS: number): void {
    this.boss.update(delta, deltaMS);

    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      bullet.update(delta);
      if (bullet.y > 740) {
        this.stage.removeChild(bullet);
        bullet.destroy();
        this.bullets.splice(i, 1);
      }
    }
  }

  public collide(playerBullets: Bullet[], player: Player): "win" | "lose" | null {
    for (let i = playerBullets.length - 1; i >= 0; i--) {
      const bullet = playerBullets[i];

      if (CollisionSystem.checkBulletBoss(bullet, this.boss)) {
        this.stage.removeChild(bullet);
        bullet.destroy();
        playerBullets.splice(i, 1);
        this.boss.takeDamage();
        if (this.boss.hp <= 0) {
          this.stage.removeChild(this.boss);
          this.boss.destroy();
          return "win";
        }
        continue;
      }

      for (let j = this.bullets.length - 1; j >= 0; j--) {
        const bossBullet = this.bullets[j];
        if (!CollisionSystem.checkBulletBossBullet(bullet, bossBullet)) continue;

        this.stage.removeChild(bullet);
        this.stage.removeChild(bossBullet);
        bullet.destroy();
        bossBullet.destroy();
        playerBullets.splice(i, 1);
        this.bullets.splice(j, 1);
        break;
      }
    }

    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bossBullet = this.bullets[i];
      if (!CollisionSystem.checkBossBulletPlayer(bossBullet, player)) continue;

      this.stage.removeChild(bossBullet);
      bossBullet.destroy();
      this.bullets.splice(i, 1);
      player.hp -= 1;
      if (player.hp <= 0) return "lose";
    }

    return null;
  }

  private spawnBullet(x: number, y: number): void {
    const bullet = new BossBullet({ x, y });
    this.bullets.push(bullet);
    this.stage.addChild(bullet);
  }
}
