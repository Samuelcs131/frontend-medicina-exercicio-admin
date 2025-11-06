import { Roles } from 'src/enums/Roles.enum'

export const rolesOptions = [{ name: 'Administrador', value: Roles.admin }]

type IDictionary = {
  [key in Roles]: { name: string }
}

export const rolesDictionary: IDictionary = {
  [Roles.admin]: { name: 'Administrador' },
  [Roles.editor]: { name: 'Editor' },
}
