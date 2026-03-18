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
        <div class="sticky top-0 z-10 flex items-center justify-between pb-3" style="background: rgba(255,255,255,0.55); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px)">
            <h2 class="font-black text-lg" style="font-family: 'Nunito', sans-serif; color: #000">
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
                class="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                style="background-color: rgba(0,0,0,0.08); border: 1px solid rgba(0,0,0,0.12)"
            >
                <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" :style="{ backgroundColor: lastDraw.playerColor }" />
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium" style="color: #1a1a1a">Dernier tiré</p>
                    <p class="text-base font-black truncate" style="font-family: 'Nunito', sans-serif; color: #000">
                        {{ lastDraw.playerName }}
                    </p>
                </div>
                <span class="text-sm font-mono px-1.5 py-0.5 rounded-md font-semibold" style="background-color: rgba(0,0,0,0.08); color: #000">
                    {{ totalDraws }}x
                </span>
            </div>

            <div class="space-y-1.5">
                <div v-for="entry in drawCounts" :key="entry.name" class="flex items-center gap-2 px-2 py-1">
                    <span class="w-2 h-2 rounded-full flex-shrink-0" :style="{ backgroundColor: entry.color }" />
                    <span class="flex-1 text-base truncate" style="color: #000">{{ entry.name }}</span>
                    <div class="flex items-center gap-1.5">
                        <div class="w-12 h-1.5 rounded-full overflow-hidden" style="background-color: rgba(0,0,0,0.12)">
                            <div
                                class="h-full rounded-full transition-all"
                                :style="{ width: `${(entry.count / totalDraws) * 100}%`, backgroundColor: entry.color }"
                            />
                        </div>
                        <span class="text-sm font-bold w-4 text-right" style="color: #000">{{ entry.count }}</span>
                    </div>
                </div>
            </div>
        </div>

        <p v-else class="text-base italic py-2 text-center" style="color: #1a1a1a">
            Aucun tirage pour l'instant
        </p>
    </div>
</template>
