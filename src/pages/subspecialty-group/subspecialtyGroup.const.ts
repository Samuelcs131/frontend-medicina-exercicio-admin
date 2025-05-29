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
