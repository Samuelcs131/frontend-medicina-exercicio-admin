import { useDialog } from 'src/composables/useDialog'
import { useListTableRequest } from 'src/composables/useListTableRequest'
import { useLoader } from 'src/composables/useLoader'
import { Status } from 'src/enums/Status.enum'
import { cloneDeep } from 'src/utils/clone.util'
import { ref } from 'vue'
import requester from 'src/helpers/requester/Requester.helper'
import * as SubspecialtyGroupService from 'src/services/speciality/subspecialtyGroup.service'
import * as SpecialtyService from 'src/services/speciality/specialty.service'
import * as PostService from 'src/services/post.service'
import * as VideoService from 'src/services/video/video.service'
import { ActionDialogOptions } from 'src/enums/ActionDialogOptions.enum'
import type { ISubspecialtyGroup } from 'src/types/specialty/ISubspecialtyGroup.type'
import type { ISpecialty } from 'src/types/specialty/ISpecialty.type'

const DEFAULT_SORT = 'updatedAt'

interface IBasicEntity {
  id: string
  name: string
}

interface IState {
  form: {
    id?: string
    name: string
    description: string
    imageURL: string
    imageFile: File | null
    status: Status
    postIds: string[]
    videoIds: string[]
    specialtyId: string
  }
  options: {
    posts: IBasicEntity[]
    videos: IBasicEntity[]
    specialties: ISpecialty[]
  }
  optionsData: {
    posts: IBasicEntity[]
    videos: IBasicEntity[]
    specialties: ISpecialty[]
  }
  list: ISubspecialtyGroup[]
  selectedSpecialtyId: string | null
  actionType: ActionDialogOptions
  actionsData: ISubspecialtyGroup[]
  activeOnly: boolean
}

export function useSubspecialtyGroup() {
  const initState: IState = {
    form: {
      status: Status.active,
      imageURL: '',
      imageFile: null,
      name: '',
      description: '',
      postIds: [],
      videoIds: [],
      specialtyId: '',
    },
    options: {
      posts: [],
      videos: [],
      specialties: [],
    },
    optionsData: {
      posts: [],
      videos: [],
      specialties: [],
    },
    actionsData: [],
    actionType: ActionDialogOptions.delete,
    list: [],
    selectedSpecialtyId: null,
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
    saveOrder: 'save-order-h456hg3qgfc',
  }

  const state = ref<IState>(cloneDeep(initState))
  const { createDialog, toggleDialog, dialogIsOpen } = useDialog()
  const { loaderStatus } = useLoader()

  const { filter, pagination, tableLoading, onRequest, refreshCurrentPage } =
    useListTableRequest<ISubspecialtyGroup>({
      defaultOrdertype: DEFAULT_SORT,
      defaultDescending: true,
      initialRowsPerPage: 40,
      loaderListId: loader.list,
      fetchPage: (q) =>
        SubspecialtyGroupService.getListPaginated(
          {
            ...q,
            all: !state.value.activeOnly,
          },
          state.value.selectedSpecialtyId,
        ),
      applyResponse: (res) => {
        state.value.list = res.data
      },
    })

  async function onSpecialtyChange(specialtyId: string | null) {
    state.value.selectedSpecialtyId = specialtyId
    pagination.value.page = 1
    await refreshCurrentPage()
  }

  async function fetchGroupsForOrderDialog(): Promise<ISubspecialtyGroup[]> {
    const sid = state.value.selectedSpecialtyId
    if (!sid) return []
    const data = await SubspecialtyGroupService.getAll(sid)
    return [...data].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  }

  async function saveOrder(orderedList: ISubspecialtyGroup[]) {
    if (!state.value.selectedSpecialtyId) return

    const groups = orderedList.map((item, index) => ({
      id: item.id,
      order: index + 1,
    }))

    await requester.dispatch({
      callback: async () => {
        await SubspecialtyGroupService.updateOrdersBySpecialty(
          state.value.selectedSpecialtyId!,
          groups,
        )
      },
      successCallback: async () => {
        await refreshCurrentPage()
      },
      successMessageTitle: 'Ordem salva com sucesso',
      errorMessageTitle: 'Houve um erro',
      errorMessage: 'N?o foi poss?vel salvar a ordem',
      loaders: [loader.saveOrder],
    })
  }

  async function fetchOptions() {
    await requester.dispatch({
      callback: async () => {
        const [posts, specialties] = await Promise.all([
          PostService.getAllPostNames(),
          SpecialtyService.getAll(),
        ])

        state.value.options = {
          posts,
          videos: [],
          specialties,
        }

        state.value.optionsData = {
          posts,
          videos: [],
          specialties,
        }
      },
      errorMessageTitle: 'Houve um erro',
      errorMessage: 'N?o foi poss?vel buscar as op??es',
    })
  }

  async function fetchVideosBySpecialty(specialtyId: string) {
    if (!specialtyId) {
      state.value.options.videos = []
      state.value.optionsData.videos = []
      state.value.form.videoIds = []
      return
    }

    await requester.dispatch({
      callback: async () => {
        const videos = (await VideoService.getBySpecialtyId(specialtyId)) || []

        const videosFormatted: IBasicEntity[] = videos.map((video) => ({
          id: video.id,
          name: video.name,
        }))

        state.value.options.videos = videosFormatted
        state.value.optionsData.videos = videosFormatted
      },
      errorMessageTitle: 'Houve um erro',
      errorMessage: 'N?o foi poss?vel buscar os v?deos',
    })
  }

  async function save() {
    const id = state.value.form.id

    if (!state.value.form.specialtyId) {
      return
    }

    const orderPosts: Array<{ postId: string; order: number }> =
      state.value.form.postIds.map((postId, index) => ({
        postId,
        order: index,
      }))

    await requester.dispatch({
      callback: async () => {
        if (id)
          await SubspecialtyGroupService.save(
            id,
            state.value.form.name,
            state.value.form.description,
            state.value.form.status,
            state.value.form.specialtyId,
            state.value.form.postIds,
            orderPosts,
            state.value.form.imageFile,
            state.value.form.videoIds,
          )
        else
          await SubspecialtyGroupService.create(
            state.value.form.name,
            state.value.form.description,
            state.value.form.status,
            state.value.form.specialtyId,
            state.value.form.postIds,
            orderPosts,
            state.value.form.imageFile,
            state.value.form.videoIds,
          )
      },
      successCallback: async () => {
        toggleDialog(dialog.edit)
        await refreshCurrentPage()
      },
      successMessageTitle: `${id ? 'Editado' : 'Cadastrado'} com sucesso`,
      errorMessageTitle: 'Houve um erro',
      errorMessage: `N?o foi poss?vel ${
        state.value.form.id ? 'editar' : 'salvar'
      }`,
      loaders: [loader.edit],
    })
  }

  async function confirmAction() {
    await requester.dispatch({
      callback: async () => {
        const { actionType, actionsData } = state.value
        const ids = actionsData.map((item) => item.id)

        if (!ids.length) return

        if (actionType === ActionDialogOptions.delete) {
          await SubspecialtyGroupService.deleteItem(ids)
        }

        if (actionType === ActionDialogOptions.disable) {
          await SubspecialtyGroupService.disable(ids)
        }
      },
      successCallback: async () => {
        toggleDialog(dialog.action)
        state.value.actionsData = []
        await refreshCurrentPage()
      },
      successMessageTitle: 'Conclu?do com sucesso',
      errorMessageTitle: 'Houve um erro',
      errorMessage: 'N?o foi poss?vel realizar a a??o',
      loaders: [loader.action],
    })
  }

  function openEditDialog(item?: ISubspecialtyGroup) {
    if (item) {
      const sortedPosts = item.posts
        ? [...item.posts].sort((a, b) => a.order - b.order)
        : []
      const postIds = sortedPosts.map((post) => post.id)

      const videoIds: string[] =
        (item.videoIds?.length ?? 0) > 0
          ? item.videoIds ?? []
          : (item.videos ?? []).map((v) => v.id)

      const specialtyId = item.specialty?.id || ''

      state.value.form = {
        id: item.id,
        name: item.name,
        description: item.description || '',
        imageURL: item.imageURL,
        status: item.status,
        imageFile: null,
        postIds,
        videoIds,
        specialtyId,
      }
    } else {
      clearEditDialog()
    }

    toggleDialog(dialog.edit)

    if (
      !state.value.options.posts.length ||
      !state.value.options.specialties.length ||
      !state.value.options.videos.length
    ) {
      void fetchOptions()
    }
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

  function updatePostOrder() {
    // reservado
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
    fetchOptions,
    fetchVideosBySpecialty,
    removeFile,
    onRequest,
    refreshCurrentPage,
    toggleDialog,
    dialogIsOpen,
    createDialog,
    loaderStatus,
    confirmAction,
    openEditDialog,
    clearEditDialog,
    openActionDialog,
    updatePostOrder,
    onSpecialtyChange,
    toggleActiveOnly,
    saveOrder,
    fetchGroupsForOrderDialog,
  }
}
