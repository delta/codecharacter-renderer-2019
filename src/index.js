import React                                from "react";
import ReactDOM                             from "react-dom";
import * as PIXI                            from 'pixi.js';
import { initRenderer, initGame }           from "./javascripts/driver.js";
import "./stylesheets/renderer.css";

export default class CodeCharacterRenderer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        initGame(this.props.logFile);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.logFile.toString() != this.props.logFile.toString()) {
            initGame(nextProps.logFile);
        }
    }

    render() {
        return (
            <div id="renderer-container" />
        );
    }
}

export function initializeRendererAssets(callback) {
    initRenderer(callback);
}

// TEST DRIVER, NOT PART OF THE COMPONENT
initializeRendererAssets(initGameLog);

function initGameLog() {
    fetch('proto/game.log').then((response) => {
        response.arrayBuffer().then((buffer) => {
            let logFile = new Uint8Array(buffer);
            ReactDOM.render((
                <CodeCharacterRenderer logFile={logFile} />
            ), document.getElementById("root"));
        });
    });
}

document.body.style.width = "100%";
document.body.style.height = "100%";
document.body.style.margin = "0";
document.body.style.padding = "0";
