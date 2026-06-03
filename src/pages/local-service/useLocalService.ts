import { useDialog } from 'src/composables/useDialog'
import { useListTableRequest } from 'src/composables/useListTableRequest'
import { useLoader } from 'src/composables/useLoader'
import { Status } from 'src/enums/Status.enum'
import { cloneDeep } from 'src/utils/clone.util'
import { ref } from 'vue'
import requester from 'src/helpers/requester/Requester.helper'
import * as LocalServiceService from 'src/services/local-service/localService.service'
import * as StateService from 'src/services/location/state.service'
import * as CityService from 'src/services/location/city.service'
import * as CEPService from 'src/services/cep.service'
import { ActionDialogOptions } from 'src/enums/ActionDialogOptions.enum'
import type { ILocalService } from 'src/types/local-service/ILocalService.type'
import { ICity } from 'src/types/city/ICity.type'
import { IBasicEntity } from 'src/types/IBasicEntity.type'

const DEFAULT_SORT = 'name'

interface IState {
  form: {
    id?: string
    name: string
    street: string
    state: string
    city: string
    number: number
    coordinates: string
    status: Status
    cep: string
    linkGoogleMaps: string
  }
  options: {
    states: IBasicEntity<string>[]
    cities: ICity[]
  }
  optionsData: {
    cities: ICity[]
    states: IBasicEntity<string>[]
  }
  list: ILocalService[]
  actionType: ActionDialogOptions
  actionsData: ILocalService[]
  activeOnly: boolean
}

export function useLocalService() {
  const initState: IState = {
    form: {
      status: Status.active,
      name: '',
      city: '',
      coordinates: '',
      state: '',
      street: '',
      number: 0,
      cep: '',
      linkGoogleMaps: '',
    },
    options: {
      cities: [],
      states: [],
    },
    optionsData: {
      cities: [],
      states: [],
    },
    actionsData: [],
    actionType: ActionDialogOptions.delete,
    list: [],
    activeOnly: true,
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

  const { filter, pagination, tableLoading, onRequest, refreshCurrentPage } =
    useListTableRequest<ILocalService>({
      defaultOrdertype: DEFAULT_SORT,
      defaultDescending: true,
      initialRowsPerPage: 40,
      loaderListId: loader.list,
      fetchPage: (q) =>
        LocalServiceService.getListPaginated({
          ...q,
          all: !state.value.activeOnly,
        }),
      applyResponse: (res) => {
        state.value.list = res.data
      },
    })

  async function getLocationByCEP() {

    if (state.value.form.cep.length !== 8) return

    await requester.dispatch({
      callback: async () => {
        const location = await CEPService.getLocationByCEP(state.value.form.cep)

        state.value.form.state = location.state
        state.value.form.city = location.city
        state.value.form.street = location.street
      },
      errorMessageTitle: 'Houve um erro',
      errorMessage: 'Não foi possível buscar os dados',
    })
  }

  async function fetchOptions() {
    await requester.dispatch({
      callback: async () => {
        const [states, cities] = await Promise.all([
          StateService.getAll(),
          CityService.getAll(),
        ])

        const options = { states, cities }

        state.value.options = cloneDeep(options)
        state.value.optionsData = cloneDeep(options)
      },
      errorMessageTitle: 'Houve um erro',
      errorMessage: 'Não foi possível buscar os dados',
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
            state.value.form.state,
            state.value.form.city,
            state.value.form.street,
            state.value.form.coordinates,
            state.value.form.cep,
            state.value.form.number,
            state.value.form.linkGoogleMaps,
            state.value.form.status,
          )
        else
          await LocalServiceService.create(
            state.value.form.name,
            state.value.form.state,
            state.value.form.city,
            state.value.form.street,
            state.value.form.coordinates,
            state.value.form.cep,
            state.value.form.number,
            state.value.form.linkGoogleMaps,
            state.value.form.status,
          )
      },
      successCallback: async () => {
        toggleDialog(dialog.edit)
        await refreshCurrentPage()
      },
      successMessageTitle: `${id ? 'Editado' : 'Cadastrado'} com sucesso`,
      errorMessageTitle: 'Houve um erro',
      errorMessage: `Não foi possível ${state.value.form.id ? 'editar' : 'salvar'
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
        await refreshCurrentPage()
      },
      successMessageTitle: 'Concluído com sucesso',
      errorMessageTitle: 'Houve um erro',
      errorMessage: 'Não foi possível realizar a ação',
      loaders: [loader.action],
    })
  }

  function openEditDialog(item?: ILocalService) {
    if (item)
      state.value.form = { ...item }
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

  async function toggleActiveOnly(activeOnly: boolean) {
    state.value.activeOnly = activeOnly
    pagination.value.page = 1
    await refreshCurrentPage()
  }

  return {
    state,
    filter,
    pagination,
    tableLoading,
    dialog,
    loader,
    save,
    onRequest,
    fetchOptions,
    toggleDialog,
    dialogIsOpen,
    createDialog,
    loaderStatus,
    confirmAction,
    openGoogleMaps,
    openEditDialog,
    clearEditDialog,
    openActionDialog,
    toggleActiveOnly,
    getLocationByCEP,
  }
}
