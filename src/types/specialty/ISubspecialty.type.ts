import type { Status } from 'src/enums/Status.enum'
import type { ISpecialty } from './ISpecialty.type'
import type { ISubspecialtyGroup } from './ISubspecialtyGroup.type'

export interface ISubspecialty {
  id: string
  name: string
  specialty: ISpecialty | null
  subspecialtyGroup: ISubspecialtyGroup
  status: Status
  createdAt?: string | null
  updatedAt?: string | null
}
