// Constants relating to sprites onscreen and spritesheets
const SPRITE_CONSTANTS = {
    spriteAnchors: {
        x: 0.5,
        y: 1
    },
    soldierSprites: {
        // On screen data
        displayDimensions: {
            width: 30,
            height: 30
        },
        animationSpeed: {
            values: [0.07, 0.17, 0.25, 0.37, 0.45, 0.6, 0.8],
            default: 2
        },

        // Spritesheet data
        spriteSheetData: {
            frameDetails: {
                width: 100,
                height: 100,
                jump: 100                       // jump and width are usually the same
            },
            idleSequence: {
                initPositions: {
                    left: {x: 0, y: 0},
                    up: {x: 100, y: 0},
                    down: {x: 200, y: 0},
                    right: {x: 300, y: 0},
                }
            },
            moveSequence: {
                initPositions: {
                    left: {x: 0, y: 100},
                    right: {x: 0, y: 400},
                    down: {x: 0, y: 700},
                    up: {x: 0, y: 1000},
                },
                frameSequence: [0, 1, 2, 1]     // sequence of frame indices to be added to textures array
            },
            atkSequence: {
                initPositions: {
                    left: {x: 0, y: 200},
                    right: {x: 0, y: 500},
                    down: {x: 0, y: 800},
                    up: {x: 0, y: 1100},
                },
                frameSequence: [0, 1, 2, 3, 2]
            },
            deadSequence: {
                initPositions: {
                    x: 0,
                    y: 300
                },
                frameSequence: [0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]    // last death frame is repeated until respawn
            },
        }
    },
    towerSprites: {
        // On screen data
        displayDimensions: {
            width: 50,
            height: 50
        },

        // Spritesheet data
        spriteSheetData: {
            frameDetails: {
                width: 100,
                height: 100
            },
            deadTexture: {
                pos: {x: 0, y: 0}
            },
            lv1Texture: {
                pos: {x: 100, y: 0}
            },
            lv2Texture: {
                pos: {x: 200, y: 0}
            },
            lv3Texture: {
                pos: {x: 300, y: 0}
            },
        }
    },
};

export default SPRITE_CONSTANTS;
