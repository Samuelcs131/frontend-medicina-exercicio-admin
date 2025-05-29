import { Dark, setCssVar } from 'quasar'
import { useLocalStorage } from './useLocalStorage'
import { LocalStorageKey } from 'src/enums/LocalStorageKey.enum'

export function useInterface() {
  const { getLocalStorage, setLocalStorage } = useLocalStorage()

  function toggleTheme() {
    setLocalStorage('theme', `${!Dark.isActive}`)
    Dark.toggle()
  }

  function startInterfaceConfig() {
    const currentCompact = getLocalStorage(LocalStorageKey.compact)

    const config = {
      theme: getLocalStorage(LocalStorageKey.theme) == 'true',
    }

    if (config.theme) Dark.toggle()

    if (currentCompact == undefined) {
      setLocalStorage(LocalStorageKey.compact, 'true')
      setCssVar('stretch-max-width', '1200px')
    } else {
      setCssVar('stretch-max-width', currentCompact == 'true' ? '1200px' : 'none')
    }
  }

  function compactToggle() {
    const currentCompact = getLocalStorage(LocalStorageKey.compact) == 'true'
    setLocalStorage(LocalStorageKey.compact, `${!currentCompact}`)
    setCssVar('stretch-max-width', !currentCompact ? '1200px' : 'none')
  }

  return {
    startInterfaceConfig,
    compactToggle,
    toggleTheme,
  }
}
