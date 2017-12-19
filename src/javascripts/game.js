class Game {
    constructor() {
        this.soldiers = [];
        this.towers = [];
        this.terrain = [];

        this.camera = new Camera();
        Game.addListeners(this);

        this.app = new PIXI.Application({width: window.innerWidth, height: window.innerHeight});
        document.body.appendChild(this.app.view);
    }

    static addListeners(game) {
        document.body.addEventListener("keydown", function (e) {
            switch(e.keyCode) {
                case 37:
                    game.camera.commands.move.left = true;
                    break;                
                case 38:
                    game.camera.commands.move.up = true;
                    break;
                case 39:
                    game.camera.commands.move.right = true;
                    break;                
                case 40:
                    game.camera.commands.move.down = true;
                    break;            
                case 187:
                    game.camera.commands.zoom.in = true;
                    break;            
                case 189:
                    game.camera.commands.zoom.out = true;
                    break;
            }
        });

        document.body.addEventListener("keyup", function (e) {
            switch(e.keyCode) {
                case 37:
                    game.camera.commands.move.left = false;
                    break;                
                case 38:
                    game.camera.commands.move.up = false;
                    break;
                case 39:
                    game.camera.commands.move.right = false;
                    break;                
                case 40:
                    game.camera.commands.move.down = false;
                    break;            
                case 187:
                    game.camera.commands.zoom.in = false;
                    break;            
                case 189:
                    game.camera.commands.zoom.out = false;
                    break;
            }
        });
    }

    autoResize() {
        if (this.app.renderer.width != window.innerWidth || this.app.renderer.height != window.innerHeight)
            this.app.renderer.resize(window.innerWidth, window.innerHeight);

        this.camera.updatePosition();
        this.camera.updateZoom();
    }
}
