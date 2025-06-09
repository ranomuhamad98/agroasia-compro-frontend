<template>
  <section class="breadcrumb__area include-bg pt-100 pb-50" :style="`background-color:${bg_clr && '#EFF1F5'}`">
    <div class="container">
      <div class="row">
        <div class="col-xxl-12">
          <div :class="`breadcrumb__content p-relative z-index-1 ${center && 'text-center'}`">
            <h3 class="breadcrumb__title">{{title}}</h3>
            <div class="breadcrumb__list">
              <span><nuxt-link href="/">Home</nuxt-link></span>
              <span>{{subtitle}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  subtitle: string;
  bg_clr?:boolean;
  center?:boolean;
}>();
</script>