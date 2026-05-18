import { Status } from 'src/enums/Status.enum'

export interface ISupporter {
  id: string
  name: string
  imageURL: string
  url?: string
  status: Status
  createdAt?: string | null
  updatedAt?: string | null
}
