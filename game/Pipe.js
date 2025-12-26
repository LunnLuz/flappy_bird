export class Pipe {
    constructor(x, y, width, height, img) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.img = img;
        this.passed = false;
    }

    update(speed) {
        this.x += speed;
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    isOffScreen() {
        return this.x + this.width < 0;
    }

    collides(bird) {
        return (
            bird.x < this.x + this.width &&
            bird.x + bird.width > this.x &&
            bird.y < this.y + this.height &&
            bird.y + bird.height > this.y
        );
    }
}
