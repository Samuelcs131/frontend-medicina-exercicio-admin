import type { QTableColumn } from 'quasar'

export const subspecialtyGroupTableColumns: QTableColumn[] = [
  {
    label: 'Nome',
    field: 'name',
    name: 'name',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Área profissional',
    field: 'professionalArea',
    name: 'professionalArea',
    sortable: true,
    align: 'left',
    format: (v) => v.name
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
