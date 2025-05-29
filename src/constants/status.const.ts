import { Status } from 'src/enums/Status.enum'

export const statusOptions = [
  {
    name: 'Ativo',
    value: Status.active,
    color: 'green',
  },
  {
    name: 'Inativo',
    value: Status.inactive,
    color: 'red',
  },
]

type IDictionary = {
  [key in Status]: {
    name: string
    color: string
  }
}

export const statusDictionary: IDictionary = {
  [Status.active]: {
    name: 'Ativo',
    color: 'green',
  },
  [Status.inactive]: {
    name: 'Inativo',
    color: 'red',
  },
}
