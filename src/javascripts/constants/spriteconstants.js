// Constants relating to sprites onscreen and spritesheets
const SPRITE_CONSTANTS = {
    spriteAnchors: {
        x: 0.5,
        y: 0.5
    },
    soldierSprites: {
        // On screen data
        displayDimensions: {
            width: 18,
            height: 18
        },
        animationSpeed: {
            values: [0.07, 0.17, 0.25, 0.37, 0.45, 0.6, 0.8],
            default: 2
        },

        // Spritesheet data
        spriteSheetData: {
            frameDetails: {
                width: 311.25,
                height: 322,
                jump: 311.25                       // jump and width are usually the same
            },
            idleSequence: {
                initPositions: {
                    left: { x: 311.25, y: 322 },
                    up: { x: 0, y: 0 },
                    down: { x: 0, y: 0 },
                    right: { x: 311.25, y: 0 },
                }
            },
            moveSequence: {
                initPositions: {
                    left: { x: 311.25, y: 322 },
                    right: { x: 311.25, y: 0 },
                    down: { x: 311.25, y: 322 },
                    up: { x: 311.25, y: 0 },
                },
                frameSequence: [0, 1]     // sequence of frame indices to be added to textures array
            },
            atkSequence: {
                initPositions: {
                    left: { x: 311.25, y: 966 },
                    right: { x: 311.25, y: 644 },
                    down: { x: 311.25, y: 966 },
                    up: { x: 311.25, y: 644 },
                },
                frameSequence: [0, 1, 2]
            },
            deadSequence: {
                initPositions: {
                    x: 0,
                    y: 1288
                },
                frameSequence: [0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]    // last death frame is repeated until respawn
            },
        }
    },
    villagerSprites: {
        // On screen data
        displayDimensions: {
            width: 10,
            height: 10
        },
        animationSpeed: {
            values: [0.07, 0.17, 0.25, 0.37, 0.45, 0.6, 0.8],
            default: 2
        },

        // Spritesheet data
        spriteSheetData: {
            frameDetails: {
                width: 315,
                height: 330,
                jump: 315                       // jump and width are usually the same
            },
            idleSequence: {
                initPositions: {
                    left: { x: 315, y: 330 },
                    up: { x: 0, y: 0 },
                    down: { x: 0, y: 0 },
                    right: { x: 315, y: 0 },
                }
            },
            moveSequence: {
                initPositions: {
                    left: { x: 315, y: 330 },
                    right: { x: 315, y: 0 },
                    down: { x: 315, y: 330 },
                    up: { x: 315, y: 0 },
                },
                frameSequence: [0, 1]     // sequence of frame indices to be added to textures array
            },
            atkSequence: {
                initPositions: {
                    left: { x: 315, y: 992 },
                    right: { x: 315, y: 661 },
                    down: { x: 315, y: 992 },
                    up: { x: 315, y: 661 },
                },
                frameSequence: [0, 1, 2]
            },
            deadSequence: {
                initPositions: {
                    x: 0,
                    y: 2646
                },
                frameSequence: [0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]    // last death frame is repeated until respawn
            },
        }
    },
    towerSprites: {
        // On screen data
        displayDimensions: {
            width: 10,
            height:8
        },

        // Spritesheet data
        spriteSheetData: {
            frameDetails: {
                width: 100,
                height: 100
            },
            deadTexture: {
                pos: { x: 0, y: 0 }
            },
            lv1Texture: {
                pos: { x: 100, y: 0 }
            },
            lv2Texture: {
                pos: { x: 200, y: 0 }
            },
            lv3Texture: {
                pos: { x: 300, y: 0 }
            },
        }
    },
};

export default SPRITE_CONSTANTS;
