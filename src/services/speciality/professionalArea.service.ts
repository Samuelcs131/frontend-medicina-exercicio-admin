import { api } from 'src/boot/axios'
import { Status } from 'src/enums/Status.enum'
import type { IProfissionalArea } from 'src/types/specialty/IProfissionalArea.type'
import { fakePromise } from 'src/utils/fakePromise.util'

export async function getAll(): Promise<IProfissionalArea[]> {
  /* const { data } = await api.get('/professional-area')
  return data.users */
  await fakePromise(100)

  return [
    {
      id: '1',
      name: 'Especialidades Médicas - Adulto',
      imageURL:
        'https://animaniacs.com.br/wp-content/uploads/2020/05/layer-clinica-medica-felinos.jpg',
      status: Status.active,
    },
    {
      id: '2',
      name: 'Especialidades Médicas - Pediátrica',
      imageURL:
        'https://animaniacs.com.br/wp-content/uploads/2020/05/layer-clinica-medica-felinos.jpg',
      status: Status.active,
    },
  ]
}

export async function create(name: string, image: File) {
  const formData = new FormData()

  formData.append('name', name)
  formData.append('image', image)

  await api.post('/professional-area', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export async function save(id: string, name: string, image: File | null) {
  const formData = new FormData()

  formData.append('name', name)
  if (image) formData.append('image', image)

  await api.put(`/professional-area/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export async function deleteItem(ids: string[]) {
  await api.delete(`/professional-area/`, {
    data: { ids },
  })
}

export async function disable(ids: string[]) {
  await api.patch('/professional-area/disable', {
    ids,
  })
}
