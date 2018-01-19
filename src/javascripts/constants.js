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
            max: 30,
            change: 3           // Amount to increment or decrement when given a user input
        },
        zoom: {
            value: 0.8,         // Extent of Zoom
            max: 10,
            vel: {
                value: 0,
                max: 0.05,
                min: 0.001,     // min value below which velocity is reset to zero
                change: 0.0125  // Amount to increment or decrement when given a user input
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
        idleSprite: {
            width: 24,
            height: 30
        },
        moveSprite: {
            width: 24,
            height: 30
        },
        atkSprite: {
            width: 24,
            height: 35
        },
        deadSprite: {
            width: 40,
            height: 20
        }
    },
    towers: {
        maxDeathFrames: 10,     // Frames for which dead tower stays on the map after destruction
        deadSprite: {
            width: 30,
            height: 10
        },
        lv1Sprite: {
            width: 30,
            height: 60
        },
        lv2Sprite: {
            width: 36,
            height: 72
        },
        lv3Sprite: {
            width: 42,
            height: 84
        }
    },
    terrain: {
        overlay: {
            opacity: 0.3
        }
    }
};

export default CONSTANTS;
