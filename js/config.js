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

export const PLAYER = {
    width: 32,
    height: 32,
    speed: 200,
    shootInterval: 0.2,
    bulletSpeed: 400,
    bulletDamage: 1,
    bulletWidth: 4,
    bulletHeight: 12
};

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

export const LEVELS = [
    {
        id: 1,
        name: '森林地带',
        bgColor: '#1a472a',
        waves: 6,
        bossKey: 'level1',
        enemyTypes: ['scout', 'fighter'],
        waveInterval: 3
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

export const EXPERIENCE = {
    baseXPPerLevel: 100,
    xpGrowthRate: 1.5,
    orbValue: 10,
    orbMagnetRange: 30
};

export const UI = {
    hudHeight: 60,
    skillSelectionDuration: 0,
    colors: {
        hp: '#ff4757',
        xp: '#2ed573',
        text: '#ffffff',
        menuBg: 'rgba(0, 0, 0, 0.85)'
    }
};