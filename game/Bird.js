export class Bird {
    constructor(x, y, width, height, imgSrc) {
        this.startY = y;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.velocityY = 0;
        this.gravity = 0.4;

        this.img = new Image();
        this.img.src = imgSrc;

        if (!this.isDead) {
        this.frame = 0;
        this.frameCount = 3;        
        this.frameDelay = 6;        
        this.frameTimer = 0;
        }
    }

    update(canvasHeight) {
        this.velocityY += this.gravity;
        this.y = Math.max(this.y + this.velocityY, 0);


        this.frameTimer++;
        if (this.frameTimer >= this.frameDelay) {
            this.frame = (this.frame + 1) % this.frameCount;
            this.frameTimer = 0;
        }

        return this.y + this.height > canvasHeight;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.velocityY * 0.05);
        ctx.drawImage(
            this.img,
            this.frame * this.width,
            0,
            this.width,
            this.height,
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
        );
        ctx.restore();

    }

    jump() {
        this.velocityY = -8;
    }

    reset() {
        this.y = this.startY;
        this.velocityY = 0;
        this.frame = 0;
    }
}
