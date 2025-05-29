<template>
  <q-input
    v-model="dateValue"
    outlined
    @update:model-value="emitDateValue"
    :mask="propsCurrent.maskInput"
    :rules="
      ruleActive ? [(v: string) => requiredDate(handleValueDate(v) as string)] : []
    "
  >
    <template #append>
      <q-icon name="event" class="cursor-pointer q-ml-sm">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale" class="shadow-0">
          <q-date
            bordered
            v-model="dateValue"
            @update:model-value="emitDateValue"
            today-btn
            :mask="propsCurrent.maskDate"
            :locale="dateLocale"
            minimal
          >
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Fechar" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
      <q-icon name="access_time" class="cursor-pointer q-ml-sm">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale" class="shadow-0">
          <q-time
            v-model="dateValue"
            format24h
            now-btn
            bordered
            @update:model-value="emitDateValue"
            :mask="propsCurrent.maskDate"
          >
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Fechar" color="primary" flat />
            </div>
          </q-time>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script lang="ts" setup>
import { formatDate, parsePtBrToISO } from 'src/utils/date.util'
import { ref, onMounted, watch } from 'vue'
import { dateLocale } from 'src/constants/date/dateLocale.const'
import { requiredDate } from 'src/validations/form-rules/dateRules.util'

interface IProps {
  modelValue?: string | null
  maskInput?: string
  maskDate?: string
  ruleActive?: boolean
}

const props = defineProps<IProps>()
const propsCurrent = {
  maskInput: !props.maskInput ? '##/##/#### ##:##' : props.maskInput,
  maskDate: !props.maskDate ? 'DD/MM/YYYY HH:mm' : props.maskDate,
}

const dateValue = ref<string | undefined | null>(props.modelValue)

const emit = defineEmits(['update:modelValue'])

const emitDateValue = (newDate: string | number | null) => {
  if (typeof newDate === 'string') {
    emit('update:modelValue', handleValueDate(newDate))
  } else {
    emit('update:modelValue', null)
  }
}

function handleValueDate(date?: string) {
  return date?.length === 16 ? parsePtBrToISO(date) : null
}

onMounted(() => {
  if (props.modelValue) dateValue.value = formatDate(props.modelValue)
})

watch(
  () => props.modelValue,
  () => {
    if (props.modelValue) dateValue.value = formatDate(props.modelValue)
  },
)
</script>
