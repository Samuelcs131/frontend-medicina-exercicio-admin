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
    label: 'Imagem',
    field: 'thumbnailUrlImage',
    name: 'thumbnailUrlImage',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Autor',
    field: 'author',
    name: 'author',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Data',
    field: 'schedulingDate',
    name: 'schedulingDate',
    sortable: true,
    align: 'left',
    format: (v) => formatDate(v),
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
