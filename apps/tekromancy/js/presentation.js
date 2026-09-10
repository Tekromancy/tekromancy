/**
 * presentation.js - Tekromancy Interactive Showcase Orchestrator
 * Integrates impress.js 3D navigation with @tekromancy/tekromancy visual FX engines.
 */

import { TekromancyFX, StationFXController } from '@tekromancy/tekromancy';
import '@tekromancy/tekromancy/tekromancy.css';

/**
 * Slide / Station Effect Intensity Mapping (Scale: 1 to 100)
 * Allows customizing individual elemental amounts for every station.
 */
const stationController = new StationFXController({
  'tekromancy-portal': { lightning: 40, plasma: 30 },
  'manifesto': { lightning: 75, fire: 20, plasma: 40 },
  'station-lightning': { lightning: 85 },
  'station-fire': { fire: 90 },
  'station-smoke': { smoke: 85 },
  'station-plasma': { plasma: 90 },
  'station-water': { water: 85 },
  'station-ice': { ice: 90 },
  'station-unified': { lightning: 70, fire: 60, plasma: 65, ice: 50 },
  'station-guide': { lightning: 40, plasma: 40 },
  'overview': { lightning: 60, plasma: 50, fire: 30 }
}, {
  defaultSettings: { lightning: 50 }
});

window.stationController = stationController;

// Initialize the unified multi-element FX orchestrator with ElementHighlighter
const tekromancyFX = new TekromancyFX({
  highlighter: {
    stationController,
    autoFlash: true,
    soundHandler: (fx, intensity) => {
      if (window.soundEngine) {
        switch (fx) {
          case 'lightning': window.soundEngine.playThunderCrack(intensity * 0.7); break;
          case 'fire': window.soundEngine.playFireCrackle(intensity); break;
          case 'smoke': window.soundEngine.playSmokeHiss(intensity); break;
          case 'plasma': window.soundEngine.playPlasmaHum(intensity); break;
          case 'water': window.soundEngine.playWaterSplash(intensity); break;
          case 'ice': window.soundEngine.playIceFreeze(intensity); break;
        }
      }
    }
  }
});

// Expose globally for console debugging & interactive inspections
window.TekromancyFX = TekromancyFX;
window.tekromancyFX = tekromancyFX;

function initShowcase() {
  const api = window.impress ? window.impress() : null;
  if (!api) {
    console.error('impress.js runtime not detected');
    return;
  }
  api.init();

  // Attach automated multi-element substep highlighting
  tekromancyFX.attachSubsteps({ impress: true });

  const steps = Array.from(document.querySelectorAll('#impress .step'));
  const totalSteps = steps.length;

  // HUD DOM elements
  const currentStepEl = document.getElementById('hud-step-current');
  const totalStepEl = document.getElementById('hud-step-total');
  const progressBarEl = document.getElementById('hud-progress-fill');
  const stepTitleEl = document.getElementById('hud-step-title');
  const jumpMenu = document.getElementById('hud-jump-menu');
  const prevBtn = document.getElementById('btn-prev');
  const nextBtn = document.getElementById('btn-next');
  const overviewBtn = document.getElementById('btn-overview');
  const autoplayBtn = document.getElementById('btn-autoplay');
  const muteBtn = document.getElementById('btn-mute');
  const fullscreenBtn = document.getElementById('btn-fullscreen');
  const startBtn = document.getElementById('btn-start-presentation');
  const flashOverlay = document.getElementById('lightning-flash-overlay');

  if (totalStepEl) {
    totalStepEl.textContent = String(totalSteps - 1).padStart(2, '0');
  }

  // Populate Jump Menu
  if (jumpMenu) {
    jumpMenu.innerHTML = '';
    steps.forEach((step, idx) => {
      const option = document.createElement('option');
      option.value = step.id;
      const title = step.getAttribute('data-title') || step.querySelector('h1, h2')?.textContent?.trim() || `Station ${idx}`;
      if (step.id === 'tekromancy-portal') {
        option.textContent = `00. Orbital Gateway`;
      } else {
        option.textContent = `${String(idx).padStart(2, '0')}. ${title.slice(0, 32)}`;
      }
      jumpMenu.appendChild(option);
    });

    jumpMenu.addEventListener('change', (e) => {
      api.goto(e.target.value);
      jumpMenu.blur();
    });
  }

  // Navigation Button Handlers
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      api.prev();
      prevBtn.blur();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      api.next();
      nextBtn.blur();
    });
  }
  if (overviewBtn) {
    overviewBtn.addEventListener('click', (e) => {
      e.preventDefault();
      api.goto('overview');
      overviewBtn.blur();
    });
  }

  // Autoplay handler (6s advance)
  let autoplayInterval = null;
  function toggleAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
      if (autoplayBtn) {
        autoplayBtn.classList.remove('active-toggle');
        autoplayBtn.querySelector('span').textContent = 'Autoplay';
      }
    } else {
      autoplayInterval = setInterval(() => {
        api.next();
      }, 6000);
      if (autoplayBtn) {
        autoplayBtn.classList.add('active-toggle');
        autoplayBtn.querySelector('span').textContent = 'Pause';
      }
    }
  }

  if (autoplayBtn) {
    autoplayBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleAutoplay();
      autoplayBtn.blur();
    });
  }

  // Audio Mute Toggle
  if (muteBtn) {
    muteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.soundEngine) {
        const isMuted = window.soundEngine.toggleMute();
        muteBtn.classList.toggle('active-toggle', isMuted);
        muteBtn.querySelector('span').textContent = isMuted ? 'Unmute' : 'Mute';
      }
      muteBtn.blur();
    });
  }

  // Fullscreen Toggle
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
      fullscreenBtn.blur();
    });
  }

  // Gateway Warp Plunge (Station 00 -> Station 01)
  function triggerWarpPlunge() {
    if (window.soundEngine) {
      window.soundEngine.initContext();
      window.soundEngine.playHyperWarp();
    }
    tekromancyFX.storm({ lightning: 90, plasma: 80 }, 2800);
    api.goto('manifesto');
  }

  if (startBtn) {
    startBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      startBtn.blur();
      triggerWarpPlunge();
    });
  }

  let previousStepId = null;

  // Slide Transition Departure: triggers atmospheric background transition FX
  document.addEventListener('impress:stepleave', (event) => {
    previousStepId = event.target.id;
    const nextStep = event.detail?.next;
    const nextStepId = nextStep?.id;
    const isWarp = previousStepId === 'tekromancy-portal' && nextStepId === 'manifesto';
    const duration = isWarp ? 2600 : (event.detail?.transitionDuration || 1800);

    if (window.cyberCanvas) {
      window.cyberCanvas.setActiveStation(nextStepId);
      window.cyberCanvas.setOverview(nextStepId === 'overview');
    }

    const fxConfig = stationController.get(nextStep || nextStepId);

    // Trigger multi-element storm configured for incoming slide
    tekromancyFX.storm(fxConfig, duration);

    // Audio accompaniment for incoming atmosphere
    if (window.soundEngine) {
      if (isWarp) {
        window.soundEngine.playHyperWarp();
      } else {
        if (fxConfig.lightning && fxConfig.lightning > 20) {
          window.soundEngine.playThunderCrack(fxConfig.lightning / 100);
        } else if (fxConfig.fire && fxConfig.fire > 20) {
          window.soundEngine.playFireCrackle(fxConfig.fire / 100);
        } else if (fxConfig.plasma && fxConfig.plasma > 20) {
          window.soundEngine.playPlasmaHum(fxConfig.plasma / 100);
        } else if (fxConfig.smoke && fxConfig.smoke > 20) {
          window.soundEngine.playSmokeHiss(fxConfig.smoke / 100);
        } else if (fxConfig.water && fxConfig.water > 20) {
          window.soundEngine.playWaterSplash(fxConfig.water / 100);
        } else if (fxConfig.ice && fxConfig.ice > 20) {
          window.soundEngine.playIceFreeze(fxConfig.ice / 100);
        } else {
          window.soundEngine.playWhoosh();
        }
      }
    }
  });

  // Slide Transition Arrival: updates HUD, triggers impacts & card encircle
  document.addEventListener('impress:stepenter', (event) => {
    const activeStep = event.target;
    const stepId = activeStep.id;
    const stepIndex = steps.indexOf(activeStep);

    if (window.cyberCanvas) {
      window.cyberCanvas.setActiveStation(stepId);
      window.cyberCanvas.setOverview(stepId === 'overview');
    }

    // Update Step Counter
    if (currentStepEl) {
      currentStepEl.textContent = stepId === 'tekromancy-portal' ? '00' : String(stepIndex).padStart(2, '0');
    }

    // Update Progress Bar
    if (progressBarEl) {
      const pct = stepId === 'tekromancy-portal' ? 0 : (stepIndex / (totalSteps - 1)) * 100;
      progressBarEl.style.width = `${pct}%`;
    }

    // Update Title in HUD
    const titleAttr = activeStep.getAttribute('data-title') || activeStep.querySelector('h1, h2')?.textContent?.trim() || 'Tekromancy';
    if (stepTitleEl) {
      stepTitleEl.textContent = titleAttr;
    }

    // Sync Jump Menu
    if (jumpMenu) {
      jumpMenu.value = stepId;
    }

    // SPECIAL WARP SLAM: Arriving at Station 01 (#manifesto) from Station 00 (#tekromancy-portal)
    if (stepId === 'manifesto' && previousStepId === 'tekromancy-portal') {
      if (tekromancyFX.lightning) {
        tekromancyFX.lightning.flash(0.9, 300);
        tekromancyFX.lightning.strike(window.innerWidth * 0.5, 0, window.innerWidth * 0.5, window.innerHeight * 0.45);
      }

      if (flashOverlay) {
        flashOverlay.classList.add('flash');
        setTimeout(() => flashOverlay.classList.remove('flash'), 150);
      }

      if (window.soundEngine) {
        window.soundEngine.playSlamImpact();
      }

      document.body.classList.add('screen-impact-shake');
      setTimeout(() => document.body.classList.remove('screen-impact-shake'), 750);

      activeStep.classList.add('slam-wiggle');
      setTimeout(() => activeStep.classList.remove('slam-wiggle'), 900);
    } else if (stepId !== 'tekromancy-portal') {
      // Light arrival flash for other stations
      const fxConfig = stationController.get(activeStep);
      if (fxConfig.lightning && tekromancyFX.lightning) {
        tekromancyFX.lightning.flash(0.3 + (fxConfig.lightning / 100) * 0.4, 150);
      }
    }
  });

  // Wire orbital node cards in Constellation Overview for quick jump
  document.querySelectorAll('.orbital-node-card[data-goto]').forEach((card) => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const target = card.getAttribute('data-goto');
      if (target) {
        if (window.soundEngine) window.soundEngine.playWhoosh();
        api.goto(target);
      }
    });
  });

  // Helper to attach button listener and auto-blur to prevent key entrapment
  function bindBtn(id, handler) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      handler(e);
      el.blur();
    });
  }

  // =========================================================================
  // INTERACTIVE EXPERIMENTAL BUTTONS FOR ALL STATIONS
  // =========================================================================

  // Station 01: Manifesto
  bindBtn('btn-test-manifesto-fx', () => {
    tekromancyFX.storm({
      lightning: 70,
      fire: 60,
      plasma: 60,
      ice: 50
    }, 2500);
    if (window.soundEngine) window.soundEngine.playThunderCrack(0.8);
  });

  bindBtn('btn-manifesto-encircle', () => {
    const cards = document.querySelectorAll('#manifesto .cyber-card');
    if (cards[0]) tekromancyFX.encircle(cards[0], 'lightning', { duration: 2000 });
    if (cards[1]) tekromancyFX.encircle(cards[1], 'fire', { duration: 2000 });
    if (cards[2]) tekromancyFX.encircle(cards[2], 'plasma', { duration: 2000 });
    if (window.soundEngine) window.soundEngine.playPlasmaHum(0.9);
  });

  // Station 02: Lightning
  bindBtn('btn-lightning-strike', () => {
    const card = document.getElementById('lightning-demo-card');
    const rect = card ? card.getBoundingClientRect() : { left: window.innerWidth * 0.5, top: window.innerHeight * 0.5, width: 0, height: 0 };
    const targetX = rect.left + rect.width * 0.5;
    const targetY = rect.top + rect.height * 0.5;
    tekromancyFX.lightning?.strike(window.innerWidth * (0.2 + Math.random() * 0.6), 0, targetX, targetY);
    if (window.soundEngine) window.soundEngine.playThunderCrack(1.0);
  });

  bindBtn('btn-lightning-encircle', () => {
    tekromancyFX.encircle('#lightning-demo-card', 'lightning', { duration: 2000 });
    if (window.soundEngine) window.soundEngine.playThunderCrack(0.6);
  });

  bindBtn('btn-lightning-highlight', () => {
    tekromancyFX.highlight('#lightning-substep-demo', 'lightning', { burst: true });
  });

  bindBtn('btn-lightning-flash', () => {
    tekromancyFX.lightning?.flash(0.9, 250);
    if (flashOverlay) {
      flashOverlay.classList.add('flash');
      setTimeout(() => flashOverlay.classList.remove('flash'), 120);
    }
    if (window.soundEngine) window.soundEngine.playThunderCrack(0.8);
  });

  bindBtn('btn-lightning-storm', () => {
    tekromancyFX.lightning?.startStorm(2500, 85);
    if (window.soundEngine) window.soundEngine.playThunderCrack(0.9);
  });

  // Station 03: Fire
  bindBtn('btn-fire-burst', () => {
    const card = document.getElementById('fire-demo-card');
    const rect = card ? card.getBoundingClientRect() : { left: window.innerWidth * 0.5, top: window.innerHeight * 0.5, width: 0, height: 0 };
    const cx = rect.left + rect.width * 0.5;
    const cy = rect.top + rect.height * 0.5;
    tekromancyFX.fire?.burst(cx, cy, 60, { theme: 'fire' });
    if (window.soundEngine) window.soundEngine.playFireCrackle(1.0);
  });

  bindBtn('btn-fire-encircle', () => {
    tekromancyFX.encircle('#fire-demo-card', 'fire', { duration: 2200, count: 60 });
    if (window.soundEngine) window.soundEngine.playFireCrackle(0.8);
  });

  bindBtn('btn-fire-highlight', () => {
    tekromancyFX.highlight('#fire-substep-demo', 'fire', { burst: true });
  });

  bindBtn('btn-fire-inferno', () => {
    tekromancyFX.fire?.startInferno(2500, 85);
    if (window.soundEngine) window.soundEngine.playFireCrackle(1.0);
  });

  // Station 04: Smoke
  bindBtn('btn-smoke-poof', () => {
    const card = document.getElementById('smoke-demo-card');
    const rect = card ? card.getBoundingClientRect() : { left: window.innerWidth * 0.5, top: window.innerHeight * 0.5, width: 0, height: 0 };
    const cx = rect.left + rect.width * 0.5;
    const cy = rect.top + rect.height * 0.5;
    tekromancyFX.smoke?.poof(cx, cy, 50, { theme: 'stealth' });
    if (window.soundEngine) window.soundEngine.playSmokeHiss(1.0);
  });

  bindBtn('btn-smoke-engulf', () => {
    tekromancyFX.encircle('#smoke-demo-card', 'smoke', { duration: 2200, count: 45 });
    if (window.soundEngine) window.soundEngine.playSmokeHiss(0.8);
  });

  bindBtn('btn-smoke-highlight', () => {
    tekromancyFX.highlight('#smoke-substep-demo', 'smoke', { burst: true });
  });

  bindBtn('btn-smoke-haze', () => {
    tekromancyFX.smoke?.startHaze(2500, 80);
    if (window.soundEngine) window.soundEngine.playSmokeHiss(0.9);
  });

  // Station 05: Plasma
  bindBtn('btn-plasma-orb', () => {
    const card = document.getElementById('plasma-demo-card');
    const rect = card ? card.getBoundingClientRect() : { left: window.innerWidth * 0.5, top: window.innerHeight * 0.5, width: 0, height: 0 };
    const cx = rect.left + rect.width * 0.5;
    const cy = rect.top + rect.height * 0.5;
    tekromancyFX.plasma?.orb(cx, cy, 70, { theme: 'hyper', duration: 1800 });
    if (window.soundEngine) window.soundEngine.playPlasmaHum(1.0);
  });

  bindBtn('btn-plasma-containment', () => {
    tekromancyFX.encircle('#plasma-demo-card', 'plasma', { duration: 2000, theme: 'hyper' });
    if (window.soundEngine) window.soundEngine.playPlasmaHum(0.85);
  });

  bindBtn('btn-plasma-highlight', () => {
    tekromancyFX.highlight('#plasma-substep-demo', 'plasma');
  });

  bindBtn('btn-plasma-tempest', () => {
    tekromancyFX.plasma?.startTempest(2500, 85);
    if (window.soundEngine) window.soundEngine.playPlasmaHum(1.0);
  });

  // Station 06: Water
  bindBtn('btn-water-splash', () => {
    const card = document.getElementById('water-demo-card');
    const rect = card ? card.getBoundingClientRect() : { left: window.innerWidth * 0.5, top: window.innerHeight * 0.5, width: 0, height: 0 };
    const cx = rect.left + rect.width * 0.5;
    const cy = rect.top + rect.height * 0.5;
    tekromancyFX.water?.splash(cx, cy, { dropletCount: 20, scale: 1.2 });
    if (window.soundEngine) window.soundEngine.playWaterSplash(1.0);
  });

  bindBtn('btn-water-ripple', () => {
    tekromancyFX.encircle('#water-demo-card', 'water', { duration: 2200, intensity: 1.2 });
    if (window.soundEngine) window.soundEngine.playWaterSplash(0.8);
  });

  bindBtn('btn-water-highlight', () => {
    tekromancyFX.highlight('#water-substep-demo', 'water', { burst: true });
  });

  bindBtn('btn-water-rain', () => {
    tekromancyFX.water?.startRain(2500, 85);
    if (window.soundEngine) window.soundEngine.playWaterSplash(0.9);
  });

  // Station 07: Ice
  bindBtn('btn-ice-shatter', () => {
    const card = document.getElementById('ice-demo-card');
    const rect = card ? card.getBoundingClientRect() : { left: window.innerWidth * 0.5, top: window.innerHeight * 0.5, width: 0, height: 0 };
    const cx = rect.left + rect.width * 0.5;
    const cy = rect.top + rect.height * 0.5;
    tekromancyFX.ice?.shatter(cx, cy, { count: 40, intensity: 1.2 });
    if (window.soundEngine) window.soundEngine.playIceFreeze(1.0);
  });

  bindBtn('btn-ice-freeze', () => {
    tekromancyFX.encircle('#ice-demo-card', 'ice', { duration: 2400, intensity: 1.2 });
    if (window.soundEngine) window.soundEngine.playIceFreeze(0.85);
  });

  bindBtn('btn-ice-highlight', () => {
    tekromancyFX.highlight('#ice-substep-demo', 'ice', { burst: true });
  });

  bindBtn('btn-ice-blizzard', () => {
    tekromancyFX.ice?.startBlizzard(2500, 85);
    if (window.soundEngine) window.soundEngine.playIceFreeze(1.0);
  });

  // Station 08: Unified Orchestrator
  bindBtn('btn-unified-storm', () => {
    tekromancyFX.storm({
      lightning: 85,
      fire: 70,
      smoke: 60,
      plasma: 80,
      water: 60,
      ice: 70
    }, 3000);
    if (window.soundEngine) {
      window.soundEngine.playThunderCrack(1.0);
      setTimeout(() => window.soundEngine?.playPlasmaHum(0.8), 200);
      setTimeout(() => window.soundEngine?.playIceFreeze(0.8), 400);
    }
  });

  bindBtn('btn-unified-encircle', () => {
    tekromancyFX.encircle('#unified-demo-card', ['lightning', 'fire', 'plasma', 'ice'], { duration: 2500 });
    if (window.soundEngine) window.soundEngine.playPlasmaHum(1.0);
  });

  bindBtn('btn-unified-highlight', () => {
    tekromancyFX.highlight('#unified-substep-demo', ['lightning', 'fire', 'plasma', 'ice'], { duration: 2500 });
    if (window.soundEngine) window.soundEngine.playPlasmaHum(1.0);
  });

  bindBtn('btn-unified-clear', () => {
    tekromancyFX.clear();
  });

  // Station 09: Copy Install Command
  bindBtn('btn-copy-install', () => {
    navigator.clipboard.writeText('npm install @tekromancy/tekromancy').then(() => {
      const btn = document.getElementById('btn-copy-install');
      if (btn) {
        const original = btn.textContent;
        btn.textContent = '✓ Copied to Clipboard!';
        setTimeout(() => { btn.textContent = original; }, 2000);
      }
    }).catch(() => {});
  });

  // Global Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    // If user is inside an input/select, ignore
    if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

    if (e.key === 'o' || e.key === 'O') {
      api.goto('overview');
    } else if (e.key === 'm' || e.key === 'M') {
      if (window.soundEngine) {
        const isMuted = window.soundEngine.toggleMute();
        if (muteBtn) {
          muteBtn.classList.toggle('active-toggle', isMuted);
          muteBtn.querySelector('span').textContent = isMuted ? 'Unmute' : 'Mute';
        }
      }
    } else if (e.key === 'a' || e.key === 'A') {
      toggleAutoplay();
    } else if (e.key === 'f' || e.key === 'F') {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    } else if (e.key === 'Escape') {
      api.goto('overview');
    }
  });
}

// Boot presentation when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initShowcase);
} else {
  initShowcase();
}
