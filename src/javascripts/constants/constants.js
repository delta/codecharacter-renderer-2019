import SPRITE_CONSTANTS from './spriteconstants.js';

// Initial values or constant values
const CONSTANTS = {
    gameSpeed: {
        actualValues: [2/25, 1/6, 1/5, 1/4, 1/2, 3/4, 1],                   // Range of actual game speed values
        displayValues: ["0.4", "0.625", "1.0", "1.25", "2.5", "3.75", "5.0"],   // Values displayed by the UI
        default: 2                                                         // Default array index to use
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
            change: 1           // Amount to increment or decrement when given a user input
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
    unitType: {                 // To distinguish soldier and villager within unit
        soldier: 0,
        villager: 1,
        factory: 2
    },
    units: {
        maxDeathFrames: 10
    },
    factories: {
        maxDeathFrames: 10,     // Frames for which dead tower stays on the map after destruction
        factoryBuildLevelMultiplier: 0.03,
        factoryMinHp: 50
    },
    glowFilters: {
        distance: 12,
        outerStrength: 3,
        innerStrength: 0.5,
        color: {
            1: 0x00DDFF,
            2: 0xFFCC00
        },
        quality: 1
    },
    barConstants: {
        hp: {
            innerBarColor: 0xFF3300,
            outerBarColor: 0x333333,
            height: 1,
            offsetY: 1.5
        },
        build: {
            innerBarColor: 0x55FF00,
            outerBarColor: 0x333333,
            height: 1,
            offsetY: 3
        }
    }
};
CONSTANTS.spriteConstants = SPRITE_CONSTANTS;

export default CONSTANTS;
