import * as PIXI from 'pixi.js';
import Game from './game';
import TerrainElement from './state_objects/terrain';

var game = new Game();

PIXI.loader
    .add("land", "assets/land.jpg")
    .add("water", "assets/water.jpg")
    .load(initialize);

function initialize() {
    let stateVariable = getDetails();
    TerrainElement.build(stateVariable.terrain, game.terrain);

    // For purposes of modularity
    for (let row of game.terrain) {
        for (let element of row)
            element.addSprite(game.app.stage);
    }

    game.app.ticker.add(delta => render(delta));
}

function render(delta) {

    game.autoResize();
    game.app.stage.setTransform(
        game.camera.zoom.value * game.camera.pos.x,
        game.camera.zoom.value * game.camera.pos.y,
        game.camera.zoom.value,
        game.camera.zoom.value
    );

    /*
        // Object Position Update
        update();
    */
}

function getDetails() {
    // Temporary
    return {
        terrain: [
            ['l', 'l', 'l', 'l', 'l', 'l', 'l', 'l'],
            ['l', 'l', 'l', 'l', 'l', 'l', 'l', 'l'],
            ['l', 'l', 'w', 'w', 'w', 'w', 'l', 'l'],
            ['l', 'l', 'w', 'w', 'w', 'w', 'l', 'l'],
            ['l', 'l', 'w', 'w', 'w', 'w', 'l', 'l'],
            ['l', 'l', 'w', 'w', 'w', 'w', 'l', 'l'],
            ['l', 'l', 'l', 'l', 'l', 'l', 'l', 'l'],
            ['l', 'l', 'l', 'l', 'l', 'l', 'l', 'l'],
        ]
    };
}
