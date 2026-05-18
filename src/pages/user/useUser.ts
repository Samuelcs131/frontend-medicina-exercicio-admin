import { useDialog } from 'src/composables/useDialog'
import { useListTableRequest } from 'src/composables/useListTableRequest'
import { useLoader } from 'src/composables/useLoader'
import type { Roles } from 'src/enums/Roles.enum'
import type { Status } from 'src/enums/Status.enum'
import type { IUser } from 'src/types/user/IUser.type'
import { cloneDeep } from 'src/utils/clone.util'
import { ref } from 'vue'
import requester from 'src/helpers/requester/Requester.helper'
import * as UserService from 'src/services/user/user.service'
import { ActionDialogOptions } from 'src/enums/ActionDialogOptions.enum'

const DEFAULT_SORT = 'name'

interface IState {
  visiblePassword: boolean
  alterPassword: boolean
  form: {
    id?: string
    name: string
    email: string
    status: Status
    roles: Roles[]
    password: string
    confirmPassword: string
  }
  list: IUser[]
  actionType: ActionDialogOptions
  actionsData: IUser[]
  activeOnly: boolean
}

export function useUser() {
  const initState: IState = {
    form: {
      roles: [],
      shippingType: [],
      shootingPermissions: [],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
    visiblePassword: false,
    alterPassword: false,
    actionsData: [],
    actionType: ActionDialogOptions.delete,
    list: [],
    activeOnly: true,
  }

  const dialog = {
    edit: 'edit-5g4gf543h',
    action: 'action-h53xcvvbv',
  }

  const loader = {
    list: 'list-5g4gf543h',
    edit: 'edit-muk76jntbr',
    action: 'action-h53xcvvbv',
  }

  const state = ref<IState>(cloneDeep(initState))
  const { createDialog, toggleDialog, dialogIsOpen } = useDialog()
  const { loaderStatus } = useLoader()

  const { filter, pagination, tableLoading, onRequest, refreshCurrentPage } =
    useListTableRequest<IUser>({
      defaultOrdertype: DEFAULT_SORT,
      defaultDescending: true,
      initialRowsPerPage: 40,
      loaderListId: loader.list,
      fetchPage: (q) =>
        UserService.getListPaginated({
          ...q,
          all: !state.value.activeOnly,
        }),
      applyResponse: (res) => {
        state.value.list = res.data
      },
    })

  async function save() {
    const id = state.value.form.id

    await requester.dispatch({
      callback: async () => {
        if (id)
          await UserService.save(
            id,
            state.value.form.email,
            state.value.form.name,
            state.value.form.password,
            state.value.form.status,
            state.value.form.roles,
          )
        else
          await UserService.create(
            state.value.form.email,
            state.value.form.name,
            state.value.form.roles,
            state.value.form.password,
          )
      },
      successCallback: async () => {
        await refreshCurrentPage()
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
          await UserService.deleteItem(ids)
        if (actionType == ActionDialogOptions.disable)
          await UserService.disable(ids)
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

  function openEditDialog(item?: IUser) {
    if (item)
      state.value.form = {
        ...item,
        confirmPassword: '',
        password: '',
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
    onRequest,
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
