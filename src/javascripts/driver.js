var game = new Game();

// var app = new PIXI.Application({width: window.innerWidth, height: window.innerHeight});
// document.body.appendChild(app.view);

PIXI.loader
    .add("land", "assets/land.jpg")
    .add("water", "assets/water.jpg")
    .load(initialize);

function initialize() {
    stateVariable = getDetails();
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
    // stage.setTransform(camera.zoom*camera.x, camera.zoom*camera.y, camera.zoom, camera.zoom);
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
