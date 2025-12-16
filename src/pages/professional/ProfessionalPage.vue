<template>
  <q-page class="container q-layout-padding">
    <h1 class="text-h5">Profissionais</h1>

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
      :columns="professionalTableColumns"
      :filter="state.filter"
      :loading="loaderStatus(loader.list)"
      :rows-per-page-options="[20]"
    >
      <template #top-right>
        <action-header
          label-new-entity="Novo profissional"
          :has-active="!state.actionsData.length"
          :loader-id="loader.list"
          @open-action-dialog="openActionDialog"
          @open-edit-dialog="openEditDialog"
        />
      </template>
      <template #body-cell-status="props">
        <status-row :props="props" />
      </template>
      <template #body-cell-imageURL="props">
        <image-row label="imageURL" :props="props" />
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
      prefix="os"
      title="profissionais"
      @confirm-action="confirmAction"
    />

    <v-dialog :dialog-id="dialog.edit" @hide-before="clearEditDialog">
      <q-card v-bind="$vCard" style="max-width: 600px">
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
                v-model="state.form.stateIds"
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
                v-model="state.form.cityIds"
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
                v-model="state.form.localServiceIds"
                multiple
                :options="state.options.localsService"
                option-value="id"
                use-chips
                use-input
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
                <template v-slot:selected-item="scope">
                  <chip-select :scope="scope" />
                </template>
              </q-select>
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
import { computed, onMounted } from 'vue'
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

const citiesOptions = computed(() => {
  return state.value.optionsData.cities.filter((city) =>
    state.value.form.stateIds.includes(city.stateId),
  )
})

const subspecialtyOptions = computed(() => {
  return state.value.optionsData.subspecialty.filter((sub) =>
    state.value.form.specialtyIds.includes(sub.specialty.id),
  )
})

function resetCityIds() {
  state.value.form.cityIds = []
}

function resetSubspecialty() {
  state.value.form.subspecialtyIds = []
}

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
} = useProfessional()

onMounted(async () => {
  await fetchList()
})
</script>
