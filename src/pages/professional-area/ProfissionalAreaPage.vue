<template>
  <q-page class="container q-layout-padding">
    <h1 class="text-h5">Áreas profissionais</h1>

    <div class="flex justify-between gap-md q-mb-lg">
      <q-input
        outlined
        dense
        debounce="500"
        placeholder="Pesquisar"
        v-model="filter"
        style="min-width: 240px"
      >
        <template #append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>
    <q-table
      ref="tableRef"
      flat
      dense
      bordered
      :class="{ 'professional-area-table--transition': tableLoading }"
      selection="multiple"
      v-model:selected="state.actionsData"
      v-model:pagination="pagination"
      :rows="state.list"
      :columns="profissionalAreaTableColumns"
      row-key="id"
      :loading="tableLoading"
      :filter="filter"
      :rows-per-page-options="[10, 20, 40, 100]"
      @request="onRequest"
    >
      <template #top-right>
        <div class="row items-center q-gutter-md">
          <q-checkbox
            :model-value="state.activeOnly"
            label="Apenas ativos"
            :disable="tableLoading"
            @update:model-value="handleActiveOnlyChange"
          />
          <action-header
            label-new-entity="Nova área profissional"
            :has-active="!state.actionsData.length"
            :loader-id="loader.list"
            @open-action-dialog="openActionDialog"
            @open-edit-dialog="openEditDialog"
          />
        </div>
      </template>
      <template #body-cell-status="props">
        <status-row :props="props" />
      </template>
      <template #body-cell-imageURL="props">
        <image-row :props="props" label="imageURL" />
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
    </q-table>

    <action-dialog
      :action-type="state.actionType"
      :dialog-id="dialog.action"
      :loader-action-id="loader.action"
      :name-items="state.actionsData.map((item) => item.name)"
      prefix="as"
      title="áreas profissionais"
      @confirm-action="confirmAction"
    />

    <v-dialog :dialog-id="dialog.edit" @hide-before="clearEditDialog">
      <q-card v-bind="$vCard" style="max-width: 500px" class="full-width">
        <q-form @submit="save">
          <q-card-section class="q-py-none q-pt-sm">
            <h6 class="text-h6 q-my-none">
              {{ state.form.id ? 'Editar' : 'Criar' }} área profissional
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
              <q-uploader
                class="shadow-0 q-my-md full-width"
                bordered
                label="Imagem"
                max-files="1"
                hide-upload-btn
                @added="addFile"
                @removed="removeFile"
                accept="image/*"
              />
            </div>

            <div class="col-12">
              <div class="bg-black rounded-borders">
                <q-img
                  v-if="state.form.imageURL"
                  :src="state.form.imageURL"
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
              :disable="!state.form.imageFile && !state.form.id"
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
import { onMounted, ref } from 'vue'
import type { QTable } from 'quasar'
import { useProfissionalArea } from './useProfissionalArea'
import { profissionalAreaTableColumns } from './profissionalArea.const'
import { requiredRule } from 'src/validations/form-rules/mixedRules.util'
import { statusOptions } from 'src/constants/status.const'
import VDialog from 'src/components/dialog/VDialog.vue'
import ImageRow from 'src/components/table/ImageRow.vue'
import { truncateText } from 'src/utils/text.util'

const {
  state,
  filter,
  pagination,
  tableLoading,
  dialog,
  loader,
  save,
  addFile,
  onRequest,
  removeFile,
  loaderStatus,
  toggleDialog,
  confirmAction,
  openEditDialog,
  clearEditDialog,
  openActionDialog,
  toggleActiveOnly,
} = useProfissionalArea()

const tableRef = ref<QTable | null>(null)

onMounted(() => {
  tableRef.value?.requestServerInteraction()
})

async function handleActiveOnlyChange(value: boolean) {
  await toggleActiveOnly(value)
}
</script>

<style scoped>
.professional-area-table--transition :deep(.q-table tbody) {
  opacity: 0.55;
  transition: opacity 0.2s ease;
}

.professional-area-table--transition :deep(.q-table tbody td) {
  color: rgba(0, 0, 0, 0.55);
}

.professional-area-table--transition :deep(.q-table__bottom .q-btn) {
  pointer-events: none;
  opacity: 0.55;
}
</style>
