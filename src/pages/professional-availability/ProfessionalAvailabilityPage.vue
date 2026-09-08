<template>
  <q-page class="container q-layout-padding">
    <h1 class="text-h5">Disponibilidade dos profissionais</h1>
    <div class="text-caption text-grey-8 q-mb-md">
      Defina os dias e horários em que cada profissional atende. O período
      máximo de agendamento é semestral (6 meses).
    </div>

    <q-select
      v-model="state.professionalId"
      v-bind="$vSelect"
      label="Profissional"
      :options="state.professionals"
      option-label="name"
      option-value="id"
      :loading="loaderStatus(loader.professionals)"
      style="max-width: 360px"
      class="q-mb-lg"
      @update:model-value="selectProfessional"
    />

    <template v-if="state.professionalId">
      <q-card v-bind="$vCard" class="q-pa-md q-mb-md">
        <div class="text-subtitle1 q-mb-sm">Horários semanais</div>

        <div
          v-for="day in state.weeklyHours"
          :key="day.weekday"
          class="row items-start q-col-gutter-sm q-mb-sm items-center"
        >
          <div class="col-12 col-sm-3 flex items-center">
            <q-toggle
              v-model="day.enabled"
              :label="dateLocale.days[day.weekday]"
            />
          </div>

          <div class="col-12 col-sm-9">
            <template v-if="day.enabled">
              <div
                v-for="(range, index) in day.ranges"
                :key="index"
                class="row items-center q-col-gutter-sm q-mb-xs"
              >
                <div class="col-5 col-sm-3">
                  <q-input
                    v-model="range.start"
                    v-bind="$vInput"
                    type="time"
                    label="Início"
                  />
                </div>
                <div class="col-5 col-sm-3">
                  <q-input
                    v-model="range.end"
                    v-bind="$vInput"
                    type="time"
                    label="Fim"
                  />
                </div>
                <div class="col-2 col-sm-1">
                  <q-btn
                    icon="delete"
                    flat
                    round
                    dense
                    color="negative"
                    @click="removeRange(day.weekday, index)"
                  />
                </div>
              </div>

              <q-btn
                icon="add"
                label="Adicionar período"
                flat
                dense
                no-caps
                color="primary"
                @click="addRange(day.weekday)"
              />
            </template>
            <div v-else class="text-grey-7 text-body2">Indisponível</div>
          </div>
        </div>
      </q-card>

      <q-card v-bind="$vCard" class="q-pa-md q-mb-md">
        <div class="text-subtitle1 q-mb-sm">Exceções (dias indisponíveis)</div>

        <div class="row items-center q-col-gutter-sm q-mb-sm">
          <div class="col-8 col-sm-4">
            <q-input
              v-model="state.newBlockedDate"
              v-bind="$vInput"
              type="date"
            />
          </div>
          <div class="col-4 col-sm-2">
            <q-btn
              label="Adicionar"
              color="primary"
              unelevated
              no-caps
              :disable="!state.newBlockedDate"
              @click="addBlockedDate"
            />
          </div>
        </div>

        <div class="flex gap-sm">
          <q-chip
            v-for="date in state.blockedDates"
            :key="date"
            removable
            @remove="removeBlockedDate(date)"
          >
            {{ formatDate(date, { dateStyle: 'short' }) }}
          </q-chip>

          <div v-if="!state.blockedDates.length" class="text-grey-7 text-body2">
            Nenhuma exceção cadastrada.
          </div>
        </div>
      </q-card>

      <q-card v-bind="$vCard" class="q-pa-md q-mb-md">
        <div class="text-subtitle1 q-mb-sm">Configurações gerais</div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6">
            <q-select
              v-model="state.horizonMonths"
              v-bind="$vSelect"
              option-label="label"
              label="Período máximo de agendamento"
              :options="availabilityHorizonOptions"
            />
          </div>
          <div class="col-12 col-sm-6">
            <q-input
              v-model.number="state.slotDurationMinutes"
              v-bind="$vInput"
              type="number"
              min="5"
              step="5"
              label="Duração de cada atendimento (minutos)"
            />
          </div>
        </div>
      </q-card>

      <div class="flex justify-end">
        <q-btn
          color="primary"
          label="Salvar disponibilidade"
          unelevated
          no-caps
          :loading="loaderStatus(loader.save)"
          @click="save"
        />
      </div>
    </template>

    <div v-else class="text-grey-7 text-body2">
      Selecione um profissional para configurar sua disponibilidade.
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useLoader } from 'src/composables/useLoader'
import { dateLocale } from 'src/constants/date/dateLocale.const'
import { availabilityHorizonOptions } from 'src/constants/availability.const'
import { formatDate } from 'src/utils/date.util'
import { useProfessionalAvailabilityPage } from './useProfessionalAvailabilityPage'

const {
  state,
  loader,
  fetchProfessionals,
  selectProfessional,
  addRange,
  removeRange,
  addBlockedDate,
  removeBlockedDate,
  save,
} = useProfessionalAvailabilityPage()

const { loaderStatus } = useLoader()

onMounted(async () => {
  await fetchProfessionals()
})
</script>
