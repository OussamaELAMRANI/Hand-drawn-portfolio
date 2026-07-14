<script setup lang="ts">
import { SketchBox, UiButton, UiEditor, UiInput } from '@larevo/ui'
import type { JSONContent } from '@larevo/ui'
import type { ApiOverview } from '~/types'

const emptyDoc: JSONContent = { type: 'doc', content: [{ type: 'paragraph' }] }

const { data } = await useFetch<ApiOverview | null>('/api/overview')
const { toast } = useAdminToast()

const name = ref(data.value?.name ?? '')
const tagline = ref<JSONContent>(data.value?.tagline ?? emptyDoc)
const bio = ref<JSONContent>(data.value?.bio ?? emptyDoc)
const cards = ref(
  (data.value?.cards ?? []).map((c) => ({
    image: c.image ?? '',
    alt: c.alt ?? '',
    caption: c.caption ?? '',
    note: c.note ?? '',
  })),
)

const saving = ref(false)
const error = ref('')

function addCard() {
  cards.value.push({ image: '', alt: '', caption: '', note: '' })
}
function removeCard(index: number) {
  cards.value.splice(index, 1)
}

async function save() {
  if (!name.value.trim()) {
    error.value = 'Name is required'
    return
  }
  saving.value = true
  error.value = ''
  try {
    await $fetch('/api/overview', {
      method: 'PUT',
      body: {
        name: name.value.trim(),
        tagline: tagline.value,
        bio: bio.value,
        cards: cards.value
          .map((c) => ({
            image: c.image.trim() || undefined,
            alt: c.alt.trim() || undefined,
            caption: c.caption.trim() || undefined,
            note: c.note.trim() || undefined,
          }))
          .filter((c) => c.image || c.caption || c.note),
      },
    })
    toast('Saved changes ✓')
  } catch (e) {
    error.value =
      (e as { data?: { statusMessage?: string } }).data?.statusMessage ?? 'Save failed'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <AdminShell title="Overview" subtitle="The hero section on your homepage.">
    <div class="flex max-w-[720px] flex-col gap-4">
      <label>
        <span class="mb-1 block font-hand text-[15px] text-ink-600 dark:text-chalk-600">
          Name
        </span>
        <UiInput v-model="name" placeholder="Oussama EL AMRANI" />
      </label>

      <div>
        <span class="mb-1 block font-hand text-[15px] text-ink-600 dark:text-chalk-600">
          Tagline
        </span>
        <UiEditor v-model="tagline" placeholder="I build solid web products & chase good light…" />
      </div>

      <div>
        <span class="mb-1 block font-hand text-[15px] text-ink-600 dark:text-chalk-600">
          Bio
        </span>
        <UiEditor v-model="bio" placeholder="Senior Full-Stack Engineer…" />
      </div>

      <div>
        <div class="mb-2 flex items-center justify-between">
          <span class="font-hand text-[15px] text-ink-600 dark:text-chalk-600">
            Polaroid cards
          </span>
          <button
            class="cursor-pointer font-hand text-[14px] text-cyan"
            @click="addCard"
          >
            + add card
          </button>
        </div>
        <div class="flex flex-col gap-3">
          <SketchBox
            v-for="(card, i) in cards"
            :key="i"
            :stroke-width="1.5"
            class="grid grid-cols-2 gap-2.5 bg-white p-3.5 dark:bg-night-800"
          >
            <UiInput v-model="card.image" placeholder="image URL (optional)" />
            <UiInput v-model="card.alt" placeholder="alt text" />
            <UiInput v-model="card.caption" placeholder="caption" />
            <UiInput v-model="card.note" placeholder="note" />
            <button
              class="col-span-2 cursor-pointer justify-self-end font-hand text-[13px]
                     text-ink-400 hover:text-magenta dark:text-chalk-500"
              @click="removeCard(i)"
            >
              remove
            </button>
          </SketchBox>
          <div
            v-if="cards.length === 0"
            class="font-hand text-[14px] text-ink-300 dark:text-chalk-400"
          >
            No cards yet — add one above.
          </div>
        </div>
      </div>

      <p v-if="error" class="font-hand text-[15px] text-magenta">{{ error }}</p>

      <div>
        <UiButton :disabled="saving" @click="save">
          {{ saving ? 'saving…' : 'Save changes' }}
        </UiButton>
      </div>
    </div>
  </AdminShell>
</template>
