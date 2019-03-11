import SPRITE_CONSTANTS from './spriteconstants.js';

// Initial values or constant values
const CONSTANTS = {
    gameSpeed: {
        actualValues: [2/25, 1/6, 1/5, 1/4, 1/2, 3/4, 1],                       // Range of actual game speed values
        displayValues: ["0.4", "0.625", "1.0", "1.25", "2.5", "3.75", "5.0"],   // Values displayed by the UI
        default: 2                                                              // Default array index to use
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
            value: 1,          // Extent of Zoom
            max: 10,
            vel: {
                value: 0,
                max: 0.1,
                min: 0.001,         // min value below which velocity is reset to zero
                change: {           // Amount to increment or decrement when given a user input
                    key: 0.025,
                    scroll: 0.06
                }
            }
        },
        drag: {                 // Positions used for click and drag panning
            startPosition: {
                x: 0,
                y: 0
            },
            targetPosition: {
                x: 0,
                y: 0
            }
        },
        acc: 0.85,              // Each frame, the velocity gets multiplied by this amount
        commands: {
            drag: false,
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
    actorStates: {
        Soldier: ["IDLE","MOVE","ATTACK","DEAD"],
        Villager: ["IDLE","MOVE","ATTACK","MINE","BUILD","DEAD"],
        Factory: ["UNBUILT","IDLE","VILLAGER_PROD","SOLDIER_PROD","DESTROYED"]
    },
    actorType: {                 // To distinguish the different actorTypes
        soldier: "Soldier",
        villager: "Villager",
        factory: "Factory"
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
        color: {    // key represents playerID
            1: 0x00DDFF,
            2: 0xFFCC00
        },
        quality: 1
    },
    barConstants: {
        hp: {
            innerBarColors: {   // key represents playerID
                1: 0x60E0DD,
                2: 0xCC2800
            },
            outerBarColor: 0x333333,
            height: 0.7,
            offsetY: 1.5
        },
        build: {
            innerBarColors: {    // key represents playerID
                1: 0x55FF00,
                2: 0x55FF00
            },
            outerBarColor: 0x333333,
            height: 0.6,
            offsetY: 3
        }
    }
};
CONSTANTS.spriteConstants = SPRITE_CONSTANTS;

export default CONSTANTS;
