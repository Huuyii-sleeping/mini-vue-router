import { createRouter } from "@/mini-router/createRouter";
import Home from "@/component/Home.vue";
import User from "@/component/User.vue"
import Problem from "@/component/Problem.vue";
import Test1 from "@/component/test1.vue";
import Test2 from "@/component/test2.vue";
import Admin from "@/component/Admin.vue";
import Login from "@/component/Login.vue";
import About from "@/component/about.vue";
import Meta from "@/component/Meta.vue";

export const router = createRouter({
    history: 'history',
    routes: [
        { path: '/', component: Home, name: 'Home'},
        { path: '/user', component: User, name: 'User', children: [
            {
                path: '/test1',
                component: Test1,
                name: 'test1'
            },
            {
                path: '/test2',
                component: Test2,
                name: 'test2'
            }
        ]},
        { path: '/problem/:id', component: Problem, name: 'Problem'},
        { path: '/admin', component: Admin, name: 'Admin' },
        { path: '/login', component: Login, name: 'Login'},
        { path: '/about', component: About},
        { path: '/meta', component: Meta, meta: { auth: true, title: '管理员界面' }}
    ],
    debug: true // 开启日志
})


