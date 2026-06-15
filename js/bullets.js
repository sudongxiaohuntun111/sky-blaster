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
        
        this.vx = options.vx || 0;
        this.vy = options.vy || -speed;
        
        this.isHoming = options.isHoming || false;
        this.target = null;
        this.turnSpeed = 3;
    }
    
    update(dt, enemies) {
        if (this.isHoming && enemies.length > 0) {
            if (!this.target || !this.target.active) {
                this.target = this.findNearestEnemy(enemies);
            }
            
            if (this.target) {
                const targetAngle = angleBetween(
                    this.x, this.y,
                    this.target.x + this.target.width / 2,
                    this.target.y + this.target.height / 2
                );
                
                const currentAngle = Math.atan2(this.vy, this.vx);
                let angleDiff = targetAngle - currentAngle;
                
                while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
                while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
                
                const turn = Math.sign(angleDiff) * Math.min(
                    Math.abs(angleDiff),
                    this.turnSpeed * dt
                );
                
                const newAngle = currentAngle + turn;
                this.vx = Math.cos(newAngle) * this.speed;
                this.vy = Math.sin(newAngle) * this.speed;
            }
        }
        
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        
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
            ctx.beginPath();
            ctx.moveTo(this.x + this.width / 2, this.y);
            ctx.lineTo(this.x + this.width, this.y + this.height / 2);
            ctx.lineTo(this.x + this.width / 2, this.y + this.height);
            ctx.lineTo(this.x, this.y + this.height / 2);
            ctx.closePath();
            ctx.fill();
        } else {
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
            { vy: speed }
        ));
    }
    
    update(dt, enemies) {
        this.playerBullets.forEach(bullet => {
            bullet.update(dt, enemies);
        });
        this.playerBullets = this.playerBullets.filter(b => b.active);
        
        this.enemyBullets.forEach(bullet => {
            bullet.update(dt, []);
        });
        this.enemyBullets = this.enemyBullets.filter(b => b.active);
    }
    
    checkCollisions(enemies, player) {
        const results = {
            enemiesHit: [],
            playerHit: false,
            xpGained: 0
        };
        
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