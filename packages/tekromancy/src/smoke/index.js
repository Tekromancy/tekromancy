/**
 * @tekromancy/tekromancy - Smoke Module
 */

import { SmokeGenerator } from './SmokeGenerator.js';

export { SmokeGenerator } from './SmokeGenerator.js';
export { SmokeParticle } from './SmokeParticle.js';

/**
 * Convenience factory to create a SmokeGenerator instance
 * @param {Object} [options]
 * @returns {SmokeGenerator}
 */
export function createSmoke(options = {}) {
  return new SmokeGenerator(options);
}
