import { useLocalStorage } from '@vueuse/core'
import type { IPlayer } from '../composables/usePlayerManager'

export const usePlayerStore = defineStore('player', () => {
    const players = useLocalStorage<IPlayer[]>('lucky-players', [])

    function addPlayer(name: string, color: string): void {
        players.value.push({
            id: crypto.randomUUID(),
            name,
            color,
            isActive: true,
            score: 0,
        })
    }

    function removePlayer(id: string): void {
        players.value = players.value.filter(p => p.id !== id)
    }

    function togglePlayer(id: string): void {
        const player = players.value.find(p => p.id === id)
        if (player) player.isActive = !player.isActive
    }

    function updatePlayer(id: string, name: string): void {
        const player = players.value.find(p => p.id === id)
        if (player) player.name = name
    }

    function adjustScore(id: string, delta: number): void {
        const player = players.value.find(p => p.id === id)
        if (player) player.score = (player.score ?? 0) + delta
    }

    function resetScores(): void {
        players.value.forEach(p => { p.score = 0 })
    }

    function reset(): void {
        players.value = []
    }

    return { players, addPlayer, removePlayer, togglePlayer, updatePlayer, adjustScore, resetScores, reset }
})
