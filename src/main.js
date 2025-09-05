import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'

router.beforeEach((to, from, next) => {
    const isLogin = localStorage.getItem('isLogin') === 'true'
    if(to.startsWith('/admin') && !isLogin){
        next('/login')
    } else {
        next()
    }
})

createApp(App).use(router).mount('#app')
