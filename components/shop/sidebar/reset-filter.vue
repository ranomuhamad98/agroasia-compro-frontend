<template>
   <div class="tp-shop-widget mb-10">
      <h3 class="tp-shop-widget-title">Reset Filter</h3>
      <button
        @click="handleFilterReset"
        class="tp-btn"
      >
        Reset Filter
      </button>
    </div>
</template>

<script setup lang="ts">
import { useProductFilterStore } from '@/pinia/useProductFilterStore';
const store = useProductFilterStore();
const router = useRouter();
const route = useRoute();

const handleFilterReset = () => {
  router.push('/products')
}

</script>
