<script setup lang="ts">
import { nodeViewProps, NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3'
import UiPill from '../../UiPill/UiPill.vue'

const props = defineProps(nodeViewProps)
</script>

<template>
  <NodeViewWrapper as="span" class="inline-block">
    <UiPill :active="props.node.attrs.active">
      <NodeViewContent as="span" />
    </UiPill>
  </NodeViewWrapper>
</template>
