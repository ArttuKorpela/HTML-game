import Phaser from "phaser";

export default class LastCutScene extends Phaser.Scene {
  constructor() {
    super("cut-last-screen");
  }

  preload() {
    const backround_png = require("./public/grass.png");
    this.load.image("bckrnd_2", backround_png, {});

    const text_png = require("./public/textbox_final.png");
    this.load.image("text_final", text_png, {});

    const text_html = require("./html/text_input.html");
    this.load.html("html", text_html);
  }

  create() {
    this.add.image(0, 0, "bckrnd_2").setOrigin(0).setDepth(0);

    let width = this.game.renderer.width;
    let height = this.game.renderer.height;

    let text = this.add.image(width / 2, height / 4, "text_final").setDepth(1);

    text.setInteractive();

    text.on("pointerup", () => {
      this.scene.start("start-screen");
    });

    const name = this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2 - 200, "Scoreboard not available", {
      color: "white",
      fontSize: "20px ",
    });

    
  }

  update() {}
}
