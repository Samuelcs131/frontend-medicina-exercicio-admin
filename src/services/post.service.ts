import { api } from 'src/boot/axios'
import { PostTypeContent } from 'src/enums/post/PostTypeContent.enum'
import { Status } from 'src/enums/Status.enum'
import type { IPost, IPostResume } from 'src/types/post/IPost.type'
import { fakePromise } from 'src/utils/fakePromise.util'

export async function getAllPostResume(): Promise<IPostResume[]> {
  const { data } = await api.get('/post')

  return data

  /*await fakePromise(100)

   return [
    {
      id: '1',
      title: 'Hemodinâmica',
      author: 'Paulo Muzy',
      schedulingDate: new Date().toISOString(),
      status: Status.active,
      thumbnailUrlImage:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUL_rqUXPVBPWT9455dfbHvQsbRhr_7X0lFA&s',
      clicks: 30,
      specialtyIds: ['1'],
    },
    {
      id: '2',
      title: 'Outro conteudo',
      author: 'Desconhecido',
      schedulingDate: new Date().toISOString(),
      status: Status.active,
      thumbnailUrlImage:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUL_rqUXPVBPWT9455dfbHvQsbRhr_7X0lFA&s',
      clicks: 341,
      specialtyIds: ['2'],
    },
    {
      id: '3',
      title: 'Outro conteudo 2',
      author: 'Desconhecido',
      schedulingDate: new Date().toISOString(),
      status: Status.active,
      thumbnailUrlImage:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUL_rqUXPVBPWT9455dfbHvQsbRhr_7X0lFA&s',
      clicks: 564,
      specialtyIds: ['3'],
    },
  ] */
}

export async function getPostById(id: string): Promise<IPost> {
  // const { data } = await api.get(`/posts/${id}`)

  await fakePromise(100)

  console.log(id)

  return {
    id: '1',
    title: 'Hemodinâmica',
    author: 'Paulo Muzy',
    url: 'hemodinamica',
    professionalId: '1',
    schedulingDate: new Date().toISOString(),
    specialtyIds: ['1'],
    authorDescription: 'Médico Cardiologista',
    status: Status.active,
    subspecialtyIds: ['1'],
    tagDescription: 'A Hemodinâmica e cardiologia Intervencionista.',
    tagKeywords: 'Hemodinâmica, Cardiologia',
    tagTitle: 'Hemodinâmica',
    recomendations: {
      specialtyIds: ['1'],
      readMorePostIds: ['2'],
      outherContentPostIds: ['2'],
    },
    thumbnailAlt: 'Imagem médica',
    thumbnailUrlImage:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUL_rqUXPVBPWT9455dfbHvQsbRhr_7X0lFA&s',
    postItems: [
      {
        contentHTML:
          '<p>teste de alguma coisa</p><p><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUL_rqUXPVBPWT9455dfbHvQsbRhr_7X0lFA&s" alt="nome da imagem" width="342" height="342" data-display="inline"></p><p>teste de outra coisa</p><p><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUL_rqUXPVBPWT9455dfbHvQsbRhr_7X0lFA&s" alt="caminhao" width="342" height="342" data-display="inline"></p>',
        key: 'g245hj65d12d123f2f',
        postTypeContent: PostTypeContent.html,
      },
    ],
  }
}

export async function create(post: IPost, thumbnailFile: File | null) {
  await fakePromise(100)

  const formData = new FormData()

  if (thumbnailFile) formData.append('thumbnail', thumbnailFile)
  formData.append('thumbnailAlt', post.thumbnailAlt)
  formData.append('schedulingDate', post.schedulingDate)
  formData.append('url', post.url)
  formData.append('title', post.title)
  formData.append('author', post.author)
  formData.append('tagDescription', post.tagDescription || '')
  formData.append('tagKeywords', post.tagKeywords || '')
  formData.append('tagTitle', post.tagTitle || '')
  formData.append('status', post.status)

  post.subspecialtyIds.forEach((id) => formData.append('subspecialtyIds', id))
  post.specialtyIds.forEach((id) => formData.append('specialtyIds', id))

  post.postItems.forEach((item, idx) => {
    formData.append(`${idx}-contentHTML`, item.contentHTML)
    formData.append(`${idx}-postTypeContent`, item.postTypeContent)

    for (const image in item.imageFiles) {
      formData.append(`${image}`, item.imageFiles[image]!)
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
  formData.append('tagDescription', post.tagDescription || '')
  formData.append('tagKeywords', post.tagKeywords || '')
  formData.append('tagTitle', post.tagTitle || '')
  formData.append('status', post.status)

  post.subspecialtyIds.forEach((id) => formData.append('subspecialtyIds', id))
  post.specialtyIds.forEach((id) => formData.append('specialtyIds', id))

  post.postItems.forEach((item, idx) => {
    formData.append(`${idx}-contentHTML`, item.contentHTML)
    formData.append(`${idx}-postTypeContent`, item.postTypeContent)

    for (const image in item.imageFiles) {
      formData.append(`${image}`, item.imageFiles[image]!)
    }
  })

  await api.put(`/post/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export async function deleteItem(ids: string[]) {
  await fakePromise(100)

  await api.delete(`/video/`, {
    data: { ids },
  })
}

export async function disable(ids: string[]) {
  await fakePromise(100)

  await api.patch('/video/disable', {
    ids,
  })
}
