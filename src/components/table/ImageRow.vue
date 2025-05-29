<template>
  <q-td :props="props">
    <div class="overflow-hidden">
      <q-img :src="props.row[label]" fit="contain" width="50px" height="50px" />
    </div>
  </q-td>
</template>
<script setup lang="ts">
interface IProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: any
  label: string
}

defineProps<IProps>()
</script>
