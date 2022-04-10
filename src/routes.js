import Home from './views/Home.vue'

/** @type {import('vue-router').RouterOptions['routes']} */
export const routes = [
  { path: '/', component: Home, meta: { title: 'Home' } },
  {
    path: '/game',
    meta: { title: 'JourneyTD' },
    component: () => import('./views/Game.vue')
  },
  { // 404
    path: '/:path(.*)',
    component: () => import('./views/NotFound.vue')
  }
]
