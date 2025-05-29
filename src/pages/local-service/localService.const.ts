import type { QTableColumn } from 'quasar'

export const localServiceTableColumns: QTableColumn[] = [
  {
    label: 'Nome',
    field: 'name',
    name: 'name',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Contato',
    field: 'contact',
    name: 'contact',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Possui Whatsapp',
    field: 'hasWhatsapp',
    name: 'hasWhatsapp',
    sortable: true,
    align: 'left',
    format: (v) => (v ? 'Sim' : 'Não'),
  },
  {
    label: 'Estado',
    field: 'state',
    name: 'state',
    sortable: true,
    align: 'left',
    format: (v) => v.name,
  },
  {
    label: 'Cidade',
    field: 'city',
    name: 'city',
    sortable: true,
    align: 'left',
    format: (v) => v.name,
  },
  {
    label: 'Rua',
    field: 'street',
    name: 'street',
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
