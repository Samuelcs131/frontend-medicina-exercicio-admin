import { api } from 'src/boot/axios'
import type { IPost, IPostResume } from 'src/types/post/IPost.type'
import { fakePromise } from 'src/utils/fakePromise.util'

export async function getAllPostResume(): Promise<IPostResume[]> {
  const { data } = await api.get('/post')

  return data
}

export async function getPostById(id: string): Promise<IPost> {
  const { data } = await api.get(`/post/${id}`)
  return data
}

export async function create(post: IPost, thumbnailFile: File | null) {
  const formData = new FormData()

  if (thumbnailFile) formData.append('thumbnail', thumbnailFile)
  formData.append('thumbnailAlt', post.thumbnailAlt)
  formData.append('schedulingDate', post.schedulingDate)
  formData.append('url', post.url)
  formData.append('title', post.title)
  formData.append('author', post.author)
  formData.append('authorDescription', post.authorDescription)
  formData.append('tagDescription', post.tagDescription || '')
  formData.append('tagKeywords', post.tagKeywords || '')
  formData.append('tagTitle', post.tagTitle || '')
  formData.append('status', post.status)

  post.subspecialtyIds.forEach((id) => formData.append('subspecialtyIds', id))
  post.specialtyIds.forEach((id) => formData.append('specialtyIds', id))

  post.recomendations.specialtyIds.forEach((id) =>
    formData.append('recomendationSpecialtyIds', `${id}`),
  )
  post.recomendations.outherContentPostIds.forEach((id) =>
    formData.append('recomendationOutherContentPostIds', `${id}`),
  )
  post.recomendations.readMorePostIds.forEach((id) =>
    formData.append('recomendationReadMorePostIds', `${id}`),
  )

  post.postItems.forEach((item, idx) => {
    formData.append(`${idx}-contentHTML`, item.contentHTML)
    formData.append(`${idx}-postTypeContent`, item.postTypeContent)

    for (const image in item.imageFiles) {
      formData.append(`${idx}-image`, item.imageFiles[image]!)
    }
  })

  await api.post('/post', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export async function save(
  id: string,
  post: IPost,
  thumbnailFile: File | null,
) {
  await fakePromise(100)

  const formData = new FormData()

  if (thumbnailFile) formData.append('thumbnail', thumbnailFile)
  formData.append('thumbnailAlt', post.thumbnailAlt)
  formData.append('schedulingDate', post.schedulingDate)
  formData.append('url', post.url)
  formData.append('title', post.title)
  formData.append('author', post.author)
  formData.append('authorDescription', post.authorDescription)
  formData.append('tagDescription', post.tagDescription || '')
  formData.append('tagKeywords', post.tagKeywords || '')
  formData.append('tagTitle', post.tagTitle || '')
  formData.append('status', post.status)

  post.subspecialtyIds.forEach((id) => formData.append('subspecialtyIds', id))
  post.specialtyIds.forEach((id) => formData.append('specialtyIds', id))

  post.recomendations.specialtyIds.forEach((id) =>
    formData.append('recomendationSpecialtyIds', `${id}`),
  )
  post.recomendations.outherContentPostIds.forEach((id) =>
    formData.append('recomendationOutherContentPostIds', `${id}`),
  )
  post.recomendations.readMorePostIds.forEach((id) =>
    formData.append('recomendationReadMorePostIds', `${id}`),
  )

  post.postItems.forEach((item, idx) => {
    formData.append(`${idx}-contentHTML`, item.contentHTML)
    formData.append(`${idx}-postTypeContent`, item.postTypeContent)

    for (const image in item.imageFiles) {
      formData.append(`${idx}`, item.imageFiles[image]!)
    }
  })

  await api.put(`/post/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export async function deleteItem(ids: string[]) {
  await api.delete(`/post/`, {
    data: { ids },
  })
}

export async function getByProfessionalIds(ids: string[]) {
  const { data } = await api.post(`/post/by-guests/`, {
    guests: ids,
  })
  return data
}

export async function disable(ids: string[]) {
  await api.patch('/post/disable', {
    ids,
  })
}
