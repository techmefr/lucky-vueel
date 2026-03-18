<script setup lang="ts">
const sessionStore = useSessionStore()

const lastDraw = computed(() => sessionStore.recentWinners[0] ?? null)

const drawCounts = computed(() => {
    const map = new Map<string, { name: string; color: string; count: number }>()
    for (const result of sessionStore.session.spinHistory) {
        const existing = map.get(result.playerName)
        if (existing) {
            existing.count++
        } else {
            map.set(result.playerName, { name: result.playerName, color: result.playerColor, count: 1 })
        }
    }
    return Array.from(map.values()).sort((a, b) => b.count - a.count)
})

const totalDraws = computed(() => sessionStore.session.spinHistory.length)
</script>

<template>
    <div class="flex flex-col min-h-0">
        <div class="sticky top-0 z-10 flex items-center justify-between pb-3" style="background: transparent">
            <h2 class="font-black text-lg" style="font-family: 'Nunito', sans-serif; color: #111">
                Tirages
            </h2>
            <UButton
                v-if="totalDraws > 0"
                size="xs"
                icon="i-lucide-rotate-ccw"
                variant="ghost"
                color="neutral"
                @click="sessionStore.resetHistory()"
            />
        </div>

        <div v-if="totalDraws > 0" class="space-y-3">
            <div
                v-if="lastDraw"
                class="flex items-center gap-3 px-3 py-2.5 rounded-2xl"
                :style="{ background: `linear-gradient(135deg, ${lastDraw.playerColor}22 0%, ${lastDraw.playerColor}0a 100%)`, border: `1.5px solid ${lastDraw.playerColor}44` }"
            >
                <span
                    class="w-3 h-3 rounded-full flex-shrink-0"
                    :style="{ backgroundColor: lastDraw.playerColor, boxShadow: `0 0 0 3px ${lastDraw.playerColor}33` }"
                />
                <div class="flex-1 min-w-0">
                    <p class="text-xs font-semibold uppercase tracking-wide" style="color: #666">Dernier tiré</p>
                    <p class="text-base font-black truncate" style="font-family: 'Nunito', sans-serif; color: #111">
                        {{ lastDraw.playerName }}
                    </p>
                </div>
                <span
                    class="text-sm font-black px-2 py-0.5 rounded-lg"
                    :style="{ background: `${lastDraw.playerColor}22`, color: '#111' }"
                >
                    {{ totalDraws }}×
                </span>
            </div>

            <div class="space-y-1">
                <div v-for="entry in drawCounts" :key="entry.name" class="flex items-center gap-2.5 px-2 py-1.5 rounded-xl transition-colors hover:bg-black/4">
                    <span
                        class="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        :style="{ backgroundColor: entry.color }"
                    />
                    <span class="flex-1 text-sm font-semibold truncate" style="color: #222">{{ entry.name }}</span>
                    <div class="flex items-center gap-2">
                        <div class="w-16 h-2 rounded-full overflow-hidden" style="background-color: rgba(0,0,0,0.1)">
                            <div
                                class="h-full rounded-full transition-all duration-500"
                                :style="{ width: `${(entry.count / totalDraws) * 100}%`, backgroundColor: entry.color }"
                            />
                        </div>
                        <span class="text-sm font-black w-4 text-right tabular-nums" style="color: #111">{{ entry.count }}</span>
                    </div>
                </div>
            </div>
        </div>

        <p v-else class="text-sm italic py-3 text-center" style="color: #777">
            Aucun tirage pour l'instant
        </p>
    </div>
</template>
