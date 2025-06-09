<template>
 <section class="tp-testimonial-area">
    <div class="container">
        <div class="row justify-content-center">
          <div class="col-xl-12">
              <div class="tp-testimonial-slider-wrapper-5">
                <div class="row">
                    <div class="col-xl-7 offset-xl-3">
                      <div class="tp-section-title-wrapper-5 mb-45">
                          <span class="tp-section-title-pre-5">
                            Customer Reviews
                            <svg-shape-line></svg-shape-line>
                          </span>
                          <h3 class="tp-section-title-5">Our Happy Customers</h3>
                      </div>
                    </div>
                </div>
                <div class="tp-testimonial-slider-5 p-relative">
                    <swiper v-bind="slider_setting" :modules="[Pagination,Navigation]" class="tp-testimonial-slider-active-5 swiper-container pb-15">
                        <swiper-slide v-for="item in testimonial_data" :key="item.id" class="tp-testimonial-item-5 d-md-flex white-bg">
                          <div class="tp-testimonial-avater-wrapper-5 p-relative">
                              <div class="tp-avater-rounded mr-60">
                                <div class="tp-testimonial-avater-5 ">
                                    <img :src="item.user" alt="user">
                                </div>
                              </div>
                              <span class="quote-icon">
                                <img src="/images/testimonial/testimonial-quote-2.png" alt="">
                              </span>
                          </div>

                          <div class="tp-testimonial-content-5">
                              <div class="tp-testimonial-rating tp-testimonial-rating-5">
                                <span><i class="fa-solid fa-star"></i></span>
                                <span><i class="fa-solid fa-star"></i></span>
                                <span><i class="fa-solid fa-star"></i></span>
                                <span><i class="fa-solid fa-star"></i></span>
                                <span><i class="fa-solid fa-star"></i></span>
                              </div>

                              <p>{{ item.desc }}</p>

                              <div class="tp-testimonial-user-5-info">
                                <h3 class="tp-testimonial-user-5-title">{{ item.name }}</h3>
                                <span class="tp-testimonial-user-5-designation">{{ item.designation }}</span>
                              </div>
                          </div>
                        </swiper-slide>
                    </swiper>
                    <div class="tp-testimonial-arrow-5">
                      <button type="button" class="tp-testimonial-slider-5-button-prev">
                        <svg-prev-arrow></svg-prev-arrow>
                      </button>
                      <button type="button" class="tp-testimonial-slider-5-button-next">
                        <svg-next-arrow></svg-next-arrow>
                      </button>
                    </div>
                </div>
              </div>
          </div>
        </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination,Navigation } from "swiper/modules";

const slider_setting = {
  slidesPerView: 1,
  spaceBetween: 0,
  pagination: {
    el: ".tp-testimonial-slider-dot-5",
    clickable: true,
  },
  navigation: {
    nextEl: ".tp-testimonial-slider-5-button-next",
    prevEl: ".tp-testimonial-slider-5-button-prev",
  }
}

const testimonial_data = [
  {
    id: 1,
    rating: 5,
    user: "/images/users/user-2.jpg",
    name:'Theodore Handle',
    designation:'UI/UX design',
    desc:'I have been shopping from shofi for the past few months and am loving the experience. Have been shopping from here have recommended my relatives too.',
  },
  {
    id: 2,
    rating: 4,
    user: "/images/users/user-3.jpg",
    name:'Shahnewaz Sakil',
    designation:'WordPress Developers',
    desc:'They’ve usually had some experience with this company, including a purchase, use, or a conversation with their customer service team.',
  },
  {
    id: 3,
    rating: 4.5,
    user: "/images/users/user-4.jpg",
    name:'Suel Mari',
    designation:'SEO Expart',
    desc:'The tool X has really automated some of our company’s processes. We now spend less time doing manual work. It’s making [problem] very easy for us.',
  }
]
</script>
