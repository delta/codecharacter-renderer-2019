import * as PIXI from 'pixi.js';

export default class HealthBarObject {
    constructor(maxHP, width) {
        this.hp = 0;
        this.maxHP = maxHP;
        this.width = width;

        this.healthBar = new PIXI.Container();
        this.innerBar = new PIXI.Graphics();    // fixed bar
        this.outerBar = new PIXI.Graphics();    // moving bar

        this.innerBar.beginFill(0x333333);
        this.innerBar.drawRect(0, 0, width, 1);
        this.innerBar.endFill();

        this.outerBar.beginFill(0xFF3300);
        this.outerBar.drawRect(0, 0, width, 1);
        this.outerBar.endFill();

        this.healthBar.addChild(this.innerBar);
        this.healthBar.addChild(this.outerBar);
    }

    updatePosition(x, y) {
        this.healthBar.position.set(x, y);
    }

    changeHp(hp) {
        this.hp = hp;
        this.outerBar.width = (this.hp/this.maxHP)*this.width;
    }

}
