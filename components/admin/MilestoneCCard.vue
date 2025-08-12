<template>
    <div class="card mt-0">
        <div class="card-header p-4 pb-0 border-b border-green-100">
            <div>
                <div class="flex space-x-1 mb-4 justify-end">
                    <button :disabled="loading" @click="onEdit" class="btn-secondary p-2 disabled:opacity-50">
                        <Edit class="w-4 h-4" />
                    </button>
                    <button :disabled="loading" @click="onDelete"
                        class="border border-red-300 text-red-700 hover:bg-red-50 p-2 rounded-md transition-colors">
                        <Trash2 class="w-4 h-4" />
                    </button>
                </div>
                <div class="flex flex-col">
                    <h3 class="text-green-800 font-semibold text-xl mb-0">{{ data.title }}</h3>
                    <p>{{ data.sub_title }}</p>
                </div>
            </div>
        </div>
        <div class="card-body p-4">
            <img :src="data.media_link" alt="Milestone Image" class="bg-gray-100 w-full h-48 object-cover rounded-md mb-3 border border-green-200" />
            <p>{{ data.content }}</p>
            <p>🗓️ Year: {{ data.tahun }} | 📌 Position: {{ data.position }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Edit, Trash2 } from 'lucide-vue-next';
import type { Milestone } from '@/types/milestone-api-type';

const props = defineProps({
    data: {
        type: Object as PropType<Milestone>,
        required: true,
    },
    loading: {
        type: Boolean,
        default: true
    }
});

const emit = defineEmits(['delete', 'edit']);

const onDelete = (e: Event) => {
    e.preventDefault();
    if (confirm('Are you sure you want to delete this milestone?')) {
        emit('delete', props.data);
    }
}

const onEdit = (e: Event) => {
    e.preventDefault();
    emit('edit', props.data);
}
</script>