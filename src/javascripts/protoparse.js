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
            towerMaxHps: rawDetails.towerMaxHps.slice(),
            towerRanges: rawDetails.towerRanges.slice(),
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
                case 0:
                    processedRow.push(undefined);
                    break;
                case 1:
                    processedRow.push('w');
                    break;
                case 2:
                    processedRow.push('l');
                    break;
                }
            }
            terrain.push(processedRow);
        }

        return terrain;
    }

    processStates(decodedStates) {
        let processedStates = [];
        let towerList = {},
            deadTowers = [];
        for (let frame of decodedStates) {
            let processedFrame = {
                soldiers: this.processSoldiers(frame.soldiers),
                towers: this.processTowers(towerList, frame.towers, deadTowers),
                money: frame.money.slice()
            };

            processedStates.push(processedFrame);
        }

        return processedStates;
    }

    processSoldiers(soldiers) {
        for (let i = 0; i < soldiers.length; i++) {
            if (!soldiers[i].hasOwnProperty('hp'))
                soldiers[i].hp = 0;
            if (!soldiers[i].hasOwnProperty('x'))
                soldiers[i].x = 0;
            if (!soldiers[i].hasOwnProperty('y'))
                soldiers[i].y = 0;
            if (!soldiers[i].hasOwnProperty('state'))
                soldiers[i].state = 0;

            if (i < soldiers.length/2)
                soldiers[i].playerId = 0;
            else soldiers[i].playerId = 1;
        }

        return soldiers;
    }

    processTowers(towerList, towers, deadTowers) {
        for (let tower of towers) {
            if (!tower.hasOwnProperty('id'))
                tower.id = 0;
            if (!tower.hasOwnProperty('playerId'))
                tower.playerId = 0;

            if (towerList.hasOwnProperty(tower.id)) {
                if (tower.is_dead === true) {
                    // Tower Destroyed
                    console.log("hi")
                    towerList[tower.id].is_dead = true;
                    towerList[tower.id].framesLeft = CONSTANTS.towers.maxDeathFrames;
                    deadTowers.push(tower.id);
                } else {
                    // "hp" and "towerlevel" have changed
                    for (let property in tower) {
                        towerList[tower.id][property] = tower[property];
                    }
                }
            } else {
                // New Tower
                if (!tower.hasOwnProperty('x'))
                    tower.x = 0;
                if (!tower.hasOwnProperty('y'))
                    tower.y = 0;

                towerList[tower.id] = JSON.parse(JSON.stringify(tower));
            }
        }

        for (let i = 0; i < deadTowers.length; i++) {
            let deadTowerID = deadTowers[i];
            if (towerList[deadTowerID].framesLeft >= 0) {
                towerList[deadTowerID].framesLeft--;
            } else {
                deadTowers.splice(i, 1);
                delete towerList[deadTowerID];
            }
        }

        return towerList;
    }
}
