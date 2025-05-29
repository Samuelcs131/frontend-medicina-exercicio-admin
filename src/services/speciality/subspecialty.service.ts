import { api } from 'src/boot/axios'
import { Status } from 'src/enums/Status.enum'
import type { ISubspecialty } from 'src/types/specialty/ISubspecialty.type'
import { fakePromise } from 'src/utils/fakePromise.util'

export async function getAll(): Promise<ISubspecialty[]> {
  /* const { data } = await api.get('/subspecialty')
  return data.users */
  await fakePromise(1000)
  return [
    {
      id: '1',
      name: 'Hemodinâmica',
      specialty: {
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
      subspecialtyGroup: {
        id: '1',
        name: 'Subespecialidades e áreas de atuação',
        description: 'Descrição de alguma coisa',
        imageURL:
          'https://animaniacs.com.br/wp-content/uploads/2020/05/layer-clinica-medica-felinos.jpg',
        status: Status.active,
      },
      status: Status.active,
    },
  ]
}

export async function create(
  name: string,
  specialtyId: string,
  subspecialtyGroupId: string,
) {
  await api.post('/subspecialty', {
    name,
    specialtyId,
    subspecialtyGroupId,
  })
}

export async function save(
  id: string,
  name: string,
  specialtyId: string,
  subspecialtyGroupId: string,
) {
  await api.put(`/subspecialty/${id}`, {
    name,
    specialtyId,
    subspecialtyGroupId,
  })
}

export async function deleteItem(ids: string[]) {
  await api.delete(`/subspecialty/`, {
    data: { ids },
  })
}

export async function disable(ids: string[]) {
  await api.patch('/subspecialty/disable', {
    ids,
  })
}
