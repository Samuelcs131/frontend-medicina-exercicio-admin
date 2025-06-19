import type { Status } from 'src/enums/Status.enum'

export interface IVideo {
  id: string
  name: string
  url: string
  description: string
  professionalIds: string[]
  specialtyIds: string[]
  subspecialtyIds: string[]
  status: Status
  clicks: number
  recomendations: {
    outherVideosIds: string[]
    moreVideosIds: string[]
    specialtyIds: string[]
    postIds: string[]
  }
}
