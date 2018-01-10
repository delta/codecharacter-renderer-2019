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

    static build(stateTerrain, gameTerrain) {
        const len = TerrainElement.sideLength;
        var texture;

        for (let i = 0; i < stateTerrain.length; i++) {
            gameTerrain[i] = [];
            for (let j = 0; j < stateTerrain[i].length; j++) {
                if (stateTerrain[i][j] == 'l')
                    texture = PIXI.loader.resources.land.texture;
                else
                    texture = PIXI.loader.resources.water.texture;

                gameTerrain[i][j] = new TerrainElement(len*i, len*j, stateTerrain[i][j], texture);
            }
        }
    }

    static setSideLength(len) {
        TerrainElement.sideLength = len;
    }
}
