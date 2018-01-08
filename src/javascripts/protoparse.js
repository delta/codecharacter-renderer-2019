import * as PROTOBUF from 'protobufjs';

export default class Proto {
    constructor() {}

    // Function fetches game log file, and returns the parsed proto object
    getGame() {
        return new Promise((resolve, reject) => {
            PROTOBUF.load("assets/game.proto", (err, root) => {
                if (err)
                    throw err;
                let request = new XMLHttpRequest();
                request.open('GET', 'assets/game.log', true);
                request.send(null);
                request.responseType = "arraybuffer";
                request.onreadystatechange = () => {
                    if (request.readyState === 4 && request.status === 200) {
                        let byteArray = new Uint8Array(request.response);
                        let Game = root.lookupType("proto.Game");
                        let message = Game.decode(byteArray);
                        let rawDetails = Game.toObject(message);
                        let resultObject = this.processRawObject(rawDetails);
                        resolve(resultObject);
                    }
                }
            });
        });
    }

    // Takes a raw object decoded from a proto file, and returns a proper
    // ordered version of the state at each frame
    processRawObject(rawDetails) {
        let finalState = {
            soldierMaxHp: rawDetails.soldierMaxHp,
            towerMaxHps: rawDetails.towerMaxHps,
            towerRanges: rawDetails.towerRanges,
            terrain: [],
            states: [],
        };

        for (let row of rawDetails.terrain.rows) {
            let finalRow = [];
            for (let element of row.elements) {
                switch (element.type) {
                case 0: finalRow.push(undefined);
                    break;
                case 1: finalRow.push('w');
                    break;
                case 2: finalRow.push('l');
                    break;
                }
            }
            finalState.terrain.push(finalRow);
        }

        let towerList = {};

        for (let frame of rawDetails.states) {
            let stateFrame = {
                soldiers: JSON.parse(JSON.stringify(frame.soldiers)),
                money: JSON.parse(JSON.stringify(frame.money)),
            };

            for (let tower of frame.towers) {
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
            }
            stateFrame.towers = JSON.parse(JSON.stringify(towerList));
            finalState.states.push(JSON.parse(JSON.stringify(stateFrame)));
        }

        return finalState;
    }
}
