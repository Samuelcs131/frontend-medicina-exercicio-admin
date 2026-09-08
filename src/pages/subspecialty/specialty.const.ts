import type { QTableColumn } from 'quasar'
import type { ISubspecialty } from 'src/types/specialty/ISubspecialty.type'

export const subspecialtyTableColumns: QTableColumn[] = [
  {
    label: 'Nome',
    field: 'name',
    name: 'name',
    sortable: true,
    align: 'left',
  },
  {
    label: 'Especialidades',
    field: 'specialties',
    name: 'specialty',
    sortable: false,
    align: 'left',
    format: (_val, row) => {
      const subspecialty = row as ISubspecialty
      if (subspecialty.specialties?.length)
        return subspecialty.specialties
          .map((specialty) => specialty.name)
          .join(', ')
      return subspecialty.specialty?.name ?? '-'
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
