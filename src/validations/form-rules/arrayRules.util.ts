import { ArrayForm } from '../form/arrayForm.utils'
import { IsValid } from '../validator/IsValid.utils'

export function rangeArrayRule(value: unknown[], min: number, max: number) {
  return IsValid.countArray(value, min, max) || ArrayForm.range(min, max)
}

export function minArrayRule(value: unknown[], min: number) {
  return IsValid.minArray(value, min) || ArrayForm.min(min)
}

export function maxArrayRule(value: unknown[], max: number) {
  return IsValid.maxArray(value, max) || ArrayForm.max(max)
}
