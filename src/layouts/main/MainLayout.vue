<template>
  <q-layout view="lHh LpR lfr">
    <q-header class="header-layout-main">
      <q-toolbar class="header-layout-main">
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-space />

        <q-item :clickable="false">
          <q-btn round unelevated>
            <q-avatar size="38px" class="bg-theme-paper">
              <q-icon name="person" size="24px" />
            </q-avatar>
          </q-btn>
          <q-menu class="q-card--bordered shadow-0">
            <q-list style="min-width: 150px" dense>
              <q-item class="q-my-xs non-selectable">
                <q-item-section>
                  <q-item-label>
                    {{ state.user.name }}
                  </q-item-label>
                  <q-item-label class="text-grey" caption lines="1">
                    {{ state.user.email }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-toggle
                  v-model="state.theme"
                  checked-icon="dark_mode"
                  color="primary"
                  unchecked-icon="light_mode"
                  :label="state.theme ? 'Dark' : 'Light'"
                  @update:model-value="toggleTheme"
                />
              </q-item>
              <q-item>
                <q-toggle
                  v-model="state.compact"
                  color="primary"
                  label="Compacto"
                  @update:model-value="compactToggle"
                />
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup @click="logout">
                <q-item-section>Sair</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-item>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="state.menu.drawer"
      show-if-above
      :mini="!state.menu.drawer || state.menu.mini"
      :width="260"
      :breakpoint="400"
      :behavior="state.typeScreen"
      class="border-dashed-right"
      id="drawer-layout"
      bordered
    >
      <content-drawer :mini="!state.menu.drawer || state.menu.mini" />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="text-center q-pa-md bg-transparent" bordered>
      © 2025 Medicina & Exercício. Todos os direitos reservados.
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Screen } from 'quasar'
import { useAuth } from 'src/composables/useAuth'
import { useLocalStorage } from 'src/composables/useLocalStorage'
import ContentDrawer from './components/ContentDrawer.vue'
import { useInterface } from 'src/composables/useInterface'
import { LocalStorageKey } from 'src/enums/LocalStorageKey.enum'

const { logout } = useAuth()
const { getLocalStorage } = useLocalStorage()
const { toggleTheme, compactToggle } = useInterface()

defineOptions({
  name: 'MainLayout',
})

interface IState {
  menu: {
    drawer: boolean
    mini: boolean
  }
  typeScreen: 'default' | 'desktop' | 'mobile'
  theme: boolean
  compact: boolean
  user: {
    email: string
    name: string
    balance: number
  }
}
const state = ref<IState>({
  menu: {
    drawer: false,
    mini: false,
  },
  typeScreen: 'default',
  theme: false,
  compact: false,
  user: {
    email: '',
    name: '',
    balance: 0,
  },
})

function toggleLeftDrawer() {
  if (Screen.width < 768) {
    state.value.menu.drawer = !state.value.menu.drawer
  } else {
    state.value.menu.mini = !state.value.menu.mini
  }
}

function setUserData() {
  const user = getLocalStorage<string>(LocalStorageKey.user)

  state.value.user = JSON.parse(user) || {
    email: '',
    name: '',
    balance: 0,
  }
}

function setInterfaceConfig() {
  const theme = getLocalStorage<string>(LocalStorageKey.theme) == 'true'
  const compact = getLocalStorage<string>(LocalStorageKey.compact) == 'true'

  state.value.theme = theme
  state.value.compact = compact
}

onMounted(() => {
  if (Screen.width < 768) {
    state.value.menu.mini = false
  }

  state.value.typeScreen = Screen.width <= 768 ? 'mobile' : 'desktop'

  setUserData()
  setInterfaceConfig()
})
</script>
<style lang="scss">
.header-layout-main {
  background: rgba(0, 0, 0, 0.075);
  backdrop-filter: blur(5px);
}
</style>
