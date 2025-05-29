<template>
  <q-dialog
    :model-value="dialogIsOpen(dialogId)"
    transition-show="scale"
    transition-hide="scale"
    persistent
    @before-hide="emit('clearDialog')"
  >
    <q-card style="width: 500px" class="shadow-0" bordered>
      <q-card-section class="q-pb-none">
        <h6 class="text-h6 q-my-none">
          {{ actionOptions[actionType].name }} {{ title }}
        </h6>
      </q-card-section>

      <q-card-section>
        <p class="text-body">
          Tem certeza que deseja
          {{ actionOptions[actionType].name.toLowerCase() }} {{ prefix }}
          {{ title }}
          <b> {{ nameItems.join(', ') }} </b>?
        </p>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn
          color="default"
          flat
          label="Cancelar"
          @click="toggleDialog(dialogId)"
          :disable="loaderStatus(loaderActionId)"
        />
        <q-btn
          :color="actionOptions[actionType].color"
          :label="actionOptions[actionType].name"
          unelevated
          @click="emit('confirmAction')"
          :loading="loaderStatus(loaderActionId)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { useDialog } from 'src/composables/useDialog'
import { useLoader } from 'src/composables/useLoader'
import { ActionDialogOptions } from 'src/enums/ActionDialogOptions.enum'

interface IProps {
  dialogId: string
  loaderActionId: string
  actionType: ActionDialogOptions
  prefix: string
  title: string
  nameItems: string[]
}

const props = defineProps<IProps>()

const { loaderStatus } = useLoader()
const { dialogIsOpen, toggleDialog, createDialog } = useDialog()

const emit = defineEmits(['confirmAction', 'clearDialog'])

const actionOptions = {
  [ActionDialogOptions.delete]: {
    name: 'Deletar',
    color: 'negative',
  },
  [ActionDialogOptions.disable]: {
    name: 'Desativar',
    color: 'primary',
  },
  [ActionDialogOptions.pause]: {
    name: 'Pausar',
    color: 'primary',
  },
  [ActionDialogOptions.play]: {
    name: 'Retomar',
    color: 'primary',
  },
  [ActionDialogOptions.cancel]: {
    name: 'Cancelar',
    color: 'primary',
  },
}

createDialog([props.dialogId])
</script>
