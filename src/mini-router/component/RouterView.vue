<template>
    <component :is="matchedComponent" v-if="matchedComponent"></component>
    <div v-else>404 Not Found</div>
</template>

<script setup lang="ts">
import { inject, computed, defineAsyncComponent } from 'vue'
import { isFunction } from '../utils'
const router = inject('router') as any
const currentRoute = inject('currentRoute') as any

const matchedComponent = computed(() => {
    const match = router.match(currentRoute.current)
    const component = match.matched?.component
    if(isFunction(component)){
        return defineAsyncComponent(component) // 这个函数能够自动的处理异步组件
        /**
         *  工厂函数， 用来包装一个异步组件的函数，返回能够component识别的异步组件
         *  内部的逻辑：
         *      1.接收一个加载模块，loading 必须返回的是promise
         *      2.返回一个特殊的组件（包装之后的组件），不是普通的组件而是一个代理组件 setup当中
         *          执行loader函数，返回对应的数据（promise改变对应的状态），再次进行渲染
         *      3.这个设计就是为了component设计的，自动姐可以解析
         */
    }
    return component
})
</script>

<style scoped lang="scss">
    
</style>