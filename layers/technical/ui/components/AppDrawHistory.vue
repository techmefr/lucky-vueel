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
        <div class="card-header sticky top-0 z-10 flex items-center justify-between pb-3 mb-1">
            <h2 class="section-title">Tirages</h2>
            <UButton
                v-if="totalDraws > 0"
                size="xs"
                icon="i-lucide-rotate-ccw"
                variant="ghost"
                color="neutral"
                aria-label="Réinitialiser l'historique"
                @click="sessionStore.resetHistory()"
            />
        </div>

        <div v-if="totalDraws > 0" class="space-y-3">
            <div
                v-if="lastDraw"
                class="last-draw-card"
                :style="{
                    background: `linear-gradient(135deg, color-mix(in srgb, ${lastDraw.playerColor} 13%, transparent) 0%, color-mix(in srgb, ${lastDraw.playerColor} 4%, transparent) 100%)`,
                    borderColor: `color-mix(in srgb, ${lastDraw.playerColor} 27%, transparent)`,
                }"
            >
                <span
                    class="w-3 h-3 rounded-full flex-shrink-0"
                    :style="{
                        backgroundColor: lastDraw.playerColor,
                        boxShadow: `0 0 0 3px color-mix(in srgb, ${lastDraw.playerColor} 20%, transparent)`,
                    }"
                />
                <div class="flex-1 min-w-0">
                    <p class="draw-label">Dernier tiré</p>
                    <p class="draw-name truncate">{{ lastDraw.playerName }}</p>
                </div>
                <span
                    class="draw-count"
                    :style="{ background: `color-mix(in srgb, ${lastDraw.playerColor} 13%, transparent)` }"
                >
                    {{ totalDraws }}×
                </span>
            </div>

            <div class="space-y-1">
                <div
                    v-for="entry in drawCounts"
                    :key="entry.name"
                    class="draw-row"
                >
                    <span
                        class="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        :style="{ backgroundColor: entry.color }"
                    />
                    <span class="flex-1 text-sm font-semibold truncate text-label">{{ entry.name }}</span>
                    <div class="flex items-center gap-2">
                        <div class="draw-bar-track">
                            <div
                                class="draw-bar-fill"
                                :style="{
                                    width: `${(entry.count / totalDraws) * 100}%`,
                                    backgroundColor: entry.color,
                                }"
                            />
                        </div>
                        <span class="draw-count-cell text-label">{{ entry.count }}</span>
                    </div>
                </div>
            </div>
        </div>

        <p v-else class="text-sm italic py-6 text-center text-label-muted">
            Aucun tirage pour l'instant
        </p>
    </div>
</template>

<style scoped>
.card-header {
    background: var(--color-card-bg);
}

.section-title {
    font-family: var(--font-display);
    font-weight: 900;
    font-size: 1.125rem;
    color: var(--color-label);
}

.last-draw-card {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.625rem 0.75rem;
    border-radius: 1rem;
    border: 1.5px solid transparent;
}

.draw-label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-label-secondary);
}

.draw-name {
    font-family: var(--font-display);
    font-size: 1rem;
    font-weight: 900;
    color: var(--color-label);
}

.draw-count {
    font-size: 0.875rem;
    font-weight: 900;
    padding: 0.125rem 0.5rem;
    border-radius: 0.5rem;
    color: var(--color-label);
}

.draw-row {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.375rem 0.5rem;
    border-radius: 0.75rem;
    transition: background 0.15s;
}

.draw-row:hover {
    background: rgba(0, 0, 0, 0.04);
}

.draw-bar-track {
    width: 4rem;
    height: 0.5rem;
    border-radius: 9999px;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.1);
}

.draw-bar-fill {
    height: 100%;
    border-radius: 9999px;
    transition: width 0.5s ease;
}

.draw-count-cell {
    font-size: 0.875rem;
    font-weight: 900;
    width: 1rem;
    text-align: right;
    font-variant-numeric: tabular-nums;
}
</style>
