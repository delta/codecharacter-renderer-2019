import * as PIXI from 'pixi.js';
import StateObject from './stateobject';
import GraphicsPrimitive from './graphicsprimitive';

export default class TerrainElement extends StateObject {
    constructor(x, y) {
        super(x, y, TerrainElement.sideLength, TerrainElement.sideLength, TerrainElement.textures.landTexture);

        this.playerID = 0;
        this.nearbyTowers = { 1: {}, 2: {} };

        this.overlay = new GraphicsPrimitive(x, y, TerrainElement.sideLength, TerrainElement.sideLength);
    }

    addOwnership(playerID, towerID) {
        this.addTower(playerID, towerID);

        if (this.playerID == playerID || this.playerID == 3)
            return;

        if (this.playerID === 0)
            this.playerID = playerID;
        else this.playerID = 3;

        this.overlay.fill(this.playerID);
    }

    removeOwnership(playerID, towerID) {
        if (this.playerID == 0 || (this.playerID != 3 && this.playerID != playerID))
            return;

        this.removeTower(playerID, towerID);

        if ( Object.keys(this.getNearbyTowers(playerID)).length === 0 ) {
            this.playerID -= playerID;
            this.overlay.fill(this.playerID);
        }
    }

    addTower(playerID, towerID) {
        this.nearbyTowers[playerID][towerID] = null;
    }

    removeTower(playerID, towerID) {
        delete this.nearbyTowers[playerID][towerID];
    }

    getNearbyTowers(playerID) {
        return this.nearbyTowers[playerID];
    }


    static setSideLength(len) {
        this.sideLength = len;
    }

    static setTextures() {
        this.textures = {
            landTexture: PIXI.loader.resources.land.texture
        };
    }

    static setOverlayConstants(OVERLAY_CONSTANTS) {
        GraphicsPrimitive.setOpacity(OVERLAY_CONSTANTS.opacity);
        GraphicsPrimitive.setColors(OVERLAY_CONSTANTS.colors);
    }
}
