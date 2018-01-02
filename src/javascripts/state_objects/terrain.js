import * as PIXI from 'pixi.js';

export default class TerrainElement {
    constructor(x, y, type, texture) {
        this.type = type;
        this.sprite = new PIXI.Sprite(texture);
        this.buildSprite(x, y);
    }

    buildSprite(x, y, width, height) {
        this.sprite.width = TerrainElement.sideLength;
        this.sprite.height = TerrainElement.sideLength;
        this.updateSprite(x, y);
    }

    addSprite(stage) {
        stage.addChild(this.sprite);
    }

    updateSprite(x, y) {
        this.sprite.x = x;
        this.sprite.y = y;
    }

    setPlayerID(id) {
        this.playerID = id;
        // this.sprite.texture = PIXI.loader.resources.newPlayerID.texture;
    }

    static build(stateTerrain, gameTerrain) {
        let len = TerrainElement.sideLength;
        var texture;

        for (let i = 0; i < stateTerrain.length; i++) {
            gameTerrain[i] = [];
            for (let j = 0; j < stateTerrain[i].length; j++) {
                if (stateTerrain[i][j] == 'l')
                    texture = PIXI.loader.resources.land.texture;
                else
                    texture = PIXI.loader.resources.water.texture;

                gameTerrain[i][j] = new TerrainElement(len*i, len*j, stateTerrain[i][j], texture);
            }
        }
    }

    static setSideLength(len) {
        TerrainElement.sideLength = len;
    }
}
