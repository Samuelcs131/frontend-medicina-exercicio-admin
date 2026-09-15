import { Roles } from "src/enums/Roles.enum"
import { LocalStorageKey } from "src/enums/LocalStorageKey.enum"
import { useLocalStorage } from "src/composables/useLocalStorage"

export function handleRoles(roles: Roles[]) {
  if (roles.length == 0) return true

  const { getLocalStorage } = useLocalStorage()

  const userRole: Roles = JSON.parse(
    getLocalStorage(LocalStorageKey.user),
  )?.role

  return roles.some((role) => role === userRole)
}
