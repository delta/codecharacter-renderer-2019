import * as PIXI from 'pixi.js';

export default class BuildBarObject {
    constructor(buildPercent, width, height) {
        this.buildPercent = buildPercent;    // Initially actors start with 0 buildPercent
        this.width = width;
        this.height = height;
        this.createBuildBars();
    }

    createBuildBars() {
        this.buildBar = new PIXI.Container();
        this.innerBar = new PIXI.Graphics();    // moving bar
        this.outerBar = new PIXI.Graphics();    // fixed bar

        this.outerBar.beginFill(BuildBarObject.buildBarConstants.outerBarColor);
        // consts to allow outerbar to act as border for the container
        this.outerBar.drawRect(-0.1, -0.1, this.width + 0.2, BuildBarObject.buildBarConstants.height + 0.2);
        this.outerBar.endFill();

        this.innerBar.beginFill(BuildBarObject.buildBarConstants.innerBarColor);
        this.innerBar.drawRect(0, 0, 0.1, BuildBarObject.buildBarConstants.height);  //non-zero value 0.1
        this.innerBar.endFill();

        this.buildBar.addChild(this.outerBar);
        this.buildBar.addChild(this.innerBar);
    }

    updatePosition(x, y) {
        this.buildBar.position.set(x, y);
    }

    updateBuildPercent(buildPercent) {
        this.buildPercent = Math.min(100,buildPercent);
        this.innerBar.width = (this.buildPercent/100)*this.width;
    }

    addBuildBar(stage) {
        stage.addChild(this.buildBar);
    }

    removeBuildBar(stage) {
        stage.removeChild(this.buildBar);
    }

    static setBuildConstants(BUILD_BAR_CONST) {
        this.buildBarConstants = BUILD_BAR_CONST;
    }
}
