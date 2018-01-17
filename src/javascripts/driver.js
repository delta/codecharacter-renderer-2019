import * as PIXI from 'pixi.js';
import CONSTANTS from './constants';
import Game from './game';
import TerrainElement from './state_objects/terrain';
import Proto from './protoparse.js';
import landAsset from "../assets/land.jpg";
import waterAsset from "../assets/water.jpg";

var game;

export function startRenderer(logFile) {
    game = new Game(CONSTANTS.camera);
    PIXI.loader
        .add("land", landAsset)
        .add("water", waterAsset)
        .load(() => {initialize(logFile)});
}

async function initialize(logFile) {
    const stateVariable = await getGameDetails(logFile);
    console.log(stateVariable);
    TerrainElement.setSideLength(CONSTANTS.terrain.sideLength);
    TerrainElement.build(stateVariable.terrain, game.terrain);

    // For purposes of modularity
    for (let row of game.terrain) {
        for (let element of row)
            element.addSprite(game.app.stage);
    }

    game.buildMap(CONSTANTS.terrain.sideLength);
    game.app.ticker.add(delta => render(delta));
}

function render(delta) {
    game.autoResize();
    game.updateCamera();
}

async function getGameDetails(logFile) {
    let proto = new Proto(logFile);
    let gameDetails = await proto.getGame();

    return gameDetails;
}
