<template>
  <section class="tp-category-area pt-110 pb-110">
    <div class="container">
        <div class="row">
          <div class="col-xl-12">
              <div class="tp-section-title-wrapper-5 mb-50 text-center">
                <span class="tp-section-title-pre-5">
                    Shop by Category
                    <svg-shape-line></svg-shape-line>
                </span>
                <h3 class="tp-section-title-5">Popular on the Shofi store.</h3>
              </div>
          </div>
        </div>
        <div class="row">
          <div class="col-xl-12">
              <div class="tp-category-slider-5">
                <swiper v-bind="slider_setting" :modules="[Scrollbar,Pagination,Navigation]" class="tp-category-slider-active-5 swiper-container mb-50">
                      <swiper-slide v-for="item in category_items" :key="item.id" class="tp-category-item-5 p-relative z-index-1 fix" data-bg-color="#E5EFE2">
                          <a @click="handleCategory(item.parentName)" class="pointer">
                            <div class="tp-category-thumb-5 include-bg" :style="`background-image:url(${item.img})`"></div>
                            <div class="tp-category-content-5">
                                <h3 class="tp-category-title-5">{{ item.parentName }}</h3>
                                <span :style="`color:${item.textClr}`">{{item.products.length}} Items</span>
                            </div>
                          </a>
                      </swiper-slide>
                </swiper>
                <div class="tp-category-5-swiper-scrollbar tp-swiper-scrollbar"></div>
              </div>
          </div>
        </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { Scrollbar,Pagination,Navigation } from "swiper/modules";
import category_data from "@/data/category-data";
const router = useRouter();

const category_items = [...category_data];

const handleCategory = (value:string) => {
  const newCategory = value.toLowerCase().replace("&", "").split(" ").join("-");
  router.push(`/shop?category=${newCategory}`);
}

const slider_setting = {
    slidesPerView: 5,
		spaceBetween: 12,
		pagination: {
			el: ".tp-category-slider-dot-4",
			clickable: true,
		},
		navigation: {
			nextEl: ".tp-category-slider-button-next-5",
			prevEl: ".tp-category-slider-button-prev-5",
		},
		scrollbar: {
			el: '.tp-category-5-swiper-scrollbar',
			draggable: true,
			dragClass: 'tp-swiper-scrollbar-drag',
			snapOnRelease: true,
		},

		breakpoints: {
			'1400': {
				slidesPerView: 5,
			},
			'1200': {
				slidesPerView: 5,
			},
			'992': {
				slidesPerView: 4,
			},
			'768': {
				slidesPerView: 3,
			},
			'576': {
				slidesPerView: 2,
			},
			'400': {
				slidesPerView: 2,
			},
			'0': {
				slidesPerView: 1,
			},
		}
}
</script>
