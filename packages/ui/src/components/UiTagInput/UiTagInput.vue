<script setup lang="ts">
import { computed, ref } from 'vue'
import type { UiTagInputProps } from './UiTagInput.types'

const props = withDefaults(defineProps<UiTagInputProps>(), {
  modelValue: () => [],
  suggestions: () => [],
  placeholder: 'add a tag…',
  allowCreate: true,
  prefix: '',
})
const emit = defineEmits<{
  'update:modelValue': [tags: string[]]
  /** fired as the user types — fetch suggestions and pass them back in */
  query: [text: string]
}>()

const text = ref('')
const open = ref(false)
const highlighted = ref(0)
const input = ref<HTMLInputElement>()

const clean = (value: string) => value.trim().replace(/^#/, '').toLowerCase()
const cleanText = computed(() => clean(text.value))

interface Option {
  kind: 'tag' | 'create'
  value: string
}

const options = computed<Option[]>(() => {
  const existing: Option[] = props.suggestions
    .filter((s) => !props.modelValue.includes(s))
    .map((value) => ({ kind: 'tag', value }))
  const canCreate =
    props.allowCreate &&
    cleanText.value !== '' &&
    !props.suggestions.includes(cleanText.value) &&
    !props.modelValue.includes(cleanText.value)
  return canCreate ? [...existing, { kind: 'create', value: cleanText.value }] : existing
})

function add(tag: string) {
  const value = clean(tag)
  if (!value || props.modelValue.includes(value)) return
  emit('update:modelValue', [...props.modelValue, value])
  text.value = ''
  highlighted.value = 0
  emit('query', '')
}

function remove(index: number) {
  emit(
    'update:modelValue',
    props.modelValue.filter((_, i) => i !== index),
  )
}

function onInput() {
  open.value = true
  highlighted.value = 0
  emit('query', cleanText.value)
}

function commit() {
  const option = options.value[highlighted.value]
  if (option) add(option.value)
  else if (cleanText.value) add(cleanText.value)
}

function onKeydown(event: KeyboardEvent) {
  const count = options.value.length
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      open.value = true
      if (count) highlighted.value = (highlighted.value + 1) % count
      break
    case 'ArrowUp':
      event.preventDefault()
      if (count) highlighted.value = (highlighted.value - 1 + count) % count
      break
    case 'Enter':
    case ',':
      if (cleanText.value || (open.value && count)) {
        event.preventDefault()
        commit()
      }
      break
    case 'Backspace':
      if (text.value === '' && props.modelValue.length) remove(props.modelValue.length - 1)
      break
    case 'Escape':
      open.value = false
      break
  }
}
</script>

<template>
  <div class="relative">
    <div
      class="flex w-full cursor-text flex-wrap items-center gap-1.5 rounded-lg border-[1.5px]
             border-[#dcdcd2] bg-white px-3 py-2 transition-colors duration-150 ease-out
             focus-within:border-cyan dark:border-night-500 dark:bg-night-800"
      @click="input?.focus()"
    >
      <span
        v-for="(tag, i) in modelValue"
        :key="tag"
        class="inline-flex items-center gap-1 rounded-md bg-paper-300 px-2 py-0.5 font-mono
               text-xs text-ink-600 dark:bg-night-600 dark:text-chalk-600"
      >
        {{ prefix }}{{ tag }}
        <button
          type="button"
          class="cursor-pointer text-ink-300 transition-colors hover:text-magenta
                 dark:text-chalk-400"
          :aria-label="`remove ${tag}`"
          @click.stop="remove(i)"
        >
          ×
        </button>
      </span>
      <input
        ref="input"
        v-model="text"
        type="text"
        :placeholder="modelValue.length ? '' : placeholder"
        class="min-w-[120px] flex-1 bg-transparent py-0.5 font-sans text-sm text-ink outline-none
               dark:text-chalk"
        @input="onInput"
        @focus="open = true"
        @blur="open = false"
        @keydown="onKeydown"
      />
    </div>

    <ul
      v-if="open && options.length"
      class="absolute left-0 right-0 top-full z-20 mt-1.5 max-h-56 overflow-y-auto rounded-lg
             border-[1.5px] border-ink-200 bg-white py-1 shadow-lifted dark:border-night-500
             dark:bg-night-800"
    >
      <li v-for="(option, i) in options" :key="option.kind + option.value">
        <button
          type="button"
          class="flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-left font-hand
                 text-[15px]"
          :class="
            i === highlighted
              ? 'bg-marker text-ink'
              : 'text-ink-600 hover:bg-paper-200 dark:text-chalk-600 dark:hover:bg-night-600'
          "
          @mousedown.prevent="add(option.value)"
          @mousemove="highlighted = i"
        >
          <template v-if="option.kind === 'tag'">
            <span class="font-mono text-xs">{{ prefix }}{{ option.value }}</span>
          </template>
          <template v-else>
            <span class="text-cyan">+ create</span>
            <span class="font-mono text-xs">{{ prefix }}{{ option.value }}</span>
          </template>
        </button>
      </li>
    </ul>
  </div>
</template>
