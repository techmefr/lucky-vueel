<script setup lang="ts">
import { useSwipe } from '@vueuse/core'

definePageMeta({ layout: false })

const playerManager = usePlayerManager()
const sessionStore = useSessionStore()
const toast = useToast()

const activePlayers = playerManager.activePlayers

const { isSpinning, rotation, spin } = useWheelSpin(activePlayers, player => {
    sessionStore.addSpinResult(player.name, player.color)
    toast.add({ title: `${player.name} gagne !`, color: 'success' })
    if (sessionStore.session.removeWinners && activePlayers.value.length > 1) {
        playerManager.togglePlayer(player.id)
    }
})

const isTitleEditing = ref(false)
const titleInput = ref(sessionStore.session.title)

const activeTab = ref('wheel')
const swipeTarget = ref<HTMLElement | null>(null)

const tabs = [
    { id: 'players', label: 'Joueurs', icon: 'i-lucide-users' },
    { id: 'wheel', label: 'Roue', icon: 'i-lucide-circle-dashed' },
    { id: 'stats', label: 'Stats', icon: 'i-lucide-bar-chart-2' },
]

const tabOrder = ['players', 'wheel', 'stats']

useSwipe(swipeTarget, {
    onSwipeEnd(_e, direction) {
        const currentIndex = tabOrder.indexOf(activeTab.value)
        if (direction === 'left' && currentIndex < tabOrder.length - 1) {
            const next = tabOrder[currentIndex + 1]
            if (next) activeTab.value = next
        } else if (direction === 'right' && currentIndex > 0) {
            const prev = tabOrder[currentIndex - 1]
            if (prev) activeTab.value = prev
        }
    },
})

function saveTitle(): void {
    if (titleInput.value.trim()) sessionStore.setTitle(titleInput.value)
    else titleInput.value = sessionStore.session.title
    isTitleEditing.value = false
}
</script>

<template>
    <div class="page-root flex flex-col" style="height: 100dvh">

        <header class="flex-shrink-0 px-6 py-4">
            <div class="flex items-center gap-4">
                <div class="flex-1 min-w-0 flex items-center gap-3">
                    <span class="text-2xl select-none" aria-hidden="true">🎡</span>
                    <input
                        v-if="isTitleEditing"
                        v-model="titleInput"
                        class="header-title-input flex-1"
                        autofocus
                        @blur="saveTitle"
                        @keydown.enter="saveTitle"
                        @keydown.escape="isTitleEditing = false"
                    />
                    <h1
                        v-else
                        class="header-title flex-1 truncate"
                        @click="isTitleEditing = true"
                    >
                        {{ sessionStore.session.title }}
                    </h1>
                </div>
                <div class="player-counter">
                    <span class="counter-active">{{ activePlayers.length }}/{{ playerManager.players.length }}</span>
                    <span class="counter-label">actifs</span>
                </div>
            </div>
        </header>

        <!-- Desktop -->
        <div class="hidden sm:grid flex-1 min-h-0 px-5 pb-5 gap-5" style="grid-template-columns: 320px 1fr">

            <div class="flex flex-col gap-4 min-h-0">
                <div class="flex-1 min-h-0 card-panel rounded-3xl p-5 overflow-y-auto">
                    <AppPlayerList />
                </div>
                <div class="flex-1 min-h-0 card-panel rounded-3xl p-5 overflow-y-auto">
                    <AppScoreboard />
                </div>
                <div class="flex-1 min-h-0 card-panel rounded-3xl p-5 overflow-y-auto">
                    <AppDrawHistory />
                </div>
            </div>

            <div class="relative min-h-0 flex flex-col items-center justify-center">
                <div class="w-full flex-1 min-h-0 cursor-pointer" @click="spin">
                    <BaseSpinningWheel
                        :players="activePlayers"
                        :rotation="rotation"
                        :is-spinning="isSpinning"
                    />
                </div>
            </div>
        </div>

        <!-- Mobile -->
        <div ref="swipeTarget" class="sm:hidden flex-1 min-h-0 overflow-y-auto px-4 pb-24">
            <Transition name="slide" mode="out-in">
                <div :key="activeTab" class="h-full">
                    <div v-if="activeTab === 'players'" class="card-panel rounded-3xl p-4">
                        <AppPlayerList />
                    </div>

                    <div v-else-if="activeTab === 'wheel'" class="flex flex-col items-center gap-4 h-full">
                        <div class="flex-1 min-h-0 w-full cursor-pointer" @click="spin">
                            <BaseSpinningWheel
                                :players="activePlayers"
                                :rotation="rotation"
                                :is-spinning="isSpinning"
                            />
                        </div>
                    </div>

                    <div v-else-if="activeTab === 'stats'" class="flex flex-col gap-4">
                        <div class="card-panel rounded-3xl p-4">
                            <AppScoreboard />
                        </div>
                        <div class="card-panel rounded-3xl p-4">
                            <AppDrawHistory />
                        </div>
                    </div>
                </div>
            </Transition>
        </div>

        <AppMobileTabBar v-model="activeTab" :tabs="tabs" />
    </div>
</template>

<style scoped>
.page-root {
    background:
        radial-gradient(ellipse at 15% 15%, rgba(255, 220, 100, 0.25) 0%, transparent 55%),
        radial-gradient(ellipse at 85% 80%, rgba(220, 50, 50, 0.3) 0%, transparent 50%),
        radial-gradient(ellipse at 60% 10%, rgba(255, 140, 60, 0.2) 0%, transparent 45%),
        #FF6347;
}

.card-panel {
    background: rgba(255, 255, 255, 0.82);
    backdrop-filter: blur(32px) saturate(180%);
    -webkit-backdrop-filter: blur(32px) saturate(180%);
    border: 1.5px solid rgba(255, 255, 255, 0.9);
    box-shadow:
        0 8px 40px rgba(180, 60, 30, 0.15),
        0 2px 8px rgba(0, 0, 0, 0.08),
        inset 0 1.5px 0 rgba(255, 255, 255, 1);
}

.header-title {
    font-family: var(--font-display);
    font-size: 1.25rem;
    font-weight: 900;
    color: #fff;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    transition: opacity 0.15s;
}

.header-title:hover {
    opacity: 0.8;
}

.header-title-input {
    font-family: var(--font-display);
    font-size: 1.25rem;
    font-weight: 900;
    color: #fff;
    background: transparent;
    border: none;
    border-bottom: 2px solid rgba(255, 255, 255, 0.5);
    outline: none;
    caret-color: #fff;
}

.player-counter {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    background: rgba(0, 0, 0, 0.18);
    backdrop-filter: blur(8px);
}

.counter-active {
    font-size: 0.75rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.95);
}

.counter-label {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.7);
}

.slide-enter-active, .slide-leave-active { transition: transform 0.25s ease, opacity 0.25s ease; }
.slide-enter-from { transform: translateX(20px); opacity: 0; }
.slide-leave-to { transform: translateX(-20px); opacity: 0; }
</style>
