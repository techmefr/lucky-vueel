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
    <nav class="tab-bar fixed bottom-0 left-0 right-0 z-50 sm:hidden" role="tablist">
        <div class="flex">
            <button
                v-for="tab in tabs"
                :key="tab.id"
                class="tab-item flex-1"
                :class="{ 'is-active': modelValue === tab.id }"
                role="tab"
                :aria-selected="modelValue === tab.id"
                :aria-label="tab.label"
                @click="$emit('update:modelValue', tab.id)"
            >
                <UIcon :name="tab.icon" class="w-5 h-5" />
                <span class="text-xs font-bold">{{ tab.label }}</span>
                <div class="tab-indicator" />
            </button>
        </div>
    </nav>
</template>

<style scoped>
.tab-bar {
    background: rgba(30, 10, 10, 0.55);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.tab-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 0.75rem 0.5rem;
    color: white;
    opacity: 0.55;
    transition: opacity 0.15s;
}

.tab-item.is-active {
    opacity: 1;
}

.tab-indicator {
    height: 0.125rem;
    width: 1.25rem;
    border-radius: 9999px;
    background: transparent;
    transition: background 0.15s;
}

.tab-item.is-active .tab-indicator {
    background: white;
}
</style>
