<template>
  <div class="tp-shop-widget-content">
    <div class="tp-shop-widget-checkbox">
      <ul class="filter-items filter-checkbox">
        <li v-for="(s, i) in status" :key="i" class="filter-item checkbox">
          <input
            id="on-sale"
            type="checkbox"
            name="on-sale"
          />
          <label @click="handleStatusRoute(s)" :for="s" :class="`${
              activeQuery ===
              s.toLowerCase().replace('&', '').split(' ').join('-')
                ? 'active'
                : ''
            }`"> {{ s }} </label>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, ref } from "vue";
const route = useRoute();
const router = useRouter();
const status = ref<string[]>(["On sale", "In Stock"]);
const activeQuery = ref<string>("");

// handle status route
const handleStatusRoute = (status: string) => {
  const newStatus = status.toLowerCase().replace("&", "").split(" ").join("-");
    router.push(`/shop?status=${newStatus}`);
};
watch(
  () => route.query,
  (newStatus) => {
    activeQuery.value = newStatus.status as string || "";
  }
);
onMounted(() => {
  activeQuery.value = route.query.status as string || "";
});
</script>
