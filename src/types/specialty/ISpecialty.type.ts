import type { Status } from 'src/enums/Status.enum'
import type { IProfissionalArea } from './IProfissionalArea.type'

export interface ISpecialty {
  id: string
  name: string
  professionalArea: IProfissionalArea | null
  status: Status
  isUnlinked: boolean
  professionalCount: number
  videoCount: number
  informativeContentCount: number
  createdAt?: string | null
  updatedAt?: string | null
}
