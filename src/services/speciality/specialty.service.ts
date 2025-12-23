import { api } from 'src/boot/axios'
import { Status } from 'src/enums/Status.enum'
import type { ISpecialty } from 'src/types/specialty/ISpecialty.type'

export async function getAll(): Promise<ISpecialty[]> {
  const { data } = await api.get('/specialty')
  return data

  /* return [
    {
      id: '1',
      name: 'Cardiologia',
      professionalArea: {
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
      professionalArea: {
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
      professionalArea: {
        id: '1',
        name: 'Especialidades Médicas - Adulto',
        imageURL:
          'https://animaniacs.com.br/wp-content/uploads/2020/05/layer-clinica-medica-felinos.jpg',
        status: Status.active,
      },
      status: Status.active,
    },
  ] */
}

export async function create(name: string, professionalAreaId: string) {
  await api.post('/specialty', {
    name,
    professionalAreaId,
  })
}

export async function getByProfessionalIds(guestIds: string[]) {
  const { data } = await api.post(`/professional/specialties-by-guests`, {
    guestIds,
  })
  return data
}

export async function save(
  id: string,
  name: string,
  professionalAreaId: string,
  status: Status,
) {
  await api.put(`/specialty/${id}`, {
    name,
    professionalAreaId,
    status,
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
