import { api } from "src/boot/axios"

interface ICepResponse {
  cep: string
  estado: string
  localidade: string
  bairro: string
  logradouro: string
}

interface ILocation {
  state: string
  city: string
  street: string
}

export async function getLocationByCEP(cep: string): Promise<ILocation> {
  const { data } = await api.get<ICepResponse>(`/ws/${cep}/json/`, {
    baseURL: 'https://viacep.com.br',
  })

  return {
    state: data.estado,
    city: data.localidade,
    street: data.logradouro
  }
}
