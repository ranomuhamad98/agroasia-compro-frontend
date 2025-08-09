<template>
  <div class="card">
    <!-- Header -->
    <div class="p-4 border-b border-green-100">
      <div class="flex justify-between items-start">
        <div class="flex items-center gap-2">
          <template v-if="loading">
            <div class="h-5 w-40 bg-gray-200 rounded animate-pulse" />
            <div class="h-5 w-12 bg-gray-200 rounded-full animate-pulse" />
          </template>
          <template v-else>
            <h3 class="text-lg font-semibold text-green-800">{{ product.name }}</h3>
            <span v-if="product.isTop"
              class="text-xs bg-green-100 text-green-700 border border-green-300 px-2 py-1 rounded-full flex items-center gap-1">
              <StarIcon class="w-3 h-3" />
              Top
            </span>
          </template>
        </div>
        <div class="flex space-x-1">
          <button :disabled="loading" @click="onEdit" class="btn-secondary p-2 disabled:opacity-50">
            <EditIcon class="w-4 h-4" />
          </button>
          <button :disabled="loading" @click="onDelete"
            class="border border-red-300 text-red-700 hover:bg-red-50 p-2 rounded-md transition-colors disabled:opacity-50">
            <Trash2Icon class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Body -->
    <div class="p-4">
      <template v-if="loading">
        <div class="w-full h-32 bg-gray-200 rounded-md mb-3 border border-gray-200 animate-pulse" />
        <div class="h-5 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
        <div class="h-4 w-full bg-gray-200 rounded mb-2 animate-pulse" />
        <div class="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
      </template>
      <template v-else>
        <img :src="product.image || '/placeholder.svg?height=200&width=200'" :alt="product.name"
          class="w-full h-32 object-cover rounded-md mb-3 border border-green-200" />
        <span class="border border-green-300 text-green-700 text-xs px-2 py-1 rounded-full">
          {{ product.category }}
        </span>
        <p class="text-sm text-green-600 mt-2 mb-2">{{ product.description }}</p>
        <p v-if="product.additionalInfo" class="text-xs text-green-500">{{ product.additionalInfo }}</p>
      </template>
    </div>
  </div>
  </template>

<script setup>
import { useAdminStore } from '@/stores/admin'
import { EditIcon, Trash2Icon, StarIcon } from 'lucide-vue-next'

const props = defineProps({
    product: {
        type: Object,
        required: true
    },
    loading: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['edit', 'delete'])

const onEdit = (e) => {
  e.preventDefault()
  if (props.loading) return
  emit('edit', props.product)
}

const onDelete = (e) => {
  e.preventDefault()
  if (props.loading) return
  emit('delete', props.product)
}

</script>