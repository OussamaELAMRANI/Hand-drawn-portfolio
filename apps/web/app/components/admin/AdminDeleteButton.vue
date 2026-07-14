<script setup lang="ts">
const emit = defineEmits<{ confirm: [] }>()

// two-step inline confirm — no blocking browser dialog
const armed = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

function click() {
  if (armed.value) {
    armed.value = false
    emit('confirm')
  } else {
    armed.value = true
    clearTimeout(timer)
    timer = setTimeout(() => (armed.value = false), 2500)
  }
}
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <button
    type="button"
    class="cursor-pointer rounded-[7px] border-[1.5px] px-3.5 py-2 font-hand text-[15px]
           transition-colors duration-150"
    :class="
      armed
        ? 'border-magenta bg-magenta text-white'
        : `border-blushInk bg-white text-magenta hover:border-magenta hover:bg-magenta
           hover:text-white dark:border-nightBlushInk dark:bg-night-800`
    "
    @click="click"
  >
    {{ armed ? 'sure?' : 'del' }}
  </button>
</template>
