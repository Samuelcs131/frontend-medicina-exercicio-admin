import { api } from 'src/boot/axios'
import { Status } from 'src/enums/Status.enum'
import type { IListResponse } from 'src/types/api/IListResponse.type'
import type { ISubspecialty } from 'src/types/specialty/ISubspecialty.type'
import { buildListParams, type IListQuery } from 'src/utils/listQuery.util'

export async function getListPaginated(
  params: IListQuery,
): Promise<IListResponse<ISubspecialty>> {
  const { data } = await api.get<IListResponse<ISubspecialty>>('/subspecialty', {
    params: buildListParams(params),
  })
  return data
}

export async function getAll(): Promise<ISubspecialty[]> {
  const { data } = await api.get('/subspecialty')
  return data

  /*  return [
    {
      id: '1',
      name: 'Hemodinâmica',
      specialty: {
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
  ] */
}

export async function create(
  name: string,
  specialtyId: string,
) {
  await api.post('/subspecialty', {
    name,
    specialtyId,
  })
}

export async function save(
  id: string,
  name: string,
  specialtyId: string,
  status: Status,
) {
  await api.put(`/subspecialty/${id}`, {
    name,
    specialtyId,
    status,
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
