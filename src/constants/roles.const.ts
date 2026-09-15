import { Roles } from 'src/enums/Roles.enum'

export const rolesOptions = [
  { name: 'Administrador', value: Roles.admin },
  { name: 'Editor', value: Roles.editor },
  { name: 'Médico', value: Roles.medico },
  { name: 'Colaborador', value: Roles.colaborador },
]

type IDictionary = {
  [key in Roles]: { name: string }
}

export const rolesDictionary: IDictionary = {
  [Roles.admin]: { name: 'Administrador' },
  [Roles.editor]: { name: 'Editor' },
  [Roles.medico]: { name: 'Médico' },
  [Roles.colaborador]: { name: 'Colaborador' },
}
