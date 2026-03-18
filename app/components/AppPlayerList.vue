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
        <div class="sticky top-0 z-10 flex items-center justify-between pb-3 mb-1" style="background: transparent">
            <h2 class="font-black text-lg" style="font-family: 'Nunito', sans-serif; color: #111">
                Joueurs
                <span class="font-normal text-sm ml-1" style="color: #666">({{ playerManager.players.length }})</span>
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
            class="sticky top-12 z-10 flex items-center gap-3 py-2"
            style="background: transparent"
        >
            <button class="relative flex-shrink-0" @click="sessionStore.toggleRemoveWinners()">
                <div
                    :class="[
                        'w-10 h-5 rounded-full transition-colors border',
                        sessionStore.session.removeWinners
                            ? 'border-black/40'
                            : 'border-black/20',
                    ]"
                    :style="{ backgroundColor: sessionStore.session.removeWinners ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.1)' }"
                />
                <div
                    :class="[
                        'absolute top-0.5 w-4 h-4 rounded-full shadow transition-transform',
                        sessionStore.session.removeWinners ? 'left-5' : 'left-0.5',
                    ]"
                    style="background-color: #000"
                />
            </button>
            <span class="text-sm select-none" style="color: #333">Retirer les gagnants</span>
        </div>

        <ul v-if="playerManager.players.length > 0" class="space-y-1.5 mt-1">
            <li
                v-for="player in playerManager.players"
                :key="player.id"
                :class="[
                    'flex items-center gap-3 px-3 py-2.5 rounded-2xl cursor-pointer transition-all group',
                    player.isActive
                        ? 'hover:bg-black/6'
                        : 'opacity-35',
                ]"
                :style="player.isActive ? { background: `linear-gradient(135deg, ${player.color}18 0%, transparent 60%)` } : {}"
                @click="playerManager.togglePlayer(player.id)"
            >
                <span
                    class="w-3 h-3 rounded-full flex-shrink-0"
                    :style="{
                        backgroundColor: player.color,
                        boxShadow: player.isActive ? `0 0 0 3px ${player.color}33` : 'none'
                    }"
                />
                <span
                    :class="['flex-1 text-base font-semibold', { 'line-through': !player.isActive }]"
                    style="color: #111"
                >
                    {{ player.name }}
                </span>
                <UButton
                    icon="i-lucide-x"
                    size="xs"
                    variant="ghost"
                    color="neutral"
                    class="opacity-0 group-hover:opacity-50 transition-opacity"
                    @click.stop="playerManager.removePlayer(player.id)"
                />
            </li>
        </ul>

        <p v-else class="text-base italic py-6 text-center" style="color: #555">
            Aucun joueur — ajoute des participants
        </p>
    </div>
</template>
