import type { Status } from "src/enums/Status.enum"

export interface IPostInGroup {
  id: string
  title: string
  folderPath: string
  order: number
}

export interface ISpecialtyInGroup {
  id: string
  name: string
  folderPath: string | null
}

export interface ISubspecialtyGroup {
  id: string
  name: string
  description?: string
  imageURL: string
  status: Status
  order?: number | null
  posts?: IPostInGroup[]
  specialty?: ISpecialtyInGroup
  videos?: { id: string; name: string }[]
  // Campos para o formulário (gerados a partir de posts e specialty)
  postIds?: string[]
  videoIds?: string[]
  specialtyId?: string
  orderPosts?: Array<{ postId: string; order: number }>
  createdAt?: string
  updatedAt?: string
}
