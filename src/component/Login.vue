<template>
    <div>
        账号：<input type="text" v-model="username"><br>
        密码：<input type="password" v-model="password"><br>
        <button @click="login">登录</button>
    </div>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue'
const router = inject('router') as any
const username = ref()
const password = ref()
const login = () => {
    if(username.value === 'admin' && password.value === '111'){
        console.log('登陆成功')
        window.localStorage.setItem('isLogin', 'true')
        router.push('/admin')
    } else {
        console.log('账号或者密码错误 登录失败')
        window.localStorage.setItem('isLogin', 'false')
    }  
}
</script>

<style scoped lang="scss">
    
</style>