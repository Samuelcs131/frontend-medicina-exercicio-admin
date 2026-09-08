import { ref } from 'vue'
import requester from 'src/helpers/requester/Requester.helper'
import * as ProfessionalService from 'src/services/professional/professional.service'
import * as ProfessionalAvailabilityService from 'src/services/professional-availability/professionalAvailability.service'
import type { IBasicEntity } from 'src/types/IBasicEntity.type'
import type {
    IAvailabilityDay,
    IProfessionalAvailability,
} from 'src/types/professional-availability/IProfessionalAvailability.type'
import { MAX_AVAILABILITY_HORIZON_MONTHS } from 'src/constants/availability.const'
import { cloneDeep } from 'src/utils/clone.util'

interface IState {
    professionals: IBasicEntity<string>[]
    professionalId: string | null
    weeklyHours: IAvailabilityDay[]
    blockedDates: string[]
    newBlockedDate: string
    horizonMonths: number
    slotDurationMinutes: number
}

function emptyWeeklyHours(): IAvailabilityDay[] {
    return [0, 1, 2, 3, 4, 5, 6].map((weekday) => ({
        weekday,
        enabled: false,
        ranges: [],
    }))
}

export function useProfessionalAvailabilityPage() {
    const state = ref<IState>({
        professionals: [],
        professionalId: null,
        weeklyHours: emptyWeeklyHours(),
        blockedDates: [],
        newBlockedDate: '',
        horizonMonths: MAX_AVAILABILITY_HORIZON_MONTHS,
        slotDurationMinutes: 30,
    })

    const loader = {
        professionals: 'availability-professionals-fetch',
        availability: 'availability-fetch',
        save: 'availability-save',
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

    function applyAvailability(availability: IProfessionalAvailability) {
        state.value.weeklyHours = cloneDeep(availability.weeklyHours)
        state.value.blockedDates = cloneDeep(availability.blockedDates)
        state.value.horizonMonths = availability.horizonMonths
        state.value.slotDurationMinutes = availability.slotDurationMinutes
    }

    async function selectProfessional(professionalId: string | null) {
        state.value.professionalId = professionalId
        state.value.weeklyHours = emptyWeeklyHours()
        state.value.blockedDates = []

        if (!professionalId) return

        await requester.dispatch({
            callback: async () => {
                const availability =
                    await ProfessionalAvailabilityService.getByProfessionalId(
                        professionalId,
                    )
                applyAvailability(availability)
            },
            errorMessageTitle: 'Houve um erro',
            errorMessage: 'Não foi possível buscar a disponibilidade do profissional',
            loaders: [loader.availability],
        })
    }

    function addRange(weekday: number) {
        const day = state.value.weeklyHours.find((item) => item.weekday === weekday)
        if (!day) return
        day.ranges.push({ start: '08:00', end: '18:00' })
    }

    function removeRange(weekday: number, index: number) {
        const day = state.value.weeklyHours.find((item) => item.weekday === weekday)
        if (!day) return
        day.ranges.splice(index, 1)
    }

    function addBlockedDate() {
        const date = state.value.newBlockedDate
        if (!date) return
        if (!state.value.blockedDates.includes(date))
            state.value.blockedDates.push(date)
        state.value.newBlockedDate = ''
    }

    function removeBlockedDate(date: string) {
        state.value.blockedDates = state.value.blockedDates.filter(
            (item) => item !== date,
        )
    }

    async function save() {
        if (!state.value.professionalId) return

        await requester.dispatch({
            callback: async () => {
                await ProfessionalAvailabilityService.save(
                    state.value.professionalId as string,
                    state.value.weeklyHours,
                    state.value.blockedDates,
                    state.value.horizonMonths,
                    state.value.slotDurationMinutes,
                )
            },
            successMessageTitle: 'Disponibilidade salva com sucesso',
            errorMessageTitle: 'Houve um erro',
            errorMessage: 'Não foi possível salvar a disponibilidade',
            loaders: [loader.save],
        })
    }

    return {
        state,
        loader,
        fetchProfessionals,
        selectProfessional,
        addRange,
        removeRange,
        addBlockedDate,
        removeBlockedDate,
        save,
    }
}
