<template>
  <q-page class="container q-layout-padding">
    <h1 class="text-h5">VÍdeos</h1>

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
      :columns="videoPageTableColumns"
      :filter="state.filter"
      :loading="loaderStatus(loader.list)"
      :rows-per-page-options="[20]"
    >
      <template #top-right>
        <action-header
          label-new-entity="Novo vídeo"
          :has-active="!state.actionsData.length"
          :loader-id="loader.list"
          @open-action-dialog="openActionDialog"
          @open-edit-dialog="openEditDialog"
        />
      </template>
      <template #body-cell-status="props">
        <status-row :props="props" />
      </template>
      <template #body-cell-url="props">
        <q-td :props="props">
          <q-img
            :src="thumbnailYoutube(props.row.url)"
            width="50px"
            height="50px"
            fit="contain"
          />
        </q-td>
      </template>
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn icon="edit" flat round @click="openEditDialog(props.row)">
            <q-tooltip> Editar </q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <action-dialog
      :action-type="state.actionType"
      :dialog-id="dialog.action"
      :loader-action-id="loader.action"
      :name-items="state.actionsData.map((item) => item.name)"
      prefix="os"
      title="vídeos"
      @confirm-action="confirmAction"
    />

    <v-dialog :dialog-id="dialog.edit" @hide-before="clearEditDialog">
      <q-card v-bind="$vCard" style="max-width: 500px">
        <q-form @submit="save">
          <q-card-section class="q-py-none q-pt-sm">
            <h6 class="text-h6 q-my-none">
              {{ state.form.id ? 'Editar' : 'Criar' }} vídeo
            </h6>
          </q-card-section>
          <q-card-section class="row q-col-gutter-md">
            <div class="col-12">
              <q-input
                label="Nome"
                :rules="[requiredRule]"
                v-model="state.form.name"
                v-bind="$vInput"
              />
            </div>
            <div class="col-12">
              <q-input
                label="Descrição"
                :rules="[requiredRule]"
                v-model="state.form.description"
                v-bind="$vInput"
              />
            </div>
            <div class="col-12">
              <q-input
                label="URL Youtube"
                :rules="[requiredRule]"
                v-model="state.form.url"
                v-bind="$vInput"
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

            <div class="col-12">
              <q-select
                label="Profissionais"
                :rules="[requiredRule]"
                v-bind="$vSelect"
                v-model="state.form.professionalIds"
                multiple
                :options="state.options.professionals"
                option-value="id"
                use-chips
              >
                <template v-slot:selected-item="scope">
                  <chip-select :scope="scope" />
                </template>
              </q-select>
            </div>
            <div class="col-12 col-md-6">
              <q-select
                label="Especialidade"
                :rules="[requiredRule]"
                v-bind="$vSelect"
                v-model="state.form.specialtyIds"
                multiple
                :options="state.options.specialties"
                option-value="id"
                use-chips
              >
                <template v-slot:selected-item="scope">
                  <chip-select :scope="scope" />
                </template>
              </q-select>
            </div>
            <div class="col-12 col-md-6">
              <q-select
                label="Subespecialidade"
                :rules="[requiredRule]"
                v-bind="$vSelect"
                v-model="state.form.subspecialtyIds"
                multiple
                :options="state.options.subspecialties"
                option-value="id"
                use-chips
              >
                <template v-slot:selected-item="scope">
                  <chip-select :scope="scope" />
                </template>
              </q-select>
            </div>
            <div class="col-12">
              <div class="bg-black rounded-borders">
                <q-img
                  v-if="state.form.url"
                  :src="thumbnailYoutube(state.form.url)"
                  fit="contain"
                  height="200px"
                />
              </div>
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
import ActionHeader from 'src/components/action-header/ActionHeader.vue'
import StatusRow from 'src/components/table/StatusRow.vue'
import { onMounted } from 'vue'
import { useVideoPage } from './useVideoPage'
import { videoPageTableColumns } from './videoPage.const'
import { requiredRule } from 'src/validations/form-rules/mixedRules.util'
import { statusOptions } from 'src/constants/status.const'
import VDialog from 'src/components/dialog/VDialog.vue'
import { thumbnailYoutube } from 'src/utils/youtube.util'
import ChipSelect from 'src/components/select/ChipSelect.vue'

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
  clearEditDialog,
  openActionDialog,
} = useVideoPage()

onMounted(async () => {
  await fetchList()
})
</script>
