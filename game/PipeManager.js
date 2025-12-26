import { Pipe } from "./Pipe";

export class PipeManager {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        this.pipes = [];
        this.pipeWidth = 64;
        this.pipeHeight = 512;
        this.speed = -2;

        this.topImg = new Image();
        this.topImg.src = "/img/toppipe.png";

        this.bottomImg = new Image();
        this.bottomImg.src = "/img/botpipe.png";
    }

    update(bird, onScore, onGameOver) {
        for (const pipe of this.pipes) {
            pipe.update(this.speed);

            if (!pipe.passed && bird.x > pipe.x + pipe.width) {
                pipe.passed = true;
                onScore();
            }

            if (pipe.collides(bird)) {
                onGameOver();
            }
        }

        this.pipes = this.pipes.filter(p => !p.isOffScreen());
    }

    draw(ctx) {
        this.pipes.forEach(p => p.draw(ctx));
    }

    createPipes() {
        const randomY = -this.pipeHeight / 4 - Math.random() * (this.pipeHeight / 2);
        const opening = this.canvasHeight / 4;

        this.pipes.push(
            new Pipe(this.canvasWidth, randomY, this.pipeWidth, this.pipeHeight, this.topImg),
            new Pipe(
                this.canvasWidth,
                randomY + this.pipeHeight + opening,
                this.pipeWidth,
                this.pipeHeight,
                this.bottomImg
            )
        );
    }

    reset() {
        this.pipes = [];
    }
}
