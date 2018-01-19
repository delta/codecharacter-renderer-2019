import StateObject from './stateobject';
import GraphicsPrimitive from './graphicsprimitive';

export default class TerrainElement extends StateObject {
    constructor(x, y, type) {
        let texture = TerrainElement.getTexture(type);
        super(x, y, TerrainElement.sideLength, TerrainElement.sideLength, texture);

        this.playerID = 0;
        this.type = type;
        this.overlay = new GraphicsPrimitive(x, y, TerrainElement.sideLength, TerrainElement.sideLength);
    }

    addOwnership(playerID) {
        if (this.playerID == playerID || this.playerID == 3)
            return;

        if (this.playerID === 0)
            this.playerID = playerID;
        else this.playerID = 3;

        this.overlay.fill(this.playerID);
    }

    removeOwnership(playerID) {
        if (this.playerID == 0 || (this.playerID != 3 && this.playerID != playerID))
            return;

        this.playerID -= playerID;
        this.overlay.fill(this.playerID);
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
