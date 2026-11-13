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
    label: 'Sem vínculo',
    field: 'isUnlinked',
    name: 'isUnlinked',
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
