import { useDialog } from 'src/composables/useDialog'
import { useLoader } from 'src/composables/useLoader'
import { Status } from 'src/enums/Status.enum'
import type { IProfissionalArea } from 'src/types/specialty/IProfissionalArea.type'
import { cloneDeep } from 'src/utils/clone.util'
import { ref } from 'vue'
import requester from 'src/helpers/requester/Requester.helper'
import * as ProfessionalAreaService from 'src/services/speciality/professionalArea.service'
import { ActionDialogOptions } from 'src/enums/ActionDialogOptions.enum'

interface IState {
  form: {
    id?: string
    name: string
    imageURL: string
    imageFile: File | null
    status: Status
  }
  list: IProfissionalArea[]
  filter: string
  actionType: ActionDialogOptions
  actionsData: IProfissionalArea[]
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
    filter: '',
    list: [],
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

  async function fetchList() {
    await requester.dispatch({
      callback: async () => {
        state.value.list = await ProfessionalAreaService.getAll()
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
          await ProfessionalAreaService.save(
            id,
            state.value.form.name,
            state.value.form.imageFile,
          )
        else
          await ProfessionalAreaService.create(
            state.value.form.name,
            state.value.form.imageFile!,
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
          await ProfessionalAreaService.deleteItem(ids)
        if (actionType == ActionDialogOptions.disable)
          await ProfessionalAreaService.disable(ids)
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

  function addFile(files: readonly File[]) {
    const [file] = files
    state.value.form.imageFile = file as File
  }

  function removeFile() {
    state.value.form.imageFile = null
  }

  return {
    state,
    dialog,
    loader,
    save,
    addFile,
    fetchList,
    removeFile,
    toggleDialog,
    dialogIsOpen,
    createDialog,
    loaderStatus,
    confirmAction,
    openEditDialog,
    clearEditDialog,
    openActionDialog,
  }
}
