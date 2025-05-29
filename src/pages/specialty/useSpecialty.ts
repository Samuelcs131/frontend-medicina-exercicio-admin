import { useDialog } from 'src/composables/useDialog'
import { useLoader } from 'src/composables/useLoader'
import { Status } from 'src/enums/Status.enum'
import { cloneDeep } from 'src/utils/clone.util'
import { ref } from 'vue'
import requester from 'src/helpers/requester/Requester.helper'
import * as SpecialtyService from 'src/services/speciality/specialty.service'
import * as MedicalAreaService from 'src/services/speciality/medicalArea.service'
import { ActionDialogOptions } from 'src/enums/ActionDialogOptions.enum'
import type { ISpecialty } from 'src/types/specialty/ISpecialty.type'
import type { IMedicalArea } from 'src/types/specialty/IMedicalArea.type'

interface IState {
  form: {
    id?: string
    name: string
    medicalAreaId: string
    status: Status
  }
  options: {
    medicalAreas: IMedicalArea[]
  }
  list: ISpecialty[]
  filter: string
  actionType: ActionDialogOptions
  actionsData: ISpecialty[]
}

export function useSpecialty() {
  const initState: IState = {
    form: {
      status: Status.active,
      name: '',
      medicalAreaId: '',
    },
    options: {
      medicalAreas: [],
    },
    actionsData: [],
    actionType: ActionDialogOptions.delete,
    filter: '',
    list: [],
  }

  const dialog = {
    edit: 'edit-j64h53wf235g',
    action: 'action-143dsdfcasd',
  }

  const loader = {
    list: 'list-j64h53wf235g',
    edit: 'edit-76kj6h5g32',
    action: 'action-143dsdfcasd',
  }

  const state = ref<IState>(cloneDeep(initState))
  const { createDialog, toggleDialog, dialogIsOpen } = useDialog()
  const { loaderStatus } = useLoader()

  async function fetchList() {
    await requester.dispatch({
      callback: async () => {
        state.value.options.medicalAreas = await MedicalAreaService.getAll()
        state.value.list = await SpecialtyService.getAll()
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
          await SpecialtyService.save(
            id,
            state.value.form.name,
            state.value.form.medicalAreaId,
          )
        else
          await SpecialtyService.create(
            state.value.form.name,
            state.value.form.medicalAreaId,
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
          await SpecialtyService.deleteItem(ids)
        if (actionType == ActionDialogOptions.disable)
          await SpecialtyService.disable(ids)
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

  function openEditDialog(item?: ISpecialty) {
    if (item)
      state.value.form = {
        ...item,
        medicalAreaId: item.medicalArea.id,
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
