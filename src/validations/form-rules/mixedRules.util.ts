import { MixedForm } from '../form/mixedForm.utils'
import { IsValid } from '../validator/IsValid.utils'

export function requiredRule(value: unknown) {
  return IsValid.required(value) || MixedForm.required()
}

export function hasSpacesRule(value: string) {
  return !IsValid.hasSpaces(value) || MixedForm.hasSpaces()
}

export function strongPasswordRule(value: string) {
  return IsValid.strongPassword(value) || MixedForm.strongPassword()
}

export function equalPasswordRule(value: string, password: string) {
  return IsValid.equalPassword(password, value) || MixedForm.equalPassword()
}
