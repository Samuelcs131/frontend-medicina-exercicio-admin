import { api } from 'src/boot/axios'
import { Status } from 'src/enums/Status.enum'
import type { IListResponse } from 'src/types/api/IListResponse.type'
import type { IVideo } from 'src/types/video/IVideo.type'
import { buildListParams, type IListQuery } from 'src/utils/listQuery.util'

export async function getListPaginated(
  params: IListQuery,
): Promise<IListResponse<IVideo>> {
  const { data } = await api.get<IListResponse<IVideo>>('/video', {
    params: buildListParams(params, { front: true }),
  })
  return data
}

export async function getAll(): Promise<IVideo[]> {
  const { data } = await api.get('/video', {
    params: {
      all: true,
    },
  })
  return data
}

export async function getBySpecialtyId(specialtyId: string): Promise<IVideo[]> {
  const { data } = await api.get('/video', {
    params: {
      specialtyId,
    },
  })
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

export async function getByProfessionalIds(ids: string[]) {
  const { data } = await api.post(`/video/by-guests`, {
    guests: ids,
  })
  return data
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
