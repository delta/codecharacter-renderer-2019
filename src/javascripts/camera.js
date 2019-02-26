export default class Camera {
    constructor(CONSTANTS) {
        this.actualPos = Object.assign({}, CONSTANTS.actualPos);
        this.passivePos = Object.assign({}, CONSTANTS.passivePos);
        this.offset = Object.assign({}, CONSTANTS.offset);
        this.vel = Object.assign({}, CONSTANTS.vel);
        this.zoom = JSON.parse(JSON.stringify(CONSTANTS.zoom));
        this.drag = JSON.parse(JSON.stringify(CONSTANTS.drag));
        this.commands = JSON.parse(JSON.stringify(CONSTANTS.commands));
        this.acc = CONSTANTS.acc;
    }

    reCenter(containerWidth, containerHeight, mapLength){
        this.zoom.min = Math.min(containerHeight / mapLength, containerWidth / mapLength);
        this.offset.x = -(1 - 1 / this.zoom.value) * containerWidth / 2;
        this.offset.y = -(1 - 1 / this.zoom.value) * containerHeight / 2;
        this.actualPos.x = (containerWidth - (this.zoom.value * mapLength)) / (2 * this.zoom.value);
        this.actualPos.y = 0;
        this.passivePos.x = this.actualPos.x - this.offset.x;
    }

    // POSITION SETTING LOGIC
    setDragStartPosition(x, y) {
        this.drag.startPosition.x = x;
        this.drag.startPosition.y = y;
    }

    setDragTarget(x, y) {
        this.drag.targetPosition.x = x;
        this.drag.targetPosition.y = y;
    }

    updateVelocity() {
        // Handles click and drag operations
        if (this.commands.drag) {
            let pointerPositionChange = {
                x: (this.drag.targetPosition.x - this.drag.startPosition.x),
                y: (this.drag.targetPosition.y - this.drag.startPosition.y)
            };

            // This constant makes sure that mouse movement exactly matches camera movement
            let velocityMultiplier = 1.16;

            this.vel.x = velocityMultiplier * pointerPositionChange.x / this.zoom.value;
            this.vel.y = velocityMultiplier * pointerPositionChange.y / this.zoom.value;
            this.drag.startPosition.x = this.drag.targetPosition.x;
            this.drag.startPosition.y = this.drag.targetPosition.y;
            return;
        }

        // Handles Keyboard Inputs
        const move = this.commands.move;
        if ((move.up ^ move.down) && Math.abs(this.vel.y) < this.vel.max) {
            if (move.up)
                this.vel.y += this.vel.change;
            if (move.down)
                this.vel.y -= this.vel.change;
        }
        if ((move.left ^ move.right) && Math.abs(this.vel.x) < this.vel.max) {
            if (move.left)
                this.vel.x += this.vel.change;
            if (move.right)
                this.vel.x -= this.vel.change;
        }
    }

    resetVelocity() {
        if (Math.abs(this.vel.x) < this.vel.min)
            this.vel.x = 0;
        if (Math.abs(this.vel.y) < this.vel.min)
            this.vel.y = 0;
    }

    slowDown() {
        this.vel.x *= this.acc;
        this.vel.y *= this.acc;
    }

    updatePosition() {
        // Update Velocity
        // Changes to velocity only occur with user input
        this.updateVelocity();

        // Reset velocity if it becomes too low
        // Occurs every frame
        this.resetVelocity();

        // Decrement Velocity
        this.slowDown();

        // Update Camera Position
        this.passivePos.x += this.vel.x;
        this.passivePos.y += this.vel.y;
        this.actualPos.x = this.passivePos.x;
        this.actualPos.y = this.passivePos.y;
    }

    // ZOOM BASED LOGIC
    // Manual zooming for scroll based input
    manualZoom(shouldZoomIn) {
        if (shouldZoomIn && this.zoom.value < this.zoom.max) {
            this.zoom.vel.value += this.zoom.vel.change.scroll;
            return;
        }

        if (this.zoom.value > this.zoom.min) {
            this.zoom.vel.value -= this.zoom.vel.change.scroll;
        }
    }

    // Update zoom velocity on keyboard input
    updateZoomVelocity() {
        const zoom = this.commands.zoom;
        if ((zoom.in ^ zoom.out) && Math.abs(this.zoom.vel.value) < this.zoom.vel.max) {
            if (zoom.in && this.zoom.value < this.zoom.max)
                this.zoom.vel.value += this.zoom.vel.change.key;
            if (zoom.out && this.zoom.value > this.zoom.min)
                this.zoom.vel.value -= this.zoom.vel.change.key;
        }
    }

    resetZoomVelocity() {
        if (Math.abs(this.zoom.vel.value) < this.zoom.vel.min) {
            this.zoom.vel.value = 0;
        }
    }

    updateZoom(mapLength, containerWidth, containerHeight) {
        // Update Zoom Velocity
        // Changes to velocity only occur with user input
        this.updateZoomVelocity();

        // HAPPENS EVERY FRAME
        // Reset zoom velocity if it becomes too low
        this.resetZoomVelocity();

        // Decrement Velocity and update zoom factor
        this.zoom.vel.value *= this.acc;
        this.zoom.value += this.zoom.vel.value;

        // Restrict User Zoom
        if (this.zoom.value * mapLength/containerHeight <= 1  &&  this.zoom.value * mapLength/containerWidth <= 1) {
            this.zoom.value = Math.min(containerHeight/mapLength, containerWidth/mapLength);
        }

        // Update Offsets to allow for center zooming
        this.offset.x = -(1 - 1/this.zoom.value) * containerWidth/2;
        this.offset.y = -(1 - 1/this.zoom.value) * containerHeight/2;
        this.actualPos.x = this.passivePos.x + this.offset.x;
        this.actualPos.y = this.passivePos.y + this.offset.y;
    }

    // LOGIC TO RESET POSITION TO PREVENT CAMERA FROM GOING OUT OF BOUNDS
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
