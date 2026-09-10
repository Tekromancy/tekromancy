/**
 * StationLightningController.js - Presentation Station Lightning Controller
 * 
 * Part of @tekromancy/tekromancy
 * 
 * Manages per-station/per-slide lightning intensities across a 1-100 scale.
 * Provides resolution cascading:
 *   1. HTML data-lightning="[1-100]" attribute
 *   2. Programmatic station intensity configuration dictionary
 *   3. Configured default fallback
 */

export class StationLightningController {
  /**
   * @param {Object} [stationMap={}] - Initial mapping of slide/station IDs to intensity (1-100)
   * @param {Object} [options={}] - Options
   * @param {number} [options.defaultAmount=50] - Default intensity if unconfigured
   * @param {number} [options.minAmount=1] - Minimum allowed intensity
   * @param {number} [options.maxAmount=100] - Maximum allowed intensity
   */
  constructor(stationMap = {}, options = {}) {
    this.stationMap = Object.assign({}, stationMap);
    this.options = Object.assign({
      defaultAmount: 50,
      minAmount: 1,
      maxAmount: 100
    }, options);
  }

  /**
   * Sets intensity for a specific station ID
   * @param {string} stationId - Target step/station identifier
   * @param {number} amount - Intensity on 1-100 scale
   */
  set(stationId, amount) {
    this.stationMap[stationId] = this.clamp(amount);
  }

  /**
   * Gets intensity for a station or element
   * @param {string|Element} stepElOrId - Step element or station ID string
   * @returns {number} Intensity clamped between min and max (1-100)
   */
  get(stepElOrId) {
    let stepEl = null;
    let stepId = null;

    if (typeof stepElOrId === 'string') {
      stepId = stepElOrId;
      if (typeof document !== 'undefined') {
        stepEl = document.getElementById(stepId);
      }
    } else if (typeof Element !== 'undefined' && stepElOrId instanceof Element) {
      stepEl = stepElOrId;
      stepId = stepEl.id;
    }

    // 1. Check data-lightning HTML attribute
    if (stepEl && stepEl.hasAttribute('data-lightning')) {
      const parsed = parseInt(stepEl.getAttribute('data-lightning'), 10);
      if (!isNaN(parsed)) {
        return this.clamp(parsed);
      }
    }

    // 2. Check station map
    if (stepId && this.stationMap[stepId] !== undefined) {
      return this.clamp(Number(this.stationMap[stepId]));
    }

    return this.options.defaultAmount;
  }

  /**
   * Returns normalized level (0.01 to 1.0)
   * @param {string|Element} stepElOrId
   * @returns {number} Level from 0.01 to 1.0
   */
  getLevel(stepElOrId) {
    return this.get(stepElOrId) / 100;
  }

  clamp(value) {
    const num = Number(value);
    if (isNaN(num)) return this.options.defaultAmount;
    return Math.max(this.options.minAmount, Math.min(this.options.maxAmount, num));
  }

  /**
   * Attach automatic transition listeners to an impress.js presentation instance
   * @param {Object} impressApi - impress() API instance
   * @param {import('./LightningGenerator.js').LightningGenerator} lightningGenerator - Active lightning generator
   * @param {Object} [hooks={}] - Optional custom sound/fx hooks
   */
  bindImpress(impressApi, lightningGenerator, hooks = {}) {
    if (typeof document === 'undefined' || !lightningGenerator) return;

    // Transition leave (flight in progress)
    document.addEventListener('impress:stepleave', (event) => {
      const nextStep = event.detail?.next;
      const duration = event.detail?.transitionDuration || 1200;
      const amount = this.get(nextStep);
      const level = amount / 100;

      lightningGenerator.startStorm(duration, amount);

      if (hooks.onStepLeave) {
        hooks.onStepLeave({ event, nextStep, amount, level });
      }
    });

    // Transition enter (arrived at station)
    document.addEventListener('impress:stepenter', (event) => {
      const activeStep = event.target;
      const amount = this.get(activeStep);
      const level = amount / 100;

      lightningGenerator.flash(0.2 + level * 0.75, 120 + Math.floor(level * 60));

      // Focal element auto-encircling
      const focalEl = activeStep.querySelector('.tekro-hero-core, .cyber-badge, .station-tag, h1, h2');
      if (focalEl) {
        setTimeout(() => {
          lightningGenerator.encircle(focalEl, {
            duration: 500 + Math.floor(level * 350),
            padding: 8 + Math.floor(level * 8),
            intensity: 0.6 + level * 0.8
          });
        }, 60);
      }

      if (hooks.onStepEnter) {
        hooks.onStepEnter({ event, activeStep, amount, level });
      }
    });

    // Substep enter (bullet point, card, terminal revealed)
    document.addEventListener('impress:substep:enter', (event) => {
      const el = event.detail?.substep || event.target;
      if (!el) return;

      const activeStep = document.querySelector('.step.active');
      const amount = this.get(activeStep);
      const level = amount / 100;

      lightningGenerator.flash(0.2 + level * 0.45, 100 + Math.floor(level * 60));
      lightningGenerator.encircle(el, {
        duration: 550 + Math.floor(level * 200),
        padding: 8,
        intensity: 0.8 + level * 0.6
      });

      if (hooks.onSubstepEnter) {
        hooks.onSubstepEnter({ event, element: el, amount, level });
      }
    });
  }
}
