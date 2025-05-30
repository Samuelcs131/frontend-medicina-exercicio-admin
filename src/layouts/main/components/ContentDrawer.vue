<template>
  <q-scroll-area class="fit" id="menu-content-drawer">
    <q-item style="height: 60px" :active="false" to="/">
      <q-img :src="logo" width="130px" fit="contain" v-if="!mini" />
      <q-img :src="logoSimple" fit="contain" v-else />
    </q-item>
    <template v-for="(menuItem, index) in menuOptions" :key="index">
      <q-item
        v-if="handleRoles(menuItem.roles) && !menuItem.children.length"
        active-class="active-item-menu"
        :to="menuItem.to"
        clickable
        v-ripple
        :disable="menuItem?.disable"
      >
        <q-item-section avatar>
          <q-icon :name="menuItem.icon" />
        </q-item-section>
        <q-item-section>
          {{ menuItem.name }}
        </q-item-section>
      </q-item>
      <q-expansion-item
        v-else-if="handleRoles(menuItem.roles)"
        :model-value="false"
        :icon="menuItem.icon"
        :label="menuItem.name"
      >
        <template v-for="(itemChild, idx) in menuItem.children" :key="idx">
          <q-item
            v-if="handleRoles(itemChild.roles)"
            clickable
            v-ripple
            icon
            :to="itemChild.to"
          >
            <div class="text-h5 q-mr-sm">•</div>
            <q-item-section>
              {{ itemChild.name }}
            </q-item-section>
          </q-item>
        </template>
      </q-expansion-item>
      <q-separator :key="'sep' + index" v-if="menuItem.separator" />
    </template>
  </q-scroll-area>
</template>
<script setup lang="ts">
import logo from 'assets/img/logo/logo.webp'
import logoSimple from 'assets/img/logo/logo-simple.png'
import { menuOptions } from '../constants/menuOptions.const'
import { Roles } from 'src/enums/Roles.enum'
import { useLocalStorage } from 'src/composables/useLocalStorage'
import { LocalStorageKey } from 'src/enums/LocalStorageKey.enum'

interface IProps {
  mini?: boolean
}

defineProps<IProps>()

function handleRoles(roles: Roles[]) {
  if (roles.length == 0) return true

  const { getLocalStorage } = useLocalStorage()

  const userRoles: Roles[] =
    JSON.parse(getLocalStorage(LocalStorageKey.user)).roles || []

  if (userRoles.includes(Roles.admin)) return true
  return roles.some((role) => userRoles.includes(role))
}
</script>
<style lang="scss">
#menu-content-drawer {
  // ACTIVE EXPANDED
  .q-item[aria-expanded='true'] {
    .q-item__section,
    .icon-point {
      color: $primary !important;
    }
  }

  // COLLAPSE
  .q-expansion-item__content {
    margin-left: 27px;
    border-left: 1px solid $separator-color;

    .q-expansion-item__content {
      margin-left: 19px;
    }
  }
}
</style>
