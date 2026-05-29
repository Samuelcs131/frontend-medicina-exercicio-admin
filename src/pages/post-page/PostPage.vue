<template>
  <q-page class="container q-layout-padding">
    <h1 class="text-h5">Postagem</h1>

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
        :options="state.specialties"
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
      :class="{ 'post-table--transition': tableLoading }"
      selection="multiple"
      v-model:selected="state.actionsData"
      v-model:pagination="pagination"
      :rows="state.list"
      :columns="postTableColumns"
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
            label-new-entity="Nova postagem"
            :has-active="!state.actionsData.length"
            :loader-id="loader.list"
            @open-action-dialog="openActionDialog"
            @open-edit-dialog="openEditDialog"
          />
        </div>
      </template>
      <template #body-cell-specialtyIds="props">
        <q-td :props="props">
          <div
            v-if="props.row.specialtyIds.length > 0"
            class="cursor-pointer text-primary"
            @click="openSpecialtiesDialog(props.row.specialtyIds)"
          >
            <span v-if="props.row.specialtyIds.length === 1">
              {{ getSpecialtyName(props.row.specialtyIds[0]) }}
            </span>
            <span v-else>
              {{ getSpecialtyName(props.row.specialtyIds[0]) }}, +{{
                props.row.specialtyIds.length - 1
              }}
            </span>
          </div>
          <span v-else>-</span>
        </q-td>
      </template>
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn icon="edit" flat round @click="openEditDialog(props.row)">
            <q-tooltip> Editar </q-tooltip>
          </q-btn>
        </q-td>
      </template>
      <template #body-cell-title="props">
        <q-td :props="props" :title="props.row.title">
          {{ truncateText(props.row.title, 30) }}
        </q-td>
      </template>
    </q-table>

    <action-dialog
      :action-type="state.actionType"
      :dialog-id="dialog.action"
      :loader-action-id="loader.action"
      :name-items="state.actionsData.map((item) => item.title)"
      prefix="as"
      title="postagens"
      @confirm-action="confirmAction"
    />

    <q-dialog
      :model-value="dialogIsOpen(dialog.specialties)"
      @update:model-value="toggleDialog(dialog.specialties)"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="shadow-0" bordered style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Especialidades</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-list>
            <q-item
              v-for="specialty in state.selectedSpecialties"
              :key="specialty.id"
            >
              <q-item-section>
                <q-item-label>{{ specialty.name }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="state.selectedSpecialties.length === 0">
              <q-item-section>
                <q-item-label class="text-grey">
                  Nenhuma especialidade encontrada
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn
            flat
            label="Fechar"
            color="primary"
            @click="toggleDialog(dialog.specialties)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script setup lang="ts">
import ActionDialog from 'src/components/dialog/ActionDialog.vue'
import ActionHeader from 'src/components/action-header/ActionHeader.vue'
import { onMounted, ref } from 'vue'
import type { QTable } from 'quasar'
import { usePost } from './usePost'
import { postTableColumns } from './post.const'
import { truncateText } from 'src/utils/text.util'

const {
  state,
  filter,
  pagination,
  tableLoading,
  dialog,
  loader,
  onRequest,
  refreshCurrentPage,
  confirmAction,
  openEditDialog,
  openActionDialog,
  openSpecialtiesDialog,
  toggleActiveOnly,
  toggleDialog,
  dialogIsOpen,
} = usePost()

const tableRef = ref<QTable | null>(null)

onMounted(() => {
  tableRef.value?.requestServerInteraction()
})

function getSpecialtyName(specialtyId: string): string {
  const specialty = state.value.specialties.find((s) => s.id === specialtyId)
  return specialty?.name || '-'
}

async function handleActiveOnlyChange(value: boolean) {
  await toggleActiveOnly(value)
}

async function handleSpecialtyFilterChange(value: string) {
  state.value.filterSpecialtyId = value
  pagination.value.page = 1
  await refreshCurrentPage()
}
</script>

<style scoped>
.post-table--transition :deep(.q-table tbody) {
  opacity: 0.55;
  transition: opacity 0.2s ease;
}

.post-table--transition :deep(.q-table tbody td) {
  color: rgba(0, 0, 0, 0.55);
}

.post-table--transition :deep(.q-table__bottom .q-btn) {
  pointer-events: none;
  opacity: 0.55;
}
</style>
