<template>
  <q-chip
    removable
    dense
    @remove="scope.removeAtIndex(scope.index)"
    :tabindex="scope.tabindex"
    color="primary"
  >
    {{ scope.opt[label || 'name'] }}
  </q-chip>
</template>
<script setup lang="ts">
interface IProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scope: any
  label?: string
}
defineProps<IProps>()
</script>
