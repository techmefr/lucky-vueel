# Lucky Vueel 🎡

Una ruleta para seleccionar aleatoriamente entre una lista de jugadores. Aplicación de página única construida con Nuxt 4 — sin backend, todo persiste en localStorage.

**[Demo en vivo →](https://techmefr.github.io/lucky-vueel/)**

---

## Funcionalidades

- **Ruleta giratoria** — añade tantos jugadores como quieras, gira para elegir un ganador al azar
- **Gestión de jugadores** — activa/desactiva jugadores, elimínalos, retira automáticamente a los ganadores tras cada giro
- **Puntuaciones manuales** — lleva el seguimiento de puntos con botones +/- y edición directa al hacer clic
- **Historial de sorteos** — registro automático de cada giro con el recuento por jugador
- **Móvil** — navegación por pestañas (Jugadores / Ruleta / Estadísticas) con soporte de gestos deslizantes
- **Persistente** — todos los datos guardados en localStorage

## Stack

- [Nuxt 4](https://nuxt.com) — modo SPA, sin SSR
- [Nuxt UI v3](https://ui.nuxt.com) + [Tailwind CSS v4](https://tailwindcss.com)
- [Pinia](https://pinia.vuejs.org) — gestión de estado
- [VueUse](https://vueuse.org) — persistencia localStorage + gestos de swipe
- [canvas-confetti](https://github.com/catdad/canvas-confetti) — animación de victoria

## Arquitectura

Domain-driven design con las capas de Nuxt:

```
layers/
├── domain/player/     — estado de jugadores, colores, reglas de negocio
└── domain/session/    — historial de sorteos, sesión de juego

app/
├── composables/       — useWheelSpin (lógica de giro, confetti)
├── components/        — BaseSpinningWheel, AppPlayerList, AppScoreboard,
│                        AppDrawHistory, AppMobileTabBar
└── pages/index.vue    — layout, navegación con swipe
```

## Inicio rápido

```bash
npm install --legacy-peer-deps
npm run dev
```

## Licencia

MIT
