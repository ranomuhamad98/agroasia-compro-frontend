<template>
    <div>
        <HeaderLayout title="Testimonial Management"
            subtitle="Manage customer testimonials for home and about us pages." actionMessage="Add Testimonial"
            :disableRefresh="testimonialsPending" :loading="testimonialsPending" @action="openTestimonialDialog"
            @refresh="handleRefresh" />

        <!-- Filter Controls -->
        <div class="mb-6 p-4 bg-gray-50 rounded-lg">
            <div class="flex flex-wrap items-center gap-4">
                <div class="flex items-center gap-2">
                    <label class="text-sm font-medium text-gray-700">Filter:</label>
                    <select v-model="filterType" @change="handleFilterChange"
                        class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">All Testimonials</option>
                        <option value="active">Active Only</option>
                    </select>
                </div>

                <div class="flex items-center gap-2">
                    <span class="text-sm text-gray-600">
                        Showing {{ testimonials.length }} testimonial{{ testimonials.length !== 1 ? 's' : '' }}
                    </span>
                </div>
            </div>
        </div>

        <!-- Error Message -->
        <div v-if="testimonialsError" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {{ testimonialsError }}
        </div>

        <!-- Testimonials Grid -->
        <div v-if="testimonials.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TestimonialCard
                v-for="testimonial in testimonials" :key="testimonial.id" :testimonial="testimonial"
                @delete="handleDeleteTestimonial" @edit="handleEditTestimonial" />
        </div>

        <!-- Empty State -->
        <div v-else-if="!testimonialsPending" class="text-center py-12">
            <div class="text-gray-500">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">No testimonials found</h3>
                <p class="mt-1 text-sm text-gray-500">
                    {{ filterType === 'all' ? 'Get started by creating a new testimonial.' : `No ${filterType}
                    testimonials found.` }}
                </p>
                <div class="mt-6">
                    <button @click="openTestimonialDialog()" class="btn-primary flex items-center gap-2 mx-auto">
                        <PlusIcon class="w-4 h-4 mr-2" />
                        Add Testimonial
                    </button>
                </div>
            </div>
        </div>

        <TestimonialForm v-if="showTestimonialForm" :show="showTestimonialForm" :testimonial="selectedTestimonial"
            @close="handleCloseTestimonialDialog"
            @save="handleSaveTestimonial" />
    </div>
</template>

<script setup>
import HeaderLayout from './HeaderLayout.vue';
import { PlusIcon } from 'lucide-vue-next';
import TestimonialForm from './TestimonialForm.vue';
import TestimonialCard from './TestimonialCard.vue';

const showTestimonialForm = ref(false)
const selectedTestimonial = ref(null)

const {
    testimonials,
    testimonialsPending,
    testimonialsError,
    getTestimonials,
    deleteTestimonial
} = useTestimonialManagement();

// Filter state
const filterType = ref('')

onMounted(async () => {
    await getTestimonials()
})

// Handle filter change
const handleFilterChange = async () => {
    try {
        switch (filterType.value) {
            case 'active':
                await getTestimonials(true)
                break
            default:
                await getTestimonials()
                break
        }
    } catch (error) {
        console.error('Error filtering testimonials:', error)
    }
}

// Handle refresh
const handleRefresh = async () => {
    await handleFilterChange()
}

// Handle delete testimonial
const handleDeleteTestimonial = async (testimonial) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
        const success = await deleteTestimonial(testimonial.id)
        if (success) {
            // Refresh the current filter
            await handleFilterChange()
        }
    }
}

// Open testimonial dialog (placeholder - implement based on your modal system)
const openTestimonialDialog = (testimonial = null) => {
    showTestimonialForm.value = true
    selectedTestimonial.value = testimonial
}

const handleCloseTestimonialDialog = () => {
    showTestimonialForm.value = false
    selectedTestimonial.value = null
}

const handleSaveTestimonial = (testimonial) => {
    handleCloseTestimonialDialog()
    handleRefresh()
}

const handleEditTestimonial = (testimonial) => {
    openTestimonialDialog(testimonial)
}
</script>