import React                                from "react";
import ReactDOM                             from "react-dom";
import * as PIXI                            from 'pixi.js';
import { initRenderer, initGame }           from "./javascripts/driver.js";
import pauseAsset                           from "./assets/pause.svg";
import resetAsset                           from "./assets/restart.svg";
import enterFullscreenAsset                 from "./assets/enterfullscreen.png";
import slowDownAsset                        from "./assets/slow-down.svg";
import speedUpAsset                         from "./assets/speed-up.svg";
import soldierP1Icon                        from "./assets/Soldier_P1_Icon.png"
import soldierP2Icon                        from "./assets/Soldier_P2_Icon.png"
import villagerP1Icon                       from "./assets/Villager_P1_Icon.png"
import villagerP2Icon                       from "./assets/Villager_P2_Icon.png"
import factoryP1Icon                        from "./assets/Factory_P1_Icon.png"
import factoryP2Icon                        from "./assets/Factory_P2_Icon.png"
import "./stylesheets/renderer.css";

export default class CodeCharacterRenderer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            logFunction: this.props.logFunction,
            playerID: this.props.playerID,
            resetGame: () => initGame(this.props.logFile, this.props.options)
        };
    }

    componentDidMount() {
        initGame(this.props.logFile, this.props.options);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.logFile.toString() != this.props.logFile.toString()) {
            initGame(nextProps.logFile, nextProps.options);
        }
    }

    render() {
        return (
            <div id="renderer-container">
                <div className="top-container" id="top-right-container">
                    <div className="label top-label" id="score-container">
                        <div className="value player-details">Score: </div>
                        <div className="value p1-color" id="p1-score"></div> | <div className="value p2-color" id="p2-score"></div>
                    </div>
                    <div className="label top-label" id="money-container">
                        <div className="value player-details">Gold: </div>
                        <div className="value" id="money-value"></div>
                    </div>
                    <div className="label top-label" id="instr-count-container">
                        <div className="value player-details">Instr: </div>
                        <div className="value" id="instr-count-value"></div> / <div className="value" id="instr-count-limit"></div>
                    </div>
                    <div className="count-div">
                        <div className="count-p1-div">
                            <div className="count">
                                <img className="unit-asset" src={soldierP1Icon} />
                                <div id="soldier-p1">0</div>
                            </div>
                            <div className="count">
                                <img className="unit-asset" src={villagerP1Icon} />
                                <div id="villager-p1">0</div>
                            </div>
                            <div className="count">
                                <img className="factory-asset" src={factoryP1Icon} />
                                <div id="factory-p1">0</div>
                            </div>
                        </div>
                        <div className="count-p2-div">
                            <div className="count">
                                <img className="unit-asset" src={soldierP2Icon} />
                                <div id="soldier-p2">0</div>
                            </div>
                            <div className="count">
                                <img className="unit-asset" src={villagerP2Icon} />
                                <div id="villager-p2">0</div>
                            </div>
                            <div className="count">
                                <img className="factory-asset" src={factoryP2Icon} />
                                <div id="factory-p2">0</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="top-container" id="top-left-container">
                    <div className="details-div" id="actor-type"></div>
                    <div className="details-div" id="actor-id"></div>
                    <div className="details-div" id="actor-position"></div>
                    <div className="details-div" id="actor-hp"></div>
                    <div className="details-div" id="actor-state"></div>
                </div>
                <div className="bottom-container" id="pause-icon-container">
                    <img className="icon" id="pause-icon" src={pauseAsset} />
                    <img className="icon" id="reset-icon" onClick={this.state.resetGame} src={resetAsset} />
                    <img className="icon" id="fullscreen-icon" src={enterFullscreenAsset} />
                </div>
                <div className="bottom-container" id="speed-icons-container">
                    <div className="label" id="speed-container">SPEED: <div className="value" id="speed-value"></div></div>
                    <img className="icon" id="slow-down-icon" src={slowDownAsset} />
                    <img className="icon" id="speed-up-icon" src={speedUpAsset} />
                </div>
                <div className="bottom-container" id="game-over-container">
                    <div className="label" id="game-over-msg">Game Complete</div>
                    <div className="label" id="game-outcome"></div>
                </div>
                <div id="controls-div">
                    <center><b>Controls</b></center>
                    <p><span>Drag/&uarr;&darr;&larr;&rarr;: </span>Move camera</p>
                    <p><span>+/Scroll Up: </span>Zoom In</p>
                    <p><span>-/Scroll Down: </span>Zoom Out</p>
                    <p><span>]: </span>Speed Up</p>
                    <p><span>[: </span>Speed Down</p>
                    <p><span>f: </span>Fullscreen</p>
                    <p><span>Spacebar/P: </span>Pause, Play</p>
                </div>
                <div className="bottom-container" id="help-icon">?</div>
            </div>
        );
    }
}

export function initializeRendererAssets(callback) {
    initRenderer(callback);
}

