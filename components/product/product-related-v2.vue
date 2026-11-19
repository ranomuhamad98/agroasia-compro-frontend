<template>
    <div v-if="related_products && related_products.length > 0" class="product-related-v2">
        <div class="container">
            <div class="prodrel-title">
                <h2>Related Products</h2>
                <p>Check here to other our products you might interest</p>
            </div>
            <div class="prodrel-content">
                <div class="prodrel-item" v-for="product in related_products" :key="product.id">
                    <nuxt-link :to="`/product-details/${product.id}`" class="text-[#010F1C]">
                        <div class="prodrel-item-img">
                            <img :src="product.image" :alt="product.name" loading="lazy" decoding="async" />
                        </div>
                        <div class="prodrel-item-content">
                            <p>{{ product.category }}</p>
                            <h3>{{ product.name }}</h3>
                            <p>{{ product.summary.substring(0, 100) }}...</p>
                        </div>
                    </nuxt-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    productId: string;
    categoryId: string;
}>();

const {
    productsData,
} = useProductsApi({
    category: props.categoryId,
    limit: 5,
})

const related_products = computed(() => productsData.value?.data.products.filter(
    (p) =>
        p.category_id.toLowerCase() === props.categoryId.toLowerCase() &&
        p.id.toString() !== props.productId
));
</script>

<style scoped lang="scss">
@use '@/assets/scss/utils/_colors.scss' as *;

.product-related-v2 {
    background-color: var(--tp-common-white);
    padding: 50px 0;

    .prodrel-content {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        justify-content: center;
    }

    .prodrel-title {
        margin-bottom: 2rem;
        h2, p {
            text-align: center;
            margin-bottom: 0;
        }
    }

    .prodrel-item {
        max-width: 300px;
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
            height: 200px;
            background-color: var(--tp-grey-1);

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