import type { QTableColumn } from 'quasar'
import { formatDate } from 'src/utils/date.util'

export const postTableColumns: QTableColumn[] = [
  {
    label: 'Título',
    field: 'title',
    name: 'title',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Especialidades',
    field: 'specialtyIds',
    name: 'specialtyIds',
    sortable: false,
    align: 'left',
  },
  {
    label: 'Data',
    field: 'createdAt',
    name: 'createdAt',
    sortable: true,
    align: 'left',
    format: (v) => formatDate(v as string | null | undefined),
  },
  {
    label: 'Ações',
    field: 'actions',
    name: 'actions',
    align: 'left',
  },
]
