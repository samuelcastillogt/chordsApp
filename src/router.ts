import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './components/sideMenu.vue';
import CompareProgretion from './components/CompareProgretion.vue';
import LoginView from './components/LoginView.vue';
import { authState, waitForAuthReady } from './services/auth.service';

const routes = [
    { path: '/login', component: LoginView },
    { path: '/', component: HomeView, meta: { requiresAuth: true } },
    { path: '/compare', component: CompareProgretion, meta: { requiresAuth: true } },
];

export const router = createRouter({
    history: createWebHistory('/app/'),
    routes,
});

router.beforeEach(async (to) => {
    await waitForAuthReady();
    const isAuthenticated = Boolean(authState.currentUser.value);

    if (to.meta.requiresAuth && !isAuthenticated) {
        return '/login';
    }

    if (to.path === '/login' && isAuthenticated) {
        return '/';
    }

    return true;
});
