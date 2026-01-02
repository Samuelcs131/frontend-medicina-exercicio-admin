import { PostTypeContent } from 'src/enums/post/PostTypeContent.enum'
import type { Status } from 'src/enums/Status.enum'

export interface IPost {
  id: string
  title: string
  schedulingDate: string
  url: string
  professionalId: string
  subspecialtyIds: string[]
  specialtyIds: string[]
  tagTitle: string
  tagDescription: string
  tagKeywords: string
  thumbnailUrlImage: string
  thumbnailAlt: string
  status: Status
  postItems: IPostItem[]
  recomendations: {
    specialtyIds: string[]
    readMorePostIds: string[]
    outherContentPostIds: string[]
  }
}

export interface IPostResume {
  id: string
  title: string
  schedulingDate: string
  status: Status
  thumbnailUrlImage: string
  specialtyIds: string[]
  clicks: number
}

export interface IImageFile {
  [key: string]: File
}

export interface IPostItem {
  key: string | null
  contentHTML: string
  postTypeContent: PostTypeContent
  imageFiles?: IImageFile
}
