<script setup lang="ts">
import type { UiSelectProps } from './UiSelect.types'
withDefaults(defineProps<UiSelectProps>(), {
  modelValue: '',
  options: () => [],
})
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <select
      :value="modelValue"
      class="w-full rounded-lg border-[1.5px] border-[#dcdcd2] bg-white px-3 py-[10px] font-sans text-sm
             text-ink outline-none transition-colors duration-150 ease-out focus:border-cyan
             dark:border-night-500 dark:bg-night-800 dark:text-chalk"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
  >
    <slot>
      <option v-for="o in options" :key="o" :value="o">{{ o }}</option>
    </slot>
  </select>
</template>
