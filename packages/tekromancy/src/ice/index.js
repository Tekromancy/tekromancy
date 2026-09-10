/**
 * @tekromancy/tekromancy - Ice Module
 */

import { IceGenerator } from './IceGenerator.js';

export { IceGenerator } from './IceGenerator.js';
export { IceCrystal, IceShard } from './IceCrystal.js';

/**
 * Convenience factory to create an IceGenerator instance
 * @param {Object} [options]
 * @returns {IceGenerator}
 */
export function createIce(options = {}) {
  return new IceGenerator(options);
}
