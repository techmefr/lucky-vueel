# Lucky Vueel 🎡

Una ruota della fortuna per selezionare casualmente tra una lista di giocatori. App a pagina singola costruita con Nuxt 4 — nessun backend, tutto persiste nel localStorage.

**[Demo live →](https://techmefr.github.io/lucky-vueel/)**

---

## Funzionalità

- **Ruota girevole** — aggiungi tutti i giocatori che vuoi, gira per scegliere un vincitore a caso
- **Gestione giocatori** — attiva/disattiva i giocatori, rimuovili, rimuovi automaticamente i vincitori dopo ogni giro
- **Punteggi manuali** — tieni traccia dei punti di partita con i pulsanti +/- e modifica diretta al clic
- **Storico estrazioni** — registro automatico di ogni giro con il conteggio per giocatore
- **Mobile-first** — navigazione a schede (Giocatori / Ruota / Statistiche) con supporto gesture di scorrimento
- **Persistente** — tutti i dati salvati nel localStorage

## Stack

- [Nuxt 4](https://nuxt.com) — modalità SPA, senza SSR
- [Nuxt UI v3](https://ui.nuxt.com) + [Tailwind CSS v4](https://tailwindcss.com)
- [Pinia](https://pinia.vuejs.org) — gestione dello stato
- [VueUse](https://vueuse.org) — persistenza localStorage + gesture di swipe
- [canvas-confetti](https://github.com/catdad/canvas-confetti) — animazione di vittoria

## Architettura

Domain-driven design con i layer di Nuxt:

```
layers/
├── domain/player/     — stato dei giocatori, colori, regole di business
└── domain/session/    — storico delle estrazioni, sessione di gioco

app/
├── composables/       — useWheelSpin (logica di rotazione, confetti)
├── components/        — BaseSpinningWheel, AppPlayerList, AppScoreboard,
│                        AppDrawHistory, AppMobileTabBar
└── pages/index.vue    — layout, navigazione con swipe
```

## Avvio

```bash
npm install --legacy-peer-deps
npm run dev
```

## Licenza

MIT
