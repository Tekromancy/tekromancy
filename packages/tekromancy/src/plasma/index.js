/**
 * @tekromancy/tekromancy - Plasma Module
 */

import { PlasmaGenerator } from './PlasmaGenerator.js';

export { PlasmaGenerator } from './PlasmaGenerator.js';
export { PlasmaArc } from './PlasmaArc.js';

/**
 * Convenience factory to create a PlasmaGenerator instance
 * @param {Object} [options]
 * @returns {PlasmaGenerator}
 */
export function createPlasma(options = {}) {
  return new PlasmaGenerator(options);
}
