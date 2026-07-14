<script setup lang="ts">
import { nodeViewProps, NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3'
import UiChip from '../../UiChip/UiChip.vue'

const props = defineProps(nodeViewProps)
</script>

<template>
  <NodeViewWrapper as="span" class="inline-block">
    <UiChip
      :variant="props.node.attrs.variant"
      :stroke="props.node.attrs.stroke"
      :color="props.node.attrs.color"
    >
      <NodeViewContent as="span" />
    </UiChip>
  </NodeViewWrapper>
</template>
