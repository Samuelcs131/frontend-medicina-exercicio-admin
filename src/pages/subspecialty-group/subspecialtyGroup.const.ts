import type { QTableColumn } from 'quasar'
import { formatDate } from 'src/utils/date.util'

export const subspecialtyGroupTableColumns: QTableColumn[] = [
  {
    label: 'Nome',
    field: 'name',
    name: 'name',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Atualizado em',
    field: 'updatedAt',
    name: 'updatedAt',
    sortable: true,
    align: 'left',
    format: (v) => (v ? formatDate(v) : '-'),
  },
  {
    label: 'Especialidade',
    field: 'specialty',
    name: 'specialty',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Descrição',
    field: 'description',
    name: 'description',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Imagem',
    field: 'imageURL',
    name: 'imageURL',
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
