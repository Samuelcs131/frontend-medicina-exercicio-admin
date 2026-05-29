<template>
  <q-page class="container q-layout-padding">
    <h1 class="text-h5">Subespecialidades</h1>

    <div class="flex gap-md q-mb-lg">
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
      <q-select
        outlined
        dense
        clearable
        label="Especialidade"
        v-model="state.filterSpecialtyId"
        :options="state.options.specialty"
        option-value="id"
        option-label="name"
        emit-value
        map-options
        style="min-width: 240px"
        @update:model-value="handleSpecialtyFilterChange"
      />
    </div>
    <q-table
      ref="tableRef"
      flat
      dense
      bordered
      :class="{ 'subspecialty-table--transition': tableLoading }"
      selection="multiple"
      v-model:selected="state.actionsData"
      v-model:pagination="pagination"
      :rows="state.list"
      :columns="subspecialtyTableColumns"
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
            label-new-entity="Nova especialidade"
            :has-active="!state.actionsData.length"
            :loader-id="loader.list"
            @open-action-dialog="openActionDialog"
            @open-edit-dialog="handleOpenEditDialog"
          />
        </div>
      </template>
      <template #body-cell-status="props">
        <status-row :props="props" />
      </template>
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            icon="edit"
            flat
            round
            @click="handleOpenEditDialog(props.row)"
          >
            <q-tooltip> Editar </q-tooltip>
          </q-btn>
        </q-td>
      </template>
      <template #body-cell-name="props">
        <q-td :props="props" :title="props.row.name">
          {{ truncateText(props.row.name, 30) }}
        </q-td>
      </template>
      <template #body-cell-specialty="props">
        <q-td :props="props" :title="props.row.specialty?.name ?? ''">
          {{
            props.row.specialty?.name
              ? truncateText(props.row.specialty.name, 30)
              : '-'
          }}
        </q-td>
      </template>
    </q-table>

    <action-dialog
      :action-type="state.actionType"
      :dialog-id="dialog.action"
      :loader-action-id="loader.action"
      :name-items="state.actionsData.map((item) => item.name)"
      prefix="as"
      title="subespecialidade"
      @confirm-action="confirmAction"
    />

    <v-dialog :dialog-id="dialog.edit" @hide-before="handleDialogBeforeHide">
      <q-card v-bind="$vCard" style="max-width: 500px" class="full-width">
        <q-form @submit="save">
          <q-card-section class="q-py-none q-pt-sm">
            <h6 class="text-h6 q-my-none">
              {{ state.form.id ? 'Editar' : 'Criar' }} subespecialidade
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

            <div class="col-12" v-if="!state.form.id">
              <q-select
                outlined
                dense
                label="Especialidade"
                :rules="[requiredRule]"
                v-model="selectedSpecialty"
                :options="specialtyOptions"
                option-value="id"
                option-label="name"
                use-input
                @filter="
                  (v, update) =>
                    update(
                      () =>
                        (filteredSpecialties = filterFn(
                          v,
                          'name',
                          state.optionsData.specialty,
                        )),
                    )
                "
                @update:model-value="handleSpecialtyChange"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Nenhum resultado
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="col-12" v-else>
              <q-select
                label="Especialidade"
                :rules="[requiredRule]"
                v-bind="$vSelect"
                v-model="state.form.specialtyId"
                :options="state.options.specialty"
                option-value="id"
                option-label="name"
                use-input
                fill-input
                hide-selected
                input-debounce="0"
                @filter="
                  (v, update) =>
                    update(
                      () =>
                        (state.options.specialty = filterFn(
                          v,
                          'name',
                          state.optionsData.specialty,
                        )),
                    )
                "
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Nenhum resultado
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
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
import { onMounted, ref, computed } from 'vue'
import type { QTable } from 'quasar'
import { useSubspecialty } from './useSubspecialty'
import { subspecialtyTableColumns } from './specialty.const'
import { requiredRule } from 'src/validations/form-rules/mixedRules.util'
import { statusOptions } from 'src/constants/status.const'
import VDialog from 'src/components/dialog/VDialog.vue'
import { truncateText } from 'src/utils/text.util'
import { filterFn } from 'src/utils/filter.util'
import type { ISpecialty } from 'src/types/specialty/ISpecialty.type'
import type { ISubspecialty } from 'src/types/specialty/ISubspecialty.type'

const {
  state,
  filter,
  pagination,
  tableLoading,
  dialog,
  loader,
  save,
  fetchOptions,
  onRequest,
  refreshCurrentPage,
  loaderStatus,
  toggleDialog,
  confirmAction,
  openEditDialog,
  clearEditDialog,
  openActionDialog,
  toggleActiveOnly,
} = useSubspecialty()

const tableRef = ref<QTable | null>(null)

const filteredSpecialties = ref<ISpecialty[]>([])
const selectedSpecialty = ref<{ id: string | null; name: string } | null>(null)

const specialtyOptions = computed(() => {
  return filteredSpecialties.value
})

function handleSpecialtyChange(
  value: { id: string | null; name: string } | null,
) {
  selectedSpecialty.value = value
  if (value?.id) {
    state.value.form.specialtyId = value.id
  } else {
    state.value.form.specialtyId = ''
  }
}

// Resetar o campo de especialidade quando fechar o modal
function handleDialogBeforeHide() {
  clearEditDialog()
  selectedSpecialty.value = null
  if (state.value.optionsData.specialty.length) {
    filteredSpecialties.value = [...state.value.optionsData.specialty]
  }
}

// Wrapper para openEditDialog que inicializa o campo de especialidade
async function handleOpenEditDialog(item?: ISubspecialty) {
  await openEditDialog(item)
  // Garantir que as opções estejam disponíveis quando abrir o modal de criar
  if (!item && state.value.optionsData.specialty.length) {
    filteredSpecialties.value = [...state.value.optionsData.specialty]
  }
}

async function handleActiveOnlyChange(value: boolean) {
  await toggleActiveOnly(value)
}

async function handleSpecialtyFilterChange(value: string) {
  state.value.filterSpecialtyId = value
  pagination.value.page = 1
  await refreshCurrentPage()
}

onMounted(async () => {
  await fetchOptions()
  filteredSpecialties.value = state.value.optionsData.specialty
  tableRef.value?.requestServerInteraction()
})
</script>

<style scoped>
.subspecialty-table--transition :deep(.q-table tbody) {
  opacity: 0.55;
  transition: opacity 0.2s ease;
}

.subspecialty-table--transition :deep(.q-table tbody td) {
  color: rgba(0, 0, 0, 0.55);
}

.subspecialty-table--transition :deep(.q-table__bottom .q-btn) {
  pointer-events: none;
  opacity: 0.55;
}
</style>
