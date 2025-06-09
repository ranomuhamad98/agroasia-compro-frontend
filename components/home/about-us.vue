<template>
    <div class="tp-home-about-base">
        <div class="tp-home-about-container">
            <div class="tp-home-about-image">
                <img src="/images/home/about/image.png" alt="about-us" />
            </div>
            <div class="tp-home-about-content">
                <div class="tp-home-about-title">
                    <img src="/images/home/about/icon.png" alt="about-us-icon" />
                    <h3>About Us</h3>
                </div>
                <div class="tp-home-about-content-container">
                    <p class="tp-home-title">Trusted Export Solutions, Directly from the Source</p>
                    <p class="tp-home-text-base">Delivering quality agricultural goods through efficient, professional export and sales services.</p>

                    <div v-for="item in aboutUs" :key="item.title" class="tp-home-about-content-list">
                        <div class="tp-home-about-content-list-header">
                            <img src="/images/home/about/check.png" alt="check" />
                            <p class="tp-home-subtitle">{{ item.title }}</p>
                        </div>
                        <div class="tp-home-about-content-list-description">
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
        title: 'Supporting Export from Farm to Global Market',
        description: 'Delivering quality agricultural goods through efficient, professional export and sales services.',
    },
    {
        title: 'Seamless Export and Direct Sales Solutions',
        description: 'Experience hassle-free export processes and a reliable supply of quality goods, managed with professionalism, efficiency, and an integrated system that supports your business every step of the way.',
    },
    {
        title: 'Empowering Farmers, Driving Economic Growth',
        description: 'We support farmers from the earliest stages of cultivation to the purchase of their harvests—fostering globally competitive agriculture and uplifting rural economies through sustainable practices.',
    }
]
</script>