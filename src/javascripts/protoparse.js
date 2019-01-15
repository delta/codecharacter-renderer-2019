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
            instructionLimit: rawDetails.instLimitTurn,
            states: this.processStates(rawDetails.states),
            errorMap: rawDetails.errorMap ? rawDetails.errorMap : {}
        };

        return stateVariable;
    }

    processStates(decodedStates) {
        let processedStates = [];
        let factoryList = {},
            deadFactory = [];
        for (let frame of decodedStates) {
            let processedFrame = {
                soldiers: this.processSoldiers(frame.soldiers),
                villagers: this.processVillagers(frame.villagers),
                factories: JSON.parse(JSON.stringify(this.processFactory(factoryList, frame.factories, deadFactory))),
                gold: frame.gold.slice(),
                instructionCounts: frame.instructionCounts.slice(),
                errors: frame.playerErrors
            };

            processedStates.push(processedFrame);
        }

        return processedStates;
    }

    processSoldiers(soldiers) {
        for (let i = 0; i < soldiers.length; i++) {
            soldiers[i].stateHasChanged = false;
            if (!soldiers[i].hasOwnProperty('hp'))
                soldiers[i].hp = 0;
            if (!soldiers[i].hasOwnProperty('x'))
                soldiers[i].x = 0;
            if (!soldiers[i].hasOwnProperty('y'))
                soldiers[i].y = 0;
            if (!soldiers[i].hasOwnProperty('state'))
                soldiers[i].state = 0;

            soldiers[i].playerId = soldiers[i].playerId;

            if (!soldiers[i].hasOwnProperty('direction')) {
                soldiers[i].direction = "down";
            } else {
                if(soldiers[i].state == 1) {
                    soldiers[i].direction = this.getMovementDirection(soldiers[i].targetX, soldiers[i].targetY, soldiers[i].x, soldiers[i].y);
                }
            }

        }

        return soldiers;
    }

    processVillagers(villagers) {
        for (let i = 0; i < villagers.length; i++) {
            villagers[i].stateHasChanged = false;
            if (!villagers[i].hasOwnProperty('hp'))
                villagers[i].hp = 0;
            if (!villagers[i].hasOwnProperty('x'))
                villagers[i].x = 0;
            if (!villagers[i].hasOwnProperty('y'))
                villagers[i].y = 0;
            if (!villagers[i].hasOwnProperty('state'))
                villagers[i].state = 0;

            villagers[i].playerId = villagers[i].playerId;

            if (!villagers[i].hasOwnProperty('direction')) {
                villagers[i].direction = "down";
            } else {
                if(villagers[i].state == 1) {
                    villagers[i].direction = this.getMovementDirection(villagers[i].targetX, villagers[i].targetY, villagers[i].x, villagers[i].y);
                }
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

    processFactory(factoryList, factories, deadFactory) {
        // No changes from frame
        if (factories === undefined && deadFactory.length === 0) {
            factoryList.hasChanged = false;
            return factoryList;
        }

        if (factories== undefined)
            factories = [];

        factoryList.hasChanged = true;
        let factoryCheckList = this.getCheckList(factoryList);

        // Updating dead factory
        for (let i = 0; i < deadFactory.length; i++) {
            let dyingFactory = factoryList[deadFactory[i]];
            delete factoryCheckList[dyingFactory.id];

            if (dyingFactory.framesLeft >= 0) {
                dyingFactory.framesLeft--;
                dyingFactory.levelHasChanged = false;
            } else {
                delete factoryList[deadFactory.id];
                deadFactory.splice(i, 1);
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

                    deadFactory.push(factory.id);
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

                factory.levelHasChanged = true;
                factory.updateMethod = "create";
                factoryList[factory.id] = Object.assign({}, factory);
            }
        }

        for (let towerID in factoryCheckList) {
            if ( isNaN(parseInt(towerID)) )
                continue;

            factoryList[towerID].updateMethod = "none";
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
