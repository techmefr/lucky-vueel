# Lucky Vueel 🎡

Ein Glücksrad zum zufälligen Auswählen aus einer Spielerliste. Single-Page-App mit Nuxt 4 — kein Backend, alles wird im localStorage gespeichert.

**[Live-Demo →](https://techmefr.github.io/lucky-vueel/)**

---

## Funktionen

- **Drehendes Rad** — beliebig viele Spieler hinzufügen, drehen für einen zufälligen Gewinner
- **Spielerverwaltung** — Spieler aktivieren/deaktivieren, entfernen, Gewinner nach jedem Dreh automatisch entfernen
- **Manuelle Punkte** — Spielpunkte mit +/- Tasten und direkter Eingabe per Klick verfolgen
- **Ziehungsverlauf** — automatisches Protokoll jeder Drehung mit Anzahl pro Spieler
- **Mobilfreundlich** — Tab-Navigation (Spieler / Rad / Statistiken) mit Wischgesten-Unterstützung
- **Persistent** — alle Daten im localStorage gespeichert

## Stack

- [Nuxt 4](https://nuxt.com) — SPA-Modus, kein SSR
- [Nuxt UI v3](https://ui.nuxt.com) + [Tailwind CSS v4](https://tailwindcss.com)
- [Pinia](https://pinia.vuejs.org) — State Management
- [VueUse](https://vueuse.org) — localStorage-Persistenz + Wischgesten
- [canvas-confetti](https://github.com/catdad/canvas-confetti) — Siegesanimation

## Architektur

Domain-driven Design mit Nuxt-Layern:

```
layers/
├── domain/player/     — Spielerzustand, Farben, Geschäftsregeln
└── domain/session/    — Ziehungsverlauf, Spielsitzung

app/
├── composables/       — useWheelSpin (Dreh-Logik, Konfetti)
├── components/        — BaseSpinningWheel, AppPlayerList, AppScoreboard,
│                        AppDrawHistory, AppMobileTabBar
└── pages/index.vue    — Layout, Wisch-Navigation
```

## Schnellstart

```bash
npm install --legacy-peer-deps
npm run dev
```

## Lizenz

MIT
