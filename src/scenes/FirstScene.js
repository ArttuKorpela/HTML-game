import Phaser from "phaser";

const DUDE_KEY = "dude";
const ZOMBIE_KEY = "zombie";
const PRO_KEY = "pro";
const UPG_KEY = "upgrade";

export default class GameScene extends Phaser.Scene {
  constructor(key) {
    super(key);

    this.player = null;
    this.cursors = null;
    this.zombies = null;
    this.spawnTimer = null;
    this.spawnRate = 5000;
    this.projectile = null;
    this.scoretext = null;
    this.score = 0;
    this.nextFire = 0;
    this.fireRate = 400; //Set this to change firerate
    this.upgrades = null;
    this.width = null;
    this.height = null;
    this.health = 3;
  }

  preload() {
    const ground_png = require("./public/grass.png");
    this.load.image("ground", ground_png, {});

    const upgrade_png = require("./public/upgrade_small.png");
    this.load.image("upgrade", upgrade_png, {});

    const skull_png = require("./public/skull.png");
    this.load.image("skull", skull_png, {});

    const objective_png = require("./public/objective1.png");
    this.load.image("objective1", objective_png, {});

    const heart_png = require("./public/heart.png");
    this.load.image("heart", heart_png, {});

    const ukko_above = require("./public/above_ukko.png");
    this.load.spritesheet("dude", ukko_above, {
      frameWidth: 300,
      frameHeight: 200,
    });

    const zombie_above = require("./public/zombie_2.png");
    this.load.spritesheet("zombie", zombie_above, {
      frameWidth: 300,
      frameHeight: 200,
    });

    const pro = require("./public/pro.png");
    this.load.spritesheet("pro", pro, {
      frameWidth: 20,
      frameHeight: 20,
    });

    const zombie_sound = require("./sounds/minecraft-bruh-sound-effect-2-1.mp3");
    this.load.audio("zombie-mp3", zombie_sound);

    const hit_sound = require("./sounds/classic_hurt.mp3");
    this.load.audio("hit-mp3", hit_sound);

    const level_sound = require("./sounds/pokemon-red_blue_yellow-level-up-sound-effect_m91UE0V.mp3");
    this.load.audio("level-mp3", level_sound);

    const fail_sound = require("./sounds/priceisrightfail_1.mp3");
    this.load.audio("fail-mp3", fail_sound);
  }

  create() {
    this.health = 3;
    this.score = 0;
    this.add.image(960, 540, "ground");
    this.width = this.game.renderer.width;
    this.height = this.game.renderer.height;

    this.player = this.createPlayer();
    this.cursors = this.input.keyboard.createCursorKeys();
    this.zombies = this.physics.add.group();
    this.projectiles = this.physics.add.group();
    this.upgrades = this.physics.add.group();

    this.heart_1 = this.add
      .image(this.game.renderer.width - 320, 240, "heart")
      .setDepth(1);

    this.heart_2 = this.add
      .image(this.game.renderer.width - 200, 240, "heart")
      .setDepth(1);

    this.heart_3 = this.add
      .image(this.game.renderer.width - 80, 240, "heart")
      .setDepth(1);

    this.spawnTimer = this.time.addEvent({
      delay: this.spawnRate, // Adjust this value to control the spawn rate
      loop: true,
      callback: this.spawnZombie,
      callbackScope: this,
    });
    //CHANGE IF NEEDED
    //this.zombies.setGravity(0, 0);

    this.physics.add.collider(
      this.zombies,
      this.player,
      this.handlePlayerCollision,
      null,
      this
    );

    this.physics.add.collider(
      this.zombies,
      this.projectiles,
      this.killZombie,
      null,
      this
    );

    this.physics.add.collider(
      this.player,
      this.upgrades,
      this.upgradeFirerate,
      null,
      this
    );

    this.add.image(25, 20, "skull");
    this.scoreText = this.add.text(52, 3, "0", {
      fontSize: "30px",
      fill: "#ffffff",
      fontStyle: "bold",
    });

    this.add
      .image(this.game.renderer.width - 170, 120, "objective1")
      .setScale(0.5)
      .setDepth(1);
  }

  update() {
    this.checkScore();

    const pointer = this.input.activePointer;

    const angle = Phaser.Math.Angle.Between(
      this.player.x,
      this.player.y,
      pointer.worldX,
      pointer.worldY
    );

    this.player.setRotation(angle + 1.5);

    const speed = 200;
    const velocityX = Math.cos(angle) * speed;
    const velocityY = Math.sin(angle) * speed;

    this.player.setVelocity(0, 0);

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(speed);
    }

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
    }

    if (
      this.input.activePointer.leftButtonDown() &&
      this.time.now > this.nextFire
    ) {
      this.shoot(this.player.rotation + 3.3);
      this.nextFire = this.time.now + this.fireRate;
    }

    this.zombies.getChildren().forEach((zombie) => {
      const angleToPlayer = Phaser.Math.Angle.Between(
        zombie.x,
        zombie.y,
        this.player.x,
        this.player.y
      );
      const gravityX = Math.cos(angleToPlayer) * 100; 
      const gravityY = Math.sin(angleToPlayer) * 100; 
      zombie.setAcceleration(gravityX, gravityY);
      zombie.setRotation(angleToPlayer + 1.5);
    });

    this.projectiles.getChildren().forEach((projectile) => {
      if (!this.physics.world.bounds.contains(projectile.x, projectile.y)) {
        projectile.destroy();
      }
    });
  }

  createPlayer() {
    this.player = this.physics.add.sprite(100, 450, DUDE_KEY);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    return this.player;
  }

  spawnZombie() {
    this.sound.play("zombie-mp3");
    const spawnSide = Phaser.Math.RND.between(0, 3); // Randomly choose a side to spawn the zombie

    let x, y;

    switch (spawnSide) {
      case 0: // Left side
        x = 0;
        y = Phaser.Math.RND.between(0, this.game.config.height);
        break;
      case 1: // Right side
        x = this.game.config.width;
        y = Phaser.Math.RND.between(0, this.game.config.height);
        break;
      case 2: // Top side
        x = Phaser.Math.RND.between(0, this.game.config.width);
        y = 0;
        break;
      case 3: // Bottom side
        x = Phaser.Math.RND.between(0, this.game.config.width);
        y = this.game.config.height;
        break;
    }

    const zombie = this.zombies.create(x, y, ZOMBIE_KEY); 

  
    zombie.setBounce(0.2);
    zombie.setCollideWorldBounds(true);


    return zombie;
  }

  createUpgrade(zombie) {
    const upgrade = this.upgrades.create(zombie.x, zombie.y, UPG_KEY);
    return upgrade;
  }

  handlePlayerCollision(player, zombie) {
    zombie.disableBody(true, true);
    this.sound.play("hit-mp3");

    switch (this.health) {
      case 1:
        this.heart_1.setVisible(false);
        player.disableBody(true, true);
        this.gameOver();
        break;
      case 2:
        this.heart_2.setVisible(false);
        this.health -= 1;
        break;
      case 3:
        this.heart_3.setVisible(false);
        this.health -= 1;
        break;
    }
  }

  shoot(angle) {
    angle = angle + 1.5;
    const projectile = this.projectiles.create(
      this.player.x,
      this.player.y,
      PRO_KEY
    );
    projectile.setRotation(angle + 1.5);

    const speed = 2000;
    const velocityX = Math.cos(angle) * speed;
    const velocityY = Math.sin(angle) * speed;
    projectile.setVelocity(velocityX, velocityY);
    return projectile;
  }

  killZombie(zombie, projectile) {
    const rand = Phaser.Math.Between(1, 5);
    if (rand == 1) {
      this.createUpgrade(zombie);
    }

    zombie.disableBody(true, true);
    projectile.disableBody(true, true);
    this.score += 1;
    this.scoreText.setText(this.score);
  }

  upgradeFirerate(player, upgrade) {
    this.fireRate = this.fireRate / 1.3;
    upgrade.disableBody(true, true);

    this.createPopUpText(this.player.x, this.player.y, "Firerate increased!");
  }

  createPopUpText(x, y, text) {
    let popUpText = this.add.text(x, y, text, {
      fontSize: "30px",
      fill: "#FFFFFF",
    });

    this.tweens.add({
      targets: popUpText,
      y: y - 100,
      alpha: 0,
      duration: 3000,
      ease: "Power2",
      onComplete: function (tween, targets, popUpText) {
        popUpText.destroy();
      },
      onCompleteParams: [popUpText],
    });
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
      this.scene.restart();
    });
  }

  nextLevel(scene) {
    let nextLevelText = this.add.text(
      this.width / 2,
      this.height / 2,
      "Congratulations, you survived\nClick to look for your son",
      {
        fontSize: "60px",
        fill: "#FFFFFF",
        align: "center",
        fontStyle: "bold",
      }
    );
    nextLevelText.setOrigin(0.5);

    nextLevelText.setInteractive();

    nextLevelText.on("pointerup", () => {
      this.sound.play("level-mp3");
      this.scene.start(scene);
    });
  }

  checkScore() {
    if (this.score > 10) {
      this.spawnRate = 100000;
      this.nextLevel("cut-two-screen");
    }
  }
}
