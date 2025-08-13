<template>
    <div>
        <HeaderLayout title="FAQ" subtitle="Manage frequently asked questions for your website."
            @refresh="() => handleRefresh()"
            action-message="Add FAQ"
            @action="openFAQDialog"
            />

        <div class="mb-4">
            <select v-model="filterType" @change="() => handleRefresh()"
                class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="active">Active</option>
                <option value="">Inactive</option>
            </select>
        </div>

        <div v-if="pending">
            <div class="flex justify-center items-center h-full gap-2 m-2">
                <Loader2Icon class="w-4 h-4 animate-spin text-green-500" />
                Loading...
            </div>
        </div>

        <div v-else-if="!pending && faq.length === 0" class="text-center py-12">
            <div class="text-gray-500">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">No FAQ found</h3>
                <p class="mt-1 text-sm text-gray-500">
                    {{ filterType === 'all' ? 'Get started by creating a new FAQ.' : `No ${filterType === 'active' ? 'active' : 'inactive'}
                    FAQ found.` }}
                </p>
                <div class="mt-6">
                    <button @click="openFAQDialog()" class="btn-primary flex items-center gap-2 mx-auto">
                        <PlusIcon class="w-4 h-4 mr-2" />
                        Add New FAQ
                    </button>
                </div>
            </div>
        </div>

        <div v-else>
            <div>
                <FAQCard v-for="item in faq" :key="item.id" :data="item" @edit="handleEdit" @delete="handleDelete" />
            </div>
        </div>

        <FAQForm v-if="showFAQDialog" :data="selectedFAQ" @close="showFAQDialog = false" @save="handleSave" />
    </div>
</template>

<script setup lang="ts">
import HeaderLayout from './HeaderLayout.vue';
import FAQCard from './FAQCard.vue';
import { useFAQApi } from '@/composables/useFAQApi';
import { Loader2Icon, PlusIcon } from 'lucide-vue-next';
import type { FAQ } from '@/types/faq-api-type';
import FAQForm from './FAQForm.vue';
import { useFAQManagement } from '@/composables/useFAQManagement';

const showFAQDialog = ref(false);
const selectedFAQ = ref<FAQ | undefined>(undefined);
const filterType = ref('');

const { faq, refresh, pending } = useFAQApi({ active_only: true });
const { deleteFAQ } = useFAQManagement();

const handleRefresh = () => {
    refresh(filterType.value === 'active' ? { active_only: true } : undefined);
}

const handleDelete = (item: FAQ) => {
    deleteFAQ(item.id);
    handleRefresh();
}

const handleEdit = (item: FAQ) => {
    selectedFAQ.value = item;
    showFAQDialog.value = true;
}

const openFAQDialog = () => {
    selectedFAQ.value = undefined;
    showFAQDialog.value = true;
}

const handleSave = () => {
    showFAQDialog.value = false;
    handleRefresh();
}
</script>