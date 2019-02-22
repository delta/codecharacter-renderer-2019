import * as PIXI from 'pixi.js';

export default class BuildBarObject {
    constructor(buildPercent, width, height) {
        this.buildPercent = buildPercent;    // Initially actors start with 0 buildPercent
        this.width = width;
        this.height = height;
    }

    createBuildBars() {
        this.buildBar = new PIXI.Container();
        this.innerBar = new PIXI.Graphics();    // moving bar
        this.outerBar = new PIXI.Graphics();    // fixed bar

        this.outerBar.beginFill(0x333333);
        this.outerBar.drawRect(0, 0, this.width, 1);
        this.outerBar.endFill();

        this.innerBar.beginFill(0x55FF00);
        this.innerBar.drawRect(0, 0, 1, 1);
        this.innerBar.endFill();

        this.buildBar.addChild(this.outerBar);
        this.buildBar.addChild(this.innerBar);
    }

    updatePosition(x, y) {
        let offsetY = this.height/3;
        this.buildBar.position.set(x - (this.width/2), y - (this.width/2) - offsetY);
    }

    updateBuildPercent(buildPercent) {
        this.buildPercent = Math.min(100,buildPercent);
        this.innerBar.width = (this.buildPercent/100)*this.width;
    }

}
