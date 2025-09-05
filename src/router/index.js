import { createRouter } from "@/mini-router/createRouter";
import Home from "@/component/Home.vue";
import User from "@/component/User.vue"
import Problem from "@/component/Problem.vue";
import Test1 from "@/component/test1.vue";
import Test2 from "@/component/test2.vue";
import Admin from "@/component/Admin.vue";
import Login from "@/component/Login.vue";

export const router = createRouter({
    history: 'history',
    routes: [
        { path: '/', component: Home, name: 'Home'},
        { path: '/user', component: User, name: 'User', children: [
            {
                path: '/test1',
                component: Test1,
            },
            {
                path: '/test2',
                component: Test2,
            }
        ]},
        { path: '/problem/:id', component: Problem, name: 'Problem'},
        { path: '/admin', component: Admin, name: 'Admin' },
        { path: '/login', component: Login, name: 'Login'},
        { path: '/about', component: () => import('../component/about.vue')}
    ],
    
})


