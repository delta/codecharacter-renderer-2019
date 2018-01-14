// Initial values or constant values
const CONSTANTS = {
    camera: {
        actualPos: {
            x: 0,
            y: 0
        },
        passivePos: {       // Camera postion (not accounting for offset)
            x: 0,
            y: 0
        },
        offset: {           // Amount by which the camera must be offset to emulate central zooming
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
            value: 1,           // Extent of Zoom
            max: 10,
            vel: {
                value: 0,
                max: 0.1,
                min: 0.001,     // min value below which velocity is reset to zero
                change: 0.025   // Amount to increment or decrement when given a user input
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
    soldiers: {
        spriteWidth: 24,
        spriteHeight: 30
    },
    towers: {
        maxDeathFrames: 10,     // Frames for which dead tower stays on the map after destruction
        spriteWidth: 30,
        spriteHeight: 70
    }
};

export default CONSTANTS;
