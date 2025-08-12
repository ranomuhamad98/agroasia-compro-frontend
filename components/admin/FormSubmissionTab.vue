<template>
    <HeaderLayout title="Form Submission" subtitle="Manage contact form submissions from your website.

" @refresh="handleRefresh" />

    <div v-if="isLoading" class="flex items-center space-x-4 justify-center gap-2 mb-4">
        <Loader2Icon class="w-4 h-4 animate-spin text-green-500" />
        Loading...
    </div>

    <ClientOnly v-else fallback="Loading..." fallback-tag="span">
        <FormSubmissions :contactUs="contactUs" />
    </ClientOnly>
</template>

<script setup lang="ts">
import HeaderLayout from './HeaderLayout.vue';
import FormSubmissions from '@/components/admin/FormSubmissions.vue'
import { useContactUsManagement } from '@/composables/useContactUsManagement'
import { Loader2Icon } from 'lucide-vue-next'

const { contactUs, isLoading, getContactUs } = useContactUsManagement()

onMounted(() => {
    getContactUs();
})

const handleRefresh = () => {
    getContactUs();
}
</script>