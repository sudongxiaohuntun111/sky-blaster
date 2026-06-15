import { checkCollision, randomRange } from './utils.js';
import { Player } from './player.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

let gameState = 'menu';
let lastTime = 0;
let deltaTime = 0;

let player = null;
let enemies = [];
let bullets = [];
let experienceOrbs = [];
let particles = [];

function gameLoop(timestamp) {
    deltaTime = (timestamp - lastTime) / 1000;
    lastTime = timestamp;
    
    if (deltaTime > 0.1) deltaTime = 0.1;
    
    if (gameState === 'playing') {
        update(deltaTime);
    }
    
    render();
    
    requestAnimationFrame(gameLoop);
}

function update(dt) {
    if (player) {
        const newBullets = player.update(dt);
        if (newBullets && newBullets.length > 0) {
            bullets.push(...newBullets);
        }
    }
}

function render() {
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    
    if (player) {
        player.render(ctx);
    }
}

function startGame(difficulty) {
    gameState = 'playing';
    player = new Player(difficulty);
    enemies = [];
    bullets = [];
    experienceOrbs = [];
    particles = [];
    console.log('Player created with HP:', player.hp);
}

const keys = {};
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    
    if (gameState === 'menu') {
        if (e.key === '1') startGame('easy');
        if (e.key === '2') startGame('normal');
        if (e.key === '3') startGame('hard');
    }
    
    if (e.key === 'Escape' && gameState === 'playing') {
        gameState = 'paused';
    } else if (e.key === 'Escape' && gameState === 'paused') {
        gameState = 'playing';
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

export { canvas, ctx, keys, gameState, GAME_WIDTH, GAME_HEIGHT };

requestAnimationFrame(gameLoop);
console.log('Sky Blaster loaded. Press 1/2/3 to start.');