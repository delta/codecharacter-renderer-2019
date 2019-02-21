import * as PIXI from 'pixi.js';
import Actor from './actor';

export default class Factory extends Actor {
    constructor(x, y, id, playerID, hp, state, buildPercent) {
        let buildLevel = Math.floor(Math.min(100, buildPercent) * Factory.buildLevelMultiplier);
        let spriteDetails = Factory.getSpriteDetails(playerID, buildLevel);
        let width = Factory.displayDimensions.width,
            height = Factory.displayDimensions.height,
            texture = spriteDetails.texture;

        super(x, y, width, height, texture, Factory.maxHPs);
        this.setSpriteAnchors();

        this.playerID = playerID;
        this.factoryID = id;
        this.hp = hp;
        this.state = state;
        this.buildPercent = buildPercent;
    }

    updateHP(hp) {
        this.hp = hp;
        super.updateBarHP();    // change HPBar hp
    }

    update(state, buildPercent) {
        this.state = state;
        this.buildPercent = buildPercent;
        this.setBuildLevel(buildPercent);
        this.updateBuildTexture(this.buildLevel);
    }

    destroy() {
        this.updateBuildTexture(-1);    // -1 = deadTexture
    }

    setBuildLevel(buildPercent) {
        this.buildLevel = Math.floor(Math.min(100, buildPercent) * Factory.buildLevelMultiplier);
        if (this.hp < Factory.minHp && buildPercent >= 100) {
            this.buildLevel = 3;    // broken state
        }
    }

    updateBuildTexture(level) {
        let spriteDetails = Factory.getSpriteDetails(this.playerID, level);
        this.sprite.texture = spriteDetails.texture;
    }

    static setMaxHPs(maxHP) {
        this.maxHPs = maxHP;
    }

    static setBuildMultiplier(MULTIPLIER_CONSTANT) {
        this.buildLevelMultiplier = MULTIPLIER_CONSTANT;
    }

    static setMinHP(HP_CONSTANT) {
        this.minHp = HP_CONSTANT;
    }

    static setSpriteConstants(FACTORY_SPRITE_CONSTANTS) {
        this.displayDimensions = FACTORY_SPRITE_CONSTANTS.displayDimensions;
        this.spriteSheetData = FACTORY_SPRITE_CONSTANTS.spriteSheetData;
    }

    static setTextures() {
        this.baseTextures = {
            1: PIXI.loader.resources.towerP1.texture,
            2: PIXI.loader.resources.towerP2.texture
        };

        this.textures = {
            1: {
                deadTexture: this.getDeadTexture(1),
                lv1Texture: this.getLv1Texture(1),  //0%
                lv2Texture: this.getLv2Texture(1),  //50%
                lv3Texture: this.getLv3Texture(1),  //100%
            },
            2: {
                deadTexture: this.getDeadTexture(2),
                lv1Texture: this.getLv1Texture(2),  //0%
                lv2Texture: this.getLv2Texture(2),  //50%
                lv3Texture: this.getLv3Texture(2),  //100%
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

    static getSpriteDetails(playerID, buildLevel) {
        let details = { texture: null };

        switch (buildLevel) {
        case -1:
            details.texture = this.textures[playerID].deadTexture;
            break;
        case 0:
            details.texture = this.textures[playerID].lv1Texture;   // foundation
            break;
        case 1:
            details.texture = this.textures[playerID].lv2Texture;   // half built
            break;
        case 2:
            details.texture = this.textures[playerID].lv3Texture;   // completely built
            break;
        case 3:
            details.texture = this.textures[playerID].lv3Texture;   // broken state
            break;
        }

        return details;
    }
}
