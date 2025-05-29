<template>
  <q-td :props="props">
    <q-badge
      :color="statusDictionary[props.row.status as Status].color"
      :label="statusDictionary[props.row.status as Status].name"
    />
  </q-td>
</template>
<script setup lang="ts">
import { statusDictionary } from 'src/constants/status.const'
import type { Status } from 'src/enums/Status.enum'

interface IProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: any
}

defineProps<IProps>()
</script>
