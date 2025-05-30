import { Status } from 'src/enums/Status.enum'

export interface ISupporter {
  id: string
  name: string
  imageURL: string
  status: Status
}
