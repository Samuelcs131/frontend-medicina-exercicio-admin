import { BookingStatus } from 'src/enums/BookingStatus.enum'
import type { IBooking, IBookingTimeSlot } from 'src/types/booking/IBooking.type'
import { fakePromise } from 'src/utils/fakePromise.util'
import { cloneDeep } from 'src/utils/clone.util'
import * as ProfessionalAvailabilityService from 'src/services/professional-availability/professionalAvailability.service'
import {
    isDateAvailable,
    parseIsoDateLocal,
} from 'src/services/professional-availability/professionalAvailability.service'

/**
 * Camada de serviço com dados mocados (sem backend real).
 * Simula latência de rede com `fakePromise` e mantém os dados em memória.
 */

function todayPlusDays(days: number): string {
    const date = new Date()
    date.setDate(date.getDate() + days)
    return date.toISOString().slice(0, 10)
}

function generateId(): string {
    return `bk-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

let bookings: IBooking[] = [
    {
        id: generateId(),
        professionalId: 'mock-professional-1',
        professionalName: 'Dra. Fernanda Costa',
        fullName: 'Maria Souza',
        email: 'maria.souza@email.com',
        phone: '11987654321',
        date: todayPlusDays(0),
        time: '09:00',
        notes: 'Primeira consulta',
        status: BookingStatus.confirmed,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: generateId(),
        professionalId: 'mock-professional-1',
        professionalName: 'Dra. Fernanda Costa',
        fullName: 'João Pereira',
        email: 'joao.pereira@email.com',
        phone: '11991234567',
        date: todayPlusDays(0),
        time: '10:30',
        notes: '',
        status: BookingStatus.scheduled,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: generateId(),
        professionalId: 'mock-professional-2',
        professionalName: 'Dr. Ricardo Alves',
        fullName: 'Ana Lima',
        email: 'ana.lima@email.com',
        phone: '11998765432',
        date: todayPlusDays(1),
        time: '14:00',
        notes: 'Retorno',
        status: BookingStatus.scheduled,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: generateId(),
        professionalId: 'mock-professional-2',
        professionalName: 'Dr. Ricardo Alves',
        fullName: 'Carlos Nogueira',
        email: 'carlos.nogueira@email.com',
        phone: '11999887766',
        date: todayPlusDays(-2),
        time: '11:00',
        notes: '',
        status: BookingStatus.completed,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: generateId(),
        professionalId: 'mock-professional-1',
        professionalName: 'Dra. Fernanda Costa',
        fullName: 'Beatriz Alves',
        email: 'beatriz.alves@email.com',
        phone: '11977665544',
        date: todayPlusDays(-1),
        time: '16:00',
        notes: 'Cliente desmarcou',
        status: BookingStatus.cancelled,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
]

function generateRangeSlots(
    start: string,
    end: string,
    slotDurationMinutes: number,
): string[] {
    const slots: string[] = []
    const [startHour, startMinute] = start.split(':').map(Number)
    const [endHour, endMinute] = end.split(':').map(Number)

    let cursor = (startHour ?? 0) * 60 + (startMinute ?? 0)
    const endTotal = (endHour ?? 0) * 60 + (endMinute ?? 0)

    while (cursor + slotDurationMinutes <= endTotal) {
        const hour = Math.floor(cursor / 60)
        const minute = cursor % 60
        slots.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`)
        cursor += slotDurationMinutes
    }

    return slots
}

export async function getAll(): Promise<IBooking[]> {
    await fakePromise(400)
    return cloneDeep(bookings).sort((a, b) =>
        `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`),
    )
}

export async function getByDate(
    professionalId: string,
    date: string,
): Promise<IBooking[]> {
    await fakePromise(300)
    return cloneDeep(
        bookings.filter(
            (booking) => booking.professionalId === professionalId && booking.date === date,
        ),
    )
}

export async function getAvailableSlots(
    professionalId: string,
    date: string,
): Promise<IBookingTimeSlot[]> {
    await fakePromise(300)

    const availability = await ProfessionalAvailabilityService.getByProfessionalId(
        professionalId,
    )

    if (!isDateAvailable(availability, date)) return []

    const weekday = parseIsoDateLocal(date).getDay()
    const day = availability.weeklyHours.find((item) => item.weekday === weekday)
    if (!day) return []

    const bookedTimes = new Set(
        bookings
            .filter(
                (booking) =>
                    booking.professionalId === professionalId &&
                    booking.date === date &&
                    booking.status !== BookingStatus.cancelled,
            )
            .map((booking) => booking.time),
    )

    const isToday = date === todayPlusDays(0)
    const now = new Date()

    const allSlots = day.ranges.flatMap((range) =>
        generateRangeSlots(range.start, range.end, availability.slotDurationMinutes),
    )

    return allSlots.map((time) => {
        let available = !bookedTimes.has(time)

        if (available && isToday) {
            const [hour, minute] = time.split(':').map(Number)
            const slotDate = new Date()
            slotDate.setHours(hour ?? 0, minute ?? 0, 0, 0)
            if (slotDate.getTime() <= now.getTime()) available = false
        }

        return { time, available }
    })
}

export async function create(
    professionalId: string,
    professionalName: string,
    fullName: string,
    email: string,
    phone: string,
    date: string,
    time: string,
    notes?: string,
): Promise<IBooking> {
    await fakePromise(500)

    const availability = await ProfessionalAvailabilityService.getByProfessionalId(
        professionalId,
    )

    if (!isDateAvailable(availability, date))
        throw new Error('Data indisponível para este profissional')

    const alreadyBooked = bookings.some(
        (booking) =>
            booking.professionalId === professionalId &&
            booking.date === date &&
            booking.time === time &&
            booking.status !== BookingStatus.cancelled,
    )

    if (alreadyBooked) throw new Error('Horário indisponível')

    const booking: IBooking = {
        id: generateId(),
        professionalId,
        professionalName,
        fullName,
        email,
        phone,
        date,
        time,
        notes: notes ?? '',
        status: BookingStatus.scheduled,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }

    bookings.push(booking)
    return cloneDeep(booking)
}

export async function update(
    id: string,
    data: Partial<
        Pick<
            IBooking,
            | 'professionalId'
            | 'professionalName'
            | 'fullName'
            | 'email'
            | 'phone'
            | 'date'
            | 'time'
            | 'notes'
            | 'status'
        >
    >,
): Promise<void> {
    await fakePromise(400)

    const booking = bookings.find((item) => item.id === id)
    if (!booking) throw new Error('Agendamento não encontrado')

    Object.assign(booking, data, { updatedAt: new Date().toISOString() })
}

export async function updateStatus(
    ids: string[],
    status: BookingStatus,
): Promise<void> {
    await fakePromise(400)

    bookings = bookings.map((booking) =>
        ids.includes(booking.id)
            ? { ...booking, status, updatedAt: new Date().toISOString() }
            : booking,
    )
}

export async function deleteItem(ids: string[]): Promise<void> {
    await fakePromise(400)
    bookings = bookings.filter((booking) => !ids.includes(booking.id))
}
