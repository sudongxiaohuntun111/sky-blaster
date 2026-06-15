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
        
        this.vx = randomRange(-50, 50);
        this.vy = randomRange(-100, -50);
        this.gravity = 200;
        
        this.color = '#2ed573';
        this.pulseTimer = 0;
    }
    
    update(dt, playerX, playerY, magnetRange) {
        this.vy += this.gravity * dt;
        
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        
        const dist = distance(this.x, this.y, playerX, playerY);
        if (dist < magnetRange) {
            const angle = Math.atan2(playerY - this.y, playerX - this.x);
            const speed = 300;
            this.x += Math.cos(angle) * speed * dt;
            this.y += Math.sin(angle) * speed * dt;
        }
        
        if (this.y > GAME_HEIGHT + 50) {
            this.active = false;
        }
        
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
        const adjustedValue = Math.floor(value * 1.2);
        this.orbs.push(new ExperienceOrb(x, y, adjustedValue));
    }
    
    update(dt, playerX, playerY, magnetRange) {
        this.orbs.forEach(orb => {
            orb.update(dt, playerX, playerY, magnetRange);
        });
        
        let leveledUp = false;
        
        this.orbs.forEach(orb => {
            if (!orb.active) return;
            
            const dist = distance(
                orb.x, orb.y,
                playerX, playerY
            );
            
            if (dist < 30) {
                if (this.collectXP(orb.value)) {
                    leveledUp = true;
                }
                orb.active = false;
            }
        });
        
        this.orbs = this.orbs.filter(o => o.active);
        
        return leveledUp;
    }
    
    collectXP(amount) {
        this.currentXP += amount;
        this.totalXP += amount;
        
        if (this.currentXP >= this.xpToNextLevel) {
            this.currentXP -= this.xpToNextLevel;
            this.currentLevel++;
            this.xpToNextLevel = Math.floor(
                EXPERIENCE.baseXPPerLevel * 
                Math.pow(EXPERIENCE.xpGrowthRate, this.currentLevel - 1)
            );
            return true;
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