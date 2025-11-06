import { api } from 'src/boot/axios'
import { Status } from 'src/enums/Status.enum'
import type { IProfessional } from 'src/types/professional/IProfessional.type'

export async function getAll(): Promise<IProfessional[]> {
  const { data } = await api.get('/professional')
  return data
  /* return [
    {
      id: '1',
      name: 'Paulo Muzy',
      RQN: '1258678456',
      CRM: '122334',
      cities: [{ id: '1', name: 'Rio de Janeiro' }],
      states: [{ id: '1', name: 'Rio de Janeiro' }],
      specialtyIds: ['1'],
      subspecialtyIds: ['1'],
      aboutMy: 'Um texto resumido igual o linkedin',
      localServiceIds: ['1'],
      instagram: 'https://www.instagram.com/paulomuzy',
      site: 'site.com.br',
      curriculumLattes: 'curriculoLattes.com.br',
      teleconsultation: false,
      speakEnglish: false,
      imageURL:
        'https://media.istockphoto.com/id/915139892/pt/foto/cat-doctor-with-a-syringe.jpg?s=1024x1024&w=is&k=20&c=ThiWN7hqm-vsp1hVHoIXI-jROBAR0jD_LY0_jyt1RAQ=',
      status: Status.active,
      recomendations: {
        professionalVideoIds: ['1'],
        professionalIds: ['2'],
        specialtyIds: ['1'],
      },
      clicks: 12,
    },
    {
      id: '2',
      name: 'Pamela Alves',
      RQN: '1258678456',
      CRM: '122334',
      cities: [{ id: '1', name: 'Rio de Janeiro' }],
      states: [{ id: '1', name: 'Rio de Janeiro' }],
      specialtyIds: ['2'],
      subspecialtyIds: ['2'],
      aboutMy: 'Um texto resumido igual o linkedin',
      localServiceIds: ['1'],
      instagram: 'https://www.instagram.com/paulomuzy',
      site: 'site.com.br',
      curriculumLattes: 'curriculoLattes.com.br',
      teleconsultation: false,
      speakEnglish: false,
      imageURL:
        'https://media.istockphoto.com/id/915139892/pt/foto/cat-doctor-with-a-syringe.jpg?s=1024x1024&w=is&k=20&c=ThiWN7hqm-vsp1hVHoIXI-jROBAR0jD_LY0_jyt1RAQ=',
      status: Status.active,
      recomendations: {
        professionalVideoIds: ['2'],
        professionalIds: ['1'],
        specialtyIds: ['2'],
      },
      clicks: 74,
    },
  ] */
}

export async function create(
  name: string,
  RQN: string | null,
  CRM: string | null,
  specialtyIds: string[],
  subspecialtyIds: string[],
  aboutMy: string,
  localServiceIds: string[],
  instagram: string,
  site: string,
  teleconsultation: boolean,
  speakEnglish: boolean,
  image: string,
  curriculumLattes: string,
  cityIds: string[],
  stateIds: string[],
  recomendations: {
    specialtyIds: string[]
    professionalVideoIds: string[]
    professionalIds: string[]
  },
) {
  await api.post('/professional', {
    name,
    RQN,
    CRM,
    specialtyIds,
    subspecialtyIds,
    aboutMy,
    localServiceIds,
    instagram,
    site,
    teleconsultation,
    speakEnglish,
    imageURL: image,
    curriculumLattes,
    cityIds,
    stateIds,
    recomendations,
  })
  /* const formData = new FormData()

  formData.append('name', name)
  if (RQN) formData.append('RQN', RQN)
  if (CRM) formData.append('CRM', CRM)
  formData.append('aboutMy', aboutMy)
  formData.append('instagram', instagram)
  formData.append('site', site)
  formData.append('teleconsultation', `${teleconsultation}`)
  formData.append('speakEnglish', `${speakEnglish}`)
  formData.append('image', image)
  formData.append('curriculumLattes', curriculumLattes)

  specialtyIds.forEach((id) => formData.append('specialtyId', id))
  subspecialtyIds.forEach((id) => formData.append('subspecialtyId', id))
  localServiceIds.forEach((id) => formData.append('localServiceIds', id))
  cityIds.forEach((id) => formData.append('cityIds', id))
  stateIds.forEach((id) => formData.append('stateIds', id))

  recomendations.specialtyIds.forEach((id) =>
    formData.append('recomendationSpecialtyIds', `${id}`),
  )
  recomendations.professionalVideoIds.forEach((id) =>
    formData.append('recomendationProfessionalVideoIds', `${id}`),
  )
  recomendations.professionalIds.forEach((id) =>
    formData.append('recomendationProfessionalIds', `${id}`),
  )

  await api.post('/professional', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }) */
}

export async function save(
  id: string,
  name: string,
  RQN: string | null,
  CRM: string | null,
  specialtyIds: string[],
  subspecialtyIds: string[],
  aboutMy: string,
  localServiceIds: string[],
  instagram: string,
  site: string,
  teleconsultation: boolean,
  speakEnglish: boolean,
  image: string,
  curriculumLattes: string,
  cityIds: string[],
  stateIds: string[],
  recomendations: {
    specialtyIds: string[]
    professionalVideoIds: string[]
    professionalIds: string[]
  },
  status: Status,
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
  if (image) formData.append('image', image)

  specialtyIds.forEach((id) => formData.append('specialtyId', id))
  subspecialtyIds.forEach((id) => formData.append('subspecialtyId', id))
  localServiceIds.forEach((id) => formData.append('localServiceIds', id))
  cityIds.forEach((id) => formData.append('cityIds', id))
  stateIds.forEach((id) => formData.append('stateIds', id))

  recomendations.specialtyIds.forEach((id) =>
    formData.append('recomendationSpecialtyIds', `${id}`),
  )
  recomendations.professionalVideoIds.forEach((id) =>
    formData.append('recomendationProfessionalVideoIds', `${id}`),
  )
  recomendations.professionalIds.forEach((id) =>
    formData.append('recomendationProfessionalIds', `${id}`),
  )

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
