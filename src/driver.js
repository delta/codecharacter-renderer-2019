var app = new PIXI.Application({width: window.innerWidth, height: window.innerHeight});
document.body.appendChild(app.view);

// var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

PIXI.loader
    .add("land", "assets/land.jpg")
    .add("water", "assets/water.jpg")
    .load(initialize);

var terrain;
function initialize() {
    stateVariable = getDetails();
    terrain = TerrainElement.build(stateVariable.terrain);

    // For purposes of modularity
    for (let row of terrain) {
        for (let element of row)
            element.addSprite(app);
    }

    // render();
}

// function render() {

//     requestAnimationFrame(render);
// }

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
