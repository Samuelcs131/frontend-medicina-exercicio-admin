import type { QTableColumn } from 'quasar'

export const specialtyTableColumns: QTableColumn[] = [
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
    sortable: false,
    align: 'left',
    format: (v) => (v?.name ? v.name : '-'),
  },
  {
    label: 'Profissionais',
    field: 'professionalCount',
    name: 'professionalCount',
    align: 'left',
    format: (value) => value ?? 0,
  },
  {
    label: 'Vídeos',
    field: 'videoCount',
    name: 'videoCount',
    align: 'left',
    format: (value) => value ?? 0,
  },
  {
    label: 'Conteúdos informativos',
    field: 'informativeContentCount',
    name: 'informativeContentCount',
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
