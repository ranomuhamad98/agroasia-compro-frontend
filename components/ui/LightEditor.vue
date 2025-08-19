<template>
  <div class="space-y-2">
    <div class="flex flex-wrap gap-2">
      <button type="button" class="btn-secondary !py-1 !px-2" @click="() => exec('bold')"><span class="font-bold">B</span></button>
      <button type="button" class="btn-secondary !py-1 !px-2 italic" @click="() => exec('italic')">I</button>
      <button type="button" class="btn-secondary !py-1 !px-2 underline" @click="() => exec('underline')">U</button>
      <button type="button" class="btn-secondary !py-1 !px-2" @click="() => exec('insertUnorderedList')">• List</button>
      <button type="button" class="btn-secondary !py-1 !px-2" @click="() => exec('insertOrderedList')">1. List</button>
      <button type="button" class="btn-secondary !py-1 !px-2" @click="makeLink">Link</button>
      <button type="button" class="btn-secondary !py-1 !px-2" @click="() => exec('removeFormat')">Clear</button>
    </div>

    <div class="relative">
      <div
        ref="editorRef"
        contenteditable="true"
        class="min-h-[120px] p-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 leading-relaxed"
        @input="onInput"
        @paste="onPaste"
        @keydown.enter.prevent="onEnter"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
      <div v-if="!props.modelValue && !isFocused" class="absolute top-3 left-3 text-green-400 pointer-events-none">
        {{ placeholder || 'Type here…' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'

const props = defineProps<{ modelValue: string, placeholder?: string }>()
const emit = defineEmits<{'update:modelValue': [value: string]}>()

const editorRef = ref<HTMLDivElement | null>(null)
const isFocused = ref(false)
const { $sanitize } = useNuxtApp() as unknown as { $sanitize: (input?: string) => string }
const isFromSelf = ref(false)

const setEditorHtml = (html: string) => {
  if (editorRef.value && editorRef.value.innerHTML !== html) {
    editorRef.value.innerHTML = html
  }
}

onMounted(() => {
  setEditorHtml($sanitize(props.modelValue || ''))
})

watch(() => props.modelValue, (val) => {
  if (isFromSelf.value) {
    // Skip reflecting our own change to preserve caret position
    isFromSelf.value = false
    return
  }
  const sanitized = $sanitize(val || '')
  if (editorRef.value && editorRef.value.innerHTML !== sanitized) {
    setEditorHtml(sanitized)
  }
})

const onInput = () => {
  isFromSelf.value = true
  const html = $sanitize(editorRef.value?.innerHTML || '')
  emit('update:modelValue', html)
  // Reset flag on next tick to allow external updates to reflect
  nextTick(() => {
    isFromSelf.value = false
  })
}

const onPaste = (e: ClipboardEvent) => {
  e.preventDefault()
  const text = e.clipboardData?.getData('text/plain') || ''
  document.execCommand('insertText', false, text)
}

const exec = (command: string, value?: string) => {
  // Using execCommand for broad browser support; lightweight and dependency-free
  document.execCommand(command, false, value)
  onInput()
}

const makeLink = () => {
  const url = prompt('Enter URL')
  if (!url) return
  let safe = url.trim()
  if (!/^https?:\/\//i.test(safe)) safe = 'https://' + safe
  exec('createLink', safe)
}

const onEnter = (e: KeyboardEvent) => {
  if (e.shiftKey) {
    exec('insertLineBreak')
  } else {
    exec('insertParagraph')
  }
}

const placeholder = props.placeholder
</script>


