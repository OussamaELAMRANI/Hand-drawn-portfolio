<script setup lang="ts">
// rendered by nuxt-og-image's takumi pipeline — flexbox + inline styles
// only, no CSS grid/gap shorthand, matching the brand used in the booking
// email templates (server/utils/emailTemplates.ts)
withDefaults(
  defineProps<{
    title?: string
    description?: string
  }>(),
  {
    title: 'Oussama EL AMRANI',
    description: 'Senior Full-Stack Engineer',
  },
)
</script>

<template>
  <div
    style="
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 1200px;
      height: 600px;
      padding: 70px 80px;
      background-color: #fdfdfd;
      font-family: sans-serif;
    "
  >
    <div style="display: flex; font-size: 34px; font-weight: 700; color: #2a2a2a;">
      <span>Oussama</span>
      <span style="color: #0e93a8;">. EL AMRANI</span>
    </div>

    <div style="display: flex; flex-direction: column; max-width: 950px;">
      <div style="display: flex; font-size: 58px; font-weight: 700; line-height: 1.15; color: #2a2a2a;">
        {{ title }}
      </div>
      <div style="display: flex; margin-top: 24px; font-size: 28px; line-height: 1.5; color: #6a6a60;">
        {{ description }}
      </div>
    </div>
  </div>
</template>
