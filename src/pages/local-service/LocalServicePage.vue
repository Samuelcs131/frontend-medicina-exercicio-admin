<template>
  <q-page class="container q-layout-padding">
    <h1 class="text-h5">Locais de atendimento</h1>

    <div class="flex justify-between gap-md q-mb-lg">
      <q-input
        outlined
        dense
        debounce="300"
        placeholder="Pesquisar"
        v-model="state.filter"
      >
        <template #append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>
    <q-table
      flat
      dense
      bordered
      selection="multiple"
      v-model:selected="state.actionsData"
      :rows="state.list"
      :columns="localServiceTableColumns"
      :filter="state.filter"
      :loading="loaderStatus(loader.list)"
      :rows-per-page-options="[20]"
    >
      <template #top-right>
        <action-header
          label-new-entity="Novo local"
          :has-active="!state.actionsData.length"
          :loader-id="loader.list"
          @open-action-dialog="openActionDialog"
          @open-edit-dialog="openEditDialog"
        />
      </template>
      <template #body-cell-status="props">
        <status-row :props="props" />
      </template>
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn icon="edit" flat round @click="openEditDialog(props.row)">
            <q-tooltip> Editar </q-tooltip>
          </q-btn>
        </q-td>
      </template>
      <template #body-cell-name="props">
        <q-td :props="props" :title="props.row.name">
          {{ truncateText(props.row.name, 30) }}
        </q-td>
      </template>
      <template #body-cell-street="props">
        <q-td :props="props" :title="props.row.street">
          {{ truncateText(props.row.street, 30) }}
        </q-td>
      </template>
    </q-table>

    <action-dialog
      :action-type="state.actionType"
      :dialog-id="dialog.action"
      :loader-action-id="loader.action"
      :name-items="state.actionsData.map((item) => item.name)"
      prefix="os"
      title="locais de atendimento"
      @confirm-action="confirmAction"
    />

    <v-dialog :dialog-id="dialog.example">
      <q-card v-bind="$vCard" style="max-width: 600px">
        <q-card-section>
          <p>
            Clique com o botão direito do mouse no local desejado, selecione a
            primeira opção do menu e cole o conteúdo nos campos do formulário.
          </p>

          <q-img :src="exampleCoordinates" fit="contain" class="full-width" />
        </q-card-section>

        <q-separator />

        <q-card-section align="right">
          <q-btn label="Fechar" @click="toggleDialog(dialog.example)" flat />
        </q-card-section>
      </q-card>
    </v-dialog>

    <v-dialog :dialog-id="dialog.edit" @hide-before="clearEditDialog">
      <q-card v-bind="$vCard" style="max-width: 500px" class="full-width">
        <q-form @submit="save">
          <q-card-section class="q-py-none q-pt-sm">
            <h6 class="text-h6 q-my-none">
              {{ state.form.id ? 'Editar' : 'Criar' }} local de atendimento
            </h6>
          </q-card-section>
          <q-card-section class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                label="Nome da clínica ou hospital"
                :rules="[requiredRule]"
                v-model="state.form.name"
                v-bind="$vInput"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                label="Contato"
                :rules="[requiredRule]"
                v-model="state.form.contact"
                v-bind="$vInput"
              />
            </div>
            <div class="col-12 q-pt-none">
              <q-toggle
                label="O contato possui whatsapp?"
                :rules="[requiredRule]"
                v-model="state.form.hasWhatsapp"
              />
            </div>
            <div class="col-12" v-if="state.form.id">
              <q-select
                label="Status"
                :rules="[requiredRule]"
                v-bind="$vSelect"
                v-model="state.form.status"
                :options="statusOptions"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                label="Estado"
                :rules="[requiredRule]"
                v-bind="$vSelect"
                v-model="state.form.stateId"
                :options="state.options.states"
                option-value="id"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                label="Cidade"
                :rules="[requiredRule]"
                v-bind="$vSelect"
                v-model="state.form.cityId"
                :options="state.options.cities"
                option-value="id"
              />
            </div>
            <div class="col-12">
              <q-input
                label="Rua"
                :rules="[requiredRule]"
                v-model="state.form.street"
                v-bind="$vInput"
              />
            </div>
            <div class="col-12">
              <div class="flex gap-md no-wrap items-start">
                <q-input
                  label="Coordenadas (Latitude e Longitude)"
                  v-model="state.form.coordinates"
                  v-bind="$vInput"
                  class="full-width"
                  :rules="[requiredRule]"
                />
                <q-btn
                  style="flex-shrink: 0"
                  icon="map"
                  flat
                  @click="openGoogleMaps(state.form.street)"
                >
                  <q-tooltip>Google Maps</q-tooltip>
                </q-btn>
              </div>
            </div>

            <p @click="toggleDialog(dialog.example)" class="cursor-pointer">
              Como obter as coordentadas no Google Maps?
            </p>
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
import ActionHeader from 'src/components/action-header/ActionHeader.vue'
import StatusRow from 'src/components/table/StatusRow.vue'
import { onMounted } from 'vue'
import { useLocalService } from './useLocalService'
import { localServiceTableColumns } from './localService.const'
import { requiredRule } from 'src/validations/form-rules/mixedRules.util'
import { statusOptions } from 'src/constants/status.const'
import VDialog from 'src/components/dialog/VDialog.vue'
import exampleCoordinates from 'src/assets/placeholder/example-coordinates.png'
import { truncateText } from 'src/utils/text.util'

const {
  state,
  dialog,
  loader,
  save,
  fetchList,
  loaderStatus,
  toggleDialog,
  confirmAction,
  openEditDialog,
  openGoogleMaps,
  clearEditDialog,
  openActionDialog,
} = useLocalService()

onMounted(async () => {
  await fetchList()
})
</script>
