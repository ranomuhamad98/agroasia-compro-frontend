<template>
    <div>
        <div class="card mt-0 mb-4">
            <div class="card-header flex justify-between items-center">
                <h3 class="text-green-800 font-semibold text-lg mb-0 capitalize">{{ name }}</h3>
                <div class="flex items-center gap-2">
                    <button class="btn-secondary p-2 hover:!bg-green-600/50 disabled:opacity-50 flex items-center gap-2"
                        @click="() => refresh()" :disabled="pending">
                        <RefreshCcw class="w-4 h-4" />
                    </button>
                    <button class="btn-secondary p-2 hover:!bg-green-600/50 disabled:opacity-50 flex items-center gap-2" @click="handleMinimize"
                        :disabled="pending">
                        <Minimize2Icon v-if="!isMinimized" class="w-4 h-4" />
                        <Maximize2Icon v-else class="w-4 h-4" />
                    </button>
                </div>
            </div>
            <div
                :class="{ ' transition-all duration-300 transform-gpu will-change-transform max-h-[calc(100vh-200px)] overflow-y-auto': true, 'card-body p-4': !isMinimized, 'card-body p-0 h-0 overflow-hidden': isMinimized }">
                <div v-for="setting in sectionSettings" :key="setting.id">
                    <div class="card mb-4">
                        <div class="card-header flex justify-between items-center flex-wrap">
                            <h3 class="text-green-800 font-semibold text-lg mb-0 capitalize">{{ setting.tipe }}</h3>
                            <button class="btn-secondary p-2 hover:!bg-green-600/50 disabled:opacity-50 flex items-center gap-2" @click="handleEdit(setting)">
                                <Edit class="w-4 h-4" />
                            </button>
                        </div>
                        <div class="card-body p-4 pb-4">
                            <p v-if="!isListTipe(setting.tipe)">{{ setting.value }}</p>
                            <div v-else class="space-y-2 mb-4 ml-3">
                                <ul class="list-disc pl-5 space-y-1" v-if="parseList(setting.value).length">
                                    <li v-for="(item, idx) in parseList(setting.value)" :key="idx">
                                        <span class="font-medium">{{ item.title }}</span>
                                        <span v-if="item.content"> - {{ item.content }}</span>
                                    </li>
                                </ul>
                                <p v-else class="text-gray-500">Tidak ada item</p>
                            </div>
                            <div v-if="isImageTipe(setting.tipe) && setting.value" class="mt-2 mb-4">
                                <img :src="setting.value" :alt="setting.tipe" class="h-24 w-24 object-cover rounded border border-green-200" />
                            </div>
                            <div class="flex justify-start items-center flex-wrap gap-4 border-t border-green-100 pt-2">
                                <p class="mb-0">📌 {{ setting.position }}</p>
                                <p class="mb-0">🗓️ {{ formatDate(setting.input_time) }}</p>
                                <p class="mb-0" v-if="setting.update_time !== setting.input_time">🔄 {{
                                    formatDate(setting.update_time)
                                }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <SectionForm v-if="showForm" :data="selectedSection" @close="showForm = false" @save="handleSave" />
</template>

<script setup lang="ts">
import { RefreshCcw, Minimize2Icon, Maximize2Icon, Edit } from 'lucide-vue-next';
import { useSectionSettingsApi } from '@/composables/useSectionSettingsApi';
import dayjs from 'dayjs';
import SectionForm from './SectionForm.vue';
import type { Section } from '@/types/sections-api-types';

const props = defineProps({
    name: {
        type: String,
        required: true
    },
})

const isMinimized = ref(false);
const showForm = ref(false);
const selectedSection = ref<Section | null>(null);

const { sectionSettings, pending, refresh } = useSectionSettingsApi(props.name);

const formatDate = (date: string) => {
    return dayjs(date).format('DD MMM YYYY');
}

const handleMinimize = () => {
    isMinimized.value = !isMinimized.value;
}

const handleEdit = (section: Section) => {
    showForm.value = true;
    selectedSection.value = section;
}

const handleSave = () => {
    showForm.value = false;
    refresh();
}

const imageLikeTipes = ['icon', 'image_link', 'logo', 'about_us_media_link', 'jumbotron_image']
const isImageTipe = (tipe: string) => imageLikeTipes.includes((tipe || '').toLowerCase())
const listLikeTipes = ['list', 'our_value_list', 'about_us_list']
const isListTipe = (tipe: string) => listLikeTipes.includes((tipe || '').toLowerCase())
const parseList = (value: string) => {
    try {
        const parsed = JSON.parse(value)
        if (Array.isArray(parsed)) {
            return parsed.map((i: any) => ({ title: String(i?.title || ''), content: String(i?.content || '') }))
        }
    } catch (_) {}
    return []
}
</script>