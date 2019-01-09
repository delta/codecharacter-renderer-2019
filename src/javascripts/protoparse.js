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
            factoryMaxHps: rawDetails.factoryMaxHps.slice(),
            mapSize: rawDetails.mapize,
            mapElementSize: rawDetails.mapElementSize,
            instructionLimit: rawDetails.instLimitTurn,
            states: this.processStates(rawDetails.states),
            errorMap: rawDetails.errorMap ? rawDetails.errorMap : {}
        };

        return stateVariable;
    }

    processStates(decodedStates) {
        let processedStates = [];
        let towerList = {},
            deadTowers = [];
        for (let frame of decodedStates) {
            let processedFrame = {
                soldiers: this.processSoldiers(frame.soldiers),
                villagers: this.processVillagers(frame.soldiers),
                towers: JSON.parse(JSON.stringify(this.processTowers(towerList, frame.towers, deadTowers))),
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

    processTowers(towerList, towers, deadTowers) {
        if (towers === undefined && deadTowers.length === 0) {
            towerList.hasChanged = false;
            return towerList;
        }

        if (towers === undefined)
            towers = [];

        towerList.hasChanged = true;
        let towerCheckList = this.getCheckList(towerList);

        // Updating dead towers
        for (let i = 0; i < deadTowers.length; i++) {
            let deadTower = towerList[deadTowers[i]];
            delete towerCheckList[deadTower.id];

            if (deadTower.framesLeft >= 0) {
                deadTower.framesLeft--;
                deadTower.levelHasChanged = false;
            } else {
                delete towerList[deadTower.id];
                deadTowers.splice(i, 1);
                i -= 1;
            }
        }

        // Updating towerList
        for (let tower of towers) {
            if (!tower.hasOwnProperty('id'))
                tower.id = 0;
            if (!tower.hasOwnProperty('playerId') || tower.playerId === 0)
                tower.playerId = 1;
            else tower.playerId = 2;

            if (towerList.hasOwnProperty(tower.id)) {
                if (tower.isDead) {
                    // Tower Destroyed
                    towerList[tower.id].isDead = true;
                    towerList[tower.id].levelHasChanged = true;
                    towerList[tower.id].updateMethod = "destroy";
                    towerList[tower.id].framesLeft = CONSTANTS.towers.maxDeathFrames;

                    deadTowers.push(tower.id);
                } else {
                    // Tower level and/or HP have changed
                    towerList[tower.id].levelHasChanged =
                        (towerList[tower.id].towerLevel == tower.towerLevel) ? false : true;

                    towerList[tower.id].hp = tower.hp;
                    towerList[tower.id].towerLevel = tower.towerLevel;

                    towerList[tower.id].updateMethod = "update";
                }

                delete towerCheckList[tower.id];

            } else {
                // New Tower
                if (!tower.hasOwnProperty('x'))
                    tower.x = 0;
                if (!tower.hasOwnProperty('y'))
                    tower.y = 0;
                if (!tower.hasOwnProperty('isBase'))
                    tower.isBase = false;

                tower.levelHasChanged = true;
                tower.updateMethod = "create";
                towerList[tower.id] = Object.assign({}, tower);
            }
        }

        for (let towerID in towerCheckList) {
            if ( isNaN(parseInt(towerID)) )
                continue;

            towerList[towerID].updateMethod = "none";
        }

        return towerList;
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
