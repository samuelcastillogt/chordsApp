import { createMemoryHistory, createRouter } from 'vue-router'
import HomeView from './components/sideMenu.vue'
import CompareProgretion from './components/CompareProgretion.vue'

const routes = [
    { path: '/', component: HomeView },
    { path: '/compare', component: CompareProgretion }
]

export const router = createRouter({
    history: createMemoryHistory(),
    routes,
})