# Lucky Vueel 🎡

Uma roda da fortuna para selecionar aleatoriamente entre uma lista de jogadores. Aplicação de página única construída com Nuxt 4 — sem backend, tudo persiste no localStorage.

**[Demo ao vivo →](https://techmefr.github.io/lucky-vueel/)**

---

## Funcionalidades

- **Roda giratória** — adicione quantos jogadores quiser, gire para escolher um vencedor aleatório
- **Gestão de jogadores** — ative/desative jogadores, remova-os, retire automaticamente os vencedores após cada giro
- **Pontuações manuais** — acompanhe os pontos da partida com botões +/- e edição direta ao clicar
- **Histórico de sorteios** — registo automático de cada giro com a contagem por jogador
- **Mobile-first** — navegação por abas (Jogadores / Roda / Estatísticas) com suporte a gestos de deslize
- **Persistente** — todos os dados guardados no localStorage

## Stack

- [Nuxt 4](https://nuxt.com) — modo SPA, sem SSR
- [Nuxt UI v3](https://ui.nuxt.com) + [Tailwind CSS v4](https://tailwindcss.com)
- [Pinia](https://pinia.vuejs.org) — gestão de estado
- [VueUse](https://vueuse.org) — persistência localStorage + gestos de swipe
- [canvas-confetti](https://github.com/catdad/canvas-confetti) — animação de vitória

## Arquitetura

Domain-driven design com as camadas do Nuxt:

```
layers/
├── domain/player/     — estado dos jogadores, cores, regras de negócio
└── domain/session/    — histórico de sorteios, sessão de jogo

app/
├── composables/       — useWheelSpin (lógica de rotação, confetti)
├── components/        — BaseSpinningWheel, AppPlayerList, AppScoreboard,
│                        AppDrawHistory, AppMobileTabBar
└── pages/index.vue    — layout, navegação com swipe
```

## Início rápido

```bash
npm install --legacy-peer-deps
npm run dev
```

## Licença

MIT
