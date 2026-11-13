import type { Status } from "src/enums/Status.enum"

export interface IProfissionalArea {
  id: string
  name: string
  imageURL: string
  status: Status
  isUnlinked: boolean
  specialtyCount: number
  order?: number
  createdAt?: string | null
  updatedAt?: string | null
}
