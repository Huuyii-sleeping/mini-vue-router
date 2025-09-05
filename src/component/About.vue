<template>
    <div>about界面</div>
    <div>{{ about }}</div>
</template>

<script setup lang="ts">
import { ref, defineExpose } from 'vue'
const about = ref('')

function beforeRouteEnter(to, from, next){
    console.log('beforeRouterEnter调用')
    setTimeout(() => {
        next(vm => {
            vm.about.value = 'hello'
        })
    },1000)
}

function beforeRouteLeave(to, from, next){
    console.log('beforeRouteLeave 调用')
    next()
}

defineExpose({
  beforeRouteEnter,
  beforeRouteLeave
})
</script>

<style scoped lang="scss">
    
</style>