import { SKILLS } from './config.js';

export class SkillSystem {
    constructor() {
        this.availableSkills = Object.keys(SKILLS);
        this.selectedSkills = [];
    }
    
    getRandomSkills(count = 3) {
        const eligible = this.availableSkills.filter(id => {
            const skill = SKILLS[id];
            const currentLevel = this.selectedSkills.find(s => s.id === id)?.level || 0;
            return currentLevel < skill.maxLevel;
        });
        
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
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        ctx.fillStyle = '#ffd32a';
        ctx.font = 'bold 24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('选择技能', canvasWidth / 2, 80);
        
        ctx.fillStyle = '#aaa';
        ctx.font = '14px monospace';
        ctx.fillText('按 1/2/3 选择', canvasWidth / 2, 110);
        
        const cardWidth = 100;
        const cardHeight = 150;
        const spacing = 20;
        const totalWidth = this.skills.length * cardWidth + (this.skills.length - 1) * spacing;
        const startX = (canvasWidth - totalWidth) / 2;
        
        this.skills.forEach((skill, index) => {
            const x = startX + index * (cardWidth + spacing);
            const y = 150;
            
            ctx.fillStyle = '#2c3e50';
            ctx.fillRect(x, y, cardWidth, cardHeight);
            
            ctx.strokeStyle = '#3498db';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, cardWidth, cardHeight);
            
            ctx.font = '32px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(skill.icon, x + cardWidth / 2, y + 40);
            
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 12px monospace';
            ctx.fillText(skill.name, x + cardWidth / 2, y + 70);
            
            ctx.fillStyle = '#2ed573';
            ctx.font = '11px monospace';
            ctx.fillText(
                `Lv.${skill.currentLevel} → ${skill.currentLevel + 1}`,
                x + cardWidth / 2,
                y + 90
            );
            
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
            
            ctx.fillStyle = '#ffd32a';
            ctx.font = 'bold 14px monospace';
            ctx.fillText(`[${index + 1}]`, x + cardWidth / 2, y + cardHeight - 10);
        });
        
        ctx.textAlign = 'left';
    }
}