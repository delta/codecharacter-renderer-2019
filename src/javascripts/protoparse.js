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
            villagerList = {};
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
                if (factory.isDead) {
                    // factory Destroyed
                    factoryList[factory.id].isDead = true;
                    factoryList[factory.id].levelHasChanged = true;
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

                factory.levelHasChanged = true;
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