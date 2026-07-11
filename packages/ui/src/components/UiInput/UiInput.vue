<script setup lang="ts">
import type { UiInputProps } from './UiInput.types'
withDefaults(
    defineProps<UiInputProps>(),
    { modelValue: '', type: 'text', placeholder: undefined },
)
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      class="w-full rounded-lg border-[1.5px] border-[#dcdcd2] bg-white px-3 py-[10px] font-sans text-sm
             text-ink outline-none transition-colors duration-150 ease-out focus:border-cyan
             dark:border-night-500 dark:bg-night-800 dark:text-chalk"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
