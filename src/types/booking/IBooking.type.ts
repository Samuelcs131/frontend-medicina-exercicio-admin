import type { BookingStatus } from 'src/enums/BookingStatus.enum'

export interface IBooking {
    id: string
    professionalId: string
    professionalName: string
    fullName: string
    email: string
    phone: string
    date: string // yyyy-MM-dd
    time: string // HH:mm
    notes?: string
    status: BookingStatus
    createdAt?: string
    updatedAt?: string
}

export interface IBookingTimeSlot {
    time: string
    available: boolean
}
