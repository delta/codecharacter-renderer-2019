import * as PROTOBUF from 'protobufjs';
import gameProtoFile from "../proto/game.proto";
import CONSTANTS from './constants/constants.js';

export default class Proto {
    constructor(logFile) {
        this.logFile = logFile;
    }

    // Function fetches game log file, and returns the parsed proto object
    async getGame() {
        return new Promise(async (resolve, reject) => {
            let root = await PROTOBUF.load(gameProtoFile);
            let Game = root.lookupType("proto.Game");
            console.log(Game);
            let message = Game.decode(this.logFile);
            let rawDetails = Game.toObject(message);
            let resultObject = this.processRawObject(rawDetails);
            resolve(resultObject);
        });
    }

    // Takes a raw object decoded from a proto file, and returns a proper
    // ordered version of the state at each frame
    processRawObject(rawDetails) {
        console.log( "RawState: ", JSON.parse(JSON.stringify(rawDetails)) );

        let stateVariable = {
            soldierMaxHp: rawDetails.soldierMaxHp,
            villagerMaxHp: rawDetails.villagerMaxHp,
            factoryMaxHps: rawDetails.factoryMaxHp,
            mapSize: rawDetails.mapSize,
            mapElementSize: rawDetails.mapElementSize,
            mapElements: rawDetails.mapElements,
            instructionLimit: rawDetails.instLimitTurn,
            states: this.processStates(rawDetails.states),
            wasDeathmatch: rawDetails.wasDeathmatch || 0,
            winner: rawDetails.winner || 0,
            errorMap: rawDetails.errorMap ? rawDetails.errorMap : {}
        };

        return stateVariable;
    }

    processStates(decodedStates) {
        let processedStates = [];
        let soldierList = {},
            deadSoldiers = [];
        let villagerList = {},
            deadVillagers = [];
        let factoryList = {},
            deadFactories = [];
        for (let frame of decodedStates) {
            let processedFrame = {
                soldiers: JSON.parse(JSON.stringify(this.processSoldiers(soldierList, frame.soldiers, deadSoldiers))),
                villagers: JSON.parse(JSON.stringify(this.processVillagers(villagerList, frame.villagers, deadVillagers))),
                factories: JSON.parse(JSON.stringify(this.processFactories(factoryList, frame.factories, deadFactories))),
                gold: frame.gold.slice(),
                scores: frame.scores.slice(),
                instructionCounts: frame.instructionCounts.slice(),
                errors: frame.playerErrors
            };

            processedStates.push(processedFrame);
        }

        return processedStates;
    }

    getMovementDirection(currentX, prevX, prevDirection) {
        if (currentX === prevX) {
            return prevDirection;
        }

        if (currentX > prevX) {
            return "right";
        }

        return "left";
    }

    processSoldiers(soldierList, soldiers, deadSoldiers) {
        if (soldiers == undefined)
            soldiers = [];

        // creating a soldier check list
        let soldierCheckList = this.getCheckList(soldierList);
        const SOLDIER_MOVE_STATE = 1; // check proto for const vals
        const SOLDIER_DEAD_STATE = 3;

        // Updating dead soldier
        for (let i = 0; i < deadSoldiers.length; i++) {
            let dyingSoldier = soldierList[deadSoldiers[i]];
            delete soldierCheckList[dyingSoldier.id];

            if (dyingSoldier.framesLeft >= 0) {
                dyingSoldier.framesLeft--;
            } else {
                delete soldierList[deadSoldiers[i]];
                deadSoldiers.splice(i, 1);
                i -= 1;
            }
        }

        // Updating soldierList
        for (let soldier of soldiers) {
            if (!soldier.hasOwnProperty('id'))
                soldier.id = 0;
            if (!soldier.hasOwnProperty('playerId'))
                soldier.playerId = 0;
            if (!soldier.hasOwnProperty('x'))
                soldier.x = 0;
            if (!soldier.hasOwnProperty('y'))
                soldier.y = 0;
            if (!soldier.hasOwnProperty('state'))
                soldier.state = 0;
            if (!soldier.hasOwnProperty('hp'))
                soldier.hp = 0;

            soldier.playerId += 1;  // since rawObject playerId 0 = renderer playerId 1 (and 1 = 2)

            // Flip x and y coordinates to match Array based positions
            [soldier.x, soldier.y] = [soldier.y, soldier.x];
            [soldier.targetX, soldier.targetY] = [soldier.targetY, soldier.targetX];

            // checking if soldier isnt new (already exists in list)
            if (soldierList.hasOwnProperty(soldier.id)) {
                soldierList[soldier.id].stateHasChanged = false;

                // all states except dead, set soldier direction
                let prevDirection = soldierList[soldier.id].direction;
                if (soldier.state == SOLDIER_MOVE_STATE) {   // state 1 = move
                    soldierList[soldier.id].direction = this.getMovementDirection(soldier.x, soldierList[soldier.id].x, prevDirection);
                } else if (soldier.targetX != -1 && soldier.targetY != -1) {    // attack
                    soldierList[soldier.id].direction = this.getMovementDirection(soldier.targetX, soldier.x, prevDirection);
                }

                if (soldierList[soldier.id].direction != prevDirection) {
                    soldierList[soldier.id].stateHasChanged = true;
                }

                // Change soldierList if soldiers state has changed
                if (soldierList[soldier.id].state != soldier.state) {
                    soldierList[soldier.id].state = soldier.state;
                    soldierList[soldier.id].stateHasChanged = true;
                }

                // Update Soldier list for next frame
                soldierList[soldier.id].x = soldier.x;
                soldierList[soldier.id].y = soldier.y;
                soldierList[soldier.id].hp = soldier.hp;
                soldierList[soldier.id].updateMethod = "update";

                delete soldierCheckList[soldier.id];
            } else {
                // New Soldier
                soldier.direction = "down"  //default
                soldier.updateMethod = "create";
                soldierList[soldier.id] = Object.assign({}, soldier);
                soldierList[soldier.id].stateHasChanged = false;
            }
        }

        // If current soldier list doesn't have a soldier from prev frame, that soldier is dead
        for (let soldierID in soldierCheckList) {
            // Dead soldier
            soldierList[soldierID].updateMethod = "destroy";
            soldierList[soldierID].direction = "down";
            soldierList[soldierID].hp = 0;
            soldierList[soldierID].state = SOLDIER_DEAD_STATE;
            soldierList[soldierID].framesLeft = CONSTANTS.units.maxDeathFrames;
            deadSoldiers.push(soldierID);
        }

        return soldierList;
    }

    processVillagers(villagerList, villagers, deadVillagers) {
        if (villagers == undefined)
            villagers = [];

        // creating a villager check list
        let villagerCheckList = this.getCheckList(villagerList);
        const VILLAGER_MOVE_STATE = 1;    // check proto for vals
        const VILLAGER_DEAD_STATE = 5;

        // Updating dead villager
        for (let i = 0; i < deadVillagers.length; i++) {
            let dyingVillager = villagerList[deadVillagers[i]];
            delete villagerCheckList[dyingVillager.id];

            if (dyingVillager.framesLeft >= 0) {
                dyingVillager.framesLeft--;
            } else {
                delete villagerList[deadVillagers[i]];
                deadVillagers.splice(i, 1);
                i -= 1;
            }
        }

        // Updating villagerList
        for (let villager of villagers) {
            if (!villager.hasOwnProperty('id'))
                villager.id = 0;
            if (!villager.hasOwnProperty('playerId'))
                villager.playerId = 0;
            if (!villager.hasOwnProperty('x'))
                villager.x = 0;
            if (!villager.hasOwnProperty('y'))
                villager.y = 0;
            if (!villager.hasOwnProperty('state'))
                villager.state = 0;
            if (!villager.hasOwnProperty('hp'))
                villager.hp = 0;

            villager.playerId += 1;  // since rawObject playerId 0 = renderer playerId 1 (and 1 = 2)

            // Flip x and y coordinates to match Array based positions
            [villager.x, villager.y] = [villager.y, villager.x];
            [villager.targetX, villager.targetY] = [villager.targetY, villager.targetX];

            // checking if villager isnt new (already exists in list)
            if (villagerList.hasOwnProperty(villager.id)) {
                villagerList[villager.id].stateHasChanged = false;

                // all states except dead set villager direction
                let prevDirection = villagerList[villager.id].direction;
                if (villager.state == VILLAGER_MOVE_STATE) {  // state 1 = move
                    villagerList[villager.id].direction = this.getMovementDirection(villager.x, villagerList[villager.id].x, prevDirection);
                } else if (villager.targetX != -1 && villager.targetY != -1) {  // attack,build,mine
                    villagerList[villager.id].direction = this.getMovementDirection(villager.targetX, villager.x, prevDirection);
                }

                if (villagerList[villager.id].direction != prevDirection) {
                    villagerList[villager.id].stateHasChanged = true;
                }

                // Change villagerList if villagers state has changed
                if (villagerList[villager.id].state != villager.state) {
                    villagerList[villager.id].state = villager.state;
                    villagerList[villager.id].stateHasChanged = true;
                }

                // Update villager list for next frame
                villagerList[villager.id].x = villager.x;
                villagerList[villager.id].y = villager.y;
                villagerList[villager.id].hp = villager.hp;
                villagerList[villager.id].updateMethod = "update";

                delete villagerCheckList[villager.id];
            } else {
                // New villager
                villager.direction = "down"  //default
                villager.updateMethod = "create";
                villagerList[villager.id] = Object.assign({}, villager);
                villagerList[villager.id].stateHasChanged = false;
            }
        }

        // If current villager list doesn't have a villager from prev frame, that villager is dead
        for (let villagerID in villagerCheckList) {
            // Dead villager
            villagerList[villagerID].updateMethod = "destroy";
            villagerList[villagerID].direction = "down";
            villagerList[villagerID].hp = 0;
            villagerList[villagerID].state = VILLAGER_DEAD_STATE;
            villagerList[villagerID].framesLeft = CONSTANTS.units.maxDeathFrames;
            deadVillagers.push(villagerID);
        }

        return villagerList;
    }

    processFactories(factoryList, factories, deadFactories) {
        // No changes from frame
        if (factories === undefined && deadFactories.length === 0) {
            factoryList.hasChanged = false;
            return factoryList;
        }

        if (factories== undefined)
            factories = [];

        factoryList.hasChanged = true;
        let factoryCheckList = this.getCheckList(factoryList);

        // Updating dead factory
        for (let i = 0; i < deadFactories.length; i++) {
            let dyingFactory = factoryList[deadFactories[i]];
            delete factoryCheckList[dyingFactory.id];

            if (dyingFactory.framesLeft >= 0) {
                dyingFactory.framesLeft--;
                dyingFactory.levelHasChanged = false;
            } else {
                delete factoryList[deadFactories.id];
                deadFactories.splice(i, 1);
                i -= 1;
            }
        }

        const FACTORY_DEAD_STATE = 4;

        // Updating factoryList
        for (let factory of factories) {
            if (!factory.hasOwnProperty('id'))
                factory.id = 0;
            if (!factory.hasOwnProperty('playerId'))
                factory.playerId = 0;
            if (!factory.hasOwnProperty('state'))
                factory.state = 0;

            factory.playerId += 1;    // since rawObject playerId 0 = renderer playerId 1 (and 1 = 2)

            // Flip x and y coordinates to match Array based positions
            [factory.x, factory.y] = [factory.y, factory.x];

            if (factoryList.hasOwnProperty(factory.id)) {
                if (factory.state === FACTORY_DEAD_STATE) { // factory state 4 = destroyed
                    factoryList[factory.id].updateMethod = "destroy";
                    factoryList[factory.id].hp = 0;
                    factoryList[factory.id].framesLeft = CONSTANTS.factories.maxDeathFrames;

                    deadFactories.push(factory.id);
                } else {
                    // factory state and/or HP and/or build have changed

                    factoryList[factory.id].hp = factory.hp;
                    factoryList[factory.id].state = factory.state;
                    factoryList[factory.id].buildPercent = factory.buildPercent;

                    factoryList[factory.id].updateMethod = "update";
                }

                delete factoryCheckList[factory.id];

            } else {
                // New Factory
                if (!factory.hasOwnProperty('x'))
                    factory.x = 0;
                if (!factory.hasOwnProperty('y'))
                    factory.y = 0;
                if (!factory.hasOwnProperty('buildPercent'))
                    factory.buildPercent = 0;

                factory.updateMethod = "create";
                factoryList[factory.id] = Object.assign({}, factory);
            }
        }

        for (let factoryID in factoryCheckList) {
            if ( isNaN(parseInt(factoryID)) )
                continue;

            factoryList[factoryID].updateMethod = "none";
        }

        return factoryList;
    }

    getCheckList(towerList) {
        let checkList = {};

        for (let key of Object.keys(towerList)) {
            if ( isNaN(parseInt(key)) )
                continue;

            checkList[key] = null;
        }

        return checkList;
    }
}