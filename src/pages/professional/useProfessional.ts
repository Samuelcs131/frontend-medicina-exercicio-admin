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
import * as VideoService from 'src/services/video/video.service'
import { ActionDialogOptions } from 'src/enums/ActionDialogOptions.enum'
import type { IProfessional } from 'src/types/professional/IProfessional.type'
import type { IBasicEntity } from 'src/types/IBasicEntity.type'
import { IVideo } from 'src/types/video/IVideo.type'
import { ICity } from 'src/types/city/ICity.type'
import { ISubspecialty } from 'src/types/specialty/ISubspecialty.type'

interface IState {
  form: {
    id?: string
    name: string
    RQN: string | null
    CRM: string | null
    imageURL: string
    specialtyIds: string[]
    stateIds: string[]
    cityIds: string[]
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
    recomendations: {
      specialtyIds: string[]
      professionalVideoIds: string[]
      professionalIds: string[]
    }
  }
  options: {
    specialty: IBasicEntity<string>[]
    subspecialty: ISubspecialty[]
    localsService: IBasicEntity<string>[]
    states: IBasicEntity<string>[]
    cities: ICity[]
    videos: IVideo[]
    professionals: IProfessional[]
  }
  optionsData: {
    specialty: IBasicEntity<string>[]
    subspecialty: ISubspecialty[]
    localsService: IBasicEntity<string>[]
    states: IBasicEntity<string>[]
    cities: ICity[]
    videos: IVideo[]
    professionals: IProfessional[]
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
      cityIds: [],
      stateIds: [],
      recomendations: {
        specialtyIds: [],
        professionalVideoIds: [],
        professionalIds: [],
      },
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
      videos: [],
      professionals: [],
    },
    optionsData: {
      specialty: [],
      subspecialty: [],
      localsService: [],
      cities: [],
      states: [],
      videos: [],
      professionals: [],
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
        if (!state.value.options.states.length) await fetchOptions()

        const professionals = await ProfessionalService.getAll()
        state.value.list = professionals
        state.value.optionsData.professionals = professionals
        state.value.options.professionals = professionals
      },
      errorMessageTitle: 'Houve um erro',
      errorMessage: 'Não foi possível buscar os dados',
      loaders: [loader.list],
    })
  }

  async function fetchOptions() {
    await requester.dispatch({
      callback: async () => {
        const [subspecialty, specialty, localsService, states, cities, videos] =
          await Promise.all([
            SubspecialtyService.getAll(),
            SpecialtyService.getAll(),
            LocalServiceService.getAll(),
            StateService.getAll(),
            CityService.getAll(),
            VideoService.getAll(),
          ])

        const options = {
          ...state.value.options,
          specialty,
          subspecialty,
          localsService,
          cities,
          states,
          videos,
        }

        state.value.options = cloneDeep(options)
        state.value.optionsData = cloneDeep(options)
      },
      errorMessageTitle: 'Houve um erro',
      errorMessage: 'Não foi possível buscar os dados',
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
            state.value.form.curriculumLattes,
            state.value.form.cityIds,
            state.value.form.stateIds,
            state.value.form.recomendations,
            state.value.form.status,
            state.value.form.imageFile,
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
            state.value.form.curriculumLattes,
            state.value.form.cityIds,
            state.value.form.stateIds,
            state.value.form.recomendations,
            state.value.form.imageFile,
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
    if (item) {
      state.value.form = {
        ...item,
        imageFile: null,
        cityIds: item.cities.map((item) => item.id),
        stateIds: item.states.map((item) => item.id),
      }

      state.value.options.videos = state.value.optionsData.videos.filter(
        (video) => video.professionalIds.includes(item.id),
      )

      state.value.options.professionals =
        state.value.optionsData.professionals.filter(
          (professional) => item.id != professional.id,
        )
    } else clearEditDialog()

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
