import { useCookies } from 'src/composables/useCookies'
import { useLocalStorage } from 'src/composables/useLocalStorage'
import { CookieKey } from 'src/enums/CookieKey.enum'
import { LocalStorageKey } from 'src/enums/LocalStorageKey.enum'
import type { RouteLocationRaw, Router } from 'vue-router'

let isRedirecting = false

export function clearAuthStorage() {
  const { removeCookie } = useCookies()
  const { removeLocalStorage } = useLocalStorage()

  removeLocalStorage(LocalStorageKey.user)
  removeLocalStorage(LocalStorageKey.token)
  removeCookie(CookieKey.token)
}

export async function redirectToLogin(
  router: Router,
  replaceWith?: RouteLocationRaw,
) {
  if (isRedirecting) return

  const currentName = router.currentRoute.value?.name
  if (currentName === 'login') return

  isRedirecting = true
  try {
    clearAuthStorage()
    const target = replaceWith ?? { name: 'login' }
    await router.push(target)
  } catch {
    // ignore navigation errors (e.g. trying to push same route)
  } finally {
    isRedirecting = false
  }
}

