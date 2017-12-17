class TerrainElement {
	constructor(x, y, type, texture) {
		this.type = type;
		this.sprite = new PIXI.Sprite(texture);
		this.buildSprite(x, y, TerrainElement.sideLength(), TerrainElement.sideLength());
		app.stage.addChild(this.sprite);
	}

	setPlayerID(id) {
		this.playerID = playerID;
		// this.sprite.texture = PIXI.loader.resources.newPlayerID.texture;
	}

	buildSprite(x, y, width, height) {
		this.sprite.x = x;
		this.sprite.y = y;
		this.sprite.width = width;
		this.sprite.height = width;
	}

	static build(terrainArray) {
		let terrain = [];
		let len = 100;

		for (var i = 0; i < terrainArray.length; i++) {
			terrain[i] = [];
			for (var j = 0; j < terrainArray[i].length; j++) {
				if (terrainArray[i][j] == 'l')
					var texture = PIXI.loader.resources.land.texture;
				else var texture = PIXI.loader.resources.water.texture;

				terrain[i][j] = new TerrainElement(len*i, len*j, terrainArray[i][j], texture);
			}
		}

		return terrain;
	}

	static sideLength() {
		return 100;
	}
}