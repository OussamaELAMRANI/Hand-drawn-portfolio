<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const progress = ref(0)
// measured from the page's own <nav> rather than taken as a prop — a
// hardcoded pixel offset drifts the moment the nav's height differs
// (mobile vs desktop, or the mobile menu dropdown opening)
const navHeight = ref(0)

function onScroll() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight
  progress.value = scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0
}

let resizeObserver: ResizeObserver | undefined

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  const nav = document.querySelector('nav')
  if (nav) {
    resizeObserver = new ResizeObserver(([entry]) => {
      if (entry) navHeight.value = entry.contentRect.height
    })
    resizeObserver.observe(nav)
  }
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  resizeObserver?.disconnect()
})
</script>

<template>
  <div class="sticky z-40 h-[5px] bg-transparent" :style="{ top: `${navHeight}px` }">
    <div
      class="h-full transition-[width] duration-100 ease-linear"
      :style="{
        width: `${progress}%`,
        background: 'repeating-linear-gradient(-45deg, #C0577F 0 6px, #d97ba0 6px 12px)',
      }"
    />
  </div>
</template>
