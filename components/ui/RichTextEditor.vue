<template>
  <ClientOnly>
    <div class="space-y-2">
      <div class="flex flex-wrap gap-2">
        <button type="button" class="btn-secondary !py-1 !px-2" @click="() => chain()?.focus().toggleBold().run()"
          :class="{ '!bg-green-600 !text-white': isActive('bold') }"><span class="font-bold">B</span></button>
        <button type="button" class="btn-secondary !py-1 !px-2 italic" @click="() => chain()?.focus().toggleItalic().run()"
          :class="{ '!bg-green-600 !text-white': isActive('italic') }">I</button>
        <button type="button" class="btn-secondary !py-1 !px-2 underline" @click="() => chain()?.focus().toggleUnderline().run()"
          :class="{ '!bg-green-600 !text-white': isActive('underline') }">U</button>

        <button type="button" class="btn-secondary !py-1 !px-2" @click="() => chain()?.focus().toggleOrderedList().run()"
          :class="{ '!bg-green-600 !text-white': isActive('orderedList') }">1. List</button>
        <button type="button" class="btn-secondary !py-1 !px-2" @click="() => chain()?.focus().toggleBulletList().run()"
          :class="{ '!bg-green-600 !text-white': isActive('bulletList') }">• List</button>

        <button type="button" class="btn-secondary !py-1 !px-2" @click="makeLink">Link</button>
        <button type="button" class="btn-secondary !py-1 !px-2" @click="clearFormatting">Clear</button>
      </div>

      <div class="relative">
        <EditorContent :editor="editor" class="min-h-[120px] p-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 leading-relaxed" />
        <div v-if="!localContent && !isFocused" class="absolute top-3 left-3 text-green-400 pointer-events-none">
          {{ placeholder || 'Type here…' }}
        </div>
      </div>
    </div>
    <template #fallback>
      <div class="min-h-[120px] p-3 border-2 border-green-200 rounded-lg bg-white/50" />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'

const props = defineProps<{ modelValue: string, placeholder?: string }>()
const emit = defineEmits<{'update:modelValue': [value: string]}>()

const localContent = ref<string>(props.modelValue || '')
const isFocused = ref(false)

// Use Nuxt plugin sanitizer to keep output safe
const { $sanitize } = (useNuxtApp() as unknown as { $sanitize: (input?: string) => string })

let editor: Editor | undefined = undefined

const createEditor = () => {
  editor = new Editor({
    content: localContent.value || '',
    extensions: [
      StarterKit.configure({}),
      Underline,
      Link.configure({ openOnClick: true, HTMLAttributes: { rel: 'noopener noreferrer' } }),
      Placeholder.configure({ placeholder: props.placeholder || 'Type here…' })
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none'
      }
    }
  })

  editor.on('update', ({ editor }) => {
    const html = editor.getHTML()
    const clean = $sanitize(html)
    localContent.value = clean
    emit('update:modelValue', clean)
  })

  editor.on('focus', () => { isFocused.value = true })
  editor.on('blur', () => { isFocused.value = false })
}

onMounted(() => {
  if (process.client) createEditor()
})

onBeforeUnmount(() => {
  editor?.destroy()
  editor = undefined
})

watch(() => props.modelValue, (val) => {
  const next = val || ''
  if (next !== localContent.value) {
    localContent.value = next
    if (editor && editor.getHTML() !== next) {
      editor.commands.setContent(next, { emitUpdate: false })
    }
  }
})

const isActive = (name: string) => editor?.isActive(name) ?? false
const chain = () => editor?.chain() as ReturnType<Editor['chain']>

const clearFormatting = () => {
  if (!editor) return
  editor.chain().focus()
    .unsetAllMarks()
    .clearNodes()
    .run()
}

const makeLink = () => {
  if (!editor) return
  const url = prompt('Enter URL')
  if (!url) return
  let safe = url.trim()
  if (!/^https?:\/\//i.test(safe)) safe = 'https://' + safe
  editor.chain().focus().extendMarkRange('link').setLink({ href: safe, target: '_blank' }).run()
}
</script>


<style scoped>
/* Ensure Tiptap content shows list markers and link styling clearly */
:deep(.ProseMirror) {
  line-height: 1.65;
}

:deep(.ProseMirror ul) {
  list-style-type: disc !important;
  padding-left: 1.25rem;
  margin: 0.25rem 0 0.25rem 0;
}

:deep(.ProseMirror ol) {
  list-style-type: decimal !important;
  padding-left: 1.25rem;
  margin: 0.25rem 0 0.25rem 0;
}

:deep(.ProseMirror li) {
  margin: 0.125rem 0;
}

:deep(.ProseMirror a) {
  color: #2563eb; /* tailwind blue-600 */
  text-decoration: underline;
}

/* Basic typography for readability without @tailwindcss/typography */
:deep(.ProseMirror p) { margin: 0.25rem 0; }
</style>
