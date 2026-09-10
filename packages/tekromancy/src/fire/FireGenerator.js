/**
 * FireGenerator.js - High-Performance Procedural Flame & Ember FX Engine
 * Part of @tekromancy/tekromancy procedural visual effects library.
 */

import { FireParticle } from './FireParticle.js';

export class FireGenerator {
  /**
   * @param {Object} [options]
   * @param {string} [options.canvasId='fire-fx-canvas']
   * @param {string} [options.theme='amber'] 'amber' | 'blue' | 'green' | 'purple'
   * @param {number} [options.maxParticles=500]
   * @param {boolean} [options.autoResize=true]
   * @param {boolean} [options.autoInjectStyles=true]
   */
  constructor(options = {}) {
    this.canvasId = options.canvasId || 'fire-fx-canvas';
    this.theme = options.theme || 'amber';
    this.maxParticles = options.maxParticles || 600;
    this.autoResize = options.autoResize !== false;
    this.autoInjectStyles = options.autoInjectStyles !== false;

    this.particles = [];
    this.emitters = [];
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
      canvas.className = 'tekro-fx-canvas tekro-fire-canvas';
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
    if (document.getElementById('tekro-fire-injected-styles')) return;

    const style = document.createElement('style');
    style.id = 'tekro-fire-injected-styles';
    style.textContent = `
      .tekro-fire-canvas {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 9996;
        mix-blend-mode: screen;
      }
      .fire-element-glow {
        box-shadow: 0 0 20px rgba(255, 100, 0, 0.6), inset 0 0 14px rgba(255, 160, 0, 0.4) !important;
        transition: box-shadow 0.3s ease-out;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Spawns an explosive burst of fire and embers from a specific coordinate
   * @param {number} x
   * @param {number} y
   * @param {Object} [options]
   * @param {number} [options.count=40]
   * @param {string} [options.theme]
   * @param {number} [options.intensity=1]
   */
  burst(x, y, countOrOptions = {}, options = {}) {
    let opts = {};
    if (typeof countOrOptions === 'number') {
      opts = { ...options, count: countOrOptions };
    } else {
      opts = countOrOptions || {};
    }
    const count = opts.count || Math.floor(35 * (opts.intensity || 1));
    const theme = opts.theme || this.theme;

    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) break;
      const p = new FireParticle(x + (Math.random() - 0.5) * 20, y + (Math.random() - 0.5) * 20, {
        theme,
        spread: 3.5 * (options.intensity || 1),
        speedScale: 1.2 * (options.intensity || 1),
        sizeScale: 1.1 * (options.intensity || 1),
        isEmber: Math.random() < 0.35
      });
      this.particles.push(p);
    }
    this.startLoop();
  }

  /**
   * Encircle a DOM element with licking flames and embers around its perimeter
   * @param {HTMLElement|string} elementOrSelector
   * @param {Object} [options]
   * @param {number} [options.duration=1200]
   * @param {number} [options.intensity=1]
   * @param {string} [options.theme]
   */
  encircle(elementOrSelector, options = {}) {
    if (typeof document === 'undefined') return;
    const el = typeof elementOrSelector === 'string'
      ? document.querySelector(elementOrSelector)
      : elementOrSelector;
    if (!el) return;

    const duration = options.duration || 1200;
    const intensity = Math.max(0.1, options.intensity || 1);
    const theme = options.theme || this.theme;

    el.classList.add('fire-element-glow');

    const interval = 40;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;
      if (elapsed >= duration || !el.isConnected) {
        clearInterval(timer);
        el.classList.remove('fire-element-glow');
        return;
      }

      const rect = el.getBoundingClientRect();
      const perimeterPoints = Math.floor(8 * intensity);

      for (let i = 0; i < perimeterPoints; i++) {
        if (this.particles.length >= this.maxParticles) break;
        // Pick random edge point
        let px = rect.left, py = rect.top;
        const edge = Math.floor(Math.random() * 4);
        if (edge === 0) { // Top
          px = rect.left + Math.random() * rect.width;
          py = rect.top;
        } else if (edge === 1) { // Right
          px = rect.right;
          py = rect.top + Math.random() * rect.height;
        } else if (edge === 2) { // Bottom
          px = rect.left + Math.random() * rect.width;
          py = rect.bottom;
        } else { // Left
          px = rect.left;
          py = rect.top + Math.random() * rect.height;
        }

        this.particles.push(new FireParticle(px, py, {
          theme,
          spread: 1.2,
          speedScale: 0.8 * intensity,
          sizeScale: 0.9 * intensity,
          isEmber: Math.random() < 0.25
        }));
      }
      this.startLoop();
    }, interval);
  }

  /**
   * Launch a screen-wide inferno storm (1-100 scale)
   * @param {number} [duration=2000]
   * @param {number} [amount=50] Scale 1-100
   * @param {string} [theme]
   */
  startInferno(duration = 2000, amount = 50, theme = null) {
    const level = Math.max(1, Math.min(100, amount)) / 100;
    const selectedTheme = theme || this.theme;
    const interval = 35;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;
      if (elapsed >= duration) {
        clearInterval(timer);
        return;
      }

      const spawnCount = Math.floor((3 + level * 10));
      for (let i = 0; i < spawnCount; i++) {
        if (this.particles.length >= this.maxParticles) break;
        // Spawn along the bottom or lower portion of the screen
        const x = Math.random() * this.width;
        const y = this.height - Math.random() * (this.height * 0.25);
        this.particles.push(new FireParticle(x, y, {
          theme: selectedTheme,
          spread: 2 + level * 2,
          speedScale: 1 + level * 1.5,
          sizeScale: 0.8 + level * 1.2,
          isEmber: Math.random() < (0.2 + level * 0.3)
        }));
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

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        if (p.update()) {
          p.render(this.ctx);
        } else {
          this.particles.splice(i, 1);
        }
      }
    }

    if (this.particles.length > 0) {
      this.rafId = requestAnimationFrame(() => this.animate());
    } else {
      this.isRunning = false;
      this.rafId = null;
      if (this.ctx) this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }

  clear() {
    this.particles = [];
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
