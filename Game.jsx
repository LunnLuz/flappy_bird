import { useEffect, useRef } from "react";
import { Bird } from "./game/Bird";
import { PipeManager } from "./game/PipeManager";

export default function Game() {
    const canvasRef = useRef(null);

    const gameRef = useRef({
        bird: null,
        pipes: null,
        score: 0,
        started: false,
        gameOver: false,
        pipeTimer: 0,
        lastFrame: 0,
        bestRuns: JSON.parse(localStorage.getItem("bestRuns")) || []
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const bgImg = new Image();
        bgImg.src = "/img/bg.png";


        canvas.width = 640;
        canvas.height = 640;

        const bird = new Bird(
            canvas.width / 8,
            canvas.height / 2,
            34,
            24,
            "/img/bird.png"
        );

        const pipes = new PipeManager(canvas.width, canvas.height);

        gameRef.current.bird = bird;
        gameRef.current.pipes = pipes;

        const handleInput = () => {
            const game = gameRef.current;

            if (!game.started) game.started = true;
            if (game.gameOver) return restart();

            bird.jump();
        };

        window.addEventListener("keydown", e => e.code === "Space" && handleInput());

        const loop = (time) => {
            requestAnimationFrame(loop);
            if (time - gameRef.current.lastFrame < 1000 / 70) return;
            gameRef.current.lastFrame = time;

            ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

            const game = gameRef.current;

            if (!game.started) {
                drawText(ctx, "Press Space or Click to Start", 320, 320, 36);
                bird.draw(ctx);
                return;
            }

            if (game.gameOver) {
                drawGameOver(ctx, game);
                return;
            }

            game.pipeTimer++;
            if (game.pipeTimer > 90) {
                pipes.createPipes();
                game.pipeTimer = 0;
            }

            if (bird.update(canvas.height)) endGame();

            pipes.update(
                bird,
                () => game.score++,
                () => endGame()
            );

            pipes.draw(ctx);
            bird.draw(ctx);

            ctx.fillStyle = "white";
            ctx.font = "32px sans-serif";
            ctx.fillText(`Score: ${game.score}`, 10, 40);
        };

        const endGame = () => {
            const game = gameRef.current;
            game.gameOver = true;
            game.bestRuns.push(game.score);
            game.bestRuns.sort((a, b) => b - a);
            game.bestRuns = game.bestRuns.slice(0, 5);
            localStorage.setItem("bestRuns", JSON.stringify(game.bestRuns));
        };

        const restart = () => {
            const game = gameRef.current;
            game.score = 0;
            game.started = false;
            game.gameOver = false;
            game.pipeTimer = 0;
            bird.reset();
            pipes.reset();
        };

        requestAnimationFrame(loop);

        return () => {
            window.removeEventListener("keydown", handleInput);
            window.removeEventListener("mousedown", handleInput);
        };
    }, []);

    return <canvas ref={canvasRef} />;
}

function drawText(ctx, text, x, y, size) {
    ctx.fillStyle = "white";
    ctx.font = `${size}px sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(text, x, y);
    ctx.textAlign = "left";
}

function drawGameOver(ctx, game) {
    drawText(ctx, "GAME OVER", 320, 200, 48);
    drawText(ctx, `Score: ${game.score}`, 320, 260, 28);
    drawText(ctx, `Record: ${Math.max(...game.bestRuns, 0)}`, 320, 300, 28);
    drawText(ctx, "Press Space or Click to Restart", 320, 340, 22);
}
