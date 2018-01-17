import StateObject from './stateobject';

export default class Soldier extends StateObject {
    constructor(x, y, hp, state, playerID) {
        let spriteDetails = Soldier.getSpriteDetails(playerID, state);
        let width = spriteDetails.dimensions.width,
            height = spriteDetails.dimensions.height,
            texture = spriteDetails.texture;

        super(x, y, width, height, texture);
        this.hp = hp;
        this.state = state;
        this.playerID = playerID;
    }

    updatePosition(x, y) {
        this.setSpritePosition(x, y);
    }

    updateHP(hp) {
        this.hp = hp;
    }

    updateState(state) {
        this.state = state;
        let spriteDetails = Soldier.getSpriteDetails(this.playerID, this.state);
        this.sprite.texture = spriteDetails.texture;
        this.setSpriteDimensions(spriteDetails.dimensions.width, spriteDetails.dimensions.height);
    }

    static setMaxHP(hp) {
        this.maxHP = hp;
    }

    static setSpriteConstants(SOLDIER_CONSTANTS) {
        this.spriteDimensions = {
            idleSprite: SOLDIER_CONSTANTS.idleSprite,
            moveSprite: SOLDIER_CONSTANTS.moveSprite,
            atkSprite: SOLDIER_CONSTANTS.atkSprite,
            deadSprite: SOLDIER_CONSTANTS.deadSprite
        }
    }

    static setTextures(p1Textures, p2Textures) {
        this.textures = [p1Textures, p2Textures];
    }

    static getSpriteDetails(playerID, soldierState) {
        let details = {texture: null, dimensions: null};

        switch (soldierState) {
        case 1:
            details.texture = this.textures[playerID].idleTexture;
            details.dimensions = this.spriteDimensions.idleSprite;
            break;
        case 2:
            details.texture = this.textures[playerID].moveTexture;
            details.dimensions = this.spriteDimensions.moveSprite;
            break;
        case 3:
            details.texture = this.textures[playerID].atkTexture;
            details.dimensions = this.spriteDimensions.atkSprite;
            break;
        case 4:
            details.texture = this.textures[playerID].deadTexture;
            details.dimensions = this.spriteDimensions.deadSprite;
            break;
        }

        return details;
    }
}
