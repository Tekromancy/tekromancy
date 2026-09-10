/**
 * SmokeGenerator.js - Volumetric Smoke, Haze & Fog FX Engine
 * Part of @tekromancy/tekromancy visual effects library.
 */

import { SmokeParticle } from './SmokeParticle.js';

export class SmokeGenerator {
  /**
   * @param {Object} [options]
   * @param {string} [options.canvasId='smoke-fx-canvas']
   * @param {string} [options.theme='gray'] 'gray' | 'dark' | 'toxic' | 'cyan' | 'purple'
   * @param {number} [options.maxParticles=400]
   * @param {boolean} [options.autoResize=true]
   * @param {boolean} [options.autoInjectStyles=true]
   */
  constructor(options = {}) {
    this.canvasId = options.canvasId || 'smoke-fx-canvas';
    this.theme = options.theme || 'gray';
    this.maxParticles = options.maxParticles || 400;
    this.autoResize = options.autoResize !== false;
    this.autoInjectStyles = options.autoInjectStyles !== false;

    this.particles = [];
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
      canvas.className = 'tekro-fx-canvas tekro-smoke-canvas';
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
    if (document.getElementById('tekro-smoke-injected-styles')) return;

    const style = document.createElement('style');
    style.id = 'tekro-smoke-injected-styles';
    style.textContent = `
      .tekro-smoke-canvas {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 9995;
        mix-blend-mode: normal;
      }
      .smoke-element-shroud {
        box-shadow: 0 0 30px rgba(120, 130, 150, 0.5) !important;
        transition: box-shadow 0.4s ease-out;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Spawns an explosive burst or poof of smoke from a coordinate
   * @param {number} x
   * @param {number} y
   * @param {Object} [options]
   * @param {number} [options.count=25]
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
    const count = opts.count || Math.floor(25 * (opts.intensity || 1));
    const theme = opts.theme || this.theme;

    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) break;
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 20;
      this.particles.push(new SmokeParticle(
        x + Math.cos(angle) * dist,
        y + Math.sin(angle) * dist,
        {
          theme,
          spread: 2.2 * (options.intensity || 1),
          speedScale: 1.1 * (options.intensity || 1),
          sizeScale: 1.0 * (options.intensity || 1),
          density: 0.45 * (options.intensity || 1)
        }
      ));
    }
    this.startLoop();
  }

  /**
   * Spawns a smoke poof (alias for burst)
   * @param {number} x
   * @param {number} y
   * @param {number|Object} [countOrOptions]
   * @param {Object} [options]
   */
  poof(x, y, countOrOptions = {}, options = {}) {
    return this.burst(x, y, countOrOptions, options);
  }

  /**
   * Engulf a DOM element in swirling smoke
   * @param {HTMLElement|string} elementOrSelector
   * @param {Object} [options]
   * @param {number} [options.duration=1500]
   * @param {number} [options.intensity=1]
   * @param {string} [options.theme]
   */
  engulf(elementOrSelector, options = {}) {
    if (typeof document === 'undefined') return;
    const el = typeof elementOrSelector === 'string'
      ? document.querySelector(elementOrSelector)
      : elementOrSelector;
    if (!el) return;

    const duration = options.duration || 1500;
    const intensity = Math.max(0.1, options.intensity || 1);
    const theme = options.theme || this.theme;

    el.classList.add('smoke-element-shroud');

    const interval = 50;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;
      if (elapsed >= duration || !el.isConnected) {
        clearInterval(timer);
        el.classList.remove('smoke-element-shroud');
        return;
      }

      const rect = el.getBoundingClientRect();
      const count = Math.floor(4 * intensity);

      for (let i = 0; i < count; i++) {
        if (this.particles.length >= this.maxParticles) break;
        const px = rect.left + Math.random() * rect.width;
        const py = rect.bottom - Math.random() * 10;
        this.particles.push(new SmokeParticle(px, py, {
          theme,
          spread: 0.8,
          speedScale: 0.7 * intensity,
          sizeScale: 1.1 * intensity,
          density: 0.35 * intensity
        }));
      }
      this.startLoop();
    }, interval);
  }

  /**
   * Start an atmospheric haze/fog storm across the viewport (1-100 scale)
   * @param {number} [duration=2500]
   * @param {number} [amount=50]
   * @param {string} [theme]
   */
  startHaze(duration = 2500, amount = 50, theme = null) {
    const level = Math.max(1, Math.min(100, amount)) / 100;
    const selectedTheme = theme || this.theme;
    const interval = 45;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;
      if (elapsed >= duration) {
        clearInterval(timer);
        return;
      }

      const spawnCount = Math.floor(2 + level * 6);
      for (let i = 0; i < spawnCount; i++) {
        if (this.particles.length >= this.maxParticles) break;
        const x = Math.random() * this.width;
        const y = this.height * 0.4 + Math.random() * (this.height * 0.6);
        this.particles.push(new SmokeParticle(x, y, {
          theme: selectedTheme,
          spread: 1.5 + level,
          speedScale: 0.5 + level * 0.5,
          sizeScale: 1.5 + level * 1.5,
          growthScale: 1.2,
          density: 0.2 + level * 0.25
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
