// Brick Breaker Game Logic
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('gameOverlay');
const startButton = document.getElementById('startButton');
const overlayTitle = document.getElementById('overlayTitle');
const overlayMessage = document.getElementById('overlayMessage');

// Set canvas size
canvas.width = 800;
canvas.height = 600;

// Game variables
let score = 0;
let lives = 3;
let level = 1;
let gameState = 'start'; // start, playing, paused, gameOver, levelComplete
let animationId;

// Paddle
const paddle = {
    width: 120,
    height: 15,
    x: canvas.width / 2 - 60,
    y: canvas.height - 40,
    speed: 8,
    dx: 0
};

// Ball
const ball = {
    x: canvas.width / 2,
    y: paddle.y - 10,
    radius: 8,
    speed: 5,
    dx: 0,
    dy: 0,
    launched: false
};

// Bricks
const brickInfo = {
    rows: 5,
    cols: 9,
    width: 75,
    height: 25,
    padding: 10,
    offsetX: 35,
    offsetY: 60,
    visible: true
};

let bricks = [];

// Colors for different brick rows
const brickColors = [
    '#ef4444', // red
    '#f59e0b', // orange
    '#10b981', // green
    '#06b6d4', // cyan
    '#8b5cf6'  // purple
];

// Initialize bricks
function createBricks() {
    bricks = [];
    for (let row = 0; row < brickInfo.rows; row++) {
        bricks[row] = [];
        for (let col = 0; col < brickInfo.cols; col++) {
            bricks[row][col] = {
                x: col * (brickInfo.width + brickInfo.padding) + brickInfo.offsetX,
                y: row * (brickInfo.height + brickInfo.padding) + brickInfo.offsetY,
                status: 1,
                color: brickColors[row]
            };
        }
    }
}

// Draw paddle
function drawPaddle() {
    const gradient = ctx.createLinearGradient(paddle.x, 0, paddle.x + paddle.width, 0);
    gradient.addColorStop(0, '#06b6d4');
    gradient.addColorStop(1, '#0891b2');

    ctx.fillStyle = gradient;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#06b6d4';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.shadowBlur = 0;
}

// Draw ball
function drawBall() {
    const gradient = ctx.createRadialGradient(ball.x, ball.y, 0, ball.x, ball.y, ball.radius);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(1, '#06b6d4');

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#06b6d4';
    ctx.fill();
    ctx.closePath();
    ctx.shadowBlur = 0;
}

// Draw bricks
function drawBricks() {
    bricks.forEach(row => {
        row.forEach(brick => {
            if (brick.status === 1) {
                ctx.fillStyle = brick.color;
                ctx.shadowBlur = 10;
                ctx.shadowColor = brick.color;
                ctx.fillRect(brick.x, brick.y, brickInfo.width, brickInfo.height);
                ctx.shadowBlur = 0;

                // Add highlight
                ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.fillRect(brick.x, brick.y, brickInfo.width, brickInfo.height / 3);
            }
        });
    });
}

// Move paddle
function movePaddle() {
    paddle.x += paddle.dx;

    // Wall detection
    if (paddle.x < 0) {
        paddle.x = 0;
    }
    if (paddle.x + paddle.width > canvas.width) {
        paddle.x = canvas.width - paddle.width;
    }
}

// Move ball
function moveBall() {
    if (!ball.launched) {
        ball.x = paddle.x + paddle.width / 2;
        ball.y = paddle.y - ball.radius;
        return;
    }

    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision (left and right)
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx *= -1;
    }

    // Wall collision (top)
    if (ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }

    // Paddle collision
    if (ball.y + ball.radius > paddle.y &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width) {

        // Calculate hit position on paddle (-1 to 1)
        const hitPos = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);

        // Adjust ball angle based on hit position
        ball.dx = hitPos * ball.speed;
        ball.dy = -Math.abs(ball.dy);
    }

    // Bottom wall - lose life
    if (ball.y + ball.radius > canvas.height) {
        lives--;
        updateStats();

        if (lives === 0) {
            gameOver();
        } else {
            resetBall();
        }
    }
}

// Brick collision detection
function brickCollision() {
    bricks.forEach(row => {
        row.forEach(brick => {
            if (brick.status === 1) {
                if (ball.x + ball.radius > brick.x &&
                    ball.x - ball.radius < brick.x + brickInfo.width &&
                    ball.y + ball.radius > brick.y &&
                    ball.y - ball.radius < brick.y + brickInfo.height) {

                    ball.dy *= -1;
                    brick.status = 0;
                    score += 10;
                    updateStats();

                    // Check if level complete
                    if (checkLevelComplete()) {
                        levelComplete();
                    }
                }
            }
        });
    });
}

// Check if all bricks are destroyed
function checkLevelComplete() {
    return bricks.every(row => row.every(brick => brick.status === 0));
}

// Level complete
function levelComplete() {
    gameState = 'levelComplete';
    level++;
    ball.speed += 0.5;
    updateStats();

    overlayTitle.textContent = 'LEVEL COMPLETE!';
    overlayMessage.textContent = `Level ${level - 1} cleared! Press SPACE or Click to continue`;
    startButton.textContent = 'NEXT LEVEL';
    overlay.classList.remove('hidden');
}

// Game over
function gameOver() {
    gameState = 'gameOver';

    overlayTitle.textContent = 'GAME OVER';
    overlayMessage.textContent = `Final Score: ${score}`;
    startButton.textContent = 'PLAY AGAIN';
    overlay.classList.remove('hidden');
}

// Reset ball
function resetBall() {
    ball.launched = false;
    ball.x = paddle.x + paddle.width / 2;
    ball.y = paddle.y - ball.radius;
    ball.dx = 0;
    ball.dy = 0;
}

// Update stats display
function updateStats() {
    document.getElementById('score').textContent = score;
    document.getElementById('lives').textContent = lives;
    document.getElementById('level').textContent = level;
}

// Draw everything
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw game elements
    drawBricks();
    drawPaddle();
    drawBall();
}

// Update game
function update() {
    if (gameState === 'playing') {
        movePaddle();
        moveBall();
        brickCollision();
        draw();
        animationId = requestAnimationFrame(update);
    }
}

// Start game
function startGame() {
    if (gameState === 'gameOver') {
        // Reset everything
        score = 0;
        lives = 3;
        level = 1;
        ball.speed = 5;
    }

    createBricks();
    resetBall();
    updateStats();
    gameState = 'playing';
    overlay.classList.add('hidden');
    update();
}

// Launch ball
function launchBall() {
    if (!ball.launched && gameState === 'playing') {
        ball.launched = true;
        const angle = (Math.random() * 60 - 30) * Math.PI / 180; // -30 to 30 degrees
        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = -ball.speed * Math.cos(angle);
    }
}

// Keyboard controls
function keyDown(e) {
    if (e.key === 'ArrowRight' || e.key === 'Right') {
        paddle.dx = paddle.speed;
    } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        paddle.dx = -paddle.speed;
    } else if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        if (gameState === 'start' || gameState === 'levelComplete' || gameState === 'gameOver') {
            startGame();
        } else if (gameState === 'playing') {
            launchBall();
        }
    }
}

function keyUp(e) {
    if (e.key === 'ArrowRight' || e.key === 'Right' ||
        e.key === 'ArrowLeft' || e.key === 'Left') {
        paddle.dx = 0;
    }
}

// Mouse controls
function mouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    if (mouseX > 0 && mouseX < canvas.width) {
        paddle.x = mouseX - paddle.width / 2;

        // Keep paddle in bounds
        if (paddle.x < 0) paddle.x = 0;
        if (paddle.x + paddle.width > canvas.width) {
            paddle.x = canvas.width - paddle.width;
        }
    }

    if (gameState === 'playing') {
        draw();
    }
}

function canvasClick() {
    if (gameState === 'start' || gameState === 'levelComplete' || gameState === 'gameOver') {
        startGame();
    } else if (gameState === 'playing') {
        launchBall();
    }
}

// Event listeners
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
canvas.addEventListener('mousemove', mouseMove);
canvas.addEventListener('click', canvasClick);
startButton.addEventListener('click', startGame);

// Initialize
createBricks();
draw();
updateStats();
