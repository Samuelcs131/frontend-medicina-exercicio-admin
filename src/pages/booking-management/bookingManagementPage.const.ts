import type { QTableColumn } from 'quasar'
import { formatDate } from 'src/utils/date.util'

export const bookingManagementTableColumns: QTableColumn[] = [
    {
        label: 'Profissional',
        field: 'professionalName',
        name: 'professionalName',
        sortable: true,
        align: 'left',
    },
    {
        label: 'Cliente',
        field: 'fullName',
        name: 'fullName',
        sortable: true,
        align: 'left',
    },
    {
        label: 'E-mail',
        field: 'email',
        name: 'email',
        sortable: true,
        align: 'left',
    },
    {
        label: 'Celular',
        field: 'phone',
        name: 'phone',
        sortable: true,
        align: 'left',
    },
    {
        label: 'Data',
        field: 'date',
        name: 'date',
        sortable: true,
        align: 'left',
        format: (v) => (v ? formatDate(v, { dateStyle: 'short' }) : '-'),
    },
    {
        label: 'Horário',
        field: 'time',
        name: 'time',
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
