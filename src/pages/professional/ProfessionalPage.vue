<template>
  <q-page class="container q-layout-padding">
    <h1 class="text-h5">Profissionais</h1>

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
      :class="{ 'professional-table--transition': tableLoading }"
      selection="multiple"
      v-model:selected="state.actionsData"
      v-model:pagination="pagination"
      :rows="state.list"
      :columns="professionalTableColumns"
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
            label-new-entity="Novo profissional"
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
      <template #body-cell-specialtyNames="props">
        <q-td
          v-if="props.row.specialtyNames"
          :props="props"
          :title="props.row.specialtyNames.join(', ')"
        >
          {{ truncateText(props.row.specialtyNames.join(', '), 30) }}
        </q-td>
      </template>
      <template #body-cell-imageURL="props">
        <image-row label="imageURL" :props="props" />
      </template>
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn icon="edit" flat round @click="void openEditDialog(props.row)">
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
      prefix="os"
      title="profissionais"
      @confirm-action="confirmAction"
    />

    <v-dialog :dialog-id="dialog.edit" @hide-before="clearEditDialog">
      <q-card
        v-bind="$vCard"
        class="relative-position"
        style="max-width: 600px"
      >
        <q-inner-loading :showing="editFormLoading" color="primary" />
        <q-form @submit="save">
          <q-card-section class="q-py-none q-pt-sm">
            <h6 class="text-h6 q-my-none">
              {{ state.form.id ? 'Editar' : 'Criar' }} profissional
            </h6>
          </q-card-section>
          <q-card-section class="row q-col-gutter-md">
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
              <q-input
                label="Nome"
                :rules="[requiredRule]"
                v-model="state.form.name"
                v-bind="$vInput"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-select
                label="Especialidades"
                v-bind="$vSelect"
                v-model="state.form.specialtyIds"
                multiple
                :options="state.options.specialty"
                option-value="id"
                use-chips
                use-input
                class="q-mb-md"
                @update:model-value="resetSubspecialty"
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
                <template v-slot:selected-item="scope">
                  <chip-select :scope="scope" />
                </template>
              </q-select>
            </div>
            <div class="col-12 col-md-6">
              <q-select
                label="Subespecialidades"
                v-bind="$vSelect"
                v-model="state.form.subspecialtyIds"
                multiple
                :options="state.options.subspecialty"
                option-value="id"
                use-chips
                class="q-mb-md"
                use-input
                @filter="
                  (v, update) =>
                    update(
                      () =>
                        (state.options.subspecialty = filterFn(
                          v,
                          'name',
                          subspecialtyOptions,
                        )),
                    )
                "
              >
                <template v-slot:selected-item="scope">
                  <chip-select :scope="scope" />
                </template>
              </q-select>
            </div>

            <div class="col-12 col-md-6">
              <q-input
                label="CRM"
                class="q-mb-md"
                v-model="state.form.CRM"
                v-bind="$vInput"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                label="RQN"
                v-model="state.form.RQN"
                v-bind="$vInput"
                class="q-mb-md"
              />
            </div>

            <div class="col-12">
              <q-input
                class="q-mb-md"
                label="Sobre mim"
                v-model="state.form.aboutMy"
                v-bind="$vInput"
                type="textarea"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-select
                class="q-mb-md"
                label="Estados"
                v-bind="$vSelect"
                v-model="state.form.states"
                :options="state.options.states"
                option-value="id"
                multiple
                use-input
                @update:model-value="resetCityIds"
                @filter="
                  (v, update) =>
                    update(
                      () =>
                        (state.options.states = filterFn(
                          v,
                          'name',
                          state.optionsData.states,
                        )),
                    )
                "
              >
                <template v-slot:selected-item="scope">
                  <chip-select :scope="scope" />
                </template>
              </q-select>
            </div>
            <div class="col-12 col-md-6">
              <q-select
                class="q-mb-md"
                label="Cidades"
                v-bind="$vSelect"
                v-model="state.form.cities"
                :options="state.options.cities"
                option-value="id"
                multiple
                use-input
                @filter="
                  (v, update) =>
                    update(
                      () =>
                        (state.options.cities = filterFn(
                          v,
                          'name',
                          citiesOptions,
                        )),
                    )
                "
              >
                <template v-slot:selected-item="scope">
                  <chip-select :scope="scope" />
                </template>
              </q-select>
            </div>

            <div class="col-12">
              <q-select
                class="q-mb-md"
                label="Locais de atendimento"
                v-bind="$vSelect"
                v-model="state.form.locationService"
                multiple
                :options="state.options.localsService"
                option-value="id"
                option-label="name"
                use-chips
                use-input
                @update:model-value="handleLocationServiceChange"
                @filter="
                  (v, update) =>
                    update(
                      () =>
                        (state.options.localsService = filterFn(
                          v,
                          'name',
                          state.optionsData.localsService,
                        )),
                    )
                "
              >
                <template v-slot:option="props">
                  <q-item v-bind="props.itemProps">
                    <q-item-section>
                      {{ props.opt.name }}
                      <div class="text-caption">
                        {{ props.opt.city }} - {{ props.opt.state }}
                      </div>
                    </q-item-section>
                  </q-item>
                </template>
                <template v-slot:selected-item="scope">
                  <q-chip
                    removable
                    dense
                    @remove="scope.removeAtIndex(scope.index)"
                    :tabindex="scope.tabindex"
                    color="primary"
                  >
                    {{ scope.opt.name }} ({{ scope.opt.city }} -
                    {{ scope.opt.state }})
                  </q-chip>
                </template>
              </q-select>
            </div>

            <div class="col-12" v-if="selectedLocalServices.length">
              <div class="text-subtitle2 q-mb-sm">
                Detalhes do local de atendimento
              </div>
              <q-separator />

              <div
                v-for="local in selectedLocalServices"
                :key="local.id"
                class="row q-col-gutter-md q-mt-sm"
              >
                <div class="col-12">
                  <div class="text-subtitle1">
                    {{ local.name }}
                    <span class="text-caption">
                      ({{ local.city }} - {{ local.state }})
                    </span>
                  </div>
                </div>

                <div class="col-12 col-md-6">
                  <input-telephone
                    v-model="getInfoLocalService(local.id).contact"
                  />
                </div>

                <div class="col-12 col-md-6">
                  <q-toggle
                    v-model="getInfoLocalService(local.id).hasWhatsapp"
                    label="WhatsApp?"
                    class="q-mb-md"
                    color="primary"
                  />
                </div>

                <div class="col-12">
                  <q-input
                    label="Complemento"
                    v-model="getInfoLocalService(local.id).complement"
                    class="q-mb-md"
                    v-bind="$vInput"
                  />
                </div>

                <div class="col-12">
                  <q-separator />
                </div>
              </div>
            </div>

            <div class="col-12">
              <q-toggle
                v-model="state.form.teleconsultation"
                label="Realiza teleconsulta?"
              />
            </div>
            <div class="col-12">
              <q-toggle
                v-model="state.form.speakEnglish"
                label="Realiza atendimento em inglês?"
              />
            </div>

            <div class="col-12">
              <q-input
                label="Instagram"
                v-model="state.form.instagram"
                v-bind="$vInput"
                class="q-mb-md"
              />
            </div>

            <div class="col-12">
              <q-input
                label="Currículo Lattes"
                v-model="state.form.curriculumLattes"
                v-bind="$vInput"
                class="q-mb-md"
              />
            </div>

            <div class="col-12">
              <q-input
                label="Site"
                v-model="state.form.site"
                v-bind="$vInput"
                class="q-mb-md"
              />
            </div>

            <div class="col-12">
              <q-uploader
                class="shadow-0 q-my-md full-width"
                bordered
                label="Foto do profissional"
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
              <p class="text-caption q-mb-sm">Conteúdos recomendados</p>
              <q-separator />
            </div>

            <div class="col-12">
              <q-select
                label="Videos com o profissional"
                :disable="!state.form.id"
                :rules="[(v) => maxArrayRule(v, 4)]"
                v-bind="$vSelect"
                v-model="state.form.recomendations.professionalVideoIds"
                multiple
                :options="state.options.videos"
                option-value="id"
                use-chips
              >
                <template v-slot:selected-item="scope">
                  <chip-select :scope="scope" />
                </template>
              </q-select>
            </div>

            <div class="col-12">
              <q-select
                label="Conteúdos informativos"
                :rules="[(v) => maxArrayRule(v, 4)]"
                v-bind="$vSelect"
                v-model="state.form.recomendations.informativeContentIds"
                multiple
                :options="state.optionsData.specialty"
                option-value="id"
                use-chips
              >
                <template v-slot:selected-item="scope">
                  <chip-select :scope="scope" />
                </template>
              </q-select>
            </div>

            <div class="col-12">
              <q-select
                label="Outros especialistas"
                :rules="[(v) => maxArrayRule(v, 4)]"
                v-bind="$vSelect"
                v-model="state.form.recomendations.otherSpecialtyIds"
                multiple
                :options="state.optionsData.specialty"
                option-value="id"
                use-chips
              >
                <template v-slot:selected-item="scope">
                  <chip-select :scope="scope" />
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
              :disable="loaderStatus(loader.edit) || editFormLoading"
            />
            <q-btn
              color="primary"
              label="Salvar"
              unelevated
              type="submit"
              :loading="loaderStatus(loader.edit)"
              :disable="editFormLoading"
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
import { computed, onMounted, ref } from 'vue'
import type { QTable } from 'quasar'
import { useProfessional } from './useProfessional'
import { professionalTableColumns } from './professional.const'
import { requiredRule } from 'src/validations/form-rules/mixedRules.util'
import { statusOptions } from 'src/constants/status.const'
import VDialog from 'src/components/dialog/VDialog.vue'
import ImageRow from 'src/components/table/ImageRow.vue'
import ChipSelect from 'src/components/select/ChipSelect.vue'
import { maxArrayRule } from 'src/validations/form-rules/arrayRules.util'
import { filterFn } from 'src/utils/filter.util'
import { truncateText } from 'src/utils/text.util'
import InputTelephone from 'src/components/input-telephone/InputTelephone.vue'

const citiesOptions = computed(() => {
  return state.value.optionsData.cities.filter((city) =>
    state.value.form.states.includes(city.stateId),
  )
})

const subspecialtyOptions = computed(() => {
  return state.value.optionsData.subspecialty.filter(
    (sub) =>
      sub.specialty != null &&
      state.value.form.specialtyIds.includes(sub.specialty.id),
  )
})

const selectedLocalServices = computed(() => {
  return state.value.form.locationService.map((id) => {
    const local = state.value.optionsData.localsService.find(
      (item) => item.id === id,
    )
    return {
      id,
      name: local?.name ?? 'Local de atendimento',
      state: local?.state ?? '',
      city: local?.city ?? '',
    }
  })
})

function getInfoLocalService(localServiceId: string) {
  let info = state.value.form.serviceLocations.find(
    (entry) => entry.localServiceId === localServiceId,
  )
  if (!info) {
    info = {
      localServiceId,
      contact: '',
      hasWhatsapp: false,
      complement: '',
    }
    state.value.form.serviceLocations.push(info)
  }
  return info
}

function resetCityIds() {
  state.value.form.cities = []
}

function resetSubspecialty() {
  state.value.form.subspecialtyIds = []
}

function handleLocationServiceChange(value: string[]) {
  state.value.form.locationService = value
  syncInfoLocalService()
}

const {
  state,
  editFormLoading,
  filter,
  pagination,
  tableLoading,
  dialog,
  loader,
  save,
  addFile,
  loadFormCatalog,
  onRequest,
  refreshCurrentPage,
  removeFile,
  loaderStatus,
  toggleDialog,
  confirmAction,
  openEditDialog,
  clearEditDialog,
  openActionDialog,
  toggleActiveOnly,
  syncInfoLocalService,
} = useProfessional()

const tableRef = ref<QTable | null>(null)

onMounted(() => {
  tableRef.value?.requestServerInteraction()
  void loadFormCatalog()
})

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
.professional-table--transition :deep(.q-table tbody) {
  opacity: 0.55;
  transition: opacity 0.2s ease;
}

.professional-table--transition :deep(.q-table tbody td) {
  color: rgba(0, 0, 0, 0.55);
}

.professional-table--transition :deep(.q-table__bottom .q-btn) {
  pointer-events: none;
  opacity: 0.55;
}
</style>
