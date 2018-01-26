import StateObject from './stateobject';

export default class Tower extends StateObject {
    constructor(x, y, playerID, hp, towerLevel, isBase) {
        let spriteDetails = Tower.getSpriteDetails(playerID, towerLevel);
        let width = spriteDetails.dimensions.width,
            height = spriteDetails.dimensions.height,
            texture = spriteDetails.texture;

        super(x, y, width, height, texture);
        this.setSpriteAnchors(0.5, 1);

        this.playerID = playerID;
        this.hp = hp;
        this.level = towerLevel;
        this.isBase = isBase;
    }

    update(hp, level) {
        this.hp = hp;
        this.updateLevel(level);
    }

    destroy() {
        this.updateLevel(0);
    }

    updateLevel(level) {
        this.level = level;

        let spriteDetails = Tower.getSpriteDetails(this.playerID, this.level);
        this.sprite.texture = spriteDetails.texture;
        this.setSpriteDimensions(spriteDetails.dimensions.width, spriteDetails.dimensions.height);
    }

    static setMaxHPs(hpArray) {
        this.maxHPs = hpArray.slice();
    }

    static setRanges(ranges) {
        this.ranges = ranges.slice();
    }

    static setSpriteConstants(TOWER_CONSTANTS) {
        this.spriteDimensions = {
            deadSprite: TOWER_CONSTANTS.deadSprite,
            lv1Sprite: TOWER_CONSTANTS.lv1Sprite,
            lv2Sprite: TOWER_CONSTANTS.lv2Sprite,
            lv3Sprite: TOWER_CONSTANTS.lv3Sprite
        }
    }

    static setTextures(p1Textures, p2Textures) {
        this.textures = [p1Textures, p2Textures];
    }

    static getSpriteDetails(playerID, towerLevel) {
        let details = {texture: null, dimensions: null};

        switch (towerLevel) {
        case 0:
            details.texture = this.textures[playerID - 1].deadTexture;
            details.dimensions = this.spriteDimensions.deadSprite;
            break;
        case 1:
            details.texture = this.textures[playerID - 1].lv1Texture;
            details.dimensions = this.spriteDimensions.lv1Sprite;
            break;
        case 2:
            details.texture = this.textures[playerID - 1].lv2Texture;
            details.dimensions = this.spriteDimensions.lv2Sprite;
            break;
        case 3:
            details.texture = this.textures[playerID - 1].lv3Texture;
            details.dimensions = this.spriteDimensions.lv3Sprite;
            break;
        }

        return details;
    }
}
