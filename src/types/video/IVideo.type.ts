import type { Status } from 'src/enums/Status.enum'

export interface IVideo {
  id: string
  name: string
  url: string 
  description: string
  professionalIds: string[]
  specialtyIds: string[]
  status: Status
}
