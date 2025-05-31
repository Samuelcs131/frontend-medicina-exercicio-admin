import type { Status } from 'src/enums/Status.enum'
import type { IBasicEntity } from '../IBasicEntity.type'

export interface IProfessional {
  id: string
  name: string
  RQN: string
  CRM: string
  imageURL: string
  specialties: IBasicEntity<string>[]
  subspecialties: IBasicEntity<string>[]
  city: IBasicEntity<string>
  state: IBasicEntity<string>
  aboutMy: string
  localServiceIds: string[]
  instagram: string
  site: string
  curriculumLattes: string
  teleconsultation: boolean
  speakEnglish: boolean
  status: Status
}
