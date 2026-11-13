<template>
  <q-td :props="props.props">
    <q-icon
      size="sm"
      class="cursor-help"
      :name="props.isUnlinked ? 'link_off' : 'link'"
      :color="props.isUnlinked ? 'negative' : 'positive'"
      :aria-label="props.isUnlinked ? 'Sem vínculo' : 'Com vínculo'"
    >
      <q-tooltip>
        <div class="text-weight-medium q-mb-xs">Vinculações</div>
        <div v-for="link in props.links" :key="link.label">
          {{ link.label }}: {{ link.value }}
        </div>
      </q-tooltip>
    </q-icon>
  </q-td>
</template>

<script setup lang="ts">
interface ILinkCount {
  label: string
  value: number
}

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: any
  isUnlinked: boolean
  links: ILinkCount[]
}>()
</script>
