const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 320;
canvas.height = 480;

const bird = {
    x: 50,
    y: canvas.height / 2,
    width: 20,
    height: 20,
    gravity: 0.6,
    lift: -12,
    velocity: 0,
};

const pipes = [];
const pipeWidth = 50;
const pipeGap = 100;
const pipeSpeed = 2;

let frame = 0;
let score = 0;
let gameOver = false;

function drawBird() {
    ctx.fillStyle = '#ff0';
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    ctx.fillStyle = '#0f0';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
    });
}

function drawScore() {
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        gameOver = true;
    }
}

function updatePipes() {
    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;

        if (pipe.x + pipeWidth < 0) {
            pipes.shift();
            score++;
        }
    });

    if (frame % 90 === 0) {
        const pipeHeight = Math.random() * (canvas.height - pipeGap - 50) + 25;
        pipes.push({
            x: canvas.width,
            top: pipeHeight,
            bottom: canvas.height - pipeHeight - pipeGap,
        });
    }
}

function checkCollision() {
    for (const pipe of pipes) {
        if (bird.x < pipe.x + pipeWidth &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)) {
            gameOver = true;
        }
    }
}

function handleKeyPress(e) {
    if (e.key === ' ') {
        bird.velocity = bird.lift;
    }
}

function gameLoop() {
    if (gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#000';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2);
        return;
    }

    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    updateBird();
    updatePipes();
    checkCollision();

    drawBird();
    drawPipes();
    drawScore();

    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', handleKeyPress);
gameLoop();
