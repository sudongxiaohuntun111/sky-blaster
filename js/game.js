export const GAME_WIDTH = 400;
export const GAME_HEIGHT = 600;

let canvas = null;
let ctx = null;

export function initCanvas() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;
    return { canvas, ctx };
}

export function getCanvas() {
    return canvas;
}

export function getCtx() {
    return ctx;
}

const keys = {};
export function getKeys() {
    return keys;
}

export function handleKeyDown(e) {
    keys[e.key] = true;
}

export function handleKeyUp(e) {
    keys[e.key] = false;
}

let gameState = 'menu';
export function getGameState() {
    return gameState;
}

export function setGameState(state) {
    gameState = state;
}