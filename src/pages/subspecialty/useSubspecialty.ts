import { useDialog } from 'src/composables/useDialog'
import { useListTableRequest } from 'src/composables/useListTableRequest'
import { useLoader } from 'src/composables/useLoader'
import { Status } from 'src/enums/Status.enum'
import { cloneDeep } from 'src/utils/clone.util'
import { ref } from 'vue'
import requester from 'src/helpers/requester/Requester.helper'
import * as SubspecialtyService from 'src/services/speciality/subspecialty.service'
import * as SpecialtyService from 'src/services/speciality/specialty.service'
import { ActionDialogOptions } from 'src/enums/ActionDialogOptions.enum'
import type { ISubspecialty } from 'src/types/specialty/ISubspecialty.type'
import type { ISpecialty } from 'src/types/specialty/ISpecialty.type'

const DEFAULT_SORT = 'name'

interface IState {
  form: {
    id?: string
    name: string
    specialtyId: string
    status: Status
  }
  options: {
    specialty: ISpecialty[]
  }
  optionsData: {
    specialty: ISpecialty[]
  }
  list: ISubspecialty[]
  actionType: ActionDialogOptions
  actionsData: ISubspecialty[]
  activeOnly: boolean
  filterSpecialtyId: string
}

export function useSubspecialty() {
  const initState: IState = {
    form: {
      status: Status.active,
      name: '',
      specialtyId: '',
    },
    options: {
      specialty: [],
    },
    optionsData: {
      specialty: [],
    },
    actionsData: [],
    actionType: ActionDialogOptions.delete,
    list: [],
    activeOnly: true,
    filterSpecialtyId: '',
  }

  const dialog = {
    edit: 'edit-h564g3f24g33c',
    action: 'action-j64gyw2fd',
  }

  const loader = {
    list: 'list-h564g3f24g33c',
    edit: 'edit-h564g3f24g33c',
    action: 'action-j64gyw2fd',
  }

  const state = ref<IState>(cloneDeep(initState))
  const { createDialog, toggleDialog, dialogIsOpen } = useDialog()
  const { loaderStatus } = useLoader()

  const { filter, pagination, tableLoading, onRequest, refreshCurrentPage } =
    useListTableRequest<ISubspecialty>({
      defaultOrdertype: DEFAULT_SORT,
      allowedOrdertypes: ['name', 'status'],
      defaultDescending: true,
      initialRowsPerPage: 40,
      loaderListId: loader.list,
      fetchPage: (q) =>
        SubspecialtyService.getListPaginated({
          ...q,
          all: !state.value.activeOnly,
          specialtyId: state.value.filterSpecialtyId,
        }),
      applyResponse: (res) => {
        state.value.list = res.data
      },
    })

  async function fetchOptions() {
    await requester.dispatch({
      callback: async () => {
        const specialty = await SpecialtyService.getAll()

        state.value.options = {
          specialty,
        }
        state.value.optionsData = {
          specialty,
        }
      },
      errorMessageTitle: 'Houve um erro',
      errorMessage: 'Não foi possível buscar as opções',
    })
  }

  async function save() {
    const id = state.value.form.id

    await requester.dispatch({
      callback: async () => {
        if (id)
          await SubspecialtyService.save(
            id,
            state.value.form.name,
            state.value.form.specialtyId,
            state.value.form.status,
          )
        else
          await SubspecialtyService.create(
            state.value.form.name,
            state.value.form.specialtyId,
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
          await SubspecialtyService.deleteItem(ids)
        if (actionType == ActionDialogOptions.disable)
          await SubspecialtyService.disable(ids)
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

  async function openEditDialog(item?: ISubspecialty) {
    if (!state.value.optionsData.specialty.length) {
      await fetchOptions()
    }

    if (state.value.optionsData.specialty.length) {
      state.value.options.specialty = [...state.value.optionsData.specialty]
    }

    if (item)
      state.value.form = {
        ...item,
        specialtyId: item.specialty?.id ?? '',
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
    fetchOptions,
    onRequest,
    refreshCurrentPage,
    toggleDialog,
    dialogIsOpen,
    createDialog,
    loaderStatus,
    confirmAction,
    openEditDialog,
    clearEditDialog,
    openActionDialog,
    toggleActiveOnly,
  }
}
