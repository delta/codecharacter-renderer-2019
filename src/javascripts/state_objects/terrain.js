import * as PIXI from 'pixi.js';
import StateObject from './stateobject';
import GraphicsPrimitive from './graphicsprimitive';

export default class TerrainElement extends StateObject {
    constructor(x, y, terrianType) {
        super(x, y, TerrainElement.sideLength, TerrainElement.sideLength, TerrainElement.textures.landTexture);

        this.playerID = 0;
        // this.nearbyTowers = { 1: {}, 2: {} };

        this.overlay = new GraphicsPrimitive(x, y, TerrainElement.sideLength, TerrainElement.sideLength, terrianType);
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

    // addOwnership(playerID, towerID) {
    //     this.addTower(playerID, towerID);

    //     if (this.playerID == playerID || this.playerID == 3)
    //         return;

    //     if (this.playerID === 0)
    //         this.playerID = playerID;
    //     else this.playerID = 3;

    //     TerrainElement.addOwnership(playerID);
    //     this.overlay.fill(this.playerID);
    // }

    // removeOwnership(playerID, towerID) {
    //     if (this.playerID == 0 || (this.playerID != 3 && this.playerID != playerID))
    //         return;

    //     this.removeTower(playerID, towerID);

    //     if ( Object.keys(this.getNearbyTowers(playerID)).length === 0 ) {
    //         TerrainElement.removeOwnership(playerID);
    //         this.playerID -= playerID;
    //         this.overlay.fill(this.playerID);
    //     }
    // }

    // addTower(playerID, towerID) {
    //     this.nearbyTowers[playerID][towerID] = null;
    // }

    // removeTower(playerID, towerID) {
    //     delete this.nearbyTowers[playerID][towerID];
    // }

    // getNearbyTowers(playerID) {
    //     return this.nearbyTowers[playerID];
    // }


    // static createOwnershipObject() {
    //     this.ownership = {
    //         1: 0,
    //         2: 0
    //     };
    // }

    // static addOwnership(playerID) {
    //     this.ownership[playerID] += 1;
    // }

    // static removeOwnership(playerID) {
    //     this.ownership[playerID] -= 1;
    // }

    // static getOwnership() {
    //     return this.ownership;
    // }

    static setSideLength(len) {
        this.sideLength = len;
    }

    static setTextures() {
        this.textures = {
            landTexture: PIXI.loader.resources.land.texture,
            waterTexture: PIXI.loader.resources.land.texture,
            goldTexture: PIXI.loader.resources.land.texture
        };
    }

    static setOverlayConstants(OVERLAY_CONSTANTS) {
        GraphicsPrimitive.setOpacity(OVERLAY_CONSTANTS.opacity);
        GraphicsPrimitive.setColors(OVERLAY_CONSTANTS.colors);
    }
}
