// Initial values or constant values
const CONSTANTS = {
    camera: {
        pos: {
            x: 0,
            y: 0
        },
        vel: {
            x: 0,
            y: 0,
            min: 0.01,          // min value below which velocity is reset to zero
            max: 10,
            change: 1           // Amount to increment or decrement when given a user input
        },
        zoom: {
            value: 1,          // Extent of Zoom
            min: 0.5,           // minimum possible zoom value
            max: 2,
            vel: {
                value: 0,
                max: 0.02,
                min: 0.001,     // min value below which velocity is reset to zero
                change: 0.005   // Amount to increment or decrement when given a user input
            }
        },
        acc: 0.85,              // Each frame, the velocity gets multiplied by this amount
        commands: {
            move: {
                up: false,
                down: false,
                left: false,
                right: false
            },
            zoom: {
                in: false,
                out: false
            }
        }
    },
    terrain: {
        sideLength: 100
    }
};

export default CONSTANTS;
