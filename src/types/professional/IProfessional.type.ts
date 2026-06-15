import type { Status } from 'src/enums/Status.enum'

export interface IProfessionalLocalServiceInfo {
  localServiceId: string
  contact: string
  hasWhatsapp: boolean
  complement: string
}

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
  serviceLocations?: IProfessionalLocalServiceInfo[]
  clicks: number
  createdAt?: string | null
  updatedAt?: string | null
}
