import { api } from 'src/boot/axios'
import { Status } from 'src/enums/Status.enum'
import { ISupporter } from 'src/types/supporter/ISupporter.type'

export async function getAll(): Promise<ISupporter[]> {
  const { data } = await api.get('/support')
  return data
  /* return [
    {
      id: '1',
      name: "Mc Donald's",
      imageURL:
        'https://i.pinimg.com/564x/54/ca/74/54ca74a3709b4787b44970ed6a87f8c6.jpg',
      status: Status.active,
    },
  ] */
}

export async function create(name: string, imageURL: string) {
  await api.post('/support', {
    name,
    imageURL,
  })
  /* const formData = new FormData()

  formData.append('name', name)
  formData.append('image', image)

  await api.post('/support', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }) */
}

export async function save(
  id: string,
  name: string,
  imageURL: string,
  status: Status,
) {
  await api.put(`/support/${id}`, {
    name,
    imageURL,
    status,
  })
  /* const formData = new FormData()

  formData.append('name', name)
  if (image) formData.append('image', image)

  await api.put(`/support/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }) */
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
