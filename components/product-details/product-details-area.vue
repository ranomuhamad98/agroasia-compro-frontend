<template>
  <section class="tp-product-details-area">
    <div class="tp-product-details-top pb-50">
      <div class="!mx-8">
        <div class="flex flex-col gap-4 lg:flex-row">
          <product-details-thumb :product="product" />
          <div>
            <product-details-wrapper :product="product" :wa-link="waLink" />
          </div>
        </div>
      </div>
    </div>
    <div class="tp-product-details-bottom pt-50 pb-50">
      <div class="!mx-8">
        <div class="row">
          <div class="col-xl-12">
            <product-details-tab-nav :product="product" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ProductDetail } from '@/types/product-detail-api-types';
import type { DeepReadonly } from 'vue';

defineProps<{ product: DeepReadonly<ProductDetail>; waLink: string }>()
</script>
