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
import enterFullscreenAsset from "../assets/enterfullscreen.png";
import exitFullscreenAsset from "../assets/exitfullscreen.png";
import * as screenfull from 'screenfull';
import Actor from './state_objects/actor.js';
import HealthBarObject from './state_objects/healthbarobject.js';
import BuildBarObject from './state_objects/buildbarobject.js';

export default class Game {
    constructor() {
        this.soldiers = {};
        this.villagers = {};
        this.factories = {};
        this.terrain = [];
        this.mapLength = 0;

        /**
         * For the following 3 objects, the array structure is :
         * array[0] - Player1
         * array[1] - Player2
         */
        this.playerMoney = [];
        this.scores = [];
        this.actorCount = {
            soldier: [0, 0],
            villager: [0, 0],
            factory: [0, 0]
        };

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

        /**
         * Possible states include:
         * `click` - A sprite has just been clicked
         * `active` - A sprite is active. It glows and it's details are shown
         * `passive` - A sprite is active. However screen drag is currently occuring,
         *   so click based events do not affect or remove the active sprite
         * `inactive` - There is no active sprite
         */
        this.activeSprite = {
            obj: {},
            state: "inactive"
        };

        this.app = new PIXI.Application({ width: this.container.offsetWidth, height: this.container.offsetHeight });
        this.container.appendChild(this.app.view);
        this.state = "play";
        this.isFullscreen = false;

        this.addListeners();
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
     * All the game controls for the renderer.
     */
    addListeners() {
        let canvas = document.querySelector("canvas"),
            pauseIcon = document.querySelector("#pause-icon"),
            fullscreenIcon = document.querySelector("#fullscreen-icon"),
            slowDownIcon = document.querySelector("#slow-down-icon"),
            speedUpIcon = document.querySelector("#speed-up-icon"),
            helpIcon = document.querySelector("#help-icon");

        canvas.tabIndex = 1; // Allows event listeners to work

        this.container.addEventListener('click', () => {
            canvas.focus();
        });

        // Click and drag panning
        this.container.addEventListener("mousedown", (e) => {
            this.camera.commands.drag = true;
            this.camera.setDragStartPosition(e.clientX, e.clientY);
            this.camera.setDragTarget(e.clientX, e.clientY);
            this.container.style.cursor = "grabbing";
        });
        this.container.addEventListener("mouseup", () => {
            this.camera.commands.drag = false;
            this.container.style.cursor = "grab";

            // Reset activeSprite state back to active
            // (check constructor for the purpose of the passive state)
            if (this.activeSprite.state == "passive") {
                this.activeSprite.state = "active";
            }
        });
        this.container.addEventListener("mousemove", (e) => {
            if (this.camera.commands.drag) {
                this.camera.setDragTarget(e.clientX, e.clientY);

                // Set activeSprite state to passive
                // (check constructor for the purpose of the passive state)
                if (this.activeSprite.state == "active") {
                    this.activeSprite.state = "passive";
                }
            }
        });

        // Scroll based zooming
        this.container.addEventListener("wheel", (e) => {
            this.camera.manualZoom(e.deltaY < 0);
        });

        // Deselect active sprite
        canvas.addEventListener('pointerup', () => {
            if (this.activeSprite.state == "active") {
                this.removeActiveSprite();
            }
        });

        canvas.addEventListener("keydown", (e) => {
            if (e.key !== undefined) {
                switch (e.key) {
                case 'ArrowLeft':
                    this.camera.commands.move.left = true;
                    break;
                case 'ArrowUp':
                    this.camera.commands.move.up = true;
                    break;
                case 'ArrowRight':
                    this.camera.commands.move.right = true;
                    break;
                case 'ArrowDown':
                    this.camera.commands.move.down = true;
                    break;
                case '+':
                case '=':
                    this.camera.commands.zoom.in = true;    //for +, shift+ on keyboard and numpad
                    break;
                case '-':
                    this.camera.commands.zoom.out = true;   //for - on keyboard and numpad
                    break;
                }
            } else {
                switch (e.keyCode) {
                case 37:
                    this.camera.commands.move.left = true;  //left arrow
                    break;
                case 38:
                    this.camera.commands.move.up = true;    //up arrow
                    break;
                case 39:
                    this.camera.commands.move.right = true; //right arrow
                    break;
                case 40:
                    this.camera.commands.move.down = true;  //down arrow
                    break;
                case 187:
                case 107:
                    this.camera.commands.zoom.in = true;    //for + on keyboard and numpad
                    break;
                case 189:
                case 109:
                    this.camera.commands.zoom.out = true;   //for - on keyboard and numpad
                    break;
                }
            }
        });

        canvas.addEventListener("keyup", (e) => {
            if (e.key !== undefined) {
                switch (e.key) {
                case 'ArrowLeft':
                    this.camera.commands.move.left = false;
                    break;
                case 'ArrowUp':
                    this.camera.commands.move.up = false;
                    break;
                case 'ArrowRight':
                    this.camera.commands.move.right = false;
                    break;
                case 'ArrowDown':
                    this.camera.commands.move.down = false;
                    break;
                case '+':
                case '=':
                    this.camera.commands.zoom.in = false;    //for +, shift+ on keyboard and numpad
                    break;
                case '-':
                    this.camera.commands.zoom.out = false;   //for - on keyboard and numpad
                    break;
                case 'p':
                case ' ':
                    this.toggleState();

                    break;
                case '[':
                    this.decreaseSpeed();
                    break;
                case ']':
                    this.increaseSpeed();
                    break;
                case 'f':
                    this.toggleFullscreen();
                    break;
                }
            } else {
                switch (e.keyCode) {
                case 37:
                    this.camera.commands.move.left = false;  //left arrow
                    break;
                case 38:
                    this.camera.commands.move.up = false;    //up arrow
                    break;
                case 39:
                    this.camera.commands.move.right = false; //right arrow
                    break;
                case 40:
                    this.camera.commands.move.down = false;  //down arrow
                    break;
                case 187:
                    this.camera.commands.zoom.in = false;    //for +, shift+ on keyboard and numpad
                    break;
                case 189:
                    this.camera.commands.zoom.out = false;   //for - on keyboard and numpad
                    break;
                case 80:
                case 32:                                    //for p
                    this.toggleState();
                    break;
                case 219:                                   //for [
                    this.decreaseSpeed();
                    break;
                case 221:                                   //for ]
                    this.increaseSpeed();
                    break;
                case 70:                                    // for 'f'
                    this.toggleFullscreen();
                    break;
                }
            }
        });

        pauseIcon.addEventListener('click', () => {
            this.toggleState();
        });

        fullscreenIcon.addEventListener('click', () => {
            this.toggleFullscreen();
        });

        slowDownIcon.addEventListener('click', () => {
            this.decreaseSpeed();
        });

        speedUpIcon.addEventListener('click', () => {
            this.increaseSpeed();
        });

        helpIcon.addEventListener('mouseover', () => {
            let controlsDisplay = document.querySelector("#controls-div");
            controlsDisplay.style.zIndex = 20;
            controlsDisplay.style.opacity = 1;
        });
        helpIcon.addEventListener('mouseout', () => {
            let controlsDisplay = document.querySelector("#controls-div");
            controlsDisplay.style.opacity = 0;
            setTimeout(() => {
                controlsDisplay.style.zIndex = -1;
            },200);
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
        Factory.setMaxHP(this.stateVariable.factoryMaxHp);
        Factory.setBuildMultiplier(CONSTANTS.factories.factoryBuildLevelMultiplier);
        Factory.setMinHP(CONSTANTS.factories.factoryMinHp);

        // Set Sprite related constants
        Unit.initializeSpriteConstants();
        Soldier.setActorConstant(CONSTANTS.actorType.soldier);
        Villager.setActorConstant(CONSTANTS.actorType.villager);
        Factory.setActorConstant(CONSTANTS.actorType.factory);
        Soldier.setSpriteConstants(CONSTANTS.spriteConstants.soldierSprites);
        Villager.setSpriteConstants(CONSTANTS.spriteConstants.villagerSprites);
        Factory.setSpriteConstants(CONSTANTS.spriteConstants.factorySprites);
        Actor.setFilterConstant(CONSTANTS.glowFilters);
        HealthBarObject.setHPConstants(CONSTANTS.barConstants.hp);
        BuildBarObject.setBuildConstants(CONSTANTS.barConstants.build);

        // Add Textures
        Unit.setTextures(CONSTANTS.actorType);
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
                let terrainElementType = terrianArray[j * terrainLength + i];   // 1d to 2d array search column wise.
                this.terrain[i][j] = new TerrainElement(len * i, len * j, terrainElementType);
            }
        }

        return this;
    }

    buildSoldiers() {
        let stateSoldiers = this.getCurrentFrame().soldiers;  // Current Frame Number is 0
        let animationSpeed = CONSTANTS.spriteConstants.soldierSprites.animationSpeed.values[this.speed.pointer];

        for (let soldierID in stateSoldiers) {
            let soldier = stateSoldiers[soldierID];
            this.soldiers[soldierID] = new Soldier(
                soldier.x, soldier.y, soldier.id, soldier.direction, soldier.hp, soldier.state, soldier.playerId, animationSpeed
            );
            this.soldiers[soldierID].bindEventListeners(this.activeSprite);
        }

        return this;
    }

    buildVillagers() {
        let stateVillagers = this.getCurrentFrame().villagers;  // Current Frame Number is 0
        let animationSpeed = CONSTANTS.spriteConstants.villagerSprites.animationSpeed.values[this.speed.pointer];

        for (let villagerID in stateVillagers) {
            let villager = stateVillagers[villagerID];
            this.villagers[villagerID] = new Villager(
                villager.x, villager.y, villager.id, villager.direction, villager.hp, villager.state, villager.playerId, animationSpeed
            );
            this.villagers[villagerID].bindEventListeners(this.activeSprite);
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
            this.factories[factoriesID].bindEventListeners(this.activeSprite);
        }

        return this;
    }

    buildMap() {
        this.mapLength = TerrainElement.sideLength * this.terrain.length;
        this.camera.reCenter(this.container.offsetWidth, this.container.offsetHeight, this.mapLength);

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
            soldier.addToStage(this.app.stage);
        }

        return this;
    }

    addVillagers() {
        for (let villagerID in this.villagers) {
            let villager = this.villagers[villagerID];
            villager.addToStage(this.app.stage);
        }

        return this;
    }

    addFactories() {
        for (let factoriesID in this.factories) {
            let factory = this.factories[factoriesID];
            factory.addToStage(this.app.stage);
        }

        return this;
    }


    // Camera Related Methods
    autoResize() {
        let containerWidth = this.container.offsetWidth,
            containerHeight = this.container.offsetHeight,
            mapLength = this.mapLength,
            borderThickness = 2;  // Allows the 1px border to be seen on all sides

        if (this.app.renderer.width != containerWidth - borderThickness || this.app.renderer.height != containerHeight - borderThickness) {
            this.app.renderer.resize(containerWidth - borderThickness, containerHeight - borderThickness);
            this.camera.zoom.min = Math.min(containerHeight / mapLength, containerWidth / mapLength);
            this.camera.reCenter(containerWidth, containerHeight, mapLength);
        }

        return this;
    }

    updateCamera() {
        let containerWidth = this.container.offsetWidth,
            containerHeight = this.container.offsetHeight;

        this.camera.updatePosition(this.mapLength);
        this.camera.restrictPosition(this.mapLength, containerWidth, containerHeight);
        this.camera.updateZoom(this.mapLength, containerWidth, containerHeight);

        const zoomVal = this.camera.zoom.value;
        this.app.stage.setTransform(zoomVal * this.camera.actualPos.x, zoomVal * this.camera.actualPos.y, zoomVal, zoomVal);

        return this;
    }

    /**
     * Updating game objects
     */
    updateSoldiers() {
        let currentSoldiers = this.getCurrentFrame().soldiers;
        let countP1 = 0, countP2 = 0;

        for (let soldierID in currentSoldiers) {
            let soldier = currentSoldiers[soldierID];
            if (soldier.updateMethod != "destroy") {
                (soldier.playerId == 1) ? countP1++ : countP2++;
            }

            if (soldier.updateMethod == "create") {
                let animationSpeed = CONSTANTS.spriteConstants.soldierSprites.animationSpeed.values[this.speed.pointer];
                this.soldiers[soldierID] = new Soldier(
                    soldier.x, soldier.y, soldier.id, soldier.direction, soldier.hp, soldier.state, soldier.playerId, animationSpeed
                );
                this.soldiers[soldierID].bindEventListeners(this.activeSprite);
                this.soldiers[soldierID].addToStage(this.app.stage);
            } else if (soldier.updateMethod == "destroy" && soldier.framesLeft == CONSTANTS.units.maxDeathFrames) {
                this.soldiers[soldierID].updateHP(soldier.hp);
                this.soldiers[soldierID].updateState(soldier.state, soldier.direction);
            } else if (soldier.updateMethod == "update") {
                this.soldiers[soldierID].updatePosition(soldier.x, soldier.y);
                this.soldiers[soldierID].updateHP(soldier.hp);
                if(soldier.stateHasChanged) {
                    this.soldiers[soldierID].updateState(soldier.state, soldier.direction);
                }
            }
            if (soldier.framesLeft < 0) {
                if (soldier.id === this.activeSprite.obj.id) {
                    this.removeActiveSprite();
                }
                this.soldiers[soldierID].removeFromStage(this.app.stage);
                delete this.soldiers[soldierID];
            }
        }

        this.actorCount.soldier[0] = countP1;
        this.actorCount.soldier[1] = countP2;

        return this;
    }

    updateVillagers() {
        let currentVillagers = this.getCurrentFrame().villagers;
        let countP1 = 0, countP2 = 0;

        for (let villagerID in currentVillagers) {
            let villager = currentVillagers[villagerID];
            if (villager.updateMethod != "destroy") {
                (villager.playerId == 1) ? countP1++ : countP2++;
            }

            if (villager.updateMethod == "create") {
                let animationSpeed = CONSTANTS.spriteConstants.villagerSprites.animationSpeed.values[this.speed.pointer];
                this.villagers[villagerID] = new Villager(
                    villager.x, villager.y, villager.id, villager.direction, villager.hp, villager.state, villager.playerId, animationSpeed
                );
                this.villagers[villagerID].bindEventListeners(this.activeSprite);
                this.villagers[villagerID].addToStage(this.app.stage);
            } else if (villager.updateMethod == "destroy" && villager.framesLeft == CONSTANTS.units.maxDeathFrames) {
                this.villagers[villagerID].updateHP(villager.hp);
                this.villagers[villagerID].updateState(villager.state, villager.direction);
            } else if (villager.updateMethod == "update") {
                this.villagers[villagerID].updatePosition(villager.x, villager.y);
                this.villagers[villagerID].updateHP(villager.hp);
                if(villager.stateHasChanged) {
                    this.villagers[villagerID].updateState(villager.state, villager.direction);
                }
            }
            if (villager.framesLeft < 0) {
                if (villager.id === this.activeSprite.obj.id) {
                    this.removeActiveSprite();
                }
                this.villagers[villagerID].removeFromStage(this.app.stage);
                delete this.villagers[villagerID];
            }
        }

        this.actorCount.villager[0] = countP1;
        this.actorCount.villager[1] = countP2;

        return this;
    }

    updateFactories() {
        let currentFactories = this.getCurrentFrame().factories;
        let countP1 = 0, countP2 = 0;

        if (!currentFactories.hasChanged) {
            return this;
        }

        for (let factoriesID in currentFactories) {
            if (isNaN(parseInt(factoriesID)))    // Update Factories only for actual factory objects
                continue;

            let factory = currentFactories[factoriesID];
            if (factory.updateMethod != "destroy") {
                (factory.playerId == 1) ? countP1++ : countP2++;
            }

            if (factory.updateMethod == "none")
                continue;

            if (factory.updateMethod == "create") {
                this.factories[factoriesID] = new Factory(factory.x, factory.y, factory.id, factory.playerId, factory.hp, factory.state, factory.buildPercent);
                this.factories[factoriesID].bindEventListeners(this.activeSprite);
                this.factories[factoriesID].addToStage(this.app.stage);
            } else if (factory.updateMethod == "destroy") {
                if (factory.framesLeft == CONSTANTS.factories.maxDeathFrames) {
                    this.factories[factoriesID].updateHP(factory.hp);
                    this.factories[factoriesID].destroy();
                } else if (factory.framesLeft == 0) {
                    if (factory.id === this.activeSprite.obj.id) {
                        this.removeActiveSprite();
                    }
                    this.factories[factoriesID].removeFromStage(this.app.stage);
                    delete this.factories[factoriesID];
                }

            } else if (factory.updateMethod == "update") {
                this.factories[factoriesID].updateHP(factory.hp);
                this.factories[factoriesID].updateState(factory.state, factory.buildPercent);
                if (factory.buildPercent >= 100) {
                    this.factories[factoriesID].buildBarObject.removeBar(this.app.stage);
                }
            }
        }

        this.actorCount.factory[0] = countP1;
        this.actorCount.factory[1] = countP2;

        return this;
    }

    // Details Update
    updateDetails() {
        if (this.activeSprite.state == "click") {
            this.activeSprite.state = "active";
            this.showDetailsDiv();
        } else if (this.activeSprite.state != "inactive") {
            this.updateDetailsDiv();
        }
        // In case a canvas element is clicked or under inactive condition, check canvas `pointerup` handler
        return this;
    }

    removeActiveSprite() {
        // When a user clicks elsewhere on the canvas (not on a sprite) or if the activeSprite dies,
        //  the glowing/acive sprite's filters and details are removed
        this.activeSprite.obj.disableFilters();
        this.hideDetailsDiv();

        // since now no sprite is active, reset activeSprite
        this.activeSprite.obj = {};
        this.activeSprite.state = "inactive";
    }

    showDetailsDiv() {
        // Initial sprite click to display details div
        let topLeftContainer = document.getElementById("top-left-container");
        setTimeout(() => {
            topLeftContainer.style.zIndex = 2;
            topLeftContainer.style.opacity = 1;
        }, 200);
        this.updateDetailsDiv();
    }

    updateDetailsDiv() {
        // If a sprite is glowing/active, update its details in the details div
        let activeSprite = this.activeSprite.obj;
        let actorType = activeSprite.actorType;
        let actorTypeDiv = document.getElementById("actor-type"),
            actorIDDiv = document.getElementById("actor-id"),
            actorPositionDiv = document.getElementById("actor-position"),
            actorHpDiv = document.getElementById("actor-hp"),
            actorStateDiv = document.getElementById("actor-state");
        actorTypeDiv.innerHTML = actorType;
        actorIDDiv.innerHTML = "ID : " + activeSprite.id;
        actorPositionDiv.innerHTML = "Position : ( " + activeSprite.sprite.x + " , " + activeSprite.sprite.y + " )";
        actorHpDiv.innerHTML = "HP : " + activeSprite.hp + " / " + activeSprite.maxHP;
        actorStateDiv.innerHTML = "State : " + CONSTANTS.actorStates[actorType][activeSprite.state];
    }

    hideDetailsDiv() {
        let topLeftContainer = document.getElementById("top-left-container"),
            actorIDDiv = document.getElementById("actor-id");

        if (actorIDDiv.innerHTML == "ID : " + this.activeSprite.obj.id) {
            topLeftContainer.style.opacity = 0;
            setTimeout(() => {
                topLeftContainer.style.zIndex = -1;
            }, 200);
        }
    }


    updateMoney() {
        let money = this.getCurrentFrame().gold;
        this.playerMoney[0] = money[0];
        this.playerMoney[1] = money[1];
        document.querySelector("#money-value").innerHTML = this.playerMoney[this.playerID - 1];

        return this;
    }

    updateScore() {
        let scores = this.getCurrentFrame().scores;
        this.scores[0] = scores[0];
        this.scores[1] = scores[1];
        document.querySelector("#p1-score").innerHTML = this.scores[0];
        document.querySelector("#p2-score").innerHTML = this.scores[1];

        return this;
    }

    updateCountDiv() {
        let soldierCountP1Div = document.getElementById("soldier-p1"),
            soldierCountP2Div = document.getElementById("soldier-p2"),
            villagerCountP1Div = document.getElementById("villager-p1"),
            villagerCountP2Div = document.getElementById("villager-p2"),
            factoryCountP1Div = document.getElementById("factory-p1"),
            factoryCountP2Div = document.getElementById("factory-p2");

        soldierCountP1Div.innerHTML = this.actorCount.soldier[0];
        soldierCountP2Div.innerHTML = this.actorCount.soldier[1];
        villagerCountP1Div.innerHTML = this.actorCount.villager[0];
        villagerCountP2Div.innerHTML = this.actorCount.villager[1];
        factoryCountP1Div.innerHTML = this.actorCount.factory[0];
        factoryCountP2Div.innerHTML = this.actorCount.factory[1];

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
        let currentTurnLogs = this.playerLogs[this.playerID][this.frameNo];
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

    pauseGame() {
        let pauseIcon = document.querySelector("#pause-icon");

        this.state = "pause";
        pauseIcon.src = playAsset;

        // Pause Animations and bind hover listeners
        for (let soldierID in this.soldiers) {
            this.soldiers[soldierID].pauseAnimation();
        }
        for (let villagerID in this.villagers) {
            this.villagers[villagerID].pauseAnimation();
        }
    }

    playGame() {
        let pauseIcon = document.querySelector("#pause-icon");

        this.state = "play";
        pauseIcon.src = pauseAsset;

        // Resume Animations and unbind hover listeners
        for (let soldierID in this.soldiers) {
            this.soldiers[soldierID].playAnimation();
        }
        for (let villagerID in this.villagers) {
            this.villagers[villagerID].playAnimation();
        }
    }

    toggleFullscreen() {
        let fullscreenIcon = document.getElementById("fullscreen-icon");
        if (screenfull.enabled) {
            if (this.isFullscreen) {
                screenfull.exit();
                this.isFullscreen = false;
                fullscreenIcon.src = enterFullscreenAsset;
            } else {
                screenfull.request(this.container);
                this.isFullscreen = true;
                fullscreenIcon.src = exitFullscreenAsset;
            }
        }
    }

    // UI Object methods and Hover bind/unbind
    toggleState() {
        if (this.state != "stop") {
            if (this.state == "play") {
                this.pauseGame();
            } else {
                this.playGame();
            }
        }
    }

    end() {
        this.state = "stop";
        document.querySelector("#game-over-container").style.display = "block";
        let gameOutcomeDiv = document.querySelector("#game-outcome");
        let winner = this.stateVariable.winner;
        let wasDeathmatch = this.stateVariable.wasDeathmatch;
        let wasDeathmatchMessage = (wasDeathmatch) ? " by a deathmatch":" by score";
        if (winner === 0) {
            if (this.playerID === 1) {
                gameOutcomeDiv.innerHTML = "You Won" + wasDeathmatchMessage;
                gameOutcomeDiv.style.color = "#33ff33";
            } else {
                gameOutcomeDiv.innerHTML = "You Lost" + wasDeathmatchMessage;
                gameOutcomeDiv.style.color = "#ff3535";
            }
        } else if (winner === 1) {
            if (this.playerID === 1) {
                gameOutcomeDiv.innerHTML = "You Lost" + wasDeathmatchMessage;
                gameOutcomeDiv.style.color = "#ff3535";
            } else {
                gameOutcomeDiv.innerHTML = "You Won" + wasDeathmatchMessage;
                gameOutcomeDiv.style.color = "#33ff33";
            }
        } else {
            gameOutcomeDiv.innerHTML = "The game is a draw";
            gameOutcomeDiv.style.color = "#fff8b4";
        }

        // Stop Animations
        for (let soldierID in this.soldiers) {
            this.soldiers[soldierID].pauseAnimation();
        }
        for (let villagerID in this.villagers) {
            this.villagers[villagerID].pauseAnimation();
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

            let soldierSpeed = CONSTANTS.spriteConstants.soldierSprites.animationSpeed.values[this.speed.pointer];
            for (let soldierID in this.soldiers) {
                this.soldiers[soldierID].setAnimationSpeed(soldierSpeed);
            }
            let villagerSpeed = CONSTANTS.spriteConstants.villagerSprites.animationSpeed.values[this.speed.pointer];
            for (let villagerID in this.villagers) {
                this.villagers[villagerID].setAnimationSpeed(villagerSpeed);
            }
        }
    }

    decreaseSpeed() {
        if (this.speed.pointer > 0) {
            this.speed.pointer -= 1;
            this.speed.value = CONSTANTS.gameSpeed.actualValues[this.speed.pointer];
            this.updateSpeedDisplay();

            let soldierSpeed = CONSTANTS.spriteConstants.soldierSprites.animationSpeed.values[this.speed.pointer];
            for (let soldierID in this.soldiers) {
                this.soldiers[soldierID].setAnimationSpeed(soldierSpeed);
            }
            let villagerSpeed = CONSTANTS.spriteConstants.villagerSprites.animationSpeed.values[this.speed.pointer];
            for (let villagerID in this.villagers) {
                this.villagers[villagerID].setAnimationSpeed(villagerSpeed);
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
