# Lucky Vueel 🎡

A spinning wheel for picking players at random. Built as a single-page app with Nuxt 4 — no backend, everything persists in localStorage.

**[Live demo →](https://techmefr.github.io/lucky-vueel/)**

---

## Features

- **Spinning wheel** — add up to any number of players, spin to pick a random winner
- **Player management** — toggle players active/inactive, remove them, optionally auto-remove winners after each spin
- **Manual scores** — track game points per player with +/- controls and click-to-edit
- **Draw history** — automatic log of every spin with per-player counts and a progress bar
- **Mobile-first** — three-tab navigation (Players / Wheel / Stats) with swipe gesture support
- **Persistent** — all data stored in localStorage, survives page refresh

## Stack

- [Nuxt 4](https://nuxt.com) — SPA mode, no SSR
- [Nuxt UI v3](https://ui.nuxt.com) + [Tailwind CSS v4](https://tailwindcss.com)
- [Pinia](https://pinia.vuejs.org) — state management
- [VueUse](https://vueuse.org) — localStorage persistence + swipe gestures
- [canvas-confetti](https://github.com/catdad/canvas-confetti) — win celebration

## Architecture

Domain-driven design with Nuxt layers:

```
layers/
├── domain/player/     — player state, colors, business rules
└── domain/session/    — spin history, game session

app/
├── composables/       — useWheelSpin (spin logic, confetti)
├── components/        — BaseSpinningWheel, AppPlayerList, AppScoreboard,
│                        AppDrawHistory, AppMobileTabBar
└── pages/index.vue    — layout, swipe navigation
```

## Getting started

```bash
npm install --legacy-peer-deps
npm run dev
```

> `--legacy-peer-deps` is needed because `@nuxt/ui@3` has a peer dependency on vue-router 4 while Nuxt 4 ships vue-router 5.

## Deploy

The project deploys automatically to GitHub Pages on every push to `main` via `.github/workflows/deploy.yml`.

To host on your own GitHub Pages:

1. Fork the repository
2. Go to **Settings → Pages → Source → GitHub Actions**
3. Push to `main` — the workflow handles the rest

The base URL is set automatically via `NUXT_APP_BASE_URL` in the workflow.

## License

MIT
