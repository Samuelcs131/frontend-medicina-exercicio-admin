import { useDialog } from 'src/composables/useDialog'
import { useLoader } from 'src/composables/useLoader'
import { Status } from 'src/enums/Status.enum'
import { cloneDeep } from 'src/utils/clone.util'
import { ref } from 'vue'
import requester from 'src/helpers/requester/Requester.helper'
import * as SubspecialtyService from 'src/services/speciality/subspecialty.service'
import * as SubspecialtyGroupService from 'src/services/speciality/subspecialtyGroup.service'
import * as SpecialtyService from 'src/services/speciality/specialty.service'
import { ActionDialogOptions } from 'src/enums/ActionDialogOptions.enum'
import type { ISubspecialty } from 'src/types/specialty/ISubspecialty.type'
import type { ISubspecialtyGroup } from 'src/types/specialty/ISubspecialtyGroup.type'
import type { ISpecialty } from 'src/types/specialty/ISpecialty.type'

interface IState {
  form: {
    id?: string
    name: string
    subspecialtyGroupId: string
    specialtyId: string
    status: Status
  }
  options: {
    subspecialtyGroups: ISubspecialtyGroup[]
    specialty: ISpecialty[]
  }
  list: ISubspecialty[]
  filter: string
  actionType: ActionDialogOptions
  actionsData: ISubspecialty[]
}

export function useSubspecialty() {
  const initState: IState = {
    form: {
      status: Status.active,
      name: '',
      subspecialtyGroupId: '',
      specialtyId: '',
    },
    options: {
      specialty: [],
      subspecialtyGroups: [],
    },
    actionsData: [],
    actionType: ActionDialogOptions.delete,
    filter: '',
    list: [],
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

  async function fetchList() {
    await requester.dispatch({
      callback: async () => {
        state.value.options = {
          subspecialtyGroups: await SubspecialtyGroupService.getAll(),
          specialty: await SpecialtyService.getAll(),
        }

        state.value.list = await SubspecialtyService.getAll()
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
          await SubspecialtyService.save(
            id,
            state.value.form.name,
            state.value.form.specialtyId,
            state.value.form.subspecialtyGroupId,
          )
        else
          await SubspecialtyService.create(
            state.value.form.name,
            state.value.form.specialtyId,
            state.value.form.subspecialtyGroupId,
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
          await SubspecialtyService.deleteItem(ids)
        if (actionType == ActionDialogOptions.disable)
          await SubspecialtyService.disable(ids)
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

  function openEditDialog(item?: ISubspecialty) {
    if (item)
      state.value.form = {
        ...item,
        specialtyId: item.specialty.id,
        subspecialtyGroupId: item.subspecialtyGroup.id,
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
    openEditDialog,
    clearEditDialog,
    openActionDialog,
  }
}
