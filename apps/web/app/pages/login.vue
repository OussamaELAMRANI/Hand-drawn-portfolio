<script setup lang="ts">
import { SketchBox, UiButton, UiInput } from '@larevo/ui'

const { login } = useAuth()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  if (loading.value) return
  error.value = ''
  loading.value = true
  try {
    await login(email.value, password.value)
    await navigateTo('/admin')
  } catch (e) {
    error.value =
      (e as { data?: { statusMessage?: string } }).data?.statusMessage ?? 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center px-4">
    <SketchBox
      :stroke-width="2"
      class="w-full max-w-md -rotate-[0.4deg] bg-white p-8 shadow-lifted dark:bg-night-800"
    >
      <h1 class="font-display text-4xl font-bold leading-none">Sign in</h1>
      <p class="mb-6 mt-1 font-hand text-base text-ink-400 dark:text-chalk-400">
        the admin studio door
      </p>

      <form class="flex flex-col gap-4" @submit.prevent="submit">
        <label>
          <span class="mb-1 block font-hand text-[15px] text-ink-600 dark:text-chalk-600">
            Email
          </span>
          <UiInput v-model="email" type="email" placeholder="you@example.com" />
        </label>
        <label>
          <span class="mb-1 block font-hand text-[15px] text-ink-600 dark:text-chalk-600">
            Password
          </span>
          <UiInput v-model="password" type="password" placeholder="••••••••" />
        </label>

        <p v-if="error" class="font-hand text-[15px] text-magenta">{{ error }}</p>

        <div class="mt-2 flex items-center justify-between">
          <NuxtLink
            to="/"
            class="font-hand text-[15px] text-cyan underline decoration-wavy underline-offset-[3px]"
          >
            ← back to site
          </NuxtLink>
          <UiButton :disabled="loading" @click="submit">
            {{ loading ? 'signing in…' : 'Sign in' }}
          </UiButton>
        </div>
        <!-- hidden submit so Enter submits the form -->
        <button type="submit" class="hidden" aria-hidden="true" tabindex="-1" />
      </form>
    </SketchBox>
  </div>
</template>
