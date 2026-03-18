import { useLocalStorage } from '@vueuse/core'

export interface ISpinResult {
    id: string
    playerName: string
    playerColor: string
    timestamp: number
}

export interface IGameSession {
    title: string
    spinHistory: ISpinResult[]
    removeWinners: boolean
}

export const useSessionStore = defineStore('session', () => {
    const session = useLocalStorage<IGameSession>('lucky-session', {
        title: 'Lucky Wheel',
        spinHistory: [],
        removeWinners: false,
    })

    const scores = computed(() => {
        const map = new Map<string, { name: string; color: string; wins: number }>()
        for (const result of session.value.spinHistory) {
            const existing = map.get(result.playerName)
            if (existing) {
                existing.wins++
            } else {
                map.set(result.playerName, {
                    name: result.playerName,
                    color: result.playerColor,
                    wins: 1,
                })
            }
        }
        return Array.from(map.values()).sort((a, b) => b.wins - a.wins)
    })

    const recentWinners = computed(() =>
        [...session.value.spinHistory]
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 5)
    )

    function addSpinResult(playerName: string, playerColor: string): void {
        session.value.spinHistory.push({
            id: crypto.randomUUID(),
            playerName,
            playerColor,
            timestamp: Date.now(),
        })
    }

    function setTitle(title: string): void {
        session.value.title = title.trim()
    }

    function toggleRemoveWinners(): void {
        session.value.removeWinners = !session.value.removeWinners
    }

    function resetHistory(): void {
        session.value.spinHistory = []
    }

    return {
        session,
        scores,
        recentWinners,
        addSpinResult,
        setTitle,
        toggleRemoveWinners,
        resetHistory,
    }
})
