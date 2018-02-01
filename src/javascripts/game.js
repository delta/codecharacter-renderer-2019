import * as PIXI from 'pixi.js';
import CONSTANTS from './constants/constants.js';
import Camera from './camera';
import StateObject from './state_objects/stateobject'
import TerrainElement from './state_objects/terrain';
import Soldier from './state_objects/soldier';
import Tower from './state_objects/tower';
import pauseAsset from "../assets/pause.svg";
import playAsset from "../assets/play.svg";

export default class Game {
    constructor() {
        this.soldiers = [];
        this.towers = {};
        this.terrain = [];
        this.mapLength = 0;
        this.playerMoney = [];

        this.frameNo = 0;
        this.timeCount = 0;

        this.playerID = 1;

        this.speed = {};
        this.speed.pointer = CONSTANTS.gameSpeed.default;
        this.speed.value =  CONSTANTS.gameSpeed.actualValues[this.speed.pointer];

        this.errorMap = {};
        this.logFunction = () => {};

        this.playerLogs = {1: [], 2: []};

        this.camera = new Camera(CONSTANTS.camera);
        this.container = document.querySelector("#renderer-container");

        this.app = new PIXI.Application({width: this.container.offsetWidth, height: this.container.offsetHeight});
        this.container.appendChild(this.app.view);
        this.state = "play";

        Game.addListeners(this);
    }

    setStateVariable(stateVar) {
        this.stateVariable = stateVar;
        return this;
    }

    setLogFunction(fn) {
        this.logFunction = fn;
        return this;
    }

    setPlayerID(id) {
        this.playerID = id;
        return this;
    }

    setPlayerLogs(player1Log, player2Log) {
        // Initialize logs to "" if undefined
        let logs = [player1Log, player2Log].map(log => log || "");

        // Set the log delimiter, if there exists atleast one log to read from.
        // The delimiter is the first line of the log, for ex. ">>>LOG START<<<"
        let delim = "";
        for (let playerLog of logs) {
            delim = playerLog ? playerLog.split('\n', 1)[0] : "";
        }

        // Split each playerLog as a list of each turn's logs
        // Remove the first split, it'll always just be an empty string
        logs = logs.map(log => log.split(delim).slice(1));

        // Set the logs in state
        this.playerLogs = {
            1: logs[0],
            2: logs[1]
        };

        return this;
    }

    static addListeners(game) {
        let canvas = document.querySelector("canvas"),
            pauseIcon = document.querySelector("#pause-icon"),
            slowDownIcon = document.querySelector("#slow-down-icon"),
            speedUpIcon = document.querySelector("#speed-up-icon");

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
                game.toggleState();
                break;
            case 219:
                game.decreaseSpeed();
                break;
            case 221:
                game.increaseSpeed();
                break;
            }
        });

        pauseIcon.addEventListener('click', () => {
            game.toggleState();
        });

        slowDownIcon.addEventListener('click', () => {
            game.decreaseSpeed();
        });

        speedUpIcon.addEventListener('click', () => {
            game.increaseSpeed();
        });
    }

    buildStateClasses() {
        // Create TerrainElement Ownership Object
        TerrainElement.createOwnershipObject();

        // Set Constants
        StateObject.setSpriteAnchors(CONSTANTS.spriteConstants.spriteAnchors)
        TerrainElement.setSideLength(this.stateVariable.terrainElementSize);
        Soldier.setMaxHP(this.stateVariable.soldierMaxHp);
        Tower.setMaxHPs(this.stateVariable.tower.maxHps);
        Tower.setRanges(this.stateVariable.tower.ranges);

        // Set Sprite related constants
        Soldier.setSpriteConstants(CONSTANTS.spriteConstants.soldierSprites);
        Tower.setSpriteConstants(CONSTANTS.spriteConstants.towerSprites);
        TerrainElement.setOverlayConstants(CONSTANTS.terrain.overlay);

        // Add Textures
        Soldier.setTextures();
        Tower.setTextures();
        TerrainElement.setTextures();

        return this;
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

        return this;
    }

    buildSoldiers() {
        let stateSoldiers = this.getCurrentFrame().soldiers;  // Current Frame Number is 0

        let animationSpeed = CONSTANTS.spriteConstants.soldierSprites.animationSpeed.values[this.speed.pointer];
        for (let i = 0; i < stateSoldiers.length; i++) {
            let soldier = stateSoldiers[i];
            this.soldiers[i] = new Soldier(
                soldier.x, soldier.y, soldier.hp, soldier.state, soldier.direction, soldier.playerId, animationSpeed
            );
        }

        return this;
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

        return this;
    }

    buildMap() {
        this.mapLength = TerrainElement.sideLength * this.terrain.length;
        this.camera.zoom.min = Math.min(this.container.offsetHeight/this.mapLength, this.container.offsetWidth/this.mapLength);

        return this;
    }

    buildErrorMap() {
        this.errorMap = this.stateVariable.errorMap;
        return this;
    }

    buildMoney() {
        this.playerMoney = this.getCurrentFrame().money.slice();
        let moneyValDiv = document.querySelector("#money-value");

        moneyValDiv.innerHTML = this.playerMoney[this.playerID - 1];
        (this.playerID === 1) ? moneyValDiv.classList.add("p1-color") : moneyValDiv.classList.add("p2-color");

        return this;
    }

    buildScores() {
        let playerScoreDiv = (this.playerID === 1) ?
            document.querySelector("#p1-score") :
            document.querySelector("#p2-score") ;

        playerScoreDiv.classList.add("highlight");

        return this;
    }

    buildSpeedDiv() {
        let speedValDiv = document.querySelector("#speed-value");
        speedValDiv.innerHTML = "1.0";
        speedValDiv.classList.remove("extreme");
        return this;
    }


    // Add sprites to canvas
    addTerrain() {
        for (let row of this.terrain) {
            for (let element of row) {
                element.addSprite(this.app.stage);
                element.overlay.addPrimitive(this.app.stage);
            }
        }

        return this;
    }

    addSoldiers() {
        for (let soldier of this.soldiers) {
            soldier.addSprite(this.app.stage);
        }

        return this;
    }

    addTowers() {
        for (let towerID in this.towers) {
            let tower = this.towers[towerID];
            tower.addSprite(this.app.stage);
        }

        return this;
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

        return this;
    }

    updateCamera() {
        let containerWidth = this.container.offsetWidth,
            containerHeight = this.container.offsetHeight;

        this.camera.updatePosition();
        this.camera.restrictPosition(this.mapLength, containerWidth, containerHeight);
        this.camera.updateZoom(this.mapLength, containerWidth, containerHeight);

        const zoomVal = this.camera.zoom.value;
        this.app.stage.setTransform(zoomVal * this.camera.actualPos.x, zoomVal * this.camera.actualPos.y, zoomVal, zoomVal);

        return this;
    }


    // Game Objects update
    updateSoldiers() {
        let currentSoldiers = this.getCurrentFrame().soldiers;

        for (let i = 0; i < this.soldiers.length; i++) {
            let soldier = currentSoldiers[i];
            this.soldiers[i].updatePosition(soldier.x, soldier.y);
            this.soldiers[i].updateHP(soldier.hp);

            if (soldier.stateHasChanged) {
                this.soldiers[i].updateState(soldier.state, soldier.direction);
            }
        }

        return this;
    }

    updateTowers() {
        let currentTowers = this.getCurrentFrame().towers;

        if (!currentTowers.hasChanged) {
            return this;
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

        return this;
    }

    updateTerrain(tower) {
        let towerLevel = tower.towerLevel;
        let towerRange = this.stateVariable.tower.ranges[towerLevel - 1];
        let towerLocation = {
            x: Number.parseInt(tower.x / TerrainElement.sideLength),
            y: Number.parseInt(tower.y / TerrainElement.sideLength)
        };

        let blocksCovered = {
            x: {
                start: (towerLocation.x - towerRange >= 0) ? (towerLocation.x - towerRange) : 0,
                end: (towerLocation.x + towerRange < this.terrain.length) ? (towerLocation.x + towerRange) : this.terrain.length - 1
            },
            y: {
                start: (towerLocation.y - towerRange >= 0) ? (towerLocation.y - towerRange) : 0,
                end: (towerLocation.y + towerRange < this.terrain.length) ? (towerLocation.y + towerRange) : this.terrain.length - 1
            },
        };

        for (let i = blocksCovered.x.start; i <= blocksCovered.x.end; i++) {
            for (let j = blocksCovered.y.start; j <= blocksCovered.y.end; j++) {
                if (tower.updateMethod == "destroy") {
                    this.terrain[i][j].removeOwnership(tower.playerId, tower.id);
                } else {
                    this.terrain[i][j].addOwnership(tower.playerId, tower.id);
                }
            }
        }

        this.updateScore(TerrainElement.getOwnership());
    }

    updateScore(ownership) {
        document.querySelector("#p1-score").innerHTML = ` ${ownership[1]}`;
        document.querySelector("#p2-score").innerHTML = ` ${ownership[2]}`;
    }

    updateMoney() {
        let money = this.getCurrentFrame().money;
        this.playerMoney[0] = money[0];
        this.playerMoney[1] = money[1];
        document.querySelector("#money-value").innerHTML = this.playerMoney[this.playerID - 1];

        return this;
    }

    logErrors() {
        let currErrors = this.getCurrentFrame().errors;

        // If the current frame has errors, iterate through them
        if (currErrors !== undefined) {

            // If the player has errors, iterate through them
            if (JSON.stringify(currErrors[this.playerID - 1])
                !== JSON.stringify({})) {

                for (let errorCode of currErrors[this.playerID - 1].errors) {
                    // Log the current error code's corresponding string
                    this.logFunction(this.errorMap[errorCode]);
                }
            }
        }
        return this;
    }

    logPlayerLogs() {
        // Read the current player's current turn's logs (if any), and write them
        let currentTurnLogs
            = this.playerLogs[this.playerID][this.frameNo];
        if (currentTurnLogs) {
            this.logFunction(currentTurnLogs);
        }

        return this;
    }

    // UI Object methods
    toggleState() {
        if (this.state != "stop") {
            let pauseIcon = document.querySelector("#pause-icon");
            if (this.state == "play") {
                this.state = "pause";
                pauseIcon.src = playAsset;

                // Pause Animations
                for (let soldier of this.soldiers) {
                    soldier.pauseAnimation();
                }
            } else {
                this.state = "play";
                pauseIcon.src = pauseAsset;

                // Resume Animations
                for (let soldier of this.soldiers) {
                    soldier.playAnimation();
                }
            }


        }
    }

    end() {
        this.state = "stop";

        // Stop Animations
        for (let soldier of this.soldiers) {
            soldier.pauseAnimation();
        }
    }

    increaseSpeed() {
        if (this.speed.pointer < CONSTANTS.gameSpeed.actualValues.length - 1) {
            this.speed.pointer += 1;
            this.speed.value = CONSTANTS.gameSpeed.actualValues[this.speed.pointer];
            this.updateSpeedDisplay();

            let speed = CONSTANTS.spriteConstants.soldierSprites.animationSpeed.values[this.speed.pointer];
            for (let soldier of this.soldiers) {
                soldier.setAnimationSpeed(speed);
            }
        }
    }

    decreaseSpeed() {
        if (this.speed.pointer > 0) {
            this.speed.pointer -= 1;
            this.speed.value = CONSTANTS.gameSpeed.actualValues[this.speed.pointer];
            this.updateSpeedDisplay();

            let speed = CONSTANTS.spriteConstants.soldierSprites.animationSpeed.values[this.speed.pointer];
            for (let soldier of this.soldiers) {
                soldier.setAnimationSpeed(speed);
            }
        }
    }

    updateSpeedDisplay() {
        let speedValDiv = document.querySelector("#speed-value");

        if (this.speed.pointer == 0 || this.speed.pointer == CONSTANTS.gameSpeed.actualValues.length - 1) {
            speedValDiv.classList.add("extreme");
        } else if (this.speed.pointer == 1 || this.speed.pointer == CONSTANTS.gameSpeed.actualValues.length - 2) {
            speedValDiv.classList.remove("extreme");
        }

        speedValDiv.innerHTML = CONSTANTS.gameSpeed.displayValues[this.speed.pointer];
    }


    // Frame related methods
    previousFrame() {
        this.frameNo -= 1;
    }

    nextFrame() {
        if (this.timeCount >= 1/this.speed.value) {
            this.timeCount = this.timeCount % (1/this.speed.value);
            this.frameNo += 1;
            return true;
        }

        return false;
    }

    forceNextFrame() {
        this.frameNo += 1;
    }

    updateTimeCount(time) {
        this.timeCount += time;
    }

    getPreviousFrame() {
        return this.stateVariable.states[this.frameNo - 1];
    }
    getCurrentFrame() {
        return this.stateVariable.states[this.frameNo];
    }
}
