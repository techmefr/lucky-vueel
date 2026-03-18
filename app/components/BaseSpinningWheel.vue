<script setup lang="ts">
import type { IPlayer } from '../../layers/domain/player/composables/usePlayerManager'

interface Props {
    players: IPlayer[]
    rotation: number
    isSpinning: boolean
}

const props = defineProps<Props>()

const CX = 365
const CY = 365
const RADIUS = 329.1

const sectors = computed(() => {
    if (props.players.length === 0) return []
    if (props.players.length === 1) return null

    const count = props.players.length
    const degreesPerEntry = 360 / count
    const fontSize = count <= 4 ? 30 : count <= 6 ? 26 : count <= 8 ? 22 : count <= 10 ? 18 : 15
    const maxChars = count <= 4 ? 12 : count <= 6 ? 9 : count <= 8 ? 7 : 5
    const textRadius = RADIUS * (count <= 6 ? 0.62 : 0.58)

    return props.players.map((player, index) => {
        const startAngle = index * degreesPerEntry
        const endAngle = (index + 1) * degreesPerEntry

        const startRad = ((startAngle - 90) * Math.PI) / 180
        const endRad = ((endAngle - 90) * Math.PI) / 180

        const x1 = CX + RADIUS * Math.cos(startRad)
        const y1 = CY + RADIUS * Math.sin(startRad)
        const x2 = CX + RADIUS * Math.cos(endRad)
        const y2 = CY + RADIUS * Math.sin(endRad)

        const largeArc = degreesPerEntry > 180 ? 1 : 0
        const pathData = `M ${CX} ${CY} L ${x1} ${y1} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${x2} ${y2} Z`

        const midAngle = (startAngle + endAngle) / 2
        const midRad = ((midAngle - 90) * Math.PI) / 180
        const textX = CX + textRadius * Math.cos(midRad)
        const textY = CY + textRadius * Math.sin(midRad)

        const label = player.name.length > maxChars ? player.name.slice(0, maxChars) + '…' : player.name

        return { pathData, color: player.color, textX, textY, midAngle, label, fontSize }
    })
})

const singlePlayer = computed(() =>
    props.players.length === 1 ? props.players[0] : null
)

const sectorsStyle = computed(() => ({
    transformOrigin: `${CX}px ${CY}px`,
    transform: `rotate(${props.rotation}deg)`,
    transition: props.isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
}))
</script>

<template>
    <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 730 730"
            :class="['wheel-svg', { 'is-spinning': isSpinning }]"
            style="width: 100%; height: 100%"
        >
            <circle class="frame" cx="365" cy="365" r="347.6" fill="#fff" />

            <g class="sticks" fill="#fff">
                <rect x="360.4" width="9.3" height="24.33" rx="4" ry="4" />
                <rect x="352.8" y="713.2" width="24.3" height="9.27" rx="4" ry="4" transform="translate(1082.8 352.8) rotate(90)" />
                <rect x="176.4" y="54.8" width="24.3" height="9.27" rx="4" ry="4" transform="translate(145.8 -133.6) rotate(60)" />
                <rect x="529.2" y="665.9" width="24.3" height="9.27" rx="4" ry="4" transform="translate(851.4 -133.6) rotate(60)" />
                <rect x="47.3" y="183.9" width="24.3" height="9.27" rx="4" ry="4" transform="translate(102.3 -4.5) rotate(30)" />
                <rect x="658.4" y="536.8" width="24.3" height="9.27" rx="4" ry="4" transform="translate(360.5 -262.7) rotate(30)" />
                <rect y="360.4" width="24.3" height="9.27" rx="4" ry="4" />
                <rect x="705.7" y="360.4" width="24.3" height="9.27" rx="4" ry="4" />
                <rect x="47.3" y="536.8" width="24.3" height="9.27" rx="4" ry="4" transform="translate(-262.7 102.3) rotate(-30)" />
                <rect x="658.4" y="183.9" width="24.3" height="9.27" rx="4" ry="4" transform="translate(-4.5 360.5) rotate(-30)" />
                <rect x="176.4" y="665.9" width="24.3" height="9.27" rx="4" ry="4" transform="translate(-486.4 498.6) rotate(-60)" />
                <rect x="529.2" y="54.8" width="24.3" height="9.27" rx="4" ry="4" transform="translate(219.2 498.6) rotate(-60)" />
            </g>

            <g :style="sectorsStyle">
                <template v-if="singlePlayer">
                    <circle :cx="CX" :cy="CY" :r="RADIUS" :fill="singlePlayer.color" stroke="#fff" stroke-width="2" />
                    <text
                        :x="CX"
                        :y="CY"
                        fill="#fff"
                        font-size="24"
                        font-weight="bold"
                        text-anchor="middle"
                        dominant-baseline="middle"
                        style="pointer-events: none; user-select: none"
                    >
                        {{ singlePlayer.name }}
                    </text>
                </template>

                <template v-else-if="sectors">
                    <g v-for="(sector, i) in sectors" :key="i">
                        <path :d="sector.pathData" :fill="sector.color" stroke="#fff" stroke-width="2" />
                        <text
                            :x="sector.textX"
                            :y="sector.textY"
                            fill="#000"
                            :font-size="sector.fontSize"
                            font-weight="800"
                            text-anchor="middle"
                            dominant-baseline="middle"
                            :transform="`rotate(${sector.midAngle}, ${sector.textX}, ${sector.textY})`"
                            style="pointer-events: none; user-select: none; font-family: 'Nunito', sans-serif"
                        >
                            {{ sector.label }}
                        </text>
                    </g>
                </template>

                <template v-else>
                    <circle :cx="CX" :cy="CY" :r="RADIUS" fill="#e5e7eb" stroke="#fff" stroke-width="2" />
                    <text
                        :x="CX"
                        :y="CY"
                        fill="#9ca3af"
                        font-size="20"
                        text-anchor="middle"
                        dominant-baseline="middle"
                    >
                        Ajoute des joueurs
                    </text>
                </template>
            </g>

            <g opacity="0.15">
                <path d="M46.9,372.5c0-181.7,147.4-329,329.1-329A327.3,327.3,0,0,1,556.3,97.2,327.3,327.3,0,0,0,365,35.9C183.3,35.9,35.9,183.3,35.9,365c0,115.2,59.2,216.5,148.8,275.3C101.3,580.6,46.9,482.9,46.9,372.5Z" />
            </g>

            <g>
                <g opacity="0.2">
                    <circle cx="368.5" cy="368.5" r="54.5" />
                </g>
                <circle cx="365" cy="365" r="54.5" fill="#fff" />
                <circle cx="365" cy="365" r="11.6" fill="#ccc" />
            </g>

            <g>
                <path d="M707,160.5c-11.4-17.9-35.8-22.8-54.5-11a41.7,41.7,0,0,0-13.6,14.1l-33.6,58.9a2.3,2.3,0,0,0,0,2.4,2.4,2.4,0,0,0,2.3,1.1l67.5-5.1a43.8,43.8,0,0,0,18.6-6.3C712.4,202.7,718.3,178.5,707,160.5Z" fill-opacity="0.22" />
                <path d="M711.9,157.4a38.4,38.4,0,0,0-66,1.8l-31.5,57.5a2.1,2.1,0,0,0,0,2.4,2.6,2.6,0,0,0,2.2,1.2l65.6-3.9a39.6,39.6,0,0,0,17.9-5.9A38.5,38.5,0,0,0,711.9,157.4Z" fill="#fff" />
                <path d="M681.7,166.9a9.3,9.3,0,0,0-6.6,4.8l-.8,2.1a14.9,14.9,0,0,0-.2,2.1,8.8,8.8,0,0,0,1.1,4.2,9.2,9.2,0,0,0,2.9,3,7.6,7.6,0,0,0,2.9,1.3l1.1.2a8.6,8.6,0,0,0,4.2-.6,8.4,8.4,0,0,0,3.4-2.5,7.4,7.4,0,0,0,2-3.8,8.5,8.5,0,0,0-.1-4.2,8.4,8.4,0,0,0-2.1-3.8,7.4,7.4,0,0,0-3.5-2.3l-1-.3A12.2,12.2,0,0,0,681.7,166.9Z" fill="#ccc" />
            </g>
        </svg>

        <div class="mt-4 text-center">
            <p v-if="isSpinning" class="text-lg font-black" style="font-family: 'Nunito', sans-serif; color: #fff">
                La roue tourne…
            </p>
            <p v-else-if="players.length === 0" class="text-base font-semibold" style="color: rgba(255,255,255,0.75)">
                Ajoute au moins 2 joueurs
            </p>
            <p v-else-if="players.length === 1" class="text-base font-semibold" style="color: rgba(255,255,255,0.75)">
                Il faut au moins 2 joueurs
            </p>
            <p v-else class="text-base font-semibold" style="color: rgba(255,255,255,0.75)">
                Clique pour tourner
            </p>
        </div>
    </div>
</template>
