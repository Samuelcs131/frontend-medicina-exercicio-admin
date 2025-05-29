import { api } from 'src/boot/axios'
import { useCookies } from 'src/composables/useCookies'
import { CookieKey } from 'src/enums/CookieKey.enum'
import type { IUserAuth } from 'src/types/user/IUserAuth.type'

export async function login(
  email: string,
  password: string,
): Promise<IUserAuth> {
  const { data } = await api.post(
    '/sessions',
    {
      email,
      password,
    },
    { withCredentials: true },
  )

  const { token, user } = data

  return {
    token,
    ...user,
  }
}

export async function authSession(token?: string): Promise<string> {
  const { getCookie } = useCookies()

  const { data } = await api.patch(
    '/token/refresh',
    {},
    {
      headers: {
        Authorization: `Bearer ${token ?? getCookie(CookieKey.token)}`,
      },
      withCredentials: true,
    },
  )

  return data.token
}
