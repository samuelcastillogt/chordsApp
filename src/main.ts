import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router'
import { initializeAuthListener } from './services/auth.service'

initializeAuthListener()
createApp(App).use(router).mount('#app')
