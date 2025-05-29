<template>
  <q-input
    outlined
    dense
    label="Intervalo"
    style="min-width: 270px"
    :model-value="`${localRangeDate?.from || 'Data inicial'} - ${localRangeDate?.to || 'Data final'}`"
  >
    <template #append>
      <q-btn
        v-if="localRangeDate?.from && localRangeDate?.to"
        class="q-pa-none"
        dense
        icon="cancel"
        flat
        round
        @click="clearRangeDate"
      />
      <q-btn dense flat round icon="event" class="cursor-pointer q-ml-sm">
        <q-popup-proxy
          :breakpoint="600"
          cover
          transition-show="scale"
          transition-hide="scale"
          class="shadow-0"
        >
          <q-date
            v-bind="$vCard"
            flat
            minimal
            no-unset
            mask="DD/MM/YYYY"
            v-model="localRangeDate"
            range
            :locale="dateLocale"
            @update:model-value="updateRange"
          >
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Fechar" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-btn>
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { dateLocale } from 'src/constants/date/dateLocale.const'

interface IProps {
  rangeDate: {
    to?: string
    from?: string
  }
}

const props = defineProps<IProps>()
const emit = defineEmits(['update:rangeDate'])

const localRangeDate = ref({ ...props.rangeDate })

function updateRange(newRange: { from?: string; to?: string }) {
  if (!newRange?.to || !newRange?.from) {
    emit('update:rangeDate', { from: '', to: '' })
  } else {
    emit('update:rangeDate', newRange)
  }
}

function clearRangeDate() {
  localRangeDate.value = { from: '', to: '' }
  updateRange(localRangeDate.value)
}

watch(
  () => props.rangeDate,
  (newVal) => {
    localRangeDate.value = { ...newVal }
  },
  { deep: true },
)
</script>
