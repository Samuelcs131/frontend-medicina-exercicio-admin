import axios from "axios"

interface ILocation {
  state: string
  city: string
  street: string
  neighborhood: string
}

export async function getLocationByCEP(cep: string): Promise<ILocation> {
  const { data } = await axios.get(`/ws/${cep}/json/`, {
    baseURL: 'https://viacep.com.br',
  })

  if (data && data.erro) {
    throw new Error('CEP not found')
  }

  return {
    state: data.estado,
    city: data.localidade,
    street: data.logradouro,
    neighborhood: data.bairro
  }
}
