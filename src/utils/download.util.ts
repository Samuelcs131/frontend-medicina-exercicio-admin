import { exportFile as QexportFile } from 'quasar'

export function exportFile(
  fileName: string,
  rawData: string | Blob | ArrayBuffer | ArrayBufferView,
  opts?: string
) {
  const status = QexportFile(fileName, rawData, opts)

  if (!status) {
    throw Error('It was not possible to download this file')
  }
}
