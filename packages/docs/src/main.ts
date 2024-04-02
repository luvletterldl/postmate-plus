import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import 'element-plus/es/components/message/style/css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@unocss/reset/tailwind-compat.css'
import 'uno.css'
import './assets/styles/main.css'
import App from './App.vue'
import routes from '~pages'

const app = createApp(App)
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})
app.use(router).mount('#app')
