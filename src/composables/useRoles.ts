import { LocalStorageKey } from 'src/enums/LocalStorageKey.enum'
import { useLocalStorage } from './useLocalStorage'
import { Roles } from 'src/enums/Roles.enum'

export function useRoles() {
  const { getLocalStorage } = useLocalStorage()

  function getUserRoles(): Roles[] {
    return JSON.parse(getLocalStorage(LocalStorageKey.user)).roles || []
  }

  function hasRoles(requiredRoles: Roles[]): boolean {
    if (!requiredRoles || requiredRoles.length === 0) return true
    const userRoles = getUserRoles()
    return requiredRoles.every((role) => userRoles.includes(role))
  }

  return {
    hasRoles,
    isAdmin: () => hasRoles([Roles.admin]),
  }
}
