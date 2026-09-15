import type { QTableColumn } from 'quasar'
import { rolesDictionary } from 'src/constants/roles.const'

export const userTableColumns: QTableColumn[] = [
  {
    label: 'Nome',
    field: 'name',
    name: 'name',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Email',
    field: 'email',
    name: 'email',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Tipo de usuário',
    field: 'role',
    name: 'role',
    sortable: true,
    align: 'left',
    format: (v: unknown) => v ? rolesDictionary[v as keyof typeof rolesDictionary].name : '',
  },
  {
    label: 'Status',
    field: 'status',
    name: 'status',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Ações',
    field: 'actions',
    name: 'actions',
    align: 'left',
  },
]
