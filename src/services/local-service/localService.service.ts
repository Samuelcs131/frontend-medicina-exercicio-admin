import { api } from 'src/boot/axios'
import { Status } from 'src/enums/Status.enum'
import type { IListResponse } from 'src/types/api/IListResponse.type'
import type { ILocalService } from 'src/types/local-service/ILocalService.type'
import { buildListParams, type IListQuery } from 'src/utils/listQuery.util'

export async function getListPaginated(
  params: IListQuery,
): Promise<IListResponse<ILocalService>> {
  const { data } = await api.get<IListResponse<ILocalService>>('/local-service', {
    params: buildListParams(params),
  })
  return data
}

export async function getAll(): Promise<ILocalService[]> {
  const { data } = await api.get('/local-service')
  return data
  /* return [
    {
      id: '1',
      name: 'Alexandre III',
      city: {
        id: '1',
        name: 'Rio de Janeiro',
      },
      state: {
        id: '1',
        name: 'Rio de Janeiro',
      },
      hasWhatsapp: false,
      street: 'Rua de souza barros',
      contact: '21916511',
      coordinates: '-22.865307226398542, -43.21486019013049',
      status: Status.active,
    },
  ] */
}

export async function create(
  name: string,
  state: string,
  city: string,
  street: string,
  coordinates: string,
  cep: string,
  number: number,
  linkGoogleMaps: string,
  status: Status,
) {
  await api.post('/local-service', {
    name,
    cep,
    state,
    city,
    street,
    coordinates,
    number,
    linkGoogleMaps,
    status
  })
}

export async function save(
  id: string,
  name: string,
  state: string,
  city: string,
  street: string,
  coordinates: string,
  cep: string,
  number: number,
  linkGoogleMaps: string,
  status: Status,
) {
  await api.put(`/local-service/${id}`, {
    name,
    city,
    state,
    street,
    coordinates,
    cep,
    number,
    linkGoogleMaps,
    status
  })
}

export async function deleteItem(ids: string[]) {
  await api.delete(`/local-service/`, {
    data: { ids },
  })
}

export async function disable(ids: string[]) {
  await api.patch('/local-service/disable', {
    ids,
  })
}
