import { api } from 'src/boot/axios'
import { Status } from 'src/enums/Status.enum'
import type { IVideo } from 'src/types/video/IVideo.type'

export async function getAll(): Promise<IVideo[]> {
  const { data } = await api.get('/video')
  return data
}

export async function create(
  name: string,
  url: string,
  description: string,
  author: string,
  guests: string[],
  specialtyIds: string[],
  subspecialtyIds: string[],
  recomendations: {
    outherVideosIds: string[]
    moreVideosIds: string[]
    specialtyIds: string[]
    postIds: string[]
    relatedVideoIds: string[]
  },
) {
  await api.post('/video', {
    name,
    url,
    description,
    author,
    guests,
    specialtyIds,
    subspecialtyIds,
    recomendations,
  })
}

export async function save(
  id: string,
  name: string,
  url: string,
  description: string,
  author: string,
  guests: string[],
  specialtyIds: string[],
  subspecialtyIds: string[],
  recomendations: {
    outherVideosIds: string[]
    moreVideosIds: string[]
    specialtyIds: string[]
    postIds: string[]
    relatedVideoIds: string[]
  },
  status: Status,
) {
  await api.put(`/video/${id}`, {
    name,
    url,
    description,
    author,
    guests,
    specialtyIds,
    subspecialtyIds,
    status,
    recomendations,
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
