import confetti from 'canvas-confetti'
import type { IPlayer } from '../../layers/domain/player/composables/usePlayerManager'

export function useWheelSpin(activePlayers: Ref<IPlayer[]>) {
    const isSpinning = ref(false)
    const rotation = ref(0)
    const winner = ref<IPlayer | null>(null)

    async function spin(): Promise<void> {
        if (isSpinning.value || activePlayers.value.length < 2) return

        const players = [...activePlayers.value]
        isSpinning.value = true
        winner.value = null

        const baseRotation = 3600
        const randomOffset = Math.random() * 360
        const newRotation = rotation.value + baseRotation + randomOffset

        const finalDegree = newRotation % 360
        const segmentAngle = 360 / players.length
        const computedIndex =
            Math.floor((360 - finalDegree + segmentAngle / 2) / segmentAngle) % players.length

        await nextTick()
        rotation.value = newRotation

        setTimeout(() => {
            const picked = players[computedIndex] ?? players[0]
            if (!picked) {
                isSpinning.value = false
                return
            }
            winner.value = picked
            isSpinning.value = false
            triggerConfetti()
        }, 4000)
    }

    function triggerConfetti(): void {
        const duration = 3000
        const end = Date.now() + duration
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }

        const interval = setInterval(() => {
            const timeLeft = end - Date.now()
            if (timeLeft <= 0) return clearInterval(interval)

            const particleCount = 50 * (timeLeft / duration)
            confetti({ ...defaults, particleCount, origin: { x: randomBetween(0.1, 0.3), y: Math.random() - 0.2 } })
            confetti({ ...defaults, particleCount, origin: { x: randomBetween(0.7, 0.9), y: Math.random() - 0.2 } })
        }, 250)
    }

    function randomBetween(min: number, max: number): number {
        return Math.random() * (max - min) + min
    }

    return {
        isSpinning: readonly(isSpinning),
        rotation: readonly(rotation),
        winner: readonly(winner),
        spin,
    }
}
