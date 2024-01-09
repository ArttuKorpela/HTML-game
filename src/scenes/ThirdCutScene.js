import Phaser from "phaser";

export default class ThirdCutScene extends Phaser.Scene {
  constructor() {
    super("cut-three-screen");
  }

  preload() {
    const backround_png = require("./public/grass.png");
    this.load.image("bckrnd_2", backround_png, {});

    const text3_png = require("./public/textbox_3.png");
    this.load.image("text_3", text3_png, {});
  }

  create() {
    this.add.image(0, 0, "bckrnd_2").setOrigin(0).setDepth(0);

    let text = this.add
      .image(
        this.game.renderer.width / 2,
        this.game.renderer.height / 2,
        "text_3"
      )
      .setDepth(1);

    text.setInteractive();

    text.on("pointerup", () => {
      this.scene.start("boss-game-scene");
    });
  }

  update() {}
}
