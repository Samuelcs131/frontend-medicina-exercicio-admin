<template>
  <div class="booking-page flex flex-center">
    <q-card
      v-bind="$vCard"
      class="booking-card full-width"
      style="max-width: 900px"
    >
      <q-card-section class="text-center q-pb-none">
        <div class="text-h5">Agende seu horário</div>
        <div class="text-caption text-grey-8">
          Escolha uma data, um horário disponível e informe seus dados
        </div>
      </q-card-section>

      <template v-if="!state.confirmed">
        <q-card-section class="q-pb-none">
          <q-select
            v-model="state.professionalId"
            v-bind="$vInput"
            outlined
            dense
            label="Profissional *"
            :options="state.professionals"
            option-label="name"
            option-value="id"
            emit-value
            map-options
            :loading="loaderStatus(loader.professionals)"
            @update:model-value="selectProfessional"
          />
        </q-card-section>

        <q-card-section
          v-if="!state.professionalId"
          class="text-grey-7 text-body2"
        >
          Selecione um profissional para ver os dias e horários disponíveis.
        </q-card-section>

        <q-card-section v-else class="row q-col-gutter-lg">
          <!-- Calendário -->
          <div class="col-12 col-md-5">
            <q-date
              v-model="state.date"
              v-bind="$vCard"
              flat
              minimal
              :locale="dateLocale"
              mask="DD/MM/YYYY"
              :options="dateOptionsFn"
              @update:model-value="fetchSlots"
              class="full-width"
            />
          </div>

          <!-- Horários disponíveis -->
          <div class="col-12 col-md-7">
            <div class="text-subtitle2 q-mb-sm">Horários disponíveis</div>

            <div v-if="!state.date" class="text-grey-7 text-body2">
              Selecione uma data para ver os horários.
            </div>

            <div
              v-else-if="loaderStatus(loader.slots)"
              class="row justify-center q-pa-lg"
            >
              <q-spinner color="primary" size="32px" />
            </div>

            <div v-else class="row q-col-gutter-sm">
              <div
                v-for="slot in state.slots"
                :key="slot.time"
                class="col-4 col-sm-3"
              >
                <q-btn
                  :label="slot.time"
                  :disable="!slot.available"
                  :outline="state.selectedTime !== slot.time"
                  :color="
                    state.selectedTime === slot.time ? 'primary' : 'default'
                  "
                  :unelevated="state.selectedTime === slot.time"
                  class="full-width"
                  no-caps
                  @click="selectTime(slot.time)"
                />
              </div>

              <div
                v-if="!state.slots.length"
                class="col-12 text-grey-7 text-body2"
              >
                Nenhum horário disponível para este dia.
              </div>
            </div>
          </div>
        </q-card-section>

        <!-- Formulário do cliente -->
        <q-slide-transition>
          <q-card-section v-if="state.selectedTime" class="q-pt-none">
            <q-separator class="q-mb-md" />

            <div class="text-subtitle2 q-mb-sm">
              Seus dados para o agendamento de {{ state.date }} às
              {{ state.selectedTime }}
            </div>

            <q-form @submit="confirmBooking" class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="state.form.fullName"
                  v-bind="$vInput"
                  label="Nome completo *"
                  :rules="[requiredRule]"
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="state.form.email"
                  v-bind="$vInput"
                  label="E-mail *"
                  :rules="[requiredRule, emailRule]"
                />
              </div>
              <div class="col-12 col-sm-6">
                <input-telephone v-model="state.form.phone" label="Celular *" />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="state.form.notes"
                  v-bind="$vInput"
                  label="Observações (opcional)"
                />
              </div>

              <div class="col-12 flex justify-end">
                <q-btn
                  type="submit"
                  color="primary"
                  unelevated
                  no-caps
                  label="Confirmar agendamento"
                  :loading="loaderStatus(loader.submit)"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-slide-transition>
      </template>

      <!-- Confirmação -->
      <q-card-section v-else class="column items-center q-gutter-md q-py-xl">
        <q-icon name="event_available" color="positive" size="64px" />
        <div class="text-h6">Agendamento confirmado!</div>
        <div class="text-body2 text-grey-8 text-center">
          {{ state.form.fullName }}, seu horário com
          {{ selectedProfessionalName }} foi marcado para {{ state.date }} às
          {{ state.selectedTime }}.
          <br />
          Enviaremos a confirmação para {{ state.form.email }}.
        </div>
        <q-btn
          flat
          color="primary"
          no-caps
          label="Agendar outro horário"
          @click="resetBooking"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import InputTelephone from 'src/components/input-telephone/InputTelephone.vue'
import { dateLocale } from 'src/constants/date/dateLocale.const'
import { useLoader } from 'src/composables/useLoader'
import { requiredRule } from 'src/validations/form-rules/mixedRules.util'
import { emailRule } from 'src/validations/form-rules/stringRules.util'
import { onMounted } from 'vue'
import { useBookingPage } from './useBookingPage'

const {
  state,
  loader,
  selectedProfessionalName,
  fetchProfessionals,
  selectProfessional,
  fetchSlots,
  selectTime,
  confirmBooking,
  resetBooking,
} = useBookingPage()

const { loaderStatus } = useLoader()

onMounted(async () => {
  await fetchProfessionals()
})

// Restringe aos dias habilitados na disponibilidade do profissional, dentro do horizonte semestral e sem exceções
function dateOptionsFn(date: string) {
  const availability = state.value.availability
  if (!availability) return false

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [year, month, day] = date.split('/').map(Number)
  const current = new Date(year ?? 0, (month ?? 1) - 1, day)
  if (current.getTime() < today.getTime()) return false

  const maxDate = new Date(today)
  maxDate.setMonth(maxDate.getMonth() + availability.horizonMonths)
  if (current.getTime() > maxDate.getTime()) return false

  const isoDate = `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  if (availability.blockedDates.includes(isoDate)) return false

  const weekday = current.getDay()
  const weekdayHours = availability.weeklyHours.find(
    (item) => item.weekday === weekday,
  )

  return Boolean(weekdayHours?.enabled && weekdayHours.ranges.length)
}
</script>

<style scoped>
.booking-page {
  min-height: 100vh;
  padding: 24px;
}
</style>
