import React                                from "react";
import ReactDOM                             from "react-dom";
import * as PIXI                            from 'pixi.js';
import { initRenderer, initGame }           from "./javascripts/driver.js";
import pauseAsset                           from "./assets/pause.svg";
import slowDownAsset                        from "./assets/slow-down.svg";
import speedUpAsset                         from "./assets/speed-up.svg";
import "./stylesheets/renderer.css";

export default class CodeCharacterRenderer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            logFunction: this.props.logFunction,
            playerID: this.props.playerID
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
                <div id="top-container">
                    <div className="label" id="money-container">Money: <div className="value" id="money-value"></div></div>
                </div>
                <div className="bottom-container" id="pause-icon-container">
                    <img className="icon" id="pause-icon" src={pauseAsset} />
                </div>
                <div className="bottom-container" id="speed-icons-container">
                    <div className="label" id="speed-container">SPEED: <div className="value" id="speed-value">1.0</div></div>
                    <img className="icon speed-icon" id="slow-down-icon" src={slowDownAsset} />
                    <img className="icon speed-icon" id="speed-up-icon" src={speedUpAsset} />
                </div>
            </div>
        );
    }
}

export function initializeRendererAssets(callback) {
    initRenderer(callback);
}

