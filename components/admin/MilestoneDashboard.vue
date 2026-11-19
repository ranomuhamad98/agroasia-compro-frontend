<template>
    <div class="card">
        <div class="card-header flex justify-between items-center">
            <div class="flex items-center gap-4">
                <h3 class="text-green-800 font-semibold text-xl mb-0 mx-2">List of Milestone</h3>
                <select v-model="milestoneStatus" class="border border-green-200 rounded-md p-2">
                    <option value="">All</option>
                    <option value="active">Active Only</option>
                </select>
            </div>
            <div class="flex items-center gap-4">
                <button class="btn-ghost text-green-600 flex items-center gap-2" @click="handleRefresh">
                    <RefreshCcw class="w-4 h-4" />
                    Refresh
                </button>
                <button class="btn-primary flex items-center gap-2" @click="createNewMilestone">
                    <PlusIcon class="w-4 h-4" />
                    Add Milestone
                </button>
            </div>
        </div>

        <!-- loading -->
        <div v-if="milestoneLoading">
            <div class="flex justify-center items-center h-full gap-2 m-2">
                <Loader2Icon class="w-4 h-4 animate-spin text-green-500" />
                Loading...
            </div>
        </div>

        <div class="p-6 space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            <MilestoneCCard v-for="milestone in milestones" :key="milestone.id" :data="milestone" :loading="milestoneLoading"
                @delete="handleDelete" @edit="handleEdit" />
        </div>
    </div>

    <MilestoneForm v-if="showMilestoneForm" :show="showMilestoneForm" :person="selectedMilestone || undefined"
        @close="showMilestoneForm = false" @save="handleSave" />
</template>

<script setup lang="ts">
import MilestoneCCard from './MilestoneCCard.vue';
import { Loader2Icon, PlusIcon, RefreshCcw } from 'lucide-vue-next';
import type { Milestone, MilestonePayload } from '@/types/milestone-api-type';
import MilestoneForm from './MilestoneForm.vue';

const showMilestoneForm = ref<boolean>(false);
const selectedMilestone = ref<Milestone | null>(null);
const milestoneStatus = ref<string>('');

const {
    milestones,
    isLoading: milestoneLoading,
    getMilestones,
    deleteMilestone,
} = useMilestoneManagement();

onMounted(() => {
    getMilestones(milestoneStatus.value === 'active');
});

watch(milestoneStatus, () => {
    getMilestones(milestoneStatus.value === 'active');
});

const handleRefresh = () => {
    getMilestones(milestoneStatus.value === 'active');
}

const handleDelete = (milestone: Milestone) => {
    deleteMilestone(milestone.id).then(() => {
        handleRefresh();
    });
}

const handleEdit = (milestone: Milestone) => {
    showMilestoneForm.value = true;
    selectedMilestone.value = milestone;
}

const createNewMilestone = () => {
    showMilestoneForm.value = true;
}

const handleSave = () => {
    showMilestoneForm.value = false;
    handleRefresh();
}
</script>