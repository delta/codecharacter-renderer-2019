import SPRITE_CONSTANTS from './spriteconstants.js';

// Initial values or constant values
const CONSTANTS = {
    gameSpeed: {
        actualValues: [3/32, 1/6, 1/4, 3/8, 1/2, 3/4, 1],                   // Range of actual game speed values
        displayValues: ["0.5", "0.7", "1.0", "1.5", "2.0", "3.0", "4.0"],   // Values displayed by the UI
        default: 0                                                          // Default array index to use
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
    unitType: {
        soldier: 0,
        villager: 1
    },
    factories: {
        maxDeathFrames: 10,     // Frames for which dead tower stays on the map after destruction
        factoryBuildLevelMultiplier: 0.04
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
    }
};
CONSTANTS.spriteConstants = SPRITE_CONSTANTS;

export default CONSTANTS;
