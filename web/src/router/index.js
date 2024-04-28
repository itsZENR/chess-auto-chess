import {createRouter, createWebHistory} from 'vue-router'
import TheMain from '../views/TheMain.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: TheMain,
        meta: {
            layout: 'BaseLayout',
        },
    },
    {
        path: '/game',
        name: 'game',
        component: () => import(/* webpackChunkName: "about" */ '../views/TheGame.vue'),
        meta: {
            layout: 'BaseLayout',
        },
    },
    {
        path: '/login',
        name: 'login',
        component: () =>
            import(/* webpackChunkName: 'Login' */ '@/views/TheLogin.vue'),
        meta: {
            layout: 'LoginLayout',
        },
    },
    {
        path: '/registration',
        name: 'registration',
        component: () =>
            import(/* webpackChunkName: 'registration' */ '@/views/TheRegistration.vue'),
        meta: {
            layout: 'LoginLayout',
        },
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
