export interface IPlayer {
    id: string
    name: string
    color: string
    isActive: boolean
    score: number
}

export const WHEEL_COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
    '#F8B739', '#52B788', '#E76F51', '#2A9D8F',
]

export function usePlayerManager() {
    const store = usePlayerStore()

    function addPlayer(name: string): void {
        const trimmed = name.trim()
        if (!trimmed || store.players.some(p => p.name.toLowerCase() === trimmed.toLowerCase())) return
        const color = WHEEL_COLORS[store.players.length % WHEEL_COLORS.length] ?? '#FF6B6B'
        store.addPlayer(trimmed, color)
    }

    function removePlayer(id: string): void {
        store.removePlayer(id)
    }

    function togglePlayer(id: string): void {
        store.togglePlayer(id)
    }

    function updatePlayer(id: string, name: string): void {
        const trimmed = name.trim()
        if (!trimmed) return
        store.updatePlayer(id, trimmed)
    }

    function adjustScore(id: string, delta: number): void {
        store.adjustScore(id, delta)
    }

    function resetScores(): void {
        store.resetScores()
    }

    function resetAll(): void {
        store.reset()
    }

    return {
        players: store.players,
        activePlayers: computed(() => store.players.filter(p => p.isActive)),
        addPlayer,
        removePlayer,
        togglePlayer,
        updatePlayer,
        adjustScore,
        resetScores,
        resetAll,
    }
}
