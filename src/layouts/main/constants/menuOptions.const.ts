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
    roles: [Roles.admin],
    children: [
      {
        icon: '',
        name: 'Áreas profissionais',
        separator: false,
        to: { name: 'profissionalArea' },
        roles: [Roles.admin],
        children: [],
      },
      {
        icon: '',
        name: 'Especialidades',
        separator: false,
        to: { name: 'specialty' },
        roles: [Roles.admin],
        children: [],
      },
      {
        icon: '',
        name: 'Grupo de artigos',
        separator: false,
        to: { name: 'subspecialtyGroup' },
        roles: [Roles.admin],
        children: [],
      },
      {
        icon: '',
        name: 'Subespecialidades',
        separator: false,
        to: { name: 'subspecialty' },
        roles: [Roles.admin],
        children: [],
      },
    ],
  },
  {
    icon: 'emergency',
    name: 'Locais de atendimento',
    separator: false,
    to: { name: 'localService' },
    roles: [Roles.admin],
    children: [],
  },
  {
    icon: 'health_and_safety',
    name: 'Profissionais',
    separator: false,
    to: { name: 'professional' },
    roles: [Roles.admin, Roles.medico],
    children: [],
  },
  {
    icon: 'article',
    name: 'Postagens',
    separator: false,
    to: { name: 'post' },
    roles: [Roles.admin, Roles.editor, Roles.colaborador],
    children: [],
  },
  {
    icon: 'ondemand_video',
    name: 'Vídeos',
    separator: false,
    to: { name: 'video' },
    roles: [Roles.admin],
    children: [],
  },
  {
    icon: 'volunteer_activism',
    name: 'Apoiadores',
    separator: false,
    to: { name: 'supporter' },
    roles: [Roles.admin],
    children: [],
  },
  {
    icon: 'event',
    name: 'Agendamentos',
    separator: false,
    to: { name: 'bookingManagement' },
    roles: [Roles.admin, Roles.medico],
    children: [],
  },
  {
    icon: 'event_available',
    name: 'Disponibilidade',
    separator: false,
    to: { name: 'professionalAvailability' },
    roles: [Roles.admin, Roles.medico],
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
