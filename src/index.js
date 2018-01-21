import React                                from "react";
import ReactDOM                             from "react-dom";
import "./stylesheets/renderer.css";
import { startRenderer }                    from  "./javascripts/driver.js";

export default class CodeCharacterRenderer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        startRenderer(this.props.logFile);
    }

    render() {
        return (
            <div id="renderer-container" />
        );
    }
}

// TEST DRIVER, NOT PART OF THE COMPONENT
fetch('proto/game.log').then((response) => {
    response.arrayBuffer().then((buffer) => {
        let logFile = new Uint8Array(buffer);
        ReactDOM.render((
            <CodeCharacterRenderer logFile={logFile} />
        ), document.getElementById("root"));
    });
});

document.body.style.width = "100%";
document.body.style.height = "100%";
document.body.style.margin = "0";
document.body.style.padding = "0";
