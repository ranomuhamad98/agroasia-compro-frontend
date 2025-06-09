<template>
  <section class="tp-product-sm-area pt-120 pb-60">
    <div class="container">
      <div class="row">
        <div class="col-xl-4 col-lg-4 col-md-6">
          <div
            class="tp-product-side-banner text-center mb-60"
            style="background-color: #eeebe4"
            data-bg-color="#EEEBE4"
          >
            <div class="tp-product-side-banner-content">
              <div class="tp-product-side-banner-subtitle">
                <img src="/images/product/side/pre-title.png" alt="" />
              </div>
              <h3 class="tp-product-side-banner-title">
                Get Up to 26% Off Vegetables
              </h3>

              <div class="tp-product-side-banner-btn">
                <nuxt-link href="/shop" class="tp-btn-green tp-btn-green-sm">
                  Shop Now
                  <svg-right-arrow></svg-right-arrow>
                </nuxt-link>
              </div>
              <div class="tp-product-side-banner-thumb">
                <img src="/images/product/side/side-1.png" alt="" />
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-4 col-lg-4 col-md-6">
          <div class="tp-product-sm-wrapper-5 mb-60">
            <h3 class="tp-product-sm-section-title">
              Top Selling Products
              <svg-shape-line></svg-shape-line>
            </h3>

            <div class="tp-product-sm-item-wrapper-5 is-translate-24">
              <product-sm-item
                v-for="product in top_rated_products"
                :key="product.id"
                :product="product"
              ></product-sm-item>
            </div>
            
          </div>
        </div>
        <div class="col-xl-4 col-lg-4 col-md-6">
          <div class="tp-product-sm-wrapper-5 mb-60">
            <h3 class="tp-product-sm-section-title">
              Top Rated Products
              <svg-shape-line></svg-shape-line>
            </h3>

            <div class="tp-product-sm-item-wrapper-5">
              <product-sm-item
                v-for="product in top_selling_products"
                :key="product.id"
                :product="product"
              ></product-sm-item>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import product_data from "@/data/product-data";

const top_rated_products = product_data.filter((product) => product.top_rated);

// const best_sell_products = [...product_data].slice(-3);
const top_selling_products = [...product_data]
  .slice()
  .sort((a, b) => (b.sell_count ?? 0) - (a.sell_count ?? 0))
  .slice(0, 3);
</script>
