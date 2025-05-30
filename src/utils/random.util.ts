import { uniqueId as LUniqueId } from 'lodash'

export function uniqueId(prefix?: string) {
  return LUniqueId(prefix)
}
