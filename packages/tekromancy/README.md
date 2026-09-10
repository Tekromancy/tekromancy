# @tekromancy/tekromancy

> High-voltage procedural visual effects engine for presentations, interactive web applications, and cybernetic user interfaces. Includes **Lightning**, **Fire**, **Smoke**, **Plasma**, **Water**, **Ice**, and **Unified Multi-Element Orchestrators**.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)]()
[![npm version](https://img.shields.io/npm/v/@tekromancy/tekromancy.svg)](https://www.npmjs.com/package/@tekromancy/tekromancy)

---

## ⚡ Elemental FX Systems

| Module | Core Class | Visual Specialization | Primary Methods |
| :--- | :--- | :--- | :--- |
| **⚡ Lightning** | `LightningGenerator` | Stroboscopic return-stroke flashes, fractal sky/ground bolts, target strikes | `flash()`, `strikeTarget()`, `encircle()`, `startStorm()` |
| **🔥 Fire** | `FireGenerator` | Convective flames, turbulent rising embers, heat distortion, fireballs | `burst()`, `encircle()`, `startInferno()` |
| **💨 Smoke** | `SmokeGenerator` | Volumetric gas billows, expanding puffs, tactical smoke poofs, ground fog | `burst()`, `engulf()`, `startHaze()` |
| **⚛️ Plasma** | `PlasmaGenerator` | Ionized gas tendrils, Tesla plasma orbs, toroidal containment fields | `strikeOrb()`, `encircle()`, `startTempest()` |
| **💧 Water** | `WaterGenerator` | Fluid surface ripples, rain downpours, droplet splashes, caustic sheen | `splash()`, `encircle()`, `startRain()` |
| **❄️ Ice** | `IceGenerator` | Dendritic frost crystallization, shattering ice shards, blizzard flurries | `freeze()`, `shatter()`, `startBlizzard()` |
| **🎛️ Core / Unified** | `TekromancyFX` | Unified multi-element coordinator & slide controller | `storm()`, `encircle()`, `StationFXController` |

---

## 📦 Installation

```bash
npm install @tekromancy/tekromancy
# or
pnpm add @tekromancy/tekromancy
# or
yarn add @tekromancy/tekromancy
```

### Monorepo Workspace (pnpm)
```json
{
  "dependencies": {
    "@tekromancy/tekromancy": "workspace:*"
  }
}
```

### Direct Browser Script / CDN (IIFE)
```html
<!-- Combined stylesheet -->
<link rel="stylesheet" href="node_modules/@tekromancy/tekromancy/dist/tekromancy.css">

<!-- UMD or IIFE bundle -->
<script src="node_modules/@tekromancy/tekromancy/dist/tekromancy.iife.js"></script>
<script>
  const { LightningGenerator, FireGenerator, SmokeGenerator, PlasmaGenerator, WaterGenerator, IceGenerator, TekromancyFX } = window.tekromancy;
</script>
```

---

## 🚀 Quickstart Recipes

### 1. Unified Multi-Element Orchestrator (`TekromancyFX`)
Launch multiple visual effects simultaneously with unified lifecycle management:

```javascript
import { TekromancyFX } from '@tekromancy/tekromancy';
import '@tekromancy/tekromancy/tekromancy.css';

const fx = new TekromancyFX();

// Unleash an apocalyptic storm combining lightning, rain, and fire!
fx.storm({
  lightning: 75,
  water: 60,
  fire: 40
}, 3000);

// Encircle a card with both crackling electricity and frost
fx.encircle('#hero-card', ['lightning', 'ice'], { duration: 1500 });
```

---

### 2. High-Voltage Lightning (`LightningGenerator`)

```javascript
import { LightningGenerator } from '@tekromancy/tekromancy/lightning';
import '@tekromancy/tekromancy/lightning.css';

const lightning = new LightningGenerator({
  primaryColor: '#00f0ff',
  secondaryColor: '#b026ff'
});

// Stroboscopic screen flash
lightning.flash(1.0, 180);

// Strike an element or coordinate
lightning.strikeTarget(window.innerWidth * 0.5, window.innerHeight * 0.6);

// Encircle an element with high-voltage arcs
lightning.encircle(document.querySelector('#target-card'), {
  duration: 800,
  intensity: 1.2
});

// Atmospheric storm scaled on the 1–100 intensity scale
lightning.startStorm(2500, 75);
```

---

### 3. Convective Fire & Embers (`FireGenerator`)

```javascript
import { FireGenerator } from '@tekromancy/tekromancy/fire';
import '@tekromancy/tekromancy/fire.css';

const fire = new FireGenerator({ theme: 'amber' }); // 'amber' | 'blue' | 'green' | 'purple'

// Explosive fireball burst
fire.burst(window.innerWidth * 0.5, window.innerHeight * 0.5, {
  count: 45,
  intensity: 1.2
});

// Encircle a DOM badge with licking flames
fire.encircle('#burn-badge', { duration: 1200, intensity: 1.0 });

// Screen-wide inferno storm (1-100 scale)
fire.startInferno(2500, 60);
```

---

### 4. Volumetric Smoke & Tactical Fog (`SmokeGenerator`)

```javascript
import { SmokeGenerator } from '@tekromancy/tekromancy/smoke';
import '@tekromancy/tekromancy/smoke.css';

const smoke = new SmokeGenerator({ theme: 'gray' }); // 'gray' | 'dark' | 'toxic' | 'cyan' | 'purple'

// Tactical smoke grenade poof
smoke.burst(400, 300, { count: 30, intensity: 1.0 });

// Engulf an element in swirling fog
smoke.engulf('#secret-data', { duration: 1500 });

// Creeping atmospheric haze / battlefield fog
smoke.startHaze(3000, 50);
```

---

### 5. Iridescent Plasma & Arc Fields (`PlasmaGenerator`)

```javascript
import { PlasmaGenerator } from '@tekromancy/tekromancy/plasma';
import '@tekromancy/tekromancy/plasma.css';

const plasma = new PlasmaGenerator({ theme: 'magenta' }); // 'magenta' | 'cyan' | 'violet' | 'solar'

// Strike a concentrated Tesla plasma orb with pulsating tendrils
plasma.strikeOrb(window.innerWidth * 0.5, window.innerHeight * 0.4, {
  radius: 80,
  tendrilCount: 16
});

// Encircle an element with a toroidal magnetic plasma field
plasma.encircle('#core-reactor', { duration: 1000, intensity: 1.2 });

// Electromagnetic plasma tempest
plasma.startTempest(2500, 70);
```

---

### 6. Fluid Water, Rain & Ripples (`WaterGenerator`)

```javascript
import { WaterGenerator } from '@tekromancy/tekromancy/water';
import '@tekromancy/tekromancy/water.css';

const water = new WaterGenerator({ theme: 'cyan' }); // 'cyan' | 'deep' | 'emerald' | 'mercury'

// Droplet splash and concentric elliptical wave ripple
water.splash(500, 400, { scale: 1.2, dropletCount: 10 });

// Cascading fluid ripples around a card
water.encircle('#fluid-card', { duration: 1200 });

// Rain downpour storm with surface splashes
water.startRain(2500, 60);
```

---

### 7. Sub-Zero Frost & Crystallization (`IceGenerator`)

```javascript
import { IceGenerator } from '@tekromancy/tekromancy/ice';
import '@tekromancy/tekromancy/ice.css';

const ice = new IceGenerator({ theme: 'frost' }); // 'frost' | 'glacial' | 'rime' | 'void'

// Freeze: dendritic frost creeps outward along element borders
ice.freeze('#glacier-heading', { duration: 1800, intensity: 1.0 });

// Shatter: explosive burst of crystalline geometric shards
ice.shatter(window.innerWidth * 0.5, window.innerHeight * 0.5, { count: 35 });

// Blizzard storm: swirling flurry shards and frozen wind
ice.startBlizzard(2500, 65);
```

---

## 🎛️ The 1–100 Presentation Intensity Scale

Tekromancy uses an intuitive **1–100 intensity scale** for presentation transitions and atmospheric storms:

| Scale | Level | Lightning | Fire | Smoke | Plasma | Water | Ice |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1 – 20** | *Subtle* | Rare single bolts, gentle wash | Light floating embers | Soft translucent haze | Delicate micro-arcs | Gentle drizzle | Light rim frost |
| **21 – 50** | *Moderate* | 3–4 branching sky strikes | Convective fire column | Rolling fog bank | Pulsing Tesla orb | Steady rainfall | Branching crystals |
| **51 – 80** | *Heavy* | Stroboscopic multi-forks | Blazing inferno | Dense smoke screen | Turbulent magnetic field | Torrential downpour | Creeping freeze |
| **81 – 100** | *Apocalyptic*| Continuous tempest barrage | Raging firestorm | Zero-visibility shroud | Electromagnetic tempest | Tropical typhoon | Full blizzard freeze |

---

## 📽️ Presentation Integration

### Impress.js
```javascript
import { TekromancyFX, StationFXController } from '@tekromancy/tekromancy';

const fx = new TekromancyFX();
const controller = new StationFXController({
  'intro': { lightning: 75 },
  'inferno-station': { fire: 80, smoke: 50 },
  'arctic-station': { ice: 90 },
  'hydra-station': { water: 70 }
});

// HTML data-attribute overrides:
// <div id="custom-slide" class="step" data-lightning="80" data-fire="40">
document.addEventListener('impress:stepenter', (e) => {
  const settings = controller.get(e.target);
  fx.storm(settings, 2000);
});
```

### Reveal.js
```javascript
import { TekromancyFX } from '@tekromancy/tekromancy';

const fx = new TekromancyFX();
Reveal.on('slidechanged', (event) => {
  const currentSlide = event.currentSlide;
  const fxType = currentSlide.getAttribute('data-fx'); // e.g. "fire", "ice", "lightning"
  if (fxType) {
    fx.storm({ [fxType]: 70 }, 2000);
  }
});
```

---

## ✨ Highlighting Newly Drawn Elements (`ElementHighlighter`)

Highlight newly revealed bullet points, diagrams, cards, or dynamic UI elements with elemental perimeter energy whenever they enter the screen:

```javascript
import { TekromancyFX, ElementHighlighter } from '@tekromancy/tekromancy';

const fx = new TekromancyFX();

// 1. Explicitly highlight any element on demand:
fx.highlight('#my-card', 'lightning', { duration: 800 });
fx.highlight('#fire-badge', 'fire', { duration: 1000 });
fx.highlight('#stealth-box', 'smoke', { duration: 1200 });
fx.highlight('#plasma-core', 'plasma', { duration: 900 });
fx.highlight('#fluid-graph', 'water', { duration: 1000 });
fx.highlight('#frozen-stat', 'ice', { duration: 1100 });

// 2. Automate substep / fragment reveals in presentation frameworks:
fx.attachSubsteps({
  stationController: controller, // Automatically applies the slide's dominant element!
  autoFlash: true,               // Micro-flash on electric/plasma reveals
  selector: '.substep, .fragment'
});
```

### Declarative Element Overrides
Individual HTML elements can specify their own elemental reveal effect via `data-fx` or `data-[element]`:
```html
<div class="step" data-fire="80">
  <h2>Inferno Station</h2>
  <!-- Inherits fire from slide -->
  <p class="substep">Standard bullet point ignites with fire</p>
  
  <!-- Overrides with specific elements -->
  <p class="substep" data-fx="lightning">Override: Strikes with electricity</p>
  <p class="substep" data-fx="ice">Override: Freezes with creeping frost</p>
  <p class="substep" data-fx="plasma">Override: Glows with Tesla plasma</p>
  <p class="substep" data-fx="water">Override: Splashes with fluid ripples</p>
  <p class="substep" data-fx="smoke">Override: Materializes from smoke</p>
</div>
```

---

## 🎨 Stylesheets

You can import all styles at once or import individual component stylesheets:

```javascript
// Complete bundle
import '@tekromancy/tekromancy/tekromancy.css';

// Or granular imports:
import '@tekromancy/tekromancy/lightning.css';
import '@tekromancy/tekromancy/fire.css';
import '@tekromancy/tekromancy/smoke.css';
import '@tekromancy/tekromancy/plasma.css';
import '@tekromancy/tekromancy/water.css';
import '@tekromancy/tekromancy/ice.css';
```

---

## 📄 License

MIT © Joshua Cox / [Tekromancy](https://tekromancy.com)
