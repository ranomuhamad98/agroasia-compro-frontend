<template>
    <div class="card mt-0 mb-4">
        <div class="flex justify-between items-center p-4">
            <div class="flex items-center gap-2">
                <p class="bg-green-100 text-green-700 border border-green-300 mb-0 px-3 py-1 rounded-full text-center">📌 {{ data.position
                    }}</p>
                <p :class="{'bg-green-100 text-green-700 border border-green-300 mb-0 px-3 py-1 rounded-full text-center': true, 'bg-red-100 text-red-700 border border-red-300': !data.status}">
                    {{ data.status
                    ? '✅ Active' : '❌ Inactive' }}</p>
            </div>
            <div class="flex space-x-1 ml-3">
                <button @click="handleEdit" class="btn-secondary p-2" title="Edit Category">
                    <Edit class="w-4 h-4" />
                </button>
                <button @click="handleDelete"
                    class="border border-red-300 text-red-700 hover:bg-red-50 p-2 rounded-md transition-colors"
                    title="Delete Category">
                    <Trash2 class="w-4 h-4" />
                </button>
            </div>
        </div>
        <div class="card-body p-4">
            <label class="text-green-800 text-sm mb-0 mx-2">Question</label>
            <h3 class="text-green-800 font-semibold text-lg mb-0 mx-2">{{ data.title }}</h3>
            <label class="text-green-800 text-sm mb-0 mx-2">Answer</label>
            <p class="text-green-800 font-semibold text-lg mb-0 mx-2">{{ data.content }}</p>
        </div>
        <div class="p-4 flex justify-start items-center gap-4">
            <p>🗓️ Created: {{ formatDate(data.input_time) }}</p>
            <p>🔄 Updated: {{ formatDate(data.update_time) }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Trash2, Edit } from 'lucide-vue-next';
import dayjs from 'dayjs';
import type { FAQ } from '@/types/faq-api-type';

const props = defineProps({
    data: {
        type: Object as PropType<FAQ>,
        required: true
    }
});

const emit = defineEmits(['edit', 'delete'])

const handleEdit = () => {
    emit('edit', props.data)
}

const handleDelete = () => {
    if (confirm('Are you sure you want to delete this FAQ?')) {
        emit('delete', props.data)
    }
}

const formatDate = (date: string) => {
    return dayjs(date).format('DD MMM YYYY');
}
</script>