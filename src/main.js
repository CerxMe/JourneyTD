import { createApp } from 'vue'
import App from './App.vue'
import { routes } from './routes.js'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'

try {
  const app = createApp(App)

  // Use store
  app.use(createPinia())

  // Use router
  const router = createRouter({
    history: createWebHistory(),
    routes
  })
  app.use(router)

  app.mount('#app')
} catch (error) {
  console.error('error')
  console.error(error)
}
