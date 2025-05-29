import { ref } from 'vue'

export interface ILoader {
  [loaderId: string]: boolean
}

const loaders = ref({} as ILoader)

export function useLoader() {
  function toggleLoading(loaderId: string) {
    loaders.value[loaderId] = !loaders.value[loaderId]
  }

  function loaderStatus(loaderId: string) {
    return loaders.value[loaderId]
  }

  function loaderStatusMultiple(loaderId: string[]) {
    return !!loaderId.filter((id) => loaders.value[id] == true).length
  }

  function removeLoaders<T>(loadersRemove: T) {
    for (const property in loadersRemove) {
      delete loaders.value[property as string]
    }
  }

  return {
    loaders,
    removeLoaders,
    loaderStatus,
    toggleLoading,
    loaderStatusMultiple,
  }
}
