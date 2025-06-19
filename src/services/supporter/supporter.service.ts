import { api } from 'src/boot/axios'
import { Status } from 'src/enums/Status.enum'
import { ISupporter } from 'src/types/supporter/ISupporter.type'
import { fakePromise } from 'src/utils/fakePromise.util'

export async function getAll(): Promise<ISupporter[]> {
  /* const { data } = await api.get('/supporter')
  return data.users */
  await fakePromise(100)
  return [
    {
      id: '1',
      name: "Mc Donald's",
      imageURL:
        'https://i.pinimg.com/564x/54/ca/74/54ca74a3709b4787b44970ed6a87f8c6.jpg',
      status: Status.active,
    },
  ]
}

export async function create(name: string, image: File) {
  const formData = new FormData()

  formData.append('name', name)
  formData.append('image', image)

  await api.post('/supporter', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export async function save(id: string, name: string, image: File | null) {
  const formData = new FormData()

  formData.append('name', name)
  if (image) formData.append('image', image)

  await api.put(`/supporter/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export async function deleteItem(ids: string[]) {
  await api.delete(`/supporter/`, {
    data: { ids },
  })
}

export async function disable(ids: string[]) {
  await api.patch('/supporter/disable', {
    ids,
  })
}
