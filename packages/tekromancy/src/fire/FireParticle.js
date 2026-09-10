/**
 * FireParticle.js - Convective Thermal Particle Primitive
 * Part of @tekromancy/tekromancy procedural FX engine.
 */

export class FireParticle {
  /**
   * @param {number} x Initial X coordinate
   * @param {number} y Initial Y coordinate
   * @param {Object} [options]
   */
  constructor(x, y, options = {}) {
    this.x = x;
    this.y = y;
    this.theme = options.theme || 'amber'; // amber, blue, green, purple
    this.isEmber = options.isEmber || (Math.random() < 0.2);

    const speedScale = options.speedScale || 1;
    const spread = options.spread !== undefined ? options.spread : 1.5;

    // Upward convection with lateral turbulence
    this.vx = (Math.random() - 0.5) * spread * 2;
    this.vy = -(1.5 + Math.random() * 3.5) * speedScale;
    this.ax = (Math.random() - 0.5) * 0.1;
    this.ay = -0.05 * speedScale; // Thermal buoyancy

    this.life = 1.0;
    this.decay = 0.015 + Math.random() * 0.035;

    if (this.isEmber) {
      this.size = 1 + Math.random() * 2.5;
      this.decay *= 0.6; // Embers linger longer
      this.vy *= 1.2;
    } else {
      this.size = (6 + Math.random() * 12) * (options.sizeScale || 1);
    }

    this.initialSize = this.size;
    this.rotation = Math.random() * Math.PI * 2;
    this.vRot = (Math.random() - 0.5) * 0.15;
  }

  /**
   * Update particle kinematics and decay life
   * @returns {boolean} True if particle is still alive
   */
  update() {
    this.vx += this.ax + (Math.random() - 0.5) * 0.2;
    this.vy += this.ay;
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.vRot;

    this.life -= this.decay;
    if (!this.isEmber) {
      this.size = Math.max(0.5, this.initialSize * (this.life * 0.8 + 0.2));
    }
    return this.life > 0;
  }

  /**
   * Render particle onto canvas 2D context
   * @param {CanvasRenderingContext2D} ctx
   */
  render(ctx) {
    if (this.life <= 0) return;
    const progress = 1 - this.life; // 0 (birth) -> 1 (death)

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    if (this.isEmber) {
      // Sparkling ember dot with high brightness
      const alpha = Math.min(1, this.life * 1.5);
      ctx.fillStyle = this._getEmberColor(alpha);
      ctx.shadowBlur = 6;
      ctx.shadowColor = ctx.fillStyle;
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Soft radial fire puff
      const rad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
      const colors = this._getThemeColors(progress, this.life);
      rad.addColorStop(0, colors.core);
      rad.addColorStop(0.4, colors.mid);
      rad.addColorStop(0.85, colors.edge);
      rad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = rad;
      ctx.globalAlpha = Math.min(1, this.life * 1.2);
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  _getEmberColor(alpha) {
    switch (this.theme) {
      case 'blue': return `rgba(180, 240, 255, ${alpha})`;
      case 'green': return `rgba(160, 255, 180, ${alpha})`;
      case 'purple': return `rgba(240, 180, 255, ${alpha})`;
      default: return `rgba(255, 220, 140, ${alpha})`;
    }
  }

  _getThemeColors(progress, alpha) {
    switch (this.theme) {
      case 'blue':
        return {
          core: `rgba(240, 255, 255, ${alpha * 0.9})`,
          mid: `rgba(0, 200, 255, ${alpha * 0.7})`,
          edge: `rgba(10, 40, 120, ${alpha * 0.25})`
        };
      case 'green':
        return {
          core: `rgba(240, 255, 220, ${alpha * 0.9})`,
          mid: `rgba(0, 255, 100, ${alpha * 0.7})`,
          edge: `rgba(10, 80, 30, ${alpha * 0.25})`
        };
      case 'purple':
        return {
          core: `rgba(255, 240, 255, ${alpha * 0.9})`,
          mid: `rgba(200, 0, 255, ${alpha * 0.7})`,
          edge: `rgba(60, 10, 100, ${alpha * 0.25})`
        };
      default: // Amber / Classic Fire
        return {
          core: `rgba(255, 255, 220, ${alpha * 0.95})`,
          mid: `rgba(255, 140, 0, ${alpha * 0.75})`,
          edge: `rgba(220, 30, 0, ${alpha * 0.3})`
        };
    }
  }
}
