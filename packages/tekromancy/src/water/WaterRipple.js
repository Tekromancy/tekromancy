/**
 * WaterRipple.js - Expanding Refractive Wave Ripple & Droplet Spray
 * Part of @tekromancy/tekromancy procedural visual effects engine.
 */

export class WaterRipple {
  /**
   * @param {number} x Origin X
   * @param {number} y Origin Y
   * @param {Object} [options]
   */
  constructor(x, y, options = {}) {
    this.x = x;
    this.y = y;
    this.theme = options.theme || 'cyan'; // 'cyan' | 'deep' | 'emerald' | 'mercury'
    this.radius = options.initialRadius || 2;
    this.maxRadius = (options.maxRadius || 60) * (options.scale || 1);
    this.speed = (options.speed || 1.8) * (options.speedScale || 1);
    this.life = 1.0;
    this.decay = options.decay || 0.018;
    this.ringCount = options.ringCount || 3;
  }

  update() {
    this.radius += this.speed;
    this.life -= this.decay;
    return this.life > 0 && this.radius < this.maxRadius;
  }

  render(ctx) {
    if (this.life <= 0) return;

    ctx.save();
    const colors = this._getThemeColors(this.life);

    for (let r = 0; r < this.ringCount; r++) {
      const ringOffset = r * (this.radius * 0.25);
      const curR = this.radius - ringOffset;
      if (curR <= 0) continue;

      const ringAlpha = this.life * (1 - r / this.ringCount);

      // Distorted elliptical wave for perspective realism
      ctx.beginPath();
      ctx.ellipse(this.x, this.y, curR, curR * 0.45, 0, 0, Math.PI * 2);
      ctx.strokeStyle = colors.crest.replace('$A', ringAlpha * 0.8);
      ctx.lineWidth = Math.max(0.75, 2.5 * ringAlpha);
      ctx.shadowBlur = 6;
      ctx.shadowColor = colors.glow.replace('$A', ringAlpha * 0.6);
      ctx.stroke();

      // Outer refraction wave
      ctx.beginPath();
      ctx.ellipse(this.x, this.y, curR + 2, (curR + 2) * 0.45, 0, 0, Math.PI * 2);
      ctx.strokeStyle = colors.trough.replace('$A', ringAlpha * 0.3);
      ctx.lineWidth = 1;
      ctx.shadowBlur = 0;
      ctx.stroke();
    }

    ctx.restore();
  }

  _getThemeColors(alpha) {
    switch (this.theme) {
      case 'deep':
        return {
          crest: 'rgba(70, 160, 255, $A)',
          glow: 'rgba(20, 90, 220, $A)',
          trough: 'rgba(10, 30, 90, $A)'
        };
      case 'emerald':
        return {
          crest: 'rgba(80, 255, 200, $A)',
          glow: 'rgba(20, 200, 140, $A)',
          trough: 'rgba(10, 80, 50, $A)'
        };
      case 'mercury':
        return {
          crest: 'rgba(230, 240, 255, $A)',
          glow: 'rgba(180, 200, 230, $A)',
          trough: 'rgba(100, 110, 130, $A)'
        };
      default: // Cyan / Crystal Water
        return {
          crest: 'rgba(120, 230, 255, $A)',
          glow: 'rgba(0, 200, 255, $A)',
          trough: 'rgba(10, 60, 120, $A)'
        };
    }
  }
}

export class WaterDroplet {
  /**
   * @param {number} x
   * @param {number} y
   * @param {Object} [options]
   */
  constructor(x, y, options = {}) {
    this.x = x;
    this.y = y;
    this.theme = options.theme || 'cyan';

    const angle = (options.angle !== undefined) ? options.angle : (Math.PI * 0.5 + (Math.random() - 0.5) * 0.2);
    const speed = (options.speed || 12) * (options.speedScale || 1);

    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.length = (14 + Math.random() * 18) * (options.scale || 1);
    this.life = 1.0;
    this.decay = 0.02 + Math.random() * 0.02;
    this.targetY = options.targetY || (y + 400);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.y >= this.targetY) {
      return false; // Splash upon hitting target surface
    }
    this.life -= this.decay;
    return this.life > 0;
  }

  render(ctx) {
    if (this.life <= 0) return;

    ctx.save();
    ctx.strokeStyle = `rgba(160, 235, 255, ${this.life * 0.65})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - this.vx * 0.8, this.y - this.vy * 0.8);
    ctx.stroke();
    ctx.restore();
  }
}
