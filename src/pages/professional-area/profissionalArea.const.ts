import type { QTableColumn } from 'quasar'

export const profissionalAreaTableColumns: QTableColumn[] = [
  {
    label: 'Nome',
    field: 'name',
    name: 'name',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Imagem',
    field: 'imageURL',
    name: 'imageURL',
    sortable: false,
    align: 'left',
  },
  {
    label: 'Especialidades',
    field: 'specialtyCount',
    name: 'specialtyCount',
    align: 'left',
    format: (value) => value ?? 0,
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
