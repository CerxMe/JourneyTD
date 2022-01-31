import Home from './views/Home.vue'
import Game from './views/Game.vue'
import NotFound from './views/NotFound.vue'

/** @type {import('vue-router').RouterOptions['routes']} */
export const routes = [
  { path: '/', component: Home, meta: { title: 'Home' } },
  {
    path: '/game',
    meta: { title: 'JourneyTD' },
    component: Game
    // example of route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import('./views/Game.vue')
  },
  { path: '/:path(.*)', component: NotFound }
]
