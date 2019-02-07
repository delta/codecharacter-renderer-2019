import * as PIXI from 'pixi.js';
import Unit from './unit';

export default class Soldier extends Unit {
    constructor(x, y, direction, hp, state, playerID, animationSpeed) {
        super(x, y, direction, hp, state, playerID, animationSpeed, Soldier.unitType);
    }

    // Sprite details for soldier
    static setSpriteConstants(SOLDIER_SPRITE_CONSTANTS, SOLDIER_CONSTANT) {
        this.unitType = SOLDIER_CONSTANT;
        Unit.setSpriteConstants(SOLDIER_SPRITE_CONSTANTS, SOLDIER_CONSTANT);
    }

    // Texture related methods
    static setTextures() {
        Unit.setTextures(Soldier.unitType);
    }
}