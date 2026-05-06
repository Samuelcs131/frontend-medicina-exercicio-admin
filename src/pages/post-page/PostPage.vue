<template>
  <q-page class="container q-layout-padding">
    <h1 class="text-h5">Postagem</h1>

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
      :columns="postTableColumns"
      :filter="state.filter"
      :loading="loaderStatus(loader.list)"
      :rows-per-page-options="[20]"
    >
      <template #top-right>
        <action-header
          label-new-entity="Nova postagem"
          :has-active="!state.actionsData.length"
          :loader-id="loader.list"
          @open-action-dialog="openActionDialog"
          @open-edit-dialog="openEditDialog"
        />
      </template>
      <template #body-cell-status="props">
        <status-row :props="props" />
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
      <template #body-cell-name="props">
        <q-td :props="props" :title="props.row.name">
          {{ truncateText(props.row.name, 30) }}
        </q-td>
      </template>
      <template #body-cell-author="props">
        <q-td :props="props" :title="props.row.author">
          {{ truncateText(props.row.author, 30) }}
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
import StatusRow from 'src/components/table/StatusRow.vue'
import { onMounted } from 'vue'
import { usePost } from './usePost'
import { postTableColumns } from './post.const'
import { truncateText } from 'src/utils/text.util'

const {
  state,
  dialog,
  loader,
  fetchList,
  loaderStatus,
  confirmAction,
  openEditDialog,
  openActionDialog,
  openSpecialtiesDialog,
  toggleDialog,
  dialogIsOpen,
} = usePost()

function getSpecialtyName(specialtyId: string): string {
  const specialty = state.value.specialties.find((s) => s.id === specialtyId)
  return specialty?.name || '-'
}

onMounted(async () => {
  await fetchList()
})
</script>
