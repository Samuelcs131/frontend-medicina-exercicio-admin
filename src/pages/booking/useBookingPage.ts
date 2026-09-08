import { ref, computed } from 'vue'
import requester from 'src/helpers/requester/Requester.helper'
import * as BookingService from 'src/services/booking/booking.service'
import * as ProfessionalService from 'src/services/professional/professional.service'
import * as ProfessionalAvailabilityService from 'src/services/professional-availability/professionalAvailability.service'
import type { IBookingTimeSlot } from 'src/types/booking/IBooking.type'
import type { IBasicEntity } from 'src/types/IBasicEntity.type'
import type { IProfessionalAvailability } from 'src/types/professional-availability/IProfessionalAvailability.type'
import { cloneDeep } from 'src/utils/clone.util'

interface IForm {
    fullName: string
    email: string
    phone: string
    notes: string
}

interface IState {
    professionals: IBasicEntity<string>[]
    professionalId: string | null
    availability: IProfessionalAvailability | null
    date: string // DD/MM/YYYY (formato do q-date)
    slots: IBookingTimeSlot[]
    selectedTime: string | null
    form: IForm
    confirmed: boolean
}

const initForm: IForm = {
    fullName: '',
    email: '',
    phone: '',
    notes: '',
}

export function useBookingPage() {
    const state = ref<IState>({
        professionals: [],
        professionalId: null,
        availability: null,
        date: '',
        slots: [],
        selectedTime: null,
        form: cloneDeep(initForm),
        confirmed: false,
    })

    const loader = {
        professionals: 'booking-professionals-fetch',
        availability: 'booking-availability-fetch',
        slots: 'booking-slots-fetch',
        submit: 'booking-submit',
    }

    const dateApi = computed(() => toIsoDate(state.value.date))

    const selectedProfessionalName = computed(() => {
        return (
            state.value.professionals.find(
                (professional) => professional.id === state.value.professionalId,
            )?.name ?? ''
        )
    })

    function toIsoDate(dateBr: string): string {
        if (!dateBr) return ''
        const [day, month, year] = dateBr.split('/')
        if (!day || !month || !year) return ''
        return `${year}-${month}-${day}`
    }

    async function fetchProfessionals() {
        await requester.dispatch({
            callback: async () => {
                state.value.professionals = await ProfessionalService.getAllNames()
            },
            errorMessageTitle: 'Houve um erro',
            errorMessage: 'Não foi possível buscar os profissionais',
            loaders: [loader.professionals],
        })
    }

    async function selectProfessional(professionalId: string | null) {
        state.value.professionalId = professionalId
        state.value.date = ''
        state.value.slots = []
        state.value.selectedTime = null
        state.value.availability = null

        if (!professionalId) return

        await requester.dispatch({
            callback: async () => {
                state.value.availability =
                    await ProfessionalAvailabilityService.getByProfessionalId(
                        professionalId,
                    )
            },
            errorMessageTitle: 'Houve um erro',
            errorMessage: 'Não foi possível buscar a disponibilidade do profissional',
            loaders: [loader.availability],
        })
    }

    async function fetchSlots() {
        if (!dateApi.value || !state.value.professionalId) return

        state.value.selectedTime = null

        await requester.dispatch({
            callback: async () => {
                state.value.slots = await BookingService.getAvailableSlots(
                    state.value.professionalId as string,
                    dateApi.value,
                )
            },
            errorMessageTitle: 'Houve um erro',
            errorMessage: 'Não foi possível buscar os horários disponíveis',
            loaders: [loader.slots],
        })
    }

    function selectTime(time: string) {
        state.value.selectedTime = time
    }

    async function confirmBooking() {
        if (!state.value.selectedTime || !dateApi.value || !state.value.professionalId)
            return

        await requester.dispatch({
            callback: async () => {
                await BookingService.create(
                    state.value.professionalId as string,
                    selectedProfessionalName.value,
                    state.value.form.fullName,
                    state.value.form.email,
                    state.value.form.phone,
                    dateApi.value,
                    state.value.selectedTime as string,
                    state.value.form.notes,
                )
            },
            successCallback: () => {
                state.value.confirmed = true
            },
            successMessageTitle: 'Agendamento confirmado',
            errorMessageTitle: 'Houve um erro',
            errorMessage: 'Não foi possível concluir o agendamento',
            loaders: [loader.submit],
        })
    }

    function resetBooking() {
        state.value.selectedTime = null
        state.value.confirmed = false
        state.value.form = cloneDeep(initForm)
        void fetchSlots()
    }

    return {
        state,
        loader,
        selectedProfessionalName,
        fetchProfessionals,
        selectProfessional,
        fetchSlots,
        selectTime,
        confirmBooking,
        resetBooking,
    }
}
