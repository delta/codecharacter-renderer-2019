import Unit from './unit';

export default class Soldier extends Unit {
    constructor(x, y, id, direction, hp, state, playerID, animationSpeed) {
        super(x, y, id, direction, hp, state, playerID, animationSpeed, Soldier.actorType, Soldier.maxHP);
    }

    // override to mention what actorType
    updateState(state, direction) {
        super.updateState(state, direction, Soldier.actorType);
    }

    //set MaxHP
    static setMaxHP(maxHP) {
        this.maxHP = maxHP;
    }

    // Actor type soldier
    static setActorConstant(SOLDIER_CONSTANT) {
        this.actorType = SOLDIER_CONSTANT;
    }

    // Sprite details for soldier
    static setSpriteConstants(SOLDIER_SPRITE_CONSTANTS) {
        Unit.setSpriteConstants(SOLDIER_SPRITE_CONSTANTS, Soldier.actorType);
    }
}
