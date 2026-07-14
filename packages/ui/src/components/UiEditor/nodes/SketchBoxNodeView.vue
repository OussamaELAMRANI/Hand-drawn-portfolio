<script setup lang="ts">
import { nodeViewProps, NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3'
import SketchBox from '../../SketchBox/SketchBox.vue'

const props = defineProps(nodeViewProps)
</script>

<template>
  <NodeViewWrapper as="div" class="my-2">
    <SketchBox
      :color="props.node.attrs.color"
      :shape="props.node.attrs.shape"
      :stroke-width="1.6"
      class="p-4"
    >
      <NodeViewContent />
    </SketchBox>
  </NodeViewWrapper>
</template>
