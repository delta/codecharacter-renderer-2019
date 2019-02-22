import * as PIXI from 'pixi.js';

export default class HealthBarObject {
    constructor(maxHP, width) {
        this.hp = maxHP;    // Initially actors start with full health
        this.maxHP = maxHP;
        this.width = width;
    }

    buildHPBars() {
        this.healthBar = new PIXI.Container();
        this.innerBar = new PIXI.Graphics();    // moving bar
        this.outerBar = new PIXI.Graphics();    // fixed bar

        this.outerBar.beginFill(0x333333);
        this.outerBar.drawRect(0, 0, this.width, 1);
        this.outerBar.endFill();

        this.innerBar.beginFill(0xFF3300);
        this.innerBar.drawRect(0, 0, this.width, 1);
        this.innerBar.endFill();

        this.healthBar.addChild(this.outerBar);
        this.healthBar.addChild(this.innerBar);
    }

    updatePosition(x, y) {
        let offsetY = 3;
        this.healthBar.position.set(x - (this.width/2), y - (this.width/2) - offsetY);
    }

    changeHp(hp) {
        this.hp = hp;
        this.innerBar.width = (this.hp/this.maxHP)*this.width;
    }

}
