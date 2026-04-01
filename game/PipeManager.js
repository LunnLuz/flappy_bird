import { Pipe } from "./Pipe";



export class PipeManager {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        
        this.pipes = [];
        this.coins = [];
        this.pipeWidth = 64;
        this.pipeHeight = 512;
        this.speed = -2;
        
        this.topImg = new Image();
        this.topImg.src = "/img/toppipe.png";
        
        this.bottomImg = new Image();
        this.bottomImg.src = "/img/botpipe.png";
        
        this.coinImg = new Image();
        this.coinImg.src = "/img/coinImg.png";
        
        this.coinChance = 1/15;
        this.currentChance = this.coinChance;
        this.shouldGenerateCoin = false;
    }
    
    update(bird, onScore, onCoinCollect, onGameOver) {
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
        
        for (let i = 0; i < this.coins.length; i++) {
            const coin = this.coins[i];
            coin.update(this.speed);
            
            if (!coin.passed && coin.collides(bird)) {
                coin.passed = true;
                onCoinCollect(); 
                this.coins.splice(i, 1); 
                i--;
                continue;
            }
            
            if (!coin.passed && bird.x > coin.x + coin.width) {
                coin.passed = true;
                this.coins.splice(i, 1);
                i--;
            }
        }
        
        this.pipes = this.pipes.filter(p => !p.isOffScreen());
        this.coins = this.coins.filter(c => !c.isOffScreen());
    }
    
    draw(ctx) {
        this.pipes.forEach(p => p.draw(ctx));
        this.coins.forEach(c => c.draw(ctx));
    }
    
    createPipes() {
        const randomY = -this.pipeHeight / 4 - Math.random() * (this.pipeHeight / 2);
        const opening = this.canvasHeight / 4;
        
        const topPipeY = randomY;
        const bottomPipeY = randomY + this.pipeHeight + opening;
        
        this.pipes.push(
            new Pipe(this.canvasWidth, topPipeY, this.pipeWidth, this.pipeHeight, this.topImg),
            new Pipe(this.canvasWidth, bottomPipeY, this.pipeWidth, this.pipeHeight, this.bottomImg)
        );
        
        this.shouldGenerateCoin = this.decideGenerateCoin();
        
        if (this.shouldGenerateCoin) {
            const coinY = topPipeY + this.pipeHeight + (opening / 2)-10;
            const coinX = this.canvasWidth + this.pipeWidth / 2 - 20;
            
            this.coins.push(
                new Pipe(coinX, coinY, 40, 40, this.coinImg)
            );
            
            this.resetCoinChance();
        } else {
            this.increaseCoinChance();
        }
    }
    
    decideGenerateCoin() {
        return Math.random() < this.currentChance;
    }
    
    increaseCoinChance() {
        let denominator = Math.round(1 / this.currentChance);
        
        if (denominator > 1) {
            denominator--;
        }
        
        this.currentChance = 1 / denominator;
        
        console.log(`Coin chance increased to: 1/${denominator}`);
    }
    
    resetCoinChance() {
        this.currentChance = this.coinChance;
        console.log(`Coin chance reset to: 1/${Math.round(1/this.coinChance)}`);
    }
    
    reset() {
        this.pipes = [];
        this.coins = [];
        this.currentChance = this.coinChance;
        this.shouldGenerateCoin = false;
    }
}
