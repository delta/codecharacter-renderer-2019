export default class TerrainElement {
	constructor(x, y, type, texture) {
		this.type = type;
		this.sprite = new PIXI.Sprite(texture);
		this.buildSprite(x, y, TerrainElement.sideLength, TerrainElement.sideLength);
	}

	buildSprite(x, y, width, height) {
		this.sprite.x = x;
		this.sprite.y = y;
		this.sprite.width = width;
		this.sprite.height = width;
	}

	addSprite(stage) {
		stage.addChild(this.sprite);
	}

	setPlayerID(id) {
		this.playerID = playerID;
		// this.sprite.texture = PIXI.loader.resources.newPlayerID.texture;
	}

	static build(stateTerrain, gameTerrain) {
		let len = TerrainElement.sideLength;

		for (let i = 0; i < stateTerrain.length; i++) {
			gameTerrain[i] = [];
			for (let j = 0; j < stateTerrain[i].length; j++) {
				if (stateTerrain[i][j] == 'l')
					var texture = PIXI.loader.resources.land.texture;
				else var texture = PIXI.loader.resources.water.texture;

				gameTerrain[i][j] = new TerrainElement(len*i, len*j, stateTerrain[i][j], texture);
			}
		}
	}

	static setSideLength(len) {
		TerrainElement.sideLength = len;
	}
}
