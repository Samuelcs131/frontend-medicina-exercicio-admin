import { useDialog } from 'src/composables/useDialog'
import { useLoader } from 'src/composables/useLoader'
import { BookingStatus } from 'src/enums/BookingStatus.enum'
import { ActionDialogOptions } from 'src/enums/ActionDialogOptions.enum'
import { cloneDeep } from 'src/utils/clone.util'
import { ref } from 'vue'
import requester from 'src/helpers/requester/Requester.helper'
import * as BookingService from 'src/services/booking/booking.service'
import * as ProfessionalService from 'src/services/professional/professional.service'
import type { IBooking } from 'src/types/booking/IBooking.type'
import type { IBasicEntity } from 'src/types/IBasicEntity.type'

interface IState {
    form: {
        id?: string
        professionalId: string
        fullName: string
        email: string
        phone: string
        date: string
        time: string
        notes: string
        status: BookingStatus
    }
    professionals: IBasicEntity<string>[]
    filter: string
    filterStatus: BookingStatus | null
    filterProfessionalId: string | null
    list: IBooking[]
    actionType: ActionDialogOptions
    actionsData: IBooking[]
}

const initState: IState = {
    form: {
        professionalId: '',
        fullName: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        notes: '',
        status: BookingStatus.scheduled,
    },
    professionals: [],
    filter: '',
    filterStatus: null,
    filterProfessionalId: null,
    list: [],
    actionType: ActionDialogOptions.delete,
    actionsData: [],
}

export function useBookingManagementPage() {
    const dialog = {
        edit: 'booking-edit-92h4gzk9',
        action: 'booking-action-01f8kd2',
    }

    const loader = {
        list: 'booking-list-92h4gzk9',
        edit: 'booking-edit-loader-01f8kd2',
        action: 'booking-action-loader-72jd9s',
    }

    const state = ref<IState>(cloneDeep(initState))
    const { createDialog, toggleDialog, dialogIsOpen } = useDialog()
    const { loaderStatus } = useLoader()

    async function fetchList() {
        await requester.dispatch({
            callback: async () => {
                state.value.list = await BookingService.getAll()
            },
            errorMessageTitle: 'Houve um erro',
            errorMessage: 'Não foi possível buscar os agendamentos',
            loaders: [loader.list],
        })
    }

    async function fetchProfessionals() {
        await requester.dispatch({
            callback: async () => {
                state.value.professionals = await ProfessionalService.getAllNames()
            },
            errorMessageTitle: 'Houve um erro',
            errorMessage: 'Não foi possível buscar os profissionais',
            loaders: [loader.list],
        })
    }

    async function save() {
        const id = state.value.form.id
        const professionalName =
            state.value.professionals.find(
                (professional) => professional.id === state.value.form.professionalId,
            )?.name ?? ''

        await requester.dispatch({
            callback: async () => {
                if (id) {
                    await BookingService.update(id, {
                        professionalId: state.value.form.professionalId,
                        professionalName,
                        fullName: state.value.form.fullName,
                        email: state.value.form.email,
                        phone: state.value.form.phone,
                        date: state.value.form.date,
                        time: state.value.form.time,
                        notes: state.value.form.notes,
                        status: state.value.form.status,
                    })
                } else {
                    await BookingService.create(
                        state.value.form.professionalId,
                        professionalName,
                        state.value.form.fullName,
                        state.value.form.email,
                        state.value.form.phone,
                        state.value.form.date,
                        state.value.form.time,
                        state.value.form.notes,
                    )
                }
            },
            successCallback: async () => {
                toggleDialog(dialog.edit)
                await fetchList()
            },
            successMessageTitle: `${id ? 'Editado' : 'Cadastrado'} com sucesso`,
            errorMessageTitle: 'Houve um erro',
            errorMessage: `Não foi possível ${id ? 'editar' : 'salvar'}`,
            loaders: [loader.edit],
        })
    }


    async function confirmAction() {
        await requester.dispatch({
            callback: async () => {
                const ids = state.value.actionsData.map((item) => item.id)
                await BookingService.deleteItem(ids)
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

    function openEditDialog(item?: IBooking) {
        if (item) state.value.form = { ...item, notes: item.notes ?? '' }
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

    return {
        state,
        dialog,
        loader,
        save,
        fetchList,
        fetchProfessionals,
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
