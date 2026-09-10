/**
 * LightningGenerator.js - High-Voltage Procedural Lightning & Screen Flash Engine
 * 
 * Part of @tekromancy/tekromancy
 * 
 * Provides:
 * 1. Top-layer foreground canvas (#lightning-fx-canvas) at z-index: 99990.
 * 2. Stroboscopic screen flash generator with realistic double-pulse return strokes.
 * 3. Element encircling electrical cages with dynamic fractal perimeter arcs & corner sparks.
 * 4. Multi-bolt atmospheric lightning storm during presentation/scene transitions (1-100 scale).
 * 5. Recursive fractal sky/ground bolts with glowing neon halos and pure white-hot cores.
 */

const DEFAULT_STYLES = `
#lightning-flash-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(0, 240, 255, 0.8) 50%, rgba(10, 16, 35, 0.9) 100%);
  pointer-events: none;
  z-index: 99999;
  opacity: 0;
  transition: opacity 90ms ease-out;
}
#lightning-flash-overlay.flash {
  opacity: 1;
}
#lightning-fx-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 99990;
}
.lightning-encircled {
  position: relative;
  outline: 2px solid rgba(0, 240, 255, 0.8) !important;
  box-shadow: 0 0 25px rgba(0, 240, 255, 0.7), 0 0 50px rgba(176, 38, 255, 0.4), inset 0 0 15px rgba(0, 240, 255, 0.3) !important;
  animation: lightning-crackle-pulse 0.65s ease-out forwards;
}
@keyframes lightning-crackle-pulse {
  0% {
    filter: brightness(1.7) contrast(1.2);
    box-shadow: 0 0 35px rgba(255, 255, 255, 0.9), 0 0 60px rgba(0, 240, 255, 0.9), inset 0 0 25px rgba(0, 240, 255, 0.5);
  }
  20% {
    filter: brightness(1.2) contrast(1.1);
    box-shadow: 0 0 20px rgba(0, 240, 255, 0.6), 0 0 40px rgba(176, 38, 255, 0.3);
  }
  40% {
    filter: brightness(1.5);
    box-shadow: 0 0 30px rgba(255, 255, 255, 0.8), 0 0 55px rgba(0, 240, 255, 0.85);
  }
  100% {
    filter: brightness(1) contrast(1);
    outline-color: transparent;
    box-shadow: none;
  }
}
`;

export class LightningGenerator {
  /**
   * @param {Object} [options={}] - Configuration options
   * @param {string} [options.canvasId='lightning-fx-canvas'] - ID for overlay canvas
   * @param {string} [options.flashOverlayId='lightning-flash-overlay'] - ID for flash overlay DOM element
   * @param {number} [options.zIndex=99990] - Z-index for overlay canvas
   * @param {boolean} [options.autoInjectStyles=true] - Auto-inject default CSS rules if not present
   * @param {boolean} [options.autoCreateOverlay=true] - Auto-create flash overlay element if missing
   * @param {string} [options.primaryColor='#00f0ff'] - Default lightning glow color (cyan)
   * @param {string} [options.secondaryColor='#b026ff'] - Secondary accent color (purple)
   */
  constructor(options = {}) {
    this.options = Object.assign({
      canvasId: 'lightning-fx-canvas',
      flashOverlayId: 'lightning-flash-overlay',
      zIndex: 99990,
      autoInjectStyles: true,
      autoCreateOverlay: true,
      primaryColor: '#00f0ff',
      secondaryColor: '#b026ff'
    }, options);

    this.canvas = null;
    this.ctx = null;
    this.width = typeof window !== 'undefined' ? window.innerWidth : 1920;
    this.height = typeof window !== 'undefined' ? window.innerHeight : 1080;

    this.flashOverlay = null;
    this.activeBolts = [];
    this.activeCages = [];
    this.activeSparks = [];
    this.ambientFlashAlpha = 0;
    this.stormActive = false;
    this.stormTimeouts = [];
    this.animationFrameId = null;
    this.isDestroyed = false;

    if (typeof window !== 'undefined') {
      if (this.options.autoInjectStyles) {
        this.injectStyles();
      }
      this.initOverlay();
      this.initCanvas();
      this.bindEvents();
      this.startRenderLoop();
    }
  }

  injectStyles() {
    if (document.getElementById('tekromancy-lightning-styles')) return;
    const styleEl = document.createElement('style');
    styleEl.id = 'tekromancy-lightning-styles';
    styleEl.textContent = DEFAULT_STYLES;
    document.head.appendChild(styleEl);
  }

  initOverlay() {
    this.flashOverlay = document.getElementById(this.options.flashOverlayId);
    if (!this.flashOverlay && this.options.autoCreateOverlay) {
      this.flashOverlay = document.createElement('div');
      this.flashOverlay.id = this.options.flashOverlayId;
      this.flashOverlay.setAttribute('aria-hidden', 'true');
      document.body.appendChild(this.flashOverlay);
    }
  }

  initCanvas() {
    let existingCanvas = document.getElementById(this.options.canvasId);
    if (existingCanvas) {
      this.canvas = existingCanvas;
    } else {
      this.canvas = document.createElement('canvas');
      this.canvas.id = this.options.canvasId;
      this.canvas.style.position = 'fixed';
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';
      this.canvas.style.width = '100vw';
      this.canvas.style.height = '100vh';
      this.canvas.style.pointerEvents = 'none';
      this.canvas.style.zIndex = String(this.options.zIndex);
      document.body.appendChild(this.canvas);
    }

    this.ctx = this.canvas.getContext('2d');
    this.resize();
  }

  resize() {
    if (!this.canvas) return;
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  bindEvents() {
    this.handleResize = () => this.resize();
    window.addEventListener('resize', this.handleResize);
  }

  /**
   * Stroboscopic Screen Flash with realistic return strokes
   * @param {number} [intensity=1.0] - Flash magnitude (0.1 to 1.5)
   * @param {number} [duration=180] - Total dissipation time in milliseconds
   */
  flash(intensity = 1.0, duration = 180) {
    this.ambientFlashAlpha = Math.min(1.0, 0.85 * intensity);

    if (this.flashOverlay) {
      // Multi-pulse stroboscopic flicker
      this.flashOverlay.style.transition = 'none';
      this.flashOverlay.style.opacity = String(Math.min(1.0, 0.9 * intensity));

      setTimeout(() => {
        if (this.flashOverlay && !this.isDestroyed) {
          this.flashOverlay.style.opacity = String(Math.min(1.0, 0.3 * intensity));
        }
      }, 30);

      setTimeout(() => {
        if (this.flashOverlay && !this.isDestroyed) {
          this.flashOverlay.style.opacity = String(Math.min(1.0, 0.8 * intensity));
        }
      }, 65);

      setTimeout(() => {
        if (this.flashOverlay && !this.isDestroyed) {
          this.flashOverlay.style.transition = `opacity ${duration}ms cubic-bezier(0.1, 0.9, 0.2, 1)`;
          this.flashOverlay.style.opacity = '0';
        }
      }, 110);
    }
  }

  /**
   * Procedural fractal lightning path generator
   */
  generateFractalPath(x1, y1, x2, y2, displace = 80, minSegment = 12) {
    const points = [{ x: x1, y: y1 }];

    const subdivide = (pA, pB, disp, depth = 0) => {
      const dx = pB.x - pA.x;
      const dy = pB.y - pA.y;
      const dist = Math.hypot(dx, dy);

      if (dist < minSegment || depth >= 7) {
        points.push(pB);
        return;
      }

      const midX = (pA.x + pB.x) / 2;
      const midY = (pA.y + pB.y) / 2;

      const nx = -dy / dist;
      const ny = dx / dist;
      const offset = (Math.random() - 0.5) * disp;

      const pMid = {
        x: midX + nx * offset,
        y: midY + ny * offset
      };

      subdivide(pA, pMid, disp * 0.55, depth + 1);
      subdivide(pMid, pB, disp * 0.55, depth + 1);
    };

    subdivide({ x: x1, y: y1 }, { x: x2, y: y2 }, displace, 0);
    return points;
  }

  /**
   * Unified strike method supporting both sky bolts and ground target strikes
   * @param {number} x1
   * @param {number} y1
   * @param {number|Object} [x2]
   * @param {number} [y2]
   * @param {Object} [opts]
   */
  strike(x1, y1, x2, y2, opts = {}) {
    if (x2 === undefined || typeof x2 === 'object') {
      return this.strikeTarget(x1, y1, x2 || {});
    }
    return this.strikeSky(x1, y1, x2, y2, opts);
  }

  /**
   * Strikes a bolt across the sky or towards target coordinates
   * @param {number} x1 - Source X
   * @param {number} y1 - Source Y
   * @param {number} x2 - Target X
   * @param {number} y2 - Target Y
   * @param {Object} [opts={}] - Bolt options
   */
  strikeSky(x1, y1, x2, y2, opts = {}) {
    const {
      intensity = 1.0,
      displace = 90,
      color = this.options.primaryColor,
      branches = 2,
      life = 1.0,
      decay = 0.05
    } = opts;

    const mainPath = this.generateFractalPath(x1, y1, x2, y2, displace);
    const boltBranches = [];

    // Generate secondary branches originating along main trunk
    if (branches > 0 && mainPath.length > 6) {
      const branchCount = Math.min(branches, Math.floor(mainPath.length / 4));
      for (let b = 0; b < branchCount; b++) {
        const splitIdx = Math.floor(mainPath.length * (0.2 + 0.6 * (b / branchCount)));
        const rootPt = mainPath[splitIdx];
        const angle = Math.atan2(y2 - y1, x2 - x1) + (Math.random() - 0.5) * 1.2;
        const branchLen = 60 + Math.random() * 140;
        const bx2 = rootPt.x + Math.cos(angle) * branchLen;
        const by2 = rootPt.y + Math.sin(angle) * branchLen;
        boltBranches.push(this.generateFractalPath(rootPt.x, rootPt.y, bx2, by2, displace * 0.5, 10));
      }
    }

    this.activeBolts.push({
      mainPath,
      branches: boltBranches,
      intensity,
      color,
      life,
      decay: decay + Math.random() * 0.02
    });
  }

  /**
   * Strikes lightning directly at a screen coordinate or DOM element
   * @param {number|Element} targetXOrEl - Target X coordinate or DOM element
   * @param {number} [targetY] - Target Y coordinate (if coordinate passed)
   * @param {Object} [opts={}] - Custom options
   */
  strikeTarget(targetXOrEl, targetY, opts = {}) {
    let tx = targetXOrEl;
    let ty = targetY;
    let options = opts;

    if (typeof targetXOrEl === 'object' && targetXOrEl instanceof Element) {
      const rect = targetXOrEl.getBoundingClientRect();
      tx = rect.left + rect.width / 2;
      ty = rect.top + rect.height / 2;
      options = targetY || {};
    }

    const startX = this.width * (0.2 + Math.random() * 0.6);
    const startY = 0;
    this.strikeSky(startX, startY, tx, ty, {
      intensity: options.intensity || 1.1,
      displace: 70,
      ...options
    });
  }

  /**
   * Encircles a DOM element or bounding rectangle with crackling electrical perimeter arcs
   * @param {Element|DOMRect} target - DOM Element or bounding rect to encircle
   * @param {Object} [options={}] - Custom options
   */
  encircle(target, options = {}) {
    if (!target) return;

    let rect = null;
    let el = null;
    if (typeof Element !== 'undefined' && target instanceof Element) {
      el = target;
      rect = target.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        requestAnimationFrame(() => {
          const retryRect = target.getBoundingClientRect();
          if (retryRect.width > 0 && retryRect.height > 0) {
            this.encircle(target, options);
          }
        });
        return;
      }
    } else {
      rect = target;
    }

    const {
      duration = 650,
      padding = 10,
      intensity = 1.0,
      color = this.options.primaryColor,
      secondaryColor = this.options.secondaryColor
    } = options;

    // Add CSS highlight class to target element
    if (el) {
      el.classList.add('lightning-encircled');
      setTimeout(() => {
        if (!this.isDestroyed) {
          el.classList.remove('lightning-encircled');
        }
      }, duration + 100);
    }

    // Create encircling cage
    const cage = {
      targetEl: el,
      staticRect: !el ? rect : null,
      padding,
      intensity,
      color,
      secondaryColor,
      startTime: performance.now(),
      duration,
      lastJitterTime: 0,
      cachedEdges: []
    };

    this.activeCages.push(cage);

    // Emit initial burst of electric corner sparks
    const bounds = this.getCageBounds(cage);
    this.emitCornerSparks(bounds.x1, bounds.y1);
    this.emitCornerSparks(bounds.x2, bounds.y1);
    this.emitCornerSparks(bounds.x2, bounds.y2);
    this.emitCornerSparks(bounds.x1, bounds.y2);
  }

  getCageBounds(cage) {
    const rect = cage.targetEl ? cage.targetEl.getBoundingClientRect() : cage.staticRect;
    const pad = cage.padding;
    return {
      x1: rect.left - pad,
      y1: rect.top - pad,
      x2: rect.right + pad,
      y2: rect.bottom + pad,
      cx: (rect.left + rect.right) / 2,
      cy: (rect.top + rect.bottom) / 2,
      w: rect.width + pad * 2,
      h: rect.height + pad * 2
    };
  }

  emitCornerSparks(x, y, count = 5) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;
      this.activeSparks.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        decay: 0.04 + Math.random() * 0.05,
        color: Math.random() > 0.3 ? this.options.primaryColor : '#ffffff',
        size: 1.5 + Math.random() * 2
      });
    }
  }

  /**
   * Multi-strike atmospheric lightning storm during transitions
   * @param {number} [durationMs=1200] - Storm duration in ms
   * @param {number} [amount=50] - Lightning amount scale 1 to 100
   */
  startStorm(durationMs = 1200, amount = 50) {
    this.stopStorm();
    this.stormActive = true;

    const clampedAmount = Math.max(1, Math.min(100, Number(amount) || 50));
    const level = clampedAmount / 100; // 0.01 to 1.0

    // Hook background warp storm if available on window
    if (typeof window !== 'undefined' && window.startHyperWarpStorm) {
      window.startHyperWarpStorm(durationMs, level);
    }

    // Initial entry flash scaled by level
    const initialFlashIntensity = 0.2 + level * 0.95;
    this.flash(initialFlashIntensity, 100 + Math.floor(level * 80));

    // Calculate total number of atmospheric strikes across flight duration
    const strikeCount = Math.max(1, Math.round(1 + level * 8));

    for (let i = 0; i < strikeCount; i++) {
      const progress = i / strikeCount;
      const delay = Math.floor(durationMs * (0.04 + progress * 0.88));

      const tid = setTimeout(() => {
        if (!this.stormActive || this.isDestroyed) return;

        const strikeIntensity = 0.4 + level * 0.95;
        const branches = Math.max(1, Math.min(4, Math.round(1 + level * 3)));
        const displace = 35 + level * 65;

        const startX = this.width * (0.08 + Math.random() * 0.84);
        const endX = startX + (Math.random() - 0.5) * (this.width * (0.25 + level * 0.45));
        const endY = this.height * (0.4 + Math.random() * 0.5);

        this.flash(strikeIntensity * 0.5, 90 + Math.floor(level * 60));
        this.strikeSky(startX, 0, endX, endY, {
          intensity: strikeIntensity,
          displace,
          branches,
          decay: 0.045 - level * 0.015
        });
      }, delay);

      this.stormTimeouts.push(tid);
    }

    const endTid = setTimeout(() => {
      this.stopStorm();
    }, durationMs);
    this.stormTimeouts.push(endTid);
  }

  stopStorm() {
    this.stormActive = false;
    this.stormTimeouts.forEach(clearTimeout);
    this.stormTimeouts = [];
  }

  startRenderLoop() {
    const render = () => {
      if (this.isDestroyed) return;
      this.renderFrame();
      this.animationFrameId = requestAnimationFrame(render);
    };
    this.animationFrameId = requestAnimationFrame(render);
  }

  renderFrame() {
    if (!this.ctx) return;
    const now = performance.now();
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Render Ambient Radial Lightning Wash
    if (this.ambientFlashAlpha > 0.01) {
      const grad = this.ctx.createRadialGradient(
        this.width * 0.5, this.height * 0.35, 10,
        this.width * 0.5, this.height * 0.5, Math.max(this.width, this.height) * 0.85
      );
      grad.addColorStop(0, `rgba(255, 255, 255, ${this.ambientFlashAlpha * 0.65})`);
      grad.addColorStop(0.35, `rgba(0, 240, 255, ${this.ambientFlashAlpha * 0.45})`);
      grad.addColorStop(0.75, `rgba(176, 38, 255, ${this.ambientFlashAlpha * 0.2})`);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      this.ctx.fillStyle = grad;
      this.ctx.fillRect(0, 0, this.width, this.height);

      this.ambientFlashAlpha *= 0.88;
    }

    // 2. Render Active Sky & Ground Lightning Bolts
    for (let i = this.activeBolts.length - 1; i >= 0; i--) {
      const bolt = this.activeBolts[i];
      bolt.life -= bolt.decay;
      if (bolt.life <= 0) {
        this.activeBolts.splice(i, 1);
        continue;
      }

      const alpha = bolt.life * bolt.intensity;
      this.drawLightningPath(bolt.mainPath, alpha, bolt.color, 3.5);
      for (const branch of bolt.branches) {
        this.drawLightningPath(branch, alpha * 0.7, bolt.color, 2.2);
      }
    }

    // 3. Render Active Encircling Cages around elements
    for (let i = this.activeCages.length - 1; i >= 0; i--) {
      const cage = this.activeCages[i];
      const elapsed = now - cage.startTime;
      if (elapsed >= cage.duration) {
        this.activeCages.splice(i, 1);
        continue;
      }

      const progress = elapsed / cage.duration;
      const fadeAlpha = Math.sin((1 - progress) * Math.PI * 0.5);
      const bounds = this.getCageBounds(cage);

      // Re-jitter jagged fractal edges at 30-45 FPS for high-energy crackle
      if (now - cage.lastJitterTime > 25) {
        cage.lastJitterTime = now;
        cage.cachedEdges = this.buildCageEdges(bounds);

        if (Math.random() < 0.6) {
          const side = Math.floor(Math.random() * 4);
          let sx = bounds.x1, sy = bounds.y1;
          if (side === 0) { sx += Math.random() * bounds.w; }
          else if (side === 1) { sx = bounds.x2; sy += Math.random() * bounds.h; }
          else if (side === 2) { sx += Math.random() * bounds.w; sy = bounds.y2; }
          else { sy += Math.random() * bounds.h; }
          this.emitCornerSparks(sx, sy, 2);
        }
      }

      for (const edgePath of cage.cachedEdges) {
        this.drawLightningPath(edgePath, fadeAlpha * cage.intensity, cage.color, 3.0, cage.secondaryColor);
      }

      this.drawCornerNode(bounds.x1, bounds.y1, fadeAlpha);
      this.drawCornerNode(bounds.x2, bounds.y1, fadeAlpha);
      this.drawCornerNode(bounds.x2, bounds.y2, fadeAlpha);
      this.drawCornerNode(bounds.x1, bounds.y2, fadeAlpha);
    }

    // 4. Render Active Sparks & Particles
    for (let i = this.activeSparks.length - 1; i >= 0; i--) {
      const sp = this.activeSparks[i];
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.life -= sp.decay;
      if (sp.life <= 0) {
        this.activeSparks.splice(i, 1);
        continue;
      }

      this.ctx.beginPath();
      this.ctx.arc(sp.x, sp.y, sp.size * sp.life, 0, Math.PI * 2);
      this.ctx.fillStyle = sp.color;
      this.ctx.globalAlpha = sp.life;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = sp.color;
      this.ctx.fill();
      this.ctx.globalAlpha = 1.0;
      this.ctx.shadowBlur = 0;
    }
  }

  buildCageEdges(b) {
    const disp = 16;
    const minSeg = 8;
    const topEdge = this.generateFractalPath(b.x1, b.y1, b.x2, b.y1, disp, minSeg);
    const rightEdge = this.generateFractalPath(b.x2, b.y1, b.x2, b.y2, disp, minSeg);
    const bottomEdge = this.generateFractalPath(b.x2, b.y2, b.x1, b.y2, disp, minSeg);
    const leftEdge = this.generateFractalPath(b.x1, b.y2, b.x1, b.y1, disp, minSeg);
    return [topEdge, rightEdge, bottomEdge, leftEdge];
  }

  drawCornerNode(x, y, alpha) {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(x, y, 4, 0, Math.PI * 2);
    this.ctx.fillStyle = '#ffffff';
    this.ctx.shadowColor = this.options.primaryColor;
    this.ctx.shadowBlur = 14;
    this.ctx.globalAlpha = alpha;
    this.ctx.fill();
    this.ctx.restore();
  }

  drawLightningPath(points, alpha, mainColor = this.options.primaryColor, lineWidth = 3.0, glowColor = this.options.primaryColor) {
    if (!points || points.length < 2 || alpha <= 0.01) return;

    this.ctx.save();
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'bevel';

    // Pass 1: Outer Neon Atmospheric Halo
    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    for (let p = 1; p < points.length; p++) {
      this.ctx.lineTo(points[p].x, points[p].y);
    }
    this.ctx.strokeStyle = mainColor;
    this.ctx.lineWidth = lineWidth * 2.2;
    this.ctx.shadowColor = glowColor;
    this.ctx.shadowBlur = 18;
    this.ctx.globalAlpha = alpha * 0.45;
    this.ctx.stroke();

    // Pass 2: Middle Electric Core
    this.ctx.strokeStyle = mainColor;
    this.ctx.lineWidth = lineWidth;
    this.ctx.shadowBlur = 8;
    this.ctx.globalAlpha = alpha * 0.85;
    this.ctx.stroke();

    // Pass 3: White-Hot Center Core
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = Math.max(1.0, lineWidth * 0.4);
    this.ctx.shadowBlur = 4;
    this.ctx.shadowColor = '#ffffff';
    this.ctx.globalAlpha = alpha;
    this.ctx.stroke();

    this.ctx.restore();
  }

  /**
   * Clear all active bolts, cages, and canvas pixels
   */
  clear() {
    this.activeBolts = [];
    this.activeCages = [];
    this.activeSparks = [];
    this.ambientFlashAlpha = 0;
    this.stopStorm();
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }

  /**
   * Destroys canvas overlays and cleans up animation loops & listeners
   */
  destroy() {
    this.isDestroyed = true;
    this.stopStorm();
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (typeof window !== 'undefined' && this.handleResize) {
      window.removeEventListener('resize', this.handleResize);
    }
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}
