import * as PIXI from 'pixi.js';
import StateObject from './stateobject';

export default class TerrainElement extends StateObject {
    constructor(x, y, type, texture) {
        super(x, y, TerrainElement.sideLength, TerrainElement.sideLength, texture);
        this.playerID = 0;
        this.type = type;
    }

    addOwnership(playerID) {
        if (this.playerID == playerID || this.playerID == 3)
            return;

        if (this.playerID == 0)
            this.playerID = playerID;
        else this.playerID = 3;
        // this.sprite.texture = PIXI.loader.resources.newPlayerID.texture;
    }

    removeOwnership(playerID) {
        if (this.playerID == 0 || (this.playerID != 3 && this.playerID != playerID))
            return;

        this.playerID -= playerID;
        // this.sprite.texture = PIXI.loader.resources.newPlayerID.texture;
    }

    static setSideLength(len) {
        this.sideLength = len;
    }
}
