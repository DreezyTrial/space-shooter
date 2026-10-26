import { Container, Text, TextStyle } from "pixi.js";

const uiStyle = new TextStyle({
  fontFamily: "Arial",
  fontSize: 24,
  fill: 0xffffff,
  fontWeight: "bold",
});

export class UIManager extends Container {
  private timerText!: Text;
  private ammoText!: Text;
  private resultText!: Text;

  constructor(initialAmmo: number = 10, initialTime: number = 60) {
    super();
    this.createUI(initialAmmo, initialTime);
  }

  private createUI(ammo: number, time: number): void {
    
    this.timerText = new Text({ text: `Time: ${time}`, style: uiStyle });
    this.timerText.x = 20;
    this.timerText.y = 20;
    this.addChild(this.timerText);

    
    this.ammoText = new Text({ text: `Ammo: ${ammo}`, style: uiStyle });
    this.ammoText.x = 200;
    this.ammoText.y = 20;
    this.addChild(this.ammoText);
  }

  public updateAmmo(ammo: number): void {
    this.ammoText.text = `Ammo: ${ammo}`;
  }

  public updateTimer(time: number): void {
    this.timerText.text = `Time: ${Math.ceil(time)}`;
  }

  public showResult(isWin: boolean): void {
    const resultStyle = new TextStyle({
      fontFamily: "Arial",
      fontSize: 64,
      fill: isWin ? 0x00ff00 : 0xff0000, 
      fontWeight: "bold",
    });

    const message = isWin ? "YOU WIN" : "YOU LOSE";
    this.resultText = new Text({ text: message, style: resultStyle });

    this.resultText.anchor.set(0.5);
    this.resultText.x = 1280 / 2;
    this.resultText.y = 720 / 2;

    this.addChild(this.resultText);
  }
}