import Unit from './unit';

export default class Villager extends Unit {
    constructor(x, y, id, direction, hp, state, playerID, animationSpeed) {
        super(x, y, id, direction, hp, state, playerID, animationSpeed, Villager.unitType, Villager.maxHP);
    }

    // override to mention what unitType
    updateState(state, direction) {
        super.updateState(state, direction, Villager.unitType);
    }

    //set MaxHP
    static setMaxHP(maxHP) {
        this.maxHP = maxHP;
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
