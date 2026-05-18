import * as AuthService from 'src/services/auth/auth.service'
import { useLocalStorage } from './useLocalStorage'
import { useCookies } from './useCookies'
import { useRouter } from 'vue-router'
import { LocalStorageKey } from 'src/enums/LocalStorageKey.enum'
import { CookieKey } from 'src/enums/CookieKey.enum'
import { api } from '../boot/axios'
import { clearAuthStorage, redirectToLogin } from 'src/helpers/auth/authSession'

const RETRY_400_KEY = '__retryCount400' as const
/** Máximo de tentativas por requisição em caso de 400 (1ª + retentativas até este total). */
const MAX_ATTEMPTS_ON_400 = 3

const MUTATING_METHODS = new Set(['post', 'put', 'patch', 'delete'])

function shouldRetry400OnRequest(url: string | undefined, method: string | undefined): boolean {
  if (!url || !method) return false
  if (!MUTATING_METHODS.has(method.toLowerCase())) return false
  // Evita retentar login com credenciais inválidas
  if (method.toLowerCase() === 'post' && url.includes('/sessions') && !url.includes('/validate')) {
    return false
  }
  return true
}

export function useAuth() {
  const { setCookie, getCookie, removeCookie } = useCookies()
  const { setLocalStorage, removeLocalStorage, getLocalStorage } = useLocalStorage()
  const router = useRouter()

  function getStoredToken(): string | null {
    // Prefer localStorage (pedido do back), com fallback para cookie
    const tokenLocal = getLocalStorage<string | null>(LocalStorageKey.token) ?? null
    const tokenCookie = getCookie(CookieKey.token) ?? null
    return tokenLocal || tokenCookie
  }

  async function login(email: string, senha: string) {
    const userData = await AuthService.login(email, senha)

    setLocalStorage(
      LocalStorageKey.user,
      JSON.stringify({
        name: userData.name,
        email: userData.email,
        roles: userData.roles
      }),
    )

    setLocalStorage(LocalStorageKey.token, userData.token)
    setCookie(CookieKey.token, userData.token)
    await router.push({ name: 'home' })
  }

  async function logout() {
    removeLocalStorage(LocalStorageKey.user)
    removeLocalStorage(LocalStorageKey.token)
    removeCookie(CookieKey.token)
    await router.push({ name: 'login' })
  }

  async function isLoggedIn(): Promise<boolean> {
    const token = getStoredToken()
    if (!token) return false

    try {
      await AuthService.validateSession(token)
      return true
    } catch {
      removeLocalStorage(LocalStorageKey.user)
      removeLocalStorage(LocalStorageKey.token)
      removeCookie(CookieKey.token)
      return false
    }
  }

  function startInterceptors() {
    api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const config = error.config
        if (
          error.response?.status === 400 &&
          config &&
          shouldRetry400OnRequest(config.url, config.method)
        ) {
          const attempts = (config as Record<string, unknown>)[RETRY_400_KEY] as number | undefined
          const nextAttempt = (attempts ?? 0) + 1
          if (nextAttempt < MAX_ATTEMPTS_ON_400) {
            ;(config as Record<string, unknown>)[RETRY_400_KEY] = nextAttempt
            return api.request(config)
          }
        }

        // Verifica se error.response existe antes de acessar status
        // (pode ser undefined em erros de CORS ou rede)
        if (error.response?.status === 401) {
          const url = error.config?.url ?? ''
          const isValidateSession = url.includes('/sessions/validate')

          // Se o 401 veio exatamente da verificação de sessão,
          // não fazemos push aqui: o router.beforeEach já vai redirecionar com next().
          if (isValidateSession) {
            clearAuthStorage()
          } else {
            await redirectToLogin(router, { name: 'login' })
          }
        }
        return Promise.reject(error)
      },
    )

    api.interceptors.request.use((config) => {
      const token = getStoredToken()
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
      return config
    })
  }

  return { login, logout, isLoggedIn, startInterceptors }
}
