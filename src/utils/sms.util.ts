export function smsInput(text: string, listShadowBan: string[]) {
  return removeExactTerms(filterGSM7(text), listShadowBan)
}

function removeExactTerms(text: string, termsToRemove: string[]) {
  const normalizedTerms = termsToRemove.map((term) =>
    term
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase(),
  )

  const words = text.split(/(\s+)/)

  const result = words.map((word) => {
    if (word.trim() !== '') {
      const normalizedWord = word
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()

      const shouldRemove = normalizedTerms.some((term) =>
        normalizedWord.includes(term),
      )

      return shouldRemove ? '' : word
    }
    return word
  })
  return result.join('').replace(/\s+/g, ' ')
}

export function filterGSM7(text: string) {
  return [...text]
    .filter((v) => {
      return allowedCharacters.has(v)
    })
    .join('')
}

const GSM7 =
  '@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !"#¤%&\'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà^{}\\[~]|€'.split(
    '',
  )

const allowedCharacters = new Set([...GSM7])

export function isGSM7Char(text: string) {
  return GSM7.includes(text)
}

export function splitSMS(text: string): string[] {
  const maxLengthSingleMessage = 160
  const maxLengthMultipartMessage = 153

  if (text.length <= maxLengthSingleMessage) {
    return text.length ? [text] : []
  }

  const messages: string[] = []
  let remainingText = text

  while (remainingText.length > 0) {
    const chunk = remainingText.slice(0, maxLengthMultipartMessage)
    messages.push(chunk)
    remainingText = remainingText.slice(maxLengthMultipartMessage)
  }

  return messages
}

export function countSMS(text: string) {
  const maxLengthSingleMessage = 160
  const maxLengthMultipartMessage = 153

  const length = text.length
  let messages, remaining

  if (length <= maxLengthSingleMessage) {
    messages = length ? 1 : 0
    remaining = maxLengthSingleMessage - length
  } else {
    messages = Math.ceil(length / maxLengthMultipartMessage)
    remaining = messages * maxLengthMultipartMessage - length
  }

  return {
    length: length,
    remaining: remaining,
    messages: messages,
    splitSMS: splitSMS(text),
  }
}
