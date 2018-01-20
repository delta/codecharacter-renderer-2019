import * as PIXI from 'pixi.js';
import Game from './game';
import Proto from './protoparse.js';
import landAsset from "../assets/land.jpg";
import waterAsset from "../assets/water.jpg";
import soldierP1Asset from "../assets/soldierP1.png";
import soldierP2Asset from "../assets/soldierP2.png";
import soldierP1AtkAsset from "../assets/soldierP1Atk.png";
import soldierP2AtkAsset from "../assets/soldierP2Atk.png";
import towerP1L1Asset from "../assets/towerP1L1.png";
import towerP2L1Asset from "../assets/towerP2L1.png";

var game;

export function startRenderer(logFile) {
    game = new Game();
    PIXI.loader
        .add("land", landAsset)
        .add("water", waterAsset)
        .add("soldierP1", soldierP1Asset)
        .add("soldierP2", soldierP2Asset)
        .add("soldierP1Atk", soldierP1AtkAsset)
        .add("soldierP2Atk", soldierP2AtkAsset)
        .add("towerP1L1", towerP1L1Asset)
        .add("towerP2L1", towerP2L1Asset)
        .load(() => {initialize(logFile)});
}

async function initialize(logFile) {
    game.stateVariable = await getGameDetails(logFile);
    console.log("Processed State: ", game.stateVariable);

    game.buildStateClasses();
    game.buildTerrain();
    game.buildSoldiers();
    game.buildTowers();
    game.buildMap();

    game.addTerrain();
    game.addSoldiers();
    game.addTowers();
    game.addMoney();
    game.nextFrame();

    game.app.ticker.add(delta => render(delta));
}

function render(delta) {
    game.autoResize();
    game.updateCamera();


    if (game.state == "play") {
        game.updateSoldiers();
        game.updateTowers();
        game.updateMoney();
        game.nextFrame();
    }

    if (game.frameNo >= game.stateVariable.states.length) {
        console.log("done");
        game.state = "stop";
    }
}

async function getGameDetails(logFile) {
    let proto = new Proto(logFile);
    let gameDetails = await proto.getGame();

    return gameDetails;
}
