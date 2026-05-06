import type { QTableColumn } from 'quasar'

export const videoPageTableColumns: QTableColumn[] = [
  {
    label: 'Nome',
    field: 'name',
    name: 'name',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Especialidades',
    field: 'specialtyIds',
    name: 'specialtyIds',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Data da publicação',
    field: 'createdAt',
    name: 'createdAt',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Imagem',
    field: 'url',
    name: 'url',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Clicks',
    field: 'clicks',
    name: 'clicks',
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
