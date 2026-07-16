<script setup lang="ts">
import { DarkModeToggle } from '@larevo/ui'

// sitewide identity — the Footer's default X/Twitter link is a placeholder
// (`href: '#'`), not a real URL, so it's excluded here rather than emitting
// invalid sameAs data
useSchemaOrg([
  definePerson({
    name: 'Oussama EL AMRANI',
    jobTitle: 'Senior Full-Stack Engineer',
    url: 'https://oussama.work',
    sameAs: [
      'https://github.com/OussamaELAMRANI/',
      'https://www.linkedin.com/in/oussama-elamrani/',
    ],
  }),
  defineWebSite({ name: 'Oussama EL AMRANI — Portfolio' }),
])
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