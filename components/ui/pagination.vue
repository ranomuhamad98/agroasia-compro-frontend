<template>
  <nav>
    <ul>
      <li @click="setPage(currentPage-1)" :class="currentPage === 1 ?'disable':''">
        <a class="tp-pagination-prev prev page-numbers pointer">
          <svg-paginate-prev />
        </a>
      </li>

      <li v-for="n in totalPages" :key="n" @click="setPage(n)">
        <a :class="`pointer ${currentPage === n ? 'current' : ''}`">{{
          n
        }}</a>
      </li>

      <li @click="setPage(currentPage+1)" :class="currentPage === totalPages ?'disable':''">
        <a class="next page-numbers pointer">
          <svg-paginate-next />
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import type { ProductPagination } from "@/types/products-api-type";
import { computed, ref } from "vue";
const emit = defineEmits(["handlePaginate"]);

type ItemDataType = {
  data: ProductPagination;
  itemsPerPage: number;
};
const props = defineProps<ItemDataType>();
const currentPage = ref<number>(1);

const totalPages = computed(() =>
  Math.ceil(props.data.total / props.itemsPerPage)
);

const setPage = (idx: number) => {
  if (idx <= 0 || idx > totalPages.value) {
    return;
  }
  window.scrollTo(0, 0);
  currentPage.value = idx;
  emit("handlePaginate", idx);
};
</script>
