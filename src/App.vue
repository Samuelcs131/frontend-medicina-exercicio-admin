<template>
  <router-view />
</template>

<script setup lang="ts">
import { useAuth } from './composables/useAuth'
import { useInterface } from './composables/useInterface'
import { useSettingMeta } from './composables/useMetaHtml'
import { useQuasarLangComponents } from './composables/useQuasarLangComponents'

const { startInterfaceConfig } = useInterface()
const { setupLangComponents } = useQuasarLangComponents()
const { startInterceptors } = useAuth()
const { titlePage } = useSettingMeta()

startInterceptors()
startInterfaceConfig()
setupLangComponents()
titlePage('Medicina & Exercicio - Admin')
</script>
