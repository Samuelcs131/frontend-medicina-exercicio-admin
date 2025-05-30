import { api } from 'src/boot/axios'
import { Status } from 'src/enums/Status.enum'
import type { IVideo } from 'src/types/video/IVideo.type'
import { fakePromise } from 'src/utils/fakePromise.util'

export async function getAll(): Promise<IVideo[]> {
  /* const { data } = await api.get('/video')
  return data.users */
  await fakePromise(1000)
  return [
    {
      id: '1',
      name: 'Subespecialidades e áreas de atuação',
      description: 'Descrição de alguma coisa',
      status: Status.active,
      professionalIds: ['1'],
      specialtyIds: ['1'],
      subspecialtyIds: ['1'],
      url: 'https://youtu.be/GkYcFV7qkyk',
    },
  ]
}

export async function create(
  name: string,
  url: string,
  description: string,
  professionalIds: string[],
  specialtyIds: string[],
) {
  await api.post('/video', {
    name,
    url,
    description,
    professionalIds,
    specialtyIds,
  })
}

export async function save(
  id: string,
  name: string,
  url: string,
  description: string,
  professionalIds: string[],
  specialtyIds: string[],
) {
  await api.put(`/video/${id}`, {
    name,
    url,
    description,
    professionalIds,
    specialtyIds,
  })
}

export async function deleteItem(ids: string[]) {
  await api.delete(`/video/`, {
    data: { ids },
  })
}

export async function disable(ids: string[]) {
  await api.patch('/video/disable', {
    ids,
  })
}
