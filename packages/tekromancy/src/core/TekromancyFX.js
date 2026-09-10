/**
 * TekromancyFX.js - Unified Multi-Element Visual FX Orchestrator
 * Part of @tekromancy/tekromancy
 */

import { LightningGenerator } from '../lightning/LightningGenerator.js';
import { FireGenerator } from '../fire/FireGenerator.js';
import { SmokeGenerator } from '../smoke/SmokeGenerator.js';
import { PlasmaGenerator } from '../plasma/PlasmaGenerator.js';
import { WaterGenerator } from '../water/WaterGenerator.js';
import { IceGenerator } from '../ice/IceGenerator.js';
import { ElementHighlighter } from './ElementHighlighter.js';

export class TekromancyFX {
  /**
   * @param {Object} [options]
   * @param {string[]} [options.enabledEffects] ['lightning', 'fire', 'smoke', 'plasma', 'water', 'ice']
   * @param {Object} [options.highlighter] Options for ElementHighlighter
   * @param {boolean} [options.autoInjectStyles=true]
   */
  constructor(options = {}) {
    const enabled = options.enabledEffects || ['lightning', 'fire', 'smoke', 'plasma', 'water', 'ice'];

    this.lightning = enabled.includes('lightning') ? new LightningGenerator(options.lightning || {}) : null;
    this.fire = enabled.includes('fire') ? new FireGenerator(options.fire || {}) : null;
    this.smoke = enabled.includes('smoke') ? new SmokeGenerator(options.smoke || {}) : null;
    this.plasma = enabled.includes('plasma') ? new PlasmaGenerator(options.plasma || {}) : null;
    this.water = enabled.includes('water') ? new WaterGenerator(options.water || {}) : null;
    this.ice = enabled.includes('ice') ? new IceGenerator(options.ice || {}) : null;

    this.highlighter = new ElementHighlighter(this, options.highlighter || {});
  }

  /**
   * Trigger a multi-element storm / tempest across the screen
   * @param {Object} effectLevels { lightning?: number, fire?: number, smoke?: number, plasma?: number, water?: number, ice?: number } (Scale: 1-100)
   * @param {number} [duration=2500]
   */
  storm(effectLevels = {}, duration = 2500) {
    if (effectLevels.lightning && this.lightning) {
      this.lightning.startStorm(duration, effectLevels.lightning);
      this.lightning.flash((effectLevels.lightning / 100) * 0.9, 200);
    }
    if (effectLevels.fire && this.fire) {
      this.fire.startInferno(duration, effectLevels.fire);
    }
    if (effectLevels.smoke && this.smoke) {
      this.smoke.startHaze(duration, effectLevels.smoke);
    }
    if (effectLevels.plasma && this.plasma) {
      this.plasma.startTempest(duration, effectLevels.plasma);
    }
    if (effectLevels.water && this.water) {
      this.water.startRain(duration, effectLevels.water);
    }
    if (effectLevels.ice && this.ice) {
      this.ice.startBlizzard(duration, effectLevels.ice);
    }
  }

  /**
   * Encircle a target DOM element with one or multiple effects
   * @param {HTMLElement|string} elementOrSelector
   * @param {string|string[]} effects Effect name or array of effect names
   * @param {Object} [options]
   */
  encircle(elementOrSelector, effects = 'lightning', options = {}) {
    const effectList = Array.isArray(effects) ? effects : [effects];
    for (const fx of effectList) {
      if (fx === 'lightning' && this.lightning) this.lightning.encircle(elementOrSelector, options);
      if (fx === 'fire' && this.fire) this.fire.encircle(elementOrSelector, options);
      if (fx === 'smoke' && this.smoke) this.smoke.engulf(elementOrSelector, options);
      if (fx === 'plasma' && this.plasma) this.plasma.encircle(elementOrSelector, options);
      if (fx === 'water' && this.water) this.water.encircle(elementOrSelector, options);
      if (fx === 'ice' && this.ice) this.ice.freeze(elementOrSelector, options);
    }
  }

  /**
   * Highlight newly drawn / revealed DOM element with elemental effects
   * @param {HTMLElement|string} elementOrSelector
   * @param {string|string[]|Object} [effectType] Specific effect or auto-resolved if omitted
   * @param {Object} [options]
   */
  highlight(elementOrSelector, effectType, options = {}) {
    return this.highlighter.highlight(elementOrSelector, effectType, options);
  }

  /**
   * Automatically attach substep/fragment highlight listeners to presentation frameworks
   * @param {Object} [options]
   */
  attachSubsteps(options = {}) {
    this.highlighter.attachPresentation(options);
  }

  /**
   * Detach all substep/fragment highlight listeners
   */
  detachSubsteps() {
    this.highlighter.detach();
  }

  /**
   * Clear all active particles across all engines
   */
  clear() {
    this.lightning?.clear();
    this.fire?.clear();
    this.smoke?.clear();
    this.plasma?.clear();
    this.water?.clear();
    this.ice?.clear();
  }

  /**
   * Destroy all engines and cleanup canvases
   */
  destroy() {
    this.highlighter?.detach();
    this.lightning?.destroy();
    this.fire?.destroy();
    this.smoke?.destroy();
    this.plasma?.destroy();
    this.water?.destroy();
    this.ice?.destroy();
  }
}
