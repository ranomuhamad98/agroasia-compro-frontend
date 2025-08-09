<template>
    <div class="flex justify-between items-center mb-6">
        <div>
            <h2 class="page-title">{{ title }}</h2>
            <p class="page-subtitle">{{ subtitle }}</p>
        </div>
        <div class="flex items-center gap-3">
            <button @click="onRefresh" :disabled="disableRefresh"
                class="btn-secondary flex items-center gap-2 disabled:opacity-50"
                :title="disableRefresh ? 'Please authenticate first' : refreshAlt">
                <RefreshCwIcon class="w-4 h-4" :class="{ 'animate-spin': loading }" />
                {{ categoriesLoading ? 'Loading...' : refreshMessage }}
            </button>
            <button @click="onAction" :disabled="disableAction" class="btn-primary flex items-center gap-2">
                <PlusIcon class="w-4 h-4" />
                {{ actionMessage }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { RefreshCwIcon, PlusIcon } from 'lucide-vue-next'

const props = defineProps({
    title: {
        type: String,   
        required: true
    },
    subtitle: {
        type: String,
        required: true
    },
    actionMessage: {
        type: String,
        required: true
    },
    refreshAlt: {
        type: String,
        default: 'Refresh'
    },
    refreshMessage: {
        type: String,
        default: 'Refresh'
    },
    disableRefresh: {
        type: Boolean,
        default: false
    },
    disableAction: {
        type: Boolean,
        default: false
    },
    loading: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['refresh', 'action'])

const onRefresh = (e) => {
    e.preventDefault();
    emit('refresh');    
}

const onAction = (e) => {
    e.preventDefault()
    emit('action');
}

</script>