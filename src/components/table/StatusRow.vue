<template>
  <q-td :props="props.props">
    <q-badge :color="statusBadge.color" :label="statusBadge.name" />
  </q-td>
</template>
<script setup lang="ts">
import { statusDictionary } from 'src/constants/status.const'
import type { Status } from 'src/enums/Status.enum'
import { computed } from 'vue'

interface IProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: any
}

const props = defineProps<IProps>()

const statusBadge = computed(() => {
  const status = props.props?.row?.status as Status | undefined
  return statusDictionary[status as Status] ?? { name: 'Indefinido', color: 'grey' }
})
</script>
