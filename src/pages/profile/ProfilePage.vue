<template>
  <q-page class="container q-layout-padding">
    <h1 class="text-h5">Perfil</h1>

    <q-card v-bind="$vCard">
      <q-form @submit="save">
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
              :rules="[requiredRule]"
              v-bind="$vInput"
              v-model="state.form.email"
            />
          </div>

          <div class="col-12">
            <q-toggle
              v-model="state.alterPassword"
              class="q-mb-md"
              dense
              label="Alterar senha"
            />
          </div>

          <template v-if="state.alterPassword">
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
                label="Email"
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

        <q-separator />

        <q-card-actions align="right">
          <q-btn
            color="primary"
            label="Salvar"
            unelevated
            type="submit"
            :loading="loaderStatus(loader.save)"
          />
        </q-card-actions>
      </q-form>
      <q-inner-loading
        :showing="loaderStatus(loader.save) || loaderStatus(loader.fetch)"
      >
        <q-spinner color="primary" size="50px" />
      </q-inner-loading>
    </q-card>
  </q-page>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import {
  equalPasswordRule,
  requiredRule,
  strongPasswordRule,
} from 'src/validations/form-rules/mixedRules.util'
import { useProfile } from './useProfile'

const { state, loader, fetch, save, loaderStatus } = useProfile()

onMounted(async () => {
  await fetch()
})
</script>
