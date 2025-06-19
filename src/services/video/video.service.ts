import { api } from 'src/boot/axios'
import { Status } from 'src/enums/Status.enum'
import type { IVideo } from 'src/types/video/IVideo.type'
import { fakePromise } from 'src/utils/fakePromise.util'

export async function getAll(): Promise<IVideo[]> {
  /* const { data } = await api.get('/video')
  return data.users */
  await fakePromise(100)
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
      clicks: 14,
      recomendations: {
        outherVideosIds: ['4'],
        moreVideosIds: ['4'],
        specialtyIds: ['1'],
        postIds: ['1'],
      },
    },
    {
      id: '2',
      name: 'Asma na Infância',
      description: 'Descrição de alguma coisa 2',
      status: Status.active,
      professionalIds: ['2'],
      specialtyIds: ['1'],
      subspecialtyIds: ['1'],
      url: 'https://youtu.be/GkYcFV7qkyk',
      clicks: 47,
      recomendations: {
        outherVideosIds: ['3'],
        moreVideosIds: ['1'],
        specialtyIds: ['1'],
        postIds: ['1'],
      },
    },
    {
      id: '3',
      name: 'Depressão',
      description: 'Descrição de alguma coisa 3',
      status: Status.active,
      professionalIds: ['2'],
      specialtyIds: ['1'],
      subspecialtyIds: ['1'],
      url: 'https://youtu.be/GkYcFV7qkyk',
      clicks: 47,
      recomendations: {
        outherVideosIds: ['2'],
        moreVideosIds: ['1'],
        specialtyIds: ['1'],
        postIds: ['1'],
      },
    },
    {
      id: '4',
      name: 'Obesidade',
      description: 'Descrição de alguma coisa 4',
      status: Status.active,
      professionalIds: ['1'],
      specialtyIds: ['1'],
      subspecialtyIds: ['1'],
      url: 'https://youtu.be/GkYcFV7qkyk',
      clicks: 47,
      recomendations: {
        outherVideosIds: ['1'],
        moreVideosIds: ['1'],
        specialtyIds: ['1'],
        postIds: ['1'],
      },
    },
  ]
}

export async function create(
  name: string,
  url: string,
  description: string,
  professionalIds: string[],
  specialtyIds: string[],
  recomendations: {
    outherVideosIds: string[]
    moreVideosIds: string[]
    specialtyIds: string[]
    postIds: string[]
  },
) {
  await api.post('/video', {
    name,
    url,
    description,
    professionalIds,
    specialtyIds,
    recomendationOutherVideosIds: recomendations.outherVideosIds,
    recomendationMoreVideosIds: recomendations.moreVideosIds,
    recomendationSpecialtyIds: recomendations.specialtyIds,
    recomendationPostIds: recomendations.postIds,
  })
}

export async function save(
  id: string,
  name: string,
  url: string,
  description: string,
  professionalIds: string[],
  specialtyIds: string[],
  recomendations: {
    outherVideosIds: string[]
    moreVideosIds: string[]
    specialtyIds: string[]
    postIds: string[]
  },
) {
  await api.put(`/video/${id}`, {
    name,
    url,
    description,
    professionalIds,
    specialtyIds,
    recomendationOutherVideosIds: recomendations.outherVideosIds,
    recomendationMoreVideosIds: recomendations.moreVideosIds,
    recomendationSpecialtyIds: recomendations.specialtyIds,
    recomendationPostIds: recomendations.postIds,
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
