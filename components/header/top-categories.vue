<template>
  <div class="tp-header-category tp-category-menu tp-header-category-toggle">
    <!-- <Transition> -->
      <nav v-if="isActive" class="tp-category-menu-content">
        <ul>
          <li v-for="(item, i) in category_data" class="has-dropdown" :key="i">
            <a class="pointer" @click="handleParentCategory(item.parentName)">
              <span v-if="item.img">
                <img
                  :src="item.img"
                  alt="cate img"
                  style="width: 35px; height: 35px; object-fit: cover; border-radius: 50%;"
                />
              </span>
              {{item.parentName}}
            </a>
  
            <ul v-if="item.children" class="tp-submenu">
              <li v-for="(child, i) in item.children" :key="i">
                <a class="pointer" @click="handleSubCategory(child)">{{ child }}</a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    <!-- </Transition> -->
  </div>
</template>

<script setup lang="ts">
import category_data from "@/data/category-data";
const router = useRouter();
defineProps<{isActive: boolean}>();

// handle parent
const handleParentCategory = (value:string) => {
  const newCategory = value.toLowerCase().replace("&", "").split(" ").join("-");
  router.push(`/shop?category=${newCategory}`);
}

// handle parent
const handleSubCategory = (value:string) => {
  const newCategory = value.split(' ').join('-').toLowerCase();
  router.push(`/shop?subCategory=${newCategory}`);
}

</script>

<style scoped>
/* .v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
} */
</style>
