import { useDialog } from 'src/composables/useDialog'
import { useLoader } from 'src/composables/useLoader'
import { Status } from 'src/enums/Status.enum'
import { cloneDeep } from 'src/utils/clone.util'
import { ref } from 'vue'
import requester from 'src/helpers/requester/Requester.helper'
import * as ProfessionalService from 'src/services/professional/professional.service'
import * as SubspecialtyService from 'src/services/speciality/subspecialty.service'
import * as SpecialtyService from 'src/services/speciality/specialty.service'
import * as LocalServiceService from 'src/services/local-service/localService.service'
import * as StateService from 'src/services/location/state.service'
import * as CityService from 'src/services/location/city.service'
import { ActionDialogOptions } from 'src/enums/ActionDialogOptions.enum'
import type { IProfessional } from 'src/types/professional/IProfessional.type'
import type { IBasicEntity } from 'src/types/IBasicEntity.type'

interface IState {
  form: {
    id?: string
    name: string
    RQN: string
    CRM: string
    imageURL: string
    specialtyIds: string[]
    stateId: string
    cityId: string
    subspecialtyIds: string[]
    aboutMy: string
    localServiceIds: string[]
    instagram: string
    site: string
    teleconsultation: boolean
    speakEnglish: boolean
    status: Status
    curriculumLattes: string
    imageFile: File | null
  }
  options: {
    specialty: IBasicEntity<string>[]
    subspecialty: IBasicEntity<string>[]
    localsService: IBasicEntity<string>[]
    states: IBasicEntity<string>[]
    cities: IBasicEntity<string>[]
  }
  list: IProfessional[]
  filter: string
  actionType: ActionDialogOptions
  actionsData: IProfessional[]
}

export function useProfessional() {
  const initState: IState = {
    form: {
      status: Status.active,
      imageURL: '',
      imageFile: null,
      name: '',
      RQN: '',
      CRM: '',
      specialtyIds: [],
      subspecialtyIds: [],
      aboutMy: '',
      localServiceIds: [],
      instagram: '',
      site: '',
      curriculumLattes: '',
      teleconsultation: false,
      speakEnglish: false,
      cityId: '',
      stateId: '',
    },
    actionsData: [],
    actionType: ActionDialogOptions.delete,
    filter: '',
    list: [],
    options: {
      specialty: [],
      subspecialty: [],
      localsService: [],
      cities: [],
      states: [],
    },
  }

  const dialog = {
    edit: 'edit-78lk6j5h4g3',
    action: 'action-5j5623',
  }

  const loader = {
    list: 'list-78lk6j5h4g3',
    edit: 'edit-6h35g4f2',
    action: 'action-5j5623',
  }

  const state = ref<IState>(cloneDeep(initState))
  const { createDialog, toggleDialog, dialogIsOpen } = useDialog()
  const { loaderStatus } = useLoader()

  async function fetchList() {
    await requester.dispatch({
      callback: async () => {
        const [subspecialty, specialty, localsService, states, cities] =
          await Promise.all([
            await SubspecialtyService.getAll(),
            await SpecialtyService.getAll(),
            await LocalServiceService.getAll(),
            await StateService.getAll(),
            await CityService.getAll(),
          ])

        state.value.options = {
          specialty,
          subspecialty,
          localsService,
          cities,
          states,
        }
        state.value.list = await ProfessionalService.getAll()
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
          await ProfessionalService.save(
            id,
            state.value.form.name,
            state.value.form.RQN,
            state.value.form.CRM,
            state.value.form.specialtyIds,
            state.value.form.subspecialtyIds,
            state.value.form.aboutMy,
            state.value.form.localServiceIds,
            state.value.form.instagram,
            state.value.form.site,
            state.value.form.teleconsultation,
            state.value.form.speakEnglish,
            state.value.form.imageFile,
            state.value.form.curriculumLattes,
          )
        else
          await ProfessionalService.create(
            state.value.form.name,
            state.value.form.RQN,
            state.value.form.CRM,
            state.value.form.specialtyIds,
            state.value.form.subspecialtyIds,
            state.value.form.aboutMy,
            state.value.form.localServiceIds,
            state.value.form.instagram,
            state.value.form.site,
            state.value.form.teleconsultation,
            state.value.form.speakEnglish,
            state.value.form.imageFile!,
            state.value.form.curriculumLattes,
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
          await ProfessionalService.deleteItem(ids)
        if (actionType == ActionDialogOptions.disable)
          await ProfessionalService.disable(ids)
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

  function openEditDialog(item?: IProfessional) {
    if (item)
      state.value.form = {
        ...item,
        imageFile: null,
        cityId: item.city.id,
        stateId: item.state.id,
        specialtyIds: item.specialties.map((item) => item.id),
        subspecialtyIds: item.subspecialties.map((item) => item.id),
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
