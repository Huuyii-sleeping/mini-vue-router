import { reactive, readonly } from 'vue'
import RouterLink from './component/RouterLink.vue';
import RouterView from './component/RouterView.vue';
import { createMatcher } from './createMatcher';
import { isObject, isString } from './utils';

export function createRouter(options) {
    const { routes, history = 'hash' } = options;

    const matcher = createMatcher(routes)

    const nameMap = new Map()
    routes.forEach(route => {
        if (!route.name) return
        nameMap.set(route.name, route)
    })

    const state = reactive({
        current: '/'
    })

    // 路由守卫的注册
    const beforeHooks = []
    const afterHooks = []
    // 守卫链式执行， 支持多个守卫
    function runBeforeHooks(to, from, next) {
        let index = 0

        const runNext = (pathOrBool) => {
            // 如果传入字符串（重定向）或者 false（取消）直接结束
            if (isString(pathOrBool)){
                return next(pathOrBool)
            } else if(pathOrBool === false) {
                return next(false)
            }

            // 所有的守卫执行完毕
            if(index >= beforeHooks.length){
                return next()
            }

            // 执行当前的守卫
            const hook = beforeHooks[index]
            index ++
            hook(to, from, runNext)
        }
        // 开始执行
        runNext()
    }

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
                // 进行动态参数的替换 将id等动态参数进行替换操作
                if (params) {
                    const newArr = path.split('/')
                    for (const key in params) {
                        const param = params[key]
                        newArr.forEach((content, index) => {
                            if (content.includes(key)) {
                                console.log("路由成功匹配")
                                newArr[index] = param
                            }
                        })
                    }
                    path = newArr.join('/')
                }
                to = path
            }
            
            // 执行对应的守卫函数
            const from = state.current
            runBeforeHooks(to, from, (result) => {
                finalizeNavigation(to, from, result)
            })

        }

        function finalizeNavigation(to, from, result){
            // 进行重定向操作
            if(isString(result)){
                state.current = result
                window.history.pushState(null, '', result)
                // render() // 手动触发渲染
                /** 
                 *  我的代码当中已经对state.current进行监听
                 *  在router-view当中
                 *  所以不需要再次手动的触发渲染函数
                 */
            } else if(result === false){
                // 取消跳转
                console.log('跳转取消')
            } else {
                // 正常放行
                state.current = to
                window.history.pushState(null, '', to)
                // render()
            }

            afterHooks.forEach(hook => {
                try {
                    hook(to, from)
                } catch (err) {
                    console.log('afterEach hook Error:', err)
                }
            })

        }

        const router = {
            current: readonly(state.current),
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
            },
            beforeEach(fn) {
                beforeHooks.push(fn)
            },
            afterEach(fn){
                afterHooks.push(fn)
            }
        }

        init()
        return router
    }
}
