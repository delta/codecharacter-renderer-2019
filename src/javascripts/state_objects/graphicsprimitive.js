import * as PIXI from 'pixi.js';

export default class GraphicsPrimitive {
    constructor(x, y, width, height) {
        this.width = width;
        this.height = height;
        this.graphics = new PIXI.Graphics();
        this.setPosition(x, y);
        this.build();
    }

    setPosition(x, y) {
        this.graphics.x = x;
        this.graphics.y = y;
    }

    build() {
        this.graphics.beginFill(0x0000FF, GraphicsPrimitive.opacity);
        this.graphics.drawRect(0, 0, this.width, this.height);
        this.graphics.endFill();
        this.graphics.visible = false;
    }

    addPrimitive(stage) {
        stage.addChild(this.graphics);
    }

    fill(color) {
        if (color === 0) {
            this.graphics.visible = false;
            return;
        } else {
            this.graphics.visible = true;
            this.graphics.clear();
        }

        switch (color) {
        case 1:
            this.graphics.beginFill(0xFF0000, GraphicsPrimitive.opacity);
            break;
        case 2:
            this.graphics.beginFill(0x0000FF, GraphicsPrimitive.opacity);
            break;
        case 3:
            this.graphics.beginFill(0xAA00FF, GraphicsPrimitive.opacity);
            break;
        }

        this.graphics.drawRect(0, 0, this.width, this.height);
        this.graphics.endFill();
    }

    static setOpacity(opacity) {
        this.opacity = opacity;
    }
}
