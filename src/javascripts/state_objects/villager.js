import Unit from './unit';

export default class Villager extends Unit {
    constructor(x, y, id, direction, hp, state, playerID, animationSpeed) {
        super(x, y, id, direction, hp, state, playerID, animationSpeed, Villager.actorType, Villager.maxHP);
    }

    // override to mention what actorType
    updateState(state, direction) {
        super.updateState(state, direction, Villager.actorType);
    }

    //set MaxHP
    static setMaxHP(maxHP) {
        this.maxHP = maxHP;
    }

    // Actor type villager
    static setActorConstant(VILLAGER_CONSTANT) {
        this.actorType = VILLAGER_CONSTANT;
    }

    // Sprite details for villager
    static setSpriteConstants(VILLAGER_SPRITE_CONSTANTS) {
        Unit.setSpriteConstants(VILLAGER_SPRITE_CONSTANTS, Villager.actorType);
    }
}
