// Constants relating to sprites onscreen and spritesheets
const SPRITE_CONSTANTS = {
    spriteAnchors: {
        x: 0.5,
        y: 0.5
    },
    soldierSprites: {
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
                width: 334,
                height: 341,
                jump: 334                       // jump and width are usually the same
            },
            idleSequence: {
                initPositions: {
                    left: { x: 334, y: 341 },
                    up: { x: 0, y: 0 },
                    down: { x: 0, y: 0 },
                    right: { x: 334, y: 0 },
                }
            },
            moveSequence: {
                initPositions: {
                    left: { x: 334, y: 341 },
                    right: { x: 334, y: 0 },
                    down: { x: 334, y: 341 },
                    up: { x: 334, y: 0 },
                },
                frameSequence: [0, 1]     // sequence of frame indices to be added to textures array
            },
            atkSequence: {
                initPositions: {
                    left: { x: 334, y: 1023 },
                    right: { x: 334, y: 682 },
                    down: { x: 334, y: 1023 },
                    up: { x: 334, y: 682 },
                },
                frameSequence: [0, 1, 2]
            },
            mineSequence: {
                initPositions: {
                    left: { x: 334, y: 2387 },
                    right: { x: 334, y: 2046 },
                    down: { x: 334, y: 2387 },
                    up: { x: 334, y: 2046 },
                },
                frameSequence: [0, 1, 2, 3]
            },
            buildSequence: {
                initPositions: {
                    left: { x: 334, y: 1705 },
                    right: { x: 334, y: 1364 },
                    down: { x: 334, y: 1705 },
                    up: { x: 334, y: 1364 },
                },
                frameSequence: [0, 1, 2, 3]
            },
            deadSequence: {
                initPositions: {
                    x: 0,
                    y: 2728
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
