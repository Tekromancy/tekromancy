/**
 * SmokeParticle.js - Volumetric Gas & Haze Puff Primitive
 * Part of @tekromancy/tekromancy procedural visual effects engine.
 */

export class SmokeParticle {
  /**
   * @param {number} x Initial X
   * @param {number} y Initial Y
   * @param {Object} [options]
   */
  constructor(x, y, options = {}) {
    this.x = x;
    this.y = y;
    this.theme = options.theme || 'gray'; // 'gray' | 'dark' | 'toxic' | 'cyan' | 'purple'

    const speedScale = options.speedScale || 1;
    const spread = options.spread !== undefined ? options.spread : 1.2;

    this.vx = (Math.random() - 0.5) * spread * 2;
    this.vy = -(0.5 + Math.random() * 1.5) * speedScale;
    this.drag = 0.985;

    this.size = (15 + Math.random() * 25) * (options.sizeScale || 1);
    this.growth = (0.3 + Math.random() * 0.7) * (options.growthScale || 1);
    this.maxSize = this.size * 3.5;

    this.life = 1.0;
    this.decay = 0.008 + Math.random() * 0.015;

    this.rotation = Math.random() * Math.PI * 2;
    this.vRot = (Math.random() - 0.5) * 0.04;
    this.baseAlpha = (options.density || 0.4) * (0.6 + Math.random() * 0.4);
  }

  update() {
    this.vx *= this.drag;
    this.vy *= this.drag;
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.vRot;

    if (this.size < this.maxSize) {
      this.size += this.growth;
    }

    this.life -= this.decay;
    return this.life > 0;
  }

  render(ctx) {
    if (this.life <= 0) return;

    // Smooth bell-curve alpha: fade in rapidly, linger, fade out slowly
    const currentAlpha = Math.sin(this.life * Math.PI) * this.baseAlpha;
    if (currentAlpha <= 0.001) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    const rad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
    const col = this._getThemeColor(currentAlpha);
    rad.addColorStop(0, col.core);
    rad.addColorStop(0.5, col.mid);
    rad.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = rad;
    ctx.beginPath();
    ctx.arc(0, 0, this.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  _getThemeColor(alpha) {
    switch (this.theme) {
      case 'dark':
        return {
          core: `rgba(20, 20, 25, ${alpha * 0.9})`,
          mid: `rgba(40, 42, 50, ${alpha * 0.4})`
        };
      case 'toxic':
        return {
          core: `rgba(60, 180, 70, ${alpha * 0.85})`,
          mid: `rgba(30, 90, 40, ${alpha * 0.35})`
        };
      case 'cyan':
        return {
          core: `rgba(80, 210, 235, ${alpha * 0.85})`,
          mid: `rgba(20, 100, 140, ${alpha * 0.35})`
        };
      case 'purple':
        return {
          core: `rgba(160, 80, 230, ${alpha * 0.85})`,
          mid: `rgba(70, 20, 120, ${alpha * 0.35})`
        };
      default: // Gray / Atmospheric Fog
        return {
          core: `rgba(180, 190, 205, ${alpha * 0.8})`,
          mid: `rgba(120, 130, 145, ${alpha * 0.3})`
        };
    }
  }
}
