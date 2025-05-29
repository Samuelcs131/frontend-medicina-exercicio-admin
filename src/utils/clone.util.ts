import { cloneDeep as LcloneDeep } from 'lodash'

export function cloneDeep<T>(value: T) {
  return LcloneDeep<T>(value)
}
