import type { Status } from "src/enums/Status.enum"

export interface IProfissionalArea {
  id: string
  name: string
  imageURL: string
  status: Status
}
