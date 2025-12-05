import { api } from 'src/boot/axios'
import { Status } from 'src/enums/Status.enum'
import type { ISubspecialtyGroup } from 'src/types/specialty/ISubspecialtyGroup.type'

export async function getAll(): Promise<ISubspecialtyGroup[]> {
  const { data } = await api.get('/subspecialty-group')
  return data
  // await fakePromise(100)
  /* return [
    {
      id: '1',
      name: 'Subespecialidades e áreas de atuação',
      description: 'Descrição de alguma coisa',
      imageURL:
        'https://animaniacs.com.br/wp-content/uploads/2020/05/layer-clinica-medica-felinos.jpg',
      status: Status.active,
    },
  ] */
}

export async function create(
  name: string,
  description: string,
  image: File,
) {
  const formData = new FormData()

  formData.append('name', name)
  formData.append('description', description)
  formData.append('image', image)

  await api.post('/subspecialty-group', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export async function save(
  id: string,
  name: string,
  description: string,
  status: Status,
  image: File | null,
) {
  const formData = new FormData()

  formData.append('name', name)
  formData.append('description', description)
  formData.append('status', status)

  if (image) formData.append('image', image)

  await api.put(`/subspecialty-group/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export async function deleteItem(ids: string[]) {
  await api.delete(`/subspecialty-group/`, {
    data: { ids },
  })
}

export async function disable(ids: string[]) {
  await api.patch('/subspecialty-group/disable', {
    ids,
  })
}
