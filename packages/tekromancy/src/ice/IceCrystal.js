/**
 * IceCrystal.js - Dendritic Frost Branch & Shattered Shard Primitive
 * Part of @tekromancy/tekromancy procedural visual effects engine.
 */

export class IceCrystal {
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} angle
   * @param {Object} [options]
   */
  constructor(x, y, angle, options = {}) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.theme = options.theme || 'frost'; // 'frost' | 'glacial' | 'rime' | 'void'
    this.depth = options.depth || 0;
    this.maxDepth = options.maxDepth || 3;
    this.maxLength = (options.length || (12 + Math.random() * 16)) * (options.scale || 1);
    this.currentLength = 0;
    this.growthSpeed = (options.growthSpeed || 1.2) * (options.speedScale || 1);
    this.children = [];
    this.branchesSpawned = false;

    this.life = 1.0;
    this.decay = options.decay || 0.008;
    this.fade = false;
  }

  update() {
    if (this.currentLength < this.maxLength) {
      this.currentLength += this.growthSpeed;
      if (this.currentLength >= this.maxLength * 0.5 && !this.branchesSpawned && this.depth < this.maxDepth) {
        this.branchesSpawned = true;
        // Spawn 60° dendritic branches (ice snowflake hexagonal symmetry)
        const branchAngles = [-Math.PI / 3, Math.PI / 3];
        const midX = this.x + Math.cos(this.angle) * this.currentLength;
        const midY = this.y + Math.sin(this.angle) * this.currentLength;

        for (const bAngle of branchAngles) {
          if (Math.random() < 0.8) {
            this.children.push(new IceCrystal(midX, midY, this.angle + bAngle, {
              theme: this.theme,
              depth: this.depth + 1,
              maxDepth: this.maxDepth,
              length: this.maxLength * 0.6,
              growthSpeed: this.growthSpeed * 0.9,
              decay: this.decay
            }));
          }
        }
      }
    }

    for (const child of this.children) {
      child.update();
    }

    if (this.fade) {
      this.life -= this.decay;
    }
    return this.life > 0;
  }

  render(ctx) {
    if (this.life <= 0) return;

    ctx.save();
    const colors = this._getThemeColors(this.life);

    const endX = this.x + Math.cos(this.angle) * this.currentLength;
    const endY = this.y + Math.sin(this.angle) * this.currentLength;

    // Glowing icy halo
    ctx.strokeStyle = colors.glow;
    ctx.lineWidth = Math.max(1, (this.maxDepth - this.depth + 2) * this.life);
    ctx.shadowBlur = 8;
    ctx.shadowColor = colors.shadow;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Sharp crystalline core
    ctx.strokeStyle = `rgba(255, 255, 255, ${this.life * 0.9})`;
    ctx.lineWidth = Math.max(0.75, (this.maxDepth - this.depth) * 0.8 * this.life);
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    ctx.restore();

    for (const child of this.children) {
      child.render(ctx);
    }
  }

  _getThemeColors(alpha) {
    switch (this.theme) {
      case 'glacial':
        return {
          glow: `rgba(0, 180, 255, ${alpha * 0.75})`,
          shadow: `rgba(0, 220, 255, ${alpha})`
        };
      case 'rime':
        return {
          glow: `rgba(220, 245, 255, ${alpha * 0.8})`,
          shadow: `rgba(180, 230, 255, ${alpha})`
        };
      case 'void':
        return {
          glow: `rgba(160, 100, 255, ${alpha * 0.75})`,
          shadow: `rgba(200, 140, 255, ${alpha})`
        };
      default: // Frost / Classic Ice
        return {
          glow: `rgba(140, 220, 255, ${alpha * 0.85})`,
          shadow: `rgba(100, 200, 255, ${alpha * 0.9})`
        };
    }
  }
}

export class IceShard {
  /**
   * @param {number} x
   * @param {number} y
   * @param {Object} [options]
   */
  constructor(x, y, options = {}) {
    this.x = x;
    this.y = y;
    this.theme = options.theme || 'frost';

    const angle = Math.random() * Math.PI * 2;
    const speed = (2 + Math.random() * 7) * (options.speedScale || 1);
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.gravity = 0.12;

    this.size = (4 + Math.random() * 8) * (options.scale || 1);
    this.rotation = Math.random() * Math.PI * 2;
    this.vRot = (Math.random() - 0.5) * 0.2;

    this.life = 1.0;
    this.decay = 0.015 + Math.random() * 0.025;
  }

  update() {
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.vRot;
    this.life -= this.decay;
    return this.life > 0;
  }

  render(ctx) {
    if (this.life <= 0) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    // Angular shard polygon
    ctx.beginPath();
    ctx.moveTo(0, -this.size * 1.4);
    ctx.lineTo(this.size * 0.6, 0);
    ctx.lineTo(0, this.size * 1.4);
    ctx.lineTo(-this.size * 0.6, 0);
    ctx.closePath();

    ctx.fillStyle = `rgba(200, 240, 255, ${this.life * 0.7})`;
    ctx.strokeStyle = `rgba(255, 255, 255, ${this.life * 0.9})`;
    ctx.lineWidth = 1;
    ctx.shadowBlur = 6;
    ctx.shadowColor = `rgba(120, 220, 255, ${this.life * 0.8})`;
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }
}
