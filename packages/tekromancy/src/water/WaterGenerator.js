/**
 * WaterGenerator.js - Fluid Water Ripples, Splash & Rain Storm Engine
 * Part of @tekromancy/tekromancy visual effects library.
 */

import { WaterRipple, WaterDroplet } from './WaterRipple.js';

export class WaterGenerator {
  /**
   * @param {Object} [options]
   * @param {string} [options.canvasId='water-fx-canvas']
   * @param {string} [options.theme='cyan'] 'cyan' | 'deep' | 'emerald' | 'mercury'
   * @param {number} [options.maxRipples=80]
   * @param {boolean} [options.autoResize=true]
   * @param {boolean} [options.autoInjectStyles=true]
   */
  constructor(options = {}) {
    this.canvasId = options.canvasId || 'water-fx-canvas';
    this.theme = options.theme || 'cyan';
    this.maxRipples = options.maxRipples || 80;
    this.maxDroplets = options.maxDroplets || 200;
    this.autoResize = options.autoResize !== false;
    this.autoInjectStyles = options.autoInjectStyles !== false;

    this.ripples = [];
    this.droplets = [];
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
      canvas.className = 'tekro-fx-canvas tekro-water-canvas';
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
    if (document.getElementById('tekro-water-injected-styles')) return;

    const style = document.createElement('style');
    style.id = 'tekro-water-injected-styles';
    style.textContent = `
      .tekro-water-canvas {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 9998;
        mix-blend-mode: screen;
      }
      .water-element-ripple {
        box-shadow: 0 0 24px rgba(0, 200, 255, 0.6), inset 0 0 14px rgba(100, 230, 255, 0.4) !important;
        border-color: rgba(0, 220, 255, 0.8) !important;
        animation: water-sheen 1s infinite alternate ease-in-out;
      }
      @keyframes water-sheen {
        from { filter: drop-shadow(0 0 6px rgba(0, 180, 255, 0.5)); }
        to { filter: drop-shadow(0 0 16px rgba(120, 240, 255, 0.85)); }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Spawns a hydrodynamic splash and concentric ripple at coordinates
   * @param {number} x
   * @param {number} y
   * @param {Object} [options]
   * @param {number} [options.scale=1]
   * @param {string} [options.theme]
   * @param {number} [options.dropletCount=8]
   */
  splash(x, y, options = {}) {
    const theme = options.theme || this.theme;
    const scale = options.scale || 1;

    if (this.ripples.length < this.maxRipples) {
      this.ripples.push(new WaterRipple(x, y, {
        theme,
        scale,
        maxRadius: 55 * scale,
        speed: 2.2 * scale
      }));
    }

    const dropletCount = options.dropletCount !== undefined ? options.dropletCount : 8;
    for (let i = 0; i < dropletCount; i++) {
      if (this.droplets.length >= this.maxDroplets) break;
      const angle = -Math.PI * 0.5 + (Math.random() - 0.5) * Math.PI * 0.8;
      this.droplets.push(new WaterDroplet(x, y, {
        theme,
        angle,
        speed: 4 + Math.random() * 8,
        targetY: y + (Math.random() * 40 + 10)
      }));
    }

    this.startLoop();
  }

  /**
   * Encircle a DOM element with dynamic cascading water ripples
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

    el.classList.add('water-element-ripple');

    const interval = 80;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;
      if (elapsed >= duration || !el.isConnected) {
        clearInterval(timer);
        el.classList.remove('water-element-ripple');
        return;
      }

      const rect = el.getBoundingClientRect();
      // Drop ripples at perimeter locations
      const rx = rect.left + Math.random() * rect.width;
      const ry = rect.top + Math.random() * rect.height;
      this.splash(rx, ry, {
        theme,
        scale: 0.7 * intensity,
        dropletCount: 4
      });
    }, interval);
  }

  /**
   * Start a rainfall and surface puddle ripple storm (1-100 scale)
   * @param {number} [duration=2500]
   * @param {number} [amount=50] Scale 1-100
   * @param {string} [theme]
   */
  startRain(duration = 2500, amount = 50, theme = null) {
    const level = Math.max(1, Math.min(100, amount)) / 100;
    const selectedTheme = theme || this.theme;
    const interval = 40;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;
      if (elapsed >= duration) {
        clearInterval(timer);
        return;
      }

      const drops = Math.floor(3 + level * 10);
      for (let i = 0; i < drops; i++) {
        const startX = Math.random() * this.width;
        const targetY = Math.random() * this.height;
        this.droplets.push(new WaterDroplet(startX, -20, {
          theme: selectedTheme,
          targetY,
          speed: 15 + level * 10,
          scale: 0.8 + level * 0.4
        }));

        // Trigger surface ripple when rain hits
        if (Math.random() < 0.45) {
          this.splash(startX, targetY, {
            theme: selectedTheme,
            scale: 0.6 + level * 0.6,
            dropletCount: 0
          });
        }
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

      // Render droplets
      for (let i = this.droplets.length - 1; i >= 0; i--) {
        const d = this.droplets[i];
        if (d.update()) {
          d.render(this.ctx);
        } else {
          this.droplets.splice(i, 1);
        }
      }

      // Render ripples
      for (let i = this.ripples.length - 1; i >= 0; i--) {
        const r = this.ripples[i];
        if (r.update()) {
          r.render(this.ctx);
        } else {
          this.ripples.splice(i, 1);
        }
      }
    }

    if (this.ripples.length > 0 || this.droplets.length > 0) {
      this.rafId = requestAnimationFrame(() => this.animate());
    } else {
      this.isRunning = false;
      this.rafId = null;
      if (this.ctx) this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }

  clear() {
    this.ripples = [];
    this.droplets = [];
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
