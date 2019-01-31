import * as PIXI from 'pixi.js';
import StateObject from './stateobject';

export default class TerrainElement extends StateObject {
    constructor(x, y, terrianType) {
        super(x, y, TerrainElement.sideLength, TerrainElement.sideLength, TerrainElement.getTerrainTexture(terrianType));
        this.playerID = 0;
    }

    static getTerrainTexture(terrianType) {
        if (terrianType === 1) {
            return TerrainElement.textures.waterTexture;
        } else if (terrianType === 2) {
            return TerrainElement.textures.goldTexture;
        } else {
            return TerrainElement.textures.landTexture;
        }
    }

    static setSideLength(len) {
        this.sideLength = len;
    }

    static setTextures() {
        this.textures = {
            landTexture: PIXI.loader.resources.land.texture,
            waterTexture: PIXI.loader.resources.water.texture,
            goldTexture: PIXI.loader.resources.gold.texture
        };
    }
}
