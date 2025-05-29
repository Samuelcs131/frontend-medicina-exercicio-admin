<template>
  <q-dialog
    :model-value="dialogIsOpen(dialogId)"
    transition-show="scale"
    transition-hide="scale"
    persistent
  >
    <slot name="default"></slot>
  </q-dialog>
</template>
<script setup lang="ts">
import { useDialog } from 'src/composables/useDialog'
import { onMounted } from 'vue'

interface IProps {
  dialogId: string
}

const props = defineProps<IProps>()

const { dialogIsOpen, createDialog } = useDialog()

onMounted(() => createDialog([props.dialogId]))
</script>
