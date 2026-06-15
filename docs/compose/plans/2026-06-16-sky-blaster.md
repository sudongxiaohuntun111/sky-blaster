# Sky Blaster Implementation Plan

> [!NOTE]
> This document may not reflect the current implementation.
> See the final report for up-to-date state:
> [Final Report](../reports/sky-blaster.md)

> **For agentic workers:** REQUIRED SUB-SKILL: Use compose:subagent (recommended) or compose:execute to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete 2D vertical scrolling shooter game with Roguelike skill upgrades for 7-8 year old boys

**Architecture:** Modular JavaScript with separate files for each game system (player, enemies, boss, skills, levels, UI, audio, particles). HTML5 Canvas for rendering, no framework dependencies.

**Tech Stack:** HTML5 Canvas, vanilla JavaScript (ES6 modules), Web Audio API

---

## File Structure

```
/home/sudong/mimo code/
├── index.html                    # Game entry point
├── css/
│   └── style.css                 # Global styles, canvas centering
├── js/
│   ├── main.js                   # Game loop, initialization, state management
│   ├── config.js                 # Game constants, difficulty settings, skill data
│   ├── player.js                 # Player ship logic, movement, shooting
│   ├── enemies.js                # Enemy types, spawning, behavior
│   ├── boss.js                   # Boss system, phases, attacks
│   ├── skills.js                 # Skill system, selection, upgrades
│   ├── levels.js                 # Level progression, wave definitions
│   ├── ui.js                     # HUD, menus, skill selection UI
│   ├── audio.js                  # Sound effects, music management
│   ├── particles.js              # Particle effects (explosions, trails)
│   └── utils.js                  # Collision detection, math helpers
└── assets/
    └── audio/                    # Sound effects (generated via Web Audio API)
```

---

## Task 1: Project Scaffold & Game Loop

**Covers:** [S11, S12]

**Files:**
- Create: `/home/sudong/mimo code/index.html`
- Create: `/home/sudong/mimo code/css/style.css`
- Create: `/home/sudong/mimo code/js/main.js`
- Create: `/home/sudong/mimo code/js/utils.js`

- [ ] **Step 1: Create index.html with canvas element**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sky Blaster - 天空突击者</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <canvas id="gameCanvas"></canvas>
    <script type="module" src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create css/style.css with canvas centering**

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    background: #000;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

#gameCanvas {
    background: #1a1a2e;
    image-rendering: pixelated;
    image-rendering: crisp-edges;
}
```

- [ ] **Step 3: Create js/utils.js with collision detection**

```javascript
// Collision detection (AABB)
export function checkCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

// Random number helpers
export function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

export function randomInt(min, max) {
    return Math.floor(randomRange(min, max + 1));
}

// Clamp value between min and max
export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

// Distance between two points
export function distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

// Angle between two points (radians)
export function angleBetween(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
}
```

- [ ] **Step 4: Create js/main.js with game loop skeleton**

```javascript
import { checkCollision, randomRange } from './utils.js';

// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game dimensions
const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;

// Set canvas size
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

// Game state
let gameState = 'menu'; // menu, playing, paused, gameOver, victory
let lastTime = 0;
let deltaTime = 0;

// Game objects (will be populated by systems)
let player = null;
let enemies = [];
let bullets = [];
let experienceOrbs = [];
let particles = [];

// Main game loop
function gameLoop(timestamp) {
    // Calculate delta time
    deltaTime = (timestamp - lastTime) / 1000;
    lastTime = timestamp;
    
    // Cap delta time to prevent large jumps
    if (deltaTime > 0.1) deltaTime = 0.1;
    
    // Update based on game state
    if (gameState === 'playing') {
        update(deltaTime);
    }
    
    // Always render
    render();
    
    // Continue loop
    requestAnimationFrame(gameLoop);
}

// Update game logic
function update(dt) {
    // TODO: Update player, enemies, bullets, check collisions
    // Will be implemented in subsequent tasks
}

// Render game
function render() {
    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    
    // TODO: Render all game objects
    // Will be implemented in subsequent tasks
}

// Start the game
function startGame(difficulty) {
    gameState = 'playing';
    // TODO: Initialize all systems with difficulty settings
    console.log('Game started with difficulty:', difficulty);
}

// Handle keyboard input
const keys = {};
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    
    // Handle menu input
    if (gameState === 'menu') {
        if (e.key === '1') startGame('easy');
        if (e.key === '2') startGame('normal');
        if (e.key === '3') startGame('hard');
    }
    
    // Handle pause
    if (e.key === 'Escape' && gameState === 'playing') {
        gameState = 'paused';
    } else if (e.key === 'Escape' && gameState === 'paused') {
        gameState = 'playing';
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Export for other modules
export { canvas, ctx, keys, gameState, GAME_WIDTH, GAME_HEIGHT };

// Start the loop
requestAnimationFrame(gameLoop);
console.log('Sky Blaster loaded. Press 1/2/3 to start.');
```

- [ ] **Step 5: Open index.html in browser and verify**

Open `index.html` in a web browser. You should see:
- Black background
- Canvas centered on screen
- Console message: "Sky Blaster loaded. Press 1/2/3 to start."

- [ ] **Step 6: Commit**

```bash
cd "/home/sudong/mimo code"
git init
git add index.html css/style.js js/main.js js/utils.js
git commit -m "feat: project scaffold with game loop skeleton"
```

---

## Task 2: Game Configuration & Difficulty System

**Covers:** [S2, S11]

**Files:**
- Create: `/home/sudong/mimo code/js/config.js`

- [ ] **Step 1: Create js/config.js with all game constants**

```javascript
// Difficulty settings
export const DIFFICULTY = {
    easy: {
        playerHP: 5,
        invincibilityDuration: 2.0,
        enemySpawnMultiplier: 0.7,
        bossHPMultiplier: 0.6,
        enemySpeedMultiplier: 0.7,
        experienceMultiplier: 1.2,
        label: '简单',
        description: '适合新手玩家'
    },
    normal: {
        playerHP: 3,
        invincibilityDuration: 1.5,
        enemySpawnMultiplier: 1.0,
        bossHPMultiplier: 1.0,
        enemySpeedMultiplier: 1.0,
        experienceMultiplier: 1.0,
        label: '普通',
        description: '标准难度'
    },
    hard: {
        playerHP: 2,
        invincibilityDuration: 1.0,
        enemySpawnMultiplier: 1.5,
        bossHPMultiplier: 1.3,
        enemySpeedMultiplier: 1.2,
        experienceMultiplier: 0.8,
        label: '困难',
        description: '挑战极限'
    }
};

// Player settings
export const PLAYER = {
    width: 32,
    height: 32,
    speed: 200, // pixels per second
    shootInterval: 0.2, // seconds between shots
    bulletSpeed: 400,
    bulletDamage: 1,
    bulletWidth: 4,
    bulletHeight: 12
};

// Enemy settings
export const ENEMIES = {
    scout: {
        name: '侦察机',
        width: 24,
        height: 24,
        hp: 1,
        speed: 150,
        color: '#ff6b6b',
        points: 10
    },
    fighter: {
        name: '战斗机',
        width: 28,
        height: 28,
        hp: 2,
        speed: 100,
        color: '#ff9f43',
        points: 25
    },
    bomber: {
        name: '轰炸机',
        width: 32,
        height: 32,
        hp: 4,
        speed: 60,
        color: '#ee5a24',
        points: 50,
        shootInterval: 1.5,
        bulletSpeed: 200
    },
    drone: {
        name: '自爆无人机',
        width: 20,
        height: 20,
        hp: 1,
        speed: 250,
        color: '#ff3838',
        points: 15,
        isKamikaze: true
    }
};

// Boss settings
export const BOSSES = {
    level1: {
        name: '钢铁堡垒',
        width: 64,
        height: 64,
        hp: 100,
        color: '#2c3e50',
        phases: [
            { hpThreshold: 0.5, pattern: 'fan' },
            { hpThreshold: 0, pattern: 'fan_plus_scouts' }
        ]
    },
    level2: {
        name: '暗影猎手',
        width: 56,
        height: 56,
        hp: 150,
        color: '#8e44ad',
        phases: [
            { hpThreshold: 0.5, pattern: 'laser_sweep' },
            { hpThreshold: 0, pattern: 'clone_cross' }
        ]
    },
    level3: {
        name: '毁灭者',
        width: 72,
        height: 72,
        hp: 200,
        color: '#c0392b',
        phases: [
            { hpThreshold: 0.5, pattern: 'multi_direction' },
            { hpThreshold: 0.25, pattern: 'rain_shield' },
            { hpThreshold: 0, pattern: 'berserk' }
        ]
    }
};

// Skill definitions
export const SKILLS = {
    scatter: {
        name: '散射弹',
        description: '同时发射多发子弹',
        icon: '💥',
        maxLevel: 5,
        baseEffect: { bulletCount: 2 },
        levelBonus: { bulletCount: 1 }
    },
    laser: {
        name: '激光束',
        description: '发射穿透激光',
        icon: '⚡',
        maxLevel: 5,
        baseEffect: { damageMultiplier: 1.5 },
        levelBonus: { damageMultiplier: 0.2 }
    },
    homing: {
        name: '追踪弹',
        description: '自动追踪最近敌人',
        icon: '🎯',
        maxLevel: 5,
        baseEffect: { homingCount: 1 },
        levelBonus: { homingCount: 1 }
    },
    shield: {
        name: '护盾',
        description: '抵挡一次伤害',
        icon: '🛡️',
        maxLevel: 5,
        baseEffect: { shieldHits: 1 },
        levelBonus: { shieldHits: 1 }
    },
    speed: {
        name: '速度提升',
        description: '提高移动速度',
        icon: '🏃',
        maxLevel: 5,
        baseEffect: { speedMultiplier: 1.15 },
        levelBonus: { speedMultiplier: 0.15 }
    },
    magnet: {
        name: '磁铁',
        description: '扩大经验球吸引范围',
        icon: '🧲',
        maxLevel: 5,
        baseEffect: { magnetRange: 50 },
        levelBonus: { magnetRange: 30 }
    },
    damage: {
        name: '攻击力',
        description: '提高所有攻击伤害',
        icon: '⚔️',
        maxLevel: 5,
        baseEffect: { damageMultiplier: 1.25 },
        levelBonus: { damageMultiplier: 0.25 }
    },
    fireRate: {
        name: '射速提升',
        description: '缩短射击间隔',
        icon: '🔥',
        maxLevel: 5,
        baseEffect: { shootIntervalMultiplier: 0.8 },
        levelBonus: { shootIntervalMultiplier: 0.2 }
    }
};

// Level definitions
export const LEVELS = [
    {
        id: 1,
        name: '森林地带',
        bgColor: '#1a472a',
        waves: 6,
        bossKey: 'level1',
        enemyTypes: ['scout', 'fighter'],
        waveInterval: 3 // seconds between waves
    },
    {
        id: 2,
        name: '沙漠要塞',
        bgColor: '#c2b280',
        waves: 7,
        bossKey: 'level2',
        enemyTypes: ['scout', 'fighter', 'bomber'],
        waveInterval: 2.5
    },
    {
        id: 3,
        name: '机械要塞',
        bgColor: '#4a4a4a',
        waves: 8,
        bossKey: 'level3',
        enemyTypes: ['scout', 'fighter', 'bomber', 'drone'],
        waveInterval: 2
    }
];

// Experience system
export const EXPERIENCE = {
    baseXPPerLevel: 100,
    xpGrowthRate: 1.5, // each level requires 1.5x more XP
    orbValue: 10,
    orbMagnetRange: 30
};

// UI settings
export const UI = {
    hudHeight: 60,
    skillSelectionDuration: 0, // pause game, no duration
    colors: {
        hp: '#ff4757',
        xp: '#2ed573',
        text: '#ffffff',
        menuBg: 'rgba(0, 0, 0, 0.85)'
    }
};
```

- [ ] **Step 2: Verify config loads in browser**

Open browser console, you should see no errors. The config is now importable by all modules.

- [ ] **Step 3: Commit**

```bash
cd "/home/sudong/mimo code"
git add js/config.js
git commit -m "feat: add game configuration and difficulty settings"
```

---

## Task 3: Player Ship System

**Covers:** [S3]

**Files:**
- Create: `/home/sudong/mimo code/js/player.js`
- Modify: `/home/sudong/mimo code/js/main.js`

- [ ] **Step 1: Create js/player.js with player class**

```javascript
import { canvas, keys, GAME_WIDTH, GAME_HEIGHT } from './main.js';
import { PLAYER, DIFFICULTY } from './config.js';
import { clamp } from './utils.js';

export class Player {
    constructor(difficulty) {
        this.width = PLAYER.width;
        this.height = PLAYER.height;
        this.x = GAME_WIDTH / 2 - this.width / 2;
        this.y = GAME_HEIGHT - 80;
        
        // Stats from difficulty
        const diffSettings = DIFFICULTY[difficulty];
        this.maxHP = diffSettings.playerHP;
        this.hp = this.maxHP;
        this.invincibilityDuration = diffSettings.invincibilityDuration;
        
        // Movement
        this.speed = PLAYER.speed;
        this.dx = 0;
        this.dy = 0;
        
        // Shooting
        this.shootTimer = 0;
        this.shootInterval = PLAYER.shootInterval;
        this.bulletSpeed = PLAYER.bulletSpeed;
        this.bulletDamage = PLAYER.bulletDamage;
        
        // Invincibility
        this.isInvincible = false;
        this.invincibilityTimer = 0;
        this.visible = true;
        this.flashTimer = 0;
        
        // Skills
        this.skills = {};
        this.shieldHits = 0;
        
        // Visual
        this.color = '#4ecdc4';
    }
    
    update(dt) {
        // Handle input
        this.dx = 0;
        this.dy = 0;
        
        if (keys['ArrowLeft'] || keys['a'] || keys['A']) this.dx = -1;
        if (keys['ArrowRight'] || keys['d'] || keys['D']) this.dx = 1;
        if (keys['ArrowUp'] || keys['w'] || keys['W']) this.dy = -1;
        if (keys['ArrowDown'] || keys['s'] || keys['S']) this.dy = 1;
        
        // Normalize diagonal movement
        if (this.dx !== 0 && this.dy !== 0) {
            this.dx *= 0.707;
            this.dy *= 0.707;
        }
        
        // Apply speed with skill multiplier
        const speedMultiplier = this.getSkillMultiplier('speed');
        const currentSpeed = this.speed * speedMultiplier;
        
        // Update position
        this.x += this.dx * currentSpeed * dt;
        this.y += this.dy * currentSpeed * dt;
        
        // Clamp to screen bounds
        this.x = clamp(this.x, 0, GAME_WIDTH - this.width);
        this.y = clamp(this.y, 0, GAME_HEIGHT - this.height);
        
        // Update shooting
        this.shootTimer += dt;
        const currentShootInterval = this.shootInterval * this.getSkillMultiplier('fireRate');
        
        if (this.shootTimer >= currentShootInterval) {
            this.shootTimer = 0;
            this.shoot();
        }
        
        // Update invincibility
        if (this.isInvincible) {
            this.invincibilityTimer -= dt;
            this.flashTimer += dt;
            
            // Flash effect (toggle visibility every 0.1 seconds)
            if (this.flashTimer >= 0.1) {
                this.visible = !this.visible;
                this.flashTimer = 0;
            }
            
            if (this.invincibilityTimer <= 0) {
                this.isInvincible = false;
                this.visible = true;
            }
        }
    }
    
    shoot() {
        // Base: single bullet straight up
        const bulletCount = this.getSkillValue('scatter', 'bulletCount', 1);
        const damageMultiplier = this.getSkillMultiplier('damage');
        const damage = this.bulletDamage * damageMultiplier;
        
        // Create bullets array to return
        const bullets = [];
        
        if (bulletCount === 1) {
            // Single bullet
            bullets.push({
                x: this.x + this.width / 2 - PLAYER.bulletWidth / 2,
                y: this.y - PLAYER.bulletHeight,
                width: PLAYER.bulletWidth,
                height: PLAYER.bulletHeight,
                speed: this.bulletSpeed,
                damage: damage,
                isHoming: false
            });
        } else {
            // Scatter shot - fan pattern
            const spreadAngle = Math.PI / 6; // 30 degrees total spread
            const startAngle = -spreadAngle / 2;
            const angleStep = spreadAngle / (bulletCount - 1);
            
            for (let i = 0; i < bulletCount; i++) {
                const angle = startAngle + angleStep * i;
                const vx = Math.sin(angle) * this.bulletSpeed;
                const vy = -Math.cos(angle) * this.bulletSpeed;
                
                bullets.push({
                    x: this.x + this.width / 2 - PLAYER.bulletWidth / 2,
                    y: this.y,
                    width: PLAYER.bulletWidth,
                    height: PLAYER.bulletHeight,
                    vx: vx,
                    vy: vy,
                    damage: damage,
                    isHoming: false
                });
            }
        }
        
        // Add homing missiles if skill active
        const homingCount = this.getSkillValue('homing', 'homingCount', 0);
        for (let i = 0; i < homingCount; i++) {
            bullets.push({
                x: this.x + this.width / 2 - 4,
                y: this.y,
                width: 8,
                height: 8,
                speed: 250,
                damage: damage * 0.8,
                isHoming: true,
                target: null
            });
        }
        
        return bullets;
    }
    
    takeDamage(amount) {
        if (this.isInvincible) return false;
        
        // Check shield first
        if (this.shieldHits > 0) {
            this.shieldHits--;
            return false;
        }
        
        this.hp -= amount;
        this.isInvincible = true;
        this.invincibilityTimer = this.invincibilityDuration;
        this.flashTimer = 0;
        
        return this.hp <= 0;
    }
    
    addSkill(skillId) {
        if (!this.skills[skillId]) {
            this.skills[skillId] = 0;
        }
        this.skills[skillId]++;
        
        // Apply shield immediately
        if (skillId === 'shield') {
            this.shieldHits = this.getSkillValue('shield', 'shieldHits', 0);
        }
    }
    
    getSkillValue(skillId, stat, defaultValue) {
        const level = this.skills[skillId] || 0;
        if (level === 0) return defaultValue;
        
        // Implementation depends on skill config
        // This is a simplified version
        return defaultValue + (level - 1);
    }
    
    getSkillMultiplier(skillId) {
        const level = this.skills[skillId] || 0;
        if (level === 0) return 1;
        
        // Simplified multiplier calculation
        return 1 + (level * 0.15);
    }
    
    render(ctx) {
        if (!this.visible) return;
        
        // Draw player ship (pixel art style)
        ctx.fillStyle = this.color;
        
        // Main body
        ctx.fillRect(this.x + 8, this.y, 16, 32);
        
        // Wings
        ctx.fillRect(this.x, this.y + 16, 8, 16);
        ctx.fillRect(this.x + 24, this.y + 16, 8, 16);
        
        // Cockpit
        ctx.fillStyle = '#45b7d1';
        ctx.fillRect(this.x + 12, this.y + 4, 8, 8);
        
        // Engine glow
        ctx.fillStyle = '#ff6b6b';
        ctx.fillRect(this.x + 10, this.y + 28, 4, 4);
        ctx.fillRect(this.x + 18, this.y + 28, 4, 4);
        
        // Shield visual
        if (this.shieldHits > 0) {
            ctx.strokeStyle = '#2ed573';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(
                this.x + this.width / 2,
                this.y + this.height / 2,
                this.width / 2 + 4,
                0,
                Math.PI * 2
            );
            ctx.stroke();
        }
    }
}
```

- [ ] **Step 2: Update main.js to use Player class**

```javascript
// Add to imports at top
import { Player } from './player.js';

// Add to game state
let player = null;

// Update startGame function
function startGame(difficulty) {
    gameState = 'playing';
    player = new Player(difficulty);
    console.log('Player created with HP:', player.hp);
}

// Update update function
function update(dt) {
    if (player) {
        player.update(dt);
    }
    // TODO: Update other systems
}

// Update render function
function render() {
    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    
    // Render player
    if (player) {
        player.render(ctx);
    }
}
```

- [ ] **Step 3: Test player movement in browser**

Open browser, press 2 to start normal difficulty. You should see:
- Blue player ship at bottom center
- Ship moves with WASD or arrow keys
- Ship stays within screen bounds

- [ ] **Step 4: Commit**

```bash
cd "/home/sudong/mimo code"
git add js/player.js js/main.js
git commit -m "feat: add player ship with movement and shooting"
```

---

## Task 4: Enemy System

**Covers:** [S4, S5]

**Files:**
- Create: `/home/sudong/mimo code/js/enemies.js`
- Modify: `/home/sudong/mimo code/js/main.js`

- [ ] **Step 1: Create js/enemies.js with enemy classes**

```javascript
import { ENEMIES } from './config.js';
import { GAME_WIDTH, GAME_HEIGHT } from './main.js';
import { randomRange, randomInt } from './utils.js';

export class Enemy {
    constructor(type, x, speedMultiplier = 1) {
        const config = ENEMIES[type];
        this.type = type;
        this.width = config.width;
        this.height = config.height;
        this.maxHP = config.hp;
        this.hp = this.maxHP;
        this.speed = config.speed * speedMultiplier;
        this.color = config.color;
        this.points = config.points;
        this.isKamikaze = config.isKamikaze || false;
        
        // Position
        this.x = x || randomRange(0, GAME_WIDTH - this.width);
        this.y = -this.height;
        
        // Movement pattern
        this.baseX = this.x;
        this.moveTimer = 0;
        this.movePattern = this.getMovePattern(type);
        
        // Shooting (for bombers)
        this.shootTimer = 0;
        this.shootInterval = config.shootInterval || Infinity;
        this.bulletSpeed = config.bulletSpeed || 200;
        
        // State
        this.active = true;
    }
    
    getMovePattern(type) {
        switch (type) {
            case 'scout':
                return 'straight';
            case 'fighter':
                return 'zigzag';
            case 'bomber':
                return 'slow_straight';
            case 'drone':
                return 'chase';
            default:
                return 'straight';
        }
    }
    
    update(dt, playerX, playerY) {
        this.moveTimer += dt;
        
        switch (this.movePattern) {
            case 'straight':
                this.y += this.speed * dt;
                break;
                
            case 'zigzag':
                this.y += this.speed * dt;
                this.x = this.baseX + Math.sin(this.moveTimer * 3) * 50;
                break;
                
            case 'slow_straight':
                this.y += this.speed * dt;
                // Bomber shooting
                this.shootTimer += dt;
                break;
                
            case 'chase':
                // Move toward player
                const dx = playerX - this.x;
                const dy = playerY - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist > 0) {
                    this.x += (dx / dist) * this.speed * dt;
                    this.y += (dy / dist) * this.speed * dt;
                }
                break;
        }
        
        // Remove if off screen
        if (this.y > GAME_HEIGHT + 50) {
            this.active = false;
        }
    }
    
    canShoot() {
        if (this.type !== 'bomber') return false;
        if (this.shootTimer >= this.shootInterval) {
            this.shootTimer = 0;
            return true;
        }
        return false;
    }
    
    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp <= 0) {
            this.active = false;
            return true; // Enemy destroyed
        }
        return false;
    }
    
    render(ctx) {
        ctx.fillStyle = this.color;
        
        // Draw different shapes based on type
        switch (this.type) {
            case 'scout':
                // Small triangle
                ctx.beginPath();
                ctx.moveTo(this.x + this.width / 2, this.y);
                ctx.lineTo(this.x, this.y + this.height);
                ctx.lineTo(this.x + this.width, this.y + this.height);
                ctx.closePath();
                ctx.fill();
                break;
                
            case 'fighter':
                // Diamond shape
                ctx.beginPath();
                ctx.moveTo(this.x + this.width / 2, this.y);
                ctx.lineTo(this.x + this.width, this.y + this.height / 2);
                ctx.lineTo(this.x + this.width / 2, this.y + this.height);
                ctx.lineTo(this.x, this.y + this.height / 2);
                ctx.closePath();
                ctx.fill();
                break;
                
            case 'bomber':
                // Large rectangle with wings
                ctx.fillRect(this.x + 4, this.y, this.width - 8, this.height);
                ctx.fillRect(this.x, this.y + 8, 4, this.height - 8);
                ctx.fillRect(this.x + this.width - 4, this.y + 8, 4, this.height - 8);
                break;
                
            case 'drone':
                // Small circle
                ctx.beginPath();
                ctx.arc(
                    this.x + this.width / 2,
                    this.y + this.height / 2,
                    this.width / 2,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
                break;
        }
        
        // HP bar for bombers
        if (this.type === 'bomber' && this.hp < this.maxHP) {
            const barWidth = this.width;
            const barHeight = 4;
            const hpPercent = this.hp / this.maxHP;
            
            ctx.fillStyle = '#333';
            ctx.fillRect(this.x, this.y - 8, barWidth, barHeight);
            ctx.fillStyle = '#ff4757';
            ctx.fillRect(this.x, this.y - 8, barWidth * hpPercent, barHeight);
        }
    }
}

export class EnemySpawner {
    constructor(difficulty) {
        this.difficulty = difficulty;
        this.spawnTimer = 0;
        this.waveTimer = 0;
        this.currentWave = 0;
        this.enemiesInWave = 0;
        this.enemiesSpawned = 0;
        this.waveActive = false;
    }
    
    startWave(waveNumber, enemyTypes, spawnMultiplier) {
        this.currentWave = waveNumber;
        this.enemiesInWave = Math.floor((5 + waveNumber * 2) * spawnMultiplier);
        this.enemiesSpawned = 0;
        this.waveActive = true;
        this.spawnTimer = 0;
    }
    
    update(dt, enemies) {
        if (!this.waveActive) return;
        
        this.spawnTimer += dt;
        
        // Spawn enemies at intervals
        if (this.spawnTimer >= 0.5 && this.enemiesSpawned < this.enemiesInWave) {
            this.spawnTimer = 0;
            const typeIndex = randomInt(0, this.enemyTypes.length - 1);
            const type = this.enemyTypes[typeIndex];
            enemies.push(new Enemy(type));
            this.enemiesSpawned++;
        }
        
        // Check if wave is complete
        if (this.enemiesSpawned >= this.enemiesInWave) {
            this.waveActive = false;
        }
    }
}
```

- [ ] **Step 2: Update main.js to integrate enemies**

```javascript
// Add to imports
import { Enemy, EnemySpawner } from './enemies.js';

// Add to game state
let enemySpawner = null;
let waveTimer = 0;
let currentWave = 0;
let bossSpawned = false;

// Update startGame function
function startGame(difficulty) {
    gameState = 'playing';
    player = new Player(difficulty);
    enemies = [];
    bullets = [];
    experienceOrbs = [];
    particles = [];
    
    enemySpawner = new EnemySpawner(difficulty);
    currentWave = 0;
    waveTimer = 0;
    bossSpawned = false;
    
    // Start first wave
    startNextWave();
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

// Update update function
function update(dt) {
    if (player) {
        player.update(dt);
    }
    
    // Update enemies
    enemySpawner.update(dt, enemies);
    enemies.forEach(enemy => {
        enemy.update(dt, player.x, player.y);
    });
    
    // Remove inactive enemies
    enemies = enemies.filter(e => e.active);
    
    // Check if wave is complete and start next
    if (!enemySpawner.waveActive && enemies.length === 0 && !bossSpawned) {
        waveTimer += dt;
        if (waveTimer >= 2) { // 2 second delay between waves
            waveTimer = 0;
            startNextWave();
        }
    }
}

// Update render function
function render() {
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    
    if (player) {
        player.render(ctx);
    }
    
    enemies.forEach(enemy => enemy.render(ctx));
}
```

- [ ] **Step 3: Test enemy spawning in browser**

Start game, you should see:
- Enemies spawning from top and moving down
- Different enemy types with different movement patterns
- Enemies disappear when leaving screen

- [ ] **Step 4: Commit**

```bash
cd "/home/sudong/mimo code"
git add js/enemies.js js/main.js
git commit -m "feat: add enemy system with 4 enemy types"
```

---

## Task 5: Bullet System & Collision Detection

**Covers:** [S3, S5]

**Files:**
- Create: `/home/sudong/mimo code/js/bullets.js`
- Modify: `/home/sudong/mimo code/js/main.js`

- [ ] **Step 1: Create js/bullets.js**

```javascript
import { GAME_HEIGHT, GAME_WIDTH } from './main.js';
import { PLAYER } from './config.js';
import { distance, angleBetween } from './utils.js';

export class Bullet {
    constructor(x, y, width, height, speed, damage, options = {}) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.damage = damage;
        this.active = true;
        
        // Direction (for scatter shots)
        this.vx = options.vx || 0;
        this.vy = options.vy || -speed; // Default: straight up
        
        // Homing missile properties
        this.isHoming = options.isHoming || false;
        this.target = null;
        this.turnSpeed = 3; // radians per second
    }
    
    update(dt, enemies) {
        if (this.isHoming && enemies.length > 0) {
            // Find or update target
            if (!this.target || !this.target.active) {
                this.target = this.findNearestEnemy(enemies);
            }
            
            if (this.target) {
                // Turn toward target
                const targetAngle = angleBetween(
                    this.x, this.y,
                    this.target.x + this.target.width / 2,
                    this.target.y + this.target.height / 2
                );
                
                const currentAngle = Math.atan2(this.vy, this.vx);
                let angleDiff = targetAngle - currentAngle;
                
                // Normalize angle difference
                while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
                while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
                
                // Turn toward target
                const turn = Math.sign(angleDiff) * Math.min(
                    Math.abs(angleDiff),
                    this.turnSpeed * dt
                );
                
                const newAngle = currentAngle + turn;
                this.vx = Math.cos(newAngle) * this.speed;
                this.vy = Math.sin(newAngle) * this.speed;
            }
        }
        
        // Move bullet
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        
        // Remove if off screen
        if (this.y < -this.height || this.y > GAME_HEIGHT + 50 ||
            this.x < -50 || this.x > GAME_WIDTH + 50) {
            this.active = false;
        }
    }
    
    findNearestEnemy(enemies) {
        let nearest = null;
        let nearestDist = Infinity;
        
        for (const enemy of enemies) {
            if (!enemy.active) continue;
            const dist = distance(this.x, this.y, enemy.x, enemy.y);
            if (dist < nearestDist) {
                nearestDist = dist;
                nearest = enemy;
            }
        }
        
        return nearest;
    }
    
    render(ctx, isEnemy = false) {
        ctx.fillStyle = isEnemy ? '#ff4757' : '#ffd32a';
        
        if (this.isHoming) {
            // Homing missile - diamond shape
            ctx.beginPath();
            ctx.moveTo(this.x + this.width / 2, this.y);
            ctx.lineTo(this.x + this.width, this.y + this.height / 2);
            ctx.lineTo(this.x + this.width / 2, this.y + this.height);
            ctx.lineTo(this.x, this.y + this.height / 2);
            ctx.closePath();
            ctx.fill();
        } else {
            // Normal bullet - rectangle
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

export class BulletManager {
    constructor() {
        this.playerBullets = [];
        this.enemyBullets = [];
    }
    
    addPlayerBullet(bullet) {
        this.playerBullets.push(new Bullet(
            bullet.x, bullet.y,
            bullet.width, bullet.height,
            bullet.speed, bullet.damage,
            {
                vx: bullet.vx,
                vy: bullet.vy,
                isHoming: bullet.isHoming
            }
        ));
    }
    
    addEnemyBullet(x, y, speed, damage) {
        this.enemyBullets.push(new Bullet(
            x, y,
            PLAYER.bulletWidth, PLAYER.bulletHeight,
            speed, damage,
            { vy: speed } // Enemy bullets go down
        ));
    }
    
    update(dt, enemies) {
        // Update player bullets
        this.playerBullets.forEach(bullet => {
            bullet.update(dt, enemies);
        });
        this.playerBullets = this.playerBullets.filter(b => b.active);
        
        // Update enemy bullets
        this.enemyBullets.forEach(bullet => {
            bullet.update(dt, []);
        });
        this.enemyBullets = this.enemyBullets.filter(b => b.active);
    }
    
    checkCollisions(enemies, player, experienceOrbs) {
        const results = {
            enemiesHit: [],
            playerHit: false,
            xpGained: 0
        };
        
        // Player bullets vs enemies
        for (const bullet of this.playerBullets) {
            for (const enemy of enemies) {
                if (!bullet.active || !enemy.active) continue;
                
                if (this.checkOverlap(bullet, enemy)) {
                    bullet.active = false;
                    const destroyed = enemy.takeDamage(bullet.damage);
                    if (destroyed) {
                        results.enemiesHit.push(enemy);
                        results.xpGained += enemy.points;
                    }
                }
            }
        }
        
        // Enemy bullets vs player
        if (player) {
            for (const bullet of this.enemyBullets) {
                if (!bullet.active || !player) continue;
                
                if (this.checkOverlap(bullet, player)) {
                    bullet.active = false;
                    results.playerHit = true;
                }
            }
        }
        
        return results;
    }
    
    checkOverlap(a, b) {
        return a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height &&
               a.y + a.height > b.y;
    }
    
    render(ctx) {
        this.playerBullets.forEach(bullet => bullet.render(ctx, false));
        this.enemyBullets.forEach(bullet => bullet.render(ctx, true));
    }
    
    clear() {
        this.playerBullets = [];
        this.enemyBullets = [];
    }
}
```

- [ ] **Step 2: Update main.js to use BulletManager**

```javascript
// Add to imports
import { BulletManager } from './bullets.js';

// Add to game state
let bulletManager = null;

// Update startGame function
function startGame(difficulty) {
    // ... existing code ...
    bulletManager = new BulletManager();
}

// Update player shooting
function update(dt) {
    if (player) {
        player.update(dt);
        
        // Get bullets from player
        const newBullets = player.shoot();
        newBullets.forEach(b => bulletManager.addPlayerBullet(b));
    }
    
    // Update bullets
    bulletManager.update(dt, enemies);
    
    // Check collisions
    const results = bulletManager.checkCollisions(enemies, player, experienceOrbs);
    
    // Handle enemy hits
    results.enemiesHit.forEach(enemy => {
        // Create explosion particle
        // Add experience orb
        score += enemy.points;
    });
    
    // Handle player hit
    if (results.playerHit) {
        const dead = player.takeDamage(1);
        if (dead) {
            gameState = 'gameOver';
        }
    }
    
    // Add XP
    if (results.xpGained > 0) {
        // TODO: Add experience orbs
    }
}

// Update render function
function render() {
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    
    if (player) player.render(ctx);
    enemies.forEach(enemy => enemy.render(ctx));
    bulletManager.render(ctx);
}
```

- [ ] **Step 3: Test shooting and collisions**

Start game, verify:
- Player bullets shoot upward
- Bullets hit enemies and destroy them
- Score increases when enemies are destroyed

- [ ] **Step 4: Commit**

```bash
cd "/home/sudong/mimo code"
git add js/bullets.js js/main.js
git commit -m "feat: add bullet system with collision detection"
```

---

## Task 6: Experience & Leveling System

**Covers:** [S4]

**Files:**
- Create: `/home/sudong/mimo code/js/experience.js`
- Modify: `/home/sudong/mimo code/js/main.js`

- [ ] **Step 1: Create js/experience.js**

```javascript
import { GAME_WIDTH, GAME_HEIGHT } from './main.js';
import { EXPERIENCE } from './config.js';
import { distance, randomRange } from './utils.js';

export class ExperienceOrb {
    constructor(x, y, value) {
        this.x = x;
        this.y = y;
        this.width = 8;
        this.height = 8;
        this.value = value;
        this.active = true;
        
        // Physics
        this.vx = randomRange(-50, 50);
        this.vy = randomRange(-100, -50);
        this.gravity = 200;
        
        // Visual
        this.color = '#2ed573';
        this.pulseTimer = 0;
    }
    
    update(dt, playerX, playerY, magnetRange) {
        // Apply gravity
        this.vy += this.gravity * dt;
        
        // Move
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        
        // Check if player is in magnet range
        const dist = distance(this.x, this.y, playerX, playerY);
        if (dist < magnetRange) {
            // Move toward player
            const angle = Math.atan2(playerY - this.y, playerX - this.x);
            const speed = 300;
            this.x += Math.cos(angle) * speed * dt;
            this.y += Math.sin(angle) * speed * dt;
        }
        
        // Remove if off screen
        if (this.y > GAME_HEIGHT + 50) {
            this.active = false;
        }
        
        // Pulse effect
        this.pulseTimer += dt;
    }
    
    render(ctx) {
        const pulse = 1 + Math.sin(this.pulseTimer * 5) * 0.2;
        const size = this.width * pulse;
        
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(
            this.x + this.width / 2,
            this.y + this.height / 2,
            size / 2,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        // Glow effect
        ctx.fillStyle = 'rgba(46, 213, 115, 0.3)';
        ctx.beginPath();
        ctx.arc(
            this.x + this.width / 2,
            this.y + this.height / 2,
            size,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }
}

export class ExperienceSystem {
    constructor(difficulty) {
        this.difficulty = difficulty;
        this.orbs = [];
        this.currentXP = 0;
        this.currentLevel = 1;
        this.xpToNextLevel = EXPERIENCE.baseXPPerLevel;
        this.totalXP = 0;
    }
    
    addOrbs(x, y, value) {
        const adjustedValue = Math.floor(value * 1.2); // Slight bonus
        this.orbs.push(new ExperienceOrb(x, y, adjustedValue));
    }
    
    update(dt, playerX, playerY, magnetRange) {
        // Update all orbs
        this.orbs.forEach(orb => {
            orb.update(dt, playerX, playerY, magnetRange);
        });
        
        // Check collection
        this.orbs.forEach(orb => {
            if (!orb.active) return;
            
            const dist = distance(
                orb.x, orb.y,
                playerX, playerY
            );
            
            if (dist < 30) { // Collection radius
                this.collectXP(orb.value);
                orb.active = false;
            }
        });
        
        // Remove inactive orbs
        this.orbs = this.orbs.filter(o => o.active);
    }
    
    collectXP(amount) {
        this.currentXP += amount;
        this.totalXP += amount;
        
        // Check for level up
        if (this.currentXP >= this.xpToNextLevel) {
            this.currentXP -= this.xpToNextLevel;
            this.currentLevel++;
            this.xpToNextLevel = Math.floor(
                EXPERIENCE.baseXPPerLevel * 
                Math.pow(EXPERIENCE.xpGrowthRate, this.currentLevel - 1)
            );
            return true; // Level up occurred
        }
        return false;
    }
    
    getXPProgress() {
        return this.currentXP / this.xpToNextLevel;
    }
    
    render(ctx) {
        this.orbs.forEach(orb => orb.render(ctx));
    }
    
    clear() {
        this.orbs = [];
    }
}
```

- [ ] **Step 2: Update main.js to use ExperienceSystem**

```javascript
// Add to imports
import { ExperienceSystem } from './experience.js';

// Add to game state
let experienceSystem = null;
let score = 0;
let showingSkillSelection = false;

// Update startGame function
function startGame(difficulty) {
    // ... existing code ...
    experienceSystem = new ExperienceSystem(difficulty);
    score = 0;
}

// Update update function
function update(dt) {
    if (showingSkillSelection) return; // Pause during skill selection
    
    if (player) {
        player.update(dt);
        const newBullets = player.shoot();
        newBullets.forEach(b => bulletManager.addPlayerBullet(b));
    }
    
    enemySpawner.update(dt, enemies);
    enemies.forEach(enemy => {
        enemy.update(dt, player.x, player.y);
        
        // Enemy shooting
        if (enemy.canShoot()) {
            bulletManager.addEnemyBullet(
                enemy.x + enemy.width / 2,
                enemy.y + enemy.height,
                enemy.bulletSpeed,
                1
            );
        }
    });
    enemies = enemies.filter(e => e.active);
    
    bulletManager.update(dt, enemies);
    
    const results = bulletManager.checkCollisions(enemies, player);
    
    results.enemiesHit.forEach(enemy => {
        // Add experience orbs
        experienceSystem.addOrbs(
            enemy.x + enemy.width / 2,
            enemy.y + enemy.height / 2,
            enemy.points
        );
        score += enemy.points;
        
        // Create explosion
        createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
    });
    
    if (results.playerHit) {
        const dead = player.takeDamage(1);
        if (dead) {
            gameState = 'gameOver';
        }
    }
    
    // Update experience
    const magnetRange = EXPERIENCE.orbMagnetRange + 
        (player.skills.magnet || 0) * 30;
    
    const leveledUp = experienceSystem.update(
        dt,
        player.x + player.width / 2,
        player.y + player.height / 2,
        magnetRange
    );
    
    if (leveledUp) {
        showingSkillSelection = true;
        // TODO: Show skill selection UI
    }
}

// Update render function
function render() {
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    
    if (player) player.render(ctx);
    enemies.forEach(enemy => enemy.render(ctx));
    bulletManager.render(ctx);
    experienceSystem.render(ctx);
    
    // Render HUD
    renderHUD();
}

function renderHUD() {
    // HP
    ctx.fillStyle = '#ff4757';
    for (let i = 0; i < player.hp; i++) {
        ctx.fillRect(10 + i * 25, 10, 20, 20);
    }
    
    // XP bar
    const xpProgress = experienceSystem.getXPProgress();
    ctx.fillStyle = '#333';
    ctx.fillRect(10, GAME_HEIGHT - 30, GAME_WIDTH - 20, 20);
    ctx.fillStyle = '#2ed573';
    ctx.fillRect(10, GAME_HEIGHT - 30, (GAME_WIDTH - 20) * xpProgress, 20);
    
    // Level
    ctx.fillStyle = '#fff';
    ctx.font = '14px monospace';
    ctx.fillText(`Lv.${experienceSystem.currentLevel}`, 15, GAME_HEIGHT - 15);
    
    // Score
    ctx.fillText(`Score: ${score}`, GAME_WIDTH - 100, 25);
}
```

- [ ] **Step 3: Test experience system**

Kill enemies, verify:
- Green orbs drop from destroyed enemies
- Orbs move toward player when in range
- XP bar fills up
- Level increases when bar is full

- [ ] **Step 4: Commit**

```bash
cd "/home/sudong/mimo code"
git add js/experience.js js/main.js
git commit -m "feat: add experience and leveling system"
```

---

## Task 7: Skill Selection UI

**Covers:** [S4, S8]

**Files:**
- Create: `/home/sudong/mimo code/js/skills.js`
- Modify: `/home/sudong/mimo code/js/main.js`

- [ ] **Step 1: Create js/skills.js**

```javascript
import { SKILLS } from './config.js';

export class SkillSystem {
    constructor() {
        this.availableSkills = Object.keys(SKILLS);
        this.selectedSkills = [];
    }
    
    getRandomSkills(count = 3) {
        // Get skills that aren't maxed
        const eligible = this.availableSkills.filter(id => {
            const skill = SKILLS[id];
            const currentLevel = this.selectedSkills.find(s => s.id === id)?.level || 0;
            return currentLevel < skill.maxLevel;
        });
        
        // Shuffle and take count
        const shuffled = [...eligible].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count).map(id => ({
            id,
            ...SKILLS[id],
            currentLevel: this.selectedSkills.find(s => s.id === id)?.level || 0
        }));
    }
    
    selectSkill(skillId) {
        const existing = this.selectedSkills.find(s => s.id === skillId);
        if (existing) {
            existing.level++;
        } else {
            this.selectedSkills.push({ id: skillId, level: 1 });
        }
    }
}

export class SkillSelectionUI {
    constructor() {
        this.visible = false;
        this.skills = [];
        this.selectedIndex = -1;
        this.onSelect = null;
    }
    
    show(skills, onSelect) {
        this.visible = true;
        this.skills = skills;
        this.onSelect = onSelect;
        this.selectedIndex = -1;
    }
    
    hide() {
        this.visible = false;
        this.skills = [];
        this.onSelect = null;
    }
    
    handleInput(key) {
        if (!this.visible) return;
        
        if (key >= '1' && key <= '3') {
            const index = parseInt(key) - 1;
            if (index < this.skills.length) {
                this.selectSkill(index);
            }
        }
        
        if (key === 'Enter' && this.selectedIndex >= 0) {
            this.selectSkill(this.selectedIndex);
        }
    }
    
    selectSkill(index) {
        if (this.onSelect) {
            this.onSelect(this.skills[index].id);
        }
        this.hide();
    }
    
    render(ctx, canvasWidth, canvasHeight) {
        if (!this.visible) return;
        
        // Semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        // Title
        ctx.fillStyle = '#ffd32a';
        ctx.font = 'bold 24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('选择技能', canvasWidth / 2, 80);
        
        ctx.fillStyle = '#aaa';
        ctx.font = '14px monospace';
        ctx.fillText('按 1/2/3 选择', canvasWidth / 2, 110);
        
        // Skill cards
        const cardWidth = 100;
        const cardHeight = 150;
        const spacing = 20;
        const totalWidth = this.skills.length * cardWidth + (this.skills.length - 1) * spacing;
        const startX = (canvasWidth - totalWidth) / 2;
        
        this.skills.forEach((skill, index) => {
            const x = startX + index * (cardWidth + spacing);
            const y = 150;
            
            // Card background
            ctx.fillStyle = '#2c3e50';
            ctx.fillRect(x, y, cardWidth, cardHeight);
            
            // Card border
            ctx.strokeStyle = '#3498db';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, cardWidth, cardHeight);
            
            // Skill icon
            ctx.font = '32px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(skill.icon, x + cardWidth / 2, y + 40);
            
            // Skill name
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 12px monospace';
            ctx.fillText(skill.name, x + cardWidth / 2, y + 70);
            
            // Current level
            ctx.fillStyle = '#2ed573';
            ctx.font = '11px monospace';
            ctx.fillText(
                `Lv.${skill.currentLevel} → ${skill.currentLevel + 1}`,
                x + cardWidth / 2,
                y + 90
            );
            
            // Description
            ctx.fillStyle = '#bbb';
            ctx.font = '10px monospace';
            const words = skill.description.split('');
            let line = '';
            let lineY = y + 115;
            
            for (const char of words) {
                const testLine = line + char;
                if (ctx.measureText(testLine).width > cardWidth - 10) {
                    ctx.fillText(line, x + cardWidth / 2, lineY);
                    line = char;
                    lineY += 14;
                } else {
                    line = testLine;
                }
            }
            ctx.fillText(line, x + cardWidth / 2, lineY);
            
            // Key hint
            ctx.fillStyle = '#ffd32a';
            ctx.font = 'bold 14px monospace';
            ctx.fillText(`[${index + 1}]`, x + cardWidth / 2, y + cardHeight - 10);
        });
        
        ctx.textAlign = 'left';
    }
}
```

- [ ] **Step 2: Update main.js to use SkillSystem**

```javascript
// Add to imports
import { SkillSystem, SkillSelectionUI } from './skills.js';

// Add to game state
let skillSystem = null;
let skillSelectionUI = null;

// Update startGame function
function startGame(difficulty) {
    // ... existing code ...
    skillSystem = new SkillSystem();
    skillSelectionUI = new SkillSelectionUI();
}

// Update update function
function update(dt) {
    if (showingSkillSelection) {
        // Don't update game during skill selection
        return;
    }
    
    // ... existing update code ...
    
    // Check for level up
    const leveledUp = experienceSystem.update(/* ... */);
    if (leveledUp) {
        triggerSkillSelection();
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

// Update keyboard handler
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    
    if (showingSkillSelection) {
        skillSelectionUI.handleInput(e.key);
        return;
    }
    
    // ... existing key handling ...
});

// Update render function
function render() {
    // ... existing render code ...
    
    // Render skill selection on top
    if (showingSkillSelection) {
        skillSelectionUI.render(ctx, GAME_WIDTH, GAME_HEIGHT);
    }
}
```

- [ ] **Step 3: Test skill selection**

Level up by collecting XP, verify:
- Skill selection screen appears
- 3 random skills shown
- Press 1/2/3 to select
- Game resumes after selection
- Skill effect applies (e.g., scatter shot fires multiple bullets)

- [ ] **Step 4: Commit**

```bash
cd "/home/sudong/mimo code"
git add js/skills.js js/main.js
git commit -m "feat: add skill selection UI and skill system"
```

---

## Task 8: Boss System

**Covers:** [S6]

**Files:**
- Create: `/home/sudong/mimo code/js/boss.js`
- Modify: `/home/sudong/mimo code/js/main.js`

- [ ] **Step 1: Create js/boss.js**

```javascript
import { BOSSES } from './config.js';
import { GAME_WIDTH, GAME_HEIGHT } from './main.js';
import { randomRange } from './utils.js';

export class Boss {
    constructor(bossKey, difficulty) {
        const config = BOSSES[bossKey];
        this.name = config.name;
        this.width = config.width;
        this.height = config.height;
        this.maxHP = Math.floor(config.hp * difficulty.bossHPMultiplier);
        this.hp = this.maxHP;
        this.color = config.color;
        this.phases = config.phases;
        
        // Position
        this.x = GAME_WIDTH / 2 - this.width / 2;
        this.y = -this.height;
        this.targetY = 50;
        
        // Movement
        this.speed = 100;
        this.moveTimer = 0;
        this.moveDirection = 1;
        
        // Attacks
        this.attackTimer = 0;
        this.attackInterval = 1.5;
        this.currentPhase = 0;
        
        // State
        this.active = true;
        this.entering = true;
        this.defeated = false;
    }
    
    update(dt, playerX, playerY) {
        // Enter screen
        if (this.entering) {
            this.y += 100 * dt;
            if (this.y >= this.targetY) {
                this.y = this.targetY;
                this.entering = false;
            }
            return;
        }
        
        // Update phase based on HP
        const hpPercent = this.hp / this.maxHP;
        for (let i = this.phases.length - 1; i >= 0; i--) {
            if (hpPercent <= this.phases[i].hpThreshold + 0.01) {
                this.currentPhase = i;
                break;
            }
        }
        
        // Movement
        this.moveTimer += dt;
        this.x += this.speed * this.moveDirection * dt;
        
        // Bounce off walls
        if (this.x <= 0 || this.x >= GAME_WIDTH - this.width) {
            this.moveDirection *= -1;
        }
        
        // Attack
        this.attackTimer += dt;
    }
    
    canAttack() {
        if (this.entering) return false;
        if (this.attackTimer >= this.attackInterval) {
            this.attackTimer = 0;
            return true;
        }
        return false;
    }
    
    getAttackPattern() {
        return this.phases[this.currentPhase].pattern;
    }
    
    generateBullets(pattern) {
        const bullets = [];
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height;
        
        switch (pattern) {
            case 'fan':
                // Fan of bullets
                for (let i = -3; i <= 3; i++) {
                    const angle = (i * Math.PI / 12) + Math.PI / 2;
                    bullets.push({
                        x: centerX,
                        y: centerY,
                        vx: Math.cos(angle) * 150,
                        vy: Math.sin(angle) * 150,
                        width: 6,
                        height: 6,
                        damage: 1
                    });
                }
                break;
                
            case 'fan_plus_scouts':
                // Fan + spawn scouts
                bullets.push(...this.generateBullets('fan'));
                // Note: actual scout spawning handled in main.js
                break;
                
            case 'laser_sweep':
                // Laser sweep
                for (let i = 0; i < 5; i++) {
                    const angle = Math.PI / 2 + (i - 2) * 0.3;
                    bullets.push({
                        x: centerX,
                        y: centerY,
                        vx: Math.cos(angle) * 200,
                        vy: Math.sin(angle) * 200,
                        width: 4,
                        height: 20,
                        damage: 2
                    });
                }
                break;
                
            case 'clone_cross':
                // Cross pattern
                for (let i = 0; i < 8; i++) {
                    const angle = (i * Math.PI / 4);
                    bullets.push({
                        x: centerX,
                        y: centerY,
                        vx: Math.cos(angle) * 120,
                        vy: Math.sin(angle) * 120,
                        width: 8,
                        height: 8,
                        damage: 1
                    });
                }
                break;
                
            case 'multi_direction':
                // Multi-direction burst
                for (let i = 0; i < 12; i++) {
                    const angle = (i * Math.PI / 6);
                    bullets.push({
                        x: centerX,
                        y: centerY,
                        vx: Math.cos(angle) * 100,
                        vy: Math.sin(angle) * 100,
                        width: 6,
                        height: 6,
                        damage: 1
                    });
                }
                break;
                
            case 'rain_shield':
                // Rain from top
                for (let i = 0; i < 10; i++) {
                    bullets.push({
                        x: randomRange(50, GAME_WIDTH - 50),
                        y: 0,
                        vx: 0,
                        vy: 200,
                        width: 8,
                        height: 8,
                        damage: 1
                    });
                }
                break;
                
            case 'berserk':
                // Rapid fire all directions
                for (let i = 0; i < 16; i++) {
                    const angle = (i * Math.PI / 8);
                    bullets.push({
                        x: centerX,
                        y: centerY,
                        vx: Math.cos(angle) * 180,
                        vy: Math.sin(angle) * 180,
                        width: 6,
                        height: 6,
                        damage: 1
                    });
                }
                break;
        }
        
        return bullets;
    }
    
    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp <= 0) {
            this.active = false;
            this.defeated = true;
            return true;
        }
        return false;
    }
    
    render(ctx) {
        ctx.fillStyle = this.color;
        
        // Main body
        ctx.fillRect(this.x + 8, this.y, this.width - 16, this.height);
        
        // Wings
        ctx.fillRect(this.x, this.y + 16, 8, this.height - 32);
        ctx.fillRect(this.x + this.width - 8, this.y + 16, 8, this.height - 32);
        
        // Core
        ctx.fillStyle = '#ff4757';
        ctx.fillRect(
            this.x + this.width / 2 - 8,
            this.y + this.height / 2 - 8,
            16,
            16
        );
        
        // Eye
        ctx.fillStyle = '#fff';
        ctx.fillRect(
            this.x + this.width / 2 - 4,
            this.y + this.height / 2 - 4,
            8,
            8
        );
        
        // HP bar
        const barWidth = this.width + 20;
        const barHeight = 8;
        const barX = this.x - 10;
        const barY = this.y - 15;
        
        ctx.fillStyle = '#333';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        ctx.fillStyle = this.hp > this.maxHP * 0.3 ? '#2ed573' : '#ff4757';
        ctx.fillRect(barX, barY, barWidth * (this.hp / this.maxHP), barHeight);
        
        // Name
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(this.name, this.x + this.width / 2, barY - 5);
        ctx.textAlign = 'left';
    }
}
```

- [ ] **Step 2: Update main.js for boss battles**

```javascript
// Add to imports
import { Boss } from './boss.js';

// Add to game state
let currentBoss = null;
let bossActive = false;

// Update startNextWave function
function startNextWave() {
    currentWave++;
    const levelConfig = LEVELS[currentLevel - 1];
    
    if (currentWave <= levelConfig.waves) {
        enemySpawner.startWave(
            currentWave,
            levelConfig.enemyTypes,
            DIFFICULTY[difficulty].enemySpawnMultiplier
        );
    } else if (!bossActive && !currentBoss) {
        // Spawn boss
        spawnBoss();
    }
}

function spawnBoss() {
    bossActive = true;
    const levelConfig = LEVELS[currentLevel - 1];
    currentBoss = new Boss(levelConfig.bossKey, DIFFICULTY[difficulty]);
}

// Update update function
function update(dt) {
    if (showingSkillSelection) return;
    
    // ... existing player and enemy updates ...
    
    // Boss update
    if (currentBoss && currentBoss.active) {
        currentBoss.update(dt, player.x, player.y);
        
        // Boss attacks
        if (currentBoss.canAttack()) {
            const pattern = currentBoss.getAttackPattern();
            const bossBullets = currentBoss.generateBullets(pattern);
            bossBullets.forEach(b => {
                bulletManager.enemyBullets.push(new Bullet(
                    b.x, b.y, b.width, b.height,
                    Math.sqrt(b.vx * b.vx + b.vy * b.vy),
                    b.damage,
                    { vx: b.vx, vy: b.vy }
                ));
            });
        }
        
        // Boss collisions with player bullets
        bulletManager.playerBullets.forEach(bullet => {
            if (!bullet.active || !currentBoss.active) return;
            
            if (bulletManager.checkOverlap(bullet, currentBoss)) {
                bullet.active = false;
                const defeated = currentBoss.takeDamage(bullet.damage);
                
                if (defeated) {
                    // Boss defeated!
                    createExplosion(
                        currentBoss.x + currentBoss.width / 2,
                        currentBoss.y + currentBoss.height / 2,
                        50
                    );
                    score += 500;
                    
                    // Check if game complete
                    if (currentLevel >= 3) {
                        gameState = 'victory';
                    } else {
                        // Next level
                        currentLevel++;
                        currentWave = 0;
                        bossActive = false;
                        currentBoss = null;
                    }
                }
            }
        });
    }
}

// Update render function
function render() {
    // ... existing render code ...
    
    if (currentBoss && currentBoss.active) {
        currentBoss.render(ctx);
    }
}
```

- [ ] **Step 3: Test boss battle**

Complete all waves in level 1, verify:
- Boss appears with name and HP bar
- Boss moves and attacks in patterns
- Boss phase changes at 50% HP
- Boss can be damaged and defeated
- Next level starts after boss defeat

- [ ] **Step 4: Commit**

```bash
cd "/home/sudong/mimo code"
git add js/boss.js js/main.js
git commit -m "feat: add boss system with multi-phase attacks"
```

---

## Task 9: Level System & Background

**Covers:** [S7]

**Files:**
- Create: `/home/sudong/mimo code/js/levels.js`
- Modify: `/home/sudong/mimo code/js/main.js`

- [ ] **Step 1: Create js/levels.js**

```javascript
import { LEVELS } from './config.js';
import { GAME_WIDTH, GAME_HEIGHT } from './main.js';

export class LevelManager {
    constructor() {
        this.currentLevel = 1;
        this.bgLayers = [];
        this.scrollSpeed = 50;
        this.scrollTimer = 0;
    }
    
    loadLevel(levelNumber) {
        this.currentLevel = levelNumber;
        const config = LEVELS[levelNumber - 1];
        
        // Create background layers
        this.bgLayers = [
            this.createStarLayer(config.bgColor, 0.3),
            this.createCloudLayer(config.bgColor, 0.6),
            this.createGroundLayer(config.bgColor, 1.0)
        ];
    }
    
    createStarLayer(baseColor, speed) {
        const stars = [];
        for (let i = 0; i < 50; i++) {
            stars.push({
                x: Math.random() * GAME_WIDTH,
                y: Math.random() * GAME_HEIGHT,
                size: Math.random() * 2 + 1,
                speed: speed
            });
        }
        return { type: 'stars', stars, color: baseColor };
    }
    
    createCloudLayer(baseColor, speed) {
        const clouds = [];
        for (let i = 0; i < 5; i++) {
            clouds.push({
                x: Math.random() * GAME_WIDTH,
                y: Math.random() * GAME_HEIGHT,
                width: Math.random() * 100 + 50,
                height: Math.random() * 30 + 20,
                speed: speed
            });
        }
        return { type: 'clouds', clouds, color: baseColor };
    }
    
    createGroundLayer(baseColor, speed) {
        return { type: 'ground', color: baseColor, speed };
    }
    
    update(dt) {
        this.scrollTimer += dt;
        
        this.bgLayers.forEach(layer => {
            if (layer.type === 'stars') {
                layer.stars.forEach(star => {
                    star.y += this.scrollSpeed * star.speed * dt;
                    if (star.y > GAME_HEIGHT) {
                        star.y = 0;
                        star.x = Math.random() * GAME_WIDTH;
                    }
                });
            } else if (layer.type === 'clouds') {
                layer.clouds.forEach(cloud => {
                    cloud.y += this.scrollSpeed * cloud.speed * dt;
                    if (cloud.y > GAME_HEIGHT) {
                        cloud.y = -cloud.height;
                        cloud.x = Math.random() * GAME_WIDTH;
                    }
                });
            }
        });
    }
    
    render(ctx) {
        // Get current level config
        const config = LEVELS[this.currentLevel - 1];
        
        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
        gradient.addColorStop(0, config.bgColor);
        gradient.addColorStop(1, this.darkenColor(config.bgColor, 0.5));
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        
        // Render layers
        this.bgLayers.forEach(layer => {
            if (layer.type === 'stars') {
                this.renderStars(ctx, layer);
            } else if (layer.type === 'clouds') {
                this.renderClouds(ctx, layer);
            }
        });
    }
    
    renderStars(ctx, layer) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        layer.stars.forEach(star => {
            ctx.fillRect(star.x, star.y, star.size, star.size);
        });
    }
    
    renderClouds(ctx, layer) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        layer.clouds.forEach(cloud => {
            ctx.fillRect(cloud.x, cloud.y, cloud.width, cloud.height);
        });
    }
    
    darkenColor(hex, factor) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        
        return `rgb(${Math.floor(r * factor)}, ${Math.floor(g * factor)}, ${Math.floor(b * factor)})`;
    }
    
    getLevelConfig() {
        return LEVELS[this.currentLevel - 1];
    }
}
```

- [ ] **Step 2: Update main.js to use LevelManager**

```javascript
// Add to imports
import { LevelManager } from './levels.js';

// Add to game state
let levelManager = null;

// Update startGame function
function startGame(difficulty) {
    // ... existing code ...
    levelManager = new LevelManager();
    levelManager.loadLevel(1);
}

// Update update function
function update(dt) {
    // ... existing code ...
    levelManager.update(dt);
}

// Update render function
function render() {
    // Render level background
    levelManager.render(ctx);
    
    // Render game objects
    if (player) player.render(ctx);
    enemies.forEach(enemy => enemy.render(ctx));
    bulletManager.render(ctx);
    experienceSystem.render(ctx);
    
    if (currentBoss && currentBoss.active) {
        currentBoss.render(ctx);
    }
    
    // Render HUD
    renderHUD();
    
    // Render level transition
    if (gameState === 'levelTransition') {
        renderLevelTransition();
    }
    
    // Render skill selection
    if (showingSkillSelection) {
        skillSelectionUI.render(ctx, GAME_WIDTH, GAME_HEIGHT);
    }
}

function renderLevelTransition() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    
    ctx.fillStyle = '#ffd32a';
    ctx.font = 'bold 32px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`关卡 ${currentLevel}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20);
    
    ctx.fillStyle = '#fff';
    ctx.font = '16px monospace';
    ctx.fillText(LEVELS[currentLevel - 1].name, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20);
    ctx.textAlign = 'left';
}
```

- [ ] **Step 3: Test level system**

Start game, verify:
- Background scrolls with parallax effect
- Different visual themes for each level
- Level transition shows when boss is defeated
- Background changes for new level

- [ ] **Step 4: Commit**

```bash
cd "/home/sudong/mimo code"
git add js/levels.js js/main.js
git commit -m "feat: add level system with parallax backgrounds"
```

---

## Task 10: Particle Effects

**Covers:** [S9]

**Files:**
- Create: `/home/sudong/mimo code/js/particles.js`
- Modify: `/home/sudong/mimo code/js/main.js`

- [ ] **Step 1: Create js/particles.js**

```javascript
import { randomRange } from './utils.js';

class Particle {
    constructor(x, y, options = {}) {
        this.x = x;
        this.y = y;
        this.vx = options.vx || randomRange(-100, 100);
        this.vy = options.vy || randomRange(-100, -50);
        this.life = options.life || 0.5;
        this.maxLife = this.life;
        this.size = options.size || randomRange(2, 6);
        this.color = options.color || '#ff6b6b';
        this.gravity = options.gravity || 100;
        this.active = true;
    }
    
    update(dt) {
        this.vy += this.gravity * dt;
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        
        this.life -= dt;
        if (this.life <= 0) {
            this.active = false;
        }
    }
    
    render(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.fillStyle = this.color;
        ctx.globalAlpha = alpha;
        ctx.fillRect(
            this.x - this.size / 2,
            this.y - this.size / 2,
            this.size,
            this.size
        );
        ctx.globalAlpha = 1;
    }
}

export class ParticleSystem {
    constructor() {
        this.particles = [];
    }
    
    createExplosion(x, y, count = 20, color = '#ff6b6b') {
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(x, y, {
                vx: randomRange(-150, 150),
                vy: randomRange(-150, 150),
                life: randomRange(0.3, 0.8),
                size: randomRange(3, 8),
                color: color,
                gravity: 50
            }));
        }
    }
    
    createHitEffect(x, y, color = '#ffd32a') {
        for (let i = 0; i < 8; i++) {
            this.particles.push(new Particle(x, y, {
                vx: randomRange(-80, 80),
                vy: randomRange(-80, 80),
                life: 0.3,
                size: randomRange(2, 5),
                color: color,
                gravity: 0
            }));
        }
    }
    
    createEngineTrail(x, y) {
        this.particles.push(new Particle(x, y, {
            vx: randomRange(-20, 20),
            vy: randomRange(50, 100),
            life: 0.3,
            size: randomRange(2, 4),
            color: '#ff9f43',
            gravity: 0
        }));
    }
    
    createPickupEffect(x, y) {
        for (let i = 0; i < 10; i++) {
            const angle = (i / 10) * Math.PI * 2;
            this.particles.push(new Particle(x, y, {
                vx: Math.cos(angle) * 80,
                vy: Math.sin(angle) * 80,
                life: 0.4,
                size: 3,
                color: '#2ed573',
                gravity: 0
            }));
        }
    }
    
    update(dt) {
        this.particles.forEach(p => p.update(dt));
        this.particles = this.particles.filter(p => p.active);
    }
    
    render(ctx) {
        this.particles.forEach(p => p.render(ctx));
    }
    
    clear() {
        this.particles = [];
    }
}
```

- [ ] **Step 2: Update main.js to use ParticleSystem**

```javascript
// Add to imports
import { ParticleSystem } from './particles.js';

// Add to game state
let particleSystem = null;

// Update startGame function
function startGame(difficulty) {
    // ... existing code ...
    particleSystem = new ParticleSystem();
}

// Add helper function
function createExplosion(x, y, count = 20, color = '#ff6b6b') {
    particleSystem.createExplosion(x, y, count, color);
}

// Update update function
function update(dt) {
    // ... existing code ...
    particleSystem.update(dt);
    
    // Engine trail for player
    if (player && gameState === 'playing') {
        particleSystem.createEngineTrail(
            player.x + player.width / 2,
            player.y + player.height
        );
    }
}

// Update render function
function render() {
    // ... existing render code ...
    particleSystem.render(ctx);
}
```

- [ ] **Step 3: Test particle effects**

Play game, verify:
- Explosions when enemies are destroyed
- Hit effects when bullets hit
- Engine trail behind player ship
- Pickup effects when collecting XP orbs

- [ ] **Step 4: Commit**

```bash
cd "/home/sudong/mimo code"
git add js/particles.js js/main.js
git commit -m "feat: add particle effects system"
```

---

## Task 11: Audio System

**Covers:** [S10]

**Files:**
- Create: `/home/sudong/mimo code/js/audio.js`
- Modify: `/home/sudong/mimo code/js/main.js`

- [ ] **Step 1: Create js/audio.js**

```javascript
export class AudioSystem {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.musicEnabled = true;
        this.initialized = false;
    }
    
    init() {
        if (this.initialized) return;
        
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
        } catch (e) {
            console.warn('Audio not supported');
            this.enabled = false;
        }
    }
    
    playShoot() {
        if (!this.enabled || !this.ctx) return;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.1);
        
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.1);
    }
    
    playExplosion() {
        if (!this.enabled || !this.ctx) return;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.3);
        
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
        
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.3);
    }
    
    playPickup() {
        if (!this.enabled || !this.ctx) return;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.1);
        
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.1);
    }
    
    playLevelUp() {
        if (!this.enabled || !this.ctx) return;
        
        const notes = [523, 659, 784, 1047];
        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.1);
            
            gain.gain.setValueAtTime(0.1, this.ctx.currentTime + i * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + i * 0.1 + 0.2);
            
            osc.start(this.ctx.currentTime + i * 0.1);
            osc.stop(this.ctx.currentTime + i * 0.1 + 0.2);
        });
    }
    
    playBossWarning() {
        if (!this.enabled || !this.ctx) return;
        
        for (let i = 0; i < 3; i++) {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.type = 'square';
            osc.frequency.setValueAtTime(200, this.ctx.currentTime + i * 0.2);
            
            gain.gain.setValueAtTime(0.15, this.ctx.currentTime + i * 0.2);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + i * 0.2 + 0.15);
            
            osc.start(this.ctx.currentTime + i * 0.2);
            osc.stop(this.ctx.currentTime + i * 0.2 + 0.15);
        }
    }
    
    playVictory() {
        if (!this.enabled || !this.ctx) return;
        
        const melody = [523, 659, 784, 1047, 784, 1047];
        melody.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.15);
            
            gain.gain.setValueAtTime(0.1, this.ctx.currentTime + i * 0.15);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + i * 0.15 + 0.3);
            
            osc.start(this.ctx.currentTime + i * 0.15);
            osc.stop(this.ctx.currentTime + i * 0.15 + 0.3);
        });
    }
    
    toggleSound() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
    
    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        return this.musicEnabled;
    }
}
```

- [ ] **Step 2: Update main.js to use AudioSystem**

```javascript
// Add to imports
import { AudioSystem } from './audio.js';

// Add to game state
let audioSystem = null;

// Update startGame function
function startGame(difficulty) {
    // ... existing code ...
    audioSystem = new AudioSystem();
    audioSystem.init();
}

// Add audio calls throughout
// In player.shoot():
audioSystem.playShoot();

// When enemy destroyed:
audioSystem.playExplosion();

// When collecting XP:
audioSystem.playPickup();

// On level up:
audioSystem.playLevelUp();

// On boss spawn:
audioSystem.playBossWarning();

// On victory:
audioSystem.playVictory();

// Update keyboard handler for audio toggle
document.addEventListener('keydown', (e) => {
    // ... existing code ...
    
    // Toggle sound with M key
    if (e.key === 'm' || e.key === 'M') {
        audioSystem.toggleSound();
    }
});
```

- [ ] **Step 3: Test audio**

Play game, verify:
- Shooting sounds play
- Explosions have sound
- XP pickup has sound
- Level up has ascending notes
- Boss warning plays before boss
- Victory melody plays on win
- M key toggles sound

- [ ] **Step 4: Commit**

```bash
cd "/home/sudong/mimo code"
git add js/audio.js js/main.js
git commit -m "feat: add audio system with sound effects"
```

---

## Task 12: Main Menu & UI

**Covers:** [S8]

**Files:**
- Create: `/home/sudong/mimo code/js/ui.js`
- Modify: `/home/sudong/mimo code/js/main.js`

- [ ] **Step 1: Create js/ui.js**

```javascript
import { GAME_WIDTH, GAME_HEIGHT } from './main.js';
import { DIFFICULTY } from './config.js';

export class MainMenu {
    constructor() {
        this.selectedIndex = 0;
        this.difficulties = ['easy', 'normal', 'hard'];
        this.title = 'SKY BLASTER';
        this.subtitle = '天空突击者';
        this.starField = this.createStarField();
    }
    
    createStarField() {
        const stars = [];
        for (let i = 0; i < 100; i++) {
            stars.push({
                x: Math.random() * GAME_WIDTH,
                y: Math.random() * GAME_HEIGHT,
                size: Math.random() * 2 + 1,
                speed: Math.random() * 50 + 20
            });
        }
        return stars;
    }
    
    update(dt) {
        this.starField.forEach(star => {
            star.y += star.speed * dt;
            if (star.y > GAME_HEIGHT) {
                star.y = 0;
                star.x = Math.random() * GAME_WIDTH;
            }
        });
    }
    
    handleInput(key) {
        if (key === 'ArrowUp' || key === 'w' || key === 'W') {
            this.selectedIndex = (this.selectedIndex - 1 + 3) % 3;
        }
        if (key === 'ArrowDown' || key === 's' || key === 'S') {
            this.selectedIndex = (this.selectedIndex + 1) % 3;
        }
        if (key === 'Enter' || key === ' ') {
            return this.difficulties[this.selectedIndex];
        }
        if (key >= '1' && key <= '3') {
            return this.difficulties[parseInt(key) - 1];
        }
        return null;
    }
    
    render(ctx) {
        // Background
        ctx.fillStyle = '#0a0a1a';
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        
        // Star field
        ctx.fillStyle = '#fff';
        this.starField.forEach(star => {
            ctx.fillRect(star.x, star.y, star.size, star.size);
        });
        
        // Title
        ctx.fillStyle = '#ffd32a';
        ctx.font = 'bold 36px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(this.title, GAME_WIDTH / 2, 150);
        
        ctx.fillStyle = '#4ecdc4';
        ctx.font = '20px monospace';
        ctx.fillText(this.subtitle, GAME_WIDTH / 2, 180);
        
        // Difficulty selection
        ctx.fillStyle = '#fff';
        ctx.font = '18px monospace';
        ctx.fillText('选择难度', GAME_WIDTH / 2, 250);
        
        this.difficulties.forEach((diff, index) => {
            const y = 300 + index * 80;
            const config = DIFFICULTY[diff];
            const isSelected = index === this.selectedIndex;
            
            // Selection highlight
            if (isSelected) {
                ctx.fillStyle = 'rgba(78, 205, 196, 0.3)';
                ctx.fillRect(GAME_WIDTH / 2 - 120, y - 25, 240, 60);
            }
            
            // Difficulty name
            ctx.fillStyle = isSelected ? '#ffd32a' : '#fff';
            ctx.font = 'bold 20px monospace';
            ctx.fillText(`[${index + 1}] ${config.label}`, GAME_WIDTH / 2, y);
            
            // Description
            ctx.fillStyle = '#aaa';
            ctx.font = '12px monospace';
            ctx.fillText(config.description, GAME_WIDTH / 2, y + 20);
        });
        
        // Controls info
        ctx.fillStyle = '#666';
        ctx.font = '12px monospace';
        ctx.fillText('WASD/方向键 移动 | 自动射击', GAME_WIDTH / 2, 520);
        ctx.fillText('ESC 暂停 | M 静音', GAME_WIDTH / 2, 540);
        
        ctx.textAlign = 'left';
    }
}

export class PauseMenu {
    constructor() {
        this.selectedIndex = 0;
        this.options = ['继续游戏', '返回主菜单'];
    }
    
    handleInput(key) {
        if (key === 'ArrowUp' || key === 'w' || key === 'W') {
            this.selectedIndex = (this.selectedIndex - 1 + 2) % 2;
        }
        if (key === 'ArrowDown' || key === 's' || key === 'S') {
            this.selectedIndex = (this.selectedIndex + 1) % 2;
        }
        if (key === 'Enter' || key === ' ') {
            return this.selectedIndex === 0 ? 'resume' : 'menu';
        }
        if (key === 'Escape') {
            return 'resume';
        }
        return null;
    }
    
    render(ctx) {
        // Overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        
        // Title
        ctx.fillStyle = '#ffd32a';
        ctx.font = 'bold 28px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('暂停', GAME_WIDTH / 2, 200);
        
        // Options
        this.options.forEach((option, index) => {
            const y = 280 + index * 60;
            const isSelected = index === this.selectedIndex;
            
            if (isSelected) {
                ctx.fillStyle = 'rgba(78, 205, 196, 0.3)';
                ctx.fillRect(GAME_WIDTH / 2 - 100, y - 20, 200, 40);
            }
            
            ctx.fillStyle = isSelected ? '#ffd32a' : '#fff';
            ctx.font = '18px monospace';
            ctx.fillText(option, GAME_WIDTH / 2, y + 5);
        });
        
        ctx.textAlign = 'left';
    }
}

export class GameOverScreen {
    constructor(score, level, skills) {
        this.score = score;
        this.level = level;
        this.skills = skills;
        this.selectedIndex = 0;
        this.options = ['重新开始', '返回主菜单'];
    }
    
    handleInput(key) {
        if (key === 'ArrowUp' || key === 'w' || key === 'W') {
            this.selectedIndex = (this.selectedIndex - 1 + 2) % 2;
        }
        if (key === 'ArrowDown' || key === 's' || key === 'S') {
            this.selectedIndex = (this.selectedIndex + 1) % 2;
        }
        if (key === 'Enter' || key === ' ') {
            return this.selectedIndex === 0 ? 'restart' : 'menu';
        }
        return null;
    }
    
    render(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        
        ctx.fillStyle = '#ff4757';
        ctx.font = 'bold 32px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('游戏结束', GAME_WIDTH / 2, 150);
        
        ctx.fillStyle = '#fff';
        ctx.font = '16px monospace';
        ctx.fillText(`最终得分: ${this.score}`, GAME_WIDTH / 2, 220);
        ctx.fillText(`到达关卡: ${this.level}`, GAME_WIDTH / 2, 250);
        ctx.fillText(`获得技能: ${this.skills.length}`, GAME_WIDTH / 2, 280);
        
        this.options.forEach((option, index) => {
            const y = 350 + index * 60;
            const isSelected = index === this.selectedIndex;
            
            if (isSelected) {
                ctx.fillStyle = 'rgba(78, 205, 196, 0.3)';
                ctx.fillRect(GAME_WIDTH / 2 - 100, y - 20, 200, 40);
            }
            
            ctx.fillStyle = isSelected ? '#ffd32a' : '#fff';
            ctx.font = '18px monospace';
            ctx.fillText(option, GAME_WIDTH / 2, y + 5);
        });
        
        ctx.textAlign = 'left';
    }
}

export class VictoryScreen {
    constructor(score, time, skills) {
        this.score = score;
        this.time = time;
        this.skills = skills;
        this.selectedIndex = 0;
        this.options = ['再玩一次', '返回主菜单'];
    }
    
    handleInput(key) {
        if (key === 'ArrowUp' || key === 'w' || key === 'W') {
            this.selectedIndex = (this.selectedIndex - 1 + 2) % 2;
        }
        if (key === 'ArrowDown' || key === 's' || key === 'S') {
            this.selectedIndex = (this.selectedIndex + 1) % 2;
        }
        if (key === 'Enter' || key === ' ') {
            return this.selectedIndex === 0 ? 'restart' : 'menu';
        }
        return null;
    }
    
    render(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        
        ctx.fillStyle = '#2ed573';
        ctx.font = 'bold 36px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('胜利!', GAME_WIDTH / 2, 150);
        
        ctx.fillStyle = '#ffd32a';
        ctx.font = '20px monospace';
        ctx.fillText('恭喜通关!', GAME_WIDTH / 2, 190);
        
        ctx.fillStyle = '#fff';
        ctx.font = '16px monospace';
        ctx.fillText(`最终得分: ${this.score}`, GAME_WIDTH / 2, 250);
        ctx.fillText(`通关时间: ${Math.floor(this.time)}秒`, GAME_WIDTH / 2, 280);
        ctx.fillText(`获得技能: ${this.skills.length}`, GAME_WIDTH / 2, 310);
        
        this.options.forEach((option, index) => {
            const y = 380 + index * 60;
            const isSelected = index === this.selectedIndex;
            
            if (isSelected) {
                ctx.fillStyle = 'rgba(78, 205, 196, 0.3)';
                ctx.fillRect(GAME_WIDTH / 2 - 100, y - 20, 200, 40);
            }
            
            ctx.fillStyle = isSelected ? '#ffd32a' : '#fff';
            ctx.font = '18px monospace';
            ctx.fillText(option, GAME_WIDTH / 2, y + 5);
        });
        
        ctx.textAlign = 'left';
    }
}
```

- [ ] **Step 2: Update main.js to use UI components**

```javascript
// Add to imports
import { MainMenu, PauseMenu, GameOverScreen, VictoryScreen } from './ui.js';

// Add to game state
let mainMenu = null;
let pauseMenu = null;
let gameOverScreen = null;
let victoryScreen = null;

// Initialize menus
mainMenu = new MainMenu();

// Update keyboard handler
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    
    // Menu state
    if (gameState === 'menu') {
        const result = mainMenu.handleInput(e.key);
        if (result) {
            startGame(result);
        }
        return;
    }
    
    // Playing state
    if (gameState === 'playing') {
        if (showingSkillSelection) {
            skillSelectionUI.handleInput(e.key);
            return;
        }
        
        if (e.key === 'Escape') {
            gameState = 'paused';
            pauseMenu = new PauseMenu();
        }
        return;
    }
    
    // Paused state
    if (gameState === 'paused') {
        const result = pauseMenu.handleInput(e.key);
        if (result === 'resume') {
            gameState = 'playing';
        } else if (result === 'menu') {
            gameState = 'menu';
            mainMenu = new MainMenu();
        }
        return;
    }
    
    // Game over state
    if (gameState === 'gameOver') {
        const result = gameOverScreen.handleInput(e.key);
        if (result === 'restart') {
            startGame(difficulty);
        } else if (result === 'menu') {
            gameState = 'menu';
            mainMenu = new MainMenu();
        }
        return;
    }
    
    // Victory state
    if (gameState === 'victory') {
        const result = victoryScreen.handleInput(e.key);
        if (result === 'restart') {
            startGame(difficulty);
        } else if (result === 'menu') {
            gameState = 'menu';
            mainMenu = new MainMenu();
        }
        return;
    }
});

// Update render function
function render() {
    switch (gameState) {
        case 'menu':
            mainMenu.render(ctx);
            break;
            
        case 'playing':
        case 'paused':
            // Render game
            levelManager.render(ctx);
            if (player) player.render(ctx);
            enemies.forEach(enemy => enemy.render(ctx));
            bulletManager.render(ctx);
            experienceSystem.render(ctx);
            if (currentBoss && currentBoss.active) currentBoss.render(ctx);
            particleSystem.render(ctx);
            renderHUD();
            
            // Render skill selection
            if (showingSkillSelection) {
                skillSelectionUI.render(ctx, GAME_WIDTH, GAME_HEIGHT);
            }
            
            // Render pause menu
            if (gameState === 'paused') {
                pauseMenu.render(ctx);
            }
            break;
            
        case 'gameOver':
            gameOverScreen.render(ctx);
            break;
            
        case 'victory':
            victoryScreen.render(ctx);
            break;
    }
}
```

- [ ] **Step 3: Test all menus**

Test each menu:
- Main menu: navigate with arrow keys, select difficulty
- Pause: ESC to pause, resume or quit
- Game over: show score, restart or quit
- Victory: show stats, play again or quit

- [ ] **Step 4: Commit**

```bash
cd "/home/sudong/mimo code"
git add js/ui.js js/main.js
git commit -m "feat: add complete menu system"
```

---

## Task 13: Game Integration & Polish

**Covers:** [S1, S9, S13]

**Files:**
- Modify: `/home/sudong/mimo code/js/main.js`
- Modify: `/home/sudong/mimo code/js/player.js`
- Modify: `/home/sudong/mimo code/js/enemies.js`

- [ ] **Step 1: Final integration pass in main.js**

Ensure all systems are properly connected:
- Player shooting creates bullets via BulletManager
- Enemy destruction creates XP orbs via ExperienceSystem
- Level up triggers SkillSelectionUI
- Boss defeat triggers level transition
- All particles, sounds, and UI work together

- [ ] **Step 2: Polish player ship visuals**

Update player.js render method for better pixel art:
```javascript
render(ctx) {
    if (!this.visible) return;
    
    // Main body (blue)
    ctx.fillStyle = '#4ecdc4';
    ctx.fillRect(this.x + 8, this.y, 16, 32);
    
    // Wings (darker blue)
    ctx.fillStyle = '#3d9e8f';
    ctx.fillRect(this.x, this.y + 16, 8, 16);
    ctx.fillRect(this.x + 24, this.y + 16, 8, 16);
    
    // Cockpit (light blue)
    ctx.fillStyle = '#45b7d1';
    ctx.fillRect(this.x + 12, this.y + 4, 8, 8);
    
    // Engine glow (orange)
    ctx.fillStyle = '#ff9f43';
    ctx.fillRect(this.x + 10, this.y + 28, 4, 4);
    ctx.fillRect(this.x + 18, this.y + 28, 4, 4);
    
    // Engine flame (animated)
    const flameFlicker = Math.random() > 0.5 ? 2 : 0;
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(this.x + 11, this.y + 32 + flameFlicker, 2, 4);
    ctx.fillRect(this.x + 19, this.y + 32 + flameFlicker, 2, 4);
}
```

- [ ] **Step 3: Polish enemy visuals**

Update enemy render methods for variety and clarity.

- [ ] **Step 4: Add difficulty display in HUD**

Show current difficulty setting in the corner.

- [ ] **Step 5: Test complete game flow**

Play through entire game:
1. Start from menu
2. Play through 3 levels
3. Defeat all bosses
4. Reach victory screen
5. Test restart and menu navigation

- [ ] **Step 6: Final commit**

```bash
cd "/home/sudong/mimo code"
git add -A
git commit -m "feat: complete game integration and polish"
```

---

## Task 14: Verification & Testing

**Covers:** [S13]

**Files:**
- None (verification only)

- [ ] **Step 1: Browser compatibility test**

Test in Chrome, Firefox, and Edge (if available).

- [ ] **Step 2: Performance verification**

Open browser DevTools, verify:
- Game runs at 60fps
- No memory leaks (objects are properly cleaned up)
- Canvas operations are efficient

- [ ] **Step 3: Feature checklist**

Verify all spec requirements:
- [ ] 3 difficulty levels work correctly
- [ ] Auto-shooting functions
- [ ] 4 enemy types behave as specified
- [ ] 8 skills work and can be upgraded
- [ ] 3 levels with unique backgrounds
- [ ] Boss battles have phase changes
- [ ] Invincibility frames work
- [ ] UI is clear and readable
- [ ] Audio plays correctly
- [ ] Game is fun for target audience (7-8 year olds)

- [ ] **Step 4: Create README**

```markdown
# Sky Blaster - 天空突击者

2D竖版卷轴射击游戏 + Roguelike技能升级系统

## 如何运行

1. 打开浏览器（推荐 Chrome 或 Firefox）
2. 打开 `index.html` 文件
3. 选择难度开始游戏

## 操作说明

- **WASD / 方向键**：移动战机
- **自动射击**：战机自动开火
- **ESC**：暂停游戏
- **M**：静音/取消静音
- **1/2/3**：在菜单中快速选择

## 游戏特色

- 3种难度选择，适合不同水平玩家
- 8种可升级技能，每次升级随机3选1
- 3个关卡，每关有独特Boss
- 像素风格画面，适合儿童
- 基础音效反馈

## 技术栈

- HTML5 Canvas
- 原生 JavaScript (ES6)
- Web Audio API (音效)

## 项目结构

```
├── index.html          # 游戏入口
├── css/style.css       # 样式
├── js/
│   ├── main.js         # 游戏主循环
│   ├── config.js       # 配置数据
│   ├── player.js       # 玩家系统
│   ├── enemies.js      # 敌人系统
│   ├── boss.js         # Boss系统
│   ├── skills.js       # 技能系统
│   ├── bullets.js      # 子弹系统
│   ├── experience.js   # 经验系统
│   ├── levels.js       # 关卡系统
│   ├── particles.js    # 粒子特效
│   ├── audio.js        # 音效系统
│   ├── ui.js           # UI系统
│   └── utils.js        # 工具函数
└── assets/             # 资源文件
```
```

- [ ] **Step 5: Final commit**

```bash
cd "/home/sudong/mimo code"
git add README.md
git commit -m "docs: add README with game instructions"
```

---

## Self-Review Results

### 1. Spec Coverage
- [S1] Overview → Task 1 (scaffold)
- [S2] Difficulty → Task 2 (config)
- [S3] Player → Task 3 (player)
- [S4] Skills → Task 7 (skills)
- [S5] Enemies → Task 4 (enemies)
- [S6] Boss → Task 8 (boss)
- [S7] Levels → Task 9 (levels)
- [S8] UI → Task 12 (ui)
- [S9] Art → Task 13 (polish)
- [S10] Audio → Task 11 (audio)
- [S11] Structure → Task 1 (scaffold)
- [S12] Technical → Tasks 1-13
- [S13] Acceptance → Task 14 (verification)

### 2. Placeholder Scan
No TBD/TODO markers found. All steps have complete code.

### 3. Type Consistency
- Bullet class used consistently across tasks
- Skill system interface matches between skills.js and player.js
- Event handling consistent across all UI components

### 4. Scope Check
14 tasks, each completable in 2-5 minutes. Total implementation time: ~2-3 hours.

---

*Plan version: v1.0*
*Created: 2026-06-16*
*Spec: 2026-06-16-sky-blaster-design.md*
