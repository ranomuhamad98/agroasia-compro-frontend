<template>
    <div class="tp-home-programs-base">
        <div class="tp-home-programs-container">
            <div class="tp-home-about-image">
                <img src="/images/home/programs/thumbnail.png" alt="programs" />
            </div>
            <div class="tp-home-about-content">
                <div class="tp-home-programs-title">
                    <img src="/images/home/programs/icon.png" alt="programs-icon" />
                    <div class="tp-home-programs-title-content">
                        <h3 class="tp-home-title">Farmer Development Program</h3>
                        <p class="tp-home-text-base">From farmer to global</p>
                    </div>
                </div>
                <div class="tp-home-programs-content-container">
                    
                    <div v-for="item in aboutUs" :key="item.title" class="tp-home-about-content-list">
                        <div class="tp-home-about-content-list-header">
                            <div class="tp-home-programs-content-list-header-icon" />
                            <p class="tp-home-subtitle">{{ item.title }}</p>
                        </div>
                        <div class="tp-home-programs-content-list-description">
                            <p>{{ item.description }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const aboutUs = [
    {
        title: 'Training & Development',
        description: 'We provide farmers with practical knowledge, sustainable farming methods, and technical support to improve productivity and crop quality.',
    },
    {
        title: 'Cultivation Support',
        description: 'Our team assists in the planting phase with proper planning, resource allocation, and monitoring to ensure optimal growth and output.',
    },
    {
        title: 'Outtake & Market Access',
        description: 'We commit to purchasing harvests directly from partner farmers, providing fair prices and guaranteed market access—reducing risks and increasing farmer income.',
    }
]
</script>