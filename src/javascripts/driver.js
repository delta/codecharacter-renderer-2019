import * as PIXI from 'pixi.js';
import Game from './game';
import Proto from './protoparse.js';
import landAsset from "../assets/land.jpg";
import waterAsset from "../assets/water.jpg"
import goldAsset from "../assets/gold.jpg"
import soldierP1Asset from "../assets/Soldier_P1.png";
import soldierP2Asset from "../assets/Soldier_P2.png";
import villagerP1Asset from "../assets/Villager_P1.png";
import villagerP2Asset from "../assets/Villager_P2.png";
import towerP1Asset from "../assets/towerP1.png";
import towerP2Asset from "../assets/towerP2.png";

var game;

export function initRenderer(callback) {
    PIXI.loader
        .add("land", landAsset)
        .add("water", waterAsset)
        .add("gold", goldAsset)
        .add("soldierP1Sheet", soldierP1Asset)
        .add("soldierP2Sheet", soldierP2Asset)
        .add("villagerP1Sheet", villagerP1Asset)
        .add("villagerP2Sheet", villagerP2Asset)
        .add("towerP1", towerP1Asset)
        .add("towerP2", towerP2Asset)
        .load(callback);
}

/**
 * Function to initialize main main game object
 * Takes the game logFile and an options map as paramenters
 *
 * @param[in]    logFile   A Uint8Array containing the Protobuf dump
 * @param[in]    options   Contains logFunction -> Function to log errors to
 *                                  playerID    -> PlayerID of current player
 *                                  player1Log  -> Debug logs of Player1
 *                                  player2Log  -> Debug logs of Player2
 */
export async function initGame(logFile, options) {
    if (game) {
        game.app.ticker.stop();
        game.container.removeChild(game.container.getElementsByTagName("canvas")[0]);
        game.logClearFunction();
    }

    game = new Game();
    game.setStateVariable(await getGameDetails(logFile))
        .setLogFunction(options.logFunction)
        .setLogClearFunction(options.logClearFunction)
        .setPlayerID(options.playerID)
        .setPlayerLogs(options.player1Log, options.player2Log);

    console.log("Processed State: ", game.stateVariable);

    game.buildStateClasses()
        .buildTerrain()
        .buildFactories()
        .buildVillagers()
        .buildSoldiers()
        .buildMoney()
        .buildScores()
        .buildSpeedDiv()
        .buildGameOverDiv()
        .buildPauseIcon()
        .buildInstructionCount()
        .buildMap()
        .buildErrorMap();

    game.addTerrain()
        .addFactories()
        .addVillagers()
        .addSoldiers();

    game.app.ticker.add(delta => render(delta));
}

function render(delta) {
    game.autoResize()
        .updateCamera();

    // Increment Frame Counter
    if (game.state == "play") {
        game.updateTimeCount(delta);
        if (!game.nextFrame())
            return;
    }

    // Check for Game End
    if (game.frameNo >= game.stateVariable.states.length) {
        if (game.state != "stop") {
            console.log("done");
            game.end();
        }

    }

    // Update Game Objects
    if (game.state == "play") {
        game.checkInstructionCount()
            .updateSoldiers()
            .updateVillagers()
            .updateMoney()
            .updateFactories()
            .logErrors()
            .logPlayerLogs();
    }

}

async function getGameDetails(logFile) {
    let proto = new Proto(logFile);
    let gameDetails = await proto.getGame();

    return gameDetails;
}
