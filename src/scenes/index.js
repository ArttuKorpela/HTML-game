import Phaser from "phaser";

import GameScene from "./FirstScene.js";
import FirstScene from "./StartScene.js";
import FirstCutScene from "./FirstCutScene.js";
import SecondCutScene from "./SecondCutScene.js";
import HarderGameScene from "./SecondScene.js";
import NormalGameScene from "./TheSceneBetween.js";
import BossGameScene from "./ThirdScrene.js";
import LastCutScene from "./ScoreBoardScene.js";
import ThirdCutScene from "./ThirdCutScene.js";

const config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 1 },
    },
  },
  scene: [
    FirstScene,
    FirstCutScene,
    GameScene,
    NormalGameScene,
    SecondCutScene,
    HarderGameScene,
    BossGameScene,
    LastCutScene,
    ThirdCutScene
  ],
};

export default new Phaser.Game(config);
