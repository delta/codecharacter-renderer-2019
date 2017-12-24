export default class Camera {
    constructor(CONSTANTS) {
        this.pos = JSON.parse(JSON.stringify(CONSTANTS.pos));
        this.vel = JSON.parse(JSON.stringify(CONSTANTS.vel));
        this.zoom = JSON.parse(JSON.stringify(CONSTANTS.zoom));
        this.acc = CONSTANTS.acc;
        this.commands = JSON.parse(JSON.stringify(CONSTANTS.commands));
    }

    slowDown() {
        this.vel.x *= this.acc;
        this.vel.y *= this.acc;
    }

    updatePosition() {
        let move = this.commands.move;

        // HAPPENS ONLY WITH USER INPUT
        // Update Velocity
        if ( (move.up ^ move.down) && Math.abs(this.vel.y) < this.vel.max) {
            if (move.up)
                this.vel.y += this.vel.change;
            if (move.down)
                this.vel.y -= this.vel.change;
        }
        if ( (move.left ^ move.right) && Math.abs(this.vel.x) < this.vel.max) {
            if (move.left)
                this.vel.x += this.vel.change;
            if (move.right)
                this.vel.x -= this.vel.change;
        }


        // HAPPENS EVERY FRAME
        // Reset velocity if it becomes too low
        if ( Math.abs(this.vel.x) < this.vel.min )
            this.vel.x = 0;
        if ( Math.abs(this.vel.y) < this.vel.min )
            this.vel.y = 0;

        // Decrement Velocity
        this.slowDown();

        // Update Camera Position
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
    }

    updateZoom() {
        let zoom = this.commands.zoom;

        // HAPPENS ONLY WITH USER INPUT
        // Update Zoom Factor
        if ( (zoom.in ^ zoom.out) && Math.abs(this.zoom.vel.value) < this.zoom.vel.max) {
            if (zoom.in && this.zoom.value < this.zoom.max)
                this.zoom.vel.value += this.zoom.vel.change;
            if (zoom.out && this.zoom.value > this.zoom.min)
                this.zoom.vel.value -= this.zoom.vel.change;
        }


        // HAPPENS EVERY FRAME
        // Reset zoom velocity if it becomes too low
        if ( Math.abs(this.zoom.vel.value) < this.zoom.vel.min )
            this.zoom.vel.value = 0;

        // Decrement Velocity and update zoom factor
        this.zoom.vel.value *= this.acc;
        this.zoom.value += this.zoom.vel.value;
    }
}
