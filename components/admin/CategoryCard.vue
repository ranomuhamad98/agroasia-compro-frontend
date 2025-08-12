<template>
    <div class="card">
        <div class="p-4 border-b border-green-100">
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <h3 class="text-lg font-semibold text-green-800 mb-2">{{ category.name }}</h3>
                    <div class="flex items-center gap-1 text-xs text-gray-500">
                        <span>ID: {{ category.id }}</span>
                    </div>
                </div>
                <div class="flex space-x-1 ml-3">
                    <button @click="onEdit" class="btn-secondary p-2" title="Edit Category">
                        <Edit class="w-4 h-4" />
                    </button>
                    <button @click="onDelete"
                        class="border border-red-300 text-red-700 hover:bg-red-50 p-2 rounded-md transition-colors"
                        title="Delete Category">
                        <Trash2 class="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
        <div class="p-4">
            <div class="relative">
                <img :src="category.image_link || '/placeholder.svg?height=200&width=200'" :alt="category.name"
                    class="w-full h-32 object-cover rounded-md mb-3 border border-green-200" />
            </div>
            <div class="flex justify-between items-center text-xs text-gray-500">
                <span>Created: {{ formatDate(category.input_time) }}</span>
                <span v-if="category.update_time !== category.input_time">
                    Updated: {{ formatDate(category.update_time) }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Edit, Trash2 } from 'lucide-vue-next';

const props = defineProps({
    category: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['edit', 'delete'])

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

const onEdit = (e: Event) => {
    e.preventDefault()
    emit('edit', props.category)
}

const onDelete = (e: Event) => {
    e.preventDefault()
    emit('delete', props.category)
}
</script>