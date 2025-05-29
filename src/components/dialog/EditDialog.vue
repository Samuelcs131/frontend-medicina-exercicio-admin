<template>
  <q-dialog
    @before-hide="emit('clearEditDialog')"
    :model-value="dialogIsOpen(dialogId)"
    transition-show="scale"
    transition-hide="scale"
    persistent
  >
    <q-card :style="{ maxWidth }" class="shadow-0 full-width" bordered>
      <q-form @submit="emit('submit')">
        <q-card-section class="q-pb-none">
          <h6 class="text-h6 q-my-none">
            {{ isEdit ? 'Editar' : 'Criar' }} {{ name }}
          </h6>
        </q-card-section>

        <slot name="content"></slot>

        <q-separator />

        <q-card-actions align="right">
          <q-btn
            color="default"
            flat
            label="Cancelar"
            @click="toggleDialog(dialogId)"
            :disable="loaderStatus(loaderId)"
          />
          <q-btn
            color="primary"
            label="Salvar"
            unelevated
            type="submit"
            :disable="disableSave"
            :loading="loaderStatus(loaderId)"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { useDialog } from 'src/composables/useDialog'
import { useLoader } from 'src/composables/useLoader'
import { onMounted } from 'vue'

interface IProps {
  dialogId: string
  loaderId: string
  name: string
  isEdit: boolean
  disableSave: boolean
  maxWidth: string
}

const props = defineProps<IProps>()
const emit = defineEmits(['clearEditDialog', 'submit'])

const { dialogIsOpen, toggleDialog, createDialog } = useDialog()
const { loaderStatus } = useLoader()

onMounted(() => createDialog([props.dialogId]))
</script>
