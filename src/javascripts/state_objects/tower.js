import StateObject from './stateobject';

export default class Tower extends StateObject {
    constructor(x, y, width, height, playerID, hp, towerLevel, isBase, texture) {
        super(x, y, width, height, texture);
        this.playerID = playerID;
        this.hp = hp;
        this.level = towerLevel;
        this.isBase = isBase;
    }

    update(hp, level) {
        this.hp = hp;
        this.level = level;
    }

    destroy() {
        // Set destroyed tower texture
    }

    static setMaxHPs(hpArray) {
        this.maxHPs = hpArray.slice();
    }

    static setRanges(ranges) {
        this.ranges = ranges.slice();
    }
}
