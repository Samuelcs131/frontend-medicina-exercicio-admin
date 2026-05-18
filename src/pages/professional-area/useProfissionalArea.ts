import { useDialog } from 'src/composables/useDialog'
import { useListTableRequest } from 'src/composables/useListTableRequest'
import { useLoader } from 'src/composables/useLoader'
import { Status } from 'src/enums/Status.enum'
import type { IProfissionalArea } from 'src/types/specialty/IProfissionalArea.type'
import { cloneDeep } from 'src/utils/clone.util'
import { ref } from 'vue'
import requester from 'src/helpers/requester/Requester.helper'
import * as ProfessionalAreaService from 'src/services/professional/professionalArea.service'
import { ActionDialogOptions } from 'src/enums/ActionDialogOptions.enum'

const DEFAULT_SORT = 'name'

interface IState {
  form: {
    id?: string
    name: string
    imageURL: string
    imageFile: File | null
    status: Status
  }
  list: IProfissionalArea[]
  actionType: ActionDialogOptions
  actionsData: IProfissionalArea[]
  activeOnly: boolean
}

export function useProfissionalArea() {
  const initState: IState = {
    form: {
      status: Status.active,
      imageURL: '',
      imageFile: null,
      name: '',
    },
    actionsData: [],
    actionType: ActionDialogOptions.delete,
    list: [],
    activeOnly: true,
  }

  const dialog = {
    edit: 'edit-h54j4f14j5',
    action: 'action-h54hgf326h45',
  }

  const loader = {
    list: 'list-h54j4f14j5',
    edit: 'edit-5hg2q3fh43',
    action: 'action-h54hgf326h45',
  }

  const state = ref<IState>(cloneDeep(initState))
  const { createDialog, toggleDialog, dialogIsOpen } = useDialog()
  const { loaderStatus } = useLoader()

  const { filter, pagination, tableLoading, onRequest, refreshCurrentPage } =
    useListTableRequest<IProfissionalArea>({
      defaultOrdertype: DEFAULT_SORT,
      allowedOrdertypes: ['name', 'status'],
      defaultDescending: true,
      initialRowsPerPage: 40,
      loaderListId: loader.list,
      fetchPage: (q) =>
        ProfessionalAreaService.getListPaginated({
          ...q,
          all: !state.value.activeOnly,
        }),
      applyResponse: (res) => {
        state.value.list = res.data
      },
    })

  async function save() {
    const id = state.value.form.id

    await requester.dispatch({
      callback: async () => {
        if (id)
          await ProfessionalAreaService.save(
            id,
            state.value.form.name,
            state.value.form.imageFile,
            state.value.form.status,
          )
        else
          await ProfessionalAreaService.create(
            state.value.form.name,
            state.value.form.imageFile!,
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
          await ProfessionalAreaService.deleteItem(ids)
        if (actionType == ActionDialogOptions.disable)
          await ProfessionalAreaService.disable(ids)
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

  function openEditDialog(item?: IProfissionalArea) {
    if (item)
      state.value.form = {
        ...item,
        imageFile: null,
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

  function addFile(files: readonly File[]) {
    const [file] = files
    state.value.form.imageFile = file as File
  }

  function removeFile() {
    state.value.form.imageFile = null
  }

  return {
    state,
    filter,
    pagination,
    tableLoading,
    dialog,
    loader,
    save,
    addFile,
    onRequest,
    removeFile,
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
