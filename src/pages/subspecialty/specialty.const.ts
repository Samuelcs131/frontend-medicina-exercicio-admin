import type { QTableColumn } from 'quasar'

export const subspecialtyTableColumns: QTableColumn[] = [
  {
    label: 'Nome',
    field: 'name',
    name: 'name',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Especialidade',
    field: 'specialty',
    name: 'specialty',
    sortable: false,
    align: 'left',
    format: (v) => (v?.name ? v.name : '-'),
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
