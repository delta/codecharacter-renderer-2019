import * as PIXI from 'pixi.js';
import Unit from './unit';

export default class Villager extends Unit {
    constructor(x, y, direction, hp, state, playerID, animationSpeed) {
        super(x, y, direction, hp, state, playerID, animationSpeed, Villager.unitType);
    }

    // override to mention what unitType
    updateState(state, x, y, direction, hp) {
        super.updateState(state, x, y, direction, hp, Villager.unitType);
    }

    // unit type villager
    static setUnitConstant(VILLAGER_CONSTANT) {
        this.unitType = VILLAGER_CONSTANT;
    }

    // Sprite details for villager
    static setSpriteConstants(VILLAGER_SPRITE_CONSTANTS) {
        Unit.setSpriteConstants(VILLAGER_SPRITE_CONSTANTS, Villager.unitType);
    }
}
