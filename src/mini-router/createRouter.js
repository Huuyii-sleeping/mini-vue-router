import { reactive, readonly } from 'vue'
import RouterLink from './component/RouterLink.vue';
import RouterView from './component/RouterView.vue';
import { createMatcher } from './createMatcher';
import { isObject } from './utils';

export function createRouter(options) {
    const { routes, history = 'hash' } = options;

    const matcher = createMatcher(routes)
    console.log("matcher:",matcher)

    const nameMap = new Map()
    // 将所有正确的的路由进行映射
    routes.forEach(route => {
        if (!route.name) return
        nameMap.set(route.name, route)
    })
    console.log("nameMap:",nameMap)

    const state = reactive({
        current: '/'
    })

    if (history === 'hash') {
        // 初始化 默认hash模式
        function init() {

            // 获取当前的路径
            const hash = window.location.hash.slice(1) || '/'

            // 设置到响应体的当中
            state.current = hash

            // 监听hash的变化事件
            window.addEventListener('hashchange', () => {
                state.current = window.location.hash.slice(1) || '/'
            })
        }

        // 创建匹配器
        const matcher = createMatcher(routes)

        function push(to) {
            if (isObject(to)) {
                const { name } = to
                const route = nameMap.get(name)
                console.log(route)
                state.current = route.path
                window.location.hash = route.path
            } else {
                state.current = to
                window.location.hash = to // 这里记得是hash模式
            }

        }

        // 返回的实例对象
        const router = {
            current: readonly(state),
            push,
            install(app) {
                app.component('RouterLink', RouterLink)
                app.component('RouterView', RouterView)

                app.config.globalProperties.$router = router
                app.provide('router', router)
                app.provide('currentRoute', state)
            },
            match(to) {
                return matcher.match(to)
            }
        }

        // 进行初始化， 实现监听作用 还有路径的绑定
        init()

        return router

    } else if (history === 'history') {
        
        function init() {
            const history = window.location.pathname.slice(1) || '/'
            state.current = history

            window.addEventListener('popstate', () => {
                state.current = window.location.pathname.slice(1) || '/'
            })
        }

        function push(to) {
            if (isObject(to)) {
                // 命名的形式进行路由的跳转
                const { name, params } = to
                const route = nameMap.get(name)
                let path = route.path
                // 进行动态参数的替换
                if(params){
                    const newArr = path.split('/')
                    for (const key in params) {
                        const param = params[key]
                        newArr.forEach((content, index) => {
                            if(content.includes(key)){
                                console.log("路由成功匹配")
                                newArr[index] = param
                            }
                        })
                    }
                    path = newArr.join('/')
                }
            
                state.current = path
                window.history.pushState(null, '', path)
            } else {
                state.current = to
                window.history.pushState(null, '', to)
            }

        }

        const router = {
            current: state.current,
            push,
            install(app) {
                app.component('RouterLink', RouterLink)
                app.component('RouterView', RouterView)

                app.config.globalProperties.$router = router
                app.provide('router', router)
                app.provide('currentRoute', state)
            },
            match(to) {
                return matcher.match(to)
            }
        }

        init()
        return router
    }
}
