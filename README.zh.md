# Lucky Vueel 🎡

一个随机抽取玩家的幸运转盘。基于 Nuxt 4 构建的单页应用——无需后端，所有数据保存在 localStorage 中。

**[在线演示 →](https://techmefr.github.io/lucky-vueel/)**

---

## 功能特性

- **旋转转盘** — 添加任意数量的玩家，转动转盘随机选出获胜者
- **玩家管理** — 启用/禁用玩家、删除玩家，可在每次抽取后自动移除获胜者
- **手动计分** — 通过 +/- 按钮或点击直接输入来追踪每位玩家的积分
- **抽取记录** — 自动记录每次转动，显示每位玩家的抽中次数和进度条
- **移动端优先** — 底部标签导航（玩家 / 转盘 / 统计），支持左右滑动手势
- **数据持久化** — 所有数据保存在 localStorage 中，刷新页面不会丢失

## 技术栈

- [Nuxt 4](https://nuxt.com) — SPA 模式，无 SSR
- [Nuxt UI v3](https://ui.nuxt.com) + [Tailwind CSS v4](https://tailwindcss.com)
- [Pinia](https://pinia.vuejs.org) — 状态管理
- [VueUse](https://vueuse.org) — localStorage 持久化 + 滑动手势
- [canvas-confetti](https://github.com/catdad/canvas-confetti) — 获胜庆祝动画

## 项目架构

基于领域驱动设计（DDD）的 Nuxt 分层架构：

```
layers/
├── domain/player/     — 玩家状态、颜色、业务规则
└── domain/session/    — 抽取记录、游戏会话

app/
├── composables/       — useWheelSpin（转动逻辑、彩纸效果）
├── components/        — BaseSpinningWheel、AppPlayerList、AppScoreboard、
│                        AppDrawHistory、AppMobileTabBar
└── pages/index.vue    — 布局、滑动导航
```

## 快速开始

```bash
npm install --legacy-peer-deps
npm run dev
```

> 需要 `--legacy-peer-deps` 是因为 `@nuxt/ui@3` 依赖 vue-router 4，而 Nuxt 4 内置 vue-router 5。

## 开源协议

MIT
