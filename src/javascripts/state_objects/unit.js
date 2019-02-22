import * as PIXI from 'pixi.js';
import Actor from './actor';

export default class Unit extends Actor {
    constructor(x, y, id, direction, hp, state, playerID, animationSpeed, unitType, maxHP) {
        let spriteDetails = Unit.getSpriteDetails(playerID, state, direction, unitType);
        let width = Unit.displayDimensions[unitType].width,
            height = Unit.displayDimensions[unitType].height,
            textures = spriteDetails.textures,
            isAnimated = true;

        super(x, y, id, playerID, hp, state, width, height, textures, maxHP, isAnimated, animationSpeed);
        this.setSpriteAnchors();
        this.direction = direction;
    }

    updatePosition(x, y) {
        this.setSpritePosition(x, y);
        super.updateBarPosition();  // change HPBar position
    }

    updateState(state, direction, unitType) {
        this.state = state;
        this.direction = direction;

        let spriteDetails = Unit.getSpriteDetails(this.playerID, this.state, this.direction, unitType);
        this.sprite.textures = spriteDetails.textures;
        this.sprite.play();
    }

    static initializeSpriteConstants () {
        this.displayDimensions = [];
        this.spriteSheetData = [];
    }

    static setSpriteConstants(UNIT_SPRITE_CONSTANTS, unitType) {
        this.displayDimensions[unitType] = UNIT_SPRITE_CONSTANTS.displayDimensions;
        this.spriteSheetData[unitType] = UNIT_SPRITE_CONSTANTS.spriteSheetData;
    }

    // Texture related methods
    static setTextures(unitTypeConstant) {
        let unitTypeSoldier = unitTypeConstant.soldier,
            unitTypeVillager = unitTypeConstant.villager;

        this.baseTextures = {};
        this.baseTextures[unitTypeSoldier] = {
            1: PIXI.loader.resources.soldierP1Sheet.texture,
            2: PIXI.loader.resources.soldierP2Sheet.texture
        };
        this.baseTextures[unitTypeVillager] = {
            1: PIXI.loader.resources.villagerP1Sheet.texture,
            2: PIXI.loader.resources.villagerP2Sheet.texture
        };

        this.textures = {
            soldierTexture: {
                1: {
                    idleTextures: this.getIdleTextures(1,unitTypeSoldier),
                    moveTextures: this.getMoveTextures(1,unitTypeSoldier),
                    atkTextures: this.getAtkTextures(1,unitTypeSoldier),
                    deadTexture: this.getDeadTexture(1,unitTypeSoldier)
                },
                2: {
                    idleTextures: this.getIdleTextures(2,unitTypeSoldier),
                    moveTextures: this.getMoveTextures(2,unitTypeSoldier),
                    atkTextures: this.getAtkTextures(2,unitTypeSoldier),
                    deadTexture: this.getDeadTexture(2,unitTypeSoldier)
                }
            },
            villagerTexture: {
                1: {
                    idleTextures: this.getIdleTextures(1,unitTypeVillager),
                    moveTextures: this.getMoveTextures(1,unitTypeVillager),
                    atkTextures: this.getAtkTextures(1,unitTypeVillager),
                    mineTextures: this.getMineTextures(1,unitTypeVillager),
                    buildTextures: this.getBuildTextures(1,unitTypeVillager),
                    deadTexture: this.getDeadTexture(1,unitTypeVillager)
                },
                2: {
                    idleTextures: this.getIdleTextures(2,unitTypeVillager),
                    moveTextures: this.getMoveTextures(2,unitTypeVillager),
                    atkTextures: this.getAtkTextures(2,unitTypeVillager),
                    mineTextures: this.getMineTextures(2,unitTypeVillager),
                    buildTextures: this.getBuildTextures(2,unitTypeVillager),
                    deadTexture: this.getDeadTexture(2,unitTypeVillager)
                }
            }
        }
    }

    static getIdleTextures(playerID, unitType) {
        var base = this.baseTextures[unitType][playerID];

        let pos = Unit.spriteSheetData[unitType].idleSequence.initPositions,
            frame = Unit.spriteSheetData[unitType].frameDetails;

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

    static getMoveTextures(playerID, unitType) {
        var base = this.baseTextures[unitType][playerID];
        let texture = null;

        let frameSet = Unit.spriteSheetData[unitType].moveSequence.frameSequence,
            pos = Unit.spriteSheetData[unitType].moveSequence.initPositions,
            frame = Unit.spriteSheetData[unitType].frameDetails;

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

    static getAtkTextures(playerID, unitType) {
        var base = this.baseTextures[unitType][playerID];
        let texture = null;

        let frameSet = Unit.spriteSheetData[unitType].atkSequence.frameSequence,
            pos = Unit.spriteSheetData[unitType].atkSequence.initPositions,
            frame = Unit.spriteSheetData[unitType].frameDetails;

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

    // mine action meant for villager unit
    static getMineTextures(playerID, unitType) {
        var base = this.baseTextures[unitType][playerID];
        let texture = null;

        let frameSet = Unit.spriteSheetData[unitType].mineSequence.frameSequence,
            pos = Unit.spriteSheetData[unitType].mineSequence.initPositions,
            frame = Unit.spriteSheetData[unitType].frameDetails;

        let upTextures = [],
            downTextures = [],
            leftTextures = [],
            rightTextures = [];

        // Left Mine
        for (let frameNo of frameSet) {
            texture = new PIXI.Texture(base);
            texture.frame = new PIXI.Rectangle( pos.left.x + frame.jump*frameNo, pos.left.y, frame.width, frame.height );
            leftTextures.push(texture);
        }

        // Right Mine
        for (let frameNo of frameSet) {
            texture = new PIXI.Texture(base);
            texture.frame = new PIXI.Rectangle( pos.right.x + frame.jump*frameNo, pos.right.y, frame.width, frame.height );
            rightTextures.push(texture);
        }

        // Down Mine
        for (let frameNo of frameSet) {
            texture = new PIXI.Texture(base);
            texture.frame = new PIXI.Rectangle( pos.down.x + frame.jump*frameNo, pos.down.y, frame.width, frame.height );
            downTextures.push(texture);
        }

        // Up Mine
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

    // build action meant for villager
    static getBuildTextures(playerID, unitType) {
        var base = this.baseTextures[unitType][playerID];
        let texture = null;

        let frameSet = Unit.spriteSheetData[unitType].buildSequence.frameSequence,
            pos = Unit.spriteSheetData[unitType].buildSequence.initPositions,
            frame = Unit.spriteSheetData[unitType].frameDetails;

        let upTextures = [],
            downTextures = [],
            leftTextures = [],
            rightTextures = [];

        // Left Build
        for (let frameNo of frameSet) {
            texture = new PIXI.Texture(base);
            texture.frame = new PIXI.Rectangle( pos.left.x + frame.jump*frameNo, pos.left.y, frame.width, frame.height );
            leftTextures.push(texture);
        }

        // Right Build
        for (let frameNo of frameSet) {
            texture = new PIXI.Texture(base);
            texture.frame = new PIXI.Rectangle( pos.right.x + frame.jump*frameNo, pos.right.y, frame.width, frame.height );
            rightTextures.push(texture);
        }

        // Down Build
        for (let frameNo of frameSet) {
            texture = new PIXI.Texture(base);
            texture.frame = new PIXI.Rectangle( pos.down.x + frame.jump*frameNo, pos.down.y, frame.width, frame.height );
            downTextures.push(texture);
        }

        // Up Build
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

    static getDeadTexture(playerID, unitType) {
        var base = this.baseTextures[unitType][playerID];

        let frameSet = Unit.spriteSheetData[unitType].deadSequence.frameSequence,
            pos = Unit.spriteSheetData[unitType].deadSequence.initPositions,
            frame = Unit.spriteSheetData[unitType].frameDetails;

        let texture = null,
            deadTextures = [];

        for (let frameNo of frameSet) {
            texture = new PIXI.Texture(base);
            texture.frame = new PIXI.Rectangle( pos.x + frame.jump*frameNo, pos.y, frame.width, frame.height);
            deadTextures.push(texture);
        }

        return deadTextures;
    }

    // get sprite details for a particular unit state
    static getSpriteDetails(playerID, unitState, unitDirection, unitType) {
        let details = {textures: null};

        if (unitType == 0) {    // soldiers constant (check constantsjs)
            switch (unitState) {
            case 0:     // idle
                details.textures = this.textures.soldierTexture[playerID].idleTextures[unitDirection];
                break;
            case 1:     // move
                details.textures = this.textures.soldierTexture[playerID].moveTextures[unitDirection];
                break;
            case 2:     // attack
                details.textures = this.textures.soldierTexture[playerID].atkTextures[unitDirection];
                break;
            case 3:     // dead
                details.textures = this.textures.soldierTexture[playerID].deadTexture;
                break;
            }
        } else {    // villagers constant (check constantsjs)
            switch (unitState) {
            case 0:     // idle
                details.textures = this.textures.villagerTexture[playerID].idleTextures[unitDirection];
                break;
            case 1:     // move
                details.textures = this.textures.villagerTexture[playerID].moveTextures[unitDirection];
                break;
            case 2:     // attack
                details.textures = this.textures.villagerTexture[playerID].atkTextures[unitDirection];
                break;
            case 3:     // mine (temp textures)
                details.textures = this.textures.villagerTexture[playerID].mineTextures[unitDirection];
                break;
            case 4:     // build (temp textures)
                details.textures = this.textures.villagerTexture[playerID].buildTextures[unitDirection];
                break;
            case 5:     // dead
                details.textures = this.textures.villagerTexture[playerID].deadTexture;
                break;
            }
        }

        return details;
    }
}
