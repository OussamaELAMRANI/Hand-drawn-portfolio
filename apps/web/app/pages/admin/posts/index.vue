<script setup lang="ts">
import { SketchBox, UiButton, UiChip } from '@larevo/ui'
import type { ApiPost } from '~/types'

const { data, refresh } = await useFetch<ApiPost[]>('/api/posts')
const posts = computed(() => data.value ?? [])
const { toast } = useAdminToast()

async function remove(id: string) {
  await $fetch(`/api/posts/${id}`, { method: 'DELETE' })
  toast('Post deleted')
  await refresh()
}

const statusColor = (status: ApiPost['status']) =>
  status === 'published' ? '#0E93A8' : '#C98A2B'
</script>

<template>
  <AdminShell title="Blog Posts" subtitle="Write and manage articles on IT, AI & tech.">
    <template #action>
      <UiButton @click="navigateTo('/admin/posts/new')">+ New Post</UiButton>
    </template>

    <SketchBox
      v-if="posts.length === 0"
      color="#c9c9bf"
      :stroke-width="1.6"
      class="bg-white p-11 text-center dark:bg-night-800"
    >
      <div class="font-display text-3xl text-ink-400 dark:text-chalk-500">Nothing here yet.</div>
      <div class="font-hand text-base text-ink-300 dark:text-chalk-400">
        Hit “+ New Post” to write the first one.
      </div>
    </SketchBox>

    <div class="flex flex-col gap-3.5">
      <SketchBox
        v-for="post in posts"
        :key="post.id"
        :stroke-width="1.7"
        class="flex items-center gap-[18px] bg-white px-[22px] py-[18px] shadow-sticky
               dark:bg-night-800"
      >
        <div class="min-w-0 flex-1">
          <div class="mb-0.5 flex items-center gap-2.5">
            <span
              class="rounded-[3px] px-2 py-0.5 font-mono text-[10px] uppercase text-white"
              :style="{ backgroundColor: statusColor(post.status) }"
            >
              {{ post.status }}
            </span>
            <span class="truncate font-display text-[26px] font-bold leading-none">
              {{ post.title }}
            </span>
          </div>
          <div class="flex flex-wrap items-center gap-2 font-hand text-[15px] text-ink-400 dark:text-chalk-400">
            <span>{{ formatDate(post.publishedAt ?? post.createdAt) }}</span>
            <span class="font-mono text-xs text-ink-300 dark:text-chalk-400">/{{ post.slug }}</span>
            <UiChip v-for="tag in post.tags" :key="tag" variant="subtle">#{{ tag }}</UiChip>
          </div>
          <div
            v-if="post.excerpt"
            class="mt-0.5 max-w-[640px] truncate text-[13.5px] text-ink-500 dark:text-chalk-500"
          >
            {{ post.excerpt }}
          </div>
        </div>
        <div class="flex shrink-0 gap-2">
          <NuxtLink
            :to="`/admin/posts/${post.id}`"
            class="rounded-[7px] border-[1.5px] border-ink-100 bg-paper-200 px-4 py-2 font-hand
                   text-[15px] transition-colors duration-150 hover:border-ink hover:bg-sky
                   hover:text-ink dark:border-night-500 dark:bg-night-700"
          >
            edit
          </NuxtLink>
          <AdminDeleteButton @confirm="remove(post.id)" />
        </div>
      </SketchBox>
    </div>
  </AdminShell>
</template>
