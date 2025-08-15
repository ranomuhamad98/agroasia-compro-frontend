<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="$emit('close')">
        <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-green-200">
            <div class="p-6 border-b border-green-200">
                <h3 class="text-green-800 text-xl font-semibold">
                    Edit Section
                </h3>
                <p class="text-green-600 mt-1">Fill in the section information below.</p>
            </div>

            <!-- Success/Error Messages -->
            <div v-if="successMessage"
                class="p-4 mx-6 mt-4 bg-green-100 border border-green-400 text-green-700 rounded">
                {{ successMessage }}
            </div>
            <div v-if="error" class="p-4 mx-6 mt-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {{ error }}
            </div>

            <form @submit.prevent="handleSubmit" class="p-6 space-y-4">

                <div class="space-y-2">
                    <label for="sectionPosition" class="text-green-700 font-medium block">Position</label>
                    <input id="sectionPosition" v-model="form.position" type="number" class="input-field" required />
                </div>
                <div class="space-y-2">
                    <label for="sectionContent" class="text-green-700 font-medium block">Content</label>
                    <textarea id="sectionContent" v-model="form.value" type="text"
                        placeholder="e.g., CEO, Company Name" class="input-field" required />
                </div>

                <div class="flex justify-end space-x-2 pt-4">
                    <button type="button" @click="handleCancel" class="btn-secondary">
                        Cancel
                    </button>
                    <button type="submit" class="btn-primary" :disabled="isLoading">
                        <span v-if="isLoading" class="flex items-center gap-2">
                            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin">
                            </div>
                            Updating...
                        </span>
                        <span v-else>
                            Update Section
                        </span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSectionManagement } from '@/composables/useSectionManagement'
import type { Section } from '@/types/sections-api-types'
import { toast } from 'vue3-toastify'

const props = defineProps({
    data: {
        type: Object as PropType<Section | null>,
        required: true
    }
})

const emit = defineEmits(['close', 'save'])

const {
    updateSection,
    isLoading,
    error,
    successMessage,
    clearMessages
} = useSectionManagement()

const form = ref({
    value: props.data?.value || '',
    position: props.data?.position || 0,
})

const handleSubmit = async () => {
    try {
        clearMessages()

        // Update existing FAQ
        const updatedSection = await updateSection(props.data?.id || '', form.value as Section)
        if (updatedSection) {
            emit('save', updatedSection)
        }
    } catch {
        toast.error('Gagal mengupdate section')
    }
}

const handleCancel = () => {
    emit('close')
}
</script>