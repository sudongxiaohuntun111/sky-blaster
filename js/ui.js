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
        ctx.fillStyle = '#0a0a1a';
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        
        ctx.fillStyle = '#fff';
        this.starField.forEach(star => {
            ctx.fillRect(star.x, star.y, star.size, star.size);
        });
        
        ctx.fillStyle = '#ffd32a';
        ctx.font = 'bold 36px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(this.title, GAME_WIDTH / 2, 150);
        
        ctx.fillStyle = '#4ecdc4';
        ctx.font = '20px monospace';
        ctx.fillText(this.subtitle, GAME_WIDTH / 2, 180);
        
        ctx.fillStyle = '#fff';
        ctx.font = '18px monospace';
        ctx.fillText('选择难度', GAME_WIDTH / 2, 250);
        
        this.difficulties.forEach((diff, index) => {
            const y = 300 + index * 80;
            const config = DIFFICULTY[diff];
            const isSelected = index === this.selectedIndex;
            
            if (isSelected) {
                ctx.fillStyle = 'rgba(78, 205, 196, 0.3)';
                ctx.fillRect(GAME_WIDTH / 2 - 120, y - 25, 240, 60);
            }
            
            ctx.fillStyle = isSelected ? '#ffd32a' : '#fff';
            ctx.font = 'bold 20px monospace';
            ctx.fillText(`[${index + 1}] ${config.label}`, GAME_WIDTH / 2, y);
            
            ctx.fillStyle = '#aaa';
            ctx.font = '12px monospace';
            ctx.fillText(config.description, GAME_WIDTH / 2, y + 20);
        });
        
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
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        
        ctx.fillStyle = '#ffd32a';
        ctx.font = 'bold 28px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('暂停', GAME_WIDTH / 2, 200);
        
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