import Phaser from "phaser";

export default class FirstCutScene extends Phaser.Scene {
  constructor() {
    super("cut-one-screen");
  }

  preload() {
    const backround_png = require("./public/grass.png");
    this.load.image("bckrnd", backround_png, {});

    const text_png = require("./public/textbox_1.png");
    this.load.image("text", text_png, {});
  }

  create() {
    this.add.image(0, 0, "bckrnd").setOrigin(0).setDepth(0);

    let text = this.add
      .image(
        this.game.renderer.width / 2,
        this.game.renderer.height / 2,
        "text"
      )
      .setDepth(1);

    text.setInteractive();

    text.on("pointerup", () => {
      //this.scene.start("normal-game-scene");
      this.scene.start("normal-game-scene");
    });
  }

  update() {}
}
