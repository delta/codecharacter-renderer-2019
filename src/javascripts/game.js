import * as PIXI from 'pixi.js';
import Camera from './camera';
import TerrainElement from './state_objects/terrain';
import Soldier from './state_objects/soldier';

export default class Game {
    constructor(CAMERA_CONSTANTS) {
        this.soldiers = [];
        this.towers = [];
        this.terrain = [];
        this.frameNo = 0;

        this.camera = new Camera(CAMERA_CONSTANTS);
        this.container = document.querySelector("#renderer-container");

        this.app = new PIXI.Application({width: this.container.offsetWidth, height: this.container.offsetHeight});
        this.container.appendChild(this.app.view);

        Game.addListeners(this);
    }

    static addListeners(game) {
        let canvas = document.querySelector("canvas");
        canvas.tabIndex = 1; // Allows event listeners to work

        canvas.addEventListener("keydown", (e) => {
            switch(e.keyCode) {
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
            }
        });
    }

    // Game building functions
    buildTerrain() {
        let stateTerrain = this.stateVariable.terrain;
        let len = this.stateVariable.terrainElementSize;
        TerrainElement.setSideLength(len);

        var texture;
        for (let i = 0; i < stateTerrain.length; i++) {
            this.terrain[i] = [];
            for (let j = 0; j < stateTerrain[i].length; j++) {
                if (stateTerrain[i][j] == 'l')
                    texture = PIXI.loader.resources.land.texture;
                else
                    texture = PIXI.loader.resources.water.texture;

                this.terrain[i][j] = new TerrainElement(len*i, len*j, stateTerrain[i][j], texture);
            }
        }
    }

    buildSoldiers(soldierConstants) {
        let stateSoldiers = this.stateVariable.states[0].soldiers;
        let texture = PIXI.loader.resources.soldier.texture;
        Soldier.setMaxHP(this.stateVariable.soldierMaxHp);

        for (let i = 0; i < stateSoldiers.length; i++) {
            let soldier = stateSoldiers[i];
            // To Do - Change texture based on playerID

            this.soldiers[i] = new Soldier(soldier.x, soldier.y, soldierConstants.spriteWidth, soldierConstants.spriteHeight,
                soldier.hp, soldier.state, soldier.playerId, texture);
        }
    }

    buildMap(terrainElementLength) {
        this.mapLength = terrainElementLength * this.terrain.length;
        this.camera.zoom.min = Math.min(this.container.offsetHeight/this.mapLength, this.container.offsetWidth/this.mapLength)
    }

    // Add sprites to canvas
    addTerrain() {
        for (let row of this.terrain) {
            for (let element of row)
                element.addSprite(this.app.stage);
        }
    }

    addSoldiers() {
        for (let soldier of this.soldiers) {
            soldier.addSprite(this.app.stage);
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

    updateSoldiers() {
        let updatedSoldiers = this.stateVariable.states[this.frameNo].soldiers;
        for (let i = 0; i < this.soldiers.length; i++) {
            let soldier = updatedSoldiers[i];
            this.soldiers[i].update(soldier.hp, soldier.x, soldier.y, soldier.state);
        }
    }

    nextFrame() {
        this.frameNo += 1;
    }
}
