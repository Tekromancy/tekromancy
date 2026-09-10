/**
 * @tekromancy/tekromancy - Water Module
 */

import { WaterGenerator } from './WaterGenerator.js';

export { WaterGenerator } from './WaterGenerator.js';
export { WaterRipple, WaterDroplet } from './WaterRipple.js';

/**
 * Convenience factory to create a WaterGenerator instance
 * @param {Object} [options]
 * @returns {WaterGenerator}
 */
export function createWater(options = {}) {
  return new WaterGenerator(options);
}
