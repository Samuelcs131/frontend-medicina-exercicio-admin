import type { Status } from 'src/enums/Status.enum'
import type { IBasicEntity } from '../IBasicEntity.type'

export interface ILocalService {
  id: string
  name: string
  contact: string
  hasWhatsapp: boolean
  state: IBasicEntity<string>
  city: IBasicEntity<string>
  street: string
  coordinates: string
  status: Status
}
