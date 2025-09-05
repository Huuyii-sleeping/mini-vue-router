<template>
    <component :is="currentComponent" ref="comRef" v-if="currentComponent"></component>
    <div v-else>404 Not Found</div>
</template>

<script setup lang="ts">
import { inject, ref, nextTick, defineAsyncComponent, watch } from 'vue'
import { isFunction } from '../utils'
const router = inject('router') as any
const currentRoute = inject('currentRoute') as any
const props = defineProps({
    name: {
        type: String
    }
})
console.log(props.name)

// const matchedComponent = computed(() => {
//     const match = router.match(currentRoute.current)
//     const component = match.matched?.component
//     if(isFunction(component)){
//         return defineAsyncComponent(component) // 这个函数能够自动的处理异步组件
//         /**
//          *  工厂函数， 用来包装一个异步组件的函数，返回能够component识别的异步组件
//          *  内部的逻辑：
//          *      1.接收一个加载模块，loading 必须返回的是promise
//          *      2.返回一个特殊的组件（包装之后的组件），不是普通的组件而是一个代理组件 setup当中
//          *          执行loader函数，返回对应的数据（promise改变对应的状态），再次进行渲染
//          *      3.这个设计就是为了component设计的，自动姐可以解析
//          */
//     }
//     return component
// })

// 需要对代码进行重构，组件的实例对象没有拿到 以及和 组件实际重复
const comRef = ref() // 用来访问的组件实例对象
const currentComponent = ref<any>(null) // 当前要进行渲染的组件
const lastInstance = ref()
// 监听路由的变化
if(props.name){
    currentComponent.value = router.matchName(props.name)
}
watch(() => currentRoute.current, async (to, from) => {
    const match = router.match(to)
    console.log(match)
    let Component = match.matched?.component
    // 没有匹配到组件实例直接进行返回
    if (!Component) { 
        currentComponent.value = null
        return
    }

    // 执行离开守卫，lastInstance上一个页面
    if (lastInstance.value && isFunction(lastInstance.value.beforeRouteEnter)) {
        // 创建promise等待用户确认
        const canLeave = await new Promise<boolean>(resolve => {
            // 调用上一个组件的beforeRouteLeave
            lastInstance.value.beforeRouteLeave(to, from, (result: any) => {
                // 用户调用next（）| next（false）
                resolve(result !== false)
            })
        })
        if (!canLeave) return
    }

    // 处理懒加载（异步组件）
    if (isFunction(Component)) {
        const loader = Component // 保存加载函数
        const loaded = await loader() // 执行异步
        const realComponent = loaded.default // 获取真实的组件 default
        
        // 如果有进入守卫
        if(isFunction(realComponent.beforeRouteEnter)){
            // 调用守卫函数
            realComponent.beforeRouteEnter(to, from, (vmCallback) => {
                nextTick(() => {
                    // 等待组件渲染完成 
                    if(comRef.value){ 
                        // 进行数据的渲染
                        vmCallback(comRef.value)
                    }
                })
            })
        }
        // defineAsyncComponent支持懒加载
        currentComponent.value = defineAsyncComponent(loader)
    } else {
        // 同步组件
        currentComponent.value = Component
        nextTick(() => {
            // 组件渲染之后 检查是否进入守卫
            if(comRef.value && isFunction(comRef.value.beforeRouteEnter)){
                comRef.value.beforeRouteEnter(to, from, (vmCallback) => {
                    // 传入组件实例进行操作
                    vmCallback(comRef.value)
                })
            }
        })
        // 保存当前的组件实例,下次使用
        nextTick(() => {
            lastInstance.value = comRef.value
        })
    }
})

</script>

<style scoped lang="scss"></style>