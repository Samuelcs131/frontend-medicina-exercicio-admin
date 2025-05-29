import { api } from 'src/boot/axios'
import { Status } from 'src/enums/Status.enum'
import type { IProfessional } from 'src/types/professional/IProfessional.type'
import { fakePromise } from 'src/utils/fakePromise.util'

export async function getAll(): Promise<IProfessional[]> {
  /* const { data } = await api.get('/professional')
  return data.users */
  await fakePromise(1000)
  return [
    {
      id: '1',
      name: 'Paulo Muzy',
      RQN: '1258678456',
      CRM: '122334',
      specialties: [
        {
          id: '1',
          name: 'Cardiologia',
        },
      ],
      subspecialties: [
        {
          id: '1',
          name: 'Hemodinâmica',
        },
      ],
      aboutMy: 'Um texto resumido igual o linkedin',
      localServiceIds: [],
      instagram: 'https://www.instagram.com/paulomuzy',
      curriculumURL: 'string',
      site: 'site.com.br',
      teleconsultation: false,
      speakEnglish: false,
      imageURL:
        'https://media.istockphoto.com/id/915139892/pt/foto/cat-doctor-with-a-syringe.jpg?s=1024x1024&w=is&k=20&c=ThiWN7hqm-vsp1hVHoIXI-jROBAR0jD_LY0_jyt1RAQ=',
      status: Status.active,
    },
  ]
}

export async function create(
  name: string,
  RQN: string,
  CRM: string,
  specialtyIds: string[],
  subspecialtyIds: string[],
  aboutMy: string,
  localServiceIds: string[],
  instagram: string,
  site: string,
  teleconsultation: boolean,
  speakEnglish: boolean,
  image: File,
  curriculum: File,
) {
  const formData = new FormData()

  formData.append('name', name)
  formData.append('RQN', RQN)
  formData.append('CRM', CRM)
  formData.append('aboutMy', aboutMy)
  formData.append('instagram', instagram)
  formData.append('site', site)
  formData.append('teleconsultation', `${teleconsultation}`)
  formData.append('speakEnglish', `${speakEnglish}`)
  formData.append('image', image)
  formData.append('curriculum', curriculum)

  specialtyIds.forEach((id) => formData.append('specialtyId', id))
  subspecialtyIds.forEach((id) => formData.append('subspecialtyId', id))
  localServiceIds.forEach((id) => formData.append('localServiceIds', id))

  await api.post('/professional', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export async function save(
  id: string,
  name: string,
  RQN: string,
  CRM: string,
  specialtyIds: string[],
  subspecialtyIds: string[],
  aboutMy: string,
  localServiceIds: string[],
  instagram: string,
  site: string,
  teleconsultation: boolean,
  speakEnglish: boolean,
  image: File | null,
  curriculum: File | null,
) {
  const formData = new FormData()

  formData.append('name', name)
  formData.append('RQN', RQN)
  formData.append('CRM', CRM)
  formData.append('aboutMy', aboutMy)
  formData.append('instagram', instagram)
  formData.append('site', site)
  formData.append('teleconsultation', `${teleconsultation}`)
  formData.append('speakEnglish', `${speakEnglish}`)

  specialtyIds.forEach((id) => formData.append('specialtyId', id))
  subspecialtyIds.forEach((id) => formData.append('subspecialtyId', id))
  localServiceIds.forEach((id) => formData.append('localServiceIds', id))

  if (image) formData.append('image', image)
  if (curriculum) formData.append('curriculum', curriculum)

  await api.put(`/professional/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export async function deleteItem(ids: string[]) {
  await api.delete(`/professional/`, {
    data: { ids },
  })
}

export async function disable(ids: string[]) {
  await api.patch('/professional/disable', {
    ids,
  })
}
