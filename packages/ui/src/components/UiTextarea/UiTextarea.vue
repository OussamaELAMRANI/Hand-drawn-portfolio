<script setup lang="ts">
import type { UiTextareaProps } from './UiTextarea.types'
withDefaults(
    defineProps<UiTextareaProps>(),
    { modelValue: '', rows: 3, placeholder: undefined },
)
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <textarea
      :value="modelValue"
      :rows="rows"
      :placeholder="placeholder"
      class="w-full rounded-lg border-[1.5px] border-[#dcdcd2] bg-white px-3 py-[10px] font-sans text-sm
             text-ink outline-none transition-colors duration-150 ease-out focus:border-cyan
             dark:border-night-500 dark:bg-night-800 dark:text-chalk"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  />
</template>
