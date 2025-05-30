import { useDialog } from 'src/composables/useDialog'
import { useLoader } from 'src/composables/useLoader'
import { PostTypeContent } from 'src/enums/post/PostTypeContent.enum'
import { cloneDeep } from 'src/utils/clone.util'
import { ref } from 'vue'
import requester from 'src/helpers/requester/Requester.helper'
import * as PostService from 'src/services/post.service'
import * as SpecialityService from 'src/services/speciality/specialty.service'
import * as SubspecialityService from 'src/services/speciality/subspecialty.service'
import * as ProfessionalService from 'src/services/professional/professional.service'
import { useRouter } from 'vue-router'
import { IPost, IPostItem } from 'src/types/post/IPost.type'
import { slugify } from 'src/utils/text.util'
import { useLocalStorage } from 'src/composables/useLocalStorage'
import { LocalStorageKey } from 'src/enums/LocalStorageKey.enum'
import { Roles } from 'src/enums/Roles.enum'
import { Status } from 'src/enums/Status.enum'
import { IBasicEntity } from 'src/types/IBasicEntity.type'

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
    subspecialties: IBasicEntity<string>[]
    professional: IBasicEntity<string>[]
  }
}

const initializeState: IState = {
  form: {
    id: '',
    title: '',
    author: '',
    url: '',
    professionalId: '',
    schedulingDate: new Date().toISOString(),
    specialtyId: '',
    subspecialtyId: '',
    tagDescription: '',
    tagKeywords: '',
    tagTitle: '',
    thumbnailAlt: '',
    thumbnailUrlImage: '',
    status: Status.active,
    postItems: [],
    thumbnailFile: null,
    authorDescription: '',
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
    subspecialties: [],
    professional: [],
  },
}

const state = ref(cloneDeep(initializeState))

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

  function isAdmin() {
    const { getLocalStorage } = useLocalStorage()

    const userRoles: Roles[] =
      JSON.parse(getLocalStorage(LocalStorageKey.user)).roles || []

    return userRoles.includes(Roles.admin)
  }

  async function fetchPost(id: string) {
    await requester.dispatch({
      callback: async () => {
        const [specialties, subspecialties, professional] = await Promise.all([
          await SpecialityService.getAll(),
          await SubspecialityService.getAll(),
          await ProfessionalService.getAll(),
        ])

        state.value.options = { specialties, subspecialties, professional }

        const post = await PostService.getPostById(id)

        state.value.form = { ...post, thumbnailFile: null }
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

  function handleProfessional(value: string) {
    state.value.form.author =
      state.value.options.professional.find((item) => item.id === value)
        ?.name || ''
  }

  return {
    state,
    Dialog,
    Loader,
    isAdmin,
    savePost,
    openEdit,
    fetchPost,
    initState,
    openNewPost,
    dialogIsOpen,
    loaderStatus,
    openEditPost,
    createDialog,
    toggleDialog,
    handleSlugURL,
    removeSection,
    openImageDialog,
    clearImageInput,
    handleRemoveFile,
    handleProfessional,
  }
}
