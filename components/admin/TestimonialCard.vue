<template>
    <div class="card">
        <div class="p-4 border-b border-green-100">
            <div class="flex justify-between items-start">
                <div class="flex items-center gap-2">
                    <h3 class="text-lg font-semibold text-green-800">{{ testimonial.name }}</h3>
                    <span :class="[
                        'text-xs px-2 py-1 rounded-full',
                        testimonial.status
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 border border-gray-300'
                    ]">
                        {{ testimonial.status ? 'Active' : 'Inactive' }}
                    </span>
                </div>
                <div class="flex space-x-1">
                    <button :disabled="loading" @click="onEdit" class="btn-secondary p-2 disabled:opacity-50">
                        <EditIcon class="w-4 h-4" />
                    </button>
                    <button :disabled="loading" @click="onDelete"
                        class="border border-red-300 text-red-700 hover:bg-red-50 p-2 rounded-md transition-colors">
                        <Trash2Icon class="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
        <div class="p-4">
            <div class="flex items-start space-x-4">
                <img :src="testimonial.pic || '/placeholder.svg?height=100&width=100'" :alt="testimonial.name"
                    class="w-16 h-16 rounded-full object-cover border-2 border-green-200" />
                <div class="flex-1">
                    <p class="text-sm font-medium text-green-700">{{ testimonial.profession }}</p>
                    <p class="text-sm text-green-600 mt-2">{{ testimonial.message }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { EditIcon, Trash2Icon } from 'lucide-vue-next';

const props = defineProps({
    testimonial: {
        type: Object,
        required: true
    },
    loading: {
        type: Boolean,
        required: false,
        default: false
    }
})

const emit = defineEmits(['delete', 'edit'])

const onDelete = (e) => {
    e.preventDefault()
    emit('delete', props.testimonial)
}

const onEdit = (e) => {
    e.preventDefault()
    emit('edit', props.testimonial)
}
</script>