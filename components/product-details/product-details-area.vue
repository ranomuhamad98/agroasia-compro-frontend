<template>
  <section class="tp-product-details-area">
    <div class="tp-product-details-top pb-50">
      <div class="container">
        <div class="row">
          <div class="col-xl-7 col-lg-6">
            <!-- product details thumb start -->
            <product-details-thumb
              :product="product"
            />
            <!-- product details thumb end -->
          </div>
          <!-- col end -->
          <div class="col-xl-5 col-lg-6">
            <!-- product details wrapper -->
            <product-details-wrapper :product="product" />
            <!-- product details wrapper -->
          </div>
        </div>
      </div>
    </div>
    <div class="tp-product-details-bottom pt-50 pb-50">
      <div class="container">
        <div class="row">
          <div class="col-xl-12">
            <!-- product details tab nav -->
            <product-details-tab-nav :product="product" />
            <!-- product details tab nav -->
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { type IProduct } from '@/types/product-d-t';
 const props = defineProps<{ product: IProduct; }>()

</script>
