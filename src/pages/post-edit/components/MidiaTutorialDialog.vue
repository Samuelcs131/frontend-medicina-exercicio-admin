<template>
  <q-dialog
    :model-value="dialogIsOpen(Dialog.midiaTutorial)"
    transition-show="scale"
    transition-hide="scale"
    persistent
  >
    <q-card class="shadow-0 full-width" bordered>
      <q-card-section class="q-pb-none">
        <h6 class="text-h6 q-my-none">Como adicionar uma mídia</h6>
      </q-card-section>

      <q-card-section>
        <p>1. clique em compartilhar, no botão abaixo do video</p>
        <p>2. clique em incorporar</p>
        <p>3. copie somente a URL do video, que está dentro das aspas src e cole no campo de midia</p>
        <img :src="ExampleYoutube" class="full-width"/>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          color="default"
          flat
          label="Cancelar"
          @click="toggleDialog(Dialog.midiaTutorial)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { usePostEditPage } from '../usePostEditPage'
import ExampleYoutube from 'assets/img/example-youtube.jpg'
const { toggleDialog, Dialog, dialogIsOpen } = usePostEditPage()
</script>
