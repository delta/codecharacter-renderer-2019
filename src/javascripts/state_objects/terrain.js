import StateObject from './stateobject';
import GraphicsPrimitive from './graphicsprimitive';

export default class TerrainElement extends StateObject {
    constructor(x, y, type) {
        let texture = TerrainElement.getTexture(type);
        super(x, y, TerrainElement.sideLength, TerrainElement.sideLength, texture);

        this.playerID = 0;
        this.type = type;
        this.nearbyTowers = [{}, {}];    // [{p1Towers}, {p2Towers}]

        this.overlay = new GraphicsPrimitive(x, y, TerrainElement.sideLength, TerrainElement.sideLength);
    }

    addOwnership(playerID, towerID) {
        this.addTower(playerID - 1, towerID);

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

        this.removeTower(playerID - 1, towerID);

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
        return this.nearbyTowers[playerID - 1];
    }


    static setSideLength(len) {
        this.sideLength = len;
    }

    static setTextures(textures) {
        this.textures = textures;
    }

    static getTexture(type) {
        switch (type) {
        case 'l':
            return this.textures.landTexture;
        case 'w':
            return this.textures.waterTexture;
        }
    }

    static setOverlayOpacity(OVERLAY_CONSTANTS) {
        GraphicsPrimitive.setOpacity(OVERLAY_CONSTANTS.opacity);
    }
}
