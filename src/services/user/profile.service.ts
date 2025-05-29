// import { api } from 'src/boot/axios'
import { api } from 'src/boot/axios'
import type { IProfile } from 'src/types/user/IProfile.type'
import { fakePromise } from 'src/utils/fakePromise.util'

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
    password,
  })

  return {
    id,
    email,
    name,
    password,
  }
}

export async function getProfile(): Promise<IProfile> {
  /* DEVE PESQUISAR USUARIO PELO TOKEN */
  /* const { data } = await api.get('/users/profile')
  return data */

  await fakePromise(1000)

  return {
    id: '1',
    email: 'email.com',
    name: 'Nome',
  }
}
