<template>
    <div class="product-related-v2">
        <div class="container">
            <div class="prodrel-title">
                <h2>Related Products</h2>
                <p>Check here to other our products you might interest</p>
            </div>
            <div class="prodrel-content">
                <div class="prodrel-item" v-for="product in related_products" :key="product.id">
                    <nuxt-link :to="`/product-details/${product.id}`">
                        <div class="prodrel-item-img">
                            <nuxt-img :src="product.images[0]" :alt="product.name" />
                        </div>
                        <div class="prodrel-item-content">
                            <p>{{ product.parentCategory }}</p>
                            <h3>{{ product.name }}</h3>
                            <p>{{ product.description.substring(0, 100) }}...</p>
                        </div>
                    </nuxt-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import product_data from "@/data/product-data";

const props = defineProps<{
    productId: number;
    category: string;
}>();

const related_products = product_data.filter(
    (p) =>
        p.parentCategory.toLowerCase() === props.category.toLowerCase() &&
        p.id !== Number(props.productId)
);
</script>

<style scoped lang="scss">
@use '@/assets/scss/utils/_colors.scss' as *;

.product-related-v2 {
    background-color: var(--tp-common-white);
    padding: 50px 0;

    .prodrel-content {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1.5rem;

        @media (max-width: 900px) {
            grid-template-columns: repeat(3, 1fr);
        }

        @media (max-width: 768px) {
            grid-template-columns: repeat(2, 1fr);
        }

        @media (max-width: 480px) {
            grid-template-columns: repeat(1, 1fr);
        }
    }

    .prodrel-title {
        margin-bottom: 2rem;
        h2, p {
            text-align: center;
            margin-bottom: 0;
        }
    }

    .prodrel-item {

        border: 1px solid var(--tp-grey-blue);
        border-radius: 1rem;
        padding: .5rem;

        &:hover {
            h3 {
                color: var(--tp-green-light);
            }

            img {
                box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
            }
        }

        &-img {
            width: 100%;

            img {
                border-radius: .5rem;
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }

        &-content {
            padding: .5rem;
            padding-top: 1rem;
        }

        p {
            margin-bottom: 0;
        }

        h3 {
            border-bottom: 1px solid var(--tp-grey-light);
            padding-bottom: .5rem;
            font-size: 1.3rem;
        }
    }
}
</style>