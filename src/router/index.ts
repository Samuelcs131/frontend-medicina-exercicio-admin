import { defineRouter } from '#q-app/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';
import * as AuthService from 'src/services/auth/auth.service'
import { LocalStorageKey } from 'src/enums/LocalStorageKey.enum'
import { CookieKey } from 'src/enums/CookieKey.enum'
import { useCookies } from 'src/composables/useCookies'
import { useLocalStorage } from 'src/composables/useLocalStorage'
import { clearAuthStorage } from 'src/helpers/auth/authSession'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach(async (to, _from, next) => {
    const requiresAuth = Boolean(to.meta?.requiresAuth)
    if (!requiresAuth) return next()

    const { getCookie } = useCookies()
    const { getLocalStorage } = useLocalStorage()

    const tokenFromStorage =
      getLocalStorage<string | null>(LocalStorageKey.token) ?? null
    const tokenFromCookie = getCookie(CookieKey.token) ?? null
    const token = tokenFromStorage || tokenFromCookie

    if (!token) {
      clearAuthStorage()
      return next({ name: 'login' })
    }

    try {
      await AuthService.validateSession(token)
      return next()
    } catch {
      clearAuthStorage()
      return next({ name: 'login' })
    }
  })

  return Router;
});
