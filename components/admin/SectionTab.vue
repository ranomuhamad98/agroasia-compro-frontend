<template>
    <HeaderLayout title="Section" subtitle="Manage sections for your website."
        @refresh="() => refresh()"
        />

    <div v-if="pending">
        <div class="flex justify-center items-center h-full gap-2 m-2">
            <Loader2Icon class="w-4 h-4 animate-spin text-green-500" />
            Loading...
        </div>
    </div>

    <div v-else-if="!pending && sectionsName.length > 0">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SectionCard v-for="section in sectionsName" :key="section" :name="section" />
        </div>
    </div>
</template>

<script setup lang="ts">
import HeaderLayout from './HeaderLayout.vue';
import { Loader2Icon  } from 'lucide-vue-next';
import { useSectionsApi } from '@/composables/useSectionsApi';
import SectionCard from './SectionCard.vue';

const { sectionsName, pending, refresh } = useSectionsApi();
</script>