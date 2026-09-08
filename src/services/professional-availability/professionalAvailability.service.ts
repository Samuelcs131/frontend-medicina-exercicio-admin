import { fakePromise } from 'src/utils/fakePromise.util'
import { cloneDeep } from 'src/utils/clone.util'
import { MAX_AVAILABILITY_HORIZON_MONTHS } from 'src/constants/availability.const'
import type {
    IAvailabilityDay,
    IProfessionalAvailability,
} from 'src/types/professional-availability/IProfessionalAvailability.type'

/**
 * Camada de serviço com dados mocados (sem backend real).
 * Guarda em memória a disponibilidade semanal de cada profissional.
 */

function defaultWeeklyHours(): IAvailabilityDay[] {
    return [0, 1, 2, 3, 4, 5, 6].map((weekday) => ({
        weekday,
        enabled: weekday >= 1 && weekday <= 5, // seg a sex habilitado por padrão
        ranges:
            weekday >= 1 && weekday <= 5
                ? [{ start: '08:00', end: '12:00' }, { start: '13:00', end: '18:00' }]
                : [],
    }))
}

function defaultAvailability(professionalId: string): IProfessionalAvailability {
    return {
        professionalId,
        slotDurationMinutes: 30,
        weeklyHours: defaultWeeklyHours(),
        blockedDates: [],
        horizonMonths: MAX_AVAILABILITY_HORIZON_MONTHS,
    }
}

const availabilityByProfessional = new Map<string, IProfessionalAvailability>()

/** Converte yyyy-MM-dd em Date local, evitando problemas de fuso horário. */
export function parseIsoDateLocal(date: string): Date {
    const [year, month, day] = date.split('-').map(Number)
    return new Date(year ?? 0, (month ?? 1) - 1, day ?? 1)
}

export function isDateWithinHorizon(
    date: string,
    horizonMonths: number,
): boolean {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const maxDate = new Date(today)
    maxDate.setMonth(maxDate.getMonth() + horizonMonths)

    const target = parseIsoDateLocal(date)
    return target.getTime() >= today.getTime() && target.getTime() <= maxDate.getTime()
}

export function isDateAvailable(
    availability: IProfessionalAvailability,
    date: string,
): boolean {
    if (!isDateWithinHorizon(date, availability.horizonMonths)) return false
    if (availability.blockedDates.includes(date)) return false

    const weekday = parseIsoDateLocal(date).getDay()
    const day = availability.weeklyHours.find((item) => item.weekday === weekday)

    return Boolean(day?.enabled && day.ranges.length)
}

export async function getByProfessionalId(
    professionalId: string,
): Promise<IProfessionalAvailability> {
    await fakePromise(300)

    if (!availabilityByProfessional.has(professionalId))
        availabilityByProfessional.set(
            professionalId,
            defaultAvailability(professionalId),
        )

    return cloneDeep(availabilityByProfessional.get(professionalId)!)
}

export async function save(
    professionalId: string,
    weeklyHours: IAvailabilityDay[],
    blockedDates: string[],
    horizonMonths: number,
    slotDurationMinutes: number,
): Promise<void> {
    await fakePromise(400)

    if (horizonMonths > MAX_AVAILABILITY_HORIZON_MONTHS)
        throw new Error(
            `O período máximo permitido é de ${MAX_AVAILABILITY_HORIZON_MONTHS} meses (semestral)`,
        )

    availabilityByProfessional.set(professionalId, {
        professionalId,
        weeklyHours,
        blockedDates,
        horizonMonths,
        slotDurationMinutes,
    })
}
