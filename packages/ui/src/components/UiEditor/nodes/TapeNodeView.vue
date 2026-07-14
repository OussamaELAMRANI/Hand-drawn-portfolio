<script setup lang="ts">
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import UiTape from '../../UiTape/UiTape.vue'

const props = defineProps(nodeViewProps)
</script>

<template>
  <NodeViewWrapper as="span" class="inline-block align-middle">
    <UiTape
      :width="props.node.attrs.width"
      :height="props.node.attrs.height"
      :angle="props.node.attrs.angle"
    />
  </NodeViewWrapper>
</template>
