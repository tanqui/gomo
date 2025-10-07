// Get the canvas and context
const canvas = document.getElementById('gamebolinha');
const ctx = canvas.getContext('2d');

const gridSize = 10; // Size of the grid cells
let snake = [{ x: 160, y: 160 }, { x: 150, y: 160 }, { x: 140, y: 160 }];
let food = { x: 220, y: 220 };
let direction = { x: gridSize, y: 0 }; // Initial direction (moving right)
let score = 0;
let gameInterval;
let isGameOver = false;
let gameStarted = false;

// Function to start/restart the game
function startGame() {
    // Initialize game variables
    snake = [{ x: 160, y: 160 }, { x: 150, y: 160 }, { x: 140, y: 160 }];
    food = { x: 220, y: 220 };
    direction = { x: gridSize, y: 0 };
    score = 0;
    isGameOver = false;
    gameStarted = true;
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 70); // Start the game loop

    // Remove any existing "Click to Start" message
    drawGame();
}

// Function to end the game
function endGame() {
    clearInterval(gameInterval);
    isGameOver = true;
    drawGame();
}

// Function to handle keyboard input
function changeDirection(event) {
    if (isGameOver) return;

    if (event.key === 'ArrowUp' && direction.y === 0) {
        direction = { x: 0, y: -gridSize };
    } else if (event.key === 'ArrowDown' && direction.y === 0) {
        direction = { x: 0, y: gridSize };
    } else if (event.key === 'ArrowLeft' && direction.x === 0) {
        direction = { x: -gridSize, y: 0 };
    } else if (event.key === 'ArrowRight' && direction.x === 0) {
        direction = { x: gridSize, y: 0 };
    }
}

// Function to detect collision with walls or self
function detectCollision() {
    const head = snake[0];
    // Wall collision
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        return true;
    }
    // Self-collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

// Function to handle food consumption
function eatFood() {
    const head = snake[0];
    if (head.x === food.x && head.y === food.y) {
        score+=1;
        snake.push({}); // Add new segment to the snake
        // Generate new food location
        food = {
            x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
            y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
        };
    }
}

// Function to update the game state and redraw the canvas
function gameLoop() {
    if (detectCollision()) {
        endGame();
        return;
    }

    // Move the snake
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head); // Add new head to the snake

    eatFood(); // Check if food is eaten

    if (!isGameOver) {
        snake.pop(); // Remove the last segment of the snake if not game over
    }

    drawGame();
}

// Function to draw the game on the canvas
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Draw the snake
    snake.forEach((segment, index) => {
        if (index === 0) {
            // Draw the head in red
            ctx.fillStyle = 'blue';
        } else {
            // Draw the body in green
            ctx.fillStyle = 'orange';
        }
        //ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
        ctx.beginPath(), ctx.arc(segment.x + gridSize / 2, segment.y + gridSize / 2, gridSize / 2, 0, Math.PI * 2), ctx.fill();
    });

    // Draw the food in yellow
    ctx.fillStyle = 'blue';
    ctx.beginPath(), ctx.arc(food.x + gridSize / 2, food.y + gridSize / 2, gridSize / 2, 0, Math.PI * 2), ctx.fill();

    // Draw the score
    ctx.fillStyle = 'black';
    ctx.font = '15px Helvetica';
    ctx.fillText('berries: ' + score, 10, 20);

    // If the game is over, show a message
    if (isGameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '20px Helvetica';
        ctx.fillText('oopsie', canvas.width / 2 - 30, canvas.height / 2 -20);
        ctx.font = '15px Helvetica';
    // código original  ctx.fillText('berries: ' + score, canvas.width / 2 - 30, canvas.height / 2 + 10); // Show the score
        ctx.fillText('you can do better!', canvas.width / 2 - 55, canvas.height / 2 + 10);
        ctx.fillText('', canvas.width / 2 - 15, canvas.height / 2 + 40);
    } else if (!gameStarted) {
        // If the game has not started, show the "Click to Start" message
        ctx.fillStyle = 'black';
        ctx.font = '20px Helvetica';
        ctx.fillText('click anywhere', canvas.width / 2 - 65, canvas.height / 2);
    }
}

// Event listener for keyboard input
window.addEventListener('keydown', changeDirection);

// Event listener for clicking the canvas to start or restart the game
canvas.addEventListener('click', () => {
    if (isGameOver) {
        startGame(); // Restart the game if it's over
    } else if (!gameStarted) {
        startGame(); // Start the game if not started
    }
});

// Initialize the game by showing the "Click to Start" message
drawGame();