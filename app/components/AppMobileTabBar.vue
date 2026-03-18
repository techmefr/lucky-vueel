<script setup lang="ts">
interface Tab {
    id: string
    label: string
    icon: string
}

defineProps<{
    modelValue: string
    tabs: Tab[]
}>()

defineEmits<{
    'update:modelValue': [value: string]
}>()
</script>

<template>
    <!-- rgba(0,0,0,0.65) sur tomato → L≈0.10 → blanc = 11:1 AAA -->
    <nav
        class="fixed bottom-0 left-0 right-0 z-50 sm:hidden"
        style="background-color: rgba(0,0,0,0.65); backdrop-filter: blur(12px)"
    >
        <div class="flex">
            <button
                v-for="tab in tabs"
                :key="tab.id"
                class="flex-1 flex flex-col items-center gap-1 py-3 px-2 transition-opacity"
                :style="{ color: 'white', opacity: modelValue === tab.id ? '1' : '0.55' }"
                @click="$emit('update:modelValue', tab.id)"
            >
                <UIcon :name="tab.icon" class="w-5 h-5" />
                <span class="text-xs font-bold">{{ tab.label }}</span>
                <div
                    class="h-0.5 w-5 rounded-full transition-all"
                    :style="{ backgroundColor: modelValue === tab.id ? 'white' : 'transparent' }"
                />
            </button>
        </div>
    </nav>
</template>
