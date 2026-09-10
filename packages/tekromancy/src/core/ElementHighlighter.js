/**
 * ElementHighlighter.js - Multi-Element DOM Highlight & Substep Reveal Engine
 * Part of @tekromancy/tekromancy
 * 
 * Coordinates perimeter visual wraps, elemental particles, and CSS glow pulses
 * when newly drawn, revealed, or focused elements enter the DOM across presentations.
 * Supports: Lightning, Fire, Smoke, Plasma, Water, Ice, and Compound effects.
 */

export class ElementHighlighter {
  /**
   * @param {Object} orchestrator TekromancyFX instance or map of generator instances
   * @param {Object} [options]
   * @param {string} [options.defaultEffect='lightning'] 'lightning' | 'fire' | 'smoke' | 'plasma' | 'water' | 'ice'
   * @param {number} [options.defaultDuration=750] Duration in ms
   * @param {number} [options.defaultIntensity=1.0]
   * @param {boolean} [options.autoFlash=true] Flash screen subtly on lightning/plasma highlights
   * @param {Object} [options.stationController] StationFXController instance for slide-aware effects
   * @param {Function} [options.soundHandler] Callback (effectType, intensity) => void
   */
  constructor(orchestrator, options = {}) {
    this.orchestrator = orchestrator || {};
    this.defaultEffect = options.defaultEffect || 'lightning';
    this.defaultDuration = options.defaultDuration || 750;
    this.defaultIntensity = options.defaultIntensity || 1.0;
    this.autoFlash = options.autoFlash !== false;
    this.stationController = options.stationController || null;
    this.soundHandler = options.soundHandler || null;

    this._attachedListeners = [];
    this._mutationObserver = null;
  }

  /**
   * Highlights a target DOM element with one or multiple elemental effects
   * @param {HTMLElement|string} elementOrSelector
   * @param {string|string[]|Object} [effectType] Specific effect or auto-resolved if omitted
   * @param {Object} [options]
   * @returns {HTMLElement|null}
   */
  highlight(elementOrSelector, effectType, options = {}) {
    if (typeof document === 'undefined') return null;

    const el = typeof elementOrSelector === 'string'
      ? document.querySelector(elementOrSelector)
      : elementOrSelector;

    if (!el || !el.isConnected) return null;

    // Resolve effect type if not explicitly provided
    const resolvedEffect = this.resolveEffectType(el, effectType);
    const effects = Array.isArray(resolvedEffect)
      ? resolvedEffect
      : (typeof resolvedEffect === 'object' ? Object.keys(resolvedEffect) : [resolvedEffect]);

    const duration = options.duration || this.defaultDuration;
    const intensity = options.intensity !== undefined
      ? options.intensity
      : this.resolveIntensity(el, effects[0]);

    // Apply CSS Glow & Pulse classes
    el.classList.add('tekro-highlighted');
    for (const fx of effects) {
      el.classList.add(`tekro-highlight-${fx}`);
    }

    const cleanupTimer = setTimeout(() => {
      el.classList.remove('tekro-highlighted');
      for (const fx of effects) {
        el.classList.remove(`tekro-highlight-${fx}`);
      }
    }, duration + 200);

    // Apply elemental generator effects
    for (const fx of effects) {
      this._applyElementalFX(el, fx, { ...options, duration, intensity });
    }

    // Audio SFX accompaniment
    if (options.sound !== false) {
      this._playHighlightSound(effects[0], intensity);
    }

    // Dispatch DOM event for custom hooks
    const eventDetail = { element: el, effects, duration, intensity };
    el.dispatchEvent(new CustomEvent('tekromancy:highlight', { bubbles: true, detail: eventDetail }));

    return el;
  }

  /**
   * Resolve which effect to apply for an element
   * Priority:
   * 1. Explicit effectType argument
   * 2. Element data-fx / data-highlight-fx attribute
   * 3. Element specific data-[effect] attribute (e.g. data-fire)
   * 4. Slide level configuration from StationFXController
   * 5. Default fallback effect
   * @param {HTMLElement} el
   * @param {string} [explicitType]
   * @returns {string|string[]}
   */
  resolveEffectType(el, explicitType) {
    if (explicitType) return explicitType;

    // 1. Element explicit data-fx attribute
    const dataFx = el.getAttribute('data-fx') || el.getAttribute('data-highlight-fx');
    if (dataFx) {
      if (dataFx.includes(',')) {
        return dataFx.split(',').map(s => s.trim());
      }
      return dataFx;
    }

    // 2. Element individual data-[element] attributes
    const elements = ['lightning', 'fire', 'smoke', 'plasma', 'water', 'ice'];
    for (const fx of elements) {
      if (el.hasAttribute(`data-${fx}`)) return fx;
    }

    // 3. Parent slide / station context
    const slide = el.closest('.step, section, .slide');
    if (slide) {
      // Check slide data-fx
      const slideFx = slide.getAttribute('data-fx');
      if (slideFx) return slideFx;

      // Check station controller mapping if available
      if (this.stationController) {
        const slideConfig = this.stationController.get(slide);
        // Find highest configured effect on this slide
        let maxFx = null;
        let maxVal = 0;
        for (const [fx, val] of Object.entries(slideConfig)) {
          if (val > maxVal) {
            maxVal = val;
            maxFx = fx;
          }
        }
        if (maxFx) return maxFx;
      }

      // Check slide individual data attributes
      for (const fx of elements) {
        if (slide.hasAttribute(`data-${fx}`)) return fx;
      }
    }

    return this.defaultEffect;
  }

  /**
   * Resolve intensity (0.1 to 2.0) for an element
   * @param {HTMLElement} el
   * @param {string} fx
   * @returns {number}
   */
  resolveIntensity(el, fx) {
    const attr = el.getAttribute(`data-${fx}`) || el.getAttribute('data-intensity');
    if (attr) {
      const val = parseFloat(attr);
      if (!isNaN(val)) {
        return val > 2 ? val / 100 : val;
      }
    }

    const slide = el.closest('.step, section, .slide');
    if (slide && this.stationController) {
      const slideConfig = this.stationController.get(slide);
      if (slideConfig[fx]) {
        return slideConfig[fx] / 100;
      }
    }

    return this.defaultIntensity;
  }

  /**
   * Internal dispatcher to call individual generator encircle / wrap methods
   * @private
   */
  _applyElementalFX(el, fx, options) {
    const duration = options.duration || this.defaultDuration;
    const intensity = options.intensity || 1.0;
    const padding = options.padding || 8;

    switch (fx) {
      case 'lightning': {
        const gen = this.orchestrator.lightning;
        if (gen) {
          gen.encircle(el, {
            duration,
            intensity: intensity * 1.2,
            padding
          });
          if (this.autoFlash && options.flash !== false) {
            gen.flash(0.15 + intensity * 0.3, 100);
          }
        }
        break;
      }

      case 'fire': {
        const gen = this.orchestrator.fire;
        if (gen) {
          gen.encircle(el, {
            duration,
            intensity,
            theme: options.theme
          });
          if (options.burst) {
            const rect = el.getBoundingClientRect();
            gen.burst(rect.left + rect.width * 0.5, rect.top + rect.height * 0.5, 20);
          }
        }
        break;
      }

      case 'smoke': {
        const gen = this.orchestrator.smoke;
        if (gen) {
          gen.engulf(el, {
            duration,
            intensity,
            theme: options.theme
          });
          if (options.burst) {
            const rect = el.getBoundingClientRect();
            gen.poof(rect.left + rect.width * 0.5, rect.top + rect.height * 0.5, 18);
          }
        }
        break;
      }

      case 'plasma': {
        const gen = this.orchestrator.plasma;
        if (gen) {
          gen.encircle(el, {
            duration,
            intensity,
            theme: options.theme
          });
        }
        break;
      }

      case 'water': {
        const gen = this.orchestrator.water;
        if (gen) {
          gen.encircle(el, {
            duration,
            intensity,
            theme: options.theme
          });
          if (options.burst) {
            const rect = el.getBoundingClientRect();
            gen.splash(rect.left + rect.width * 0.5, rect.top + rect.height * 0.5, { scale: 0.9 });
          }
        }
        break;
      }

      case 'ice': {
        const gen = this.orchestrator.ice;
        if (gen) {
          gen.freeze(el, {
            duration,
            intensity,
            theme: options.theme
          });
          if (options.burst) {
            const rect = el.getBoundingClientRect();
            gen.shatter(rect.left + rect.width * 0.5, rect.top + rect.height * 0.5, { count: 15 });
          }
        }
        break;
      }
    }
  }

  /**
   * Sound accompaniment dispatcher
   * @private
   */
  _playHighlightSound(fx, intensity) {
    if (this.soundHandler) {
      this.soundHandler(fx, intensity);
      return;
    }

    if (typeof window !== 'undefined' && window.soundEngine) {
      const se = window.soundEngine;
      const soundLevel = Math.max(0.2, Math.min(1.0, intensity));
      switch (fx) {
        case 'lightning':
          if (se.playSubstepZap) se.playSubstepZap(soundLevel);
          else if (se.playThunderCrack) se.playThunderCrack(soundLevel * 0.7);
          break;
        case 'fire':
          if (se.playFireCrackle) se.playFireCrackle(soundLevel);
          break;
        case 'smoke':
          if (se.playSmokeHiss) se.playSmokeHiss(soundLevel);
          break;
        case 'plasma':
          if (se.playPlasmaHum) se.playPlasmaHum(soundLevel);
          break;
        case 'water':
          if (se.playWaterSplash) se.playWaterSplash(soundLevel);
          break;
        case 'ice':
          if (se.playIceFreeze) se.playIceFreeze(soundLevel);
          break;
      }
    }
  }

  /**
   * Automatically attach listeners to presentation frameworks (impress.js, Reveal.js)
   * and/or DOM MutationObserver for substeps and fragments.
   * @param {Object} [options]
   * @param {boolean} [options.impress=true] Listen to impress:substep:enter
   * @param {boolean} [options.reveal=true] Listen to Reveal.js fragmentshown
   * @param {boolean} [options.observeDOM=false] Watch DOM mutations on elements
   * @param {string} [options.selector='.substep, .fragment']
   */
  attachPresentation(options = {}) {
    if (typeof document === 'undefined') return;

    // 1. impress.js integration
    if (options.impress !== false) {
      const impressSubstepHandler = (event) => {
        const el = event.detail?.substep || event.target;
        if (el) {
          this.highlight(el, null, options);
        }
      };
      document.addEventListener('impress:substep:enter', impressSubstepHandler);
      this._attachedListeners.push({ target: document, event: 'impress:substep:enter', handler: impressSubstepHandler });
    }

    // 2. Reveal.js integration
    if (options.reveal !== false) {
      const revealFragmentHandler = (event) => {
        const el = event.fragment || event.detail?.fragment;
        if (el) {
          this.highlight(el, null, options);
        }
      };
      document.addEventListener('fragmentshown', revealFragmentHandler);
      this._attachedListeners.push({ target: document, event: 'fragmentshown', handler: revealFragmentHandler });
    }

    // 3. Optional DOM MutationObserver
    if (options.observeDOM) {
      const selector = options.selector || '.substep, .fragment, .tekro-reveal';
      this._mutationObserver = new MutationObserver((mutations) => {
        for (const mut of mutations) {
          if (mut.type === 'attributes' && mut.attributeName === 'class') {
            const target = mut.target;
            if (target.matches && target.matches(selector)) {
              const isVisible = target.classList.contains('substep-visible') ||
                                target.classList.contains('substep-active') ||
                                target.classList.contains('visible');
              if (isVisible && !target.dataset.tekroHighlighted) {
                target.dataset.tekroHighlighted = 'true';
                this.highlight(target, null, options);
                setTimeout(() => { delete target.dataset.tekroHighlighted; }, 1000);
              }
            }
          }
        }
      });

      this._mutationObserver.observe(document.body, {
        attributes: true,
        subtree: true,
        attributeFilter: ['class']
      });
    }
  }

  /**
   * Detach all event listeners and disconnect observers
   */
  detach() {
    for (const item of this._attachedListeners) {
      item.target.removeEventListener(item.event, item.handler);
    }
    this._attachedListeners = [];

    if (this._mutationObserver) {
      this._mutationObserver.disconnect();
      this._mutationObserver = null;
    }
  }
}
