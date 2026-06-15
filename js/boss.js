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
        
        this.x = GAME_WIDTH / 2 - this.width / 2;
        this.y = -this.height;
        this.targetY = 50;
        
        this.speed = 100;
        this.moveTimer = 0;
        this.moveDirection = 1;
        
        this.attackTimer = 0;
        this.attackInterval = 1.5;
        this.currentPhase = 0;
        
        this.active = true;
        this.entering = true;
        this.defeated = false;
    }
    
    update(dt, playerX, playerY) {
        if (this.entering) {
            this.y += 100 * dt;
            if (this.y >= this.targetY) {
                this.y = this.targetY;
                this.entering = false;
            }
            return;
        }
        
        const hpPercent = this.hp / this.maxHP;
        for (let i = this.phases.length - 1; i >= 0; i--) {
            if (hpPercent <= this.phases[i].hpThreshold + 0.01) {
                this.currentPhase = i;
                break;
            }
        }
        
        this.moveTimer += dt;
        this.x += this.speed * this.moveDirection * dt;
        
        if (this.x <= 0 || this.x >= GAME_WIDTH - this.width) {
            this.moveDirection *= -1;
        }
        
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
                bullets.push(...this.generateBullets('fan'));
                break;
                
            case 'laser_sweep':
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
        
        ctx.fillRect(this.x + 8, this.y, this.width - 16, this.height);
        
        ctx.fillRect(this.x, this.y + 16, 8, this.height - 32);
        ctx.fillRect(this.x + this.width - 8, this.y + 16, 8, this.height - 32);
        
        ctx.fillStyle = '#ff4757';
        ctx.fillRect(
            this.x + this.width / 2 - 8,
            this.y + this.height / 2 - 8,
            16,
            16
        );
        
        ctx.fillStyle = '#fff';
        ctx.fillRect(
            this.x + this.width / 2 - 4,
            this.y + this.height / 2 - 4,
            8,
            8
        );
        
        const barWidth = this.width + 20;
        const barHeight = 8;
        const barX = this.x - 10;
        const barY = this.y - 15;
        
        ctx.fillStyle = '#333';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        ctx.fillStyle = this.hp > this.maxHP * 0.3 ? '#2ed573' : '#ff4757';
        ctx.fillRect(barX, barY, barWidth * (this.hp / this.maxHP), barHeight);
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(this.name, this.x + this.width / 2, barY - 5);
        ctx.textAlign = 'left';
    }
}