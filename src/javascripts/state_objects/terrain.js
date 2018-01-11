import * as PIXI from 'pixi.js';
import StateObject from './stateobject';

export default class TerrainElement extends StateObject {
    constructor(x, y, type, texture) {
        super(x, y, TerrainElement.sideLength, TerrainElement.sideLength, texture);
        this.type = type;
    }

    setPlayerID(id) {
        this.playerID = id;
        // this.sprite.texture = PIXI.loader.resources.newPlayerID.texture;
    }

    static setSideLength(len) {
        TerrainElement.sideLength = len;
    }
}
