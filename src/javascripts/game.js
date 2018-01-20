import * as PIXI from 'pixi.js';
import CONSTANTS from './constants';
import Camera from './camera';
import TerrainElement from './state_objects/terrain';
import Soldier from './state_objects/soldier';
import Tower from './state_objects/tower';

export default class Game {
    constructor() {
        this.soldiers = [];
        this.towers = {};
        this.terrain = [];
        this.playerMoney = [];
        this.frameNo = 0;

        this.camera = new Camera(CONSTANTS.camera);
        this.container = document.querySelector("#renderer-container");

        this.app = new PIXI.Application({width: this.container.offsetWidth, height: this.container.offsetHeight});
        this.container.appendChild(this.app.view);
        this.state = "play";

        Game.addListeners(this);
    }

    static addListeners(game) {
        let canvas = document.querySelector("canvas");
        canvas.tabIndex = 1; // Allows event listeners to work

        canvas.addEventListener("keydown", (e) => {
            switch (e.keyCode) {
            case 37:
                game.camera.commands.move.left = true;
                break;
            case 38:
                game.camera.commands.move.up = true;
                break;
            case 39:
                game.camera.commands.move.right = true;
                break;
            case 40:
                game.camera.commands.move.down = true;
                break;
            case 187:
                game.camera.commands.zoom.in = true;
                break;
            case 189:
                game.camera.commands.zoom.out = true;
                break;
            }
        });

        canvas.addEventListener("keyup", (e) => {
            switch(e.keyCode) {
            case 37:
                game.camera.commands.move.left = false;
                break;
            case 38:
                game.camera.commands.move.up = false;
                break;
            case 39:
                game.camera.commands.move.right = false;
                break;
            case 40:
                game.camera.commands.move.down = false;
                break;
            case 187:
                game.camera.commands.zoom.in = false;
                break;
            case 189:
                game.camera.commands.zoom.out = false;
                break;
            case 80:
                if (game.state != "stop")
                    game.state = (game.state == "play")? "pause" : "play";
                break;
            }
        });
    }

    buildStateClasses() {
        // Set Constants
        TerrainElement.setSideLength(this.stateVariable.terrainElementSize);
        Soldier.setMaxHP(this.stateVariable.soldierMaxHp);
        Tower.setMaxHPs(this.stateVariable.tower.maxHps);
        Tower.setRanges(this.stateVariable.tower.ranges);

        // Set Sprite related constants
        Soldier.setSpriteConstants(CONSTANTS.soldiers);
        Tower.setSpriteConstants(CONSTANTS.towers);
        TerrainElement.setOverlayOpacity(CONSTANTS.terrain.overlay);

        // Add Textures
        let soldierTextures = this.getSoldierTextures();
        Soldier.setTextures(soldierTextures.p1Textures, soldierTextures.p2Textures);

        let towerTextures = this.getTowerTextures();
        Tower.setTextures(towerTextures.p1Textures, towerTextures.p2Textures);

        let terrainTextures = this.getTerrainTextures();
        TerrainElement.setTextures(terrainTextures);
    }

    getSoldierTextures() {
        return {
            p1Textures: {
                idleTexture: PIXI.loader.resources.soldierP1.texture,
                moveTexture: PIXI.loader.resources.soldierP1.texture,
                atkTexture: PIXI.loader.resources.soldierP1Atk.texture,
                deadTexture: PIXI.loader.resources.soldierP1.texture
            },
            p2Textures: {
                idleTexture: PIXI.loader.resources.soldierP2.texture,
                moveTexture: PIXI.loader.resources.soldierP2.texture,
                atkTexture: PIXI.loader.resources.soldierP2Atk.texture,
                deadTexture: PIXI.loader.resources.soldierP2.texture
            }
        };
    }

    getTowerTextures() {
        return {
            p1Textures: {
                deadTexture: PIXI.loader.resources.towerP1L1.texture,
                lv1Texture: PIXI.loader.resources.towerP1L1.texture,
                lv2Texture: PIXI.loader.resources.towerP1L1.texture,
                lv3Texture: PIXI.loader.resources.towerP1L1.texture
            },
            p2Textures: {
                deadTexture: PIXI.loader.resources.towerP2L1.texture,
                lv1Texture: PIXI.loader.resources.towerP2L1.texture,
                lv2Texture: PIXI.loader.resources.towerP2L1.texture,
                lv3Texture: PIXI.loader.resources.towerP2L1.texture
            }
        };
    }

    getTerrainTextures() {
        return {
            landTexture: PIXI.loader.resources.land.texture
        };
    }


    // Game building functions
    buildTerrain() {
        let terrainLength = this.stateVariable.terrainLength;
        let len = TerrainElement.sideLength;

        for (let i = 0; i < terrainLength; i++) {
            this.terrain[i] = [];
            for (let j = 0; j < terrainLength; j++) {
                this.terrain[i][j] = new TerrainElement(len*i, len*j);
            }
        }
    }

    buildSoldiers() {
        let stateSoldiers = this.getCurrentFrame().soldiers;  // Current Frame Number is 0

        for (let i = 0; i < stateSoldiers.length; i++) {
            let soldier = stateSoldiers[i];
            this.soldiers[i] = new Soldier(soldier.x, soldier.y, soldier.hp, soldier.state, soldier.playerId);
        }
    }

    buildTowers() {
        let stateTowers = this.getCurrentFrame().towers;

        for (let towerID in stateTowers) {
            if ( isNaN(parseInt(towerID)) )    // Create New Towers only for actual tower objects
                continue;

            let tower = stateTowers[towerID];
            this.towers[towerID] = new Tower(tower.x, tower.y, tower.playerId, tower.hp, tower.towerLevel, tower.isBase);

            // Add ownership details
            this.updateTerrain(tower);
        }
    }

    buildMap() {
        this.mapLength = TerrainElement.sideLength * this.terrain.length;
        this.camera.zoom.min = Math.min(this.container.offsetHeight/this.mapLength, this.container.offsetWidth/this.mapLength)
    }

    addMoney() {
        this.playerMoney = this.getCurrentFrame().money.slice();
    }


    // Add sprites to canvas
    addTerrain() {
        for (let row of this.terrain) {
            for (let element of row) {
                element.addSprite(this.app.stage);
                element.overlay.addPrimitive(this.app.stage);
            }
        }
    }

    addSoldiers() {
        for (let soldier of this.soldiers) {
            soldier.addSprite(this.app.stage);
        }
    }

    addTowers() {
        for (let towerID in this.towers) {
            let tower = this.towers[towerID];
            tower.addSprite(this.app.stage);
        }
    }


    // Camera Related Methods
    autoResize() {
        let containerWidth = this.container.offsetWidth,
            containerHeight = this.container.offsetHeight,
            mapLength = this.mapLength;

        if (this.app.renderer.width != containerWidth || this.app.renderer.height != containerHeight) {
            this.app.renderer.resize(containerWidth, containerHeight);
            this.camera.zoom.min = Math.min(containerHeight/mapLength, containerWidth/mapLength);
        }
    }

    updateCamera() {
        let containerWidth = this.container.offsetWidth,
            containerHeight = this.container.offsetHeight;

        this.camera.updatePosition();
        this.camera.restrictPosition(this.mapLength, containerWidth, containerHeight);
        this.camera.updateZoom(this.mapLength, containerWidth, containerHeight);

        const zoomVal = this.camera.zoom.value;
        this.app.stage.setTransform(zoomVal * this.camera.actualPos.x, zoomVal * this.camera.actualPos.y, zoomVal, zoomVal);
    }


    // Game Objects update
    updateSoldiers() {
        let currentSoldiers = this.getCurrentFrame().soldiers;

        for (let i = 0; i < this.soldiers.length; i++) {
            let soldier = currentSoldiers[i];
            this.soldiers[i].updatePosition(soldier.x, soldier.y);
            this.soldiers[i].updateHP(soldier.hp);

            if (soldier.stateHasChanged)
                this.soldiers[i].updateState(soldier.state);
        }
    }

    updateTowers() {
        let currentTowers = this.getCurrentFrame().towers,
            prevTowers = this.getPreviousFrame().towers;

        if (!currentTowers.hasChanged) {
            return;
        }

        // If user has skipped to another state, call buildTowers and addTowers on the previous frame and continue.

        for (let towerID in currentTowers) {
            if ( isNaN(parseInt(towerID)) )    // Update Towers only for actual tower objects
                continue;

            let tower = currentTowers[towerID];
            if (tower.updateMethod == "none")
                continue;

            if (tower.updateMethod == "create") {
                this.towers[towerID] = new Tower(tower.x, tower.y, tower.playerId, tower.hp, tower.towerLevel, tower.isBase);
                this.towers[towerID].addSprite(this.app.stage);
            } else if (tower.updateMethod == "destroy") {

                if (tower.framesLeft == CONSTANTS.towers.maxDeathFrames) {
                    this.towers[towerID].destroy();
                } else if (tower.framesLeft == 0) {
                    this.towers[towerID].removeSprite(this.app.stage);
                    delete this.towers[towerID];
                }

            } else if (tower.updateMethod == "update") {
                this.towers[towerID].update(tower.hp, tower.towerLevel);
            }

            // Update ownership details
            if (tower.levelHasChanged)
                this.updateTerrain(tower);
        }
    }

    updateTerrain(tower) {
        let towerLevel = tower.towerLevel;
        let towerLocation = {
            x: Number.parseInt(tower.x / TerrainElement.sideLength),
            y: Number.parseInt(tower.y / TerrainElement.sideLength)
        };

        let blocksCovered = {
            x: {
                start: (towerLocation.x - towerLevel >= 0) ? (towerLocation.x - towerLevel) : 0,
                end: (towerLocation.x + towerLevel < this.terrain.length) ? (towerLocation.x + towerLevel) : 0
            },
            y: {
                start: (towerLocation.y - towerLevel >= 0) ? (towerLocation.y - towerLevel) : 0,
                end: (towerLocation.y + towerLevel < this.terrain.length) ? (towerLocation.y + towerLevel) : 0
            },
        };

        for (let i = blocksCovered.x.start; i <= blocksCovered.x.end; i++) {
            for (let j = blocksCovered.y.start; j <= blocksCovered.y.end; j++) {
                if (tower.updateMethod == "destroy") {
                    this.terrain[i][j].removeOwnership(tower.playerId + 1, tower.id);
                } else {
                    this.terrain[i][j].addOwnership(tower.playerId + 1, tower.id);
                }
            }
        }
    }

    updateMoney() {
        let money = this.getCurrentFrame().money;
        this.playerMoney[0] = money[0];
        this.playerMoney[1] = money[1];
    }


    // Frame related methods
    previousFrame() {
        this.frameNo -= 1;
    }
    nextFrame() {
        this.frameNo += 1;
    }

    getPreviousFrame() {
        return this.stateVariable.states[this.frameNo - 1];
    }
    getCurrentFrame() {
        return this.stateVariable.states[this.frameNo];
    }
}
