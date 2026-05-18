import { PostTypeContent } from 'src/enums/post/PostTypeContent.enum'
import type { Status } from 'src/enums/Status.enum'
import type { IListResponse } from 'src/types/api/IListResponse.type'

export interface IPost {
  id: string
  title: string
  schedulingDate: string
  url: string
  professionalId: string
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
    outherContentIds: string[]
  }
}

/** Resumo retornado pela listagem paginada em `GET /post/names`. */
export interface IPostNameListItem {
  id: string
  title: string
  createdAt?: string | null
  specialtyIds: string[]
}

export type IPostListResponse = IListResponse<IPostNameListItem>

/** Lista completa em `GET /post` (legado / outras telas). */
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
