// Constants relating to sprites onscreen and spritesheets
const SPRITE_CONSTANTS = {
    soldierSprites: {
        // On screen data
        displayDimensions: {
            width: 50,
            height: 50
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
        deadSprite: {
            width: 30,
            height: 10
        },
        lv1Sprite: {
            width: 40,
            height: 80
        },
        lv2Sprite: {
            width: 50,
            height: 100
        },
        lv3Sprite: {
            width: 60,
            height: 120
        }
    },
};

export default SPRITE_CONSTANTS;
