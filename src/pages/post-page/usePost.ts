import { useDialog } from 'src/composables/useDialog'
import { useLoader } from 'src/composables/useLoader'
import { cloneDeep } from 'src/utils/clone.util'
import { ref } from 'vue'
import requester from 'src/helpers/requester/Requester.helper'
import * as PostService from 'src/services/post.service'
import { ActionDialogOptions } from 'src/enums/ActionDialogOptions.enum'
import type { IPostResume } from 'src/types/post/IPost.type'
import { useRouter } from 'vue-router'

interface IState {
  list: IPostResume[]
  filter: string
  actionType: ActionDialogOptions
  actionsData: IPostResume[]
}

export function usePost() {
  const initState: IState = {
    actionsData: [],
    actionType: ActionDialogOptions.delete,
    filter: '',
    list: [],
  }

  const router = useRouter()

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
        state.value.list = await PostService.getAllPostResume()
      },
      errorMessageTitle: 'Houve um erro',
      errorMessage: 'Não foi possível buscar os dados',
      loaders: [loader.list],
    })
  }

  async function confirmAction() {
    await requester.dispatch({
      callback: async () => {
        const { actionType } = state.value

        const ids = state.value.actionsData.map((item) => item.id)

        if (actionType == ActionDialogOptions.delete)
          await PostService.deleteItem(ids)
        if (actionType == ActionDialogOptions.disable)
          await PostService.disable(ids)
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

  function openActionDialog(action: ActionDialogOptions) {
    state.value.actionType = action
    toggleDialog(dialog.action)
  }

  async function openEditDialog(item?: IPostResume) {
    await router.push({
      name: 'postEdit',
      params: item ? { postId: item.id } : {},
    })
  }

  return {
    state,
    dialog,
    loader,
    fetchList,
    toggleDialog,
    dialogIsOpen,
    createDialog,
    loaderStatus,
    confirmAction,
    openEditDialog,
    openActionDialog,
  }
}
