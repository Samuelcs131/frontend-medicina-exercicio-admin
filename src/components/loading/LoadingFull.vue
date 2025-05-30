<template>
  <div
    v-if="loaderStatus(props.loaderId)"
    class="fullscreen flex flex-center z-max bg-black-1 loading-full-screen"
  >
    <div class="q-loading__box column items-center">
      <q-spinner color="white" size="5em" />
      <div class="q-loading__message">
        {{ text }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useLoader } from 'src/composables/useLoader'

const props = defineProps({
  text: {
    type: String,
    required: false,
  },
  loaderId: {
    type: String,
    required: true,
  },
})

const { loaderStatus } = useLoader()
</script>

<style lang="scss" scoped>
.loading-full-screen {
  background-color: rgba($dark, 0.4);
}
</style>
