<script setup lang="ts">
const playerManager = usePlayerManager()
const sessionStore = useSessionStore()

const newName = ref('')
const isAddOpen = ref(false)
const toast = useToast()

function handleAdd(): void {
    const name = newName.value.trim()
    if (!name) return
    if (playerManager.players.some(p => p.name.toLowerCase() === name.toLowerCase())) {
        toast.add({ title: 'Ce joueur existe déjà', color: 'warning' })
        return
    }
    playerManager.addPlayer(name)
    newName.value = ''
    isAddOpen.value = false
}

function handleKeydown(e: KeyboardEvent): void {
    if (e.key === 'Enter') handleAdd()
}
</script>

<template>
    <div class="flex flex-col min-h-0">
        <div class="card-header sticky top-0 z-10 flex items-center justify-between pb-3 mb-1">
            <h2 class="section-title">
                Joueurs
                <span class="section-count">({{ playerManager.players.length }})</span>
            </h2>
            <UButton size="sm" icon="i-lucide-plus" color="neutral" variant="outline" @click="isAddOpen = true">
                Ajouter
            </UButton>
        </div>

        <UModal v-model:open="isAddOpen" title="Ajouter un joueur">
            <template #body>
                <UInput v-model="newName" placeholder="Nom du joueur…" autofocus @keydown="handleKeydown" />
            </template>
            <template #footer>
                <div class="flex justify-end gap-2">
                    <UButton variant="ghost" color="neutral" @click="isAddOpen = false">Annuler</UButton>
                    <UButton @click="handleAdd">Ajouter</UButton>
                </div>
            </template>
        </UModal>

        <div
            v-if="playerManager.players.length >= 3"
            class="card-header sticky top-12 z-10 flex items-center gap-3 py-2"
        >
            <button
                class="toggle-track relative flex-shrink-0"
                :class="{ 'is-active': sessionStore.session.removeWinners }"
                :aria-checked="sessionStore.session.removeWinners"
                role="switch"
                aria-label="Retirer les gagnants automatiquement"
                @click="sessionStore.toggleRemoveWinners()"
            >
                <span class="toggle-thumb" />
            </button>
            <span class="text-sm select-none text-label-secondary">Retirer les gagnants</span>
        </div>

        <ul v-if="playerManager.players.length > 0" class="space-y-1.5 mt-1" role="list">
            <li
                v-for="player in playerManager.players"
                :key="player.id"
                :class="['player-row group', { 'is-inactive': !player.isActive }]"
                :style="player.isActive ? { background: `color-mix(in srgb, ${player.color} 8%, transparent)` } : {}"
                :aria-label="`${player.name} — ${player.isActive ? 'actif' : 'inactif'}`"
                @click="playerManager.togglePlayer(player.id)"
            >
                <span
                    class="player-dot flex-shrink-0"
                    :style="{
                        backgroundColor: player.color,
                        boxShadow: player.isActive ? `0 0 0 3px color-mix(in srgb, ${player.color} 25%, transparent)` : 'none',
                    }"
                />
                <span :class="['flex-1 text-sm font-semibold text-label truncate', { 'line-through': !player.isActive }]">
                    {{ player.name }}
                </span>
                <UButton
                    icon="i-lucide-x"
                    size="xs"
                    variant="ghost"
                    color="neutral"
                    class="opacity-0 group-hover:opacity-50 transition-opacity"
                    aria-label="Supprimer le joueur"
                    @click.stop="playerManager.removePlayer(player.id)"
                />
            </li>
        </ul>

        <p v-else class="text-sm italic py-6 text-center text-label-muted">
            Aucun joueur — ajoute des participants
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

.section-count {
    font-weight: 400;
    font-size: 0.875rem;
    margin-left: 0.25rem;
    color: var(--color-label-muted);
}

.toggle-track {
    width: 2.5rem;
    height: 1.25rem;
    border-radius: 9999px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    background-color: rgba(0, 0, 0, 0.1);
    transition: background-color 0.2s, border-color 0.2s;
}

.toggle-track.is-active {
    background-color: rgba(0, 0, 0, 0.35);
    border-color: rgba(0, 0, 0, 0.4);
}

.toggle-thumb {
    position: absolute;
    top: 0.125rem;
    left: 0.125rem;
    width: 1rem;
    height: 1rem;
    border-radius: 9999px;
    background-color: #000;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    transition: transform 0.2s;
}

.toggle-track.is-active .toggle-thumb {
    transform: translateX(1.25rem);
}

.player-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.625rem 0.75rem;
    border-radius: 1rem;
    cursor: pointer;
    transition: background 0.15s, opacity 0.15s;
}

.player-row:not(.is-inactive):hover {
    background-color: rgba(0, 0, 0, 0.05) !important;
}

.player-row.is-inactive {
    opacity: 0.35;
}

.player-dot {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 9999px;
    transition: box-shadow 0.2s;
}
</style>
