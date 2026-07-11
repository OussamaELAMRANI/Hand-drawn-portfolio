<script setup lang="ts">
import { SketchBox, UiButton, UiLink } from '@larevo/ui'
</script>
<template>
  <div>
    <div class="flex flex-col gap-8 p-10">
      <UiLink href="/design-system">→ design system</UiLink>

      <!-- The inspiration look: sketch variant, zigzag scribble, fade reveal -->
      <div class="flex flex-wrap items-center gap-6">
        <UiButton href="/work">See my work →</UiButton>
        <UiButton variant="sketch" shape="ellipse">About me</UiButton>
        <UiButton variant="sketch" shape="pill">Contact</UiButton>
      </div>

      <!-- Design-system variants -->
      <div class="flex flex-wrap items-center gap-6">
        <UiButton variant="primary" @click="() => console.log('save')">Save changes</UiButton>
        <UiButton variant="secondary" shape="pill">Cancel</UiButton>
        <UiButton variant="danger" fill-style="cross-hatch">Delete</UiButton>
        <UiButton variant="ghost" shape="ellipse">More info</UiButton>
      </div>

      <!-- Sweep reveal (our angled window) vs fade -->
      <div class="flex flex-wrap items-center gap-6">
        <UiButton variant="primary" reveal="sweep" :hachure-angle="60">Sweep 60°</UiButton>
        <UiButton variant="danger" reveal="sweep" :hachure-angle="0" fill-style="hachure"
          >Sweep 0°</UiButton
        >
        <UiButton variant="sketch" reveal="fade">Fade (default)</UiButton>
        <UiButton variant="primary" disabled>Disabled</UiButton>
      </div>
    </div>

    <SketchBox>
      <p class="p-6">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad consectetur doloremque eligendi
        harum ipsam ipsum laudantium nesciunt reiciendis repellendus tempore. Accusantium aperiam
        commodi ex explicabo fugit ipsum sapiente, similique veritatis.
      </p>
    </SketchBox>
  </div>
</template>