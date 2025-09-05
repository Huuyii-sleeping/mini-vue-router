<template>
  <div>
    <nav>
      <router-link :to="{ name: 'Home' }">home</router-link>
      <router-link to="/user">User</router-link>
      <router-link :to="{ name: 'Problem', params: { id: '123' } }">Problem</router-link>
      <router-link to="/admin">Admin</router-link>
      <router-link to="/login">Login</router-link>
      <router-link to="/about">about</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss"></style>