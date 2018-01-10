import * as PIXI from 'pixi.js';
import CONSTANTS from './constants';
import Game from './game';
import TerrainElement from './state_objects/terrain';
import Proto from './protoparse.js';

var game = new Game(CONSTANTS.camera);
PIXI.loader
    .add("land", "assets/land.jpg")
    .add("water", "assets/water.jpg")
    .load(initialize);

async function initialize() {
    const stateVariable = await getGameDetails();
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

async function getGameDetails() {
    let proto = new Proto();
    let gameDetails = await proto.getGame();

    return gameDetails;
}
