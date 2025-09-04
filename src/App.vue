<template>
  <div>
    <nav>
      <router-link :to="{ name: 'Home' }">home</router-link>
      <router-link to="/user">User</router-link>
      <router-link :to="{ name: 'Problem', params: { id: '123' } }">Problem</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss"></style>