import * as AuthService from 'src/services/auth/auth.service'
import { useLocalStorage } from './useLocalStorage'
import { useCookies } from './useCookies'
import { useRouter } from 'vue-router'
import { LocalStorageKey } from 'src/enums/LocalStorageKey.enum'
import { CookieKey } from 'src/enums/CookieKey.enum'
import requester from 'src/helpers/requester/Requester.helper'
import { api } from '../boot/axios'
import { Roles } from 'src/enums/Roles.enum'

export function useAuth() {
  const { setCookie, getCookie, removeCookie } = useCookies()
  const { setLocalStorage, removeLocalStorage } = useLocalStorage()
  const router = useRouter()

  async function login(email: string, senha: string) {
    // const userData = await AuthService.login(email, senha)

    console.log(senha)

    const userData = {
      name: 'Andre',
      email,
      balance: 1232.45,
      roles: [Roles.admin, Roles.professional],
      token: 'doem09vg49vgm430g',
    }

    setLocalStorage(
      LocalStorageKey.user,
      JSON.stringify({
        name: userData.name,
        email: userData.email,
        balance: userData.balance,
        roles: userData.roles,
        shootingPermissions: userData.roles,
      }),
    )

    setCookie(CookieKey.token, userData.token)
    await router.push({ name: 'home' })
  }

  async function logout() {
    removeLocalStorage(LocalStorageKey.user)
    removeCookie(CookieKey.token)
    await router.push({ name: 'login' })
  }

  async function isLoggedIn(): Promise<boolean> {
    const tokenCookie = getCookie(CookieKey.token)

    if (!tokenCookie) return false

    const isLogged = await AuthService.authSession()

    if (!isLogged) {
      removeLocalStorage(LocalStorageKey.user)
      removeCookie(CookieKey.token)
    }

    setCookie(CookieKey.token, isLogged)

    return !!isLogged
  }

  function startInterceptors() {
    api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response.status === 401) await handleLoggedIn()
        return Promise.reject(error)
      },
    )

    api.interceptors.request.use((config) => {
      if (getCookie(CookieKey.token)) {
        config.withCredentials = true
        config.headers['Authorization'] = `Bearer ${getCookie(CookieKey.token)}`
      }
      return config
    })
  }

  async function handleLoggedIn() {
    await requester.dispatch({
      callback: async () => {
        const islogged = await isLoggedIn()
        if (!islogged) {
          await router.push('/login')
          removeCookie(CookieKey.token)
        }
      },
      async errorCallback() {
        await router.push('/login')
        removeCookie(CookieKey.token)
      },
    })
  }

  return { login, logout, isLoggedIn, startInterceptors }
}
