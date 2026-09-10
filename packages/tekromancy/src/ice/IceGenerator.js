/**
 * IceGenerator.js - Sub-Zero Frost Crystallization & Ice Shatter Engine
 * Part of @tekromancy/tekromancy visual effects library.
 */

import { IceCrystal, IceShard } from './IceCrystal.js';

export class IceGenerator {
  /**
   * @param {Object} [options]
   * @param {string} [options.canvasId='ice-fx-canvas']
   * @param {string} [options.theme='frost'] 'frost' | 'glacial' | 'rime' | 'void'
   * @param {number} [options.maxCrystals=200]
   * @param {boolean} [options.autoResize=true]
   * @param {boolean} [options.autoInjectStyles=true]
   */
  constructor(options = {}) {
    this.canvasId = options.canvasId || 'ice-fx-canvas';
    this.theme = options.theme || 'frost';
    this.maxCrystals = options.maxCrystals || 200;
    this.maxShards = options.maxShards || 150;
    this.autoResize = options.autoResize !== false;
    this.autoInjectStyles = options.autoInjectStyles !== false;

    this.crystals = [];
    this.shards = [];
    this.isRunning = false;
    this.rafId = null;

    this.initCanvas();
    if (this.autoInjectStyles) {
      this.injectStyles();
    }
  }

  initCanvas() {
    if (typeof document === 'undefined') return;

    let canvas = document.getElementById(this.canvasId);
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = this.canvasId;
      canvas.className = 'tekro-fx-canvas tekro-ice-canvas';
      document.body.appendChild(canvas);
    }
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.resize();

    if (this.autoResize) {
      this._onResize = () => this.resize();
      window.addEventListener('resize', this._onResize);
    }
  }

  resize() {
    if (!this.canvas) return;
    const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;
    this.width = typeof window !== 'undefined' ? window.innerWidth : 800;
    this.height = typeof window !== 'undefined' ? window.innerHeight : 600;

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    if (this.ctx) {
      this.ctx.scale(dpr, dpr);
    }
  }

  injectStyles() {
    if (typeof document === 'undefined') return;
    if (document.getElementById('tekro-ice-injected-styles')) return;

    const style = document.createElement('style');
    style.id = 'tekro-ice-injected-styles';
    style.textContent = `
      .tekro-ice-canvas {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: screen;
      }
      .ice-element-frozen {
        box-shadow: 0 0 28px rgba(140, 220, 255, 0.8), inset 0 0 16px rgba(220, 245, 255, 0.6) !important;
        border-color: rgba(180, 235, 255, 0.95) !important;
        backdrop-filter: blur(4px);
        animation: ice-sparkle 1.2s infinite alternate ease-in-out;
      }
      @keyframes ice-sparkle {
        from { filter: drop-shadow(0 0 6px rgba(120, 200, 255, 0.6)); }
        to { filter: drop-shadow(0 0 20px rgba(200, 240, 255, 0.95)); }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Explodes a burst of crystalline ice shards from coordinates
   * @param {number} x
   * @param {number} y
   * @param {Object} [options]
   * @param {number} [options.count=30]
   * @param {string} [options.theme]
   * @param {number} [options.intensity=1]
   */
  shatter(x, y, options = {}) {
    const count = options.count || Math.floor(25 * (options.intensity || 1));
    const theme = options.theme || this.theme;

    for (let i = 0; i < count; i++) {
      if (this.shards.length >= this.maxShards) break;
      this.shards.push(new IceShard(x, y, {
        theme,
        speedScale: 1.2 * (options.intensity || 1),
        scale: 1.0 * (options.intensity || 1)
      }));
    }
    this.startLoop();
  }

  /**
   * Creep dendritic frost across the borders of a DOM element
   * @param {HTMLElement|string} elementOrSelector
   * @param {Object} [options]
   * @param {number} [options.duration=1800]
   * @param {number} [options.intensity=1]
   * @param {string} [options.theme]
   */
  freeze(elementOrSelector, options = {}) {
    if (typeof document === 'undefined') return;
    const el = typeof elementOrSelector === 'string'
      ? document.querySelector(elementOrSelector)
      : elementOrSelector;
    if (!el) return;

    const duration = options.duration || 1800;
    const intensity = Math.max(0.1, options.intensity || 1);
    const theme = options.theme || this.theme;

    el.classList.add('ice-element-frozen');

    const rect = el.getBoundingClientRect();
    const crystalCount = Math.floor(10 * intensity);

    // Spawn crystals pointing outward from all four edges
    for (let i = 0; i < crystalCount; i++) {
      if (this.crystals.length >= this.maxCrystals) break;
      const edge = i % 4;
      let px, py, angle;

      if (edge === 0) { // Top edge -> points up/out
        px = rect.left + Math.random() * rect.width;
        py = rect.top;
        angle = -Math.PI * 0.5 + (Math.random() - 0.5) * 0.5;
      } else if (edge === 1) { // Right edge -> points right
        px = rect.right;
        py = rect.top + Math.random() * rect.height;
        angle = 0 + (Math.random() - 0.5) * 0.5;
      } else if (edge === 2) { // Bottom edge -> points down
        px = rect.left + Math.random() * rect.width;
        py = rect.bottom;
        angle = Math.PI * 0.5 + (Math.random() - 0.5) * 0.5;
      } else { // Left edge -> points left
        px = rect.left;
        py = rect.top + Math.random() * rect.height;
        angle = Math.PI + (Math.random() - 0.5) * 0.5;
      }

      const crystal = new IceCrystal(px, py, angle, {
        theme,
        maxDepth: 3,
        scale: 0.8 * intensity,
        length: (12 + Math.random() * 14) * intensity,
        growthSpeed: 1.4 * intensity
      });
      this.crystals.push(crystal);
    }

    this.startLoop();

    // Fade out crystals and element freeze after duration
    setTimeout(() => {
      el.classList.remove('ice-element-frozen');
      for (const c of this.crystals) {
        c.fade = true;
      }
    }, duration);
  }

  /**
   * Encircle is an alias for freeze around a target element
   */
  encircle(elementOrSelector, options = {}) {
    this.freeze(elementOrSelector, options);
  }

  /**
   * Start a sub-zero blizzard storm across the viewport (1-100 scale)
   * @param {number} [duration=2500]
   * @param {number} [amount=50] Scale 1-100
   * @param {string} [theme]
   */
  startBlizzard(duration = 2500, amount = 50, theme = null) {
    const level = Math.max(1, Math.min(100, amount)) / 100;
    const selectedTheme = theme || this.theme;
    const interval = 50;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;
      if (elapsed >= duration) {
        clearInterval(timer);
        return;
      }

      // Spawn swirling flurry shards from left or top edges
      const spawnCount = Math.floor(3 + level * 8);
      for (let i = 0; i < spawnCount; i++) {
        if (this.shards.length >= this.maxShards) break;
        const x = Math.random() * this.width;
        const y = Math.random() * (this.height * 0.3);
        const shard = new IceShard(x, y, {
          theme: selectedTheme,
          scale: 0.7 + level * 0.5,
          speedScale: 1.5 + level * 2
        });
        // Blizzard wind drift (rightwards)
        shard.vx += (4 + level * 8);
        this.shards.push(shard);
      }
      this.startLoop();
    }, interval);
  }

  startLoop() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animate();
  }

  animate() {
    if (!this.isRunning) return;

    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.width, this.height);

      // Render crystals
      for (let i = this.crystals.length - 1; i >= 0; i--) {
        const c = this.crystals[i];
        if (c.update()) {
          c.render(this.ctx);
        } else {
          this.crystals.splice(i, 1);
        }
      }

      // Render shards
      for (let i = this.shards.length - 1; i >= 0; i--) {
        const s = this.shards[i];
        if (s.update()) {
          s.render(this.ctx);
        } else {
          this.shards.splice(i, 1);
        }
      }
    }

    if (this.crystals.length > 0 || this.shards.length > 0) {
      this.rafId = requestAnimationFrame(() => this.animate());
    } else {
      this.isRunning = false;
      this.rafId = null;
      if (this.ctx) this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }

  clear() {
    this.crystals = [];
    this.shards = [];
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.isRunning = false;
    if (this.ctx) this.ctx.clearRect(0, 0, this.width, this.height);
  }

  destroy() {
    this.clear();
    if (this._onResize) {
      window.removeEventListener('resize', this._onResize);
    }
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}
