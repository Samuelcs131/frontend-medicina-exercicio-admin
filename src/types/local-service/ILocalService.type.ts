import type { Status } from 'src/enums/Status.enum'

export interface ILocalService {
  id: string
  name: string
  state: string
  city: string
  street: string
  coordinates: string
  status: Status
  createdAt?: string | null
  updatedAt?: string | null
  cep: string
  linkGoogleMaps: string  
  number: number
}
