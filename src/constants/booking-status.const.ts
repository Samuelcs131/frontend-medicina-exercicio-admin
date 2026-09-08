import { BookingStatus } from 'src/enums/BookingStatus.enum'

export const bookingStatusOptions = [
    {
        name: 'Agendado',
        value: BookingStatus.scheduled,
        color: 'blue',
    },
    {
        name: 'Confirmado',
        value: BookingStatus.confirmed,
        color: 'green',
    },
    {
        name: 'Cancelado',
        value: BookingStatus.cancelled,
        color: 'red',
    },
    {
        name: 'Concluído',
        value: BookingStatus.completed,
        color: 'grey-8',
    },
]

type IDictionary = {
    [key in BookingStatus]: {
        name: string
        color: string
    }
}

export const bookingStatusDictionary: IDictionary = {
    [BookingStatus.scheduled]: { name: 'Agendado', color: 'blue' },
    [BookingStatus.confirmed]: { name: 'Confirmado', color: 'green' },
    [BookingStatus.cancelled]: { name: 'Cancelado', color: 'red' },
    [BookingStatus.completed]: { name: 'Concluído', color: 'grey-8' },
}
