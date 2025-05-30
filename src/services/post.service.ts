import { api } from 'src/boot/axios'
import { PostTypeContent } from 'src/enums/post/PostTypeContent.enum'
import { Status } from 'src/enums/Status.enum'
import type { IPost, IPostResume } from 'src/types/post/IPost.type'
import { fakePromise } from 'src/utils/fakePromise.util'

export async function getAllPostResume(): Promise<IPostResume[]> {
  // const { data } = await api.get('/posts/resume')

  await fakePromise(2000)

  return [
    {
      id: '1',
      title: 'Hemodinâmica',
      author: 'Paulo Muzy',
      schedulingDate: new Date().toISOString(),
      status: Status.active,
      thumbnailUrlImage:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUL_rqUXPVBPWT9455dfbHvQsbRhr_7X0lFA&s',
    },
  ]
}

export async function getPostById(id: string): Promise<IPost> {
  // const { data } = await api.get(`/posts/${id}`)

  await fakePromise(2000)

  console.log(id)

  return {
    id: '1',
    title: 'Hemodinâmica',
    author: 'Paulo Muzy',
    url: 'hemodinamica',
    professionalId: '1',
    schedulingDate: new Date().toISOString(),
    specialtyId: '1',
    authorDescription: 'Médico Cardiologista',
    status: Status.active,
    subspecialtyId: '1',
    tagDescription: 'A Hemodinâmica e cardiologia Intervencionista.',
    tagKeywords: 'Hemodinâmica, Cardiologia',
    tagTitle: 'Hemodinâmica',
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
  await fakePromise(2000)

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
  await fakePromise(2000)

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
  await fakePromise(2000)

  await api.delete(`/video/`, {
    data: { ids },
  })
}

export async function disable(ids: string[]) {
  await fakePromise(2000)

  await api.patch('/video/disable', {
    ids,
  })
}
