/**
 * LightningBolt.js - Procedural Multi-Branching 2D Canvas Lightning Bolt
 * 
 * Standalone canvas render primitive for high-energy electrical bolts with
 * recursive fractal bifurcation, lifetime decay, and neon/white multi-pass glow.
 */

export class LightningBolt {
  /**
   * @param {number} startX - Origin X coordinate
   * @param {number} startY - Origin Y coordinate
   * @param {number} endX - Terminal X coordinate
   * @param {number} endY - Terminal Y coordinate
   * @param {number} [intensity=1.0] - Brightness and thickness multiplier (0.1 - 2.0)
   * @param {Object} [options={}] - Custom bolt configuration
   * @param {string} [options.color='#00f0ff'] - Outer glow / halo color
   * @param {string} [options.coreColor='#ffffff'] - Center core color
   * @param {number} [options.decay=0.06] - Decay speed per update
   * @param {number} [options.maxDepth=6] - Recursive subdivision depth
   * @param {number} [options.forkChance=0.45] - Probability of branching secondary forks
   */
  constructor(startX, startY, endX, endY, intensity = 1.0, options = {}) {
    this.segments = [];
    this.intensity = intensity;
    this.life = 1.0;
    this.color = options.color || '#00f0ff';
    this.coreColor = options.coreColor || '#ffffff';
    this.decay = options.decay || (0.05 + Math.random() * 0.04);
    this.maxDepth = options.maxDepth || 6;
    this.forkChance = options.forkChance !== undefined ? options.forkChance : 0.45;

    this.generateBolt(startX, startY, endX, endY, this.maxDepth, this.intensity);
  }

  generateBolt(x1, y1, x2, y2, depth, branchIntensity) {
    if (depth === 0) {
      this.segments.push({ x1, y1, x2, y2, intensity: branchIntensity });
      return;
    }

    const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * (depth * 30);
    const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * (depth * 20);

    this.generateBolt(x1, y1, midX, midY, depth - 1, branchIntensity);
    this.generateBolt(midX, midY, x2, y2, depth - 1, branchIntensity);

    // Recursive secondary fork
    if (depth > 2 && Math.random() < this.forkChance) {
      const forkEndX = midX + (Math.random() - 0.5) * 180;
      const forkEndY = midY + Math.random() * 140 + 40;
      this.generateBolt(midX, midY, forkEndX, forkEndY, depth - 2, branchIntensity * 0.6);
    }
  }

  /**
   * Advances bolt lifetime by decay factor.
   * @returns {boolean} True if bolt is still alive
   */
  update() {
    this.life -= this.decay;
    return this.life > 0;
  }

  /**
   * Renders the lightning bolt onto the provided Canvas 2D rendering context.
   * @param {CanvasRenderingContext2D} ctx - Target 2D canvas context
   */
  draw(ctx) {
    if (this.life <= 0 || !ctx) return;

    ctx.save();
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 24 * this.intensity;

    for (const seg of this.segments) {
      const segAlpha = Math.max(0, this.life * seg.intensity);

      // Pass 1: Outer Neon Atmospheric Halo
      ctx.strokeStyle = this.color.startsWith('rgb') 
        ? this.color 
        : `rgba(0, 240, 255, ${segAlpha * 0.8})`;
      ctx.lineWidth = 3.5 * seg.intensity;
      ctx.beginPath();
      ctx.moveTo(seg.x1, seg.y1);
      ctx.lineTo(seg.x2, seg.y2);
      ctx.stroke();

      // Pass 2: Inner White-Hot Core
      ctx.strokeStyle = this.coreColor.startsWith('rgb')
        ? this.coreColor
        : `rgba(255, 255, 255, ${segAlpha})`;
      ctx.lineWidth = Math.max(1.0, 1.4 * seg.intensity);
      ctx.beginPath();
      ctx.moveTo(seg.x1, seg.y1);
      ctx.lineTo(seg.x2, seg.y2);
      ctx.stroke();
    }

    ctx.restore();
  }
}
