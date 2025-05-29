import { NumberForm } from '../form/numberForm.utils'
import { IsValid } from '../validator/IsValid.utils'

export function integerRule(value: unknown) {
  return IsValid.int(value) || NumberForm.integer()
}

export function maxRule(value: number, max: number) {
  return IsValid.max(value, max) || NumberForm.max(max)
}

export function minRule(value: number, min: number) {
  return IsValid.min(value, min) || NumberForm.min(min)
}

export function positive(value: number) {
  return IsValid.positive(value) || NumberForm.positive()
}

export function isNumericRule(value: number) {
  return IsValid.isNumeric(value) || NumberForm.number()
}

export function numberLengthRule(value: number, expectedCount: number) {
  return (
    IsValid.numberLength(value, expectedCount) ||
    NumberForm.numberLength(expectedCount)
  )
}
