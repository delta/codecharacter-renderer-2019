// Constants relating to sprites onscreen and spritesheets
const SPRITE_CONSTANTS = {
    spriteAnchors: {
        x: 0.5,
        y: 0.5
    },
    soldierSprites: {
        // On screen data
        displayDimensions: {
            width: 8,
            height: 8
        },
        animationSpeed: {
            values: [0.07, 0.17, 0.25, 0.37, 0.45, 0.6, 0.8],
            default: 2
        },

        // Spritesheet data
        spriteSheetData: {
            frameDetails: {
                width: 248.5,
                height: 248.4,
                jump: 248.5                       // jump and width are usually the same
            },
            idleSequence: {
                initPositions: {
                    left: { x: 248.5, y: 248.4 },
                    up: { x: 0, y: 0 },
                    down: { x: 0, y: 0 },
                    right: { x: 248.5, y: 0 },
                }
            },
            moveSequence: {
                initPositions: {
                    left: { x: 248.5, y: 248.4 },
                    right: { x: 248.5, y: 0 },
                    down: { x: 248.5, y: 248.4 },
                    up: { x: 248.5, y: 0 },
                },
                frameSequence: [0, 1]     // sequence of frame indices to be added to textures array
            },
            atkSequence: {
                initPositions: {
                    left: { x: 248.5, y: 745.2 },
                    right: { x: 248.5, y: 496.8 },
                    down: { x: 248.5, y: 745.2 },
                    up: { x: 248.5, y: 496.8 },
                },
                frameSequence: [0, 1, 2]
            },
            deadSequence: {
                initPositions: {
                    x: 0,
                    y: 993.6
                },
                frameSequence: [0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]    // last death frame is repeated until respawn
            },
        }
    },
    villagerSprites: {
        // On screen data
        displayDimensions: {
            width: 8,
            height: 8
        },
        animationSpeed: {
            values: [0.07, 0.17, 0.25, 0.37, 0.45, 0.6, 0.8],
            default: 2
        },

        // Spritesheet data
        spriteSheetData: {
            frameDetails: {
                width: 248.2,
                height: 248.2,
                jump: 248.2                       // jump and width are usually the same
            },
            idleSequence: {
                initPositions: {
                    left: { x: 248.2, y: 248.2 },
                    up: { x: 0, y: 0 },
                    down: { x: 0, y: 0 },
                    right: { x: 248.2, y: 0 },
                }
            },
            moveSequence: {
                initPositions: {
                    left: { x: 248.2, y: 248.2 },
                    right: { x: 248.2, y: 0 },
                    down: { x: 248.2, y: 248.2 },
                    up: { x: 248.2, y: 0 },
                },
                frameSequence: [0, 1]     // sequence of frame indices to be added to textures array
            },
            atkSequence: {
                initPositions: {
                    left: { x: 248.2, y: 744.6 },
                    right: { x: 248.2, y: 496.4 },
                    down: { x: 248.2, y: 744.6 },
                    up: { x: 248.2, y: 496.4 },
                },
                frameSequence: [0, 1, 2]
            },
            mineSequence: {
                initPositions: {
                    left: { x: 248.2, y: 1737.4 },
                    right: { x: 248.2, y: 1489.2 },
                    down: { x: 248.2, y: 1737.4 },
                    up: { x: 248.2, y: 1489.2 },
                },
                frameSequence: [0, 1, 2, 3]
            },
            buildSequence: {
                initPositions: {
                    left: { x: 248.2, y: 1241 },
                    right: { x: 248.2, y: 992.8 },
                    down: { x: 248.2, y: 1241 },
                    up: { x: 248.2, y: 992.8 },
                },
                frameSequence: [0, 1, 2, 3]
            },
            deadSequence: {
                initPositions: {
                    x: 0,
                    y: 1985.6
                },
                frameSequence: [0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]    // last death frame is repeated until respawn
            },
        }
    },
    factorySprites: {
        // On screen data
        displayDimensions: {
            width: 8.5,
            height: 10
        },

        // Spritesheet data
        spriteSheetData: {
            frameDetails: {
                width: 132.3,
                height: 184
            },
            deadTexture: {
                pos: { x: 661.6, y: 0 }
            },
            lv1Texture: {
                pos: { x: 0, y: 0 }
            },
            lv2Texture: {
                pos: { x: 132.3, y: 0 }
            },
            lv3Texture: {
                pos: { x: 264.6, y: 0 }
            },
            lv4Texture: {
                pos: { x: 396.9, y: 0 }
            },
            brokenTexture: {
                pos: { x: 529.2, y: 0 }
            },
        }
    },
};

export default SPRITE_CONSTANTS;
