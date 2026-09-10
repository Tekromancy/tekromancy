/**
 * StationFXController.js - Multi-Element Slide/Station FX Controller
 * Part of @tekromancy/tekromancy
 */

export class StationFXController {
  /**
   * @param {Object.<string, Object.<string, number>>} [stationMap={}]
   * @param {Object} [options]
   */
  constructor(stationMap = {}, options = {}) {
    this.stationMap = { ...stationMap };
    this.defaultSettings = options.defaultSettings || { lightning: 50 };
  }

  /**
   * Set effect configuration for a station
   * @param {string} stationId
   * @param {Object.<string, number>} config
   */
  set(stationId, config) {
    this.stationMap[stationId] = { ...(this.stationMap[stationId] || {}), ...config };
  }

  /**
   * Resolve effect configuration for a station element or ID
   * @param {HTMLElement|string} stepElOrId
   * @returns {Object.<string, number>}
   */
  get(stepElOrId) {
    let stepEl = null;
    let stepId = null;

    if (typeof stepElOrId === 'string') {
      stepId = stepElOrId;
      if (typeof document !== 'undefined') {
        stepEl = document.getElementById(stepId);
      }
    } else if (stepElOrId instanceof Element) {
      stepEl = stepElOrId;
      stepId = stepEl.id;
    }

    const resolved = { ...this.defaultSettings };
    if (stepId && this.stationMap[stepId]) {
      Object.assign(resolved, this.stationMap[stepId]);
    }

    // Check HTML data attributes e.g. data-lightning, data-fire, data-smoke, data-plasma, data-water, data-ice
    if (stepEl) {
      const effects = ['lightning', 'fire', 'smoke', 'plasma', 'water', 'ice'];
      for (const fx of effects) {
        const attr = stepEl.getAttribute(`data-${fx}`);
        if (attr !== null) {
          const val = parseInt(attr, 10);
          if (!isNaN(val)) {
            resolved[fx] = Math.max(1, Math.min(100, val));
          }
        }
      }
    }

    return resolved;
  }
}
