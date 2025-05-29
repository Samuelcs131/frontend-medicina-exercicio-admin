<template>
  <div class="flex gap-md no-wrap items-start">
    <q-input
      v-bind="$vInput"
      v-model="coord.lat"
      label="Latitude"
      step="0.000001"
      hint="Ex: -23.550520"
      class="full-width"
      @update:model-value="updateCoordinates"
      :rules="[requiredRule]"
    />

    <q-input
      v-bind="$vInput"
      v-model="coord.lng"
      label="Longitude"
      step="0.000001"
      hint="Ex: -46.633308"
      class="full-width"
      @update:model-value="updateCoordinates"
      :rules="[requiredRule]"
    />

    <q-btn
      style="flex-shrink: 0"
      icon="map"
      flat
      @click="openGoogleMaps(street)"
    >
      <q-tooltip>Google Maps</q-tooltip>
    </q-btn>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { requiredRule } from 'src/validations/form-rules/mixedRules.util'

interface IProps {
  modelValue: number[]
  street: string
}

const props = defineProps<IProps>()

const emit = defineEmits(['update:modelValue'])

const coord = ref<{
  lat: number
  lng: number
}>({
  lat: props.modelValue[0] || 0,
  lng: props.modelValue[1] || 0,
})

const updateCoordinates = () => {
  emit('update:modelValue', coord.value)
}

function openGoogleMaps(street: string) {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(street)}`
  window.open(url, '_blank')
}
</script>
