<template>
  <q-dialog
    :model-value="dialogIsOpen(Dialog.viewPost)"
    transition-show="scale"
    transition-hide="scale"
    persistent
  >
    <q-card
      :style="{ maxWidth: `${maxWidthContent + 34}px`, width: '100%' }"
      class="shadow-0 full-width"
      bordered
    >
      <q-card-section>
        <q-scroll-area
          :style="{ height: '800px', maxWidth: `${maxWidthContent + 24}px` }"
        >
          <template v-for="(content, idx) in state.form.postItems" :key="idx">
            <div
              class="tiptap ProseMirror"
              v-if="content.postTypeContent === PostTypeContent.html"
              v-html="content.contentHTML"
            ></div>
          </template>
        </q-scroll-area>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn
          color="default"
          flat
          label="Cancelar"
          @click="toggleDialog(Dialog.viewPost)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { usePostEditPage } from '../usePostEditPage'
import { maxWidthContent } from '../editor.const'
import { PostTypeContent } from 'src/enums/post/PostTypeContent.enum'
const { state, Dialog, dialogIsOpen, toggleDialog } = usePostEditPage()
</script>
