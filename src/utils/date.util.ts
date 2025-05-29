export function formatDate(date: string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(
    'pt-BR',
    options || {
      dateStyle: 'short',
      timeStyle: 'short',
    },
  ).format(new Date(date))
}

export function parsePtBrToISO(dateStr: string): string {
  const [datePart, timePart] = dateStr.split(' ')
  const [day, month, year] = datePart!.split('/').map(Number)
  const [hours = 0, minutes = 0] = timePart?.split(':').map(Number) || []

  const date = new Date(year!, month! - 1, day, hours, minutes)

  return date.toISOString()
}
