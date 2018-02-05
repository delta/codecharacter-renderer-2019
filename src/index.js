import React                                from "react";
import ReactDOM                             from "react-dom";
import * as PIXI                            from 'pixi.js';
import { initRenderer, initGame }           from "./javascripts/driver.js";
import pauseAsset                           from "./assets/pause.svg";
import resetAsset                           from "./assets/restart.svg";
import slowDownAsset                        from "./assets/slow-down.svg";
import speedUpAsset                         from "./assets/speed-up.svg";
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
                        <div className="value player-details">Score:</div>
                        <div className="value p1-color" id="p1-score"></div> | <div className="value p2-color" id="p2-score"></div>
                    </div>
                    <div className="label top-label" id="money-container">
                        <div className="value player-details">$: </div>
                        <div className="value" id="money-value"></div>
                    </div>
                    <div className="label top-label" id="instr-count-container">
                        <div className="value player-details">Instr: </div>
                        <div className="value" id="instr-count-value"></div> / <div className="value" id="instr-count-limit"></div>
                    </div>
                </div>
                <div className="bottom-container" id="pause-icon-container">
                    <img className="icon" id="pause-icon" src={pauseAsset} />
                    <img className="icon" id="reset-icon" onClick={this.state.resetGame} src={resetAsset} />
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
            </div>
        );
    }
}

export function initializeRendererAssets(callback) {
    initRenderer(callback);
}

