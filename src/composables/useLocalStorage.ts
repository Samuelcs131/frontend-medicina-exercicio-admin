import { LocalStorage } from 'quasar'

export function useLocalStorage() {
  function setLocalStorage(key: string, value: string) {
    LocalStorage.set(key, value)
  }

  function getLocalStorage<T>(key: string) {
    return LocalStorage.getItem(key) as T
  }

  function removeLocalStorage(key: string) {
    LocalStorage.remove(key)
  }

  return { setLocalStorage, getLocalStorage, removeLocalStorage }
}
