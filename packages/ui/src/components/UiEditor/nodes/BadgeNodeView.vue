<script setup lang="ts">
import { nodeViewProps, NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3'
import UiBadge from '../../UiBadge/UiBadge.vue'

const props = defineProps(nodeViewProps)
</script>

<template>
  <NodeViewWrapper as="span" class="inline-block">
    <UiBadge :variant="props.node.attrs.variant">
      <NodeViewContent as="span" />
    </UiBadge>
  </NodeViewWrapper>
</template>
