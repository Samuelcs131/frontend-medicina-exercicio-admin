import type { Status } from "src/enums/Status.enum"

export interface ISubspecialtyGroup {
  id: string
  name: string
  description: string
  imageURL: string
  status: Status
}
