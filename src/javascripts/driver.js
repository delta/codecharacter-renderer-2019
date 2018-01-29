import * as PIXI from 'pixi.js';
import Game from './game';
import Proto from './protoparse.js';
import landAsset from "../assets/land.jpg";
import soldierP1Asset from "../assets/soldierP1.png";
import soldierP2Asset from "../assets/soldierP2.png";
import soldierP1AtkAsset from "../assets/soldierP1Atk.png";
import soldierP2AtkAsset from "../assets/soldierP2Atk.png";
import towerP1L1Asset from "../assets/towerP1L1.png";
import towerP2L1Asset from "../assets/towerP2L1.png";

var game;

export function initRenderer(callback) {
    PIXI.loader
        .add("land", landAsset)
        .add("soldierP1", soldierP1Asset)
        .add("soldierP2", soldierP2Asset)
        .add("soldierP1Atk", soldierP1AtkAsset)
        .add("soldierP2Atk", soldierP2AtkAsset)
        .add("towerP1L1", towerP1L1Asset)
        .add("towerP2L1", towerP2L1Asset)
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
    }

    game = new Game();
    game.setStateVariable(await getGameDetails(logFile))
        .setLogFunction(options.logFunction)
        .setPlayerID(options.playerID)
        .setPlayerLogs(options.player1Log, options.player2Log);

    console.log("Processed State: ", game.stateVariable);

    game.buildStateClasses()
        .buildTerrain()
        .buildTowers()
        .buildSoldiers()
        .buildMap()
        .buildErrorMap();

    game.addTerrain()
        .addTowers()
        .addSoldiers()
        .addMoney();

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
        if (game.state != "stop")
            console.log("done");

        game.state = "stop";
    }

    // Update Game Objects
    if (game.state == "play") {
        game.updateSoldiers()
            .updateMoney()
            .updateTowers()
            .logErrors()
            .logPlayerLogs();
    }

}

async function getGameDetails(logFile) {
    let proto = new Proto(logFile);
    let gameDetails = await proto.getGame();

    return gameDetails;
}
