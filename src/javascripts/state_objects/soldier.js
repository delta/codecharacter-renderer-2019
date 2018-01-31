import * as PIXI from 'pixi.js';
import StateObject from './stateobject';

export default class Soldier extends StateObject {
    constructor(x, y, hp, state, direction, playerID, animationSpeed) {
        let spriteDetails = Soldier.getSpriteDetails(playerID, state, direction);
        let width = Soldier.displayDimensions.width,
            height = Soldier.displayDimensions.height,
            textures = spriteDetails.textures,
            isAnimated = true;

        super(x, y, width, height, textures, isAnimated, animationSpeed);
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
        this.sprite.textures = spriteDetails.textures;
        this.sprite.play();
    }

    static setMaxHP(hp) {
        this.maxHP = hp;
    }

    static setSpriteConstants(SOLDIER_SPRITE_CONSTANTS) {
        this.displayDimensions = SOLDIER_SPRITE_CONSTANTS.displayDimensions;
        this.spriteSheetData = SOLDIER_SPRITE_CONSTANTS.spriteSheetData;
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

        let pos = Soldier.spriteSheetData.idleSequence.initPositions,
            frame = Soldier.spriteSheetData.frameDetails;

        let leftTexture = new PIXI.Texture(base);
        let upTexture = new PIXI.Texture(base);
        let downTexture = new PIXI.Texture(base);
        let rightTexture = new PIXI.Texture(base);

        leftTexture.frame = new PIXI.Rectangle( pos.left.x, pos.left.y, frame.width, frame.height );
        upTexture.frame = new PIXI.Rectangle( pos.up.x, pos.up.y, frame.width, frame.height );
        downTexture.frame = new PIXI.Rectangle( pos.down.x, pos.down.y, frame.width, frame.height );
        rightTexture.frame = new PIXI.Rectangle( pos.right.x, pos.right.y, frame.width, frame.height );

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

        let frameSet = Soldier.spriteSheetData.moveSequence.frameSequence,
            pos = Soldier.spriteSheetData.moveSequence.initPositions,
            frame = Soldier.spriteSheetData.frameDetails;

        let upTextures = [],
            downTextures = [],
            leftTextures = [],
            rightTextures = [];

        // Left movement
        for (let frameNo of frameSet) {
            texture = new PIXI.Texture(base);
            texture.frame = new PIXI.Rectangle( pos.left.x + frame.jump*frameNo, pos.left.y, frame.width, frame.height );
            leftTextures.push(texture);
        }

        // Right movement
        for (let frameNo of frameSet) {
            texture = new PIXI.Texture(base);
            texture.frame = new PIXI.Rectangle( pos.right.x + frame.jump*frameNo, pos.right.y, frame.width, frame.height );
            rightTextures.push(texture);
        }

        // Down movement
        for (let frameNo of frameSet) {
            texture = new PIXI.Texture(base);
            texture.frame = new PIXI.Rectangle( pos.down.x + frame.jump*frameNo, pos.down.y, frame.width, frame.height );
            downTextures.push(texture);
        }

        // Up movement
        for (let frameNo of frameSet) {
            texture = new PIXI.Texture(base);
            texture.frame = new PIXI.Rectangle( pos.up.x + frame.jump*frameNo, pos.up.y, frame.width, frame.height );
            upTextures.push(texture);
        }

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

        let frameSet = Soldier.spriteSheetData.atkSequence.frameSequence,
            pos = Soldier.spriteSheetData.atkSequence.initPositions,
            frame = Soldier.spriteSheetData.frameDetails;

        let upTextures = [],
            downTextures = [],
            leftTextures = [],
            rightTextures = [];

        // Left Attack
        for (let frameNo of frameSet) {
            texture = new PIXI.Texture(base);
            texture.frame = new PIXI.Rectangle( pos.left.x + frame.jump*frameNo, pos.left.y, frame.width, frame.height );
            leftTextures.push(texture);
        }

        // Right Attack
        for (let frameNo of frameSet) {
            texture = new PIXI.Texture(base);
            texture.frame = new PIXI.Rectangle( pos.right.x + frame.jump*frameNo, pos.right.y, frame.width, frame.height );
            rightTextures.push(texture);
        }

        // Down Attack
        for (let frameNo of frameSet) {
            texture = new PIXI.Texture(base);
            texture.frame = new PIXI.Rectangle( pos.down.x + frame.jump*frameNo, pos.down.y, frame.width, frame.height );
            downTextures.push(texture);
        }

        // Up Attack
        for (let frameNo of frameSet) {
            texture = new PIXI.Texture(base);
            texture.frame = new PIXI.Rectangle( pos.up.x + frame.jump*frameNo, pos.up.y, frame.width, frame.height );
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

        let frameSet = Soldier.spriteSheetData.deadSequence.frameSequence,
            pos = Soldier.spriteSheetData.deadSequence.initPositions,
            frame = Soldier.spriteSheetData.frameDetails;

        let texture = null,
            deadTextures = [];

        for (let frameNo of frameSet) {
            texture = new PIXI.Texture(base);
            texture.frame = new PIXI.Rectangle( pos.x + frame.jump*frameNo, pos.y, frame.width, frame.height);
            deadTextures.push(texture);
        }

        return deadTextures;
    }

    // get sprite details for a particular soldier state
    static getSpriteDetails(playerID, soldierState, soldierDirection) {
        let details = {textures: null};

        switch (soldierState) {
        case 0:
            details.textures = this.textures[playerID].idleTextures[soldierDirection];
            break;
        case 1:
            details.textures = this.textures[playerID].moveTextures[soldierDirection];
            break;
        case 2:
            details.textures = this.textures[playerID].atkTextures[soldierDirection];
            break;
        case 3:
            details.textures = this.textures[playerID].deadTexture;
            break;
        }

        return details;
    }
}
