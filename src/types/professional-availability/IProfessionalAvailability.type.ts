export interface IAvailabilityRange {
  start: string 
  end: string 
}

export interface IAvailabilityDay {
  weekday: number // 0 = domingo ... 6 = sábado
  enabled: boolean
  ranges: IAvailabilityRange[]
}

export interface IProfessionalAvailability {
  professionalId: string
  slotDurationMinutes: number
  weeklyHours: IAvailabilityDay[]
  blockedDates: string[] // yyyy-MM-dd, exceções pontuais (ex.: férias)
  horizonMonths: number // limite máximo: 6 (semestral)
}
