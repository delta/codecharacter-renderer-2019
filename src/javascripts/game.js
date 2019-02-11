import * as PIXI from 'pixi.js';
import CONSTANTS from './constants/constants.js';
import Camera from './camera';
import StateObject from './state_objects/stateobject';
import Unit from './state_objects/unit';
import TerrainElement from './state_objects/terrain';
import Soldier from './state_objects/soldier';
import Villager from './state_objects/villager';
import Factory from './state_objects/factory';
import pauseAsset from "../assets/pause.svg";
import playAsset from "../assets/play.svg";
import * as screenfull from 'screenfull';

export default class Game {
    constructor() {
        this.soldiers = {};
        this.villagers = {};
        this.factories = {};
        this.terrain = [];
        this.mapLength = 0;
        this.playerMoney = [];

        this.frameNo = 0;
        this.timeCount = 0;

        this.playerID = 1;

        this.speed = {};
        this.speed.pointer = CONSTANTS.gameSpeed.default;
        this.speed.value = CONSTANTS.gameSpeed.actualValues[this.speed.pointer];

        this.errorMap = {};
        this.logFunction = () => { };
        this.logClearFunction = () => { };

        this.playerLogs = { 1: [], 2: [] };

        this.camera = new Camera(CONSTANTS.camera);
        this.container = document.querySelector("#renderer-container");

        this.app = new PIXI.Application({ width: this.container.offsetWidth, height: this.container.offsetHeight });
        this.container.appendChild(this.app.view);
        this.state = "play";
        this.isFullscreen = false;

        Game.addListeners(this);
    }

    /**
     * Essential member funtion to set certian constants and functions.
     * Check driver.js for these function calls
     */
    setStateVariable(stateVar) {
        this.stateVariable = stateVar;
        return this;
    }

    setLogFunction(fn) {
        this.logFunction = fn;
        return this;
    }

    setLogClearFunction(fn) {
        this.logClearFunction = fn;
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
            delim = playerLog ? playerLog.split('\n', 1)[0] + '\n' : "";
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

    /**
     * All the game controls from keyboard to renderer.
     */
    static addListeners(game) {
        let canvas = document.querySelector("canvas"),
            pauseIcon = document.querySelector("#pause-icon"),
            slowDownIcon = document.querySelector("#slow-down-icon"),
            speedUpIcon = document.querySelector("#speed-up-icon");

        canvas.tabIndex = 1; // Allows event listeners to work

        game.container.addEventListener("mousedown", (e) => {
            canvas.focus();
            e.preventDefault();
        });

        canvas.addEventListener("keydown", (e) => {
            if (e.key !== undefined) {
                switch (e.key) {
                case 'ArrowLeft':
                    game.camera.commands.move.left = true;
                    break;
                case 'ArrowUp':
                    game.camera.commands.move.up = true;
                    break;
                case 'ArrowRight':
                    game.camera.commands.move.right = true;
                    break;
                case 'ArrowDown':
                    game.camera.commands.move.down = true;
                    break;
                case '+':
                case '=':
                    game.camera.commands.zoom.in = true;    //for +, shift+ on keyboard and numpad
                    break;
                case '-':
                    game.camera.commands.zoom.out = true;   //for - on keyboard and numpad
                    break;
                }
            } else {
                switch (e.keyCode) {
                case 37:
                    game.camera.commands.move.left = true;  //left arrow
                    break;
                case 38:
                    game.camera.commands.move.up = true;    //up arrow
                    break;
                case 39:
                    game.camera.commands.move.right = true; //right arrow
                    break;
                case 40:
                    game.camera.commands.move.down = true;  //down arrow
                    break;
                case 187:
                case 107:
                    game.camera.commands.zoom.in = true;    //for + on keyboard and numpad
                    break;
                case 189:
                case 109:
                    game.camera.commands.zoom.out = true;   //for - on keyboard and numpad
                    break;
                }
            }
        });

        canvas.addEventListener("keyup", (e) => {
            if (e.key !== undefined) {
                switch (e.key) {
                case 'ArrowLeft':
                    game.camera.commands.move.left = false;
                    break;
                case 'ArrowUp':
                    game.camera.commands.move.up = false;
                    break;
                case 'ArrowRight':
                    game.camera.commands.move.right = false;
                    break;
                case 'ArrowDown':
                    game.camera.commands.move.down = false;
                    break;
                case '+':
                case '=':
                    game.camera.commands.zoom.in = false;    //for +, shift+ on keyboard and numpad
                    break;
                case '-':
                    game.camera.commands.zoom.out = false;   //for - on keyboard and numpad
                    break;
                case 'p':
                    game.toggleState();
                    break;
                case '[':
                    game.decreaseSpeed();
                    break;
                case ']':
                    game.increaseSpeed();
                    break;
                case 'f':
                    if (screenfull.enabled) {
                        if (game.isFullscreen === true) {
                            screenfull.exit();
                            game.isFullscreen = false;
                        } else {
                            screenfull.request(game.container);
                            game.isFullscreen = true;
                        }
                    }
                    break;
                }
            } else {
                switch (e.keyCode) {
                case 37:
                    game.camera.commands.move.left = false;  //left arrow
                    break;
                case 38:
                    game.camera.commands.move.up = false;    //up arrow
                    break;
                case 39:
                    game.camera.commands.move.right = false; //right arrow
                    break;
                case 40:
                    game.camera.commands.move.down = false;  //down arrow
                    break;
                case 187:
                    game.camera.commands.zoom.in = false;    //for +, shift+ on keyboard and numpad
                    break;
                case 189:
                    game.camera.commands.zoom.out = false;   //for - on keyboard and numpad
                    break;
                case 80:                                    //for p
                    game.toggleState();
                    break;
                case 219:                                   //for [
                    game.decreaseSpeed();
                    break;
                case 221:                                   //for ]
                    game.increaseSpeed();
                    break;
                case 70:                                    // for 'f'
                    if (screenfull.enabled) {
                        if (game.isFullscreen === true) {
                            screenfull.exit();
                            game.isFullscreen = false;
                        } else {
                            screenfull.request(game.container);
                            game.isFullscreen = true;
                        }
                    }
                    break;
                }
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

    /**
     * All the build functions for the game.
     * Check driver.js for these function calls.
     * Builds the following :
     * 1. States
     * 2. Terrian
     * 3. Soldiers and Villagers
     * 4. Factories
     * 5. Map and ErrorMap
     * 6. Instruction Count
     * 7. Money(gold) and Score
     * 8. Game divs
     */
    buildStateClasses() {

        // Set Constants
        StateObject.setSpriteAnchors(CONSTANTS.spriteConstants.spriteAnchors)
        TerrainElement.setSideLength(this.stateVariable.mapElementSize);
        Soldier.setMaxHP(this.stateVariable.soldierMaxHp);
        Villager.setMaxHP(this.stateVariable.villagerMaxHp);
        Factory.setMaxHPs(this.stateVariable.factoryMaxHps);
        Factory.setBuildMultiplier(CONSTANTS.factories.factoryBuildLevelMultiplier);

        // Set Sprite related constants
        Unit.initializeSpriteConstants();
        Soldier.setUnitConstant(CONSTANTS.unitType.soldier);
        Villager.setUnitConstant(CONSTANTS.unitType.villager);
        Soldier.setSpriteConstants(CONSTANTS.spriteConstants.soldierSprites);
        Villager.setSpriteConstants(CONSTANTS.spriteConstants.villagerSprites);
        Factory.setSpriteConstants(CONSTANTS.spriteConstants.towerSprites);

        // Add Textures
        Unit.setTextures(CONSTANTS.unitType);
        Factory.setTextures();
        TerrainElement.setTextures();

        return this;
    }


    // Game building functions
    buildTerrain() {
        let terrainLength = this.stateVariable.mapSize;
        let len = TerrainElement.sideLength;
        let terrianArray = this.stateVariable.mapElements;

        for (let i = 0; i < terrainLength; i++) {
            this.terrain[i] = [];
            for (let j = 0; j < terrainLength; j++) {
                let terrainElementType = terrianArray[j * terrainLength + i];   //1d to 2d array search column wise.
                this.terrain[i][j] = new TerrainElement(len * i, len * j, terrainElementType);
            }
        }

        return this;
    }

    // buildSoldiers() {
    //     let stateSoldiers = this.getCurrentFrame().soldiers;  // Current Frame Number is 0

    //     let animationSpeed = CONSTANTS.spriteConstants.soldierSprites.animationSpeed.values[this.speed.pointer];
    //     for (let i = 0; i < stateSoldiers.length; i++) {
    //         let soldier = stateSoldiers[i];
    //         this.soldiers[i] = new Soldier(
    //             soldier.x, soldier.y, soldier.direction, soldier.hp, soldier.state, soldier.playerId, animationSpeed
    //         );
    //     }

    //     return this;
    // }

    // buildVillagers() {
    //     let stateVillagers = this.getCurrentFrame().villagers;  // Current Frame Number is 0

    //     let animationSpeed = CONSTANTS.spriteConstants.villagerSprites.animationSpeed.values[this.speed.pointer];
    //     for (let i = 0; i < stateVillagers.length; i++) {
    //         let villager = stateVillagers[i];
    //         this.villagers[i] = new Villager(
    //             villager.x, villager.y, villager.direction, villager.hp, villager.state, villager.playerId, animationSpeed
    //         );
    //     }

    //     return this;
    // }

    buildSoldiers() {
        let stateSoldiers = this.getCurrentFrame().soldiers;  // Current Frame Number is 0
        let animationSpeed = CONSTANTS.spriteConstants.soldierSprites.animationSpeed.values[this.speed.pointer];

        for (let soldierID in stateSoldiers) {
            if (isNaN(parseInt(soldierID)))    // Create New Soldiers only for actual soldier objects
                continue;

            let soldier = stateSoldiers[soldierID];
            this.soldiers[soldierID] = new Soldier(
                soldier.x, soldier.y, soldier.direction, soldier.hp, soldier.state, soldier.playerId, animationSpeed
            );
        }

        return this;
    }

    buildVillagers() {
        let stateVillagers = this.getCurrentFrame().villagers;  // Current Frame Number is 0
        let animationSpeed = CONSTANTS.spriteConstants.villagerSprites.animationSpeed.values[this.speed.pointer];

        for (let villagerID in stateVillagers) {
            if (isNaN(parseInt(villagerID)))    // Create New Villagers only for actual villager objects
                continue;

            let villager = stateVillagers[villagerID];
            this.villagers[villagerID] = new Villager(
                villager.x, villager.y, villager.direction, villager.hp, villager.state, villager.playerId, animationSpeed
            );
        }

        return this;
    }

    buildFactories() {
        let stateFactories = this.getCurrentFrame().factories;

        for (let factoriesID in stateFactories) {
            if (isNaN(parseInt(factoriesID)))    // Create New factories only for actual factory objects
                continue;

            let factory = stateFactories[factoriesID];
            this.factories[factoriesID] = new Factory(factory.x, factory.y, factory.id, factory.playerId, factory.hp, factory.state, factory.buildPercent);
        }

        return this;
    }

    buildMap() {
        this.mapLength = TerrainElement.sideLength * this.terrain.length;
        this.camera.setInitialParams(this.container.offsetWidth, this.container.offsetHeight, this.mapLength);

        return this;
    }

    buildErrorMap() {
        this.errorMap = this.stateVariable.errorMap;
        return this;
    }

    buildInstructionCount() {
        this.instructionLimit = this.stateVariable.instructionLimit;
        document.querySelector("#instr-count-limit").innerHTML = `${this.instructionLimit / 1000000}M`;
        document.querySelector("#instr-count-value").classList.remove("extreme");
        document.querySelector("#instr-count-limit").classList.remove("extreme");
        return this;
    }

    buildMoney() {
        this.playerMoney = this.getCurrentFrame().gold.slice();
        let moneyValDiv = document.querySelector("#money-value");

        moneyValDiv.innerHTML = this.playerMoney[this.playerID - 1];
        (this.playerID === 1) ? moneyValDiv.classList.add("p1-color") : moneyValDiv.classList.add("p2-color");

        return this;
    }

    buildScores() {
        let playerScoreDiv = (this.playerID === 1) ?
            document.querySelector("#p1-score") :
            document.querySelector("#p2-score");

        playerScoreDiv.classList.add("highlight");

        return this;
    }

    buildSpeedDiv() {
        let speedValDiv = document.querySelector("#speed-value");
        speedValDiv.innerHTML = "1.0";
        speedValDiv.classList.remove("extreme");
        return this;
    }

    buildGameOverDiv() {
        document.querySelector("#game-over-container").style.display = "none";
        return this;
    }

    buildPauseIcon() {
        let icon = document.querySelector("#pause-icon");
        icon.src = pauseAsset;
        return this;
    }

    /**
     * Adds sprites to above builded renderer elements onto the canvas.
     */
    addTerrain() {
        for (let row of this.terrain) {
            for (let element of row) {
                element.addSprite(this.app.stage);
            }
        }

        return this;
    }

    addSoldiers() {
        for (let soldierID in this.soldiers) {
            let soldier = this.soldiers[soldierID];
            soldier.addSprite(this.app.stage);
        }

        return this;
    }

    addVillagers() {
        for (let villagerID in this.villagers) {
            let villager = this.villagers[villagerID];
            villager.addSprite(this.app.stage);
        }

        return this;
    }

    addFactories() {
        for (let factoriesID in this.factories) {
            let factory = this.factories[factoriesID];
            factory.addSprite(this.app.stage);
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
            this.camera.zoom.min = Math.min(containerHeight / mapLength, containerWidth / mapLength);
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

    /**
     * Updating game objects
     */
    // updateSoldiers() {
    //     let currentSoldiers = this.getCurrentFrame().soldiers;

    //     for (let i = 0; i < this.soldiers.length; i++) {
    //         let soldier = currentSoldiers[i];
    //         this.soldiers[i].updatePosition(soldier.x, soldier.y);
    //         this.soldiers[i].updateHP(soldier.hp);

    //         if (soldier.stateHasChanged) {
    //             this.soldiers[i].updateState(soldier.state, soldier.direction);
    //         }
    //     }

    //     return this;
    // }

    // updateVillagers() {
    //     let currentVillagers = this.getCurrentFrame().villagers;

    //     for (let i = 0; i < this.villagers.length; i++) {
    //         let villager = currentVillagers[i];
    //         this.villagers[i].updatePosition(villager.x, villager.y);
    //         this.villagers[i].updateHP(villager.hp);

    //         if (villager.stateHasChanged) {
    //             this.villagers[i].updateState(villager.state, villager.direction);
    //         }
    //     }

    //     return this;
    // }

    updateSoldiers() {
        let currentSoldiers = this.getCurrentFrame().soldiers;

        if (!currentSoldiers.hasChanged) {
            return this;
        }

        for (let soldierID in currentSoldiers) {
            if (isNaN(parseInt(soldierID)))
                continue;

            let soldier = currentSoldiers[soldierID];
            if (soldier.updateMethod == "none")
                continue;

            if (soldier.updateMethod == "create") {
                let animationSpeed = CONSTANTS.spriteConstants.soldierSprites.animationSpeed.values[this.speed.pointer];
                this.soldiers[soldierID] = new Soldier(
                    soldier.x, soldier.y, soldier.direction, soldier.hp, soldier.state, soldier.playerId, animationSpeed
                );
                this.soldiers[soldierID].addSprite(this.app.stage);
            } else if (soldier.updateMethod == "destroy") {
                this.soldiers[soldierID].updateState(soldier.state, soldier.direction);
            } else if (soldier.updateMethod == "update") {
                this.soldiers[soldierID].updatePosition(soldier.x, soldier.y);
                this.soldiers[soldierID].updateHP(soldier.hp);
                if(soldier.stateHasChanged) {
                    this.soldiers[soldierID].updateState(soldier.state, soldier.direction);
                }
            }
            if (soldier.framesLeft == 0) {
                this.soldiers[soldierID].removeSprite(this.app.stage);
                delete this.soldiers[soldierID];
            }
        }

        return this;
    }

    updateVillagers() {
        let currentVillagers = this.getCurrentFrame().villagers;

        if (!currentVillagers.hasChanged) {
            return this;
        }

        for (let villagerID in currentVillagers) {
            if (isNaN(parseInt(villagerID)))
                continue;

            let villager = currentVillagers[villagerID];
            if (villager.updateMethod == "none")
                continue;

            if (villager.updateMethod == "create") {
                let animationSpeed = CONSTANTS.spriteConstants.villagerSprites.animationSpeed.values[this.speed.pointer];
                this.villagers[villagerID] = new Villager(
                    villager.x, villager.y, villager.direction, villager.hp, villager.state, villager.playerId, animationSpeed
                );
                this.villagers[villagerID].addSprite(this.app.stage);
            } else if (villager.updateMethod == "destroy") {
                this.villagers[villagerID].updateState(villager.state, villager.direction);
            } else if (villager.updateMethod == "update") {
                this.villagers[villagerID].updatePosition(villager.x, villager.y);
                this.villagers[villagerID].updateHP(villager.hp);
                if(villager.stateHasChanged) {
                    this.villagers[villagerID].updateState(villager.state, villager.direction);
                }
            }
            if (villager.framesLeft == 0) {
                this.villagers[villagerID].removeSprite(this.app.stage);
                delete this.villagers[villagerID];
            }
        }

        return this;
    }

    updateFactories() {
        let currentFactories = this.getCurrentFrame().factories;

        if (!currentFactories.hasChanged) {
            return this;
        }

        for (let factoriesID in currentFactories) {
            if (isNaN(parseInt(factoriesID)))    // Update Factories only for actual factory objects
                continue;

            let factory = currentFactories[factoriesID];
            if (factory.updateMethod == "none")
                continue;

            if (factory.updateMethod == "create") {
                this.factories[factoriesID] = new Factory(factory.x, factory.y, factory.id, factory.playerId, factory.hp, factory.state, factory.buildPercent);
                this.factories[factoriesID].addSprite(this.app.stage);
            } else if (factory.updateMethod == "destroy") {
                if (factory.framesLeft == CONSTANTS.factories.maxDeathFrames) {
                    this.factories[factoriesID].destroy();
                } else if (factory.framesLeft == 0) {
                    this.factories[factoriesID].removeSprite(this.app.stage);
                    delete this.factories[factoriesID];
                }

            } else if (factory.updateMethod == "update") {
                this.factories[factoriesID].update(factory.hp, factory.state, factory.buildPercent);
            }
        }

        return this;
    }

    updateMoney() {
        let money = this.getCurrentFrame().gold;
        this.playerMoney[0] = money[0];
        this.playerMoney[1] = money[1];
        document.querySelector("#money-value").innerHTML = this.playerMoney[this.playerID - 1];

        return this;
    }

    logErrors() {
        this.logFunction(`TURN ${this.frameNo} :\n`);
        let currErrors = this.getCurrentFrame().errors;

        // If the current frame has errors, iterate through them
        if (currErrors !== undefined) {

            // If the player has errors, iterate through them
            if (JSON.stringify(currErrors[this.playerID - 1])
                !== JSON.stringify({})) {

                for (let errorCode of currErrors[this.playerID - 1].errors) {
                    // Log the current error code's corresponding string
                    this.logFunction(this.errorMap[errorCode] + '\n');
                }
                this.logFunction('\n');
            }
        }
        return this;
    }

    logPlayerLogs() {
        // Read the current player's current turn's logs (if any), and write them
        let currentTurnLogs
            = this.playerLogs[this.playerID][this.frameNo];
        if (currentTurnLogs) {
            this.logFunction(currentTurnLogs + '\n');
        }

        return this;
    }

    checkInstructionCount() {
        let instrCount = this.getCurrentFrame().instructionCounts[this.playerID - 1];
        let instrCountDisplay = (instrCount / 1000000).toFixed(3).toString();
        if (instrCountDisplay.length > 5) {
            instrCountDisplay = instrCountDisplay.substring(0, 5);
        }
        document.querySelector("#instr-count-value").innerHTML = `${instrCountDisplay}M`;

        if (instrCount > this.stateVariable.instructionLimit) {
            document.querySelector("#instr-count-value").classList.add("extreme");
            document.querySelector("#instr-count-limit").classList.add("extreme");
        } else {
            document.querySelector("#instr-count-value").classList.remove("extreme");
            document.querySelector("#instr-count-limit").classList.remove("extreme");
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
        document.querySelector("#game-over-container").style.display = "block";
        let p1Score = Number.parseInt(document.querySelector("#p1-score").innerHTML),
            p2Score = Number.parseInt(document.querySelector("#p2-score").innerHTML);
        let gameOutcomeDiv = document.querySelector("#game-outcome");

        if (p1Score > p2Score) {
            if (this.playerID == 1) {
                gameOutcomeDiv.innerHTML = "You won!";
                gameOutcomeDiv.style.color = "#b2deb5";
            } else {
                gameOutcomeDiv.innerHTML = "You lost";
                gameOutcomeDiv.style.color = "#ffb4b4";
            }
        } else if (p1Score < p2Score) {
            if (this.playerID == 1) {
                gameOutcomeDiv.innerHTML = "You lost";
                gameOutcomeDiv.style.color = "#ffb4b4";
            } else {
                gameOutcomeDiv.innerHTML = "You won!";
                gameOutcomeDiv.style.color = "#b2deb5";
            }
        } else {
            gameOutcomeDiv.innerHTML = "The game is a draw";
            gameOutcomeDiv.style.color = "#fff8b4";
        }

        // Stop Animations
        for (let soldier of this.soldiers) {
            soldier.pauseAnimation();
        }
    }

    /**
     * Responds to -/+ buttons in game.
     * Check constants.js for values.
     */
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

    /**
     * Functions to manipulate frames, i.e, states.
     */
    nextFrame() {
        if (this.timeCount >= 1 / this.speed.value) {
            this.timeCount = this.timeCount % (1 / this.speed.value);
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

    getCurrentFrame() {
        return this.stateVariable.states[this.frameNo];
    }
}
