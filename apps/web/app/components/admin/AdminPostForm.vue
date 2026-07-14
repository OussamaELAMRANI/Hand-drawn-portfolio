<script setup lang="ts">
import {
  SketchBox,
  UiButton,
  UiChip,
  UiEditor,
  UiInput,
  UiSelect,
  UiTagInput,
  UiTextarea,
} from '@larevo/ui'
import type { JSONContent } from '@larevo/ui'
import type { ApiPost } from '~/types'

const props = defineProps<{ post?: ApiPost | null }>()

const emptyDoc: JSONContent = { type: 'doc', content: [{ type: 'paragraph' }] }

const title = ref(props.post?.title ?? '')
const slug = ref(props.post?.slug ?? '')
const excerpt = ref(props.post?.excerpt ?? '')
const status = ref(props.post?.status ?? 'draft')
const tags = ref<string[]>(props.post?.tags ?? [])
const body = ref<JSONContent>(props.post?.body ?? emptyDoc)

const saving = ref(false)
const error = ref('')
const showPreview = ref(true)

const { toast } = useAdminToast()

// autocomplete backed by the ranked /api/tags?q= search (debounced)
const suggestions = ref<string[]>([])
let searchTimer: ReturnType<typeof setTimeout> | undefined
function onTagQuery(q: string) {
  clearTimeout(searchTimer)
  if (!q) {
    suggestions.value = []
    return
  }
  searchTimer = setTimeout(async () => {
    const rows = await $fetch<{ name: string }[]>('/api/tags', { query: { q } })
    suggestions.value = rows.map((r) => r.name)
  }, 150)
}

async function save() {
  if (!title.value.trim()) {
    error.value = 'Title is required'
    return
  }
  saving.value = true
  error.value = ''
  const payload = {
    title: title.value.trim(),
    slug: slug.value.trim() || undefined,
    excerpt: excerpt.value.trim() || null,
    status: status.value,
    body: body.value,
    tags: tags.value,
  }
  try {
    if (props.post) {
      await $fetch(`/api/posts/${props.post.id}`, { method: 'PATCH', body: payload })
    } else {
      await $fetch('/api/posts', { method: 'POST', body: payload })
    }
    toast(props.post ? 'Saved changes ✓' : 'Post created ✓')
    await navigateTo('/admin/posts')
  } catch (e) {
    error.value =
      (e as { data?: { statusMessage?: string } }).data?.statusMessage ?? 'Save failed'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="grid items-start gap-6" :class="showPreview ? 'xl:grid-cols-2' : ''">
    <div class="flex flex-col gap-4">
      <label>
        <span class="mb-1 block font-hand text-[15px] text-ink-600 dark:text-chalk-600">
          Title
        </span>
        <UiInput v-model="title" placeholder="A punchy headline" />
      </label>

      <div class="grid grid-cols-2 gap-4">
        <label>
          <span class="mb-1 block font-hand text-[15px] text-ink-600 dark:text-chalk-600">
            Slug
          </span>
          <UiInput v-model="slug" placeholder="auto from title" />
        </label>
        <label>
          <span class="mb-1 block font-hand text-[15px] text-ink-600 dark:text-chalk-600">
            Status
          </span>
          <UiSelect v-model="status" :options="['draft', 'published']" />
        </label>
      </div>

      <label>
        <span class="mb-1 block font-hand text-[15px] text-ink-600 dark:text-chalk-600">
          Excerpt
        </span>
        <UiTextarea
          v-model="excerpt"
          :rows="2"
          placeholder="One or two sentences shown on the cards."
        />
      </label>

      <label>
        <span class="mb-1 block font-hand text-[15px] text-ink-600 dark:text-chalk-600">
          Tags
        </span>
        <UiTagInput
          v-model="tags"
          :suggestions="suggestions"
          prefix="#"
          placeholder="type to search or create…"
          @query="onTagQuery"
        />
      </label>

      <div>
        <span class="mb-1 block font-hand text-[15px] text-ink-600 dark:text-chalk-600">
          Body
        </span>
        <UiEditor v-model="body" placeholder="The full article — make it yours…" />
      </div>

      <p v-if="error" class="font-hand text-[15px] text-magenta">{{ error }}</p>

      <div class="flex items-center gap-4">
        <UiButton :disabled="saving" @click="save">
          {{ saving ? 'saving…' : props.post ? 'Save changes' : 'Create post' }}
        </UiButton>
        <button
          class="cursor-pointer font-hand text-base text-ink-400 hover:text-ink
                 dark:text-chalk-500 dark:hover:text-chalk"
          @click="navigateTo('/admin/posts')"
        >
          cancel
        </button>
        <button
          class="ml-auto cursor-pointer font-hand text-[15px] text-cyan underline
                 decoration-wavy underline-offset-[3px]"
          @click="showPreview = !showPreview"
        >
          {{ showPreview ? 'hide preview' : 'show preview' }}
        </button>
      </div>
    </div>

    <SketchBox
      v-if="showPreview"
      :stroke-width="1.8"
      class="sticky top-6 bg-white px-7 py-6 shadow-sticky dark:bg-night-800"
    >
      <div class="mb-2 font-mono text-[10px] uppercase tracking-wide text-ink-300 dark:text-chalk-400">
        preview
      </div>
      <div v-if="tags.length" class="mb-2 flex flex-wrap gap-1.5">
        <UiChip v-for="tag in tags" :key="tag" variant="subtle">#{{ tag }}</UiChip>
      </div>
      <h1 class="font-display text-4xl font-bold leading-none">
        {{ title || 'Untitled post' }}
      </h1>
      <p v-if="excerpt" class="mt-2 font-hand text-lg text-ink-500 dark:text-chalk-500">
        {{ excerpt }}
      </p>
      <div class="mt-4 border-t border-dashed border-ink-100 pt-4 dark:border-night-500">
        <UiEditor :model-value="body" :editable="false" />
      </div>
    </SketchBox>
  </div>
</template>
