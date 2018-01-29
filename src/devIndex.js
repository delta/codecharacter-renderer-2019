import React                                                from "react";
import ReactDOM                                             from 'react-dom';
import CodeCharacterRenderer                                from './index.js';
import { initializeRendererAssets }                         from './index.js';

document.body.style.width = "100%";
document.body.style.height = "100%";
document.body.style.margin = "0";
document.body.style.padding = "0";

initializeRendererAssets(initGameLog);

async function initGameLog() {
    let response = fetch('proto/game.log');
    let gameLog1 = fetch('proto/player_1.dlog');
    let gameLog2 = fetch('proto/player_2.dlog');

    let buffer = await (await response).arrayBuffer();
    let logFile = new Uint8Array(buffer);

    let options = {
        logFunction: console.log,
        playerID: 2,
        player1Log: await (await gameLog1).text(),
        player2Log: await (await gameLog2).text()
    };
    ReactDOM.render((
        <CodeCharacterRenderer logFile={logFile} options={options} />
    ), document.getElementById("root"));
}
