// Initial values or constant values
const CONSTANTS = {
    gameSpeed: {
        actualValues: [3/32, 1/6, 1/4, 3/8, 1/2, 3/4, 1],                   // Range of actual game speed values
        displayValues: ["0.5", "0.7", "1.0", "1.5", "2.0", "3.0", "4.0"],   // Values displayed by the UI
        default: 2                                                          // Default array index to use
    },
    camera: {
        actualPos: {
            x: 0,
            y: 0
        },
        passivePos: {           // Camera postion (not accounting for offset)
            x: 0,
            y: 0
        },
        offset: {               // Amount by which the camera must be offset to emulate central zooming
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
            height: 38
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
            opacity: 0.3,
            colors: {
                player1Color: 0xff0000,
                player2Color: 0x0000ff,
                sharedColor: 0xaa00ff
            }
        }
    },
    money: {
        player1Color: "#b30000",
        player2Color: "#000099"
    }
};

export default CONSTANTS;
