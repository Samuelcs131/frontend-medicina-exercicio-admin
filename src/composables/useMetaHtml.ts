import { computed } from 'vue'
import { useMeta } from 'quasar'

export function useSettingMeta() {
  function titlePage(title: string) {
    useMeta(() => {
      return {
        title: computed(() => title).value,
      }
    })
  }

  return {
    titlePage,
  }
}
