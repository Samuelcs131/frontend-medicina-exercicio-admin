import { api } from 'src/boot/axios'
import type { IBasicEntity } from 'src/types/IBasicEntity.type' 

export async function getAll(): Promise<IBasicEntity<string>[]> {
  const { data } = await api.get('/state')
  return data

  /* return [
    {
      id: '1',
      name: 'Rio de Janeiro',
    },
    {
      id: '2',
      name: 'Minas Gerais',
    },
  ] */
}
