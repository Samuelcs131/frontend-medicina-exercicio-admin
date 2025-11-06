import { useDialog } from 'src/composables/useDialog'
import { useLoader } from 'src/composables/useLoader'
import { Status } from 'src/enums/Status.enum'
import { cloneDeep } from 'src/utils/clone.util'
import { ref } from 'vue'
import requester from 'src/helpers/requester/Requester.helper'
import * as SubspecialtyGroupService from 'src/services/speciality/subspecialtyGroup.service'
import { ActionDialogOptions } from 'src/enums/ActionDialogOptions.enum'
import type { ISubspecialtyGroup } from 'src/types/specialty/ISubspecialtyGroup.type'

interface IState {
  form: {
    id?: string
    name: string
    imageURL: string
    description: string
    imageFile: File | null
    status: Status
  }
  list: ISubspecialtyGroup[]
  filter: string
  actionType: ActionDialogOptions
  actionsData: ISubspecialtyGroup[]
}

export function useSubspecialtyGroup() {
  const initState: IState = {
    form: {
      status: Status.active,
      imageURL: '',
      imageFile: null,
      name: '',
      description: '',
    },
    actionsData: [],
    actionType: ActionDialogOptions.delete,
    filter: '',
    list: [],
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

  async function fetchList() {
    await requester.dispatch({
      callback: async () => {
        state.value.list = await SubspecialtyGroupService.getAll()
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
          await SubspecialtyGroupService.save(
            id,
            state.value.form.name,
            state.value.form.description,
            state.value.form.imageURL,
            state.value.form.status,
          )
        else
          await SubspecialtyGroupService.create(
            state.value.form.name,
            state.value.form.description,
            state.value.form.imageURL,
          )
      },
      successCallback: async () => {
        toggleDialog(dialog.edit)
        await fetchList()
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
          await SubspecialtyGroupService.deleteItem(ids)
        if (actionType == ActionDialogOptions.disable)
          await SubspecialtyGroupService.disable(ids)
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

  function openEditDialog(item?: ISubspecialtyGroup) {
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
