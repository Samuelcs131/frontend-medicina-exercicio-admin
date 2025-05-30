<template>
  <q-dialog
    :model-value="dialogIsOpen(Dialog.editPostImage)"
    transition-show="scale"
    transition-hide="scale"
    persistent
  >
    <q-card class="shadow-0 full-width" bordered style="max-width: 500px">
      <q-form @submit="pushImage">
        <q-tabs
          v-model="state.imagePostDialog.step"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <!-- <q-tab name="url" label="URL" /> -->
          <q-tab name="upload" label="Upload" />
        </q-tabs>

        <q-separator />

        <q-tab-panels
          v-model="state.imagePostDialog.step"
          animated
          @transition="clearImageInput"
        >
          <!-- <q-tab-panel name="url">
          <q-input
            v-model="state.imagePostDialog.url"
            outlined
            label="URL"
            dense
          />
        </q-tab-panel> -->

          <q-tab-panel name="upload">
            <q-uploader
              ref="uploadInput"
              class="full-width"
              bordered
              flat
              hide-upload-btn
              v-model="state.imagePostDialog.file"
              @added="handleSetFile"
              @removed="handleRemoveFile"
              label="Imagem"
              accept=".jpeg, .png, .jpg , .webp"
            />
            <p>
              O arquivo não pode ultrapassar 1 mega, formatos aceitos .jpeg,
              .png, .jpg, .webp
            </p>
          </q-tab-panel>
        </q-tab-panels>
        <q-card-section class="q-col-gutter-md">
          <q-input
            class="full-width"
            v-model="state.imagePostDialog.alt"
            outlined
            label="Descrição"
            dense
            :rules="[requiredRule]"
          />

          <q-input
            v-if="!hiddenSize"
            class="full-width"
            v-model="state.imagePostDialog.width"
            outlined
            type="number"
            label="Largura"
            :max="maxWidthContent"
            min="50"
            dense
            readonly
          />

          <q-input
            v-if="!hiddenSize"
            class="full-width"
            v-model="state.imagePostDialog.height"
            outlined
            type="number"
            label="Altura"
            :max="maxWidthContent"
            min="50"
            dense
            readonly
          />
        </q-card-section>
        <q-separator />

        <q-card-section align="right" class="q-gutter-md">
          <q-btn
            label="Cancelar"
            color="accent"
            flat
            @click="toggleDialog(Dialog.editPostImage)"
          />
          <q-btn
            label="Salvar"
            color="primary"
            type="submit"
            :disabled="
              !state.imagePostDialog.url && !state.imagePostDialog.file
            "
          />
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { maxWidthContent } from 'src/pages/post-edit/editor.const'
import { usePostEditPage } from '../../../usePostEditPage'
import { requiredRule } from 'src/validations/form-rules/mixedRules.util'
import { ref } from 'vue'
import { QUploader } from 'quasar'

interface IProps {
  hiddenSize?: boolean
}

defineProps<IProps>()

const uploadInput = ref<QUploader | null>(null)

const {
  state,
  Dialog,
  dialogIsOpen,
  handleRemoveFile,
  clearImageInput,
  toggleDialog,
} = usePostEditPage()

const emit = defineEmits(['image'])

function handleSetFile(files: readonly File[]) {
  const [file] = files
  const maxSizeInBytes = 1 * 1024 * 1024

  if (!file) return

  if (file.size > maxSizeInBytes) {
    state.value.imagePostDialog.file = null
    uploadInput.value?.reset()

    window.alert('O arquivo possui mais que 1 mega')
  } else {
    state.value.imagePostDialog.file = file
  }
}

function pushImage() {
  const { url, alt, file, width, height } = state.value.imagePostDialog

  if (state.value.imagePostDialog.step == 'url') {
    emit('image', { url, alt, width, height })
  } else {
    emit('image', { file, url, alt, width, height })
  }

  toggleDialog(Dialog.editPostImage)
}
</script>
