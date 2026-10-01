// import { api } from 'src/boot/axios'
import { api } from 'src/boot/axios'
import type { IProfile } from 'src/types/user/IProfile.type'

export async function save(
  id: string,
  email: string,
  name: string,
  password: string,
) {
  await api.put(`/users/${id}`, {
    id,
    email,
    name,
    ...(password == '' ? {} : { password }),
  })

  return {
    id,
    email,
    name,
  }
}

export async function getProfile(): Promise<IProfile> {
  const { data } = await api.get('/users/profile')
  return data
}
