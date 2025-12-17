import type { Status } from 'src/enums/Status.enum'

export interface IVideo {
  id: string
  name: string
  url: string
  description: string
  specialtyIds: string[]
  subspecialtyIds: string[]
  author: string
  guests: string[]
  status: Status
  clicks: number
  recomendations: {
    outherVideosIds: string[]
    moreVideosIds: string[]
    specialtyIds: string[]
    postIds: string[]
    relatedVideoIds: string[]
  }
}
