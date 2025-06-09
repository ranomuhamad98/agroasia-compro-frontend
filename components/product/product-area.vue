<template>
  <section class="tp-product-area pb-70">
    <div class="container">
      <div class="row align-items-end">
        <div class="col-xl-6 col-lg-5">
          <div
            class="tp-section-title-wrapper-5 mb-45 text-center text-lg-start"
          >
            <span class="tp-section-title-pre-5">
              All Product Shop
              <svg
                width="82"
                height="22"
                viewBox="0 0 82 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M81 14.5798C0.890564 -8.05914 -5.81154 0.0503902 5.00322 21"
                  stroke="currentColor"
                  stroke-opacity="0.3"
                  stroke-width="2"
                  stroke-miterlimit="3.8637"
                  stroke-linecap="round"
                />
              </svg>
            </span>
            <h3 class="tp-section-title-5">Featured Products</h3>
          </div>
        </div>
        <div class="col-xl-6 col-lg-7">
          <div class="tp-product-tab-2 tp-product-tab-5 tp-tab mb-55">
            <div
              class="tp-product-tab-inner-3 d-flex align-items-center justify-content-center justify-content-lg-end"
            >
              <nav>
                <div
                  class="nav nav-tabs justify-content-center tp-product-tab tp-tab-menu p-relative"
                  id="nav-tab"
                >
                  <template v-for="(tab, i) in categories.slice(0, 4)" :key="i">
                    <button
                      v-if="active_tab === tab"
                      ref="activeRef"
                      @click="handleActiveMarker($event, tab)"
                      :class="`nav-link ${active_tab === tab ? 'active' : ''}`"
                      id="nav_active"
                    >
                      {{ tab }}
                      <span class="tp-product-tab-tooltip">{{filteredProducts.length}}</span>
                    </button>
                    <button
                      v-else
                      @click="handleActiveMarker($event, tab)"
                      :class="`nav-link ${active_tab === tab ? 'active' : ''}`"
                    >
                      {{ tab }}
                      <span class="tp-product-tab-tooltip">{{filteredProducts.length}}</span>
                    </button>
                  </template>
                  <span id="productTabMarker" class="tp-tab-line d-none d-sm-inline-block"></span>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-xl-12">
          <div class="row">
            <div
              v-for="item in filteredProducts"
              :key="item.id"
              class="col-xl-3 col-lg-4 col-sm-6"
            >
              <product-single :product="item"></product-single>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import product_data from "@/data/product-data";
import category_data from "@/data/category-data";
const parentNamesArray = category_data.map((category) => category.parentName);
const parentNamesSet = new Set(parentNamesArray);
const categories = ["All Product", ...parentNamesSet];
const activeRef = ref<HTMLButtonElement | null>(null);


let active_tab = ref<string>(categories[0]);

// handleActiveMarker
const handleActiveMarker = (event: MouseEvent, tab: string) => {
  active_tab.value = tab;
  activeRef.value = event.target as HTMLButtonElement;
  const marker = document.getElementById("productTabMarker");
  if (marker && event.target) {
    marker.style.left = (event.target as HTMLButtonElement).offsetLeft + "px";
    marker.style.width = (event.target as HTMLButtonElement).offsetWidth + "px";
  }
};

// filteredProducts
const filteredProducts = computed(() => {
  if (active_tab.value === "All Product") {
    return product_data.slice(0, 8);
  } else {
    return product_data.filter((p) => p.parentCategory === active_tab.value);
  }
});

onMounted(() => {
  const nav_active = document.getElementById("nav_active");
  const marker = document.getElementById("productTabMarker");
  if (nav_active?.classList.contains("active") && marker) {
    marker.style.left = nav_active.offsetLeft + "px";
    marker.style.width = nav_active.offsetWidth + "px";
  }
});
</script>
