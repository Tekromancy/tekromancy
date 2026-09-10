/**
 * PlasmaGenerator.js - High-Energy Ionized Gas & Chromatic Plasma Engine
 * Part of @tekromancy/tekromancy visual effects library.
 */

import { PlasmaArc } from './PlasmaArc.js';

export class PlasmaGenerator {
  /**
   * @param {Object} [options]
   * @param {string} [options.canvasId='plasma-fx-canvas']
   * @param {string} [options.theme='magenta'] 'magenta' | 'cyan' | 'violet' | 'solar'
   * @param {number} [options.maxArcs=150]
   * @param {boolean} [options.autoResize=true]
   * @param {boolean} [options.autoInjectStyles=true]
   */
  constructor(options = {}) {
    this.canvasId = options.canvasId || 'plasma-fx-canvas';
    this.theme = options.theme || 'magenta';
    this.maxArcs = options.maxArcs || 150;
    this.autoResize = options.autoResize !== false;
    this.autoInjectStyles = options.autoInjectStyles !== false;

    this.arcs = [];
    this.orbs = [];
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
      canvas.className = 'tekro-fx-canvas tekro-plasma-canvas';
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
    if (document.getElementById('tekro-plasma-injected-styles')) return;

    const style = document.createElement('style');
    style.id = 'tekro-plasma-injected-styles';
    style.textContent = `
      .tekro-plasma-canvas {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 9997;
        mix-blend-mode: screen;
      }
      .plasma-element-containment {
        box-shadow: 0 0 25px rgba(255, 0, 180, 0.7), inset 0 0 16px rgba(180, 50, 255, 0.5) !important;
        border-color: rgba(255, 60, 200, 0.9) !important;
        animation: plasma-pulse 0.5s infinite alternate ease-in-out;
      }
      @keyframes plasma-pulse {
        from { filter: drop-shadow(0 0 10px rgba(255, 0, 180, 0.6)); }
        to { filter: drop-shadow(0 0 22px rgba(160, 40, 255, 0.9)); }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Strike a concentrated spherical Tesla plasma orb at coordinates
   * @param {number} x
   * @param {number} y
   * @param {Object} [options]
   * @param {number} [options.radius=70]
   * @param {number} [options.tendrilCount=12]
   * @param {string} [options.theme]
   * @param {number} [options.intensity=1]
   */
  strikeOrb(x, y, options = {}) {
    const radius = (options.radius || 70) * (options.intensity || 1);
    const tendrilCount = options.tendrilCount || Math.floor(12 * (options.intensity || 1));
    const theme = options.theme || this.theme;

    for (let i = 0; i < tendrilCount; i++) {
      if (this.arcs.length >= this.maxArcs) break;
      const angle = (i / tendrilCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const targetDist = radius * (0.6 + Math.random() * 0.8);
      const tx = x + Math.cos(angle) * targetDist;
      const ty = y + Math.sin(angle) * targetDist;

      this.arcs.push(new PlasmaArc(x, y, tx, ty, {
        theme,
        amplitude: 10 * (options.intensity || 1),
        frequency: 3 + Math.random() * 2,
        decay: 0.025
      }));
    }

    this.orbs.push({
      x, y, radius: radius * 0.35, theme, life: 1.0, decay: 0.03
    });

    this.startLoop();
  }

  /**
   * Spawns a glowing Tesla plasma orb (alias for strikeOrb)
   * @param {number} x
   * @param {number} y
   * @param {number|Object} [radiusOrOptions]
   * @param {Object} [options]
   */
  orb(x, y, radiusOrOptions = {}, options = {}) {
    if (typeof radiusOrOptions === 'number') {
      return this.strikeOrb(x, y, { ...options, radius: radiusOrOptions });
    }
    return this.strikeOrb(x, y, radiusOrOptions);
  }

  /**
   * Encircle a DOM element with a toroidal magnetic plasma containment field
   * @param {HTMLElement|string} elementOrSelector
   * @param {Object} [options]
   * @param {number} [options.duration=1000]
   * @param {number} [options.intensity=1]
   * @param {string} [options.theme]
   */
  encircle(elementOrSelector, options = {}) {
    if (typeof document === 'undefined') return;
    const el = typeof elementOrSelector === 'string'
      ? document.querySelector(elementOrSelector)
      : elementOrSelector;
    if (!el) return;

    const duration = options.duration || 1000;
    const intensity = Math.max(0.1, options.intensity || 1);
    const theme = options.theme || this.theme;

    el.classList.add('plasma-element-containment');

    const interval = 45;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;
      if (elapsed >= duration || !el.isConnected) {
        clearInterval(timer);
        el.classList.remove('plasma-element-containment');
        return;
      }

      const rect = el.getBoundingClientRect();
      const corners = [
        { x: rect.left, y: rect.top },
        { x: rect.right, y: rect.top },
        { x: rect.right, y: rect.bottom },
        { x: rect.left, y: rect.bottom }
      ];

      for (let i = 0; i < 4; i++) {
        if (this.arcs.length >= this.maxArcs) break;
        const c1 = corners[i];
        const c2 = corners[(i + 1) % 4];
        this.arcs.push(new PlasmaArc(c1.x, c1.y, c2.x, c2.y, {
          theme,
          amplitude: 8 * intensity,
          frequency: 2 + Math.random() * 2,
          decay: 0.06
        }));
      }

      this.startLoop();
    }, interval);
  }

  /**
   * Start an electromagnetic plasma tempest across the viewport (1-100 scale)
   * @param {number} [duration=2000]
   * @param {number} [amount=50] Scale 1-100
   * @param {string} [theme]
   */
  startTempest(duration = 2000, amount = 50, theme = null) {
    const level = Math.max(1, Math.min(100, amount)) / 100;
    const selectedTheme = theme || this.theme;
    const interval = 70;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;
      if (elapsed >= duration) {
        clearInterval(timer);
        return;
      }

      const orbCount = Math.floor(1 + level * 2);
      for (let i = 0; i < orbCount; i++) {
        const x = Math.random() * this.width;
        const y = Math.random() * this.height;
        this.strikeOrb(x, y, {
          theme: selectedTheme,
          intensity: 0.7 + level * 0.8,
          tendrilCount: Math.floor(8 + level * 10)
        });
      }
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

      // Render glowing plasma orb cores
      for (let i = this.orbs.length - 1; i >= 0; i--) {
        const orb = this.orbs[i];
        orb.life -= orb.decay;
        if (orb.life > 0) {
          const rad = this.ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
          rad.addColorStop(0, `rgba(255, 255, 255, ${orb.life})`);
          rad.addColorStop(0.5, `rgba(255, 0, 180, ${orb.life * 0.7})`);
          rad.addColorStop(1, 'rgba(0,0,0,0)');
          this.ctx.fillStyle = rad;
          this.ctx.beginPath();
          this.ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
          this.ctx.fill();
        } else {
          this.orbs.splice(i, 1);
        }
      }

      // Render plasma arcs
      for (let i = this.arcs.length - 1; i >= 0; i--) {
        const arc = this.arcs[i];
        if (arc.update()) {
          arc.render(this.ctx);
        } else {
          this.arcs.splice(i, 1);
        }
      }
    }

    if (this.arcs.length > 0 || this.orbs.length > 0) {
      this.rafId = requestAnimationFrame(() => this.animate());
    } else {
      this.isRunning = false;
      this.rafId = null;
      if (this.ctx) this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }

  clear() {
    this.arcs = [];
    this.orbs = [];
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
