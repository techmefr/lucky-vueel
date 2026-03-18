# Lucky Vueel 🎡

Une roue de la fortune pour tirer au sort parmi une liste de joueurs. Application monopage construite avec Nuxt 4 — pas de backend, tout persiste dans le localStorage.

**[Démo live →](https://techmefr.github.io/lucky-vueel/)**

---

## Fonctionnalités

- **Roue tournante** — ajoutez autant de joueurs que vous voulez, tournez pour désigner un gagnant au hasard
- **Gestion des joueurs** — activez/désactivez les joueurs, supprimez-les, retirez automatiquement les gagnants après chaque tirage
- **Scores manuels** — suivez les points de partie avec des boutons +/- et une saisie directe au clic
- **Historique des tirages** — journal automatique de chaque spin avec le nombre de fois par joueur
- **Mobile** — navigation par onglets (Joueurs / Roue / Stats) avec support du swipe
- **Persistant** — toutes les données sont sauvegardées dans le localStorage

## Stack

- [Nuxt 4](https://nuxt.com) — mode SPA, sans SSR
- [Nuxt UI v3](https://ui.nuxt.com) + [Tailwind CSS v4](https://tailwindcss.com)
- [Pinia](https://pinia.vuejs.org) — gestion d'état
- [VueUse](https://vueuse.org) — persistance localStorage + gestes de swipe
- [canvas-confetti](https://github.com/catdad/canvas-confetti) — animation de victoire

## Architecture

Domain-driven design avec les layers Nuxt :

```
layers/
├── domain/player/     — état des joueurs, couleurs, règles métier
└── domain/session/    — historique des tirages, session de jeu

app/
├── composables/       — useWheelSpin (logique de spin, confetti)
├── components/        — BaseSpinningWheel, AppPlayerList, AppScoreboard,
│                        AppDrawHistory, AppMobileTabBar
└── pages/index.vue    — layout, navigation par swipe
```

## Démarrage

```bash
npm install --legacy-peer-deps
npm run dev
```

> `--legacy-peer-deps` est nécessaire car `@nuxt/ui@3` a une dépendance paire sur vue-router 4 alors que Nuxt 4 embarque vue-router 5.

## Déploiement

Le projet se déploie automatiquement sur GitHub Pages à chaque push sur `main` via `.github/workflows/deploy.yml`.

Pour l'héberger sur votre propre GitHub Pages :

1. Forkez le dépôt
2. Allez dans **Settings → Pages → Source → GitHub Actions**
3. Poussez sur `main` — le workflow fait le reste

## Licence

MIT
