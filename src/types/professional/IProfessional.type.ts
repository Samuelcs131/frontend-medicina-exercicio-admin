import type { Status } from 'src/enums/Status.enum'

export interface IProfessional {
  id: string
  name: string
  RQN: string
  CRM: string
  imageURL: string
  specialtyIds: string[]
  subspecialtyIds: string[]
  cities: string[]
  states: string[]
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
