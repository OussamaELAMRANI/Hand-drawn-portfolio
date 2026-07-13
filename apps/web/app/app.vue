<script setup lang="ts">
import { DarkModeToggle } from '@larevo/ui'
</script>
<template>
  <div
    class="min-h-screen bg-paper font-sans text-ink antialiased
           [background-image:radial-gradient(#dcdcd4_1.1px,transparent_1.1px)] [background-size:23px_23px]
           dark:bg-night dark:text-chalk dark:[background-image:radial-gradient(#2c2f37_1.1px,transparent_1.1px)]"
  >
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <DarkModeToggle />
  </div>
</template>