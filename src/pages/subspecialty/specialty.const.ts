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
    label: 'Grupo de subespecialidade',
    field: 'subspecialtyGroup',
    name: 'subspecialtyGroup',
    sortable: true,
    align: 'left',
    format: (v) => v.name
  },
  {
    label: 'Especialidade',
    field: 'specialty',
    name: 'specialty',
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
