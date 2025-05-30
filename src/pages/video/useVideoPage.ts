import { useDialog } from 'src/composables/useDialog'
import { useLoader } from 'src/composables/useLoader'
import { Status } from 'src/enums/Status.enum'
import { cloneDeep } from 'src/utils/clone.util'
import { ref } from 'vue'
import requester from 'src/helpers/requester/Requester.helper'
import * as VideoService from 'src/services/video/video.service'
import * as ProfessionalService from 'src/services/professional/professional.service'
import * as SpecialtyService from 'src/services/speciality/specialty.service'
import * as SubspecialtyService from 'src/services/speciality/subspecialty.service'
import { ActionDialogOptions } from 'src/enums/ActionDialogOptions.enum'
import type { IBasicEntity } from 'src/types/IBasicEntity.type'
import type { IVideo } from 'src/types/video/IVideo.type'

interface IState {
  form: {
    id?: string
    name: string
    url: string
    description: string
    professionalIds: string[]
    specialtyIds: string[]
    subspecialtyIds: string[]
    status: Status
  }
  options: {
    professionals: IBasicEntity<string>[]
    specialties: IBasicEntity<string>[]
    subspecialties: IBasicEntity<string>[]
  }
  list: IVideo[]
  filter: string
  actionType: ActionDialogOptions
  actionsData: IVideo[]
}

export function useVideoPage() {
  const initState: IState = {
    form: {
      status: Status.active,
      name: '',
      url: '',
      description: '',
      professionalIds: [],
      specialtyIds: [],
      subspecialtyIds: [],
    },
    options: {
      professionals: [],
      specialties: [],
      subspecialties: [],
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
        state.value.options = {
          specialties: await SpecialtyService.getAll(),
          professionals: await ProfessionalService.getAll(),
          subspecialties: await SubspecialtyService.getAll(),
        }

        state.value.list = await VideoService.getAll()
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
          await VideoService.save(
            id,
            state.value.form.name,
            state.value.form.url,
            state.value.form.description,
            state.value.form.professionalIds,
            state.value.form.specialtyIds,
          )
        else
          await VideoService.create(
            state.value.form.name,
            state.value.form.url,
            state.value.form.description,
            state.value.form.professionalIds,
            state.value.form.specialtyIds,
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
          await VideoService.deleteItem(ids)
        if (actionType == ActionDialogOptions.disable)
          await VideoService.disable(ids)
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

  function openEditDialog(item?: IVideo) {
    if (item) state.value.form = { ...item }
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
