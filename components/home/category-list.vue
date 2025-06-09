<template>
    <div class="tp-home-category-wrapper">
        <div class="tp-home-category-base">
            <div class="tp-home-category-title-container">
                <h3 class="tp-home-title">Cari Kategori Belanjaanmu Disini</h3>
                <p class="tp-home-text-base">Produk - produk terbaik dan terpopuler yang bisa kamu cari dari Agro!</p>
            </div>
            <div class="tp-home-category-container">
                <div v-for="category in categories" :key="category.name" class="tp-home-category-card">
                    <h4 class="tp-home-category-title">{{ category.name }}</h4>
                    <p class="tp-home-category-subtitle tp-home-category-card-description">{{ category.productCount }}
                        Produk</p>
                    <img :src="category.image" :alt="category.name" class="tp-home-category-image" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const categories = [
    {
        name: 'Minuman',
        image: '/images/home/category/minuman.png',
        productCount: 5
    },
    {
        name: 'Pangan',
        image: '/images/home/category/pangan.png',
        productCount: 5
    },
    {
        name: 'Hasil Alam',
        image: '/images/home/category/hasil-alam.png',
        productCount: 5
    },
]
</script>