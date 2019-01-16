import * as PIXI from 'pixi.js';

export default class GraphicsPrimitive {
    constructor(x, y, width, height, terrianType) {
        this.width = width;
        this.height = height;
        this.terrianType = terrianType;
        this.graphics = new PIXI.Graphics();
        this.setPosition(x, y);
        this.build();
    }

    setPosition(x, y) {
        this.graphics.x = x;
        this.graphics.y = y;
    }

    build() {
        this.graphics.beginFill(this.setTerrianTypeColor, GraphicsPrimitive.opacity);
        this.graphics.drawRect(0, 0, this.width, this.height);
        this.graphics.endFill();
        this.graphics.visible = false;
    }

    addPrimitive(stage) {
        stage.addChild(this.graphics);
    }

    setTerrianTypeColor(type) {
        if (this.terrianType == 2) {
            return "0x0000FF"
        } else if (this.terrianType == 1) {
            return "0x00FF00"
        } else {
            return "0xFF0000"
        }
    }

    fill(color) {
        if (color === 0) {
            this.graphics.visible = false;
            return;
        }

        this.graphics.visible = true;
        this.graphics.clear();

        switch (color) {
        case 1:
            this.graphics.beginFill(GraphicsPrimitive.colors.player1Color, GraphicsPrimitive.opacity);
            break;
        case 2:
            this.graphics.beginFill(GraphicsPrimitive.colors.player2Color, GraphicsPrimitive.opacity);
            break;
        case 3:
            this.graphics.beginFill(GraphicsPrimitive.colors.sharedColor, GraphicsPrimitive.opacity);
            break;
        }

        this.graphics.drawRect(0, 0, this.width, this.height);
        this.graphics.endFill();
    }

    static setOpacity(opacity) {
        this.opacity = opacity;
    }

    static setColors(colors) {
        this.colors = colors;
    }
}
