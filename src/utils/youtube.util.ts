export function thumbnailYoutube(url: string) {
  return `https://img.youtube.com/vi/${extractYouTubeVideoId(url)}/maxresdefault.jpg`
}

/**
 * Extrai o ID do vídeo do YouTube a partir de uma URL.
 * Suporta os seguintes formatos:
 * - https://www.youtube.com/watch?v=mO3qLIhlv6k
 * - https://youtu.be/GkYcFV7qkyk
 * - https://www.youtube.com/embed/GkYcFV7qkyk
 * - https://www.youtube.com/shorts/GkYcFV7qkyk
 * - https://www.youtube.com/live/GkYcFV7qkyk
 * - https://www.youtube.com/v/GkYcFV7qkyk
 *
 * @param url A URL do vídeo do YouTube
 * @returns O ID do vídeo ou null se não for encontrado
 */
export function extractYouTubeVideoId(url: string): string {
  const patterns = [
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/,
    // Formato de shorts: /shorts/ID
    /youtube\.com\/shorts\/([^"&?/\s]{11})/,
    // Formato de live: /live/ID
    /youtube\.com\/live\/([^"&?/\s]{11})/,
    // Formato antigo: /v/ID
    /youtube\.com\/v\/([^"&?/\s]{11})/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return ''
}
