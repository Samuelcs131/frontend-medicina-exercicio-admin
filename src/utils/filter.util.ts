import { normalizeText } from './text.util'

export function filterFn<T>(value: string, label: keyof T, options: T[]): T[] {
  if (value == '') return options

  const normalizedValue = normalizeText(value)

  return options.filter((item) =>
    normalizeText(item[label] as string).includes(normalizedValue),
  )
}
