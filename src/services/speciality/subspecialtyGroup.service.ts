import { api } from 'src/boot/axios'
import { Status } from 'src/enums/Status.enum'
import type { IListResponse } from 'src/types/api/IListResponse.type'
import type { ISubspecialtyGroup } from 'src/types/specialty/ISubspecialtyGroup.type'
import { buildListParams, type IListQuery } from 'src/utils/listQuery.util'

export async function getListPaginated(
  params: IListQuery,
  specialtyId?: string | null,
): Promise<IListResponse<ISubspecialtyGroup>> {
  const { data } = await api.get<IListResponse<ISubspecialtyGroup>>(
    '/articles-group',
    {
      params: buildListParams(params, {
        specialtyId: specialtyId || undefined,
      }),
    },
  )
  return data
}

export async function getAll(specialtyId?: string): Promise<ISubspecialtyGroup[]> {
  if (specialtyId) {
    const { data } = await api.get('/articles-group', {
      params: {
        all: true,
        specialtyId,
      },
    })
    return data
  }
  const { data } = await api.get('/articles-group', {
    params: {
      all: true,
    },
  })
  return data
}

export async function getById(id: string): Promise<ISubspecialtyGroup> {
  const { data } = await api.get(`/articles-group/${id}`)
  return data
}

export async function create(
  name: string,
  description: string,
  status: Status,
  specialtyId: string,
  postIds: string[],
  orderPosts: Array<{ postId: string; order: number }>,
  image: File | null,
  videoIds?: string[],
) {
  const formData = new FormData()

  // Campos obrigatórios
  formData.append('name', name)
  formData.append('description', description)
  formData.append('status', status)
  formData.append('specialtyId', specialtyId) // String direto, não array

  // Campos opcionais
  if (postIds.length > 0) {
    formData.append('postIds', JSON.stringify(postIds)) // Array de strings como JSON
  }

  if (orderPosts.length > 0) {
    formData.append('orderPosts', JSON.stringify(orderPosts)) // Array de objetos { postId, order } como JSON
  }

  if (videoIds && videoIds.length > 0) {
    formData.append('videoIds', JSON.stringify(videoIds))
  }

  if (image) {
    formData.append('image', image) // Arquivo de imagem
  }

  // Formato enviado:
  // {
  //   "name": string,
  //   "description": string,
  //   "status": Status,
  //   "specialtyId": string,
  //   "postIds": string[] (JSON),
  //   "orderPosts": Array<{ postId: string, order: number }> (JSON),
  //   "image": File
  // }

  await api.post('/articles-group/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export async function save(
  id: string,
  name?: string,
  description?: string,
  status?: Status,
  specialtyId?: string,
  postIds?: string[],
  orderPosts?: Array<{ postId: string; order: number }>,
  image?: File | null,
  videoIds?: string[],
) {
  const formData = new FormData()

  if (name) formData.append('name', name)
  if (description) formData.append('description', description)
  if (status) formData.append('status', status)

  if (specialtyId) {
    formData.append('specialtyId', specialtyId)
  }

  if (postIds && postIds.length > 0) {
    formData.append('postIds', JSON.stringify(postIds))
  }

  if (orderPosts && orderPosts.length > 0) {
    formData.append('orderPosts', JSON.stringify(orderPosts))
  }

  if (videoIds && videoIds.length > 0) {
    formData.append('videoIds', JSON.stringify(videoIds))
  } else if (videoIds && videoIds.length === 0) {
    formData.append('videoIds', JSON.stringify([]))
  }

  if (image) {
    formData.append('image', image)
  }

  await api.put(`/articles-group/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export async function deleteItem(ids: string[]) {
  await api.delete('/articles-group', {
    data: { ids },
  })
}

export async function disable(ids: string[]) {
  await api.patch('/articles-group/disable', {
    ids,
  })
}

export async function updateOrdersBySpecialty(
  specialtyId: string,
  groups: Array<{ id: string; order: number }>,
) {
  await api.put('/articles-group/update-orders-by-specialty', {
    specialtyId,
    groups,
  })
}
