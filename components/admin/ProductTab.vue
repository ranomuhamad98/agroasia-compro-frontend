<template>
  <div>
    <HeaderLayout
      title="Product Management"
      :subtitle="`Manage your products. Top products (${adminStore.topProductsCount}/4) will be displayed on the home page.`"
      actionMessage="Add Product"
      :disableRefresh="productsPending"
      :loading="productsPending"
      @action="openProductDialog"
      @refresh="handleRefresh"
    />
    <!-- <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="page-title">Product Management</h2>
        <p class="page-subtitle">
          Manage your products. Top products ({{ adminStore.topProductsCount }}/4) will be displayed on the home
          page.
        </p>
      </div>
      <button @click="openProductDialog()" class="btn-primary flex items-center gap-2">
        <PlusIcon class="w-4 h-4" />
        Add Product
      </button>
    </div> -->

    <div v-if="productsError" class="text-red-600 border border-red-200 bg-red-50 p-3 rounded-md mb-4">
      {{ productsError?.message || 'Failed to load products' }}
    </div>

    <div v-if="productsPending && uiProducts.length === 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ProductCard v-for="n in 6" :key="`skeleton-`+n" :loading="true" :product="skeletonProduct" />
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ProductCard
        v-for="product in uiProducts"
        :key="product.id"
        :product="product"
        @edit="openProductDialog(product)"
        @delete="handleDelete(product)"
      />
    </div>

    <!-- Pagination Controls -->
    <div v-if="pagination" class="mt-6 p-4 border border-green-200 rounded-lg bg-white">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <!-- Left: page size selector -->
        <div class="flex items-center gap-2">
          <label class="text-sm text-green-700 w-full">Items per page</label>
          <select
            :value="currentParams.limit"
            @change="onChangeLimit($event)"
            class="input-field w-28"
          >
            <option :value="6">6</option>
            <option :value="12">12</option>
            <option :value="24">24</option>
            <option :value="48">48</option>
          </select>
        </div>

        <!-- Center: numbered pagination -->
        <nav class="flex items-center gap-2">
          <button
            class="btn-secondary p-2"
            :disabled="productsPending || pagination.current_page <= 1"
            @click="previousPage()"
            :title="'Previous page'"
          >
            <ChevronLeftIcon class="w-4 h-4" />
          </button>

          <button
            v-for="(p, idx) in pageNumbers"
            :key="`p-${idx}-${p}`"
            class="px-3 py-1 rounded-md border transition-colors"
            :class="[
              p === pagination.current_page
                ? 'bg-green-600 text-white border-green-600'
                : p === '…' || p === '...'
                  ? 'bg-transparent text-green-700 border-transparent cursor-default'
                  : 'bg-white text-green-700 border-green-300 hover:bg-green-50'
            ]"
            :disabled="p === '…' || p === '...' || productsPending"
            @click="typeof p === 'number' && goToPage(p)"
          >
            {{ p }}
          </button>

          <button
            class="btn-secondary p-2"
            :disabled="productsPending || pagination.current_page >= pagination.last_page"
            @click="nextPage()"
            :title="'Next page'"
          >
            <ChevronRightIcon class="w-4 h-4" />
          </button>
        </nav>

        <!-- Right: range info -->
        <div class="text-sm text-green-700 text-right">
          Showing {{ showingFrom }}–{{ showingTo }} of {{ pagination.total }}
        </div>
      </div>
    </div>
  </div>

  <ProductForm
    :show="showProductForm"
    :product="selectedProduct"
    @close="closeProductDialog"
    @save="handleRefresh"
  />
</template>

<script setup>
import { useAdminStore } from '@/stores/admin'
import ProductCard from './ProductCard.vue'
import { useProductsApi } from '@/composables/useProductsApi'
import HeaderLayout from './HeaderLayout.vue'
import ProductForm from './ProductForm.vue'
import { ref, computed } from 'vue'
import { useProductManagement } from '@/composables/useProductManagement'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next'

const showProductForm = ref(false)
const selectedProduct = ref(null)

const { productsData, productsError, productsPending, forceRefresh, nextPage, previousPage, goToPage, changeLimit, currentParams } = useProductsApi()
const { deleteProduct } = useProductManagement()
const { $toast } = useNuxtApp()

const adminStore = useAdminStore()

// Map API products to UI shape expected by ProductCard
const uiProducts = computed(() => {
  const apiProducts = productsData.value?.data?.products || []
  return apiProducts.map((p) => ({
    id: p.id,
    image: p.image || '/placeholder.svg?height=200&width=200',
    name: p.name,
    description: p.summary, // ProductCard expects `description`
    category: p.category,
    additionalInfo: '',
    isTop: false,
  }))
})

// Placeholder product for skeleton state
const skeletonProduct = {
  id: 'skeleton',
  image: '/placeholder.svg?height=200&width=200',
  name: 'Loading…',
  description: 'Loading…',
  category: '…',
  additionalInfo: '',
  isTop: false,
}

// Pagination meta from API
const pagination = computed(() => productsData.value?.data?.pagination || null)

const showingFrom = computed(() => {
  if (!pagination.value) return 0
  const start = (pagination.value.current_page - 1) * pagination.value.per_page + 1
  return Math.min(start, pagination.value.total)
})

const showingTo = computed(() => {
  if (!pagination.value) return 0
  const tentative = pagination.value.current_page * pagination.value.per_page
  return Math.min(tentative, pagination.value.total)
})

// Build compact page number list (1 … prev current next … last)
const pageNumbers = computed(() => {
  if (!pagination.value) return []
  const current = pagination.value.current_page
  const last = pagination.value.last_page
  if (last <= 7) {
    return Array.from({ length: last }, (_, i) => i + 1)
  }
  const nums = []
  nums.push(1)
  if (current > 4) nums.push('…')
  const start = Math.max(2, current - 1)
  const end = Math.min(last - 1, current + 1)
  for (let n = start; n <= end; n += 1) nums.push(n)
  if (current < last - 3) nums.push('…')
  nums.push(last)
  return nums
})

const openProductDialog = (product) => {
  showProductForm.value = true
  selectedProduct.value = product
}

const closeProductDialog = () => {
  showProductForm.value = false
}

const handleDelete = async (product) => {
  if (!product?.id) return
  const ok = window.confirm(`Hapus produk "${product.name}"?`)
  if (!ok) return
  try {
    await deleteProduct(product.id)
    $toast?.success('Produk berhasil dihapus')
    await forceRefresh()
  } catch (e) {
    $toast?.error(e?.message || 'Gagal menghapus produk')
  }
}

const handleRefresh = async () => {
  await forceRefresh()
}

const onChangeLimit = (e) => {
  const newLimit = parseInt(e.target.value, 10)
  if (!Number.isNaN(newLimit)) {
    changeLimit(newLimit)
  }
}
</script>