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
                soldiers: (frame.soldiers) ? this.processSoldiers(soldierList, frame.soldiers) : "",
                villagers: (frame.villagers) ? this.processVillagers(villagerList, frame.villagers) : "",
                factories: JSON.parse(JSON.stringify(this.processFactory(factoryList, frame.factories, deadFactories))),
                gold: frame.gold.slice(),
                instructionCounts: frame.instructionCounts.slice(),
                errors: frame.playerErrors
            };

            processedStates.push(processedFrame);
        }

        return processedStates;
    }

    processSoldiers(soldierList, soldiers) {
        const soldierIdleState = 0; // refer proto file for soldiers states
        const soldierMoveState = 1;
        for (let i = 0; i < soldiers.length; i++) {
            soldiers[i].stateHasChanged = false;
            if (!soldiers[i].hasOwnProperty('playerId'))
                soldiers[i].playerId = 1;
            if (!soldiers[i].hasOwnProperty('hp'))
                soldiers[i].hp = 0;
            if (!soldiers[i].hasOwnProperty('x'))
                soldiers[i].x = 0;
            if (!soldiers[i].hasOwnProperty('y'))
                soldiers[i].y = 0;
            if (!soldiers[i].hasOwnProperty('state'))
                soldiers[i].state = 0;
            // initial assign
            if (!soldierList.hasOwnProperty(i)) {
                soldiers[i].direction = "down";
                soldierList[i] = Object.assign({}, soldiers[i]);
            } else {
                // Set soldier direction
                if (soldiers[i].state == soldierMoveState) {
                    soldiers[i].direction = this.getMovementDirection(soldiers[i].x, soldiers[i].y, soldierList[i].x, soldierList[i].y);
                } else if (soldiers[i].state == soldierIdleState) {
                    soldiers[i].direction = soldierList[i].direction;
                } else {    // state = attack, mine, build
                    if (soldiers[i].targetX == -1 || soldiers[i].targetY == -1) {
                        soldiers[i].direction = soldierList[i].direction;
                    } else {
                        soldiers[i].direction = this.getMovementDirection(soldiers[i].targetX, soldiers[i].targetY, soldiers[i].x, soldiers[i].y);
                    }
                }

                // Change soldierList if soldiers has changed
                if (soldierList[i].state != soldiers[i].state || soldierList[i].direction != soldiers[i].direction) {
                    soldierList[i].state = soldiers[i].state;
                    soldierList[i].direction = soldiers[i].direction;
                    soldiers[i].stateHasChanged = true;
                }

                // Update temp list for next frame
                soldierList[i].x = soldiers[i].x;
                soldierList[i].y = soldiers[i].y;
            }
        }
        return soldiers;
    }

    processVillagers(villagerList, villagers) {
        const villagerIdleState = 0;    //check proto file for villager states
        const villagerMoveState = 1;
        for (let i = 0; i < villagers.length; i++) {
            villagers[i].stateHasChanged = false;
            if (!villagers[i].hasOwnProperty('playerId'))
                villagers[i].playerId = 1;
            if (!villagers[i].hasOwnProperty('hp'))
                villagers[i].hp = 0;
            if (!villagers[i].hasOwnProperty('x'))
                villagers[i].x = 0;
            if (!villagers[i].hasOwnProperty('y'))
                villagers[i].y = 0;
            if (!villagers[i].hasOwnProperty('state'))
                villagers[i].state = 0;
            // initial assign
            if (!villagerList.hasOwnProperty(i)) {
                villagers[i].direction = "down";
                villagerList[i] = Object.assign({}, villagers[i]);
            } else {
                // Set villager direction
                if (villagers[i].state == villagerMoveState) {
                    villagers[i].direction = this.getMovementDirection(villagers[i].x, villagers[i].y, villagerList[i].x, villagerList[i].y);
                } else if (villagers[i].state == villagerIdleState) {
                    villagers[i].direction = villagerList[i].direction;
                } else {    // state = attack, mine, build
                    if (villagers[i].targetX == -1 || villagers[i].targetY == -1) {
                        villagers[i].direction = villagerList[i].direction;
                    } else {
                        villagers[i].direction = this.getMovementDirection(villagers[i].targetX, villagers[i].targetY, villagers[i].x, villagers[i].y);
                    }
                }

                // Change villagerList if villagers has changed
                if (villagerList[i].state != villagers[i].state || villagerList[i].direction != villagers[i].direction) {
                    villagerList[i].state = villagers[i].state;
                    villagerList[i].direction = villagers[i].direction;
                    villagers[i].stateHasChanged = true;
                }

                // Update temp list for next frame
                villagerList[i].x = villagers[i].x;
                villagerList[i].y = villagers[i].y;
            }
        }
        return villagers;
    }

    getMovementDirection(currentX, currentY, prevX, prevY) {
        if (currentY - prevY > currentX - prevX) {
            if (currentY > prevY) {
                return "down";
            } else {
                return "up";
            }
        } else {
            if (currentX > prevX) {
                return "right";
            } else {
                return "left";
            }
        }
    }

    processSoldier(soldierList, soldiers, deadSoldiers) {
        // No changes from frame
        if (soldiers === undefined && deadSoldiers.length === 0) {
            soldierList.hasChanged = false;
            return soldierList;
        }

        if (soldiers == undefined)
            soldiers = [];

        soldierList.hasChanged = true;
        let soldierCheckList = this.getCheckList(soldierList);

        // Updating dead soldier
        for (let i = 0; i < deadSoldiers.length; i++) {
            let dyingSoldier = soldierList[deadSoldiers[i]];
            delete soldierCheckList[dyingSoldier.id];

            if (dyingSoldier.framesLeft >= 0) {
                dyingSoldier.framesLeft--;
            } else {
                delete soldierList[deadSoldiers.id];
                deadSoldiers.splice(i, 1);
                i -= 1;
            }
        }

        // Updating soldierList
        for (let soldier of soldiers) {
            if (!soldier.hasOwnProperty('id'))
                soldier.id = 0;

            if (soldierList.hasOwnProperty(soldier.id)) {   // checking if soldier isnt new (already exists in list)
                if (soldier.state === 3) {  // soldier state 3 = dead
                    soldierList[soldier.id].updateMethod = "destroy";
                    soldierList[soldier.id].framesLeft = CONSTANTS.factories.maxDeathFrames;

                    deadSoldiers.push(soldier.id);
                } else {
                    // Set soldier direction
                    if (soldier.state == 1) {   // state 1 = move
                        soldierList[soldier.id].direction = this.getMovementDirection(soldier.x, soldier.y, soldierList[soldier.id].x, soldierList[soldier.id].y);
                    } else if (soldier.targetX != -1 && soldier.targetY != -1) {    // attack
                        soldierList[soldier.id].direction = this.getMovementDirection(soldier.targetX, soldier.targetY, soldier.x, soldier.y);
                    }

                    // Change soldierList if soldiers state or direction has changed
                    if (soldierList[soldier.id].state != soldier.state || soldierList[soldier.id].direction != soldier.direction) {
                        soldierList[soldier.id].state = soldier.state;
                        soldierList[soldier.id].direction = soldier.direction;
                        soldierList[soldier.id].stateHasChanged = true;
                    }

                    // Update SOLdier list for next frame
                    soldierList[soldier.id].x = soldier.x;
                    soldierList[soldier.id].y = soldier.y;
                    soldierList[soldier.id].hp = soldier.hp;
                    soldierList[soldier.id].updateMethod = "update";
                }

                delete soldierCheckList[soldier.id];

            } else {
                // New Soldier
                if (!soldier.hasOwnProperty('playerId'))
                    soldier.playerId = 1;
                if (!soldier.hasOwnProperty('x'))
                    soldier.x = 0;
                if (!soldier.hasOwnProperty('y'))
                    soldier.y = 0;
                if (!soldier.hasOwnProperty('state'))
                    soldier.state = 0;
                if (!soldier.hasOwnProperty('hp'))
                    soldier.hp = 0;

                soldier.direction = "down"  //default
                soldier.updateMethod = "create";
                soldierList[soldier.id] = Object.assign({}, soldier);
            }
        }

        for (let soldierID in soldierCheckList) {
            if ( isNaN(parseInt(soldierID)) )
                continue;

            soldierList[soldierID].updateMethod = "none";
        }

        return soldierList;
    }

    processVillager(villagerList, villagers, deadVillagers) {
        // No changes from frame
        if (villagers === undefined && deadVillagers.length === 0) {
            villagerList.hasChanged = false;
            return villagerList;
        }

        if (villagers == undefined)
            villagers = [];

        villagerList.hasChanged = true;
        let villagerCheckList = this.getCheckList(villagerList);

        // Updating dead villager
        for (let i = 0; i < deadVillagers.length; i++) {
            let dyingVillager = villagerList[deadVillagers[i]];
            delete villagerCheckList[dyingVillager.id];

            if (dyingVillager.framesLeft >= 0) {
                dyingVillager.framesLeft--;
            } else {
                delete villagerList[deadVillagers.id];
                deadVillagers.splice(i, 1);
                i -= 1;
            }
        }

        // Updating villagerList
        for (let villager of villagers) {
            if (!villager.hasOwnProperty('id'))
                villager.id = 0;

            if (villagerList.hasOwnProperty(villager.id)) {   // checking if villager isnt new (already exists in list)
                if (villager.state === 5) {  // villager state 5 = dead
                    villagerList[villager.id].updateMethod = "destroy";
                    villagerList[villager.id].framesLeft = CONSTANTS.factories.maxDeathFrames;

                    deadVillagers.push(villager.id);
                } else {
                    // Set villager direction
                    if (villager.state == 1) {  // state 1 = move
                        villagerList[villager.id].direction = this.getMovementDirection(villager.x, villager.y, villagerList[villager.id].x, villagerList[villager.id].y);
                    } else if (villager.targetX != -1 && villager.targetY != -1) {  // build,mine,attack
                        villagerList[villager.id].direction = this.getMovementDirection(villager.targetX, villager.targetY, villager.x, villager.y);
                    }

                    // Change villagerList if villagers state or direction has changed
                    if (villagerList[villager.id].state != villager.state || villagerList[villager.id].direction != villager.direction) {
                        villagerList[villager.id].state = villager.state;
                        villagerList[villager.id].direction = villager.direction;
                        villagerList[villager.id].stateHasChanged = true;
                    }

                    // Update villager list for next frame
                    villagerList[villager.id].x = villager.x;
                    villagerList[villager.id].y = villager.y;
                    villagerList[villager.id].hp = villager.hp;
                    villagerList[villager.id].updateMethod = "update";
                }

                delete villagerCheckList[villager.id];

            } else {
                // New villager
                if (!villager.hasOwnProperty('playerId'))
                    villager.playerId = 1;
                if (!villager.hasOwnProperty('x'))
                    villager.x = 0;
                if (!villager.hasOwnProperty('y'))
                    villager.y = 0;
                if (!villager.hasOwnProperty('state'))
                    villager.state = 0;
                if (!villager.hasOwnProperty('hp'))
                    villager.hp = 0;

                villager.direction = "down"  //default
                villager.updateMethod = "create";
                villagerList[villager.id] = Object.assign({}, villager);
            }
        }

        for (let villagerID in villagerCheckList) {
            if ( isNaN(parseInt(villagerID)) )
                continue;

            villagerList[villagerID].updateMethod = "none";
        }

        return villagerList;
    }

    processFactory(factoryList, factories, deadFactories) {
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

        // Updating factoryList
        for (let factory of factories) {
            if (!factory.hasOwnProperty('id'))
                factory.id = 0;

            if (factoryList.hasOwnProperty(factory.id)) {
                if (factory.state === 4) { // factory state 4 = destroyed
                    factoryList[factory.id].updateMethod = "destroy";
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
                if (!factory.hasOwnProperty('playerId'))
                    factory.playerId = 1;
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