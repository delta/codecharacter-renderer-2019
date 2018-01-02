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

    restrictPosition(offset, mapLength, width, height) {
        if (offset.x + this.pos.x > 0) {
            this.vel.x = 0;
            this.pos.x = -0.01 - offset.x;
        }
        if (offset.x + this.pos.x < width/this.zoom.value - mapLength) {
            this.vel.x = 0;
            this.pos.x = 0.01 + width/this.zoom.value - mapLength - offset.x;
        }

        if (offset.y + this.pos.y > 0) {
            this.vel.y = 0;
            this.pos.y = -0.01 - offset.y;
        }
        if (offset.y + this.pos.y < height/this.zoom.value - mapLength) {
            this.vel.y = 0;
            this.pos.y = 0.01 + height/this.zoom.value - mapLength - offset.y;
        }
    }

    restrictZoom(mapLength, width, height) {
        let zoom = this.zoom;

        if (zoom.value * mapLength/height <= 1) {
            zoom.value = height/mapLength;
            // zoom.val = zoom.value;
        }
        if (zoom.value * mapLength/width <= 1) {
            zoom.value = width/mapLength;
            // zoom.val = zoom.value;
        }
    }
}
