import type { Status } from 'src/enums/Status.enum'
import type { IBasicEntity } from '../IBasicEntity.type'

export interface IProfessional {
  id: string
  name: string
  RQN: string
  CRM: string
  imageURL: string
  specialtyIds: string[]
  subspecialtyIds: string[]
  cities: IBasicEntity<string>[]
  states: IBasicEntity<string>[]
  aboutMy: string
  localServiceIds: string[]
  instagram: string
  site: string
  curriculumLattes: string
  teleconsultation: boolean
  speakEnglish: boolean
  status: Status
  recomendations: {
    professionalVideoIds: string[]
    informativeContentIds: string[]
    otherSpecialtyIds: string[]
  }
  clicks: number
}
