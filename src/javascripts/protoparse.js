import * as PROTOBUF from 'protobufjs';

export default class Proto {
    constructor() {}

    // Function fetches game log file, and returns the parsed proto object
    async getGame() {
        return new Promise((resolve, reject) => {
            PROTOBUF.load("assets/game.proto", async (err, root) => {
                if (err)
                    throw err;
                let response = await fetch('assets/game.log');
                let byteArray = new Uint8Array(await response.arrayBuffer());
                let Game = root.lookupType("proto.Game");
                let message = Game.decode(byteArray);
                let rawDetails = Game.toObject(message);
                let resultObject = this.processRawObject(rawDetails);
                resolve(resultObject);
            });
        });
    }

    // Takes a raw object decoded from a proto file, and returns a proper
    // ordered version of the state at each frame
    processRawObject(rawDetails) {
        let stateVariable = {
            soldierMaxHp: rawDetails.soldierMaxHp,
            towerMaxHps: rawDetails.towerMaxHps.slice(),
            towerRanges: rawDetails.towerRanges.slice(),
            terrain: this.processTerrain(rawDetails.terrain.rows),
            states: this.processStates(rawDetails.states)
        };

        return stateVariable;
    }

    processTerrain(terrainRows) {
        var terrain = [];

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
        var processedStates = [];

        for (let frame of decodedStates) {
            let processedFrame = {
                soldiers: this.processSoldiers(frame.soldiers),
                towers: this.processTowers(frame.towers),
                money: frame.money.slice()
            };

            processedStates.push(processedFrame);
        }

        return processedStates;
    }

    processSoldiers(soldiers) {
        return soldiers;
    }

    processTowers(towers) {
        var processedTowers = [];
        var towerList = {};
        for (let tower of towers) {
            if (towerList.hasOwnProperty(tower.id)) {

                if (tower.is_dead === true) {
                    delete towerList[tower.id];
                } else {
                    for (let property in tower) {
                        towerList[tower.id][property] = tower[property];
                    }
                }

            } else {
                towerList[tower.id] = JSON.parse(JSON.stringify(tower));
            }
            processedTowers.push(towerList)
        }

        return processedTowers;
    }
}
