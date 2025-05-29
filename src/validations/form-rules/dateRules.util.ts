import { DateForm } from '../form/dateForm.utils'
import { IsValid } from '../validator/IsValid.utils'
import type { ISOptions } from '../validator/types/ISOptions.type'

export function requiredDate(value: string | Date | null, options?: ISOptions) {
  return IsValid.date(value,options) || DateForm.date()
}
