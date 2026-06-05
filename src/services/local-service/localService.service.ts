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
}

export async function create(
  name: string,
  state: string,
  city: string,
  street: string,
  neighborhood: string,
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
    neighborhood,
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
  neighborhood: string,
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
    neighborhood,
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
