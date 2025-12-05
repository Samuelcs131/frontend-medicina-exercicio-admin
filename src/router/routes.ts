import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/app/home',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('pages/login/LoginPage.vue'),
  },
  {
    path: '/app',
    redirect: '/app/home',
    component: () => import('layouts/main/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('pages/IndexPage.vue'),
        meta: { requiresAuth: true, roles: [] },
      },
      {
        path: 'user',
        name: 'user',
        component: () => import('pages/user/UserPage.vue'),
        meta: { requiresAuth: true, roles: [] },
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('pages/profile/ProfilePage.vue'),
        meta: { requiresAuth: true, roles: [] },
      },
      {
        path: 'profissionalArea',
        name: 'profissionalArea',
        component: () => import('src/pages/professional-area/ProfissionalAreaPage.vue'),
        meta: { requiresAuth: true, roles: [] },
      },
      {
        path: 'subspecialtyGroup',
        name: 'subspecialtyGroup',
        component: () =>
          import('pages/subspecialty-group/SubspecialtyGroupPage.vue'),
        meta: { requiresAuth: true, roles: [] },
      },
      {
        path: 'specialty',
        name: 'specialty',
        component: () => import('pages/specialty/SpecialtyPage.vue'),
        meta: { requiresAuth: true, roles: [] },
      },
      {
        path: 'subspecialty',
        name: 'subspecialty',
        component: () => import('pages/subspecialty/SubspecialtyPage.vue'),
        meta: { requiresAuth: true, roles: [] },
      },
      {
        path: 'localService',
        name: 'localService',
        component: () => import('pages/local-service/LocalServicePage.vue'),
        meta: { requiresAuth: true, roles: [] },
      },
      {
        path: 'professional',
        name: 'professional',
        component: () => import('pages/professional/ProfessionalPage.vue'),
        meta: { requiresAuth: true, roles: [] },
      },
      {
        path: 'video',
        name: 'video',
        component: () => import('pages/video/VideoPage.vue'),
        meta: { requiresAuth: true, roles: [] },
      },
      {
        path: 'post',
        name: 'post',
        component: () => import('pages/post-page/PostPage.vue'),
        meta: { requiresAuth: true, roles: [] },
      },
      {
        path: 'postEdit/:postId?',
        name: 'postEdit',
        component: () => import('pages/post-edit/PostEditPage.vue'),
        meta: { requiresAuth: true, roles: [] },
      },
      {
        path: 'supporter',
        name: 'supporter',
        component: () => import('pages/supporter/SupporterPage.vue'),
        meta: { requiresAuth: true, roles: [] },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
