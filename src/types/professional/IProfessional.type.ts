import type { Status } from 'src/enums/Status.enum'

/** Referência de estado como a API costuma devolver em GET (além de `string[]`). */
export interface IProfessionalStateRef {
  id: string
  sigla?: string
  name?: string
}

export interface IProfessional {
  id: string
  name: string
  RQN: string
  CRM: string
  imageURL: string
  specialtyIds: string[]
  subspecialtyIds: string[]
  cities: string[] | Array<{ id: string; name?: string }>
  states: string[] | IProfessionalStateRef[]
  aboutMy: string
  locationService: string[]
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
  } | null
  clicks: number
  createdAt?: string | null
  updatedAt?: string | null
}
