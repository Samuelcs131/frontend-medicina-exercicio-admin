import { StringForm } from '../form/stringForm.utils'
import { IsValid } from '../validator/IsValid.utils'

export function emailRule(value: string) {
  return IsValid.email(value) || StringForm.email()
}

export function urlRule(value: string) {
  return IsValid.url(value) || StringForm.url()
}

export function rangeRule(value: string, min: number, max: number) {
  return IsValid.range(value, min, max) || StringForm.range(min, max)
}
