import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import product_data from "@/data/product-data";

export const useProductFilterStore = defineStore("product_filter", () => {
  const route = useRoute();
  const router = useRouter();
  let selectVal = ref<string>("");

  function handleSelectFilter(e: { value: string; text: string }) {
    selectVal.value = e.value;
  }

  const maxProductPrice = product_data.reduce((max, product) => {
    return product.price > max ? product.price : max;
  }, 0);

  let priceValues = ref([0, maxProductPrice]);

  const handlePriceChange = (value: number[]) => {
    priceValues.value = value;
  };

  const handleResetFilter = () => {
    priceValues.value = [0, maxProductPrice];
  };

  // filteredProducts
  const filteredProducts = computed(() => {
    if (route.query.minPrice && route.query.maxPrice) {
      return product_data.filter(
        (p) =>
          p.price >= Number(route.query.minPrice) &&
          p.price <= Number(route.query.maxPrice)
      );
    } else if (route.query.status) {
      if (route.query.status === "on-sale") {
        return product_data.filter((p) => p.discount > 0);
      } else if (route.query.status === "in-stock") {
        return product_data.filter((p) => p.quantity > 0);
      }
    } else if (route.query.category) {
      return product_data.filter(
        (p) => p.parentCategory.toLowerCase().replace("&", "").split(" ").join("-") === route.query.category
      );
    } else if (route.query.subCategory) {
      return product_data.filter(
        (p) => p.children.split(' ').join('-').toLowerCase() === route.query.subCategory
      );
    } else if (route.query.brand) {
      return product_data.filter(
        (p) => p.brand.toLowerCase().replace("&", "").split(" ").join("-") === route.query.brand
      );
    } else if (selectVal.value) {
      if (selectVal.value === "default-sorting") {
        return product_data;
      } else if (selectVal.value === "low-to-hight") {
        return product_data
          .slice()
          .sort((a, b) => Number(a.price) - Number(b.price));
      } else if (selectVal.value === "high-to-low") {
        return product_data
          .slice()
          .sort((a, b) => Number(b.price) - Number(a.price));
      } else if (selectVal.value === "new-added") {
        return product_data.slice(-8);
      } else if (selectVal.value === "on-sale") {
        return product_data.filter((p) => p.discount > 0);
      } else {
        return product_data;
      }
    } else {
      return product_data;
    }
  });

    // filteredProducts
    const searchFilteredItems = computed(() => {
      let filteredProducts = [...product_data];
    
      if (route.query.searchText) { 
        filteredProducts = filteredProducts.filter((prd) =>
          prd.name.toLowerCase().includes(route.query.searchText.toLowerCase())
        );
      } 
      switch (selectVal.value) {
        case "default-sorting":
          break;
        case "low-to-high":
          filteredProducts = filteredProducts.slice().sort((a, b) => Number(a.price) - Number(b.price));
          break;
        case "high-to-low":
          filteredProducts = filteredProducts.slice().sort((a, b) => Number(b.price) - Number(a.price));
          break;
        case "new-added":
          filteredProducts = filteredProducts.slice(-6);
          break;
        case "on-sale":
          filteredProducts = filteredProducts.filter((p) => p.discount > 0);
          break;
        default:
      }
      return filteredProducts;
    });

  watch(
    () => route.query || route.path,
    () => {}
  );
  return {
    maxProductPrice,
    priceValues,
    handleSelectFilter,
    filteredProducts,
    handlePriceChange,
    handleResetFilter,
    selectVal,
    searchFilteredItems,
  };
});
