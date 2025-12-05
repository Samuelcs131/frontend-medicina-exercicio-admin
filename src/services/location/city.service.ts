import { api } from 'src/boot/axios'
import { ICity } from 'src/types/city/ICity.type'

export async function getAll(): Promise<ICity[]> {
  const { data } = await api.get('/city')
  return data
}
