import React                                from "react";
import ReactDOM                             from "react-dom";
import "./stylesheets/renderer.css";
import { startRenderer }                    from  "./javascripts/driver.js";

export { startRenderer };

export default class CodeCharacterRenderer extends React.Component {
    render() {
        return (
            <div id="renderer-container" />
        );
    }
}

// When run independently
ReactDOM.render((
    <CodeCharacterRenderer />
), document.getElementById("root"));

startRenderer();
