/**
 * Formata uma string como número de celular brasileiro no padrão (XX) XXXXX-XXXX
 * @param phoneNumber - O número a ser formatado (pode conter ou não dígitos não numéricos)
 * @returns O número formatado ou a string original se não tiver dígitos suficientes
 */
export function formatPhoneNumber(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/\D/g, '')

  if (cleaned.length === 11)
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  else if (cleaned.length === 10)
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')

  return phoneNumber
}

export function normalizeText(text: string) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export function slugify(text: string): string {
  text = text.toString().toLowerCase().trim()

  const sets = [
    { to: 'a', from: '[ÀÁÂÃÄÅÆĀĂĄẠẢẤẦẨẪẬẮẰẲẴẶ]' },
    { to: 'c', from: '[ÇĆĈČ]' },
    { to: 'd', from: '[ÐĎĐÞ]' },
    { to: 'e', from: '[ÈÉÊËĒĔĖĘĚẸẺẼẾỀỂỄỆ]' },
    { to: 'g', from: '[ĜĞĢǴ]' },
    { to: 'h', from: '[ĤḦ]' },
    { to: 'i', from: '[ÌÍÎÏĨĪĮİỈỊ]' },
    { to: 'j', from: '[Ĵ]' },
    { to: 'ij', from: '[Ĳ]' },
    { to: 'k', from: '[Ķ]' },
    { to: 'l', from: '[ĹĻĽŁ]' },
    { to: 'm', from: '[Ḿ]' },
    { to: 'n', from: '[ÑŃŅŇ]' },
    { to: 'o', from: '[ÒÓÔÕÖØŌŎŐỌỎỐỒỔỖỘỚỜỞỠỢǪǬƠ]' },
    { to: 'oe', from: '[Œ]' },
    { to: 'p', from: '[ṕ]' },
    { to: 'r', from: '[ŔŖŘ]' },
    { to: 's', from: '[ßŚŜŞŠ]' },
    { to: 't', from: '[ŢŤ]' },
    { to: 'u', from: '[ÙÚÛÜŨŪŬŮŰŲỤỦỨỪỬỮỰƯ]' },
    { to: 'w', from: '[ẂŴẀẄ]' },
    { to: 'x', from: '[ẍ]' },
    { to: 'y', from: '[ÝŶŸỲỴỶỸ]' },
    { to: 'z', from: '[ŹŻŽ]' },
    { to: '-', from: "[·/_,:;']" },
  ]

  sets.forEach((set) => {
    text = text.replace(new RegExp(set.from, 'gi'), set.to)
  })

  return text
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

export function truncateText(text: string, limit: number) {
  if (text.length > limit) return text.substring(0, limit) + '...'
  return text
}

export function extractIframeSrc(html: string) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const iframe = doc.querySelector('iframe')

  return iframe?.getAttribute('src') ?? ''
}
