<script setup lang="ts">
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import UiPin from '../../UiPin/UiPin.vue'

const props = defineProps(nodeViewProps)
</script>

<template>
  <NodeViewWrapper as="span" class="inline-block align-middle">
    <UiPin :color="props.node.attrs.color" :size="props.node.attrs.size" />
  </NodeViewWrapper>
</template>
