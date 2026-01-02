import type { QTableColumn } from 'quasar'
import { formatDate } from 'src/utils/date.util'

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
    field: 'createAt',
    name: 'createAt',
    sortable: true,
    align: 'left',
    format: () => formatDate(new Date().toISOString()),
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
