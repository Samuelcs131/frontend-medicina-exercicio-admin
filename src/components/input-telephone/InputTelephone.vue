<template>
  <q-input
    v-bind="$vInput"
    v-model="display"
    :mask="isTelephone ? '(##) ####-####' : '(##) #####-####'"
    unmasked-value
    type="text"
    :rules="[validateTelephone]"
    @update:model-value="onInput"
  >
    <template v-slot:after>
      <q-btn
        unelevated
        outline
        :icon="isTelephone ? 'call' : 'smartphone'"
        @click="isTelephone = !isTelephone"
      >
        <q-tooltip>{{ 'Formato contato' }}</q-tooltip>
      </q-btn>
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const emit = defineEmits(['update:modelValue'])
const props = defineProps<{
  modelValue: string | null
}>()

const display = ref('')
const isTelephone = ref(false)

function validateTelephone(telephone: string) {
  return isTelephone.value
    ? telephone.length === 10 || 'Número de telefone inválido'
    : telephone.length === 11 || 'Número de celular inválido'
}

function onInput(v: string | number | null) {
  emit('update:modelValue', v)
}

onMounted(() => {
  if (props.modelValue) {
    display.value = props.modelValue
    isTelephone.value = props.modelValue.length === 10
  }
})
</script>
