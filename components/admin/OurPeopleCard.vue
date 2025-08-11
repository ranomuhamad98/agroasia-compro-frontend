<template>
    <div class="card h-full mt-0">
        <div class="p-4 pb-0 border-b border-green-100">
            <div class="flex justify-between items-center border-b border-green-100 pb-2">

                <span :class="[
                    'text-xs px-2 py-1 rounded-full',
                    'bg-green-600 text-white'
                ]">
                    Active
                </span>
                <div class="flex space-x-1">
                    <button :disabled="props.loading" @click="onEdit" class="btn-secondary p-2 disabled:opacity-50">
                        <Edit class="w-4 h-4" />
                    </button>
                    <button :disabled="props.loading" @click="onDelete"
                        class="border border-red-300 text-red-700 hover:bg-red-50 p-2 rounded-md transition-colors">
                        <Trash2 class="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div class="my-4">
                <div class="flex items-center gap-2 mb-1">
                    <h3 class="text-lg font-semibold text-green-800 mb-0">{{ data.name }}</h3>
                </div>
                <p class="text-sm font-medium text-green-700">{{ data.title }}</p>
            </div>
        </div>
        <div class="p-4">
            <div class="flex items-start space-x-4">
                <img :src="data.image_link || '/placeholder.svg?height=100&width=100'" :alt="data.name"
                    class="w-16 h-16 rounded-full object-cover border-2 border-green-200" />
                <div class="flex-1">
                    <p class="text-sm mt-2 flex items-center gap-2">
                        <MapPin class="w-4 h-4" />
                        {{ data.lokasi }}
                    </p>
                    <p class="text-sm mt-2 flex items-center gap-2">
                        <Paperclip class="w-4 h-4" />
                        {{ data.keterangan }}
                    </p>
                    <p class="text-sm mt-2 flex items-center gap-2">
                        <Calendar class="w-4 h-4" />
                        Bertani sejak: {{ data.bertani_sejak }} | Bermitra sejak: {{ data.bermitra_sejak }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Edit, Trash2, MapPin, Paperclip, Calendar } from 'lucide-vue-next';

const props = defineProps({
    data: {
        type: Object,
        required: true
    },
    loading: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['delete', 'edit'])

const onDelete = (e: Event) => {
    e.preventDefault()
    if (confirm('Are you sure you want to delete this our people?')) {
        emit('delete', props.data)
    }
}

const onEdit = (e: Event) => {
    e.preventDefault()
    emit('edit', props.data)
}
</script>