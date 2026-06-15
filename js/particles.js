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