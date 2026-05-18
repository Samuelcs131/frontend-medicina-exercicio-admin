import { useDialog } from 'src/composables/useDialog'
import { useLoader } from 'src/composables/useLoader'
import { PostTypeContent } from 'src/enums/post/PostTypeContent.enum'
import { cloneDeep } from 'src/utils/clone.util'
import { ref } from 'vue'
import requester from 'src/helpers/requester/Requester.helper'
import * as PostService from 'src/services/post.service'
import * as SpecialityService from 'src/services/speciality/specialty.service'
import * as ProfessionalService from 'src/services/professional/professional.service'
import { useRouter } from 'vue-router'
import { IPost, IPostItem } from 'src/types/post/IPost.type'
import { slugify } from 'src/utils/text.util'
import { uniqueId } from 'src/utils/random.util'
import { useLocalStorage } from 'src/composables/useLocalStorage'
import { LocalStorageKey } from 'src/enums/LocalStorageKey.enum'
import { Roles } from 'src/enums/Roles.enum'
import { Status } from 'src/enums/Status.enum'

import type { IBasicEntity } from 'src/types/IBasicEntity.type'

interface IForm extends IPost {
  thumbnailFile: File | null
}

interface IState {
  form: IForm
  postItem: IPostItem
  postOrder: number | null
  imagePostDialog: {
    emit: boolean
    step: string
    url: string | null
    file: File | null
    alt: string | null
    width: number
    height: number
  }
  options: {
    specialties: IBasicEntity<string>[]
    professional: IBasicEntity<string>[]
    posts: IBasicEntity<string>[]
  }
  optionsData: {
    specialties: IBasicEntity<string>[]
    professional: IBasicEntity<string>[]
    posts: IBasicEntity<string>[]
  }
}

const initializeState: IState = {
  form: {
    id: '',
    title: '',
    url: '',
    professionalId: '',
    schedulingDate: new Date().toISOString(),
    specialtyIds: [],
    tagDescription: '',
    tagKeywords: '',
    tagTitle: '',
    thumbnailAlt: '',
    thumbnailUrlImage: '',
    status: Status.active,
    postItems: [],
    thumbnailFile: null,
    recomendations: {
      specialtyIds: [],
      readMorePostIds: [],
      outherContentIds: [],
    },
  },
  postOrder: null,
  imagePostDialog: {
    emit: false,
    step: 'upload',
    url: null,
    file: null,
    alt: null,
    width: 342,
    height: 192,
  },
  postItem: {
    key: null,
    contentHTML: '',
    postTypeContent: PostTypeContent.html,
  },
  options: {
    specialties: [],
    professional: [],
    posts: [],
  },
  optionsData: {
    specialties: [],
    professional: [],
    posts: [],
  },
}

const state = ref(cloneDeep(initializeState))

function normalizePostTypeContent(value: unknown): PostTypeContent {
  if (value === PostTypeContent.html || value === 'richtext') {
    return PostTypeContent.html
  }
  return PostTypeContent.html
}

enum Loader {
  fetch = 'p-fetch',
  delete = 'p-delete',
  edit = 'p-edit',
  options = 'p-options',
  save = 'p-save',
}

enum Dialog {
  editPost = 'p-edit-post',
  midiaTutorial = 'p-midia-tutorial',
  editPostImage = 'p-edit-post-image',
  delete = 'p-delete',
  viewPost = 'p-view-post',
  carouselDialog = 'p-carousel-dialog',
}

export function usePostEditPage() {
  const router = useRouter()
  const { createDialog, dialogIsOpen, toggleDialog } = useDialog()
  const { loaderStatus } = useLoader()

  function removeSection(key: string) {
    state.value.form.postItems = state.value.form.postItems.filter((item) => {
      return item.key !== key
    })
  }

  function openEditPost(order: number) {
    state.value.postItem = state.value.form.postItems[order]!
    state.value.postOrder = order
    toggleDialog(Dialog.editPost)
  }

  function openNewPost() {
    state.value.postItem = cloneDeep(initializeState.postItem)
    toggleDialog(Dialog.editPost)
  }

  function initState() {
    state.value = cloneDeep(initializeState)
  }

  function handleRemoveFile() {
    state.value.imagePostDialog.file = null
  }

  function clearImageInput() {
    state.value.imagePostDialog.file = null
    state.value.imagePostDialog.url = null
  }

  function openImageDialog() {
    state.value.imagePostDialog = cloneDeep(initializeState.imagePostDialog)
    toggleDialog(Dialog.editPostImage)
  }

  async function openEdit(id: string) {
    await router.push({
      name: 'postEdit',
      params: { postId: id },
    })
  }

  function handleSlugURL(input: string | number | null) {
    if (typeof input != 'string') return

    state.value.form.url = slugify(input)
    state.value.form.tagTitle = input
  }

  function toBasicEntityList(items: { id: string; name: string }[]) {
    return items.map((item) => ({
      id: item.id,
      name: item.name,
    }))
  }

  function getMissingIds(selectedIds: string[], options: IBasicEntity<string>[]) {
    const optionIds = new Set(options.map((item) => item.id))
    return [...new Set(selectedIds)].filter((id) => id && !optionIds.has(id))
  }

  async function ensureSelectedOptionsAvailable() {
    let specialties = [...state.value.optionsData.specialties]
    let professionals = [...state.value.optionsData.professional]
    const posts = [...state.value.optionsData.posts]

    const selectedSpecialtyIds = [
      ...state.value.form.specialtyIds,
      ...state.value.form.recomendations.specialtyIds,
      ...state.value.form.recomendations.outherContentIds,
    ]
    const missingSpecialtyIds = getMissingIds(selectedSpecialtyIds, specialties)
    const missingProfessionalIds = getMissingIds(
      [state.value.form.professionalId],
      professionals,
    )
    const missingPostIds = getMissingIds(
      state.value.form.recomendations.readMorePostIds,
      posts,
    )

    if (missingSpecialtyIds.length) {
      const allSpecialties = await SpecialityService.getAll()
      const missingSpecialties = toBasicEntityList(
        allSpecialties.filter((item) => missingSpecialtyIds.includes(item.id)),
      )
      specialties = [...specialties, ...missingSpecialties]
    }

    if (missingProfessionalIds.length) {
      const allProfessionals = await ProfessionalService.getAll()
      const missingProfessionals = toBasicEntityList(
        allProfessionals.filter((item) => missingProfessionalIds.includes(item.id)),
      )
      professionals = [...professionals, ...missingProfessionals]
    }

    if (missingPostIds.length) {
      state.value.form.recomendations.readMorePostIds =
        state.value.form.recomendations.readMorePostIds.filter(
          (id) => !missingPostIds.includes(id),
        )
    }

    state.value.options = {
      specialties,
      professional: professionals,
      posts,
    }

    state.value.optionsData = {
      specialties,
      professional: professionals,
      posts,
    }
  }

  function syncSelectModels() {
    state.value.form = {
      ...state.value.form,
      professionalId: state.value.form.professionalId || '',
      specialtyIds: [...(state.value.form.specialtyIds || [])],
      recomendations: {
        ...state.value.form.recomendations,
        specialtyIds: [...(state.value.form.recomendations.specialtyIds || [])],
        readMorePostIds: [
          ...(state.value.form.recomendations.readMorePostIds || []),
        ],
        outherContentIds: [
          ...(state.value.form.recomendations.outherContentIds || []),
        ],
      },
    }
  }

  function isAdmin() {
    const { getLocalStorage } = useLocalStorage()

    const userRoles: Roles[] =
      JSON.parse(getLocalStorage(LocalStorageKey.user)).roles || []

    return userRoles.includes(Roles.admin)
  }

  async function fetchPostData(id: string) {
    const post = await PostService.getPostById(id)
    // Interface para lidar com possível resposta do backend com formato antigo
    interface IPostLegacy {
      specialtyId?: string
    }
    const postWithLegacy = post as IPost & IPostLegacy

    const recomendations = post.recomendations || {
      specialtyIds: [],
      readMorePostIds: [],
      outherContentIds: [],
    }

    const formData: IForm = {
      ...post,
      thumbnailFile: null,
      specialtyIds: post.specialtyIds?.length
        ? post.specialtyIds
        : postWithLegacy.specialtyId
          ? [postWithLegacy.specialtyId]
          : [],
      recomendations: {
        specialtyIds: recomendations.specialtyIds || [],
        readMorePostIds: recomendations.readMorePostIds || [],
        outherContentIds: recomendations.outherContentIds || [],
      },
    }
    state.value.form = formData
    // Garante que cada postItem tenha um key para edição atualizar no lugar (e não criar novo)
    state.value.form.postItems = (state.value.form.postItems || []).map((item) => ({
      ...item,
      key: item.key || uniqueId(),
      postTypeContent: normalizePostTypeContent(item.postTypeContent),
    }))
    await ensureSelectedOptionsAvailable()
    syncSelectModels()
  }

  async function fetchPost(id: string) {
    await requester.dispatch({
      callback: async () => {
        await fetchPostData(id)
      },
      errorMessageTitle: 'Houve um erro!',
      errorMessage: 'Não foi possível carregar a postagem',
      loaders: [Loader.fetch],
    })
  }

  async function fetchOptionsData() {
    if (state.value.options.professional.length > 0) return

    const [specialties, professionals, posts] = await Promise.all([
      SpecialityService.getAllNames(),
      ProfessionalService.getAllNames(),
      PostService.getAllPostNames(),
    ])

    const professionalsFilter = professionals
    const postsFilter = posts.filter((post) => post.id !== state.value.form.id)

    state.value.options = {
      specialties,
      professional: professionalsFilter,
      posts: postsFilter,
    }

    state.value.optionsData = {
      specialties,
      professional: professionalsFilter,
      posts: postsFilter,
    }
  }

  async function fetchOptions() {
    await requester.dispatch({
      callback: async () => {
        await fetchOptionsData()
      },
      errorMessageTitle: 'Houve um erro!',
      errorMessage: 'Não foi possível carregar a postagem',
      loaders: [Loader.fetch],
    })
  }

  async function loadInitialData(postId?: string) {
    await requester.dispatch({
      callback: async () => {
        await fetchOptionsData()
        if (postId) await fetchPostData(postId)
      },
      errorMessageTitle: 'Houve um erro!',
      errorMessage: 'Não foi possível carregar a postagem',
      loaders: [Loader.fetch],
    })
  }

  async function savePost() {
    await requester.dispatch({
      callback: async () => {
        const { form } = state.value
        if (form.id) {
          await PostService.save(form.id, form, form.thumbnailFile)
        } else {
          await PostService.create(form, form.thumbnailFile)
        }
      },
      successCallback: async () => {
        await router.push({ name: 'post' })
      },
      successMessageTitle: 'Sucesso ao salvar',
      successMessage: 'A postagem foi salva com sucesso',
      errorMessageTitle: 'Houve um erro!',
      errorMessage: 'Não foi possível carregar a postagem',
      loaders: [Loader.save],
    })
  }

  return {
    state,
    Dialog,
    Loader,
    isAdmin,
    savePost,
    openEdit,
    fetchPost,
    loadInitialData,
    initState,
    openNewPost,
    dialogIsOpen,
    loaderStatus,
    openEditPost,
    createDialog,
    toggleDialog,
    fetchOptions,
    handleSlugURL,
    removeSection,
    openImageDialog,
    clearImageInput,
    handleRemoveFile,
  }
}
