<script setup lang="ts">
const playerManager = usePlayerManager()

const editingId = ref<string | null>(null)
const editingValue = ref('')

const sorted = computed(() =>
    [...playerManager.players].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
)

function startEdit(id: string, currentScore: number): void {
    editingId.value = id
    editingValue.value = String(currentScore ?? 0)
}

function commitEdit(id: string): void {
    const parsed = parseInt(editingValue.value, 10)
    const delta = (isNaN(parsed) ? 0 : parsed) - (playerManager.players.find(p => p.id === id)?.score ?? 0)
    if (delta !== 0) playerManager.adjustScore(id, delta)
    editingId.value = null
}

function handleEditKeydown(e: KeyboardEvent, id: string): void {
    if (e.key === 'Enter') commitEdit(id)
    if (e.key === 'Escape') editingId.value = null
}
</script>

<template>
    <div class="flex flex-col min-h-0">
        <div class="card-header sticky top-0 z-10 flex items-center justify-between pb-3 mb-1">
            <h2 class="section-title">Scores</h2>
            <UButton
                v-if="playerManager.players.some(p => (p.score ?? 0) !== 0)"
                size="xs"
                icon="i-lucide-rotate-ccw"
                variant="ghost"
                color="neutral"
                aria-label="Réinitialiser les scores"
                @click="playerManager.resetScores()"
            />
        </div>

        <div v-if="playerManager.players.length > 0" class="space-y-1 mt-1">
            <div
                v-for="player in sorted"
                :key="player.id"
                class="score-row"
            >
                <span
                    class="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    :style="{ backgroundColor: player.color }"
                />
                <span class="flex-1 text-sm font-semibold truncate text-label">{{ player.name }}</span>
                <div class="flex items-center gap-0.5">
                    <button
                        class="score-btn"
                        :aria-label="`Enlever un point à ${player.name}`"
                        @click="playerManager.adjustScore(player.id, -1)"
                    >
                        −
                    </button>

                    <input
                        v-if="editingId === player.id"
                        v-model="editingValue"
                        class="score-input"
                        type="number"
                        autofocus
                        :aria-label="`Score de ${player.name}`"
                        @blur="commitEdit(player.id)"
                        @keydown="e => handleEditKeydown(e, player.id)"
                    />
                    <span
                        v-else
                        class="score-display"
                        role="button"
                        :aria-label="`Score de ${player.name} : ${player.score ?? 0}. Cliquer pour modifier`"
                        @click="startEdit(player.id, player.score ?? 0)"
                    >
                        {{ player.score ?? 0 }}
                    </span>

                    <button
                        class="score-btn"
                        :aria-label="`Ajouter un point à ${player.name}`"
                        @click="playerManager.adjustScore(player.id, 1)"
                    >
                        +
                    </button>
                </div>
            </div>
        </div>

        <p v-else class="text-sm italic py-6 text-center text-label-muted">
            Ajoute des joueurs pour suivre les scores
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

.score-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem;
    border-radius: 1rem;
    transition: background 0.15s;
}

.score-row:hover {
    background: rgba(0, 0, 0, 0.04);
}

.score-btn {
    width: 2rem;
    height: 2rem;
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--color-label-secondary);
    transition: background 0.15s;
}

.score-btn:hover {
    background: rgba(0, 0, 0, 0.08);
}

.score-btn:active {
    background: rgba(0, 0, 0, 0.15);
}

.score-input {
    width: 2.75rem;
    text-align: center;
    font-size: 1rem;
    font-family: var(--font-display);
    font-weight: 900;
    font-variant-numeric: tabular-nums;
    border-radius: 0.75rem;
    padding: 0.25rem;
    outline: none;
    background: rgba(0, 0, 0, 0.07);
    color: var(--color-label);
    border: 1.5px solid rgba(0, 0, 0, 0.2);
}

.score-display {
    width: 2.75rem;
    text-align: center;
    font-size: 1rem;
    font-family: var(--font-display);
    font-weight: 900;
    font-variant-numeric: tabular-nums;
    border-radius: 0.75rem;
    padding: 0.25rem;
    cursor: text;
    color: var(--color-label);
    transition: background 0.15s;
}

.score-display:hover {
    background: rgba(0, 0, 0, 0.08);
}
</style>
