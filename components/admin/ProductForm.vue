<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 mt-0"
    @click.self="$emit('close')">
    <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-green-200">
      <div class="p-6 border-b border-green-200">
        <h3 class="text-green-800 text-xl font-semibold">
          {{ product ? 'Edit Product' : 'Add New Product' }}
        </h3>
        <p class="text-green-600 mt-1">Fill in the product information below.</p>
      </div>
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <div class="space-y-2">
          <label class="text-green-700 font-medium block font-semibold">Product Images</label>
          <input ref="fileInput" type="file" multiple accept="image/*" class="hidden" @change="onFilesSelected" />
          <div class="flex items-start gap-4">
            <div class="grid grid-cols-3 gap-3 flex-1">
              <div
                v-for="(img, idx) in form.images"
                :key="img.id || idx"
                class="relative border-2 rounded-lg overflow-hidden"
                :class="img.isMain ? 'border-green-500' : 'border-green-200'"
              >
                <img :src="img.url" alt="Product image" class="w-full h-28 object-cover" />
                <div class="absolute top-1 left-1">
                  <span v-if="img.isMain" class="px-2 py-0.5 text-xs bg-green-600 text-white rounded">Main</span>
                </div>
                <div class="absolute top-1 right-1 flex gap-1">
                  <button type="button" @click="removeImage(idx)" class="bg-red-600 text-white p-1 rounded opacity-90 hover:opacity-100">
                    <XIcon class="w-4 h-4" />
                  </button>
                </div>
                <div class="absolute bottom-1 left-1 right-1 flex justify-center">
                  <button type="button" @click="setAsMain(idx)" class="px-2 py-1 text-xs rounded border"
                    :class="img.isMain ? 'bg-green-600 text-white border-green-600' : 'bg-white text-green-700 border-green-300 hover:bg-green-50'">
                    {{ img.isMain ? 'Main Image' : 'Set as Main' }}
                  </button>
                </div>
              </div>
              <button
                type="button"
                class="h-28 border-2 border-dashed border-green-300 rounded-lg flex items-center justify-center hover:border-green-400 transition-colors"
                @click="openFileDialog"
              >
                <div class="text-center">
                  <ImageIcon class="w-8 h-8 text-green-400 mx-auto mb-1" />
                  <p class="text-green-600 text-xs">Add Images</p>
                </div>
              </button>
            </div>
            <button type="button" @click="openFileDialog" class="btn-secondary flex items-center gap-2 self-start">
              <UploadIcon class="w-4 h-4" />
              Upload Images
            </button>
          </div>
          <p v-if="uploadError" class="text-red-600 text-sm">{{ uploadError }}</p>
        </div>

        <div class="space-y-2">
          <label for="productName" class="text-green-700 font-medium block font-semibold">Product Name</label>
          <input id="productName" v-model="form.name" type="text" class="input-field" required />
        </div>

        <div class="space-y-2">
          <label for="productDescription" class="text-green-700 font-medium block font-semibold">Description</label>
          <textarea id="productDescription" v-model="form.description" rows="3" class="input-field" required></textarea>
        </div>

        <div class="space-y-2">
          <label for="productCategory" class="text-green-700 font-medium block font-semibold">Category</label>
          <select id="productCategory" v-model="form.category" class="input-field" required>
            <option value="">Select category</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <!-- Additional Information: content_1, content_2 (table), content_3 -->
        <div class="space-y-4">
          <label class="text-green-700 font-medium block font-semibold">Additional Information</label>

          <!-- content_1 -->
          <div class="space-y-2">
            <label for="aiContent1" class="text-green-700 text-sm block">Intro (content_1)</label>
            <textarea id="aiContent1" v-model="form.additional.content1" rows="2" class="input-field" placeholder="Short intro or notes"></textarea>
          </div>

          <!-- content_2: editable table -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="text-green-700 text-sm block">Specification Table (content_2)</label>
              <div class="flex gap-2">
                <button type="button" class="btn-secondary px-2 py-1" @click="addTableColumn">+ Column</button>
                <button type="button" class="btn-secondary px-2 py-1" @click="addTableRow">+ Row</button>
              </div>
            </div>

            <!-- Headers editor -->
            <div class="grid" :style="{ gridTemplateColumns: `repeat(${form.additional.headers.length || 1}, minmax(0, 1fr))` }">
              <div v-for="(h, hIdx) in form.additional.headers" :key="`h-${hIdx}`" class="p-1">
                <div class="flex items-center gap-1">
                  <input v-model="form.additional.headers[hIdx]" type="text" class="input-field" :placeholder="`Header ${hIdx+1}`" />
                  <button
                    v-if="form.additional.headers.length > 1"
                    type="button"
                    class="border border-red-300 text-red-700 hover:bg-red-50 px-2 py-1 rounded"
                    @click="removeTableColumn(hIdx)"
                    title="Remove column"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            <!-- Rows editor -->
            <div class="border border-green-200 rounded overflow-hidden">
              <div class="grid bg-green-50" :style="{ gridTemplateColumns: `repeat(${form.additional.headers.length || 1}, minmax(0, 1fr))` }">
                <div v-for="(h, hIdx) in form.additional.headers" :key="`th-${hIdx}`" class="p-2 text-sm font-medium text-green-800 border-r border-green-200 last:border-r-0">{{ h || `Header ${hIdx+1}` }}</div>
              </div>
              <div v-if="form.additional.rows.length === 0" class="p-3 text-green-600 text-sm">No rows. Click "+ Row" to add.</div>
              <div v-for="(row, rIdx) in form.additional.rows" :key="`r-${rIdx}`" class="grid items-start" :style="{ gridTemplateColumns: `repeat(${form.additional.headers.length || 1}, minmax(0, 1fr))` }">
                <div v-for="(cell, cIdx) in row" :key="`c-${rIdx}-${cIdx}`" class="p-1 border-t border-green-200">
                  <input v-model="form.additional.rows[rIdx][cIdx]" type="text" class="input-field" :placeholder="`${form.additional.headers[cIdx] || `Col ${cIdx+1}`}`" />
                </div>
                <div class="p-1 border-t border-green-200 col-span-full flex justify-end">
                  <button type="button" class="border border-red-300 text-red-700 hover:bg-red-50 px-2 py-1 rounded" @click="removeTableRow(rIdx)">Remove row</button>
                </div>
              </div>
            </div>
          </div>

          <!-- content_3 -->
          <div class="space-y-2">
            <label for="aiContent3" class="text-green-700 text-sm block">Footer/Notes (content_3)</label>
            <textarea id="aiContent3" v-model="form.additional.content3" rows="2" class="input-field" placeholder="Additional footer or notes"></textarea>
          </div>
        </div>

        <div class="flex justify-end space-x-2 pt-4">
          <button type="button" @click="$emit('close')" class="btn-secondary">
            Cancel
          </button>
          <button type="submit" class="btn-primary">
            {{ product ? 'Update' : 'Add' }} Product
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { XIcon, ImageIcon, UploadIcon } from 'lucide-vue-next'
import { useAdminStore } from '@/stores/admin'
import { useCategoryManagement } from '@/composables/useCategoryManagement'
import { useProductManagement } from '@/composables/useProductManagement'
import { useMedia } from '@/composables/useMedia'

const props = defineProps({
  show: Boolean,
  product: Object
})

const emit = defineEmits(['close', 'save'])

const adminStore = useAdminStore()
const { categories: categoryData, fetchCategories } = useCategoryManagement()
const { createProduct, updateProduct, addProductImage, getProductDetail } = useProductManagement()
const { uploadMedia, isUploading: mediaUploading } = useMedia()

const categories = computed(() => categoryData.value || [])
const uploadError = ref('')
const detailLoading = ref(false)
const detailCategoryId = ref('')
const detailCategoryName = ref('')

const form = ref({
  images: [],
  name: '',
  description: '',
  category: '',
  isTop: false,
  additional: {
    content1: '',
    headers: ['Attribute', 'Description'],
    rows: [],
    content3: ''
  }
})

const fileInput = ref(null)

const openFileDialog = () => {
  uploadError.value = ''
  fileInput.value?.click()
}

const onFilesSelected = async (e) => {
  try {
    uploadError.value = ''
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    // Validate and prepare local previews only (defer actual upload until submit)
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp'
    ]
    const maxSize = 5 * 1024 * 1024 // 5MB

    const mapped = files
      .filter((file) => {
        if (!allowedTypes.includes(file.type)) {
          uploadError.value = 'Invalid file type. Please upload an image file.'
          return false
        }
        if (file.size > maxSize) {
          uploadError.value = 'File size too large. Maximum size is 5MB.'
          return false
        }
        return true
      })
      .map((file) => ({
        id: '',
        file,
        url: URL.createObjectURL(file),
        isMain: false,
      }))

    const hasMain = form.value.images.some((i) => i.isMain)
    if (!hasMain && mapped.length) {
      mapped[0].isMain = true
    }

    form.value.images = [...form.value.images, ...mapped]
    e.target.value = ''
  } catch (error) {
    uploadError.value = error?.message || 'Failed to process images'
  }
}

const canSetAsTop = computed(() => {
  return !form.value.isTop || adminStore.topProductsCount < 4 || props.product?.isTop
})

const setAsMain = (idx) => {
  form.value.images = form.value.images.map((img, i) => ({ ...img, isMain: i === idx }))
}

const removeImage = (idx) => {
  form.value.images.splice(idx, 1)
  if (!form.value.images.some(i => i.isMain) && form.value.images.length) {
    form.value.images[0].isMain = true
  }
}

// Additional info table helpers
const addTableColumn = () => {
  const headers = form.value.additional.headers
  const rows = form.value.additional.rows
  headers.push(`Column ${headers.length + 1}`)
  for (let r = 0; r < rows.length; r += 1) {
    rows[r].push('')
  }
}

const removeTableColumn = (columnIndex) => {
  const headers = form.value.additional.headers
  const rows = form.value.additional.rows
  if (headers.length <= 1) return
  headers.splice(columnIndex, 1)
  for (let r = 0; r < rows.length; r += 1) {
    if (Array.isArray(rows[r]) && rows[r].length > columnIndex) {
      rows[r].splice(columnIndex, 1)
    }
  }
}

const addTableRow = () => {
  const cols = Math.max(1, form.value.additional.headers.length)
  form.value.additional.rows.push(Array.from({ length: cols }, () => ''))
}

const removeTableRow = (rowIndex) => {
  if (rowIndex < 0 || rowIndex >= form.value.additional.rows.length) return
  form.value.additional.rows.splice(rowIndex, 1)
}

watch(() => props.product, async (newProduct) => {
  uploadError.value = ''
  if (newProduct) {
    // Seed initial values to avoid empty inputs
    form.value = {
      images: [],
      name: newProduct.name || '',
      description: newProduct.summary || newProduct.description || '',
      category: newProduct.category_id ? String(newProduct.category_id) : (newProduct.category || ''),
      isTop: !!newProduct.isTop,
      additional: {
        content1: newProduct?.additional_information?.content_1 || newProduct?.additionalInfo || '',
        headers: Array.isArray(newProduct?.additional_information?.content_2?.headers)
          ? newProduct.additional_information.content_2.headers.slice()
          : ['Attribute', 'Description'],
        rows: Array.isArray(newProduct?.additional_information?.content_2?.rows)
          ? newProduct.additional_information.content_2.rows.map((r) => Array.isArray(r) ? r.slice() : [])
          : [],
        content3: newProduct?.additional_information?.content_3 || ''
      }
    }

    // Fetch complete product detail from proxy to populate all fields
    if (newProduct.id) {
      try {
        detailLoading.value = true
        const p = await getProductDetail(newProduct.id)
        // Normalize additional_information rows
        const rawRows = p?.additional_information?.content_2?.rows
        const normalizedRows = Array.isArray(rawRows)
          ? rawRows.map((r) => {
              if (Array.isArray(r)) return r.slice()
              if (r && typeof r === 'object') {
                const key = 'key' in r ? String(r.key ?? '') : ''
                const value = 'value' in r ? String(r.value ?? '') : ''
                return [key, value]
              }
              if (r != null) return [String(r), '']
              return ['', '']
            })
          : []
        form.value = {
          images: [],
          name: p?.name || form.value.name,
          description: p?.summary || p?.description || form.value.description,
          category: p?.category_id ? String(p.category_id) : form.value.category,
          isTop: !!(p?.is_top_product ?? form.value.isTop),
          additional: {
            content1: p?.additional_information?.content_1 || form.value.additional.content1 || '',
            headers: Array.isArray(p?.additional_information?.content_2?.headers) && p.additional_information.content_2.headers.length
              ? p.additional_information.content_2.headers.map(h => String(h))
              : (form.value.additional.headers?.length ? form.value.additional.headers : ['Attribute', 'Description']),
            rows: normalizedRows.length ? normalizedRows : (Array.isArray(form.value.additional.rows) ? form.value.additional.rows : []),
            content3: p?.additional_information?.content_3 || form.value.additional.content3 || ''
          }
        }
        // Save category info for later reconciliation with categories list
        detailCategoryId.value = p?.category_id ? String(p.category_id) : ''
        detailCategoryName.value = p?.category || p?.category_name || ''
      } catch (e) {
        console.warn('Failed to fetch product detail for edit; using provided data')
      } finally {
        detailLoading.value = false
      }
    }
  } else {
    form.value = {
      images: [],
      name: '',
      description: '',
      category: '',
      isTop: false,
      additional: {
        content1: '',
        headers: ['Attribute', 'Description'],
        rows: [],
        content3: ''
      }
    }
  }
}, { immediate: true })

const handleSubmit = async () => {
  // Step 1: kirim detail produk, Step 2: tambahkan gallery bila ada media
  try {
    const payload = {
      name: form.value.name,
      summary: form.value.description,
      description: form.value.description,
      additional_information: {
        content_1: form.value.additional.content1 || '',
        content_2: {
          headers: Array.isArray(form.value.additional.headers) && form.value.additional.headers.length
            ? form.value.additional.headers
            : ['Attribute', 'Description'],
          rows: Array.isArray(form.value.additional.rows) ? form.value.additional.rows : []
        },
        content_3: form.value.additional.content3 || ''
      },
      category_id: form.value.category, // contains selected category id
      tags: [],
      text_wa: 'Interested in this product? Contact us on WhatsApp!',
      is_top_product: !!form.value.isTop
    }

    if (props.product && props.product.id) {
      // Update product details first
      const updatePayload = { ...payload }
      await updateProduct(props.product.id, updatePayload)

      if (form.value.images.length) {
        // Ensure exactly one main image
        const hasMain = form.value.images.some(i => i.isMain)
        const images = hasMain ? form.value.images : form.value.images.map((img, i) => ({ ...img, isMain: i === 0 }))

        // Upload any new files, then attach gallery
        const uploadedWithFlags = await Promise.all(
          images.map(async (img) => {
            let galleryId = img.id
            if (!galleryId && img.file) {
              const media = await uploadMedia(img.file, form.value.name || img.file.name)
              const m = Array.isArray(media) ? media[0] : media
              galleryId = m?.id
            }
            return { id: galleryId, isMain: img.isMain }
          })
        )

        const valid = uploadedWithFlags.filter((it) => it.id)
        if (valid.length) {
          await Promise.all(
            valid.map((img) => addProductImage(
              props.product.id,
              { image_gallery_id: img.id, status: img.isMain ? 'main' : 'gallery' }
            ))
          )
        }
      }
    } else {
      // Create product first, then upload images and attach gallery
      const created = await createProduct(payload)
      const productId = created?.product?.id || created?.id
      if (productId && form.value.images.length) {
        const hasMain = form.value.images.some(i => i.isMain)
        const images = hasMain ? form.value.images : form.value.images.map((img, i) => ({ ...img, isMain: i === 0 }))

        const uploadedWithFlags = await Promise.all(
          images.map(async (img) => {
            let galleryId = img.id
            if (!galleryId && img.file) {
              const media = await uploadMedia(img.file, form.value.name || img.file.name)
              const m = Array.isArray(media) ? media[0] : media
              galleryId = m?.id
            }
            return { id: galleryId, isMain: img.isMain }
          })
        )

        const valid = uploadedWithFlags.filter((it) => it.id)
        if (valid.length) {
          await Promise.all(
            valid.map((img) => addProductImage(
              productId,
              { image_gallery_id: img.id, status: img.isMain ? 'main' : 'gallery' }
            ))
          )
        }
      }
    }
    emit('save')
  } catch (e) {
    console.error(e)
  } finally {
    emit('close')
  }
}

onMounted(async () => {
  try {
    await fetchCategories()
  } catch (e) {
    console.warn('Failed to load categories for product form')
  }
})

// Ensure category v-model is set once categories are available
watch(() => categories.value, (list) => {
  if (!Array.isArray(list) || list.length === 0) return
  if (form.value.category) return

  if (detailCategoryId.value && list.some(c => c.id === detailCategoryId.value)) {
    form.value.category = detailCategoryId.value
    return
  }

  const name = (detailCategoryName.value || '').trim().toLowerCase()
  if (!name) return
  const found = list.find(c => (c.name || '').trim().toLowerCase() === name)
  if (found) {
    form.value.category = found.id
  }
})
</script>
