# ⚡ Tekromancy 3D Showcase Presentation

> An interactive 3D [impress.js](https://impress.js.org/) presentation showcasing the `@tekromancy/tekromancy` elemental visual effects engine across a celestial sphere with multi-axis barrel rolls and a dual-layer Cyberpunk Globe constellation.

[![GitHub Repository](https://img.shields.io/badge/GitHub-Tekromancy%2Ftekromancy-blue?logo=github)](https://github.com/Tekromancy/tekromancy)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Part of Tekromancy Monorepo](https://img.shields.io/badge/monorepo-apps%2Ftekromancy-purple.svg)](https://github.com/Tekromancy/tekromancy)

---

## 🔗 Repository & Links

- **Main Monorepo**: [https://github.com/Tekromancy/tekromancy](https://github.com/Tekromancy/tekromancy)
- **NPM Package**: [https://www.npmjs.com/package/@tekromancy/tekromancy](https://www.npmjs.com/package/@tekromancy/tekromancy)
- **Website**: [https://tekromancy.com](https://tekromancy.com)

---

## ⚡ Quick Start

### 1. Launch via Monorepo Root (Recommended)

```bash
# From the monorepo root:
pnpm run dev:tekromancy
```

Open `http://localhost:5174` in your browser.

### 2. Launch from Application Directory

```bash
cd apps/tekromancy
pnpm install
pnpm dev
```

### 3. Production Build & Preview

```bash
pnpm run build:tekromancy
pnpm run preview:tekromancy
```

---

## 🎮 Presentation Controls & Navigation

| Key / Control | Action |
| :--- | :--- |
| <kbd>Space</kbd> / <kbd>→</kbd> / <kbd>Page Down</kbd> | Advance to next 3D station or substep |
| <kbd>←</kbd> / <kbd>Page Up</kbd> | Return to previous station |
| <kbd>O</kbd> | Jump to **Cyberpunk Globe Constellation Overview** (`#overview`) |
| <kbd>M</kbd> | Toggle **Web Audio Synthesizer FX** (warp whooshes, clicks, sirens) |
| <kbd>F</kbd> | Toggle **Fullscreen Mode** |
| <kbd>A</kbd> | Toggle **Autoplay Mode** (7s transit per station) |
| <kbd>P</kbd> | Open **Speaker Notes / Presenter Console** |
| <kbd>?</kbd> or <kbd>H</kbd> | Toggle **Help & Keyboard Shortcuts HUD** |
| **Orbital Node Cards** | Direct jump to any station when viewing the Cyberpunk Globe overview |
| **Interactive FX Buttons** | Trigger bursts, strikes, encircles, storms, and per-element highlights |

---

## 🛰️ 3D Celestial Flight Path ($R = 9,000$)

All 11 stations are distributed along a 3D celestial sphere of radius $R = 9,000$ across all 8 octants, separated by $7,500$–$10,000$ coordinate units with continuous multi-axis barrel rolls and loops:

| Station ID | Title / Engine | 3D Coordinates $(X, Y, Z)$ | 3D Rotations $(RX, RY, RZ)$ | Visual FX Demonstrated |
| :--- | :--- | :--- | :--- | :--- |
| **`#tekromancy-portal`** | Orbital Gateway | $(0, -14000, 28000)$ [scale 8] | $(-35^\circ, 60^\circ, 720^\circ)$ | Warp plunge into the presentation |
| **`#manifesto`** | Manifesto | $(0, 0, 9000)$ [scale 1] | $(0^\circ, 0^\circ, 0^\circ)$ | Core principles & live elemental highlights |
| **`#station-lightning`** | ⚡ Lightning Engine | $(5619, -4225, 5619)$ | $(-28^\circ, 405^\circ, 360^\circ)$ | Fractal bolts, stroboscopic flashes, storms |
| **`#station-fire`** | 🔥 Fire Engine | $(8345, 3371, 0)$ | $(22^\circ, 810^\circ, 720^\circ)$ | Convective flames, embers, fireballs, infernos |
| **`#station-smoke`** | 💨 Smoke Engine | $(5397, -4769, -5397)$ | $(-32^\circ, 1215^\circ, 1080^\circ)$ | Volumetric billows, tactical poofs, ground haze |
| **`#station-plasma`** | ⚛️ Plasma Engine | $(0, 2781, -8560)$ | $(18^\circ, 1620^\circ, 1440^\circ)$ | Tesla plasma orbs, ionized tendrils, tempests |
| **`#station-water`** | 💧 Water Engine | $(-5619, -4225, -5619)$ | $(-28^\circ, 2025^\circ, 1800^\circ)$ | Splash impacts, wave ripples, rain storms |
| **`#station-ice`** | ❄️ Ice Engine | $(-8222, 3660, 0)$ | $(24^\circ, 2430^\circ, 2160^\circ)$ | Frost crystallization, shard shatter, blizzards |
| **`#station-unified`** | 🎛️ Unified FX Engine | $(-5511, -4500, 5511)$ | $(-30^\circ, 2835^\circ, 2520^\circ)$ | Multi-element apocalypse storm, highlighter |
| **`#station-guide`** | 📦 Integration Guide | $(0, 6688, 6022)$ | $(48^\circ, 3240^\circ, 2880^\circ)$ | npm install, quickstart snippets, copy tool |
| **`#overview`** | 🌐 Cyberpunk Globe | $(0, 0, 24000)$ [scale 18] | $(0^\circ, 3600^\circ, 3600^\circ)$ | Constellation overview, telemetry, orbital deck |

---

## 🌐 Cyberpunk Globe Constellation (`#overview`)

The final overview step frames the entire 3D ecosystem via a dual-layer architectural design:

1. **In-DOM CSS 3D Wireframe Mesh (`.cyber-globe-mesh`):**
   - Positioned at origin $(0, 0, 0)$ with `preserve-3d`.
   - $18,000\text{px}$ diameter cyan equatorial ring.
   - 4 meridian rings ($0^\circ, 45^\circ, 90^\circ, 135^\circ$) and dual latitude rings ($\pm 30^\circ$).
   - $19,600\text{px}$ inclined orbital trajectory ring with continuous keyframe rotation.
   - Central glowing cyan/magenta cybernetic core.

2. **Procedural Background Canvas (`js/cyber-canvas.js`):**
   - 60 FPS orthographic 3D projection loop.
   - Rotating wireframe parallels and meridians.
   - Pulsing station node beacons with distance attenuation.
   - Slerp-interpolated great-circle laser constellation arcs with traveling energy pulse packets.

3. **Telemetry HUD & Orbital Selector Deck:**
   - Real-time orbital coordinates $(X, Y, Z)$, inclination, and node status readouts.
   - 9 interactive orbital cards allowing viewers to jump directly to any station on the globe.

---

## 🛠️ Tech Stack & Architecture

- **Core Presentation Framework:** Vendored `impress.js` utilizing hardware-accelerated CSS3 3D transforms.
- **FX Engine:** [`@tekromancy/tekromancy`](https://www.npmjs.com/package/@tekromancy/tekromancy) zero-dependency procedural visual effects library.
- **Audio Synthesizer:** Pure Web Audio API (`js/audio-fx.js`) synthesizing procedural warp whooshes and terminal clicks with zero external audio assets.
- **Build Tool:** [Vite](https://vitejs.dev/) with ES module bundling.

---

## 📄 License & Repository

- **GitHub Repository:** [https://github.com/Tekromancy/tekromancy](https://github.com/Tekromancy/tekromancy)
- **License:** MIT © [Joshua Edward McLaughlin Cox](https://github.com/coxjosh) / [Tekromancy](https://tekromancy.com)
