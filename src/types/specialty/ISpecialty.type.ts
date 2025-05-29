import type { Status } from 'src/enums/Status.enum'
import type { IMedicalArea } from './IMedicalArea.type'

export interface ISpecialty {
  id: string
  name: string
  medicalArea: IMedicalArea
  status: Status
}
