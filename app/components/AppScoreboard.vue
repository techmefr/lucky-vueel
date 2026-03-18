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
        <div class="sticky top-0 z-10 flex items-center justify-between pb-3" style="background: rgba(255,255,255,0.82)">
            <h2 class="font-black text-lg" style="font-family: 'Nunito', sans-serif; color: #111">
                Scores
            </h2>
            <UButton
                v-if="playerManager.players.some(p => (p.score ?? 0) !== 0)"
                size="xs"
                icon="i-lucide-rotate-ccw"
                variant="ghost"
                color="neutral"
                @click="playerManager.resetScores()"
            />
        </div>

        <div v-if="playerManager.players.length > 0" class="space-y-1 mt-1">
            <div
                v-for="player in sorted"
                :key="player.id"
                class="flex items-center gap-3 px-2 py-2 rounded-2xl transition-colors hover:bg-black/4"
            >
                <span
                    class="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    :style="{ backgroundColor: player.color }"
                />
                <span class="flex-1 text-sm font-semibold truncate" style="color: #222">{{ player.name }}</span>
                <div class="flex items-center gap-0.5">
                    <button
                        class="w-8 h-8 rounded-xl flex items-center justify-center text-lg font-bold transition-colors hover:bg-black/8 active:bg-black/15"
                        style="color: #333"
                        @click="playerManager.adjustScore(player.id, -1)"
                    >
                        −
                    </button>

                    <input
                        v-if="editingId === player.id"
                        v-model="editingValue"
                        class="w-11 text-center text-base font-black tabular-nums rounded-xl px-1 py-1 outline-none"
                        style="font-family: 'Nunito', sans-serif; background: rgba(0,0,0,0.07); color: #111; border: 1.5px solid rgba(0,0,0,0.2)"
                        type="number"
                        autofocus
                        @blur="commitEdit(player.id)"
                        @keydown="e => handleEditKeydown(e, player.id)"
                    />
                    <span
                        v-else
                        class="w-11 text-center text-base font-black tabular-nums cursor-text rounded-xl px-1 py-1 transition-colors hover:bg-black/8"
                        style="font-family: 'Nunito', sans-serif; color: #111"
                        @click="startEdit(player.id, player.score ?? 0)"
                    >
                        {{ player.score ?? 0 }}
                    </span>

                    <button
                        class="w-8 h-8 rounded-xl flex items-center justify-center text-lg font-bold transition-colors hover:bg-black/8 active:bg-black/15"
                        style="color: #333"
                        @click="playerManager.adjustScore(player.id, 1)"
                    >
                        +
                    </button>
                </div>
            </div>
        </div>

        <p v-else class="text-sm italic py-3 text-center" style="color: #777">
            Ajoute des joueurs pour suivre les scores
        </p>
    </div>
</template>
