import { checkCollision, randomRange } from './utils.js';
import { Player } from './player.js';
import { Enemy, EnemySpawner } from './enemies.js';
import { LEVELS, DIFFICULTY } from './config.js';

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

let enemySpawner = null;
let waveTimer = 0;
let currentWave = 0;
let currentLevel = 1;
let difficulty = 'normal';
let score = 0;
let bossSpawned = false;

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
    
    if (enemySpawner) {
        enemySpawner.update(dt, enemies);
    }
    
    enemies.forEach(enemy => {
        enemy.update(dt, player ? player.x : 0, player ? player.y : 0);
    });
    
    enemies = enemies.filter(e => e.active);
    
    if (!enemySpawner.waveActive && enemies.length === 0 && !bossSpawned) {
        waveTimer += dt;
        if (waveTimer >= 2) {
            waveTimer = 0;
            startNextWave();
        }
    }
}

function render() {
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    
    if (player) {
        player.render(ctx);
    }
    
    enemies.forEach(enemy => enemy.render(ctx));
    
    ctx.fillStyle = '#fff';
    ctx.font = '14px monospace';
    ctx.fillText(`Score: ${score}`, 10, 20);
    ctx.fillText(`Wave: ${currentWave}`, 10, 40);
}

function startGame(diff) {
    gameState = 'playing';
    difficulty = diff;
    player = new Player(diff);
    enemies = [];
    bullets = [];
    experienceOrbs = [];
    particles = [];
    
    enemySpawner = new EnemySpawner(diff);
    currentWave = 0;
    waveTimer = 0;
    bossSpawned = false;
    currentLevel = 1;
    score = 0;
    
    startNextWave();
    console.log('Game started with difficulty:', diff);
}

function startNextWave() {
    currentWave++;
    const levelConfig = LEVELS[currentLevel - 1];
    
    if (currentWave <= levelConfig.waves) {
        enemySpawner.startWave(
            currentWave,
            levelConfig.enemyTypes,
            DIFFICULTY[difficulty].enemySpawnMultiplier
        );
    }
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