import { useDialog } from 'src/composables/useDialog'
import { useLoader } from 'src/composables/useLoader'
import { Status } from 'src/enums/Status.enum'
import { cloneDeep } from 'src/utils/clone.util'
import { ref } from 'vue'
import requester from 'src/helpers/requester/Requester.helper'
import * as LocalServiceService from 'src/services/local-service/localService.service'
import * as StateService from 'src/services/location/state.service'
import * as CityService from 'src/services/location/city.service'
import { ActionDialogOptions } from 'src/enums/ActionDialogOptions.enum'
import type { IBasicEntity } from 'src/types/IBasicEntity.type'
import type { ILocalService } from 'src/types/local-service/ILocalService.type'

interface IState {
  form: {
    id?: string
    name: string
    contact: string
    hasWhatsapp: boolean
    stateId: string
    cityId: string
    street: string
    coordinates: string
    status: Status
  }
  options: {
    states: IBasicEntity<string>[]
    cities: IBasicEntity<string>[]
  }
  list: ILocalService[]
  filter: string
  actionType: ActionDialogOptions
  actionsData: ILocalService[]
}

export function useLocalService() {
  const initState: IState = {
    form: {
      status: Status.active,
      name: '',
      cityId: '',
      contact: '',
      coordinates: '',
      hasWhatsapp: false,
      stateId: '',
      street: '',
    },
    options: {
      cities: [],
      states: [],
    },
    actionsData: [],
    actionType: ActionDialogOptions.delete,
    filter: '',
    list: [],
  }

  const dialog = {
    edit: 'edit-45h23j756k32',
    example: 'example-45h23j756k32',
    action: 'action-k6723f5gh',
  }

  const loader = {
    list: 'list-45h23j756k32',
    edit: 'edit-1e12f342f',
    action: 'action-k6723f5gh',
  }

  const state = ref<IState>(cloneDeep(initState))
  const { createDialog, toggleDialog, dialogIsOpen } = useDialog()
  const { loaderStatus } = useLoader()

  async function fetchList() {
    await requester.dispatch({
      callback: async () => {
        state.value.options = {
          states: await StateService.getAll(),
          cities: await CityService.getAll(),
        }

        state.value.list = await LocalServiceService.getAll()
      },
      errorMessageTitle: 'Houve um erro',
      errorMessage: 'Não foi possível buscar os dados',
      loaders: [loader.list],
    })
  }

  async function save() {
    const id = state.value.form.id

    await requester.dispatch({
      callback: async () => {
        if (id)
          await LocalServiceService.save(
            id,
            state.value.form.name,
            state.value.form.cityId,
            state.value.form.stateId,
            state.value.form.hasWhatsapp,
            state.value.form.street,
            state.value.form.contact,
            state.value.form.coordinates,
          )
        else
          await LocalServiceService.create(
            state.value.form.name,
            state.value.form.cityId,
            state.value.form.stateId,
            state.value.form.hasWhatsapp,
            state.value.form.street,
            state.value.form.contact,
            state.value.form.coordinates,
          )
      },
      successCallback: async () => {
        await fetchList()
        toggleDialog(dialog.edit)
      },
      successMessageTitle: `${id ? 'Editado' : 'Cadastrado'} com sucesso`,
      errorMessageTitle: 'Houve um erro',
      errorMessage: `Não foi possível ${
        state.value.form.id ? 'editar' : 'salvar'
      }`,
      loaders: [loader.edit],
    })
  }

  async function confirmAction() {
    await requester.dispatch({
      callback: async () => {
        const { actionType } = state.value

        const ids = state.value.actionsData.map((item) => item.id)

        if (actionType == ActionDialogOptions.delete)
          await LocalServiceService.deleteItem(ids)
        if (actionType == ActionDialogOptions.disable)
          await LocalServiceService.disable(ids)
      },
      successCallback: async () => {
        toggleDialog(dialog.action)
        state.value.actionsData = []
        await fetchList()
      },
      successMessageTitle: 'Concluído com sucesso',
      errorMessageTitle: 'Houve um erro',
      errorMessage: 'Não foi possível realizar a ação',
      loaders: [loader.action],
    })
  }

  function openEditDialog(item?: ILocalService) {
    if (item)
      state.value.form = {
        ...item,
        cityId: item.city.id,
        stateId: item.state.id,
      }
    else clearEditDialog()

    toggleDialog(dialog.edit)
  }

  function clearEditDialog() {
    state.value.form = cloneDeep(initState.form)
  }

  function openActionDialog(action: ActionDialogOptions) {
    state.value.actionType = action
    toggleDialog(dialog.action)
  }

  function openGoogleMaps(street: string) {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(street)}`
    window.open(url, '_blank')
  }

  return {
    state,
    dialog,
    loader,
    save,
    fetchList,
    toggleDialog,
    dialogIsOpen,
    createDialog,
    loaderStatus,
    confirmAction,
    openGoogleMaps,
    openEditDialog,
    clearEditDialog,
    openActionDialog,
  }
}
