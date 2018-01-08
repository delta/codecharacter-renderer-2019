export default class Camera {
    constructor(CONSTANTS) {
        this.actualPos = JSON.parse(JSON.stringify(CONSTANTS.actualPos));
        this.passivePos = JSON.parse(JSON.stringify(CONSTANTS.passivePos));
        this.offset = JSON.parse(JSON.stringify(CONSTANTS.offset));
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
        const move = this.commands.move;

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
        this.passivePos.x += this.vel.x;
        this.passivePos.y += this.vel.y;
        this.actualPos.x = this.passivePos.x;
        this.actualPos.y = this.passivePos.y;
    }

    updateZoom(mapLength, containerWidth, containerHeight) {
        const zoom = this.commands.zoom;

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

        // Restrict User Zoom
        if (this.zoom.value * mapLength/containerHeight <= 1  &&  this.zoom.value * mapLength/containerWidth <= 1) {
            this.zoom.value = Math.min(containerHeight/mapLength, containerWidth/mapLength);
        }

        this.offset.x = -(1 - 1/this.zoom.value) * containerWidth/2;
        this.offset.y = -(1 - 1/this.zoom.value) * containerHeight/2;
        this.actualPos.x = this.passivePos.x + this.offset.x;
        this.actualPos.y = this.passivePos.y + this.offset.y;
    }

    restrictPosition(mapLength, containerWidth, containerHeight) {
        const posX = this.offset.x + this.passivePos.x,
            posY = this.offset.y + this.passivePos.y;

        const leftBoundryCrossed = (posX > 0),
            rightBoundryCrossed = (posX < containerWidth/this.zoom.value - mapLength),
            topBoundryCrossed = (posY > 0),
            bottomBoundryCrossed = (posY < containerHeight/this.zoom.value - mapLength);

        const leftDist = Math.abs(posX),
            rightDist = Math.abs(posX - (containerWidth/this.zoom.value - mapLength)),
            topDist = Math.abs(posY),
            bottomDist = Math.abs(posY - (containerHeight/this.zoom.value - mapLength));

        if (leftBoundryCrossed ^ rightBoundryCrossed) {
            if (leftDist < rightDist) {
                this.resetToLeft(this.offset);
            } else {
                this.resetToRight(this.offset, containerWidth, mapLength);
            }
        }

        if (topBoundryCrossed ^ bottomBoundryCrossed) {
            if (topDist < bottomDist) {
                this.resetToTop(this.offset);
            } else {
                this.resetToBottom(this.offset, containerHeight, mapLength);
            }
        }
    }

    resetToLeft(offset) {
        this.vel.x = 0;
        this.passivePos.x = -0.01 - offset.x;
    }

    resetToRight(offset, containerWidth, mapLength) {
        this.vel.x = 0;
        this.passivePos.x = 0.01 + containerWidth/this.zoom.value - mapLength - offset.x;
    }

    resetToTop(offset) {
        this.vel.y = 0;
        this.passivePos.y = -0.01 - offset.y;
    }

    resetToBottom(offset, containerHeight, mapLength) {
        this.vel.y = 0;
        this.passivePos.y = 0.01 + containerHeight/this.zoom.value - mapLength - offset.y;
    }
}
