import * as PIXI from 'pixi.js';
import Unit from './unit';

export default class Soldier extends Unit {
    constructor(x, y, direction, hp, state, playerID, animationSpeed) {
        super(x, y, direction, hp, state, playerID, animationSpeed, Soldier.unitType);
    }

    // override to mention what unitType
    updateState(state, direction) {
        super.updateState(state, direction, Soldier.unitType);
    }

    // unit type soldier
    static setUnitConstant(SOLDIER_CONSTANT) {
        this.unitType = SOLDIER_CONSTANT;
    }

    // Sprite details for soldier
    static setSpriteConstants(SOLDIER_SPRITE_CONSTANTS) {
        Unit.setSpriteConstants(SOLDIER_SPRITE_CONSTANTS, Soldier.unitType);
    }
}
