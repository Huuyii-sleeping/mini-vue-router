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

// router.beforeEach(() => {
//     throw new Error('出错了')
// })

router.afterEach((from, to) => {
    console.log(`导航完成：${from} - ${to}`)
})

router.onError((err) => {
    throw new Error('导航出错:', err)
})

createApp(App).use(router).mount('#app')
