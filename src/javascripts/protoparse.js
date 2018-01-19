import * as PROTOBUF from 'protobufjs';
import gameProtoFile from "../proto/game.proto";
import CONSTANTS from './constants';

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
        let stateVariable = {
            soldierMaxHp: rawDetails.soldierMaxHp,
            terrainElementSize: rawDetails.mapElementSize,
            tower: {
                maxHps: rawDetails.towerMaxHps.slice(),
                ranges: rawDetails.towerRanges.slice()
            },
            terrain: this.processTerrain(rawDetails.terrain.rows),
            states: this.processStates(rawDetails.states)
        };

        return stateVariable;
    }

    processTerrain(terrainRows) {
        let terrain = [];

        for (let row of terrainRows) {
            let processedRow = [];

            for (let element of row.elements) {
                switch (element.type) {
                case 1:
                    processedRow.push('l');
                    break;
                default:
                    processedRow.push('w');
                    break;
                }
            }
            terrain.push(processedRow);
        }

        return terrain;
    }

    processStates(decodedStates) {
        let processedStates = [];
        let soldierList = {};
        let towerList = {},
            deadTowers = [];
        for (let frame of decodedStates) {
            let processedFrame = {
                soldiers: this.processSoldiers(soldierList, frame.soldiers),
                towers: this.processTowers(towerList, frame.towers, deadTowers),
                money: frame.money.slice()
            };

            processedStates.push(processedFrame);
        }

        return processedStates;
    }

    processSoldiers(soldierList, soldiers) {
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

            soldiers[i].playerId = (i < soldiers.length/2) ? 0 : 1;

            if (!soldierList.hasOwnProperty(i)) {
                soldierList[i] = Object.assign({}, soldiers[i]);
            } else {
                if (soldierList[i].state != soldiers[i].state) {
                    soldiers[i].stateHasChanged = true;
                }
            }
        }

        return soldiers;
    }

    processTowers(towerList, towers, deadTowers) {
        if (towers === undefined && deadTowers.length === 0) {
            towerList.hasChanged = false;
            return towerList;
        }

        towerList.hasChanged = true;

        for (let i = 0; i < deadTowers.length; i++) {
            let deadTower = towerList[deadTowers[i]];
            if (deadTower.framesLeft >= 0) {
                deadTower.framesLeft--;
                deadTower.levelHasChanged = false;
            } else {
                deadTowers.splice(i, 1);
                delete towerList[deadTower.id];
            }
        }

        for (let tower of towers) {
            if (!tower.hasOwnProperty('id'))
                tower.id = 0;
            if (!tower.hasOwnProperty('playerId'))
                tower.playerId = 0;

            if (towerList.hasOwnProperty(tower.id)) {
                if (tower.is_dead === true) {
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

                    // for (let property in tower) {
                    //     towerList[tower.id][property] = tower[property];
                    // }
                    towerList[tower.id].hp = tower.hp;
                    towerList[tower.id].towerLevel = tower.towerLevel;

                    towerList[tower.id].updateMethod = "update";
                }
            } else {
                // New Tower
                if (!tower.hasOwnProperty('x'))
                    tower.x = 0;
                if (!tower.hasOwnProperty('y'))
                    tower.y = 0;

                tower.levelHasChanged = true;
                tower.updateMethod = "create";
                towerList[tower.id] = Object.assign({}, tower);
            }
        }

        return JSON.parse(JSON.stringify(towerList));
    }
}
