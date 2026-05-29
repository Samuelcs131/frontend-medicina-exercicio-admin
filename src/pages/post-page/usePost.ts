import { useDialog } from 'src/composables/useDialog'
import { useListTableRequest } from 'src/composables/useListTableRequest'
import { useLoader } from 'src/composables/useLoader'
import { cloneDeep } from 'src/utils/clone.util'
import { ref } from 'vue'
import requester from 'src/helpers/requester/Requester.helper'
import * as PostService from 'src/services/post.service'
import * as SpecialtyService from 'src/services/speciality/specialty.service'
import { ActionDialogOptions } from 'src/enums/ActionDialogOptions.enum'
import type { IPostNameListItem } from 'src/types/post/IPost.type'
import type { ISpecialty } from 'src/types/specialty/ISpecialty.type'
import { useRouter } from 'vue-router'

const DEFAULT_POST_SORT = 'createdAt'

interface IState {
  list: IPostNameListItem[]
  actionType: ActionDialogOptions
  actionsData: IPostNameListItem[]
  specialties: ISpecialty[]
  selectedSpecialties: ISpecialty[]
  activeOnly: boolean
  filterSpecialtyId: string
}

export function usePost() {
  const initState: IState = {
    actionsData: [],
    actionType: ActionDialogOptions.delete,
    list: [],
    specialties: [],
    selectedSpecialties: [],
    activeOnly: true,
    filterSpecialtyId: '',
  }

  const router = useRouter()

  const dialog = {
    edit: 'edit-j64h53wf235g',
    action: 'action-143dsdfcasd',
    specialties: 'specialties-dialog',
  }

  const loader = {
    list: 'list-j64h53wf235g',
    edit: 'edit-76kj6h5g32',
    action: 'action-143dsdfcasd',
  }

  const state = ref<IState>(cloneDeep(initState))
  const { createDialog, toggleDialog, dialogIsOpen } = useDialog()
  const { loaderStatus } = useLoader()

  const { filter, pagination, tableLoading, onRequest, refreshCurrentPage } =
    useListTableRequest<IPostNameListItem>({
      defaultOrdertype: DEFAULT_POST_SORT,
      allowedOrdertypes: ['title', 'createdAt'],
      defaultDescending: true,
      initialRowsPerPage: 40,
      loaderListId: loader.list,
      fetchPage: async (q) => {
        const specialtiesPromise = state.value.specialties.length
          ? Promise.resolve(null as ISpecialty[] | null)
          : SpecialtyService.getAll()

        const [postsRes, specialties] = await Promise.all([
          PostService.getListPaginated({
            ...q,
            all: !state.value.activeOnly,
            specialtyId: state.value.filterSpecialtyId,
          }),
          specialtiesPromise,
        ])

        if (specialties) {
          state.value.specialties = specialties
        }

        return postsRes
      },
      applyResponse: (res) => {
        state.value.list = res.data
      },
    })

  function getSpecialtiesByIds(specialtyIds: string[]): ISpecialty[] {
    return state.value.specialties.filter((specialty) =>
      specialtyIds.includes(specialty.id),
    )
  }

  function openSpecialtiesDialog(specialtyIds: string[]) {
    state.value.selectedSpecialties = getSpecialtiesByIds(specialtyIds)
    toggleDialog(dialog.specialties)
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
        await refreshCurrentPage()
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

  function openActionDialog(action: ActionDialogOptions) {
    state.value.actionType = action
    toggleDialog(dialog.action)
  }

  async function openEditDialog(item?: IPostNameListItem) {
    await router.push({
      name: 'postEdit',
      params: item ? { postId: item.id } : {},
    })
  }

  return {
    state,
    filter,
    pagination,
    tableLoading,
    dialog,
    loader,
    onRequest,
    refreshCurrentPage,
    toggleDialog,
    dialogIsOpen,
    createDialog,
    loaderStatus,
    confirmAction,
    openEditDialog,
    openActionDialog,
    toggleActiveOnly,
    getSpecialtiesByIds,
    openSpecialtiesDialog,
  }
}
