<template>
  <q-page class="container q-layout-padding">
    <h1 class="text-h5">Gerenciamento de agendamentos</h1>

    <div class="flex gap-md q-mb-lg items-center">
      <q-input
        outlined
        dense
        debounce="500"
        placeholder="Pesquisar por nome ou e-mail"
        v-model="state.filter"
        style="min-width: 260px"
      >
        <template #append>
          <q-icon name="search" />
        </template>
      </q-input>

      <q-select
        outlined
        dense
        v-model="state.filterStatus"
        :options="bookingStatusOptions"
        emit-value
        map-options
        clearable
        option-label="name"
        label="Status"
        style="min-width: 200px"
      />

      <q-select
        outlined
        dense
        v-model="state.filterProfessionalId"
        :options="state.professionals"
        option-label="name"
        option-value="id"
        emit-value
        map-options
        clearable
        label="Profissional"
        style="min-width: 220px"
      />
    </div>

    <q-table
      flat
      dense
      bordered
      selection="multiple"
      v-model:selected="state.actionsData"
      :rows="currentList"
      :columns="bookingManagementTableColumns"
      row-key="id"
      :loading="loaderStatus(loader.list)"
      :filter="state.filter"
      :rows-per-page-options="[10, 20, 40, 100]"
    >
      <template #top-right>
        <div class="row items-center q-gutter-md">
          <q-btn
            outline
            color="negative"
            label="Deletar selecionados"
            :disable="!state.actionsData.length || loaderStatus(loader.list)"
            @click="openActionDialog(ActionDialogOptions.delete)"
          />
          <q-btn
            color="primary"
            label="Novo agendamento"
            unelevated
            :disable="loaderStatus(loader.list)"
            @click="openEditDialog()"
          />
        </div>
      </template>

      <template #body-cell-status="props">
        <q-td :props="props">
          <q-badge
            :color="
              bookingStatusDictionary[props.row.status as BookingStatus].color
            "
            :label="
              bookingStatusDictionary[props.row.status as BookingStatus].name
            "
          />
        </q-td>
      </template>

      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            :disable="loaderStatus(loader.list)"
            icon="edit"
            flat
            round
            @click="openEditDialog(props.row)"
          >
            <q-tooltip>Editar</q-tooltip>
          </q-btn>
          <q-btn
            :disable="loaderStatus(loader.list)"
            icon="delete"
            flat
            round
            color="negative"
            @click="
              () => {
                state.actionsData = [props.row]
                openActionDialog(ActionDialogOptions.delete)
              }
            "
          >
            <q-tooltip>Excluir</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <!-- Dialog de exclusão -->
    <action-dialog
      :action-type="state.actionType"
      :dialog-id="dialog.action"
      :loader-action-id="loader.action"
      :name-items="state.actionsData.map((item) => item.fullName)"
      prefix="os"
      title="agendamentos"
      @confirm-action="confirmAction"
    />

    <!-- Dialog de edição -->
    <v-dialog :dialog-id="dialog.edit" @hide-before="clearEditDialog">
      <q-card v-bind="$vCard" style="max-width: 500px" class="full-width">
        <q-form @submit="save">
          <q-card-section class="q-py-none q-pt-sm">
            <h6 class="text-h6 q-my-none">
              {{ state.form.id ? 'Editar' : 'Novo' }} agendamento
            </h6>
          </q-card-section>

          <q-card-section class="row q-col-gutter-md">
            <div class="col-12">
              <q-select
                label="Profissional *"
                :rules="[requiredRule]"
                v-bind="$vSelect"
                v-model="state.form.professionalId"
                :options="state.professionals"
                option-label="name"
                option-value="id"
              />
            </div>
            <div class="col-12">
              <q-input
                label="Nome completo *"
                :rules="[requiredRule]"
                v-model="state.form.fullName"
                v-bind="$vInput"
              />
            </div>
            <div class="col-12">
              <q-input
                label="E-mail *"
                :rules="[requiredRule, emailRule]"
                v-model="state.form.email"
                v-bind="$vInput"
              />
            </div>
            <div class="col-12">
              <input-telephone v-model="state.form.phone" label="Celular" />
            </div>
            <div class="col-6">
              <q-input
                label="Data *"
                type="date"
                :rules="[requiredRule]"
                v-model="state.form.date"
                v-bind="$vInput"
              />
            </div>
            <div class="col-6">
              <q-input
                label="Horário *"
                type="time"
                :rules="[requiredRule]"
                v-model="state.form.time"
                v-bind="$vInput"
              />
            </div>
            <div class="col-12">
              <q-input
                label="Observações"
                v-model="state.form.notes"
                v-bind="$vInput"
                type="textarea"
              />
            </div>
            <div class="col-12" v-if="state.form.id">
              <q-select
                label="Status *"
                :rules="[requiredRule]"
                v-bind="$vSelect"
                v-model="state.form.status"
                :options="bookingStatusOptions"
              />
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn
              color="default"
              flat
              label="Cancelar"
              @click="toggleDialog(dialog.edit)"
              :disable="loaderStatus(loader.edit)"
            />
            <q-btn
              color="primary"
              label="Salvar"
              unelevated
              type="submit"
              :loading="loaderStatus(loader.edit)"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </v-dialog>
  </q-page>
</template>

<script setup lang="ts">
import ActionDialog from 'src/components/dialog/ActionDialog.vue'
import VDialog from 'src/components/dialog/VDialog.vue'
import InputTelephone from 'src/components/input-telephone/InputTelephone.vue'
import { computed, onMounted } from 'vue'
import { useBookingManagementPage } from './useBookingManagementPage'
import { bookingManagementTableColumns } from './bookingManagementPage.const'
import { requiredRule } from 'src/validations/form-rules/mixedRules.util'
import { emailRule } from 'src/validations/form-rules/stringRules.util'
import { ActionDialogOptions } from 'src/enums/ActionDialogOptions.enum'
import {
  bookingStatusOptions,
  bookingStatusDictionary,
} from 'src/constants/booking-status.const'
import type { BookingStatus } from 'src/enums/BookingStatus.enum'

const {
  state,
  dialog,
  loader,
  save,
  fetchList,
  fetchProfessionals,
  loaderStatus,
  toggleDialog,
  confirmAction,
  openEditDialog,
  clearEditDialog,
  openActionDialog,
} = useBookingManagementPage()

const currentList = computed(() => {
  return state.value.list.filter((booking) => {
    const matchesStatus = state.value.filterStatus
      ? booking.status === state.value.filterStatus
      : true

    const matchesProfessional = state.value.filterProfessionalId
      ? booking.professionalId === state.value.filterProfessionalId
      : true

    return matchesStatus && matchesProfessional
  })
})

onMounted(async () => {
  await fetchProfessionals()
  await fetchList()
})
</script>
