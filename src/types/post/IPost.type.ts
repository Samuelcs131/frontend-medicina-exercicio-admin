import { PostTypeContent } from 'src/enums/post/PostTypeContent.enum'
import type { Status } from 'src/enums/Status.enum'

export interface IPost {
  id: string
  title: string
  schedulingDate: string
  url: string

  author: string
  authorDescription: string
  professionalId: string

  subspecialtyId: string
  specialtyId: string

  tagTitle: string
  tagDescription: string
  tagKeywords: string

  thumbnailUrlImage: string
  thumbnailAlt: string

  status: Status

  postItems: IPostItem[]
}

export interface IPostResume {
  id: string
  title: string
  author: string
  schedulingDate: string
  status: Status
  thumbnailUrlImage: string
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
