import { api } from 'src/boot/axios'
import { Status } from 'src/enums/Status.enum'
import { ISupporter } from 'src/types/supporter/ISupporter.type'

export async function getAll(): Promise<ISupporter[]> {
  const { data } = await api.get('/support')
  return data
}

export async function create(name: string, image: File, url: string) {
  const formData = new FormData()

  formData.append('name', name)
  formData.append('image', image)
  formData.append('url', url)

  await api.post('/support', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export async function save(
  id: string,
  name: string,
  status: Status,
  image: File | null,
  url: string,
) {
  const formData = new FormData()

  formData.append('name', name)
  formData.append('status', status)
  formData.append('url', url)
  if (image) formData.append('image', image)

  await api.put(`/support/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export async function deleteItem(ids: string[]) {
  await api.delete(`/support/`, {
    data: { ids },
  })
}

export async function disable(ids: string[]) {
  await api.patch('/support/disable', {
    ids,
  })
}
