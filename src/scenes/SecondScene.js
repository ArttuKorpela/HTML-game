import GameScene from "./FirstScene";

const HEART_KEY = "heart";

export default class HarderGameScene extends GameScene {
  constructor() {
    super("harder-game-scene");

    this.spawnRate = 2000;
  }

  preload() {
    super.preload();

    const heart_png = require("./public/heart.png");
    this.load.image(HEART_KEY, heart_png, {});

    const walls_png = require("./public/wall.png");
    this.load.spritesheet("wall", walls_png, {
      frameWidth: 100,
      frameHeight: 400,
    });
  }

  create() {
    super.create();

    this.hearts = this.physics.add.group();
    this.walls = this.physics.add.staticGroup();

    this.physics.add.collider(
      this.player,
      this.hearts,
      this.pickUpHeart,
      null,
      this
    );

    let wall_1 = this.walls.create(this.width / 2, 200, "wall");
    wall_1.health = 10;
    wall_1.setRotation(Math.PI / 2);
    let wall_2 = this.walls.create(this.width / 2, this.height - 200, "wall");
    wall_2.health = 10;
    wall_2.setRotation(Math.PI / 2);
    let wall_3 = this.walls.create(200, this.height / 2, "wall");
    wall_3.health = 10;
    let wall_4 = this.walls.create(this.width - 200, this.height / 2, "wall");
    wall_4.health = 10;

    this.physics.add.collider(this.player, this.walls);
    this.physics.add.collider(this.zombies, this.walls);
    this.physics.add.collider(
      this.walls,
      this.projectiles,
      this.wallHit,
      null,
      this
    );
  }

  wallHit(wall, projectile) {
    wall.health--;
    projectile.disableBody(true, true);

    if (wall.health <= 0) {
      wall.disableBody(true, true);
    }
  }

  spawnZombie() {
    const zombie = super.spawnZombie();
    zombie.speed = 200;
    zombie.health = 2;

    return zombie;
  }

  killZombie(zombie, projectile) {
    zombie.health--;
    projectile.disableBody(true, true);

    if (zombie.health <= 0) {
      let chance = Phaser.Math.Between(1, 5);
      if (chance == 1) {
        this.createHeart(zombie);
      }
      //Use the previous method
      super.killZombie(zombie, projectile);
    }
  }

  createHeart(zombie) {
    const heart = this.hearts.create(zombie.x, zombie.y, HEART_KEY);
    return heart;
  }

  pickUpHeart(player, heart) {
    heart.disableBody(true, true);

    this.health = Math.min(this.health + 1, 3);

    switch (this.health) {
      case 1:
        this.heart_1.setVisible(true);
        break;
      case 2:
        this.heart_2.setVisible(true);
        break;
      case 3:
        this.heart_3.setVisible(true);
        break;
    }

    this.createPopUpText(this.player.x, this.player.y, "Health restored!");
  }

  nextLevel(scene) {
    let nextLevelText = this.add.text(
      this.width / 2,
      this.height / 2,
      "Congratulations, you defeated Mr. Deaths best soildiers\nClick to look for your son",
      {
        fontSize: "40px",
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
    if (this.score > 20) {
      this.nextLevel("cut-three-screen");
    }
  }
}
