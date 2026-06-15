import { canvas, keys, GAME_WIDTH, GAME_HEIGHT } from './main.js';
import { PLAYER, DIFFICULTY } from './config.js';
import { clamp } from './utils.js';

export class Player {
    constructor(difficulty) {
        this.width = PLAYER.width;
        this.height = PLAYER.height;
        this.x = GAME_WIDTH / 2 - this.width / 2;
        this.y = GAME_HEIGHT - 80;
        
        const diffSettings = DIFFICULTY[difficulty];
        this.maxHP = diffSettings.playerHP;
        this.hp = this.maxHP;
        this.invincibilityDuration = diffSettings.invincibilityDuration;
        
        this.speed = PLAYER.speed;
        this.dx = 0;
        this.dy = 0;
        
        this.shootTimer = 0;
        this.shootInterval = PLAYER.shootInterval;
        this.bulletSpeed = PLAYER.bulletSpeed;
        this.bulletDamage = PLAYER.bulletDamage;
        
        this.isInvincible = false;
        this.invincibilityTimer = 0;
        this.visible = true;
        this.flashTimer = 0;
        
        this.skills = {};
        this.shieldHits = 0;
        
        this.color = '#4ecdc4';
    }
    
    update(dt) {
        this.dx = 0;
        this.dy = 0;
        
        if (keys['ArrowLeft'] || keys['a'] || keys['A']) this.dx = -1;
        if (keys['ArrowRight'] || keys['d'] || keys['D']) this.dx = 1;
        if (keys['ArrowUp'] || keys['w'] || keys['W']) this.dy = -1;
        if (keys['ArrowDown'] || keys['s'] || keys['S']) this.dy = 1;
        
        if (this.dx !== 0 && this.dy !== 0) {
            this.dx *= 0.707;
            this.dy *= 0.707;
        }
        
        const speedMultiplier = this.getSkillMultiplier('speed');
        const currentSpeed = this.speed * speedMultiplier;
        
        this.x += this.dx * currentSpeed * dt;
        this.y += this.dy * currentSpeed * dt;
        
        this.x = clamp(this.x, 0, GAME_WIDTH - this.width);
        this.y = clamp(this.y, 0, GAME_HEIGHT - this.height);
        
        this.shootTimer += dt;
        const currentShootInterval = this.shootInterval * this.getSkillMultiplier('fireRate');
        
        if (this.shootTimer >= currentShootInterval) {
            this.shootTimer = 0;
            return this.shoot();
        }
        
        if (this.isInvincible) {
            this.invincibilityTimer -= dt;
            this.flashTimer += dt;
            
            if (this.flashTimer >= 0.1) {
                this.visible = !this.visible;
                this.flashTimer = 0;
            }
            
            if (this.invincibilityTimer <= 0) {
                this.isInvincible = false;
                this.visible = true;
            }
        }
        
        return [];
    }
    
    shoot() {
        const bulletCount = this.getSkillValue('scatter', 'bulletCount', 1);
        const damageMultiplier = this.getSkillMultiplier('damage');
        const damage = this.bulletDamage * damageMultiplier;
        
        const bullets = [];
        
        if (bulletCount === 1) {
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
            const spreadAngle = Math.PI / 6;
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
        
        if (skillId === 'shield') {
            this.shieldHits = this.getSkillValue('shield', 'shieldHits', 0);
        }
    }
    
    getSkillValue(skillId, stat, defaultValue) {
        const level = this.skills[skillId] || 0;
        if (level === 0) return defaultValue;
        return defaultValue + (level - 1);
    }
    
    getSkillMultiplier(skillId) {
        const level = this.skills[skillId] || 0;
        if (level === 0) return 1;
        return 1 + (level * 0.15);
    }
    
    render(ctx) {
        if (!this.visible) return;
        
        ctx.fillStyle = this.color;
        
        ctx.fillRect(this.x + 8, this.y, 16, 32);
        
        ctx.fillRect(this.x, this.y + 16, 8, 16);
        ctx.fillRect(this.x + 24, this.y + 16, 8, 16);
        
        ctx.fillStyle = '#45b7d1';
        ctx.fillRect(this.x + 12, this.y + 4, 8, 8);
        
        ctx.fillStyle = '#ff6b6b';
        ctx.fillRect(this.x + 10, this.y + 28, 4, 4);
        ctx.fillRect(this.x + 18, this.y + 28, 4, 4);
        
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