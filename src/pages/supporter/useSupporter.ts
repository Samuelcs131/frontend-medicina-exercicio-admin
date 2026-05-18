import { useDialog } from 'src/composables/useDialog'
import { useListTableRequest } from 'src/composables/useListTableRequest'
import { useLoader } from 'src/composables/useLoader'
import { Status } from 'src/enums/Status.enum'
import { cloneDeep } from 'src/utils/clone.util'
import { ref } from 'vue'
import requester from 'src/helpers/requester/Requester.helper'
import * as SupporterService from 'src/services/supporter/supporter.service'
import { ActionDialogOptions } from 'src/enums/ActionDialogOptions.enum'
import { ISupporter } from 'src/types/supporter/ISupporter.type'

const DEFAULT_SORT = 'name'

interface IState {
  form: {
    id?: string
    name: string
    imageURL: string
    imageFile: File | null
    url: string
    status: Status
  }
  list: ISupporter[]
  actionType: ActionDialogOptions
  actionsData: ISupporter[]
  activeOnly: boolean
}

export function useSupporter() {
  const initState: IState = {
    form: {
      status: Status.active,
      imageURL: '',
      imageFile: null,
      name: '',
      url: '',
    },
    actionsData: [],
    actionType: ActionDialogOptions.delete,
    list: [],
    activeOnly: true,
  }

  const dialog = {
    edit: 'edit-h456hg3qgfc',
    action: 'action-n756h53gvw4',
  }

  const loader = {
    list: 'list-h456hg3qgfc',
    edit: 'edit-6535gfcx',
    action: 'action-n756h53gvw4',
  }

  const state = ref<IState>(cloneDeep(initState))
  const { createDialog, toggleDialog, dialogIsOpen } = useDialog()
  const { loaderStatus } = useLoader()

  const { filter, pagination, tableLoading, onRequest, refreshCurrentPage } =
    useListTableRequest<ISupporter>({
      defaultOrdertype: DEFAULT_SORT,
      defaultDescending: true,
      initialRowsPerPage: 40,
      loaderListId: loader.list,
      fetchPage: (q) =>
        SupporterService.getListPaginated({
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
          await SupporterService.save(
            id,
            state.value.form.name,
            state.value.form.status,
            state.value.form.imageFile,
            state.value.form.url,
          )
        else
          await SupporterService.create(
            state.value.form.name,
            state.value.form.imageFile!,
            state.value.form.url,
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
          await SupporterService.deleteItem(ids)
        if (actionType == ActionDialogOptions.disable)
          await SupporterService.disable(ids)
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

  function openEditDialog(item?: ISupporter) {
    if (item)
      state.value.form = {
        id: item.id,
        name: item.name,
        imageURL: item.imageURL,
        imageFile: null,
        url: item.url || '',
        status: item.status,
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

  function addFile(files: readonly File[]) {
    const [file] = files
    state.value.form.imageFile = file as File
  }

  function removeFile() {
    state.value.form.imageFile = null
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
