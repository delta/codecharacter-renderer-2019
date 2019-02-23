import * as PIXI from 'pixi.js';
import BuildBarObject from './buildbarobject';
import Actor from './actor';

export default class Factory extends Actor {
    constructor(x, y, id, playerID, hp, state, buildPercent) {
        let buildLevel = Math.floor(Math.min(100, buildPercent) * Factory.buildLevelMultiplier);
        let spriteDetails = Factory.getSpriteDetails(playerID, buildLevel);
        let width = Factory.displayDimensions.width,
            height = Factory.displayDimensions.height,
            texture = spriteDetails.texture;

        super(x, y, id, playerID, hp, state, width, height, texture, Factory.maxHPs);
        this.setSpriteAnchors();
        this.buildPercent = buildPercent;
        this.buildBarObject = new BuildBarObject(buildPercent, width, height);
        this.buildBarObject.createBuildBars();
        this.updateBuildBarPosition();
    }

    updateBuildBarPosition() {
        this.buildBarObject.updatePosition(this.sprite.x, this.sprite.y);
    }

    update(state, buildPercent) {
        this.state = state;
        this.buildPercent = buildPercent;
        this.setBuildLevel(buildPercent);
        this.buildBarObject.updateBuildPercent(buildPercent);
        this.updateBuildTexture(this.buildLevel);
    }

    destroy() {
        this.updateBuildTexture(-1);    // -1 = deadTexture
    }

    setBuildLevel(buildPercent) {
        this.buildLevel = Math.floor(Math.min(100, buildPercent) * Factory.buildLevelMultiplier);
        if (this.hp < Factory.minHp && buildPercent >= 100) {
            this.buildLevel = 4;    // broken state
        }
    }

    updateBuildTexture(level) {
        let spriteDetails = Factory.getSpriteDetails(this.playerID, level);
        this.sprite.texture = spriteDetails.texture;
    }

    addBuildBar(stage) {
        if (this.buildBarObject != null) {
            stage.addChild(this.buildBarObject.buildBar);
        }
    }

    removeBuildBar(stage) {
        if (this.buildBarObject != null) {
            stage.removeChild(this.buildBarObject.buildBar);
        }
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
            1: PIXI.loader.resources.factoryP1.texture,
            2: PIXI.loader.resources.factoryP2.texture
        };

        this.textures = {
            1: {
                deadTexture: this.getDeadTexture(1),
                lv1Texture: this.getLv1Texture(1),  //0%
                lv2Texture: this.getLv2Texture(1),  //33%
                lv3Texture: this.getLv3Texture(1),  //66%
                lv4Texture: this.getLv4Texture(1),  //100%
                brokenTexture: this.getBrokenTexture(1),  //broken
            },
            2: {
                deadTexture: this.getDeadTexture(2),
                lv1Texture: this.getLv1Texture(2),  //0%
                lv2Texture: this.getLv2Texture(2),  //33%
                lv3Texture: this.getLv3Texture(2),  //66%
                lv4Texture: this.getLv4Texture(2),  //100%
                brokenTexture: this.getBrokenTexture(2),  //broken
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

    static getLv4Texture(playerID) {
        let base = this.baseTextures[playerID];
        let pos = Factory.spriteSheetData.lv4Texture.pos,
            frame = Factory.spriteSheetData.frameDetails;

        let texture = new PIXI.Texture(base);
        texture.frame = new PIXI.Rectangle(pos.x, pos.y, frame.width, frame.height);

        return texture;
    }

    static getBrokenTexture(playerID) {
        let base = this.baseTextures[playerID];
        let pos = Factory.spriteSheetData.brokenTexture.pos,
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
            details.texture = this.textures[playerID].lv1Texture;   // 0%
            break;
        case 1:
            details.texture = this.textures[playerID].lv2Texture;   // 33%
            break;
        case 2:
            details.texture = this.textures[playerID].lv3Texture;   // 66%
            break;
        case 3:
            details.texture = this.textures[playerID].lv4Texture;   // 100%
            break;
        case 4:
            details.texture = this.textures[playerID].brokenTexture;   // broken state
            break;
        }

        return details;
    }
}
