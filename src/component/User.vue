<template>
    <div>User page</div>
    <!-- <router-view></router-view> -->
    <router-link to="/user/test1">test1</router-link>
    <router-link to="/user/test2">test2</router-link>
    <router-view name="test1"></router-view>
    <router-view name="test2"></router-view>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
    
</style>