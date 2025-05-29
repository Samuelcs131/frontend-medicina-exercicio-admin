import type { Status } from "src/enums/Status.enum"

export interface IMedicalArea {
  id: string
  name: string
  imageURL: string
  status: Status
}
