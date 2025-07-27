<template>
  <section class="tp-shop-area pb-120">
    <div class="container">
      <div class="row">
        <div class="col-xl-3 col-lg-4">
          <!-- shop sidebar start -->
          <shop-sidebar />
          <!-- shop sidebar end -->
        </div>
        <div class="col-xl-9 col-lg-8">
          <div class="tp-shop-main-wrapper">
            <div class="tp-shop-top mb-45 d-flex flex-wrap align-items-center gap-4 justify-content-end">
              <div class="d-flex align-items-center gap-2 tp-shop-per-page">
                <span class="label" for="perPage">Per Page: </span>
                <select
                  class="form-select"
                  name="perPage"
                  id="perPage"
                  :value="perPage"
                  @change="handlePerPageChange"
                >
                  <option value="6">6</option>
                  <option value="12">12</option>
                  <option value="24">24</option>
                  <option value="36">36</option>
                  <option value="48">48</option>
                  <option value="60">60</option>
                </select>
              </div>
              <!-- <div class="d-flex align-items-center gap-2">
                <span>Sort By: </span>
                <shop-sidebar-filter-select @handle-select-filter="store.handleSelectFilter" />
              </div> -->
              <div class="tp-shop-top-left d-flex align-items-center">
                <div class="tp-shop-top-tab tp-tab">
                  <ul class="nav nav-tabs" id="productTab" role="tablist">
                    <li class="nav-item" role="presentation">
                      <button :class="`nav-link ${active_tab === 'grid' ? 'active' : ''}`"
                        @click="handleActiveTab('grid')">
                        <svg-grid />
                      </button>
                    </li>
                    <li class="nav-item" role="presentation">
                      <button :class="`nav-link ${active_tab === 'list' ? 'active' : ''}`"
                        @click="handleActiveTab('list')">
                        <svg-list />
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              <!-- <div class="d-flex align-items-center tp-shop-filter-search">
                <input type="text" class="form-control" placeholder="Search" />
                <button class="btn btn-primary">
                  <Icon name="mdi:search" />
                </button>
              </div> -->
            </div>
          </div>
          <div class="tp-shop-items-wrapper tp-shop-item-primary">
            <div v-if="active_tab === 'grid'">
              <div
                v-if="!productsPending"
                class="row infinite-container">
                <div v-for="item in productsData?.data.products" :key="item.id"
                  class="col-xl-4 col-md-6 col-sm-6 infinite-item">
                  <product-single :product="item" />
                </div>
              </div>
              <div
                v-else
                class="row infinite-container">
                <div v-for="item in 2" :key="item"
                  class="col-xl-4 col-md-6 col-sm-6 infinite-item">
                  <product-single :is-loading="true" />
                </div>
              </div>
            </div>

            <div v-if="active_tab === 'list'">
              <div class="row">
                <div
                  v-if="!productsPending"
                  class="col-xl-12">
                  <product-list-item v-for="item in productsData?.data.products" :key="item.id"
                    :item="item" />
                </div>
                <div v-else>
                  <product-list-item
                    :item="{
                      id: '',
                      name: '', 
                      image: '',
                      summary: '',
                      category: '',
                      category_id: '',
                      update_time: ''
                    }"
                    :is-loading="productsPending" />
                </div>
              </div>
            </div>
          </div>

          <div class="tp-shop-pagination mt-20">
            <div v-if="store.filteredProducts && store.filteredProducts.length > 9" class="tp-pagination">
              <ui-pagination :items-per-page="perPage" :data="productsData?.data.products || []"
                @handle-paginate="handlePagination" />
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import product_data from "@/data/product-data";
import { useProductFilterStore } from "@/pinia/useProductFilterStore";
import { type IProduct } from "@/types/product-d-t";

const router = useRouter();
const route = useRoute();
const props = defineProps<{
  list_style?: boolean;
}>();

const perPage = ref<number>(12);
const active_tab = ref<string>(props.list_style ? "list" : "grid");
const active_category = ref<string>("");
const store = useProductFilterStore();

const handlePerPageChange = (e: Event) => {
  const target = e.target as HTMLSelectElement;
  perPage.value = parseInt(target.value);
  router.push({
    query: { ...route.query, limit: perPage.value.toString() }
  });
};

const { 
  productsData, 
  productsError, 
  productsPending,
  currentParams,
  // Easy to use functions
  nextPage,
  previousPage,
  changeCategory,
  changeLimit,
  updateParams,
  refreshProducts
} = useProductsApi({
  page: 1,
  limit: 12,
  category: undefined
}, {
  persistent: true, // Enable localStorage caching
  ttl: 5 * 60 * 1000 // 5 minutes cache
})

const handleLimitChange = async (newLimit: number) => {
  await changeLimit(newLimit)
}

let filteredProductsItems = ref<IProduct[]>(store.filteredProducts!);
let startIndex = ref<number>(0);
let endIndex = ref<number>(store.filteredProducts?.length!);

const handlePagination = (data: IProduct[], start: number, end: number) => {
  filteredProductsItems.value = data;
  startIndex.value = start;
  endIndex.value = end;
};

function handleActiveTab(tab: string) {
  active_tab.value = tab;
  router.push({
    query: {
      ...route.query,
      tab: tab
    }
  });
}

onMounted(() => {
  const query = route.query;
  if (query.tab) {
    active_tab.value = query.tab as string;
  }
  if (query.category) {
    active_category.value = query.category as string;
  }
});

watch(
  () => route.query,
  (newQuery) => {
    if (newQuery.category) {
      active_category.value = newQuery.category as string;
      changeCategory(active_category.value);
    }
    if (newQuery.tab) {
      active_tab.value = newQuery.tab as string
    } else {
      active_tab.value = "grid";
    }
    if (newQuery.limit) {
      perPage.value = parseInt(newQuery.limit as string);
      console.log(perPage.value, 'perPage');
      handleLimitChange(perPage.value);
    }
  }
  // () => route.query || route.params,
  // (newStatus) => {
  //   startIndex.value = 0;
  //   endIndex.value =
  //     store.filteredProducts && store.filteredProducts.length > 9 ? 9 : store.filteredProducts?.length!;
  // }
);
</script>
