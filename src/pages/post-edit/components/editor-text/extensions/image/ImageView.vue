<template>
  <node-view-wrapper as="span" :class="imageViewClass">
    <div
    :class="{
      'image-view__body--focused': selected,
    }"
      class="image-view__body"
    >
      <img
        :src="src"
        :title="node!.attrs.title"
        :alt="node!.attrs.alt"
        :width="width"
        :height="height"
        class="image-view__body__image"
        @click="selectImage"
      >
      <q-menu class="shadow-0" v-if="selected">
        <q-card class="shadow-0" bordered>
          <q-btn
            flat
            :color="isActiveButton(ImageDisplay.INLINE)"
            :icon="mdiFormatFloatNone"
            @click="updateAttributes!({ display: ImageDisplay.INLINE })"
            >
            <q-tooltip>Inline</q-tooltip>
          </q-btn>
          <q-btn
            flat
            :color="isActiveButton(ImageDisplay.BREAK_TEXT)"
            :icon="mdiFormatFloatCenter"
            @click="updateAttributes!({ display: ImageDisplay.BREAK_TEXT })">
            <q-tooltip>Quebrar texto</q-tooltip>
          </q-btn>
          <q-btn
            flat
            :color="isActiveButton(ImageDisplay.FLOAT_LEFT)"
            :icon="mdiFormatFloatLeft"
            @click="updateAttributes!({ display: ImageDisplay.FLOAT_LEFT })">
          <q-tooltip>Flutuar à esquerda</q-tooltip>
        </q-btn>
        <q-btn
            flat
            :color="isActiveButton(ImageDisplay.FLOAT_RIGHT)"
            :icon="mdiFormatFloatRight"
            @click="updateAttributes!({ display: ImageDisplay.FLOAT_RIGHT })">
            <q-tooltip>Flutuar para a direita</q-tooltip>
          </q-btn>
        </q-card>
      </q-menu>
    </div>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import { resolveImg, ImageDisplay } from './utils/image'
import {
  mdiFormatFloatLeft,
  mdiFormatFloatNone,
  mdiFormatFloatCenter,
  mdiFormatFloatRight,
 } from '@quasar/extras/mdi-v7'

const MIN_SIZE = 20

const props = defineProps(nodeViewProps)

const originalSize = ref({
  width: 0,
  height: 0,
})

const src = computed(() => props.node.attrs.src)
const width = computed(() => props.node.attrs.width)
const height = computed(() => props.node.attrs.height)
const display = computed(() => props.node.attrs.display)

const imageViewClass = computed(() => ['image-view', `image-view--${display.value}`])

function isActiveButton(option: string){
  return display.value === option ? 'primary' : undefined
}

async function fetchImage() {
  const result = await resolveImg(src.value)
  if (!result.complete) {
    result.width = MIN_SIZE
    result.height = MIN_SIZE
  }
  originalSize.value.width = result.width
  originalSize.value.height = result.height
}

onMounted(async () => {
  await fetchImage()
})

function selectImage() {
  props.editor?.commands.setNodeSelection(props.getPos())
}
</script>
<style lang="scss">
.tiptap {
  .image-view {
     display: inline-block;
     float: none;
     line-height: 0;
     margin: 12px 0;
     max-width: 100%;
     user-select: none;
     vertical-align: baseline;
   }

   .image-view--inline {
     margin-left: 12px;
     margin-right: 12px;
   }

   .image-view--block {
     display: block;
   }

   .image-view--left {
     float: left;
     margin-left: 0;
     margin-right: 12px;
   }

   .image-view--right {
     float: right;
     margin-left: 12px;
     margin-right: 0;
   }

   .image-view__body {
     clear: both;
     display: inline-block;
     max-width: 100%;
     outline-color: transparent;
     outline-style: solid;
     outline-width: 2px;
     -webkit-transition: all 0.2s ease-in;
     transition: all 0.2s ease-in;
     position: relative;
   }

   .image-view__body:hover {
     outline-color: $primary;
   }

   .image-view__body--focused:hover {
     outline-color: $primary;
     outline-color: transparent;
   }

   .image-view__body__placeholder {
     height: 100%;
     left: 0;
     position: absolute;
     top: 0;
     width: 100%;
     z-index: -1;
   }

   .image-view__body__image {
     cursor: pointer;
     margin: 0;
   }
}
</style>
