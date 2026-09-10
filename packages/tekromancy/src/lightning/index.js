/**
 * @tekromancy/tekromancy - Lightning Module
 */

import { LightningGenerator } from './LightningGenerator.js';

export { LightningGenerator } from './LightningGenerator.js';
export { LightningBolt } from './LightningBolt.js';
export { StationLightningController } from './StationLightningController.js';

/**
 * Convenience factory to create a LightningGenerator instance
 * @param {Object} [options]
 * @returns {LightningGenerator}
 */
export function createLightning(options = {}) {
  return new LightningGenerator(options);
}
