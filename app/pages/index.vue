<script setup lang="ts">
import { useSwipe } from '@vueuse/core'

definePageMeta({ layout: false })

const playerManager = usePlayerManager()
const sessionStore = useSessionStore()
const toast = useToast()

const activePlayers = playerManager.activePlayers
const { isSpinning, rotation, winner, spin } = useWheelSpin(activePlayers)

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

watch(winner, (newWinner) => {
    if (!newWinner) return
    sessionStore.addSpinResult(newWinner.name, newWinner.color)
    toast.add({ title: `🎉 ${newWinner.name} gagne !`, color: 'success' })
    if (sessionStore.session.removeWinners && activePlayers.value.length > 1) {
        playerManager.togglePlayer(newWinner.id)
    }
})

function saveTitle(): void {
    if (titleInput.value.trim()) sessionStore.setTitle(titleInput.value)
    else titleInput.value = sessionStore.session.title
    isTitleEditing.value = false
}
</script>

<template>
    <div class="flex flex-col" style="height: 100dvh; background-color: #FF6347">

        <!-- Header — noir sur rgba(255,255,255,0.2)+tomato → L≈0.48 → 10:1 AAA -->
        <header class="flex-shrink-0 px-6 py-3 border-b" style="border-color: rgba(255,255,255,0.3)">
            <div class="max-w-7xl mx-auto flex items-center gap-4">
                <div class="flex-1 min-w-0">
                    <input
                        v-if="isTitleEditing"
                        v-model="titleInput"
                        class="text-2xl font-black bg-transparent border-b-2 outline-none w-full"
                        style="font-family: 'Nunito', sans-serif; color: #000; border-color: rgba(0,0,0,0.4); caret-color: #000"
                        autofocus
                        @blur="saveTitle"
                        @keydown.enter="saveTitle"
                        @keydown.escape="isTitleEditing = false"
                    />
                    <h1
                        v-else
                        class="text-2xl font-black cursor-pointer hover:opacity-70 transition-opacity truncate"
                        style="font-family: 'Nunito', sans-serif; color: #000"
                        @click="isTitleEditing = true"
                    >
                        {{ sessionStore.session.title }}
                    </h1>
                </div>
                <p class="text-sm font-semibold flex-shrink-0" style="color: rgba(0,0,0,0.6)">
                    {{ activePlayers.length }}/{{ playerManager.players.length }} actifs
                </p>
            </div>
        </header>

        <!-- Desktop -->
        <div class="hidden sm:grid flex-1 min-h-0 p-5 gap-5" style="grid-template-columns: 320px 1fr">

            <div class="flex flex-col gap-4 min-h-0">
                <div class="flex-1 min-h-0 rounded-2xl p-5 card-panel" style="overflow-y: auto">
                    <AppPlayerList />
                </div>
                <div class="flex-1 min-h-0 rounded-2xl p-5 card-panel" style="overflow-y: auto">
                    <AppScoreboard />
                </div>
                <div class="flex-1 min-h-0 rounded-2xl p-5 card-panel" style="overflow-y: auto">
                    <AppDrawHistory />
                </div>
            </div>

            <div class="relative min-h-0 flex flex-col">
                <div class="flex-1 min-h-0 cursor-pointer" @click="spin">
                    <BaseSpinningWheel
                        :players="activePlayers"
                        :rotation="rotation"
                        :is-spinning="isSpinning"
                    />
                </div>

                <Transition name="fade">
                    <div v-if="winner" class="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
                        <div
                            class="flex items-center gap-3 rounded-2xl px-6 py-3 whitespace-nowrap winner-banner"
                        >
                            <span class="w-3 h-3 rounded-full flex-shrink-0" :style="{ backgroundColor: winner.color }" />
                            <span class="text-lg font-black" style="font-family: 'Nunito', sans-serif; color: #000">
                                {{ winner.name }}
                            </span>
                        </div>
                    </div>
                </Transition>
            </div>
        </div>

        <!-- Mobile -->
        <div ref="swipeTarget" class="sm:hidden flex-1 min-h-0 overflow-y-auto p-4 pb-20">
            <Transition name="slide" mode="out-in">
                <div :key="activeTab" class="h-full">
                    <div v-if="activeTab === 'players'" class="rounded-2xl p-4 card-panel">
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
                        <Transition name="fade">
                            <div v-if="winner" class="flex-shrink-0">
                                <div class="flex items-center gap-2 rounded-xl px-4 py-2.5 winner-banner">
                                    <span class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: winner.color }" />
                                    <span class="font-black text-sm" style="font-family: 'Nunito', sans-serif; color: #000">
                                        {{ winner.name }}
                                    </span>
                                </div>
                            </div>
                        </Transition>
                    </div>

                    <div v-else-if="activeTab === 'stats'" class="flex flex-col gap-4">
                        <div class="rounded-2xl p-4 card-panel">
                            <AppScoreboard />
                        </div>
                        <div class="rounded-2xl p-4 card-panel">
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
.card-panel {
    background: rgba(255, 255, 255, 0.42);
    backdrop-filter: blur(28px) saturate(180%);
    -webkit-backdrop-filter: blur(28px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.6);
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

.winner-banner {
    background: rgba(255, 255, 255, 0.72);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.7);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-enter-active, .slide-leave-active { transition: transform 0.25s ease, opacity 0.25s ease; }
.slide-enter-from { transform: translateX(20px); opacity: 0; }
.slide-leave-to { transform: translateX(-20px); opacity: 0; }
</style>
