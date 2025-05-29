import { uniqueId as CuniqueId } from 'lodash'

export function uniqueId(prefix?: string){
  return CuniqueId(prefix)
}