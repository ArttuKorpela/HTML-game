import GameScene from "./FirstScene";

const BOSS_KEY = "boss";
const BOSS_HEALTH = 100;

export default class BossGameScene extends GameScene {
  constructor() {
    super("boss-game-scene");
    this.boss = null;
    this.bossHealth = 0;
    this.bossHealthBar = null;
  }

  preload() {
    super.preload();

    const objective_png = require("./public/textbox_boss.png");
    this.load.image("objective_boss", objective_png, {});

    const boss_above = require("./public/bigboss.png");
    this.load.spritesheet("boss", boss_above, {
      frameWidth: 300,
      frameHeight: 300,
    });

    let boss_song = require("./sounds/boss_song.mp3");
    this.load.audio("boss_song", boss_song);
  }

  create() {
    super.create();
    this.bossHealthBar = this.add.graphics();
    this.updateHealthBar();

    this.add
      .image(this.game.renderer.width - 170, 120, "objective_boss")
      .setScale(0.5)
      .setDepth(2);
  }

  update() {
    super.update();

    if (this.score >= 3 && !this.boss) {
      this.spawnBoss();
    }

    if (this.boss) {
      this.updateHealthBar();

      const angleToPlayer = Phaser.Math.Angle.Between(
        this.boss.x,
        this.boss.y,
        this.player.x,
        this.player.y
      );
      const gravityX = Math.cos(angleToPlayer) * 50;
      const gravityY = Math.sin(angleToPlayer) * 50;
      this.boss.setAcceleration(gravityX, gravityY);
      this.boss.setRotation(angleToPlayer + 5);
    }
  }

  spawnBoss() {
    this.boss = this.physics.add.sprite(this.width, this.height, BOSS_KEY);
    this.boss.setBounce(0.2);
    this.boss.setCollideWorldBounds(true);
    this.bossHealth = BOSS_HEALTH;

    let song = this.sound.add("boss_song");
    song.play({
      loop: true,
    });

    this.physics.add.collider(
      this.boss,
      this.projectiles,
      this.hitBoss,
      null,
      this
    );

    this.physics.add.collider(
      this.boss,
      this.player,
      this.hitPlayer,
      null,
      this
    );
  }

  hitBoss(boss, projectile) {
    this.bossHealth--;
    projectile.disableBody(true, true);

    if (this.bossHealth <= 0) {
      boss.disableBody(true, true);
    }
  }

  hitPlayer(boss, player) {
    player.health = 0;
    player.disableBody(true, true);

    this.sound.play("hit-mp3");

    this.heart_1.setVisible(false);
    this.heart_2.setVisible(false);
    this.heart_3.setVisible(false);

    this.gameOver();
  }

  updateHealthBar() {
    this.bossHealthBar.clear();

    this.bossHealthBar.fillStyle(0xff0000, 1);
    this.bossHealthBar.fillRect(
      10,
      this.height - 40,
      200 * (this.bossHealth / BOSS_HEALTH),
      20
    );
  }

  checkScore() {
    if (this.bossHealth <= 0 && this.score > 3) {
      //this.spawnRate = 100000;
      this.nextLevel("cut-last-screen");
    }
  }

  gameOver() {
    this.sound.play("fail-mp3");
    let gameOverText = this.add.text(
      this.width / 2,
      this.height / 2,
      "Game Over\nClick to restart",
      {
        fontSize: "60px",
        fill: "#FFFFFF",
        align: "center",
        fontStyle: "bold",
      }
    );
    gameOverText.setOrigin(0.5);

    gameOverText.setInteractive();

    gameOverText.on("pointerup", () => {
      this.scene.start("normal-game-scene");
    });
  }
}
