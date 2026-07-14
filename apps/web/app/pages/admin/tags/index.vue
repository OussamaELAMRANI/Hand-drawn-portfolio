<script setup lang="ts">
import { SketchBox, UiButton, UiInput } from '@larevo/ui'

interface TagRow {
  id: string
  name: string
  postCount: number
  experienceCount: number
}

const { data, refresh } = await useFetch<TagRow[]>('/api/tags')
const tags = computed(() => data.value ?? [])
const { toast } = useAdminToast()

const newName = ref('')
const creating = ref(false)
const error = ref('')

async function create() {
  if (!newName.value.trim() || creating.value) return
  creating.value = true
  error.value = ''
  try {
    await $fetch('/api/tags', { method: 'POST', body: { name: newName.value } })
    toast('Tag added ✓')
    newName.value = ''
    await refresh()
  } catch (e) {
    error.value =
      (e as { data?: { statusMessage?: string } }).data?.statusMessage ?? 'Create failed'
  } finally {
    creating.value = false
  }
}

const editingId = ref<string | null>(null)
const editName = ref('')

function startEdit(tag: TagRow) {
  editingId.value = tag.id
  editName.value = tag.name
  error.value = ''
}

async function rename() {
  if (!editingId.value) return
  try {
    await $fetch(`/api/tags/${editingId.value}`, {
      method: 'PATCH',
      body: { name: editName.value },
    })
    toast('Renamed ✓')
    editingId.value = null
    await refresh()
  } catch (e) {
    error.value =
      (e as { data?: { statusMessage?: string } }).data?.statusMessage ?? 'Rename failed'
  }
}

async function remove(id: string) {
  await $fetch(`/api/tags/${id}`, { method: 'DELETE' })
  toast('Tag deleted')
  if (editingId.value === id) editingId.value = null
  await refresh()
}
</script>

<template>
  <AdminShell title="Tags" subtitle="The topics your posts and experiences hang from.">
    <template #action>
      <div class="flex items-center gap-2.5">
        <UiInput
          v-model="newName"
          placeholder="new tag…"
          class="!w-52"
          @keydown.enter="create"
        />
        <UiButton :disabled="creating" @click="create">+ Add</UiButton>
      </div>
    </template>

    <p v-if="error" class="mb-4 font-hand text-[15px] text-magenta">{{ error }}</p>

    <SketchBox
      v-if="tags.length === 0"
      color="#c9c9bf"
      :stroke-width="1.6"
      class="bg-white p-11 text-center dark:bg-night-800"
    >
      <div class="font-display text-3xl text-ink-400 dark:text-chalk-500">Nothing here yet.</div>
      <div class="font-hand text-base text-ink-300 dark:text-chalk-400">
        Add a tag above, or create them on the fly while writing posts.
      </div>
    </SketchBox>

    <div class="grid gap-3.5 md:grid-cols-2">
      <SketchBox
        v-for="tag in tags"
        :key="tag.id"
        :stroke-width="1.7"
        class="flex items-center gap-3 bg-white px-5 py-3.5 shadow-sticky dark:bg-night-800"
      >
        <template v-if="editingId === tag.id">
          <UiInput v-model="editName" class="!w-40" @keydown.enter="rename" />
          <button
            class="cursor-pointer font-hand text-[15px] text-cyan"
            @click="rename"
          >
            save
          </button>
          <button
            class="cursor-pointer font-hand text-[15px] text-ink-400 dark:text-chalk-500"
            @click="editingId = null"
          >
            cancel
          </button>
        </template>
        <template v-else>
          <span class="font-mono text-[15px]">#{{ tag.name }}</span>
          <span class="font-hand text-[13px] text-ink-300 dark:text-chalk-400">
            {{ tag.postCount }} post{{ tag.postCount === 1 ? '' : 's' }} ·
            {{ tag.experienceCount }} experience{{ tag.experienceCount === 1 ? '' : 's' }}
          </span>
        </template>
        <div class="ml-auto flex shrink-0 gap-2">
          <button
            v-if="editingId !== tag.id"
            class="cursor-pointer rounded-[7px] border-[1.5px] border-ink-100 bg-paper-200 px-3
                   py-1.5 font-hand text-[14px] transition-colors duration-150 hover:border-ink
                   hover:bg-sky hover:text-ink dark:border-night-500 dark:bg-night-700"
            @click="startEdit(tag)"
          >
            rename
          </button>
          <AdminDeleteButton @confirm="remove(tag.id)" />
        </div>
      </SketchBox>
    </div>
  </AdminShell>
</template>
