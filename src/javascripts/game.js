import * as PIXI from 'pixi.js';
import Camera from './camera';

export default class Game {
    constructor(CAMERA_CONSTANTS) {
        this.soldiers = [];
        this.towers = [];
        this.terrain = [];

        this.camera = new Camera(CAMERA_CONSTANTS);
        Game.addListeners(this);

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.app = new PIXI.Application({width: this.width, height: this.height});
        document.body.appendChild(this.app.view);
    }

    static addListeners(game) {
        document.body.addEventListener("keydown", function (e) {
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

        document.body.addEventListener("keyup", function (e) {
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

    buildMap(terrainElementLength) {
        this.mapLength = terrainElementLength * this.terrain.length;
    }

    autoResize() {
        this.width = window.innerWidth;         // To be changed
        this.height = window.innerHeight;       // To be changed

        if (this.app.renderer.width != this.width || this.app.renderer.height != this.height)
            this.app.renderer.resize(this.width, this.height);
    }

    updateCamera() {
        this.camera.updatePosition();
        this.camera.restrictPosition(this.mapLength, this.width, this.height);
        this.camera.updateZoom(this.width, this.height);
        this.camera.restrictZoom(this.mapLength, this.width, this.height);

        const zoomVal = this.camera.zoom.value;
        this.app.stage.setTransform(zoomVal * this.camera.actualPos.x, zoomVal * this.camera.actualPos.y, zoomVal, zoomVal);
    }
}
