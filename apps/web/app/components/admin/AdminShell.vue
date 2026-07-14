<script setup lang="ts">
defineProps<{ title: string; subtitle?: string }>()

const { user, logout } = useAuth()
const { message } = useAdminToast()
const route = useRoute()

const nav = [
  { label: 'Dashboard', to: '/admin', dot: '#2A2A2A', dotDark: '#e9e9e1', exact: true },
  { label: 'Overview', to: '/admin/overview', dot: '#0E93A8', dotDark: '#0E93A8' },
  { label: 'Posts', to: '/admin/posts', dot: '#C0577F', dotDark: '#C0577F' },
  { label: 'Tags', to: '/admin/tags', dot: '#C98A2B', dotDark: '#C98A2B' },
  { label: 'Experiences', to: '/admin/experiences', dot: '#8A6BCF', dotDark: '#8A6BCF' },
]

const isActive = (item: (typeof nav)[number]) =>
  item.exact ? route.path === item.to : route.path.startsWith(item.to)
</script>

<template>
  <div class="grid min-h-screen grid-cols-[236px_1fr]">
    <aside
      class="sticky top-0 flex h-screen flex-col border-r-2 border-dashed border-ink-200 bg-white
             px-[18px] py-[22px] dark:border-night-500 dark:bg-night-800"
    >
      <div class="font-display text-3xl font-bold leading-none">
        Oussama<span class="text-cyan">.el</span>
      </div>
      <div class="mb-[18px] font-hand text-sm text-ink-400 dark:text-chalk-400">admin studio</div>

      <nav class="flex flex-col gap-1.5">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-2.5 rounded-[9px] px-3 py-2.5 font-hand text-[17px]
                 transition-colors duration-150"
          :class="
            isActive(item)
              ? 'bg-marker text-ink -rotate-[0.6deg]'
              : 'hover:bg-paper-200 dark:hover:bg-night-600'
          "
        >
          <span
            class="inline-block h-[9px] w-[9px] rounded-[2px]"
            :class="isActive(item) ? '' : 'dark:hidden'"
            :style="{ backgroundColor: item.dot }"
          />
          <span
            v-if="!isActive(item)"
            class="hidden h-[9px] w-[9px] rounded-[2px] dark:inline-block"
            :style="{ backgroundColor: item.dotDark }"
          />
          <span>{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <div class="mt-auto flex flex-col gap-2">
        <NuxtLink
          to="/"
          class="font-hand text-[15px] text-cyan underline decoration-wavy underline-offset-[3px]"
        >
          ↗ view live site
        </NuxtLink>
        <div class="truncate font-mono text-[10px] text-ink-300 dark:text-chalk-400">
          {{ user?.email }}
        </div>
        <button
          class="cursor-pointer text-left font-hand text-[15px] text-ink-400 transition-colors
                 hover:text-magenta dark:text-chalk-500"
          @click="logout()"
        >
          log out
        </button>
      </div>
    </aside>

    <main class="w-full max-w-[1080px] px-[34px] pb-16 pt-[26px]">
      <div class="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 class="font-display text-[44px] font-bold leading-none">{{ title }}</h1>
          <div v-if="subtitle" class="mt-1 font-hand text-base text-ink-400 dark:text-chalk-400">
            {{ subtitle }}
          </div>
        </div>
        <slot name="action" />
      </div>
      <slot />
    </main>

    <Transition
      enter-active-class="transition duration-150"
      enter-from-class="translate-y-3 opacity-0"
      leave-active-class="transition duration-150"
      leave-to-class="translate-y-3 opacity-0"
    >
      <div
        v-if="message"
        class="fixed bottom-[26px] left-1/2 z-[120] -translate-x-1/2 -rotate-1 rounded-lg bg-ink
               px-[22px] py-[11px] font-hand text-base text-paper
               shadow-[4px_5px_0_rgba(42,42,42,0.2)] dark:bg-chalk dark:text-night"
      >
        {{ message }}
      </div>
    </Transition>
  </div>
</template>
