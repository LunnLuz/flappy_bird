class Bird {
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
    }

    update(canvasHeight) {
        this.velocityY += this.gravity;
        this.y = Math.max(this.y + this.velocityY, 0);

        if (this.y + this.height > canvasHeight) {
            return true; // столкновение с землёй
        }
        return false;
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    jump() {
        this.velocityY = -8;
    }

    reset() {
        this.y = this.startY;
        this.velocityY = 0;
    }
}

// -----------------------------

class Pipe {
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

// -----------------------------

class PipeManager {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        this.pipes = [];
        this.pipeWidth = 64;
        this.pipeHeight = 512;
        this.speed = -2;

        this.topImg = new Image();
        this.topImg.src = "./img/toppipe.png";

        this.bottomImg = new Image();
        this.bottomImg.src = "./img/botpipe.png";
    }

    update(bird, scoreCallback, gameOverCallback) {
        for (let pipe of this.pipes) {
            pipe.update(this.speed);

            if (!pipe.passed && bird.x > pipe.x + pipe.width) {
                pipe.passed = true;
                scoreCallback();
            }

            if (pipe.collides(bird)) {
                gameOverCallback();
            }
        }

        this.pipes = this.pipes.filter(pipe => !pipe.isOffScreen());
    }

    draw(ctx) {
        this.pipes.forEach(pipe => pipe.draw(ctx));
    }

    createPipes() {
        let randomY = -this.pipeHeight / 4 - Math.random() * (this.pipeHeight / 2);
        let opening = this.canvasHeight / 4;

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
        this.speed = -2;
    }
}

// -----------------------------

class InputHandler {
    constructor(jumpCallback) {
        document.addEventListener("keydown", e => {
            if (e.code === "Space") jumpCallback();
        });

        document.addEventListener("mousedown", e => {
            if (e.button === 0) jumpCallback();
        });
    }
}

// -----------------------------

class Game {
    constructor() {
        this.canvas = document.getElementById("board");
        this.ctx = this.canvas.getContext("2d");

        this.canvas.width = 640;
        this.canvas.height = 640;

        this.bird = new Bird(
            this.canvas.width / 8,
            this.canvas.height / 2,
            34,
            24,
            "./img/bird.png"
        );

        this.pipeManager = new PipeManager(this.canvas.width, this.canvas.height);

        this.score = 0;
        this.highScore = localStorage.getItem("highScore") || 0;
        this.gameOver = false;

        new InputHandler(() => this.handleInput());

        setInterval(() => {
            if (!this.gameOver) this.pipeManager.createPipes();
        }, 1500);

        requestAnimationFrame(() => this.update());
    }

    handleInput() {
        if (this.gameOver) {
            this.restart();
        }
        this.bird.jump();
    }

    update() {
        requestAnimationFrame(() => this.update());

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.gameOver) {
            this.drawGameOver();
            return;
        }

        if (this.bird.update(this.canvas.height)) {
            this.endGame();
        }

        this.pipeManager.update(
            this.bird,
            () => this.score += 0.5,
            () => this.endGame()
        );

        this.pipeManager.draw(this.ctx);
        this.bird.draw(this.ctx);
        this.drawScore();
    }

    drawScore() {
        this.ctx.fillStyle = "white";
        this.ctx.font = "32px sans-serif";
        this.ctx.fillText("Score: " + this.score, 10, 40);
        this.ctx.fillText("Best: " + this.highScore, 10, 80);
    }

    drawGameOver() {
        this.ctx.fillStyle = "white";
        this.ctx.font = "48px sans-serif";
        this.ctx.textAlign = "center";
        this.ctx.fillText("GAME OVER", this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.font = "24px sans-serif";
        this.ctx.fillText(
            "Click or Space to Restart",
            this.canvas.width / 2,
            this.canvas.height / 2 + 40
        );
        this.ctx.textAlign = "left";
    }

    endGame() {
        this.gameOver = true;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem("highScore", this.highScore);
        }
    }

    restart() {
        this.score = 0;
        this.gameOver = false;
        this.bird.reset();
        this.pipeManager.reset();
    }
}

// -----------------------------

window.onload = () => {
    new Game();
};
