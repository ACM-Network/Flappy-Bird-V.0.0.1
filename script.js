const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    color: '#ff5733',
    speed: 5,
};

const obstacles = [];
const powerUps = [];
const obstacleWidth = 50;
const obstacleHeight = 50;
const powerUpSize = 30;
const obstacleSpeed = 3;
const powerUpInterval = 5000; // in milliseconds

let score = 0;
let gameOver = false;
let lastPowerUpTime = Date.now();

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacles() {
    ctx.fillStyle = '#00aaff';
    obstacles.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, obstacleWidth, obstacleHeight);
    });
}

function drawPowerUps() {
    ctx.fillStyle = '#ffea00';
    powerUps.forEach(pu => {
        ctx.fillRect(pu.x, pu.y, powerUpSize, powerUpSize);
    });
}

function drawScore() {
    ctx.fillStyle = '#fff';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function updatePlayer() {
    if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
    if (keys['ArrowRight'] && player.x + player.width < canvas.width) player.x += player.speed;
}

function updateObstacles() {
    obstacles.forEach(obs => {
        obs.y += obstacleSpeed;
    });
    obstacles.filter(obs => obs.y <= canvas.height);
    if (Math.random() < 0.02) {
        obstacles.push({
            x: Math.random() * (canvas.width - obstacleWidth),
            y: -obstacleHeight,
        });
    }
}

function updatePowerUps() {
    powerUps.forEach(pu => {
        pu.y += obstacleSpeed;
    });
    powerUps = powerUps.filter(pu => pu.y <= canvas.height);
    if (Date.now() - lastPowerUpTime > powerUpInterval) {
        powerUps.push({
            x: Math.random() * (canvas.width - powerUpSize),
            y: -powerUpSize,
        });
        lastPowerUpTime = Date.now();
    }
}

function checkCollisions() {
    obstacles.forEach(obs => {
        if (player.x < obs.x + obstacleWidth &&
            player.x + player.width > obs.x &&
            player.y < obs.y + obstacleHeight &&
            player.y + player.height > obs.y) {
            gameOver = true;
        }
    });
    
    powerUps.forEach(pu => {
        if (player.x < pu.x + powerUpSize &&
            player.x + player.width > pu.x &&
            player.y < pu.y + powerUpSize &&
            player.y + player.height > pu.y) {
            score += 10;
            powerUps.splice(powerUps.indexOf(pu), 1);
        }
    });
}

function gameLoop() {
    if (gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = '40px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updatePlayer();
    updateObstacles();
    updatePowerUps();
    checkCollisions();

    drawPlayer();
    drawObstacles();
    drawPowerUps();
    drawScore();

    requestAnimationFrame(gameLoop);
}

const keys = {};
document.addEventListener('keydown', e => {
    keys[e.key] = true;
});
document.addEventListener('keyup', e => {
    keys[e.key] = false;
});

gameLoop();
