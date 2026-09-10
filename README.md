# ⚡ Tekromancy Monorepo

> High-voltage procedural visual FX engines, interactive 3D presentations, and cybernetic web experiments.

[![GitHub Repository](https://img.shields.io/badge/GitHub-Tekromancy%2Ftekromancy-blue?logo=github)](https://github.com/Tekromancy/tekromancy)
[![npm version](https://img.shields.io/npm/v/@tekromancy/tekromancy.svg)](https://www.npmjs.com/package/@tekromancy/tekromancy)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![pnpm workspace](https://img.shields.io/badge/pnpm-workspace-orange.svg)](https://pnpm.io/workspaces)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)]()

---

## 🔗 Main Repository & Links

- **Main Repository:** [https://github.com/Tekromancy/tekromancy](https://github.com/Tekromancy/tekromancy)
- **NPM Package:** [https://www.npmjs.com/package/@tekromancy/tekromancy](https://www.npmjs.com/package/@tekromancy/tekromancy)
- **Official Website:** [https://tekromancy.com](https://tekromancy.com)
- **Issue Tracker:** [https://github.com/Tekromancy/tekromancy/issues](https://github.com/Tekromancy/tekromancy/issues)

---

## 📁 Repository Structure

```
tekromancy/
├── packages/
│   └── tekromancy/              # @tekromancy/tekromancy (Published on npm)
│       ├── src/
│       │   ├── lightning/       # High-voltage lightning & stroboscopic flashes
│       │   ├── fire/            # Convective flames, embers & firestorms
│       │   ├── smoke/           # Volumetric smoke, tactical poofs & ground haze
│       │   ├── plasma/          # Tesla plasma orbs & electromagnetic arcs
│       │   ├── water/           # Fluid surface ripples, splashes & rain downpours
│       │   ├── ice/             # Dendritic frost crystallization & blizzard flurries
│       │   └── core/            # TekromancyFX, ElementHighlighter & StationFXController
│       └── package.json
│
├── apps/
│   ├── tekromancy/              # 3D Cyberpunk Celestial Sphere Showcase Presentation
│   │   ├── css/                 # Cyberpunk HUD & in-DOM 3D wireframe globe CSS
│   │   ├── js/
│   │   │   ├── cyber-canvas.js  # 3D procedural wireframe parallels, meridians & arcs
│   │   │   ├── audio-fx.js      # Procedural Web Audio synthesizer (warp whooshes & clicks)
│   │   │   └── presentation.js  # Orchestration, telemetry HUD & orbital selector deck
│   │   ├── index.html           # 11-station 3D flight path in spherical coordinates (R=9,000)
│   │   └── package.json
│   │
│   └── impressctf/              # "The Crucible of Hackers" 3D Presentation
│       ├── css/                 # Presentation styles & CRT terminal simulator
│       ├── js/                  # impress.js runtime & slide controller
│       ├── index.html           # 15-station flight path covering CTF history
│       └── package.json
│
├── package.json                 # Monorepo root configuration & scripts
├── pnpm-workspace.yaml          # PNPM multi-package workspace definition
└── README.md                    # This documentation file
```

---

## 🚀 Quick Start

### 1. Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18+) and [pnpm](https://pnpm.io/) (v9+ or v11+) installed:

```bash
# Enable pnpm via Corepack if needed
corepack enable
```

### 2. Clone and Install Dependencies

```bash
git clone https://github.com/Tekromancy/tekromancy.git
cd tekromancy
pnpm install
```

### 3. Launch Development Servers

Run either of the interactive 3D presentations:

```bash
# Launch the Tekromancy 3D FX Showcase (default port http://localhost:5174)
pnpm dev:tekromancy

# Launch "The Crucible of Hackers" CTF History Presentation (default port http://localhost:5173)
pnpm dev:impressctf
```

---

## 💻 Monorepo Scripts Reference

All commands can be executed from the root directory:

| Script | Command | Description |
| :--- | :--- | :--- |
| `pnpm dev` | `pnpm --filter impressctf dev` | Start the default development server (`impressctf`) |
| `pnpm run dev:tekromancy` | `pnpm --filter @tekromancy/showcase dev` | Launch the Tekromancy 3D FX showcase app |
| `pnpm run dev:impressctf` | `pnpm --filter impressctf dev` | Launch the Crucible of Hackers CTF presentation |
| `pnpm run build` | `pnpm -r build` | Build all workspace packages and applications |
| `pnpm run build:package` | `pnpm --filter @tekromancy/tekromancy build` | Bundle the `@tekromancy/tekromancy` npm library |
| `pnpm run build:tekromancy` | `pnpm --filter @tekromancy/showcase build` | Build static production bundle for Tekromancy showcase |
| `pnpm run build:impressctf` | `pnpm --filter impressctf build` | Build static production bundle for `impressctf` |
| `pnpm run preview:tekromancy` | `pnpm --filter @tekromancy/showcase preview` | Preview production build of Tekromancy showcase |
| `pnpm run preview:impressctf` | `pnpm --filter impressctf preview` | Preview production build of `impressctf` |
| `pnpm test` | `pnpm -r test` | Run syntax validation and test suites across all packages |

---

## 📦 Packages & Applications

### 1. `@tekromancy/tekromancy` (NPM Library)
- **Path:** [`packages/tekromancy`](https://github.com/Tekromancy/tekromancy/tree/main/packages/tekromancy)
- **NPM Package:** [`@tekromancy/tekromancy`](https://www.npmjs.com/package/@tekromancy/tekromancy)
- **Description:** Zero-dependency visual effects engine providing procedural Canvas 2D effects and CSS animations for presentations (impress.js, Reveal.js) and interactive web applications.
- **Includes:**
  - **⚡ Lightning**: Fractal sky-to-ground bolts, stroboscopic screen flashes, perimeter encircling, target strikes.
  - **🔥 Fire**: Convective turbulent flames, rising incandescent embers, fireball bursts, infernos.
  - **💨 Smoke**: Volumetric expanding smoke poofs, creeping battlefield fog, stealth engulfment.
  - **⚛️ Plasma**: Concentrated Tesla plasma orbs, ionized gas tendrils, magnetic containment fields.
  - **💧 Water**: Surface splash impacts, concentric elliptical ripples, rain storms.
  - **❄️ Ice**: Dendritic frost crystallization, shattering crystalline geometric shards, blizzard flurries.
  - **✨ ElementHighlighter**: Highlights newly revealed bullet points, cards, and diagrams with elemental perimeter animations.
  - **🎛️ StationFXController**: Declarative slide transition orchestrator using the intuitive 1–100 intensity scale.

See [`packages/tekromancy/README.md`](https://github.com/Tekromancy/tekromancy/tree/main/packages/tekromancy#readme) for full API documentation and recipes.

---

### 2. `apps/tekromancy` (3D Showcase Presentation)
- **Path:** [`apps/tekromancy`](https://github.com/Tekromancy/tekromancy/tree/main/apps/tekromancy)
- **Description:** A futuristic 3D impress.js presentation demonstrating every elemental engine in action.
- **Key Features:**
  - **Celestial Sphere Layout ($R = 9,000$):** All presentation stations are distributed along the 3D celestial sphere across all 8 octants, separated by $7,500$–$10,000$ units.
  - **Full Multi-Rotation Transitions:** 360°, 720°, and 1080° multi-axis corkscrews and barrel rolls between stations.
  - **Dual-Layer Cyberpunk Globe Constellation:** Overview step (`#overview`) featuring a procedural 60 FPS background canvas with 3D wireframe parallels, meridians, station beacons, and great-circle laser arcs, plus an in-DOM CSS 3D equator and orbital ring.
  - **Interactive Controls:** On-screen buttons to trigger live elemental strikes, storms, and per-element highlights directly from the presentation.

---

### 3. `apps/impressctf` ("The Crucible of Hackers")
- **Path:** [`apps/impressctf`](https://github.com/Tekromancy/tekromancy/tree/main/apps/impressctf)
- **Description:** 3D impress.js presentation tracing 30 years of CTF history, Red vs. Blue teaming doctrines, and open-source cyber ranges.
- **Features:** 15 stations, CRT terminal simulator, Web Audio synthesizer soundscapes, and lightning highlight integrations powered by `@tekromancy/tekromancy`.

---

## 🚢 Publishing to NPM

To publish a new version of `@tekromancy/tekromancy` to npm:

```bash
# 1. Build the library bundles and CSS dist files
pnpm run build:package

# 2. Verify all syntax checks pass
pnpm test

# 3. Publish to npm (requires npm login with 2FA)
cd packages/tekromancy
npm publish --access public
```

---

## 📄 License & Attribution

- **License:** MIT © [Joshua Edward McLaughlin Cox](https://github.com/coxjosh) / [Tekromancy](https://tekromancy.com)
- **GitHub Repository:** [https://github.com/Tekromancy/tekromancy](https://github.com/Tekromancy/tekromancy)
