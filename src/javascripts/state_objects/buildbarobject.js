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
        this.outerBar.drawRect(0, 0, this.width, BuildBarObject.buildBarConstants.height);
        this.outerBar.endFill();

        this.innerBar.beginFill(BuildBarObject.buildBarConstants.innerBarColor);
        this.innerBar.drawRect(0, 0, 0.1, BuildBarObject.buildBarConstants.height);  //non-zero value 0.1
        this.innerBar.endFill();

        this.buildBar.addChild(this.outerBar);
        this.buildBar.addChild(this.innerBar);
    }

    updatePosition(x, y) {
        let offsetY = BuildBarObject.buildBarConstants.offsetY;
        this.buildBar.position.set(x - (this.width/2), y - (this.height/2) - offsetY);
    }

    updateBuildPercent(buildPercent) {
        this.buildPercent = Math.min(100,buildPercent);
        this.innerBar.width = (this.buildPercent/100)*this.width;
    }

    static setBuildConstants(BUILD_BAR_CONST) {
        this.buildBarConstants = BUILD_BAR_CONST;
    }
}
