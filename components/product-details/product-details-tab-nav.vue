<template>
  <div class="tp-product-details-tab-nav tp-tab">
    <nav>
      <div class="nav nav-tabs justify-content-start p-relative tp-product-tab" id="navPresentationTab" role="tablist">
        <button @click="handleActiveMarker($event)" class="nav-link active" id="nav-description-tab" data-bs-toggle="tab"
          data-bs-target="#nav-description" type="button" role="tab" aria-controls="nav-description"
          aria-selected="true">Description</button>

        <button v-if="thereIsAdditionalInformation" @click="handleActiveMarker($event)" class="nav-link" id="nav-addInfo-tab" data-bs-toggle="tab"
          data-bs-target="#nav-addInfo" type="button" role="tab" aria-controls="nav-addInfo"
          aria-selected="false">Additional information</button>

        <span id="productTabMarker" class="tp-product-details-tab-line"></span>
      </div>
    </nav>
    <div class="tab-content" id="navPresentationTabContent">
      <div class="tab-pane fade show active" id="nav-description" role="tabpanel" aria-labelledby="nav-description-tab"
        tabindex="0">
        <div class="tp-product-details-desc-wrapper pt-4">
          <div class="bg-white w-full p-4">
            <p class="text-base whitespace-pre-wrap">
              {{ product.description }}
            </p>
          </div>
        </div>
      </div>
      <div v-if="thereIsAdditionalInformation" class="tab-pane fade" id="nav-addInfo" role="tabpanel" aria-labelledby="nav-addInfo-tab"
        tabindex="0">
        <div class="tp-product-details-additional-info pt-4">
          <div class="bg-white w-full p-4">
            <p class="text-base whitespace-pre-wrap">
              {{ product.additional_information.content_1 }}
            </p>
            <div class="my-4">
              <div v-for="(header, key) in product.additional_information.content_2.headers" :key="header">
                <p class="text-base whitespace-pre-wrap mb-0 font-semibold">
                  {{ header }}
                </p>
                <ul class="list-disc list-inside mb-2">
                  <li v-for="row in product.additional_information.content_2.rows[key]" :key="row">
                    {{ row }}
                  </li>
                </ul>
              </div>
            </div>
            <p class="text-base whitespace-pre-wrap">
              {{ product.additional_information.content_3 }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type IProduct } from '@/types/product-d-t';
import type { ProductDetail } from '@/types/product-detail-api-types';
import type { DeepReadonly } from 'vue';
// handleActiveMarker
const handleActiveMarker = (event: MouseEvent) => {
  const marker = document.getElementById("productTabMarker");
  if (marker && event.target) {
    marker.style.left = (event.target as HTMLButtonElement).offsetLeft + "px";
    marker.style.width = (event.target as HTMLButtonElement).offsetWidth + "px";
  }
};

const props = defineProps<{ product: DeepReadonly<ProductDetail> }>();

const thereIsAdditionalInformation = computed(() => {
  return props.product.additional_information.content_1 !== '' || props.product.additional_information.content_2.rows.length > 0 || props.product.additional_information.content_3 !== '';
});

onMounted(() => {
  const nav_active = document.getElementById("nav-description-tab");
  const marker = document.getElementById("productTabMarker");
  if (nav_active?.classList.contains("active") && marker) {
    marker.style.left = nav_active.offsetLeft + "px";
    marker.style.width = nav_active.offsetWidth + "px";
  }
});
</script>
