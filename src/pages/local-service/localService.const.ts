import type { QTableColumn } from 'quasar'

export const localServiceTableColumns: QTableColumn[] = [
  {
    label: 'Nome',
    field: 'name',
    name: 'name',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Estado',
    field: 'state',
    name: 'state',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Cidade',
    field: 'city',
    name: 'city',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Número',
    field: 'number',
    name: 'number',
    sortable: true,
    align: 'left',
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
