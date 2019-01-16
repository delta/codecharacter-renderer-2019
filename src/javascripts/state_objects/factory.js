import * as PIXI from 'pixi.js';
import StateObject from './stateobject';

export default class Factory extends StateObject {
    constructor(x, y, id, playerID, hp, state, buildPercent) {
        let spriteDetails = Factory.getSpriteDetails(playerID, towerLevel);
        let width = Factory.displayDimensions.width,
            height = Factory.displayDimensions.height,
            texture = spriteDetails.texture;

        super(x, y, width, height, texture);
        this.setSpriteAnchors();

        this.playerID = playerID;
        this.factoryID = id;
        this.hp = hp;
        this.factoryState = state;
        this.buildPercent = buildPercent;
    }

    update(hp, factoryState, buildPercent) {
        this.hp = hp;
        this.factoryState = factoryState;
        this.buildPercent = buildPercent;
        this.updateLevel(level);
    }

    destroy() {
        this.updateLevel(0);
    }

    updateLevel(level) {
        this.level = level;

        let spriteDetails = Factory.getSpriteDetails(this.playerID, this.level);
        this.sprite.texture = spriteDetails.texture;
    }

    static setMaxHPs(hpArray) {
        this.maxHPs = hpArray;
    }



    static setSpriteConstants(TOWER_SPRITE_CONSTANTS) {
        this.displayDimensions = TOWER_SPRITE_CONSTANTS.displayDimensions;
        this.spriteSheetData = TOWER_SPRITE_CONSTANTS.spriteSheetData;
    }

    static setTextures() {
        this.baseTextures = {
            1: PIXI.loader.resources.towerP1.texture,
            2: PIXI.loader.resources.towerP2.texture
        };

        this.textures = {
            1: {
                deadTexture: this.getDeadTexture(1),
                lv1Texture: this.getLv1Texture(1),
                lv2Texture: this.getLv2Texture(1),
                lv3Texture: this.getLv3Texture(1)
            },
            2: {
                deadTexture: this.getDeadTexture(2),
                lv1Texture: this.getLv1Texture(2),
                lv2Texture: this.getLv2Texture(2),
                lv3Texture: this.getLv3Texture(2)
            }
        };
    }

    static getDeadTexture(playerID) {
        let base = this.baseTextures[playerID];
        let pos = Factory.spriteSheetData.deadTexture.pos,
            frame = Factory.spriteSheetData.frameDetails;

        let texture = new PIXI.Texture(base);
        texture.frame = new PIXI.Rectangle(pos.x, pos.y, frame.width, frame.height);

        return texture;
    }

    static getLv1Texture(playerID) {
        let base = this.baseTextures[playerID];
        let pos = Factory.spriteSheetData.lv1Texture.pos,
            frame = Factory.spriteSheetData.frameDetails;

        let texture = new PIXI.Texture(base);
        texture.frame = new PIXI.Rectangle(pos.x, pos.y, frame.width, frame.height);

        return texture;
    }

    static getLv2Texture(playerID) {
        let base = this.baseTextures[playerID];
        let pos = Factory.spriteSheetData.lv2Texture.pos,
            frame = Factory.spriteSheetData.frameDetails;

        let texture = new PIXI.Texture(base);
        texture.frame = new PIXI.Rectangle(pos.x, pos.y, frame.width, frame.height);

        return texture;
    }

    static getLv3Texture(playerID) {
        let base = this.baseTextures[playerID];
        let pos = Factory.spriteSheetData.lv3Texture.pos,
            frame = Factory.spriteSheetData.frameDetails;

        let texture = new PIXI.Texture(base);
        texture.frame = new PIXI.Rectangle(pos.x, pos.y, frame.width, frame.height);

        return texture;
    }

    static getSpriteDetails(playerID, towerLevel) {
        let details = { texture: null };

        switch (towerLevel) {
            case 0:
                details.texture = this.textures[playerID].deadTexture;
                break;
            case 1:
                details.texture = this.textures[playerID].lv1Texture;
                break;
            case 2:
                details.texture = this.textures[playerID].lv2Texture;
                break;
            case 3:
                details.texture = this.textures[playerID].lv3Texture;
                break;
        }

        return details;
    }
}
