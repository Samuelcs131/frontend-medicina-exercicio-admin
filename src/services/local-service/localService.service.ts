import { api } from 'src/boot/axios'
import { Status } from 'src/enums/Status.enum'
import type { ILocalService } from 'src/types/local-service/ILocalService.type'
import { fakePromise } from 'src/utils/fakePromise.util'

export async function getAll(): Promise<ILocalService[]> {
  /* const { data } = await api.get('/local-service')
  return data.users */
  await fakePromise(1000)
  return [
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
  ]
}

export async function create(
  name: string,
  cityId: string,
  stateId: string,
  hasWhatsapp: boolean,
  street: string,
  contact: string,
  coordinates: string,
) {
  await api.post('/local-service', {
    name,
    cityId,
    stateId,
    hasWhatsapp,
    street,
    contact,
    coordinates,
  })
}

export async function save(
  id: string,
  name: string,
  cityId: string,
  stateId: string,
  hasWhatsapp: boolean,
  street: string,
  contact: string,
  coordinates: string,
) {
  await api.put(`/local-service/${id}`, {
    name,
    cityId,
    stateId,
    hasWhatsapp,
    street,
    contact,
    coordinates,
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
