import { api } from 'src/boot/axios'
import { Status } from 'src/enums/Status.enum'
import type { IMedicalArea } from 'src/types/specialty/IMedicalArea.type'
import { fakePromise } from 'src/utils/fakePromise.util'

export async function getAll(): Promise<IMedicalArea[]> {
  /* const { data } = await api.get('/medical-area')
  return data.users */
  await fakePromise(1000)

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

  await api.post('/medical-area', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export async function save(id: string, name: string, image: File | null) {
  const formData = new FormData()

  formData.append('name', name)
  if (image) formData.append('image', image)

  await api.put(`/medical-area/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export async function deleteItem(ids: string[]) {
  await api.delete(`/medical-area/`, {
    data: { ids },
  })
}

export async function disable(ids: string[]) {
  await api.patch('/medical-area/disable', {
    ids,
  })
}
