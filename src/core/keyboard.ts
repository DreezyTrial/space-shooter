export class KeyboardManager {
  private keys: Record<string, boolean> = {};
  constructor() {
    window.addEventListener("keydown", (e) => (this.keys[e.code] = true));
    window.addEventListener("keyup", (e) => (this.keys[e.code] = false));
  }
  public isKeyDown(code: string): boolean {
    return !!this.keys[code];
  }
  public getDirection(): number {
    const left = this.isKeyDown("ArrowLeft");
    const right = this.isKeyDown("ArrowRight");
    if (left && right) return 0;
    if (left) return -1;
    if (right) return 1;
    return 0;
  }
  public isBulletPressed(): boolean {
    return this.isKeyDown("Space");
  }
}
