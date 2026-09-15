import { api } from 'src/boot/axios'
import { Roles } from 'src/enums/Roles.enum'
import { Status } from 'src/enums/Status.enum'
import type { IListResponse } from 'src/types/api/IListResponse.type'
import type { IUser } from 'src/types/user/IUser.type'
import { buildListParams, type IListQuery } from 'src/utils/listQuery.util'

export async function getListPaginated(
  params: IListQuery,
): Promise<IListResponse<IUser>> {
  const { data } = await api.get<IListResponse<IUser>>('/users', {
    params: buildListParams(params),
  })
  return data
}

export async function getAll(): Promise<IUser[]> {
  const { data } = await api.get('/users')
  return data.users
}

export async function create(
  email: string,
  name: string,
  role: Roles,
  password: string,
  professionalId?: string | null,
) {
  await api.post('/users', {
    email,
    name,
    role,
    password,
    ...(role === Roles.medico ? { professionalId } : {}),
  })
}

export async function save(
  id: string,
  email: string,
  name: string,
  password: string,
  status: Status,
  role: Roles,
  professionalId?: string | null,
) {
  await api.put(`/users/${id}`, {
    email,
    name,
    status,
    role,
    ...(password ? { password } : {}),
    ...(role === Roles.medico ? { professionalId } : {}),
  })
}

export async function deleteItem(ids: string[]) {
  await api.delete(`/users/`, {
    data: { ids },
  })
}

export async function disable(ids: string[]) {
  await api.patch('/users/disable', {
    ids,
  })
}
