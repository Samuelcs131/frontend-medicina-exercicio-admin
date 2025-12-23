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
import * as PostService from 'src/services/post.service'
import { ActionDialogOptions } from 'src/enums/ActionDialogOptions.enum'
import type { IBasicEntity } from 'src/types/IBasicEntity.type'
import type { IVideo } from 'src/types/video/IVideo.type'
import { IPostResume } from 'src/types/post/IPost.type'
import { ISubspecialty } from 'src/types/specialty/ISubspecialty.type'
import { IProfessional } from 'src/types/professional/IProfessional.type'

interface IState {
  form: {
    id?: string
    name: string
    url: string
    description: string
    author: string
    guests: string[]
    specialtyIds: string[]
    subspecialtyIds: string[]
    status: Status
    recomendations: {
      outherVideosIds: string[]
      moreVideosIds: string[]
      specialtyIds: string[]
      postIds: string[]
      relatedVideoIds: string[]
    }
  }
  options: {
    professionals: IBasicEntity<string>[]
    specialties: IBasicEntity<string>[]
    subspecialties: ISubspecialty[]
    videos: IVideo[]
    relatedVideos: IVideo[]
    posts: IPostResume[]
    specialtyProfessionals: IBasicEntity<string>[]
  }
  optionsData: {
    professionals: IProfessional[]
    specialties: IBasicEntity<string>[]
    subspecialties: ISubspecialty[]
    videos: IVideo[]
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      author: undefined as any,
      guests: [],
      specialtyIds: [],
      subspecialtyIds: [],
      recomendations: {
        outherVideosIds: [],
        moreVideosIds: [],
        specialtyIds: [],
        postIds: [],
        relatedVideoIds: [],
      },
    },
    options: {
      professionals: [],
      specialties: [],
      subspecialties: [],
      videos: [],
      relatedVideos: [],
      posts: [],
      specialtyProfessionals: [],
    },
    optionsData: {
      professionals: [],
      specialties: [],
      subspecialties: [],
      videos: [],
    },
    actionsData: [],
    actionType: ActionDialogOptions.delete,
    filter: '',
    list: [],
  }

  const dialog = {
    edit: 'edit-5h4hg4k656g4',
    action: 'action-fdgh453gzcvc',
  }

  const loader = {
    list: 'list-5h4hg4k656g4',
    edit: 'edit-j76j5h45g3',
    action: 'action-fdgh453gzcvc',
  }

  const state = ref<IState>(cloneDeep(initState))
  const { createDialog, toggleDialog, dialogIsOpen } = useDialog()
  const { loaderStatus } = useLoader()

  async function fetchList() {
    await requester.dispatch({
      callback: async () => {
        const [professionals, specialties, subspecialties, videos] =
          await Promise.all([
            ProfessionalService.getAll(),
            SpecialtyService.getAll(),
            SubspecialtyService.getAll(),
            VideoService.getAll(),
          ])

        const options = {
          specialties,
          professionals,
          subspecialties,
          videos,
        }

        state.value.options = {
          ...state.value.options,
          ...cloneDeep(options),
        }

        state.value.optionsData = {
          ...state.value.options,
          ...cloneDeep(options),
        }

        state.value.list = videos
      },
      errorMessageTitle: 'Houve um erro',
      errorMessage: 'Não foi possível buscar os dados',
      loaders: [loader.list],
    })
  }

  async function fetchOptionsData(guestIds: string[]) {
    await requester.dispatch({
      callback: async () => {
        const [posts] = await Promise.all([
          PostService.getByProfessionalIds(guestIds),
        ])

        state.value.options.posts = posts

        state.value.options.videos = state.value.optionsData.videos.filter(
          (video) => video.guests.some((g) => guestIds.includes(g)),
        )

        const guestSpecialties = new Set<string>([])

        state.value.optionsData.professionals.forEach((p) => {
          p.specialtyIds.forEach((s) => guestSpecialties.add(s))
        })

        state.value.options.relatedVideos =
          state.value.optionsData.videos.filter((video) => {
            return video.specialtyIds.some((s) => guestSpecialties.has(s))
          })

        state.value.options.specialtyProfessionals =
          state.value.optionsData.specialties.filter((specialty) =>
            guestSpecialties.has(specialty.id),
          )
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
            state.value.form.author,
            state.value.form.guests,
            state.value.form.specialtyIds,
            state.value.form.subspecialtyIds,
            state.value.form.recomendations,
            state.value.form.status,
          )
        else
          await VideoService.create(
            state.value.form.name,
            state.value.form.url,
            state.value.form.description,
            state.value.form.author,
            state.value.form.guests,
            state.value.form.specialtyIds,
            state.value.form.subspecialtyIds,
            state.value.form.recomendations,
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

  async function openEditDialog(item?: IVideo) {
    if (item) {
      state.value.form = { ...item }

      await fetchOptionsData(!item.guests.length ? [item.author] : item.guests)
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
    fetchOptionsData,
    openActionDialog,
  }
}
