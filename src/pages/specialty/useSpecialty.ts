import { useDialog } from 'src/composables/useDialog'
import { useListTableRequest } from 'src/composables/useListTableRequest'
import { useLoader } from 'src/composables/useLoader'
import { Status } from 'src/enums/Status.enum'
import { cloneDeep } from 'src/utils/clone.util'
import { ref } from 'vue'
import requester from 'src/helpers/requester/Requester.helper'
import * as SpecialtyService from 'src/services/speciality/specialty.service'
import * as ProfessionalAreaService from 'src/services/professional/professionalArea.service'
import type { IProfessionalAreaNameOption } from 'src/services/professional/professionalArea.service'
import { ActionDialogOptions } from 'src/enums/ActionDialogOptions.enum'
import type { ISpecialty } from 'src/types/specialty/ISpecialty.type'

const DEFAULT_SORT = 'name'

interface IState {
  form: {
    id?: string
    name: string
    professionalAreaId: string
    status: Status
  }
  options: {
    professionalAreas: IProfessionalAreaNameOption[]
  }
  list: ISpecialty[]
  actionType: ActionDialogOptions
  actionsData: ISpecialty[]
  activeOnly: boolean
}

export function useSpecialty() {
  const initState: IState = {
    form: {
      status: Status.active,
      name: '',
      professionalAreaId: '',
    },
    options: {
      professionalAreas: [],
    },
    actionsData: [],
    actionType: ActionDialogOptions.delete,
    list: [],
    activeOnly: true,
  }

  const dialog = {
    edit: 'edit-sdfghhdfa',
    action: 'action-dasgh5623',
  }

  const loader = {
    list: 'list-sdfghhdfa',
    edit: 'edit-h561e2fvg45r',
    action: 'action-dasgh5623',
  }

  const state = ref<IState>(cloneDeep(initState))
  const { createDialog, toggleDialog, dialogIsOpen } = useDialog()
  const { loaderStatus } = useLoader()

  const { filter, pagination, tableLoading, onRequest, refreshCurrentPage } =
    useListTableRequest<ISpecialty>({
      defaultOrdertype: DEFAULT_SORT,
      allowedOrdertypes: ['name', 'status'],
      defaultDescending: true,
      initialRowsPerPage: 40,
      loaderListId: loader.list,
      fetchPage: (q) =>
        SpecialtyService.getListPaginated({
          ...q,
          all: !state.value.activeOnly,
        }),
      applyResponse: (res) => {
        state.value.list = res.data
      },
    })

  async function fetchOptions() {
    await requester.dispatch({
      callback: async () => {
        state.value.options.professionalAreas =
          await ProfessionalAreaService.getAllNames()
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
          await SpecialtyService.save(
            id,
            state.value.form.name,
            state.value.form.professionalAreaId,
            state.value.form.status,
          )
        else
          await SpecialtyService.create(
            state.value.form.name,
            state.value.form.professionalAreaId,
          )
      },
      successCallback: async () => {
        toggleDialog(dialog.edit)
        await refreshCurrentPage()
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
          await SpecialtyService.deleteItem(ids)
        if (actionType == ActionDialogOptions.disable)
          await SpecialtyService.disable(ids)
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

  function openEditDialog(item?: ISpecialty) {
    if (item)
      state.value.form = {
        ...item,
        professionalAreaId: item.professionalArea?.id ?? '',
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
