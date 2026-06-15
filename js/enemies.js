import { ENEMIES, LEVELS } from './config.js';
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
        
        this.x = x || randomRange(0, GAME_WIDTH - this.width);
        this.y = -this.height;
        
        this.baseX = this.x;
        this.moveTimer = 0;
        this.movePattern = this.getMovePattern(type);
        
        this.shootTimer = 0;
        this.shootInterval = config.shootInterval || Infinity;
        this.bulletSpeed = config.bulletSpeed || 200;
        
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
                this.shootTimer += dt;
                break;
                
            case 'chase':
                const dx = playerX - this.x;
                const dy = playerY - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist > 0) {
                    this.x += (dx / dist) * this.speed * dt;
                    this.y += (dy / dist) * this.speed * dt;
                }
                break;
        }
        
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
            return true;
        }
        return false;
    }
    
    render(ctx) {
        ctx.fillStyle = this.color;
        
        switch (this.type) {
            case 'scout':
                ctx.beginPath();
                ctx.moveTo(this.x + this.width / 2, this.y);
                ctx.lineTo(this.x, this.y + this.height);
                ctx.lineTo(this.x + this.width, this.y + this.height);
                ctx.closePath();
                ctx.fill();
                break;
                
            case 'fighter':
                ctx.beginPath();
                ctx.moveTo(this.x + this.width / 2, this.y);
                ctx.lineTo(this.x + this.width, this.y + this.height / 2);
                ctx.lineTo(this.x + this.width / 2, this.y + this.height);
                ctx.lineTo(this.x, this.y + this.height / 2);
                ctx.closePath();
                ctx.fill();
                break;
                
            case 'bomber':
                ctx.fillRect(this.x + 4, this.y, this.width - 8, this.height);
                ctx.fillRect(this.x, this.y + 8, 4, this.height - 8);
                ctx.fillRect(this.x + this.width - 4, this.y + 8, 4, this.height - 8);
                break;
                
            case 'drone':
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
        this.enemyTypes = [];
    }
    
    startWave(waveNumber, enemyTypes, spawnMultiplier) {
        this.currentWave = waveNumber;
        this.enemyTypes = enemyTypes;
        this.enemiesInWave = Math.floor((5 + waveNumber * 2) * spawnMultiplier);
        this.enemiesSpawned = 0;
        this.waveActive = true;
        this.spawnTimer = 0;
    }
    
    update(dt, enemies) {
        if (!this.waveActive) return;
        
        this.spawnTimer += dt;
        
        if (this.spawnTimer >= 0.5 && this.enemiesSpawned < this.enemiesInWave) {
            this.spawnTimer = 0;
            const typeIndex = randomInt(0, this.enemyTypes.length - 1);
            const type = this.enemyTypes[typeIndex];
            enemies.push(new Enemy(type));
            this.enemiesSpawned++;
        }
        
        if (this.enemiesSpawned >= this.enemiesInWave) {
            this.waveActive = false;
        }
    }
}