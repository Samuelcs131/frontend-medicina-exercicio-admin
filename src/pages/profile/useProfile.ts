import { useLoader } from 'src/composables/useLoader'
import { ref } from 'vue'
import requester from 'src/helpers/requester/Requester.helper'
import * as ProfileService from 'src/services/user/profile.service'
import { useLocalStorage } from 'src/composables/useLocalStorage'
import { LocalStorageKey } from 'src/enums/LocalStorageKey.enum'
import { cloneDeep } from 'src/utils/clone.util'

interface IState {
  visiblePassword: boolean
  alterPassword: boolean
  form: {
    id: string
    name: string
    email: string
    password: string
    confirmPassword: string
  }
}

export function useProfile() {
  const initState: IState = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: {} as any,
    alterPassword: false,
    visiblePassword: false,
  }

  const state = ref<IState>(cloneDeep(initState))

  const loader = {
    save: 'save-213235r34g',
    fetch: 'save-d1243g4g3',
  }

  const { loaderStatus } = useLoader()

  async function fetch() {
    await requester.dispatch({
      callback: async () => {
        const profile = await ProfileService.getProfile()

        state.value.form = {
          ...profile,
          confirmPassword: '',
          password: '',
        }
      },
      successCallback: () => {
        resetPassword()
      },
      errorMessageTitle: 'Houve um erro',
      errorMessage: 'Não foi possível realizar a ação',
      loaders: [loader.fetch],
    })
  }

  async function save() {
    await requester.dispatch({
      callback: async () => {
        await ProfileService.save(
          state.value.form.id,
          state.value.form.email,
          state.value.form.name,
          state.value.form.password,
        )
      },
      successCallback: () => {
        resetPassword()

        const { setLocalStorage, getLocalStorage } = useLocalStorage()

        const user = getLocalStorage(LocalStorageKey.user) || {}

        setLocalStorage(
          LocalStorageKey.user,
          JSON.stringify({
            ...user,
            email: state.value.form.email,
            name: state.value.form.name,
          }),
        )
      },
      successMessageTitle: 'Concluído com sucesso',
      errorMessageTitle: 'Houve um erro',
      errorMessage: 'Não foi possível realizar a ação',
      loaders: [loader.save],
    })
  }

  function resetPassword() {
    state.value.alterPassword = false
    state.value.visiblePassword = false
    state.value.form.password = ''
    state.value.form.confirmPassword = ''
  }

  return { state, loader, save, fetch, loaderStatus }
}
