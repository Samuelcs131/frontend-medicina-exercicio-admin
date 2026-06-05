import type { Status } from 'src/enums/Status.enum'

export interface ILocalService {
  id: string
  name: string
  state: string
  city: string
  street: string
  neighborhood: string
  coordinates: string
  status: Status
  zipCode: string
  googleMapsLink: string
  number: number
  createdAt?: string | null
  updatedAt?: string | null
}
