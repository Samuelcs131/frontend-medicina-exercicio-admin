import { LocalStorageKey } from 'src/enums/LocalStorageKey.enum'
import { useLocalStorage } from './useLocalStorage'
import { Roles } from 'src/enums/Roles.enum'

export function useRoles() {
  const { getLocalStorage } = useLocalStorage()

  function getUserRole(): Roles {
    return JSON.parse(getLocalStorage(LocalStorageKey.user))?.role
  }

  function hasRoles(requiredRoles: Roles[]): boolean {
    if (!requiredRoles || requiredRoles.length === 0) return false
    const userRole = getUserRole()
    return requiredRoles.every((role) => userRole == role)
  }

  return {
    hasRoles,
    isAdmin: () => hasRoles([Roles.admin]),
  }
}
