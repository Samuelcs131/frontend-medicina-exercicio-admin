<template>
  <q-page class="container q-layout-padding">
    <h1 class="text-h5">Grupos de artigos</h1>

    <div class="flex justify-between gap-md q-mb-lg">
      <div class="flex gap-md" style="flex: 1">
        <q-select
          outlined
          dense
          v-model="selectedSpecialty"
          :options="specialtyOptions"
          option-value="id"
          option-label="name"
          label="Especialidade"
          style="min-width: 200px"
          use-input
          @filter="
            (v, update) =>
              update(
                () =>
                  (filteredSpecialties = filterFn(
                    v,
                    'name',
                    state.optionsData.specialties,
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
        <q-input
          outlined
          dense
          debounce="300"
          placeholder="Pesquisar"
          v-model="state.filter"
          style="flex: 1"
        >
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <span class="relative-position inline-block">
        <q-btn
          color="primary"
          icon="sort"
          label="Ordenar"
          unelevated
          :disable="!state.selectedSpecialtyId"
          @click="openOrderDialog"
        />
        <q-tooltip v-if="!state.selectedSpecialtyId" :delay="300">
          Selecione uma especialidade para ordenar os grupos
        </q-tooltip>
      </span>
    </div>
    <!-- Tabela normal -->
    <q-table
      flat
      dense
      bordered
      selection="multiple"
      v-model:selected="state.actionsData"
      :rows="state.filteredList"
      :columns="tableColumns"
      :filter="state.filter"
      :loading="loaderStatus(loader.list)"
      :rows-per-page-options="[20]"
      :row-key="(row) => row.id"
    >
      <template #top-right>
        <action-header
          label-new-entity="Novo grupo de artigos"
          :has-active="!state.actionsData.length"
          :loader-id="loader.list"
          @open-action-dialog="openActionDialog"
          @open-edit-dialog="openEditDialog"
        />
      </template>
      <template #body-cell-imageURL="props">
        <image-row :props="props" label="imageURL" />
      </template>
      <template #body-cell-name="props">
        <q-td :props="props" :title="props.row.name">
          {{ truncateText(props.row.name, 40) }}
        </q-td>
      </template>
      <template #body-cell-specialty="props">
        <q-td :props="props" :title="props.row.specialty?.name || ''">
          {{ props.row.specialty?.name || '-' }}
        </q-td>
      </template>
      <template #body-cell-description="props">
        <q-td :props="props" :title="props.row.description || ''">
          {{
            props.row.description
              ? truncateText(props.row.description, 40)
              : '-'
          }}
        </q-td>
      </template>
      <template #body-cell-status="props">
        <status-row :props="props" />
      </template>
      <template #body-cell-order="props">
        <q-td :props="props" style="text-align: center">
          <q-badge color="primary" :label="props.row.order ?? '-'" />
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

    <!-- Dialog de Ordenação -->
    <q-dialog
      v-model="orderDialogOpen"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="order-dialog-card">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Ordenar Grupos de Artigos</div>
          <q-space />
          <q-btn
            icon="close"
            flat
            round
            dense
            @click="closeOrderDialog"
            :disable="loaderStatus(loader.saveOrder)"
          />
        </q-card-section>

        <q-card-section>
          <div class="text-body2 text-grey-7 q-mb-md">
            Arraste os itens para reordená-los. A ordem será aplicada apenas
            para a especialidade selecionada.
          </div>
          <draggable
            v-model="orderDialogList"
            item-key="id"
            handle=".drag-handle-item"
            :animation="200"
            class="order-list"
          >
            <template #item="{ element, index }">
              <q-item class="order-item" bordered :key="element.id">
                <q-item-section avatar>
                  <q-icon
                    name="drag_indicator"
                    class="drag-handle-item"
                    size="md"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ element.name }}</q-item-label>
                  <q-item-label caption v-if="element.description">
                    {{ truncateText(element.description, 60) }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-badge color="primary" :label="`#${index + 1}`" />
                </q-item-section>
              </q-item>
            </template>
          </draggable>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn
            flat
            label="Cancelar"
            color="default"
            @click="closeOrderDialog"
            :disable="loaderStatus(loader.saveOrder)"
          />
          <q-btn
            label="Salvar Ordem"
            color="primary"
            unelevated
            :loading="loaderStatus(loader.saveOrder)"
            @click="saveOrderFromDialog"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <action-dialog
      :action-type="state.actionType"
      :dialog-id="dialog.action"
      :loader-action-id="loader.action"
      :name-items="state.actionsData.map((item) => item.name)"
      prefix="os"
      title="grupos de artigos"
      @confirm-action="confirmAction"
    />

    <v-dialog :dialog-id="dialog.edit" @hide-before="clearEditDialog">
      <q-card v-bind="$vCard" style="max-width: 500px" class="full-width">
        <q-form @submit="save">
          <q-card-section class="q-py-none q-pt-sm">
            <h6 class="text-h6 q-my-none">
              {{ state.form.id ? 'Editar' : 'Criar' }} grupo de artigos
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
                type="textarea"
                label="Descrição"
                :rules="[requiredRule]"
                v-model="state.form.description"
                v-bind="$vInput"
              />
            </div>
            <div class="col-12">
              <q-select
                label="Status"
                :rules="[requiredRule]"
                v-bind="$vSelect"
                v-model="state.form.status"
                :options="statusOptions"
                option-value="value"
                option-label="name"
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

            <div class="col-12">
              <q-select
                label="Especialidade"
                :rules="[requiredRule]"
                v-bind="$vSelect"
                v-model="state.form.specialtyId"
                :options="state.options.specialties"
                option-value="id"
                option-label="name"
                use-input
                @filter="
                  (v, update) =>
                    update(
                      () =>
                        (state.options.specialties = filterFn(
                          v,
                          'name',
                          state.optionsData.specialties,
                        )),
                    )
                "
              />
            </div>
            <div class="col-12">
              <q-select
                label="Postagens"
                v-bind="$vSelect"
                v-model="state.form.postIds"
                multiple
                :options="state.options.posts"
                option-value="id"
                use-chips
                use-input
                @filter="
                  (v, update) =>
                    update(
                      () =>
                        (state.options.posts = filterFn(
                          v,
                          'name',
                          state.optionsData.posts,
                        )),
                    )
                "
              >
                <template v-slot:selected-item="scope">
                  <chip-select :scope="scope" />
                </template>
              </q-select>
            </div>
            <div class="col-12" v-if="selectedPosts.length > 0">
              <div class="q-mt-md">
                <label class="text-body2 q-mb-sm block"
                  >Ordem das postagens</label
                >
                <draggable
                  v-model="selectedPosts"
                  item-key="id"
                  class="posts-order-list"
                  :animation="200"
                  handle=".draggable-move"
                  @end="updatePostOrder"
                >
                  <template #item="{ element }">
                    <q-item class="post-order-item" bordered>
                      <q-item-section avatar>
                        <q-icon name="drag_indicator" class="draggable-move" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{
                          truncateText(element.name, 50)
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </draggable>
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
import { onMounted, computed, ref } from 'vue'
import { useSubspecialtyGroup } from './useSubspecialtyGroup'
import { subspecialtyGroupTableColumns } from './subspecialtyGroup.const'
import type { QTableColumn } from 'quasar'
import { requiredRule } from 'src/validations/form-rules/mixedRules.util'
import { statusOptions } from 'src/constants/status.const'
import VDialog from 'src/components/dialog/VDialog.vue'
import ImageRow from 'src/components/table/ImageRow.vue'
import { truncateText } from 'src/utils/text.util'
import ChipSelect from 'src/components/select/ChipSelect.vue'
import { filterFn } from 'src/utils/filter.util'
import draggable from 'vuedraggable'
import type { ISpecialty } from 'src/types/specialty/ISpecialty.type'
import type { ISubspecialtyGroup } from 'src/types/specialty/ISubspecialtyGroup.type'

const {
  state,
  dialog,
  loader,
  save,
  addFile,
  fetchList,
  removeFile,
  loaderStatus,
  toggleDialog,
  confirmAction,
  openEditDialog,
  clearEditDialog,
  openActionDialog,
  updatePostOrder,
  onSpecialtyChange,
  onOrderChange,
  saveOrder,
} = useSubspecialtyGroup()

const filteredSpecialties = ref<ISpecialty[]>([])
const selectedSpecialty = ref<{ id: string | null; name: string } | null>(null)
const orderDialogOpen = ref(false)
const orderDialogList = ref<ISubspecialtyGroup[]>([])

const specialtyOptions = computed(() => {
  const options = [{ id: null, name: 'Todos' }]
  return [...options, ...filteredSpecialties.value]
})

const tableColumns = computed<QTableColumn[]>(() => {
  const columns = [...subspecialtyGroupTableColumns]

  // Adiciona coluna "order" quando uma especialidade estiver selecionada
  if (state.value.selectedSpecialtyId) {
    // Insere a coluna "order" antes da coluna "actions"
    const actionsIndex = columns.findIndex((col) => col.name === 'actions')
    if (actionsIndex !== -1) {
      columns.splice(actionsIndex, 0, {
        label: 'Ordem',
        field: 'order',
        name: 'order',
        sortable: true,
        align: 'center',
        style: 'width: 100px; min-width: 100px',
      })
    } else {
      // Se não encontrar "actions", adiciona no final
      columns.push({
        label: 'Ordem',
        field: 'order',
        name: 'order',
        sortable: true,
        align: 'center',
        style: 'width: 100px; min-width: 100px',
      })
    }
  }

  return columns
})

function openOrderDialog() {
  // Cria uma cópia da lista filtrada para o dialog
  orderDialogList.value = [...state.value.filteredList]
  orderDialogOpen.value = true
}

function closeOrderDialog() {
  orderDialogOpen.value = false
  // Restaura a lista original ao cancelar
  orderDialogList.value = []
}

async function saveOrderFromDialog() {
  // Atualiza a lista filtrada com a nova ordem do dialog
  onOrderChange(orderDialogList.value)
  // Salva a ordem
  await saveOrder()
  // Fecha o dialog
  closeOrderDialog()
}

async function handleSpecialtyChange(
  value: { id: string | null; name: string } | null,
) {
  selectedSpecialty.value = value
  await onSpecialtyChange(value?.id ?? null)
}

const selectedPosts = computed({
  get: () => {
    // Mantém a ordem dos IDs selecionados
    return state.value.form.postIds
      .map((id: string) => {
        const post = state.value.options.posts.find(
          (p: { id: string; name: string }) => p.id === id,
        )
        return post ? { id: post.id, name: post.name } : null
      })
      .filter((post): post is { id: string; name: string } => post !== null)
  },
  set: (newOrder: Array<{ id: string; name: string }>) => {
    // Atualiza a ordem dos IDs quando os itens são arrastados
    state.value.form.postIds = newOrder.map(
      (post: { id: string; name: string }) => post.id,
    )
  },
})

onMounted(async () => {
  await fetchList()
  filteredSpecialties.value = state.value.optionsData.specialties
})
</script>

<style scoped>
.posts-order-list {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  background-color: white;
}

.post-order-item {
  cursor: move;
  user-select: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.post-order-item:last-child {
  border-bottom: none;
}

.draggable-move {
  cursor: grab;
  color: rgba(0, 0, 0, 0.54);
}

.draggable-move:active {
  cursor: grabbing;
}

.order-dialog-card {
  max-width: 700px;
  width: 100%;
  min-width: 500px;
}

.order-list {
  max-height: 500px;
  overflow-y: auto;
  padding: 8px 0;
}

.order-item {
  cursor: move;
  user-select: none;
  transition: background-color 0.2s;
  border-radius: 4px;
  margin-bottom: 8px;
}

.order-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.drag-handle-item {
  cursor: grab;
  color: rgba(0, 0, 0, 0.54);
  transition: color 0.2s;
}

.drag-handle-item:hover {
  color: rgba(0, 0, 0, 0.87);
}

.drag-handle-item:active {
  cursor: grabbing;
}
</style>
