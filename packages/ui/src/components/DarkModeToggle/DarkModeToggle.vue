<script setup lang="ts">
import { onMounted, ref } from 'vue'
import SketchBox from '#components/SketchBox/SketchBox.vue'

// the `dark` class on <html> is the single source of truth (Tailwind
// darkMode:'class'; @larevo/ui's useDarkMode observes the same class).
// An inline head script applies the saved theme pre-paint, so on mount
// we only read the result.
const isDark = ref(false)
const mounted = ref(false)

onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark')
  mounted.value = true
})

function toggle() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  try {
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  } catch {
    // private mode / storage disabled — theme just won't persist
  }
}
</script>

<template>
  <div class="fixed bottom-6 right-6 z-50">
    <SketchBox
      tag="button"
      shape="ellipse"
      :stroke-width="2"
      type="button"
      class="flex h-12 w-12 cursor-pointer items-center justify-center bg-white text-xl text-ink shadow-sticky transition-transform duration-150 ease-out hover:-rotate-6 hover:scale-105 dark:bg-night-800 dark:text-chalk"
      :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      @click="toggle"
    >
      <!-- icon only after mount: the server doesn't know the visitor's theme -->
      <span v-if="mounted" aria-hidden="true">{{ isDark ? '☀' : '☾' }}</span>
    </SketchBox>
  </div>
</template>
