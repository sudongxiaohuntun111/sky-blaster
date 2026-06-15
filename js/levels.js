import { LEVELS } from './config.js';
import { GAME_WIDTH, GAME_HEIGHT } from './game.js';

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
        const config = LEVELS[this.currentLevel - 1];
        
        const gradient = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
        gradient.addColorStop(0, config.bgColor);
        gradient.addColorStop(1, this.darkenColor(config.bgColor, 0.5));
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        
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