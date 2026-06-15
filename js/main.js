import { checkCollision, randomRange } from './utils.js';
import { Player } from './player.js';
import { Enemy, EnemySpawner } from './enemies.js';
import { BulletManager } from './bullets.js';
import { ExperienceSystem } from './experience.js';
import { SkillSystem, SkillSelectionUI } from './skills.js';
import { Boss } from './boss.js';
import { LevelManager } from './levels.js';
import { ParticleSystem } from './particles.js';
import { AudioSystem } from './audio.js';
import { MainMenu, PauseMenu, GameOverScreen, VictoryScreen } from './ui.js';
import { LEVELS, DIFFICULTY, EXPERIENCE } from './config.js';
import {
    initCanvas, getCanvas, getCtx, getKeys,
    handleKeyDown, handleKeyUp, getGameState, setGameState,
    GAME_WIDTH, GAME_HEIGHT
} from './game.js';

initCanvas();

const canvas = getCanvas();
const ctx = getCtx();
const keys = getKeys();

let gameState = 'menu';
let lastTime = 0;
let deltaTime = 0;

let player = null;
let enemies = [];

let bulletManager = null;
let enemySpawner = null;
let experienceSystem = null;
let skillSystem = null;
let skillSelectionUI = null;
let currentBoss = null;
let levelManager = null;
let particleSystem = null;
let audioSystem = null;
let mainMenu = null;
let pauseMenu = null;
let gameOverScreen = null;
let victoryScreen = null;
let waveTimer = 0;
let currentWave = 0;
let currentLevel = 1;
let difficulty = 'normal';
let score = 0;
let bossSpawned = false;
let showingSkillSelection = false;

function gameLoop(timestamp) {
    deltaTime = (timestamp - lastTime) / 1000;
    lastTime = timestamp;
    
    if (deltaTime > 0.1) deltaTime = 0.1;
    
    if (gameState === 'playing') {
        update(deltaTime);
    }
    
    if (mainMenu) {
        mainMenu.update(deltaTime);
    }
    
    render();
    
    requestAnimationFrame(gameLoop);
}

function update(dt) {
    if (showingSkillSelection) return;
    
    if (player) {
        const newBullets = player.update(dt);
        if (newBullets && newBullets.length > 0) {
            newBullets.forEach(b => {
                bulletManager.addPlayerBullet(b);
                audioSystem.playShoot();
            });
        }
        
        particleSystem.createEngineTrail(
            player.x + player.width / 2,
            player.y + player.height
        );
    }
    
    if (enemySpawner) {
        enemySpawner.update(dt, enemies);
    }
    
    enemies.forEach(enemy => {
        enemy.update(dt, player ? player.x : 0, player ? player.y : 0);
        
        if (enemy.canShoot() && player) {
            bulletManager.addEnemyBullet(
                enemy.x + enemy.width / 2,
                enemy.y + enemy.height,
                enemy.bulletSpeed,
                1
            );
        }
    });
    
    enemies = enemies.filter(e => e.active);
    
    if (currentBoss && currentBoss.active) {
        currentBoss.update(dt, player ? player.x : 0, player ? player.y : 0);
        
        if (currentBoss.canAttack()) {
            const pattern = currentBoss.getAttackPattern();
            const bossBullets = currentBoss.generateBullets(pattern);
            bossBullets.forEach(b => {
                bulletManager.enemyBullets.push({
                    x: b.x,
                    y: b.y,
                    width: b.width,
                    height: b.height,
                    speed: Math.sqrt(b.vx * b.vx + b.vy * b.vy),
                    damage: b.damage,
                    vx: b.vx,
                    vy: b.vy,
                    active: true,
                    isHoming: false
                });
            });
        }
        
        bulletManager.playerBullets.forEach(bullet => {
            if (!bullet.active || !currentBoss.active) return;
            
            if (bulletManager.checkOverlap(bullet, currentBoss)) {
                bullet.active = false;
                const defeated = currentBoss.takeDamage(bullet.damage);
                
                if (defeated) {
                    particleSystem.createExplosion(
                        currentBoss.x + currentBoss.width / 2,
                        currentBoss.y + currentBoss.height / 2,
                        50
                    );
                    audioSystem.playExplosion();
                    score += 500;
                    
                    if (currentLevel >= 3) {
                        audioSystem.playVictory();
                        victoryScreen = new VictoryScreen(score, 0, skillSystem.selectedSkills);
                        gameState = 'victory';
                    } else {
                        currentLevel++;
                        levelManager.loadLevel(currentLevel);
                        currentWave = 0;
                        bossSpawned = false;
                        currentBoss = null;
                    }
                }
            }
        });
    }
    
    bulletManager.update(dt, enemies);
    
    const results = bulletManager.checkCollisions(enemies, player);
    
    results.enemiesHit.forEach(enemy => {
        particleSystem.createExplosion(
            enemy.x + enemy.width / 2,
            enemy.y + enemy.height / 2,
            15
        );
        audioSystem.playExplosion();
        experienceSystem.addOrbs(
            enemy.x + enemy.width / 2,
            enemy.y + enemy.height / 2,
            enemy.points
        );
        score += enemy.points;
    });
    
    if (results.playerHit && player) {
        const dead = player.takeDamage(1);
        if (dead) {
            gameOverScreen = new GameOverScreen(score, currentLevel, skillSystem.selectedSkills);
            gameState = 'gameOver';
        }
    }
    
    if (player) {
        const magnetRange = EXPERIENCE.orbMagnetRange + 
            (player.skills.magnet || 0) * 30;
        
        const leveledUp = experienceSystem.update(
            dt,
            player.x + player.width / 2,
            player.y + player.height / 2,
            magnetRange
        );
        
        if (leveledUp) {
            audioSystem.playLevelUp();
            triggerSkillSelection();
        }
    }
    
    if (levelManager) {
        levelManager.update(dt);
    }
    
    particleSystem.update(dt);
    
    if (!enemySpawner.waveActive && enemies.length === 0 && !bossSpawned && !currentBoss) {
        waveTimer += dt;
        if (waveTimer >= 2) {
            waveTimer = 0;
            startNextWave();
        }
    }
}

function triggerSkillSelection() {
    showingSkillSelection = true;
    const availableSkills = skillSystem.getRandomSkills(3);
    skillSelectionUI.show(availableSkills, (skillId) => {
        skillSystem.selectSkill(skillId);
        player.addSkill(skillId);
        showingSkillSelection = false;
    });
}

function render() {
    switch (gameState) {
        case 'menu':
            if (mainMenu) {
                mainMenu.render(ctx);
            }
            break;
            
        case 'playing':
        case 'paused':
            if (levelManager) {
                levelManager.render(ctx);
            } else {
                ctx.fillStyle = '#1a1a2e';
                ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
            }
            
            if (player) {
                player.render(ctx);
            }
            
            enemies.forEach(enemy => enemy.render(ctx));
            
            if (currentBoss && currentBoss.active) {
                currentBoss.render(ctx);
            }
            
            bulletManager.render(ctx);
            
            experienceSystem.render(ctx);
            
            particleSystem.render(ctx);
            
            renderHUD();
            
            if (showingSkillSelection) {
                skillSelectionUI.render(ctx, GAME_WIDTH, GAME_HEIGHT);
            }
            
            if (gameState === 'paused' && pauseMenu) {
                pauseMenu.render(ctx);
            }
            break;
            
        case 'gameOver':
            if (gameOverScreen) {
                gameOverScreen.render(ctx);
            }
            break;
            
        case 'victory':
            if (victoryScreen) {
                victoryScreen.render(ctx);
            }
            break;
    }
}

function renderHUD() {
    if (!player) return;
    
    ctx.fillStyle = '#ff4757';
    for (let i = 0; i < player.hp; i++) {
        ctx.fillRect(10 + i * 25, 10, 20, 20);
    }
    
    const xpProgress = experienceSystem.getXPProgress();
    ctx.fillStyle = '#333';
    ctx.fillRect(10, GAME_HEIGHT - 30, GAME_WIDTH - 20, 20);
    ctx.fillStyle = '#2ed573';
    ctx.fillRect(10, GAME_HEIGHT - 30, (GAME_WIDTH - 20) * xpProgress, 20);
    
    ctx.fillStyle = '#fff';
    ctx.font = '14px monospace';
    ctx.fillText(`Lv.${experienceSystem.currentLevel}`, 15, GAME_HEIGHT - 15);
    
    ctx.fillText(`Score: ${score}`, GAME_WIDTH - 100, 25);
    ctx.fillText(`Wave: ${currentWave}`, GAME_WIDTH - 100, 45);
    ctx.fillText(`Level: ${currentLevel}`, GAME_WIDTH - 100, 65);
}

function startGame(diff) {
    gameState = 'playing';
    difficulty = diff;
    player = new Player(diff);
    enemies = [];
    
    bulletManager = new BulletManager();
    enemySpawner = new EnemySpawner(diff);
    experienceSystem = new ExperienceSystem(diff);
    skillSystem = new SkillSystem();
    skillSelectionUI = new SkillSelectionUI();
    levelManager = new LevelManager();
    levelManager.loadLevel(1);
    particleSystem = new ParticleSystem();
    audioSystem = new AudioSystem();
    audioSystem.init();
    currentBoss = null;
    currentWave = 0;
    waveTimer = 0;
    bossSpawned = false;
    currentLevel = 1;
    score = 0;
    showingSkillSelection = false;
    
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
    } else if (!bossSpawned && !currentBoss) {
        audioSystem.playBossWarning();
        spawnBoss();
    }
}

function spawnBoss() {
    bossSpawned = true;
    const levelConfig = LEVELS[currentLevel - 1];
    currentBoss = new Boss(levelConfig.bossKey, DIFFICULTY[difficulty]);
}

mainMenu = new MainMenu();

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    
    switch (gameState) {
        case 'menu':
            const selectedDifficulty = mainMenu.handleInput(e.key);
            if (selectedDifficulty) {
                startGame(selectedDifficulty);
            }
            break;
            
        case 'playing':
            if (showingSkillSelection) {
                skillSelectionUI.handleInput(e.key);
                return;
            }
            
            if (e.key === 'Escape') {
                pauseMenu = new PauseMenu();
                gameState = 'paused';
            }
            break;
            
        case 'paused':
            if (pauseMenu) {
                const result = pauseMenu.handleInput(e.key);
                if (result === 'resume') {
                    gameState = 'playing';
                } else if (result === 'menu') {
                    mainMenu = new MainMenu();
                    gameState = 'menu';
                }
            }
            break;
            
        case 'gameOver':
            if (gameOverScreen) {
                const result = gameOverScreen.handleInput(e.key);
                if (result === 'restart') {
                    startGame(difficulty);
                } else if (result === 'menu') {
                    mainMenu = new MainMenu();
                    gameState = 'menu';
                }
            }
            break;
            
        case 'victory':
            if (victoryScreen) {
                const result = victoryScreen.handleInput(e.key);
                if (result === 'restart') {
                    startGame(difficulty);
                } else if (result === 'menu') {
                    mainMenu = new MainMenu();
                    gameState = 'menu';
                }
            }
            break;
    }
    
    if (e.key === 'm' || e.key === 'M') {
        if (audioSystem) {
            audioSystem.toggleSound();
        }
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

requestAnimationFrame(gameLoop);
console.log('Sky Blaster loaded. Press 1/2/3 to start.');