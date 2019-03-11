import BarObject from './barobject';

export default class BuildBarObject extends BarObject {
    constructor(playerID, buildPercent, width, height) {
        super(playerID, width, height, BuildBarObject.buildBarConstants);
        this.updateBuildPercent(buildPercent);
    }

    updateBuildPercent(buildPercent) {
        let percent = buildPercent / 100;
        this.updatePercent(percent);
    }

    static setBuildConstants(BUILD_BAR_CONST) {
        this.buildBarConstants = BUILD_BAR_CONST;
    }
}
