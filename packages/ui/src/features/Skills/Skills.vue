<script setup lang="ts">
import type { SkillsProps } from './Skills.types'
import UiChip from '#components/UiChip/UiChip.vue'
import Typography from '#components/Typography/Typography.vue'

withDefaults(defineProps<SkillsProps>(), {
  skills: () => [
    'TypeScript',
    'Node.js',
    'JavaScript',
    'React',
    'Vue.js',
    'Next.js',
    'Nuxt.js',
    'PHP',
    'Symfony',
    'Laravel',
    'PostgreSQL',
    'MySQL',
    'Redis',
    'DDD',
    'Vitest',
    'Vite',
    'AWS',
    'Vercel',
    'JSNAD',
    'JSNSD',
  ],
  label: 'stack:',
  colored: true,
})
</script>

<template>
  <section class="mx-auto max-w-[1120px] px-6 pb-10 pt-3">
    <div class="flex flex-wrap items-center gap-x-3 gap-y-2.5">
      <Typography v-if="label" variant="lead" class="text-ink-400 dark:text-chalk-500">
        {{ label }}
      </Typography>
      <UiChip
        v-for="skill in skills"
        :key="skill"
        variant="sketch"
        :stroke="colored ? undefined : 'gray'"
      >
        {{ skill }}
      </UiChip>
    </div>
  </section>
</template>
