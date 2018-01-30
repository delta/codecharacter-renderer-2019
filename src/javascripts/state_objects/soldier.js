import * as PIXI from 'pixi.js';
import StateObject from './stateobject';

export default class Soldier extends StateObject {
    constructor(x, y, hp, state, direction, playerID) {
        let spriteDetails = Soldier.getSpriteDetails(playerID, state);
        let width = spriteDetails.dimensions.width,
            height = spriteDetails.dimensions.height,
            textures = spriteDetails.textures,
            isAnimated = true;

        super(x, y, width, height, textures, isAnimated);
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

    // Texture related methods
    static setTextures() {
        this.baseTextures = {
            1: PIXI.loader.resources.soldierP1Sheet.texture,
            2: PIXI.loader.resources.soldierP2Sheet.texture
        };

        this.textures = {
            1: {
                idleTextures: this.getIdleTextures(1),
                moveTextures: this.getMoveTextures(1),
                atkTextures: this.getAtkTextures(1),
                deadTexture: this.getDeadTexture(1)
            },
            2: {
                idleTextures: this.getIdleTextures(2),
                moveTextures: this.getMoveTextures(2),
                atkTextures: this.getAtkTextures(2),
                deadTexture: this.getDeadTexture(2)
            }
        }
    }

    static getIdleTextures(playerID) {
        var base = this.baseTextures[playerID];

        let leftTexture = new PIXI.Texture(base);
        let upTexture = new PIXI.Texture(base);
        let downTexture = new PIXI.Texture(base);
        let rightTexture = new PIXI.Texture(base);

        leftTexture.frame = new PIXI.Rectangle(0, 0, 100, 100);
        upTexture.frame = new PIXI.Rectangle(100, 0, 100, 100);
        downTexture.frame = new PIXI.Rectangle(200, 0, 100, 100);
        rightTexture.frame = new PIXI.Rectangle(300, 0, 100, 100);

        return {
            up: [upTexture, upTexture],
            down: [downTexture, downTexture],
            left: [leftTexture, leftTexture],
            right: [rightTexture, rightTexture]
        };
    }

    static getMoveTextures(playerID) {
        var base = this.baseTextures[playerID];
        let texture = null;
        let upTextures = [],
            downTextures = [],
            leftTextures = [],
            rightTextures = [];

        // Left movement
        for (let i = 0; i < 3; i++) {
            texture = new PIXI.Texture(base);
            texture.frame = new PIXI.Rectangle(100*i, 100, 100, 100);
            leftTextures.push(texture);
        }
        texture = new PIXI.Texture(base);
        texture.frame = new PIXI.Rectangle(100, 100, 100, 100);
        leftTextures.push(texture);

        // Right movement
        for (let i = 0; i < 3; i++) {
            texture = new PIXI.Texture(base);
            texture.frame = new PIXI.Rectangle(100*i, 400, 100, 100);
            rightTextures.push(texture);
        }
        texture = new PIXI.Texture(base);
        texture.frame = new PIXI.Rectangle(100, 400, 100, 100);
        rightTextures.push(texture);

        // Down movement
        for (let i = 0; i < 3; i++) {
            texture = new PIXI.Texture(base);
            texture.frame = new PIXI.Rectangle(100*i, 700, 100, 100);
            downTextures.push(texture);
        }
        texture = new PIXI.Texture(base);
        texture.frame = new PIXI.Rectangle(100, 700, 100, 100);
        downTextures.push(texture);

        // Up movement
        for (let i = 0; i < 3; i++) {
            texture = new PIXI.Texture(base);
            texture.frame = new PIXI.Rectangle(100*i, 1000, 100, 100);
            upTextures.push(texture);
        }
        texture = new PIXI.Texture(base);
        texture.frame = new PIXI.Rectangle(100, 1000, 100, 100);
        upTextures.push(texture);

        return {
            up: upTextures,
            down: downTextures,
            left: leftTextures,
            right: rightTextures
        };
    }

    static getAtkTextures(playerID) {
        var base = this.baseTextures[playerID];
        let texture = null;
        let upTextures = [],
            downTextures = [],
            leftTextures = [],
            rightTextures = [];

        // Left Attack
        for (let i = 0; i < 4; i++) {
            texture = new PIXI.Texture(base);
            texture.frame = new PIXI.Rectangle(100*i, 200, 100, 100);
            leftTextures.push(texture);
        }
        for (let i = 2; i > 1; i--) {
            texture = new PIXI.Texture(base);
            texture.frame = new PIXI.Rectangle(100*i, 200, 100, 100);
            leftTextures.push(texture);
        }

        // Right Attack
        for (let i = 0; i < 4; i++) {
            texture = new PIXI.Texture(base);
            texture.frame = new PIXI.Rectangle(100*i, 500, 100, 100);
            rightTextures.push(texture);
        }
        for (let i = 2; i > 1; i--) {
            texture = new PIXI.Texture(base);
            texture.frame = new PIXI.Rectangle(100*i, 500, 100, 100);
            rightTextures.push(texture);
        }

        // Down Attack
        for (let i = 0; i < 4; i++) {
            texture = new PIXI.Texture(base);
            texture.frame = new PIXI.Rectangle(100*i, 800, 100, 100);
            downTextures.push(texture);
        }
        for (let i = 2; i > 1; i--) {
            texture = new PIXI.Texture(base);
            texture.frame = new PIXI.Rectangle(100*i, 800, 100, 100);
            downTextures.push(texture);
        }

        // Up Attack
        for (let i = 0; i < 4; i++) {
            texture = new PIXI.Texture(base);
            texture.frame = new PIXI.Rectangle(100*i, 1100, 100, 100);
            upTextures.push(texture);
        }
        for (let i = 2; i > 1; i--) {
            texture = new PIXI.Texture(base);
            texture.frame = new PIXI.Rectangle(100*i, 1100, 100, 100);
            upTextures.push(texture);
        }

        return {
            up: upTextures,
            down: downTextures,
            left: leftTextures,
            right: rightTextures
        };
    }

    static getDeadTexture(playerID) {
        var base = this.baseTextures[playerID];
        let texture = null,
            deadTextures = [];

        for (let i = 0; i < 4; i++) {
            texture = new PIXI.Texture(base);
            texture.frame = new PIXI.Rectangle(100*i, 300, 100, 93);
            deadTextures.push(texture);
        }
        for (let i = 0; i < 6; i++) {
            texture = new PIXI.Texture(base);
            texture.frame = new PIXI.Rectangle(300, 300, 100, 93);
            deadTextures.push(texture);
        }

        return deadTextures;
    }

    static getSpriteDetails(playerID, soldierState, soldierDirection) {
        let details = {
            textures: this.textures[playerID].moveTextures.left,
            dimensions: this.spriteDimensions.idleSprite
        };

        return details;
    }
}
