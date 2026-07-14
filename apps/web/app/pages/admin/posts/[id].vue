<script setup lang="ts">
import type { ApiPost } from '~/types'

const route = useRoute()
const { data: post, error } = await useFetch<ApiPost>(`/api/posts/${route.params.id}`)

if (error.value || !post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}
</script>

<template>
  <AdminShell title="Edit post" :subtitle="post!.title">
    <AdminPostForm :post="post" />
  </AdminShell>
</template>
