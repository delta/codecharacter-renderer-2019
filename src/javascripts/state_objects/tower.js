import * as PIXI from 'pixi.js';
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

    static setSpriteConstants(TOWER_DIMENSIONS) {
        this.spriteDimensions = TOWER_DIMENSIONS;
    }

    static setTextures() {
        this.textures = {
            1: {
                deadTexture: PIXI.loader.resources.towerP1L1.texture,
                lv1Texture: PIXI.loader.resources.towerP1L1.texture,
                lv2Texture: PIXI.loader.resources.towerP1L1.texture,
                lv3Texture: PIXI.loader.resources.towerP1L1.texture
            },
            2: {
                deadTexture: PIXI.loader.resources.towerP2L1.texture,
                lv1Texture: PIXI.loader.resources.towerP2L1.texture,
                lv2Texture: PIXI.loader.resources.towerP2L1.texture,
                lv3Texture: PIXI.loader.resources.towerP2L1.texture
            }
        };
    }

    static getSpriteDetails(playerID, towerLevel) {
        let details = {texture: null, dimensions: null};

        switch (towerLevel) {
        case 0:
            details.texture = this.textures[playerID].deadTexture;
            details.dimensions = this.spriteDimensions.deadSprite;
            break;
        case 1:
            details.texture = this.textures[playerID].lv1Texture;
            details.dimensions = this.spriteDimensions.lv1Sprite;
            break;
        case 2:
            details.texture = this.textures[playerID].lv2Texture;
            details.dimensions = this.spriteDimensions.lv2Sprite;
            break;
        case 3:
            details.texture = this.textures[playerID].lv3Texture;
            details.dimensions = this.spriteDimensions.lv3Sprite;
            break;
        }

        return details;
    }
}
