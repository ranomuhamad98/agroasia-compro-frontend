<template>
    <div class="card mt-0">
        <div class="card-body p-0">
            <button :disabled="props.loading" @click="onDelete"
                class="absolute top-4 right-4 border border-red-300 bg-red-300/70 text-red-700 hover:bg-red-50 p-2 rounded-md transition-colors">
                <Trash2 class="w-4 h-4" />
            </button>
            <img :src="props.data.image_link" :alt="props.data.alt" />
            <div class="bg-green-700">
                <p class="mb-0 text-white px-3 py-2 flex items-center gap-2">
                    <ImageIcon class="w-4 h-4" /> {{ props.data.alt }}
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ImageIcon, Trash2 } from 'lucide-vue-next';
import type { DeepReadonly } from 'vue';


const props = defineProps({
    data: {
        type: Object as PropType<DeepReadonly<GalleryData>>,
        required: true,
    },
    loading: {
        type: Boolean,
        default: true
    }
});

const emit = defineEmits(['delete'])

const onDelete = (e: Event) => {
    e.preventDefault()
    if (confirm('Are you sure you want to delete this gallery?')) {
        emit('delete', props.data)
    }
}
</script>