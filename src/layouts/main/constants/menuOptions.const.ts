import { Roles } from 'src/enums/Roles.enum'

interface IMenuOptions {
  icon: string
  name: string
  separator: boolean
  to: { name: string }
  roles: Roles[]
  children: IMenuOptions[]
  disable?: boolean
}

export const menuOptions: IMenuOptions[] = [
  {
    icon: 'medical_services',
    name: 'Especialidades',
    separator: false,
    to: { name: '' },
    roles: [],
    children: [
      {
        icon: '',
        name: 'Áreas médica',
        separator: false,
        to: { name: 'medicalArea' },
        roles: [],
        children: [],
      },
      {
        icon: '',
        name: 'Especialidades',
        separator: false,
        to: { name: 'specialty' },
        roles: [],
        children: [],
      },
      {
        icon: '',
        name: 'Grupo de subespecialidades',
        separator: false,
        to: { name: 'subspecialtyGroup' },
        roles: [],
        children: [],
      },
      {
        icon: '',
        name: 'Subespecialidades',
        separator: false,
        to: { name: 'subspecialty' },
        roles: [],
        children: [],
      },
    ],
  },
  {
    icon: 'health_and_safety',
    name: 'Profissionais',
    separator: false,
    to: { name: 'professional' },
    roles: [],
    children: [],
  },
  {
    icon: 'emergency',
    name: 'Locais de atendimento',
    separator: false,
    to: { name: 'localService' },
    roles: [],
    children: [],
  },
  {
    icon: 'ondemand_video',
    name: 'Vídeos',
    separator: false,
    to: { name: 'video' },
    roles: [],
    children: [],
  },
  {
    icon: 'people',
    name: 'Usuários',
    separator: false,
    to: { name: 'user' },
    roles: [Roles.admin],
    children: [],
  },
  {
    icon: 'account_circle',
    name: 'Perfil',
    separator: false,
    to: { name: 'profile' },
    roles: [],
    children: [
      {
        icon: '',
        name: 'Meus dados',
        separator: false,
        to: { name: 'profile' },
        roles: [],
        children: [],
      },
    ],
  },
]
