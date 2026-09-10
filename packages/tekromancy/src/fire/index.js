/**
 * @tekromancy/tekromancy - Fire Module
 */

import { FireGenerator } from './FireGenerator.js';

export { FireGenerator } from './FireGenerator.js';
export { FireParticle } from './FireParticle.js';

/**
 * Convenience factory to create a FireGenerator instance
 * @param {Object} [options]
 * @returns {FireGenerator}
 */
export function createFire(options = {}) {
  return new FireGenerator(options);
}
