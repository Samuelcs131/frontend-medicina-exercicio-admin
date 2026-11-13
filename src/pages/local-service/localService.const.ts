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
    label: 'Rua',
    field: 'street',
    name: 'street',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Número',
    field: 'number',
    name: 'number',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Cidade',
    field: 'city',
    name: 'city',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Estado',
    field: 'state',
    name: 'state',
    sortable: true,
    align: 'left',
  },
  {
    label: 'CEP',
    field: 'zipCode',
    name: 'zipCode',
    sortable: true,
    align: 'left',
    format: (value) => {
      const zipCode = String(value ?? '')
      const digits = zipCode.replace(/\D/g, '')
      return digits.length === 8
        ? `${digits.slice(0, 5)}-${digits.slice(5)}`
        : zipCode
    },
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
