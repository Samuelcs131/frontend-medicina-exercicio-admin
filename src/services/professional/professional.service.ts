import { api } from 'src/boot/axios'
import { Status } from 'src/enums/Status.enum'
import type { IProfessional } from 'src/types/professional/IProfessional.type'

export async function getAll(): Promise<IProfessional[]> {
  const { data } = await api.get('/professional')
  return data
}

export async function create(
  name: string,
  RQN: string | null,
  CRM: string | null,
  specialtyIds: string[],
  subspecialtyIds: string[],
  aboutMy: string,
  locationService: string[],
  instagram: string,
  site: string,
  teleconsultation: boolean,
  speakEnglish: boolean,
  curriculumLattes: string,
  cities: string[],
  states: string[],
  image: File | null,
) {
  const formData = new FormData()

  formData.append('name', name)
  if (RQN) formData.append('RQN', RQN)
  if (CRM) formData.append('CRM', CRM)
  formData.append('aboutMy', aboutMy)
  formData.append('instagram', instagram)
  formData.append('site', site)
  formData.append('teleconsultation', `${teleconsultation}`)
  formData.append('speakEnglish', `${speakEnglish}`)
  if (image) formData.append('image', image)
  formData.append('curriculumLattes', curriculumLattes)

  specialtyIds.forEach((id) => formData.append('specialtyIds', id))
  subspecialtyIds.forEach((id) => formData.append('subspecialtyIds', id))
  locationService.forEach((id) => formData.append('locationService', id))
  cities.forEach((id) => formData.append('cities', id))
  states.forEach((id) => formData.append('states', id))

  await api.post('/professional', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export async function save(
  id: string,
  name: string,
  RQN: string | null,
  CRM: string | null,
  specialtyIds: string[],
  subspecialtyIds: string[],
  aboutMy: string,
  locationService: string[],
  instagram: string,
  site: string,
  teleconsultation: boolean,
  speakEnglish: boolean,
  curriculumLattes: string,
  cities: string[],
  states: string[],
  recomendations: {
    professionalVideoIds: string[]
    informativeContentIds: string[]
    otherSpecialtyIds: string[]
  },
  status: Status,
  image: File | null,
) {
  const formData = new FormData()

  formData.append('name', name)
  if (RQN) formData.append('RQN', RQN)
  if (CRM) formData.append('CRM', CRM)
  formData.append('aboutMy', aboutMy)
  formData.append('instagram', instagram)
  formData.append('site', site)
  formData.append('curriculumLattes', curriculumLattes)
  formData.append('teleconsultation', `${teleconsultation}`)
  formData.append('speakEnglish', `${speakEnglish}`)
  formData.append('status', status)
  formData.append('recomendations', JSON.stringify(recomendations))
  if (image) formData.append('image', image)

  specialtyIds.forEach((id) => formData.append('specialtyIds', id))
  subspecialtyIds.forEach((id) => formData.append('subspecialtyIds', id))
  locationService.forEach((id) => formData.append('locationService', id))
  cities.forEach((id) => formData.append('cities', id))
  states.forEach((id) => formData.append('states', id))

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
