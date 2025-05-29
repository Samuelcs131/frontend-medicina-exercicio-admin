import { api } from 'src/boot/axios'
import { Status } from 'src/enums/Status.enum'
import type { ISpecialty } from 'src/types/specialty/ISpecialty.type'
import { fakePromise } from 'src/utils/fakePromise.util'

export async function getAll(): Promise<ISpecialty[]> {
  /* const { data } = await api.get('/specialty')
  return data.users */
  await fakePromise(1000)
  return [
    {
      id: '1',
      name: 'Cardiologia',
      medicalArea: {
        id: '1',
        name: 'Especialidades Médicas - Adulto',
        imageURL:
          'https://animaniacs.com.br/wp-content/uploads/2020/05/layer-clinica-medica-felinos.jpg',
        status: Status.active,
      },
      status: Status.active,
    },
    {
      id: '2',
      name: 'Alergologia',
      medicalArea: {
        id: '1',
        name: 'Especialidades Médicas - Adulto',
        imageURL:
          'https://animaniacs.com.br/wp-content/uploads/2020/05/layer-clinica-medica-felinos.jpg',
        status: Status.active,
      },
      status: Status.inactive,
    },
    {
      id: '3',
      name: 'Acupuntura',
      medicalArea: {
        id: '1',
        name: 'Especialidades Médicas - Adulto',
        imageURL:
          'https://animaniacs.com.br/wp-content/uploads/2020/05/layer-clinica-medica-felinos.jpg',
        status: Status.active,
      },
      status: Status.active,
    },
  ]
}

export async function create(name: string, medicalAreaId: string) {
  await api.post('/specialty', {
    name,
    medicalAreaId,
  })
}

export async function save(id: string, name: string, medicalAreaId: string) {
  await api.put(`/specialty/${id}`, {
    name,
    medicalAreaId,
  })
}

export async function deleteItem(ids: string[]) {
  await api.delete(`/specialty/`, {
    data: { ids },
  })
}

export async function disable(ids: string[]) {
  await api.patch('/specialty/disable', {
    ids,
  })
}
