<template>
  <q-page class="container q-layout-padding">
    <h1 class="text-h5">Usuários</h1>

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
      :columns="userTableColumns"
      :filter="state.filter"
      :loading="loaderStatus(loader.list)"
      :rows-per-page-options="[20]"
    >
      <template #top-right>
        <action-header
          label-new-entity="Novo usuário"
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
    </q-table>

    <action-dialog
      :action-type="state.actionType"
      :dialog-id="dialog.action"
      :loader-action-id="loader.action"
      :name-items="state.actionsData.map((item) => item.name)"
      prefix="os"
      title="usuários"
      @confirm-action="confirmAction"
    />

    <edit-dialog
      :dialog-id="dialog.edit"
      :loader-id="loader.edit"
      :disable-save="false"
      :is-edit="!state.form.id"
      max-width="500px"
      name="usuário"
      @clear-edit-dialog="clearEditDialog"
      @submit="save"
    >
      <template #content>
        <q-card-section class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input
              label="Nome"
              :rules="[requiredRule]"
              v-model="state.form.name"
              v-bind="$vInput"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-input
              label="Email"
              :rules="[requiredRule, emailRule]"
              v-bind="$vInput"
              v-model="state.form.email"
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
              label="Tipo de usuário"
              v-model="state.form.roles"
              :rules="[requiredRule]"
              :options="rolesOptions"
              v-bind="$vSelect"
              multiple
              use-chips
            >
              <template v-slot:selected-item="scope">
                <chip-select :scope="scope" />
              </template>
            </q-select>
          </div>

          <div class="col-12" v-if="state.form.id">
            <q-toggle
              v-model="state.alterPassword"
              class="q-mb-md"
              dense
              label="Alterar senha"
            />
          </div>

          <template v-if="!state.form.id || state.alterPassword">
            <div class="col-12 col-md-6">
              <q-input
                label="Senha"
                :rules="[requiredRule, strongPasswordRule]"
                :type="state.visiblePassword ? 'text' : 'password'"
                v-bind="$vInput"
                v-model="state.form.password"
              >
                <template v-slot:append>
                  <q-icon
                    @click="state.visiblePassword = !state.visiblePassword"
                    :name="
                      state.visiblePassword ? 'visibility' : 'visibility_off'
                    "
                    class="cursor-pointer"
                  />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-6">
              <q-input
                label="Confirmar senha"
                :type="state.visiblePassword ? 'text' : 'password'"
                :rules="[
                  requiredRule,
                  strongPasswordRule,
                  (v: string) => equalPasswordRule(v, state.form.password),
                ]"
                v-bind="$vInput"
                v-model="state.form.confirmPassword"
              >
                <template v-slot:append>
                  <q-icon
                    @click="state.visiblePassword = !state.visiblePassword"
                    :name="
                      state.visiblePassword ? 'visibility' : 'visibility_off'
                    "
                    class="cursor-pointer"
                  />
                </template>
              </q-input>
            </div>
          </template>
        </q-card-section>
      </template>
    </edit-dialog>
  </q-page>
</template>
<script setup lang="ts">
import ActionDialog from 'src/components/dialog/ActionDialog.vue'
import ActionHeader from 'src/components/action-header/ActionHeader.vue'
import StatusRow from 'src/components/table/StatusRow.vue'
import EditDialog from 'src/components/dialog/EditDialog.vue'
import ChipSelect from 'src/components/select/ChipSelect.vue'
import { onMounted } from 'vue'
import { useUser } from './useUser'
import { userTableColumns } from './user.const'
import {
  equalPasswordRule,
  requiredRule,
  strongPasswordRule,
} from 'src/validations/form-rules/mixedRules.util'
import { rolesOptions } from 'src/constants/roles.const'
import { statusOptions } from 'src/constants/status.const'
import { emailRule } from 'src/validations/form-rules/stringRules.util'

const {
  state,
  dialog,
  loader,
  save,
  fetchList,
  loaderStatus,
  createDialog,
  confirmAction,
  openEditDialog,
  clearEditDialog,
  openActionDialog,
} = useUser()

onMounted(async () => {
  await fetchList()
  createDialog([dialog.edit])
})
</script>
