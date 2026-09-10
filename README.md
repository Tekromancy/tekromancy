# Tekromancy Monorepo

Monorepo housing the core Tekromancy presentation packages and applications.

---

## 📁 Repository Structure

```
tekromancy/
├── apps/
│   └── impressctf/          # 3D Impress.js CTF History & Cyber Ranges presentation
└── packages/
    └── tekromancy/          # @tekromancy/tekromancy shared procedural visual FX library
```

---

## 🚀 Root Scripts

Run these commands directly from the monorepo root:

| Script | Command | Description |
| :--- | :--- | :--- |
| `pnpm dev` | `pnpm --filter impressctf dev` | Start the `impressctf` Vite dev server |
| `pnpm run dev:impressctf` | `pnpm --filter impressctf dev` | Start the `impressctf` dev server explicitly |
| `pnpm run build:impressctf` | `pnpm --filter impressctf build` | Build `impressctf` for production |
| `pnpm run preview:impressctf` | `pnpm --filter impressctf preview` | Preview production build of `impressctf` |
| `pnpm start` | `pnpm --filter impressctf preview` | Alias to preview production build |
| `pnpm build` | `pnpm -r build` | Build all workspace packages in topological order |
| `pnpm test` | `pnpm -r test` | Run tests across all workspace packages |
