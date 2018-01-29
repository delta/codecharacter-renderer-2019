import * as PIXI from 'pixi.js';
import StateObject from './stateobject';

export default class Soldier extends StateObject {
    constructor(x, y, hp, state, direction, playerID) {
        let spriteDetails = Soldier.getSpriteDetails(playerID, state);
        let width = spriteDetails.dimensions.width,
            height = spriteDetails.dimensions.height,
            texture = spriteDetails.texture;

        super(x, y, width, height, texture);
        this.setSpriteAnchors(0.5, 1);

        this.hp = hp;
        this.state = state;
        this.direction = direction;
        this.playerID = playerID;
    }

    updatePosition(x, y) {
        this.setSpritePosition(x, y);
    }

    updateHP(hp) {
        this.hp = hp;
    }

    updateState(state, direction) {
        this.state = state;
        this.direction = direction;

        let spriteDetails = Soldier.getSpriteDetails(this.playerID, this.state, this.direction);
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

    static setTextures() {
        this.textures = {
            1: {
                idleTexture: PIXI.loader.resources.soldierP1.texture,
                moveTexture: PIXI.loader.resources.soldierP1.texture,
                atkTexture: PIXI.loader.resources.soldierP1Atk.texture,
                deadTexture: PIXI.loader.resources.soldierP1.texture
            },
            2: {
                idleTexture: PIXI.loader.resources.soldierP2.texture,
                moveTexture: PIXI.loader.resources.soldierP2.texture,
                atkTexture: PIXI.loader.resources.soldierP2Atk.texture,
                deadTexture: PIXI.loader.resources.soldierP2.texture
            }
        };
    }

    static getSpriteDetails(playerID, soldierState, soldierDirection) {
        let details = {texture: null, dimensions: null};

        switch (soldierState) {
        case 0:
            details.texture = this.textures[playerID].idleTexture;
            details.dimensions = this.spriteDimensions.idleSprite;
            break;
        case 1:
            details.texture = this.textures[playerID].moveTexture;
            details.dimensions = this.spriteDimensions.moveSprite;
            break;
        case 2:
            details.texture = this.textures[playerID].atkTexture;
            details.dimensions = this.spriteDimensions.atkSprite;
            break;
        case 3:
            details.texture = this.textures[playerID].deadTexture;
            details.dimensions = this.spriteDimensions.deadSprite;
            break;
        }

        return details;
    }
}
