import type { Status } from 'src/enums/Status.enum'
import type { ISpecialty } from './ISpecialty.type'
import type { ISubspecialtyGroup } from './ISubspecialtyGroup.type'

export interface ISubspecialty {
  id: string
  name: string
  specialty: ISpecialty
  subspecialtyGroup: ISubspecialtyGroup
  status: Status
}
