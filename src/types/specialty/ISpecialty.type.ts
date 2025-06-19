import type { Status } from 'src/enums/Status.enum'
import type { IProfissionalArea } from './IProfissionalArea.type'

export interface ISpecialty {
  id: string
  name: string
  professionalArea: IProfissionalArea
  status: Status
}
