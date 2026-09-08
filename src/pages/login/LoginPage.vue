<template>
  <q-form @submit="handleLogin" class="flex justify-center q-mt-lg q-pa-lg">
    <q-card
      class="container q-pa-md shadow-0 full-width"
      bordered
      style="max-width: 500px"
    >
      <q-card-section class="text-center">
        <q-img :src="logo" width="186px" />
        <div class="text-caption">Entre com os seus dados para começar</div>
      </q-card-section>
      <q-card-section class="column gap-sm">
        <q-input
          v-model="state.email"
          dense
          outlined
          label="Email"
          :disable="loaderStatus(Loader.login)"
          :rules="[emailRule]"
        ></q-input>
        <q-input
          v-model="state.password"
          dense
          outlined
          type="password"
          label="Senha"
          :disable="loaderStatus(Loader.login)"
          :rules="[requiredRule]"
        ></q-input>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-btn
          type="submit"
          color="primary"
          size="md"
          label="Entrar"
          no-caps
          class="full-width"
          :loading="loaderStatus(Loader.login)"
        ></q-btn>
      </q-card-section>
    </q-card>
  </q-form>
</template>
<script lang="ts" setup>
import logo from 'assets/img/logo/logo.webp'
import requester from 'src/helpers/requester/Requester.helper'
import { useAuth } from 'src/composables/useAuth'
import { ref } from 'vue'
import { useLoader } from 'src/composables/useLoader'
import { emailRule } from 'src/validations/form-rules/stringRules.util'
import { requiredRule } from 'src/validations/form-rules/mixedRules.util'

interface IState {
  email: string
  password: string
}

enum Loader {
  login = 'login',
}

const state = ref({
  email: 'dev@leadmedia.com.br',
  password: 'soeuseiasenha123',
} as IState)

const { login } = useAuth()
const { loaderStatus } = useLoader()

async function handleLogin() {
  await requester.dispatch({
    callback: async () => {
      await login(state.value.email, state.value.password)
    },
    errorMessageTitle: 'Houve um erro',
    errorMessage: 'Não foi possível realizar o login',
    loaders: [Loader.login],
  })
}
</script>
