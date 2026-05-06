import { useDialog } from 'src/composables/useDialog'
import { useLoader } from 'src/composables/useLoader'
import { Status } from 'src/enums/Status.enum'
import { cloneDeep } from 'src/utils/clone.util'
import { ref } from 'vue'
import requester from 'src/helpers/requester/Requester.helper'
import * as SubspecialtyGroupService from 'src/services/speciality/subspecialtyGroup.service'
import * as SpecialtyService from 'src/services/speciality/specialty.service'
import * as PostService from 'src/services/post.service'
import { ActionDialogOptions } from 'src/enums/ActionDialogOptions.enum'
import type { ISubspecialtyGroup } from 'src/types/specialty/ISubspecialtyGroup.type'
import type { ISpecialty } from 'src/types/specialty/ISpecialty.type'

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
    specialtyId: string
  }
  options: {
    posts: IBasicEntity[]
    specialties: ISpecialty[]
  }
  optionsData: {
    posts: IBasicEntity[]
    specialties: ISpecialty[]
  }
  list: ISubspecialtyGroup[]
  filteredList: ISubspecialtyGroup[]
  selectedSpecialtyId: string | null
  filter: string
  actionType: ActionDialogOptions
  actionsData: ISubspecialtyGroup[]
  hasOrderChanged: boolean
  originalOrder: string[]
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
      specialtyId: '',
    },
    options: {
      posts: [],
      specialties: [],
    },
    optionsData: {
      posts: [],
      specialties: [],
    },
    actionsData: [],
    actionType: ActionDialogOptions.delete,
    filter: '',
    list: [],
    filteredList: [],
    selectedSpecialtyId: null,
    hasOrderChanged: false,
    originalOrder: [],
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

  async function fetchList() {
    await requester.dispatch({
      callback: async () => {
        if (!state.value.options.posts.length) await fetchOptions()
        // Se uma especialidade estiver selecionada, busca apenas os grupos dessa especialidade
        const specialtyId = state.value.selectedSpecialtyId || undefined
        state.value.list = await SubspecialtyGroupService.getAll(specialtyId)
        applyFilter()
      },
      errorMessageTitle: 'Houve um erro',
      errorMessage: 'Não foi possível buscar os dados',
      loaders: [loader.list],
    })
  }

  function applyFilter() {
    // A API já retorna os dados filtrados, então apenas ordena e prepara a lista
    state.value.filteredList = [...state.value.list]
    
    // Ordena por order se existir (quando uma especialidade estiver selecionada)
    if (state.value.selectedSpecialtyId) {
      state.value.filteredList.sort((a, b) => {
        const orderA = a.order ?? 0
        const orderB = b.order ?? 0
        return orderA - orderB
      })
      // Salva ordem original
      state.value.originalOrder = state.value.filteredList.map((item) => item.id)
    } else {
      state.value.originalOrder = []
    }
    state.value.hasOrderChanged = false
  }

  async function onSpecialtyChange(specialtyId: string | null) {
    state.value.selectedSpecialtyId = specialtyId
    // Recarrega a lista quando mudar a especialidade
    await fetchList()
  }

  function onOrderChange(newOrder: ISubspecialtyGroup[]) {
    state.value.filteredList = newOrder
    const newOrderIds = newOrder.map((item) => item.id)
    state.value.hasOrderChanged =
      JSON.stringify(newOrderIds) !== JSON.stringify(state.value.originalOrder)
  }

  async function saveOrder() {
    if (!state.value.selectedSpecialtyId) return

    const groups = state.value.filteredList.map((item, index) => ({
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
        state.value.hasOrderChanged = false
        state.value.originalOrder = state.value.filteredList.map((item) => item.id)
        await fetchList()
      },
      successMessageTitle: 'Ordem salva com sucesso',
      errorMessageTitle: 'Houve um erro',
      errorMessage: 'Não foi possível salvar a ordem',
      loaders: [loader.saveOrder],
    })
  }

  async function fetchOptions() {
    await requester.dispatch({
      callback: async () => {
        const [posts, specialties] = await Promise.all([
          PostService.getAllPostResume(),
          SpecialtyService.getAll(),
        ])

        const postsFormatted: IBasicEntity[] = posts.map((post) => ({
          id: post.id,
          name: post.title,
        }))

        state.value.options = {
          posts: postsFormatted,
          specialties,
        }

        state.value.optionsData = {
          posts: postsFormatted,
          specialties,
        }
      },
      errorMessageTitle: 'Houve um erro',
      errorMessage: 'Não foi possível buscar as opções',
    })
  }

  async function save() {
    const id = state.value.form.id

    // Validação: specialtyId é obrigatório
    if (!state.value.form.specialtyId) {
      return
    }

    // Gera orderPosts baseado na ordem atual dos postIds
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

        if (actionType == ActionDialogOptions.delete) {
          // Deleta um por vez (nova API aceita apenas um ID)
          for (const item of state.value.actionsData) {
            await SubspecialtyGroupService.deleteItem(item.id)
          }
        }
        // Removido disable - não existe mais na nova API
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

  function openEditDialog(item?: ISubspecialtyGroup) {
    // Abre o modal imediatamente
    if (item) {
      // Converte posts do formato da API para arrays de IDs
      // Ordena os posts pelo campo 'order' antes de extrair os IDs
      const sortedPosts = item.posts
        ? [...item.posts].sort((a, b) => a.order - b.order)
        : []
      const postIds = sortedPosts.map((post) => post.id)

      // Pega apenas a primeira especialidade (agora é apenas uma)
      const specialtyId = item.specialty?.id || ''

      state.value.form = {
        id: item.id,
        name: item.name,
        description: item.description || '',
        imageURL: item.imageURL,
        status: item.status,
        imageFile: null,
        postIds,
        specialtyId,
      }
    } else {
      clearEditDialog()
    }

    toggleDialog(dialog.edit)

    // Carrega os dados em background (sem bloquear a abertura do modal)
    if (!state.value.options.posts.length || !state.value.options.specialties.length) {
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
    // A ordem já está atualizada no v-model do draggable
    // Esta função pode ser usada para ações adicionais se necessário
  }

  return {
    state,
    dialog,
    loader,
    save,
    addFile,
    fetchList,
    fetchOptions,
    removeFile,
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
    onOrderChange,
    saveOrder,
  }
}
