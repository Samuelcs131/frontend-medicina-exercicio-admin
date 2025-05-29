import type { Roles } from 'src/enums/Roles.enum'
import type { Status } from 'src/enums/Status.enum'

export interface IUser {
  id: string
  name: string
  email: string
  status: Status
  roles: Roles[]
}
