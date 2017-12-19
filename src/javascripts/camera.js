class Camera {
    constructor() {
        this.pos = {
            x: 0,
            y: 0
        };
        this.vel = {
            x: 0,
            y: 0,
            max: 10,            // Arbitrary
            decrement: 0.85     // Arbitrary
        };
        this.zoom = {
            value: 1,
            vel: 0
        };

        this.setCommands();
    }

    setCommands() {
        this.commands = {
            move: {
                up: false,
                down: false,
                left: false,
                right: false
            },
            zoom: {
                in: false,
                out: false
            }
        };
    }

    slowDown() {
        let decrement = this.vel.decrement;
        this.vel.x *= decrement;
        this.vel.y *= decrement;
    }

    updatePosition() {
        let move = this.commands.move;

        // HAPPENS ONLY WITH USER INPUT
        // Update Velocity
        if (move.up ^ move.down) {
            if (move.up && this.vel.y < this.vel.max)
                this.vel.y += 1;
            if (move.down && this.vel.y > -this.vel.max)
                this.vel.y -= 1;
        }
        if (move.left ^ move.right) {
            if (move.left && this.vel.x < this.vel.max)
                this.vel.x += 1;
            if (move.right && this.vel.x > -this.vel.max)
                this.vel.x -= 1;
        }


        // HAPPENS EVERY FRAME
        // Reset velocity if it becomes too low
        if (this.vel.x < 0.01 && this.vel.x > -0.01)
            this.vel.x = 0;
        if (this.vel.y < 0.01 && this.vel.y > -0.01)
            this.vel.y = 0;

        // Decrement Velocity
        this.slowDown();

        // Update this Position
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;


        // **IMPORTANT** (Responsible for keeping the map on the screen)
        // if (map.x + this.x > 0) {
        //     this.vel.x = 0;
        //     this.x = -0.01 - map.x;
        // }
        // if (map.x + this.x < width/this.zoom - map.width) {
        //     this.vel.x = 0;
        //     this.x = 0.01 + width/this.zoom - map.width - map.x;
        // }
        // if (map.y + this.y > 0) {
        //     this.vel.y = 0;
        //     this.y = -0.01 - map.y;
        // }
        // if (map.y + this.y < height/this.zoom - map.height) {
        //     this.vel.y = 0;
        //     this.y = 0.01 + height/this.zoom - map.height - map.y;
        // }
    }

    updateZoom() {
        let zoom = this.commands.zoom;

        // HAPPENS ONLY WITH USER INPUT
        // Update Zoom Factor
        if (zoom.in ^ zoom.out) {
            if (zoom.in && this.zoom.value < 2 && this.zoom.vel < 0.02)
                this.zoom.vel += 0.005;
            if (zoom.out && this.zoom.value > 0.5 && this.zoom.vel > -0.02)
                this.zoom.vel -= 0.005;
        }


        // HAPPENS EVERY FRAME
        // Reset zoom velocity if it becomes too low
        if (this.zoom.vel < 0.001 && this.zoom.vel > -0.001)
            this.zoom.vel = 0;

        // Decrement Velocity and update zoom factor
        this.zoom.vel *= 0.85;
        this.zoom.value += this.zoom.vel;
    }
}
