<script setup lang="ts">
import { SketchBox, UiButton, UiChip } from '@larevo/ui'
import type { ApiExperience } from '~/types'

const route = useRoute()
const { data, refresh } = await useFetch<ApiExperience[]>('/api/experiences')
const experiences = computed(() => data.value ?? [])
const { toast } = useAdminToast()

const modalOpen = ref(false)
const editing = ref<ApiExperience | null>(null)

function openNew() {
  editing.value = null
  modalOpen.value = true
}
function openEdit(experience: ApiExperience) {
  editing.value = experience
  modalOpen.value = true
}
async function onSaved() {
  modalOpen.value = false
  toast(editing.value ? 'Saved changes ✓' : 'Experience added ✓')
  await refresh()
}
async function remove(id: string) {
  await $fetch(`/api/experiences/${id}`, { method: 'DELETE' })
  toast('Experience deleted')
  await refresh()
}

onMounted(() => {
  if (route.query.new) openNew()
})

const period = (e: ApiExperience) => {
  if (!e.startDate && !e.endDate) return ''
  return `${formatMonth(e.startDate) || '…'} — ${e.endDate ? formatMonth(e.endDate) : 'now'}`
}
</script>

<template>
  <AdminShell title="Experiences" subtitle="Case studies, roles and lessons learned.">
    <template #action>
      <UiButton @click="openNew">+ New Experience</UiButton>
    </template>

    <SketchBox
      v-if="experiences.length === 0"
      color="#c9c9bf"
      :stroke-width="1.6"
      class="bg-white p-11 text-center dark:bg-night-800"
    >
      <div class="font-display text-3xl text-ink-400 dark:text-chalk-500">Nothing here yet.</div>
      <div class="font-hand text-base text-ink-300 dark:text-chalk-400">
        Hit “+ New Experience” to add the first one.
      </div>
    </SketchBox>

    <div class="flex flex-col gap-3.5">
      <SketchBox
        v-for="experience in experiences"
        :key="experience.id"
        :stroke-width="1.7"
        class="flex items-center gap-[18px] bg-white px-[22px] py-[18px] shadow-sticky
               dark:bg-night-800"
      >
        <div class="min-w-0 flex-1">
          <div class="mb-1 flex flex-wrap items-center gap-2.5">
            <span class="font-display text-[26px] font-bold leading-none">
              {{ experience.title }}
            </span>
            <UiChip v-for="role in experience.roles" :key="role" variant="sketch" stroke="violet">
              {{ role }}
            </UiChip>
            <span class="font-mono text-[11px] text-ink-300 dark:text-chalk-400">
              {{ period(experience) }}
            </span>
          </div>
          <div
            v-if="experience.description"
            class="max-w-[640px] truncate text-[13.5px] text-ink-500 dark:text-chalk-500"
          >
            {{ experience.description }}
          </div>
          <div class="mt-1.5 flex flex-wrap items-center gap-1.5">
            <UiChip v-for="tag in experience.tags" :key="tag" variant="subtle">
              #{{ tag }}
            </UiChip>
          </div>
          <div
            v-if="experience.learned"
            class="mt-1 font-hand text-[14px] text-ink-400 dark:text-chalk-400"
          >
            ✎ learned: {{ experience.learned }}
          </div>
        </div>
        <div class="flex shrink-0 gap-2">
          <button
            class="cursor-pointer rounded-[7px] border-[1.5px] border-ink-100 bg-paper-200 px-4
                   py-2 font-hand text-[15px] transition-colors duration-150 hover:border-ink
                   hover:bg-sky hover:text-ink dark:border-night-500 dark:bg-night-700"
            @click="openEdit(experience)"
          >
            edit
          </button>
          <AdminDeleteButton @confirm="remove(experience.id)" />
        </div>
      </SketchBox>
    </div>

    <AdminExperienceModal
      v-if="modalOpen"
      :experience="editing"
      @close="modalOpen = false"
      @saved="onSaved"
    />
  </AdminShell>
</template>
