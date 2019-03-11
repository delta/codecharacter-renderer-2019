import * as PIXI from 'pixi.js';

export default class BarObject {
    constructor(playerID, width, height, constants) {
        this.playerID = playerID;
        this.width = width;
        this.height = height;
        this.constants = constants;
        this.buildBars();
    }

    buildBars() {
        this.bar = new PIXI.Container();
        this.innerBar = new PIXI.Graphics();    // moving bar
        this.outerBar = new PIXI.Graphics();    // fixed bar

        this.outerBar.beginFill(this.constants.outerBarColor);
        // consts to allow outerbar to act as border for the container
        this.outerBar.drawRect(-0.1, -0.1, this.width + 0.2, this.constants.height + 0.2);
        this.outerBar.endFill();

        this.innerBar.beginFill(this.constants.innerBarColors[this.playerID]);
        this.innerBar.drawRect(0, 0, this.width, this.constants.height);
        this.innerBar.endFill();

        this.bar.addChild(this.outerBar);
        this.bar.addChild(this.innerBar);
    }

    updatePosition(x, y) {
        this.bar.position.set(x, y);
    }

    updatePercent(percent) {
        this.innerBar.width = percent*this.width;
    }

    addBar(stage) {
        stage.addChild(this.bar);
    }

    removeBar(stage) {
        stage.removeChild(this.bar);
    }
}
