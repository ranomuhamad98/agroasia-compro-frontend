<template>
  <section class="tp-best-seller-area pt-110 pb-60">
    <div class="container">
      <div class="row">
        <div class="col-xl-3 col-lg-4 col-md-5 col-sm-7">
          <div class="tp-best-banner-5 p-relative mr-20">
            <div class="tp-best-banner-slider-active-5 swiper-container">
              <div class="tp-best-banner-item-5 p-relative fix">
                <nuxt-link href="/shop">
                  <div
                    class="tp-best-banner-thumb-5 include-bg grey-bg"
                    style="background-image: url(/images/banner/5/best-banner-1.jpg);"
                  ></div>
                </nuxt-link>
              </div>
            </div>
            <div class="tp-best-banner-slider-dot-5 tp-swiper-dot"></div>
          </div>
        </div>
        <div class="col-xl-9 col-lg-8 col-md-7">
          <div class="tp-best-slider-wrapper-5">
            <div class="tp-section-title-wrapper-5 mb-35">
              <span class="tp-section-title-pre-5 has-mb-0">
                More to Discover
                <svg-shape-line></svg-shape-line>
              </span>
              <h3 class="tp-section-title-5">Bestsellers of the week</h3>
            </div>
            <div class="tp-best-slider-5 p-relative">
              <swiper
                v-bind="slider_setting"
                :modules="[Pagination, Navigation]"
                class="tp-best-slider-active-5 swiper-container"
              >
                <swiper-slide
                  v-for="item in best_sell_products"
                  :key="item.id"
                  class="tp-best-item-5"
                >
                  <product-single :product="item"></product-single>
                </swiper-slide>
              </swiper>
              <div class="tp-best-slider-arrow-5 d-none d-sm-block">
                <button type="button" class="tp-best-slider-5-button-prev">
                  <svg-prev-arrow-sm></svg-prev-arrow-sm>
                </button>
                <button type="button" class="tp-best-slider-5-button-next">
                  <svg-next-arrow-sm></svg-next-arrow-sm>
                </button>
              </div>
            </div>
            <div
              class="tp-best-slider-dot-5 tp-swiper-dot mt-15 text-center d-sm-none"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Navigation } from "swiper/modules";
import product_data from "@/data/product-data";

const best_sell_products = [...product_data]
  .slice()
  .sort((a, b) => (b.sell_count ?? 0) - (a.sell_count ?? 0))
  .slice(0, 5);

const slider_setting = {
  slidesPerView: 3,
  spaceBetween: 24,
  enteredSlides: false,
  pagination: {
    el: ".tp-best-slider-dot-5",
    clickable: true,
  },
  navigation: {
    nextEl: ".tp-best-slider-5-button-next",
    prevEl: ".tp-best-slider-5-button-prev",
  },
  breakpoints: {
    "1200": {
      slidesPerView: 3,
    },
    "992": {
      slidesPerView: 2,
    },
    "768": {
      slidesPerView: 2,
    },
    "576": {
      slidesPerView: 2,
    },
    "0": {
      slidesPerView: 1,
    },
  },
};
</script>
