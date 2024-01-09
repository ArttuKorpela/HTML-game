import Phaser from "phaser";

export default class FirstScene extends Phaser.Scene {
  constructor() {
    super("start-screen");
  }

  preload() {
    const backround_png = require("./public/backround_menu.png");
    this.load.image("bckrnd", backround_png, {});

    const logo_png = require("./public/logo.png");
    this.load.image("logo", logo_png, {});

    const play_png = require("./public/play.png");
    this.load.image("play", play_png, {});
  }

  create() {
    this.add.image(0, 0, "bckrnd").setOrigin(0).setDepth(0);

    this.add
      .image(
        this.game.renderer.width / 2,
        this.game.renderer.height / 2 - 150,
        "logo"
      )
      .setDepth(1);

    let play_btn = this.add
      .image(
        this.game.renderer.width / 2,
        this.game.renderer.height / 2 + 200,
        "play"
      )
      .setDepth(1);

    play_btn.setInteractive();

    play_btn.on("pointerup", () => {
      this.scene.start("cut-one-screen");
    });
  }

  update() {}
}
