<template>
    <div class="card">
        <div class="card-header flex justify-between items-center">
            <h3 class="text-green-800 font-semibold text-xl mb-0 mx-2">List of Our People</h3>
            <div class="flex items-center gap-4">
                <button class="btn-ghost text-green-600 flex items-center gap-2" @click="handleRefresh">
                    <RefreshCcw class="w-4 h-4" />
                    Refresh
                </button>
                <button class="btn-primary flex items-center gap-2" @click="createNewOurPeople">
                    <PlusIcon class="w-4 h-4" />
                    Add Our People
                </button>
            </div>
        </div>

        <!-- loading -->
        <div v-if="ourPeopleLoading">
            <div class="flex justify-center items-center h-full gap-2 m-2">
                <Loader2Icon class="w-4 h-4 animate-spin text-green-500" />
                Loading...
            </div>
        </div>

        <div class="p-6 space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            <OurPeopleCard v-for="person in ourPeople" :key="person.id" :data="person" :loading="isLoading"
                @delete="handleDelete" @edit="handleEdit" />
        </div>
    </div>

    <OurPeopleForm v-if="showOurPeopleForm" :show="showOurPeopleForm" :person="selectedPerson || undefined"
        @close="showOurPeopleForm = false" @save="handleSave" />
</template>

<script setup lang="ts">
import OurPeopleCard from './OurPeopleCard.vue';
import OurPeopleForm from './OurPeopleForm.vue';
import { Loader2Icon, PlusIcon, RefreshCcw } from 'lucide-vue-next';
import type { OurPeopleData } from '@/types/about-api-type';

const showOurPeopleForm = ref<boolean>(false);
const selectedPerson = ref<OurPeopleData | null>(null);

const {
    ourPeople,
    isLoading: ourPeopleLoading,
    refreshAboutData,
} = useAboutApi()

const {
    ourPeopleList,
    isLoading,
    updateOurPeople,
    deleteOurPeople,
    error,
    totalCount,
    activeCount,
} = useOurPeopleManagement();

const handleRefresh = () => {
    refreshAboutData();
}

const handleDelete = (person: OurPeopleData) => {
    deleteOurPeople(person.id).then(() => {
        handleRefresh();
    });
}

const handleEdit = (person: OurPeopleData) => {
    showOurPeopleForm.value = true;
    selectedPerson.value = person;
}

const createNewOurPeople = () => {
    showOurPeopleForm.value = true;
}

const handleSave = () => {
    showOurPeopleForm.value = false;
    handleRefresh();
}
</script>