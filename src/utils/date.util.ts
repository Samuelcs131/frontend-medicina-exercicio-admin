export function formatDate(
  date: string | null | undefined,
  options?: Intl.DateTimeFormatOptions,
): string {
  if (date == null || String(date).trim() === '') return '-'

  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return '-'

  return new Intl.DateTimeFormat(
    'pt-BR',
    options || {
      dateStyle: 'short',
      timeStyle: 'short',
    },
  ).format(parsed)
}

export function parsePtBrToISO(dateStr: string): string {
  const [datePart, timePart] = dateStr.split(' ')
  const [day, month, year] = datePart!.split('/').map(Number)
  const [hours = 0, minutes = 0] = timePart?.split(':').map(Number) || []

  const date = new Date(year!, month! - 1, day, hours, minutes)

  return date.toISOString()
}
