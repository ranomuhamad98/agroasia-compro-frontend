<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="$emit('close')">
        <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-green-200">
            <div class="p-6 border-b border-green-200">
                <h3 class="text-green-800 text-xl font-semibold">
                    {{ data ? 'Edit FAQ' : 'Add New FAQ' }}
                </h3>
                <p class="text-green-600 mt-1">Fill in the FAQ information below.</p>
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
                    <label for="faqTitle" class="text-green-700 font-medium block">Title</label>
                    <input id="faqTitle" v-model="form.title" type="text" class="input-field" required />
                </div>

                <div class="space-y-2">
                    <label for="faqContent" class="text-green-700 font-medium block">Content</label>
                    <textarea id="faqContent" v-model="form.content" type="text"
                        placeholder="e.g., CEO, Company Name" class="input-field" required />
                </div>

                <div class="space-y-2">
                    <label for="faqPosition" class="text-green-700 font-medium block">Position</label>
                    <input id="faqPosition" v-model="form.position" type="number" class="input-field"
                        required />
                </div>

                <div class="space-y-2">
                    <label for="faqStatus" class="text-green-700 font-medium block">Status</label>
                    <select id="faqStatus" v-model="form.status" class="input-field" required>
                        <option :value="true">Active</option>
                        <option :value="false">Inactive</option>
                    </select>
                </div>

                <div class="flex justify-end space-x-2 pt-4">
                    <button type="button" @click="handleCancel" class="btn-secondary">
                        Cancel
                    </button>
                    <button type="submit" class="btn-primary" :disabled="isLoading">
                        <span v-if="isLoading" class="flex items-center gap-2">
                            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin">
                            </div>
                            {{ data ? 'Updating...' : 'Creating...' }}
                        </span>
                        <span v-else>
                            {{ data ? 'Update' : 'Add' }} FAQ
                        </span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useFAQManagement } from '@/composables/useFAQManagement'
import type { FAQ } from '@/types/faq-api-type'

const props = defineProps({
    data: {
        type: Object as PropType<FAQ> | null,
        required: false
    }   
})

const emit = defineEmits(['close', 'save'])

const {
    createFAQ,
    updateFAQ,
    isLoading,
    error,
    successMessage,
    clearMessages
} = useFAQManagement()

const form = ref({
    title: props.data?.title || '',
    content: props.data?.content || '',
    position: props.data?.position || 0,
    status: props.data?.status
})

const handleSubmit = async () => {
    try {
        clearMessages()

        if (props.data?.id) {
            // Update existing FAQ
            const updatedFAQ = await updateFAQ(props.data.id, {
                title: form.value.title,
                content: form.value.content,
                position: form.value.position,
                status: form.value.status ?? true,
            })
            if (updatedFAQ) {
                emit('save', updatedFAQ)
            }
        } else {
            // Create new FAQ
            const newFAQ = await createFAQ({
                title: form.value.title,
                content: form.value.content,
                position: form.value.position,
                status: form.value.status ?? true,
            })
            if (newFAQ) {
                emit('save', newFAQ)
            }
        }
    } catch {
        // toast.error('Gagal menambahkan FAQ')
    }
}

const handleCancel = () => {
    emit('close')
}
</script>