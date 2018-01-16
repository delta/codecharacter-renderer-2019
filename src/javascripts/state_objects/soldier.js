import StateObject from './stateobject';

export default class Soldier extends StateObject {
    constructor(x, y, width, height, hp, state, playerID, texture) {
        super(x, y, width, height, texture);
        this.hp = hp;
        this.state = state;
        this.playerID = playerID;
    }

    update(hp, x, y, state) {
        this.setSpritePosition(x, y);
        this.hp = hp;
        this.state = state;
    }

    static setTextures() {

    }

    static setMaxHP(hp) {
        this.maxHP = hp;
    }
}
