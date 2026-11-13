<template>
  <q-input
    v-bind="$vInput"
    v-model="display"
    :mask="isTelephone ? '(##) ####-####' : '(##) #####-####'"
    unmasked-value
    type="text"
    :rules="[validateTelephone]"
    @update:model-value="onInput"
    style="min-width: 200px"
  >
    <template v-slot:after>
      <q-btn
        unelevated
        outline
        :icon="isTelephone ? 'call' : 'smartphone'"
        @click="isTelephone = !isTelephone"
      >
        <q-tooltip>Formato contato</q-tooltip>
      </q-btn>
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const emit = defineEmits(['update:modelValue'])
const props = defineProps<{
  modelValue: string | null
}>()

const display = ref('')
const isTelephone = ref(false)

function validateTelephone(telephone: string) {
  return isTelephone.value
    ? telephone.length === 10 || 'Numero de telefone invalido'
    : telephone.length === 11 || 'Numero de celular invalido'
}

function onInput(v: string | number | null) {
  emit('update:modelValue', v == null ? '' : String(v))
}

watch(
  () => props.modelValue,
  (value) => {
    const normalizedValue = value ?? ''

    // O q-input atualiza `display` antes de emitir o valor para o componente
    // pai. Nesse caso, preserva o tipo atual para que o 10º dígito de um
    // celular não altere a máscara antes da entrada do 11º dígito.
    if (normalizedValue === display.value) return

    display.value = normalizedValue
    isTelephone.value = normalizedValue.length === 10
  },
  { immediate: true },
)
</script>
