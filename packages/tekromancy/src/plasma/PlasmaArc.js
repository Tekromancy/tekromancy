/**
 * PlasmaArc.js - Non-Linear Oscillatory High-Energy Plasma Tendril
 * Part of @tekromancy/tekromancy procedural visual effects engine.
 */

export class PlasmaArc {
  /**
   * @param {number} x1 Start X
   * @param {number} y1 Start Y
   * @param {number} x2 End X
   * @param {number} y2 End Y
   * @param {Object} [options]
   */
  constructor(x1, y1, x2, y2, options = {}) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.theme = options.theme || 'magenta'; // 'magenta' | 'cyan' | 'violet' | 'solar'

    this.frequency = options.frequency || (2 + Math.random() * 4);
    this.amplitude = options.amplitude || (8 + Math.random() * 16);
    this.phase = Math.random() * Math.PI * 2;
    this.phaseSpeed = (Math.random() - 0.5) * 0.4;

    this.life = 1.0;
    this.decay = options.decay || (0.02 + Math.random() * 0.04);
    this.segments = options.segments || 24;
    this.points = [];
    this._generatePoints();
  }

  _generatePoints() {
    this.points = [];
    const dx = this.x2 - this.x1;
    const dy = this.y2 - this.y1;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const nx = -dy / (dist || 1);
    const ny = dx / (dist || 1);

    for (let i = 0; i <= this.segments; i++) {
      const t = i / this.segments;
      const basePx = this.x1 + dx * t;
      const basePy = this.y1 + dy * t;

      // Bell envelope so ends are anchored at (x1, y1) and (x2, y2)
      const envelope = Math.sin(t * Math.PI);
      const wave = Math.sin(t * this.frequency * Math.PI * 2 + this.phase) * this.amplitude * envelope;
      const noise = (Math.random() - 0.5) * (this.amplitude * 0.4) * envelope;

      this.points.push({
        x: basePx + nx * (wave + noise),
        y: basePy + ny * (wave + noise)
      });
    }
  }

  update() {
    this.phase += this.phaseSpeed;
    this._generatePoints();
    this.life -= this.decay;
    return this.life > 0;
  }

  render(ctx) {
    if (this.life <= 0 || this.points.length < 2) return;

    ctx.save();
    const colors = this._getThemeColors(this.life);

    // Pass 1: Wide diffuse chromatic aura
    ctx.strokeStyle = colors.aura;
    ctx.lineWidth = 10 * this.life;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowBlur = 18;
    ctx.shadowColor = colors.glow;
    this._strokePoints(ctx);

    // Pass 2: Intense vibrant mid-beam
    ctx.strokeStyle = colors.mid;
    ctx.lineWidth = 4 * this.life;
    ctx.shadowBlur = 8;
    this._strokePoints(ctx);

    // Pass 3: Blinding incandescent core
    ctx.strokeStyle = `rgba(255, 255, 255, ${this.life * 0.95})`;
    ctx.lineWidth = Math.max(1, 1.5 * this.life);
    ctx.shadowBlur = 0;
    this._strokePoints(ctx);

    ctx.restore();
  }

  _strokePoints(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    ctx.stroke();
  }

  _getThemeColors(alpha) {
    switch (this.theme) {
      case 'cyan':
        return {
          aura: `rgba(0, 180, 255, ${alpha * 0.3})`,
          glow: `rgba(0, 240, 255, ${alpha})`,
          mid: `rgba(120, 240, 255, ${alpha * 0.85})`
        };
      case 'violet':
        return {
          aura: `rgba(140, 0, 255, ${alpha * 0.3})`,
          glow: `rgba(180, 50, 255, ${alpha})`,
          mid: `rgba(220, 140, 255, ${alpha * 0.85})`
        };
      case 'solar':
        return {
          aura: `rgba(255, 120, 0, ${alpha * 0.3})`,
          glow: `rgba(255, 200, 0, ${alpha})`,
          mid: `rgba(255, 240, 120, ${alpha * 0.85})`
        };
      default: // Magenta / Electric Arc
        return {
          aura: `rgba(255, 0, 160, ${alpha * 0.35})`,
          glow: `rgba(255, 40, 180, ${alpha})`,
          mid: `rgba(255, 160, 220, ${alpha * 0.85})`
        };
    }
  }
}
