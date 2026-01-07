<template>
  <node-view-wrapper v-bind="attrs">
    <NodeViewContent as="details" />

    <q-menu class="shadow-0" touch-position context-menu>
      <q-card class="shadow-0" bordered>
        <q-card-section class="q-py-sm">
          <div style="font-size: 10px">Accordion</div>
        </q-card-section>
        <q-separator></q-separator>
        <q-list dense style="min-width: 100px">
          <q-item clickable v-close-popup @click="props.deleteNode()">
            <q-item-section>Deletar</q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </q-menu>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'

const props = defineProps(nodeViewProps)
const attrs = computed(() => ({
  open: props.node.attrs.open ? '' : undefined,
}))
</script>
