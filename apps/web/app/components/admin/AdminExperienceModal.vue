<script setup lang="ts">
import { UiButton, UiEditor, UiInput, UiTagInput, UiTextarea } from '@larevo/ui'
import type { JSONContent } from '@larevo/ui'
import type { ApiExperience } from '~/types'

const props = defineProps<{ experience: ApiExperience | null }>()
const emit = defineEmits<{ close: []; saved: [] }>()

const title = ref(props.experience?.title ?? '')
const rolesText = ref(props.experience?.roles.join(', ') ?? '')
const description = ref<JSONContent | null>(props.experience?.description ?? null)
const tags = ref<string[]>(props.experience?.tags ?? [])
const learned = ref(props.experience?.learned ?? '')
const startDate = ref(props.experience?.startDate ?? '')
const endDate = ref(props.experience?.endDate ?? '')

const saving = ref(false)
const error = ref('')

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

const splitList = (text: string) => [
  ...new Set(
    text
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
  ),
]

async function save() {
  if (!title.value.trim()) {
    error.value = 'Title is required'
    return
  }
  saving.value = true
  error.value = ''
  const payload = {
    title: title.value.trim(),
    roles: splitList(rolesText.value),
    description: richTextToPlain(description.value) ? description.value : null,
    tags: tags.value,
    learned: learned.value.trim() || null,
    startDate: startDate.value || null,
    endDate: endDate.value || null,
  }
  try {
    if (props.experience) {
      await $fetch(`/api/experiences/${props.experience.id}`, { method: 'PATCH', body: payload })
    } else {
      await $fetch('/api/experiences', { method: 'POST', body: payload })
    }
    emit('saved')
  } catch (e) {
    error.value =
      (e as { data?: { statusMessage?: string } }).data?.statusMessage ?? 'Save failed'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div
    class="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto
           bg-ink/35 px-5 py-11 backdrop-blur-[2px]"
    @click.self="emit('close')"
  >
    <div
      class="w-full max-w-[620px] -rotate-[0.4deg] rounded-md border-[2.5px] border-ink bg-paper
             p-7 shadow-[9px_12px_0_rgba(42,42,42,0.16)] dark:border-chalk-600 dark:bg-night-800"
    >
      <div class="mb-5 flex items-baseline justify-between">
        <h2 class="font-display text-[38px] font-bold leading-none">
          {{ props.experience ? 'Edit experience' : 'New experience' }}
        </h2>
        <button
          class="cursor-pointer font-hand text-xl text-ink-400 hover:text-ink
                 dark:text-chalk-500 dark:hover:text-chalk"
          @click="emit('close')"
        >
          ✕
        </button>
      </div>

      <div class="flex flex-col gap-4">
        <label>
          <span class="mb-1 block font-hand text-[15px] text-ink-600 dark:text-chalk-600">
            Title
          </span>
          <UiInput v-model="title" placeholder="Ledger DDD" />
        </label>

        <label>
          <span class="mb-1 block font-hand text-[15px] text-ink-600 dark:text-chalk-600">
            My role(s) — comma separated
          </span>
          <UiInput v-model="rolesText" placeholder="freelance, backend, frontend" />
        </label>

        <label>
          <span class="mb-1 block font-hand text-[15px] text-ink-600 dark:text-chalk-600">
            Description
          </span>
          <UiEditor v-model="description" placeholder="What the experience covers." />
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

        <label>
          <span class="mb-1 block font-hand text-[15px] text-ink-600 dark:text-chalk-600">
            What I learned
          </span>
          <UiTextarea
            v-model="learned"
            :rows="3"
            placeholder="The new thing this experience taught you."
          />
        </label>

        <div class="grid grid-cols-2 gap-4">
          <label>
            <span class="mb-1 block font-hand text-[15px] text-ink-600 dark:text-chalk-600">
              Start date
            </span>
            <UiInput v-model="startDate" type="date" />
          </label>
          <label>
            <span class="mb-1 block font-hand text-[15px] text-ink-600 dark:text-chalk-600">
              End date — empty = ongoing
            </span>
            <UiInput v-model="endDate" type="date" />
          </label>
        </div>
      </div>

      <p v-if="error" class="mt-3 font-hand text-[15px] text-magenta">{{ error }}</p>

      <div class="mt-6 flex items-center justify-end gap-4">
        <button
          class="cursor-pointer font-hand text-[17px] text-ink-400 hover:text-ink
                 dark:text-chalk-500 dark:hover:text-chalk"
          @click="emit('close')"
        >
          cancel
        </button>
        <UiButton :disabled="saving" @click="save">
          {{ saving ? 'saving…' : 'Save experience' }}
        </UiButton>
      </div>
    </div>
  </div>
</template>
