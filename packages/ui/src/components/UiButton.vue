<script lang="ts">
export type ButtonVariant = 'primary' | 'ghost'
</script>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant
    disabled?: boolean
  }>(),
  { variant: 'primary', disabled: false },
)

const emit = defineEmits<{ click: [event: MouseEvent] }>()

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-zinc-900 text-white hover:bg-zinc-700',
  ghost: 'bg-transparent text-zinc-900 hover:bg-zinc-100',
}
</script>

<template>
  <button
    type="button"
    class="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50"
    :class="variantClasses[props.variant]"
    :disabled="props.disabled"
    @click="emit('click', $event)"
  >
    <slot />
  </button>
</template>
