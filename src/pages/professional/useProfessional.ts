import { useDialog } from 'src/composables/useDialog'
import { useListTableRequest } from 'src/composables/useListTableRequest'
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

const DEFAULT_SORT = 'name'

/** API pode enviar `string[]` ou `{ id: string }[]` (ex.: estados com `sigla`). */
function toIdList(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value
    .map((entry) => {
      if (typeof entry === 'string' || typeof entry === 'number') {
        return String(entry)
      }
      if (entry && typeof entry === 'object' && 'id' in entry) {
        return String((entry as { id: string }).id)
      }
      return ''
    })
    .filter(Boolean)
}

interface IState {
  form: {
    id?: string
    name: string
    RQN: string | null
    CRM: string | null
    imageURL: string
    specialtyIds: string[]
    states: string[]
    cities: string[]
    subspecialtyIds: string[]
    aboutMy: string
    locationService: string[]
    instagram: string
    site: string
    teleconsultation: boolean
    speakEnglish: boolean
    status: Status
    curriculumLattes: string
    imageFile: File | null
    recomendations: {
      professionalVideoIds: string[]
      informativeContentIds: string[]
      otherSpecialtyIds: string[]
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
  actionType: ActionDialogOptions
  actionsData: IProfessional[]
  activeOnly: boolean
  filterSpecialtyId: string
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
      locationService: [],
      instagram: '',
      site: '',
      curriculumLattes: '',
      teleconsultation: false,
      speakEnglish: false,
      cities: [],
      states: [],
      recomendations: {
        professionalVideoIds: [],
        informativeContentIds: [],
        otherSpecialtyIds: [],
      },
    },
    actionsData: [],
    actionType: ActionDialogOptions.delete,
    list: [],
    activeOnly: true,
    filterSpecialtyId: '',
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
  const editFormLoading = ref(false)
  const { createDialog, toggleDialog, dialogIsOpen } = useDialog()
  const { loaderStatus } = useLoader()

  const { filter, pagination, tableLoading, onRequest, refreshCurrentPage } =
    useListTableRequest<IProfessional>({
      defaultOrdertype: DEFAULT_SORT,
      allowedOrdertypes: ['name'],
      defaultDescending: true,
      initialRowsPerPage: 40,
      loaderListId: loader.list,
      fetchPage: (q) =>
        ProfessionalService.getListPaginated({
          ...q,
          all: !state.value.activeOnly,
          specialtyId: state.value.filterSpecialtyId,
        }),
      applyResponse: (res) => {
        const validStatuses = new Set<Status>([Status.active, Status.inactive])
        state.value.list = res.data.map((item) => ({
          ...item,
          // Em profissional, status é obrigatório; normaliza payload inconsistente.
          status: validStatuses.has(item.status)
            ? item.status
            : state.value.activeOnly
              ? Status.active
              : Status.inactive,
        }))
      },
    })

  async function syncProfessionalsOptions() {
    const professionals = await ProfessionalService.getAll()
    state.value.optionsData.professionals = professionals
    state.value.options.professionals = professionals
  }

  async function loadFormCatalog() {
    await requester.dispatch({
      callback: async () => {
        if (!state.value.options.states.length) await fetchOptions()
        await syncProfessionalsOptions()
      },
      errorMessageTitle: 'Houve um erro',
      errorMessage: 'Não foi possível buscar os dados',
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
            state.value.form.locationService,
            state.value.form.instagram,
            state.value.form.site,
            state.value.form.teleconsultation,
            state.value.form.speakEnglish,
            state.value.form.curriculumLattes,
            state.value.form.cities,
            state.value.form.states,
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
            state.value.form.locationService,
            state.value.form.instagram,
            state.value.form.site,
            state.value.form.teleconsultation,
            state.value.form.speakEnglish,
            state.value.form.curriculumLattes,
            state.value.form.cities,
            state.value.form.states,
            state.value.form.imageFile,
          )
      },
      successCallback: async () => {
        toggleDialog(dialog.edit)
        await refreshCurrentPage()
        await syncProfessionalsOptions()
      },
      successMessageTitle: `${id ? 'Editado' : 'Cadastrado'} com sucesso`,
      errorMessageTitle: 'Houve um erro',
      errorMessage: `Não foi possível ${state.value.form.id ? 'editar' : 'salvar'
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
        await refreshCurrentPage()
        await syncProfessionalsOptions()
      },
      successMessageTitle: 'Concluído com sucesso',
      errorMessageTitle: 'Houve um erro',
      errorMessage: 'Não foi possível realizar a ação',
      loaders: [loader.action],
    })
  }

  async function toggleActiveOnly(activeOnly: boolean) {
    state.value.activeOnly = activeOnly
    pagination.value.page = 1
    await refreshCurrentPage()
  }

  function setFormAndOptionsFromProfessional(item: IProfessional) {
    const rec = item.recomendations
    state.value.form = {
      ...item,
      specialtyIds: item.specialtyIds ?? [],
      subspecialtyIds: item.subspecialtyIds ?? [],
      locationService: item.locationService ?? [],
      imageFile: null,
      states: toIdList(item.states),
      cities: toIdList(item.cities),
      recomendations: {
        professionalVideoIds: rec?.professionalVideoIds ?? [],
        informativeContentIds: rec?.informativeContentIds ?? [],
        otherSpecialtyIds: rec?.otherSpecialtyIds ?? [],
      },
    }

    state.value.options.specialty = [...state.value.optionsData.specialty]
    state.value.options.states = [...state.value.optionsData.states]
    state.value.options.cities = [...state.value.optionsData.cities]
    state.value.options.localsService = [
      ...state.value.optionsData.localsService,
    ]

    const specIds = state.value.form.specialtyIds
    const subIds = state.value.form.subspecialtyIds
    state.value.options.subspecialty = state.value.optionsData.subspecialty.filter(
      (sub) => {
        if (subIds.includes(sub.id)) return true
        const specId =
          sub.specialty?.id ??
          (sub as ISubspecialty & { specialtyId?: string }).specialtyId
        return specId != null && specIds.includes(specId)
      },
    )

    state.value.options.videos = state.value.optionsData.videos.filter(
      (video) =>
        !video.guests.length
          ? video.guests.includes(item.id)
          : video.author == item.id,
    )

    state.value.options.professionals =
      state.value.optionsData.professionals.filter(
        (professional) => item.id != professional.id,
      )
  }

  async function openEditDialog(item?: IProfessional) {
    if (!item) {
      clearEditDialog()
      editFormLoading.value = false
      toggleDialog(dialog.edit)
      return
    }

    clearEditDialog()
    toggleDialog(dialog.edit)
    editFormLoading.value = true

    let loaded: IProfessional | null = null
    try {
      if (!state.value.optionsData.subspecialty.length) {
        await fetchOptions()
      }

      await requester.dispatch({
        callback: async () => {
          loaded = await ProfessionalService.getById(item.id)
        },
        errorMessageTitle: 'Houve um erro',
        errorMessage: 'Não foi possível carregar o profissional',
      })

      if (loaded) {
        setFormAndOptionsFromProfessional(loaded)
      }
    } finally {
      editFormLoading.value = false
    }
  }

  function clearEditDialog() {
    state.value.form = cloneDeep(initState.form)
    editFormLoading.value = false
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
    editFormLoading,
    filter,
    pagination,
    tableLoading,
    dialog,
    loader,
    save,
    addFile,
    loadFormCatalog,
    onRequest,
    refreshCurrentPage,
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
