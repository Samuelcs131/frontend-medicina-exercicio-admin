<template>
  <div class="flex gap-sm">
    <slot name="after" />

    <q-btn
      icon="add"
      :label="labelNewEntity"
      color="primary"
      unelevated
      split
      :disable="loaderStatus(loaderId)"
      @click="emit('openEditDialog')"
    />

    <q-btn-dropdown
      v-if="!hideActions"
      color="blue-grey-6"
      label="Ações"
      content-class="q-card--bordered shadow-0"
      unelevated
      :disable="loaderStatus(loaderId)"
    >
      <q-list>
        <q-item
          :disable="hasActive"
          class="text-red"
          clickable
          v-close-popup
          @click="emit('openActionDialog', ActionDialogOptions.delete)"
        >
          <q-item-section>
            <q-item-label> Deletar </q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          :disable="hasActive"
          clickable
          v-close-popup
          @click="emit('openActionDialog', ActionDialogOptions.disable)"
        >
          <q-item-section>
            <q-item-label> Desabilitar </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>

    <slot name="before" />
  </div>
</template>
<script setup lang="ts">
import { useLoader } from 'src/composables/useLoader'
import { ActionDialogOptions } from 'src/enums/ActionDialogOptions.enum'

interface IProps {
  loaderId: string
  hasActive: boolean
  labelNewEntity: string
  hideActions?: boolean
}

defineProps<IProps>()
const emit = defineEmits(['openEditDialog', 'openActionDialog'])

const { loaderStatus } = useLoader()
</script>
