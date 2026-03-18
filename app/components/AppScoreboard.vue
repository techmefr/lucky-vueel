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
        <div class="sticky top-0 z-10 flex items-center justify-between pb-3" style="background: rgba(255,255,255,0.55); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px)">
            <h2 class="font-black text-lg" style="font-family: 'Nunito', sans-serif; color: #000">
                Scores de partie
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
            <div v-for="player in sorted" :key="player.id" class="flex items-center gap-3 px-2 py-1.5 rounded-xl">
                <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" :style="{ backgroundColor: player.color }" />
                <span class="flex-1 text-base font-medium truncate" style="color: #000">{{ player.name }}</span>
                <div class="flex items-center gap-1">
                    <button
                        class="w-7 h-7 rounded-lg flex items-center justify-center text-base font-bold transition-colors hover:bg-black/10"
                        style="color: #1a1a1a"
                        @click="playerManager.adjustScore(player.id, -1)"
                    >
                        −
                    </button>

                    <input
                        v-if="editingId === player.id"
                        v-model="editingValue"
                        class="w-12 text-center text-base font-black tabular-nums rounded-md px-1 py-0.5 outline-none"
                        style="font-family: 'Nunito', sans-serif; background: rgba(0,0,0,0.08); color: #000; border: 1px solid rgba(0,0,0,0.25)"
                        type="number"
                        autofocus
                        @blur="commitEdit(player.id)"
                        @keydown="e => handleEditKeydown(e, player.id)"
                    />
                    <span
                        v-else
                        class="w-12 text-center text-base font-black tabular-nums cursor-text rounded-md px-1 py-0.5 transition-colors hover:bg-black/10"
                        style="font-family: 'Nunito', sans-serif; color: #000"
                        @click="startEdit(player.id, player.score ?? 0)"
                    >
                        {{ player.score ?? 0 }}
                    </span>

                    <button
                        class="w-7 h-7 rounded-lg flex items-center justify-center text-base font-bold transition-colors hover:bg-black/10"
                        style="color: #1a1a1a"
                        @click="playerManager.adjustScore(player.id, 1)"
                    >
                        +
                    </button>
                </div>
            </div>
        </div>

        <p v-else class="text-base italic py-2 text-center" style="color: #1a1a1a">
            Ajoute des joueurs pour suivre les scores
        </p>
    </div>
</template>
